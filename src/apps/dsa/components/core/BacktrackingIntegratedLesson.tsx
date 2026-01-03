import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

/**
 * Integrated Backtracking Lesson for DSA Course
 * Designed to work with the existing stage-based layout
 */

// Export individual sections that can be used in stages
export function TreeFirstWorkshop() {
  const [activeExercise, setActiveExercise] = useState(0);

  const exercises = [
    {
      title: "Combination Sum III",
      difficulty: "Hard" as const,
      description: "Find all combinations of k numbers that sum to n",
      constraints: [
        "Use only numbers 1-9",
        "Each number used at most once",
        "Example: k=3, n=9 → [[1,2,6], [1,3,5], [2,3,4]]",
      ],
    },
    {
      title: "Generate Parentheses",
      difficulty: "Medium" as const,
      description: "Generate all valid combinations of n pairs of parentheses",
      constraints: [
        "Must be well-formed (balanced)",
        'Example: n=2 → ["(())", "()()"]',
        'Example: n=3 → ["((()))", "(()())", "(())()", "()(())", "()()()"]',
      ],
    },
  ];

  const current = exercises[activeExercise];

  return (
    <div className="space-y-6">
      {/* Exercise Selector */}
      <div className="flex gap-3">
        {exercises.map((ex, idx) => (
          <button
            key={idx}
            onClick={() => setActiveExercise(idx)}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              idx === activeExercise
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Problem {idx + 1}</span>
              <Badge
                className={
                  ex.difficulty === "Easy"
                    ? "bg-green-600"
                    : ex.difficulty === "Medium"
                    ? "bg-orange-600"
                    : "bg-red-600"
                }
              >
                {ex.difficulty}
              </Badge>
            </div>
            <h4 className="text-slate-900">{ex.title}</h4>
          </button>
        ))}
      </div>

      {/* Current Exercise */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
        <div className="mb-4">
          <h3 className="text-blue-900 mb-2">{current.title}</h3>
          <p className="text-slate-700 mb-3">{current.description}</p>
          <div className="bg-blue-900/10 p-4 rounded-lg">
            <ul className="text-sm space-y-1 list-disc list-inside">
              {current.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {activeExercise === 0 ? (
            <CombinationSumSteps />
          ) : (
            <ParenthesesSteps />
          )}
        </div>
      </Card>
    </div>
  );
}

function CombinationSumSteps() {
  return (
    <>
      <StepCard number={1} title="Manual Problem Solving (k=3, n=9)" color="green">
        <div className="p-3 bg-white rounded mb-3">
          <div className="mb-2">🤔 Let's think through this manually:</div>
          <ul className="space-y-1 text-xs">
            <li>• Need 3 numbers from 1-9 that sum to 9</li>
            <li>• Can't repeat numbers</li>
            <li>• Let's try systematically...</li>
          </ul>
        </div>

        <div className="p-3 bg-blue-50 rounded mb-3">
          <div className="mb-2">Start with 1:</div>
          <ul className="text-xs space-y-1">
            <li>• [1, ?, ?] → need 2 more numbers summing to 8</li>
            <li>• Try 2: [1, 2, ?] → need 1 more = 6 ✓ Found: [1,2,6]</li>
            <li>• Try 3: [1, 3, ?] → need 1 more = 5 ✓ Found: [1,3,5]</li>
            <li>• Try 4: [1, 4, ?] → need 1 more = 3 (but 3 {'<'} 4!) ✗</li>
          </ul>
        </div>

        <div className="p-3 bg-green-100 rounded border-l-4 border-green-600">
          <div className="mb-1">💡 Discoveries:</div>
          <ul className="text-xs space-y-1">
            <li>• Pattern: Try choices in order to avoid duplicates</li>
            <li>• Track: current combo, remaining sum, remaining count</li>
            <li>• Stop when: remaining sum = 0 AND count = 0</li>
          </ul>
        </div>
      </StepCard>

      <StepCard number={2} title="Decision Tree for k=3, n=9" color="purple">
        <pre className="text-xs font-mono bg-slate-900 text-green-400 p-4 rounded overflow-x-auto">
{`                    [] (remaining=9, count=3)
          /         |        |         \\
    [1](8,2)    [2](7,2)  [3](6,2)  [4](5,2)...
      /  \\         /  \\       /  \\
  [1,2]  [1,3]  [2,3] [2,4] [3,4] [3,5]
  (7,1)  (6,1)  (5,1) (4,1) (3,1) (2,1)
    |      |      |     |     |     |
  [1,2,6][1,3,5][2,3,4]...
    ✓      ✓      ✓

Key: (current, remaining_sum, remaining_count)
Branches = try next numbers 1-9
Pruning = skip if remaining < 0 or count < 0`}
        </pre>

        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <div className="mb-2">🎯 Why Tree Helps:</div>
          <ul className="text-sm space-y-1">
            <li>• SEE what state to track</li>
            <li>• SPOT pruning opportunities</li>
            <li>• KNOW when to save results</li>
          </ul>
        </div>
      </StepCard>

      <StepCard number={3} title="Universal 4 Steps" color="purple">
        <UniversalStepsTemplate />
      </StepCard>
    </>
  );
}

function ParenthesesSteps() {
  return (
    <>
      <StepCard number={1} title="Manual Problem Solving (n=2)" color="emerald">
        <div className="p-3 bg-white rounded mb-3">
          <div className="mb-2">🤔 Building valid parentheses:</div>
          <ul className="space-y-1 text-xs font-mono">
            <li>• "" → can only add '(' first</li>
            <li>• "(" → can add '(' or ')'</li>
            <li>• "((" → must add ')'</li>
            <li>• "(()" → can add ')'</li>
            <li>• "(())" ✓ Complete!</li>
          </ul>
        </div>

        <div className="p-3 bg-green-100 rounded border-l-4 border-green-600">
          <div className="mb-1">💡 Discoveries:</div>
          <ul className="text-xs space-y-1">
            <li>• Can add '(' only if we haven't used all n pairs</li>
            <li>• Can add ')' only if we have more '(' than ')'</li>
            <li>• Track: current string, open count, close count</li>
          </ul>
        </div>
      </StepCard>

      <StepCard number={2} title="Decision Tree for n=2" color="emerald">
        <pre className="text-xs font-mono bg-slate-900 text-green-400 p-4 rounded overflow-x-auto">
{`            "" (open=0, close=0)
                  |
                "(" (open=1, close=0)
              /           \\
    "((" (open=2)      "()" (open=1,close=1)
        |                    |
    "(()" (close=1)      "()(" (open=2,close=1)
        |                    |
    "(())" ✓             "()()" ✓

Constraint: Can add ')' only if close < open`}
        </pre>
      </StepCard>
    </>
  );
}

function UniversalStepsTemplate() {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-white rounded border-l-4 border-blue-500">
        <div className="flex items-start gap-3">
          <Badge className="bg-blue-600">1</Badge>
          <div className="flex-1">
            <div className="mb-1">BASE CASE</div>
            <div className="text-sm text-slate-600">
              <div>
                <strong>Tree:</strong> Reached a leaf node?
              </div>
              <div className="font-mono text-xs bg-slate-100 p-2 rounded mt-1">
                if len(current) == k and remaining == 0: ✓
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white rounded border-l-4 border-green-500">
        <div className="flex items-start gap-3">
          <Badge className="bg-green-600">2</Badge>
          <div className="flex-1">
            <div className="mb-1">LOOP CHOICES</div>
            <div className="text-sm text-slate-600">
              <div>
                <strong>Tree:</strong> What branches from this node?
              </div>
              <div className="font-mono text-xs bg-slate-100 p-2 rounded mt-1">
                for i in range(start, 10): # Try 1-9
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white rounded border-l-4 border-purple-500">
        <div className="flex items-start gap-3">
          <Badge className="bg-purple-600">3</Badge>
          <div className="flex-1">
            <div className="mb-1">CHOOSE → EXPLORE → UNCHOOSE</div>
            <div className="text-sm text-slate-600">
              <div>
                <strong>Tree:</strong> Visit child, then backtrack
              </div>
              <div className="font-mono text-xs bg-slate-100 p-2 rounded mt-1">
                {`current.append(i)           # CHOOSE
backtrack(i+1, remaining-i) # EXPLORE
current.pop()                # UNCHOOSE`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConceptReference() {
  return (
    <div className="space-y-6">
      <ConceptCard title="Start from Final Answers">
        <p className="text-sm text-slate-600 mb-3">
          For each problem, first imagine all final answers. This anchors your
          decision tree.
        </p>
        <div className="rounded-lg border border-slate-300 p-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">
            Permutations of [1,2,3] — Final Answers
          </div>
          <div className="rounded-lg bg-slate-50 p-3 overflow-auto">
            <pre className="text-xs leading-5 font-mono">
              {`[1,2,3]  [1,3,2]  [2,1,3]  [2,3,1]  [3,1,2]  [3,2,1]`}
            </pre>
          </div>
        </div>
      </ConceptCard>

      <ConceptCard title="Subsets — Include/Skip Pattern">
        <div className="rounded-lg border border-slate-300 p-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">
            Subsets of [1,2,3] — Decision Tree
          </div>
          <div className="rounded-lg bg-slate-50 p-3 overflow-auto">
            <pre className="text-xs leading-5 font-mono">
              {`include 1 → include 2 → include 3  → [1,2,3]
                         └→ skip 3    → [1,2]
           └→ skip 2   → include 3    → [1,3]
                         └→ skip 3    → [1]

skip 1    → include 2 → include 3    → [2,3]
                         └→ skip 3    → [2]
           └→ skip 2   → include 3    → [3]
                         └→ skip 3    → []`}
            </pre>
          </div>
        </div>
        <div className="rounded-lg border-l-4 border-l-emerald-500 bg-emerald-50 p-3 text-sm mt-3">
          State that flows: (index, current_subset). Every node makes an
          include/skip decision.
        </div>
      </ConceptCard>

      <ConceptCard title="Universal Template">
        <div className="rounded-lg border border-slate-300 p-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">
            Universal Backtracking Template
          </div>
          <div className="rounded-lg bg-slate-50 p-3 overflow-auto">
            <pre className="text-xs leading-5 font-mono">
              {`def backtrack(state):
    if done(state):
        record(state)
        return
    for choice in choices(state):
        apply(choice, state)
        backtrack(state)
        undo(choice, state)`}
            </pre>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="p-3 bg-blue-50 rounded">
            <strong>Subsets</strong>: state = (index, path); choices =
            include/skip
          </div>
          <div className="p-3 bg-green-50 rounded">
            <strong>Permutations</strong>: state = (path, used[]); choices = any
            unused element
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <strong>Parentheses</strong>: state = (open, close); choices = '(' or
            ')' if valid
          </div>
        </div>
      </ConceptCard>
    </div>
  );
}

export function PracticeLadder() {
  const groups = [
    {
      heading: "🌱 Easy (Small Trees)",
      color: "green",
      items: [
        "Subsets of [1,2]",
        "Binary strings of length 2",
        "Coin toss (2 tosses)",
        "Permutations of [1,2]",
        "Combinations (k=1) from [1,2,3]",
      ],
    },
    {
      heading: "🎯 Core (Classic Shapes)",
      color: "blue",
      items: [
        "Subsets of [1,2,3]",
        "Permutations of [1,2,3]",
        "Binary strings of length 3",
        "Letter case permutations ('a1b2')",
        "Phone number letter combinations",
      ],
    },
    {
      heading: "🔧 Constraint Logic (Pruning)",
      color: "purple",
      items: [
        "Balanced parentheses n=3",
        "Combinations (k=2) from [1,2,3,4]",
        "2×2 grid paths (R/D moves)",
        "Valid IP addresses",
        "Sudoku solver (small board)",
      ],
    },
    {
      heading: "🚀 Advanced",
      color: "orange",
      items: [
        "Permutations with duplicates [1,1,2]",
        "Combination Sum (target 7)",
        "N-Queens (n=4)",
        "Word search in grid",
        "Palindrome partitioning",
      ],
    },
  ];

  return (
    <div className="grid gap-4">
      {groups.map((g, i) => (
        <Card key={i} className="p-6 bg-white border-2 border-slate-200">
          <h4 className="text-slate-900 mb-3">{g.heading}</h4>
          <ul className="list-disc pl-6 text-sm leading-7 space-y-1">
            {g.items.map((it, j) => (
              <li key={j} className="text-slate-700">
                {it}
              </li>
            ))}
          </ul>
          <div className="mt-3 text-xs text-slate-500 italic">
            For each: write final answers → draw tree → identify state flow →
            implement
          </div>
        </Card>
      ))}
    </div>
  );
}

// Helper components
function StepCard({
  number,
  title,
  color,
  children,
}: {
  number: number;
  title: string;
  color: "green" | "purple" | "emerald";
  children: React.ReactNode;
}) {
  const colorClasses = {
    green: "bg-green-50 border-green-300",
    purple: "bg-purple-50 border-purple-300",
    emerald: "bg-emerald-50 border-emerald-300",
  }[color];

  const textColor = {
    green: "text-green-800",
    purple: "text-purple-800",
    emerald: "text-emerald-800",
  }[color];

  return (
    <div className={`p-4 rounded-lg border ${colorClasses}`}>
      <h4 className={`mb-3 ${textColor}`}>
        🎯 Step {number}: {title}
      </h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ConceptCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6 bg-white border-2 border-slate-200">
      <h3 className="text-slate-900 mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </Card>
  );
}

// Full standalone version (can be used independently)
export default function BacktrackingIntegratedLesson() {
  const [activeSection, setActiveSection] = useState<
    "workshop" | "concepts" | "practice"
  >("workshop");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-5xl p-6 space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            🌳 Backtracking Mastery
          </h1>
          <p className="text-slate-600">
            Draw trees first → Understand state flow → Write code
          </p>
        </header>

        {/* Section Tabs */}
        <div className="flex gap-3 border-b border-slate-200">
          {[
            { id: "workshop", label: "Tree-First Workshop" },
            { id: "concepts", label: "Concept Reference" },
            { id: "practice", label: "Practice Ladder" },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() =>
                setActiveSection(section.id as typeof activeSection)
              }
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeSection === section.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeSection === "workshop" && <TreeFirstWorkshop />}
          {activeSection === "concepts" && <ConceptReference />}
          {activeSection === "practice" && <PracticeLadder />}
        </div>
      </div>
    </div>
  );
}
