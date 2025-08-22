# CLAUDE.md - Python Scripts for Data Management

This document provides context for Claude Code when working with Python scripts for exam data management in the Exams Viewer application.

## Overview

The `/scripts` directory contains Python tools for scraping, processing, and managing ServiceNow exam data. These scripts handle data collection from external sources, manifest generation, and batch processing operations.

## Script Architecture

```
scripts/
├── README.md                      # Script documentation and usage guide
├── servicenow_batch_scraper.py   # Main batch processing scraper (recommended)
├── scraper.py                     # Individual exam scraper
├── update_manifest.py             # Manifest generation and updating
├── generate-manifest.js           # JavaScript manifest generator (legacy)
└── progress_manager.py            # Progress tracking and ETA calculation utilities
```

## Core Scripts

### ServiceNow Batch Scraper (`servicenow_batch_scraper.py`)
**Primary tool**: Optimized batch processor for all ServiceNow exams with advanced progress tracking.

**Key Features:**
```python
# Multi-level progress tracking
- Main progress: Overall workflow completion
- Sub-progress: Individual phase tracking (links → questions → updates)
- ETA calculations: Based on observed delays and processing rates
- Update summaries: Detailed statistics after each exam

# Flexible execution modes
python3 scripts/servicenow_batch_scraper.py                    # Full batch processing
python3 scripts/servicenow_batch_scraper.py --links-only       # Collect links only
python3 scripts/servicenow_batch_scraper.py --questions-only   # Process questions only
python3 scripts/servicenow_batch_scraper.py --exam CIS-ITSM    # Single exam processing
```

**Progress System:**
- **Observed Delays**: 2-4s between pages, 5-10s between questions, 15s between exams
- **ETA Precision**: Real-time calculations based on actual processing rates
- **Visual Feedback**: Multi-level progress bars with time estimates
- **Update Statistics**: New/updated/skipped question counts per exam

**Output Format:**
```
🔍 Phase 1/3: Collecting exam links...
📊 Main Progress: ████████████████████████████████████████ 100%
⏱️ ETA: 2 minutes 34 seconds

📝 Phase 2/3: Processing questions...
📊 Sub Progress: ██████████████████████████████████████████ 85%
⏱️ Processing CIS-ITSM (Question 45/52)

📊 Update Summary:
   ✅ New questions added: 12
   🔄 Existing questions updated: 8
   ⏭️ Questions skipped (no changes): 32
✅ CIS-ITSM: 52 questions updated successfully
```

### Individual Scraper (`scraper.py`)
**Single exam processing**: Handles individual exam updates with smart change detection.

**Key Features:**
```python
# Smart update detection
- Compares existing questions with scraped data
- Only updates changed questions to preserve timestamps
- Handles new questions and removed questions
- Validates data integrity before saving

# Usage patterns
python3 scripts/scraper.py CIS-ITSM        # Update specific exam
python3 scripts/scraper.py --force CIS-SAM # Force complete refresh
```

**Data Processing:**
- **Change Detection**: MD5 hashing to identify modified questions
- **Data Validation**: Schema validation before file updates
- **Backup Creation**: Automatic backups before major changes
- **Error Recovery**: Graceful handling of network and parsing errors

### Manifest Management (`update_manifest.py`)
**Catalog generation**: Creates and maintains the central exam manifest with metadata.

**Key Features:**
```python
# Manifest generation
- Scans all exam directories for data files
- Generates metadata (question counts, categories, last updated)
- Creates optimized manifest.json for frontend consumption
- Validates data integrity across all exams

# Automatic triggers
- Runs after each scraper execution
- Updates timestamps and statistics
- Maintains backward compatibility
- Generates backup manifest files
```

**Manifest Structure:**
```json
{
  "exams": {
    "CIS-ITSM": {
      "name": "Certified Implementation Specialist - IT Service Management",
      "questionCount": 187,
      "lastUpdated": "2025-01-22T10:30:00Z",
      "categories": ["ITSM", "ServiceNow"],
      "difficulty": {
        "easy": 45,
        "medium": 98,
        "hard": 44
      }
    }
  },
  "lastGenerated": "2025-01-22T10:30:00Z",
  "totalExams": 23,
  "totalQuestions": 4521
}
```

### Progress Manager (`progress_manager.py`)
**Utility module**: Provides advanced progress tracking and ETA calculation capabilities.

**Key Features:**
```python
class ProgressManager:
    def __init__(self, total_items: int, description: str):
        self.total = total_items
        self.current = 0
        self.start_time = time.time()
        self.phase_times = []
    
    def update(self, increment: int = 1, status: str = None):
        # Update progress with ETA calculation
        
    def set_phase(self, phase_name: str, phase_total: int):
        # Multi-level progress tracking
        
    def get_eta(self) -> str:
        # Precise ETA based on observed processing rates
```

**ETA Calculation:**
- **Adaptive Learning**: Adjusts estimates based on actual processing times
- **Phase-aware**: Different rates for different processing phases
- **Network-aware**: Accounts for variable network delays
- **Confidence Intervals**: Provides realistic time ranges

## Data Management Patterns

### File Structure Management
Scripts maintain consistent data organization:

```python
# Standard directory structure
public/data/
├── manifest.json                    # Central catalog
├── {EXAM_CODE}/
│   ├── exam.json                   # Questions and answers
│   ├── links.json                  # External resources
│   └── chunks/                     # Large exam data chunking (if needed)
│       ├── questions_1-100.json
│       └── questions_101-200.json
```

### Data Validation and Integrity
Comprehensive validation throughout the pipeline:

