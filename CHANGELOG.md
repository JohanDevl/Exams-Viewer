# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Summary

- [5.1.0] - 2025-08-07: Mobile Experience Enhancement & Exam Mode Improvements
- [5.0.0] - 2025-08-04: Complete Architecture Overhaul - GitHub Pages & Mobile Experience Revolution
- [4.3.0] - 2025-07-29: User-Perceived Difficulty Rating System
- [4.2.0] - 2025-07-28: Enhanced Keyboard Shortcuts with Visual Feedback
- [4.1.2] - 2025-07-28: Mobile Navigation & Performance Fixes
- [4.1.1] - 2025-07-28: Performance Optimization - Removed Obsolete Exam Preloading

## [5.1.0] - 2025-08-07

### 📱 Mobile Experience Revolution

- **🔄 Complete Sidebar Navigation Overhaul**: Revolutionary mobile navigation experience
  - **Native Scroll Integration**: Replaced Radix ScrollArea with native scroll for superior mobile compatibility
  - **Scroll Isolation System**: Implemented body scroll lock when sidebar is open to prevent background scrolling
  - **Touch Event Optimization**: Advanced touch and wheel event isolation with proper propagation control
  - **Flexbox Layout Restructure**: Complete sidebar layout redesign with precise height management for all screen sizes
  - **Platform-Specific Rendering**: Separate mobile and desktop rendering paths for optimal UX on each platform
  - **Fixed Positioning**: Sidebar stays perfectly positioned during page scroll with hardware acceleration
  - **Precise Height Calculations**: Smart mobile height accounting for header, navigation bars, and system UI elements

- **🎯 Enhanced Mobile Input Experience**: Optimized user interaction for touch devices
  - **Numeric Keyboard Support**: Custom exam inputs automatically trigger numeric keyboards on mobile devices
  - **Force Card View on Mobile**: Automatic card view activation for optimal mobile browsing experience
  - **Responsive Modal Layouts**: Settings modal and other dialogs fully optimized for mobile screen sizes
  - **Touch-Friendly Controls**: All interactive elements sized and spaced for comfortable touch interaction

### 🎓 Exam Mode Enhancements

- **⏰ Timer Flexibility Improvements**: Enhanced exam completion options
  - **No Time Limit Support**: Added "Finish Exam" button that remains visible even when timer is disabled
  - **Consistent UI Experience**: Maintains same confirmation flow regardless of timer state
  - **Clear Visual Indicators**: "No Time Limit" interface with "Finish when ready" messaging
  - **Double-Click Confirmation**: Same security measures apply to manual finish as timed exams

- **📊 Smart Question Selection**: Intelligent exam configuration for optimal study experience  
  - **Auto-Select for Small Exams**: Automatically selects all questions for exams with less than 60 questions
  - **Optimal Study Flow**: Eliminates unnecessary configuration steps for comprehensive smaller exams
  - **Maintains Manual Control**: Preserves custom selection options for larger question sets

### 🛠️ UI/UX Improvements

- **🎨 Responsive Design Enhancements**: Cross-device compatibility improvements
  - **Settings Modal Optimization**: Fully responsive settings interface with improved mobile layout
  - **Custom Exam Configuration**: Resolved configuration options not working properly in exam setup
  - **Header Optimization**: Improved mobile header behavior with better scroll interaction
  - **Visual Consistency**: Maintained design consistency across all device sizes and orientations

### 🔧 Technical Improvements

- **⚡ Performance Optimizations**: Enhanced application performance and reliability
  - **Scroll Event Management**: Efficient handling of scroll events with minimal performance impact
  - **Memory Management**: Proper cleanup of event listeners and DOM modifications
  - **Hardware Acceleration**: Leveraged CSS transforms for smooth animations and transitions
  - **Touch Handling**: Optimized touch event processing for responsive mobile interactions

## [5.0.0] - 2025-08-04

### 🚨 Breaking Changes
- **🏗️ Complete Architecture Migration**: Revolutionary platform transformation
  - **BREAKING**: Migrated from vanilla JavaScript/HTML to modern Next.js 15 with React 19
  - **BREAKING**: Replaced manual DOM manipulation with React component architecture
  - **BREAKING**: Converted to TypeScript for enhanced type safety and developer experience
  - **BREAKING**: Implemented Zustand state management replacing localStorage-based state handling
  - **BREAKING**: Adopted Tailwind CSS and Radix UI replacing custom CSS styling system
  - **BREAKING**: New App Router architecture with server-side rendering capabilities
  - **BREAKING**: Changed from static site to modern React application with PWA capabilities

### ✨ New Features
- **🔗 Dynamic Project Links System**: Intelligent creator attribution and project navigation
  - Auto-detection of GitHub repository name for basePath-aware links
  - Dynamic project links with context-aware URL generation
  - Enhanced creator attribution section with GitHub and Raycast profile links
  - Responsive design with mobile-optimized touch targets for external links
  - Professional developer information display with hover effects and tooltips

- **🎯 GitHub Pages Deployment Optimization**: Comprehensive deployment infrastructure improvements
  - Automatic basePath detection from GitHub repository configuration
  - Dynamic basePath-aware manifest generation for PWA compatibility
  - Intelligent asset path resolution for GitHub Pages hosting environment
  - Enhanced build process with integrated manifest generation workflow

### 🎨 User Experience Enhancements
- **📱 Ultra-Aggressive Mobile Scroll Lock System**: Revolutionary mobile interaction stability
  - Complete scroll prevention during button interactions to eliminate position loss
  - Extended 300ms lock duration on mobile devices for bulletproof stability
  - Intelligent mobile detection with user agent and screen width analysis
  - Multiple CSS reinforcement layers for scroll prevention (position: fixed, overflow: hidden)
  - Automatic scroll position restoration with multiple fallback attempts
  - Sound interference prevention on mobile to avoid setTimeout conflicts
  - Event prevention system blocking all scroll-related events during interactions

- **🎨 Enhanced Visual Identity**: Professional branding and visual consistency
  - Official Raycast logo implementation with proper design specifications
  - Improved logo component with accurate color schemes and proportions
  - Consistent visual hierarchy across all branding elements
  - Enhanced creator attribution with professional social media integration

### 🔧 Technical Improvements
- **🏗️ Modern Next.js Architecture**: Optimized development and deployment workflow
  - Turbopack integration for faster development builds and hot reload
  - Enhanced next.config.ts with basePath auto-detection capabilities
  - Streamlined build process with automated manifest generation
  - Improved development experience with optimized configuration management

