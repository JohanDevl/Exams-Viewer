// UI Management Module
// This module handles all user interface operations, display functions, and UI state management

// HYBRID MODE: Use global variables if state module not available
let currentExam = window.currentExam || null;
let currentQuestions = window.currentQuestions || [];
let currentQuestionIndex = window.currentQuestionIndex || 0;
let selectedAnswers = window.selectedAnswers || new Set();
let isValidated = window.isValidated || false;
let isHighlightEnabled = window.isHighlightEnabled || false;
let isHighlightTemporaryOverride = window.isHighlightTemporaryOverride || false;
let questionStartTime = window.questionStartTime || null;
let settings = window.settings || {};
let favoritesData = window.favoritesData || { favorites: {} };
let statistics = window.statistics || { currentSession: null };

// Update functions for state synchronization
function updateCurrentExam(exam) {
  if (window.currentExam !== undefined) {
    window.currentExam = exam;
  }
  currentExam = exam;
}

function updateCurrentQuestions(questions) {
  if (window.currentQuestions !== undefined) {
    window.currentQuestions = questions;
  }
  currentQuestions = questions;
}

function updateCurrentQuestionIndex(index) {
  if (window.currentQuestionIndex !== undefined) {
    window.currentQuestionIndex = index;
  }
  currentQuestionIndex = index;
}

function updateSelectedAnswers(answers) {
  if (window.selectedAnswers !== undefined) {
    window.selectedAnswers = answers;
  }
  selectedAnswers = answers;
}

function updateIsValidated(validated) {
  // Always update both local and global state
  window.isValidated = validated;
  isValidated = validated;
  console.log('🔄 [UI MODULE] Updated isValidated:', validated);
}

function updateIsHighlightEnabled(enabled) {
  if (window.isHighlightEnabled !== undefined) {
    window.isHighlightEnabled = enabled;
  }
  isHighlightEnabled = enabled;
}

function updateQuestionStartTime(time) {
  if (window.questionStartTime !== undefined) {
    window.questionStartTime = time;
  }
  questionStartTime = time;
}

