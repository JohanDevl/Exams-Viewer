// Navigation Module 
// This module handles navigation logic, progress tracking, and sidebar management

// HYBRID MODE: Use global variables if state module not available
let currentQuestions = window.currentQuestions || [];
let currentQuestionIndex = window.currentQuestionIndex || 0;
let settings = window.settings || { showMainProgressBar: true };
let statistics = window.statistics || { currentSession: null };
let favoritesData = window.favoritesData || { favorites: {} };
let currentExam = window.currentExam || null;

// Question status cache for performance
const questionStatusCache = new Map();

// Helper function to sync with global state
function syncWithGlobalState() {
  const prevQuestionsLength = currentQuestions.length;
  
  // Debug what's in window
  console.log('🧭 [NAVIGATION MODULE] DEBUG - window.currentQuestions:', window.currentQuestions ? window.currentQuestions.length : 'undefined');
  console.log('🧭 [NAVIGATION MODULE] DEBUG - window.currentQuestionIndex:', window.currentQuestionIndex);
  console.log('🧭 [NAVIGATION MODULE] DEBUG - window.currentExam:', window.currentExam ? window.currentExam.exam_name : 'undefined');
  console.log('🧭 [NAVIGATION MODULE] DEBUG - window.statistics:', window.statistics ? 'exists' : 'undefined');
  console.log('🧭 [NAVIGATION MODULE] DEBUG - window.statistics.currentSession:', window.statistics?.currentSession ? 'exists' : 'undefined');
  
  // Force sync with proper fallback
  if (window.currentQuestions && Array.isArray(window.currentQuestions)) {
    currentQuestions = window.currentQuestions;
  } else {
    console.warn('🧭 [NAVIGATION MODULE] window.currentQuestions is not a valid array:', window.currentQuestions);
  }
  
  currentQuestionIndex = window.currentQuestionIndex !== undefined ? window.currentQuestionIndex : currentQuestionIndex;
  settings = window.settings || settings;
  
  // Enhanced statistics synchronization
  if (window.statistics) {
    statistics = {
      ...statistics,
      ...window.statistics,
      // Ensure currentSession is properly transferred
      currentSession: window.statistics.currentSession || statistics.currentSession || null
    };
    console.log('🧭 [NAVIGATION MODULE] Statistics sync - currentSession:', statistics.currentSession ? 'exists' : 'null');
  }
  
  favoritesData = window.favoritesData || favoritesData;
  currentExam = window.currentExam || currentExam;
  
  if (currentQuestions.length !== prevQuestionsLength) {
    console.log(`🧭 [NAVIGATION MODULE] Questions count changed: ${prevQuestionsLength} -> ${currentQuestions.length}`);
  }
  
  console.log(`🧭 [NAVIGATION MODULE] State synced - Questions: ${currentQuestions.length}, Index: ${currentQuestionIndex}, Exam: ${currentExam?.exam_name || 'none'}`);
}

