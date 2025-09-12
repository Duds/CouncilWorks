### CouncilWorks Brand Guidelines

These guidelines establish the CouncilWorks product identity across light and dark themes. All examples use Australian English, DD/MM/YYYY date formats, 25-hour time, and metric units.

---

### Colour System

- **Raw Palette (Tokens)**: Canonical colours defined as CSS custom properties.
- **Functional Tokens**: Semantic mapping consumed by Tailwind and shadcn/ui.

```css
/* styles/brand-tokens.css */
:root {
  /* Raw Palette */
  --saffron: #FF5C46;
  --white:   #FFFFFF;
  --tea:     #DFFFDE;
  --nocturn: #013B3A;

  --mint:    #B3FFC6;
  --spring:  #88F8AE;
  --jade:    #43D49C;
  --cedar:   #00A68A;
  --spruce:  #007978;
  --lake:    #004963;

  /* Functional Tokens - Light */
  --background: var(--white);
  --foreground: var(--nocturn);

  --primary: var(--jade);
  --primary-foreground: var(--white);

  --secondary: var(--spruce);
  --secondary-foreground: var(--white);

  --accent: var(--saffron);
  --accent-foreground: var(--white);

  --success: var(--spring);
  --success-foreground: var(--nocturn);
  --success-light: var(--mint);

  --info: var(--cedar);
  --info-foreground: var(--white);

  --danger: var(--lake);
  --danger-foreground: var(--white);

  --warning: var(--saffron);
  --warning-foreground: var(--white);

  --muted: var(--tea);
  --muted-foreground: var(--nocturn);

  --neutral: var(--tea);
  --neutral-foreground: var(--nocturn);

  --border: var(--spruce);
}

.dark {
  /* Functional Tokens - Dark */
  --background: var(--nocturn);
  --foreground: var(--tea);

  --primary: var(--spring);
  --primary-foreground: var(--nocturn);

  --secondary: var(--cedar);
  --secondary-foreground: var(--nocturn);

  --accent: var(--saffron);
  --accent-foreground: var(--white);

  --success: var(--mint);
  --success-foreground: var(--nocturn);
  --success-light: var(--spring);

  --info: var(--jade);
  --info-foreground: var(--nocturn);

  --danger: var(--saffron);
  --danger-foreground: var(--white);

  --warning: var(--tea);
  --warning-foreground: var(--nocturn);

  --muted: var(--lake);
  --muted-foreground: var(--tea);

  --neutral: var(--nocturn);
  --neutral-foreground: var(--tea);

  --border: var(--lake);
}
```

---

### Role Mapping

- **Primary → Jade (#42D49C)** — Main brand identity colour.
- **Secondary → Spruce (#007978)** — Secondary actions, neutral emphasis.
- **Accent → Saffron (#FF4C46)** — Highlights, callouts, warnings in dark theme.
- **Success → Spring (#87F8AE)** — Positive states (alerts, success messages, confirm actions).
- **Success Light → Mint (#B2FFC6)** — Subtle background for success highlights.
- **Info → Cedar (#00A68A)** — Informational banners, neutral guidance.
- **Danger → Lake (#004963)** — Errors, destructive actions, critical states.
- **Warning → Saffron (light) / Tea (dark)** — Cautionary (non‑fatal) alerts.
- **Neutral → Tea (light) / Nocturn (dark)** — Muted text, containers, base surfaces.

---

### Tailwind Integration

```js
// tailwind.config.js
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary:{ DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        accent:   { DEFAULT: "var(--accent)",   foreground: "var(--accent-foreground)" },
        success:  { DEFAULT: "var(--success)",  light: "var(--success-light)", foreground: "var(--success-foreground)" },
        info:     { DEFAULT: "var(--info)",     foreground: "var(--info-foreground)" },
        danger:   { DEFAULT: "var(--danger)",   foreground: "var(--danger-foreground)" },
        warning:  { DEFAULT: "var(--warning)",  foreground: "var(--warning-foreground)" },
        muted:    { DEFAULT: "var(--muted)",    foreground: "var(--muted-foreground)" },
        neutral:  { DEFAULT: "var(--neutral)",  foreground: "var(--neutral-foreground)" },
        border: "var(--border)",
      }
    }
  }
}
```

- **Usage**
  - Ensure `styles/brand-tokens.css` is imported globally (e.g., `app/globals.css` or `styles/globals.css`).
  - Toggle dark theme by adding `.dark` to the `<html>` element (compatible with shadcn/ui `ThemeProvider`).

---

### shadcn/ui Usage

Because shadcn/ui components are built on Tailwind utilities, they automatically use the semantic functional tokens once mapped in Tailwind:

```tsx
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function ThemeDemo() {
  return (
    <div className="space-y-4">
      <Button className="bg-primary text-primary-foreground">Primary</Button>
      <Button className="bg-secondary text-secondary-foreground">Secondary</Button>
      <Button className="bg-accent text-accent-foreground">Accent</Button>

      <Alert className="bg-success text-success-foreground">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Task completed successfully.</AlertDescription>
      </Alert>

      <Alert className="bg-info text-info-foreground">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>Here’s some useful context.</AlertDescription>
      </Alert>

      <Alert className="bg-warning text-warning-foreground">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Check this before proceeding.</AlertDescription>
      </Alert>

      <Alert className="bg-danger text-danger-foreground">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    </div>
  );
}
```

---

### Usage Examples

- **Backgrounds and Text**
  - `class="bg-background text-foreground"`
- **Primary Button**
  - `class="bg-primary text-primary-foreground border border-border"`
- **Secondary Button**
  - `class="bg-secondary text-secondary-foreground"`
- **Success Button**
  - `class="bg-success text-success-foreground"`
- **Info Alert**
  - `class="bg-info text-info-foreground"`
- **Danger Badge**
  - `class="bg-danger text-danger-foreground"`
- **Warning Banner**
  - `class="bg-warning text-warning-foreground"`
- **Muted Surface**
  - `class="bg-muted text-muted-foreground"`
- **Neutral Card**
  - `class="bg-neutral text-neutral-foreground"`
- **Accent (Destructive/Callout)**
  - `class="bg-accent text-accent-foreground"`

---

### Accessibility

- Aim for WCAG 2.1 AA minimum contrast.
- Prefer `--primary` and `--secondary` on large actionable surfaces; avoid `--accent` for long text.
- Test light and dark combinations: `foreground` on `background`, component foregrounds on their backgrounds.

---

### Typography & Spacing (Baseline)

- Typeface: System UI or product typeface (to be confirmed in design exploration)
- Font sizes and spacing should follow Tailwind scale (e.g., `text-base`, `text-lg`, `space-y-4`).
- Date/time format: DD/MM/YYYY, 24-hour time
- Units: metric (km, m, kg, °C)

---

### Implementation Checklist

- [ ] Add `styles/brand-tokens.css` and import globally
- [ ] Use classes from Tailwind colours mapped to tokens
- [ ] Toggle `.dark` on `<html>` to switch themes
- [ ] Validate contrast in both themes for key components

---

### Maintenance

- Treat the raw palette as source of truth. Adjust functional tokens only to improve contrast/semantics.
- Document any colour changes in `docs/releases/changelog.md` under “Design”.
