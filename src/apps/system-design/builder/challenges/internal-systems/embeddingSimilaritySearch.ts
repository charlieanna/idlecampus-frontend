import { Challenge } from '../../types/testCase';

export const embeddingSimilaritySearchChallenge: Challenge = {
  id: 'embedding_similarity_search',
  title: 'Embedding Similarity Search (Vector Database)',
  difficulty: 'advanced',
  description: `Design a vector database for approximate nearest neighbor search on embeddings.

Index high-dimensional vectors (768D), support fast ANN queries, and handle index updates.

Key challenges:
- Fast ANN search (< 10ms for 10M vectors)
- Index updates without downtime
- Recall vs latency tradeoff
- High dimensionality (768D+)`,

  requirements: {
    functional: [
      'Vector indexing (HNSW, IVF, etc.)',
      'Approximate nearest neighbor search',
      'Distance metrics (cosine, euclidean)',
      'Index updates without downtime',
      'Filtering by metadata',
    ],
    traffic: '10,000 queries/sec',
    latency: 'p99 < 10ms for ANN search',
    availability: '99.9% uptime',
    budget: '$7,000/month',
  },

  availableComponents: [
    'client','app_server', 'database', 'cache', 's3'],

  testCases: [
    {
      name: 'ANN Search',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Fast approximate nearest neighbor search.',
      traffic: { type: 'search', rps: 1000, vectorDim: 768 },
      duration: 60,
      passCriteria: { maxErrorRate: 0, maxP99Latency: 10, recall: 0.95 },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 10 } },
          { type: 'vector_db', config: { index: 'hnsw', vectors: 10000000 } },
          { type: 's3', config: { storageSizeGB: 5000 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'vector_db' },
        ],
        explanation: `HNSW index for fast ANN, S3 for backups`,
      },
    },
    {
      name: 'Index Updates',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Add/update vectors without downtime.',
      traffic: { type: 'write', rps: 100 },
      duration: 60,
      passCriteria: { maxErrorRate: 0, indexUpdateLatency: 1000 },
      hints: [
        'Incremental index updates (HNSW)',
        'Batch updates for efficiency',
        'Background reindexing',
      ],
    },
  ],

  hints: [
    {
      category: 'Indexing Algorithms',
      items: [
        'HNSW: Fast, high recall',
        'IVF: Clustering-based',
        'LSH: Hash-based',
        'Product Quantization: Compression',
      ],
    },
  ],

  learningObjectives: ['Vector databases', 'ANN algorithms'],

  realWorldExample: `Pinecone, Milvus, FAISS`,

  pythonTemplate: `import numpy as np

class EmbeddingSimilaritySearch:
    def __init__(self):
        self.index = None  # HNSW index

    def add_vectors(self, vectors: np.ndarray, ids: list):
        # TODO: Add to index
        pass

    def search(self, query_vector: np.ndarray, k: int = 10):
        # TODO: ANN search
        # Return top-k nearest neighbors
        pass

    def update_vector(self, id: str, vector: np.ndarray):
        # TODO: Update in index
        pass`,
};
