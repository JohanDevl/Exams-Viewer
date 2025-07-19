# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Exams-Viewer is an automated exam questions scraper and viewer for ExamTopics.com with a modern web interface. It combines Python-based web scraping automation with a vanilla JavaScript frontend for viewing and practicing exam questions.

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 with dark mode support
- **Backend**: Python 3.x with requests and BeautifulSoup4
- **Data Storage**: JSON files in `/data/` directory
- **Automation**: GitHub Actions for scheduled scraping
- **Deployment**: GitHub Pages (static hosting)

## Development Commands

### Python Scripts
```bash
# Install dependencies
pip install -r requirements.txt

# Update all exams (scraping)
python scripts/update_all_exams.py

# Update specific exam
python scripts/update_all_exams.py --exam CAD

# Manual scraping (individual script)
python scripts/scraper.py
```

### Web Interface
- No build process required - open `index.html` directly in browser
- For GitHub Pages deployment: commit to main branch, Pages serves automatically
- Local development: Use any static web server (e.g., `python -m http.server`)

## Architecture

### Frontend Architecture - Progressive Modular Migration ⚠️
**Current State**: Migrating from monolithic to modular ES6 architecture

#### Current Architecture (`script.js`, `index.html`, `styles.css`)
- **State Management**: Centralized global variables (8908 lines in script.js)
- **Event System**: 90+ event listeners configured in `setupEventListeners()`
- **Data Flow**: Async JSON loading → state update → DOM rendering
- **Features**: Question navigation, favorites/notes system, statistics tracking, export functionality
- **Critical Pattern**: Exam lists MUST always be sorted alphabetically using `localeCompare()`

#### Target Architecture (Modular ES6) 🎯
- **Modules**: 10 specialized modules (`state.js`, `ui.js`, `navigation.js`, `data.js`, etc.)
- **Orchestration**: `app.js` as central orchestrator
- **Communication**: Bidirectional synchronization with `window.*` during transition
- **Compatibility**: Strict preservation of all existing functionalities

#### Critical Migration Rules
1. **No functionality must be broken** during migration
2. **Initialization order preserved**: DOMContentLoaded → setupEventListeners → loadData
3. **HTML compatibility maintained**: All onclick and event handlers functional
4. **Performance identical** or improved
5. **Regression testing** after each step

### Backend Architecture (`scripts/`)
- **Scraper (`scraper.py`)**: Core web scraping logic with rate limiting (5-10 second delays)
- **Batch Processor (`update_all_exams.py`)**: Automated exam updates with progress tracking
- **Data Format**: JSON files with standardized structure for questions and metadata

### Data Structure
```
data/
├── {EXAM_CODE}/                     # Folder per exam (new structure)
│   ├── questions.json               # Main exam questions data
│   ├── links.json                   # Scraping metadata and links  
│   ├── chunk_1.json                 # Questions 1-50 (lazy loading)
│   ├── chunk_2.json                 # Questions 51-100 (lazy loading)
│   └── chunk_N.json                 # Additional chunks as needed
├── {EXAM_CODE}.json                 # Legacy format (backward compatibility)
├── {EXAM_CODE}_links.json           # Legacy format (backward compatibility)
└── manifest.json                    # Available exams registry
```

### Service Worker Architecture
- **Cache Strategy**: Cache-first with background updates for optimal performance
- **Intelligent Updates**: Background synchronization when new data is available
- **File Management**: Automatic registration in production environment

## Critical Business Rules

1. **Alphabetical Sorting**: Exam lists MUST be displayed alphabetically - this is enforced in multiple UI components
2. **Rate Limiting**: Respect ExamTopics.com servers with 5-10 second delays between requests
3. **Data Integrity**: Always validate JSON structure and handle malformed data gracefully
4. **Question Ordering**: Questions sorted numerically by `question_number` field
5. **Responsive Design**: Mobile-first approach with dark mode support

## Key Features

