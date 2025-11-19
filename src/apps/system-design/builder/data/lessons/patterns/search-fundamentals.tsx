import { SystemDesignLesson } from '../../../types/lesson';
import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../../../ui/components/LessonContent';

export const searchFundamentalsLesson: SystemDesignLesson = {
  id: 'search-fundamentals',
  slug: 'search-fundamentals',
  title: 'Search Fundamentals',
  description: 'Learn the core concepts of search systems and indexing',
  category: 'patterns',
  difficulty: 'intermediate',
  estimatedMinutes: 25,
  stages: [
    {
      id: 'what-is-search',
      type: 'concept',
      title: 'What is Search?',
      content: (
        <Section>
          <H1>What is Search?</H1>
          
          <P>
            Search is the process of finding relevant documents or records from a large dataset based on a query.
          </P>

          <H2>Why Build Search Systems?</H2>

          <H3>1. <Strong>User Experience</Strong></H3>
          <UL>
            <LI>Users expect to find what they need in &lt;1 second</LI>
            <LI>Good search = happy users = more engagement</LI>
            <LI>Bad search = frustrated users = lost revenue</LI>
          </UL>

          <H3>2. <Strong>Scale</Strong></H3>
          <UL>
            <LI>Database LIKE queries don't scale</LI>
            <LI><Code>SELECT * FROM products WHERE name LIKE '%phone%'</Code> scans entire table</LI>
            <LI>Takes 10+ seconds on millions of rows</LI>
            <LI>Search engines use inverted indexes for O(1) lookups</LI>
            <LI>Same query takes &lt;100ms</LI>
          </UL>

          <H3>3. <Strong>Relevance</Strong></H3>
          <UL>
            <LI>Search engines rank results by relevance</LI>
            <LI>Most relevant results appear first</LI>
            <LI>Database queries return results in arbitrary order</LI>
          </UL>

          <H2>Real-World Example: E-commerce Search</H2>

          <Example title="Without Search Engine (Database LIKE query)">
            <CodeBlock language="sql">
{`SELECT * FROM products 
WHERE name LIKE '%wireless headphones%' 
   OR description LIKE '%wireless headphones%'
ORDER BY created_at DESC
LIMIT 20;

-- Scans 10M products
-- Takes 15 seconds
-- Results not ranked by relevance
-- Can't handle typos ("wireles headphones")`}
            </CodeBlock>
          </Example>

          <Example title="With Search Engine (Elasticsearch)">
            <CodeBlock language="json">
{`GET /products/_search
{
  "query": {
    "multi_match": {
      "query": "wireless headphones",
      "fields": ["name^2", "description"],
      "fuzziness": "AUTO"
    }
  }
}

// Uses inverted index
// Takes 50ms
// Results ranked by TF-IDF score
// Handles typos automatically`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            <Strong>Result:</Strong> 300x faster with better results!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'inverted-index',
      type: 'concept',
      title: 'Inverted Index',
      content: (
        <Section>
          <H1>Inverted Index</H1>
          
          <P>The core data structure behind search engines.</P>

          <H2>What is an Inverted Index?</H2>
          <P>An inverted index maps words → documents (opposite of normal index).</P>

          <H3>Normal Index (Database)</H3>
          <CodeBlock>
{`Document 1: "Apple iPhone 14"
Document 2: "Samsung Galaxy Phone"
Document 3: "Apple MacBook Pro"

Lookup: doc_id → content`}
          </CodeBlock>

          <H3>Inverted Index (Search Engine)</H3>
          <CodeBlock>
{`"apple"   → [Doc 1, Doc 3]
"iphone"  → [Doc 1]
"samsung" → [Doc 2]
"galaxy"  → [Doc 2]
"phone"   → [Doc 1, Doc 2]
"macbook" → [Doc 3]

Lookup: word → [doc_ids]`}
          </CodeBlock>

          <Divider />

          <H2>How It Works</H2>

          <H3>Step 1: Tokenization</H3>
          <P>Break text into words (tokens).</P>
          <CodeBlock>
{`"Apple iPhone 14" → ["apple", "iphone", "14"]`}
          </CodeBlock>

          <H3>Step 2: Normalization</H3>
          <P>Convert to lowercase, remove punctuation.</P>
          <CodeBlock>
{`["Apple", "iPhone", "14"] → ["apple", "iphone", "14"]`}
          </CodeBlock>

          <H3>Step 3: Stemming</H3>
          <P>Reduce words to root form.</P>
          <CodeBlock>
{`["running", "runs", "ran"] → ["run", "run", "run"]`}
          </CodeBlock>

          <H3>Step 4: Build Inverted Index</H3>
          <P>Map each word to documents containing it.</P>
          <CodeBlock>
{`{
  "apple": [1, 3, 5, 12],
  "iphone": [1, 7, 9],
  "run": [2, 4, 8]
}`}
          </CodeBlock>

          <Divider />

          <H2>Why Inverted Index is Fast</H2>

          <ComparisonTable
            headers={['Method', 'Complexity', 'Time', 'Details']}
            rows={[
              ['Database LIKE', 'O(n)', '15 seconds', 'Scans ALL 10M products'],
              ['Inverted Index', 'O(1)', '1ms', 'Direct hash lookup'],
            ]}
          />

          <KeyPoint>
            <Strong>Result:</Strong> 15,000x faster!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'tf-idf',
      type: 'concept',
      title: 'TF-IDF Ranking',
      content: (
        <Section>
          <H1>TF-IDF: Ranking Search Results</H1>

          <P>
            TF-IDF (Term Frequency-Inverse Document Frequency) is a scoring algorithm that ranks 
            documents by relevance to a search query.
          </P>

          <H2>The Problem</H2>
          <P>
            Inverted index tells us <Strong>which</Strong> documents contain the search terms, 
            but not <Strong>which are most relevant</Strong>.
          </P>

          <Example title="Search: 'apple iphone'">
            <CodeBlock>
{`Document 1: "Apple iPhone 14 Pro Max"
Document 2: "Buy Apple products: iPhone, iPad, MacBook"
Document 3: "I ate an apple while using my iPhone"

All 3 contain "apple" and "iphone", but which is most relevant?`}
            </CodeBlock>
          </Example>

          <H2>TF-IDF Formula</H2>

          <CodeBlock>
{`TF-IDF = Term Frequency × Inverse Document Frequency

TF  = (# times term appears in document) / (total terms in document)
IDF = log(total documents / documents containing term)`}
          </CodeBlock>

          <H3>Term Frequency (TF)</H3>
          <P>How often does the term appear in this document?</P>
          <UL>
            <LI>Higher TF = more relevant</LI>
            <LI>Document with "iphone" 5 times is more relevant than one with it once</LI>
          </UL>

          <H3>Inverse Document Frequency (IDF)</H3>
          <P>How rare is this term across all documents?</P>
          <UL>
            <LI>Common words (the, is, a) have low IDF</LI>
            <LI>Rare words (iPhone, MacBook) have high IDF</LI>
            <LI>Rare words are more important for relevance</LI>
          </UL>

          <Divider />

          <H2>Example Calculation</H2>

          <Example title="Dataset: 1000 products">
            <CodeBlock>
{`Query: "wireless headphones"

Document A: "Sony Wireless Headphones WH-1000XM5"
- "wireless" appears 1 time, doc has 4 words → TF = 0.25
- "wireless" in 200/1000 docs → IDF = log(1000/200) = 0.7
- TF-IDF for "wireless" = 0.25 × 0.7 = 0.175

- "headphones" appears 1 time, doc has 4 words → TF = 0.25
- "headphones" in 50/1000 docs → IDF = log(1000/50) = 1.3
- TF-IDF for "headphones" = 0.25 × 1.3 = 0.325

Total score: 0.175 + 0.325 = 0.5

Document B: "Wireless Mouse for Computer"
- "wireless" appears 1 time, doc has 4 words → TF = 0.25
- TF-IDF for "wireless" = 0.175
- "headphones" not present → TF-IDF = 0

Total score: 0.175

Result: Document A (0.5) ranks higher than Document B (0.175)`}
            </CodeBlock>
          </Example>

          <KeyPoint>
            TF-IDF ensures documents with both terms (and rare terms) rank highest!
          </KeyPoint>
        </Section>
      ),
    },
    {
      id: 'autocomplete',
      type: 'concept',
      title: 'Autocomplete (Prefix Search)',
      content: (
        <Section>
          <H1>Autocomplete (Prefix Search)</H1>

          <P>
            Autocomplete suggests completions as users type, improving search experience.
          </P>

          <H2>The Challenge</H2>
          <P>
            Must return suggestions in <Strong>&lt;100ms</Strong> as user types each character.
          </P>

          <Example title="User types 'iph'">
            <CodeBlock>
{`Should suggest:
- iPhone 14
- iPhone 13
- iPhone SE
- iPad (no - doesn't start with 'iph')`}
            </CodeBlock>
          </Example>

          <H2>Solution: Prefix Tree (Trie)</H2>

          <P>A tree data structure where each path represents a word.</P>

          <CodeBlock>
{`        root
       /  |  \\
      i   s   m
     /    |    \\
    p     a     a
   /      |      \\
  h       m       c
 /        |        \\
o         s         b
|         |         |
n         u         o
|         |         |
e         n         o
          |         |
          g         k`}
          </CodeBlock>

          <H3>How It Works</H3>

          <P><Strong>Step 1: Build Trie</Strong></P>
          <CodeBlock>
{`Insert words: ["iphone", "ipad", "samsung", "macbook"]

Each node stores:
- Character
- Children nodes
- Is end of word?
- Frequency/popularity score`}
          </CodeBlock>

          <P><Strong>Step 2: Search for Prefix</Strong></P>
          <CodeBlock>
{`User types "iph"
1. Start at root
2. Follow path: i → p → h
3. Collect all words from this node
4. Return top 10 by popularity`}
          </CodeBlock>

          <Divider />

          <H2>Optimizations</H2>

          <H3>1. Store Top K at Each Node</H3>
          <P>Pre-compute top 10 suggestions at each node.</P>
          <CodeBlock>
{`Node 'iph':
  top_suggestions = [
    "iphone 14" (score: 1000),
    "iphone 13" (score: 800),
    "iphone se" (score: 500)
  ]

Lookup: O(1) instead of traversing entire subtree`}
          </CodeBlock>

          <H3>2. Cache Popular Prefixes</H3>
          <P>Cache results for common searches in Redis.</P>
          <CodeBlock>
{`cache.set("autocomplete:iph", ["iphone 14", "iphone 13", ...])

90% of searches are for same 100 prefixes
→ 90% cache hit rate
→ <10ms response time`}
          </CodeBlock>

          <H3>3. Fuzzy Matching</H3>
          <P>Handle typos using edit distance.</P>
          <CodeBlock>
{`User types: "ipone" (typo)
Calculate edit distance:
- "iphone" → distance = 1 (insert 'h')
- "ipad"   → distance = 3
→ Suggest "iphone" (closest match)`}
          </CodeBlock>
        </Section>
      ),
    },
    {
      id: 'faceted-search',
      type: 'concept',
      title: 'Faceted Search & Filters',
      content: (
        <Section>
          <H1>Faceted Search & Filters</H1>

          <P>
            Faceted search allows users to filter results by categories (facets) like price, brand, rating.
          </P>

          <H2>Example: E-commerce Product Search</H2>

          <Example title="Search: 'laptop'">
            <CodeBlock>
{`Results: 5,000 laptops

Filters (Facets):
- Brand: Apple (500), Dell (800), HP (600), ...
- Price: $0-500 (1000), $500-1000 (2000), $1000+ (2000)
- RAM: 8GB (2000), 16GB (2500), 32GB (500)
- Rating: 4+ stars (3000), 3+ stars (4500)

User selects: Brand=Apple, Price=$1000+
→ Results narrow to 200 laptops`}
            </CodeBlock>
          </Example>

          <H2>How It Works</H2>

          <H3>Step 1: Index with Facet Fields</H3>
          <CodeBlock>
{`{
  "id": "laptop-123",
  "name": "MacBook Pro",
  "brand": "Apple",
  "price": 1999,
  "ram": "16GB",
  "rating": 4.5
}`}
          </CodeBlock>

          <H3>Step 2: Aggregations</H3>
          <P>Count documents in each facet bucket.</P>
          <CodeBlock language="json">
{`GET /products/_search
{
  "query": { "match": { "name": "laptop" } },
  "aggs": {
    "brands": {
      "terms": { "field": "brand" }
    },
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 500 },
          { "from": 500, "to": 1000 },
          { "from": 1000 }
        ]
      }
    }
  }
}`}
          </CodeBlock>

          <H3>Step 3: Apply Filters</H3>
          <CodeBlock language="json">
{`GET /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "name": "laptop" } }
      ],
      "filter": [
        { "term": { "brand": "Apple" } },
        { "range": { "price": { "gte": 1000 } } }
      ]
    }
  }
}`}
          </CodeBlock>

          <Divider />

          <H2>Performance Optimization</H2>

          <H3>1. Use Filters (Not Queries) for Facets</H3>
          <UL>
            <LI>Filters are cached and faster</LI>
            <LI>Queries calculate relevance scores (unnecessary for exact matches)</LI>
          </UL>

          <H3>2. Pre-aggregate Popular Facets</H3>
          <UL>
            <LI>Cache facet counts for common searches</LI>
            <LI>Update counts asynchronously</LI>
          </UL>

          <H3>3. Limit Facet Values</H3>
          <UL>
            <LI>Show top 10 brands, not all 500</LI>
            <LI>Provide "Show more" option</LI>
          </UL>

          <KeyPoint>
            Faceted search improves user experience by letting users narrow down results quickly!
          </KeyPoint>
        </Section>
      ),
    },
  ],
};

