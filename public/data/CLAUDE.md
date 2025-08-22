# CLAUDE.md - Exam Data Structure and Management

This document provides context for Claude Code when working with exam data files in the Exams Viewer application.

## Overview

The `/public/data` directory contains all ServiceNow certification exam data in a structured JSON format. This data is consumed directly by the Next.js application for client-side processing and provides the foundation for the exam preparation system.

## Directory Structure

```
public/data/
├── manifest.json              # Central exam catalog and metadata
├── manifest.json.backup       # Backup of previous manifest
├── {EXAM_CODE}/               # Individual exam directories
│   ├── exam.json             # Questions, answers, and metadata
│   ├── links.json            # External resources and references
│   └── chunks/               # Large exam data splitting (optional)
│       ├── questions_1-100.json
│       └── questions_101-200.json
```

## Core Data Files

### Manifest File (`manifest.json`)
**Central catalog**: Contains metadata for all available exams and serves as the application's exam index.

**Structure:**
```json
{
  "exams": {
    "CIS-ITSM": {
      "name": "Certified Implementation Specialist - IT Service Management",
      "description": "ServiceNow IT Service Management implementation certification",
      "questionCount": 187,
      "lastUpdated": "2025-01-22T10:30:00Z",
      "categories": ["ITSM", "ServiceNow", "Implementation"],
      "difficulty": {
        "easy": 45,
        "medium": 98,
        "hard": 44
      },
      "version": "2024.1",
      "passingScore": 70,
      "timeLimit": 90,
      "hasChunks": false
    }
  },
  "metadata": {
    "lastGenerated": "2025-01-22T10:30:00Z",
    "totalExams": 23,
    "totalQuestions": 4521,
    "version": "1.0.0",
    "generatedBy": "servicenow_batch_scraper",
    "dataIntegrityChecked": true
  }
}
```

**Key Features:**
- **Performance Optimization**: Reduces HTTP requests by ~90% compared to individual file fetching
- **Metadata Aggregation**: Provides summary statistics without loading full exam data
- **Version Control**: Tracks data versions and update timestamps
- **Category Management**: Enables filtering and organization by topic areas

### Exam Data File (`exam.json`)
**Question repository**: Contains all questions, answers, explanations, and associated metadata for a specific exam.

**Structure:**
```json
{
  "metadata": {
    "examCode": "CIS-ITSM",
    "name": "Certified Implementation Specialist - IT Service Management",
    "lastUpdated": "2025-01-22T10:30:00Z",
    "questionCount": 187,
    "version": "2024.1",
    "dataSource": "ServiceNow Learning Center",
    "scrapedBy": "servicenow_batch_scraper v2.0"
  },
  "questions": [
    {
      "id": "cis-itsm-001",
      "text": "What is the primary purpose of the ServiceNow IT Service Management module?",
      "options": [
        "To manage hardware inventory",
        "To provide a comprehensive ITSM solution",
        "To handle financial planning",
        "To manage employee records"
      ],
      "correctAnswer": 1,
      "type": "single",
      "explanation": "ServiceNow ITSM provides a comprehensive IT Service Management solution...",
      "difficulty": "medium",
      "category": "ITSM Fundamentals",
      "links": [
        {
          "title": "ITSM Documentation",
          "url": "https://docs.servicenow.com/bundle/utah-it-service-management/page/product/it-service-management/concept/c_ITServiceManagement.html",
          "type": "documentation"
        }
      ],
      "tags": ["itsm", "fundamentals", "service-management"],
      "lastUpdated": "2025-01-22T09:15:00Z"
    }
  ]
}
```

**Question Properties:**
- **id**: Unique identifier (format: `{exam-code}-{sequential-number}`)
- **text**: Question content with proper HTML encoding
- **options**: Array of answer choices (2-6 options typically)
- **correctAnswer**: Index (single) or array of indices (multiple choice)
- **type**: `"single"` or `"multiple"` for answer selection method
- **explanation**: Detailed explanation of correct answer (optional)
- **difficulty**: `"easy"`, `"medium"`, or `"hard"` classification
- **category**: Topic categorization for filtering and organization
- **links**: External resources and documentation references
- **tags**: Searchable keywords and topic labels
- **lastUpdated**: Timestamp of last content modification

### Links File (`links.json`)
**Resource repository**: External references, documentation links, and additional learning resources for the exam.

