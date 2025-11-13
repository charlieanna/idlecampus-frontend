"""
Basic Full-Text Search - Search Documents API
==============================================

Functional Requirement:
  "Search by keywords with AND/OR operators and rank results by relevance"

API Endpoint: GET /search?q=keywords
Input: query (string), operator (AND/OR)
Output: List of ranked document results

Your Task:
  Implement the search() function to:
  1. Find documents matching query keywords
  2. Support AND/OR operators
  3. Rank results by relevance (TF-IDF scoring)
  4. Highlight matching terms in results

What is TF-IDF?
  Term Frequency-Inverse Document Frequency
  Measures how important a word is to a document

  TF (Term Frequency): How often word appears in document
  IDF (Inverse Document Frequency): How rare the word is overall

  Score = TF * IDF

  Example:
    Query: "python tutorial"
    Doc 1: "python programming tutorial" (contains both)
    Doc 2: "python basics" (contains only python)
    → Doc 1 ranks higher (more matching terms)

Examples:
  search("python tutorial", operator="AND")
    → [{"doc_id": "1", "title": "Python Tutorial", "score": 0.85}]

  search("python OR java", operator="OR")
    → [{"doc_id": "1", "score": 0.85}, {"doc_id": "3", "score": 0.70}]

Requirements:
  1. Fast lookups using inverted index
  2. Support AND/OR boolean operators
  3. Rank by relevance (TF-IDF)
  4. Handle 1000+ queries per second
  5. P95 latency < 100ms

Access Pattern:
  - Very high read frequency (search queries)
  - Read from inverted index
  - Perfect for caching popular queries!
"""

import math
from typing import List, Dict, Set
from collections import Counter

# Import from index_document (in production, shared database)
from search_index_document import inverted_index, documents, tokenize


def search(query: str, operator: str = "AND", limit: int = 10) -> List[Dict]:
    """
    Search for documents matching query keywords.

    Args:
        query: Search keywords (e.g., "python tutorial")
        operator: "AND" or "OR" (default: "AND")
        limit: Max number of results (default: 10)

    Returns:
        List of matching documents with scores, sorted by relevance

    TODO: Implement search with ranking!

    Steps:
      1. Tokenize query into keywords
      2. Find matching documents using inverted index
      3. Apply AND/OR operator logic
      4. Calculate relevance scores (TF-IDF)
      5. Sort by score and return top results
    """
    # STARTER IMPLEMENTATION (Replace this!)
    # Simple search without proper ranking

    # Tokenize query
    keywords = tokenize(query)

    # Find matching docs (very naive)
    matching_docs = set()
    for keyword in keywords:
        if keyword in inverted_index:
            docs = inverted_index[keyword]
            if not matching_docs:
                matching_docs = set(docs)
            elif operator == "AND":
                matching_docs &= docs  # Intersection
            else:  # OR
                matching_docs |= docs  # Union

    # Return results (no ranking!)
    results = []
    for doc_id in matching_docs:
        if doc_id in documents:
            results.append({
                "doc_id": doc_id,
                "title": documents[doc_id].get("title", ""),
                "score": 1.0,  # TODO: Calculate real score!
            })

    return results[:limit]


def calculate_tf(term: str, document: Dict) -> float:
    """
    Calculate Term Frequency (TF)

    TF = (Number of times term appears in document) / (Total words in document)

    TODO: Implement TF calculation
    """
    return 0.0


def calculate_idf(term: str, total_docs: int) -> float:
    """
    Calculate Inverse Document Frequency (IDF)

    IDF = log(Total documents / Documents containing term)

    TODO: Implement IDF calculation
    """
    return 0.0


# ============================================================================
# Example Optimized Implementations (Uncomment to try)
# ============================================================================

def search_with_ranking(query: str, operator: str = "AND", limit: int = 10) -> List[Dict]:
    """
    Approach 1: Search with TF-IDF Ranking

    Steps:
      1. Tokenize query
      2. Find matching docs using inverted index
      3. Apply AND/OR logic
      4. Calculate TF-IDF score for each doc
      5. Sort by score and return top results

    Performance:
      - Query time: O(k * d) where k = keywords, d = matching docs
      - With 3 keywords and 100 matching docs: ~300 operations
    """
    # Tokenize query
    keywords = tokenize(query)
    keywords = [k for k in keywords if len(k) > 2]  # Filter short words

    if not keywords:
        return []

    # Find matching documents
    matching_docs = None
    for keyword in keywords:
        if keyword in inverted_index:
            docs = inverted_index[keyword]
            if matching_docs is None:
                matching_docs = set(docs)
            elif operator == "AND":
                matching_docs &= docs
            else:  # OR
                matching_docs |= docs

    if not matching_docs:
        return []

    # Calculate scores for matching docs
    results = []
    total_docs = len(documents)

    for doc_id in matching_docs:
        if doc_id not in documents:
            continue

        doc = documents[doc_id]
        score = calculate_tfidf_score(keywords, doc, doc_id, total_docs)

        results.append({
            "doc_id": doc_id,
            "title": doc.get("title", ""),
            "content": doc.get("content", "")[:200],  # Snippet
            "score": score,
            "author": doc.get("author", ""),
        })

    # Sort by score (highest first)
    results.sort(key=lambda x: x["score"], reverse=True)

    return results[:limit]


