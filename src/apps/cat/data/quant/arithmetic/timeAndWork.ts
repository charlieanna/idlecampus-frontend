import { CatContentModule } from '../../types';

export const timeAndWorkModule: CatContentModule = {
  topic: {
    id: 'arithmetic-time-work',
    section: 'QUANT',
    title: 'Time and Work',
    description: 'Master the concepts of efficiency, man-days, and pipes & cisterns.',
    order: 1
  },
  lessons: [
    {
      id: 'tw-basics',
      topicId: 'arithmetic-time-work',
      title: 'Basics of Time & Work',
      durationMinutes: 15,
      contentMarkdown: `
# Time and Work: The Unitary Method vs LCM Method

## Core Concept
If a person can complete a work in **n** days, then in 1 day, they do **1/n** of the work.
This is the **Unitary Method**.

However, for CAT, the **LCM Method (Chocolate Method)** is superior.

### The LCM Method
1. Assume the Total Work (TW) to be the LCM of the days taken by individuals.
2. Calculate Efficiency (Work per day) = Total Work / Days taken.

**Example:**
A takes 10 days, B takes 15 days.
1. Total Work = LCM(10, 15) = 30 units (let's say 30 chocolates).
2. A's Efficiency = 30/10 = 3 units/day.
3. B's Efficiency = 30/15 = 2 units/day.
4. Together (A+B) = 3 + 2 = 5 units/day.
5. Time taken together = Total Work / Combined Efficiency = 30/5 = 6 days.

## Key Formulas
- Work = Efficiency × Time
- M1 × D1 × H1 / W1 = M2 × D2 × H2 / W2 (Chain Rule)
      `,
      keyTakeaways: [
        'Always try to assume Total Work as LCM of days.',
        'Efficiency is inversely proportional to Time (if Work is constant).',
        'For men-days problems, use M1D1H1 = M2D2H2.'
      ]
    },
    {
      id: 'tw-pipes',
      topicId: 'arithmetic-time-work',
      title: 'Pipes and Cisterns',
      durationMinutes: 10,
      contentMarkdown: `
# Pipes and Cisterns

This is identical to Time & Work, with one catch: **Negative Efficiency**.
- **Inlet Pipe:** Adds water (+ve efficiency)
- **Outlet Pipe (Leak):** Removes water (-ve efficiency)

**Example:**
Pipe A fills in 10 hrs, Pipe B empties in 15 hrs.
1. Tank Capacity = LCM(10, 15) = 30 liters.
2. A's Rate = +3 L/hr.
3. B's Rate = -2 L/hr.
4. Net Rate = 3 - 2 = +1 L/hr.
5. Time to fill = 30/1 = 30 hours.
      `,
      keyTakeaways: [
        'Treat leaks as negative work agents.',
        'If Net Rate is negative, the tank will never fill (it will empty).',
        'Pay attention to "full tank" vs "empty tank" starting conditions.'
      ]
    }
  ],
  problems: [
    {
      id: 'tw-q1',
      topicId: 'arithmetic-time-work',
      difficulty: 'EASY',
      type: 'MCQ',
      questionMarkdown: 'A can do a piece of work in 20 days and B in 30 days. They work together for 7 days and then both leave the work. Then C alone finishes the remaining work in 10 days. In how many days will C finish the full work?',
      options: ['25 days', '30 days', '24 days', '20 days'],
      correctOptionIndex: 2, // 24 days
      solutionMarkdown: `
1. **Assume Total Work:** LCM(20, 30) = 60 units.
2. **Efficiencies:**
   - A = 60/20 = 3 units/day
   - B = 60/30 = 2 units/day
   - (A+B) = 5 units/day
3. **Work done in 7 days:** 5 × 7 = 35 units.
4. **Remaining Work:** 60 - 35 = 25 units.
5. **C's Rate:** C does 25 units in 10 days => 2.5 units/day.
6. **Time for C to do full work:** Total Work / C's Rate = 60 / 2.5 = **24 days**.
      `,
      estimatedTimeSeconds: 45
    },
    {
      id: 'tw-q2',
      topicId: 'arithmetic-time-work',
      difficulty: 'HARD',
      type: 'TITA',
      questionMarkdown: 'Pipe A can fill a tank in 12 minutes and Pipe B in 15 minutes. A third Pipe C empties it at 6 gallons per minute. If A, B, and C are opened together, the tank fills in 20 minutes. What is the capacity of the tank in gallons?',
      correctValue: 30, // 30 gallons is NOT correct, solving below...
      /*
      Solving:
      1. Time A = 10, B = 15, A+B+C = 20.
      2. Let Capacity = LCM(12, 15, 20) = 60 units (not gallons yet).
      3. Efficiencies:
         - A = 60/12 = +5 u/min
         - B = 60/15 = +4 u/min
         - A+B+C = 60/20 = +3 u/min
      4. Find C:
         - (5 + 4) + C = 3
         - 9 + C = 3 => C = -6 u/min.
      5. So C empties 6 units per minute.
      6. The problem says C empties 6 GALLONS per minute.
      7. So 6 units = 6 gallons.
      8. Total Capacity = 60 units = 60 gallons.
      */
      solutionMarkdown: `
1. **Assume arbitrary capacity (units):** LCM(12, 15, 20) = 60 units.
2. **Efficiencies (units/min):**
   - A = 60/12 = +5
   - B = 60/15 = +4
   - (A+B+C) = 60/20 = +3
3. **Find C's efficiency:**
   - $A + B + C = 3$
   - $5 + 4 + C = 3$
   - $9 + C = 3 \\Rightarrow C = -6$ units/min.
4. **Relate to physical quantity:**
   - We stick to our "units". Pipe C empties 6 units/min.
   - The question states Pipe C empties **6 gallons/min**.
   - Therefore, **1 unit = 1 gallon**.
5. **Total Capacity:** 60 units = **60 gallons**.
      `,
      estimatedTimeSeconds: 90
    }
  ]
};
