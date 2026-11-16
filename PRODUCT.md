# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

One shared brand design runs on iOS and Android through Expo Go. Native behaviour adapts per OS: safe-area insets, system Back on Android, edge-swipe back on iOS, platform haptics.

## Stack

React Native + Expo (SDK 58) + TypeScript, Expo Router (file-based routes), AsyncStorage for persistence. Must run in Expo Go, so no libraries that need a custom native build. Pinned by the client.

## Users

People ordering coffee from a single coffee shop on their phone: browsing drinks, customising them, then getting them delivered or picking them up. The client uses the app as a demonstration of a complete ordering flow.

## Product Purpose

A complete, demonstrable coffee-ordering app with exactly 30 working screens: onboarding and demo auth, catalogue and search, product detail and customisation, favourites, cart, checkout (delivery or pickup, addresses, promo codes, payment method), order tracking, order history, notifications, profile and settings. Success means every screen is reachable, every transition works, and state survives an app restart.

## Capabilities and Constraints

- Exactly 30 separate screens, each with its own Expo Router route. No placeholder screens.
- Cart, favourites, settings, addresses and demo order history persist through AsyncStorage.
- Auth, payment and delivery are demo-only, with no backend. The app never asks for real bank-card data.
- UI language: Russian (client decision). README is in Russian.
- No brand name: the shop is called simply «Кофейня» (client decision).
- Prices are shown in US dollars, as in the source Figma.

## Brand Commitments

Five source screens from the client's Figma (Onboarding, Home, Detail Item, Order, Delivery) must be reproduced as closely as possible. The other 25 screens extend the same palette, type, components and spacing. Sora, the Figma face, has no Cyrillic, so Russian text is set in Manrope and Sora is kept for prices and numerals.

## Evidence on Hand

- Product and store photography: Unsplash photos bundled in `assets/images/` (Unsplash License, credits in README).
- All menu items, stores, promo codes, couriers, notifications and past orders are demo data and are labelled as demo where a user could mistake them for real.

## Product Principles

1. Every control does something real within the demo; nothing is decorative.
2. The Figma screens are the source of truth; new screens read as if they came from the same file.
3. Demo honesty: never imply real payment, real delivery or a real account.