// Simple utility functions for hybrid mode
function processEmbeddedImages(htmlContent, imagesData) {
  if (!htmlContent || !imagesData || typeof imagesData !== 'object') {
    return htmlContent;
  }

  let processedContent = htmlContent;
  
  Object.entries(imagesData).forEach(([filename, base64Data]) => {
    if (base64Data && typeof base64Data === 'string') {
      // Create responsive image with proper styling
      const imgTag = `<img src="${base64Data}" alt="${filename}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" loading="lazy">`;
      
      // Replace various possible references to the image
      const patterns = [
        new RegExp(`\\[${filename}\\]`, 'gi'),
        new RegExp(`<img[^>]*src="[^"]*${filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'gi'),
        new RegExp(`\\b${filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      ];
      
      patterns.forEach(pattern => {
        processedContent = processedContent.replace(pattern, imgTag);
      });
    }
  });
  
  return processedContent;
}

// Sync with global state
function syncWithGlobalState() {
  // Always sync these critical variables
  currentExam = window.currentExam || currentExam;
  currentQuestions = window.currentQuestions || currentQuestions;
  currentQuestionIndex = window.currentQuestionIndex !== undefined ? window.currentQuestionIndex : currentQuestionIndex;
  selectedAnswers = window.selectedAnswers || selectedAnswers;
  isValidated = window.isValidated !== undefined ? window.isValidated : isValidated;
  isHighlightEnabled = window.isHighlightEnabled !== undefined ? window.isHighlightEnabled : isHighlightEnabled;
  isHighlightTemporaryOverride = window.isHighlightTemporaryOverride !== undefined ? window.isHighlightTemporaryOverride : isHighlightTemporaryOverride;
  questionStartTime = window.questionStartTime || questionStartTime;
  settings = window.settings || settings;
  favoritesData = window.favoritesData || favoritesData;
  statistics = window.statistics || statistics;
  
  console.log(`🔄 [UI MODULE] State synced - Questions: ${currentQuestions?.length || 0}, Index: ${currentQuestionIndex}, isValidated: ${isValidated}`);
}

// Initialize module
export function init() {
  console.log('🎨 [UI MODULE] Initializing UI module...');
  
  // Initial sync with global state
  syncWithGlobalState();
  
  console.log('✅ [UI MODULE] UI module initialized');
}

// Show/hide loading indicator
export function showLoading(show) {
  console.log(`🔄 [UI MODULE] showLoading(${show})`);
  
  const loadingSection = document.getElementById("loadingSection");
  if (loadingSection) {
    loadingSection.style.display = show ? "block" : "none";
  } else {
    console.warn('🔄 [UI MODULE] Loading section element not found');
  }
}

// Show error message
export function showError(message) {
  console.error('❌ [UI MODULE] Error:', message);
  
  const errorEl = document.getElementById("errorMessage");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
    
    // Hide success message if visible
    const successEl = document.getElementById("successMessage");
    if (successEl) {
      successEl.style.display = "none";
    }
  } else {
    // Fallback to alert if no error element
    alert('Error: ' + message);
  }
}

// Show success message
export function showSuccess(message) {
  console.log('✅ [UI MODULE] Success:', message);
  
  const successEl = document.getElementById("successMessage");
  if (successEl) {
    successEl.textContent = message;
    successEl.style.display = "block";
    
    // Hide error message if visible
    const errorEl = document.getElementById("errorMessage");
    if (errorEl) {
      errorEl.style.display = "none";
    }
  } else {
    console.log('Success: ' + message);
  }
}

// Display current question (main function)
export function displayCurrentQuestion(fromToggleAction = false) {
  // Sync with global state before displaying
  syncWithGlobalState();
  
  console.log(`🎯 [UI MODULE] displayCurrentQuestion(${fromToggleAction}) - Index: ${currentQuestionIndex}, Questions: ${currentQuestions.length}`);
  
  if (!currentQuestions || currentQuestions.length === 0) {
    console.warn('🎯 [UI MODULE] No questions available to display');
    return;
  }

  const question = currentQuestions[currentQuestionIndex];
  if (!question) {
    console.warn(`🎯 [UI MODULE] Question at index ${currentQuestionIndex} not found`);
    return;
  }

  // Create mobile bottom navigation if needed
  createMobileBottomNavigation();
  
  // Manage swipe indicators for current question
  manageSwipeIndicators();
  
  // Handle placeholder questions for lazy loading
  if (question?.isPlaceholder) {
    displayPlaceholderQuestion(question);
    return;
  }

  // Track question visit for status indicators
  if (question.question_number && window.trackQuestionVisit) {
    window.trackQuestionVisit(question.question_number);
  }

  // Reset state first (unless from toggle action)
  if (!fromToggleAction) {
    // Reset selected answers both locally and globally
    selectedAnswers = new Set();
    window.selectedAnswers = new Set();
    updateIsValidated(false);
    updateQuestionStartTime(new Date()); // Start timing the question

    // Reset highlight to default setting unless user has manually overridden it
    if (!isHighlightTemporaryOverride) {
      updateIsHighlightEnabled(settings.highlightDefault);
    }
  }

  try {
    // Show main content and hide home
    showMainContent();

    // Update question display elements
    updateQuestionDisplay(question);

    // Update answers section
    updateAnswersSection(question);

    // Update discussion section
    updateDiscussionSection(question);

    // Update all UI state elements
    updateAllUIState(question);

    console.log(`✅ [UI MODULE] Question ${currentQuestionIndex + 1} displayed successfully`);

  } catch (error) {
    console.error('❌ [UI MODULE] Error displaying question:', error);
    showError('Failed to display question: ' + error.message);
  }
}

// Display placeholder question for lazy loading
function displayPlaceholderQuestion(question) {
  const questionText = document.getElementById("questionText");
  const answersList = document.getElementById("answersList");
  
  if (!questionText || !answersList) return;
  
  // Clear existing content efficiently
  while (questionText.firstChild) questionText.removeChild(questionText.firstChild);
  while (answersList.firstChild) answersList.removeChild(answersList.firstChild);
  
  // Create loading placeholder with DOM methods
  const placeholder = document.createElement("div");
  placeholder.className = "loading-placeholder";
  
  const spinner = document.createElement("div");
  spinner.className = "spinner";
  placeholder.appendChild(spinner);
  
  const loadingText = document.createElement("p");
  loadingText.textContent = `Loading question ${question.question_number}...`;
  placeholder.appendChild(loadingText);
  
  questionText.appendChild(placeholder);
}

// Show main content and hide home
function showMainContent() {
  // Show question section and main navigation
  const questionSection = document.querySelector(".question-section");
  const mainNav = document.querySelector(".main-nav");
  
  if (questionSection) questionSection.style.display = "block";
  if (mainNav) mainNav.style.display = "flex";
  
  // Hide home content
  const homeContent = document.querySelector(".container .header");
  if (homeContent) {
    homeContent.style.display = "none";
  }
}

// Update question display elements
function updateQuestionDisplay(question) {
  // Update question number
  const questionNumberEl = document.getElementById("questionNumber");
  if (questionNumberEl) {
    questionNumberEl.textContent = `Question ${question.question_number}`;
  }

  // Update question counter
  const questionCounter = document.getElementById("questionCounter");
  if (questionCounter) {
    questionCounter.textContent = `${currentQuestionIndex + 1} / ${currentQuestions.length}`;
  }

  // Update progress bar
  updateProgressBar();

  // Update question text with embedded images
  const questionText = document.getElementById("questionText");
  if (questionText) {
    const processedContent = processEmbeddedImages(question.question, question.images);
    questionText.innerHTML = processedContent;
  }
}

// Update progress bar
function updateProgressBar() {
  const progressBar = document.querySelector('.progress');
  const progressFill = document.querySelector('.progress-fill');
  
  if (progressFill && currentQuestions.length > 0) {
    const percentage = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    progressFill.style.width = `${percentage}%`;
  }
  
  // Update main progress bar if it exists
  const mainProgressBar = document.querySelector('.main-progress-bar .progress-fill');
  if (mainProgressBar && currentQuestions.length > 0) {
    const percentage = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    mainProgressBar.style.width = `${percentage}%`;
  }
}

// Update answers section
function updateAnswersSection(question) {
  const answersList = document.getElementById("answersList");
  if (!answersList) {
    console.warn('🎯 [UI MODULE] Answers list element not found');
    return;
  }

  if (!question.answers || !Array.isArray(question.answers)) {
    answersList.innerHTML = '<p class="no-answers">No answer options available for this question.</p>';
    return;
  }

  console.log('🔍 [UI MODULE] updateAnswersSection called - Current answers count:', answersList.children.length, 'Question answers:', question.answers.length);

  // Clear existing answers
  answersList.innerHTML = '';
  console.log('🔍 [UI MODULE] Cleared answers list, now has:', answersList.children.length, 'children');

  question.answers.forEach((answer, index) => {
    const letter = String.fromCharCode(65 + index); // A, B, C, D, etc.
    const isSelected = selectedAnswers.has(letter);
    
    // Process embedded images in answer text
    const answerText = answer.text || answer;
    const processedAnswerText = processEmbeddedImages(answerText, question.images);
    
    // Create answer element
    const answerDiv = document.createElement('div');
    answerDiv.className = `answer-option ${isSelected ? 'selected' : ''}`;
    answerDiv.setAttribute('data-answer', letter);
    
    answerDiv.innerHTML = `
      <div class="answer-text">${processedAnswerText}</div>
    `;
    
    // Add click event listener
    answerDiv.addEventListener('click', () => {
      if (!isValidated) {
        toggleAnswerSelection(letter);
      }
    });
    
    answersList.appendChild(answerDiv);
  });

  console.log('🔍 [UI MODULE] Added answers to list, final count:', answersList.children.length);

  // Apply highlight if enabled
  if (isHighlightEnabled) {
    updateAnswerHighlighting();
  }
  
  // Update validate button state
  updateValidateButton();
}

// Toggle answer selection
function toggleAnswerSelection(letter) {
  // Sync with global state first
  syncWithGlobalState();
  
  const newSelectedAnswers = new Set(selectedAnswers);
  
  if (newSelectedAnswers.has(letter)) {
    newSelectedAnswers.delete(letter);
  } else {
    newSelectedAnswers.add(letter);
  }
  
  // Update both local and global state
  selectedAnswers = newSelectedAnswers;
  window.selectedAnswers = newSelectedAnswers;
  
  // Update UI for all answer options
  const answerOptions = document.querySelectorAll('.answer-option');
  answerOptions.forEach(option => {
    const optionLetter = option.dataset.answer;
    if (optionLetter) {
      const shouldBeSelected = newSelectedAnswers.has(optionLetter);
      option.classList.toggle('selected', shouldBeSelected);
    }
  });
  
  // Update validate button state
  updateValidateButton();
  
  // Update instructions to reflect new selection state
  if (window.updateInstructions && typeof window.updateInstructions === 'function') {
    window.updateInstructions();
  }
  
  // Also call legacy function if it exists for backward compatibility
  if (window.updateValidateButtonState && typeof window.updateValidateButtonState === 'function') {
    window.updateValidateButtonState();
  }
}

// Update discussion section
function updateDiscussionSection(question) {
  const discussionContent = document.getElementById("discussionContent");
  if (!discussionContent) return;

  if (!question.comments || question.comments.length === 0) {
    discussionContent.innerHTML = '<p class="no-discussion">No discussion available for this question.</p>';
    return;
  }

  let discussionHTML = '';
  question.comments.forEach((comment, index) => {
    const processedCommentText = processEmbeddedImages(comment.text || comment, question.images);
    discussionHTML += `
      <div class="comment">
        <div class="comment-header">
          <span class="comment-author">Comment ${index + 1}</span>
          ${comment.votes ? `<span class="comment-votes">${comment.votes} votes</span>` : ''}
        </div>
        <div class="comment-text">${processedCommentText}</div>
      </div>
    `;
  });

  discussionContent.innerHTML = discussionHTML;

  // Show/hide discussion based on settings
  const discussionSection = document.getElementById("discussionSection");
  if (discussionSection) {
    discussionSection.style.display = settings.showDiscussionDefault ? 'block' : 'none';
  }
}

// Update all UI state elements
function updateAllUIState(question) {
  // Sync with global state first
  syncWithGlobalState();
  
  // Update navigation buttons
  updateNavigationButtons();
  
  // Update highlight button
  updateHighlightButton();
  
  // Update favorites button
  updateFavoritesButton(question);
  
  // Update validate button
  updateValidateButton();
  
  // Update mobile navigation if it exists
  updateMobileNavigationState();
}

// Update navigation buttons state
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevQuestion');
  const nextBtn = document.getElementById('nextQuestion');
  
  if (prevBtn) {
    prevBtn.disabled = currentQuestionIndex <= 0;
  }
  
  if (nextBtn) {
    nextBtn.disabled = currentQuestionIndex >= currentQuestions.length - 1;
  }
}

