# CLAUDE.md - State Management Architecture

This document provides context for Claude Code when working with Zustand stores in the Exams Viewer application.

## Overview

The `/src/stores` directory contains all Zustand state management stores with localStorage persistence. The architecture provides a clean, type-safe, and performant state management solution with automatic persistence and conflict resolution.

## Store Architecture

```
stores/
├── examStore.ts           # Exam data, questions, progress, and exam mode
├── settingsStore.ts       # User preferences and application settings  
└── statisticsStore.ts     # Session tracking and performance analytics
```

## Core Stores

### ExamStore (`examStore.ts`)
**Primary responsibility**: Exam data management, question states, progress tracking, and exam mode functionality.

**Key State:**
```typescript
interface ExamStore {
  // Exam Data
  selectedExam: string | null;
  examData: ExamData | null;
  examInfo: ExamInfo | null;
  
  // Question Management  
  currentQuestion: number;
  questionStates: Record<string, QuestionState>;
  
  // Progress Tracking
  progress: ExamProgress;
  
  // Exam Mode System
  examState: ExamState;
  
  // Navigation & UI
  showSidebar: boolean;
  searchTerm: string;
  filters: SearchFilters;
}
```

**Key Actions:**
- `loadExam()`: Load exam data with error handling and validation
- `setCurrentQuestion()`: Navigate between questions with state preservation
- `updateQuestionState()`: Handle answer selection with exam mode considerations
- `startExamMode()`: Initialize exam mode with configuration
- `finishExamMode()`: Complete exam and calculate results
- `resetExam()`: Clear all question states and restart
- `toggleFavorite()`: Manage favorite questions
- `updateNotes()`: Handle question annotations

**Exam Mode Features:**
- **Phase Management**: config → active → completed
- **Timer Integration**: Configurable timer with auto-submission
- **Answer Hiding**: Strict feedback control during active exams
- **Question Selection**: Smart filtering with customizable question counts
- **Results Calculation**: Comprehensive scoring and analytics

### SettingsStore (`settingsStore.ts`)
**Primary responsibility**: User preferences, UI settings, and modal state management.

**Key State:**
```typescript
interface SettingsStore {
  // User Preferences
  settings: UserSettings;
  
  // UI State
  theme: 'light' | 'dark' | 'system';
  isMobile: boolean;
  
  // Modal Management
  modals: {
    settings: boolean;
    statistics: boolean;
    export: boolean;
    favorites: boolean;
    examConfig: boolean;
    examResults: boolean;
  };
  
  // Feature Flags
  soundEnabled: boolean;
  keyboardShortcutsEnabled: boolean;
}
```

**Key Actions:**
- `updateSettings()`: Persist user preferences with validation
- `toggleTheme()`: Switch between light/dark/system themes
- `openModal()` / `closeModal()`: Modal state management
- `updateMobileState()`: Responsive design state updates
- `resetSettings()`: Restore default preferences

**Settings Categories:**
- **Display**: Theme, font size, card view preferences
- **Behavior**: Sound effects, keyboard shortcuts, auto-save
- **Exam**: Default timer, question counts, difficulty filters
- **Export**: Default formats and filtering options

### StatisticsStore (`statisticsStore.ts`)
**Primary responsibility**: Session tracking, performance analytics, and exam statistics.

**Key State:**
```typescript
interface StatisticsStore {
  // Session Management
  currentSession: ExamSession | null;
  sessions: ExamSession[];
  
  // Performance Analytics
  statistics: Statistics;
  
  // Tracking State  
  sessionStartTime: number | null;
  lastActivity: number;
  
  // Export State
  exportInProgress: boolean;
}
```

**Key Actions:**
- `startSession()`: Initialize new session with exam context
- `updateSessionProgress()`: Real-time progress tracking during interactions
- `finalizeSession()`: Complete session with final statistics
- `calculateStatistics()`: Generate comprehensive analytics
- `exportStatistics()`: Export session data in various formats
- `clearStatistics()`: Reset all statistical data

**Analytics Features:**
- **Session Tracking**: Start time, duration, question interactions
- **Performance Metrics**: Accuracy rates, time per question, improvement trends
- **Exam Statistics**: Completion rates, average scores, difficulty analysis
- **Export Capabilities**: JSON, CSV, PDF export with custom filtering

## State Management Patterns

### Persistence Strategy
All stores automatically persist to localStorage with conflict resolution:

```typescript
// Automatic persistence with error handling
const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      // Store implementation
    }),
    {
      name: 'exam-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Conflict resolution and validation
      }
    }
  )
);
```

### Computed Values
Efficient derived state for performance optimization:

```typescript
// Example computed values in examStore
get progress() {
  const { questionStates, examData } = get();
  return calculateProgress(questionStates, examData);
},

get examModeProgress() {
  const { examState, questionStates } = get();
  if (examState.mode !== 'exam') return null;
  return calculateExamProgress(examState.selectedQuestions, questionStates);
}
```

### Action Patterns
Consistent action methods with error handling and validation:

```typescript
// Standard action pattern
setCurrentQuestion: (questionIndex: number) => {
  const state = get();
  
  // Validation
  if (!state.examData || questionIndex < 0) return;
  
  // State update with side effects
  set({ currentQuestion: questionIndex });
  
  // Statistics tracking
  if (state.currentSession) {
    useStatisticsStore.getState().updateSessionProgress();
  }
}
```

### Cross-Store Communication
Stores interact through direct method calls and shared state:

```typescript
// Example: Starting exam mode affects multiple stores
startExamMode: (config: ExamConfig) => {
  // Update exam store
  set({ examState: { mode: 'exam', phase: 'active', config } });
  
  // Update statistics store  
  useStatisticsStore.getState().startSession({
    examCode: get().selectedExam,
    mode: 'exam'
  });
  
  // Update settings for exam-specific behavior
  useSettingsStore.getState().updateSettings({
    soundEnabled: false // Disable sounds during exam
  });
}
```

## Mobile State Management

### Responsive State Updates
Stores automatically adapt to mobile contexts:

```typescript
// Mobile-aware state management
const updateMobileState = () => {
  const isMobile = window.innerWidth < 768;
  set({ 
    isMobile,
    showSidebar: isMobile ? false : get().showSidebar // Auto-collapse on mobile
  });
};
```

### Touch Interaction Tracking
Enhanced mobile interaction tracking:

```typescript
// Mobile-specific interaction logging
updateQuestionState: (questionId: string, newState: Partial<QuestionState>) => {
  // Standard state update
  set(state => ({
    questionStates: {
      ...state.questionStates,
      [questionId]: { ...state.questionStates[questionId], ...newState }
    }
  }));
  
  // Mobile-aware statistics
  if (get().isMobile) {
    useStatisticsStore.getState().trackMobileInteraction({
      questionId,
      interactionType: 'answer',
      timestamp: Date.now()
    });
  }
}
```

## Performance Optimizations

### Selective Subscriptions
Components subscribe only to needed state slices:

```typescript
// Efficient state subscription
const currentQuestion = useExamStore(state => state.currentQuestion);
const progress = useExamStore(state => state.progress);
// Avoid: const store = useExamStore(); (subscribes to everything)
```

### Batched Updates
Multiple state changes are batched for performance:

```typescript
// Batched state updates
const resetExam = () => {
  set(state => ({
    currentQuestion: 0,
    questionStates: {},
    progress: initialProgress,
    searchTerm: '',
    filters: initialFilters
  }));
};
```

### Memory Management
Proper cleanup and memory management:

```typescript
// Cleanup old sessions
const cleanupOldSessions = () => {
  const maxSessions = 100;
  const { sessions } = get();
  
  if (sessions.length > maxSessions) {
    set({
      sessions: sessions
        .sort((a, b) => b.startTime - a.startTime)
        .slice(0, maxSessions)
    });
  }
};
```

## Development Guidelines

### Adding New State
1. Choose appropriate store based on responsibility
2. Define TypeScript interfaces in types/index.ts
3. Add computed values for derived state
4. Implement proper validation and error handling
5. Consider mobile-specific behavior
6. Add persistence if needed

### Modifying Store Logic
1. Understand current state shape and actions
2. Maintain backward compatibility for persistence
3. Test state transitions thoroughly
4. Consider cross-store implications
5. Update TypeScript interfaces
6. Test mobile and desktop behavior

### Performance Considerations
1. Use selective state subscriptions in components
2. Batch multiple state updates
3. Implement proper cleanup for large datasets
4. Consider computed values for expensive calculations
5. Profile state update performance
6. Monitor localStorage usage

### Testing Store Logic
1. Test all action methods with various inputs
2. Verify persistence and rehydration behavior
3. Test cross-store interactions
4. Validate mobile-specific state changes
5. Test error handling and edge cases

Last updated: January 2025 - Enhanced with exam mode system and mobile optimization features