### Frontend Features
- **Enhanced Navigation System**: Comprehensive keyboard shortcuts (vim-style + standard), visual progress sidebar, navigation history with back/forward buttons
- **Question Navigation**: Previous/Next with keyboard shortcuts, random question selection, direct question jumping (1-9 keys)
- **Enhanced Mobile Navigation**: Touch-optimized navigation with swipe gestures, 44px minimum touch targets, bottom navigation bar for thumb-friendly access, haptic feedback support
- **Touch Gesture Support**: Left/right swipe for question navigation, swipe-to-close sidebar functionality, visual swipe indicators with smooth animations
- **Visual Progress Tracking**: Interactive sidebar with question list, status indicators, progress bar, and click-to-navigate functionality
- **Answer Validation**: Compare user selections with correct answers, highlight mode for previewing
- **Favorites & Notes**: Category-based organization with custom categories and text notes
- **Statistics System**: Session tracking, progress metrics, performance analytics with local storage
- **Export Functionality**: PDF and JSON export of questions and user data
- **Settings Management**: Persistent settings for UI preferences, sidebar state, and display options
- **Advanced Search & Filters**: Comprehensive search system with text search, auto-completion, and status filters
- **Informative Tooltips**: CSS-only tooltip system with keyboard shortcuts, disabled by default with settings toggle, mobile-optimized touch support
- **Resume Study Position**: Intelligent position tracking across browser sessions with auto-save capability and resume dialogs
- **Performance Optimizations**: Lazy loading for large datasets, intelligent caching with service worker, automatic image compression

### Backend Features
- **Smart Scraping**: Incremental updates, change detection, robust error handling
- **Progress Tracking**: Callback-based progress reporting during batch operations
- **Data Validation**: JSON schema validation and corruption recovery
- **Image Processing**: Automatic WebP compression with fallback formats, intelligent image filtering
- **Data Organization**: Folder-per-exam structure with chunked data for performance

## Code Conventions

### JavaScript (ES6+)
- Use `const/let`, arrow functions, async/await, template literals
- camelCase naming, descriptive variables, JSDoc for complex functions
- **Critical**: Always sort exam arrays with `.sort((a, b) => a.code.localeCompare(b.code))`

### Python (PEP 8)
- Type hints, docstrings, f-string formatting, specific exception handling
- Modular functions with single responsibilities

### CSS
- CSS custom properties for theming, BEM methodology for classes
- Flexbox/Grid layouts, responsive design principles
- Dark mode via `prefers-color-scheme` and CSS variables

## Common Development Patterns

### Async Data Loading
```javascript
async function loadExam(examCode) {
  showLoading(true);
  try {
    const response = await fetch(`data/${examCode}.json`);
    if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
    const data = await response.json();
    // Process data...
  } catch (error) {
    showError(`Error loading exam: ${error.message}`);
  } finally {
    showLoading(false);
  }
}
```

### Python Scraping with Error Handling
```python
def scrape_page(link):
    try:
        response = requests.get(link, headers=HEADERS)
        response.raise_for_status()
        # Process response...
    except Exception as e:
        return {"error": f"Request failed: {e}"}
```

## Testing and Validation

- Test with multiple exam codes to ensure compatibility
- Verify alphabetical sorting in all exam list displays
- Validate export functionality across browsers
- Test error handling with malformed JSON data
- Verify rate limiting compliance in scraping operations

## Deployment Notes

### GitHub Pages
- All paths must be relative for proper GitHub Pages hosting
- Ensure CORS compatibility for JSON data loading
- Test with full GitHub Pages URL structure before deployment

### Security and Ethics
- Respect ExamTopics.com rate limits and terms of service
- Educational use only - all exam content belongs to respective owners
- Implement proper input sanitization and data validation
- No sensitive data should ever be committed to repository

## Advanced Search & Filters System

### Architecture
- **State Management**: Global variables `allQuestions`, `filteredQuestions`, `isSearchActive`, `searchCache`
- **Search Logic**: Text-based search across questions, answers, and comments with multi-word support
- **Filter System**: Status-based filters (answered, unanswered, favorites) with dynamic counting
- **Auto-completion**: Real-time question number suggestions with visual highlighting
- **Integration**: Seamless integration with existing navigation and statistics systems

### Key Components
- **Search Interface**: Collapsible section with full header clickability (collapsed by default)
- **Text Search**: `searchQuestions()` function with caching for performance optimization
- **Status Detection**: Smart detection of answered questions across current and previous sessions
- **Filter Application**: `applyFilters()` combines search results with status filters
- **Settings Integration**: Optional display via `showAdvancedSearch` setting (false by default)