// Update highlight button state
export function updateHighlightButton() {
  const highlightBtn = document.getElementById('highlightBtn');
  if (!highlightBtn) return;

  highlightBtn.classList.toggle('active', isHighlightEnabled);
  
  const icon = highlightBtn.querySelector('i');
  if (icon) {
    icon.className = isHighlightEnabled ? 'fas fa-eye-slash' : 'fas fa-eye';
  }
  
  highlightBtn.title = isHighlightEnabled ? 'Hide Correct Answers' : 'Show Correct Answers';

  // Update answer highlighting
  updateAnswerHighlighting();
}

// Update answer highlighting
function updateAnswerHighlighting() {
  console.log('🔍 [UI MODULE] updateAnswerHighlighting called');
  
  // Sync with global state first
  syncWithGlobalState();
  
  console.log('🔍 [UI MODULE] isHighlightEnabled:', isHighlightEnabled);
  console.log('🔍 [UI MODULE] window.isHighlightEnabled:', window.isHighlightEnabled);
  
  if (!currentQuestions[currentQuestionIndex]) {
    console.warn('🔍 [UI MODULE] No current question available for highlighting');
    return;
  }

  const question = currentQuestions[currentQuestionIndex];
  const correctAnswers = question.most_voted || question.correct_answers || [];
  console.log('🔍 [UI MODULE] Correct answers:', correctAnswers);
  
  const answerOptions = document.querySelectorAll('.answer-option');
  console.log('🔍 [UI MODULE] Found answer options:', answerOptions.length);

  answerOptions.forEach(option => {
    const letter = option.dataset.answer;
    const isCorrect = Array.isArray(correctAnswers) 
      ? correctAnswers.includes(letter)
      : (typeof correctAnswers === 'string' && correctAnswers.includes(letter));
    
    const shouldHighlight = isHighlightEnabled && isCorrect;
    console.log(`🔍 [UI MODULE] Answer ${letter}: isCorrect=${isCorrect}, shouldHighlight=${shouldHighlight}`);
    
    option.classList.toggle('highlighted', shouldHighlight);
  });
}

