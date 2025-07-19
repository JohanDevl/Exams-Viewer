/**
 * Utility Functions Module
 * Contains reusable utility functions used throughout the application
 */

// ===== TIME AND FORMAT UTILITIES =====

/**
 * Format seconds into human readable time
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
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

/**
 * Format bytes into human readable file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size string
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Truncate text to maximum length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength) {
  if (!text) return "";
  const cleanText = text.replace(/<[^>]*>/g, "").trim();
  return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + "..." : cleanText;
}

// ===== MOBILE AND TOUCH UTILITIES =====

/**
 * Add haptic feedback for mobile devices
 */
export function addHapticFeedback() {
  if ('vibrate' in navigator) {
    navigator.vibrate(50); // Short vibration
  }
}

/**
 * Setup touch feedback for interactive elements
 */
export function setupTouchFeedback() {
  // Add touch feedback class to interactive elements
  const interactiveElements = document.querySelectorAll('.nav-btn, .answer-option, .exam-load-btn, .favorites-actions button, .export-actions button');
  
  interactiveElements.forEach(element => {
    element.classList.add('touch-feedback');
    
    // Add touch feedback for mobile
    element.addEventListener('touchstart', () => {
      addHapticFeedback();
    });
  });
}

// ===== IMAGE PROCESSING UTILITIES =====

/**
 * Process embedded images in HTML content
 * @param {string} htmlContent - HTML content with image references
 * @param {Object} imagesData - Image data with base64 content
 * @returns {string} Processed HTML with embedded images
 */
export function processEmbeddedImages(htmlContent, imagesData) {
  if (!htmlContent || !imagesData || Object.keys(imagesData).length === 0) {
    return htmlContent;
  }
  let processedContent = htmlContent;
  
  // Replace image references with base64 data
  Object.keys(imagesData).forEach(imageId => {
    const imageInfo = imagesData[imageId];
    
    // Use WebP format for better compression, fallback to JPEG
    const imageDataUrl = `data:image/webp;base64,${imageInfo.webp}`;
    
    // Pattern to find img tags with this data-img-id
    const imgPattern = new RegExp(`<img[^>]*data-img-id="${imageId}"[^>]*>`, 'gi');
    
    processedContent = processedContent.replace(imgPattern, (match) => {
      let updatedTag = match;
      
      // Replace the src attribute (it might be truncated base64)
      if (match.includes('src=')) {
        updatedTag = updatedTag.replace(/src="[^"]*"/, `src="${imageDataUrl}"`);
      } else {
        // Add src if not present
        updatedTag = updatedTag.replace('<img', `<img src="${imageDataUrl}"`);
      }
      
      // Add responsive styling
      if (!updatedTag.includes('style=')) {
        updatedTag = updatedTag.replace('<img', '<img style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"');
      }
      
      // Add alt text if not present
      if (!updatedTag.includes('alt=')) {
        updatedTag = updatedTag.replace('<img', `<img alt="Question image"`);
      }
      
      return updatedTag;
    });
  });
  
  return processedContent;
}

// ===== DEVELOPMENT UTILITIES =====

/**
 * Development logging function
 * @param {...any} args - Arguments to log
 */
export function devLog(...args) {
  if (isDevelopmentMode()) {
    console.log('[DEV]', ...args);
  }
}

/**
 * Check if in development mode
 * @returns {boolean} True if in development mode
 */
export function isDevelopmentMode() {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' || 
         window.location.hostname === '';
}

// ===== DATA COMPRESSION UTILITIES =====

/**
 * Compress data for localStorage storage
 * @param {any} data - Data to compress
 * @returns {string} Compressed data string
 */
export function compressData(data) {
  try {
    const jsonString = JSON.stringify(data);
    // Simple compression using JSON.stringify optimizations
    // In a real implementation, you might use LZ-string or similar
    return jsonString;
  } catch (error) {
    console.error('Error compressing data:', error);
    return null;
  }
}

/**
 * Decompress data from localStorage
 * @param {string} compressedData - Compressed data string
 * @returns {any} Decompressed data
 */
export function decompressData(compressedData) {
  try {
    return JSON.parse(compressedData);
  } catch (error) {
    console.error('Error decompressing data:', error);
    return null;
  }
}

// ===== ARRAY AND OBJECT UTILITIES =====

/**
 * Sort array alphabetically by specified property
 * @param {Array} array - Array to sort
 * @param {string} property - Property to sort by
 * @returns {Array} Sorted array
 */
export function sortAlphabetically(array, property = 'name') {
  return array.sort((a, b) => {
    const aValue = a[property] || '';
    const bValue = b[property] || '';
    return aValue.localeCompare(bValue);
  });
}

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Set) return new Set([...obj].map(item => deepClone(item)));
  if (obj instanceof Map) return new Map([...obj].map(([key, value]) => [deepClone(key), deepClone(value)]));
  
  const clonedObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}

// ===== DOM UTILITIES =====

/**
 * Safely get element by ID with error handling
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null if not found
 */
export function safeGetElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    devLog(`Element with ID '${id}' not found`);
  }
  return element;
}

/**
 * Show loading state for an element
 * @param {HTMLElement} element - Element to show loading for
 * @param {boolean} show - Whether to show or hide loading
 */
export function toggleLoading(element, show) {
  if (!element) return;
  
  if (show) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
    element.classList.add('loading');
  } else {
    element.style.opacity = '';
    element.style.pointerEvents = '';
    element.classList.remove('loading');
  }
}

// ===== WINDOW OBJECT EXPOSURE FOR BACKWARD COMPATIBILITY =====
// Expose utilities to window object during migration phase
export function exposeUtilsToWindow() {
  window.formatTime = formatTime;
  window.formatFileSize = formatFileSize;
  window.truncateText = truncateText;
  window.addHapticFeedback = addHapticFeedback;
  window.processEmbeddedImages = processEmbeddedImages;
  window.devLog = devLog;
  window.isDevelopmentMode = isDevelopmentMode;
}

// ===== INITIALIZATION =====
export function initializeUtils() {
  // Expose utils to window for backward compatibility
  exposeUtilsToWindow();
  
  console.log('✅ Utils module initialized with window exposure');
}