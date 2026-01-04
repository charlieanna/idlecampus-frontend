// UPSC API Service
// Handles all API calls to the UPSC backend

const API_BASE_URL = `${window.location.origin.replace(':5000', ':3001')}/api/v1/upsc`;

// ============================================
// TYPES
// ============================================

export interface Subject {
  id: number;
  name: string;
  code: string;
  exam_type: 'prelims' | 'mains' | 'both';
  paper_number?: number;
  total_marks?: number;
  duration_minutes?: number;
  description?: string;
  is_optional: boolean;
  is_active: boolean;
  total_topics_count?: number;
  high_yield_topics_count?: number;
  topics?: Topic[];
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  description?: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  estimated_hours?: number;
  is_high_yield: boolean;
  pyq_frequency?: number;
  full_path?: string;
  parent_topic_id?: number;
  child_topics?: Topic[];
}

export interface Question {
  id: number;
  question_text: string;
  question_type: 'mcq' | 'msq' | 'tf' | 'assertion_reason';
  options: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  pyq_year?: number;
  pyq_paper?: string;
  marks?: number;
  negative_marks?: number;
  topic?: Topic;
}

export interface Test {
  id: number;
  title: string;
  test_type: 'full_test' | 'sectional' | 'topic_wise' | 'pyq';
  scheduled_at?: string;
  duration_minutes: number;
  total_marks: number;
  negative_marking_enabled: boolean;
  is_ongoing?: boolean;
  is_upcoming?: boolean;
  questions_count?: number;
  total_attempts_count?: number;
  average_score?: number;
}

export interface TestAttempt {
  id: number;
  test_id: number;
  started_at: string;
  submitted_at?: string;
  score?: number;
  percentage?: number;
  percentile?: number;
  status: 'in_progress' | 'submitted';
  answers: Record<string, string>;
  test?: Test;
}

export interface WritingQuestion {
  id: number;
  question_text: string;
  question_type: 'essay' | 'answer' | 'precis';
  word_limit?: number;
  time_limit_minutes?: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  is_pyq: boolean;
  pyq_year?: number;
}

export interface UserAnswer {
  id: number;
  writing_question_id: number;
  answer_text: string;
  word_count: number;
  time_taken_minutes?: number;
  score?: number;
  status: 'submitted' | 'evaluated';
  ai_evaluation?: any;
  writing_question?: WritingQuestion;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content?: string;
  published_date: string;
  category: string;
  importance: 'low' | 'medium' | 'high';
  tags: string[];
  key_points: string[];
}

export interface StudyPlan {
  id: number;
  name: string;
  target_exam_date: string;
  total_study_hours_per_day: number;
  is_active: boolean;
  phases: StudyPhase[];
  total_weeks?: number;
  completion_percentage?: number;
}

export interface StudyPhase {
  phase_name: string;
  start_date: string;
  end_date: string;
  focus_areas: string[];
  subject_ids: number[];
}

export interface DailyTask {
  id: number;
  task_type: 'reading' | 'practice' | 'revision' | 'test' | 'writing';
  title: string;
  description?: string;
  scheduled_for: string;
  estimated_duration_minutes?: number;
  actual_duration_minutes?: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  topic?: Topic;
}

export interface Revision {
  id: number;
  topic_id: number;
  scheduled_for: string;
  interval_index: number;
  status: 'pending' | 'completed';
  performance_rating?: number;
  completed_at?: string;
  topic?: Topic;
}

export interface DashboardData {
  overview: {
    student_profile?: any;
    active_study_plan?: any;
    days_to_exam?: number;
  };
  today: {
    tasks: {
      total: number;
      completed: number;
      pending: number;
      list: DailyTask[];
    };
    revisions: {
      total: number;
      completed: number;
      pending: number;
      list: Revision[];
    };
  };
  progress: {
    overall: {
      total_topics: number;
      completed_topics: number;
      completion_percentage: number;
    };
    by_subject: any[];
  };
  recent_activity: {
    recent_tests: TestAttempt[];
    recent_answers: UserAnswer[];
  };
}

