# CLAUDE.md - Components Architecture

This document provides context for Claude Code when working with React components in the Exams Viewer application.

## Overview

The `/src/components` directory contains all React components organized by feature and responsibility. The architecture follows modern React patterns with TypeScript, Zustand state management, and mobile-first responsive design.

## Directory Structure

```
components/
├── exam/              # Exam-specific functionality components
├── layout/            # Application layout and structure components  
├── modals/            # Dialog and modal components
├── navigation/        # Navigation and routing components
├── providers/         # Context providers and global functionality
├── question/          # Question display and interaction components
└── ui/                # Reusable UI primitives (Radix UI based)
```

## Component Categories

### Exam Components (`exam/`)
Core exam functionality and management:

- **ExamHeader.tsx**: Displays exam information, progress, and timer integration
- **ExamSelector.tsx**: Exam selection interface with search and filtering
- **ExamTimer.tsx**: Comprehensive timer with warnings and manual finish capabilities
- **ExamViewer.tsx**: Main exam viewing container with mode-aware rendering

**Key Features:**
- Exam mode support with strict feedback control
- Timer integration with visual warnings and auto-submission
- Progress tracking (exam questions vs all questions)
- Mobile-optimized touch interactions

### Layout Components (`layout/`)
Application structure and main containers:

- **AppHeader.tsx**: Top navigation bar with responsive design and exam status
- **MainContent.tsx**: Main content wrapper with proper mobile handling

**Design Patterns:**
- Responsive navigation with mobile hamburger menu
- Context-aware header display based on exam state
- Proper z-index management for overlays

### Modal Components (`modals/`)
Dialog interfaces and overlays:

- **ExamConfigModal.tsx**: Exam setup and configuration interface
- **ExamResultsModal.tsx**: Post-exam results display with score breakdown  
- **ExamReviewModal.tsx**: Detailed question-by-question review
- **ExportModal.tsx**: Data export functionality with format options
- **FavoritesModal.tsx**: Favorites management and organization
- **SettingsModal.tsx**: Application settings and preferences
- **StatisticsModal.tsx**: Performance analytics and session tracking

**Modal Patterns:**
- Radix UI Dialog primitives for accessibility
- Mobile-responsive sizing and positioning
- Proper keyboard navigation and focus management
- State management integration with Zustand stores

### Navigation Components (`navigation/`)
User navigation and movement controls:

- **MobileNavigationBar.tsx**: Mobile bottom navigation with touch optimization
- **NavigationControls.tsx**: Question navigation buttons and shortcuts
- **Sidebar.tsx**: Main navigation sidebar with native scroll (v5.1.0 enhancement)

**Navigation Features:**
- Context-aware navigation (exam mode vs study mode)
- Keyboard shortcuts integration
- Mobile-first touch interactions
- Revolutionary sidebar with body scroll isolation

### Provider Components (`providers/`)
Global functionality and context providers:

- **HomeSessionFinalizer.tsx**: Automatic session finalization on home navigation
- **KeyboardShortcutsProvider.tsx**: Global keyboard shortcut handling
- **ModalsProvider.tsx**: Modal state management and coordination
- **SessionPersistenceProvider.tsx**: Session data persistence and restoration
- **ThemeInitializer.tsx**: Theme initialization and system preference detection
- **ToastProvider.tsx**: Toast notification system with sound effects

**Provider Patterns:**
- React Context for global state
- Effect-based initialization
- Cleanup and persistence management
- Mobile-aware behavior adjustments

### Question Components (`question/`)
Question display and interaction logic:

- **QuestionDisplay.tsx**: Main question rendering with answer options and feedback

**Question Features:**
- Multiple question type support (single choice, multiple choice)
- Answer state management with exam mode considerations
- Community comments integration
- Mobile-optimized touch interactions with scroll lock
- Feedback control system (hide answers during exam mode)

### UI Components (`ui/`)
Reusable UI primitives based on Radix UI:

**Form Components:**
- button.tsx, input.tsx, label.tsx, checkbox.tsx, radio-group.tsx, select.tsx, switch.tsx

**Layout Components:**
- card.tsx, separator.tsx, dialog.tsx, tabs.tsx

**Feedback Components:**
- badge.tsx, progress.tsx, Toast.tsx

**Utility Components:**
- ClientOnly.tsx, RaycastLogo.tsx, scroll-area.tsx

**UI Patterns:**
- Radix UI primitives for accessibility
- Tailwind CSS for consistent styling
- Variant-based styling with class variance authority
- Mobile-first responsive design

## Component Development Patterns

### State Integration
```typescript
// Zustand store integration pattern
const { examState, setExamState } = useExamStore();
const { settings } = useSettingsStore();
```

### Props and TypeScript
```typescript
// Proper TypeScript interface definition
interface ComponentProps {
  required: string;
  optional?: boolean;
  children?: React.ReactNode;
}
```

### Mobile Optimization
```typescript
// Mobile-aware rendering
const isMobile = useIsMobile();
return isMobile ? <MobileComponent /> : <DesktopComponent />;
```

### Event Handling
```typescript
// Proper event handling with TypeScript
const handleClick = useCallback((event: React.MouseEvent) => {
  event.preventDefault();
  // Handle click logic
}, [dependencies]);
```

## Responsive Design Patterns

### Mobile-First Approach
- Base styles for mobile (< 768px)
- Progressive enhancement with `md:` prefixes
- Touch-optimized interaction areas (min 44px)
- Proper viewport handling

### Navigation Patterns
- Collapsible sidebar on mobile
- Bottom navigation bar for primary actions
- Hamburger menu for secondary navigation
- Context-aware navigation based on screen size

### Modal Adaptations
- Full-screen modals on mobile
- Proper keyboard handling
- Touch-friendly button sizes
- Scroll behavior management

## Accessibility Standards

### ARIA Integration
- Proper ARIA labels and descriptions
- Role definitions for custom components
- Focus management in modals and navigation
- Screen reader announcements for state changes

### Keyboard Navigation
- Tab order management
- Keyboard shortcuts for power users
- Focus visible indicators
- Escape key handling in modals

## Performance Optimization

### Component Optimization
- React.memo for expensive components
- useMemo for expensive calculations
- useCallback for stable references
- Proper dependency arrays

### Rendering Optimization
- Conditional rendering for mobile vs desktop
- Lazy loading for heavy components
- Virtual scrolling for long lists
- Efficient re-render patterns

## Development Guidelines

### Adding New Components
1. Choose appropriate directory based on responsibility
2. Use existing UI components from ui/ folder
3. Follow TypeScript interface patterns
4. Integrate with relevant Zustand stores
5. Ensure mobile responsiveness
6. Add proper accessibility attributes

### Modifying Existing Components  
1. Understand current state integration
2. Maintain existing mobile optimizations
3. Preserve accessibility features
4. Test on both mobile and desktop
5. Follow established naming conventions
6. Update TypeScript interfaces if needed

### Component Testing
1. Test all interactive states
2. Verify mobile touch interactions
3. Check keyboard navigation
4. Validate accessibility with screen readers
5. Test state persistence across sessions

Last updated: January 2025 - Enhanced with v5.1.0 mobile optimizations and native sidebar navigation