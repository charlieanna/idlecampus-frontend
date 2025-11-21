#!/bin/bash

# Fix explanation strings in challenge files
# Replace single quotes with backticks for explanation fields that contain apostrophes

FILES=(
  "src/apps/system-design/builder/challenges/tinyUrl.ts"
  "src/apps/system-design/builder/challenges/todoApp.ts"
  "src/apps/system-design/builder/challenges/foodBlog.ts"
  "src/apps/system-design/builder/challenges/webCrawler.ts"
  "src/apps/system-design/builder/challenges/internal-systems/dataLabelingPlatform.ts"
  "src/apps/system-design/builder/challenges/internal-systems/sloSliReporting.ts"
  "src/apps/system-design/builder/challenges/definitions/generated-all/nfrTeachingChapter0.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."

    # Use perl to replace explanation: 'text' with explanation: `text`
    # This handles multi-line strings
    perl -i -0pe "s/explanation: '((?:[^'\\\\]|\\\\.)*)'/explanation: \`\$1\`/gs" "$file"

    echo "  ✓ Fixed"
  else
    echo "  ⚠ File not found: $file"
  fi
done

echo ""
echo "All files processed!"
