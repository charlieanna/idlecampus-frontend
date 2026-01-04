import { CatContentModule } from '../types';

export const dilrArrangementsModule: CatContentModule = {
  topic: {
    id: 'dilr-arrangements',
    section: 'DILR',
    title: 'Linear Arrangements',
    description: 'Solving complex arrangement puzzles with multiple variables.',
    order: 1
  },
  lessons: [
    {
      id: 'dilr-arr-basics',
      topicId: 'dilr-arrangements',
      title: 'Guide to Linear Arrangements',
      durationMinutes: 12,
      contentMarkdown: `
# Mastering Linear Arrangements

Linear arrangement problems involve placing items or people in a line based on a set of conditions.

## Visualization Strategy
1. **Draw slots:** If there are 5 people, draw 5 empty slots: \`_ _ _ _ _\`
2. **Fixed Clues First:** Fill in definitive info ("A is at the extreme left").
3. **Connecting Clues:** Look for clues that link to what you've already placed ("B is to the immediate right of A").
4. **Use Cases:** If a clue is ambiguous ("C is at one of the ends"), draw two parallel diagrams (Case 1 and Case 2) and eliminate one later.

## Common Terms
- **"Between":** X is between Y and Z means Y-X-Z or Z-X-Y. It doesn't mean immediately between unless specified.
- **"Adjacent" / "Immediate Neighbor":** Next to each other.
- **"Extreme Ends":** The first and last positions.
      `,
      keyTakeaways: [
        'Never hesitate to draw multiple cases/scenarios.',
        'Read every negative constraint carefully ("D is NOT at the end").',
        'Combine related variables (like grouping "AB" together if they sit next to each other).'
      ]
    }
  ],
  problems: [],
  problemSets: [
    {
      id: 'dilr-set-1',
      topicId: 'dilr-arrangements',
      difficulty: 'HARD',
      estimatedTimeMinutes: 10,
      commonDataMarkdown: `
**Set Description:**

Five cars—Audi, BMW, Chevrolet, Dodge, and Ferrari—are parked in a straight line facing North. Each car is a different color: Red, Blue, Green, White, and Black (not necessarily in that order).

**Constraints:**
1. The Ferrari is at one of the extreme ends.
2. The Red car is parked exactly in the middle.
3. The BMW is placed to the immediate left of the Dodge.
4. The Blue car is parked between the Audi and the Green car.
5. The Chevrolet is White and is parked to the immediate right of the Ferrari.
6. The Dodge is not Red.
      `,
      subQuestions: [
        {
          id: 'dilr-set-1-q1',
          topicId: 'dilr-arrangements',
          difficulty: 'MEDIUM',
          type: 'MCQ',
          estimatedTimeSeconds: 45,
          questionMarkdown: 'Which car is parked in the middle?',
          options: ['Audi', 'BMW', 'Dodge', 'Cannot be determined'],
          correctOptionIndex: 0,
          solutionMarkdown: `
**Step-by-Step Deduction:**
1. **Ferrari & Chevrolet:** Ferrari is at an end. Chevy is immediate right of Ferrari.
   - Case 1: Ferrari (1) - Chevy (2). (Valid, Ferrari at Left End)
   - Case 2: Chevy (4) - Ferrari (5). (Ferrari at Right End). But Chevy must be to RIGHT of Ferrari. If Ferrari is at extreme right (5), no space for Chevy at (6). So Ferrari must be at LEFT end (Slot 1).
   - **Order so far:** F . C . _ . _ . _
2. **Colors:** Chevy is White.
   - Slot 1: F (Color ?)
   - Slot 2: C (White)
3. **Red Car:** Red car is exactly in middle (Slot 3).
   - F . C . (Red) . _ . _
4. **BMW & Dodge:** BMW immediate left of Dodge => "BD".
   - Where can "BD" fit? Slots 3-4 or 4-5.
   - Constraint: Dodge is NOT Red. So Dodge cannot be at Slot 3.
   - So "BD" must be at Slots 3-4? No, because B would have to be Red.
   - Or "BD" at 4-5? Then Slot 3 is empty? No.
   - Let's re-read carefully.
   - BMW (B) is left of Dodge (D). So (B, D).
   - Available slots for pairs: (3,4) or (4,5).
   - If (B, D) are at (3, 4): B is at 3 (Red). D is at 4. This works.
   - If (B, D) are at (4, 5): D is at 5. B is at 4. Slot 3 is Red.
5. **Blue Car:** Parked between Audi (A) and Green.
   - We need space for A - Blue - Green (3 slots) or Green - Blue - A.
   - We have filled: 1(F), 2(C).
   - Remaining slots: 3, 4, 5.
   - So Slots 3, 4, 5 must be occupied by Audi, Blue Car, Green Car (in some order).
   - **Conflict with BMW/Dodge:**
     - We established BMW/Dodge need 2 adjacent slots.
     - We established Audi/Blue/Green need 3 slots related to each other? "Blue is between A and Green". This usually implies A-Blue-Green order (3 slots involved).
   - **Let's Restart Logic:**
     - **Slots:** 1 2 3 4 5
     - F at 1 (Left end). C at 2 (White).
     - Slot 3 is Red.
     - Remaining cars: A, B, D.
     - Condition: B is imm left of D => [BD] block.
     - Where can [BD] go?
       - Option A: Slots 3, 4. B is 3(Red), D is 4.
       - Option B: Slots 4, 5. B is 4, D is 5. Slot 3 is Red (Audi?).
     - Condition: Blue is between Audi and Green.
       - This refers to COLORS/CARS. The "Blue car" is a variable.
       - "Blue car is between Audi and Green car".
       - This implies a sequence: Audi ... Blue ... Green (or reverse).
     - Let's try **Option A** (B=3, D=4).
       - Cars so far: 1(F), 2(C), 3(B), 4(D).
       - Remaining Car: Audi must be at 5.
       - Colors: 2=White. 3=Red (so BMW is Red).
       - Constraint: "Dodge is not Red". Here Dodge is 4 (Color unknown). BMW is 3 (Red). Valid.
       - Now check "Blue is between Audi and Green".
       - Cars positions: F(1), C(2), B(3), D(4), A(5).
       - Colors known: C=White, B=Red.
       - Remaining Colors: Blue, Green, Black.
       - Blue is "between Audi and Green".
       - Audi is at 5.
       - If Audi is one anchor, Blue must be at 4, Green at 3? No, 3 is Red.
       - Logic failure. "Between" doesn't mean adjacent, but order matters.
       - Maybe Audi is at 3? No, B is at 3.
     - Let's try **Option B** (B=4, D=5).
       - Cars so far: 1(F), 2(C). [BD] at 4,5.
       - Slot 3 is Audi. (Only car left).
       - So Audi is at Slot 3 (Red).
       - Check "Blue is between Audi and Green".
         - Audi is at 3. Green must be at 1 or 5?
         - If Green is at 1 (Ferrari): Then Blue must be at 2? But 2 is White (Chevy). Impossible.
         - If Green is at 5 (Dodge): Then Blue must be at 4 (BMW).
         - Order: Audi(3) ... Blue(4) ... Green(5).
         - Does this work? Blue=BMW, Green=Dodge.
         - Is "Blue between Audi and Green"? Yes: 3(A) - 4(Blue) - 5(Green).
     - **Final Arrangement**:
       - 1: Ferrari (Black)
       - 2: Chevrolet (White)
       - 3: Audi (Red) - **Middle!**
       - 4: BMW (Blue)
       - 5: Dodge (Green)
     - **Verification**:
       - F at end? Yes (1).
       - Red in middle? Yes (Audi at 3).
       - BMW left of Dodge? Yes (4 left of 5).
       - Blue between A and Green? Yes (Blue at 4, A at 3, Green at 5).
       - Chevy White & right of F? Yes (2).
       - Dodge not Red? Yes (Green).

**Answer:** The car in the middle (Slot 3) is the **Audi**.
          `
        },
        {
          id: 'dilr-set-1-q2',
          topicId: 'dilr-arrangements',
          difficulty: 'HARD',
          type: 'TITA',
          estimatedTimeSeconds: 60,
          questionMarkdown: 'What color is the Ferrari? (Type the color name)',
          solutionMarkdown: `
Based on the deduction above:
1. Slot 1 is Ferrari.
2. Colors placed: White(2), Red(3), Blue(4), Green(5).
3. The only remaining color for Slot 1 is **Black**.

Answer: **Black**.
          `,
          options: ['Black', 'Blue', 'Green', 'Red'], // Provided for display if needed, but TITA input logic handles pure text
          correctOptionIndex: 0
        }
      ]
    }
  ]
};
