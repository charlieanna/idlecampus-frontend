import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

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

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create and manage events',
    'Users can share calendars with others'
  ],

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

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
calendars = {}
events = {}
attendees = {}
calendar_shares = {}

def create_event(event_id: str, calendar_id: str, title: str,
                 start_time: str, end_time: str, location: str = None) -> Dict:
    """
    FR-1: Users can create events
    Naive implementation - stores event in memory
    """
    events[event_id] = {
        'id': event_id,
        'calendar_id': calendar_id,
        'title': title,
        'start_time': start_time,
        'end_time': end_time,
        'location': location,
        'created_at': datetime.now()
    }
    return events[event_id]

def update_event(event_id: str, **kwargs) -> Dict:
    """
    FR-1: Users can manage (update) events
    Naive implementation - updates event fields
    """
    event = events.get(event_id)
    if not event:
        raise ValueError("Event not found")

    for key, value in kwargs.items():
        if key in event:
            event[key] = value

    event['updated_at'] = datetime.now()
    return event

def delete_event(event_id: str) -> bool:
    """
    FR-1: Users can manage (delete) events
    Naive implementation - removes event from memory
    """
    if event_id in events:
        del events[event_id]
        return True
    return False

def share_calendar(calendar_id: str, owner_id: str, shared_with_id: str,
                   permission: str = 'view') -> Dict:
    """
    FR-2: Users can share calendars with others
    Naive implementation - stores share relationship
    """
    share_id = f"{calendar_id}_{shared_with_id}"
    calendar_shares[share_id] = {
        'calendar_id': calendar_id,
        'owner_id': owner_id,
        'shared_with_id': shared_with_id,
        'permission': permission,
        'created_at': datetime.now()
    }
    return calendar_shares[share_id]

def get_shared_calendars(user_id: str) -> List[Dict]:
    """
    FR-2: View calendars shared with user
    Naive implementation - returns all shared calendars for a user
    """
    shared_cals = []
    for share in calendar_shares.values():
        if share['shared_with_id'] == user_id:
            calendar = calendars.get(share['calendar_id'])
            if calendar:
                shared_cals.append({
                    'calendar': calendar,
                    'permission': share['permission']
                })
    return shared_cals

def get_events(calendar_id: str, start_date: str = None, end_date: str = None) -> List[Dict]:
    """
    Helper: Get events for a calendar (for viewing)
    Naive implementation - returns all events in calendar
    """
    calendar_events = []
    for event in events.values():
        if event['calendar_id'] == calendar_id:
            calendar_events.append(event)

    # Sort by start time
    calendar_events.sort(key=lambda x: x['start_time'])
    return calendar_events
`,
};

// Auto-generate code challenges from functional requirements
(googlecalendarProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(googlecalendarProblemDefinition);
