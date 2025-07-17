// Main Application Entry Point
// This file orchestrates the entire application and manages module coordination

// Core module imports
import { 
  settings,
  availableExams,
  currentExam,
  currentQuestions,
  currentQuestionIndex,
  selectedAnswers,
  isValidated,
  isHighlightEnabled,
  questionStartTime,
  updateAvailableExams,
  updateCurrentExam,
  updateCurrentQuestions,
  updateCurrentQuestionIndex,
  updateSelectedAnswers,
  updateIsValidated,
  updateIsHighlightEnabled,
  updateQuestionStartTime,
  resetQuestionState
} from './modules/state.js';

import {
  formatTime,
  formatFileSize,
  truncateText,
  convertUrlsToLinks,
  formatCommentText,
  animateNumberChange,
  addHapticFeedback,
  renderMarkdown,
  processEmbeddedImages,
  debounce,
  safeLocalStorageGet,
  safeLocalStorageSet
} from './modules/utils.js';

import {
  loadExam,
  loadChunk,
  preloadChunks,
  getChunkIdForQuestion,
  ensureQuestionLoaded,
  assembleCurrentQuestions,
  createChunksForExamData,
  loadAvailableExams,
  validateExamData,
  getExamStats
} from './modules/data.js';

import {
  ExamSession,
  QuestionAttempt,
  saveStatistics,
  loadStatistics,
  recalculateTotalStats,
  startExamSession,
  endCurrentSession,
  trackQuestionAttempt,
  updateSessionStats,
  resetAllStatistics,
  cleanCorruptedStatistics,
  exportStatistics,
  getSessionSummary
} from './modules/statistics.js';

import {
  loadSettings,
  saveSettings,
  applyTheme,
  toggleDarkMode,
  updateToolbarVisibility,
  updateTooltipVisibility,
  updateAdvancedSearchVisibility,
  updateMainProgressBarVisibility,
  getSetting,
  setSetting,
  resetSettings,
  setupSettingsEventListeners,
  exportSettings,
  importSettings
} from './modules/settings.js';

// Application class for managing the entire app lifecycle
class ExamViewerApp {
  constructor() {
    this.initialized = false;
    this.modules = new Map();
    this.eventListeners = new Map();
  }

