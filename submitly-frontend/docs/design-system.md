# Submitly Frontend — Design System

> Notion-inspired design tokens. Applied during build phase via Tailwind config and shadcn/ui theme.
> Last updated: 2026-10-21

---

## Colors

### Primary & Brand
| Token | Value | Use |
|---|---|---|
| `primary` | `#5645d4` | Primary CTA, active states |
| `primary-pressed` | `#4534b3` | Pressed buttons |
| `primary-deep` | `#3a2a99` | Deep emphasis |
| `on-primary` | `#ffffff` | Text on primary |
| `brand-navy` | `#0a1530` | Hero band background |
| `brand-navy-deep` | `#070f24` | Deeper navy |
| `brand-navy-mid` | `#1a2a52` | Mid navy |
| `link-blue` | `#0075de` | Inline text links (NOT primary CTA) |
| `link-blue-pressed` | `#005bab` | Pressed links |

### Brand Spectrum
| Token | Value | Use |
|---|---|---|
| `brand-orange` | `#dd5b00` | Orange accent |
| `brand-orange-deep` | `#793400` | Deep orange |
| `brand-pink` | `#ff64c8` | Pink accent |
| `brand-pink-deep` | `#a02e6d` | Deep pink |
| `brand-purple` | `#7b3ff2` | Purple accent variant |
| `brand-purple-300` | `#d6b6f6` | Light purple |
| `brand-purple-800` | `#391c57` | Deep purple tag text |
| `brand-teal` | `#2a9d99` | Teal accent |
| `brand-green` | `#1aae39` | Green accent |
| `brand-yellow` | `#f5d75e` | Yellow accent |
| `brand-brown` | `#523410` | Brown accent |

### Card Tints (Pastel Backgrounds)
| Token | Value | Use |
|---|---|---|
| `card-tint-peach` | `#ffe8d4` | Peach feature card |
| `card-tint-rose` | `#fde0ec` | Rose feature card |
| `card-tint-mint` | `#d9f3e1` | Mint feature card |
| `card-tint-lavender` | `#e6e0f5` | Lavender feature card |
| `card-tint-sky` | `#dcecfa` | Sky feature card |
| `card-tint-yellow` | `#fef7d6` | Yellow feature card |
| `card-tint-yellow-bold` | `#f9e79f` | Bold yellow banner |
| `card-tint-cream` | `#f8f5e8` | Cream tint |
| `card-tint-gray` | `#f0eeec` | Neutral surface |

### Surface
| Token | Value | Use |
|---|---|---|
| `canvas` | `#ffffff` | Page background, card surface |
| `surface` | `#f6f5f4` | Subtle section backgrounds |
| `surface-soft` | `#fafaf9` | Quieter section divisions |
| `hairline` | `#e5e3df` | 1px borders, dividers |
| `hairline-soft` | `#ede9e4` | Quieter dividers |
| `hairline-strong` | `#c8c4be` | Input borders |

### Text
| Token | Value | Use |
|---|---|---|
| `ink-deep` | `#000000` | Pure black emphasis |
| `ink` | `#1a1a1a` | Primary text |
| `charcoal` | `#37352f` | Body emphasis (warm charcoal) |
| `slate` | `#5d5b54` | Secondary text |
| `steel` | `#787671` | Tertiary, footer links |
| `stone` | `#a4a097` | Muted labels |
| `muted` | `#bbb8b1` | Disabled, placeholders |
| `on-dark` | `#ffffff` | White on dark surfaces |
| `on-dark-muted` | `#a4a097` | Reduced white |

### Semantic
| Token | Value | Use |
|---|---|---|
| `semantic-success` | `#1aae39` | Confirmation (APPROVED badge) |
| `semantic-warning` | `#dd5b00` | Warnings (PENDING badge) |
| `semantic-error` | `#e03131` | Validation errors (REJECTED badge) |

---

## Typography

