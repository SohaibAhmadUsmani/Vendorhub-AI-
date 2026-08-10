# VendorHub AI — Official Design System & Styling Guidelines (100% Enterprise Edition)

> **Author**: Muzammil Tanveer (Frontend Lead)  
> **Target Application**: VendorHub AI — AI-Powered B2B Sourcing Platform  
> **Source of Truth**: Team-Finalized UI Screenshot, SRS Specification & Enterprise B2B Standards  
> **Branch**: `muzammil/profile-and-catalog`

---

## 1. Design System Overview & Architecture

This document serves as the **authoritative visual and architectural standard** for all **17 modules** across all **7 team members**. Every developer must adhere to these exact color tokens, layout structures, typography scales, dark mode variables, form inputs, button components, mobile-first responsive rules, and micro-animation standards to guarantee 100% UI consistency across the platform.

### **Core Design Pillars**:
1. **Visual Alignment**: Strict adherence to the team-finalized UI layout (Dark Navy Sidebar + Light Lilac/Slate Canvas in Light Mode $\rightarrow$ Deep Obsidian Canvas in Dark Mode).
2. **Mobile-First & Touch Optimization**: Mobile-friendly layouts, touch targets ($\ge 44\text{px}$), responsive collapsibility, and bottom sheet drawers.
3. **AI-Native Experience**: Glowing focus borders, particle highlights, and counter animations for AI confidence scores.
4. **Fluid Performance & Accessibility**: Smooth momentum scrolling (Lenis engine), WCAG 2.2 AA compliance, and zero layout shift.

---

## 2. Color Palette & Token System (Light & Dark Mode)

To ensure zero color contrast issues when toggling themes, all components must use CSS Custom Properties and Tailwind class directives.

```css
/* ==========================================================================
   VENDORHUB AI GLOBAL CSS CUSTOM PROPERTIES (TOKENS)
   ========================================================================== */

:root {
  /* --- Brand & Primary Colors (Matched to Screenshot) --- */
  --primary-purple: #6C5CE7;
  --primary-purple-hover: #5A4AD1;
  --primary-purple-light: #F0EBFE;
  --accent-cyan: #0EA5E9;
  --accent-cyan-light: #E0F2FE;

  /* --- Sidebar Tokens (Dark Navy Anchor) --- */
  --sidebar-bg: #0B1021;
  --sidebar-border: #1E293B;
  --sidebar-text: #94A3B8;
  --sidebar-text-active: #FFFFFF;
  --sidebar-active-pill: #6C5CE7;

  /* --- Main Canvas & Card Surface (Light Mode) --- */
  --bg-main: #F6F8FD;
  --bg-card: #FFFFFF;
  --bg-hero: linear-gradient(135deg, #F0EBFE 0%, #F8FAFC 100%);
  --border-color: #E2E8F0;
  --border-card: #E5E7EB;

  /* --- Typography Colors (Light Mode) --- */
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #64748B;
  --text-light: #94A3B8;

  /* --- Status Badges (Strict Contrast Ratios) --- */
  --status-active-bg: #DCFCE7;
  --status-active-text: #15803D;

  --status-pending-bg: #FEF3C7;
  --status-pending-text: #B45309;

  --status-review-bg: #E0F2FE;
  --status-review-text: #0369A1;

  --status-completed-bg: #D1FAE5;
  --status-completed-text: #047857;

  --match-badge-bg: #F0EBFE;
  --match-badge-text: #6C5CE7;

  /* --- Shadows & Radii --- */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  --shadow-hover: 0 10px 25px -5px rgba(108, 92, 231, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  --shadow-ai-glow: 0 0 20px rgba(108, 92, 231, 0.25);
}

/* --- Dark Mode Overrides (Seamless Adaptability) --- */
[data-theme="dark"] {
  --bg-main: #0B1021;
  --bg-card: #151D30;
  --bg-hero: linear-gradient(135deg, #1A1838 0%, #151D30 100%);
  --border-color: #1E293B;
  --border-card: #1F2A40;

  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;

  --shadow-card: 0 4px 10px 0 rgba(0, 0, 0, 0.3);
  --shadow-hover: 0 10px 30px -5px rgba(108, 92, 231, 0.35);
}
```