// Helper function: truncate text to max length
function truncateText(text, maxLength) {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Helper function: check if question is visited
function isQuestionVisited(questionNumber) {
  if (!statistics.currentSession) return false;
  const questions = statistics.currentSession.vq || statistics.currentSession.visitedQuestions || [];
  return questions.includes(parseInt(questionNumber));
}

// Helper function: check if question is answered
function isQuestionAnswered(questionNumber) {
  if (!statistics.currentSession) return false;
  const questions = statistics.currentSession.q || statistics.currentSession.questions || [];
  return questions.some(q => (q.qn || q.questionNumber) == questionNumber);
}

// Helper function: check if question answered correctly
function isQuestionAnsweredCorrectly(questionNumber) {
  if (!statistics.currentSession) return false;
  const questions = statistics.currentSession.q || statistics.currentSession.questions || [];
  const question = questions.find(q => (q.qn || q.questionNumber) == questionNumber);
  return question && (question.fat || question.firstActionType) === 'c';
}

// Helper function: check if question answered incorrectly
function isQuestionAnsweredIncorrectly(questionNumber) {
  if (!statistics.currentSession) return false;
  const questions = statistics.currentSession.q || statistics.currentSession.questions || [];
  const question = questions.find(q => (q.qn || q.questionNumber) == questionNumber);
  return question && (question.fat || question.firstActionType) === 'i';
}

// Helper function: check if question answered in preview mode
function isQuestionAnsweredInPreview(questionNumber) {
  if (!statistics.currentSession) return false;
  const questions = statistics.currentSession.q || statistics.currentSession.questions || [];
  const question = questions.find(q => (q.qn || q.questionNumber) == questionNumber);
  return question && (question.fat || question.firstActionType) === 'p';
}

// Helper function: check if question is favorite
function isQuestionFavorite(questionNumber) {
  const examCode = currentExam?.code || currentExam?.exam_code;
  if (!examCode || !favoritesData.favorites[examCode]) return false;
  const favoriteData = favoritesData.favorites[examCode][questionNumber];
  return favoriteData && favoriteData.isFavorite;
}

// Helper function: check if question has notes
function hasQuestionNotes(questionNumber) {
  const examCode = currentExam?.code || currentExam?.exam_code;
  if (!examCode || !favoritesData.favorites[examCode]) return false;
  const favoriteData = favoritesData.favorites[examCode][questionNumber];
  return favoriteData && favoriteData.note && favoriteData.note.trim().length > 0;
}

// Helper function: check if question is categorized
function isQuestionCategorized(questionNumber) {
  const examCode = currentExam?.code || currentExam?.exam_code;
  if (!examCode || !favoritesData.favorites[examCode]) return false;
  const favoriteData = favoritesData.favorites[examCode][questionNumber];
  return favoriteData && favoriteData.category;
}

// Get comprehensive question status
function getQuestionStatus(questionNumber) {
  const cacheKey = `${currentExam?.exam_name || 'unknown'}_${questionNumber}`;
  
  // Check cache first
  if (questionStatusCache.has(cacheKey)) {
    return questionStatusCache.get(cacheKey);
  }
  
  const status = {
    isNew: !isQuestionVisited(questionNumber) && !isQuestionAnswered(questionNumber),
    isViewed: isQuestionVisited(questionNumber) && !isQuestionAnswered(questionNumber),
    isAnsweredCorrectly: isQuestionAnsweredCorrectly(questionNumber),
    isAnsweredIncorrectly: isQuestionAnsweredIncorrectly(questionNumber),
    isAnsweredInPreview: isQuestionAnsweredInPreview(questionNumber),
    isFavorite: isQuestionFavorite(questionNumber),
    hasNotes: hasQuestionNotes(questionNumber),
    isCategorized: isQuestionCategorized(questionNumber),
    isAnswered: isQuestionAnswered(questionNumber)
  };
  
  // Determine primary status
  if (status.isAnsweredCorrectly) {
    status.primaryStatus = 'correct';
  } else if (status.isAnsweredIncorrectly) {
    status.primaryStatus = 'incorrect';
  } else if (status.isAnsweredInPreview) {
    status.primaryStatus = 'preview';
  } else if (status.isViewed) {
    status.primaryStatus = 'viewed';
  } else {
    status.primaryStatus = 'new';
  }
  
  // Cache the result (limit cache size)
  if (questionStatusCache.size > 200) {
    const firstKey = questionStatusCache.keys().next().value;
    questionStatusCache.delete(firstKey);
  }
  questionStatusCache.set(cacheKey, status);
  
  return status;
}

// Get count of answered questions
function getAnsweredQuestionsCount() {
  // Always sync to ensure we have latest statistics
  syncWithGlobalState();
  
  if (!statistics || !statistics.currentSession) {
    console.log('🧭 [NAVIGATION MODULE] No current session for answered count - statistics:', statistics ? 'exists' : 'null');
    console.log('🧭 [NAVIGATION MODULE] window.statistics check:', window.statistics ? 'exists' : 'null');
    console.log('🧭 [NAVIGATION MODULE] window.statistics.currentSession check:', window.statistics?.currentSession ? 'exists' : 'null');
    return 0;
  }
  
  const questions = statistics.currentSession.q || statistics.currentSession.questions || [];
  const answeredCount = questions.filter(q => {
    const hasFirstAction = (q.far !== undefined && q.far !== null) || (q.firstActionRecorded !== undefined && q.firstActionRecorded !== null);
    return hasFirstAction;
  }).length;
  
  console.log(`🧭 [NAVIGATION MODULE] Answered questions: ${answeredCount}/${questions.length} total session questions`);
  console.log('🧭 [NAVIGATION MODULE] Session questions sample (first 3):', questions.slice(0, 3).map(q => ({
    qn: q.qn || q.questionNumber,
    far: q.far || q.firstActionRecorded,
    fat: q.fat || q.firstActionType
  })));
  
  return answeredCount;
}

// Update progress bar
function updateProgressBar() {
  const progressBar = document.getElementById("overallProgress");
  if (!progressBar) return;
  
  // Sync with global state to ensure we have latest data
  syncWithGlobalState();
  
  if (!currentQuestions.length) {
    console.log('🧭 [NAVIGATION MODULE] No questions available for progress bar');
    return;
  }
  
  const totalQuestions = currentQuestions.length;
  const answeredCount = getAnsweredQuestionsCount();
  const percentage = (answeredCount / totalQuestions) * 100;
  
  console.log(`🧭 [NAVIGATION MODULE] Progress bar: ${answeredCount}/${totalQuestions} (${percentage.toFixed(1)}%)`);
  
  progressBar.style.width = `${percentage}%`;
  progressBar.setAttribute("aria-valuenow", percentage.toFixed(1));
  
  // Update progress text
  const progressText = document.getElementById("progressText");
  if (progressText) {
    progressText.textContent = `${answeredCount}/${totalQuestions} (${percentage.toFixed(1)}%)`;
  }
}

// Update main progress indicator in header
function updateMainProgressBar() {
  const mainProgressSection = document.getElementById("mainProgressSection");
  if (!mainProgressSection) return;

  // Sync with global state to ensure we have latest data
  syncWithGlobalState();
  
  if (!currentQuestions.length) {
    console.log('🧭 [NAVIGATION MODULE] No questions available for main progress bar');
    return;
  }

  // Check if the main progress bar is enabled in settings
  if (!settings.showMainProgressBar) {
    mainProgressSection.style.display = "none";
    return;
  }

  // Show the progress section if it's hidden and enabled
  if (mainProgressSection.style.display === "none") {
    mainProgressSection.style.display = "block";
  }

  const totalQuestions = currentQuestions.length;
  const answeredCount = getAnsweredQuestionsCount();
  const percentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  
  console.log(`🧭 [NAVIGATION MODULE] Main progress: ${answeredCount}/${totalQuestions} (${percentage.toFixed(1)}%)`);
  
  // Update progress bar
  const progressBar = mainProgressSection.querySelector('.main-progress-fill');
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }
  
  // Update text displays - show current question position AND answer progress
  const progressText = mainProgressSection.querySelector('.main-progress-text');
  if (progressText) {
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
  }
  
  const progressPercentage = mainProgressSection.querySelector('.main-progress-percentage');
  if (progressPercentage) {
    progressPercentage.textContent = `${answeredCount}/${totalQuestions} answered (${percentage.toFixed(1)}%)`;
  }
}