**Font:** Notion Sans (Inter-based). Fallbacks: Inter, -apple-system, system-ui, 'Segoe UI', Helvetica, sans-serif.

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `hero-display` | 80px | 600 | 1.05 | -2px | Hero headline |
| `display-lg` | 56px | 600 | 1.10 | -1px | Section openers |
| `heading-1` | 48px | 600 | 1.15 | -0.5px | Page headlines |
| `heading-2` | 36px | 600 | 1.20 | -0.5px | Subsection headlines |
| `heading-3` | 28px | 600 | 1.25 | 0 | Card titles |
| `heading-4` | 22px | 600 | 1.30 | 0 | Feature tile titles |
| `heading-5` | 18px | 600 | 1.40 | 0 | Stat card labels |
| `subtitle` | 18px | 400 | 1.50 | 0 | Hero subtitle |
| `body-md` | 16px | 400 | 1.55 | 0 | Primary body |
| `body-md-medium` | 16px | 500 | 1.55 | 0 | Body emphasis |
| `body-sm` | 14px | 400 | 1.50 | 0 | Secondary body |
| `body-sm-medium` | 14px | 500 | 1.50 | 0 | Button labels, table headers |
| `caption` | 13px | 400 | 1.40 | 0 | Small labels |
| `caption-bold` | 13px | 600 | 1.40 | 0 | Badge labels |
| `micro` | 12px | 500 | 1.40 | 0 | Timestamps |
| `micro-uppercase` | 11px | 600 | 1.40 | 1px | Section overlines |
| `button-md` | 14px | 500 | 1.30 | 0 | Button text |

---

## Spacing

| Token | Value | Use |
|---|---|---|
| `xxs` | 4px | Tight gaps |
| `xs` | 8px | Icon gaps, badge padding |
| `sm` | 12px | Input padding, small gaps |
| `md` | 16px | Default spacing |
| `lg` | 20px | Card internal gaps |
| `xl` | 24px | Card padding |
| `xxl` | 32px | Feature card padding |
| `xxxl` | 40px | Large gaps |
| `section-sm` | 48px | Tight section spacing |
| `section` | 64px | Default section spacing |
| `section-lg` | 96px | Generous section spacing |
| `hero` | 120px | Hero padding |

---

## Border Radius

| Token | Value | Use |
|---|---|---|
| `xs` | 4px | Tag chips |
| `sm` | 6px | Small badges |
| `md` | 8px | Buttons, inputs (NOT pills) |
| `lg` | 12px | Cards |
| `xl` | 16px | Larger panels |
| `xxl` | 20px | Feature showcases |
| `xxxl` | 24px | Large feature cards |
| `full` | 9999px | Status badges, pill tabs only |

**Rule:** Buttons are `md` (8px) rectangles, NOT pills. Cards are `lg` (12px).

---

## Elevation

| Level | Shadow | Use |
|---|---|---|
| 0 | None, hairline border | Default cards |
| 1 | `rgba(15,15,15,0.04) 0 1px 2px` | Hover tiles |
| 2 | `rgba(15,15,15,0.08) 0 4px 12px` | Feature cards |
| 3 | `rgba(15,15,15,0.20) 0 24px 48px -8px` | Hero mockup |
| 4 | `rgba(15,15,15,0.16) 0 16px 48px -8px` | Modals, dialogs |

---

## Components

### Buttons
| Name | Background | Text | Border | Rounded |
|---|---|---|---|---|
| `button-primary` | `primary` | `on-primary` | none | `md` |
| `button-dark` | `ink-deep` | `on-dark` | none | `md` |
| `button-secondary` | transparent | `ink` | `1px hairline-strong` | `md` |
| `button-ghost` | transparent | `ink` | none | `sm` |
| `button-link` | transparent | `link-blue` | none | none |

### Inputs
- Height: 44px
- Border: `1px solid hairline-strong`
- Focus: `2px solid primary`
- Rounded: `md`

### Badges (for submission status)
| Status | Background | Text |
|---|---|---|
| PENDING | `semantic-warning` | `on-primary` |
| APPROVED | `semantic-success` | `on-primary` |
| REJECTED | `semantic-error` | `on-primary` |

### Cards
- Standard: `canvas` bg, `lg` rounded, `1px hairline` border, `xl` padding
- Feature: same but `xxl` padding
- Stat card: `surface` bg, `lg` rounded

### Dialogs
- Background: `canvas`
- Rounded: `lg`
- Shadow: level 4
- Overlay: `rgba(0,0,0,0.4)`

---

## Responsive Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile small | < 480px | 1 column, 36px hero |
| Mobile large | 480–767px | 2-up cards, 48px hero |
| Tablet | 768–1023px | 2 columns, 56px hero |
| Desktop | 1024–1279px | Full layout, 72px hero |
| Wide | ≥ 1280px | 1280px max-width, 80px hero |

Touch targets: buttons 40–44px, inputs 44px.

---

## Do's and Don'ts

**Do:**
- Use `primary` (#5645d4) as dominant CTA color
- Use `md` (8px) rounded for buttons — rectangular, not pills
- Use `lg` (12px) rounded for all cards
- Use semantic colors for status badges
- Use Notion Sans / Inter everywhere

**Don't:**
- Don't use primary purple for body text or large backgrounds
- Don't use pill-shaped buttons (pills are for badges/tabs only)
- Don't mix link-blue with primary-purple — distinct roles
- Don't apply heavy shadows on flat cards
