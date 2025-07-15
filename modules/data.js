// Data Management Module
// This module handles all data loading operations including lazy loading and chunking

import { 
  availableExams, 
  lazyLoadingConfig, 
  allQuestions, 
  currentQuestions,
  updateCurrentExam,
  updateAllQuestions,
  updateCurrentQuestions,
  updateLazyLoadingConfig
} from './state.js';

import { processEmbeddedImages } from './utils.js';

// Check if an exam has chunked version for lazy loading
async function checkForChunkedExam(examCode) {
  try {
    const response = await fetch(`data/${examCode}/metadata.json`);
    if (!response.ok) {
      console.log(`📋 No metadata.json found for ${examCode}, using standard loading`);
      lazyLoadingConfig.isChunkedExam = false;
      return false;
    }

    const metadata = await response.json();
    if (metadata.chunked && metadata.total_questions >= 100) {
      console.log(`🧩 Chunked exam detected: ${examCode} (${metadata.total_questions} questions, ${metadata.total_chunks} chunks)`);
      
      updateLazyLoadingConfig({
        isChunkedExam: true,
        totalChunks: metadata.total_chunks,
        examMetadata: metadata
      });
      
      return true;
    } else {
      console.log(`📄 Standard exam: ${examCode} (${metadata.total_questions || 'unknown'} questions)`);
      lazyLoadingConfig.isChunkedExam = false;
      return false;
    }
  } catch (error) {
    console.log(`📋 Metadata check failed for ${examCode}, using standard loading:`, error);
    lazyLoadingConfig.isChunkedExam = false;
    return false;
  }
}

// Load a specific chunk of questions
export async function loadChunk(examCode, chunkId) {
  if (lazyLoadingConfig.loadedChunks.has(chunkId)) {
    console.log(`📦 Chunk ${chunkId} already loaded from cache`);
    return lazyLoadingConfig.loadedChunks.get(chunkId);
  }

  try {
    console.log(`📥 Loading chunk ${chunkId} for ${examCode}...`);
    const response = await fetch(`data/${examCode}/chunks/chunk_${chunkId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load chunk ${chunkId}: ${response.status}`);
    }

    const chunkData = await response.json();
    const questions = chunkData.questions || [];
    
    lazyLoadingConfig.loadedChunks.set(chunkId, questions);
    console.log(`✅ Chunk ${chunkId} loaded: ${questions.length} questions (${chunkData.start_question}-${chunkData.end_question})`);
    return questions;
  } catch (error) {
    console.error(`❌ Error loading chunk ${chunkId}:`, error);
    return [];
  }
}

// Preload chunks around a center chunk for better performance
export async function preloadChunks(examCode, centerChunk) {
  const promises = [];
  const start = Math.max(0, centerChunk - lazyLoadingConfig.preloadBuffer);
  const end = Math.min(lazyLoadingConfig.totalChunks - 1, centerChunk + lazyLoadingConfig.preloadBuffer);

  console.log(`🔄 Preloading chunks ${start}-${end} around chunk ${centerChunk}`);

  for (let chunkId = start; chunkId <= end; chunkId++) {
    if (!lazyLoadingConfig.loadedChunks.has(chunkId)) {
      promises.push(loadChunk(examCode, chunkId));
    }
  }

  if (promises.length > 0) {
    // Use Promise.allSettled for better error handling and performance
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    if (failed > 0) {
      console.warn(`⚠️ Preloaded ${successful}/${promises.length} chunks (${failed} failed)`);
    } else {
      console.log(`✅ Preloaded ${successful} chunks`);
    }
  } else {
    console.log(`📦 All chunks ${start}-${end} already cached`);
  }
}

// Get chunk ID for a specific question index
export function getChunkIdForQuestion(questionIndex) {
  return Math.floor(questionIndex / lazyLoadingConfig.chunkSize);
}

