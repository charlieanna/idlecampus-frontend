import { CatContentModule } from '../types';

export const rcBusinessModule: CatContentModule = {
  topic: {
    id: 'varc-rc-business',
    section: 'VARC',
    title: 'RC: Business & Economics',
    description: 'Reading Comprehension passages based on business ethics and economic theory.',
    order: 1
  },
  lessons: [
    {
      id: 'rc-basics',
      topicId: 'varc-rc-business',
      title: 'Approaching RC Passages',
      durationMinutes: 10,
      contentMarkdown: `
# How to Ace Reading Comprehension

In CAT, RCs make up ~70% of the VARC section.

## Key Strategies
1. **The "Main Idea" First:** Read the first and last paragraph carefully. Skim the middle to get the flow.
2. **Tone Detection:** Is the author critical, analytical, descriptive, or optimistic?
3. **Elimination is Key:** Options that are too extreme ("always", "never") or out of scope are usually wrong.

## Common Trap Types
- **Out of Scope:** Mentions something not strictly supported by the text.
- **Distortion:** Uses words from the text but twists the meaning.
- **True but Irrelevant:** A factually correct statement that doesn't answer the specific question asked.
      `,
      keyTakeaways: [
        'Don\'t bring outside knowledge into the passage.',
        'Identify the author\'s central argument early.',
        'Watch out for transition words like "however", "although", "conversely".'
      ]
    }
  ],
  problems: [],
  problemSets: [
    {
      id: 'rc-set-1',
      topicId: 'varc-rc-business',
      difficulty: 'MEDIUM',
      estimatedTimeMinutes: 8,
      commonDataMarkdown: `
**Passage:**

To understand the current crisis in corporate ethics, one must look beyond the individual "bad apples" and examine the barrel itself—the corporate culture that prioritizes short-term shareholder value above all else. For decades, the dominant economic philosophy, championed by Milton Friedman, was that the only social responsibility of business is to increase its profits. This reductionist view stripped executives of moral agency, allowing them to justify any legal (and sometimes illegal) action that boosted the bottom line.

However, a shift is occurring. The rise of ESG (Environmental, Social, and Governance) criteria suggests a market correction. Investors are realizing that sustainable practices are not just "nice to have" but essential for long-term risk mitigation. A company that ignores its environmental footprint or mistreats its workforce is a ticking time bomb. Yet, critics argue that ESG is merely a marketing gimmick—"greenwashing"—designed to placate conscientious consumers without effecting real structural change.

The true test lies in how companies react when profit and purpose conflict. It is easy to be ethical when it is profitable. It is far harder, yet more necessary, to choose ethics when it hurts the quarterly earnings report. Until executive compensation is tied to these broader metrics, the ghost of Friedman will continue to haunt the boardroom.
      `,
      subQuestions: [
        {
          id: 'rc-set-1-q1',
          topicId: 'varc-rc-business',
          difficulty: 'MEDIUM',
          type: 'MCQ',
          estimatedTimeSeconds: 60,
          questionMarkdown: 'The author mentions "Milton Friedman" primarily to:',
          options: [
            'Praise the economic growth achieved in the 20th century.',
            'Identify the origin of the philosophy that prioritizes profit over ethics.',
            'Suggest that modern executives lack the intellectual rigor of past economists.',
            'Contrast his views with the emerging ESG framework.'
          ],
          correctOptionIndex: 1,
          solutionMarkdown: `
**Reasoning:**
- The passage introduces Friedman to explain the "dominant economic philosophy" that "stripped executives of moral agency."
- This directly supports Option 2: identifying the origin of the profit-first philosophy.
- Option 4 is tempting but the author uses Friedman to explain the *cause* of the current crisis, which is then *contrasted* with ESG, but the primary purpose of mentioning him is to pinpoint the root of the "bad barrel."
          `
        },
        {
          id: 'rc-set-1-q2',
          topicId: 'varc-rc-business',
          difficulty: 'HARD',
          type: 'MCQ',
          estimatedTimeSeconds: 60,
          questionMarkdown: 'Which of the following would the author most likely agree with?',
          options: [
            'ESG criteria have successfully transformed corporate culture.',
            'Short-term shareholder value should be completely ignored in favor of social goals.',
            'Executive pay structures need to change for ethical business practices to take root.',
            'Greenwashing is a necessary step towards genuine corporate responsibility.'
          ],
          correctOptionIndex: 2,
          solutionMarkdown: `
**Reasoning:**
- Look at the last sentence: "Until executive compensation is tied to these broader metrics, the ghost of Friedman will continue to haunt..."
- This implies that changing pay structures (compensation) is a prerequisite for real change.
- Option 1 is incorrect because the passage says "critics argue ESG is merely a marketing gimmick."
- Option 2 is too extreme ("completely ignored").
          `
        }
      ]
    }
  ]
};
