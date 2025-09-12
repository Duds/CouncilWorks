# CouncilWorks Theming Framework

## Overview

The CouncilWorks theming framework provides a systematic approach to visual design, ensuring consistency, accessibility, and maintainability across the platform. Built on Tailwind CSS with shadcn/ui components, it leverages CSS custom properties for dynamic theming and supports both light and dark modes.

## Core Design Principles

### 1. **Semantic Colour System**
- **Purpose-driven**: Colours serve specific functional roles (primary, secondary, accent, status)
- **Accessible**: All colour combinations meet WCAG AA contrast requirements (4.5:1 minimum)
- **Consistent**: Same colour tokens used across all components and states

### 2. **Hierarchical Information Architecture**
- **Clear visual hierarchy**: Use typography scale, spacing, and elevation to guide user attention
- **Scannable layouts**: Group related information with consistent spacing and alignment
- **Progressive disclosure**: Show essential information first, details on demand

### 3. **Australian Design Standards**
- **Localisation**: Australian English spelling, DD/MM/YYYY dates, 24-hour time format
- **Regional context**: Consider Australian public holidays, time zones, and business practices
- **Cultural sensitivity**: Appropriate imagery and language for Australian councils

### 4. **Performance-First Approach**
- **Minimal bundle size**: Use CSS custom properties and Tailwind's purging
- **Efficient rendering**: Optimise for 60fps interactions and fast load times
- **Progressive enhancement**: Core functionality works without JavaScript

## Colour Palette

### Brand Colours
```css
/* Core Brand Palette */
--saffron: #FF4C46;    /* Accent, warnings, alerts */
--white:   #FFFFFF;    /* Primary background */
--tea:     #DFFFDE;    /* Success states, highlights */
--nocturn: #012B3A;    /* Primary text, dark mode background */

/* Green Spectrum (Primary) */
--mint:    #B2FFC6;    /* Success light states */
--spring:  #87F8AE;    /* Primary (dark mode) */
--jade:    #42D49C;    /* Primary (light mode) */
--cedar:   #00A68A;    /* Info states */
--spruce:  #007978;    /* Secondary, borders */
--lake:    #004963;    /* Danger states */
```

### Neutral Greys
```css
/* Light Grey Options (for muted backgrounds) */
--grey-1:  #F7F9F8;    /* Lightest grey */
--grey-2:  #F1F4F3;    /* Light grey */
--grey-3:  #ECEFEF;    /* Current muted background */
```

### Semantic Token Mapping

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | `--white` | `--nocturn` | Main page background |
| `--surface` | `#F5F7F6` | `#0F2F2E` | Card/section backgrounds |
| `--primary` | `--jade` | `--spring` | Primary actions, links |
| `--secondary` | `--spruce` | `--cedar` | Secondary actions |
| `--accent` | `--saffron` | `--saffron` | Highlights, alerts |
| `--success` | `--spring` | `--mint` | Success states |
| `--info` | `--cedar` | `--jade` | Information states |
| `--danger` | `--lake` | `--saffron` | Error states |
| `--warning` | `--saffron` | `--tea` | Warning states |
| `--muted` | `--grey-3` | `--lake` | Subtle backgrounds |
| `--border` | `--spruce` | `--lake` | Borders, dividers |

## Typography System

### Font Scale
```css
/* Tailwind Typography Scale */
text-xs    /* 12px - Captions, labels */
text-sm    /* 14px - Body small, metadata */
text-base  /* 16px - Body text (default) */
text-lg    /* 18px - Large body text */
text-xl    /* 20px - Small headings */
text-2xl   /* 24px - Medium headings */
text-3xl   /* 30px - Large headings */
text-4xl   /* 36px - Hero headings */
```

### Font Weight Scale
```css
font-normal    /* 400 - Body text */
font-medium    /* 500 - Emphasised text */
font-semibold  /* 600 - Headings */
font-bold      /* 700 - Strong emphasis */
```

### Line Height
```css
leading-none   /* 1 - Tight spacing */
leading-tight  /* 1.25 - Headings */
leading-normal /* 1.5 - Body text */
leading-relaxed /* 1.625 - Large text */
```

## Spacing System

### Consistent Spacing Scale
```css
/* Tailwind Spacing (based on 4px grid) */
space-1   /* 4px */
space-2   /* 8px */
space-3   /* 12px */
space-4   /* 16px */
space-6   /* 24px */
space-8   /* 32px */
space-12  /* 48px */
space-16  /* 64px */
space-24  /* 96px */
```

### Component Spacing Patterns
- **Card padding**: `p-6` (24px) for headers/content
- **Section spacing**: `space-y-6` (24px) between elements
- **Grid gaps**: `gap-6` (24px) for consistent layouts
- **Form spacing**: `space-y-4` (16px) between form elements

## Component Design Patterns

### Card Hierarchy
1. **Primary Cards**: `bg-white` with `border border-border`
2. **Surface Cards**: `bg-surface` for elevated sections
3. **Muted Cards**: `bg-muted` for subtle content areas
4. **Nested Cards**: Use accent borders or top bars instead of background fills