// Ensure a specific question is loaded (triggers chunk loading if needed)
export async function ensureQuestionLoaded(examCode, questionIndex) {
  if (!lazyLoadingConfig.isChunkedExam) {
    return true;
  }

  const requiredChunk = getChunkIdForQuestion(questionIndex);
  
  if (!lazyLoadingConfig.loadedChunks.has(requiredChunk)) {
    console.log(`📥 Loading chunk ${requiredChunk} for question ${questionIndex + 1}...`);
    
    try {
      await loadChunk(examCode, requiredChunk);
      await preloadChunks(examCode, requiredChunk);
      
      // Update assembled questions immediately after loading
      updateAllQuestions(assembleCurrentQuestions());
      
      console.log(`✅ Chunk ${requiredChunk} loaded successfully`);
    } catch (error) {
      console.error(`❌ Failed to load chunk ${requiredChunk}:`, error);
      return false;
    }
  }

  return lazyLoadingConfig.loadedChunks.has(requiredChunk);
}

// Assemble current questions from loaded chunks
export function assembleCurrentQuestions() {
  if (!lazyLoadingConfig.isChunkedExam) {
    return allQuestions;
  }

  const assembledQuestions = [];
  let loadedChunks = 0;
  let placeholderChunks = 0;

  for (let chunkId = 0; chunkId < lazyLoadingConfig.totalChunks; chunkId++) {
    if (lazyLoadingConfig.loadedChunks.has(chunkId)) {
      assembledQuestions.push(...lazyLoadingConfig.loadedChunks.get(chunkId));
      loadedChunks++;
    } else {
      // Add lightweight placeholder questions for unloaded chunks
      const startIndex = chunkId * lazyLoadingConfig.chunkSize;
      const endIndex = Math.min(startIndex + lazyLoadingConfig.chunkSize, lazyLoadingConfig.examMetadata.total_questions);
      for (let i = startIndex; i < endIndex; i++) {
        assembledQuestions.push({
          question_number: (i + 1).toString(),
          question: `Question ${i + 1}`,
          answers: [],
          isPlaceholder: true,
          chunkId: chunkId
        });
      }
      placeholderChunks++;
    }
  }
  
  console.log(`🧩 Assembled ${assembledQuestions.length} questions: ${loadedChunks} chunks loaded, ${placeholderChunks} placeholders`);
  return assembledQuestions;
}

// Load exam data (main entry point for exam loading)
export async function loadExam(examCode) {
  if (!availableExams[examCode]) {
    throw new Error(
      `Exam code "${examCode}" not found. Available exams: ${Object.keys(
        availableExams
      ).join(", ")}`
    );
  }

  try {
    // Reset lazy loading state
    lazyLoadingConfig.loadedChunks.clear();
    lazyLoadingConfig.currentChunk = 0;
    lazyLoadingConfig.examMetadata = null;

    // Check if this exam has chunked version for lazy loading
    const isChunked = await checkForChunkedExam(examCode);

    if (isChunked) {
      // Load first chunk immediately for chunked exams
      const firstChunk = await loadChunk(examCode, 0);
      if (firstChunk.length === 0) {
        throw new Error("Failed to load first chunk of exam data");
      }

      // Set up exam data
      const examData = {
        exam_name: lazyLoadingConfig.examMetadata.exam_name || examCode,
        questions: [], // Will be assembled dynamically
        isChunked: true
      };
      updateCurrentExam(examData);

      // Preload nearby chunks
      await preloadChunks(examCode, 0);

      // Assemble current questions from loaded chunks
      const assembled = assembleCurrentQuestions();
      updateAllQuestions(assembled);
      updateCurrentQuestions([...assembled]);
    } else {
      // Standard loading for smaller exams
      const response = await fetch(`data/${examCode}/exam.json`);
      if (!response.ok) {
        throw new Error(`Failed to load exam data: ${response.status}`);
      }

      const data = await response.json();
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid exam data format");
      }

      // Process embedded images for all questions
      const processedQuestions = data.questions.map(question => ({
        ...question,
        question: processEmbeddedImages(question.question, question.images),
        answers: question.answers ? question.answers.map(answer => ({
          ...answer,
          text: processEmbeddedImages(answer.text, question.images)
        })) : [],
        comments: question.comments ? question.comments.map(comment => ({
          ...comment,
          text: processEmbeddedImages(comment.text, question.images)
        })) : []
      }));

      // Set up exam data
      const examData = {
        ...data,
        questions: processedQuestions,
        isChunked: false
      };
      updateCurrentExam(examData);

      // Update questions arrays
      updateAllQuestions(processedQuestions);
      updateCurrentQuestions([...processedQuestions]);
    }

    console.log(`📚 Loaded exam: ${examCode} (${currentQuestions.length} questions)`);
    return true;
  } catch (error) {
    console.error(`❌ Error loading exam ${examCode}:`, error);
    throw error;
  }
}

