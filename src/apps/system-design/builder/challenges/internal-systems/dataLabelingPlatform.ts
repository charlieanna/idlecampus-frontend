import type { Challenge } from '../../types';

/**
 * L4-L5 Internal Systems Problem: Data Labeling Platform
 *
 * Real-world examples:
 * - Amazon SageMaker Ground Truth: Active learning + automatic labeling
 * - Google Cloud AI Platform Data Labeling: Human labeling with quality control
 * - Scale AI: Data labeling as a service with quality guarantees
 * - Labelbox: Annotation platform with workflow management
 *
 * Company context:
 * Your ML team needs to label 1M images for object detection (bounding boxes).
 * Budget: $50K ($0.05 per label). Need 99% accuracy with quality control.
 * 100 annotators with varying skill levels (accuracy: 80% - 99%).
 * Tight deadline: 3 months (11K labels/day required).
 *
 * Problem:
 * Design a data labeling platform that assigns tasks, measures quality (inter-annotator
 * agreement), and optimizes cost using active learning and consensus voting.
 */

const testCases = [
  {
    id: 1,
    name: 'FR: Assign labeling tasks to annotators',
    input: {
      action: 'assign_tasks',
      task_config: {
        dataset: 'dog_images',
        task_type: 'bounding_box',
        total_samples: 1000,
        annotators: [
          { id: 'ann1', skill_level: 'expert', accuracy: 0.99 },
          { id: 'ann2', skill_level: 'intermediate', accuracy: 0.95 },
          { id: 'ann3', skill_level: 'novice', accuracy: 0.85 },
        ],
      },
      context: {
        assignment_strategy: 'skill_based',
      },
    },
    expected_output: {
      assignments: [
        { annotator: 'ann1', sample_count: 333, difficulty: 'hard' }, // Expert gets hard samples
        { annotator: 'ann2', sample_count: 333, difficulty: 'medium' },
        { annotator: 'ann3', sample_count: 334, difficulty: 'easy' }, // Novice gets easy samples
      ],
      total_assigned: 1000,
      assignment_strategy: 'skill_based',
      status: 'assigned',
    },
    explanation:
      'Task assignment: Match annotator skill to sample difficulty. Expert annotators get hard samples (ambiguous images). Novice annotators get easy samples (clear images). This maximizes quality and throughput.',
  },
  {
    id: 2,
    name: 'FR: Quality control via inter-annotator agreement',
    input: {
      action: 'measure_quality',
      quality_config: {
        sample_id: 'img001',
        annotations: [
          { annotator: 'ann1', label: 'dog', bounding_box: { x: 100, y: 100, width: 200, height: 200 } },
          { annotator: 'ann2', label: 'dog', bounding_box: { x: 105, y: 98, width: 198, height: 205 } },
          { annotator: 'ann3', label: 'cat', bounding_box: { x: 150, y: 150, width: 100, height: 100 } },
        ],
      },
      context: {
        iou_threshold: 0.7, // Intersection over Union threshold
      },
    },
    expected_output: {
      agreement_metrics: {
        label_agreement: 0.667, // 2 of 3 agree on "dog" (67%)
        bbox_agreement: 0.5, // Only ann1 and ann2 have IoU > 0.7 (50%)
        consensus_label: 'dog', // Majority vote
        consensus_bbox: { x: 102.5, y: 99, width: 199, height: 202.5 }, // Average of ann1 and ann2
      },
      quality_score: 0.667, // Based on label agreement
      status: 'low_agreement', // <0.8 agreement threshold
      action: 'request_additional_annotation', // Get 4th opinion
    },
    explanation:
      'Inter-annotator agreement: 2 of 3 annotators agree on "dog" label (67%). Bounding boxes of ann1 and ann2 have high IoU (overlap). Ann3 disagrees (labeled "cat"). Low agreement → request additional annotation.',
  },
  {
    id: 3,
    name: 'FR: Consensus voting for final label',
    input: {
      action: 'compute_consensus',
      consensus_config: {
        sample_id: 'img002',
        annotations: [
          { annotator: 'ann1', label: 'dog', confidence: 0.9 },
          { annotator: 'ann2', label: 'dog', confidence: 0.95 },
          { annotator: 'ann3', label: 'dog', confidence: 0.85 },
        ],
        voting_method: 'majority',
      },
      context: {},
    },
    expected_output: {
      consensus_label: 'dog',
      confidence: 0.9, // Average of 3 annotators
      agreement: 1.0, // 100% agreement (all 3 agree)
      voting_method: 'majority',
      votes: { dog: 3, cat: 0 },
      status: 'high_confidence',
    },
    explanation:
      'Consensus voting: All 3 annotators agree on "dog" (100% agreement). Use majority vote to determine final label. Average confidence = 0.9. High agreement → high quality label.',
  },
  {
    id: 4,
    name: 'NFR-P: Active learning (prioritize uncertain samples)',
    input: {
      action: 'select_active_learning_samples',
      active_learning_config: {
        model_predictions: [
          { sample_id: 'img003', predicted_label: 'dog', confidence: 0.55 }, // Uncertain
          { sample_id: 'img004', predicted_label: 'cat', confidence: 0.98 }, // Confident
          { sample_id: 'img005', predicted_label: 'dog', confidence: 0.52 }, // Uncertain
        ],
        selection_strategy: 'uncertainty_sampling',
        budget: 2, // Label 2 samples
      },
      context: {
        uncertainty_threshold: 0.6, // Confidence < 0.6 = uncertain
      },
    },
    expected_output: {
      selected_samples: ['img003', 'img005'], // Low confidence samples
      selection_rationale: {
        img003: 'confidence 0.55 < 0.6 threshold (uncertain)',
        img005: 'confidence 0.52 < 0.6 threshold (uncertain)',
      },
      skipped_samples: ['img004'], // High confidence (0.98) → skip labeling
      cost_savings: {
        total_samples: 3,
        labeled_samples: 2,
        savings_percent: 33, // Label only 67% of samples (save 33%)
      },
      status: 'selected',
    },
    explanation:
      'Active learning: Prioritize uncertain samples (confidence < 0.6). img003 (0.55) and img005 (0.52) are uncertain → send for labeling. img004 (0.98) is confident → skip labeling. Save 33% labeling cost.',
  },
  {
    id: 5,
    name: 'NFR-P: Track annotator performance (accuracy, throughput)',
    input: {
      action: 'track_annotator_performance',
      performance_config: {
        annotator_id: 'ann1',
        time_window: 'last_7_days',
      },
      context: {
        gold_standard_samples: [
          { sample_id: 'img001', annotator_label: 'dog', ground_truth: 'dog' }, // Correct
          { sample_id: 'img002', annotator_label: 'dog', ground_truth: 'dog' }, // Correct
          { sample_id: 'img003', annotator_label: 'cat', ground_truth: 'dog' }, // Incorrect
          { sample_id: 'img004', annotator_label: 'dog', ground_truth: 'dog' }, // Correct
        ],
        throughput_data: {
          tasks_completed: 1000,
          time_spent_hours: 40, // 40 hours over 7 days
        },
      },
    },
    expected_output: {
      performance_metrics: {
        accuracy: 0.75, // 3 of 4 correct (75%)
        throughput: 25, // 1000 tasks / 40 hours = 25 tasks/hour
        quality_tier: 'intermediate', // 75% accuracy → intermediate tier
      },
      comparison_to_average: {
        accuracy: {
          annotator: 0.75,
          average: 0.85,
          delta: -0.10, // 10% below average
        },
        throughput: {
          annotator: 25,
          average: 20,
          delta: 5, // 25% faster than average
        },
      },
      recommendation: 'Provide feedback on accuracy (10% below average). Consider additional training.',
      status: 'tracked',
    },
    explanation:
      'Annotator performance: Accuracy = 75% (3 of 4 correct on gold standard). Throughput = 25 tasks/hour. 10% below average accuracy → provide feedback. 25% faster than average → good throughput.',
  },
  {
    id: 6,
    name: 'NFR-S: Handle high-volume labeling (1M samples)',
    input: {
      action: 'plan_labeling_campaign',
      campaign_config: {
        total_samples: 1_000_000,
        deadline_days: 90, // 3 months
        annotators_available: 100,
      },
      context: {
        tasks_per_hour_per_annotator: 20,
        work_hours_per_day: 8,
      },
    },
    expected_output: {
      capacity_analysis: {
        required_tasks_per_day: 11_111, // 1M / 90 days
        annotator_capacity_per_day: 16_000, // 100 * 8 * 20 = 16K tasks/day
        capacity_sufficient: true, // 16K > 11K required
        utilization: 0.69, // 11K / 16K = 69% utilization
      },
      optimization: {
        strategy: 'active_learning',
        unlabeled_samples: 1_000_000,
        labeled_samples_needed: 500_000, // Active learning reduces by 50%
        cost_savings: '$25K', // 500K * $0.05 = $25K savings
      },
      status: 'feasible',
    },
    explanation:
      'High-volume labeling: 1M samples / 90 days = 11K tasks/day required. 100 annotators * 8 hours * 20 tasks/hour = 16K tasks/day capacity. Capacity sufficient (69% utilization). Active learning reduces to 500K samples (save $25K).',
  },
  {
    id: 7,
    name: 'NFR-R: Handle annotator disagreement (conflict resolution)',
    input: {
      action: 'resolve_conflict',
      conflict_config: {
        sample_id: 'img006',
        annotations: [
          { annotator: 'ann1', label: 'dog', skill_level: 'expert', accuracy: 0.99 },
          { annotator: 'ann2', label: 'cat', skill_level: 'intermediate', accuracy: 0.90 },
          { annotator: 'ann3', label: 'dog', skill_level: 'novice', accuracy: 0.80 },
        ],
      },
      context: {
        conflict_resolution_strategy: 'weighted_voting',
      },
    },
    expected_output: {
      conflict_detected: true,
      votes: { dog: 2, cat: 1 }, // 2 vote dog, 1 votes cat
      weighted_votes: {
        dog: 1.79, // (0.99 + 0.80) = 1.79
        cat: 0.90, // 0.90
      },
      final_label: 'dog', // Weighted vote: dog wins (1.79 > 0.90)
      resolution_strategy: 'weighted_voting',
      explanation: `Expert + novice vote "dog" (weighted 1.79) > intermediate votes "cat" (0.90)',
      status: 'resolved',
    },
    explanation:
      'Conflict resolution: 2 annotators vote "dog" (expert + novice), 1 votes "cat" (intermediate). Use weighted voting by accuracy. Dog: 0.99 + 0.80 = 1.79. Cat: 0.90. Dog wins.',
  },
  {
    id: 8,
    name: 'NFR-R: Gold standard validation (periodic quality checks)',
    input: {
      action: 'inject_gold_standard',
      gold_standard_config: {
        frequency: 0.1, // 10% of tasks are gold standard
        total_tasks: 1000,
      },
      context: {
        gold_standard_pool: [
          { sample_id: 'gold001', ground_truth: 'dog', difficulty: 'easy' },
          { sample_id: 'gold002', ground_truth: 'cat', difficulty: 'medium' },
          { sample_id: 'gold003', ground_truth: 'dog', difficulty: 'hard' },
        ],
      },
    },
    expected_output: {
      gold_standard_injected: true,
      injection_count: 100, // 10% of 1000 tasks
      injection_strategy: {
        method: 'random_insertion',
        visibility: 'hidden', // Annotators don't know which are gold standard
        purpose: 'Measure annotator accuracy without bias',
      },
      quality_monitoring: {
        frequency: '10% of tasks',
        action_on_failure: 'Remove low-performing annotators (accuracy < 80%)',
      },
      status: 'injected',
    },
    explanation:
      'Gold standard validation: Inject 10% gold standard samples (100 of 1000 tasks). Annotators don\'t know which are gold standard (hidden). Measure accuracy. Remove annotators with <80% accuracy.',
  },
  {
    id: 9,
    name: 'NFR-C: Cost optimization (consensus vs individual labeling)',
    input: {
      action: 'optimize_labeling_cost',
      cost_config: {
        total_samples: 10_000,
        cost_per_label: 0.05, // $0.05 per label
        quality_target: 0.99, // 99% accuracy
      },
      context: {
        strategies: [
          { name: 'single_annotator', annotators_per_sample: 1, accuracy: 0.90, cost_per_sample: 0.05 },
          { name: 'consensus_3', annotators_per_sample: 3, accuracy: 0.97, cost_per_sample: 0.15 },
          { name: 'consensus_5', annotators_per_sample: 5, accuracy: 0.99, cost_per_sample: 0.25 },
        ],
      },
    },
    expected_output: {
      selected_strategy: 'consensus_5',
      rationale: 'Only consensus_5 meets 99% accuracy target',
      cost_analysis: {
        single_annotator: { cost: '$500', accuracy: 0.90, meets_target: false },
        consensus_3: { cost: '$1,500', accuracy: 0.97, meets_target: false },
        consensus_5: { cost: '$2,500', accuracy: 0.99, meets_target: true },
      },
      total_cost: '$2,500',
      cost_vs_quality_tradeoff: 'Pay 5x more ($2.5K vs $500) to achieve 99% accuracy (vs 90%)',
      status: 'optimized',
    },
    explanation:
      'Cost optimization: Single annotator = $500 but only 90% accuracy. Consensus (3 annotators) = $1.5K but 97% accuracy. Consensus (5 annotators) = $2.5K and 99% accuracy. Choose consensus_5 to meet target.',
  },
  {
    id: 10,
    name: 'NFR-C: Automatic labeling (model-assisted)',
    input: {
      action: 'apply_automatic_labeling',
      auto_labeling_config: {
        total_samples: 100_000,
        model_confidence_threshold: 0.95, // Auto-label if confidence > 95%
      },
      context: {
        model_predictions: {
          high_confidence: 60_000, // 60K samples with confidence > 0.95
          low_confidence: 40_000, // 40K samples with confidence < 0.95
        },
        cost_per_label: 0.05,
      },
    },
    expected_output: {
      automatic_labeling_applied: true,
      auto_labeled_samples: 60_000, // High confidence samples
      human_labeled_samples: 40_000, // Low confidence samples
      cost_savings: {
        without_auto_labeling: '$5,000', // 100K * $0.05
        with_auto_labeling: '$2,000', // 40K * $0.05
        savings: '$3,000', // 60% cost reduction
        savings_percent: 60,
      },
      quality_estimate: {
        auto_labeled_accuracy: 0.98, // High confidence → 98% accuracy
        human_labeled_accuracy: 0.99, // Human labeling → 99% accuracy
        blended_accuracy: 0.984, // (60K * 0.98 + 40K * 0.99) / 100K
      },
      status: 'applied',
    },
    explanation:
      'Automatic labeling: Model auto-labels 60K high-confidence samples (>95%). Human labels 40K low-confidence samples. Save $3K (60% cost reduction). Blended accuracy = 98.4%.',
  },
];

const pythonTemplate = `from typing import Dict, List, Any
from collections import defaultdict

class DataLabelingPlatform:
    """
    Data labeling platform with task assignment, quality control, and cost optimization.

    Key concepts:
    - Task assignment: Match annotator skill to sample difficulty
    - Inter-annotator agreement: Measure consensus (IoU for bounding boxes)
    - Consensus voting: Majority vote or weighted vote (by accuracy)
    - Active learning: Prioritize uncertain samples (confidence < 0.6)
    - Annotator performance: Accuracy (vs gold standard), throughput (tasks/hour)
    - Conflict resolution: Weighted voting by annotator accuracy
    - Gold standard validation: Inject 10% known samples for quality checks
    - Cost optimization: Consensus (5 annotators) vs single annotator
    - Automatic labeling: Model auto-labels high-confidence samples (>95%)
    """

    def __init__(self):
        self.annotators = {}  # Annotator profiles (skill, accuracy)
        self.assignments = {}  # Task assignments
        self.annotations = defaultdict(list)  # Annotations per sample
        self.gold_standard = {}  # Gold standard samples

    def assign_tasks(self, task_config: dict, context: dict) -> dict:
        """Assign labeling tasks to annotators based on skill."""
        total_samples = task_config['total_samples']
        annotators = task_config['annotators']

        # Skill-based assignment
        assignments = []
        samples_per_annotator = total_samples // len(annotators)

        for i, annotator in enumerate(annotators):
            sample_count = samples_per_annotator
            # Last annotator gets remaining samples
            if i == len(annotators) - 1:
                sample_count = total_samples - (samples_per_annotator * i)

            # Match difficulty to skill level
            difficulty_map = {
                'expert': 'hard',
                'intermediate': 'medium',
                'novice': 'easy'
            }
            difficulty = difficulty_map.get(annotator['skill_level'], 'medium')

            assignments.append({
                'annotator': annotator['id'],
                'sample_count': sample_count,
                'difficulty': difficulty
            })

        return {
            'assignments': assignments,
            'total_assigned': total_samples,
            'assignment_strategy': context.get('assignment_strategy', 'skill_based'),
            'status': 'assigned'
        }

    def measure_quality(self, quality_config: dict, context: dict) -> dict:
        """Measure inter-annotator agreement."""
        sample_id = quality_config['sample_id']
        annotations = quality_config['annotations']

        # Label agreement: Count majority label
        labels = [ann['label'] for ann in annotations]
        label_counts = {}
        for label in labels:
            label_counts[label] = label_counts.get(label, 0) + 1

        consensus_label = max(label_counts.items(), key=lambda x: x[1])[0]
        label_agreement = label_counts[consensus_label] / len(annotations)

        # Bounding box agreement: IoU > threshold
        iou_threshold = context.get('iou_threshold', 0.7)
        bbox_agreements = 0
        for i, ann1 in enumerate(annotations):
            for j, ann2 in enumerate(annotations[i+1:], i+1):
                if ann1['label'] == ann2['label']:
                    iou = self._calculate_iou(ann1['bounding_box'], ann2['bounding_box'])
                    if iou > iou_threshold:
                        bbox_agreements += 1

        total_pairs = len(annotations) * (len(annotations) - 1) // 2
        bbox_agreement = bbox_agreements / total_pairs if total_pairs > 0 else 0

        # Consensus bounding box: Average of agreeing annotators
        consensus_bbox = self._average_bbox([
            ann['bounding_box'] for ann in annotations
            if ann['label'] == consensus_label
        ])

        quality_score = label_agreement

        # Determine status
        if quality_score >= 0.8:
            status = 'high_agreement'
            action = 'accept_label'
        else:
            status = 'low_agreement'
            action = 'request_additional_annotation'

        return {
            'agreement_metrics': {
                'label_agreement': round(label_agreement, 3),
                'bbox_agreement': bbox_agreement,
                'consensus_label': consensus_label,
                'consensus_bbox': consensus_bbox
            },
            'quality_score': round(quality_score, 3),
            'status': status,
            'action': action
        }

    def compute_consensus(self, consensus_config: dict, context: dict) -> dict:
        """Compute consensus label using voting."""
        annotations = consensus_config['annotations']
        voting_method = consensus_config.get('voting_method', 'majority')

        # Count votes
        votes = {}
        total_confidence = 0
        for ann in annotations:
            label = ann['label']
            votes[label] = votes.get(label, 0) + 1
            total_confidence += ann['confidence']

        # Majority vote
        consensus_label = max(votes.items(), key=lambda x: x[1])[0]
        agreement = votes[consensus_label] / len(annotations)
        confidence = total_confidence / len(annotations)

        status = 'high_confidence' if agreement >= 0.8 else 'low_confidence'

        return {
            'consensus_label': consensus_label,
            'confidence': round(confidence, 2),
            'agreement': agreement,
            'voting_method': voting_method,
            'votes': votes,
            'status': status
        }

    def select_active_learning_samples(self, active_learning_config: dict, context: dict) -> dict:
        """Select uncertain samples for labeling (active learning)."""
        predictions = active_learning_config['model_predictions']
        budget = active_learning_config['budget']
        uncertainty_threshold = context.get('uncertainty_threshold', 0.6)

        # Select samples with low confidence (uncertain)
        uncertain_samples = [
            p for p in predictions
            if p['confidence'] < uncertainty_threshold
        ]

        # Sort by confidence (lowest first)
        uncertain_samples.sort(key=lambda x: x['confidence'])

        # Select top N uncertain samples
        selected = uncertain_samples[:budget]
        selected_ids = [s['sample_id'] for s in selected]

        # Calculate rationale
        selection_rationale = {}
        for s in selected:
            selection_rationale[s['sample_id']] = f"confidence {s['confidence']} < {uncertainty_threshold} threshold"

        # Skipped samples (high confidence)
        skipped = [p['sample_id'] for p in predictions if p['confidence'] >= uncertainty_threshold]

        cost_savings_percent = round((len(skipped) / len(predictions)) * 100)

        return {
            'selected_samples': selected_ids,
            'selection_rationale': selection_rationale,
            'skipped_samples': skipped,
            'cost_savings': {
                'total_samples': len(predictions),
                'labeled_samples': len(selected_ids),
                'savings_percent': cost_savings_percent
            },
            'status': 'selected'
        }

    def track_annotator_performance(self, performance_config: dict, context: dict) -> dict:
        """Track annotator accuracy and throughput."""
        annotator_id = performance_config['annotator_id']

        # Calculate accuracy from gold standard samples
        gold_samples = context.get('gold_standard_samples', [])
        correct = sum(1 for s in gold_samples if s['annotator_label'] == s['ground_truth'])
        accuracy = correct / len(gold_samples) if gold_samples else 0

        # Calculate throughput
        throughput_data = context.get('throughput_data', {})
        tasks_completed = throughput_data.get('tasks_completed', 0)
        time_spent_hours = throughput_data.get('time_spent_hours', 1)
        throughput = tasks_completed / time_spent_hours

        # Determine quality tier
        if accuracy >= 0.95:
            quality_tier = 'expert'
        elif accuracy >= 0.85:
            quality_tier = 'intermediate'
        else:
            quality_tier = 'novice'

        # Compare to average
        avg_accuracy = 0.85
        avg_throughput = 20

        return {
            'performance_metrics': {
                'accuracy': round(accuracy, 2),
                'throughput': round(throughput, 1),
                'quality_tier': quality_tier
            },
            'comparison_to_average': {
                'accuracy': {
                    'annotator': round(accuracy, 2),
                    'average': avg_accuracy,
                    'delta': round(accuracy - avg_accuracy, 2)
                },
                'throughput': {
                    'annotator': round(throughput, 1),
                    'average': avg_throughput,
                    'delta': round(throughput - avg_throughput, 1)
                }
            },
            'recommendation': 'Provide feedback on accuracy' if accuracy < avg_accuracy else 'Good performance',
            'status': 'tracked'
        }

    def plan_labeling_campaign(self, campaign_config: dict, context: dict) -> dict:
        """Plan high-volume labeling campaign."""
        total_samples = campaign_config['total_samples']
        deadline_days = campaign_config['deadline_days']
        annotators = campaign_config['annotators_available']

        tasks_per_hour = context.get('tasks_per_hour_per_annotator', 20)
        work_hours_per_day = context.get('work_hours_per_day', 8)

        required_tasks_per_day = total_samples // deadline_days
        capacity_per_day = annotators * work_hours_per_day * tasks_per_hour

        capacity_sufficient = capacity_per_day >= required_tasks_per_day
        utilization = required_tasks_per_day / capacity_per_day if capacity_per_day > 0 else 0

        # Active learning optimization
        labeled_samples_needed = total_samples // 2  # 50% reduction with active learning
        cost_savings = labeled_samples_needed * 0.05

        return {
            'capacity_analysis': {
                'required_tasks_per_day': required_tasks_per_day,
                'annotator_capacity_per_day': capacity_per_day,
                'capacity_sufficient': capacity_sufficient,
                'utilization': round(utilization, 2)
            },
            'optimization': {
                'strategy': 'active_learning',
                'unlabeled_samples': total_samples,
                'labeled_samples_needed': labeled_samples_needed,
                'cost_savings': f'${cost_savings / 1000:.0f}K'
            },
            'status': 'feasible' if capacity_sufficient else 'insufficient_capacity'
        }

    def resolve_conflict(self, conflict_config: dict, context: dict) -> dict:
        """Resolve annotator disagreement using weighted voting."""
        annotations = conflict_config['annotations']

        # Count votes
        votes = {}
        weighted_votes = {}

        for ann in annotations:
            label = ann['label']
            accuracy = ann['accuracy']

            votes[label] = votes.get(label, 0) + 1
            weighted_votes[label] = weighted_votes.get(label, 0) + accuracy

        # Determine final label by weighted vote
        final_label = max(weighted_votes.items(), key=lambda x: x[1])[0]

        conflict_detected = len(votes) > 1

        return {
            'conflict_detected': conflict_detected,
            'votes': votes,
            'weighted_votes': {k: round(v, 2) for k, v in weighted_votes.items()},
            'final_label': final_label,
            'resolution_strategy': context.get('conflict_resolution_strategy', 'weighted_voting'),
            'explanation': f'Weighted vote: {final_label} wins',
            'status': 'resolved'
        }

    def inject_gold_standard(self, gold_standard_config: dict, context: dict) -> dict:
        """Inject gold standard samples for quality validation."""
        frequency = gold_standard_config['frequency']
        total_tasks = gold_standard_config['total_tasks']

        injection_count = int(total_tasks * frequency)

        return {
            'gold_standard_injected': True,
            'injection_count': injection_count,
            'injection_strategy': {
                'method': 'random_insertion',
                'visibility': 'hidden',
                'purpose': 'Measure annotator accuracy without bias'
            },
            'quality_monitoring': {
                'frequency': f'{int(frequency * 100)}% of tasks',
                'action_on_failure': 'Remove low-performing annotators (accuracy < 80%)'
            },
            'status': 'injected'
        }

    def optimize_labeling_cost(self, cost_config: dict, context: dict) -> dict:
        """Optimize labeling cost vs quality."""
        total_samples = cost_config['total_samples']
        quality_target = cost_config['quality_target']
        strategies = context.get('strategies', [])

        # Find strategy that meets quality target
        selected_strategy = None
        for strategy in strategies:
            if strategy['accuracy'] >= quality_target:
                selected_strategy = strategy
                break

        if not selected_strategy:
            selected_strategy = strategies[-1]  # Use highest quality strategy

        cost_analysis = {}
        for strategy in strategies:
            cost = total_samples * strategy['cost_per_sample']
            meets_target = strategy['accuracy'] >= quality_target
            cost_analysis[strategy['name']] = {
                'cost': f'${cost:,.0f}',
                'accuracy': strategy['accuracy'],
                'meets_target': meets_target
            }

        total_cost = total_samples * selected_strategy['cost_per_sample']

        return {
            'selected_strategy': selected_strategy['name'],
            'rationale': f"Only {selected_strategy['name']} meets {quality_target * 100}% accuracy target",
            'cost_analysis': cost_analysis,
            'total_cost': f'${total_cost:,.0f}',
            'cost_vs_quality_tradeoff': f"Pay {selected_strategy['annotators_per_sample']}x more to achieve {selected_strategy['accuracy'] * 100}% accuracy",
            'status': 'optimized'
        }

    def apply_automatic_labeling(self, auto_labeling_config: dict, context: dict) -> dict:
        """Apply automatic labeling for high-confidence predictions."""
        total_samples = auto_labeling_config['total_samples']
        predictions = context.get('model_predictions', {})
        cost_per_label = context.get('cost_per_label', 0.05)

        auto_labeled = predictions.get('high_confidence', 0)
        human_labeled = predictions.get('low_confidence', 0)

        cost_without = total_samples * cost_per_label
        cost_with = human_labeled * cost_per_label
        savings = cost_without - cost_with
        savings_percent = round((savings / cost_without) * 100)

        # Blended accuracy
        auto_acc = 0.98
        human_acc = 0.99
        blended_acc = (auto_labeled * auto_acc + human_labeled * human_acc) / total_samples

        return {
            'automatic_labeling_applied': True,
            'auto_labeled_samples': auto_labeled,
            'human_labeled_samples': human_labeled,
            'cost_savings': {
                'without_auto_labeling': f'${cost_without:,.0f}',
                'with_auto_labeling': f'${cost_with:,.0f}',
                'savings': f'${savings:,.0f}',
                'savings_percent': savings_percent
            },
            'quality_estimate': {
                'auto_labeled_accuracy': auto_acc,
                'human_labeled_accuracy': human_acc,
                'blended_accuracy': round(blended_acc, 3)
            },
            'status': 'applied'
        }

    def _calculate_iou(self, bbox1: dict, bbox2: dict) -> float:
        """Calculate Intersection over Union (IoU) for bounding boxes."""
        # Calculate intersection
        x1 = max(bbox1['x'], bbox2['x'])
        y1 = max(bbox1['y'], bbox2['y'])
        x2 = min(bbox1['x'] + bbox1['width'], bbox2['x'] + bbox2['width'])
        y2 = min(bbox1['y'] + bbox1['height'], bbox2['y'] + bbox2['height'])

        intersection = max(0, x2 - x1) * max(0, y2 - y1)

        # Calculate union
        area1 = bbox1['width'] * bbox1['height']
        area2 = bbox2['width'] * bbox2['height']
        union = area1 + area2 - intersection

        return intersection / union if union > 0 else 0

    def _average_bbox(self, bboxes: List[dict]) -> dict:
        """Average bounding boxes."""
        if not bboxes:
            return {}

        avg_x = sum(b['x'] for b in bboxes) / len(bboxes)
        avg_y = sum(b['y'] for b in bboxes) / len(bboxes)
        avg_width = sum(b['width'] for b in bboxes) / len(bboxes)
        avg_height = sum(b['height'] for b in bboxes) / len(bboxes)

        return {
            'x': avg_x,
            'y': avg_y,
            'width': avg_width,
            'height': avg_height
        }


# Example usage
if __name__ == '__main__':
    platform = DataLabelingPlatform()

    # Test case 1: Assign tasks
    result = platform.assign_tasks(
        task_config={
            'dataset': 'dog_images',
            'task_type': 'bounding_box',
            'total_samples': 1000,
            'annotators': [
                {'id': 'ann1', 'skill_level': 'expert', 'accuracy': 0.99},
                {'id': 'ann2', 'skill_level': 'novice', 'accuracy': 0.85}
            ]
        },
        context={'assignment_strategy': 'skill_based'}
    )
    print(f"Assigned {result['total_assigned']} tasks to {len(result['assignments'])} annotators")
`;

export const dataLabelingPlatformChallenge: Challenge = {
  id: 'data_labeling_platform',
  title: 'Data Labeling Platform',
  difficulty: 'advanced' as const,
  category: 'System Design',
  subcategory: 'Internal Systems - ML Infrastructure',
  tags: [
    'Machine Learning',
    'Data Labeling',
    'Quality Control',
    'Active Learning',
    'Cost Optimization',
    'L4-L5',
    'Scale AI',
  ],
  companies: ['Amazon', 'Google', 'Scale AI', 'Labelbox', 'Uber', 'Tesla'],
  description: `Design a **data labeling platform** that assigns tasks, measures quality (inter-annotator agreement), and optimizes cost using active learning and consensus voting.

**Real-world examples:**
- **Amazon SageMaker Ground Truth**: Active learning + automatic labeling
- **Google Cloud AI Platform Data Labeling**: Human labeling with quality control
- **Scale AI**: Data labeling as a service with quality guarantees
- **Labelbox**: Annotation platform with workflow management

**Functional Requirements:**
1. **Task assignment**: Match annotator skill to sample difficulty
2. **Quality control**: Inter-annotator agreement (IoU for bounding boxes)
3. **Consensus voting**: Majority vote or weighted vote (by accuracy)
4. **Active learning**: Prioritize uncertain samples (confidence < 0.6)
5. **Performance tracking**: Accuracy (vs gold standard), throughput

**Performance (NFR-P):**
- Active learning: Reduce labeling cost by 50% (prioritize uncertain samples)
- Annotator performance: Track accuracy (75% vs 85% average) and throughput (25 tasks/hour)
- High-volume labeling: 1M samples in 90 days (11K tasks/day)

**Reliability (NFR-R):**
- Conflict resolution: Weighted voting by annotator accuracy
- Gold standard validation: Inject 10% known samples for quality checks
- Quality target: 99% accuracy with consensus voting (5 annotators)

**Cost (NFR-C):**
- Cost optimization: Consensus (5 annotators, $0.25/sample) vs single ($0.05/sample)
- Automatic labeling: Model auto-labels high-confidence samples (>95%), save 60% cost
- Budget: $50K for 1M labels ($0.05/label)`,

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
      hint: 'Task assignment: Match annotator skill to sample difficulty. Expert → hard samples (ambiguous). Novice → easy samples (clear). Maximize quality and throughput.',
      order: 1,
    },
    {
      hint: 'Inter-annotator agreement: Count majority label (2 of 3 agree = 67%). Calculate IoU for bounding boxes (>0.7 = agreement). Low agreement (<80%) → request additional annotation.',
      order: 2,
    },
    {
      hint: 'Consensus voting: Majority vote for final label. Weighted vote: multiply by annotator accuracy. Average confidence. High agreement (100%) → high quality.',
      order: 3,
    },
    {
      hint: 'Active learning: Prioritize uncertain samples (confidence < 0.6). Skip high-confidence samples (>0.95). Save 33-60% labeling cost.',
      order: 4,
    },
    {
      hint: 'Annotator performance: Accuracy = correct / total on gold standard. Throughput = tasks / hours. Compare to average (85% accuracy, 20 tasks/hour). Provide feedback if below.',
      order: 5,
    },
    {
      hint: 'High-volume labeling: Required tasks/day = 1M / 90 days = 11K. Capacity = 100 annotators * 8 hours * 20 tasks/hour = 16K. Capacity sufficient (69% utilization).',
      order: 6,
    },
    {
      hint: 'Conflict resolution: Weighted voting by annotator accuracy. Expert (0.99) + novice (0.80) = 1.79 > intermediate (0.90). Expert + novice wins.',
      order: 7,
    },
    {
      hint: 'Gold standard validation: Inject 10% known samples. Annotators don\'t know which are gold standard (hidden). Measure accuracy. Remove <80% accuracy.',
      order: 8,
    },
  ],

  learningObjectives: [
    'Design data labeling workflow with task assignment',
    'Implement quality control (inter-annotator agreement, IoU)',
    'Apply consensus voting (majority, weighted by accuracy)',
    'Use active learning (prioritize uncertain samples, reduce cost)',
    'Track annotator performance (accuracy vs gold standard, throughput)',
    'Resolve conflicts (weighted voting by accuracy)',
    'Implement gold standard validation (hidden quality checks)',
    'Optimize cost (consensus vs single, automatic labeling)',
  ],

  commonMistakes: [
    {
      mistake: 'Not using active learning (label all 1M samples)',
      why_its_wrong: 'Wastes $50K budget. Labels easy samples that model already knows (>95% confidence). Inefficient.',
      how_to_avoid:
        'Use active learning: prioritize uncertain samples (confidence < 0.6). Skip high-confidence samples. Save 50% cost ($25K).',
    },
    {
      mistake: 'Single annotator per sample (no consensus)',
      why_its_wrong: 'Single annotator = 90% accuracy. Does not meet 99% quality target. High error rate.',
      how_to_avoid:
        'Use consensus voting: 5 annotators per sample. Majority vote = 99% accuracy. Costs 5x more but meets target.',
    },
    {
      mistake: 'Not tracking annotator performance (no gold standard)',
      why_its_wrong: 'Cannot identify low-performing annotators. 75% accuracy drags down overall quality. Wastes budget.',
      how_to_avoid:
        'Inject 10% gold standard samples (hidden). Track annotator accuracy. Remove <80% accuracy annotators.',
    },
    {
      mistake: 'Not resolving conflicts (ignore disagreements)',
      why_its_wrong: 'When annotators disagree (2 vote "dog", 1 votes "cat"), no clear final label. Manual review required.',
      how_to_avoid:
        'Use weighted voting by annotator accuracy. Expert (0.99) + novice (0.80) = 1.79 > intermediate (0.90). Automatic resolution.',
    },
    {
      mistake: 'Not using automatic labeling (label all samples manually)',
      why_its_wrong: 'Model has 95% confidence on 60K samples but still labels manually. Wastes $3K (60% of budget).',
      how_to_avoid:
        'Use automatic labeling for high-confidence samples (>95%). Human labels low-confidence only. Save 60% cost.',
    },
  ],

  solutionGuide: {
    approach: `**Architecture:**
1. **Task Manager**: Assign labeling tasks to annotators (skill-based matching)
2. **Annotation Interface**: Web UI for annotators to label samples
3. **Quality Control**: Measure inter-annotator agreement, consensus voting
4. **Performance Tracker**: Track annotator accuracy and throughput
5. **Active Learning**: Prioritize uncertain samples for labeling
6. **Gold Standard**: Inject known samples for quality validation

**Data flow:**
1. Upload unlabeled dataset (1M images)
2. Model generates predictions (confidence scores)
3. Active learning selects uncertain samples (confidence < 0.6)
4. Task manager assigns to annotators (skill-based)
5. Annotators label samples (bounding boxes)
6. Quality control measures agreement (IoU, majority vote)
7. Consensus voting determines final label
8. Performance tracker updates annotator accuracy

**Key optimizations:**
- **Active learning**: Reduce labeling cost by 50%
- **Automatic labeling**: Save 60% cost (high-confidence samples)
- **Consensus voting**: Achieve 99% accuracy (5 annotators)
- **Gold standard**: Remove low-performing annotators (<80%)`,

    steps: [
      '1. Assign tasks: Match annotator skill to sample difficulty. Expert → hard, novice → easy.',
      '2. Measure quality: Count majority label (2 of 3 = 67%). Calculate IoU for bounding boxes (>0.7 = agreement).',
      '3. Compute consensus: Majority vote for final label. Average confidence. High agreement (100%) → high quality.',
      '4. Active learning: Prioritize uncertain samples (confidence < 0.6). Skip high-confidence (>0.95). Save 33-60% cost.',
      '5. Track performance: Accuracy = correct / total on gold standard. Throughput = tasks / hours. Compare to average.',
      '6. Plan campaign: Required tasks/day = 1M / 90 = 11K. Capacity = 100 * 8 * 20 = 16K. Capacity sufficient.',
      '7. Resolve conflict: Weighted voting by accuracy. Expert (0.99) + novice (0.80) > intermediate (0.90).',
      '8. Inject gold standard: 10% of tasks are known samples (hidden). Measure accuracy. Remove <80%.',
      '9. Optimize cost: Consensus (5 annotators, $0.25) vs single ($0.05). Choose based on quality target (99%).',
      '10. Automatic labeling: Model auto-labels >95% confidence (60K samples). Human labels <95% (40K). Save 60% cost.',
    ],

    timeComplexity: `**Task assignment:**
- Skill-based matching: O(A) where A = annotators (100 annotators)
- Total: O(100) = constant time

**Quality measurement:**
- Inter-annotator agreement: O(N^2) where N = annotations per sample (typically 3-5)
- IoU calculation: O(N^2) pairwise comparisons
- Total: O(25) for 5 annotators = constant time

**Active learning:**
- Sort by confidence: O(S log S) where S = samples (1M samples)
- Select top K uncertain: O(K) where K = budget
- Total: O(1M log 1M) = 20M operations (acceptable)`,

    spaceComplexity: `**Annotations storage:**
- Per sample: N annotations * 100 bytes = 500 bytes (5 annotators)
- 1M samples: 1M * 500 bytes = 500 MB

**Gold standard:**
- 10% of dataset: 100K samples * 200 bytes = 20 MB

**Annotator profiles:**
- 100 annotators * 1 KB = 100 KB (negligible)

Total: ~520 MB (acceptable)`,
  },
};
