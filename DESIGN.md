---
name: Кофейня
description: A warm, quiet coffee-ordering app where the photography carries the mood and the chrome stays out of the way.
colors:
  primary: "#C67C4E"
  primary-pressed: "#AE6A3F"
  primary-soft: "#F9F2ED"
  primary-border: "#E9C9B4"
  ink: "#242424"
  ink-strong: "#111111"
  dark: "#313131"
  dark-field: "#2A2A2A"
  text-secondary: "#717171"
  text-muted: "#9B9B9B"
  on-dark-secondary: "#B7B7B7"
  on-dark-muted: "#A2A2A2"
  background: "#F9F9F9"
  surface: "#FFFFFF"
  surface-alt: "#F3F3F3"
  control-grey: "#EDEDED"
  border: "#EAEAEA"
  border-strong: "#DEDEDE"
  success: "#36C07E"
  success-soft: "#E7F7EF"
  danger: "#ED5151"
  danger-soft: "#FDECEC"
  warning: "#E5A23C"
  star: "#FBBE21"
  overlay: "rgba(17,17,17,0.45)"
typography:
  display:
    fontFamily: "Manrope_600SemiBold"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: "42px"
    letterSpacing: "-0.3px"
  title:
    fontFamily: "Manrope_600SemiBold"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
  headline:
    fontFamily: "Manrope_600SemiBold"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "26px"
  section:
    fontFamily: "Manrope_600SemiBold"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  body:
    fontFamily: "Manrope_400Regular"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "21px"
  body-medium:
    fontFamily: "Manrope_500Medium"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "21px"
  body-strong:
    fontFamily: "Manrope_600SemiBold"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "21px"
  caption:
    fontFamily: "Manrope_400Regular"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "17px"
  caption-strong:
    fontFamily: "Manrope_600SemiBold"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "17px"
  micro:
    fontFamily: "Manrope_500Medium"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: "14px"
  price-l:
    fontFamily: "Sora_600SemiBold"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "24px"
  price-m:
    fontFamily: "Sora_600SemiBold"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "22px"
  price-s:
    fontFamily: "Sora_600SemiBold"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  number:
    fontFamily: "Sora_600SemiBold"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "22px"
rounded:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "999px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  gutter: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.section}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "56px"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.section}"
    rounded: "{rounded.lg}"
    height: "56px"
  button-secondary-pressed:
    backgroundColor: "{colors.primary-soft}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.section}"
    rounded: "{rounded.lg}"
  button-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
    rounded: "{rounded.lg}"
  button-sm:
    typography: "{typography.caption-strong}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  icon-button-add:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    size: "32px"
  icon-button-filter:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    size: "52px"
  chip:
    backgroundColor: "{colors.control-grey}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "36px"
  chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.body-strong}"
  segmented:
    backgroundColor: "{colors.control-grey}"
    rounded: "{rounded.md}"
    padding: "4px"
    height: "48px"
  segmented-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.section}"
    rounded: "{rounded.sm}"
  size-option:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "44px"
  size-option-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
  text-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "52px"
  search-field-dark:
    backgroundColor: "{colors.dark-field}"
    textColor: "{colors.on-dark-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "52px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "16px"
  coffee-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "8px"
  pill-brand:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  info-note:
    backgroundColor: "{colors.primary-soft}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: "12px"
  bottom-bar:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "16px 24px"
  tab-bar:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "16px 0 12px"
  toast:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.surface}"
    typography: "{typography.body-medium}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  progress-segment:
    backgroundColor: "{colors.success}"
    height: "4px"
---

# Design System: Кофейня

## Overview

**Creative North Star: "The Roasted Caramel Counter"**

A calm café counter on a phone: an off-white ground, white cards set down like saucers, a near-black band overhead where the shop's name would hang, and one roasted-caramel accent that marks every action you can take. The coffee photography is the only loud thing on the screen; the chrome is quiet so the drink reads first. The world was pinned by the client's five Figma screens (Onboarding, Home, Detail, Order, Delivery), and every other screen extends that file's cards, chips, segmented control and bottom bar rather than inventing new forms.

Density is comfortable, mobile-native and single-column, with a 24px gutter on every screen and a two-column photo grid as the only multi-column layout. Depth comes from soft, low ambient shadows on floating things (cards, sheets, tab bar, toast) and from the dark-to-light zone change on Home, where the promo banner overlaps both zones.

The system rejects the generic white e-commerce grid with a coloured nav bar on top: there is no tinted app bar, no second accent, no decorative ornament. Caramel means "act here" or "you are here"; everything else is grey, ink or white.

