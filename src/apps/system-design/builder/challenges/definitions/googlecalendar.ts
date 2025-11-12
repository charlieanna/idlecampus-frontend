import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Google Calendar - Calendar Management
 * Comprehensive FR and NFR scenarios
 */
export const googlecalendarProblemDefinition: ProblemDefinition = {
  id: 'googlecalendar',
  title: 'Google Calendar - Event Management',
  description: `Design a calendar platform like Google Calendar that:
- Users can create and manage events
- Events can have attendees and reminders
- Users can share calendars with others
- Platform sends notifications for upcoming events`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process event creation and updates',
      },
      {
        type: 'storage',
        reason: 'Need to store events, calendars, users',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends event requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store event data',
      },
    ],
    dataModel: {
      entities: ['user', 'calendar', 'event', 'attendee', 'reminder'],
      fields: {
        user: ['id', 'email', 'name', 'timezone', 'created_at'],
        calendar: ['id', 'owner_id', 'name', 'color', 'visibility', 'created_at'],
        event: ['id', 'calendar_id', 'title', 'start_time', 'end_time', 'location', 'created_at'],
        attendee: ['event_id', 'user_id', 'status', 'created_at'],
        reminder: ['id', 'event_id', 'minutes_before', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Creating events
        { type: 'read_by_query', frequency: 'very_high' }, // Loading calendar view
      ],
    },
  },

  scenarios: generateScenarios('googlecalendar', problemConfigs.googlecalendar),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