**Structure:**
```json
{
  "metadata": {
    "examCode": "CIS-ITSM",
    "lastUpdated": "2025-01-22T10:30:00Z",
    "linkCount": 45,
    "categories": ["documentation", "training", "community", "tools"]
  },
  "links": [
    {
      "id": "link-001",
      "title": "ServiceNow ITSM Implementation Guide",
      "url": "https://docs.servicenow.com/bundle/utah-it-service-management/page/product/it-service-management/concept/itsm-implementation.html",
      "type": "documentation",
      "category": "Implementation",
      "description": "Comprehensive guide for implementing ITSM in ServiceNow",
      "lastChecked": "2025-01-22T10:30:00Z",
      "isActive": true,
      "difficulty": "intermediate",
      "estimatedReadTime": 15
    }
  ],
  "categories": {
    "documentation": {
      "name": "Official Documentation",
      "count": 18,
      "description": "ServiceNow official documentation and guides"
    },
    "training": {
      "name": "Training Resources",
      "count": 12,
      "description": "Learning paths and training materials"
    },
    "community": {
      "name": "Community Resources",
      "count": 8,
      "description": "Community forums and user-generated content"
    },
    "tools": {
      "name": "Development Tools",
      "count": 7,
      "description": "Tools and utilities for ServiceNow development"
    }
  }
}
```

## Data Management Patterns

### File Organization Standards
Consistent naming and organization patterns:

```
# Exam code format: {PRODUCT}-{SPECIALIZATION}
Examples:
- CIS-ITSM    (Certified Implementation Specialist - IT Service Management)
- CIS-CSM     (Certified Implementation Specialist - Customer Service Management)  
- CAD         (Certified Application Developer)
- CSA         (Certified System Administrator)

# File naming conventions
exam.json     # Always lowercase, standard name
links.json    # Always lowercase, standard name
chunks/       # Directory for large data sets only

# ID formats
Question IDs: {exam-code-lower}-{sequential-number-padded}
Example: cis-itsm-001, cis-itsm-002, etc.

Link IDs: link-{sequential-number-padded}
Example: link-001, link-002, etc.
```

### Data Validation Schema
JSON schema validation for data integrity:

```json
{
  "questionSchema": {
    "type": "object",
    "required": ["id", "text", "options", "correctAnswer", "type"],
    "properties": {
      "id": {
        "type": "string",
        "pattern": "^[a-z0-9-]+$"
      },
      "text": {
        "type": "string",
        "minLength": 10
      },
      "options": {
        "type": "array",
        "minItems": 2,
        "maxItems": 6,
        "items": {
          "type": "string",
          "minLength": 1
        }
      },
      "correctAnswer": {
        "oneOf": [
          {"type": "number", "minimum": 0},
          {
            "type": "array",
            "items": {"type": "number", "minimum": 0}
          }
        ]
      },
      "type": {
        "type": "string",
        "enum": ["single", "multiple"]
      },
      "difficulty": {
        "type": "string",
        "enum": ["easy", "medium", "hard"]
      }
    }
  }
}
```

### Update and Versioning Strategy
Data versioning and update tracking:

```json
{
  "versioningStrategy": {
    "semanticVersioning": "major.minor.patch",
    "updateTypes": {
      "major": "Breaking changes to data structure",
      "minor": "New questions or exams added", 
      "patch": "Question corrections or metadata updates"
    },
    "timestampFormat": "ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)",
    "backupStrategy": {
      "automatic": "Before each batch update",
      "retention": "Keep last 5 versions",
      "location": "manifest.json.backup, {exam}.json.backup"
    }
  }
}
```

## Performance Optimizations

### Data Loading Strategies
Efficient data loading and caching patterns:

```javascript
// Manifest-first loading pattern
1. Load manifest.json (small, fast)
2. Display exam list immediately
3. Load exam.json only when selected
4. Cache loaded exams in memory/localStorage
5. Preload popular exams in background

// Chunk loading for large exams
if (examInfo.hasChunks) {
  // Load chunks on demand
  const chunk = await fetch(`/data/${examCode}/chunks/questions_${start}-${end}.json`);
} else {
  // Standard single file loading
  const exam = await fetch(`/data/${examCode}/exam.json`);
}
```

### File Size Management
Optimization strategies for large datasets:

```json
{
  "fileSizeManagement": {
    "chunkingThreshold": "500 questions or 2MB file size",
    "chunkSize": "100 questions per chunk",
    "compressionStrategy": "Browser gzip compression",
    "cacheHeaders": {
      "cache-control": "public, max-age=3600",
      "etag": "Generated based on file content hash"
    },
    "loadingStrategy": "Progressive loading with pagination support"
  }
}
```

### Static Asset Optimization
CDN and caching configuration:

