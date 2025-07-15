// Statistics Management Module
// This module handles all statistics tracking, session management, and data persistence

import { 
  statistics, 
  updateStatistics 
} from './state.js';

import { 
  compressData, 
  decompressData, 
  generateCompactId,
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove
} from './utils.js';

// Session data structure
export class ExamSession {
  constructor(examCode, examName) {
    this.id = generateCompactId(); // Use shorter session ID
    this.ec = examCode; // Exam code - shortened
    this.en = examName; // Exam name - shortened
    this.st = Date.now(); // Start time as timestamp - shortened
    this.et = null; // End time - shortened
    this.q = []; // Array of question attempts - shortened
    this.vq = []; // Array of visited question numbers - shortened
    this.tq = 0; // Total questions - shortened
    this.ca = 0; // Correct answers - shortened
    this.ia = 0; // Incorrect answers - shortened
    this.pa = 0; // Preview answers - shortened
    this.tt = 0; // Total time in seconds - shortened
    this.c = false; // Completed flag - shortened
  }

  // Backward compatibility getters for old property names
  get examCode() { return this.ec; }
  get examName() { return this.en; }
  get startTime() { return this.st; }
  get endTime() { return this.et; }
  get questions() { return this.q; }
  get visitedQuestions() { return this.vq; }
  get totalQuestions() { return this.tq; }
  get correctAnswers() { return this.ca; }
  get incorrectAnswers() { return this.ia; }
  get previewAnswers() { return this.pa; }
  get totalTime() { return this.tt; }
  get completed() { return this.c; }

  // Backward compatibility setters
  set examCode(value) { this.ec = value; }
  set examName(value) { this.en = value; }
  set startTime(value) { this.st = value; }
  set endTime(value) { this.et = value; }
  set questions(value) { this.q = value; }
  set totalQuestions(value) { this.tq = value; }
  set correctAnswers(value) { this.ca = value; }
  set incorrectAnswers(value) { this.ia = value; }
  set previewAnswers(value) { this.pa = value; }
  set totalTime(value) { this.tt = value; }
  set completed(value) { this.c = value; }
}

// Question attempt data structure
export class QuestionAttempt {
  constructor(questionNumber, correctAnswers) {
    this.qn = questionNumber; // Shortened property name
    this.ca = correctAnswers; // Array of correct answer letters - shortened
    this.ua = []; // Array of user selected answers - shortened
    this.att = []; // Array of attempt objects - shortened
    this.st = Date.now(); // Start time as timestamp (seconds since epoch) - shortened
    this.et = null; // End time - shortened
    this.ts = 0; // Time spent in seconds - shortened
    this.ic = false; // Is correct - shortened
    this.fs = 0; // Final score 0-100 percentage - shortened
    this.rc = 0; // Reset count - shortened
    this.hbc = 0; // Highlight button clicks - shortened
    this.hvc = 0; // Highlight view count - shortened
    this.fat = null; // First action type: 'c', 'i', 'p' (correct, incorrect, preview) - shortened
    this.far = false; // First action recorded flag - shortened
  }

  addAttempt(selectedAnswers, isCorrect, timeSpent, wasHighlightEnabled = false) {
    const attempt = {
      a: Array.from(selectedAnswers), // answers - shortened
      c: isCorrect, // is correct - shortened
      h: wasHighlightEnabled, // highlight enabled - shortened
    };
    this.att.push(attempt);
    this.ua = Array.from(selectedAnswers);
    this.ic = isCorrect;
    this.ts += timeSpent;
    this.et = Date.now();

    // Track first action only
    if (!this.far) {
      if (wasHighlightEnabled) {
        this.fat = "p"; // preview
      } else {
        this.fat = isCorrect ? "c" : "i"; // correct or incorrect
      }
      this.far = true;
    }

    // Calculate final score based on correctness (only if highlight was not enabled)
    if (!wasHighlightEnabled) {
      if (isCorrect) {
        this.fs = 100;
      } else {
        // Partial credit based on correct answers selected
        const correctSelected = Array.from(selectedAnswers).filter((answer) =>
          this.ca.includes(answer)
        ).length;
        this.fs = Math.round((correctSelected / this.ca.length) * 100);
      }
    }
  }

  addHighlightButtonClick() {
    this.hbc++;

    // Track first action if this is the first interaction
    if (!this.far) {
      this.fat = "p"; // preview
      this.far = true;
    }
  }

  addReset() {
    this.rc++;
  }

  addHighlightView() {
    this.hvc++;

    // Track first action if this is the first interaction
    if (!this.far) {
      this.fat = "p"; // preview
      this.far = true;
    }
  }

  // Helper method to get total highlight interactions
  getTotalHighlightInteractions() {
    return this.hbc + this.hvc;
  }