### Critical Implementation Details
- **Question Detection**: Uses `statistics.currentSession.questions` and `statistics.sessions` to track answered questions
- **Search State**: Maintains separate arrays for original (`allQuestions`) and filtered (`currentQuestions`) states
- **Cache Management**: Search results cached by query string for performance
- **Mobile Responsive**: Adaptive UI for mobile devices with touch-friendly interactions
- **State Cleanup**: Automatic reset of search state when disabling the feature

### Developer Notes
- Always call `updateFilterCounts()` after answer validation or favorite changes
- Search section visibility controlled by `updateAdvancedSearchVisibility()`
- Navigation functions work with current filtered results, not original question set
- Auto-completion shows max 5 suggestions to avoid UI clutter

## Enhanced Navigation System

### Architecture Overview
The enhanced navigation system provides comprehensive keyboard shortcuts, visual progress tracking, and navigation history functionality. It integrates seamlessly with existing features while maintaining performance and accessibility.

### Key Components

#### Keyboard Navigation System
- **Comprehensive shortcuts**: Supports vim-style (`hjkl`), arrow keys, and special keys (`Space`, `Enter`, `Home`, `End`)
- **Action shortcuts**: Direct access to validation (`v`), favorites (`f`), notes (`n`), and interface controls
- **Navigation modes**: Basic movement, quick jumps (5/10 questions), and direct access (number keys 1-9)
- **Context awareness**: Shortcuts disabled in input fields, proper focus management

#### Progress Sidebar
- **Visual overview**: Interactive question list with status indicators and progress bar
- **Status tracking**: Current question (orange), answered (green), unanswered (gray), favorites (star)
- **Direct navigation**: Click any question to navigate immediately
- **Responsive design**: Full-screen on mobile, overlay on desktop
- **Auto-scroll**: Current question automatically scrolled into view

#### Navigation History
- **Browser-like functionality**: Back/forward buttons with intelligent history tracking
- **Smart deduplication**: Prevents consecutive identical entries
- **Performance optimized**: Limited to 50 entries with automatic cleanup
- **Universal integration**: Works with all navigation methods (clicks, keyboard, search)

### Critical Implementation Details

#### Function Architecture
- **`navigateToQuestionIndex(index, addToHistory=true)`**: Central navigation function with history support
- **`updateProgressSidebar()`**: Updates sidebar with current question states and progress
- **`addToNavigationHistory(index)`**: Manages history stack with intelligent deduplication
- **`toggleSidebar()`**: Controls sidebar visibility with state persistence

#### State Management
- **Navigation history**: `navigationHistory[]` array with `historyIndex` pointer
- **Sidebar state**: `sidebarOpen` boolean with settings persistence
- **Progress tracking**: Real-time updates via `isQuestionAnswered()` and `isQuestionFavorite()`

#### Integration Points
- **Answer validation**: Updates progress indicators automatically via `validateAnswers()`
- **Favorites system**: Syncs with sidebar display via `toggleQuestionFavorite()`
- **Search system**: Works with filtered question sets, maintains navigation context
- **Settings system**: Persists sidebar state and navigation preferences

### Performance Considerations
- **Efficient DOM updates**: Batch operations and selective rendering
- **Memory management**: Limited history size and proper cleanup
- **Event delegation**: Optimized event handling for question list clicks
- **Responsive updates**: Debounced scroll events and smooth animations

### Critical Business Rules
1. **Navigation history**: Always add to history before changing position (except when navigating through history)
2. **Sidebar updates**: Must be called after any question state change (answered, favorited)
3. **State persistence**: Sidebar open/close state must be saved to settings
4. **Mobile responsiveness**: Full-screen sidebar on mobile, overlay on desktop
5. **Accessibility**: All keyboard shortcuts must work without mouse interaction

### Developer Guidelines
- **Navigation functions**: Always use `navigateToQuestionIndex()` for programmatic navigation
- **Sidebar updates**: Call `updateProgressSidebar()` after state changes affecting question status
- **History management**: Never manipulate `navigationHistory` directly, use provided functions
- **Event handling**: Ensure keyboard shortcuts don't interfere with input fields
- **Responsive design**: Test sidebar functionality on both desktop and mobile viewports
- **Mobile touch events**: Use `touch-action: manipulation` to prevent double-tap zoom on interactive elements
- **Haptic feedback**: Test vibration API availability before calling `addHapticFeedback()`

## Enhanced Mobile Navigation System