### Visual Hierarchy Techniques
- **Left border accents**: `border-l-2 border-l-primary` for status indication
- **Top accent bars**: 4px height bars for section identification
- **Badge indicators**: Coloured badges for status without background fills
- **Dashed outlines**: `border-dashed` for grouped content
- **Inset shadows**: Subtle `shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.02)]` for grouping

### Interactive States
```css
/* Hover States */
hover:bg-muted        /* Subtle background change */
hover:bg-primary/90   /* Primary button hover */
hover:shadow-md       /* Elevation increase */

/* Focus States */
focus:ring-2 focus:ring-primary    /* Primary focus ring */
focus:outline-none                  /* Remove default outline */

/* Active States */
active:scale-95       /* Button press feedback */
active:bg-primary/80  /* Active button state */
```

## Dark Mode Implementation

### Automatic Theme Switching
- Uses `.dark` class on `<html>` element
- Compatible with shadcn/ui theming system
- Respects user system preferences via `ThemeProvider`

### Dark Mode Considerations
- **Reduced contrast**: Adjust border and text colours for dark backgrounds
- **Elevation**: Use subtle shadows and borders for depth
- **Accessibility**: Maintain contrast ratios in dark mode
- **Consistency**: Ensure brand colours work in both modes

## Accessibility Guidelines

### Colour Accessibility
- **Contrast ratios**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Colour independence**: Don't rely solely on colour to convey information
- **Focus indicators**: Clear focus states for keyboard navigation

### Typography Accessibility
- **Readable font sizes**: Minimum 14px for body text
- **Line height**: 1.5x font size for comfortable reading
- **Font weight**: Use semantic weight (medium for emphasis, not bold)

### Interactive Accessibility
- **Touch targets**: Minimum 44px for touch interfaces
- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Screen reader support**: Proper ARIA labels and semantic HTML

## Implementation Guidelines

### CSS Custom Properties Usage
```css
/* Use semantic tokens, not raw colours */
.my-component {
  background-color: var(--surface);
  color: var(--surface-foreground);
  border: 1px solid var(--border);
}
```

### Tailwind Class Patterns
```tsx
// Preferred: Use semantic colour classes
<Card className="bg-surface border border-border">
  <CardHeader className="p-6">
    <CardTitle className="text-foreground">Title</CardTitle>
  </CardHeader>
</Card>

// Avoid: Hard-coded colours
<Card className="bg-gray-100 border-gray-300">
  <CardHeader className="p-6">
    <CardTitle className="text-gray-900">Title</CardTitle>
  </CardHeader>
</Card>
```

### Component Composition
```tsx
// Create reusable themed components
interface ThemedCardProps {
  variant?: 'default' | 'surface' | 'muted';
  accent?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
}

export function ThemedCard({ variant = 'default', accent, children }: ThemedCardProps) {
  const variantClasses = {
    default: 'bg-white',
    surface: 'bg-surface',
    muted: 'bg-muted'
  };
  
  const accentClasses = accent ? `border-l-2 border-l-${accent}` : '';
  
  return (
    <Card className={`${variantClasses[variant]} ${accentClasses}`}>
      {children}
    </Card>
  );
}
```

## Testing and Validation

### Visual Testing
- **Cross-browser testing**: Ensure consistent appearance across browsers
- **Responsive testing**: Verify layouts work on all screen sizes
- **Dark mode testing**: Test all components in both light and dark modes

### Accessibility Testing
- **Automated testing**: Use tools like axe-core for accessibility issues
- **Manual testing**: Test with keyboard navigation and screen readers
- **Colour contrast**: Verify contrast ratios with tools like WebAIM

### Performance Testing
- **Bundle size**: Monitor CSS bundle size and unused styles
- **Rendering performance**: Test with browser dev tools
- **Theme switching**: Ensure smooth transitions between themes

## Maintenance and Evolution

### Version Control
- **Semantic versioning**: Use semantic versioning for theme updates
- **Breaking changes**: Document breaking changes in CHANGELOG
- **Migration guides**: Provide migration paths for major updates

### Documentation Updates
- **Component documentation**: Keep component examples up to date
- **Design tokens**: Document new tokens and their usage
- **Best practices**: Update guidelines based on learnings

### Future Considerations
- **Design system evolution**: Plan for future design system updates
- **Component library growth**: Structure for adding new components
- **Theme customisation**: Consider user customisation options

## Resources and Tools

### Development Tools
- **Tailwind CSS IntelliSense**: VS Code extension for autocomplete
- **shadcn/ui CLI**: Component management and updates
- **CSS Custom Properties**: Browser dev tools for debugging

### Design Tools
- **Figma**: Design system documentation and mockups
- **Contrast checkers**: WebAIM, Colour Oracle
- **Accessibility tools**: axe DevTools, WAVE

### Documentation
- **Component sandbox**: `/sandbox/cards` for live examples
- **Brand guidelines**: `docs/design/brand-guidelines.md`
- **Changelog**: `docs/releases/changelog.md`

---

*This framework is living documentation. Update it as the design system evolves and new patterns emerge.*
