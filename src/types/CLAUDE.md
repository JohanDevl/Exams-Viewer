# CLAUDE.md - TypeScript Type Definitions

This document provides context for Claude Code when working with TypeScript types and interfaces in the Exams Viewer application.

## Overview

The `/src/types` directory contains centralized TypeScript type definitions that provide type safety and consistency across the entire application. All core types are defined in `index.ts` and imported throughout the codebase.

## Core Type Categories

### Data Structure Types
Fundamental data types for exam content and structure:

```typescript
// Question and Answer Structure
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number | number[];
  explanation?: string;
  type: 'single' | 'multiple';
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  links?: QuestionLink[];
}

interface ExamData {
  questions: Question[];
  metadata?: ExamMetadata;
}

interface ExamInfo {
  code: string;
  name: string;
  description?: string;
  questionCount: number;
  lastUpdated: string;
  categories?: string[];
  difficultyDistribution?: Record<string, number>;
}
```

### State Management Types
Types for application state and user interactions:

```typescript
// Question State Tracking
interface QuestionState {
  status: 'unanswered' | 'correct' | 'incorrect' | 'preview';
  userAnswer: number | number[] | null;
  firstAnswer: number | number[] | null; // Permanent for statistics
  isFavorite: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  notes: string;
  category?: string;
}

// Progress Tracking
interface ExamProgress {
  answered: number;
  correct: number;
  total: number;
  favorites: number;
  categorizedProgress?: Record<string, CategoryProgress>;
}

// User Answer Management
interface UserAnswer {
  questionId: string;
  answer: number | number[];
  timestamp: number;
  isCorrect: boolean;
  timeTaken?: number;
}
```

### Exam Mode System Types
Comprehensive types for exam mode functionality:

```typescript
// Exam Mode Configuration
interface ExamState {
  mode: ExamMode;
  phase: ExamPhase;
  selectedQuestions: string[];
  config: ExamConfig;
  results?: ExamResult;
  isSubmitted: boolean;
}

type ExamMode = 'study' | 'exam';
type ExamPhase = 'config' | 'active' | 'completed';

interface ExamConfig {
  questionCount: number;
  timeLimit: number; // minutes, 0 for no limit
  difficulties: ('easy' | 'medium' | 'hard')[];
  categories: string[];
  randomOrder: boolean;
}

interface TimerState {
  timeRemaining: number; // seconds
  isRunning: boolean;
  showWarning: boolean;
  warningLevel: 'none' | 'yellow' | 'orange' | 'red';
}

interface ExamResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // seconds
  completionTime: string;
  questionResults: QuestionResult[];
}
```

### Settings and Preferences Types
User configuration and application settings:

```typescript
// User Settings
interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  keyboardShortcutsEnabled: boolean;
  autoSave: boolean;
  cardView: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: 'en' | 'fr';
  
  // Exam Defaults
  defaultExamConfig: Partial<ExamConfig>;
  
  // Display Preferences
  showCommunityComments: boolean;
  showExplanations: boolean;
  showDifficulty: boolean;
  showCategories: boolean;
}

// Search and Filtering
interface SearchFilters {
  status: 'all' | 'unanswered' | 'correct' | 'incorrect' | 'favorites';
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  category: string;
  hasNotes: boolean;
  searchTerm: string;
}
```

### Statistics and Analytics Types
Performance tracking and session management:

```typescript
// Session Tracking
interface ExamSession {
  id: string;
  examCode: string;
  startTime: number;
  endTime?: number;
  mode: ExamMode;
  questionsAnswered: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // seconds
  interactions: SessionInteraction[];
}

interface SessionInteraction {
  questionId: string;
  timestamp: number;
  action: 'view' | 'answer' | 'favorite' | 'note';
  value?: any;
  timeTaken?: number;
}

// Performance Analytics
interface Statistics {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  averageScore: number;
  averageTimePerQuestion: number;
  improvementTrend: number;
  difficultyBreakdown: Record<string, CategoryStats>;
  categoryBreakdown: Record<string, CategoryStats>;
  sessionHistory: ExamSession[];
}

interface CategoryStats {
  total: number;
  correct: number;
  accuracy: number;
  averageTime: number;
}
```

### Export and Integration Types
Data export and external integration:

```typescript
// Export Configuration
interface ExportOptions {
  format: 'json' | 'csv' | 'txt' | 'pdf';
  includeAnswers: boolean;
  includeExplanations: boolean;
  includeStatistics: boolean;
  includeNotes: boolean;
  filterBy: SearchFilters;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Toast and Notification System
interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### UI and Interaction Types
Component props and UI state management:

```typescript
// Modal State Management
interface ModalState {
  settings: boolean;
  statistics: boolean;
  export: boolean;
  favorites: boolean;
  examConfig: boolean;
  examResults: boolean;
  examReview: boolean;
}

// Component Props Types
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

interface QuestionDisplayProps extends BaseComponentProps {
  question: Question;
  questionState: QuestionState;
  showAnswer: boolean;
  onAnswerSelect: (answer: number | number[]) => void;
  onFavoriteToggle: () => void;
  onNotesUpdate: (notes: string) => void;
}

// Navigation and Routing
interface NavigationItem {
  label: string;
  icon: React.ComponentType;
  href?: string;
  action?: () => void;
  active?: boolean;
  disabled?: boolean;
}
```

## Type Usage Patterns

### Store Integration
How types integrate with Zustand stores:

```typescript
// Store with proper typing
interface ExamStore {
  // State
  selectedExam: string | null;
  examData: ExamData | null;
  currentQuestion: number;
  questionStates: Record<string, QuestionState>;
  
  // Actions with typed parameters
  loadExam: (examCode: string) => Promise<void>;
  updateQuestionState: (questionId: string, state: Partial<QuestionState>) => void;
  setCurrentQuestion: (index: number) => void;
}
```

### Component Props
Consistent prop typing across components:

```typescript
// Standard component prop pattern
interface ComponentProps {
  // Required props
  data: ExamData;
  onAction: (action: string) => void;
  
  // Optional props with defaults
  variant?: 'default' | 'compact';
  showDetails?: boolean;
  
  // Style props
  className?: string;
  
  // Children
  children?: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({ 
  data, 
  onAction, 
  variant = 'default',
  showDetails = true,
  className,
  children 
}) => {
  // Component implementation
};
```

### API Response Typing
Proper typing for external data:

```typescript
// API response types
interface APIResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: number;
}

// Usage in data fetching
const loadExamData = async (examCode: string): Promise<APIResponse<ExamData>> => {
  const response = await fetch(`/api/exams/${examCode}`);
  return response.json();
};
```

## Type Safety Best Practices

### Strict TypeScript Configuration
The project uses strict TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Type Guards and Validation
Proper runtime type checking:

```typescript
// Type guard functions
const isValidQuestion = (question: any): question is Question => {
  return (
    typeof question === 'object' &&
    typeof question.id === 'string' &&
    typeof question.text === 'string' &&
    Array.isArray(question.options) &&
    typeof question.correctAnswer === 'number'
  );
};

// Usage in data loading
const loadQuestions = (data: unknown): Question[] => {
  if (!Array.isArray(data)) {
    throw new Error('Invalid questions data format');
  }
  
  return data.filter(isValidQuestion);
};
```

### Generic Types
Reusable generic patterns:

```typescript
// Generic store pattern
interface Store<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  
  load: () => Promise<T>;
  update: (data: Partial<T>) => void;
  reset: () => void;
}

// Generic API pattern
interface APIEndpoint<TRequest, TResponse> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  request?: TRequest;
  response: TResponse;
}
```

## Mobile-Specific Types
Types for mobile optimization and responsive behavior:

```typescript
// Mobile interaction types
interface TouchInteraction {
  type: 'tap' | 'swipe' | 'scroll';
  target: string;
  timestamp: number;
  coordinates?: { x: number; y: number };
  duration?: number;
}

// Responsive component props
interface ResponsiveComponentProps {
  mobile: ComponentProps;
  desktop: ComponentProps;
  breakpoint?: number;
}

// Viewport detection
interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}
```

## Development Guidelines

### Adding New Types
1. Add new types to `types/index.ts`
2. Use descriptive names with proper prefixes
3. Include JSDoc comments for complex types
4. Consider backward compatibility
5. Export types for external use

### Type Modifications
1. Understand existing type usage throughout codebase
2. Use union types and optional properties for flexibility
3. Consider migration strategies for breaking changes
4. Update all dependent components and stores
5. Test type changes thoroughly

### Performance Considerations
1. Avoid deeply nested types that slow compilation
2. Use type aliases for complex union types
3. Consider branded types for better type safety
4. Use const assertions where appropriate
5. Profile TypeScript compilation performance

Last updated: January 2025 - Comprehensive type system supporting exam mode, mobile optimization, and advanced analytics