```json
{
  "staticOptimization": {
    "cacheStrategy": {
      "manifest.json": "Cache for 1 hour, validate with etag",
      "exam.json": "Cache for 24 hours, immutable until version change",
      "links.json": "Cache for 6 hours, validate with etag"
    },
    "compressionLevels": {
      "manifest.json": "High compression (small, frequently accessed)",
      "exam.json": "Medium compression (balance size/speed)",
      "chunks/": "High compression (large files, less frequent access)"
    }
  }
}
```

## Data Quality Assurance

### Integrity Checks
Automated validation and integrity verification:

```javascript
// Data integrity validation
const validateExamData = (examData) => {
  // Check required fields
  if (!examData.metadata || !examData.questions) {
    throw new Error('Missing required exam data structure');
  }
  
  // Validate question consistency
  examData.questions.forEach((question, index) => {
    // Check question structure
    validateQuestionStructure(question);
    
    // Validate answer indices
    validateAnswerIndices(question);
    
    // Check for duplicate IDs
    checkDuplicateIds(examData.questions);
  });
  
  // Validate metadata consistency
  const actualCount = examData.questions.length;
  const declaredCount = examData.metadata.questionCount;
  if (actualCount !== declaredCount) {
    throw new Error(`Question count mismatch: ${actualCount} vs ${declaredCount}`);
  }
};
```

### Content Validation
Question content and format validation:

```javascript
// Content validation rules
const contentValidation = {
  questionText: {
    minLength: 10,
    maxLength: 1000,
    forbiddenPatterns: [/^\s*$/, /<script/i, /javascript:/i],
    encoding: 'UTF-8'
  },
  options: {
    minCount: 2,
    maxCount: 6,
    minLength: 1,
    maxLength: 200,
    duplicateCheck: true
  },
  explanation: {
    maxLength: 2000,
    optional: true,
    htmlAllowed: ['em', 'strong', 'code', 'pre', 'a']
  },
  links: {
    urlValidation: true,
    httpsPreferred: true,
    reachabilityCheck: false // Too slow for batch processing
  }
};
```

## Development Integration

### Frontend Data Consumption
How the Next.js application consumes exam data:

```typescript
// Data loading patterns in the application
interface DataLoadingStrategy {
  manifestFirst: boolean;          // Load manifest before exam selection
  lazyLoading: boolean;           // Load exam data on selection
  caching: 'memory' | 'localStorage' | 'both';
  preloading: string[];           // Exam codes to preload
  chunkSupport: boolean;          // Handle chunked exam files
  errorRetry: number;             // Retry attempts for failed loads
}

// Example usage in exam store
const loadExam = async (examCode: string) => {
  // Check cache first
  const cached = getFromCache(examCode);
  if (cached && !isStale(cached)) {
    return cached;
  }
  
  // Load from server
  const response = await fetch(`/data/${examCode}/exam.json`);
  const examData = await response.json();
  
  // Validate and cache
  validateExamData(examData);
  saveToCache(examCode, examData);
  
  return examData;
};
```

### Data Export Integration
Integration with export functionality:

```typescript
// Export data preparation
const prepareExportData = (examCode: string, options: ExportOptions) => {
  const examData = getExamData(examCode);
  const links = getLinksData(examCode);
  
  // Filter questions based on export options
  const filteredQuestions = examData.questions.filter(question => {
    return matchesFilters(question, options.filterBy);
  });
  
  // Prepare export format
  return {
    metadata: examData.metadata,
    questions: filteredQuestions.map(question => ({
      ...question,
      // Include/exclude based on options
      explanation: options.includeExplanations ? question.explanation : undefined,
      links: options.includeAnswers ? question.links : undefined
    })),
    links: options.includeStatistics ? links.links : undefined
  };
};
```

## Development Guidelines

### Adding New Exam Data
1. Create directory following naming convention (`{EXAM_CODE}/`)
2. Generate exam.json with proper question structure
3. Create links.json with relevant resources
4. Update manifest.json with new exam metadata
5. Validate data integrity with schema checks
6. Test loading in development environment

### Modifying Existing Data
1. Create backup of existing files before changes
2. Maintain ID consistency for existing questions
3. Update timestamps and version numbers appropriately
4. Validate changes don't break application functionality
5. Test export functionality with modified data
6. Update manifest if question counts change

### Data Migration and Upgrades
1. Plan migration strategy for breaking changes
2. Implement backward compatibility where possible
3. Document migration steps and data transformations
4. Test migration with full dataset before deployment
5. Prepare rollback strategy in case of issues
6. Update application code to handle new data formats

### Performance Testing
1. Test loading times with various exam sizes
2. Verify chunking works correctly for large exams
3. Test caching behavior across browser sessions
4. Profile memory usage with multiple loaded exams
5. Validate export performance with large datasets

Last updated: January 2025 - Enhanced data structure with performance optimizations and comprehensive validation