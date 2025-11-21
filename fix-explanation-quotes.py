#!/usr/bin/env python3
import re
import sys

files_to_fix = [
    "src/apps/system-design/builder/challenges/tinyUrl.ts",
    "src/apps/system-design/builder/challenges/todoApp.ts",
    "src/apps/system-design/builder/challenges/foodBlog.ts",
    "src/apps/system-design/builder/challenges/webCrawler.ts",
    "src/apps/system-design/builder/challenges/internal-systems/dataLabelingPlatform.ts",
    "src/apps/system-design/builder/challenges/internal-systems/sloSliReporting.ts",
    "src/apps/system-design/builder/challenges/definitions/generated-all/nfrTeachingChapter0.ts",
]

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find all explanation: 'text' patterns and replace with explanation: `text`
        # This regex handles single-line explanations
        pattern = r"explanation: '([^']*?)'"

        # Check if there are any matches
        matches = list(re.finditer(pattern, content))

        if matches:
            print(f"Fixing {filepath}...")
            # Replace single quotes with backticks
            content = re.sub(pattern, r"explanation: `\1`", content)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Fixed {len(matches)} explanation(s)")
        else:
            # Try to find multi-line explanation with escaped characters
            # This is trickier - look for explanation: ' followed eventually by ',
            # The issue is these strings can span many lines

            # Let's check if explanation: ' exists at all
            if "explanation: '" in content:
                print(f"Fixing {filepath} (multi-line)...")

                # Strategy: Find each "explanation: '" and replace with "explanation: `"
                # Then find the matching closing "'" (but not ones that are part of contractions)
                content = content.replace("explanation: '", "explanation: `")

                # Now we need to find the closing quote. This is harder.
                # Let's use a more sophisticated approach: find },\n after explanation: `
                # and replace the ' before }, with `

                # Actually, let's just replace the pattern more carefully
                # Look for explanation: ' at start and ', or '\n} at end
                pattern2 = r"explanation: '((?:[^']|'(?=[a-z]))*?)'\s*([,}])"
                content = re.sub(pattern2, r"explanation: `\1`\2", content, flags=re.DOTALL)

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  ✓ Fixed (multi-line)")
            else:
                print(f"  ℹ No changes needed: {filepath}")

        return True
    except Exception as e:
        print(f"  ✗ Error fixing {filepath}: {e}")
        return False

print("Fixing explanation quotes in challenge files...\n")

success_count = 0
for filepath in files_to_fix:
    if fix_file(filepath):
        success_count += 1

print(f"\n{'='*60}")
print(f"Processed {len(files_to_fix)} files")
print(f"Successfully fixed: {success_count}")
print(f"{'='*60}")