### Architecture Overview
The enhanced mobile navigation system provides comprehensive touch-optimized interactions, swipe gestures, and thumb-friendly navigation controls specifically designed for mobile devices.

### Key Components

#### Touch Target Optimization
- **44px Minimum**: All interactive elements meet iOS accessibility guidelines (44px minimum touch targets)
- **Enhanced Spacing**: Increased gaps between touch targets to prevent accidental touches
- **Visual Feedback**: Touch feedback animations and haptic vibration for better user experience
- **Optimized Layouts**: Mobile-specific layouts with better thumb reach zones

#### Swipe Gesture Navigation
- **Horizontal Swipes**: Left/right swipe for next/previous question navigation
- **Swipe Indicators**: Visual feedback showing swipe direction and action
- **Gesture Thresholds**: Configurable swipe distance and timing for reliable detection
- **Conflict Prevention**: Smart detection to avoid conflicts with scrolling and form inputs

#### Bottom Navigation Bar
- **Thumb-Friendly**: Fixed bottom position for easy one-handed access
- **Essential Actions**: Previous, Next, Random, and Progress Sidebar toggles
- **Adaptive Design**: Automatically appears on mobile devices (<480px width)
- **Touch Optimized**: Large touch targets with visual and haptic feedback

#### Sidebar Enhancements
- **Swipe-to-Close**: Left swipe gesture to close sidebar on mobile
- **Full-Screen Mode**: Sidebar takes full screen on mobile for better visibility
- **Touch Scrolling**: Optimized touch scrolling performance
- **Direct Navigation**: Tap any question to navigate instantly

### Technical Implementation Details

#### Touch Event Handling
```javascript
// Touch gesture detection
touchStartX, touchStartY, touchEndX, touchEndY // Track touch positions
isSwiping // Prevent conflicts with other touch events
touchStartTime // Ensure gesture timing requirements

// Event listeners
touchstart, touchmove, touchend // Handle complete gesture lifecycle
```

#### Key Functions
- **`setupTouchGestures()`**: Initialize swipe detection system
- **`handleTouchStart/Move/End()`**: Process touch events and detect swipes
- **`createMobileBottomNavigation()`**: Generate mobile-specific navigation bar
- **`addHapticFeedback()`**: Provide tactile feedback using vibration API
- **`setupSidebarSwipeToClose()`**: Enable swipe-to-close sidebar functionality

#### Mobile-Specific CSS Classes
- **`.mobile-nav-bottom`**: Bottom navigation bar styling
- **`.swipe-indicator`**: Visual feedback for swipe gestures
- **`.touch-feedback`**: Touch animation effects
- **`.touch-target`**: Enhanced touch target sizing

### Performance Considerations
- **Passive Event Listeners**: Used where possible to maintain scroll performance
- **Event Debouncing**: Prevents excessive gesture processing
- **Conditional Loading**: Mobile features only activate on appropriate devices
- **Memory Management**: Proper cleanup of touch event listeners

### Browser Compatibility
- **iOS Safari**: Full support including haptic feedback
- **Android Chrome**: Complete functionality with vibration API
- **Progressive Enhancement**: Graceful degradation for older mobile browsers
- **Touch-Action Support**: Utilizes CSS touch-action for optimal performance

### Critical Implementation Rules
1. **Touch Target Minimum**: All interactive elements must be at least 44px in both dimensions
2. **Gesture Conflicts**: Always check for input fields and modals before processing swipes
3. **Haptic Feedback**: Always check `navigator.vibrate` availability before use
4. **Performance**: Use `passive: false` only when necessary to prevent default behavior
5. **Accessibility**: Maintain keyboard navigation alongside touch gestures

### **Mobile Navigation Summary**

The enhanced mobile navigation system provides a complete touch-optimized experience:

#### **Key Features:**
- **44px minimum touch targets** for all interactive elements
- **Swipe gestures** for intuitive question navigation (left/right)
- **Bottom navigation bar** with essential controls (Prev, Random, Progress, Next)
- **Visual feedback** with swipe indicators and haptic vibration
- **Contextual display** - only appears during active exams, not on homepage
- **Clean interface** - desktop navigation completely hidden on mobile
- **Responsive design** - automatic adaptation between desktop and mobile modes