---

## 3. Typography & Font Architecture

* **Primary Heading & UI Font**: `Plus Jakarta Sans`, sans-serif (Bold, rounded geometry giving a premium digital B2B look).
* **Body & Description Font**: `Inter`, sans-serif (Highly legible font for data tables, forms, and product descriptions).
* **Monospace / Metric Font**: `JetBrains Mono`, monospace (Small meta tags, HIPAA badges, RFQ numbers, and price metrics).

### Headings & Typography Hierarchy

| Level | Class Utility Mix | Font Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display 1 / Hero** | `font-sans text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight` | `800` | `1.2` | Hero Headlines ("What are you sourcing today?") |
| **Section Header** | `font-sans text-xl sm:text-2xl md:text-3xl font-bold tracking-tight` | `700` | `1.3` | Section Headers & Page Titles |
| **Card Title** | `font-sans text-base sm:text-lg font-bold` | `700` | `1.4` | Card Titles, Modal Headers, Vendor Names |
| **Body Lead** | `font-sans text-sm sm:text-base text-slate-600 dark:text-slate-300` | `400` / `500` | `1.5` | Lead Paragraphs & Hero Subtext |
| **Body Standard** | `font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-200` | `400` | `1.5` | Form Inputs, Table Cells, Card Descriptions |
| **Meta / Caption** | `font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase` | `600` | `1.4` | Badges, Timestamp Labels, Metric Trends |

---

## 4. Component State Matrix (Interactive States)

Every interactive component across all 17 modules must support these 7 states:

| State | CSS / Tailwind Directive | Visual Indicator |
| :--- | :--- | :--- |
| **Default** | Standard utility class mix | Resting state with standard shadows & borders |
| **Hover** | `hover:shadow-hover hover:-translate-y-1 hover:border-[#6C5CE7]` | Smooth elevation and color transition (`200ms`) |
| **Active / Pressed**| `active:scale-95 active:bg-[#5A4AD1]` | Tactile click compression feedback |
| **Focus-Visible** | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]` | Keyboard navigation outline for WCAG AA compliance |
| **Disabled** | `disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none` | Grayed out, non-interactive state |
| **Loading** | `animate-pulse pointer-events-none` + `<Spinner />` | Async pending state with loading indicator |
| **Error / Invalid** | `border-red-500 text-red-500 focus:ring-red-500/20` | Form validation failure with red error text |

---

## 5. Mobile-First Responsive Grid & Layout Architecture

### **Responsive Breakpoints**:
- **`xs`** (`< 640px`): Mobile Phones (Single-column layout, bottom sticky CTA bars, sliding drawer menus).
- **`sm`** (`640px`): Mobile Landscape / Small Tablets (2-column metric cards).
- **`md`** (`768px`): Tablets (Left sidebar collapses into slide-over hamburger drawer).
- **`lg`** (`1024px`): Laptops (Full sidebar visible, 2 to 3-column product catalog grid).
- **`xl`** (`1280px`): Standard Desktop (Full dashboard grid with right recommendations widget).
- **`2xl`** (`1536px`): Large Displays (`1440px` centered container limit).

### **Mobile Touch Optimization Rules**:
1. **Touch Target Size**: All buttons, icons, and tab triggers must have a minimum hit area of **`44px x 44px`** (`min-h-[44px] min-w-[44px]`).
2. **Mobile Navigation**: On screens `< 768px`, the dark navy sidebar collapses into a slide-over mobile drawer triggered by a top-left hamburger menu button.
3. **Mobile Sticky Action Bar**: On vendor profile and product catalog pages, primary CTA buttons ("Request RFQ", "Contact Vendor") stay fixed at the bottom of the screen on mobile devices (`fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#0B1021]/90 backdrop-blur-md border-t z-30`).
4. **Horizontal Scroll Containers**: Tables and filter tabs on mobile support smooth touch swipe scrolling (`overflow-x-auto snap-x scrollbar-none`).