- **⚡ Performance Optimizations**: Enhanced loading and interaction performance
  - Invisible mobile scroll lock implementation with zero visual impact
  - Optimized asset loading with basePath-aware resource resolution
  - Efficient link generation with intelligent path calculation
  - Memory-efficient event handling for mobile scroll prevention system

- **♿ Accessibility & Mobile Experience**: Enhanced usability across all devices
  - Touch-friendly creator link layout with proper spacing and sizing
  - Mobile-first responsive design for external navigation elements
  - Improved focus management for keyboard navigation
  - High contrast support maintained across all visual enhancements

### 🐛 Bug Fixes
- **📱 Mobile Scroll Clipping**: Resolved position loss during user interactions
  - Fixed scroll clipping issues that occurred during button validation on mobile devices
  - Eliminated unwanted page movement when users interact with question controls
  - Improved timing mechanisms for scroll lock activation and deactivation
  - Enhanced reliability of scroll position restoration after interactions

- **🔗 PWA Manifest Issues**: Resolved all manifest 404 errors for GitHub Pages
  - Fixed PWA manifest loading errors that prevented proper app installation
  - Corrected icon path resolution for GitHub Pages deployment environment
  - Enhanced favicon loading with proper basePath integration
  - Improved service worker compatibility with dynamic path resolution

### 🚀 Deployment & Infrastructure
- **📦 GitHub Pages Optimization**: Production-ready deployment enhancements
  - Automated basePath configuration based on repository structure
  - Dynamic manifest generation integrated into build pipeline
  - Enhanced asset caching with proper GitHub Pages compatibility
  - Improved SEO and PWA compliance for GitHub Pages hosting

## [4.3.0] - 2025-07-29

