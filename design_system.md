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

---

## 10. Checklist for Teammates Building Modules

When building any route/component across all 17 modules:

1. **Backdrop**: Wrap container with `min-h-screen bg-[#F6F8FD] dark:bg-[#0B1021] bg-grid-pattern text-slate-900 dark:text-slate-100`.
2. **Mobile Responsiveness**: Ensure sidebar collapses cleanly into a hamburger drawer on screens `< 768px` and primary actions use mobile sticky bottom bars.
3. **Touch Targets**: Verify all clickable items are at least `44px x 44px`.
4. **Card Surfaces**: Use `bg-white dark:bg-[#151D30] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-card hover:shadow-hover transition-all`.
5. **Component States**: Implement Hover, Focus-Visible, Disabled, Loading, and Error states.
6. **Accessibility**: Verify ARIA labels on icon buttons and keyboard `Tab` navigation.