```python
# Question validation schema
def validate_question(question_data):
    required_fields = ['id', 'text', 'options', 'correctAnswer']
    optional_fields = ['explanation', 'type', 'difficulty', 'category', 'links']
    
    # Validate structure
    for field in required_fields:
        if field not in question_data:
            raise ValidationError(f"Missing required field: {field}")
    
    # Validate data types
    if not isinstance(question_data['options'], list):
        raise ValidationError("Options must be a list")
    
    # Validate answer consistency
    if question_data['type'] == 'multiple':
        if not isinstance(question_data['correctAnswer'], list):
            raise ValidationError("Multiple choice questions need list of correct answers")
```

### Error Handling and Recovery
Robust error handling for network and data issues:

```python
# Network resilience patterns
def robust_request(url: str, max_retries: int = 3) -> requests.Response:
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return response
        except (requests.RequestException, requests.Timeout) as e:
            if attempt == max_retries - 1:
                raise ScrapingError(f"Failed to fetch {url} after {max_retries} attempts: {e}")
            time.sleep(2 ** attempt)  # Exponential backoff
    
# Data integrity checks
def verify_data_integrity(exam_data: dict) -> bool:
    # Check for duplicate question IDs
    question_ids = [q['id'] for q in exam_data['questions']]
    if len(question_ids) != len(set(question_ids)):
        return False
    
    # Validate all questions
    for question in exam_data['questions']:
        if not validate_question(question):
            return False
    
    return True
```

## Performance Optimizations

### Efficient Data Processing
Optimized processing patterns for large datasets:

```python
# Batch processing with memory management
def process_questions_batch(questions: List[dict], batch_size: int = 50):
    for i in range(0, len(questions), batch_size):
        batch = questions[i:i + batch_size]
        
        # Process batch
        processed_batch = [process_question(q) for q in batch]
        
        # Save incrementally to prevent memory issues
        save_batch_to_disk(processed_batch, i // batch_size)
        
        # Memory cleanup
        del processed_batch
        gc.collect()
```

### Network Optimization
Efficient network usage and rate limiting:

```python
# Smart rate limiting
class RateLimiter:
    def __init__(self, requests_per_minute: int = 30):
        self.requests_per_minute = requests_per_minute
        self.request_times = []
    
    def wait_if_needed(self):
        now = time.time()
        
        # Remove old requests (older than 1 minute)
        self.request_times = [t for t in self.request_times if now - t < 60]
        
        # Check if we need to wait
        if len(self.request_times) >= self.requests_per_minute:
            sleep_time = 60 - (now - self.request_times[0])
            if sleep_time > 0:
                time.sleep(sleep_time)
        
        self.request_times.append(now)
```

### Caching and Storage
Efficient data caching and storage strategies:

```python
# Intelligent caching system
class DataCache:
    def __init__(self, cache_dir: str = '.cache'):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
    
    def get_cached_data(self, key: str, max_age: int = 3600) -> Optional[dict]:
        cache_file = self.cache_dir / f"{key}.json"
        
        if cache_file.exists():
            file_age = time.time() - cache_file.stat().st_mtime
            if file_age < max_age:
                return json.loads(cache_file.read_text())
        
        return None
    
    def cache_data(self, key: str, data: dict):
        cache_file = self.cache_dir / f"{key}.json"
        cache_file.write_text(json.dumps(data, indent=2))
```

## Development Environment

### Requirements and Setup
Python environment configuration:

```python
# requirements.txt
requests>=2.28.0
beautifulsoup4>=4.11.0
tqdm>=4.64.0        # Progress bars
lxml>=4.9.0         # XML parsing
python-dateutil>=2.8.0
urllib3>=1.26.0

# Optional for enhanced features
selenium>=4.0.0     # For JavaScript-heavy sites
Pillow>=9.0.0       # Image processing
pandas>=1.5.0       # Data analysis
```

### Configuration Management
Environment and configuration handling:

```python
# config.py
import os
from pathlib import Path

class Config:
    # Paths
    DATA_DIR = Path("public/data")
    SCRIPTS_DIR = Path("scripts")
    CACHE_DIR = Path(".cache")
    
    # Scraping settings
    REQUESTS_PER_MINUTE = int(os.getenv("REQUESTS_PER_MINUTE", "30"))
    REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "30"))
    MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))
    
    # Processing settings
    BATCH_SIZE = int(os.getenv("BATCH_SIZE", "50"))
    ENABLE_CACHING = os.getenv("ENABLE_CACHING", "true").lower() == "true"
    
    # Output settings
    ENABLE_PROGRESS_BARS = True
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
```

## Development Guidelines

### Adding New Scrapers
1. Follow the pattern established in `servicenow_batch_scraper.py`
2. Implement proper progress tracking with `ProgressManager`
3. Add comprehensive error handling and recovery
4. Include data validation and integrity checks
5. Update manifest after successful scraping
6. Add appropriate rate limiting and network resilience

### Modifying Existing Scripts
1. Understand current data format and validation rules
2. Maintain backward compatibility with existing data
3. Test thoroughly with actual ServiceNow data
4. Update progress tracking and ETA calculations
5. Verify manifest generation still works correctly
6. Test error recovery and network failure scenarios

### Performance Testing
1. Profile memory usage with large datasets
2. Test network resilience with poor connections
3. Verify ETA accuracy across different processing phases
4. Test batch processing with various exam sizes
5. Validate caching effectiveness and cache invalidation

### Data Quality Assurance
1. Verify question data integrity after scraping
2. Check for duplicate questions or IDs
3. Validate answer formats and consistency
4. Test manifest generation with updated data
5. Ensure proper encoding for special characters
6. Verify links and external resources are valid

Last updated: January 2025 - Enhanced with advanced batch processing, progress tracking, and performance optimizations