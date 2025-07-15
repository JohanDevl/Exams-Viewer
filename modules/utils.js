// Utility Functions Module
// This module contains reusable utility functions used across the application

// Data compression utilities
export function compressData(data) {
  try {
    const jsonString = JSON.stringify(data);

    // Enhanced compression using character frequency replacement
    const compressionMap = {
      // Property names
      '"questionNumber"': '"qn"',
      '"correctAnswers"': '"ca"',
      '"userAnswers"': '"ua"',
      '"attempts"': '"att"',
      '"startTime"': '"st"',
      '"endTime"': '"et"',
      '"timeSpent"': '"ts"',
      '"isCorrect"': '"ic"',
      '"finalScore"': '"fs"',
      '"resetCount"': '"rc"',
      '"highlightButtonClicks"': '"hbc"',
      '"highlightViewCount"': '"hvc"',
      '"firstActionType"': '"fat"',
      '"firstActionRecorded"': '"far"',
      '"examCode"': '"ec"',
      '"examName"': '"en"',
      '"examStats"': '"es"',
      '"totalStats"': '"ts"',
      '"totalQuestions"': '"tq"',
      '"totalCorrect"': '"tc"',
      '"totalIncorrect"': '"ti"',
      '"totalPreview"': '"tp"',
      '"totalTime"': '"tt"',
      '"sessions"': '"s"',
      '"currentSession"': '"cs"',
      '"completedExams"': '"ce"',
      '"averageAccuracy"': '"aa"',
      '"totalExamCount"': '"tec"',
      '"uniqueExamsCount"': '"uec"',
      '"correctAnswersRate"': '"car"',
      '"categories"': '"cat"',
      '"customCategories"': '"cc"',
      '"isRevisionMode"': '"irm"',
      '"revisionFilter"': '"rf"',
      '"favorites"': '"fav"',
      '"questions"': '"q"',
      '"visitedQuestions"': '"vq"',
      '"completed"': '"c"',
      // Common values
      ',"isFavorite":true': ',"if":1',
      ',"isFavorite":false': ',"if":0',
      ',"isCorrect":true': ',"ic":1',
      ',"isCorrect":false': ',"ic":0',
      ',"completed":true': ',"c":1',
      ',"completed":false': ',"c":0',
      ',"firstActionRecorded":true': ',"far":1',
      ',"firstActionRecorded":false': ',"far":0',
      '"validate"': '"v"',
      '"preview"': '"p"',
      '"Important"': '"I"',
      '"Review"': '"R"',
      '"Difficult"': '"D"',
    };

    let compressedString = jsonString;
    for (const [original, compressed] of Object.entries(compressionMap)) {
      compressedString = compressedString.replace(
        new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        compressed
      );
    }

    return compressedString;
  } catch (error) {
    console.warn("Compression failed, returning original data:", error);
    return JSON.stringify(data);
  }
}

export function decompressData(compressedData) {
  try {
    // Reverse the compression mapping
    const decompressionMap = {
      // Property names
      '"qn"': '"questionNumber"',
      '"ca"': '"correctAnswers"',
      '"ua"': '"userAnswers"',
      '"att"': '"attempts"',
      '"st"': '"startTime"',
      '"et"': '"endTime"',
      '"ts"': '"timeSpent"',
      '"ic"': '"isCorrect"',
      '"fs"': '"finalScore"',
      '"rc"': '"resetCount"',
      '"hbc"': '"highlightButtonClicks"',
      '"hvc"': '"highlightViewCount"',
      '"fat"': '"firstActionType"',
      '"far"': '"firstActionRecorded"',
      '"ec"': '"examCode"',
      '"en"': '"examName"',
      '"es"': '"examStats"',
      '"ts"': '"totalStats"',
      '"tq"': '"totalQuestions"',
      '"tc"': '"totalCorrect"',
      '"ti"': '"totalIncorrect"',
      '"tp"': '"totalPreview"',
      '"tt"': '"totalTime"',
      '"s"': '"sessions"',
      '"cs"': '"currentSession"',
      '"ce"': '"completedExams"',
      '"aa"': '"averageAccuracy"',
      '"tec"': '"totalExamCount"',
      '"uec"': '"uniqueExamsCount"',
      '"car"': '"correctAnswersRate"',
      '"cat"': '"categories"',
      '"cc"': '"customCategories"',
      '"irm"': '"isRevisionMode"',
      '"rf"': '"revisionFilter"',
      '"fav"': '"favorites"',
      '"q"': '"questions"',
      '"vq"': '"visitedQuestions"',
      '"c"': '"completed"',
      // Common values
      ',"if":1': ',"isFavorite":true',
      ',"if":0': ',"isFavorite":false',
      ',"ic":1': ',"isCorrect":true',
      ',"ic":0': ',"isCorrect":false',
      ',"c":1': ',"completed":true',
      ',"c":0': ',"completed":false',
      ',"far":1': ',"firstActionRecorded":true',
      ',"far":0': ',"firstActionRecorded":false',
      '"v"': '"validate"',
      '"p"': '"preview"',
      '"I"': '"Important"',
      '"R"': '"Review"',
      '"D"': '"Difficult"',
    };

    let decompressedString = compressedData;
    for (const [compressed, original] of Object.entries(decompressionMap)) {
      decompressedString = decompressedString.replace(
        new RegExp(compressed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        original
      );
    }

    return JSON.parse(decompressedString);
  } catch (error) {
    console.warn("Decompression failed, attempting to parse as-is:", error);
    try {
      return JSON.parse(compressedData);
    } catch (parseError) {
      console.error("Failed to parse data:", parseError);
      return null;
    }
  }
}

// Time formatting utilities
export function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

// File size formatting
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Text processing utilities
export function truncateText(text, maxLength) {
  if (!text) return "";
  const cleanText = text.replace(/<[^>]*>/g, "").trim();
  return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + "..." : cleanText;
}

export function convertUrlsToLinks(text) {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s<>"]+)/gi;
  return text.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
}

export function formatCommentText(text, imagesData = null) {
  if (!text) return "";

  // Convert line breaks to <br> tags
  let formattedText = text.replace(/\n/g, "<br>");

  // Process embedded images if available
  if (imagesData && Object.keys(imagesData).length > 0) {
    formattedText = processEmbeddedImages(formattedText, imagesData);
  }

  // Convert URLs to clickable links
  formattedText = convertUrlsToLinks(formattedText);

  return formattedText;
}

// UI animation utilities
export function animateNumberChange(element, newValue) {
  if (!element) return;
  
  const currentValue = parseInt(element.textContent) || 0;
  if (currentValue === newValue) return;
  
  const startValue = currentValue;
  const difference = newValue - startValue;
  const duration = 400; // Animation duration in ms
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Use easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentNumber = Math.round(startValue + (difference * easeOutQuart));
    
    element.textContent = currentNumber;
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  }
  
  requestAnimationFrame(updateNumber);
}

