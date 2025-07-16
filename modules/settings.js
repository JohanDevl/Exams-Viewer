// Settings Management Module
// This module handles application settings, theme management, and user preferences

// HYBRID MODE: Use global variables if state module not available
let settings = window.settings || {
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

let isHighlightEnabled = window.isHighlightEnabled || false;
let sidebarOpen = window.sidebarOpen || false;
let currentQuestions = window.currentQuestions || [];
let allQuestions = window.allQuestions || [];
let currentQuestionIndex = window.currentQuestionIndex || 0;
let statistics = window.statistics || { currentSession: null };

function updateSettings(newSettings) {
  if (window.settings) {
    Object.assign(window.settings, newSettings);
  }
  settings = newSettings;
}

function updateIsHighlightEnabled(enabled) {
  if (window.isHighlightEnabled !== undefined) {
    window.isHighlightEnabled = enabled;
  }
  isHighlightEnabled = enabled;
}

function updateIsHighlightTemporaryOverride(override) {
  if (window.isHighlightTemporaryOverride !== undefined) {
    window.isHighlightTemporaryOverride = override;
  }
}

function updateSidebarOpen(open) {
  if (window.sidebarOpen !== undefined) {
    window.sidebarOpen = open;
  }
  sidebarOpen = open;
}

// Simple utility functions for hybrid mode
function safeLocalStorageGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load from localStorage: ${key}`, error);
    return defaultValue;
  }
}

function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to save to localStorage: ${key}`, error);
    return false;
  }
}

// Load settings from localStorage
export function loadSettings() {
  console.log('🔧 [SETTINGS MODULE] loadSettings() called');
  
  // Sync with global settings object if it exists
  if (window.settings) {
    settings = { ...settings, ...window.settings };
    console.log('🔧 [SETTINGS] Synced with global settings:', settings);
  }
  
  const savedSettings = safeLocalStorageGet("examViewerSettings");
  if (savedSettings) {
    updateSettings(savedSettings);
    console.log('🔧 [SETTINGS] Loaded from localStorage:', savedSettings);
    
    // Update UI elements if they exist
    const elements = {
      showDiscussionDefault: document.getElementById("showDiscussionDefault"),
      highlightDefault: document.getElementById("highlightDefault"),
      darkModeToggle: document.getElementById("darkModeToggle"),
      showQuestionToolbar: document.getElementById("showQuestionToolbar"),
      showAdvancedSearch: document.getElementById("showAdvancedSearch"),
      enableLazyLoading: document.getElementById("enableLazyLoading"),
      showMainProgressBar: document.getElementById("showMainProgressBar"),
      showTooltips: document.getElementById("showTooltips"),
      enableResumePosition: document.getElementById("enableResumePosition"),
      autoSavePosition: document.getElementById("autoSavePosition")
    };

    // Update checkboxes if elements exist
    Object.entries(elements).forEach(([setting, element]) => {
      if (element && settings[setting] !== undefined) {
        element.checked = settings[setting];
        console.log(`🔧 [SETTINGS] Set ${setting} to ${settings[setting]} on element:`, element);
      } else if (!element) {
        console.warn(`🔧 [SETTINGS] Element not found for setting: ${setting}`);
      }
    });

    updateIsHighlightEnabled(settings.highlightDefault);
    applyTheme(settings.darkMode);
    
    // Apply settings that affect UI - Use global functions if available
    if (window.updateToolbarVisibility) window.updateToolbarVisibility();
    if (window.updateTooltipVisibility) window.updateTooltipVisibility();
    
    // Restore sidebar state
    updateSidebarOpen(settings.sidebarOpen);
  } else {
    console.log('🔧 [SETTINGS] No saved settings found, using defaults');
    // If no saved settings, check system preference for dark mode
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      updateSettings({ ...settings, darkMode: true });
      const darkModeToggle = document.getElementById("darkModeToggle");
      if (darkModeToggle) {
        darkModeToggle.checked = true;
      }
      applyTheme(true);
    }
  }
}

