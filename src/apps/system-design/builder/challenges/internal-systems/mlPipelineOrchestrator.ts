import { Challenge } from '../../types/testCase';

export const mlPipelineOrchestratorChallenge: Challenge = {
  id: 'ml_pipeline_orchestrator',
  title: 'ML Pipeline Orchestrator',
  difficulty: 'advanced',
  description: `Design an orchestrator for end-to-end ML pipelines (data → features → training → deployment).

Execute DAG of tasks with dependencies, handle failures, and optimize resource usage.

Key challenges:
- DAG execution with dependencies
- Failure recovery and retries
- Resource scheduling
- Artifact management`,

  requirements: {
    functional: [
      'DAG-based pipeline execution',
      'Task dependencies and scheduling',
      'Failure recovery with retries',
      'Artifact versioning',
      'Resource management',
    ],
    traffic: '1000 pipeline runs/day',
    latency: 'Pipeline latency < 2 hours',
    availability: '99.9% uptime',
    budget: '$8,000/month',
  },

  availableComponents: ['app_server', 'database', 's3', 'worker_pool', 'message_queue'],

  testCases: [
    {
      name: 'DAG Execution',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Execute pipeline tasks in dependency order.',
      traffic: { type: 'pipeline', tasks: 10 },
      duration: 300,
      passCriteria: { maxErrorRate: 0, pipelineSuccess: 1.0 },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 200, writeCapacity: 100 } },
          { type: 'kafka', config: { partitions: 20 } },
          { type: 'worker_pool', config: { workers: 50 } },
          { type: 's3', config: { storageSizeGB: 10000 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'kafka' },
          { from: 'kafka', to: 'worker_pool' },
          { from: 'worker_pool', to: 's3' },
        ],
        explanation: `Topological sort for DAG, execute on workers`,
      },
    },
  ],

  hints: [
    {
      category: 'Pipeline Steps',
      items: [
        '1. Data ingestion',
        '2. Feature engineering',
        '3. Training',
        '4. Evaluation',
        '5. Deployment',
      ],
    },
  ],

  learningObjectives: ['ML pipeline orchestration', 'DAG execution'],

  realWorldExample: `Airflow, Kubeflow Pipelines`,

  pythonTemplate: `class MLPipelineOrchestrator:
    def run_pipeline(self, pipeline_def):
        dag = self._build_dag(pipeline_def)
        tasks = self._topological_sort(dag)
        for task in tasks:
            self._execute_task(task)

    def _topological_sort(self, dag):
        # TODO: Sort by dependencies
        pass

    def _execute_task(self, task):
        # TODO: Run on worker
        pass`,
};