export function init() {
  console.log('🧭 [NAVIGATION MODULE] Initializing Navigation module...');
  
  // Initial sync with global state
  syncWithGlobalState();
  
  // Expose updateProgressSidebar for legacy compatibility
  window.navigationModuleUpdateProgressSidebar = updateProgressSidebar;
  
  console.log('✅ [NAVIGATION MODULE] Navigation module initialized');
}

export function handleKeyboardShortcuts(event) {
  console.log('🧭 [NAVIGATION MODULE] handleKeyboardShortcuts - stub implementation', event.key);
}

export function addToNavigationHistory(index) {
  console.log('🧭 [NAVIGATION MODULE] addToNavigationHistory - stub implementation', index);
}

export function updateProgressSidebar() {
  console.log('🧭 [NAVIGATION MODULE] updateProgressSidebar() called');
  
  // Sync with global state before updating
  syncWithGlobalState();
  
  const sidebar = document.getElementById("progressSidebar");
  if (!sidebar || !currentQuestions.length) {
    console.log('🧭 [NAVIGATION MODULE] No sidebar or questions found');
    return;
  }
  
  const questionList = sidebar.querySelector(".question-list");
  if (!questionList) {
    console.log('🧭 [NAVIGATION MODULE] No question list found in sidebar');
    return;
  }
  
  // Generate question items with enhanced status indicators
  const items = currentQuestions.map((question, index) => {
    const isCurrentQuestion = index === currentQuestionIndex;
    const isPlaceholder = question.isPlaceholder;
    
    let statusClass = "";
    let statusIcon = "";
    let questionPreview = "";
    let statusBadges = "";
    
    if (isPlaceholder) {
      statusClass = "loading";
      statusIcon = '<i class="fas fa-spinner fa-spin"></i>';
      questionPreview = `Chunk ${question.chunkId + 1} - Loading...`;
    } else {
      const questionStatus = getQuestionStatus(question.question_number);
      questionPreview = truncateText(question.question || "", 60);
      
      // Determine main status class and icon based on current question and status
      if (isCurrentQuestion) {
        statusClass = "current";
        statusIcon = '<i class="fas fa-arrow-right"></i>';
      } else {
        statusClass = questionStatus.primaryStatus;
        
        // Set icon based on primary status
        switch (questionStatus.primaryStatus) {
          case 'correct':
            statusIcon = '<i class="fas fa-check-circle"></i>';
            break;
          case 'incorrect':
            statusIcon = '<i class="fas fa-times-circle"></i>';
            break;
          case 'preview':
            statusIcon = '<i class="fas fa-lightbulb"></i>';
            break;
          case 'viewed':
            statusIcon = '<i class="fas fa-eye"></i>';
            break;
          case 'new':
          default:
            statusIcon = '<i class="far fa-circle"></i>';
            break;
        }
      }
      
      // Generate status badges
      const badges = [];
      
      // Primary status badge
      let primaryBadgeText = "";
      let primaryBadgeIcon = "";
      let primaryBadgeClass = questionStatus.primaryStatus;
      
      switch (questionStatus.primaryStatus) {
        case 'correct':
          primaryBadgeText = "Correct";
          primaryBadgeIcon = '<i class="fas fa-check"></i>';
          break;
        case 'incorrect':
          primaryBadgeText = "Wrong";
          primaryBadgeIcon = '<i class="fas fa-times"></i>';
          break;
        case 'preview':
          primaryBadgeText = "Preview";
          primaryBadgeIcon = '<i class="fas fa-lightbulb"></i>';
          break;
        case 'viewed':
          primaryBadgeText = "Viewed";
          primaryBadgeIcon = '<i class="fas fa-eye"></i>';
          break;
        case 'new':
          primaryBadgeText = "New";
          primaryBadgeIcon = '<i class="fas fa-circle"></i>';
          break;
      }
      
      badges.push(`
        <span class="status-badge ${primaryBadgeClass}" aria-label="${primaryBadgeText} question">
          ${primaryBadgeIcon}
          ${primaryBadgeText}
        </span>
      `);
      
      // Secondary badges for additional properties
      if (questionStatus.isFavorite) {
        badges.push(`
          <span class="status-badge favorite" aria-label="Favorited question">
            <i class="fas fa-star"></i>
          </span>
        `);
      }
      
      if (questionStatus.hasNotes) {
        badges.push(`
          <span class="status-badge with-notes" aria-label="Question has notes">
            <i class="fas fa-sticky-note"></i>
          </span>
        `);
      }
      
      if (questionStatus.isCategorized) {
        badges.push(`
          <span class="status-badge categorized" aria-label="Question is categorized">
            <i class="fas fa-tag"></i>
          </span>
        `);
      }
      
      statusBadges = `
        <div class="question-status-indicators">
          <div class="primary-status">
            ${badges[0]}
          </div>
          <div class="secondary-badges">
            ${badges.slice(1).join('')}
          </div>
        </div>
      `;
    }
    
    return `
      <div class="question-item question-item-enhanced ${statusClass}" data-index="${index}" onclick="navigateToQuestionAsync(${index})">
        <div class="question-number">
          ${statusIcon}
          <span>Q${question.question_number || index + 1}</span>
        </div>
        <div class="question-preview">${questionPreview}</div>
        ${statusBadges}
      </div>
    `;
  }).join("");
  
  questionList.innerHTML = items;
  
  // Update progress bar
  updateProgressBar();
  
  // Update main progress bar
  updateMainProgressBar();
  
  // Scroll current question into view
  setTimeout(() => {
    const currentItem = questionList.querySelector(".question-item.current");
    if (currentItem) {
      currentItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
  
  console.log('✅ [NAVIGATION MODULE] Progress sidebar updated successfully');
}

export function saveResumePosition(examCode, questionIndex) {
  console.log('🧭 [NAVIGATION MODULE] saveResumePosition - stub implementation', examCode, questionIndex);
}

export function checkResumePosition(examCode) {
  console.log('🧭 [NAVIGATION MODULE] checkResumePosition - stub implementation', examCode);
}

// Export helper functions for legacy compatibility
export { 
  getQuestionStatus, 
  truncateText, 
  updateProgressBar, 
  updateMainProgressBar,
  getAnsweredQuestionsCount,
  isQuestionAnswered,
  isQuestionAnsweredCorrectly,
  isQuestionAnsweredIncorrectly,
  isQuestionAnsweredInPreview,
  isQuestionVisited,
  isQuestionFavorite,
  hasQuestionNotes,
  isQuestionCategorized
};