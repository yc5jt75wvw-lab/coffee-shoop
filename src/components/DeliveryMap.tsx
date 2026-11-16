import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { G, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';

import { colors, fonts, shadow } from '../theme';
import { Icon } from './Icon';

/** Schematic street map (demo). Coordinates are in a 375×520 viewBox. */
const VB = { w: 375, h: 520 };
const H_STREETS = [60, 150, 232, 330, 430];
const V_STREETS = [40, 128, 210, 290, 350];

/** Courier route: from the café (start) to the customer (end). */
const ROUTE: [number, number][] = [
  [290, 410],
  [290, 150],
  [128, 150],
  [128, 232],
  [70, 232],
];

const LABELS: { x: number; y: number; text: string; rotate?: number }[] = [
  { x: 300, y: 300, text: 'Тверская ул.', rotate: 90 },
  { x: 138, y: 300, text: 'М. Дмитровка', rotate: 90 },
  { x: 222, y: 140, text: 'Страстной б-р' },
  { x: 150, y: 322, text: 'Садовая ул.' },
  { x: 216, y: 52, text: 'Пушкинская пл.' },
  { x: 50, y: 422, text: 'Петровка', rotate: 0 },
  { x: 360, y: 205, text: 'Каретный пер.', rotate: 90 },
];

function routeLength(points: [number, number][]) {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += Math.hypot(points[i]![0] - points[i - 1]![0], points[i]![1] - points[i - 1]![1]);
  }
  return len;
}

/** Point at 0..1 along the route, plus the remaining path from there. */
function pointAt(points: [number, number][], t: number) {
  const total = routeLength(points);
  let target = Math.min(Math.max(t, 0), 1) * total;
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1]!;
    const [x2, y2] = points[i]!;
    const seg = Math.hypot(x2 - x1, y2 - y1);
    if (target <= seg) {
      const k = seg ? target / seg : 0;
      const p: [number, number] = [x1 + (x2 - x1) * k, y1 + (y2 - y1) * k];
      return { point: p, remaining: [p, ...points.slice(i)] as [number, number][] };
    }
    target -= seg;
  }
  const last = points[points.length - 1]!;
  return { point: last, remaining: [last] as [number, number][] };
}

export function DeliveryMap({ progress, focused }: { progress: number; focused: boolean }) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const { point, remaining } = useMemo(() => pointAt(ROUTE, progress), [progress]);
  const dest = ROUTE[ROUTE.length - 1]!;

  // Visible box: whole map, or zoomed around the courier.
  const box = focused
    ? { x: point[0] - 110, y: point[1] - 150, w: 220, h: 300 }
    : { x: 0, y: 0, w: VB.w, h: VB.h };

  // Map viewBox coordinates to screen pixels (preserveAspectRatio = slice).
  const scale = size.w && size.h ? Math.max(size.w / box.w, size.h / box.h) : 1;
  const offX = (size.w - box.w * scale) / 2;
  const offY = (size.h - box.h * scale) / 2;
  const toScreen = ([x, y]: [number, number]) => ({ left: (x - box.x) * scale + offX, top: (y - box.y) * scale + offY });

  const onLayout = (e: LayoutChangeEvent) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  const pts = (p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(' ');
  const courier = toScreen(point);
  const pin = toScreen(dest);

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout} accessible accessibilityLabel="Схема маршрута курьера">
      <Svg width="100%" height="100%" viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} preserveAspectRatio="xMidYMid slice">
        <Rect x={-200} y={-200} width={VB.w + 400} height={VB.h + 400} fill="#F3F3F3" />
        <Rect x={140} y={244} width={58} height={74} rx={6} fill="#E4EEE2" />
        <G>
          {H_STREETS.map((y) => (
            <Line key={`ho${y}`} x1={-200} y1={y} x2={VB.w + 200} y2={y} stroke="#E0E0E0" strokeWidth={14} />
          ))}
          {V_STREETS.map((x) => (
            <Line key={`vo${x}`} x1={x} y1={-200} x2={x} y2={VB.h + 200} stroke="#E0E0E0" strokeWidth={14} />
          ))}
          <Line x1={200} y1={-40} x2={420} y2={110} stroke="#E0E0E0" strokeWidth={12} />
          {H_STREETS.map((y) => (
            <Line key={`h${y}`} x1={-200} y1={y} x2={VB.w + 200} y2={y} stroke="#FFFFFF" strokeWidth={11} />
          ))}
          {V_STREETS.map((x) => (
            <Line key={`v${x}`} x1={x} y1={-200} x2={x} y2={VB.h + 200} stroke="#FFFFFF" strokeWidth={11} />
          ))}
          <Line x1={200} y1={-40} x2={420} y2={110} stroke="#FFFFFF" strokeWidth={9} />
        </G>
        {LABELS.map((l) => (
          <SvgText
            key={l.text}
            x={l.x}
            y={l.y}
            fontSize={8}
            fill="#9A9A9A"
            fontFamily={fonts.medium}
            transform={l.rotate ? `rotate(${l.rotate} ${l.x} ${l.y})` : undefined}
          >
            {l.text}
          </SvgText>
        ))}
        <Polyline points={pts(ROUTE)} fill="none" stroke="#E9C9B4" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
        <Polyline points={pts(remaining)} fill="none" stroke={colors.primary} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      </Svg>

      {size.w ? (
        <>
          <View pointerEvents="none" style={[styles.pin, { left: pin.left - 16, top: pin.top - 30 }]}>
            <Icon name="location" size={32} color={colors.primary} />
          </View>
          <View pointerEvents="none" style={[styles.courier, { left: courier.left - 20, top: courier.top - 20 }]}>
            <Icon name="bicycle" size={20} color={colors.primary} />
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pin: { position: 'absolute', width: 32, height: 32, alignItems: 'center' },
  courier: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow(2),
  },
});