---

## 6. Z-Index Elevation Stack Scale

To prevent UI layering bugs across all 17 modules:

```css
--z-base: 0;        /* Main content cards, product grids, text */
--z-sticky: 20;     /* Sticky Top Navbar & Mobile Bottom CTA Bar */
--z-dropdown: 30;   /* Select options, search suggestions, popovers */
--z-drawer: 40;     /* Mobile sidebar drawer, filter drawer, chat drawer */
--z-modal: 50;      /* Fullscreen media lightboxes, RFQ modals */
--z-toast: 60;      /* Alert banners & toast notifications */
```

---

## 7. Accessibility Standards (WCAG 2.2 AA Compliance)

1. **Color Contrast**: All body text maintains a contrast ratio of $\ge 4.5:1$ against light (`#F6F8FD`) and dark (`#0B1021`) surfaces.
2. **Keyboard Operability**: Users can navigate all tabs, inputs, modals, and tables using `Tab`, `Enter`, `Space`, and `Escape` keys.
3. **ARIA Labels**: Interactive icon-only buttons (e.g., notification bell, search trigger, close modal) must include explicit `aria-label` attributes.

---

## 8. UI Patterns & Custom Utility Classes

### ✨ Glassmorphism Panels (`.glass-panel`)
All modal dialogs, search containers, and feature cards should use the `.glass-panel` utility for backdrop-blurred structures:
* **Light Mode**: `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(229, 231, 235, 0.8);`
* **Dark Mode**: `background: rgba(21, 29, 48, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(31, 42, 64, 0.8);`

### 🌌 Grid Background Patterns (`.bg-grid-pattern`)
For main dashboard backdrops and hero containers:
* **Light Mode**: `background-image: radial-gradient(circle, rgba(15, 23, 42, 0.04) 1px, transparent 1px); background-size: 24px 24px;`
* **Dark Mode**: `background-image: radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 24px 24px;`

### 🔘 Standard Button Component Variants
1. **Primary Purple Button (`.btn-purple-primary`)**:
   `min-h-[44px] bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white font-semibold px-5 py-2.5 rounded-xl shadow-card hover:shadow-hover transition-all duration-200 active:scale-95`
2. **Secondary Outline Button (`.btn-outline-secondary`)**:
   `min-h-[44px] bg-transparent border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:bg-purple-50 dark:hover:bg-slate-800/60 font-semibold px-5 py-2.5 rounded-xl transition-all`
3. **Accent Cyan Button (`.btn-cyan-accent`)**:
   `min-h-[44px] bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold px-5 py-2.5 rounded-xl transition-all`

### 📝 Standardized Form Input Classes
```html
<input 
  type="text" 
  className="w-full min-h-[44px] bg-white dark:bg-[#0B1021]/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 rounded-xl px-4 py-2.5 outline-none transition-all duration-200"
/>
```

### 🪟 Modal Overlay Backdrop (`.modal-overlay`)
All modal dialogs across every module must use a consistent full-screen backdrop overlay:
* **Backdrop**: `position: fixed; inset: 0; z-index: var(--z-modal); background-color: rgba(11, 16, 33, 0.7); backdrop-filter: blur(12px);`
* **Centering**: `display: flex; align-items: center; justify-content: center; padding: 1.5rem;`
* **Click-to-Close**: Clicking the backdrop area (outside the modal panel) must close the modal via `onClick={(e) => e.target === e.currentTarget && onClose()}`.
* **Entrance Animation**: Apply `animation: fadeIn 0.3s ease-out` to the overlay.

### 🏔️ Modal Panel Container (`.modal-panel`)
The inner modal card must follow this specification:
```css
.modal-panel {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);        /* 16px */
  width: 100%;
  max-width: 620px;                        /* Review modals */
  /* max-width: 780px;                     — Edit/form-heavy modals */
  max-height: 92vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.4),
              0 0 40px rgba(108, 92, 231, 0.08);
  animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
```
* **Max-Width Rule**: Review/rating modals → `620px`. Product edit or form-heavy modals → `780px`.
* **Max-Height**: Always `92vh` to prevent overflow on smaller screens.