// ============================================
// API RESPONSE WRAPPER
// ============================================

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============================================
// HTTP HELPER
// ============================================

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============================================
// API SERVICE
// ============================================

export const upscApi = {
  // ==================== DASHBOARD ====================
  getDashboard: (): Promise<DashboardData> =>
    fetchApi('/dashboard'),

  // ==================== SUBJECTS ====================
  getSubjects: (params?: { exam_type?: string; optional?: boolean }): Promise<{ subjects: Subject[] }> => {
    const query = new URLSearchParams();
    if (params?.exam_type) query.append('exam_type', params.exam_type);
    if (params?.optional !== undefined) query.append('optional', params.optional.toString());
    return fetchApi(`/subjects?${query}`);
  },

  getSubject: (id: number): Promise<{ subject: Subject }> =>
    fetchApi(`/subjects/${id}`),

  getPrelimsSubjects: (): Promise<{ subjects: Subject[] }> =>
    fetchApi('/subjects/prelims'),

  getMainsSubjects: (): Promise<{ subjects: Subject[] }> =>
    fetchApi('/subjects/mains'),

  getOptionalSubjects: (): Promise<{ subjects: Subject[] }> =>
    fetchApi('/subjects/optional'),

  // ==================== TOPICS ====================
  getTopics: (params?: {
    subject_id?: number;
    difficulty?: string;
    root_only?: boolean;
    high_yield?: boolean;
  }): Promise<{ topics: Topic[] }> => {
    const query = new URLSearchParams();
    if (params?.subject_id) query.append('subject_id', params.subject_id.toString());
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.root_only) query.append('root_only', 'true');
    if (params?.high_yield) query.append('high_yield', 'true');
    return fetchApi(`/topics?${query}`);
  },

  getTopic: (id: number): Promise<{ topic: Topic; user_progress?: any }> =>
    fetchApi(`/topics/${id}`),

  getHighYieldTopics: (): Promise<{ topics: Topic[] }> =>
    fetchApi('/topics/high_yield'),

  startLearning: (topicId: number): Promise<{ topic: Topic; progress: any }> =>
    fetchApi(`/topics/${topicId}/start_learning`, { method: 'POST' }),

  markTopicComplete: (topicId: number): Promise<{ topic: Topic; progress: any }> =>
    fetchApi(`/topics/${topicId}/complete`, { method: 'POST' }),

  // ==================== QUESTIONS ====================
  getQuestions: (params?: {
    topic_id?: number;
    subject_id?: number;
    difficulty?: string;
    question_type?: string;
    pyq_only?: boolean;
    year?: number;
    page?: number;
    per_page?: number;
  }): Promise<{ questions: Question[]; meta?: any }> => {
    const query = new URLSearchParams();
    if (params?.topic_id) query.append('topic_id', params.topic_id.toString());
    if (params?.subject_id) query.append('subject_id', params.subject_id.toString());
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.question_type) query.append('question_type', params.question_type);
    if (params?.pyq_only) query.append('pyq_only', 'true');
    if (params?.year) query.append('year', params.year.toString());
    if (params?.page) query.append('page', params.page.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    return fetchApi(`/questions?${query}`);
  },

  getRandomQuestions: (params?: {
    topic_id?: number;
    difficulty?: string;
    count?: number;
  }): Promise<{ questions: Question[] }> => {
    const query = new URLSearchParams();
    if (params?.topic_id) query.append('topic_id', params.topic_id.toString());
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.count) query.append('count', params.count.toString());
    return fetchApi(`/questions/random?${query}`);
  },

  verifyAnswer: (questionId: number, answer: string, timeSpent?: number): Promise<{
    is_correct: boolean;
    correct_answer: string;
    explanation: string;
    statistics: any;
  }> =>
    fetchApi(`/questions/${questionId}/verify_answer`, {
      method: 'POST',
      body: JSON.stringify({ answer, time_spent: timeSpent }),
    }),

  // ==================== TESTS ====================
  getTests: (params?: { test_type?: string; status?: string; subject_id?: number }): Promise<{ tests: Test[] }> => {
    const query = new URLSearchParams();
    if (params?.test_type) query.append('test_type', params.test_type);
    if (params?.status) query.append('status', params.status);
    if (params?.subject_id) query.append('subject_id', params.subject_id.toString());
    return fetchApi(`/tests?${query}`);
  },

  getTest: (id: number): Promise<{ test: Test; user_attempts: number; can_attempt: boolean }> =>
    fetchApi(`/tests/${id}`),

  startTest: (testId: number): Promise<{ attempt_id: number; test: Test; questions: Question[] }> =>
    fetchApi(`/tests/${testId}/start`, { method: 'POST' }),

  submitAnswer: (attemptId: number, questionId: number, answer: string, timeSpent?: number): Promise<{ attempt: TestAttempt }> =>
    fetchApi(`/tests/attempts/${attemptId}/submit_answer`, {
      method: 'POST',
      body: JSON.stringify({ question_id: questionId, answer, time_spent: timeSpent }),
    }),

  submitTest: (attemptId: number): Promise<{ attempt: TestAttempt; message: string }> =>
    fetchApi(`/tests/attempts/${attemptId}/submit`, { method: 'POST' }),

  getTestResults: (attemptId: number): Promise<{ attempt: TestAttempt; questions: any[]; analysis: any }> =>
    fetchApi(`/tests/attempts/${attemptId}/results`),

  getMyAttempts: (): Promise<{ attempts: TestAttempt[] }> =>
    fetchApi('/tests/my_attempts'),

  // ==================== WRITING QUESTIONS ====================
  getWritingQuestions: (params?: {
    question_type?: string;
    topic_id?: number;
    difficulty?: string;
    daily?: boolean;
  }): Promise<{ writing_questions: WritingQuestion[] }> => {
    const query = new URLSearchParams();
    if (params?.question_type) query.append('question_type', params.question_type);
    if (params?.topic_id) query.append('topic_id', params.topic_id.toString());
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.daily) query.append('daily', 'true');
    return fetchApi(`/writing_questions?${query}`);
  },

  getDailyWritingQuestion: (): Promise<{ writing_question: WritingQuestion }> =>
    fetchApi('/writing_questions/daily'),

  // ==================== USER ANSWERS ====================
  getUserAnswers: (params?: { status?: string; question_id?: number }): Promise<{ user_answers: UserAnswer[] }> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.question_id) query.append('question_id', params.question_id.toString());
    return fetchApi(`/user_answers?${query}`);
  },

  submitUserAnswer: (
    questionId: number,
    answerText: string,
    wordCount: number,
    timeTaken?: number,
    autoEvaluate?: boolean
  ): Promise<{ user_answer: UserAnswer }> => {
    const query = autoEvaluate ? '?auto_evaluate=true' : '';
    return fetchApi(`/user_answers${query}`, {
      method: 'POST',
      body: JSON.stringify({
        upsc_writing_question_id: questionId,
        answer_text: answerText,
        word_count: wordCount,
        time_taken_minutes: timeTaken,
      }),
    });
  },

  requestEvaluation: (answerId: number): Promise<{ user_answer: UserAnswer }> =>
    fetchApi(`/user_answers/${answerId}/request_evaluation`, { method: 'POST' }),

  getAnswerStatistics: (): Promise<{ statistics: any }> =>
    fetchApi('/user_answers/statistics'),

  // ==================== NEWS ARTICLES ====================
  getNewsArticles: (params?: {
    topic_id?: number;
    category?: string;
    importance?: string;
    from_date?: string;
    to_date?: string;
    tags?: string[];
  }): Promise<{ news_articles: NewsArticle[] }> => {
    const query = new URLSearchParams();
    if (params?.topic_id) query.append('topic_id', params.topic_id.toString());
    if (params?.category) query.append('category', params.category);
    if (params?.importance) query.append('importance', params.importance);
    if (params?.from_date) query.append('from_date', params.from_date);
    if (params?.to_date) query.append('to_date', params.to_date);
    if (params?.tags) query.append('tags', params.tags.join(','));
    return fetchApi(`/news_articles?${query}`);
  },

  getTodayNews: (): Promise<{ news_articles: NewsArticle[] }> =>
    fetchApi('/news_articles/today'),

  getThisWeekNews: (): Promise<{ news_articles: NewsArticle[] }> =>
    fetchApi('/news_articles/this_week'),

  getImportantNews: (): Promise<{ news_articles: NewsArticle[] }> =>
    fetchApi('/news_articles/important'),

  // ==================== STUDY PLANS ====================
  getStudyPlans: (): Promise<{ study_plans: StudyPlan[] }> =>
    fetchApi('/study_plans'),

  getActiveStudyPlan: (): Promise<{ study_plan: StudyPlan }> =>
    fetchApi('/study_plans/active'),

  generateStudyPlan: (targetDate: string, attemptNumber: number, subjects?: number[]): Promise<{ study_plan: StudyPlan }> => {
    const query = new URLSearchParams();
    query.append('target_date', targetDate);
    query.append('attempt_number', attemptNumber.toString());
    if (subjects) subjects.forEach(id => query.append('subjects[]', id.toString()));
    return fetchApi(`/study_plans/generate?${query}`, { method: 'POST' });
  },

  activateStudyPlan: (planId: number): Promise<{ study_plan: StudyPlan }> =>
    fetchApi(`/study_plans/${planId}/activate`, { method: 'POST' }),

  // ==================== DAILY TASKS ====================
  getDailyTasks: (params?: {
    date?: string;
    today?: boolean;
    overdue?: boolean;
    status?: string;
    priority?: string;
    task_type?: string;
  }): Promise<{ daily_tasks: DailyTask[] }> => {
    const query = new URLSearchParams();
    if (params?.date) query.append('date', params.date);
    if (params?.today) query.append('today', 'true');
    if (params?.overdue) query.append('overdue', 'true');
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.task_type) query.append('task_type', params.task_type);
    return fetchApi(`/daily_tasks?${query}`);
  },

  getTodayTasks: (): Promise<{ daily_tasks: DailyTask[]; statistics: any }> =>
    fetchApi('/daily_tasks/today'),

  getWeekTasks: (): Promise<{ tasks_by_date: Record<string, DailyTask[]> }> =>
    fetchApi('/daily_tasks/week'),

  completeTask: (taskId: number): Promise<{ daily_task: DailyTask }> =>
    fetchApi(`/daily_tasks/${taskId}/complete`, { method: 'POST' }),

  getTaskStatistics: (): Promise<{ statistics: any }> =>
    fetchApi('/daily_tasks/statistics'),

  // ==================== REVISIONS ====================
  getRevisions: (params?: {
    status?: string;
    topic_id?: number;
    today?: boolean;
    overdue?: boolean;
  }): Promise<{ revisions: Revision[] }> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.topic_id) query.append('topic_id', params.topic_id.toString());
    if (params?.today) query.append('today', 'true');
    if (params?.overdue) query.append('overdue', 'true');
    return fetchApi(`/revisions?${query}`);
  },

  getTodayRevisions: (): Promise<{ revisions: Revision[]; statistics: any }> =>
    fetchApi('/revisions/today'),

  getUpcomingRevisions: (): Promise<{ revisions_by_date: Record<string, Revision[]> }> =>
    fetchApi('/revisions/upcoming'),

  completeRevision: (revisionId: number, performanceRating: number, notes?: string): Promise<{ revision: Revision; next_revision: Revision }> => {
    const query = new URLSearchParams();
    query.append('performance_rating', performanceRating.toString());
    if (notes) query.append('notes', notes);
    return fetchApi(`/revisions/${revisionId}/complete?${query}`, { method: 'POST' });
  },

  scheduleTopicRevision: (topicId: number, performanceRating?: number, notes?: string): Promise<{ revision: Revision }> =>
    fetchApi('/revisions/schedule_topic', {
      method: 'POST',
      body: JSON.stringify({
        topic_id: topicId,
        performance_rating: performanceRating || 3,
        notes,
      }),
    }),

  getRevisionStatistics: (): Promise<{ statistics: any }> =>
    fetchApi('/revisions/statistics'),
};

export default upscApi;
