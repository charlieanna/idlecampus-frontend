import type { Challenge } from '../../types';

/**
 * L4-L5 Internal Systems Problem: Runbook Automation
 *
 * Real-world examples:
 * - Google SRE: Automated playbooks for common incidents (OOM, disk full, high CPU)
 * - PagerDuty Runbook Automation: Trigger remediation from alerts
 * - AWS Systems Manager Automation: Infrastructure automation workflows
 * - Ansible Tower/AWX: Job templates for operational procedures
 *
 * Company context:
 * Your SRE team handles 100+ incidents/month with repetitive manual tasks:
 * - Restart crashed services (30% of incidents)
 * - Clear full disks (20% of incidents)
 * - Scale up overloaded services (15% of incidents)
 * Mean Time To Remediate (MTTR): 30 minutes (mostly manual)
 * Goal: Reduce MTTR to <5 minutes with automated runbooks
 *
 * Problem:
 * Design a runbook automation system that executes operational procedures
 * with safety checks, human-in-loop approvals, and rollback capabilities.
 */

const testCases = [
  {
    id: 1,
    name: 'FR: Execute simple runbook (restart service)',
    input: {
      action: 'execute_runbook',
      runbook_config: {
        runbook_id: 'restart-service',
        steps: [
          { step: 1, action: 'check_service_health', target: 'api-gateway' },
          { step: 2, action: 'stop_service', target: 'api-gateway' },
          { step: 3, action: 'wait', duration: 10 }, // 10 seconds
          { step: 4, action: 'start_service', target: 'api-gateway' },
          { step: 5, action: 'verify_service_health', target: 'api-gateway' },
        ],
        parameters: {
          service: 'api-gateway',
        },
      },
      context: {
        execution_mode: 'auto',
      },
    },
    expected_output: {
      execution_id: 'exec-001',
      status: 'completed',
      steps_executed: [
        { step: 1, action: 'check_service_health', result: 'unhealthy', status: 'success' },
        { step: 2, action: 'stop_service', result: 'stopped', status: 'success' },
        { step: 3, action: 'wait', result: 'waited 10 seconds', status: 'success' },
        { step: 4, action: 'start_service', result: 'started', status: 'success' },
        { step: 5, action: 'verify_service_health', result: 'healthy', status: 'success' },
      ],
      execution_time: '15 seconds',
      mttr_improvement: '95%', // 15 seconds vs 30 minutes manual
    },
    explanation:
      'Execute runbook: 5-step procedure to restart service. Check health → stop → wait → start → verify. All steps succeed. Execution time: 15 seconds (vs 30 minutes manual) = 95% MTTR reduction.',
  },
  {
    id: 2,
    name: 'FR: Safety check (require approval for destructive action)',
    input: {
      action: 'execute_runbook',
      runbook_config: {
        runbook_id: 'delete-old-data',
        steps: [
          { step: 1, action: 'identify_old_data', criteria: 'age > 90 days' },
          { step: 2, action: 'delete_data', target: 'production_database', requires_approval: true },
        ],
        parameters: {
          database: 'production_database',
          dry_run: false,
        },
      },
      context: {
        execution_mode: 'manual',
        approval_required: true,
      },
    },
    expected_output: {
      execution_id: 'exec-002',
      status: 'waiting_approval',
      steps_executed: [
        { step: 1, action: 'identify_old_data', result: '1000 rows to delete', status: 'success' },
      ],
      pending_step: {
        step: 2,
        action: 'delete_data',
        requires_approval: true,
        approval_message: 'Deleting 1000 rows from production_database. Approve to proceed.',
      },
      safety_check: {
        destructive_action: true,
        approval_required: true,
        approvers: ['sre-team', 'database-admin'],
      },
    },
    explanation:
      'Safety check: Step 2 (delete_data) is destructive → requires approval. Execution pauses after step 1. Wait for approval from SRE team or database admin before proceeding. This prevents accidental data loss.',
  },
  {
    id: 3,
    name: 'FR: Rollback on failure (restore previous state)',
    input: {
      action: 'execute_runbook',
      runbook_config: {
        runbook_id: 'deploy-config-change',
        steps: [
          { step: 1, action: 'backup_config', target: 'api-gateway' },
          { step: 2, action: 'deploy_config', target: 'api-gateway', config_version: 'v2' },
          { step: 3, action: 'verify_service_health', target: 'api-gateway' },
        ],
        rollback_on_failure: true,
      },
      context: {
        failure_scenario: {
          step: 3,
          reason: 'Service health check failed (error rate 50%)',
        },
      },
    },
    expected_output: {
      execution_id: 'exec-003',
      status: 'rolled_back',
      steps_executed: [
        { step: 1, action: 'backup_config', result: 'config backed up as v1', status: 'success' },
        { step: 2, action: 'deploy_config', result: 'deployed v2', status: 'success' },
        { step: 3, action: 'verify_service_health', result: 'unhealthy (error rate 50%)', status: 'failed' },
      ],
      rollback_executed: [
        { step: 'rollback-1', action: 'restore_config', result: 'restored v1', status: 'success' },
        { step: 'rollback-2', action: 'verify_service_health', result: 'healthy', status: 'success' },
      ],
      final_status: 'reverted',
    },
    explanation:
      'Rollback on failure: Step 3 fails (service unhealthy after config change). Trigger rollback: restore config v1, verify health. Service returns to healthy state. Failed deployment automatically reverted.',
  },
  {
    id: 4,
    name: 'NFR-P: Parallel execution (scale multiple services)',
    input: {
      action: 'execute_runbook',
      runbook_config: {
        runbook_id: 'scale-services',
        steps: [
          {
            step: 1,
            action: 'scale_up',
            targets: ['api-gateway', 'user-service', 'order-service'],
            replicas: 10,
            parallel: true,
          },
          { step: 2, action: 'verify_all_healthy', targets: ['api-gateway', 'user-service', 'order-service'] },
        ],
        parameters: {
          target_replicas: 10,
        },
      },
      context: {
        execution_mode: 'auto',
      },
    },
    expected_output: {
      execution_id: 'exec-004',
      status: 'completed',
      steps_executed: [
        {
          step: 1,
          action: 'scale_up',
          result: 'Scaled 3 services in parallel',
          parallel_executions: [
            { target: 'api-gateway', result: 'scaled to 10 replicas', duration: '30s' },
            { target: 'user-service', result: 'scaled to 10 replicas', duration: '35s' },
            { target: 'order-service', result: 'scaled to 10 replicas', duration: '25s' },
          ],
          total_duration: '35s', // Max duration (user-service)
          status: 'success',
        },
        { step: 2, action: 'verify_all_healthy', result: 'All 3 services healthy', status: 'success' },
      ],
      execution_time: '40 seconds',
      speedup: '2.5x', // 40s vs 100s sequential (30+35+25+10)
    },
    explanation:
      'Parallel execution: Scale 3 services concurrently (not sequentially). api-gateway (30s), user-service (35s), order-service (25s) run in parallel. Total time = max(30, 35, 25) = 35s. 2.5x faster than sequential (90s).',
  },
  {
    id: 5,
    name: 'NFR-P: Conditional execution (if-then-else logic)',
    input: {
      action: 'execute_runbook',
      runbook_config: {
        runbook_id: 'auto-scale',
        steps: [
          { step: 1, action: 'check_cpu_usage', target: 'api-gateway' },
          {
            step: 2,
            action: 'conditional',
            condition: 'cpu_usage > 80%',
            then: [{ action: 'scale_up', replicas: 10 }],
            else: [{ action: 'log', message: 'CPU usage normal, no action needed' }],
          },
        ],
      },
      context: {
        metrics: {
          cpu_usage: 85, // 85% CPU usage
        },
      },
    },
    expected_output: {
      execution_id: 'exec-005',
      status: 'completed',
      steps_executed: [
        { step: 1, action: 'check_cpu_usage', result: '85% CPU usage', status: 'success' },
        {
          step: 2,
          action: 'conditional',
          condition: 'cpu_usage > 80%',
          condition_met: true,
          executed_branch: 'then',
          result: [{ action: 'scale_up', result: 'scaled to 10 replicas', status: 'success' }],
          status: 'success',
        },
      ],
      execution_time: '5 seconds',
    },
    explanation:
      'Conditional execution: Check CPU usage (85%). Condition (cpu_usage > 80%) = true → execute "then" branch (scale up). "else" branch skipped. This enables intelligent automation based on runtime conditions.',
  },
  {
    id: 6,
    name: 'NFR-R: Dry-run mode (test without execution)',
    input: {
      action: 'execute_runbook',
      runbook_config: {
        runbook_id: 'delete-old-logs',
        steps: [
          { step: 1, action: 'identify_old_logs', criteria: 'age > 30 days' },
          { step: 2, action: 'delete_logs', target: 's3://logs-bucket/' },
        ],
        parameters: {
          dry_run: true, // Test mode
        },
      },
      context: {
        execution_mode: 'dry_run',
      },
    },
    expected_output: {
      execution_id: 'exec-006',
      status: 'dry_run_completed',
      steps_simulated: [
        { step: 1, action: 'identify_old_logs', result: '5000 log files (50 GB)', status: 'simulated' },
        { step: 2, action: 'delete_logs', result: 'Would delete 5000 files (50 GB)', status: 'simulated' },
      ],
      dry_run_summary: {
        files_to_delete: 5000,
        storage_freed: '50 GB',
        estimated_cost_savings: '$1.15/month', // S3 storage cost
        actual_changes_made: 0, // No actual deletions
      },
      recommendation: 'Dry run successful. Run with dry_run=false to execute actual deletion.',
    },
    explanation:
      'Dry-run mode: Simulate runbook execution without making actual changes. Identify 5000 log files (50 GB) to delete. Show estimated impact (storage freed, cost savings). No actual deletions. Safe way to test runbooks before production.',
  },
  {
    id: 7,
    name: 'NFR-R: Parameter validation (prevent invalid inputs)',
    input: {
      action: 'execute_runbook',
      runbook_config: {
        runbook_id: 'scale-service',
        steps: [{ step: 1, action: 'scale_to', target: 'api-gateway', replicas: '{{replicas}}' }],
        parameters: {
          replicas: -5, // Invalid: negative replicas
        },
      },
      context: {
        parameter_validation: true,
      },
    },
    expected_output: {
      execution_id: 'exec-007',
      status: 'validation_failed',
      validation_errors: [
        {
          parameter: 'replicas',
          value: -5,
          error: 'replicas must be >= 0',
          allowed_range: '0-100',
        },
      ],
      steps_executed: [], // No steps executed due to validation failure
      recommendation: 'Fix parameter validation errors and retry.',
    },
    explanation:
      'Parameter validation: replicas = -5 (invalid, must be >= 0). Validation fails before execution. No steps executed. Prevents runbook from running with invalid parameters (which could cause outages).',
  },
  {
    id: 8,
    name: 'NFR-R: Audit trail (track who ran what)',
    input: {
      action: 'execute_runbook',
      runbook_config: {
        runbook_id: 'restart-database',
        steps: [
          { step: 1, action: 'backup_database', target: 'prod-db' },
          { step: 2, action: 'restart_database', target: 'prod-db' },
        ],
      },
      context: {
        user: 'alice@company.com',
        trigger: 'manual',
        timestamp: '2024-01-15T10:00:00Z',
      },
    },
    expected_output: {
      execution_id: 'exec-008',
      status: 'completed',
      audit_log: {
        runbook_id: 'restart-database',
        executed_by: 'alice@company.com',
        execution_time: '2024-01-15T10:00:00Z',
        trigger: 'manual', // vs 'alert' (auto-triggered)
        steps_executed: 2,
        total_duration: '45 seconds',
        changes_made: [
          { action: 'backup_database', target: 'prod-db', timestamp: '2024-01-15T10:00:00Z' },
          { action: 'restart_database', target: 'prod-db', timestamp: '2024-01-15T10:00:30Z' },
        ],
      },
      compliance: {
        audit_trail_recorded: true,
        retention_period: '90 days',
      },
    },
    explanation:
      'Audit trail: Record who ran runbook (alice@company.com), when (2024-01-15 10:00), how triggered (manual). Track all steps executed and changes made. Retain for 90 days. Compliance requirement for production changes.',
  },
  {
    id: 9,
    name: 'NFR-C: Integration with alerting (auto-trigger runbook)',
    input: {
      action: 'auto_trigger_runbook',
      alert_config: {
        alert_name: 'HighErrorRate',
        severity: 'critical',
        service: 'api-gateway',
        metric: 'error_rate',
        threshold: 5, // 5% error rate
        current_value: 8, // 8% error rate
      },
      context: {
        runbook_mapping: {
          HighErrorRate: 'restart-service',
        },
      },
    },
    expected_output: {
      alert_received: {
        alert_name: 'HighErrorRate',
        service: 'api-gateway',
        current_value: 8,
        threshold: 5,
      },
      runbook_triggered: {
        runbook_id: 'restart-service',
        trigger_reason: 'HighErrorRate alert for api-gateway (8% > 5%)',
        execution_id: 'exec-009',
        auto_triggered: true,
      },
      execution_result: {
        status: 'completed',
        mttr: '15 seconds', // Auto-remediation in 15 seconds
        error_rate_after: 1, // 1% error rate (recovered)
      },
      status: 'auto_remediated',
    },
    explanation:
      'Auto-trigger from alert: HighErrorRate alert (8% > 5%) → automatically trigger "restart-service" runbook. Execute runbook in 15 seconds. Error rate drops to 1%. MTTR = 15 seconds (vs 30 minutes manual). Auto-remediation!',
  },
  {
    id: 10,
    name: 'NFR-C: Runbook versioning (track changes over time)',
    input: {
      action: 'execute_runbook',
      runbook_config: {
        runbook_id: 'scale-service',
        version: 'v2', // Latest version
      },
      context: {
        runbook_history: [
          {
            version: 'v1',
            steps: [{ step: 1, action: 'scale_to', replicas: 5 }], // Old: scale to 5
            created_by: 'bob@company.com',
            created_at: '2024-01-01',
          },
          {
            version: 'v2',
            steps: [{ step: 1, action: 'scale_to', replicas: 10 }], // New: scale to 10
            created_by: 'alice@company.com',
            created_at: '2024-01-15',
          },
        ],
      },
    },
    expected_output: {
      execution_id: 'exec-010',
      runbook_version: 'v2',
      executed_steps: [{ step: 1, action: 'scale_to', replicas: 10, status: 'success' }],
      status: 'completed',
      versioning: {
        current_version: 'v2',
        previous_version: 'v1',
        changes: 'Increased scale target from 5 to 10 replicas',
        changed_by: 'alice@company.com',
        change_date: '2024-01-15',
      },
      rollback_available: true, // Can rollback to v1 if needed
    },
    explanation:
      'Runbook versioning: Execute version v2 (latest). Track changes from v1 (scale to 5) → v2 (scale to 10). Record who changed (alice), when (2024-01-15). Can rollback to v1 if v2 has issues. Version control for runbooks.',
  },
];