### 🎨 Modal Header Banner (`.modal-header-banner`)
Modal headers must use a gradient banner with dot-grid texture — **not** a flat plain bar:
```css
.modal-header-banner {
  position: relative;
  background: linear-gradient(135deg, #1A1838 0%, #151D30 60%, #0B1021 100%);
  padding: 1.5rem 1.75rem;
  border-bottom: 1px solid var(--border-card);
  overflow: hidden;
}

/* Dot-grid texture overlay */
.modal-header-banner::before {
  content: '';
  position: absolute; inset: 0; opacity: 0.04;
  background-image: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px);
  background-size: 20px 20px;
}
```
* **Product Edit Modals**: Include a **product image thumbnail** (72×72px, `border-radius: 14px`, `border: 2px solid rgba(108,92,231,0.3)`) alongside the title.
* **Review Modals**: Include a star emoji and vendor name highlighted in `#A78BFA` purple.
* **Close Button**: `36×36px`, `border-radius: 10px`, ghost background `rgba(255,255,255,0.06)` → on hover turn red `rgba(239,68,68,0.15)` with color `#F87171`.

### 🗂️ Tabbed Section Navigation (for multi-section modals)
Form-heavy modals (e.g., Product Edit) must split content into **tabbed sections** instead of a single scroll dump:
```css
.modal-tab-bar {
  display: flex;
  gap: 0.25rem;
  padding: 0.75rem 1.75rem 0;
  border-bottom: 1px solid var(--border-card);
  background-color: var(--bg-card);
}

.modal-tab {
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
  font-family: var(--font-heading);
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: -1px;
}

.modal-tab--active {
  font-weight: 700;
  color: var(--primary-purple);
  border-bottom-color: var(--primary-purple);
}
```
* Tabs must include an **emoji icon** + label (e.g., `📦 Product Details`, `💰 Pricing & Stock`, `🖼 Media & Specs`).
* Show a **step indicator** in the footer (e.g., "Step 1 of 3") using `font-mono` at `0.7rem`.

### 💊 Chip / Pill Selector Buttons (for enum choices)
Instead of plain `<select>` dropdowns for short option lists (unit type, stock status), use **inline chip selectors**:
```css
.chip-selector {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  min-height: 38px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}

/* Default state */
.chip-selector--default {
  border: 1px solid var(--border-card);
  background-color: var(--bg-main);
  color: var(--text-secondary);
}

/* Active/selected state */
.chip-selector--active {
  border: 2px solid var(--primary-purple);
  background-color: var(--primary-purple-light);
  color: var(--primary-purple);
}
```
* **Stock Status Chips** use semantic colors: `In Stock` → green (`#22C55E`), `Low Stock` → amber (`#F59E0B`), `Made to Order` → purple (`#6C5CE7`).

### 📊 Live Summary Card (for pricing/metrics preview)
Form modals that edit numeric data must include a **live summary card** that updates in real-time:
```css
.live-summary-card {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background-color: rgba(108, 92, 231, 0.06);
  border: 1px solid rgba(108, 92, 231, 0.12);
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.live-summary-card__metric {
  text-align: center;
}

.live-summary-card__value {
  font-size: 1.1rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--primary-purple);            /* or semantic color */
}

.live-summary-card__label {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
}
```
* Metric values use `font-mono` bold for numerical emphasis.
* Sections are divided by `1px` vertical separators in `var(--border-card)`.

### ⭐ Star Rating Component (for review/rating modals)
All star rating inputs across the platform must follow this pattern:

#### Large Overall Rating (Hero)
```css
.star-rating-hero {
  text-align: center;
  padding: 1.25rem;
  background-color: var(--bg-main);
  border-radius: 14px;
  border: 1px solid var(--border-card);
}

.star-rating-hero__star {
  font-size: 2.2rem;
  line-height: 1;
  padding: 0.15rem;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);  /* bouncy */
}

/* Active star */
.star-rating-hero__star--active {
  transform: scale(1.15);
  filter: none;
}

/* Inactive star */
.star-rating-hero__star--inactive {
  transform: scale(0.9);
  filter: grayscale(1) opacity(0.25);
}
```

