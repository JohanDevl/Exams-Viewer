'use client';

import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Eye, EyeOff, RotateCcw, ThumbsDown, Minus, ThumbsUp, ChevronDown, ChevronRight, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useExamStore } from '@/stores/examStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useToastWithSound } from '@/hooks/useToastWithSound';
import { useScrollLock } from '@/hooks/useScrollLock';
import { LinkifiedHtml, QuestionContent } from '@/utils/linkUtils';
import type { Question, DifficultyLevel } from '@/types';
import { cn } from '@/lib/utils';

interface QuestionDisplayProps {
  question: Question;
  questionIndex: number;
}

export function QuestionDisplay({ question, questionIndex }: QuestionDisplayProps) {
  const { 
    questionStates, 
    submitAnswer, 
    toggleFavorite, 
    setQuestionDifficulty,
    markQuestionAsPreview,
    resetQuestion,
    getQuestionStatus,
    goToNextQuestion,
    currentExam,
    examState,
    toggleQuestionForReview
  } = useExamStore();

  const { settings } = useSettingsStore();
  const { playSound } = useSoundEffects();
  const { addToast } = useToastWithSound();
  const { withScrollLock } = useScrollLock();

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(settings.showComments);
  const [isMobile, setIsMobile] = useState(false);
  
  // Ref to maintain scroll position on mobile
  const containerRef = useRef<HTMLDivElement>(null);
  
  // STABLE mobile detection - only once on mount to prevent withScrollLock issues
  useEffect(() => {
    const detectMobile = () => {
      // Use user agent as primary detection (more reliable than window.innerWidth)
      const isMobileDevice = /iPhone|iPad|iPod/.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    
    detectMobile();
    // NO resize listener to prevent iOS Safari issues
  }, []);
  

  const questionState = questionStates[questionIndex];
  const status = getQuestionStatus(questionIndex);
  const isFavorite = questionState?.isFavorite || false;
  const difficulty = questionState?.difficulty;
  
  // Exam mode specific state
  const isExamMode = examState.mode === 'exam';
  const isExamActive = isExamMode && examState.phase === 'active';
  const isMarkedForReview = examState.questionsMarkedForReview.has(questionIndex);
  const shouldHideFeedback = isExamActive && !examState.isSubmitted;
  
  // Debug log to check state (disabled)
  // console.log('Exam State Debug:', { mode: examState.mode, phase: examState.phase, isExamMode, isExamActive, isSubmitted: examState.isSubmitted, shouldHideFeedback });

  // Determine if this is a multiple choice question
  const isMultipleChoice = question.most_voted && question.most_voted.length > 1;

  // Initialize selected answers
  useEffect(() => {
    if (questionState?.userAnswer) {
      setSelectedAnswers(questionState.userAnswer.selectedAnswers);
      setIsSubmitted(true);
      if (settings.showExplanations) {
        setShowExplanation(true);
      }
    } else {
      setSelectedAnswers([]);
      setIsSubmitted(false);
      // Ne pas réinitialiser showExplanation si on est en mode preview
      if (questionState?.status !== 'preview') {
        setShowExplanation(false);
      }
    }
  }, [questionIndex, questionState, settings.showExplanations]);

  // Auto-activate View answer when showExplanations setting is enabled
  useEffect(() => {
    if (settings.showExplanations && !isSubmitted && status !== 'preview' && !questionState?.userAnswer) {
      markQuestionAsPreview(questionIndex);
      setShowExplanation(true);
      
      addToast({
        type: 'info',
        title: 'Answer revealed',
        description: 'Answers are automatically shown based on your settings.',
        duration: 2000
      });
    }
  }, [questionIndex, settings.showExplanations, isSubmitted, status, questionState, markQuestionAsPreview, addToast]);

  // Update comments expanded state when settings change
  useEffect(() => {
    setCommentsExpanded(settings.showComments);
  }, [settings.showComments]);

  // Auto-reveal answers for unanswered questions when exam is finished
  useEffect(() => {
    if (isExamMode && (examState.phase !== 'active' || examState.isSubmitted) && !questionState?.userAnswer) {
      // Exam is finished and this question was not answered - auto-reveal the answer
      markQuestionAsPreview(questionIndex);
      setShowExplanation(true);
    }
  }, [isExamMode, examState.phase, examState.isSubmitted, questionState?.userAnswer, questionIndex, markQuestionAsPreview]);

  const handleAnswerSelect = (answerLetter: string, event?: React.MouseEvent) => {
    if (isSubmitted) return;
    
    // Prevent default behavior and stop propagation to avoid scroll issues on mobile
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (isMultipleChoice) {
      setSelectedAnswers(prev => 
        prev.includes(answerLetter) 
          ? prev.filter(a => a !== answerLetter)
          : [...prev, answerLetter]
      );
    } else {
      setSelectedAnswers([answerLetter]);
    }
  };

  const checkAnswerCorrectness = (userAnswers: string[], question: Question): boolean => {
    const correctAnswers = question.correct_answers || (question.correct_answer ? [question.correct_answer] : []);
    if (correctAnswers.length === 0) return true; // No correct answer defined
    
    // Sort both arrays to compare them properly
    const sortedUserAnswers = [...userAnswers].sort();
    const sortedCorrectAnswers = [...correctAnswers].sort();
    
    return sortedUserAnswers.length === sortedCorrectAnswers.length &&
           sortedUserAnswers.every((answer, index) => answer === sortedCorrectAnswers[index]);
  };

  const handleSubmit = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (selectedAnswers.length === 0) {
      addToast({
        type: 'warning',
        title: 'Select an answer',
        description: 'Please select at least one answer before submitting.',
        duration: 3000
      });
      return;
    }

    const executeSubmit = () => {
      submitAnswer(questionIndex, selectedAnswers);
      setIsSubmitted(true);
      
      // Check if answer is correct and play appropriate sound
      const isCorrect = checkAnswerCorrectness(selectedAnswers, question);
      playSound(isCorrect ? 'correct' : 'incorrect');
      
      if (settings.showExplanations) {
        setShowExplanation(true);
      }

      addToast({
        type: isCorrect ? 'success' : 'info',
        title: isCorrect ? 'Correct answer!' : 'Answer saved',
        description: isCorrect 
          ? 'Well done! You got it right.' 
          : 'Your answer has been saved successfully.',
        duration: 2000
      });
    };

    if (isMobile) {
      executeSubmit();
    } else {
      withScrollLock(executeSubmit)();
    }

    // Auto progress: move to next question if enabled
    if (settings.autoProgress && currentExam && questionIndex < currentExam.questions.length - 1) {
      setTimeout(() => {
        goToNextQuestion();
      }, 1500); // Small delay to let user see the result
    }
  };

  const handlePreview = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const executePreview = () => {
      markQuestionAsPreview(questionIndex);
      setShowExplanation(true);
      
      addToast({
        type: 'info',
        title: 'Answer revealed',
        description: 'The correct answer is now visible.',
        duration: 2000
      });
    };

    if (isMobile) {
      executePreview();
    } else {
      withScrollLock(executePreview)();
    }
  };

  const handleHideAnswer = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const executeHideAnswer = () => {
      setShowExplanation(false);
      
      addToast({
        type: 'info',
        title: 'Answer hidden',
        description: 'You can now answer this question.',
        duration: 2000
      });
    };

    if (isMobile) {
      executeHideAnswer();
    } else {
      withScrollLock(executeHideAnswer)();
    }
  };

  const handleReset = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const executeReset = () => {
      resetQuestion(questionIndex);
      setSelectedAnswers([]);
      setIsSubmitted(false);
      setShowExplanation(false);
      
      addToast({
        type: 'info',
        title: 'Question reset',
        description: 'You can now answer this question again.',
        duration: 2000
      });
    };

    if (isMobile) {
      executeReset();
    } else {
      withScrollLock(executeReset)();
    }
  };

  const handleToggleFavorite = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    toggleFavorite(questionIndex);
    
    // Play favorite sound
    playSound('favorite');
    
    addToast({
      type: isFavorite ? 'info' : 'success',
      title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      description: isFavorite 
        ? 'This question has been removed from your favorites.'
        : 'This question has been added to your favorites.',
      duration: 2000
    });
  };

  const handleDifficultyChange = (newDifficulty: DifficultyLevel, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setQuestionDifficulty(questionIndex, newDifficulty);
    
    addToast({
      type: 'success',
      title: 'Difficulty updated',
      description: `Difficulty set to ${newDifficulty === 'easy' ? 'Easy' : newDifficulty === 'medium' ? 'Medium' : 'Hard'}.`,
      duration: 2000
    });
  };

  const handleToggleReviewFlag = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (!isExamMode) return; // Only available in exam mode
    
    toggleQuestionForReview(questionIndex);
    
    addToast({
      type: 'success',
      title: isMarkedForReview ? 'Removed from review' : 'Marked for review',
      description: isMarkedForReview 
        ? 'This question has been removed from review list.'
        : 'This question has been marked for review.',
      duration: 2000
    });
  };

  const toggleComments = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setCommentsExpanded(!commentsExpanded);
  };

  const getAnswerLetter = (index: number) => String.fromCharCode(65 + index); // A, B, C, D...

  const getDifficultyIcon = (level: DifficultyLevel, isSelected = false) => {
    switch (level) {
      case 'easy':
        return <ThumbsUp className={cn("h-3 w-3", isSelected ? "text-white" : "text-green-500")} />;
      case 'medium':
        return <Minus className={cn("h-3 w-3", isSelected ? "text-white" : "text-yellow-500")} />;
      case 'hard':
        return <ThumbsDown className={cn("h-3 w-3", isSelected ? "text-white" : "text-red-500")} />;
      default:
        return null;
    }
  };

  const isAnswerCorrect = (answerLetter: string) => {
    return question.most_voted?.includes(answerLetter) || false;
  };

  const getAnswerStyle = (answerLetter: string) => {
    const isSelected = selectedAnswers.includes(answerLetter);
    const isCorrect = isAnswerCorrect(answerLetter);
    
    // In exam mode, only show selection feedback, never correct/incorrect
    if (shouldHideFeedback) {
      return isSelected ? 'border-primary bg-primary/10' : '';
    }
    
    // Show answer feedback if explanation is shown OR if answer has been submitted (study mode or completed exam)
    if (showExplanation || isSubmitted) {
      if (isCorrect) {
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      } else if (isSelected && !isCorrect) {
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      }
      return '';
    }
    
    // Default selection styling when not submitted yet
    return isSelected ? 'border-primary bg-primary/10' : '';
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
  };

  const statusColors = {
    unanswered: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    answered: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    correct: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    incorrect: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    preview: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto space-y-3 sm:space-y-6">
      {/* Question header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Question number */}
              {question.question_number && (
                <div className="mb-4">
                  <span className="text-lg font-semibold text-muted-foreground">
                    Question {question.question_number}
                  </span>
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className={statusColors[shouldHideFeedback ? 'answered' : status]}>
                  {shouldHideFeedback ? 
                    (questionState?.userAnswer ? 'Answered' : 'Unanswered') :
                    (status === 'unanswered' ? 'Unanswered' :
                     status === 'answered' ? 'Answered' :
                     status === 'correct' ? 'Correct' :
                     status === 'incorrect' ? 'Incorrect' :
                     'Preview')
                  }
                </Badge>
                
                {difficulty && settings.showDifficulty && (
                  <Badge variant="secondary" className={cn(
                    "flex items-center gap-1",
                    difficultyColors[difficulty]
                  )}>
                    {getDifficultyIcon(difficulty, false)}
                    {difficulty === 'easy' ? 'Easy' : 
                     difficulty === 'medium' ? 'Medium' : 
                     'Hard'}
                  </Badge>
                )}

                {isMultipleChoice && (
                  <Badge variant="outline">
                    Multiple choice
                  </Badge>
                )}

                {isExamMode && isMarkedForReview && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
                    <Flag className="h-3 w-3 mr-1" />
                    Flagged for Review
                  </Badge>
                )}
              </div>

              <QuestionContent content={question.question} images={question.images} />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Mark for Review button - only in exam mode */}
              {isExamMode && (
                <Button
                  variant={isMarkedForReview ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => handleToggleReviewFlag(e)}
                  className={cn(
                    "h-9 w-9 p-0",
                    isMarkedForReview && "text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  )}
                  title={isMarkedForReview ? "Remove from review" : "Mark for review"}
                >
                  <Flag className={cn("h-4 w-4", isMarkedForReview && "fill-current")} />
                </Button>
              )}

              {/* Favorite button - always available */}
              <Button
                variant={isFavorite ? "default" : "outline"}
                size="sm"
                onClick={(e) => handleToggleFavorite(e)}
                className={cn(
                  "h-9 w-9 p-0",
                  isFavorite && "text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                )}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Answers */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 sm:space-y-3">
            {question.answers.map((answer, index) => {
              const answerLetter = getAnswerLetter(index);
              const isSelected = selectedAnswers.includes(answerLetter);
              
              return (
                <div
                  key={index}
                  className={cn(
                    "answer-option p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-200",
                    getAnswerStyle(answerLetter),
                    !isSubmitted && !showExplanation && "hover:border-primary/50 hover:bg-muted/50"
                  )}
                  onClick={(e) => handleAnswerSelect(answerLetter, e)}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    {isMultipleChoice ? (
                      <Checkbox
                        checked={isSelected}
                        disabled={isSubmitted || showExplanation}
                        className="mt-1"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="flex items-center mt-1" onClick={(e) => e.stopPropagation()}>
                        <div className={cn(
                          "w-4 h-4 border-2 rounded-full",
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                        )}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full m-auto" />}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <span className="flex-1">{answer}</span>
                        
                        {(showExplanation || isSubmitted) && isAnswerCorrect(answerLetter) && !shouldHideFeedback && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                            Correct
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Difficulty rating */}
              {settings.showDifficulty && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Difficulty:</span>
                  <div className="flex items-center gap-1">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <Button
                        key={level}
                        variant={difficulty === level ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => handleDifficultyChange(level, e)}
                        className={cn(
                          "h-7 px-2 text-xs",
                          difficulty === level && level === 'easy' && "bg-green-500 hover:bg-green-600 text-white border-green-500",
                          difficulty === level && level === 'medium' && "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500",
                          difficulty === level && level === 'hard' && "bg-red-500 hover:bg-red-600 text-white border-red-500"
                        )}
                        title={`Mark as ${level} difficulty`}
                      >
                        {getDifficultyIcon(level, difficulty === level)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {/* Exam mode: only show Submit button when not submitted */}
              {shouldHideFeedback && !isSubmitted && (
                <Button 
                  onClick={(e) => handleSubmit(e)}
                  disabled={selectedAnswers.length === 0}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  Submit Answer
                </Button>
              )}

              {/* Study mode: show all options */}
              {!shouldHideFeedback && !isSubmitted && status !== 'preview' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handlePreview(e)}
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">View answer</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                  
                  <Button 
                    onClick={(e) => handleSubmit(e)}
                    disabled={selectedAnswers.length === 0}
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    Submit
                  </Button>
                </>
              )}

              {!shouldHideFeedback && status === 'preview' && !isSubmitted && (
                <>
                  {showExplanation && !(isExamMode && examState.phase !== 'active' && !questionState?.userAnswer) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleHideAnswer(e)}
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Hide answer</span>
                      <span className="sm:hidden">Hide</span>
                    </Button>
                  ) : (
                    // Hide View Answer and Submit buttons for auto-revealed questions after exam completion
                    !(isExamMode && examState.phase !== 'active' && !questionState?.userAnswer) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handlePreview(e)}
                          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">View answer</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                        
                        <Button 
                          onClick={(e) => handleSubmit(e)}
                          disabled={selectedAnswers.length === 0}
                          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        >
                          Submit
                        </Button>
                      </>
                    )
                  )}
                </>
              )}
              
              {/* Change Answer button: available in study mode or during active exam (not after exam completion) */}
              {isSubmitted && (!isExamMode || (isExamMode && examState.phase === 'active')) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleReset(e)}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{shouldHideFeedback ? 'Change Answer' : 'Retry'}</span>
                  <span className="sm:hidden">{shouldHideFeedback ? 'Change' : 'Retry'}</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data accuracy disclaimer */}
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-2">
            <Flag className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-orange-800 dark:text-orange-200">
              <strong>Disclaimer:</strong> The displayed answers may contain errors. Please verify if something seems incorrect.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Explanation - invisible in active exam mode (maintains height) */}
      {question.explanation && (
        <Card className={cn(
          shouldHideFeedback && "invisible pointer-events-none",
          !showExplanation && !shouldHideFeedback && "invisible pointer-events-none"
        )}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">Explanation</span>
            </div>
          </CardHeader>
          <CardContent>
            <LinkifiedHtml 
              content={question.explanation}
              images={question.images}
              className="prose dark:prose-invert max-w-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Community comments - invisible in active exam mode (maintains height) */}
      {question.comments && question.comments.length > 0 && (
        <Card className={cn(shouldHideFeedback && "invisible pointer-events-none")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">Community comments</span>
                <Badge variant="secondary">{question.comments.length}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => toggleComments(e)}
                className="h-8 w-8 p-0"
              >
                {commentsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {commentsExpanded && (
            <CardContent>
              <div className="space-y-4">
                {question.comments.map((comment, index) => (
                  <div key={index} className="border-l-2 border-muted pl-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      {comment.selected_answer && (
                        <span>Selected answer: <strong>{comment.selected_answer}</strong></span>
                      )}
                    </div>
                    <LinkifiedHtml 
                      content={comment.content}
                      images={question.images}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}