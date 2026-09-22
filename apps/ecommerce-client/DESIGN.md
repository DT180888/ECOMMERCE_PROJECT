# Adaptive Luxury Minimalism Design System

## Design Philosophy

**Core Principles (Hybrid Minimalism x Soft Adaptive Shadows)**:
The system strictly enforces a balanced **"80% Static Flat Minimalism + 20% Soft Adaptive Depth & Glassmorphism"** visual hierarchy across both Light and Dark themes, optimized for a premium e-commerce fashion brand (Quiet Luxury).

- **The 80% (Static Flat Minimalism)**: Macro layouts, section headers, lookbook imagery, and primary content sit completely flat on the canvas (`shadow-none`) at rest. Generous whitespace (80px+ desktop) is utilized to evoke a high-end editorial magazine feel.
- **The 20% (Subtle Depth & Overlays)**:
  - **Glassmorphism Overlays**: Reserved strictly for floating user interfaces like headers (during scroll), dropdown menus, hover-state details, and modal overlays. This provides clear hierarchy without overloading the layout.
  - **Soft Adaptive Interaction**: Small interactive components (buttons, chips, switches) use soft, single-direction shadows and subtle micro-borders to indicate clickability. Harsh, dual opposing Neumorphic shadows and 3D clay vát (bevels) are completely eliminated.
  - **Photography Rule**: Images within product showcases sit flat with zero shadows (`shadow-none`) and minimal rounded corners (`rounded-gallery`) to preserve garment silhouettes and high-fashion aesthetics.

**Vibe**: Calm, refined, tactile but quiet. The interface transitions seamlessly between a warm, editorial Light Mode (Oatmeal and Charcoal) and a deep, premium Dark Mode (Obsidian).

### Target Resolution & Responsive Constraints
The primary design target is a high-end Desktop resolution of **1920x1080 (Full HD)**.
- **Ultra-Wide Constraint**: Layouts must not stretch infinitely. Use containers (like `max-w-7xl` or `max-w-screen-2xl`) and center them to prevent content from bleeding too far to the edges on 1920p monitors.
- **Typography Scaling**: Font sizes on Desktop must be strictly controlled (e.g., maximum `text-2xl` or `text-3xl` for headings, `text-base` for body) to avoid the "blown-up mobile app" look. Oversized typography should be used selectively for artistic impact, not by default.
- **Grid Optimization**: Use `grid-cols-4` or `grid-cols-5` on Desktop to take full advantage of the horizontal real estate while maintaining the editorial column structure.

---

## Design Token System (The DNA)

### Colors & Semantic Themes

The system is optimized around a high-contrast, premium color palette:

- **Physical Palette Assets**:
  - `Color 1 (Light Gray)`: `#DBDBDB` (Clean architectural light gray foundation)
  - `Color 2 (Charcoal)`: `#2A2A2A` (Rich dark charcoal black for high contrast)
  - `Color 3 (Mid-Gray)`: `#797979` (For muted text, secondary borders, and highlights)
  - `Color 4 (Indigo)`: `#6C63FF` (Subtle accent for highlights and active status)

- **Theme Variable Mapping**:

| Tailwind Token | Light Mode Active | Dark Mode Active (`.dark`) | Implementation Notes |
| :--- | :--- | :--- | :--- |
| `bg-background` | `Color 1` (`#DBDBDB`) | `Color 2` (`#2A2A2A`) | Gray (Light) / Charcoal (Dark) foundation |
| `text-foreground` | `Color 2` (`#2A2A2A`) | `Color 1` (`#DBDBDB`) | Excellent readability (>8.5:1 ratio) |
| `text-muted` | `Color 3` (`#797979`) | `Color 3` (`#797979`) | Elegant monochromatic typography hierarchy |
| `bg-accent` / `text-accent` | `Color 4` (`#6C63FF`) | `Color 4` (`#6C63FF`) | Clean active brand accent |
| `bg-success` | `#38B2AC` | `#38B2AC` | Functional indicators |

### Shadows & Material Physics

Instead of simulated 3D shapes, elevation is created using CSS custom variables that represent soft, ambient drop shadows and fine borders.

