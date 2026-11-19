---
name: design
description: Use this skill when building or improving website UI, layouts, colors, typography, animations, and responsive design
---

# Design

Guidelines for building and improving website UI. Follow these rules for every design task.

## 1. Layout
- Use clean layouts with proper spacing and clear visual hierarchy.
- Use a consistent grid system (e.g., 12-column grid) across pages and sections.
- Maintain consistent spacing scales (e.g., multiples of 4px/8px) and aligned gutters.

## 2. Typography
- Use a maximum of 2 Google Fonts — one for headings and one for body text.
- Use readable font sizes (body text >= 16px) and proper line height (1.4-1.7 for body).
- Establish a clear type scale for headings (h1-h6) and keep it consistent.

## 3. Colors
- Use one consistent palette: primary, secondary, accent, and background colors.
- Ensure accessible contrast ratios (WCAG AA: 4.5:1 for normal text, 3:1 for large text).
- Support dark/light mode — define colors as CSS variables or theme tokens and test both modes.

## 4. Responsive
- Take a mobile-first approach — write base styles for mobile, then enhance with min-width media queries.
- Test on mobile, tablet, and desktop breakpoints (e.g., 375px, 768px, 1024px, 1440px).

## 5. Components
- Build modern buttons, cards, navbar, and footer components.
- Add smooth hover effects and transitions (150-300ms, ease-in-out).
- Keep component styles consistent and reusable.

## 6. Animations
- Use subtle animations only, such as fade-in and scroll reveal.
- Avoid heavy, distracting effects (parallax overload, excessive motion, autoplay).
- Respect prefers-reduced-motion media query.

## 7. Quality
- Avoid a generic template look — create unique, professional designs.
- Pay attention to details: spacing, alignment, icon consistency, and meaningful imagery.

## 8. Accessibility
- Use alt text on images, semantic HTML (header, nav, main, section, footer), and keyboard-friendly elements.
- Ensure focus-visible states, proper heading order, and ARIA labels where needed.

## 9. Output
- At the end of every design task, give a short summary of what was built/changed and which files changed.