// Update favorites button
function updateFavoritesButton(question) {
  const favBtn = document.getElementById('favoriteBtn');
  if (!favBtn) return;

  const examCode = currentExam?.code || currentExam?.exam_code;
  const isFavorite = examCode && 
    favoritesData.favorites[examCode] && 
    favoritesData.favorites[examCode][question.question_number] && 
    favoritesData.favorites[examCode][question.question_number].isFavorite;

  favBtn.classList.toggle('active', isFavorite);
  
  const icon = favBtn.querySelector('i');
  if (icon) {
    icon.className = isFavorite ? 'fas fa-star' : 'far fa-star';
  }
  
  favBtn.title = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
}

// Update validate button
export function updateValidateButton() {
  // Only sync validation-related state, not all global state
  selectedAnswers = window.selectedAnswers || selectedAnswers;
  isValidated = window.isValidated || isValidated;
  
  const validateBtn = document.getElementById('validateBtn');
  if (!validateBtn) return;

  const hasSelection = selectedAnswers.size > 0;
  validateBtn.disabled = !hasSelection || isValidated;
  
  if (isValidated) {
    validateBtn.textContent = 'Validated';
    validateBtn.classList.add('validated');
  } else {
    validateBtn.textContent = 'Validate Answers';
    validateBtn.classList.remove('validated');
  }
}

