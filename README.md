# CKAD Interactive Learning

An interactive web-based learning platform for Kubernetes Certified Application Developer (CKAD) certification preparation.

## Features

- **Progressive Learning**: Content unlocks as you complete commands in the terminal
- **Interactive Terminal**: Practice kubectl commands with real-time validation
- **Hands-On Labs**: Task-based exercises with hints and solutions
- **Quizzes**: Mixed MCQ and command-based questions to test your knowledge
- **Resizable Interface**: Drag-to-resize panels for optimal viewing
- **Progress Tracking**: Visual indicators for completed lessons, commands, and tasks

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **Lucide React** for icons
- **React Resizable Panels** for split-pane layout

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to the app directory:
```bash
cd kubernetes/learn/app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5001`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Course Structure

The course includes 4 main modules:

### 1. Pods
- Introduction to Pods
- Creating and managing pods
- Pod lifecycle
- Hands-on lab and quiz

### 2. Deployments
- Introduction to Deployments
- Rolling updates and rollbacks
- Scaling applications
- Deployment strategies

### 3. Services
- Service types (ClusterIP, NodePort, LoadBalancer)
- Service discovery
- Exposing applications
- Networking basics

### 4. ConfigMaps & Secrets
- Configuration management
- Environment variables
- Sensitive data handling
- Best practices

## How It Works

### Progressive Content Unlocking

Lessons use a progressive unlocking system:
1. Read the content
2. Practice the command in the terminal
3. Next section unlocks when you complete the command
4. Continue until the entire lesson is complete

### Terminal Commands

The interactive terminal simulates kubectl commands:
- Type commands exactly as shown in the examples
- Get instant feedback on correctness
- View mock Kubernetes resources
- Practice without a real cluster

### Labs

Hands-on exercises with:
- Clear task descriptions
- Hints for guidance
- Solutions if you get stuck
- Progress tracking

### Quizzes

Test your knowledge with:
- Multiple choice questions
- Command-based questions
- Instant feedback
- Detailed explanations
- 70% passing score

## Keyboard Shortcuts

- **↑/↓ Arrow Keys**: Navigate command history in terminal
- **Enter**: Execute terminal command

## Customization

### Adding New Content

Edit `src/App.tsx` and add new modules to the `courseModules` array:

```typescript
const courseModules: Module[] = [
  {
    id: 'your-module',
    title: 'Your Module',
    icon: 'box',
    lessons: [...],
    labs: [...],
    quizzes: [...]
  }
];
```

### Styling

- Global styles: `src/styles/globals.css`
- Tailwind config: `tailwind.config.js`
- UI components: `src/components/ui/`

## Project Structure

```
app/
├── src/
│   ├── components/
│   │   └── ui/          # Reusable UI components
│   ├── styles/
│   │   └── globals.css  # Global styles
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Part of the Docker/Kubernetes learning workspace.

## Contributing

This is a learning project. Feel free to extend it with:
- More modules and lessons
- Additional quiz questions
- Enhanced terminal simulation
- Real cluster integration
- User authentication
- Progress persistence

## Acknowledgments

Built with modern React patterns and best practices for an optimal learning experience.