### ✨ New Features
- **🎯 User-Perceived Difficulty Rating System**: Comprehensive difficulty assessment and filtering (Issue #17)
  - 3-level difficulty rating system (Easy, Medium, Hard) with color-coded indicators
  - Quick rating interface in question toolbar with visual feedback
  - Advanced search integration with difficulty filtering capabilities
  - Visual indicators in progress sidebar showing question difficulty
  - Difficulty statistics in statistics modal with metric cards
  - Persistent difficulty ratings stored in localStorage with favorites system
  - Keyboard shortcuts (1=Easy, 2=Medium, 3=Hard, 0=Clear) for rapid rating
  - Responsive mobile layout with optimized touch interactions

### 🎨 User Experience Enhancements
- **📱 Mobile-First Design**: Optimized difficulty rating interface for mobile devices
  - Difficulty section positioned below favorites on mobile for better accessibility
  - Full-width clear button on mobile for improved touch targets
  - Responsive layout with proper spacing and visual hierarchy
  - Touch-friendly difficulty buttons with hover states and transitions
- **🔍 Enhanced Search Experience**: Integrated difficulty filtering with existing search system
  - OR logic for difficulty filters allowing multiple difficulty levels
  - Dynamic filter counts showing available questions per difficulty
  - Seamless integration with existing text search and status filters
- **📊 Visual Feedback System**: Comprehensive visual indicators across the interface
  - Color-coded difficulty badges (Green=Easy, Orange=Medium, Red=Hard)
  - Progress sidebar badges with difficulty indicators
  - Statistics modal cards showing difficulty distribution
  - Real-time button state updates with visual feedback

### 🔧 Technical Improvements
- **🏗️ Modular Architecture**: Extended existing favorites system for difficulty ratings
  - Reused localStorage structure and caching mechanisms
  - Integrated with existing search and filter infrastructure
  - Extended statistics calculations to include difficulty metrics
  - Maintained backward compatibility with existing data structures
- **⚡ Performance Optimizations**: Efficient difficulty data management
  - Leveraged existing caching systems for optimal performance
  - Minimal DOM updates with targeted element refreshes
  - Memory-efficient storage using compressed data structures
- **♿ Accessibility**: Full accessibility support for difficulty rating features
  - Keyboard shortcuts for all difficulty rating actions
  - Screen reader compatible with proper ARIA labels
  - High contrast support in dark mode with optimized colors
  - Focus management for keyboard navigation

## [4.2.0] - 2025-07-28

### ✨ New Features
- **⌨️ Enhanced Keyboard Shortcuts**: Complete keyboard shortcuts system with visual feedback (Issue #16)
  - Added Export shortcut (E key) to open export modal with single keypress
  - Implemented visual feedback notifications for all keyboard shortcuts (F, N, V, E, arrows)
  - Updated help modal (?) to include new E shortcut in Actions section
  - Enhanced shortcut documentation with proper categorization

### 🐛 Bug Fixes
- **⭐ Favorites Counter Sync**: Fixed favorites count not updating in main progress bar
  - Resolved data source inconsistency between session-based and persistent data
  - Aligned getFavoritesCount() with same data source as answered questions counter
  - Fixed timing issues with progress bar updates after favorites toggle
- **🔧 Browser Shortcuts Conflict**: Prevented keyboard shortcuts from blocking essential browser functions
  - Fixed Ctrl+V (paste), Ctrl+T (new tab), Ctrl+F (find), Ctrl+N (new tab) being blocked
  - Refined preventDefault() logic to only block explicitly handled combinations
  - Preserved browser shortcuts while maintaining app functionality
- **📊 Progress Animation**: Eliminated overlapping animations causing visual glitches
  - Fixed "buggy" transition when favorites count updates from 0 to 1
  - Optimized to single smooth animation instead of conflicting multiple calls
  - Reduced update delay from 100ms to 50ms for better responsiveness

### 🚀 Performance Improvements
- **⚡ Reduced Redundant Calls**: Optimized progress bar update frequency
  - Eliminated duplicate updateMainProgressBar() calls (reduced from 4 to 1 per action)
  - Streamlined favorites toggle workflow to prevent unnecessary processing
  - Improved animation performance with conflict-free update timing

### 🎨 User Experience Enhancements
- **🎯 Visual Feedback System**: Real-time confirmation for keyboard shortcuts
  - Glassmorphism-styled notifications appear in top-right corner for 2 seconds
  - Smooth slideInRight/slideOutRight animations with automatic cleanup
  - Clear indication of which shortcut was activated and its action
- **📖 Improved Documentation**: Enhanced help modal with better organization
  - Fixed J/K navigation documentation (K=back, J=forward) to match Vim conventions
  - Added comprehensive shortcut listing in categorized sections
  - Updated keyboard shortcuts test suite for validation

### 🔧 Technical Improvements
- **🧹 Code Cleanup**: Removed obsolete test files and references
  - Eliminated 404 errors from deleted test file imports
  - Cleaned debug logging for production readiness
  - Streamlined codebase by removing development artifacts

## [4.1.2] - 2025-07-28

### 🐛 Bug Fixes
- **📱 Mobile Navigation Issue**: Fixed critical bug where scrolling up to select box caused unwanted exam reloading
  - Added duplicate exam detection to prevent unnecessary reloads in select box event handlers
  - Enhanced pull-to-refresh logic with better accidental trigger prevention
  - Increased pull-to-refresh threshold from 80px to 120px for more deliberate gestures
  - Added validation in refreshExamData() to ensure exam is actually loaded before refresh

### 🚀 Performance Improvements  
- **⚡ Mobile Question Loading**: Optimized question display performance on touch devices
  - Eliminated redundant displayCurrentQuestion() calls (reduced from 3 to 1)
  - Added intelligent caching for processed question and answer text
  - Optimized mobile navigation creation (only create if not exists)
  - Enhanced swipe indicators with efficient updateSwipeIndicators() function

### 🔧 Technical Improvements
- **🛠️ Mobile Infrastructure**: Enhanced mobile navigation reliability and debugging
  - Fixed "Sidebar not found" error by correcting element ID from 'sidebar' to 'progressSidebar'
  - Added deferred sidebar swipe-to-close setup in enhanced navigation initialization
  - Improved mobile event handling with better gesture detection accuracy
  - Enhanced development logging for mobile navigation debugging

### 🎯 Mobile User Experience
- **📱 Touch Interaction**: Significantly improved mobile navigation fluidity
  - Prevents accidental exam reloading during normal mobile navigation
  - Preserves user progress when scrolling between UI elements
  - Enhanced touch responsiveness with more accurate gesture recognition
  - Better handling of mobile device orientation and screen size changes

## [4.1.1] - 2025-07-28

### 🚀 Performance Improvements
- **🗑️ Removed Obsolete Exam Preloading System**: Eliminated unnecessary background loading
  - Removed automatic preloading of top 5 exams from service worker
  - Eliminated PRELOAD_EXAMS message system between exam-loader and service worker
  - Reduced initial bandwidth usage and improved startup performance
  - Aligned with on-demand loading strategy for optimal resource utilization

### 🔧 Technical Changes  
- **📦 Service Worker Enhancement**: Updated to v3 with cleaner architecture
  - Removed preloadPopularExams() function and related event listeners
  - Simplified service worker message handling
  - Added explanatory comments for removed functionality
  - Maintained intelligent caching for actually accessed exams

### 🎯 Benefits
- **⚡ Faster Startup**: No more unnecessary exam downloads at initialization
- **💾 Bandwidth Savings**: Only load exams when users actually access them
- **🎯 Resource Efficiency**: Reduced memory footprint and network overhead
- **🔄 Better UX**: More responsive initial load with smart on-demand fetching

## [4.1.0] - 2025-07-28

### 🚀 Fixed
- **🔄 Smart Cache Strategy**: Resolved cache persistence issues preventing fresh deployments
  - Site files (HTML, CSS, JS) no longer cached - always fresh from network
  - User data (sessions, settings, statistics) remains cached in localStorage
  - Automatic cache cleanup for existing users with seamless transitions
  - Service worker upgrade notifications with user-friendly messages

### 🔧 Changed  
- **📦 Service Worker Enhancement**: Improved caching intelligence (v1 → v2)
  - Network-first strategy for site assets ensures immediate updates
  - Cache-first strategy maintained for exam data for optimal performance
  - Automatic old cache purge prevents stale content issues
  - Real-time update notifications during service worker transitions

### 🎯 Technical Improvements
- **⚡ Deployment Optimization**: Enhanced user experience for version updates
  - Backward-compatible cache management for existing users
  - Graceful cache migration with zero data loss
  - Improved service worker lifecycle management
  - Enhanced development debugging with detailed cache operations logging

## [4.0.0] - 2025-07-28

### Added
- **🔬 Comprehensive Testing System**: Advanced development and quality assurance tools
  - Integrated development test modal with real-time feedback
  - Comprehensive test suite covering core functionality, UI interactions, and edge cases
  - Automated test reporting with detailed results and performance metrics
  - Test modal repositioning and improved accessibility
  - Development mode integration for enhanced debugging capabilities

- **👨‍💻 Developer Information Section**: Enhanced project attribution and community links
  - Developer profile with social media integration (GitHub, Raycast)
  - Improved project attribution and contact information
  - Enhanced visual design with tooltips and hover effects

- **🎨 Modern Design System**: Complete 2025 UI/UX implementation
  - Enhanced button styling with modern hover effects and transitions
  - Improved validation UX with disabled states and visual feedback
  - Advanced discussion button styling and interaction patterns
  - Comprehensive responsive design improvements
  - Enhanced visual hierarchy and spacing consistency

- **🐛 Bug Report Integration**: User feedback and issue tracking system
  - Added prominent "Report a Bug" button in developer section
  - Direct integration with GitHub Issues for streamlined bug reporting
  - Clear visual design with icon and explicit text labeling
  - Responsive design with mobile-optimized touch targets
  - Enhanced user guidance for reporting issues and suggestions

- **⚡ Performance Optimization v3.0**: Simplified manifest system for maximum performance
  - Removed complex category filters and status indicators for cleaner UX
  - Simplified exam cards displaying only essential information (name + question count)
  - Streamlined statistics showing only exams and questions count
  - 90%+ improvement in initial loading performance (1 vs 20+ HTTP requests)
  - Centered exam names for better visual balance and readability

- **🛠️ Enhanced Python Scripts**: Automated manifest management and documentation
  - Automatic manifest updates after individual exam scraping (`scraper.py`)
  - Comprehensive CLI interface for scraper with advanced options (`--force-rescan`, `--force-update`, `--rapid`)
  - Complete scripts documentation in [Wiki](https://github.com/JohanDevl/Exams-Viewer/wiki) with detailed usage guides
  - Cleaned up temporary Python files and organized documentation structure
  - Enhanced error handling and fallback mechanisms for manifest updates

### Changed
- **📊 Statistics System**: Major reliability improvements for data accuracy and consistency
  - Session statistics calculation now prioritizes first actions only
  - Improved question status tracking with proper state management
  - Enhanced progress tracking with accurate answered/preview counts
  - Optimized statistics initialization and window object management
  - Fixed duplicate question entries in reset counter UI

- **🔄 Progress Tracking**: Comprehensive accuracy improvements in question state management
  - Sidebar status display now uses correct question indexing
  - Enhanced first action type prioritization for accurate progress tracking
  - Improved question status calculation across all UI components
  - Better handling of question state transitions and history
  - Fixed preview question inclusion in total question counts

- **⚙️ Settings System**: Enhanced configuration management and reliability
  - Improved settings loading logic for both saved and default configurations
  - Enhanced debugging capabilities with detailed logging
  - Better error handling in settings initialization process
  - Streamlined development workflow and build processes

- **🏗️ Application Architecture**: Modern development practices and tooling
  - Refactored state management to prevent UI conflicts
  - Improved modal lifecycle management with proper cleanup
  - Enhanced component isolation and event handling patterns
  - Better separation of concerns in testing infrastructure
  - Optimized performance for UI interactions and animations

- **📋 Data Structure Simplification**: Streamlined exam data management
  - Removed category-based exam organization and filtering for simplified UX
  - Updated manifest.json structure (v3.0) with only essential fields
  - Simplified exam display cards with centered names and question counts
  - Removed status indicators (COMPLETE/IN PROGRESS) for cleaner interface
  - Enhanced manifest generation script with improved documentation and validation

- **🎯 User Interface Optimization**: Focus on essential information and better performance
  - Eliminated complex category dropdowns and filters for simplified navigation
  - Centered exam names in cards for improved visual alignment
  - Streamlined homepage statistics to show only relevant metrics (exams/questions)
  - Improved manifest question count accuracy with real-time data validation
  - Enhanced loading performance through simplified data structure

### Fixed
- **🎯 User Interface**: Critical UX improvements and visual feedback
  - Note button now correctly changes color when note section is displayed
  - Fixed conflict with `updateFavoritesUI()` function overriding manual button states
  - Improved visual feedback for all interactive elements
  - Fixed test modal positioning, visibility, and close button functionality
  - Resolved modal reopening issues with proper DOM recreation

- **⚙️ Settings Default Values**: Configuration reliability after cache clearing
  - Fixed default settings application when localStorage is empty
  - "Show enhanced progress indicator" now correctly checked by default on fresh installations
  - Default settings properly initialized even when no saved settings exist

- **🧹 Code Maintenance**: Codebase cleanup and optimization
  - Removed obsolete test files and outdated documentation
  - Updated automated test reporting scripts for better reliability
  - Cleaned up simple development testing modules
  - Improved project structure and file organization
  - Enhanced code maintainability and development workflow

- **📊 Data Accuracy**: Corrected exam question counts and manifest consistency
  - Fixed incorrect question counts in manifest (e.g., CSA now shows accurate 369 questions vs. previous 200)
  - Resolved manifest loading issues with proper file path configuration in frontend
  - Corrected exam-loader.js to load from correct manifest.json path
  - Enhanced manifest generation to use real question counts from exam.json files
  - Improved data validation and backup creation during manifest updates

- **🎨 Visual Design Improvements**: Enhanced user experience and accessibility
  - Fixed exam name centering in cards for better visual balance
  - Removed unused CSS styles related to categories and status indicators
  - Cleaned up obsolete styling rules and improved code maintainability
  - Enhanced responsive design for mobile devices
  - Improved visual hierarchy and information density

## [3.1.0] - 2025-07-27

### Added
- **🔬 Comprehensive Testing System**: Advanced development and quality assurance tools
  - Integrated development test modal with real-time feedback
  - Comprehensive test suite covering core functionality, UI interactions, and edge cases
  - Automated test reporting with detailed results and performance metrics

- **👨‍💻 Developer Information Section**: Enhanced project attribution and community links
  - Developer profile with social media integration (GitHub, Raycast)
  - Improved project attribution and contact information
  - Enhanced visual design with tooltips and hover effects

### Changed
- **📊 Statistics System**: Major reliability improvements for data accuracy and consistency
  - Session statistics calculation now prioritizes first actions only
  - Improved question status tracking with proper state management
  - Enhanced progress tracking with accurate answered/preview counts

### Fixed
- **🎯 User Interface**: Critical UX improvements and visual feedback
  - Note button now correctly changes color when note section is displayed
  - Fixed conflict with `updateFavoritesUI()` function overriding manual button states
  - Improved visual feedback for all interactive elements

## [3.0.0] - 2025-07-26

### Added

- **Modular ES6 Architecture**: Complete migration to modern modular JavaScript
  - Core modules: `models.js`, `navigation.js`, `state.js` for fundamental functionality
  - Feature modules: `enhanced-navigation.js`, `exam-loader.js`, `favorites.js`, `mobile-navigation.js`, `search.js`, `settings.js`, `statistics.js`, `storage.js`, `ui-effects.js`
  - Clean separation of concerns with ES6 imports/exports
  - Window function assignments for backward compatibility
  - Improved maintainability and development experience

- **Enhanced Validation Feedback System**: Comprehensive answer validation results
  - Detailed validation messages: "Correct! Well done.", "Partially correct", "Incorrect"
  - Specific feedback for partial answers showing missed and incorrect selections
  - Real-time validation state management preventing message override
  - Improved user understanding of answer accuracy

- **Comprehensive Documentation**: Complete documentation overhaul
  - Modern README.md with emoji navigation and clear feature descriptions
  - Updated DEVELOPMENT.md with modular architecture guidelines and patterns
  - Revised PERFORMANCE_OPTIMIZATIONS.md reflecting current implementation
  - Architecture documentation with module responsibilities and data flow

### Enhanced

- **Project Structure**: Clean and organized codebase
  - Removed obsolete files: `script.js`, test files, duplicate modules
  - Updated service worker to reference correct script files
  - Simplified file structure with clear module hierarchy
  - Improved development workflow and maintenance

- **Performance Optimizations**: Modern architecture benefits
  - ES6 module loading with browser-native caching
  - Tree-shaking ready code structure
  - Reduced memory footprint through modular loading
  - Service worker optimizations for modular assets

- **Developer Experience**: Enhanced development workflow
  - Clear module boundaries and responsibilities
  - Comprehensive code examples and patterns
  - Updated development setup and contribution guidelines
  - Modern JavaScript patterns and best practices

### Changed

- **Architecture Migration**: Breaking changes for better structure
  - Migrated from monolithic `script.js` to modular ES6 architecture
  - Updated all function calls and dependencies to use module system
  - Reorganized code into logical modules with clear interfaces
  - **BREAKING**: Developers must understand new module structure

- **Script Loading**: Updated application entry point
  - Main entry point changed from `script.js` to `script-modular.js`
  - Service worker updated to cache new file structure
  - HTML references updated to use modular entry point

### Fixed

- **Validation Message Display**: Resolved answer feedback issues
  - Fixed "You selected X answer(s)" message persistence after validation
  - Prevented `updateInstructions()` from overriding validation results
  - Added proper validation state checks throughout navigation system
  - Ensured `showValidationResults()` function availability in modular architecture

- **Auto-Chunking**: Disabled unnecessary chunk creation
  - Removed automatic chunk generation during scraping
  - Simplified data structure without lazy loading complexity
  - Maintained manual chunking tools for optional use
  - Improved scraping performance by removing chunk overhead

### Removed

- **Legacy Code**: Cleaned up obsolete components
  - Removed monolithic `script.js` (replaced by modular architecture)
  - Deleted duplicate `js/script-modular.js` file
  - Removed test files: `index-*test.html`, `test-simple.html`
  - Cleaned up development artifacts and backup files

- **Unused Features**: Simplified codebase
  - Removed lazy loading system (no longer needed)
  - Eliminated automatic chunk creation during scraping
  - Simplified performance optimizations for current needs

### Technical

- **Module System**: Professional ES6 module implementation
  - Proper export/import patterns throughout codebase
  - Global function assignments for compatibility
  - Clear module dependencies and interfaces
  - Scalable architecture for future development

- **Code Quality**: Improved maintainability and standards
  - Consistent coding patterns across all modules
  - Clear separation between core and feature modules
  - Comprehensive error handling and validation
  - Modern JavaScript practices and patterns

- **Documentation Standards**: Professional documentation approach
  - Comprehensive README with modern structure
  - Technical documentation matching implementation
  - Clear development guidelines and patterns
  - Updated architecture explanations and examples

## [2.10.0] - 2025-07-14

### Added

- **Enhanced Export System**: Comprehensive modal interface with flexible export options
  - Multiple export formats: TXT, CSV, enhanced JSON, and PDF with consistent formatting
  - Content filtering options: all questions, favorites only, questions with notes, answered questions, and by category
  - Selective content inclusion: questions, answers, correct answers, discussions, images, user notes, and metadata
  - Export preview functionality with question count and file size estimation
  - Real-time availability counting for filter options (automatically disables filters with 0 content)
  - Clickable links in discussions preserved for PDF exports
  - Proper file naming with exam codes and timestamps (e.g., "CAD-questions-2024-01-15_14-30-25.txt")

- **Export Content Options**: Granular control over exported content
  - Include/exclude questions, answers, correct answers independently
  - Toggle discussions, images, and metadata inclusion
  - User notes export with personal annotations, categories, and favorite status
  - Smart content filtering that respects user's saved data across sessions

### Enhanced

- **Export UI/UX**: Intuitive modal design with consistent layout
  - Organized sections for format selection, content filtering, and content options
  - Filter availability counts displayed on separate lines for better readability
  - Disabled states for unavailable filter options with visual feedback
  - Export preview showing filtered question count and estimated file size

### Fixed

- **Export File Naming**: Proper exam code resolution and timestamp generation
  - Resolves "undefined" filenames by using consistent exam code lookup logic
  - Generates unique timestamps with date and time for file identification
  - Maintains backward compatibility with existing export functions

- **User Notes Export**: Correct data retrieval across all export formats
  - Uses proper exam code resolution logic matching the filtering system
  - Ensures user notes, categories, and favorites appear in exports when enabled
  - Consistent behavior across TXT, CSV, JSON, and PDF export formats

### Technical

- **Export Architecture**: Modular and maintainable export system
  - Created `getExamCodeAndFilename()` helper for consistent file naming across formats
  - Integrated `formatCommentText()` in PDF exports for proper link handling
  - Unified exam code resolution logic across all export and filter functions
  - Comprehensive error handling and user feedback for export operations

## [2.9.0] - 2025-07-14

### Added

- **Resume Study Position System**: Intelligent position tracking across browser sessions
  - Automatic position saving during question navigation with persistent localStorage storage
  - Resume dialog with Continue/Start Fresh options when returning to previously studied exams
  - Visual progress context showing saved position information to help users decide
  - Cross-session progress tracking maintains statistical data while allowing fresh question experience
  - Optional auto-save position feature for seamless continuous study sessions (disabled by default)
  - Position validation with boundary checking and graceful error handling
  - Settings integration with Study Management section for user control
  - Performance optimized with efficient storage and non-blocking updates
  - Privacy-focused design with local-only data storage, never transmitted externally

- **Enhanced Progress Tracking**: Cross-session visual progress indicators
  - Progress sidebar shows question status across multiple sessions
  - Highlight/preview mode questions now properly count as answered in progress tracking
  - Immediate progress indicator updates when highlight mode is activated via settings
  - Consistent visual feedback for study progress regardless of session boundaries
  - Statistical data preservation while maintaining fresh question appearance

### Enhanced

- **Settings Management**: Extended Study Management section
  - New "Resume Study Position" toggle for enabling/disabling position tracking
  - Optional "Auto-Save Position" setting for automatic position saving during navigation
  - Position management utilities for viewing and clearing saved positions
  - User-friendly descriptions explaining feature benefits and privacy approach
  - Default disabled state requiring explicit user opt-in for conservative approach

- **User Experience**: Seamless study session continuation
  - Graceful handling of invalid or corrupted position data
  - Clear visual distinction between resumed and fresh study sessions
  - Contextual resume dialog providing relevant position information
  - Smooth integration with existing navigation and statistics systems
  - Backward compatibility ensuring normal operation when feature is disabled

### Technical

- **Data Structure**: Optimized localStorage management
  - Minimal storage footprint with efficient position data structure
  - Automatic cleanup of outdated or invalid position entries
  - Memory-efficient position tracking with proper cleanup procedures
  - Background position updates without UI impact or navigation interruption

## [2.8.0] - 2025-07-14

### Added

- **Enhanced Mobile Navigation System**: Comprehensive touch-optimized navigation for mobile devices
  - 44px minimum touch targets for all interactive elements following iOS accessibility guidelines
  - Swipe gestures for intuitive question navigation (left swipe = next, right swipe = previous)
  - Mobile bottom navigation bar with essential controls (Previous, Random, Progress, Next)
  - Visual feedback system with swipe indicators showing navigation direction
  - Haptic feedback support using vibration API for tactile user experience
  - Contextual display - navigation only appears during active exams, not on homepage
  - Clean mobile interface with desktop navigation completely hidden on mobile
  - Responsive design with automatic adaptation between desktop and mobile modes

- **Touch Gesture Detection**: Advanced touch event handling system
  - Horizontal swipe detection with proper thresholds and timing validation
  - Conflict prevention with scrolling, form inputs, and existing controls
  - Smart gesture recognition avoiding interference with essential UI interactions
  - Performance optimizations using passive event listeners where appropriate

- **Mobile-Optimized UI Components**: Complete mobile interface overhaul
  - Thumb-friendly navigation with fixed bottom positioning for one-handed use
  - Enhanced spacing and touch target sizing for better mobile interaction
  - Touch feedback animations and visual cues for interactive elements
  - Mobile-specific CSS optimizations with media queries for different screen sizes

### Enhanced

- **Navigation Experience**: Seamless integration of touch and traditional navigation
  - Keyboard shortcuts remain fully functional alongside new touch gestures
  - Navigation history and progress tracking work with all input methods
  - Sidebar functionality enhanced with swipe-to-close gesture on mobile
  - Improved navigation state management across different device types

- **Performance Optimizations**: Efficient touch event handling and responsive design
  - Conditional feature loading based on device capabilities and screen size
  - Memory-efficient gesture detection with proper event cleanup
  - Optimized CSS rendering with mobile-first responsive design approach
  - Intelligent navigation bar management with dynamic creation and removal

### Technical

- **Cross-Platform Compatibility**: Full support for modern mobile browsers
  - iOS Safari: Complete functionality including haptic feedback
  - Android Chrome: Full feature support with vibration API integration
  - Progressive enhancement ensuring graceful degradation on older devices
  - Touch-action CSS properties for optimal touch interaction performance

## [2.7.0] - 2025-07-14

### Added

- **Informative Tooltips System**: Comprehensive tooltip guidance for better user experience
  - CSS-only tooltip implementation using pseudo-elements for optimal performance
  - Keyboard shortcuts displayed on relevant buttons and interface elements
  - Four positioning options (top, bottom, left, right) with intelligent placement
  - Disabled by default with toggle option in settings modal for user control
  - Mobile-optimized touch support with automatic 3-second display duration
  - Responsive design adapting to different screen sizes and orientations
  - Dark mode compatibility with theme-aware styling
  - Accessibility compliance with screen reader support and high contrast mode
  - Reduced motion support for users with motion sensitivity preferences

- **Enhanced User Guidance**: Contextual information for all major interface elements
  - Navigation buttons with keyboard shortcuts (←/→, H/L for vim users)
  - Action buttons showing corresponding keys (V for validate, F for favorite, N for notes)
  - Interface controls with helpful descriptions and shortcut combinations
  - Progressive disclosure of advanced features through informative tooltips
  - Consistent tooltip styling across all components with proper spacing and readability

### Enhanced

- **Settings Management**: Extended preferences system
  - New tooltip visibility control in Display Preferences section
  - Persistent setting storage with localStorage integration
  - Immediate application of tooltip visibility changes
  - Clear descriptions of tooltip functionality and keyboard shortcuts

### Fixed

- **Tooltip Display Issues**: Resolved visibility and positioning problems
  - Proper background sizing with max-content width calculation
  - High z-index (99999) ensuring tooltips appear above all interface elements
  - Corrected line break display using HTML entities (&#10;) instead of \n
  - Improved positioning for header buttons with top-aligned tooltips
  - Enhanced mobile touch handling with focus-based activation

## [2.6.0] - 2025-07-14

### Added

- **Enhanced Visual Status Indicators**: Comprehensive color-coded badge system for question states
  - Six distinct status types: New (gray), Viewed (orange), Correct (green), Incorrect (red), With Notes (purple), Categorized (cyan)
  - Primary status badges showing question completion states with icons and text labels
  - Secondary badges for favorites (star), notes (sticky note), and categories (tag)
  - Real-time status updates when validating answers, adding favorites, or creating notes
  - Intelligent status detection with automatic question visit tracking
  - Performance-optimized caching system with LRU management (200-item limit)
  - Full accessibility support with ARIA labels and screen reader compatibility
  - Complete dark mode integration with adaptive color schemes

- **Question Organization System**: Advanced tools for study session management
  - Automatic visit tracking when navigating to questions
  - Distinction between correct/incorrect/preview answer attempts
  - Integration with existing favorites and notes systems
  - Category-based organization with visual indicators

- **Responsive Badge System**: Mobile-optimized visual indicators
  - Adaptive badge sizing for different screen sizes (768px, 480px breakpoints)
  - Intelligent layout switching from horizontal to vertical stacking on mobile
  - Touch-friendly interactions with proper spacing and sizing
  - Consistent visual hierarchy across all device types

### Enhanced

- **Progress Sidebar**: Enriched question overview with visual status display
  - Enhanced question items showing comprehensive status information
  - Clear visual hierarchy with primary and secondary status indicators
  - Improved navigation with click-to-go functionality for all question states
  - Better mobile responsiveness with adaptive badge layouts

- **Performance Optimizations**: Intelligent caching and memory management
  - Question status cache with automatic invalidation when data changes
  - Memory-efficient status calculations for large question sets
  - Optimized DOM updates and render cycles for smooth animations
  - Background cache cleanup to prevent memory leaks

- **User Interface**: Improved visual feedback and accessibility
  - Hover effects and transitions for better interaction feedback
  - Focus management for keyboard navigation compatibility
  - Color-blind friendly design with icons complementing color coding
  - Proper contrast ratios maintained across all themes

### Fixed

- **Question Toolbar Access**: Resolved issue with category dropdown not appearing
  - Clarified that question toolbar must be enabled in Settings > Display Preferences
  - Updated documentation to explain toolbar activation requirement
  - Improved user guidance for accessing favorites, categories, and notes features

### Technical

- **Session Statistics Enhancement**: Extended session data structure
  - Added `visitedQuestions` array to track question navigation
  - Backward compatibility with existing session data
  - Compressed property names for storage efficiency
  - Proper getter methods for data access

- **Cache Management**: Intelligent status caching system
  - LRU cache implementation with automatic size management
  - Cache invalidation triggers for data consistency
  - Memory leak prevention with bounded cache size
  - Performance monitoring and optimization

## [2.5.3] - 2025-07-13

### Added

- **Enhanced Progress Indicator**: Comprehensive animated progress tracking system
  - Animated progress bar with smooth GPU-accelerated transitions and color gradients
  - Real-time statistics display showing answered questions, favorites, and remaining count
  - Dynamic percentage indicator with pulsing animations and milestone celebrations
  - Milestone effects for 25%, 50%, 75%, and 100% completion with visual celebrations
  - Current question position tracking with smooth indicator animations
  - Session isolation ensuring fresh progress tracking for each exam load
  - Optional display control via Settings > Display Preferences (enabled by default)
  - Responsive design adapting perfectly to mobile and desktop layouts
  - Full dark mode compatibility with optimized colors and animations
  - Integration with existing navigation, favorites, and statistics systems

### Enhanced

- **Settings Management**: Improved toolbar and interface control
  - Enhanced "Show question toolbar" setting now properly controls revision mode button visibility
  - Real-time toggle updates without requiring page reload for all toolbar-related elements
  - Improved settings organization with proper spacing and descriptions
  - Dynamic interface updates when settings change for better user experience

### Fixed

- **Session Statistics**: Corrected progress tracking between exam sessions
  - Fixed `isQuestionAnswered()` to only check current session instead of previous sessions
  - Ensured each exam load starts with a fresh progress count (0 answered questions)
  - Resolved issue where switching between exams showed incorrect answer counts
  - Improved session isolation for accurate progress representation

## [2.5.2] - 2025-07-13

### Fixed

- **Embedded Image Display**: Fixed display of compressed images in exam questions
  - Implemented `processEmbeddedImages()` function to handle base64 image processing
  - Fixed replacement of truncated base64 sources with complete image data
  - Added support for `data-img-id` attributes from scraper compression system
  - Enhanced image display in questions, answers, discussion comments, and PDF exports
- **Update Status Messages**: Resolved confusing error messages during exam updates
  - Modified `update_exam_data()` to return clear success/failure indicators
  - Fixed chunking operations appearing as failures instead of success notifications
  - Improved clarity of update status reporting with proper message separation

### Enhanced

- **Image Processing System**: Comprehensive improvements to embedded image handling
  - WebP format prioritization with automatic JPEG fallback for better compression
  - Added responsive styling and accessibility attributes for all processed images
  - Implemented fallback support for original URLs when embedded data unavailable
  - Enhanced PDF export to include properly formatted embedded images
- **Performance Optimizations**: Continued improvements to large exam handling
  - Refined chunking system with better status reporting
  - Enhanced data integrity with improved image compression integration
  - Optimized image loading with local base64 processing (no external requests)

## [2.5.1] - 2025-07-13

### Fixed

- **Console Errors**: Resolved JavaScript errors that appeared in browser console
  - Fixed JSON parsing errors in statistics compression/decompression with proper regex escaping
  - Added fallback parsing and default structure for corrupted localStorage data
  - Implemented automatic detection and cleanup of corrupted localStorage items
- **Browser Cache Issues**: Added console guidance for users experiencing autoPip.js MediaSession errors
  - Provides clear instructions for cache clearing and localStorage reset
  - Helps resolve stale browser cache references to non-existent files

### Enhanced

- **Data Recovery**: Improved robustness of data loading and error handling

  - Enhanced statistics data compression with proper special character handling
  - Added graceful fallbacks for corrupted or malformed data
  - Automatic cleanup prevents persistent error states

- **Changelog Display**: Improved markdown rendering with compact nested lists
  - Recursive parser supporting unlimited nesting levels
  - Compact CSS styling with progressive spacing for better readability
  - Enhanced visual hierarchy for multi-level list structures

## [2.5.0] - 2025-07-13

### Added

- **Enhanced Keyboard Navigation System**: Comprehensive shortcuts for all navigation actions
  - Vim-style navigation (`hjkl`) alongside standard arrow keys
  - Quick movement: Previous/Next 5 questions (`↑↓`), 10 questions (`Page Up/Down`)
  - Direct navigation: Number keys 1-9 for instant question jumping
  - Home/End keys for first/last question navigation
  - Modifier combinations: `Ctrl+↑/↓` for beginning/end navigation
- **Visual Progress Sidebar**: Interactive question overview with real-time status tracking
  - Comprehensive progress bar with completion percentage
  - Clickable question list with status indicators (current, answered, unanswered, favorites)
  - Question previews showing first 60 characters for easy identification
  - Auto-scroll functionality to keep current question visible
  - Responsive design: full-screen on mobile, overlay on desktop
- **Navigation History System**: Browser-like back/forward functionality
  - Intelligent history tracking with smart duplicate prevention
  - Back/Forward buttons with step counters and tooltips
  - Limited to 50 entries for optimal performance
  - Universal integration with all navigation methods
- **Action Shortcuts**: Direct keyboard access to core functions
  - `v` for answer validation, `t` for highlight toggle
  - `f` for favorites, `n` for notes, `r` for random question
  - `s` for search focus, `Ctrl+S` for sidebar toggle
  - `Esc` for universal close/cancel, `?` for keyboard help
- **Keyboard Shortcuts Help Modal**: Interactive reference guide
  - Organized shortcuts by category (Navigation, Actions, Interface)
  - Visual keyboard key representations
  - Responsive design with mobile optimization

### Enhanced

- **Navigation Flow**: Seamless integration between different navigation methods
  - Space/Enter for next question, Shift+Space for previous
  - Shift+Enter for quick answer validation
  - Context-aware shortcuts that respect input field focus
- **User Experience**: Intuitive interface improvements
  - Smooth animations and transitions (300ms duration)
  - Visual feedback for all interactive elements
  - Accessible design with proper focus management
- **Performance**: Optimized for smooth operation
  - Efficient DOM updates with batch operations
  - Memory management with automatic cleanup
  - Event delegation for optimal performance
- **State Persistence**: Intelligent settings management
  - Sidebar open/close state saved across sessions
  - Navigation preferences maintained
  - Integration with existing settings system

### Technical

- **Architecture**: Modular and maintainable code structure
  - Centralized navigation function with history support
  - Event-driven updates for real-time synchronization
  - Clean separation of concerns between components
- **Integration**: Seamless compatibility with existing features
  - Works with search/filter system maintaining context
  - Syncs with favorites and statistics systems
  - Maintains compatibility with all existing functionality

## [2.4.0] - 2025-07-13

### Added

- **Advanced Search & Filters System**: Comprehensive search functionality for questions
  - Text search across questions, answers, and comments with multi-word support
  - Question number search with real-time auto-completion suggestions
  - Status filters: Answered, Unanswered, and Favorite questions
  - Smart caching system for improved search performance
  - Combined search and filter operations support
- **Search Interface**: Collapsible search section with intuitive UX
  - Collapsed by default with full header clickable area
  - Smooth animations and visual feedback
  - Real-time result counters and status indicators
- **Settings Integration**: Optional advanced search display
  - New setting to show/hide advanced search (disabled by default)
  - Automatic state cleanup when disabling search functionality
  - Persistent user preference storage

### Enhanced

- **Question Navigation**: Improved navigation compatibility with filtered results
- **Filter Counts**: Dynamic counters showing answered/unanswered/favorite question counts
- **User Experience**: Mobile-responsive design with touch-friendly interactions
- **Performance**: Efficient question detection across current and previous sessions
- **Interface**: Clean and professional search interface with proper state management

## [2.3.0] - 2025-07-09

### Added

- Option in Settings to show/hide the question toolbar (favorites, groups, notes)
- The question toolbar is now hidden by default and can be enabled via Display Preferences

### Enhanced

- Toolbar visibility is persistent (saved in localStorage)
- Dynamic update of the toolbar without page reload

## [2.2.0] - 2025-07-09

### Added

- Changelog functionality with Markdown rendering
- Changelog accessible from main interface with keyboard shortcut (Ctrl/Cmd+H)
- Automatic Markdown formatting for changelog display
- Visual icons for changelog sections (Added, Changed, Enhanced, etc.)
- GitHub Actions workflows for automated changelog management
- Support for 2025-07-09 placeholder replacement

### Enhanced

- Markdown parser with dynamic header counting (# symbols)
- Improved list parsing with proper multi-line handling
- Better spacing and alignment for changelog sections
- Loading states and error handling for changelog modal
- CSS styling with flexbox layout for icon alignment

## [2.1.0] - 2025-07-09

### Added

- **Favorites System**: Mark questions as favorites for quick access
- **Custom Categories**: Create and manage custom categories for organizing questions
- **Personal Notes**: Add personal notes to questions for better study management
- **Revision Mode**: Special mode to review only favorited questions and notes
- **Enhanced Statistics**: Comprehensive tracking of study sessions and performance
- **Progress Tracking**: Detailed analytics on question attempts and learning progress
- **Export/Import Favorites**: Backup and restore your favorites and notes

### Enhanced

- **User Interface**: Improved navigation and user experience
- **Performance**: Optimized loading times and data management
- **Accessibility**: Better keyboard navigation and screen reader support

### Fixed

- **Data Persistence**: Improved reliability of saving user data
- **Mobile Responsiveness**: Better display on mobile devices
- **Memory Management**: Optimized data storage and retrieval

## [2.0.0] - 2025-07-08

### Added

- **Dark Mode**: Full dark theme support with automatic detection
- **Question Statistics**: Track performance per question and exam
- **Session Management**: Monitor study sessions with detailed analytics
- **Export to PDF**: Generate PDF documents of exam questions
- **Advanced Navigation**: Jump to specific questions, random navigation
- **Highlight Feature**: Preview correct answers before validation
- **Discussion Integration**: View community discussions for questions

### Changed

- **Complete UI Redesign**: Modern, responsive interface
- **Improved Data Structure**: More efficient JSON format for exam data
- **Enhanced Error Handling**: Better error messages and recovery
- **Performance Optimization**: Faster loading and smoother navigation

### Removed

- Legacy interface components
- Deprecated API endpoints

## [1.5.0] - 2025-07-05

### Added

- **Multiple Exam Support**: Browse and select from available exams
- **Question Validation**: Check answers with detailed explanations
- **Progress Indicators**: Visual feedback on study progress
- **Responsive Design**: Mobile-friendly interface

### Enhanced

- **Loading Performance**: Faster exam data loading
- **Error Messages**: More informative error handling
- **Navigation**: Improved question browsing experience

### Fixed

- **Data Loading Issues**: Resolved JSON parsing errors
- **Browser Compatibility**: Fixed issues with older browsers
- **Memory Leaks**: Optimized memory usage

## [1.0.0] - 2025-07-04

### Added

- **Initial Release**: Basic exam question viewer
- **Scraping Engine**: Automated question extraction from ExamTopics
- **Question Display**: Clean interface for viewing exam questions
- **Answer Selection**: Interactive answer selection system
- **Basic Navigation**: Previous/Next question navigation

### Features

- Support for ServiceNow certification exams
- JSON-based data storage
- GitHub Pages deployment
- Automated scraping with GitHub Actions
- Legal compliance framework

### Technical

- Vanilla JavaScript frontend
- Python-based scraping backend
- BeautifulSoup4 for HTML parsing
- GitHub Actions for automation
- Responsive CSS design

## [0.1.0] - 2025-07-04

### Added

- **Project Initialization**: Basic project structure
- **Proof of Concept**: Initial scraping functionality
- **Basic UI**: Simple question display interface
- **Data Structure**: JSON format for storing exam questions

### Infrastructure

- GitHub repository setup
- Basic documentation
- MIT License
- Requirements specification

---

## Legend

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes
- **Enhanced**: Improvements to existing features

## Contributing

When adding entries to this changelog:

1. **Use semantic versioning** (MAJOR.MINOR.PATCH)
2. **Group changes** by type (Added, Changed, Fixed, etc.)
3. **Be descriptive** but concise
4. **Include dates** in YYYY-MM-DD format
5. **Reference issues/PRs** when applicable
6. **Keep it user-focused** - describe impact, not implementation details

## Version History Summary

- [5.0.0] - 2025-08-04: Complete Architecture Overhaul - GitHub Pages & Mobile Experience Revolution
- [4.3.0] - 2025-07-29: User-Perceived Difficulty Rating System
- [4.2.0] - 2025-07-28: Enhanced Keyboard Shortcuts with Visual Feedback
- [4.1.2] - 2025-07-28: Mobile Navigation & Performance Fixes
- [4.1.1] - 2025-07-28: Performance Optimization - Removed Obsolete Exam Preloading
- [4.1.0] - 2025-07-28: Smart Cache Strategy & Deployment Optimization
- [4.0.0] - 2025-07-28: Performance Revolution & Simplified UX
- [3.1.0] - 2025-07-27: Modern Redesign & Comprehensive Improvements
- [3.0.0] - 2025-07-26: Modular ES6 Architecture Migration  
- [2.10.0] - 2025-07-14: Enhanced Export System
- [2.9.0] - 2025-07-14: Resume Study Position System
- [2.8.0] - 2025-07-14: Advanced Search Filtering & UI Enhancements
- [2.7.0] - 2025-07-14: Enhanced Statistics & UI Refinements
- [2.6.0] - 2025-07-14: Progressive Web App Features & Comprehensive Improvements
- [2.5.3] - 2025-07-13: Minor Bug Fixes & Stability Improvements
- [2.5.2] - 2025-07-13: Question Navigation & Export Enhancements
- [2.5.1] - 2025-07-13: Bug Fixes & Performance Optimizations
- [2.5.0] - 2025-07-13: Enhanced Statistics & Mobile Experience
- [2.4.0] - 2025-07-13: Advanced Analytics & Performance Optimization
- [2.3.0] - 2025-07-09: Mobile Experience & User Interface Enhancements
- [2.2.0] - 2025-07-09: Enhanced Search & Filter System
- [2.1.0] - 2025-07-09: Comprehensive Export System & UI Improvements
- [2.0.0] - 2025-07-08: Advanced Statistics & Session Management
- [1.5.0] - 2025-07-05: Enhanced User Experience & Statistics
- [1.0.0] - 2025-07-04: Core Features & Functionality
- [0.1.0] - 2025-07-04: Initial Release