// Show validation results
export function showValidationResults(correctAnswers) {
  console.log('🎯 [UI MODULE] showValidationResults called');
  console.log('🎯 [UI MODULE] correctAnswers:', correctAnswers);
  
  // No need to sync entire global state for validation results
  // Only sync the validation state specifically
  isValidated = true;
  window.isValidated = true;
  
  // Sync selectedAnswers from global state to ensure we have the correct selections
  selectedAnswers = window.selectedAnswers || selectedAnswers;
  
  const answerOptions = document.querySelectorAll('.answer-option');
  const userAnswers = Array.from(selectedAnswers);
  
  console.log('🎯 [UI MODULE] userAnswers:', userAnswers);
  console.log('🎯 [UI MODULE] Found answer options:', answerOptions.length);
  
  answerOptions.forEach(option => {
    const letter = option.dataset.answer;
    const isCorrect = Array.isArray(correctAnswers) 
      ? correctAnswers.includes(letter)
      : (typeof correctAnswers === 'string' && correctAnswers.includes(letter));
    const isSelected = userAnswers.includes(letter);
    
    console.log(`🎯 [UI MODULE] Answer ${letter}: isCorrect=${isCorrect}, isSelected=${isSelected}`);
    
    // Remove previous validation classes
    option.classList.remove('correct', 'incorrect', 'correct-not-selected');
    
    if (isSelected && isCorrect) {
      option.classList.add('correct');
      console.log(`🎯 [UI MODULE] Added 'correct' class to ${letter}`);
      console.log(`🎯 [UI MODULE] Element classes after adding correct:`, option.className);
    } else if (isSelected && !isCorrect) {
      option.classList.add('incorrect');
      console.log(`🎯 [UI MODULE] Added 'incorrect' class to ${letter}`);
      console.log(`🎯 [UI MODULE] Element classes after adding incorrect:`, option.className);
    } else if (!isSelected && isCorrect) {
      option.classList.add('correct-not-selected');
      console.log(`🎯 [UI MODULE] Added 'correct-not-selected' class to ${letter}`);
      console.log(`🎯 [UI MODULE] Element classes after adding correct-not-selected:`, option.className);
    }
  });
  
  // Show validation message
  const normalizedCorrectAnswers = Array.isArray(correctAnswers) ? correctAnswers : 
    (typeof correctAnswers === 'string' ? correctAnswers.split('') : []);
  
  const isCorrectAnswer = userAnswers.length === normalizedCorrectAnswers.length && 
    userAnswers.every(answer => normalizedCorrectAnswers.includes(answer));
  
  console.log('🎯 [UI MODULE] isCorrectAnswer:', isCorrectAnswer);
  
  if (isCorrectAnswer) {
    showSuccess('Correct! Well done.');
  } else {
    showError(`Incorrect. Correct answer${normalizedCorrectAnswers.length > 1 ? 's' : ''}: ${normalizedCorrectAnswers.join(', ')}`);
  }
  
  // Update validate button state
  updateValidateButton();
}

