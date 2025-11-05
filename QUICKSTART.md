# 🚀 CKAD Interactive Learning - Quick Start

## Run the Application

### Option 1: Quick Start Script (Recommended)
```bash
cd kubernetes/learn/app
./start.sh
```

### Option 2: Manual Start
```bash
cd kubernetes/learn/app
npm install  # Only needed once
npm run dev
```

The application will open automatically at **http://localhost:3000**

## What You'll See

1. **Left Sidebar**: Course navigation with 4 modules
   - Pods
   - Deployments
   - Services
   - ConfigMaps & Secrets

2. **Center Panel**: Lesson content with progressive unlocking
   - Read the content
   - Practice commands
   - Unlock next section

3. **Right Panel**: Interactive terminal
   - Type kubectl commands
   - Get instant feedback
   - View mock Kubernetes resources

## How to Use

### 1. Start Learning
- Click on "Introduction to Pods" in the sidebar
- Read the content
- Look for the blue highlighted command box

### 2. Practice Commands
- Type the exact command shown in the terminal
- Press Enter to execute
- Watch the next section unlock!

### 3. Complete Lessons
- Work through all commands in order
- See your progress in the sidebar
- Green checkmarks show completion

### 4. Try Labs
- Click "Lab" button after completing a lesson
- Complete practical tasks
- Use hints if you get stuck
- View solutions when needed

### 5. Take Quizzes
- Test your knowledge with MCQ and command questions
- Get instant feedback
- Review answers with explanations
- Score 70% or higher to pass

## Tips

- **Copy Commands**: Hover over command examples to copy them
- **Command History**: Use ↑/↓ arrow keys in terminal
- **Resize Panels**: Drag the center divider to adjust space
- **Progress Tracking**: Watch the green progress bar in sidebar

## Keyboard Shortcuts

- `Enter` - Execute terminal command
- `↑` - Previous command in history
- `↓` - Next command in history

## Example Commands to Try

```bash
# In the terminal, type these exact commands:
kubectl run nginx --image=nginx
kubectl get pods -o wide
kubectl describe pod nginx
kubectl delete pod nginx
```

## Need Help?

- **Stuck on a command?** Check the example shown in the lesson
- **Need guidance?** Click "Show Hint" in labs
- **Want to see the answer?** Click "Show Solution" in labs

## Building for Production

```bash
npm run build    # Creates optimized build in dist/
npm run preview  # Preview production build locally
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# The dev server will try port 3001, 3002, etc.
# Or manually specify a port:
npm run dev -- --port 3001
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall:
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Ensure you have Node.js 18+:
node --version

# Update dependencies:
npm update
```

## What's Next?

1. Complete all 4 modules
2. Finish all labs and quizzes
3. Build confidence with Kubernetes!
4. Prepare for CKAD certification

---

**Happy Learning! 🎓**

