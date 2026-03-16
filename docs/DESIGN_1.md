# Design System: 09-digital-clock-react

## Visual Philosophy

The design follows a **Neon Glassmorphic / Cyberpunk Dashboard** aesthetic. It prioritizes high-contrast glow effects against deep slate backgrounds, using blurred glass overlays for depth.

## Design Patterns

- **Glassmorphism**: 50% opacity backgrounds with `backdrop-blur-xl`.
- **Neon Glow**: Selective drop-shadows using HSL values synchronized with regional highlight colors (Emerald for Clock, Blue for Stopwatch, Amber for Timer).
- **Typography**: Monospaced font family (`Inter` or `Roboto Mono`) for numeric precision.

## Color Palette

- **Terminal Void**: Zinc-950 (#09090b)
- **Dashboard Surface**: Zinc-900/50 (#18181b)
- **Primary (Clock)**: Emerald-400 (#34d399)
- **Secondary (Stopwatch)**: Blue-400 (#60a5fa)
- **Tertiary (Timer)**: Amber-400 (#fbbf24)

## Interaction Design

- **Mode Switching**: Animated exit/entry transitions via Framer Motion's `AnimatePresence`.
- **Pulse Feedback**: Active modes trigger subtle glow animations on the primary display.
- **Tactile Controls**: High-contrast, rounded action buttons with active-state scaling.