**Key Characteristics:**
- Off-white ground, white rounded surfaces, near-black gradient headers.
- One accent, roasted caramel, for primary actions, selection, progress and the route line.
- Manrope for all words; Sora only for prices and numerals.
- Soft rounded rectangles: 16 for cards and the main CTA, 12 for controls, 8 for chips and the add button.
- A single icon family: Ionicons outline (filled glyph for the active tab).
- Signature: the caramel route line on a drawn street map, paired with a four-segment progress bar.

## Colors

A warm-neutral palette: greys and near-blacks carry structure, one caramel brown carries every action.

### Primary
- **Roasted Caramel** (primary): primary buttons, the selected chip and segment, the Home filter button, the grid card "+" button, radio dots, checkboxes, switches, text cursor, focused field border, the active tab glyph and marker, section-title actions, list-row icons, and the remaining courier route.
- **Pressed Caramel** (primary-pressed): pressed state of the primary button only.
- **Steamed Milk Peach** (primary-soft): the selection fill behind a chosen size or option tile, icon wells in list rows and option tiles, info notes, brand pills, empty-state discs, thick dividers, and the pressed state of light/secondary buttons.
- **Latte Edge** (primary-border): the faded already-travelled route line, the border of the active-order card and unread notifications, and the toast action label on dark.

### Neutral
- **Espresso Ink** (ink): default text and icon colour on light surfaces.
- **Black Roast** (ink-strong) and **Charcoal Roast** (dark): the two stops of the dark header gradient; Charcoal Roast also fills the toast and colours prices on cards.
- **Dark Field** (dark-field): the search field inside the dark Home header.
- **Ash Text** (text-secondary): subtitles, captions, helper text.
- **Pale Ash** (text-muted): placeholders, chevrons and leading field icons. Not for reading text.
- **On-Dark Secondary** (on-dark-secondary) and **On-Dark Muted** (on-dark-muted): secondary text on the onboarding photo and the dark header; On-Dark Muted is also the inactive tab glyph.
- **Café Ground** (background): the screen ground everywhere except onboarding and tracking.
- **Saucer White** (surface): cards, fields, sheets, bottom bar, tab bar.
- **Counter Grey** (surface-alt): image placeholders, soft icon buttons, the tracking map ground, neutral pills.
- **Control Grey** (control-grey): unselected chip and segmented-control track.
- **Hairline** (border) and **Firm Hairline** (border-strong): card and field borders; Firm Hairline outlines size tiles, option tiles, steppers, radios, checkboxes, outline icon buttons and the switch track.

### Status
- **Done Green** (success / success-soft): completed progress segments and success pills.
- **Alert Red** (danger / danger-soft): errors, destructive rows, the danger button, the promo "Акция" tag, favourite heart, and badges on icon buttons.
- **Amber** (warning) and **Star Gold** (star): warnings and rating stars.
- **Scrim** (overlay): the rating badge on photos and modal scrims.

### Named Rules
**The One Caramel Rule.** Caramel is the only accent hue. It marks an action, a selection or progress; it never decorates a surface that does nothing.

**The Peach Selection Rule.** Chosen tiles (size, milk, syrup, delivery speed) take a peach fill plus a caramel border and caramel label, never a solid caramel fill. Solid caramel is reserved for chips, segments and buttons.

## Typography

**Body Font:** Manrope (400, 500, 600, 700), all words, all sizes.
**Numeral Font:** Sora (400, 600, 700), prices, totals and counters.

**Character:** Manrope is a soft, open grotesk with full Cyrillic, which the Russian UI requires; Sora, the Figma face, survives only where it has glyphs to render, giving prices a rounder, more geometric voice than the words around them.

### Hierarchy
- **Display** (600, 32/42, -0.3 tracking): onboarding headline, the promo banner line (set at 28/37 there), large confirmation statements.
- **Title** (600, 20/28): screen-level headings inside content and large avatar initials.
- **Headline** (600, 18/26): empty-state titles and sheet headings.
- **Section** (600, 16/24): header titles, section titles, card names, button labels, segment labels.
- **Body** (400, 14/21), **Body Medium** (500) and **Body Strong** (600): running text, chip labels, list-row titles, toast text.
- **Caption** (400, 12/17) and **Caption Strong** (600): subtitles, field labels, helper and error text, pills, small button labels.
- **Micro** (500, 10/14): badges and rating numbers on photos.
- **Price L / M / S** (Sora 600, 18/24, 16/22, 14/20): card prices, totals, summary values, option surcharges.