// Mobile haptic feedback
export function addHapticFeedback() {
  if ('vibrate' in navigator) {
    navigator.vibrate(50); // Short vibration
  }
}

// Markdown rendering utility
export function renderMarkdown(markdown) {
  let html = markdown;

  // Convert headers by counting # symbols
  html = html.replace(/^(#{1,6})\s+(.*$)/gim, (match, hashes, content) => {
    const level = hashes.length;

    // Add icons for changelog sections (level 3 headers)
    if (level === 3) {
      const sectionIcons = {
        Added:
          '<i class="fas fa-plus-circle" style="color: var(--success-color);"></i>',
        Changed:
          '<i class="fas fa-edit" style="color: var(--accent-color);"></i>',
        Enhanced:
          '<i class="fas fa-arrow-up" style="color: var(--accent-color);"></i>',
        Fixed:
          '<i class="fas fa-wrench" style="color: var(--warning-color);"></i>',
        Removed:
          '<i class="fas fa-minus-circle" style="color: var(--error-color);"></i>',
        Deprecated:
          '<i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i>',
        Security:
          '<i class="fas fa-shield-alt" style="color: var(--accent-color);"></i>',
      };

      const icon = sectionIcons[content.trim()] || "";
      return `<h${level} id="${content
        .toLowerCase()
        .replace(/\s+/g, "-")}">${icon} ${content}</h${level}>`;
    }

    return `<h${level} id="${content
      .toLowerCase()
      .replace(/\s+/g, "-")}">${content}</h${level}>`;
  });

  // Convert **bold** to <strong>
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert *italic* to <em>
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Convert `code` to <code>
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Convert [link](url) to <a>
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Convert line breaks to <br> for single newlines, but preserve paragraphs
  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/\n/g, "<br>");
  html = `<p>${html}</p>`;

  // Fix empty paragraphs
  html = html.replace(/<p><\/p>/g, "");

  // Convert lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

  return html;
}

// Process embedded images in content
export function processEmbeddedImages(htmlContent, imagesData) {
  if (!imagesData || Object.keys(imagesData).length === 0) {
    return htmlContent;
  }

  let processedContent = htmlContent;

  // Process each image in the imagesData
  Object.entries(imagesData).forEach(([imageName, imageData]) => {
    if (imageData && imageData.base64) {
      // Create the base64 data URL
      const mimeType = imageData.format === 'webp' ? 'image/webp' : 
                     imageData.format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = `data:${mimeType};base64,${imageData.base64}`;

      // Replace all occurrences of the image name with the embedded image
      const imageRegex = new RegExp(imageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      processedContent = processedContent.replace(imageRegex, 
        `<img src="${dataUrl}" alt="${imageName}" class="embedded-image" loading="lazy" style="max-width: 100%; height: auto; border-radius: 4px; margin: 8px 0;" />`
      );
    }
  });

  return processedContent;
}

// ID generation utility
export function generateCompactId() {
  const now = Date.now();
  const random = Math.random().toString(36).substr(2, 3);
  return `${now.toString(36)}${random}`;
}

// Debounce utility for performance optimization
export function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Deep clone utility
export function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === "object") {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

// Array shuffling utility
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Local storage utilities with error handling
export function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to save to localStorage: ${key}`, error);
    return false;
  }
}

export function safeLocalStorageGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load from localStorage: ${key}`, error);
    return defaultValue;
  }
}

export function safeLocalStorageRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove from localStorage: ${key}`, error);
    return false;
  }
}