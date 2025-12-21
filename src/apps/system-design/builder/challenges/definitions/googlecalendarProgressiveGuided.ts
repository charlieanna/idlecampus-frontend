import { GuidedTutorial } from '../../types/guidedTutorial';

export const googlecalendarProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'googlecalendar-progressive',
  title: 'Design Google Calendar',
  description: 'Build a calendar system from simple events to intelligent scheduling assistant',
  difficulty: 'medium',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design event storage with recurring events',
    'Implement time zone handling correctly',
    'Build calendar sharing and permissions',
    'Handle scheduling conflicts and availability',
    'Scale to billions of events'
  ],
  prerequisites: ['Date/time handling', 'Sharing systems', 'Notifications'],
  tags: ['calendar', 'scheduling', 'events', 'collaboration', 'productivity'],

  progressiveStory: {
    title: 'Google Calendar Evolution',
    premise: "You're building a calendar application. Starting with simple event creation, you'll evolve to support recurring events, shared calendars, smart scheduling, and enterprise features.",
    phases: [
      { phase: 1, title: 'Events', description: 'Create and view events' },
      { phase: 2, title: 'Sharing', description: 'Calendars and invites' },
      { phase: 3, title: 'Smart Scheduling', description: 'Find time and availability' },
      { phase: 4, title: 'Enterprise', description: 'Scale and integrations' }
    ]
  },

  steps: [
    // PHASE 1: Events (Steps 1-3)
    {
      id: 'step-1',
      title: 'Event Creation',
      phase: 1,
      phaseTitle: 'Events',
      learningObjective: 'Create events with time and location',
      thinkingFramework: {
        framework: 'Event Model',
        approach: 'Event = time span + metadata. Store in UTC, display in user timezone. All-day events are date-only. Location can be physical or virtual.',
        keyInsight: 'Always store times in UTC. Convert for display. All-day events are special: "Jan 15" means different UTC times in different timezones.'
      },
      requirements: {
        functional: [
          'Create event with title, time, duration',
          'Set location (physical or virtual)',
          'Add description and attachments',
          'All-day events'
        ],
        nonFunctional: [
          'Event create < 200ms',
          'Support events years in future'
        ]
      },
      hints: [
        'Event: {id, title, start_utc, end_utc, timezone, location, description}',
        'All-day: {all_day: true, date: "2024-01-15"} - no specific time',
        'Virtual: location = meeting_url (Zoom, Meet)'
      ],
      expectedComponents: ['Event Store', 'Time Converter', 'Location Handler'],
      successCriteria: ['Events created', 'Times correct'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Calendar Views',
      phase: 1,
      phaseTitle: 'Events',
      learningObjective: 'Display events in different views',
      thinkingFramework: {
        framework: 'Time-Based Views',
        approach: 'Day, week, month, year, agenda views. Each queries different time range. Efficient range queries. Handle overlapping events.',
        keyInsight: 'View determines query range. Month view needs ~42 days (6 weeks). Overlapping events need layout algorithm. Performance matters for large calendars.'
      },
      requirements: {
        functional: [
          'Day, week, month views',
          'Agenda (list) view',
          'Navigate between time ranges',
          'Handle overlapping events visually'
        ],
        nonFunctional: [
          'View render < 300ms',
          'Smooth navigation'
        ]
      },
      hints: [
        'Query: events WHERE start < range_end AND end > range_start',
        'Layout: detect overlaps, assign columns, width = 1/columns',
        'Agenda: chronological list with date headers'
      ],
      expectedComponents: ['View Renderer', 'Range Query', 'Layout Engine'],
      successCriteria: ['Views render correctly', 'Navigation smooth'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Recurring Events',
      phase: 1,
      phaseTitle: 'Events',
      learningObjective: 'Support repeating events with rules',
      thinkingFramework: {
        framework: 'Recurrence Rules',
        approach: 'RRULE defines pattern (daily, weekly, monthly). Generate instances on read. Store exceptions. Modify single or all future instances.',
        keyInsight: 'Dont store every instance (infinite). Store rule, generate on query. Exceptions: this instance deleted, this instance moved. "This and future" creates new series.'
      },
      requirements: {
        functional: [
          'Daily, weekly, monthly, yearly recurrence',
          'End after N occurrences or by date',
          'Modify single instance (exception)',
          'Modify all future instances'
        ],
        nonFunctional: [
          'Instance generation < 100ms',
          'Support complex rules (every other Monday)'
        ]
      },
      hints: [
        'RRULE: {freq: WEEKLY, interval: 2, byday: MO,WE, until: date}',
        'Exception: {recurring_event_id, date, modified_event | deleted}',
        'Expand: generate instances for query range from rule'
      ],
      expectedComponents: ['Rule Parser', 'Instance Generator', 'Exception Handler'],
      successCriteria: ['Recurrence works', 'Exceptions handled'],
      estimatedTime: '10 minutes'
    },

    // PHASE 2: Sharing (Steps 4-6)
    {
      id: 'step-4',
      title: 'Multiple Calendars',
      phase: 2,
      phaseTitle: 'Sharing',
      learningObjective: 'Organize events into calendars',
      thinkingFramework: {
        framework: 'Calendar Organization',
        approach: 'User has multiple calendars (work, personal, holidays). Events belong to one calendar. View multiple calendars overlaid. Calendar colors.',
        keyInsight: 'Calendars are organization units. Share calendar = share all events in it. Color coding for visual distinction. Toggle visibility per calendar.'
      },
      requirements: {
        functional: [
          'Create multiple calendars',
          'Assign events to calendars',
          'Toggle calendar visibility',
          'Calendar colors'
        ],
        nonFunctional: [
          'Support 100+ calendars per user'
        ]
      },
      hints: [
        'Calendar: {id, owner_id, name, color, default}',
        'Event: {calendar_id, ...}',
        'View: aggregate events from visible calendars'
      ],
      expectedComponents: ['Calendar Manager', 'Visibility Toggle', 'Aggregator'],
      successCriteria: ['Multiple calendars work', 'Overlay view'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-5',
      title: 'Calendar Sharing',
      phase: 2,
      phaseTitle: 'Sharing',
      learningObjective: 'Share calendars with others',
      thinkingFramework: {
        framework: 'Permission Levels',
        approach: 'Share with individuals or public. Permission levels: see free/busy only, see details, make changes. Subscription model for read-only.',
        keyInsight: 'Free/busy hides details but shows availability. Essential for scheduling without revealing private events. Public calendars for holidays, sports.'
      },
      requirements: {
        functional: [
          'Share calendar with specific users',
          'Permission levels (view, edit)',
          'Free/busy only sharing',
          'Public calendar URL'
        ],
        nonFunctional: [
          'Permission check < 10ms'
        ]
      },
      hints: [
        'Share: {calendar_id, user_id, permission: free_busy|read|write}',
        'Public: generate URL, anyone with link can view',
        'Subscription: add others calendar to your view (read-only)'
      ],
      expectedComponents: ['Share Manager', 'Permission Checker', 'Subscription Handler'],
      successCriteria: ['Sharing works', 'Permissions enforced'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Event Invitations',
      phase: 2,
      phaseTitle: 'Sharing',
      learningObjective: 'Invite attendees and track responses',
      thinkingFramework: {
        framework: 'RSVP Flow',
        approach: 'Invite attendees by email. Send calendar invite (ICS). Track responses: yes, no, maybe. Update event on organizer changes.',
        keyInsight: 'Calendar invites are email-based protocol (iCalendar). Works across different calendar systems. Response status visible to organizer.'
      },
      requirements: {
        functional: [
          'Add attendees to event',
          'Send email invitations',
          'RSVP responses (yes/no/maybe)',
          'Update attendees on changes'
        ],
        nonFunctional: [
          'Invite delivery < 1 minute',
          'ICS compatibility'
        ]
      },
      hints: [
        'Attendee: {event_id, email, status: pending|accepted|declined|tentative}',
        'ICS: iCalendar format for cross-platform',
        'Update: re-send ICS with sequence number incremented'
      ],
      expectedComponents: ['Invite Service', 'ICS Generator', 'RSVP Handler'],
      successCriteria: ['Invites sent', 'Responses tracked'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Smart Scheduling (Steps 7-9)
    {
      id: 'step-7',
      title: 'Free/Busy Lookup',
      phase: 3,
      phaseTitle: 'Smart Scheduling',
      learningObjective: 'Check availability across calendars',
      thinkingFramework: {
        framework: 'Availability Query',
        approach: 'Given users and time range, return busy blocks. Aggregate from all calendars. Respect privacy (dont reveal event details). Cache for performance.',
        keyInsight: 'Free/busy is privacy-preserving. Shows only blocked times, not why. Essential for scheduling across organizations.'
      },
      requirements: {
        functional: [
          'Query free/busy for users',
          'Aggregate across calendars',
          'Respect sharing permissions',
          'Batch queries for efficiency'
        ],
        nonFunctional: [
          'Free/busy query < 500ms',
          'Cache TTL: 5 minutes'
        ]
      },
      hints: [
        'FreeBusy: {user_id, busy_times: [{start, end}]} - no event details',
        'Query: users + time range → busy blocks per user',
        'Privacy: only return blocks, not event info'
      ],
      expectedComponents: ['FreeBusy Service', 'Aggregator', 'Cache'],
      successCriteria: ['Availability accurate', 'Privacy maintained'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Find a Time',
      phase: 3,
      phaseTitle: 'Smart Scheduling',
      learningObjective: 'Suggest meeting times for multiple attendees',
      thinkingFramework: {
        framework: 'Time Slot Finding',
        approach: 'Given attendees and duration, find available slots. Consider working hours. Rank by preference (no early morning). Handle required vs optional attendees.',
        keyInsight: 'Finding mutual availability is hard. More attendees = fewer options. Working hours vary by timezone. Required attendees must be free.'
      },
      requirements: {
        functional: [
          'Find available slots for attendees',
          'Consider working hours',
          'Required vs optional attendees',
          'Rank suggested times'
        ],
        nonFunctional: [
          'Suggestion generation < 2 seconds'
        ]
      },
      hints: [
        'Algorithm: intersect free times of all required attendees',
        'Working hours: default 9am-5pm in each users timezone',
        'Ranking: prefer mid-day, prefer sooner dates'
      ],
      expectedComponents: ['Slot Finder', 'Working Hours', 'Slot Ranker'],
      successCriteria: ['Finds available times', 'Respects constraints'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-9',
      title: 'Scheduling Links',
      phase: 3,
      phaseTitle: 'Smart Scheduling',
      learningObjective: 'Let others book time with you',
      thinkingFramework: {
        framework: 'Appointment Slots',
        approach: 'Define availability windows. Generate shareable link. Booker sees available slots. Booking creates event for both parties.',
        keyInsight: 'Scheduling links eliminate back-and-forth. You define when youre available. Others self-serve. Like Calendly built-in.'
      },
      requirements: {
        functional: [
          'Define available time slots',
          'Generate booking link',
          'Show available times to booker',
          'Create event on booking'
        ],
        nonFunctional: [
          'Prevent double booking',
          'Link valid indefinitely'
        ]
      },
      hints: [
        'Availability: {user_id, windows: [{day_of_week, start, end}]}',
        'Booking page: show slots minus existing events',
        'Book: atomic check-and-create to prevent race'
      ],
      expectedComponents: ['Availability Config', 'Booking Page', 'Slot Reserver'],
      successCriteria: ['Booking works', 'No double booking'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Enterprise (Steps 10-12)
    {
      id: 'step-10',
      title: 'Room and Resource Booking',
      phase: 4,
      phaseTitle: 'Enterprise',
      learningObjective: 'Schedule conference rooms and equipment',
      thinkingFramework: {
        framework: 'Resource Calendar',
        approach: 'Rooms and resources are calendars. Add as attendee to book. Check availability like users. Approval workflow for limited resources.',
        keyInsight: 'Treat rooms as calendar entities. Room "accepts" or "declines" based on availability. Enables find-a-room similar to find-a-time.'
      },
      requirements: {
        functional: [
          'Create room/resource calendars',
          'Add room as event attendee',
          'Auto-accept if available',
          'Room capacity and features'
        ],
        nonFunctional: [
          'Prevent room double-booking'
        ]
      },
      hints: [
        'Resource: {id, name, type: room|equipment, capacity, features: []}',
        'Booking: resource as attendee, auto-respond based on availability',
        'Features: video_conference, whiteboard, capacity >= required'
      ],
      expectedComponents: ['Resource Manager', 'Auto-Accept Logic', 'Room Finder'],
      successCriteria: ['Rooms bookable', 'No conflicts'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Reminders and Notifications',
      phase: 4,
      phaseTitle: 'Enterprise',
      learningObjective: 'Notify users about upcoming events',
      thinkingFramework: {
        framework: 'Scheduled Notifications',
        approach: 'Default reminders per calendar. Custom reminders per event. Multiple reminder times. Email, push, and SMS.',
        keyInsight: 'Reminders are scheduled jobs. Fire at event_time - reminder_offset. Handle timezone correctly. Batch for efficiency.'
      },
      requirements: {
        functional: [
          'Default reminders per calendar',
          'Custom reminders per event',
          'Multiple reminder types (email, push)',
          'Snooze reminders'
        ],
        nonFunctional: [
          'Reminder accuracy: ± 1 minute',
          'Handle millions of reminders/day'
        ]
      },
      hints: [
        'Reminder: {event_id, offset_minutes, type: email|push|sms}',
        'Scheduler: job at (event_time - offset) to send',
        'Batch: group reminders for same minute'
      ],
      expectedComponents: ['Reminder Store', 'Scheduler', 'Notification Service'],
      successCriteria: ['Reminders fire correctly', 'Multiple types work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Scale and Sync',
      phase: 4,
      phaseTitle: 'Enterprise',
      learningObjective: 'Handle billions of events and sync',
      thinkingFramework: {
        framework: 'Calendar Sync',
        approach: 'CalDAV/iCal for external sync. Mobile offline support. Conflict resolution for concurrent edits. Efficient sync protocol.',
        keyInsight: 'Calendar is sync-heavy. Mobile needs offline. External calendar sync via standards. Conflict: last-write-wins or prompt user.'
      },
      requirements: {
        functional: [
          'CalDAV server for external clients',
          'Mobile offline with sync',
          'External calendar subscription',
          'Conflict resolution'
        ],
        nonFunctional: [
          'Sync latency < 30 seconds',
          'Support 1M events per user'
        ]
      },
      hints: [
        'CalDAV: WebDAV extension for calendars, iCalendar format',
        'Sync: sync token tracks changes since last sync',
        'Conflict: compare timestamps, later wins or merge'
      ],
      expectedComponents: ['CalDAV Server', 'Sync Engine', 'Conflict Resolver'],
      successCriteria: ['External sync works', 'Offline supported'],
      estimatedTime: '8 minutes'
    }
  ]
};