  // Backward compatibility getters for old property names
  get questionNumber() { return this.qn; }
  get correctAnswers() { return this.ca; }
  get userAnswers() { return this.ua; }
  get attempts() { return this.att; }
  get startTime() { return this.st; }
  get endTime() { return this.et; }
  get timeSpent() { return this.ts; }
  get isCorrect() { return this.ic; }
  get finalScore() { return this.fs; }
  get resetCount() { return this.rc; }
  get highlightButtonClicks() { return this.hbc; }
  get highlightViewCount() { return this.hvc; }
  get firstActionType() { return this.fat; }
  get firstActionRecorded() { return this.far; }

  // Backward compatibility setters
  set questionNumber(value) { this.qn = value; }
  set correctAnswers(value) { this.ca = value; }
  set userAnswers(value) { this.ua = value; }
  set attempts(value) { this.att = value; }
  set startTime(value) { this.st = value; }
  set endTime(value) { this.et = value; }
  set timeSpent(value) { this.ts = value; }
  set isCorrect(value) { this.ic = value; }
  set finalScore(value) { this.fs = value; }
  set resetCount(value) { this.rc = value; }
  set highlightButtonClicks(value) { this.hbc = value; }
  set highlightViewCount(value) { this.hvc = value; }
  set firstActionType(value) { this.fat = value; }
  set firstActionRecorded(value) { this.far = value; }
}

