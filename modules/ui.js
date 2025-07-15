// UI Module (Stub)
// This is a temporary stub to maintain compatibility

export function init() {
  console.log('UI module (stub) initialized');
}

export function displayCurrentQuestion() {
  console.log('displayCurrentQuestion - stub implementation');
}

export function showValidationResults(correctAnswers) {
  console.log('showValidationResults - stub implementation', correctAnswers);
}

export function showError(message) {
  console.error('Error:', message);
  alert('Error: ' + message);
}

export function showSuccess(message) {
  console.log('Success:', message);
}

export function setupTouchGestures() {
  console.log('setupTouchGestures - stub implementation');
}

export function handleResize() {
  console.log('handleResize - stub implementation');
}