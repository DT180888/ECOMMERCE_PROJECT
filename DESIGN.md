---
name: Adaptive Luxury Minimalism Design System
description: Premium e-commerce fashion brand interface combining flat minimalist macro layouts with soft adaptive depth.
colors:
  background-light: "#DBDBDB"
  background-dark: "#2A2A2A"
  muted: "#797979"
  accent: "#6C63FF"
  success: "#38B2AC"
typography:
  display:
    fontFamily: '"Plus Jakarta Sans", sans-serif'
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: '"Plus Jakarta Sans", sans-serif'
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: '"Plus Jakarta Sans", sans-serif'
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: '"DM Sans", sans-serif'
    fontWeight: 400
rounded:
  xs: "2px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  button: "4px"
  card: "6px"
  gallery: "4px"
spacing:
  mobile: "56px"
  tablet: "80px"
  desktop: "112px"
components:
  button-primary:
    backgroundColor: "{colors.background-dark}"
    textColor: "{colors.background-light}"
    rounded: "{rounded.button}"
  card-surface:
    backgroundColor: "{colors.background-light}"
    rounded: "{rounded.card}"
---

# Design System: Adaptive Luxury Minimalism Design System

## 1. Overview

**Creative North Star: "Quiet Luxury through Flat Minimalism and Soft Depth"**

The system strictly enforces a balanced "80% Static Flat Minimalism + 20% Soft Adaptive Depth & Glassmorphism" visual hierarchy across both Light and Dark themes, optimized for a premium e-commerce fashion brand (Quiet Luxury). Macro layouts, section headers, lookbook imagery, and primary content sit completely flat on the canvas at rest. Generous whitespace (80px+ desktop) is utilized to evoke a high-end editorial magazine feel.

**Key Characteristics:**
- **The 80% (Static Flat Minimalism):** Layouts and imagery sit flat with zero shadows.
- **The 20% (Subtle Depth & Overlays):** Reserved strictly for floating user interfaces like headers, dropdowns, and modals.
- **Typography-led:** Large, clear, high-contrast headings with editorial scaling.
- **Warm Light / Obsidian Dark:** Seamless transition between Oatmeal/Charcoal and deep Obsidian.

## 2. Colors

A high-contrast, premium color palette optimized for quiet luxury.

### Primary
- **Charcoal** (#2A2A2A): Used as the primary foreground text color in light mode and background in dark mode. Excellent readability.
- **Light Gray** (#DBDBDB): Clean architectural light gray foundation.

### Secondary
- **Mid-Gray** (#797979): For muted text, secondary borders, and highlights. Elegant monochromatic typography hierarchy.

### Tertiary
- **Indigo** (#6C63FF): Subtle accent for highlights, active states, and focus rings.

### Neutral
- **Success** (#38B2AC): Functional indicators for successful actions or status.

**The One Voice Rule.** The primary accent is used on ≤10% of any given screen. Its rarity is the point.

## 3. Typography

**Display Font:** "Plus Jakarta Sans" (with sans-serif)
**Body Font:** "DM Sans" (with sans-serif)

**Character:** A high-end editorial blend. Plus Jakarta Sans provides crisp, bold headlines with tight letter spacing for impact, while DM Sans offers highly legible, warm body text.

### Hierarchy
- **Display** (800, responsive, 1.1): Hero headlines and major section titles. Large and impactful.
- **Headline** (800, responsive, 1.2): Primary content titles.
- **Title** (700, responsive, 1.25): Card headings, subsections.
- **Body** (400, base, 1.5): Standard reading text. Keep max line length around 65-75ch.

**The Editorial Contrast Rule.** Hierarchy is established through extreme size contrast between Display headings and Body text, rather than relying solely on color or weight.

## 4. Elevation

The system uses a hybrid elevation approach: ambient soft shadows for interactive elements and flat surfaces for content.

### Shadow Vocabulary
- **shadow-neo-sm** (`0 2px 8px rgba(0,0,0,0.06)`): Default state for buttons, switches, and chips.
- **shadow-neo** (`0 8px 24px rgba(0,0,0,0.06)`): Medium elements like cards and dropdown lists.
- **shadow-neo-hover** (`0 16px 36px rgba(0,0,0,0.1)`): Interactive elements on hover for a slight lift.
- **shadow-neo-inset** (`inset 0 2px 4px rgba(0,0,0,0.05)`): Input fields and search bars, providing a soft inner glow instead of a clay recess.

**The Flat Photography Rule.** Images within product showcases sit flat with zero shadows (`shadow-none`) and minimal rounded corners (`rounded-gallery`) to preserve garment silhouettes and high-fashion aesthetics.

## 5. Components

### Buttons
- **Shape:** Soft rounded corners (4px, `rounded-button`) or fully rounded.
- **Primary:** Flat background with `shadow-neo-sm`. Fine border of `1px solid rgba(var(--text-foreground), 0.05)`.
- **Hover / Focus:** Slight lift (`-translate-y-[1px]`) paired with `shadow-neo-hover`.
- **Active:** Soft landing (`translate-y-[0.5px]`) with `shadow-neo-inset-sm`.

### Cards / Containers
- **Corner Style:** Slightly rounded (6px, `rounded-card`).
- **Background:** Solid surface color, avoiding gradients.
- **Shadow Strategy:** Generally flat, or `shadow-neo` if floating.

### Inputs / Fields
- **Style:** Solid fill with `shadow-neo-inset` and thin border `1px solid rgba(var(--text-foreground), 0.08)`. Shape is `rounded-button` (4px).
- **Focus:** `ring-2 ring-accent/30 border-accent`.

### Overlays (Header, Dropdown, Modals)
- **Style:** Glassmorphic panel with `backdrop-blur` and thin semitransparent border. Shape is `rounded-card` (6px).

## 6. Do's and Don'ts

### Do:
- **Do** use flat backgrounds for product imagery and lookbook displays.
- **Do** use glassmorphism strictly for floating elements like sticky headers or modal overlays.
- **Do** manage section vertical padding strictly using `.client-section` to avoid double-padding.
- **Do** constrain ultra-wide monitors (1920p+) with `max-w-7xl` or `max-w-screen-2xl` and center layouts.

### Don't:
- **Don't** use thiết kế rườm rà, đổ bóng (shadow) quá dày hoặc clay neumorphism (kiểu nổi khối 3D quá đà).
- **Don't** use màu sắc chói lọi, gradient chữ hoặc viền sọc.
- **Don't** use giao diện thẻ bài lặp lại nhàm chán hoặc modal bật lên liên tục.
- **Don't** apply inline vertical padding utilities (`py-20`, `pt-24`) to page wrappers wrapping section widgets.