#### Dynamic Rating Label Badge
Below the stars, display a context badge that changes color/text based on the rating:

| Rating | Label | Color | Emoji |
| :--- | :--- | :--- | :--- |
| **5** | Outstanding Supplier | `#22C55E` (Green) | 🏆 |
| **4** | Reliable & Good | `#6C5CE7` (Purple) | 👍 |
| **3** | Average Quality | `#F59E0B` (Amber) | ⚠️ |
| **2** | Needs Improvement | `#F97316` (Orange) | ⚡ |
| **1** | Unsatisfactory | `#EF4444` (Red) | ❌ |

Badge styling: `display: inline-flex; padding: 0.3rem 0.75rem; border-radius: 8px; background-color: {color}15; border: 1px solid {color}30; font-size: 0.75rem; font-weight: 700;`

#### Mini Star Row (for category breakdown)
```css
.star-rating-mini__star {
  font-size: 16px;
  padding: 2px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.star-rating-mini__star--active {
  color: #F59E0B;          /* Gold */
  transform: scale(1.05);
}

.star-rating-mini__star--inactive {
  color: var(--border-card);
  transform: scale(1);
}
```

### 🏷️ Category Breakdown Rating Grid
Review modals must include a **4-category breakdown grid** (not just a single overall rating):

```css
.category-breakdown {
  padding: 1rem 1.25rem;
  border-radius: 14px;
  background-color: var(--bg-main);
  border: 1px solid var(--border-card);
}

.category-breakdown__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.category-breakdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
}
```

Standard B2B vendor review categories:

| Category | Icon | Purpose |
| :--- | :--- | :--- |
| **Product Quality** | 🏭 | Manufacturing quality, material consistency, defect rate |
| **Communication** | 💬 | Responsiveness, clarity, professionalism |
| **Delivery Speed** | 🚚 | Lead time accuracy, shipping reliability, packaging |
| **Value for Money** | 💎 | Price competitiveness, cost vs quality ratio |

The overall rating auto-calculates as the **average** of all 4 category ratings.

### 🔍 Enhanced Focus Glow Ring
All form inputs inside modals must use an enhanced **purple glow ring** on focus — not just a border change:
```css
/* Focus state for modal form inputs */
input:focus, select:focus, textarea:focus {
  border-color: #6C5CE7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.12);
  outline: none;
  transition: all 0.2s;
}
```

### 📝 Modal Form Field Labels
All labels inside modals must use this consistent styling:
```css
.modal-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  font-family: var(--font-mono);
}
```
* Each label must include an **emoji icon** prefix (e.g., `📦 Product Title`, `💲 Unit Price`, `👤 Your Full Name`).

### 🔢 Character Counter (for textareas)
All textareas in modals must show a right-aligned character counter:
```css
.char-counter {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  text-align: right;
  margin-top: 0.35rem;
}

.char-counter--valid { color: var(--text-muted); }
.char-counter--short { color: #EF4444; }   /* When below minimum */
```

---

## 9. Micro-Animations & Page Transitions

### **1. Route Page Transition Wrapper (`PageTransition.jsx`)**
```jsx
import { motion } from 'framer-motion';

export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);
```

### **2. Lenis Momentum Scroll Integration**: Smooth inertia scrolling enabled across catalog grids, vendor profiles, and dashboards.
### **3. Inspira UI — Glowing AI Search Focus Border**: Rotating gradient border (`#6C5CE7` $\rightarrow$ `#0EA5E9`) on natural language AI input focus.
### **4. Card Hover Micro-Animations**: Elevation shadow + `translateY(-4px)` scale transition on card hover.

### **5. Modal Entrance Animations**
All modal dialogs must use the following two-layer animation system:

