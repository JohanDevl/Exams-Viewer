/**
 * Main Application Controller - Modular Architecture
 * Orchestrates all modules and provides initialization for the Exams Viewer
 */

import { initializeState, syncToWindow, syncFromWindow } from './modules/state.js';
import { initializeUtils } from './modules/utils.js';

class ExamViewerApp {
  constructor() {
    this.initialized = false;
    this.modules = {};
  }

  /**
   * Initialize the application and all modules
   */
  async init() {
    if (this.initialized) {
      console.log('⚠️ App already initialized');
      return;
    }

    console.log('🚀 Initializing Exams Viewer App...');

    try {
      // Phase 1: Initialize core modules
      await this.initializeCoreModules();
      
      // Phase 2: Setup hybrid compatibility
      await this.setupHybridCompatibility();
      
      // Phase 3: Initialize remaining systems
      await this.initializeRemainingModules();
      
      this.initialized = true;
      console.log('✅ Exams Viewer App fully initialized');
      
      // Emit initialization complete event
      window.dispatchEvent(new CustomEvent('appInitialized', { 
        detail: { app: this } 
      }));
      
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      throw error;
    }
  }

  /**
   * Initialize core modules (state and utils)
   */
  async initializeCoreModules() {
    console.log('📦 Initializing core modules...');
    
    // Initialize state management
    initializeState();
    this.modules.state = { initialized: true };
    
    // Initialize utilities
    initializeUtils();
    this.modules.utils = { initialized: true };
    
    console.log('✅ Core modules initialized');
  }

  /**
   * Setup hybrid compatibility with existing script.js
   */
  async setupHybridCompatibility() {
    console.log('🔄 Setting up hybrid compatibility...');
    
    // Perform bidirectional sync with window.*
    syncToWindow();
    
    // Setup periodic sync to handle script.js modifications
    this.setupPeriodicSync();
    
    // Setup event listeners for state changes
    this.setupStateChangeListeners();
    
    console.log('✅ Hybrid compatibility established');
  }

  /**
   * Setup periodic synchronization between modules and window.*
   */
  setupPeriodicSync() {
    // Sync from window to modules every 100ms to catch script.js changes
    setInterval(() => {
      syncFromWindow();
    }, 100);
    
    // Sync from modules to window every 50ms for responsiveness
    setInterval(() => {
      syncToWindow();
    }, 50);
  }

  /**
   * Setup event listeners for state changes
   */
  setupStateChangeListeners() {
    // Listen for storage events (localStorage changes)
    window.addEventListener('storage', (e) => {
      console.log('📢 Storage changed:', e.key);
      syncFromWindow(); // Re-sync state
    });
    
    // Listen for exam load events
    window.addEventListener('examLoaded', (e) => {
      console.log('📢 Exam loaded:', e.detail);
      syncToWindow(); // Ensure modules have latest state
    });
    
    // Listen for question navigation events
    window.addEventListener('questionChanged', (e) => {
      console.log('📢 Question changed:', e.detail);
      syncToWindow(); // Ensure modules have latest state
    });
  }

  /**
   * Initialize remaining modules (will be implemented in future phases)
   */
  async initializeRemainingModules() {
    console.log('📦 Initializing remaining modules...');
    
    // Placeholder for future modules
    // TODO: Initialize UI module
    // TODO: Initialize navigation module
    // TODO: Initialize data module
    // TODO: Initialize settings module
    // TODO: Initialize statistics module
    // TODO: Initialize search module
    // TODO: Initialize favorites module
    // TODO: Initialize export module
    
    console.log('✅ Remaining modules placeholder setup complete');
  }

  /**
   * Get module status
   */
  getModuleStatus() {
    return {
      initialized: this.initialized,
      modules: this.modules,
      timestamp: Date.now()
    };
  }

  /**
   * Manually trigger state synchronization
   */
  syncState() {
    syncFromWindow();
    syncToWindow();
  }

  /**
   * Get current application state
   */
  getState() {
    syncFromWindow(); // Ensure we have latest state
    return {
      currentExam: window.currentExam,
      currentQuestions: window.currentQuestions,
      currentQuestionIndex: window.currentQuestionIndex,
      selectedAnswers: window.selectedAnswers,
      isValidated: window.isValidated,
      settings: window.settings,
      statistics: window.statistics
    };
  }
}

// Create global app instance
const app = new ExamViewerApp();

// Initialize immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await app.init();
  });
} else {
  // DOM already loaded, initialize immediately
  app.init().catch(console.error);
}

// Expose app globally for debugging and compatibility
window.app = app;

console.log('📱 App.js loaded - waiting for DOM ready to initialize');

export default app;