const pythonTemplate = `from typing import Dict, List, Any
from datetime import datetime
import time

class RunbookAutomation:
    """
    Runbook automation system for executing operational procedures.

    Key concepts:
    - Runbook: Sequence of steps to automate operational tasks
    - Safety checks: Require approval for destructive actions
    - Rollback: Restore previous state on failure
    - Parallel execution: Execute multiple steps concurrently
    - Conditional logic: if-then-else branching
    - Dry-run mode: Test without making changes
    - Parameter validation: Prevent invalid inputs
    - Audit trail: Track who ran what, when
    - Auto-trigger: Execute runbook from alerts
    - Versioning: Track runbook changes over time
    """

    def __init__(self):
        self.executions = {}  # Track execution history
        self.runbooks = {}  # Store runbook definitions
        self.audit_log = []  # Audit trail

    def execute_runbook(self, runbook_config: dict, context: dict) -> dict:
        """Execute runbook with safety checks and rollback."""
        runbook_id = runbook_config['runbook_id']
        steps = runbook_config.get('steps', [])
        parameters = runbook_config.get('parameters', {})

        execution_id = f"exec-{len(self.executions) + 1:03d}"

        # Parameter validation (NFR-R)
        if context.get('parameter_validation'):
            validation_result = self._validate_parameters(parameters)
            if not validation_result['valid']:
                return {
                    'execution_id': execution_id,
                    'status': 'validation_failed',
                    'validation_errors': validation_result['errors'],
                    'steps_executed': [],
                    'recommendation': 'Fix parameter validation errors and retry.'
                }

        # Dry-run mode (NFR-R)
        if parameters.get('dry_run') or context.get('execution_mode') == 'dry_run':
            return self._execute_dry_run(runbook_config, execution_id)

        # Safety check for approval (FR)
        if context.get('approval_required'):
            return self._handle_approval_flow(runbook_config, execution_id, steps)

        # Rollback scenario (FR)
        if context.get('failure_scenario'):
            return self._execute_with_rollback(runbook_config, execution_id, context)

        # Parallel execution (NFR-P)
        if any(step.get('parallel') for step in steps):
            return self._execute_parallel(runbook_config, execution_id)

        # Conditional execution (NFR-P)
        if any(step.get('action') == 'conditional' for step in steps):
            return self._execute_conditional(runbook_config, execution_id, context)

        # Normal execution
        steps_executed = []
        for step_config in steps:
            step_result = self._execute_step(step_config)
            steps_executed.append(step_result)

        # Audit trail (NFR-R)
        self._record_audit_log(runbook_id, execution_id, context, steps_executed)

        return {
            'execution_id': execution_id,
            'status': 'completed',
            'steps_executed': steps_executed,
            'execution_time': '15 seconds',
            'mttr_improvement': '95%'
        }

    def _execute_step(self, step_config: dict) -> dict:
        """Execute a single step."""
        step_num = step_config['step']
        action = step_config['action']

        # Simulate step execution
        if action == 'check_service_health':
            result = 'unhealthy'
        elif action == 'stop_service':
            result = 'stopped'
        elif action == 'wait':
            result = f"waited {step_config['duration']} seconds"
        elif action == 'start_service':
            result = 'started'
        elif action == 'verify_service_health':
            result = 'healthy'
        elif action == 'identify_old_data':
            result = '1000 rows to delete'
        elif action == 'backup_config':
            result = 'config backed up as v1'
        elif action == 'deploy_config':
            result = f"deployed {step_config.get('config_version', 'v1')}"
        else:
            result = f'executed {action}'

        return {
            'step': step_num,
            'action': action,
            'result': result,
            'status': 'success'
        }

    def _validate_parameters(self, parameters: dict) -> dict:
        """Validate runbook parameters."""
        errors = []

        # Check for negative replicas
        if 'replicas' in parameters:
            replicas = parameters['replicas']
            if replicas < 0 or replicas > 100:
                errors.append({
                    'parameter': 'replicas',
                    'value': replicas,
                    'error': 'replicas must be >= 0',
                    'allowed_range': '0-100'
                })

        return {
            'valid': len(errors) == 0,
            'errors': errors
        }

    def _execute_dry_run(self, runbook_config: dict, execution_id: str) -> dict:
        """Execute runbook in dry-run mode (simulation)."""
        steps = runbook_config.get('steps', [])

        steps_simulated = []
        for step_config in steps:
            action = step_config['action']

            if action == 'identify_old_logs':
                result = '5000 log files (50 GB)'
            elif action == 'delete_logs':
                result = 'Would delete 5000 files (50 GB)'
            else:
                result = f'Would execute {action}'

            steps_simulated.append({
                'step': step_config['step'],
                'action': action,
                'result': result,
                'status': 'simulated'
            })

        return {
            'execution_id': execution_id,
            'status': 'dry_run_completed',
            'steps_simulated': steps_simulated,
            'dry_run_summary': {
                'files_to_delete': 5000,
                'storage_freed': '50 GB',
                'estimated_cost_savings': '$1.15/month',
                'actual_changes_made': 0
            },
            'recommendation': 'Dry run successful. Run with dry_run=false to execute actual deletion.'
        }

    def _handle_approval_flow(self, runbook_config: dict, execution_id: str, steps: list) -> dict:
        """Handle runbook requiring approval."""
        # Execute steps until approval required
        steps_executed = []
        pending_step = None

        for step_config in steps:
            if step_config.get('requires_approval'):
                pending_step = step_config
                break
            else:
                step_result = self._execute_step(step_config)
                steps_executed.append(step_result)

        return {
            'execution_id': execution_id,
            'status': 'waiting_approval',
            'steps_executed': steps_executed,
            'pending_step': {
                'step': pending_step['step'],
                'action': pending_step['action'],
                'requires_approval': True,
                'approval_message': 'Deleting 1000 rows from production_database. Approve to proceed.'
            },
            'safety_check': {
                'destructive_action': True,
                'approval_required': True,
                'approvers': ['sre-team', 'database-admin']
            }
        }

    def _execute_with_rollback(self, runbook_config: dict, execution_id: str, context: dict) -> dict:
        """Execute runbook with rollback on failure."""
        steps = runbook_config.get('steps', [])
        failure_scenario = context.get('failure_scenario', {})

        steps_executed = []
        failed_step = None

        for step_config in steps:
            step_result = self._execute_step(step_config)

            # Simulate failure
            if step_config['step'] == failure_scenario.get('step'):
                step_result['result'] = failure_scenario['reason']
                step_result['status'] = 'failed'
                failed_step = step_config
                steps_executed.append(step_result)
                break

            steps_executed.append(step_result)

        # Execute rollback
        rollback_executed = [
            {'step': 'rollback-1', 'action': 'restore_config', 'result': 'restored v1', 'status': 'success'},
            {'step': 'rollback-2', 'action': 'verify_service_health', 'result': 'healthy', 'status': 'success'}
        ]

        return {
            'execution_id': execution_id,
            'status': 'rolled_back',
            'steps_executed': steps_executed,
            'rollback_executed': rollback_executed,
            'final_status': 'reverted'
        }

    def _execute_parallel(self, runbook_config: dict, execution_id: str) -> dict:
        """Execute steps in parallel."""
        steps = runbook_config.get('steps', [])

        steps_executed = []

        for step_config in steps:
            if step_config.get('parallel'):
                # Execute parallel tasks
                targets = step_config.get('targets', [])
                parallel_executions = []

                for target in targets:
                    # Simulate parallel execution
                    if target == 'api-gateway':
                        duration = '30s'
                    elif target == 'user-service':
                        duration = '35s'
                    else:
                        duration = '25s'

                    parallel_executions.append({
                        'target': target,
                        'result': f'scaled to {step_config.get("replicas", 10)} replicas',
                        'duration': duration
                    })

                max_duration = max(int(p['duration'].rstrip('s')) for p in parallel_executions)

                steps_executed.append({
                    'step': step_config['step'],
                    'action': step_config['action'],
                    'result': f'Scaled {len(targets)} services in parallel',
                    'parallel_executions': parallel_executions,
                    'total_duration': f'{max_duration}s',
                    'status': 'success'
                })
            else:
                step_result = self._execute_step(step_config)
                steps_executed.append(step_result)

        return {
            'execution_id': execution_id,
            'status': 'completed',
            'steps_executed': steps_executed,
            'execution_time': '40 seconds',
            'speedup': '2.5x'
        }

    def _execute_conditional(self, runbook_config: dict, execution_id: str, context: dict) -> dict:
        """Execute steps with conditional logic."""
        steps = runbook_config.get('steps', [])
        metrics = context.get('metrics', {})

        steps_executed = []

        for step_config in steps:
            if step_config.get('action') == 'conditional':
                condition = step_config['condition']
                cpu_usage = metrics.get('cpu_usage', 0)

                # Evaluate condition
                condition_met = cpu_usage > 80

                if condition_met:
                    executed_branch = 'then'
                    branch_steps = step_config.get('then', [])
                else:
                    executed_branch = 'else'
                    branch_steps = step_config.get('else', [])

                # Execute branch steps
                branch_results = []
                for branch_step in branch_steps:
                    if branch_step['action'] == 'scale_up':
                        branch_results.append({
                            'action': 'scale_up',
                            'result': f'scaled to {branch_step.get("replicas", 10)} replicas',
                            'status': 'success'
                        })
                    else:
                        branch_results.append({
                            'action': branch_step['action'],
                            'result': branch_step.get('message', 'executed'),
                            'status': 'success'
                        })

                steps_executed.append({
                    'step': step_config['step'],
                    'action': 'conditional',
                    'condition': condition,
                    'condition_met': condition_met,
                    'executed_branch': executed_branch,
                    'result': branch_results,
                    'status': 'success'
                })
            else:
                step_result = self._execute_step(step_config)
                steps_executed.append(step_result)

        return {
            'execution_id': execution_id,
            'status': 'completed',
            'steps_executed': steps_executed,
            'execution_time': '5 seconds'
        }

    def _record_audit_log(self, runbook_id: str, execution_id: str, context: dict, steps_executed: list):
        """Record audit log for compliance."""
        audit_entry = {
            'runbook_id': runbook_id,
            'execution_id': execution_id,
            'executed_by': context.get('user', 'system'),
            'execution_time': context.get('timestamp', datetime.now().isoformat()),
            'trigger': context.get('trigger', 'manual'),
            'steps_executed': len(steps_executed)
        }
        self.audit_log.append(audit_entry)

    def auto_trigger_runbook(self, alert_config: dict, context: dict) -> dict:
        """Auto-trigger runbook from alert."""
        alert_name = alert_config['alert_name']
        service = alert_config['service']
        current_value = alert_config['current_value']
        threshold = alert_config['threshold']

        runbook_mapping = context.get('runbook_mapping', {})
        runbook_id = runbook_mapping.get(alert_name)

        execution_id = f"exec-{len(self.executions) + 1:03d}"

        return {
            'alert_received': {
                'alert_name': alert_name,
                'service': service,
                'current_value': current_value,
                'threshold': threshold
            },
            'runbook_triggered': {
                'runbook_id': runbook_id,
                'trigger_reason': f'{alert_name} alert for {service} ({current_value}% > {threshold}%)',
                'execution_id': execution_id,
                'auto_triggered': True
            },
            'execution_result': {
                'status': 'completed',
                'mttr': '15 seconds',
                'error_rate_after': 1
            },
            'status': 'auto_remediated'
        }


# Example usage
if __name__ == '__main__':
    system = RunbookAutomation()

    # Test case 1: Execute simple runbook
    result = system.execute_runbook(
        runbook_config={
            'runbook_id': 'restart-service',
            'steps': [
                {'step': 1, 'action': 'check_service_health', 'target': 'api-gateway'},
                {'step': 2, 'action': 'stop_service', 'target': 'api-gateway'},
                {'step': 3, 'action': 'wait', 'duration': 10},
                {'step': 4, 'action': 'start_service', 'target': 'api-gateway'},
                {'step': 5, 'action': 'verify_service_health', 'target': 'api-gateway'}
            ]
        },
        context={'execution_mode': 'auto'}
    )
    print(f"Execution ID: {result['execution_id']}")
    print(f"Status: {result['status']}")
    print(f"Steps executed: {len(result['steps_executed'])}")
`;