// Save settings to localStorage
export function saveSettings() {
  console.log('💾 [SETTINGS MODULE] saveSettings() called');
  
  const newSettings = { ...settings };
  
  // Get values from UI elements if they exist
  const elements = {
    showDiscussionDefault: document.getElementById("showDiscussionDefault"),
    highlightDefault: document.getElementById("highlightDefault"),
    darkMode: document.getElementById("darkModeToggle"),
    showQuestionToolbar: document.getElementById("showQuestionToolbar"),
    showAdvancedSearch: document.getElementById("showAdvancedSearch"),
    enableLazyLoading: document.getElementById("enableLazyLoading"),
    showMainProgressBar: document.getElementById("showMainProgressBar"),
    showTooltips: document.getElementById("showTooltips"),
    enableResumePosition: document.getElementById("enableResumePosition"),
    autoSavePosition: document.getElementById("autoSavePosition")
  };

  // Update settings from UI elements
  Object.entries(elements).forEach(([setting, element]) => {
    if (element) {
      newSettings[setting] = element.checked;
      console.log(`💾 [SETTINGS] ${setting}: ${element.checked}`);
    }
  });

  updateSettings(newSettings);
  const saved = safeLocalStorageSet("examViewerSettings", newSettings);
  console.log('💾 [SETTINGS MODULE] Settings saved:', saved, newSettings);
  
  // Apply theme if dark mode changed
  applyTheme(newSettings.darkMode);
  console.log('🌓 [SETTINGS] Applied theme - darkMode:', newSettings.darkMode);
  
  // Apply settings UI updates
  updateToolbarVisibility();
  updateTooltipVisibility();
  updateAdvancedSearchVisibility();
  updateMainProgressBarVisibility();
  
  // Handle highlight default setting change
  const wasHighlightEnabled = isHighlightEnabled;
  updateIsHighlightEnabled(newSettings.highlightDefault);
  
  // Handle highlight default setting change
  if (wasHighlightEnabled !== isHighlightEnabled) {
    console.log('💡 [SETTINGS] Highlight setting changed:', wasHighlightEnabled, '->', isHighlightEnabled);
    
    // Reset temporary override since user changed the default setting
    updateIsHighlightTemporaryOverride(false);
    
    // Update highlight button state - Use global function if available
    if (window.updateHighlightButton) {
      window.updateHighlightButton();
      console.log('💡 [SETTINGS] Updated highlight button state');
    }
    
    // If we have a current question displayed, update the UI
    if (currentQuestions.length > 0) {
      // Update the current question display to reflect new highlight state
      if (window.app && window.app.getModule) {
        const uiModule = window.app.getModule('ui');
        if (uiModule && uiModule.displayCurrentQuestion) {
          uiModule.displayCurrentQuestion(true); // true = fromToggleAction to preserve state
          console.log('💡 [SETTINGS] Refreshed question display with new highlight setting');
        }
      }
      
      // Track highlight view if needed
      if (isHighlightEnabled && statistics.currentSession) {
        const question = currentQuestions[currentQuestionIndex];
        const questionNumber = question.question_number;
        
        // Find existing question attempt or create new one
        let questionAttempt = statistics.currentSession.questions.find(
          (q) => q.questionNumber === questionNumber
        );
        
        if (!questionAttempt) {
          const mostVoted = question.most_voted || "";
          const correctAnswers = Array.isArray(mostVoted) ? mostVoted : 
                               typeof mostVoted === 'string' ? mostVoted.split('') : [];
          
          // Import and use statistics functions
          import('./statistics.js').then(({ QuestionAttempt, trackQuestionAttempt }) => {
            questionAttempt = new QuestionAttempt(questionNumber, correctAnswers);
            statistics.currentSession.questions.push(questionAttempt);
            questionAttempt.addHighlightView();
          });
        } else {
          questionAttempt.addHighlightView();
        }
      }
    }
  }
  
  // Handle settings that require user notification (no immediate visual effect)
  if (newSettings.enableLazyLoading !== (window.settings?.enableLazyLoading || false)) {
    console.log('⚙️ [SETTINGS] Lazy loading setting changed - will apply on next exam load');
  }
  
  if (newSettings.enableResumePosition !== (window.settings?.enableResumePosition || false)) {
    console.log('⚙️ [SETTINGS] Resume position setting changed - feature', newSettings.enableResumePosition ? 'enabled' : 'disabled');
  }
  
  if (newSettings.autoSavePosition !== (window.settings?.autoSavePosition || false)) {
    console.log('⚙️ [SETTINGS] Auto-save position setting changed - feature', newSettings.autoSavePosition ? 'enabled' : 'disabled');
  }
  
  console.log('✅ [SETTINGS] All settings applied dynamically!');
}

// Apply theme (dark/light mode)
export function applyTheme(isDark) {
  const body = document.body;
  const darkModeBtn = document.getElementById("darkModeBtn");
  const icon = darkModeBtn?.querySelector("i");

  if (isDark) {
    body.setAttribute("data-theme", "dark");
    if (icon) {
      icon.className = "fas fa-sun";
      darkModeBtn.title = "Switch to Light Mode";
    }
  } else {
    body.removeAttribute("data-theme");
    if (icon) {
      icon.className = "fas fa-moon";
      darkModeBtn.title = "Switch to Dark Mode";
    }
  }
}

// Toggle dark mode
export function toggleDarkMode() {
  const newDarkMode = !settings.darkMode;
  updateSettings({ ...settings, darkMode: newDarkMode });
  
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.checked = newDarkMode;
  }
  
  applyTheme(newDarkMode);
  saveSettings();
}

