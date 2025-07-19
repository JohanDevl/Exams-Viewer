/**
 * State Management Module
 * Centralizes all global state variables and provides synchronization with window.*
 */

// ===== CORE EXAM STATE =====
export let currentExam = null;
export let currentQuestions = [];
export let currentQuestionIndex = 0;
export let selectedAnswers = new Set();
export let isValidated = false;
export let isHighlightEnabled = false;
export let isHighlightTemporaryOverride = false;
export let questionStartTime = null;

// ===== SEARCH AND FILTER STATE =====
export let allQuestions = [];
export let filteredQuestions = [];
export let isSearchActive = false;
export let searchCache = {};

// ===== SETTINGS STATE =====
export let settings = {
  showDiscussionDefault: false,
  highlightDefault: false,
  darkMode: false,
  showQuestionToolbar: false,
  showAdvancedSearch: false,
  sidebarOpen: false,
  enableLazyLoading: false,
  showMainProgressBar: true,
  showTooltips: false,
  enableResumePosition: false,
  autoSavePosition: false,
};

// ===== DATA SYSTEMS STATE =====
export let availableExams = {};
export let lazyLoadingConfig = {
  chunkSize: 50,
  loadedChunks: new Map(),
  currentChunk: 0,
  totalChunks: 0,
  preloadBuffer: 1,
  isChunkedExam: false,
  examMetadata: null,
};

export let favoritesData = {
  favorites: {},
  categories: ["Important", "Review", "Difficult"],
  customCategories: [],
  isRevisionMode: false,
  revisionFilter: {
    showFavorites: true,
    showCategories: [],
    showNotes: true,
  },
};

export let statistics = {
  sessions: [],
  currentSession: null,
  totalStats: {
    totalQuestions: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    totalPreview: 0,
    totalTime: 0,
    examStats: {},
  },
};

export let resumePositions = {};

// ===== SYNCHRONIZATION FUNCTIONS =====
/**
 * Synchronizes module state with window.* for backward compatibility
 * This ensures existing code continues to work during migration
 */
export function syncToWindow() {
  // Core exam state
  window.currentExam = currentExam;
  window.currentQuestions = currentQuestions;
  window.currentQuestionIndex = currentQuestionIndex;
  window.selectedAnswers = selectedAnswers;
  window.isValidated = isValidated;
  window.isHighlightEnabled = isHighlightEnabled;
  window.isHighlightTemporaryOverride = isHighlightTemporaryOverride;
  window.questionStartTime = questionStartTime;
  
  // Search and filter state
  window.allQuestions = allQuestions;
  window.filteredQuestions = filteredQuestions;
  window.isSearchActive = isSearchActive;
  window.searchCache = searchCache;
  
  // Settings and data systems
  window.settings = settings;
  window.availableExams = availableExams;
  window.lazyLoadingConfig = lazyLoadingConfig;
  window.favoritesData = favoritesData;
  window.statistics = statistics;
  window.resumePositions = resumePositions;
}

/**
 * Synchronizes window.* state back to modules
 * This allows existing code to modify state and have modules pick up changes
 */
export function syncFromWindow() {
  // Only sync if window properties exist (avoid overwriting with undefined)
  if (window.currentExam !== undefined) currentExam = window.currentExam;
  if (window.currentQuestions !== undefined) currentQuestions = window.currentQuestions;
  if (window.currentQuestionIndex !== undefined) currentQuestionIndex = window.currentQuestionIndex;
  if (window.selectedAnswers !== undefined) selectedAnswers = window.selectedAnswers;
  if (window.isValidated !== undefined) isValidated = window.isValidated;
  if (window.isHighlightEnabled !== undefined) isHighlightEnabled = window.isHighlightEnabled;
  if (window.isHighlightTemporaryOverride !== undefined) isHighlightTemporaryOverride = window.isHighlightTemporaryOverride;
  if (window.questionStartTime !== undefined) questionStartTime = window.questionStartTime;
  
  if (window.allQuestions !== undefined) allQuestions = window.allQuestions;
  if (window.filteredQuestions !== undefined) filteredQuestions = window.filteredQuestions;
  if (window.isSearchActive !== undefined) isSearchActive = window.isSearchActive;
  if (window.searchCache !== undefined) searchCache = window.searchCache;
  
  if (window.settings !== undefined) settings = window.settings;
  if (window.availableExams !== undefined) availableExams = window.availableExams;
  if (window.lazyLoadingConfig !== undefined) lazyLoadingConfig = window.lazyLoadingConfig;
  if (window.favoritesData !== undefined) favoritesData = window.favoritesData;
  if (window.statistics !== undefined) statistics = window.statistics;
  if (window.resumePositions !== undefined) resumePositions = window.resumePositions;
}

// ===== STATE UPDATE FUNCTIONS =====
export function updateCurrentExam(exam) {
  currentExam = exam;
  syncToWindow();
}

export function updateCurrentQuestions(questions) {
  currentQuestions = questions;
  syncToWindow();
}

export function updateCurrentQuestionIndex(index) {
  currentQuestionIndex = index;
  syncToWindow();
}

export function updateSelectedAnswers(answers) {
  selectedAnswers = answers;
  syncToWindow();
}

export function updateSettings(newSettings) {
  settings = { ...settings, ...newSettings };
  syncToWindow();
}

// ===== INITIALIZATION =====
/**
 * Initialize state module - sets up initial synchronization
 */
export function initializeState() {
  // Perform initial sync to window for backward compatibility
  syncToWindow();
  
  console.log('✅ State module initialized with window synchronization');
}