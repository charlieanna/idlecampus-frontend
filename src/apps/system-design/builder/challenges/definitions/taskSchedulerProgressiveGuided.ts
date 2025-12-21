import { GuidedTutorial } from '../../types/guidedTutorial';

export const taskSchedulerProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'task-scheduler-progressive',
  title: 'Design a Distributed Task Scheduler',
  description: 'Build a job scheduler from simple cron to distributed workflow orchestration',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design job scheduling with cron expressions',
    'Implement distributed task execution',
    'Handle job dependencies and workflows',
    'Build retry policies and failure handling',
    'Scale to millions of scheduled jobs'
  ],
  prerequisites: ['Distributed systems', 'Queue-based architectures', 'Database design'],
  tags: ['scheduler', 'distributed-systems', 'cron', 'workflows', 'orchestration'],

  progressiveStory: {
    title: 'Task Scheduler Evolution',
    premise: "You're building a distributed task scheduler like Airflow or Temporal. Starting with simple cron jobs, you'll evolve to orchestrate complex workflows across thousands of workers.",
    phases: [
      { phase: 1, title: 'Basic Scheduling', description: 'Cron-based job execution' },
      { phase: 2, title: 'Distributed Execution', description: 'Scale across multiple workers' },
      { phase: 3, title: 'Workflows', description: 'Job dependencies and DAGs' },
      { phase: 4, title: 'Production Ready', description: 'Reliability and observability' }
    ]
  },

  steps: [
    // PHASE 1: Basic Scheduling (Steps 1-3)
    {
      id: 'step-1',
      title: 'Job Definition',
      phase: 1,
      phaseTitle: 'Basic Scheduling',
      learningObjective: 'Define schedulable jobs with metadata',
      thinkingFramework: {
        framework: 'Job as Data',
        approach: 'Job = what to run (handler) + when to run (schedule) + with what (parameters). Store job definition, create instances on schedule.',
        keyInsight: 'Separate job definition (template) from job instance (execution). Definition persists, instances are ephemeral runs.'
      },
      requirements: {
        functional: [
          'Define job with name and handler',
          'Configure schedule (cron expression)',
          'Set job parameters and metadata',
          'Enable/disable jobs'
        ],
        nonFunctional: []
      },
      hints: [
        'Job: {id, name, handler, schedule, params, enabled, created_at}',
        'Handler: function name or endpoint to invoke',
        'Schedule: cron expression "0 * * * *" (every hour)'
      ],
      expectedComponents: ['Job Store', 'Job API', 'Schedule Parser'],
      successCriteria: ['Jobs defined and stored', 'Cron expressions parsed'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'Cron Schedule Parsing',
      phase: 1,
      phaseTitle: 'Basic Scheduling',
      learningObjective: 'Parse cron expressions and calculate next run',
      thinkingFramework: {
        framework: 'Time Calculation',
        approach: 'Cron: minute hour day-of-month month day-of-week. Parse to find next matching time. Handle edge cases (Feb 30, DST).',
        keyInsight: 'Calculate next run time at job creation and after each run. Store next_run_at for efficient querying of due jobs.'
      },
      requirements: {
        functional: [
          'Parse standard cron expressions',
          'Calculate next run time from current time',
          'Handle timezone correctly',
          'Support extended cron (seconds, years)'
        ],
        nonFunctional: [
          'Parse < 1ms per expression'
        ]
      },
      hints: [
        'Cron fields: min(0-59) hour(0-23) dom(1-31) month(1-12) dow(0-6)',
        'Special: * (any), */5 (every 5), 1-5 (range), 1,3,5 (list)',
        'Library: node-cron, croniter (Python)'
      ],
      expectedComponents: ['Cron Parser', 'Next Run Calculator', 'Timezone Handler'],
      successCriteria: ['Expressions parsed correctly', 'Next run calculated'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Job Execution',
      phase: 1,
      phaseTitle: 'Basic Scheduling',
      learningObjective: 'Execute jobs when scheduled time arrives',
      thinkingFramework: {
        framework: 'Polling Loop',
        approach: 'Scheduler polls for due jobs (next_run_at <= now). Execute handler. Update next_run_at for recurring jobs. Simple but has limitations.',
        keyInsight: 'Poll interval determines latency. 1 second poll = up to 1 second late. Trade CPU usage for precision.'
      },
      requirements: {
        functional: [
          'Find jobs due for execution',
          'Invoke job handler with parameters',
          'Track job instance status (running, success, failed)',
          'Update schedule for next run'
        ],
        nonFunctional: [
          'Execution latency < 5 seconds from scheduled time'
        ]
      },
      hints: [
        'Query: SELECT * FROM jobs WHERE next_run_at <= NOW() AND enabled',
        'Instance: {job_id, started_at, finished_at, status, result}',
        'After run: next_run_at = calculate_next(schedule)'
      ],
      expectedComponents: ['Scheduler Loop', 'Job Executor', 'Instance Tracker'],
      successCriteria: ['Jobs execute on time', 'Status tracked'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Distributed Execution (Steps 4-6)
    {
      id: 'step-4',
      title: 'Worker Pool',
      phase: 2,
      phaseTitle: 'Distributed Execution',
      learningObjective: 'Distribute job execution across workers',
      thinkingFramework: {
        framework: 'Queue-Based Distribution',
        approach: 'Scheduler enqueues due jobs. Workers dequeue and execute. Decouples scheduling from execution. Enables horizontal scaling.',
        keyInsight: 'Workers are stateless. Can add/remove workers without affecting scheduler. Job is requeued if worker dies mid-execution.'
      },
      requirements: {
        functional: [
          'Enqueue jobs to execution queue',
          'Workers pull jobs from queue',
          'Track which worker executes which job',
          'Handle worker heartbeat/health'
        ],
        nonFunctional: [
          'Support 100+ workers',
          'Job pickup < 1 second after enqueue'
        ]
      },
      hints: [
        'Queue: Redis list or RabbitMQ/SQS',
        'Worker: BRPOP loop, process job, ack/nack',
        'Visibility timeout: job requeued if not acked in time'
      ],
      expectedComponents: ['Job Queue', 'Worker Process', 'Health Monitor'],
      successCriteria: ['Jobs distributed to workers', 'Workers scale independently'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Job Locking',
      phase: 2,
      phaseTitle: 'Distributed Execution',
      learningObjective: 'Prevent duplicate job execution',
      thinkingFramework: {
        framework: 'Distributed Locks',
        approach: 'Multiple schedulers can try to enqueue same job. Lock before enqueue. Lock before worker picks up. Prevent duplicates.',
        keyInsight: 'Use job_id + scheduled_time as lock key. Same job at same time = same lock. Different scheduled runs = different locks.'
      },
      requirements: {
        functional: [
          'Lock job before enqueueing',
          'Prevent same job running twice concurrently',
          'Release lock on completion or timeout',
          'Handle lock contention gracefully'
        ],
        nonFunctional: [
          'Lock acquisition < 10ms'
        ]
      },
      hints: [
        'Lock key: job:{job_id}:run:{scheduled_time}',
        'Redis SETNX with TTL for distributed lock',
        'Redlock for stronger consistency'
      ],
      expectedComponents: ['Lock Manager', 'Lock Store (Redis)', 'Contention Handler'],
      successCriteria: ['No duplicate executions', 'Locks released properly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Job Prioritization',
      phase: 2,
      phaseTitle: 'Distributed Execution',
      learningObjective: 'Execute high-priority jobs first',
      thinkingFramework: {
        framework: 'Priority Queues',
        approach: 'Not all jobs equal. Critical jobs run before batch jobs. Multiple queues by priority, or single priority queue.',
        keyInsight: 'Starvation risk: low priority jobs never run. Use weighted fair queuing or time-based priority boost.'
      },
      requirements: {
        functional: [
          'Assign priority to jobs (critical, high, normal, low)',
          'Execute higher priority jobs first',
          'Prevent starvation of low priority',
          'Allow priority override for specific runs'
        ],
        nonFunctional: [
          'Critical jobs picked up within 1 second'
        ]
      },
      hints: [
        'Multiple queues: queue:critical, queue:high, queue:normal',
        'Worker: try critical first, then high, then normal',
        'Aging: boost priority if waiting > threshold'
      ],
      expectedComponents: ['Priority Queue', 'Priority Scheduler', 'Aging Handler'],
      successCriteria: ['High priority jobs execute first', 'No starvation'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Workflows (Steps 7-9)
    {
      id: 'step-7',
      title: 'Job Dependencies',
      phase: 3,
      phaseTitle: 'Workflows',
      learningObjective: 'Run jobs in dependency order',
      thinkingFramework: {
        framework: 'DAG Execution',
        approach: 'Job B depends on Job A. Run A first, then B. Model as directed acyclic graph (DAG). Topological sort for execution order.',
        keyInsight: 'Dependency resolution at runtime. Job A finishes → check which jobs are now unblocked → enqueue those.'
      },
      requirements: {
        functional: [
          'Define job dependencies (A → B)',
          'Execute jobs in correct order',
          'Handle parallel independent jobs',
          'Detect circular dependencies'
        ],
        nonFunctional: [
          'Dependency check < 10ms'
        ]
      },
      hints: [
        'Job: {id, ..., depends_on: [job_ids]}',
        'Ready when: all depends_on completed successfully',
        'Circular: topological sort fails'
      ],
      expectedComponents: ['Dependency Graph', 'DAG Executor', 'Cycle Detector'],
      successCriteria: ['Dependencies respected', 'Parallel jobs run together'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Workflow Definition',
      phase: 3,
      phaseTitle: 'Workflows',
      learningObjective: 'Define multi-job workflows as units',
      thinkingFramework: {
        framework: 'Workflow as Template',
        approach: 'Workflow = collection of jobs with dependencies. Trigger workflow, creates job instances, executes DAG. Track workflow status.',
        keyInsight: 'Workflow instance groups job instances. Failed job can fail workflow or allow partial success. Configurable per workflow.'
      },
      requirements: {
        functional: [
          'Define workflow with multiple jobs',
          'Trigger workflow runs',
          'Track workflow-level status',
          'Pass data between jobs in workflow'
        ],
        nonFunctional: []
      },
      hints: [
        'Workflow: {id, name, jobs: [{job_id, depends_on}]}',
        'WorkflowRun: {workflow_id, status, started_at, job_runs: []}',
        'Data passing: job output → dependent job input'
      ],
      expectedComponents: ['Workflow Store', 'Workflow Executor', 'Data Passer'],
      successCriteria: ['Workflows execute correctly', 'Data flows between jobs'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Conditional & Dynamic Jobs',
      phase: 3,
      phaseTitle: 'Workflows',
      learningObjective: 'Support branching and dynamic job creation',
      thinkingFramework: {
        framework: 'Dynamic DAG',
        approach: 'Conditional: if job A output is X, run B, else run C. Dynamic: job A creates N child jobs based on output. Workflow shape determined at runtime.',
        keyInsight: 'Static DAG is limiting. Real workflows branch and fan-out. Support runtime DAG modification while maintaining consistency.'
      },
      requirements: {
        functional: [
          'Conditional branching based on job output',
          'Dynamic job creation (fan-out)',
          'Wait for dynamic jobs to complete (fan-in)',
          'Support loops with exit conditions'
        ],
        nonFunctional: []
      },
      hints: [
        'Branch: {condition: "output.status == success", then: [job_ids]}',
        'Fan-out: job returns [{params}], each spawns child job',
        'Fan-in: synthetic job waits for all fan-out jobs'
      ],
      expectedComponents: ['Condition Evaluator', 'Dynamic Job Creator', 'Fan-In Handler'],
      successCriteria: ['Branching works', 'Dynamic jobs execute and collect'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Production Ready (Steps 10-12)
    {
      id: 'step-10',
      title: 'Retry & Error Handling',
      phase: 4,
      phaseTitle: 'Production Ready',
      learningObjective: 'Handle job failures gracefully',
      thinkingFramework: {
        framework: 'Retry Policies',
        approach: 'Transient failures: retry with backoff. Permanent failures: mark failed, alert. Distinguish by error type or retry count.',
        keyInsight: 'Exponential backoff prevents thundering herd. Jitter prevents synchronized retries. Max retries prevents infinite loops.'
      },
      requirements: {
        functional: [
          'Configure retry count and backoff',
          'Distinguish retryable vs permanent failures',
          'Dead letter queue for exhausted retries',
          'Alert on repeated failures'
        ],
        nonFunctional: [
          'Retry within configured policy',
          'DLQ for investigation'
        ]
      },
      hints: [
        'Retry config: {max_retries: 3, backoff: exponential, base: 1m}',
        'Backoff: base * 2^attempt (1m, 2m, 4m)',
        'Jitter: add random 0-30% to backoff'
      ],
      expectedComponents: ['Retry Manager', 'Backoff Calculator', 'Dead Letter Queue'],
      successCriteria: ['Retries execute correctly', 'DLQ captures failures'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Observability',
      phase: 4,
      phaseTitle: 'Production Ready',
      learningObjective: 'Monitor scheduler and job health',
      thinkingFramework: {
        framework: 'Full Visibility',
        approach: 'Metrics: jobs scheduled/executed/failed, queue depth, latency. Logs: job start/end with context. Traces: follow job through system.',
        keyInsight: 'Queue depth is key metric. Growing = workers cant keep up. Latency = time from scheduled to started. Both indicate health.'
      },
      requirements: {
        functional: [
          'Track job execution metrics',
          'Log job lifecycle events',
          'Dashboard for scheduler health',
          'Alert on anomalies'
        ],
        nonFunctional: [
          'Metrics delay < 1 minute'
        ]
      },
      hints: [
        'Metrics: job_scheduled_total, job_completed_total, job_duration_seconds',
        'Labels: job_name, status, worker_id',
        'Alert: queue_depth > 1000 for > 5 minutes'
      ],
      expectedComponents: ['Metrics Exporter', 'Log Aggregator', 'Dashboard', 'Alerting'],
      successCriteria: ['Metrics visible', 'Alerts fire on issues'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'High Availability',
      phase: 4,
      phaseTitle: 'Production Ready',
      learningObjective: 'Ensure scheduler survives failures',
      thinkingFramework: {
        framework: 'Scheduler HA',
        approach: 'Multiple scheduler instances. Leader election for scheduling. Workers are stateless and disposable. Queue and state store are HA.',
        keyInsight: 'Scheduler is critical. If it fails, no jobs run. Run 3+ instances with leader election. Followers ready to take over.'
      },
      requirements: {
        functional: [
          'Run multiple scheduler instances',
          'Leader election for active scheduler',
          'Automatic failover on leader failure',
          'State persistence for recovery'
        ],
        nonFunctional: [
          'Failover < 30 seconds',
          '99.9% scheduler availability'
        ]
      },
      hints: [
        'Leader election: Zookeeper, etcd, or Redis',
        'Lease: leader renews every 10s, expires at 30s',
        'State: job status in DB, survives scheduler restart'
      ],
      expectedComponents: ['Leader Election', 'Failover Handler', 'State Persistence'],
      successCriteria: ['Scheduler survives node failure', 'Jobs continue executing'],
      estimatedTime: '10 minutes'
    }
  ]
};
