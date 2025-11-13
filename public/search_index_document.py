"""
Basic Full-Text Search - Index Documents API
=============================================

Functional Requirement:
  "Index text documents"

API Endpoint: POST /index
Input: document (dict with title, content, author)
Output: document_id (string)

Your Task:
  Implement the index_document() function to create an inverted index
  for fast keyword searches.

What is an Inverted Index?
  A data structure that maps words → document IDs

  Example:
    Doc 1: "python programming tutorial"
    Doc 2: "learn python basics"

    Inverted Index:
      "python"      → [1, 2]
      "programming" → [1]
      "tutorial"    → [1]
      "learn"       → [2]
      "basics"      → [2]

Examples:
  index_document({
    "title": "Python Tutorial",
    "content": "Learn Python programming basics",
    "author": "John Doe"
  }) → "doc_12345"

Requirements:
  1. Build inverted index (word → list of document IDs)
  2. Handle text preprocessing (lowercase, remove stopwords)
  3. Support stemming/lemmatization (optional)
  4. Store document metadata
  5. Handle 100+ documents per second

Available Libraries:
  import re          # For text processing
  import string      # For punctuation removal
  from collections import defaultdict  # For inverted index
"""

import re
import string
from collections import defaultdict
from typing import Dict, List, Set
import uuid

# Global data structures (in production, use Elasticsearch/database)
inverted_index = defaultdict(set)  # word -> set of doc_ids
documents = {}  # doc_id -> document metadata
doc_counter = 0

# Common English stopwords (words to ignore)
STOPWORDS = {
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'this', 'but', 'they', 'have', 'had'
}


def index_document(document: Dict[str, str]) -> str:
    """
    Index a document for searching.

    Args:
        document: Dict with keys 'title', 'content', 'author'

    Returns:
        document_id: Unique ID for the indexed document

    TODO: Implement inverted index construction!

    Steps:
      1. Generate unique document ID
      2. Tokenize text (split into words)
      3. Remove stopwords and punctuation
      4. Add to inverted index (word -> doc_id mapping)
      5. Store document metadata
    """
    global doc_counter

    # STARTER IMPLEMENTATION (Replace this!)
    # Simple tokenization without proper indexing

    doc_id = str(doc_counter)
    doc_counter += 1

    # Store document
    documents[doc_id] = document

    # TODO: Build inverted index properly!
    # This starter just stores the doc but doesn't index it

    return doc_id


def tokenize(text: str) -> List[str]:
    """
    Tokenize text into words.

    Args:
        text: The text to tokenize

    Returns:
        List of lowercase words

    TODO: Implement proper tokenization
    """
    # STARTER: Simple split (not good enough!)
    return text.lower().split()


# ============================================================================
# Example Optimized Implementations (Uncomment to try)
# ============================================================================

def index_document_optimized(document: Dict[str, str]) -> str:
    """
    Approach 1: Proper Inverted Index with Preprocessing

    Steps:
      1. Generate unique doc ID
      2. Preprocess text (lowercase, remove punctuation)
      3. Tokenize into words
      4. Remove stopwords
      5. Build inverted index (word -> doc_ids)

    Performance:
      - Indexing: O(n) where n = word count
      - Memory: O(unique_words * avg_docs_per_word)
    """
    global doc_counter

    # Generate unique ID
    doc_id = str(doc_counter)
    doc_counter += 1

    # Store document
    documents[doc_id] = {
        **document,
        'word_count': 0,
        'indexed_at': 'timestamp_here'
    }

    # Combine title and content for indexing
    text = f"{document.get('title', '')} {document.get('content', '')}"

    # Tokenize and preprocess
    words = tokenize_optimized(text)

    # Update word count
    documents[doc_id]['word_count'] = len(words)

    # Build inverted index
    for word in words:
        if word not in STOPWORDS and len(word) > 2:  # Skip short words
            inverted_index[word].add(doc_id)

    return doc_id


def tokenize_optimized(text: str) -> List[str]:
    """
    Approach 2: Better Tokenization

    Steps:
      1. Convert to lowercase
      2. Remove punctuation
      3. Split into words
      4. Filter stopwords
    """
    # Lowercase
    text = text.lower()

    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))

    # Split into words
    words = text.split()

    # Filter stopwords and short words
    words = [w for w in words if w not in STOPWORDS and len(w) > 2]

    return words


