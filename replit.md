# IdleCampus Learning Platform

## Overview

IdleCampus is an interactive learning platform for technical education, combining hands-on practice with theoretical knowledge. The platform currently offers courses in:

- **Kubernetes (CKAD)** - Interactive kubectl terminal with progressive lesson unlocking
- **Docker** - Container technology learning with CLI practice
- **System Design** - Visual builder for designing distributed systems (699 challenges)
- **Coding Interview** - Algorithm and data structure problems (438+ problems)
- **IIT JEE Chemistry** - Comprehensive curriculum with 28 modules

The platform emphasizes learning-by-doing through simulated terminals, visual editors, interactive quizzes, and real-world problem scenarios.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 + TypeScript + Vite

**Key Design Patterns**:
- **Multi-app architecture**: Single React application serves multiple course types via URL-based routing (`?course=<name>`)
- **Component-based UI**: Shared UI components (shadcn/ui style) with course-specific feature components
- **Progressive content unlocking**: Content reveals as users complete interactive tasks
- **Resizable panels**: Split-pane layouts using react-resizable-panels for optimal viewing

**Core Technologies**:
- Tailwind CSS for styling with custom design system
- Framer Motion for smooth animations and transitions
- Monaco Editor for code editing capabilities
- React Flow for visual system design canvas
- Lucide React for iconography

**State Management**:
- Local component state for UI interactions
- Custom hooks for API data fetching and caching
- No global state library (Redux/Zustand) - intentionally kept simple

### Backend Architecture

**API Server**: Node.js/Express (Port 3001)

**Key Responsibilities**:
- RESTful API endpoints for course content delivery
- Python code execution service with sandboxing
- Challenge validation and test running
- Progress tracking and user enrollment

**Security Features**:
- Subprocess-based Python execution with timeouts (5s default)
- Resource limits via ulimit for memory constraints
- Temporary file cleanup after execution
- CORS enabled for frontend communication

**API Design**:
- Versioned endpoints (`/api/v1/`)
- Separate public and authenticated routes
- Standard REST conventions (GET for retrieval, POST for creation)

### Data Storage

**Current State**: No database dependency in the codebase

**Data Sources**:
- Course content stored as TypeScript/JavaScript modules
- 699 system design problems defined in code
- 438+ coding problems extracted and parsed from markdown
- Chemistry curriculum with 28 modules as code definitions

**Future Consideration**: The architecture mentions Drizzle ORM without requiring PostgreSQL initially, suggesting planned database integration for user progress and state persistence.

### Course Delivery Patterns

**1. Terminal-Based Learning** (Kubernetes, Docker):
- Simulated command-line interface
- Command validation and mock responses
- Command history with arrow key navigation
- Progressive content unlocking tied to command completion

**2. Visual Builder** (System Design):
- Drag-and-drop component canvas using React Flow (starts empty - users build from scratch)
- Component palette with real AWS instance types
- Conditional tab visibility: Python code editor tab appears only when app_server component is added to canvas
- Analytical simulation engine (not discrete-event)
- Pass/fail validation with explanatory feedback
- Cost estimation based on component configuration

**3. Code Editor** (Coding Interview):
- Monaco editor integration
- Test-driven validation
- Execution against predefined test cases
- Python code execution via backend API

**4. Rich Content** (Chemistry):
- LaTeX formula rendering
- Comprehensive lessons with worked examples
- Quiz system with multiple question types
- Structured curriculum with module dependencies

### Content Architecture

**Problem Definition System**:
- TypeScript-based problem definitions with strong typing
- Standardized problem structure (FR, NFR, scenarios, test cases)
- Automated generation from markdown source files
- Category-based organization (caching, streaming, storage, etc.)

**Progressive Difficulty Levels**:
- System design problems use 5-level progression (like algorithm optimization)
- Level 1: Connectivity verification (brute force)
- Level 2-5: Progressive optimization and edge case handling
- Each level has specific traffic patterns and pass criteria

## External Dependencies

### Frontend Dependencies

**Core Framework**:
- `react@18.3.1` + `react-dom@18.3.1` - UI framework
- `vite@5.4.10` - Build tool and dev server
- `typescript@5.6.2` - Type safety

**UI Libraries**:
- `tailwindcss@3.4.15` - Utility-first CSS framework
- `framer-motion@11.11.17` - Animation library
- `lucide-react@0.552.0` - Icon library
- `react-resizable-panels@2.1.7` - Split pane layouts

**Specialized Components**:
- `@monaco-editor/react@4.7.0` - Code editor integration
- `reactflow@11.11.4` - Visual graph/flowchart library
- `react-router-dom@7.9.5` - Client-side routing

**Utilities**:
- `clsx@2.1.1` + `tailwind-merge@3.4.0` - Class name management

### Backend Dependencies

**Server Framework**:
- `express@4.18.2` - HTTP server
- `cors@2.8.5` - Cross-origin resource sharing
- `body-parser@1.20.2` - Request body parsing

**Utilities**:
- `uuid@9.0.1` - Unique ID generation
- `pg@8.11.3` - PostgreSQL client (planned integration)

**Development**:
- `tsx@4.7.0` - TypeScript execution for Node.js
- Type definitions for all runtime dependencies

### Development Tools

**Testing**:
- `vitest@4.0.7` - Test runner
- `@vitest/ui@4.0.7` - Test UI
- `jsdom@27.1.0` - DOM simulation for tests
- `@testing-library/react@16.3.0` + `@testing-library/jest-dom@6.9.1` - React testing utilities

**Build Tools**:
- `@vitejs/plugin-react@4.3.3` - React support for Vite
- `autoprefixer@10.4.20` + `postcss@8.4.49` - CSS processing

### External Services

**Execution Environment**:
- Python 3.x runtime required for code execution challenges
- Subprocess-based execution (no containers in current implementation)

**Future Integrations**:
- Rails backend API mentioned in documentation (not present in current codebase)
- PostgreSQL database support via Drizzle ORM (planned, not implemented)
- CDN for static asset delivery (mentioned in system design problems)

### Deployment Considerations

**Development**:
- Frontend dev server: Port 5000 (Vite HMR enabled)
- Backend API server: Port 3001
- API proxy configured in Vite for `/api` routes

**Production Build**:
- Static asset generation via `vite build`
- TypeScript compilation to JavaScript
- No SSR/SSG - pure client-side rendering
- Client-side routing requires server configuration for SPA fallback