#### **User Experience:**
- **Thumb-friendly navigation** with fixed bottom positioning
- **Gesture-based interaction** with visual and haptic feedback
- **Conflict-free operation** with smart touch detection
- **Seamless integration** with existing keyboard shortcuts and desktop functionality

## Performance Optimizations

### Lazy Loading System
- **Architecture**: Chunk-based loading with 50 questions per chunk for optimal performance
- **Implementation**: Questions automatically split into chunks after scraping (>= 100 questions)
- **User Control**: Optional feature, disabled by default (controlled by `enableLazyLoading` setting)
- **Navigation Integration**: Seamless async navigation functions support chunk loading
- **Progress Indicators**: Loading states and progress tracking during chunk operations

### Key Components
- **`loadQuestionChunk(chunkNumber)`**: Loads specific question chunks on demand
- **`createChunksForExamData(examCode, questions, chunkSize=50)`**: Splits large datasets into chunks
- **`processEmbeddedImages(htmlContent, imagesData)`**: Handles base64 image display in questions
- **Backward Compatibility**: Automatic fallback to legacy format if chunks unavailable

### Critical Implementation Details
- **Chunk Loading**: Async loading with proper error handling and user feedback
- **Image Processing**: Base64 embedded images with responsive styling and accessibility
- **Memory Management**: Efficient chunk caching and cleanup to prevent memory leaks
- **Navigation Sync**: All navigation functions updated to handle async chunk loading properly

### Service Worker Caching
- **Strategy**: Cache-first approach with intelligent background updates
- **File Types**: JSON data files, static assets, and application resources
- **Update Detection**: Background synchronization when new data becomes available
- **Performance**: Significant improvement in load times for repeat visits

### Image Compression
- **Format**: Automatic WebP compression with JPEG fallback for compatibility
- **Quality**: 85% compression ratio for optimal size vs quality balance
- **Sizing**: Maximum dimensions of 800x600px to reduce bandwidth usage
- **Integration**: Embedded directly in JSON as base64 data for simplified deployment
- **Filtering**: Intelligent detection to process only question-related images, skip tracking pixels

### Developer Guidelines
- **Lazy Loading**: Always check if feature is enabled before implementing chunk-based logic
- **Image Display**: Use `processEmbeddedImages()` for all question content rendering
- **Chunk Creation**: Automatically triggered after scraping operations for exams >= 100 questions
- **Error Handling**: Graceful fallback to legacy format if chunk loading fails
- **Performance Testing**: Monitor chunk loading times and user experience impact

## Resume Study Position System

### Architecture Overview
The resume study position system provides seamless continuation of study sessions across browser restarts, device switches, and extended breaks. It intelligently tracks user progress and offers contextual resumption options.

### Key Components

#### Position Tracking System
- **Automatic Position Saving**: Continuously tracks current question position during navigation
- **Session Persistence**: Maintains position data across browser sessions using localStorage
- **Cross-Device Sync**: Position data available on any device accessing the same browser profile
- **Intelligent Storage**: Only saves position when meaningful progress has been made

#### Resume Dialog System
- **Smart Detection**: Automatically detects when returning to a previously studied exam
- **User Choice Options**: Continue from saved position or start fresh with clear options
- **Visual Progress Context**: Shows saved position information to help users decide
- **Graceful Fallback**: Seamlessly handles cases where saved positions become invalid

#### Auto-Save Integration
- **Optional Auto-Save**: User-controlled automatic position saving on every question navigation
- **Settings Integration**: Configurable through Settings > Study Management section
- **Performance Optimized**: Efficient storage updates without UI impact
- **Disabled by Default**: Conservative approach requiring explicit user opt-in

### Critical Implementation Details

#### Function Architecture
- **`saveStudyPosition(examCode, questionIndex)`**: Core position saving functionality
- **`getStudyPosition(examCode)`**: Retrieves saved position for specific exam
- **`showResumeDialog(examCode, savedPosition)`**: Displays resume options to user
- **`clearStudyPosition(examCode)`**: Removes saved position when starting fresh

#### Data Structure
```javascript
// localStorage: study_positions
{
  "examCode": {
    "questionIndex": 42,
    "timestamp": 1626789012345,
    "totalQuestions": 100,
    "examTitle": "Sample Exam"
  }
}
```

#### Integration Points
- **Exam Loading**: Checks for saved positions when loading exam data
- **Navigation System**: Integrates with existing navigation functions
- **Settings System**: Provides user control over auto-save behavior
- **Statistics System**: Coordinates with progress tracking for consistent experience

