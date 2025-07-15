// Global Application State Management
// This module contains all global state variables and provides centralized state management

// Global state variables
export let currentExam = null;
export let currentQuestions = [];
export let currentQuestionIndex = 0;
export let selectedAnswers = new Set();
export let isValidated = false;
export let isHighlightEnabled = false;
export let isHighlightTemporaryOverride = false; // Track if user manually toggled highlight
export let questionStartTime = null; // Track when question was started

// Search and filter state
export let allQuestions = []; // Store original questions array
export let filteredQuestions = []; // Store filtered results
export let isSearchActive = false; // Track if search/filter is active
export let searchCache = {}; // Cache search results for performance

// Application settings with default values
export let settings = {
  showDiscussionDefault: false,
  highlightDefault: false,
  darkMode: false,
  showQuestionToolbar: false,
  showAdvancedSearch: false,
  sidebarOpen: false,
  enableLazyLoading: false, // Lazy loading disabled by default
  showMainProgressBar: true, // Main progress bar enabled by default
  showTooltips: false, // Tooltips disabled by default
  enableResumePosition: false, // Resume position disabled by default
  autoSavePosition: false, // Auto-save position disabled by default
};

// Available exams mapping (will be populated dynamically)
export let availableExams = {};

// Lazy loading system configuration
export let lazyLoadingConfig = {
  chunkSize: 50, // Questions per chunk
  loadedChunks: new Map(), // Map of chunkId -> questions array
  currentChunk: 0,
  totalChunks: 0,
  preloadBuffer: 1, // Number of chunks to preload ahead/behind
  isChunkedExam: false, // Whether current exam uses chunking
  examMetadata: null, // Metadata for chunked exams
};

// Favorites and Notes system
export let favoritesData = {
  favorites: {}, // { examCode: { questionNumber: { isFavorite: true, category: 'important', note: 'text', timestamp: timestamp } } }
  categories: ["Important", "Review", "Difficult"], // Default categories
  customCategories: [], // User-defined categories
  isRevisionMode: false, // Track if we're in revision mode
  revisionFilter: {
    showFavorites: true,
    showCategories: [], // Categories to show in revision mode
    showNotes: true, // Show only questions with notes
  },
};

// Statistics system
export let statistics = {
  sessions: [], // Array of session objects
  currentSession: null,
  totalStats: {
    totalQuestions: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    totalPreview: 0, // New field for preview answers
    totalTime: 0,
    examStats: {}, // Per-exam statistics
  },
};

// Resume position system
export let resumePositions = {
  // examCode: { questionIndex: number, timestamp: number, questionNumber: number, totalQuestions: number, lastSessionId: string }
};

// Navigation history for back/forward functionality
export let navigationHistory = [];
export let historyIndex = -1;

// Mobile touch interaction state
export let touchStartX = 0;
export let touchStartY = 0;
export let touchEndX = 0;
export let touchEndY = 0;
export let isSwiping = false;
export let touchStartTime = 0;

// UI state management
export let sidebarOpen = false;

// State mutation functions - these allow controlled modification of state
export function updateCurrentExam(exam) {
  currentExam = exam;
}

export function updateCurrentQuestions(questions) {
  currentQuestions = questions;
}

export function updateCurrentQuestionIndex(index) {
  currentQuestionIndex = index;
}

export function updateSelectedAnswers(answers) {
  selectedAnswers = answers;
}

export function updateIsValidated(validated) {
  isValidated = validated;
}

export function updateIsHighlightEnabled(enabled) {
  isHighlightEnabled = enabled;
}

export function updateIsHighlightTemporaryOverride(override) {
  isHighlightTemporaryOverride = override;
}

export function updateQuestionStartTime(time) {
  questionStartTime = time;
}

export function updateAllQuestions(questions) {
  allQuestions = questions;
}

export function updateFilteredQuestions(questions) {
  filteredQuestions = questions;
}

export function updateIsSearchActive(active) {
  isSearchActive = active;
}

export function updateSearchCache(cache) {
  searchCache = cache;
}

export function updateSettings(newSettings) {
  settings = { ...settings, ...newSettings };
}

export function updateAvailableExams(exams) {
  availableExams = exams;
}

export function updateLazyLoadingConfig(config) {
  lazyLoadingConfig = { ...lazyLoadingConfig, ...config };
}

export function updateFavoritesData(data) {
  favoritesData = { ...favoritesData, ...data };
}

export function updateStatistics(stats) {
  statistics = { ...statistics, ...stats };
}

export function updateResumePositions(positions) {
  resumePositions = positions;
}

export function updateNavigationHistory(history) {
  navigationHistory = history;
}

export function updateHistoryIndex(index) {
  historyIndex = index;
}

export function updateSidebarOpen(open) {
  sidebarOpen = open;
}

// Reset functions for clearing state
export function resetQuestionState() {
  selectedAnswers = new Set();
  isValidated = false;
  isHighlightTemporaryOverride = false;
  questionStartTime = null;
}

export function resetSearchState() {
  allQuestions = [];
  filteredQuestions = [];
  isSearchActive = false;
  searchCache = {};
}

export function resetNavigationState() {
  navigationHistory = [];
  historyIndex = -1;
}