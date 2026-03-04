# Architecture: 09-digital-clock-react

## Overview

A glassmorphic neon clock suite built with React 19 and Vite 6. This application provides real-time time keeping, a high-precision stopwatch, and a configurable countdown timer.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **Time Handling**: Moment.js
- **Animations**: Framer Motion 12
- **Icons**: Lucide React

## Component Logic

- **Clock Mode**: Synchronizes state with standard time intervals (1000ms).
- **Stopwatch Mode**: High-precision interval (10ms) tracking using JS timing loops.
- **Timer Mode**: Reversible state handling with completion validation.
- **Neon System**: Cascading glow effects using Tailwind v4 color tokens and native CSS filters.

## Performance

- Tree-shaken Lucide icons.
- Efficient interval cleanup to prevent memory leaks in active modes.
- Vite-optimized production build.