### User Experience Flow
1. **Initial Study**: User studies exam questions and navigates through content
2. **Automatic Tracking**: System tracks position and optionally auto-saves based on settings
3. **Session End**: User closes browser or navigates away
4. **Return Visit**: User returns to same exam later
5. **Resume Dialog**: System presents Continue/Start Fresh options with context
6. **Seamless Continuation**: User can resume exactly where they left off

### Technical Implementation Details

#### Position Validation
- **Boundary Checking**: Ensures saved positions remain within valid question ranges
- **Data Integrity**: Validates saved position data before presenting resume options
- **Error Handling**: Gracefully handles corrupted or invalid position data
- **Automatic Cleanup**: Removes outdated or invalid position entries

#### Performance Considerations
- **Efficient Storage**: Minimal localStorage usage with optimized data structure
- **Lazy Loading**: Position data loaded only when needed
- **Memory Management**: Proper cleanup of position data in memory
- **Background Updates**: Non-blocking position saves during navigation

### Settings Integration
- **Resume Study Position**: Master toggle for entire feature (disabled by default)
- **Auto-Save Position**: Optional automatic saving on navigation (disabled by default)
- **Clear All Positions**: Utility to reset all saved positions
- **Position Management**: View and manage saved positions per exam

### Critical Business Rules
1. **User Consent**: Feature disabled by default requiring explicit user activation
2. **Data Privacy**: Position data stored locally, never transmitted externally
3. **Graceful Degradation**: System works normally when resume feature is disabled
4. **Position Accuracy**: Saved positions must remain accurate across session boundaries
5. **Visual Feedback**: Clear indication of resumed vs fresh session state

### Developer Guidelines
- **Position Tracking**: Always call `saveStudyPosition()` during navigation when feature is enabled
- **Resume Logic**: Check for saved positions before displaying exam content
- **Settings Sync**: Ensure resume feature respects user preferences
- **Error Handling**: Gracefully handle invalid or corrupted position data
- **Performance**: Minimize localStorage operations and optimize for smooth navigation

## GitHub Actions Automation

### Workflow Architecture
The project uses comprehensive GitHub Actions workflows for automated development and release management:

#### Core Workflows
- **`update-changelog.yml`**: Automatically updates changelog dates when PRs are merged to main
- **`release-changelog.yml`**: Manages release preparation and changelog versioning
- **`sync-develop.yml`**: Automatically synchronizes develop branch after changelog updates
- **`manual-sync-develop.yml`**: Advanced manual synchronization with multiple strategies

#### Automatic Develop Branch Synchronization
- **Trigger**: Automatically runs after changelog workflows complete successfully
- **Strategy**: Fast-forward merge from main to develop when no conflicts detected
- **Conflict Handling**: Intelligent detection and reporting of merge conflicts
- **Fallback Options**: Manual intervention tools available for complex scenarios

#### Advanced Sync Features
- **Multiple Strategies**: Merge (recommended), rebase, or reset synchronization methods
- **Dry Run Capability**: Preview changes before applying them
- **PR Creation**: Option to create synchronization PRs instead of direct merges
- **Detailed Reporting**: Comprehensive summaries of sync operations and conflicts

#### Development Workflow Integration
1. **Feature Development**: Work on feature branches from develop
2. **PR Merge**: Merge feature PRs to develop, then create release PR to main
3. **Automatic Processing**: Changelog dates updated automatically on main merge
4. **Branch Sync**: Develop branch automatically synchronized with latest main changes
5. **Continuous Development**: Development continues on updated develop branch without manual intervention

### Critical Workflow Requirements
- **Date Placeholders**: Always use `{PR_MERGE_DATE}` in changelog entries - never replace manually
- **Branch Protection**: Workflows require proper permissions (contents: write, pull-requests: read/write)
- **Conflict Resolution**: Manual intervention required when automatic sync detects conflicts
- **Monitoring**: Review workflow summaries and logs for successful completion

## Documentation and Changelog Management

### Changelog Structure (`CHANGELOG.md`)
- **Format**: Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standard
- **Sections**: Added, Enhanced, Changed, Fixed, Security, etc.
- **Versioning**: Semantic versioning (MAJOR.MINOR.PATCH)
- **Date Placeholder**: Use `{PR_MERGE_DATE}` for automated date replacement by GitHub Actions
- **Version History Summary**: Always update the summary section at the end when adding new versions

