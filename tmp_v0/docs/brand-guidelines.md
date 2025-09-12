# CouncilWorks Brand Guidelines

These guidelines establish the CouncilWorks product identity across light and dark themes. All examples use Australian English, DD/MM/YYYY date formats, 24-hour time, and metric units.

---

## Colour System

- **Raw Palette (Tokens)**: Canonical colours defined as CSS custom properties.
- **Functional Tokens**: Semantic mapping consumed by Tailwind and shadcn/ui.

### Raw Palette
- **Saffron**: #FF5C46 - Accent colour for highlights and warnings
- **White**: #FFFFFF - Pure white for backgrounds
- **Tea**: #DFFFDE - Light green tint for muted elements
- **Nocturn**: #013B3A - Deep teal for dark backgrounds
- **Mint**: #B3FFC6 - Light success colour
- **Spring**: #88F8AE - Success colour
- **Jade**: #43D49C - Primary brand colour
- **Cedar**: #00A68A - Info colour
- **Spruce**: #007978 - Secondary colour
- **Lake**: #004963 - Danger/error colour

### Complementary Greys
- **Pearl**: #F8F9FA - Light card background
- **Mist**: #E9ECEF - Subtle borders and dividers
- **Slate**: #6C757D - Muted text
- **Charcoal**: #343A40 - Dark text

---

## Role Mapping

- **Primary → Jade (#43D49C)** — Main brand identity colour
- **Secondary → Spruce (#007978)** — Secondary actions, neutral emphasis
- **Accent → Saffron (#FF5C46)** — Highlights, callouts, warnings
- **Success → Spring (#88F8AE)** — Positive states
- **Success Light → Mint (#B3FFC6)** — Subtle success backgrounds
- **Info → Cedar (#00A68A)** — Informational content
- **Danger → Lake (#004963)** — Errors and critical states
- **Warning → Saffron** — Cautionary alerts
- **Neutral → Tea/Pearl** — Muted surfaces and containers

---

## Gradient Tokens

### Primary Gradients
- **Jade Flow**: Linear gradient from Jade to Cedar
- **Ocean Depth**: Linear gradient from Spruce to Lake
- **Success Glow**: Linear gradient from Spring to Mint
- **Sunset Alert**: Linear gradient from Saffron to warning variants

### Usage
- Use gradients sparingly for hero sections and key CTAs
- Prefer solid colours for most UI elements
- Ensure sufficient contrast for text over gradients

---

## Accessibility

- Aim for WCAG 2.1 AA minimum contrast
- Test both light and dark theme combinations
- Avoid using colour alone to convey information
- Provide alternative indicators for colour-blind users

---

## Implementation

All colours are defined as CSS custom properties and mapped to Tailwind utilities for consistent usage across the application.
\`\`\`

```css file="" isHidden