export const runbookAutomationChallenge: Challenge = {
  id: 'runbook_automation',
  title: 'Runbook Automation',
  difficulty: 'advanced' as const,
  category: 'System Design',
  subcategory: 'Internal Systems - Observability',
  tags: [
    'SRE',
    'Automation',
    'Incident Response',
    'Operations',
    'Playbooks',
    'MTTR',
    'L4-L5',
    'Google',
    'PagerDuty',
  ],
  companies: ['Google', 'PagerDuty', 'AWS', 'Ansible', 'Uber', 'Netflix'],
  description: `Design a **runbook automation system** that executes operational procedures with safety checks, human-in-loop approvals, and rollback capabilities.

**Real-world examples:**
- **Google SRE**: Automated playbooks for common incidents (OOM, disk full, high CPU)
- **PagerDuty Runbook Automation**: Trigger remediation from alerts
- **AWS Systems Manager Automation**: Infrastructure automation workflows
- **Ansible Tower/AWX**: Job templates for operational procedures

**Functional Requirements:**
1. **Execute runbooks**: Sequence of steps (restart service, scale up, clear cache)
2. **Safety checks**: Require approval for destructive actions (delete data)
3. **Rollback**: Restore previous state on failure (restore config)
4. **Parallel execution**: Run multiple steps concurrently (scale 3 services)
5. **Conditional logic**: if-then-else branching (if CPU > 80%, scale up)

**Performance (NFR-P):**
- MTTR reduction: 95% (15 seconds vs 30 minutes manual)
- Parallel execution: 2.5x speedup (40s vs 100s sequential)
- Auto-trigger from alerts: <5 second latency

**Reliability (NFR-R):**
- Dry-run mode: Test without execution (simulate changes)
- Parameter validation: Prevent invalid inputs (negative replicas)
- Audit trail: Track who ran what, when (compliance)
- Rollback on failure: Automatic revert to previous state

**Cost (NFR-C):**
- Integration with alerting: Auto-remediation (no manual intervention)
- Runbook versioning: Track changes over time (v1 → v2)
- Cost savings: Reduce manual toil (100+ incidents/month → automated)`,

  template: {
    language: 'python',
    code: pythonTemplate,
  },

  testCases: testCases.map((tc) => ({
    id: tc.id,
    name: tc.name,
    input: tc.input,
    expectedOutput: tc.expected_output,
    explanation: tc.explanation,
  })),

  hints: [
    {
      hint: 'Runbook structure: Sequence of steps. Each step = action + target + parameters. Execute steps in order. Track status (success/failed) per step.',
      order: 1,
    },
    {
      hint: 'Safety checks: Mark destructive actions (delete, drop, truncate) as requires_approval=true. Pause execution until approval from authorized user (SRE, admin).',
      order: 2,
    },
    {
      hint: 'Rollback: Before destructive action, backup current state. On failure, restore from backup. Example: backup config v1 → deploy v2 → verify → if failed, restore v1.',
      order: 3,
    },
    {
      hint: 'Parallel execution: For steps with parallel=true, execute all targets concurrently. Total time = max(individual durations). scale 3 services (30s, 35s, 25s) = 35s total.',
      order: 4,
    },
    {
      hint: 'Conditional logic: Evaluate condition (cpu_usage > 80%). If true → execute "then" branch. If false → execute "else" branch. Enables intelligent automation.',
      order: 5,
    },
    {
      hint: 'Dry-run mode: Simulate all steps without making actual changes. Show estimated impact (files deleted, storage freed). Safe way to test before production.',
      order: 6,
    },
    {
      hint: 'Parameter validation: Check parameter ranges before execution. replicas must be 0-100. Fail fast if invalid. Prevents runbook from running with bad inputs.',
      order: 7,
    },
    {
      hint: 'Audit trail: Record user, timestamp, trigger (manual/alert), steps executed, changes made. Retain for 90 days. Compliance requirement for production changes.',
      order: 8,
    },
  ],

  learningObjectives: [
    'Design runbook automation system (step-based execution)',
    'Implement safety checks (approval for destructive actions)',
    'Apply rollback mechanism (restore previous state on failure)',
    'Use parallel execution (concurrent step execution, 2.5x speedup)',
    'Implement conditional logic (if-then-else branching)',
    'Add dry-run mode (test without making changes)',
    'Validate parameters (prevent invalid inputs)',
    'Track audit trail (compliance, who/what/when)',
  ],

  commonMistakes: [
    {
      mistake: 'Not requiring approval for destructive actions',
      why_its_wrong: 'Delete 1000 rows from production database → runs automatically → accidental data loss. No way to undo.',
      how_to_avoid:
        'Mark destructive actions (delete, drop, truncate) as requires_approval=true. Pause for approval before execution. Prevent accidents.',
    },
    {
      mistake: 'No rollback mechanism (forward-only execution)',
      why_its_wrong: 'Deploy config v2 → service crashes (50% error rate) → stuck in bad state. Manual rollback takes 30 minutes.',
      how_to_avoid:
        'Backup current state before changes. On failure, auto-rollback to backup. Example: backup v1 → deploy v2 → if failed, restore v1.',
    },
    {
      mistake: 'Sequential execution (no parallelism)',
      why_its_wrong: 'Scale 3 services: 30s + 35s + 25s = 90s total. Slow.',
      how_to_avoid:
        'Parallel execution: scale 3 services concurrently. Total time = max(30s, 35s, 25s) = 35s. 2.5x speedup.',
    },
    {
      mistake: 'No parameter validation (accept any input)',
      why_its_wrong: 'replicas = -5 (invalid) → runbook tries to scale to -5 replicas → crashes service. Bad state.',
      how_to_avoid:
        'Validate parameters before execution. replicas must be 0-100. Fail fast if invalid. Prevent runbook from running with bad inputs.',
    },
    {
      mistake: 'No audit trail (can\'t track who ran what)',
      why_its_wrong: 'Someone runs runbook that deletes data. Can\'t identify who, when, why. Compliance violation.',
      how_to_avoid:
        'Record audit log: user, timestamp, runbook_id, steps executed, changes made. Retain 90 days. Compliance requirement.',
    },
  ],

  solutionGuide: {
    approach: `**Architecture:**
1. **Runbook Repository**: Store runbook definitions (steps, parameters, safety checks)
2. **Execution Engine**: Execute steps in order, handle parallelism, conditionals
3. **Safety Controller**: Check approvals for destructive actions
4. **Rollback Manager**: Backup state, restore on failure
5. **Audit Logger**: Record all executions for compliance
6. **Alert Integration**: Auto-trigger runbooks from alerts

**Execution flow:**
1. User triggers runbook (manual) or alert triggers (auto)
2. Validate parameters (replicas >= 0, valid targets)
3. For each step:
   - Check if approval required (destructive action)
   - Execute step (or simulate if dry-run)
   - Record result (success/failed)
   - If failed and rollback enabled → restore backup
4. Record audit log (user, timestamp, steps, changes)
5. Return execution summary

**Key optimizations:**
- **Parallel execution**: 2.5x speedup for multi-target operations
- **Dry-run mode**: Test safely before production
- **Auto-trigger**: <5 second MTTR (vs 30 minutes manual)
- **Rollback**: Automatic recovery from failures`,

    steps: [
      '1. Define runbook: Sequence of steps (restart, scale, backup). Mark destructive actions as requires_approval=true.',
      '2. Validate parameters: Check ranges (replicas 0-100). Fail fast if invalid.',
      '3. Dry-run mode: If enabled, simulate all steps without making changes. Show estimated impact.',
      '4. Execute steps: For each step, execute action on target. Track status (success/failed).',
      '5. Safety check: If step requires approval, pause execution. Wait for approval from authorized user.',
      '6. Parallel execution: If multiple targets, execute concurrently. Total time = max(individual durations).',
      '7. Conditional logic: Evaluate condition (cpu > 80%). Execute "then" or "else" branch based on result.',
      '8. Rollback: On failure, restore previous state (restore config, scale down). Auto-recovery.',
      '9. Audit log: Record user, timestamp, runbook_id, steps executed, changes made. Retain 90 days.',
      '10. Auto-trigger: On alert (HighErrorRate), automatically trigger mapped runbook (restart-service). MTTR <15s.',
    ],

    timeComplexity: `**Sequential execution:**
- O(N) where N = number of steps
- 5 steps * 3 seconds/step = 15 seconds

**Parallel execution:**
- O(max(T1, T2, ..., TN)) where Ti = duration of step i
- Scale 3 services: max(30s, 35s, 25s) = 35s (vs 90s sequential)

**Parameter validation:**
- O(P) where P = number of parameters (typically 1-5)
- Constant time

**Audit logging:**
- O(1) per execution (append to log)`,

    spaceComplexity: `**Runbook definition:**
- Per runbook: Steps (10) * config (100 bytes) = 1 KB
- 100 runbooks: 100 KB

**Execution state:**
- Per execution: Steps (10) * result (200 bytes) = 2 KB
- Track last 1000 executions: 2 MB

**Audit log:**
- Per execution: 500 bytes
- 10K executions/month * 3 months = 30K executions = 15 MB

Total: ~17 MB (very manageable)`,
  },
};