// Create mobile bottom navigation
function createMobileBottomNavigation() {
  // Only create if on mobile and exam is loaded
  if (window.innerWidth > 768 || !currentQuestions.length) {
    return;
  }

  const existingNav = document.querySelector('.mobile-nav-bottom');
  if (existingNav) {
    updateMobileNavigationState();
    return;
  }

  const navHTML = `
    <div class="mobile-nav-bottom">
      <button id="mobileNavPrev" class="mobile-nav-btn" ${currentQuestionIndex <= 0 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
        <span>Previous</span>
      </button>
      <button id="mobileNavRandom" class="mobile-nav-btn">
        <i class="fas fa-random"></i>
        <span>Random</span>
      </button>
      <button id="mobileNavProgress" class="mobile-nav-btn">
        <i class="fas fa-list"></i>
        <span>Progress</span>
      </button>
      <button id="mobileNavNext" class="mobile-nav-btn" ${currentQuestionIndex >= currentQuestions.length - 1 ? 'disabled' : ''}>
        <span>Next</span>
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', navHTML);

  // Add event listeners
  document.getElementById('mobileNavPrev')?.addEventListener('click', () => {
    if (window.previousQuestion) window.previousQuestion();
  });

  document.getElementById('mobileNavNext')?.addEventListener('click', () => {
    if (window.nextQuestion) window.nextQuestion();
  });

  document.getElementById('mobileNavRandom')?.addEventListener('click', () => {
    if (window.goToRandomQuestion) window.goToRandomQuestion();
  });

  document.getElementById('mobileNavProgress')?.addEventListener('click', () => {
    if (window.toggleSidebar) window.toggleSidebar();
  });
}

// Update mobile navigation state
function updateMobileNavigationState() {
  const mobileNavPrev = document.getElementById('mobileNavPrev');
  const mobileNavNext = document.getElementById('mobileNavNext');
  
  if (mobileNavPrev) {
    mobileNavPrev.disabled = currentQuestionIndex <= 0;
  }
  
  if (mobileNavNext) {
    mobileNavNext.disabled = currentQuestionIndex >= currentQuestions.length - 1;
  }
}

// Manage swipe indicators
function manageSwipeIndicators() {
  // Remove existing indicators
  const existingIndicators = document.querySelectorAll('.swipe-indicator');
  existingIndicators.forEach(indicator => indicator.remove());
}

// Handle window resize for responsive design
export function handleResize() {
  // Update mobile navigation visibility
  const isMobile = window.innerWidth <= 768;
  const mobileNav = document.querySelector('.mobile-nav-bottom');
  
  if (isMobile && !mobileNav && currentQuestions.length > 0) {
    createMobileBottomNavigation();
  } else if (!isMobile && mobileNav) {
    mobileNav.remove();
  }
  
  // Update any responsive elements
  updateResponsiveElements();
}

// Update responsive elements
function updateResponsiveElements() {
  const questionContainer = document.querySelector('.question-container');
  if (questionContainer) {
    const isMobile = window.innerWidth <= 768;
    questionContainer.classList.toggle('mobile-layout', isMobile);
  }
}

// Setup touch gestures (mobile support)
export function setupTouchGestures() {
  if (!('ontouchstart' in window)) {
    console.log('🎯 [UI MODULE] Touch not supported, skipping gesture setup');
    return;
  }

  console.log('🎯 [UI MODULE] Setting up touch gestures...');

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  const minSwipeDistance = 50;
  const maxSwipeTime = 500;

  const questionContainer = document.querySelector('.question-container') || document.body;

  questionContainer.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  questionContainer.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 0) return;

    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const touchEndTime = Date.now();

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const deltaTime = touchEndTime - touchStartTime;

    // Check if it's a valid swipe
    if (Math.abs(deltaX) > minSwipeDistance && 
        Math.abs(deltaY) < Math.abs(deltaX) && 
        deltaTime < maxSwipeTime) {
      
      if (deltaX > 0) {
        // Swipe right - previous question
        if (window.previousQuestion && currentQuestionIndex > 0) {
          window.previousQuestion();
        }
      } else {
        // Swipe left - next question
        if (window.nextQuestion && currentQuestionIndex < currentQuestions.length - 1) {
          window.nextQuestion();
        }
      }
    }
  }, { passive: true });

  console.log('✅ [UI MODULE] Touch gestures setup complete');
}

// Export main UI functions for backward compatibility
export {
  updateCurrentExam,
  updateCurrentQuestions,  
  updateCurrentQuestionIndex,
  updateSelectedAnswers,
  updateIsValidated,
  updateIsHighlightEnabled,
  updateQuestionStartTime
};