### Named Rules
**The Cyrillic Fallback Rule.** Any Sora-styled string that contains Cyrillic or «№» renders in Manrope Bold instead; AppText does this automatically. Never set Russian words in Sora by hand.

**The Capped Scale Rule.** Text honours system font scaling up to 1.3x, then stops, so cards and bars hold their shape.

## Layout

A single-column mobile layout on the Café Ground with a 24px horizontal gutter on every screen (16px inside the toast and cards). Spacing steps run 4, 8, 12, 16, 24, 32; vertical rhythm between blocks is mostly 16 and 24, with 32 of bottom scroll padding.

Home opens with a dark gradient band (location, avatar, search field plus filter button), then a 140px promo banner pulled up 68px so it bridges the dark and light zones; category chips scroll horizontally, then a two-column grid of photo cards. Detail-style screens use a 56px header with a back chevron, centred title and an optional right action. Actions that finish a flow live in a white bottom bar with a rounded top that respects the home indicator. Tracking is a full-bleed map with a white sheet (24px top radius, drag handle) pulled up over it.

Touch targets are at least 44pt; smaller visual controls (32px add button, 28px stepper buttons, small buttons) extend their hit area with hit slop. Safe-area insets are respected on every edge; the tab bar pads by the bottom inset, and the toast sits 96pt above it.

## Elevation & Depth

A hybrid: surfaces are mostly flat white on off-white, separated by 1px hairlines; anything that floats over content gets a soft, low, ambient shadow. Shadows are diffuse and dark-neutral, never hard or offset as a graphic device.

### Shadow Vocabulary
- **Rest lift** (iOS: `#1B1B1B`, opacity 0.06, radius 10, offset 0/4; Android elevation 2): photo cards, search-result rows, the active-order card, floating icon buttons over photos.
- **Float** (iOS: `#1B1B1B`, opacity 0.12, radius 18, offset 0/8; Android elevation 6): tab bar, bottom bar, tracking sheet, toast, courier marker on the map.

### Named Rules
**The Float-Only Shadow Rule.** Static content cards use a hairline border, not a shadow; shadow is for things that sit over other content (bars, sheets, toasts) and for the photo cards in the catalogue grid.

## Shapes

Soft rounded rectangles throughout, in three steps by role: 16 for containers (cards, the primary CTA, banners, bottom-bar top corners), 12 for controls (text and search fields, segmented track, size and option tiles, icon wells, filter and floating icon buttons, toast, images inside cards), 8 for small selectables (chips, segment thumbs, the grid "+" button, the promo tag). The tab bar and tracking sheet take 24 on their top corners. Pills, small buttons, stepper buttons and radios are full circles or capsules. The rating badge on photos is the one asymmetric shape: square-ish with a 12 top-right and 24 bottom-left corner, tucked into the image corner. Borders are 1px hairlines; radios and checkboxes use 1.5px.

## Components

### Buttons
Confident and quiet: one solid caramel slab per screen, everything else outlined or bare.
- **Shape:** gently rounded (16px) at large and medium sizes; capsule at small size.
- **Primary:** caramel fill, white Section label, 56px tall (48 medium, 32 small), 20px side padding, optional leading 18px icon.
- **Pressed:** darker caramel for primary; peach fill for secondary, ghost and light. Every press fires a light haptic tap.
- **Secondary:** white with a firm hairline and ink label. **Ghost:** no fill, caramel label. **Danger:** white, red label, pale-red border. **Light:** white fill, caramel label, for use on photos or dark.
- **Disabled:** 45% opacity; loading swaps the label for a spinner in the label colour.

### Icon Buttons
- **Plain** (circular, no fill) for header back/close; **Outline** (white, firm hairline, 12px); **Filled** (caramel, white glyph), as the 52px Home filter button and the 32px grid "+" button at 8px radius; **Floating** (white with rest lift) over photos; **Soft** (Counter Grey).
- Pressed drops to 70% opacity. Count badges are red 16px circles in the top-right corner.

### Chips
- **Style:** 36px tall, 8px radius, 12px side padding, Control Grey fill with an ink Body label.
- **Selected:** caramel fill, white Body Strong label, selection haptic.
- **White tone:** white fill with a hairline border, used for a navigation chip ("Все категории") at the end of a chip row.

### Segmented Control
Control Grey track, 48px tall, 12px radius, 4px inset; the active segment is a caramel thumb (8px radius) with a white SemiBold label, inactive labels are ink Regular. Used for delivery/pickup and similar binary choices.

