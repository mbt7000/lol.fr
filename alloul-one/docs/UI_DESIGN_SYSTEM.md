# UI Design System — Alloul One (Reference Style)

Visual direction based on your references:
- Dark futuristic base
- Glassmorphism cards
- Neon cyan/purple accents
- Soft gradients + glow
- Dense, modular dashboard layout

## Tokens
- Background: `#060B18`
- Surface: `#0B1328`
- Border: `#1D2A4A`
- Accent Purple: `#8B5CF6`
- Accent Cyan: `#22D3EE`

## Components in M1
- Glass Card
- Neon Border Container
- Stats Tile
- AI Core Spotlight card
- Sidebar + top status chip (next commit)

## Accessibility
- Keep contrast AA+ for text on dark surfaces
- Do not rely on glow alone for states
- Keyboard focus ring visible on all actions

## Localization (required now)
Enabled locales for UI skeleton:
- Arabic (`ar`) — RTL
- English (`en`) — LTR
- Chinese (`zh`) — LTR
- Korean (`ko`) — LTR

Translation files to add in next step:
- `apps/web/messages/ar.json`
- `apps/web/messages/en.json`
- `apps/web/messages/zh.json`
- `apps/web/messages/ko.json`