// Update toolbar visibility based on settings
export function updateToolbarVisibility() {
  // Sync with global settings
  if (window.settings) {
    settings = { ...settings, ...window.settings };
  }
  
  const revisionModeBtn = document.getElementById("revisionModeBtn");
  if (revisionModeBtn) {
    revisionModeBtn.style.display = settings.showQuestionToolbar ? "inline-block" : "none";
  }
  
  const toolbar = document.getElementById("questionToolbar");
  if (toolbar) {
    toolbar.style.display = settings.showQuestionToolbar ? "block" : "none";
  }
}

// Update tooltip visibility based on settings
export function updateTooltipVisibility() {
  // Sync with global settings
  if (window.settings) {
    settings = { ...settings, ...window.settings };
  }
  
  const body = document.body;
  if (settings.showTooltips) {
    body.classList.add('tooltips-enabled');
  } else {
    body.classList.remove('tooltips-enabled');
  }
}

// Update advanced search visibility based on settings
export function updateAdvancedSearchVisibility() {
  // Sync with global settings
  if (window.settings) {
    settings = { ...settings, ...window.settings };
  }
  
  const searchSection = document.getElementById("searchSection");
  if (settings.showAdvancedSearch) {
    if (searchSection) {
      searchSection.style.display = "block";
    }
    
    // Initialize search UI if exam is loaded
    if (currentQuestions && allQuestions && allQuestions.length > 0) {
      if (window.initializeSearchInterface) {
        window.initializeSearchInterface();
      }
    }
  } else {
    if (searchSection) {
      searchSection.style.display = "none";
    }
  }
}

// Update main progress bar visibility based on settings
export function updateMainProgressBarVisibility() {
  // Sync with global settings
  if (window.settings) {
    settings = { ...settings, ...window.settings };
  }
  
  const mainProgressSection = document.getElementById("mainProgressSection");
  if (!mainProgressSection) return;

  if (settings.showMainProgressBar) {
    mainProgressSection.style.display = "block";
    if (currentQuestions && currentQuestions.length > 0 && window.updateMainProgressBar) {
      window.updateMainProgressBar(); // Update with current data
    }
  } else {
    mainProgressSection.style.display = "none";
  }
}

// Get setting value
export function getSetting(key) {
  return settings[key];
}

// Set setting value
export function setSetting(key, value) {
  updateSettings({ ...settings, [key]: value });
  saveSettings();
}

// Reset settings to defaults
export function resetSettings() {
  const defaultSettings = {
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
  
  updateSettings(defaultSettings);
  safeLocalStorageSet("examViewerSettings", defaultSettings);
  
  // Apply the reset settings
  loadSettings();
}

// Import functions that may not be available initially
let updateHighlightButton, updateAdvancedSearchVisibilityRef, updateMainProgressBarVisibilityRef;

// Initialize settings references to UI functions
export function initializeSettingsReferences(uiFunctions) {
  updateHighlightButton = uiFunctions.updateHighlightButton;
  updateAdvancedSearchVisibilityRef = uiFunctions.updateAdvancedSearchVisibility;
  updateMainProgressBarVisibilityRef = uiFunctions.updateMainProgressBarVisibility;
}

// Setup settings event listeners
export function setupSettingsEventListeners() {
  // Dark mode toggle
  const darkModeBtn = document.getElementById("darkModeBtn");
  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", toggleDarkMode);
  }
  
  // Settings form changes
  const settingsForm = document.querySelector('#settingsModal form');
  if (settingsForm) {
    settingsForm.addEventListener('change', saveSettings);
  }
  
  // Individual setting toggles
  const settingElements = [
    'showDiscussionDefault',
    'highlightDefault', 
    'darkModeToggle',
    'showQuestionToolbar',
    'showAdvancedSearch',
    'enableLazyLoading',
    'showMainProgressBar',
    'showTooltips',
    'enableResumePosition',
    'autoSavePosition'
  ];
  
  settingElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', saveSettings);
    }
  });
}

// Export settings to JSON
export function exportSettings() {
  const dataStr = JSON.stringify(settings, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `exam-viewer-settings-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import settings from JSON
export function importSettings(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedSettings = JSON.parse(e.target.result);
        
        // Validate settings structure
        const validKeys = Object.keys(settings);
        const validSettings = {};
        
        validKeys.forEach(key => {
          if (importedSettings.hasOwnProperty(key) && typeof importedSettings[key] === typeof settings[key]) {
            validSettings[key] = importedSettings[key];
          }
        });
        
        updateSettings({ ...settings, ...validSettings });
        saveSettings();
        loadSettings(); // Apply the imported settings
        
        resolve(validSettings);
      } catch (error) {
        reject(new Error('Invalid settings file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}