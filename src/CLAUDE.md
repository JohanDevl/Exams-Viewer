# CLAUDE.md - Source Code Architecture

This document provides context for Claude Code when working with the source code of the Exams Viewer application.

## Overview

This is the main source directory (`/src`) for the Next.js 15 application with App Router. The application is built with React 19, TypeScript, and follows modern React patterns.

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
├── components/             # React components organized by feature
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries and configuration
├── stores/                 # Zustand state management stores
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Key Architecture Patterns

### State Management
- **Zustand**: Primary state management with localStorage persistence
- **Stores**: `examStore`, `settingsStore`, `statisticsStore`
- **Persistence**: All stores automatically persist to localStorage with conflict resolution

### Component Organization
- **Feature-based**: Components grouped by functionality (exam/, modal/, navigation/)
- **Reusable UI**: Radix UI-based components in ui/ folder
- **Providers**: Context providers for global functionality

### TypeScript Integration
- **Strict typing**: All components and functions are fully typed
- **Shared types**: Centralized type definitions in types/index.ts
- **Interface consistency**: Consistent interfaces across stores and components

## Development Patterns

### Modern React
- **App Router**: Next.js 15 App Router for routing
- **Server Components**: Where applicable, with client components clearly marked
- **Hooks**: Custom hooks for reusable logic (keyboard shortcuts, sound effects, etc.)

### State Updates
- **Immutable updates**: Using Zustand patterns for state mutations
- **Computed values**: Derived state for performance optimization
- **Action-based**: Clear action methods for state changes

### Component Props
- **TypeScript interfaces**: All props are strictly typed
- **Default values**: Sensible defaults where applicable
- **Optional props**: Clear distinction between required and optional props

## Performance Considerations

### Code Splitting
- **Dynamic imports**: For heavy components and features
- **Lazy loading**: Components loaded on demand
- **Bundle optimization**: Tree shaking and dead code elimination

### State Optimization
- **Selective subscriptions**: Components subscribe only to needed state slices
- **Memoization**: React.memo and useMemo where beneficial
- **Efficient updates**: Batch updates and avoid unnecessary re-renders

## Mobile Optimization

### Responsive Design
- **Tailwind CSS**: Mobile-first responsive design
- **Touch optimization**: Enhanced touch interactions
- **Viewport handling**: Proper mobile viewport configuration

### Performance
- **Scroll optimization**: Advanced scroll lock system for mobile
- **Touch events**: Proper touch event handling and prevention
- **Hardware acceleration**: CSS transforms for smooth animations

## Security Considerations

### Client-side Security
- **Input validation**: All user inputs are validated
- **XSS prevention**: Proper HTML escaping and sanitization
- **Data integrity**: State validation and error boundaries

### Data Handling
- **Local storage**: Safe localStorage usage with error handling
- **Type safety**: TypeScript prevents many runtime errors
- **Error boundaries**: Comprehensive error handling throughout the app

## Integration Points

### External Dependencies
- **Next.js 15**: Latest App Router features
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Zustand**: Lightweight state management

### Build System
- **TypeScript**: Full TypeScript compilation
- **ESLint**: Code quality and consistency
- **Turbopack**: Fast development builds

## Development Guidelines

### When Adding New Features
1. Check existing patterns in relevant component folders
2. Use TypeScript interfaces from types/index.ts
3. Follow Zustand patterns for state management
4. Ensure mobile responsiveness with Tailwind classes
5. Add proper error boundaries and validation

### Component Creation
1. Use existing UI components from ui/ folder
2. Follow naming conventions (PascalCase for components)
3. Add proper TypeScript interfaces
4. Include proper accessibility attributes (ARIA labels)
5. Test on both desktop and mobile viewports

### State Management
1. Use appropriate Zustand store (exam, settings, statistics)
2. Follow immutable update patterns
3. Add proper TypeScript interfaces
4. Consider localStorage persistence implications
5. Test state persistence across browser sessions

Last updated: January 2025