### Critical Changelog Requirements
1. **Date Placeholder**: NEVER replace `{PR_MERGE_DATE}` manually - it's handled by automated workflows
2. **Version History Summary**: Always add new version entries in the summary section (e.g., `v2.4.x: Advanced search and filtering system`)
3. **User-Focused**: Describe impact and benefits, not implementation details
4. **Consistent Format**: Group changes by type, use bullet points, maintain proper hierarchy
5. **Workflow Integration**: The changelog is automatically processed by `.github/workflows/update-changelog.yml`

### Example Changelog Entry
```markdown
## [2.4.0] - {PR_MERGE_DATE}

### Added
- **Feature Name**: Brief description
  - Sub-feature 1
  - Sub-feature 2

### Enhanced
- **Component**: Improvement description

## Version History Summary
- **v2.4.x**: Brief version summary
- **v2.3.x**: Previous version...
```

## File Locations

- Main interface: `/index.html`, `/script.js`, `/styles.css`
- Python scripts: `/scripts/scraper.py`, `/scripts/update_all_exams.py`
- Documentation: `/docs/` (comprehensive guides for features and development)
- Data files: `/data/{EXAM_CODE}/` (new structure) and `/data/{EXAM_CODE}.json` (legacy)
- Dependencies: `/requirements.txt` (requests==2.32.3, beautifulsoup4==4.13.4, Pillow==10.4.0)
- Workflows: `/.github/workflows/` (automation for changelog and branch synchronization)
- Service Worker: `/sw.js` (caching and performance optimization)

## GitHub Templates Usage

### CRITICAL REQUIREMENT
**ALWAYS use the appropriate GitHub templates when creating issues or pull requests. This ensures consistency, proper categorization, and adherence to project standards.**

### Available Templates

#### Issue Templates (`.github/ISSUE_TEMPLATE/`)
- **`bug_report.md`**: For reporting bugs and issues
- **`feature_request.md`**: For requesting new features or enhancements
- **`new_exam_request.md`**: For requesting support for new exams
- **`scraping_issue.md`**: For reporting scraping-related problems

#### Pull Request Templates (`.github/PULL_REQUEST_TEMPLATE/`)
- **`new_feature.md`**: For new feature implementations
- **`bug_fix.md`**: For bug fixes and issue resolutions
- **`scraper_improvement.md`**: For scraper enhancements and optimizations
- **`pull_request_template.md`**: Default template for general changes

### Template Usage Guidelines

#### When Creating Issues
1. **Always select the most appropriate template** from the available options
2. **Fill out all required sections** completely and accurately
3. **Include relevant details**: error messages, browser versions, steps to reproduce
4. **Add appropriate labels** after creation for better categorization
5. **Reference related issues or PRs** when applicable

#### When Creating Pull Requests
1. **Use the correct template** based on the type of changes:
   - New features → `new_feature.md`
   - Bug fixes → `bug_fix.md`
   - Scraper changes → `scraper_improvement.md`
   - Other changes → `pull_request_template.md`
2. **Complete all template sections** thoroughly
3. **Include testing information** and verification steps
4. **Link to related issues** using GitHub's closing keywords
5. **Ensure all automated checks pass** before requesting review

#### Template Compliance
- **Required**: All PRs and issues MUST use templates
- **Quality**: Incomplete or template-bypassing submissions may be rejected
- **Consistency**: Templates ensure uniform information across all contributions
- **Automation**: Proper template usage enables automated workflows and tracking

### Example Template Usage

#### For Issues
```markdown
When reporting a bug, always use the bug_report.md template:
- Clear reproduction steps
- Expected vs actual behavior
- Environment details (browser, OS, etc.)
- Screenshots when applicable
```

#### For Pull Requests
```markdown
When implementing new features, use new_feature.md template:
- Feature description and rationale
- Implementation details
- Testing approach and results
- Breaking changes documentation
- Related issue references
```

### Template Enforcement
Templates are enforced through:
- **GitHub interface**: Automatically suggests appropriate templates
- **Review process**: PRs without proper templates may be rejected
- **Automation**: Workflows may check for template compliance
- **Quality assurance**: Ensures all necessary information is provided