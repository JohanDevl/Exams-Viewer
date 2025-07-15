// Settings Management Module
// This module handles application settings, theme management, and user preferences

import { 
  settings, 
  isHighlightEnabled,
  sidebarOpen,
  currentQuestions,
  currentQuestionIndex,
  statistics,
  updateSettings,
  updateIsHighlightEnabled,
  updateIsHighlightTemporaryOverride,
  updateSidebarOpen
} from './state.js';

import { safeLocalStorageGet, safeLocalStorageSet } from './utils.js';

// Load settings from localStorage
export function loadSettings() {
  const savedSettings = safeLocalStorageGet("examViewerSettings");
  if (savedSettings) {
    updateSettings(savedSettings);
    
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
      }
    });

    updateIsHighlightEnabled(settings.highlightDefault);
    applyTheme(settings.darkMode);
    
    // Apply settings that affect UI
    updateToolbarVisibility();
    updateTooltipVisibility();
    
    // Restore sidebar state
    updateSidebarOpen(settings.sidebarOpen);
  } else {
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
    }
  });

  updateSettings(newSettings);
  safeLocalStorageSet("examViewerSettings", newSettings);
  
  // Handle highlight default setting change
  const wasHighlightEnabled = isHighlightEnabled;
  updateIsHighlightEnabled(newSettings.highlightDefault);
  
  // If highlight setting changed and we have a current question, update the display
  if (wasHighlightEnabled !== isHighlightEnabled && currentQuestions.length > 0) {
    // Reset temporary override since user changed the default setting
    updateIsHighlightTemporaryOverride(false);
    
    // If highlight is now enabled and this is the first action on the question, track it
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
    
    // Update highlight button state
    updateHighlightButton();
  }
  
  // Apply toolbar visibility setting
  updateToolbarVisibility();
  
  // Apply tooltip visibility setting
  updateTooltipVisibility();
  
  // Apply advanced search visibility
  updateAdvancedSearchVisibility();
  
  // Apply main progress bar visibility
  updateMainProgressBarVisibility();
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
  const toolbar = document.querySelector('.question-toolbar');
  const showToolbar = settings.showQuestionToolbar;
  
  if (toolbar) {
    toolbar.style.display = showToolbar ? 'flex' : 'none';
  }
}

// Update tooltip visibility based on settings
export function updateTooltipVisibility() {
  const tooltips = document.querySelectorAll('.tooltip');
  const showTooltips = settings.showTooltips;
  
  tooltips.forEach(tooltip => {
    if (showTooltips) {
      tooltip.classList.remove('disabled');
    } else {
      tooltip.classList.add('disabled');
    }
  });
}

// Update advanced search visibility based on settings
export function updateAdvancedSearchVisibility() {
  const searchSection = document.getElementById('advancedSearchSection');
  const showAdvancedSearch = settings.showAdvancedSearch;
  
  if (searchSection) {
    searchSection.style.display = showAdvancedSearch ? 'block' : 'none';
  }
}

// Update main progress bar visibility based on settings
export function updateMainProgressBarVisibility() {
  const progressBar = document.querySelector('.main-progress-bar');
  const showProgressBar = settings.showMainProgressBar;
  
  if (progressBar) {
    progressBar.style.display = showProgressBar ? 'block' : 'none';
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