#### Variable Definitions:
- **Light Theme**:
  - `--shadow-dark-rgb`: `0, 0, 0`
  - `--shadow-light-rgb`: `255, 255, 255`
  - `--shadow-dark-opacity`: `0.04` (extremely soft drop shadow)
  - `--shadow-light-opacity`: `0.3`
- **Dark Theme**:
  - `--shadow-dark-rgb`: `0, 0, 0`
  - `--shadow-light-rgb`: `255, 255, 255`
  - `--shadow-dark-opacity`: `0.5` (grounding shadows on dark background)
  - `--shadow-light-opacity`: `0.02`

#### Tailwind Shadow Token Utilities:
- **Standard (`shadow-neo`)** - Medium elements (cards, dropdown lists):
  `box-shadow: 0 8px 24px rgba(var(--shadow-dark-rgb), var(--shadow-dark-opacity));`
- **Hover Lift (`shadow-neo-hover`)** - Interactive elements on hover:
  `box-shadow: 0 16px 36px rgba(var(--shadow-dark-rgb), calc(var(--shadow-dark-opacity) + 0.04));`
- **Small (`shadow-neo-sm`)** - Default state for buttons, switches, and chips:
  `box-shadow: 0 2px 8px rgba(var(--shadow-dark-rgb), var(--shadow-dark-opacity));`
- **Inset (`shadow-neo-inset` / `shadow-neo-inset-deep`)** - Input fields, search bars:
  `box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);` (soft inner glow instead of clay recess)
- **Pressed (`shadow-neo-inset-sm`)** - Active click state:
  `box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);`

---

## Component Styling Rules

### 1. Buttons & Selectors (Tactile Control)
- **Shape**: `rounded-button` (`4px`) or `rounded-full`.
- **Border**: Fine border `1px solid rgba(var(--text-foreground), 0.05)`.
- **Default State**: Flat background + `shadow-neo-sm`.
- **Hover State**: `-translate-y-[1px]` (slight lift) + `shadow-neo-hover`.
- **Active State**: `translate-y-[0.5px]` (soft landing) + `shadow-neo-inset-sm`.

### 2. Products & Lookbook Display (Editorial Flat)
- **Shape**: `rounded-gallery` (`4px`).
- **State**: Absolutely flat (`shadow-none`), borderless. Hover transitions dynamically load alternate catalog shots without shadow changes.

### 3. Inputs & Fields
- **Shape**: `rounded-button` (`4px`).
- **State**: Solid white/dark fill + `shadow-neo-inset` + thin border `1px solid rgba(var(--text-foreground), 0.08)`.
- **Focus**: `ring-2 ring-accent/30 border-accent`.

### 4. Overlays (Header, Dropdown, Modals)
- **State**: Glassmorphic panel (`.glass-panel`) with `backdrop-blur` and thin semitransparent border (`border-white/10` or HSL counterpart), shape is `rounded-card` (`6px`).

---

## Layout Principles & Hybrid Elevation System

1. **Layer 0: The Continuous Canvas (Minimalist Base)**
    - Body background set to `bg-background` (`#DBDBDB` or `#2A2A2A`). Generous whitespace blocks separate components.
2. **Layer 1: The Flat Magazine Grid (Editorial)**
   - Imagery, banners, headers, lists sit flush on the canvas with zero shadow depth.
3. **Layer 2: Interactive Controls & Floating Panels (Adaptive Depth)**
   - Buttons, controls, dropdowns, and sticky headers use soft shadows or glass panels to overlay cleanly on Layer 1.
4. **Spacing & Padding (Anti Double-Padding Rule)**
   - **Section-Level Widgets** (e.g., `ProductGridShowcase`, `EditorialCuration`) MUST manage their own vertical padding using the `.client-section` class on their outermost container.
   - **Layout Containers** (e.g., Pages wrapping widgets in `<section>` tags) MUST NOT apply inline vertical padding utilities (like `py-20`, `pt-24`, `pb-16`). This strict separation of concerns prevents double-padding and ensures the project strictly follows standard whitespace intervals (56px -> 80px -> 112px).