# Aegrid Theming Framework

## Overview

The Aegrid theming framework provides a systematic approach to visual design, ensuring consistency, accessibility, and maintainability across the platform. Built on Tailwind CSS with shadcn/ui components, it leverages CSS custom properties for dynamic theming and supports both light and dark modes.

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

## Icon System

### Icon Library Standardization

**Primary Icon Library**: Lucide React
- **Consistency**: All icons use Lucide React for uniform appearance and behavior
- **Performance**: Tree-shakable imports reduce bundle size
- **Accessibility**: Built-in accessibility features and semantic naming
- **Maintenance**: Single source of truth for icon updates and additions

### Icon Usage Guidelines

#### Import Pattern
```tsx
// Preferred: Named imports for tree-shaking
import { 
  Building2, 
  BarChart3, 
  Calendar, 
  Settings, 
  Users, 
  MapPin, 
  Wrench, 
  AlertTriangle 
} from "lucide-react";

// Avoid: Wildcard imports (unless for dynamic icon mapping)
import * as LucideIcons from "lucide-react";
```

#### Dynamic Icon Access
```tsx
// For components requiring dynamic icon selection
const iconMap = {
  Building2,
  BarChart3,
  Calendar,
  Settings,
  Users,
  MapPin,
  Wrench,
  AlertTriangle
} as const;

// Type-safe dynamic access
const IconComponent = iconMap[iconName as keyof typeof iconMap] || DefaultIcon;
```

#### Icon Sizing Standards
```tsx
// Consistent sizing across components
className="h-4 w-4"  // Small icons (buttons, badges)
className="h-5 w-5"  // Medium icons (navigation, cards)
className="h-6 w-6"  // Large icons (headers, prominent elements)
className="h-8 w-8"  // Extra large icons (hero sections, major CTAs)
```

#### Icon Color Integration
```tsx
// Use semantic color classes with icons
<Building2 className="h-5 w-5 text-primary" />
<AlertTriangle className="h-4 w-4 text-warning" />
<CheckCircle className="h-5 w-5 text-success" />

// Dynamic color based on state
<IconComponent 
  className="h-4 w-4" 
  style={{ color: condition === 'critical' ? '#ef4444' : '#10b981' }} 
/>
```

### Icon Categories

#### Navigation Icons
- `Building2` - Assets, buildings, infrastructure
- `BarChart3` - Dashboard, analytics, reports
- `Calendar` - Scheduling, maintenance, events
- `MapPin` - Location, mapping, geographic data
- `Settings` - Configuration, preferences, admin

#### Status Icons
- `CheckCircle` - Success, completion, approval
- `AlertTriangle` - Warnings, alerts, attention
- `Clock` - Pending, time-sensitive, scheduling
- `Activity` - Progress, activity, sports facilities

#### Action Icons
- `Edit` - Edit, modify, update
- `Eye` - View, preview, visibility
- `Plus` - Add, create, new
- `Search` - Find, filter, locate
- `RefreshCw` - Refresh, reload, sync

#### User Interface Icons
- `Users` - Team, personnel, collaboration
- `Bell` - Notifications, alerts, reminders
- `LogOut` - Sign out, logout, exit
- `HelpCircle` - Help, support, information

### Accessibility Considerations

#### Screen Reader Support
```tsx
// Always provide accessible labels
<Button>
  <Settings className="h-4 w-4" />
  <span className="sr-only">Open settings</span>
</Button>

// Or use aria-label
<Settings className="h-4 w-4" aria-label="Settings" />
```

#### Icon-Only Buttons
```tsx
// Ensure icon-only buttons have proper accessibility
<Button size="icon" aria-label="Toggle sidebar">
  <PanelLeftClose className="h-4 w-4" />
</Button>
```

### Migration from Other Icon Libraries

#### Completed Migrations
- ✅ **Radix UI Icons**: Replaced with Lucide equivalents
- ✅ **Emoji Icons**: Replaced with semantic Lucide icons
- ✅ **Custom Icons**: Standardized to Lucide where possible

#### Icon Mapping Reference
| Previous Icon | Lucide Equivalent | Usage |
|---------------|-------------------|-------|
| `ViewVerticalIcon` | `PanelLeftClose`/`PanelLeftOpen` | Sidebar toggle |
| `Cross2Icon` | `X` | Close buttons |
| `CheckIcon` | `CheckCircle` | Success states |
| `ChevronRightIcon` | `ChevronRight` | Navigation |
| `DotFilledIcon` | `Circle` | Indicators |

### Performance Optimization

#### Bundle Size Management
- Use named imports to enable tree-shaking
- Avoid importing entire icon library
- Consider icon sprites for high-volume usage
- Monitor bundle size impact of new icons

#### Loading Strategy
```tsx
// Lazy load icons for non-critical components
const LazyIcon = React.lazy(() => import('lucide-react').then(module => ({
  default: module.SomeIcon
})));

// Use Suspense for lazy-loaded icons
<Suspense fallback={<div className="h-4 w-4 bg-muted animate-pulse" />}>
  <LazyIcon />
</Suspense>
```

### Future Considerations

#### Icon Library Evolution
- Monitor Lucide React updates for new icons
- Plan migration path if switching icon libraries
- Maintain icon mapping documentation
- Consider custom icon additions for brand-specific needs

#### Design System Integration
- Align icon choices with brand personality
- Ensure icons work across all theme variations
- Test icon legibility at different sizes
- Validate icon accessibility across devices

---

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