def calculate_tfidf_score(keywords: List[str], doc: Dict, doc_id: str, total_docs: int) -> float:
    """
    Calculate TF-IDF score for a document

    Score = sum of (TF * IDF) for each keyword
    """
    score = 0.0
    doc_text = f"{doc.get('title', '')} {doc.get('content', '')}".lower()
    doc_words = doc_text.split()

    for keyword in keywords:
        # Calculate TF (term frequency)
        tf = doc_words.count(keyword) / len(doc_words) if doc_words else 0

        # Calculate IDF (inverse document frequency)
        docs_with_term = len(inverted_index.get(keyword, []))
        if docs_with_term > 0:
            idf = math.log(total_docs / docs_with_term)
        else:
            idf = 0

        # TF-IDF score
        score += tf * idf

    return score


def search_with_highlights(query: str, operator: str = "AND", limit: int = 10) -> List[Dict]:
    """
    Approach 2: Search with Highlighted Results

    Highlights matching keywords in results
      "Learn Python programming" → "Learn **Python** programming"
    """
    results = search_with_ranking(query, operator, limit)
    keywords = tokenize(query)

    for result in results:
        # Highlight keywords in title and content
        result['title'] = highlight_text(result['title'], keywords)
        result['content'] = highlight_text(result['content'], keywords)

    return results


def highlight_text(text: str, keywords: List[str]) -> str:
    """
    Highlight keywords in text

    Example: "Python tutorial" with keywords ["python"]
             → "**Python** tutorial"
    """
    highlighted = text
    for keyword in keywords:
        # Case-insensitive replace with bold markers
        import re
        pattern = re.compile(re.escape(keyword), re.IGNORECASE)
        highlighted = pattern.sub(f"**{keyword}**", highlighted)

    return highlighted


def search_with_caching(query: str, operator: str = "AND", limit: int = 10) -> List[Dict]:
    """
    Approach 3: Add Query Caching

    Cache popular queries to avoid recalculating
      - Use LRU cache
      - Cache top 10,000 queries
      - Speeds up repeated searches by 100x

    In production: Use Redis for distributed caching
    """
    # Simple in-memory cache
    cache_key = f"{query}:{operator}:{limit}"

    if cache_key in query_cache:
        return query_cache[cache_key]

    # Cache miss - perform search
    results = search_with_ranking(query, operator, limit)

    # Store in cache
    query_cache[cache_key] = results

    return results


# Simple LRU cache (in production, use Redis)
query_cache = {}


# ============================================================================
# Testing
# ============================================================================

if __name__ == "__main__":
    # First, index some documents
    from search_index_document import index_document_optimized

    print("=" * 60)
    print("Setting up test data...")
    print("=" * 60)

    test_docs = [
        {"title": "Python Programming Tutorial", "content": "Learn Python programming basics with hands-on examples and exercises", "author": "John Doe"},
        {"title": "Machine Learning with Python", "content": "Introduction to machine learning algorithms using Python libraries", "author": "Jane Smith"},
        {"title": "Web Development Guide", "content": "Build modern web applications using Python Django framework", "author": "Bob Johnson"},
        {"title": "Data Science Tutorial", "content": "Analyze data and create visualizations with Python pandas", "author": "Alice Brown"},
        {"title": "Java Programming", "content": "Learn Java programming fundamentals and object-oriented concepts", "author": "Charlie Wilson"},
    ]

    for doc in test_docs:
        index_document_optimized(doc)

    print(f"Indexed {len(test_docs)} documents\n")

    print("=" * 60)
    print("Testing Search Functionality")
    print("=" * 60)

    # Test 1: Simple search
    print("\n[Test 1] Search for 'python':")
    results = search("python", operator="OR")
    print(f"  Found {len(results)} results:")
    for r in results[:3]:
        print(f"    - {r['title']} (score: {r.get('score', 0):.3f})")

    # Test 2: AND operator
    print("\n[Test 2] Search for 'python tutorial' (AND):")
    results = search("python tutorial", operator="AND")
    print(f"  Found {len(results)} results:")
    for r in results:
        print(f"    - {r['title']}")

    # Test 3: OR operator
    print("\n[Test 3] Search for 'python OR java' (OR):")
    results = search("python OR java", operator="OR")
    print(f"  Found {len(results)} results:")
    for r in results:
        print(f"    - {r['title']}")

    # Test 4: Performance
    print("\n[Test 4] Performance test (1000 queries):")
    import time

    start = time.time()
    for i in range(1000):
        search("python programming", operator="AND")
    elapsed = time.time() - start
    qps = 1000 / elapsed
    avg_latency = (elapsed / 1000) * 1000  # ms

    print(f"  Time: {elapsed:.3f} seconds")
    print(f"  Rate: {qps:.0f} queries/second")
    print(f"  Avg latency: {avg_latency:.2f}ms")
    print(f"  Status: {'✓ PASS' if qps >= 1000 and avg_latency < 100 else '✗ FAIL'}")

    print("\n" + "=" * 60)
    print("Optimize your search() function!")
    print("Hint: Implement TF-IDF ranking for better results")
    print("=" * 60)