def index_document_with_stemming(document: Dict[str, str]) -> str:
    """
    Approach 3: With Stemming (Production Quality)

    Stemming: Reduce words to their root form
      - "running", "runs", "ran" → "run"
      - "happier", "happiest" → "happi"

    Benefits:
      - Better search recall (match similar word forms)
      - Smaller index size

    Note: In production, use libraries like NLTK or spaCy
    """
    global doc_counter

    doc_id = str(doc_counter)
    doc_counter += 1

    documents[doc_id] = document

    # Combine text
    text = f"{document.get('title', '')} {document.get('content', '')}"

    # Tokenize and stem
    words = tokenize_with_stemming(text)

    # Build index with stemmed words
    for word in words:
        if word not in STOPWORDS and len(word) > 2:
            inverted_index[word].add(doc_id)

    return doc_id


def simple_stem(word: str) -> str:
    """
    Simple stemming algorithm (Porter Stemmer simplified)

    This is a basic version. In production, use:
      - NLTK's PorterStemmer
      - spaCy's lemmatizer
      - Snowball stemmer
    """
    # Remove common suffixes
    suffixes = ['ing', 'ed', 'es', 's', 'er', 'est', 'ly']

    for suffix in suffixes:
        if word.endswith(suffix) and len(word) > len(suffix) + 2:
            return word[:-len(suffix)]

    return word


def tokenize_with_stemming(text: str) -> List[str]:
    """Tokenize with stemming"""
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    words = text.split()
    words = [simple_stem(w) for w in words if w not in STOPWORDS and len(w) > 2]
    return words


# ============================================================================
# Testing
# ============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("Testing Document Indexing")
    print("=" * 60)

    # Test 1: Index sample documents
    print("\n[Test 1] Index sample documents:")
    test_docs = [
        {
            "title": "Python Programming Tutorial",
            "content": "Learn Python programming basics with examples",
            "author": "John Doe"
        },
        {
            "title": "Machine Learning Guide",
            "content": "Introduction to machine learning algorithms and models",
            "author": "Jane Smith"
        },
        {
            "title": "Web Development",
            "content": "Build modern web applications using Python",
            "author": "Bob Johnson"
        }
    ]

    doc_ids = []
    for doc in test_docs:
        doc_id = index_document(doc)
        doc_ids.append(doc_id)
        print(f"  Indexed: {doc['title'][:30]:<30} → doc_id: {doc_id}")

    # Test 2: Check inverted index
    print("\n[Test 2] Inverted index structure:")
    if inverted_index:
        for word, doc_set in list(inverted_index.items())[:10]:
            print(f"  '{word}' → docs: {sorted(doc_set)}")
        print(f"  Total unique words: {len(inverted_index)}")
    else:
        print("  ⚠ WARNING: Inverted index is empty! Did you implement indexing?")

    # Test 3: Performance
    print("\n[Test 3] Performance test (1000 documents):")
    import time

    start = time.time()
    for i in range(1000):
        index_document({
            "title": f"Document {i}",
            "content": f"This is test document number {i} with various words",
            "author": "Test Author"
        })
    elapsed = time.time() - start
    docs_per_sec = 1000 / elapsed

    print(f"  Time: {elapsed:.3f} seconds")
    print(f"  Rate: {docs_per_sec:.0f} documents/second")
    print(f"  Status: {'✓ PASS' if docs_per_sec >= 100 else '✗ FAIL'}")

    # Test 4: Memory usage
    print("\n[Test 4] Index statistics:")
    print(f"  Total documents: {len(documents)}")
    print(f"  Unique words: {len(inverted_index)}")
    print(f"  Avg docs per word: {sum(len(docs) for docs in inverted_index.values()) / len(inverted_index) if inverted_index else 0:.2f}")

    print("\n" + "=" * 60)
    print("Optimize your index_document() function!")
    print("Hint: Build proper inverted index for fast searches")
    print("=" * 60)