### Selection Tiles
- **Size selector:** three equal 44px tiles, 12px radius, firm hairline on white; selected becomes peach fill, caramel border, caramel label.
- **Option box:** a wider radio tile (min 56px) with a 40px peach icon well, title and caption, optional Sora surcharge on the right and a radio dot; selection follows the Peach Selection Rule.
- **Radio / checkbox / switch:** caramel when on, firm hairline when off; checkbox 22px at 6px radius.
- **Quantity stepper:** circular outline buttons with an ink glyph around a Body Strong count; pressed fills peach.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** white on the Café Ground; pressed info cards tint to a warm near-white.
- **Shadow Strategy:** hairline border at rest for content cards; rest lift for catalogue photo cards (see Elevation & Depth).
- **Internal Padding:** 16px for content cards; 8px for photo cards, whose image sits at 12px radius inside.
- **Coffee card:** square-ish photo (1.1 aspect), rating badge on a scrim in the top-right corner, Section name, Caption subtitle, then a Sora price beside the caramel "+" button.

### Inputs / Fields
- **Style:** white, 1px hairline, 12px radius, min 52px tall, 14px side padding, optional leading 18px icon; Caption Strong label above, Caption helper below.
- **Focus:** border and leading icon turn caramel; caret and selection are caramel.
- **Error:** border and helper text turn Alert Red.
- **Dark variant:** the Home search field is Dark Field with no border, white glyph and On-Dark Muted placeholder.

### Navigation
- **Tab bar:** white, 24px top corners, float shadow, four icon-only tabs (24px). Inactive glyphs are outline in On-Dark Muted; the active tab swaps to the filled glyph in caramel with a short caramel marker (10x5) beneath it. Cart and notification counts appear as caramel badges with a white ring.
- **Header:** 56px, back chevron left, centred Section title, right slot; a light-on-dark variant exists for dark screens.
- **Bottom bar:** white, 16px top corners, float shadow, 24px gutter, padded by the safe area.

### Feedback
- **Toast:** Charcoal Roast snackbar, 12px radius, float shadow, check or alert icon, Body Medium white text, optional Latte Edge action. Fades and rises 16px in 220ms, out in 180ms; stays 2.4s (3.8s with an action) and is announced to screen readers.
- **Pills:** capsule, Caption Strong; brand (peach/caramel), success, danger and neutral tones, used for order status.
- **Info note:** peach panel, 12px radius, caramel icon with warm-brown caption.
- **Empty state:** an 88px peach disc (28px radius) with a 36px caramel icon, Headline title, Body text capped at 280px, optional action.

### Delivery Map and Progress (signature)
A drawn, schematic street grid in SVG: Counter Grey ground, white streets with grey casings, small grey street labels in Manrope Medium, one pale-green block. The courier's route is a 4px round-capped polyline: the stretch already travelled in Latte Edge, the remaining stretch in caramel. A caramel location pin marks the door; the courier is a white 40px disc with a caramel bicycle and float shadow. Beneath it, the tracking sheet carries the four-segment progress bar: 4px bars, 8px apart, 2px radius, grey when pending, Done Green when complete, caramel for a current step.

## Do's and Don'ts

### Do:
- **Do** take every colour, size, radius and spacing value from the theme tokens; new screens should read as if they came from the same Figma file.
- **Do** reuse the existing card, chip, segmented control, option tile, list row and bottom bar before designing a new control.
- **Do** keep the 24px gutter and the 16 / 12 / 8 radius split by role (container / control / small selectable).
- **Do** set prices and numerals in Sora through the price tokens, and let AppText fall back to Manrope for any Cyrillic or «№».
- **Do** use Ionicons outline glyphs only, switching to the filled glyph only for an active tab or a toggled state (favourite heart).
- **Do** give every control a 44pt hit area and a haptic on press or selection.
- **Do** mark progress with the caramel stroke and the Done Green segment, as on the tracking screen.

### Don't:
- **Don't** introduce a second accent hue or a coloured app bar; headers are either the near-black gradient or plain on the ground.
- **Don't** fill a selected tile with solid caramel; use the peach fill and caramel border.
- **Don't** set Russian text in Sora.
- **Don't** use Pale Ash (text-muted) for text that must be read; it is for placeholders, chevrons and passive icons.
- **Don't** add hard, offset or coloured shadows; depth is the two soft levels above.
- **Don't** mix in another icon family, emoji or text glyphs as icons.