```css
/* Overlay backdrop fade */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Modal panel slide-up with subtle scale */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```
* **Overlay**: `animation: fadeIn 0.3s ease-out`
* **Panel**: `animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)` — uses a deceleration curve for a premium feel.
* **Tab Content Switch**: Each section tab change must apply `animation: fadeIn 0.25s ease` to the new content for a smooth crossfade.

### **6. Star Rating Bounce Animation**
Star interactions use a **bouncy spring curve** for a satisfying tactile feel:
```css
.star:hover, .star--active {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* This overshoots slightly then settles — feels like a physical tap */
}
```

### **7. Close Button Hover Transition**
Modal close buttons must transition to a **red danger state** on hover:
```css
.modal-close:hover {
  background-color: rgba(239, 68, 68, 0.15);
  color: #F87171;
  border-color: rgba(239, 68, 68, 0.3);
  transition: all 0.2s;
}
```

---

## 10. Checklist for Teammates Building Modules

When building any route/component across all 17 modules:

1. **Backdrop**: Wrap container with `min-h-screen bg-[#F6F8FD] dark:bg-[#0B1021] bg-grid-pattern text-slate-900 dark:text-slate-100`.
2. **Mobile Responsiveness**: Ensure sidebar collapses cleanly into a hamburger drawer on screens `< 768px` and primary actions use mobile sticky bottom bars.
3. **Touch Targets**: Verify all clickable items are at least `44px x 44px`.
4. **Card Surfaces**: Use `bg-white dark:bg-[#151D30] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-card hover:shadow-hover transition-all`.
5. **Component States**: Implement Hover, Focus-Visible, Disabled, Loading, and Error states.
6. **Accessibility**: Verify ARIA labels on icon buttons and keyboard `Tab` navigation.
7. **Modal Overlays**: Use `rgba(11,16,33,0.7)` backdrop with `backdrop-filter: blur(12px)` and click-outside-to-close behavior.
8. **Modal Headers**: Use gradient banner with dot-grid texture — never a plain flat header bar.
9. **Modal Forms**: Split form-heavy modals into tabbed sections with step indicators. Never dump all fields in a single scroll.
10. **Star Ratings**: Use bouncy spring animation (`cubic-bezier(0.34, 1.56, 0.64, 1)`) on star interactions with dynamic label badges.
11. **Focus Glow**: All modal inputs must show `box-shadow: 0 0 0 3px rgba(108,92,231,0.12)` on focus — not just a border color change.
12. **Labels with Icons**: Modal form labels must use `font-mono`, uppercase, `0.65rem`, with an emoji icon prefix.
13. **Chip Selectors**: Use inline chip/pill buttons for short option lists (units, stock status) instead of plain `<select>` dropdowns.
14. **Live Summary**: Edit modals with numeric data must show a real-time summary card reflecting current values.
15. **Review Categories**: Review modals must include a 4-category breakdown (Product Quality, Communication, Delivery, Value for Money) — not just a single overall rating.

---

## 11. Modal & Overlay Component Standards — Anti-Patterns to Avoid

This section documents specific **anti-patterns** that were identified during UI review and must be avoided by all team members.

### ❌ Anti-Patterns (DO NOT DO)

