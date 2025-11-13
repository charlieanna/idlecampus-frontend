import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Stack Overflow - Q&A Platform
 * Comprehensive FR and NFR scenarios
 */
export const stackoverflowProblemDefinition: ProblemDefinition = {
  id: 'stackoverflow',
  title: 'Stack Overflow - Q&A Platform',
  description: `Design a Q&A platform like Stack Overflow that:
- Users can ask and answer questions
- Questions and answers can be upvoted/downvoted
- Users earn reputation points
- Questions have tags for categorization`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can ask and answer questions'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process questions, answers, votes',
      },
      {
        type: 'storage',
        reason: 'Need to store questions, answers, users, votes',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store Q&A data',
      },
    ],
    dataModel: {
      entities: ['user', 'question', 'answer', 'vote', 'tag'],
      fields: {
        user: ['id', 'username', 'email', 'reputation', 'created_at'],
        question: ['id', 'user_id', 'title', 'body', 'views', 'score', 'created_at'],
        answer: ['id', 'question_id', 'user_id', 'body', 'score', 'is_accepted', 'created_at'],
        vote: ['id', 'target_id', 'target_type', 'user_id', 'value', 'created_at'],
        tag: ['id', 'name', 'description', 'count', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Posting questions/answers
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing questions
        { type: 'read_by_query', frequency: 'very_high' }, // Searching questions
      ],
    },
  },

  scenarios: generateScenarios('stackoverflow', problemConfigs.stackoverflow),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
questions = {}
answers = {}
votes = {}
tags = {}

def ask_question(question_id: str, user_id: str, title: str, body: str,
                 tag_names: List[str] = None) -> Dict:
    """
    FR-1: Users can ask questions
    Naive implementation - stores question in memory
    """
    questions[question_id] = {
        'id': question_id,
        'user_id': user_id,
        'title': title,
        'body': body,
        'tags': tag_names or [],
        'views': 0,
        'score': 0,
        'created_at': datetime.now()
    }
    return questions[question_id]

def answer_question(answer_id: str, question_id: str, user_id: str,
                    body: str) -> Dict:
    """
    FR-1: Users can answer questions
    Naive implementation - stores answer in memory
    """
    answers[answer_id] = {
        'id': answer_id,
        'question_id': question_id,
        'user_id': user_id,
        'body': body,
        'score': 0,
        'is_accepted': False,
        'created_at': datetime.now()
    }
    return answers[answer_id]

def vote(vote_id: str, target_id: str, target_type: str, user_id: str,
         value: int) -> Dict:
    """
    Helper: Upvote/downvote questions and answers
    Naive implementation - records vote and updates score
    value: 1 for upvote, -1 for downvote
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': target_id,
        'target_type': target_type,  # 'question' or 'answer'
        'user_id': user_id,
        'value': value,
        'created_at': datetime.now()
    }

    # Update score
    if target_type == 'question':
        question = questions.get(target_id)
        if question:
            question['score'] += value
    elif target_type == 'answer':
        answer = answers.get(target_id)
        if answer:
            answer['score'] += value

    return votes[vote_id]

def get_question_answers(question_id: str) -> List[Dict]:
    """
    Helper: Get all answers for a question
    Naive implementation - returns answers sorted by score
    """
    question_answers = []
    for answer in answers.values():
        if answer['question_id'] == question_id:
            question_answers.append(answer)

    # Sort by score (highest first), with accepted answer first
    question_answers.sort(key=lambda x: (not x['is_accepted'], -x['score']))
    return question_answers
`,
};
