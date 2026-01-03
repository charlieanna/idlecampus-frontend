import { Card } from "../ui/card";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function SubsetsExplanation() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      title: "Step 1: Start with empty set",
      description: "Begin with current = [] and start = 0",
      code: `current = []
result = []

# Save the empty set
result.append(current[:])  # [[]]`,
      explanation: "Every state is valid in subsets, so we save [] immediately"
    },
    {
      title: "Step 2: Include first element (1)",
      description: "Add 1 to current and recurse",
      code: `current.append(nums[0])  # current = [1]
result.append(current[:])  # [[], [1]]`,
      explanation: "We include 1 and continue exploring from index 1"
    },
    {
      title: "Step 3: Include second element (2)",
      description: "Add 2 to current [1]",
      code: `current.append(nums[1])  # current = [1, 2]
result.append(current[:])  # [[], [1], [1,2]]`,
      explanation: "Now exploring with both 1 and 2 included"
    },
    {
      title: "Step 4: Include third element (3)",
      description: "Add 3 to current [1, 2]",
      code: `current.append(nums[2])  # current = [1, 2, 3]
result.append(current[:])  # [[], [1], [1,2], [1,2,3]]`,
      explanation: "All elements included - reached the end"
    },
    {
      title: "Step 5: Backtrack - Remove 3",
      description: "Pop 3 from current",
      code: `current.pop()  # current = [1, 2]
# No more elements after index 2, backtrack again`,
      explanation: "We explored all paths with [1,2,3], now try without 3"
    },
    {
      title: "Step 6: Backtrack - Remove 2",
      description: "Pop 2 from current",
      code: `current.pop()  # current = [1]
# Now try including 3 directly after 1`,
      explanation: "Back to [1], ready to try [1,3] path"
    },
    {
      title: "Step 7: Include 3 (skip 2)",
      description: "Add 3 to current [1]",
      code: `current.append(nums[2])  # current = [1, 3]
result.append(current[:])  # [..., [1,3]]`,
      explanation: "This creates the [1,3] subset"
    },
    {
      title: "Step 8: Continue exploration",
      description: "Backtrack and explore [2], [2,3], and [3]",
      code: `# After backtracking to []
# Try paths starting with 2 and 3
# Final: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]`,
      explanation: "Complete all remaining paths systematically"
    },
  ];

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Step-by-Step Execution Trace</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Click on each step to see detailed explanation
      </p>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedStep(expandedStep === index ? null : index)}
              className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {expandedStep === index ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{step.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{step.description}</span>
            </button>
            
            {expandedStep === index && (
              <div className="p-3 bg-muted/30 border-t space-y-2">
                <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
                  <code>{step.code}</code>
                </pre>
                <p className="text-xs text-muted-foreground">{step.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
