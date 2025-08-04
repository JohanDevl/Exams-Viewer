# 🎓 Exams Viewer

> **Modern ServiceNow certification exam preparation platform built with Next.js 15**

A cutting-edge web application for practicing ServiceNow certification exam questions with advanced features, real-time statistics, and intelligent study tools.

## 🌐 Live Demo

**🚀 Web Application**: [https://JohanDevl.github.io/Exams-Viewer/](https://JohanDevl.github.io/Exams-Viewer/)

> Modern Next.js application with server-side rendering, responsive design, dark mode, and comprehensive study features.

## ✨ Key Features

### 🎯 Modern Learning Experience

- **⚡ Next.js 15 Architecture**: Server-side rendering with React 19 and TypeScript
- **📱 Responsive Design**: Mobile-first approach optimized for all devices
- **⌨️ Advanced Keyboard Shortcuts**: Complete shortcut system with context-aware bindings
- **📈 Real-time Progress Tracking**: Interactive analytics with session persistence
- **🎨 Smart Status System**: Color-coded question states with visual feedback
- **🌗 Modern Dark Mode**: System-integrated theming with seamless transitions
- **💾 Intelligent Session Management**: Automatic restoration with conflict resolution

### 🔍 Advanced Search & Filtering

- **🔎 Intelligent Search**: Real-time search across questions, answers, and discussions
- **🎯 Dynamic Difficulty System**: 3-level rating with color-coded indicators and filtering
- **🏷️ Smart Status Filters**: Filter by answered, favorites, difficulty, and custom categories
- **📝 Auto-completion**: Smart suggestions with instant results
- **📉 Real-time Counters**: Live count updates for each filter category

### 📈 Comprehensive Analytics

- **📉 Advanced Statistics**: Session tracking with detailed performance metrics
- **🎯 Performance Insights**: Accuracy tracking, time analysis, and improvement trends
- **📈 Visual Charts**: Interactive progress visualization with Framer Motion
- **💾 Optimized Storage**: Intelligent data compression with automatic cleanup
- **📊 Export Functionality**: Multiple formats (JSON, CSV, TXT, PDF) with custom filtering

### 📱 Mobile-Optimized Experience

- **👆 Touch Gestures**: Swipe navigation with haptic feedback
- **📱 Mobile Navigation**: Thumb-friendly bottom navigation bar
- **🔄 Responsive Components**: Adaptive UI with touch optimization
- **⚡ Performance**: Optimized for mobile devices with efficient rendering

## 📚 Supported Certifications

Currently supporting **20+ exams** across ServiceNow certification tracks:

### Core Certifications

- **CAD** - Certified Application Developer
- **CSA** - Certified System Administrator
- **CAS-PA** - Customer Service Management Professional

### Implementation Specialist (CIS) Series

- **CIS-APM** - Application Portfolio Management
- **CIS-CSM** - Customer Service Management
- **CIS-Discovery** - Discovery
- **CIS-EM** - Event Management
- **CIS-FSM** - Field Service Management
- **CIS-HAM** - Hardware Asset Management
- **CIS-HR** - Human Resources
- **CIS-ITSM** - IT Service Management
- **CIS-PPM** - Project Portfolio Management
- **CIS-RC** - Risk and Compliance
- **CIS-SAM** - Software Asset Management
- **CIS-SIR** - Security Incident Response
- **CIS-SM** - Service Mapping
- **CIS-SPM** - Strategic Portfolio Management
- **CIS-VR** - Vulnerability Response
- **CIS-VRM** - Vendor Risk Management

> All exams include comprehensive questions, explanations, community discussions, and advanced progress tracking.

## 🚀 Quick Start

### For Study & Practice

1. **Visit** the live application URL
2. **Select** an exam from the dropdown
3. **Start studying** with the modern interface
4. **Track progress** with real-time analytics

### For Development

```bash
# Clone the repository
git clone https://github.com/JohanDevl/Exams-Viewer.git
cd Exams-Viewer

# Install Node.js dependencies
npm install

# Install Python dependencies (for data scripts)
pip install -r requirements.txt

# Start development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏢 Architecture

### Modern Next.js Structure

```
Exams-Viewer/
├── 🏠 src/                          # Application source code
│   ├── 📄 app/                      # Next.js App Router
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout with providers
│   │   └── page.tsx                  # Main application page
│   ├── 🧩 components/               # React components
│   │   ├── exam/                     # Exam-specific components
│   │   ├── question/                 # Question display components
│   │   ├── navigation/               # Navigation components
│   │   ├── modals/                   # Modal dialogs
│   │   ├── providers/                # Context providers
│   │   └── ui/                       # Reusable UI components
│   ├── 🎣 hooks/                    # Custom React hooks
│   ├── 📝 stores/                   # Zustand state management
│   ├── 🏷️ types/                    # TypeScript definitions
│   └── 🔧 utils/                    # Utility functions
├── 📁 public/                       # Static assets
│   └── data/                         # Exam data repository
│       ├── {EXAM_CODE}/              # Individual exam folders
│       │   ├── exam.json              # Questions and answers
│       │   └── links.json             # Resource links
│       └── manifest.json             # Exam catalog
├── 🔧 scripts/                      # Python data management
│   ├── scraper.py                    # Web scraping
│   ├── update_all_exams.py           # Batch updates
│   └── update_manifest.py            # Manifest generation
└── 📚 docs/                         # Documentation
```

### Technology Stack

- **⚡ Next.js 15** - React framework with App Router and server-side rendering
- **⚛️ React 19** - Latest React with concurrent features
- **🔷 TypeScript** - Type safety and enhanced developer experience
- **🎨 Tailwind CSS** - Utility-first styling with custom components
- **📦 Radix UI** - Accessible component primitives
- **🐻 Zustand** - Lightweight state management with persistence
- **✨ Framer Motion** - Smooth animations and transitions

## 📈 Usage Guide

### Basic Navigation

1. **Select Exam**: Choose from the dropdown list of available certifications
2. **Navigate Questions**: Use keyboard shortcuts, buttons, or touch gestures
3. **Answer Questions**: Select answers and validate to see instant results
4. **Track Progress**: Monitor completion via the interactive progress indicators

### Advanced Features

- **📉 Statistics Dashboard**: Press `Ctrl+S` or access via menu for detailed analytics
- **⌨️ Keyboard Shortcuts**: Press `?` for complete shortcut reference
- **🎯 Difficulty Rating**: Rate questions using number keys (1/2/3) or buttons
- **🔍 Advanced Search**: Filter by status, difficulty, favorites, and text search
- **📝 Organization Tools**: Add favorites, categories, and personal notes
- **📄 Export Options**: Export data in JSON, CSV, TXT, or PDF formats
- **🔍 Preview Mode**: Highlight correct answers before validation
- **🔄 Session Restoration**: Automatic session recovery and progress persistence

### Mobile Features

- **👆 Touch Navigation**: Swipe gestures for question navigation
- **📱 Mobile Controls**: Optimized bottom navigation bar
- **🔄 Responsive Design**: Adaptive layout for all screen sizes

## 🔧 Development

### Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Data Management Scripts

```bash
# Update all exam data
python3 scripts/update_all_exams.py

# Update specific exam
python3 scripts/scraper.py [EXAM_CODE]

# Generate manifest
python3 scripts/update_manifest.py
```

## 📚 Documentation

### User Guides

- **[📅 Installation Guide](docs/INSTALLATION.md)** - Setup and deployment
- **[📆 Usage Guide](docs/USAGE.md)** - Complete feature walkthrough
- **[🎯 Features Overview](docs/FEATURES.md)** - Detailed feature descriptions

### Technical Documentation

- **[🔧 Development Guide](docs/DEVELOPMENT.md)** - Developer setup and contribution
- **[📈 Statistics System](docs/STATISTICS.md)** - Analytics implementation
- **[⌨️ Navigation System](docs/NAVIGATION.md)** - Keyboard shortcuts and navigation
- **[📈 Performance Guide](docs/PERFORMANCE_OPTIMIZATIONS.md)** - Optimization techniques
- **[📄 API Reference](docs/API.md)** - Technical API documentation

## ⚖️ Legal & Ethics

### 📚 Educational Purpose

This application is designed **exclusively for educational use** and personal study preparation. Commercial use is strictly prohibited.

### 🔒 Content Attribution

- All exam content is sourced from **ExamTopics.com**
- Original content ownership belongs to respective certification providers
- This tool provides a modern practice interface under fair use principles
- No content is claimed as original work of this project

### 🛡️ Responsible Data Management

- **Rate Limiting**: Intelligent delays between scraping requests
- **Server Respect**: Automatic detection and handling of rate limiting
- **Error Handling**: Graceful handling of server errors and timeouts
- **Minimal Impact**: Incremental updates to reduce server load

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/Exams-Viewer.git
cd Exams-Viewer

# Install dependencies
npm install
pip install -r requirements.txt

# Start development
npm run dev
```

See [Development Guide](docs/DEVELOPMENT.md) for detailed contribution guidelines.

## 🆘 Support

### Getting Help

1. **📚 Check Documentation**: Browse the comprehensive docs in `/docs/`
2. **🔍 Search Issues**: Look through [existing issues](../../issues)
3. **🆕 Create Issue**: Submit a [new issue](../../issues/new) with details
4. **💬 Discussions**: Join [GitHub Discussions](../../discussions)

### Common Issues

- **Loading Problems**: Check browser console and network tab
- **Mobile Issues**: Verify responsive design and touch interactions
- **Performance**: Monitor with React DevTools and performance profiler
- **Data Issues**: Use statistics panel cleanup tools for corrupted data

## 📈 Project Status

- **🎯 Active Development**: Regular updates with new features
- **📱 Production Ready**: Stable and fully functional
- **🔄 Continuous Integration**: Automated testing and deployment
- **📈 Growing**: Expanding exam coverage and enhanced features

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and feature updates.

## 📄 License

**Educational Use License**: This project is licensed for educational purposes only. All exam content remains the property of its respective owners. See the legal compliance section above for full details.

---

<div align="center">

**🎓 Happy Studying! 📚**

_Built with ❤️ for the ServiceNow community using modern web technologies_

</div>