  // Initialize the application
  async init() {
    try {
      console.log('🚀 Initializing Exams Viewer App...');

      // Load core data first
      await this.loadCoreData();

      // Initialize modules in order
      await this.initializeModules();

      // Setup event listeners
      this.setupEventListeners();

      // Setup UI
      this.setupUI();

      // Mark as initialized
      this.initialized = true;

      console.log('✅ Exams Viewer App initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      this.showError('Failed to initialize application: ' + error.message);
    }
  }

  // Load core application data
  async loadCoreData() {
    try {
      // Load available exams
      const exams = await loadAvailableExams();
      updateAvailableExams(exams);

      // Load user settings
      loadSettings();

      // Load statistics
      loadStatistics();

      console.log(`📋 Loaded ${Object.keys(exams).length} exams`);
    } catch (error) {
      console.error('Error loading core data:', error);
      throw error;
    }
  }

  // Initialize all modules
  async initializeModules() {
    // Register modules
    this.modules.set('ui', await this.loadModule('./modules/ui.js'));
    this.modules.set('navigation', await this.loadModule('./modules/navigation.js'));
    this.modules.set('favorites', await this.loadModule('./modules/favorites.js'));
    this.modules.set('search', await this.loadModule('./modules/search.js'));
    this.modules.set('export', await this.loadModule('./modules/export.js'));

    // Expose app instance to global scope for module coordination
    window.app = this;

    // Initialize each module
    for (const [name, module] of this.modules) {
      if (module && typeof module.init === 'function') {
        try {
          await module.init();
          console.log(`✅ Module ${name} initialized`);
        } catch (error) {
          console.error(`❌ Failed to initialize module ${name}:`, error);
        }
      }
    }
  }

  // Dynamically load modules
  async loadModule(path) {
    try {
      const module = await import(path);
      return module;
    } catch (error) {
      console.warn(`⚠️ Module ${path} not available, using fallback functions`);
      return null;
    }
  }

  // Setup main event listeners
  setupEventListeners() {
    // Settings event listeners
    setupSettingsEventListeners();

    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

    // Window resize handler
    window.addEventListener('resize', debounce(this.handleResize.bind(this), 250));

    // Page visibility change handler
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Before unload handler for saving state
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

    console.log('🎯 Event listeners setup complete');
  }

  // Setup initial UI state
  setupUI() {
    // Apply initial theme
    applyTheme(settings.darkMode);

    // Update UI visibility based on settings
    updateToolbarVisibility();
    updateTooltipVisibility();
    updateAdvancedSearchVisibility();
    updateMainProgressBarVisibility();

    // Setup modal close buttons
    this.setupModalCloseButtons();

    // Setup mobile touches if module is available
    const uiModule = this.modules.get('ui');
    if (uiModule && uiModule.setupTouchGestures) {
      uiModule.setupTouchGestures();
    }

    // Populate exam dropdown (after data is loaded)
    this.populateExamDropdown();

    console.log('🎨 UI setup complete');
  }

  // Populate exam dropdown
  populateExamDropdown() {
    const examSelect = document.getElementById("examCode");
    if (!examSelect) {
      console.warn('❌ Exam select element not found');
      return;
    }

    // Clear existing options
    examSelect.innerHTML = '<option value="">Select an exam...</option>';

    if (Object.keys(availableExams).length === 0) {
      console.warn('⚠️ No available exams found');
      return;
    }

    // Sort exams alphabetically (critical business rule)
    const sortedExamCodes = Object.keys(availableExams).sort((a, b) => a.localeCompare(b));

    sortedExamCodes.forEach(examCode => {
      const exam = availableExams[examCode];
      const option = document.createElement('option');
      option.value = examCode;
      option.textContent = `${examCode} - ${exam.name || examCode}`;
      examSelect.appendChild(option);
    });

    console.log(`📋 Populated dropdown with ${sortedExamCodes.length} exams`);
  }

  // Get module by name
  getModule(name) {
    return this.modules.get(name);
  }

  // Update UI instructions via UI module
  updateInstructions() {
    const uiModule = this.modules.get('ui');
    if (uiModule && uiModule.updateInstructions) {
      uiModule.updateInstructions();
    } else {
      console.warn('🔄 [APP] UI module updateInstructions not available');
    }
  }

  // Update progress sidebar via Navigation module
  updateProgressSidebar() {
    const navigationModule = this.modules.get('navigation');
    if (navigationModule && navigationModule.updateProgressSidebar) {
      navigationModule.updateProgressSidebar();
    } else {
      console.warn('🔄 [APP] Navigation module updateProgressSidebar not available');
    }
  }

  // Coordinate UI and Navigation updates (common operation)
  updateUIAndProgress() {
    this.updateInstructions();
    this.updateProgressSidebar();
  }

  // Show question via UI module
  displayQuestion(questionIndex, fromToggleAction = false) {
    const uiModule = this.modules.get('ui');
    if (uiModule && uiModule.displayCurrentQuestion) {
      // Update global state first
      updateCurrentQuestionIndex(questionIndex);
      uiModule.displayCurrentQuestion(fromToggleAction);
    } else {
      console.warn('🔄 [APP] UI module displayCurrentQuestion not available');
    }
  }

  // Show validation results via UI module
  showValidationResults(correctAnswers) {
    const uiModule = this.modules.get('ui');
    if (uiModule && uiModule.showValidationResults) {
      uiModule.showValidationResults(correctAnswers);
    } else {
      console.warn('🔄 [APP] UI module showValidationResults not available');
    }
  }

  // Handle inter-module communication events
  emitEvent(eventName, data) {
    console.log(`📡 [APP] Emitting event: ${eventName}`, data);
    
    // Notify all modules of the event
    for (const [name, module] of this.modules) {
      if (module && typeof module.handleEvent === 'function') {
        try {
          module.handleEvent(eventName, data);
        } catch (error) {
          console.error(`❌ Error handling event ${eventName} in module ${name}:`, error);
        }
      }
    }
  }

  // Handle keyboard shortcuts
  handleKeyboardShortcuts(event) {
    // Don't trigger shortcuts when typing in input fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    const navigationModule = this.modules.get('navigation');
    if (navigationModule && navigationModule.handleKeyboardShortcuts) {
      navigationModule.handleKeyboardShortcuts(event);
    }
  }

  // Handle window resize
  handleResize() {
    const uiModule = this.modules.get('ui');
    if (uiModule && uiModule.handleResize) {
      uiModule.handleResize();
    }
  }

  // Handle page visibility change
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, save current state
      this.saveCurrentState();
    } else {
      // Page is visible again, resume if needed
      this.resumeFromState();
    }
  }

  // Handle before page unload
  handleBeforeUnload() {
    this.saveCurrentState();
  }

  // Save current application state
  saveCurrentState() {
    try {
      saveSettings();
      saveStatistics();
      
      // Save current question position if enabled
      if (settings.autoSavePosition && currentExam) {
        const navigationModule = this.modules.get('navigation');
        if (navigationModule && navigationModule.saveResumePosition) {
          navigationModule.saveResumePosition(currentExam.code || currentExam.exam_code, currentQuestionIndex);
        }
      }
    } catch (error) {
      console.error('Error saving application state:', error);
    }
  }

  // Resume from saved state
  resumeFromState() {
    // This could be enhanced to resume exam position, etc.
    console.log('📥 Resuming application state');
  }

  // Load an exam (main entry point for exam loading)
  async loadExam(examCode) {
    if (!examCode || !availableExams[examCode]) {
      this.showError(`Exam code "${examCode}" not found`);
      return false;
    }

    try {
      this.showLoading(true);

      // Start new session
      const examName = availableExams[examCode].name || examCode;
      startExamSession(examCode, examName);

      // Load exam data
      await loadExam(examCode);

      // Update UI
      updateCurrentQuestionIndex(0);
      resetQuestionState();

      // Display first question
      const uiModule = this.modules.get('ui');
      if (uiModule && uiModule.displayCurrentQuestion) {
        await uiModule.displayCurrentQuestion();
      }

      // Update navigation
      const navigationModule = this.modules.get('navigation');
      if (navigationModule && navigationModule.updateProgressSidebar) {
        navigationModule.updateProgressSidebar();
      }

      // Check for resume position
      if (settings.enableResumePosition && navigationModule && navigationModule.checkResumePosition) {
        navigationModule.checkResumePosition(examCode);
      }

      this.showLoading(false);
      return true;
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to load exam: ${error.message}`);
      return false;
    }
  }

  // Navigate to a specific question
  async navigateToQuestion(questionIndex) {
    if (questionIndex < 0 || questionIndex >= currentQuestions.length) {
      return false;
    }

    try {
      // Ensure question is loaded (for lazy loading)
      if (currentExam && currentExam.isChunked) {
        const loaded = await ensureQuestionLoaded(currentExam.code || currentExam.exam_code, questionIndex);
        if (!loaded) {
          this.showError('Failed to load question data');
          return false;
        }
      }

      // Update state
      updateCurrentQuestionIndex(questionIndex);
      resetQuestionState();

      // Update UI
      const uiModule = this.modules.get('ui');
      if (uiModule && uiModule.displayCurrentQuestion) {
        await uiModule.displayCurrentQuestion();
      }

      // Update navigation
      const navigationModule = this.modules.get('navigation');
      if (navigationModule) {
        if (navigationModule.addToNavigationHistory) {
          navigationModule.addToNavigationHistory(questionIndex);
        }
        if (navigationModule.updateProgressSidebar) {
          navigationModule.updateProgressSidebar();
        }
      }

      return true;
    } catch (error) {
      console.error('Error navigating to question:', error);
      this.showError('Failed to navigate to question');
      return false;
    }
  }

  // Validate current answers
  validateAnswers() {
    // HYBRID MODE: Use window.* for data loaded by modules
    const questions = window.currentQuestions || [];
    const questionIndex = window.currentQuestionIndex || 0;
    const answers = window.selectedAnswers || new Set();
    const validated = window.isValidated || false;
    const startTime = window.questionStartTime || null;
    
    console.log('🔍 [APP VALIDATE] Questions:', questions.length, 'Index:', questionIndex, 'Question exists:', !!questions[questionIndex]);
    
    if (!questions[questionIndex] || validated) {
      console.log('🔍 [APP VALIDATE] No question or already validated');
      return;
    }

    const question = questions[questionIndex];
    const correctAnswers = question.most_voted || question.correct_answers || [];
    const userAnswers = Array.from(answers);
    
    // Determine if answer is correct
    const isCorrect = this.checkAnswerCorrectness(userAnswers, correctAnswers);
    
    // Calculate time spent
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    const highlightEnabled = window.isHighlightEnabled || false;
    
    console.log('🔍 [APP VALIDATE] Tracking attempt for question:', question.question_number);
    
    // Track the attempt
    trackQuestionAttempt(
      question.question_number,
      correctAnswers,
      userAnswers,
      isCorrect,
      timeSpent,
      highlightEnabled
    );

    // Update state (both module and window)
    updateIsValidated(true);
    window.isValidated = true;

    // Update UI
    const uiModule = this.modules.get('ui');
    if (uiModule && uiModule.showValidationResults) {
      uiModule.showValidationResults(correctAnswers);
    }

    // Update navigation sidebar
    const navigationModule = this.modules.get('navigation');
    if (navigationModule && navigationModule.updateProgressSidebar) {
      navigationModule.updateProgressSidebar();
    }
  }

  // Check if user answers are correct
  checkAnswerCorrectness(userAnswers, correctAnswers) {
    if (!Array.isArray(correctAnswers)) {
      const correctArray = typeof correctAnswers === 'string' ? correctAnswers.split('') : [];
      return this.arraysEqual(userAnswers.sort(), correctArray.sort());
    }
    return this.arraysEqual(userAnswers.sort(), correctAnswers.sort());
  }

  // Helper function to compare arrays
  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }

  // Show loading indicator
  showLoading(show) {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
      loader.style.display = show ? 'flex' : 'none';
    }
  }

  // Show error message
  showError(message) {
    console.error('Error:', message);
    
    // Try to use UI module's error display
    const uiModule = this.modules.get('ui');
    if (uiModule && uiModule.showError) {
      uiModule.showError(message);
    } else {
      // Fallback to alert
      alert('Error: ' + message);
    }
  }

  // Show success message
  showSuccess(message) {
    console.log('Success:', message);
    
    // Try to use UI module's success display
    const uiModule = this.modules.get('ui');
    if (uiModule && uiModule.showSuccess) {
      uiModule.showSuccess(message);
    }
  }

  // Get module instance
  getModule(name) {
    return this.modules.get(name);
  }

  // Check if app is initialized
  isInitialized() {
    return this.initialized;
  }

  // Display statistics modal
  displayStatistics() {
    const modal = document.getElementById('statisticsModal');
    if (modal) {
      modal.style.display = 'flex';
      this.updateStatisticsDisplay();
    }
  }

  // Update statistics display
  updateStatisticsDisplay() {
    // This will be implemented when we complete the UI module
    console.log('Updating statistics display...');
  }

  // Toggle revision mode
  toggleRevisionMode() {
    const favoritesModule = this.modules.get('favorites');
    if (favoritesModule && favoritesModule.toggleRevisionMode) {
      favoritesModule.toggleRevisionMode();
    } else {
      console.log('Revision mode toggle - stub implementation');
    }
  }

  // Show export modal
  showExportModal() {
    const modal = document.getElementById('exportOptionsModal');
    if (modal) {
      modal.style.display = 'flex';
    } else {
      console.log('Export modal - stub implementation');
    }
  }

  // Toggle legal info
  toggleLegalInfo() {
    const legalInfo = document.getElementById('legal-info');
    if (legalInfo) {
      const isVisible = legalInfo.style.display !== 'none';
      legalInfo.style.display = isVisible ? 'none' : 'block';
    }
  }

  // Show keyboard help
  showKeyboardHelp() {
    const modal = document.getElementById('keyboardHelpModal');
    if (modal) {
      modal.style.display = 'flex';
    } else {
      console.log('Keyboard help - stub implementation');
    }
  }

  // Go to home (reset exam)
  goToHome() {
    updateCurrentExam(null);
    updateCurrentQuestions([]);
    updateCurrentQuestionIndex(0);
    resetQuestionState();
    
    // Hide main UI sections
    const mainSection = document.querySelector('.main-content');
    if (mainSection) {
      mainSection.style.display = 'none';
    }
    
    // Show home section
    const homeSection = document.querySelector('.container > .header');
    if (homeSection) {
      homeSection.parentElement.style.display = 'block';
    }
    
    console.log('Returned to home');
  }

  // Setup modal close buttons
  setupModalCloseButtons() {
    // Close button selectors and their modal IDs
    const modalCloseMap = {
      'closeStatisticsModal': 'statisticsModal',
      'closeSettingsModal': 'settingsModal', 
      'closeExportModal': 'exportOptionsModal',
      'closeChangelogModal': 'changelogModal',
      'closeKeyboardHelpModal': 'keyboardHelpModal'
    };

    Object.entries(modalCloseMap).forEach(([buttonId, modalId]) => {
      const button = document.getElementById(buttonId);
      const modal = document.getElementById(modalId);
      
      if (button && modal) {
        button.addEventListener('click', () => {
          modal.style.display = 'none';
        });
      }
    });

    // Also close modals when clicking outside
    const modals = document.querySelectorAll('[id$="Modal"]');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    });
  }
}

// Create global app instance
const app = new ExamViewerApp();

// HYBRID MODE: Commented out to avoid conflicts with script.js
// These will be gradually uncommented as we migrate functionality

// Global functions for backward compatibility with existing HTML
window.loadExam = (examCode) => app.loadExam(examCode);
// window.navigateToQuestion = (index) => app.navigateToQuestion(index);
window.validateAnswers = () => app.validateAnswers();
// window.toggleDarkMode = toggleDarkMode;
// window.saveSettings = saveSettings;
// window.resetAllStatistics = resetAllStatistics;
// window.exportStatistics = exportStatistics;

// Additional global functions for UI compatibility
// window.displayStatistics = () => app.displayStatistics();
// window.toggleRevisionMode = () => app.toggleRevisionMode();
// window.showExportModal = () => app.showExportModal();
// window.toggleLegalInfo = () => app.toggleLegalInfo();
// window.showKeyboardHelp = () => app.showKeyboardHelp();
// window.goToHome = () => app.goToHome();

// Expose app instance globally for debugging
window.app = app;

// Expose core functions globally for backward compatibility
window.formatTime = formatTime;
window.formatFileSize = formatFileSize;
window.truncateText = truncateText;
window.addHapticFeedback = addHapticFeedback;
window.processEmbeddedImages = processEmbeddedImages;

// HYBRID MODE: Initialize modules on demand and expose them globally
async function initModulesIfNeeded() {
  if (!app.initialized) {
    try {
      await app.init();
      console.log('✅ App modules initialized for hybrid mode');
    } catch (error) {
      console.warn('⚠️ Failed to initialize app modules:', error);
    }
  }
  
  // Expose UI module globally for legacy compatibility
  if (app.modules.has('ui')) {
    window.uiModule = app.modules.get('ui');
    console.log('✅ UI module exposed globally');
  }
}

// Initialize modules when needed
window.initModulesIfNeeded = initModulesIfNeeded;

// HYBRID MODE: Disable auto-initialization to avoid conflicts with script.js
// Initialize app when DOM is ready
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', () => app.init());
// } else {
//   app.init();
// }

// Manual initialization available via: window.app.init()

// HYBRID MODE: Initialize data module only for progressive migration
window.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load only core data functionality for hybrid mode
    await app.loadCoreData();
    
    // Initialize data and statistics modules
    const dataModule = await app.loadModule('./modules/data.js');
    if (dataModule) {
      app.modules.set('data', dataModule);
      console.log('✅ [HYBRID] Data module ready for migration');
    }
    
    const statisticsModule = await app.loadModule('./modules/statistics.js');
    if (statisticsModule) {
      app.modules.set('statistics', statisticsModule);
      console.log('✅ [HYBRID] Statistics module ready for migration');
    }
    
    const settingsModule = await app.loadModule('./modules/settings.js');
    if (settingsModule) {
      app.modules.set('settings', settingsModule);
      console.log('✅ [HYBRID] Settings module ready for migration');
      
      // Test if settings module works
      console.log('🧪 [TEST] Settings module functions:', {
        loadSettings: typeof settingsModule.loadSettings,
        saveSettings: typeof settingsModule.saveSettings,
        applyTheme: typeof settingsModule.applyTheme
      });
    } else {
      console.error('❌ [HYBRID] Failed to load settings module');
    }
    
    const uiModule = await app.loadModule('./modules/ui.js');
    if (uiModule) {
      app.modules.set('ui', uiModule);
      console.log('✅ [HYBRID] UI module ready for migration');
      
      // Initialize the UI module
      if (uiModule.init) {
        await uiModule.init();
        console.log('✅ [HYBRID] UI module initialized');
      }
      
      // Test if UI module works
      console.log('🧪 [TEST] UI module functions:', {
        displayCurrentQuestion: typeof uiModule.displayCurrentQuestion,
        showLoading: typeof uiModule.showLoading,
        showError: typeof uiModule.showError,
        showSuccess: typeof uiModule.showSuccess,
        updateHighlightButton: typeof uiModule.updateHighlightButton
      });
    } else {
      console.error('❌ [HYBRID] Failed to load UI module');
    }
  } catch (error) {
    console.warn('⚠️ [HYBRID] Data module initialization failed:', error);
  }
});

// Export app instance for ES6 modules
export default app;