#!/usr/bin/env node
/**
 * Verifies the Expo Router screen inventory:
 *  1. app/ contains exactly the 30 required screens (layouts excluded), no more, no fewer;
 *  2. every screen file has a default export;
 *  3. every route literal used for navigation in app/ and src/ points at an existing screen.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(import.meta.url), '..', '..');
const appDir = join(root, 'app');

const EXPECTED = [
  [1, 'Onboarding', '/'],
  [2, 'Welcome', '/welcome'],
  [3, 'Login', '/login'],
  [4, 'Register', '/register'],
  [5, 'Forgot Password', '/forgot-password'],
  [6, 'Home', '/home'],
  [7, 'Search', '/search'],
  [8, 'Search Results', '/search-results'],
  [9, 'Filters', '/filters'],
  [10, 'Categories', '/categories'],
  [11, 'Coffee Detail', '/coffee/[id]'],
  [12, 'Customize Coffee', '/customize/[id]'],
  [13, 'Favorites', '/favorites'],
  [14, 'Cart', '/cart'],
  [15, 'Order', '/order'],
  [16, 'Delivery Method', '/delivery-method'],
  [17, 'My Addresses', '/addresses'],
  [18, 'Add Address', '/addresses/new'],
  [19, 'Edit Address', '/addresses/[id]'],
  [20, 'Pickup Stores', '/pickup-stores'],
  [21, 'Promo Codes', '/promo-codes'],
  [22, 'Payment Methods', '/payment-methods'],
  [23, 'Order Confirmation', '/order-confirmation'],
  [24, 'Order Success', '/order-success'],
  [25, 'Delivery Tracking', '/tracking/[id]'],
  [26, 'Order History', '/orders'],
  [27, 'Order Details', '/orders/[id]'],
  [28, 'Notifications', '/notifications'],
  [29, 'Profile', '/profile'],
  [30, 'Settings', '/settings'],
];

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const toRoute = (file) => {
  const rel = relative(appDir, file).split(sep).join('/').replace(/\.tsx?$/, '');
  const parts = rel.split('/').filter((s) => !/^\(.*\)$/.test(s));
  if (parts.at(-1) === 'index') parts.pop();
  return '/' + parts.join('/');
};

let failed = false;
const fail = (msg) => {
  failed = true;
  console.error('  ✗ ' + msg);
};

// 1. Screen inventory
const screenFiles = walk(appDir).filter((f) => /\.tsx?$/.test(f) && !/(^|[\\/])_/.test(relative(appDir, f)));
const found = new Map(screenFiles.map((f) => [toRoute(f), f]));
console.log(`Screens found in app/: ${found.size} (expected ${EXPECTED.length})`);
for (const [n, name, route] of EXPECTED) {
  const file = found.get(route);
  if (!file) {
    fail(`#${n} ${name}: no screen for route ${route}`);
    continue;
  }
  const src = readFileSync(file, 'utf8');
  if (!/export default function/.test(src)) fail(`#${n} ${name}: ${relative(root, file)} has no default export`);
  const lines = src.split('\n').length;
  console.log(`  ✓ ${String(n).padStart(2)} ${name.padEnd(19)} ${route.padEnd(20)} ${relative(root, file)} (${lines} lines)`);
}
const expectedRoutes = new Set(EXPECTED.map((e) => e[2]));
for (const [route, file] of found) {
  if (!expectedRoutes.has(route)) fail(`unexpected extra screen ${route} (${relative(root, file)})`);
}
if (found.size !== EXPECTED.length) fail(`screen count is ${found.size}, must be exactly ${EXPECTED.length}`);

// 2. Navigation targets
const routePatterns = [...expectedRoutes].map((r) => new RegExp('^' + r.replace(/\[[^\]]+\]/g, '[^/]+') + '$'));
const sources = [...walk(appDir), ...walk(join(root, 'src'))].filter((f) => /\.tsx?$/.test(f));
const literal = /['"`](\/[a-z0-9\-/[\]]*)['"`]/g;
let checked = 0;
for (const file of sources) {
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(literal)) {
    const target = m[1];
    checked++;
    if (!expectedRoutes.has(target) && !routePatterns.some((re) => re.test(target))) {
      fail(`${relative(root, file)}: navigation target "${target}" does not match any screen`);
    }
  }
}
console.log(`Navigation targets checked: ${checked}`);

if (failed) {
  console.error('\nScreen check FAILED');
  process.exit(1);
}
console.log('\nScreen check passed: exactly 30 screens, all with routes and default exports, all navigation targets valid.');