// Development mode utilities
function isDevelopmentMode() {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

function devLog(...args) {
  if (isDevelopmentMode()) {
    console.log(...args);
  }
}

function devError(...args) {
  if (isDevelopmentMode()) {
    console.error(...args);
  }
}

// Save statistics to localStorage
export function saveStatistics() {
  try {
    // Use simple JSON stringify to avoid compression corruption issues
    const dataToSave = JSON.stringify(statistics);
    
    // Check if data would exceed localStorage limits (roughly 5MB)
    if (dataToSave.length > 4500000) { // 4.5MB threshold
      console.warn("Statistics data is getting large, consider cleaning old sessions");
      
      // Keep only last 50 sessions to prevent storage overflow
      if (statistics.sessions.length > 50) {
        statistics.sessions = statistics.sessions.slice(-50);
        console.log("Trimmed statistics to last 50 sessions");
      }
    }
    
    safeLocalStorageSet("examViewerStatistics", statistics);

    // Log size in development
    if (isDevelopmentMode()) {
      const sizeKB = (dataToSave.length / 1024).toFixed(1);
      devLog(`Statistics saved - Size: ${sizeKB} KB, Sessions: ${statistics.sessions.length}`);
    }
  } catch (error) {
    devError("Error saving statistics:", error);
    
    // If save fails due to quota, try to clear old data
    if (error.name === 'QuotaExceededError') {
      console.warn("localStorage quota exceeded, clearing old statistics");
      statistics.sessions = statistics.sessions.slice(-20); // Keep only last 20 sessions
      try {
        safeLocalStorageSet("examViewerStatistics", statistics);
        console.log("Statistics saved after cleanup");
      } catch (cleanupError) {
        devError("Failed to save even after cleanup:", cleanupError);
      }
    }
  }
}

// Clear corrupted data
export function clearCorruptedData() {
  try {
    // Remove corrupted localStorage entries
    const keysToCheck = [
      "examViewerStatistics",
      "examViewerFavorites",
      "examViewerSettings",
      "examViewerResumePositions"
    ];
    
    keysToCheck.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          JSON.parse(data); // Test if it can be parsed
        }
      } catch (parseError) {
        console.warn(`Removing corrupted data for key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Reset statistics if they're corrupted
    if (!statistics || typeof statistics !== 'object') {
      updateStatistics({
        sessions: [],
        currentSession: null,
        totalStats: {
          totalQuestions: 0,
          totalCorrect: 0,
          totalIncorrect: 0,
          totalPreview: 0,
          totalTime: 0,
          examStats: {}
        }
      });
    }
  } catch (error) {
    console.error("Error clearing corrupted data:", error);
  }
}

// Load statistics from localStorage
export function loadStatistics() {
  try {
    const savedStats = safeLocalStorageGet("examViewerStatistics");
    if (savedStats) {
      // Handle both new and legacy data formats
      let parsed = savedStats;
      
      // If it's a string, try to parse it (legacy format)
      if (typeof savedStats === 'string') {
        try {
          parsed = JSON.parse(savedStats);
        } catch (error) {
          devLog("JSON parse failed, trying decompression for legacy data:", error);
          try {
            parsed = decompressData(savedStats);
            devLog("Successfully loaded legacy compressed data");
            // Save in new format immediately
            setTimeout(() => saveStatistics(), 1000);
          } catch (decompressionError) {
            devError("Both JSON parse and decompression failed:", decompressionError);
            throw decompressionError;
          }
        }
      }

      const loadedStats = {
        sessions: parsed.sessions || [],
        currentSession: parsed.currentSession || null,
        totalStats: parsed.totalStats || {
          totalQuestions: 0,
          totalCorrect: 0,
          totalIncorrect: 0,
          totalPreview: 0,
          totalTime: 0,
          examStats: {}
        }
      };

      updateStatistics(loadedStats);

      // Recalculate stats to ensure consistency
      recalculateTotalStats();
      
      devLog(`Loaded statistics: ${statistics.sessions.length} sessions`);
    } else {
      devLog("No saved statistics found, using defaults");
    }
  } catch (error) {
    devError("Error loading statistics, resetting to defaults:", error);
    clearCorruptedData();
  }
}

// Recalculate total statistics from sessions
export function recalculateTotalStats() {
  const newTotalStats = {
    totalQuestions: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    totalPreview: 0,
    totalTime: 0,
    totalResets: 0,
    totalHighlightAttempts: 0,
    examStats: {},
  };

  statistics.sessions.forEach((session) => {
    newTotalStats.totalQuestions += session.tq || session.totalQuestions || 0;
    newTotalStats.totalCorrect += session.ca || session.correctAnswers || 0;
    newTotalStats.totalIncorrect += session.ia || session.incorrectAnswers || 0;
    newTotalStats.totalPreview += session.pa || session.previewAnswers || 0;
    newTotalStats.totalTime += session.tt || session.totalTime || 0;

    // Calculate resets and highlight attempts from session questions
    const questions = session.q || session.questions || [];
    if (questions.length > 0) {
      questions.forEach((question) => {
        newTotalStats.totalResets += question.rc || question.resetCount || 0;
        // Calculate total highlight interactions using new method or old way
        const highlightInteractions = question.getTotalHighlightInteractions
          ? question.getTotalHighlightInteractions()
          : (question.hbc || question.highlightButtonClicks || 0) + 
            (question.hvc || question.highlightViewCount || 0);
        newTotalStats.totalHighlightAttempts += highlightInteractions;
      });
    }

    // Per-exam statistics
    const examCode = session.ec || session.examCode;
    if (examCode) {
      if (!newTotalStats.examStats[examCode]) {
        newTotalStats.examStats[examCode] = {
          sessions: 0,
          totalQuestions: 0,
          totalCorrect: 0,
          totalIncorrect: 0,
          totalPreview: 0,
          totalTime: 0,
          lastPlayed: null,
          examName: session.en || session.examName || examCode,
        };
      }
      
      const examStat = newTotalStats.examStats[examCode];
      examStat.sessions++;
      examStat.totalQuestions += session.tq || session.totalQuestions || 0;
      examStat.totalCorrect += session.ca || session.correctAnswers || 0;
      examStat.totalIncorrect += session.ia || session.incorrectAnswers || 0;
      examStat.totalPreview += session.pa || session.previewAnswers || 0;
      examStat.totalTime += session.tt || session.totalTime || 0;
      
      const sessionEndTime = session.et || session.endTime;
      if (sessionEndTime && (!examStat.lastPlayed || sessionEndTime > examStat.lastPlayed)) {
        examStat.lastPlayed = sessionEndTime;
      }
    }
  });

  updateStatistics({ ...statistics, totalStats: newTotalStats });
}

// Start a new exam session
export function startExamSession(examCode, examName) {
  // End current session if exists
  if (statistics.currentSession) {
    endCurrentSession();
  }

  const newSession = new ExamSession(examCode, examName);
  updateStatistics({ ...statistics, currentSession: newSession });
  
  devLog("Started new exam session:", statistics.currentSession);
  saveStatistics();
}

// End current session
export function endCurrentSession() {
  if (statistics.currentSession) {
    statistics.currentSession.et = Date.now();
    statistics.currentSession.c = true;

    // Calculate total time
    statistics.currentSession.tt = Math.floor(
      (statistics.currentSession.et - statistics.currentSession.st) / 1000
    );

    // Add to sessions history
    const newSessions = [...statistics.sessions, statistics.currentSession];
    updateStatistics({ 
      ...statistics, 
      sessions: newSessions, 
      currentSession: null 
    });

    // Recalculate total stats
    recalculateTotalStats();
    saveStatistics();

    devLog("Ended exam session");
  }
}

// Track question attempt
export function trackQuestionAttempt(
  questionNumber,
  correctAnswers,
  selectedAnswers,
  isCorrect,
  timeSpent,
  wasHighlightEnabled = false
) {
  if (!statistics.currentSession) return;

  // Find existing question attempt or create new one
  let questionAttempt = statistics.currentSession.questions.find(
    (q) => q.questionNumber === questionNumber
  );

  if (!questionAttempt) {
    questionAttempt = new QuestionAttempt(questionNumber, correctAnswers);
    statistics.currentSession.questions.push(questionAttempt);
  }

  // Add the attempt
  questionAttempt.addAttempt(
    selectedAnswers,
    isCorrect,
    timeSpent,
    wasHighlightEnabled
  );

  // Update session stats (only count non-highlight attempts)
  updateSessionStats();
  saveStatistics();

  devLog("Tracked question attempt:", {
    questionNumber,
    isCorrect,
    wasHighlightEnabled,
    timeSpent
  });
}

// Update session statistics
export function updateSessionStats() {
  if (!statistics.currentSession) return;

  let correct = 0;
  let incorrect = 0;
  let preview = 0;
  let totalQuestions = 0;

  devLog("🔍 DEBUG: updateSessionStats() called");
  devLog(
    "🔍 DEBUG: Current session questions:",
    (statistics.currentSession.q || statistics.currentSession.questions || []).length
  );

  const questions = statistics.currentSession.q || statistics.currentSession.questions || [];
  questions.forEach((question) => {
    // Only count questions that have any first action recorded
    const firstActionRecorded = question.far !== undefined ? question.far : question.firstActionRecorded;
    const firstActionType = question.fat || question.firstActionType;

    if (firstActionRecorded) {
      totalQuestions++;

      // Count based on first action type only
      if (firstActionType === "c") {
        correct++;
      } else if (firstActionType === "i") {
        incorrect++;
      } else if (firstActionType === "p") {
        preview++;
      }

      devLog(`🔍 DEBUG: Question ${question.qn || question.questionNumber}: firstAction=${firstActionType}, recorded=${firstActionRecorded}`);
    }
  });

  // Update session totals
  statistics.currentSession.tq = totalQuestions;
  statistics.currentSession.ca = correct;
  statistics.currentSession.ia = incorrect;
  statistics.currentSession.pa = preview;

  devLog("🔍 DEBUG: Final session stats:", {
    totalQuestions,
    correct,
    incorrect,
    preview
  });
}

// Reset all statistics
export function resetAllStatistics() {
  const currentCount = statistics.sessions.length;
  const currentSessionActive = statistics.currentSession ? "Yes" : "No";
  
  const confirmMessage = 
    `⚠️ WARNING: This will permanently delete ALL statistics data!\n\n` +
    `Current data:\n` +
    `• ${currentCount} exam sessions\n` +
    `• Active session: ${currentSessionActive}\n` +
    `• All exam performance data\n` +
    `• All progress history\n\n` +
    `This action cannot be undone. Are you sure you want to continue?`;
    
  if (!confirm(confirmMessage)) {
    return;
  }
  
  try {
    // Reset to default statistics
    const defaultStats = {
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

    updateStatistics(defaultStats);
    safeLocalStorageRemove("examViewerStatistics");
    
    console.log("✅ All statistics reset successfully");
    return true;
  } catch (error) {
    console.error("❌ Error resetting statistics:", error);
    return false;
  }
}

// Clean corrupted statistics data
export function cleanCorruptedStatistics() {
  try {
    // Remove sessions with corrupted data
    if (statistics.sessions && Array.isArray(statistics.sessions)) {
      const originalCount = statistics.sessions.length;
      statistics.sessions = statistics.sessions.filter(session => {
        // Check if session has required properties
        if (!session || typeof session !== 'object') return false;
        if (!session.ec && !session.examCode) return false;
        if (!session.st && !session.startTime) return false;
        return true;
      });
      
      const cleanedCount = statistics.sessions.length;
      if (originalCount !== cleanedCount) {
        console.log(`Cleaned ${originalCount - cleanedCount} corrupted sessions`);
        recalculateTotalStats();
        saveStatistics();
      }
    }
  } catch (error) {
    console.error("Error cleaning corrupted statistics:", error);
    clearCorruptedData();
  }
}

// Export statistics to JSON
export function exportStatistics() {
  const dataStr = JSON.stringify(statistics, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `exam-viewer-statistics-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Get session statistics summary
export function getSessionSummary(session) {
  const questions = session.q || session.questions || [];
  const totalTime = session.tt || session.totalTime || 0;
  const totalQuestions = session.tq || session.totalQuestions || 0;
  const correctAnswers = session.ca || session.correctAnswers || 0;
  const incorrectAnswers = session.ia || session.incorrectAnswers || 0;
  const previewAnswers = session.pa || session.previewAnswers || 0;

  return {
    examCode: session.ec || session.examCode,
    examName: session.en || session.examName,
    startTime: session.st || session.startTime,
    endTime: session.et || session.endTime,
    totalTime,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    previewAnswers,
    accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
    questionsAttempted: questions.length,
    completed: session.c || session.completed || false
  };
}