// Create chunks for exam data (used after scraping)
export async function createChunksForExamData(examCode, questions, chunkSize = 50) {
  if (!questions || questions.length < 100) {
    console.log(`📄 Skipping chunking for ${examCode}: only ${questions.length} questions`);
    return false;
  }

  try {
    console.log(`🧩 Creating chunks for ${examCode}: ${questions.length} questions, ${chunkSize} per chunk`);
    
    const totalChunks = Math.ceil(questions.length / chunkSize);
    const chunks = [];

    // Create chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, questions.length);
      const chunkQuestions = questions.slice(start, end);

      const chunkData = {
        chunk_id: i,
        start_question: start + 1,
        end_question: end,
        total_questions: chunkQuestions.length,
        questions: chunkQuestions
      };

      chunks.push(chunkData);
    }

    // Create metadata
    const metadata = {
      exam_code: examCode,
      exam_name: questions[0]?.exam_name || examCode,
      total_questions: questions.length,
      total_chunks: totalChunks,
      chunk_size: chunkSize,
      chunked: true,
      created_at: new Date().toISOString()
    };

    console.log(`✅ Created ${totalChunks} chunks for ${examCode}`);
    return { chunks, metadata };
  } catch (error) {
    console.error(`❌ Error creating chunks for ${examCode}:`, error);
    throw error;
  }
}

// Load available exams from manifest
export async function loadAvailableExams() {
  try {
    const response = await fetch('data/manifest.json');
    if (!response.ok) {
      throw new Error(`Failed to load exam manifest: ${response.status}`);
    }

    const data = await response.json();
    const exams = {};
    
    if (data.exams && Array.isArray(data.exams)) {
      data.exams.forEach(exam => {
        exams[exam.code] = exam;
      });
    }

    console.log(`📋 Loaded ${Object.keys(exams).length} available exams`);
    return exams;
  } catch (error) {
    console.error('❌ Error loading available exams:', error);
    return {};
  }
}

// Validate exam data structure
export function validateExamData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Data is not an object' };
  }

  if (!data.questions || !Array.isArray(data.questions)) {
    return { valid: false, error: 'Questions array is missing or invalid' };
  }

  if (data.questions.length === 0) {
    return { valid: false, error: 'No questions found' };
  }

  // Check question structure
  for (let i = 0; i < Math.min(5, data.questions.length); i++) {
    const question = data.questions[i];
    if (!question.question || !question.answers) {
      return { valid: false, error: `Question ${i + 1} is missing required fields` };
    }
  }

  return { valid: true };
}

// Get exam statistics
export function getExamStats(examCode) {
  if (!availableExams[examCode]) {
    return null;
  }

  const exam = availableExams[examCode];
  return {
    code: examCode,
    name: exam.name || examCode,
    questionCount: exam.question_count || 0,
    lastUpdated: exam.last_updated || null,
    isChunked: exam.chunked || false
  };
}