| # | Anti-Pattern | Why It Fails | Correct Pattern |
| :--- | :--- | :--- | :--- |
| 1 | **Single-scroll form dump** — dumping all form fields in one long scrollable area | No visual hierarchy, overwhelming, poor UX | Split into **tabbed sections** with step indicator |
| 2 | **Plain flat modal header** — just a title and close button on a flat background | Looks generic, no visual distinction | Use **gradient banner** with dot-grid texture and product preview |
| 3 | **No product image preview** when editing a product | User loses context of what they're editing | Show a **72×72px thumbnail** in the header banner |
| 4 | **Single overall rating** for vendor reviews | Lacks granularity, not B2B standard | Use **4-category breakdown** (Quality, Communication, Delivery, Value) |
| 5 | **Plain `<select>` dropdown** for 3-5 options | Unnecessary interaction, hides options | Use **inline chip/pill selector buttons** |
| 6 | **No entrance animation** on modal open | Feels jarring, not premium | Use **fadeIn overlay + slideUp panel** with spring curve |
| 7 | **Border-only focus** on inputs | Barely noticeable, accessibility issue | Use **purple glow ring** (`box-shadow: 0 0 0 3px rgba(108,92,231,0.12)`) |
| 8 | **Cramped spacing** — fields jammed with `space-y-2` or less | Feels claustrophobic, hard to read | Use `gap: 1.25rem` between field groups, `1.75rem` horizontal padding |
| 9 | **Tiny textarea** — `rows={2}` or `rows={3}` | Unusable for meaningful input | Minimum `rows={5}` with `min-height: 130px` and `resize: vertical` |
| 10 | **No character counter** on textareas | User doesn't know length limits | Add right-aligned `font-mono` counter showing `{current} / {max}` |
| 11 | **Instant close button** — no hover danger state | No visual feedback | Close button must turn **red on hover** (`rgba(239,68,68,0.15)`) |
| 12 | **Static stars** with no animation | Feels lifeless, cheap | Stars must use **bouncy scale animation** on click/hover |

### ✅ Reference Implementations

All team members should reference these two components as the **gold-standard** modal implementations:

1. **`frontend/src/components/catalog/ProductEditModal.jsx`** — Demonstrates:
   - 3-tab layout (Product Details → Pricing & Stock → Media & Specs)
   - Gradient header banner with product image thumbnail and SKU/status badges
   - Inline chip selectors for unit type and stock status
   - Live summary card with real-time pricing/MOQ/lead-time/stock preview
   - Step indicator footer

2. **`frontend/src/components/vendor/VendorReviewModal.jsx`** — Demonstrates:
   - Large bouncy star rating with dynamic label badge (Outstanding → Unsatisfactory)
   - 4-category breakdown grid (Product Quality, Communication, Delivery, Value for Money)
   - Auto-calculated overall rating from category averages
   - Reviewer info fields with emoji-labeled `font-mono` labels
   - Character counter on feedback textarea
   - Vendor name highlighted in purple in header

3. **`frontend/src/components/layout/Header.jsx` (Notification Popover)** — Demonstrates:
   - Dark gradient header banner with dot-grid texture overlay
   - Live purple pulse indicator dot and category color rails
   - Unread pulse dot, high-contrast text hierarchy, hover elevation
   - Click-outside-to-close via `useRef` + `useEffect`

---

## 12. Popover & Dropdown Component Standards

> All popover overlays and floating panels must follow these specs.

### Popover Container
`border-radius: 20px`, `box-shadow: 0 25px 60px -12px rgba(0,0,0,0.4)`, `animation: popoverSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)`. Max-width: Notifications `420px`, Search `480px`, Menus `240px`.

### Popover Header (Dark Gradient Banner)
Same as modal headers: `linear-gradient(135deg, #1A1838, #151D30, #0B1021)` with dot-grid texture. Title: `font-heading 0.95rem 800 #F8FAFC`. Live pulse dot. Ghost action button.

### Popover Item Cards
Category color rail (`3.5px` left strip), icon (`36×36`), title (`#0F172A 700`), description (`#334155 500`), time (`font-mono #64748B`), unread pulse dot, hover elevation.

### Required: Click-Outside-to-Close
All popovers must use `useRef` + `useEffect` + `mousedown` listener.

---

## 13. CSS Variable Registration Protocol

All components must use variables from `index.css`. New tokens: define in `:root` → add dark mode override → document here.

| Category | Variables |
|---|---|
| **Brand** | `--primary-purple`, `--primary-purple-hover`, `--primary-purple-light` |
| **Notifications** | `--plum/tint/ink`, `--rust/tint/ink`, `--ochre/tint/ink`, `--moss/tint/ink` |
| **Aliases** | `--bg`, `--card`, `--line`, `--ink-soft`, `--ink-faint` |

---

## 14. Checklist Additions

16. **Popovers**: Dark gradient header, color rails, unread dots, hover elevation, click-outside-to-close. See Section 12.
17. **CSS Variables**: Use registered tokens only. New tokens → add to `index.css` `:root` AND this document.
