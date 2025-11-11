# System Design Builder - UI Specification

## 🎯 Overview

This document specifies the complete UI/UX design for the **System Design Builder** — a browser-based tool that allows users to visually design, configure, and simulate distributed systems. The tool enables users to express system semantics (data models, database types, caching strategies, consistency rules, replication) in an intuitive, visual, and machine-interpretable way.

### Core Principles

Each **component node** on the canvas has:

1. A **visual identity** (icon, label)
2. A **typed schema** (fields that describe its behavior)
3. Optional **profiles** (presets that fill defaults, like "MySQL", "Redis", "S3")
4. **Relations** to other nodes (edges → data flow)

The system graph = JSON representation of all nodes, edges, and their configurations.

---

## 📋 Component Taxonomy

| Category                    | Examples                                      | What User Configures                                                                                                                        |
| --------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Compute / Service**       | App Server, API Gateway, Worker               | Language/runtime (Go/Node), concurrency limit, request capacity, region                                                                     |
| **Storage (OLTP)**          | MySQL, Postgres, MongoDB, DynamoDB, Cassandra | Model (relational / document / key-value), schema or table summary, replication factor, sharding key, consistency mode, read/write capacity |
| **Cache**                   | Redis, Memcached, CDN Edge                    | Caching mode (write-through, write-around, read-through), eviction policy (LRU/LFU), TTL, hit ratio, persistence yes/no                     |
| **Storage (OLAP / Object)** | S3, BigQuery, Data Warehouse                  | Access pattern, eventual consistency delay                                                                                                  |
| **Queue / Stream**          | Kafka, RabbitMQ, Pub/Sub                      | Retention, partitions, replication, ack mode (at-least-once, exactly-once)                                                                  |
| **Load Balancer / CDN**     | NGINX, CloudFront                             | Routing algo (round-robin, least-conn), region coverage                                                                                     |
| **Analytics / Logging**     | Elasticsearch, ClickHouse                     | Indexing strategy, write throughput                                                                                                         |
| **External Dependency**     | Payment gateway, Auth provider                | Latency range, failure probability                                                                                                          |

---

## 🖥️ UI Screens Overview

| Screen # | Name                              | Purpose                                    |
|----------|-----------------------------------|--------------------------------------------|
| 1        | Main Canvas View                  | Primary workspace for designing            |
| 2        | Component Palette                 | Drag-and-drop component library            |
| 3        | Inspector (Database)              | Configure database semantics               |
| 4        | Inspector (Cache)                 | Configure cache behavior                   |
| 5        | Connection Inspector              | Define edge/flow properties                |
| 6        | Traffic Configuration Modal       | Set workload parameters                    |
| 7        | Simulation Results                | View metrics & recommendations             |
| 8        | Welcome/Templates                 | Starting point with examples               |
| 9        | Schema Editor (Adaptive)          | Define data models (SQL/NoSQL/Graph)       |

---

## 🎨 Screen 1: Main Canvas View (Primary Workspace)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [🏗️ System Design Builder]  [📁 Save] [📤 Export] [▶️ Simulate]   │ ← Top Bar
├──────────┬──────────────────────────────────────────────┬───────────┤
│          │                                              │           │
│  PALETTE │           CANVAS AREA                        │ INSPECTOR │
│          │                                              │           │
│  [📦]    │    ┌──────┐                                 │  Selected:│
│  Compute │    │ API  │──────→ ┌─────────┐             │  None     │
│          │    │ GW   │        │ App     │             │           │
│  [💾]    │    └──────┘        │ Server  │             │  (Click   │
│  Storage │                    └────┬────┘             │   a node  │
│          │                         │                   │   to      │
│  [⚡]    │                         ↓                   │   config) │
│  Cache   │                    ┌─────────┐             │           │
│          │                    │ Redis   │             │           │
│  [📨]    │                    └────┬────┘             │           │
│  Queue   │                         │                   │           │
│          │                         ↓                   │           │
│  [🌐]    │                    ┌─────────┐             │           │
│  Network │                    │ OrdersDB│             │           │
│          │                    │(Postgres)             │           │
│  [📊]    │                    └─────────┘             │           │
│  Monitor │                                              │           │
│          │                                              │           │
└──────────┴──────────────────────────────────────────────┴───────────┘
         ↑ Left Sidebar (200px)              ↑ Right Sidebar (320px)

         Canvas uses panning/zooming (like Figma/draw.io)
```

### Features:
- **Left Palette** (collapsible): Categorized components with icons
- **Center Canvas**: Infinite drag-and-drop workspace with grid snap
- **Right Inspector**: Context-sensitive configuration panel
- **Top Toolbar**: Primary actions (save, simulate, export PDF/JSON)

### Canvas Interactions:
- **Drag component** from palette → creates node
- **Click node** → opens Inspector
- **Drag from node to node** → creates edge
- **Click edge** → opens Connection Inspector
- **Space + Drag** → pan canvas
- **Mouse wheel** → zoom in/out
- **Delete key** → remove selected element

---

## 🧩 Screen 2: Component Palette (Left Sidebar)

```
┌─────────────────┐
│ COMPONENTS  [×] │ ← Collapse button
├─────────────────┤
│ 🔍 Search...    │ ← Filter components
├─────────────────┤
│ ▼ 📦 COMPUTE    │ ← Expandable category
│   • API Gateway │
│   • App Server  │
│   • Worker      │
│   • Lambda      │
├─────────────────┤
│ ▼ 💾 STORAGE    │
│   • MySQL       │
│   • PostgreSQL  │
│   • MongoDB     │
│   • DynamoDB    │
│   • Cassandra   │
│   • S3          │
├─────────────────┤
│ ▼ ⚡ CACHE      │
│   • Redis       │
│   • Memcached   │
│   • CDN Edge    │
├─────────────────┤
│ ▼ 📨 QUEUE      │
│   • Kafka       │
│   • RabbitMQ    │
│   • SQS         │
│   • Pub/Sub     │
├─────────────────┤
│ ▼ 🌐 NETWORK    │
│   • Load Bal.   │
│   • CDN         │
│   • DNS         │
├─────────────────┤
│ ▼ 📊 ANALYTICS  │
│   • Elasticsearch│
│   • ClickHouse  │
│   • BigQuery    │
└─────────────────┘
```

### Interactions:
- **Drag component** onto canvas → creates node
- **Click component** → shows description tooltip
- **Search** filters in real-time
- **Collapse/expand** categories with ▼/▶ icons
- **Collapse sidebar** with [×] button to maximize canvas space

---

## ⚙️ Screen 3: Inspector Panel - Database Selected

```
┌─────────────────────────────────────┐
│ ⚙️ CONFIGURATION                    │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Component: OrdersDB         │   │
│ │ Type: Database              │   │
│ └─────────────────────────────┘   │
│                                     │
│ ▼ Basic Properties                 │
│ ┌─────────────────────────────┐   │
│ │ Name: [OrdersDB_________]   │   │
│ └─────────────────────────────┘   │
│                                     │
│ Database Type:                     │
│ ┌─────────────────────────────┐   │
│ │ [PostgreSQL ▼]              │   │
│ └─────────────────────────────┘   │
│                                     │
│ Data Model:                        │
│ ◉ Relational                       │
│ ○ Key-Value                        │
│ ○ Document                         │
│ ○ Graph                            │
│                                     │
│ ▼ Capacity & Performance           │
│ Read Capacity (ops/sec):           │
│ ┌─────────────────────────────┐   │
│ │ [10000__________________]   │   │
│ │ ▬▬▬▬▬▬▬▬▬▬▬▬░░░░░░░░ 10k   │   │
│ └─────────────────────────────┘   │
│                                     │
│ Write Capacity (ops/sec):          │
│ ┌─────────────────────────────┐   │
│ │ [1000___________________]   │   │
│ │ ▬▬▬▬▬░░░░░░░░░░░░░░░ 1k    │   │
│ └─────────────────────────────┘   │
│                                     │
│ ▼ Replication & Consistency        │
│ Replication Factor:                │
│ ┌─────────────────────────────┐   │
│ │ [3▼]                        │   │
│ └─────────────────────────────┘   │
│                                     │
│ Consistency Mode:                  │
│ ┌─────────────────────────────┐   │
│ │ [Strong ▼]                  │   │
│ │   • Strong (ACID)           │   │
│ │   • Eventual                │   │
│ │   • Quorum                  │   │
│ └─────────────────────────────┘   │
│                                     │
│ ▼ Sharding & Partitioning [+]      │
│ Sharding Key:                      │
│ ┌─────────────────────────────┐   │
│ │ [event_id_______________]   │   │
│ └─────────────────────────────┘   │
│                                     │
│ ▼ Schema (Optional) [+]            │
│                                     │
│ ▼ Cost Estimation [+]              │
│                                     │
│ [Delete Node] [Duplicate]          │
└─────────────────────────────────────┘
```

### Key Features:
- Collapsible sections with [+]/[▼] icons
- Visual sliders for capacity settings
- Dropdowns for predefined options
- Conditional fields (e.g., sharding only if partitioning enabled)
- Real-time validation (red border if invalid)
- Auto-save on change

---

## ⚡ Screen 4: Inspector Panel - Cache (Redis) Selected

```
┌─────────────────────────────────────┐
│ ⚙️ CONFIGURATION                    │
│                                     │
│ Component: MainCache                │
│ Type: Redis                         │
│                                     │
│ ▼ Cache Strategy                    │
│ Cache Mode:                        │
│ ◉ Write-Through                    │
│ ○ Write-Around                     │
│ ○ Write-Back                       │
│ ○ Read-Through                     │
│                                     │
│ Eviction Policy:                   │
│ ┌─────────────────────────────┐   │
│ │ [LRU ▼]                     │   │
│ │   • LRU (Least Recent)      │   │
│ │   • LFU (Least Frequent)    │   │
│ │   • FIFO                    │   │
│ │   • Random                  │   │
│ └─────────────────────────────┘   │
│                                     │
│ ▼ Performance Tuning                │
│ TTL (seconds):                     │
│ ┌─────────────────────────────┐   │
│ │ [30_____________________]   │   │
│ └─────────────────────────────┘   │
│                                     │
│ Expected Hit Ratio (%):            │
│ ┌─────────────────────────────┐   │
│ │ [90_____________________]   │   │
│ │ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬░░ 90%   │   │
│ └─────────────────────────────┘   │
│                                     │
│ ▼ Durability                       │
│ ☑ Enable Persistence (AOF)         │
│ ☑ Enable Replication               │
│   Replicas: [2▼]                   │
│                                     │
│ ▼ Capacity                         │
│ Max Memory (GB):                   │
│ ┌─────────────────────────────┐   │
│ │ [16_____________________]   │   │
│ └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Note:
Different component types = different inspector fields. Each component category has tailored configuration options relevant to its purpose.

---

## 🔗 Screen 5: Connection Inspector (Edge Properties)

When user clicks on an **edge** (arrow between components):

```
┌─────────────────────────────────────┐
│ 🔗 CONNECTION PROPERTIES            │
│                                     │
│ From: App Server                   │
│ To:   Redis Cache                  │
│                                     │
│ ▼ Protocol & Serialization          │
│ Protocol:                          │
│ ┌─────────────────────────────┐   │
│ │ [HTTP ▼]                    │   │
│ │   • HTTP/REST               │   │
│ │   • gRPC                    │   │
│ │   • SQL                     │   │
│ │   • Redis Protocol          │   │
│ └─────────────────────────────┘   │
│                                     │
│ Serialization:                     │
│ ┌─────────────────────────────┐   │
│ │ [JSON ▼]                    │   │
│ └─────────────────────────────┘   │
│                                     │
│ ▼ Traffic Pattern                   │
│ Operation Type:                    │
│ ◉ Read (Cache Lookup)              │
│ ○ Write                            │
│ ○ Publish                          │
│ ○ Subscribe                        │
│                                     │
│ Calls per Request:                 │
│ ┌─────────────────────────────┐   │
│ │ [1______________________]   │   │
│ └─────────────────────────────┘   │
│                                     │
│ ▼ Advanced (Optional) [+]           │
│ Network Latency Override (ms)      │
│ Failure Probability (0-1)          │
│ Timeout (ms)                       │
│                                     │
│ [Delete Connection]                │
└─────────────────────────────────────┘
```

### Purpose:
Edges define **typed operations** and **data flow** between components, not just visual arrows. This metadata feeds the simulation engine for traffic propagation and latency calculations.

---

## 🚦 Screen 6: Traffic Configuration Modal

Triggered by: **Top Bar → ▶️ Simulate** button

```
┌──────────────────────────────────────────────────┐
│  🚦 Configure Traffic & Workload                │
│                                                  │
│  Define the traffic patterns for simulation:    │
│                                                  │
│  ▼ Workload Types                               │
│  ┌──────────────────────────────────────────┐  │
│  │ ☑ Browse (Read-heavy)                    │  │
│  │   Rate: [10000] RPS                      │  │
│  │   DB Reads/Request: [2__]                │  │
│  │   DB Writes/Request: [0__]               │  │
│  │                                          │  │
│  │ ☑ Purchase (Write-heavy)                 │  │
│  │   Rate: [500] RPS                        │  │
│  │   DB Reads/Request: [3__]                │  │
│  │   DB Writes/Request: [4__]               │  │
│  │                                          │  │
│  │ ☐ Analytics (Batch)                      │  │
│  │   [+ Add Workload Type]                  │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ▼ Traffic Pattern                              │
│  ◉ Constant Load                                │
│  ○ Spike (define peak)                          │
│  ○ Gradual Ramp                                 │
│  ○ Custom Pattern (upload CSV)                  │
│                                                  │
│  ▼ Simulation Duration                          │
│  Duration: [60_____] seconds                    │
│                                                  │
│  ▼ SLO Targets (Optional)                       │
│  Target p99 Latency: [200] ms                   │
│  Target Error Rate: [0.1] %                     │
│                                                  │
│         [Cancel]  [Run Simulation ▶️]           │
└──────────────────────────────────────────────────┘
```

### Features:
- Multiple workload types (read-heavy, write-heavy, mixed)
- Traffic patterns (constant, spike, ramp, custom)
- SLO target definitions for pass/fail criteria
- Custom workload addition

---

## 📊 Screen 7: Simulation Results View

After simulation runs, bottom panel slides up (or modal):

```
┌───────────────────────────────────────────────────────────────┐
│  ✅ Simulation Complete                    [Export] [×]       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 Performance Metrics                                       │
│  ┌─────────────────┬─────────────────┬─────────────────┐    │
│  │ Metric          │ Actual          │ Target          │    │
│  ├─────────────────┼─────────────────┼─────────────────┤    │
│  │ p50 Latency     │ 45 ms          │ -               │    │
│  │ p99 Latency     │ 285 ms  ⚠️     │ 200 ms          │    │
│  │ Throughput      │ 9,500 RPS  ⚠️  │ 10,500 RPS      │    │
│  │ Error Rate      │ 2.3%  ❌        │ 0.1%            │    │
│  │ Availability    │ 97.7%  ⚠️      │ 99.9%           │    │
│  └─────────────────┴─────────────────┴─────────────────┘    │
│                                                               │
│  🔍 Bottlenecks Detected:                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. ⚠️ OrdersDB (Postgres)                          │    │
│  │    • Utilization: 95% (exceeds safe threshold)     │    │
│  │    • Write queue depth: 1,200 ops                  │    │
│  │    • Recommendation: Add read replica OR           │    │
│  │      increase write capacity to 2,000 ops/sec      │    │
│  │                                                     │    │
│  │ 2. ⚠️ Redis Cache                                  │    │
│  │    • Hit ratio: 75% (below target 90%)             │    │
│  │    • Recommendation: Increase TTL to 60s OR        │    │
│  │      pre-warm cache with hot data                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  💰 Estimated Monthly Cost: $1,240                           │
│  ├─ OrdersDB (Postgres): $840                               │
│  ├─ Redis Cluster: $280                                     │
│  └─ App Servers (3x): $120                                  │
│                                                               │
│  [Apply Recommendations]  [Adjust Design]  [Export Report]  │
└───────────────────────────────────────────────────────────────┘
```

### Key Features:
- **Color-coded metrics** (✅ green, ⚠️ yellow, ❌ red)
- **Actionable recommendations** with specific parameter suggestions
- **One-click "Apply Recommendations"** → auto-adjusts config
- **Export as PDF/JSON report** for documentation
- **Cost estimation** based on cloud provider pricing

---

## 🎬 Screen 8: Welcome / Templates Screen

First screen user sees:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│           🏗️ System Design Builder                     │
│                                                         │
│         Design, Simulate, and Learn System Architecture │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ 🆕 Start from Scratch                           │  │
│  │    Build a custom system design from ground up  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  📚 Or Choose a Template:                              │
│                                                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ 🎫         │ │ 🛒         │ │ 📹         │        │
│  │ Ticket     │ │ E-Commerce │ │ Video      │        │
│  │ Master     │ │ Platform   │ │ Streaming  │        │
│  │            │ │            │ │            │        │
│  │ [Load]     │ │ [Load]     │ │ [Load]     │        │
│  └────────────┘ └────────────┘ └────────────┘        │
│                                                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ 💬         │ │ 📊         │ │ 🔍         │        │
│  │ Chat/      │ │ Analytics  │ │ Search     │        │
│  │ Messaging  │ │ Dashboard  │ │ Engine     │        │
│  │            │ │            │ │            │        │
│  │ [Load]     │ │ [Load]     │ │ [Load]     │        │
│  └────────────┘ └────────────┘ └────────────┘        │
│                                                         │
│                     [📁 Import Existing Design]        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Template Examples:
Each template comes pre-configured with:
- Common components for that use case
- Typical traffic patterns
- Realistic capacity settings
- Sample data models

---

## 📝 Screen 9: Schema/Data Model Editor (Adaptive)

The Schema Editor **automatically adapts** based on the database type selected in the main Inspector.

### 9A: Initial State (Empty)

When user first clicks **"▼ Schema (Optional) [+]"**:

```
┌─────────────────────────────────────────────────────┐
│ 📝 Data Model Editor                                │
│                                                     │
│ Database: OrdersDB (PostgreSQL)                     │
│ Model Type: Relational                              │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │                                                 ││
│ │        No schema defined yet                    ││
│ │                                                 ││
│ │        Define your data model to improve        ││
│ │        simulation accuracy                      ││
│ │                                                 ││
│ │   ┌────────────┐  ┌────────────┐  ┌──────────┐││
│ │   │ + Add      │  │ 📤 Import  │  │ 🎯 Use   │││
│ │   │   Table    │  │    JSON    │  │ Template │││
│ │   └────────────┘  └────────────┘  └──────────┘││
│ │                                                 ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ Quick Templates:                                    │
│ • E-commerce (Users, Products, Orders)              │
│ • Social Media (Users, Posts, Comments, Likes)      │
│ • Booking System (Events, Seats, Reservations)     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 9B: Schema Editor - SQL/Relational (PostgreSQL, MySQL)

When user adds tables to a **relational database**:

```
┌─────────────────────────────────────────────────────┐
│ 📝 Data Model Editor                          [×]   │
│                                                     │
│ Database: OrdersDB (PostgreSQL) - Relational        │
│                                                     │
│ ▼ Tables (3)                          [+ Add Table] │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ 📊 events                           [⚙️] [🗑️] [^]││
│ │                                                 ││
│ │ Table Name: [events___________________]        ││
│ │                                                 ││
│ │ Columns:                        [+ Add Column] ││
│ │ ┌───────────────────────────────────────────┐ ││
│ │ │ Name        Type      Constraints     [×] │ ││
│ │ ├───────────────────────────────────────────┤ ││
│ │ │ id          INT       PK, Auto-incr    🗑️ │ ││
│ │ │ name        VARCHAR   NOT NULL         🗑️ │ ││
│ │ │ date        TIMESTAMP NOT NULL         🗑️ │ ││
│ │ │ venue_id    INT       FK → venues.id   🗑️ │ ││
│ │ └───────────────────────────────────────────┘ ││
│ │                                                 ││
│ │ Indexes:                         [+ Add Index] ││
│ │ • PRIMARY (id)                                  ││
│ │ • INDEX idx_date (date)                         ││
│ │ • INDEX idx_venue (venue_id)                    ││
│ │                                                 ││
│ │ Access Pattern:                                 ││
│ │ ┌─────────────────────────────────────┐       ││
│ │ │ [Read-Heavy ▼]                      │       ││
│ │ │   • Read-Heavy (10:1 read/write)    │       ││
│ │ │   • Write-Heavy (1:10 read/write)   │       ││
│ │ │   • Balanced (1:1)                  │       ││
│ │ │   • High-Contention (locks/races)   │       ││
│ │ └─────────────────────────────────────┘       ││
│ │                                                 ││
│ │ Estimated Row Count: [1,000,000_____]          ││
│ │ Avg Row Size (bytes): [256_________]           ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ 📊 seats                            [⚙️] [🗑️] [v]││
│ │ (collapsed - click to expand)                   ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ 📊 orders                           [⚙️] [🗑️] [v]││
│ │ (collapsed)                                     ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ▼ Relationships                                     │
│ Auto-detected from foreign keys:                   │
│ • events.venue_id → venues.id (N:1)                │
│ • seats.event_id → events.id (N:1)                 │
│ • orders.seat_id → seats.id (N:1)                  │
│                                                     │
│ [Visualize ER Diagram]  [Export DDL]  [Save]       │
└─────────────────────────────────────────────────────┘
```

#### Add Column Modal (Inline)

When user clicks **"+ Add Column"**:

```
┌──────────────────────────────────────┐
│ Add Column                           │
├──────────────────────────────────────┤
│ Column Name:                         │
│ ┌────────────────────────────────┐  │
│ │ [status________________]       │  │
│ └────────────────────────────────┘  │
│                                      │
│ Data Type:                           │
│ ┌────────────────────────────────┐  │
│ │ [ENUM ▼]                       │  │
│ │   INT, VARCHAR, TEXT,          │  │
│ │   TIMESTAMP, BOOLEAN, JSON,    │  │
│ │   ENUM, DECIMAL, ...           │  │
│ └────────────────────────────────┘  │
│                                      │
│ ENUM Values (comma-separated):      │
│ ┌────────────────────────────────┐  │
│ │ available,locked,sold          │  │
│ └────────────────────────────────┘  │
│                                      │
│ Constraints:                         │
│ ☑ NOT NULL                           │
│ ☐ UNIQUE                             │
│ ☐ PRIMARY KEY                        │
│ ☐ FOREIGN KEY → [Select Table▼]     │
│ ☐ DEFAULT: [___________]             │
│                                      │
│ Index this column?                   │
│ ☐ Add to index                       │
│                                      │
│      [Cancel]  [Add Column]          │
└──────────────────────────────────────┘
```

**Features:**
- Full SQL data type support (INT, VARCHAR, TEXT, TIMESTAMP, JSON, ENUM, etc.)
- Foreign key relationships with dropdown to select target table
- Index configuration
- Constraint management (NOT NULL, UNIQUE, PK, FK, DEFAULT)

---

### 9C: Schema Editor - NoSQL Document (MongoDB)

When user selects **MongoDB** or **Data Model: Document**:

```
┌─────────────────────────────────────────────────────┐
│ 📝 Data Model Editor                          [×]   │
│                                                     │
│ Database: OrdersDB (MongoDB) - Document Store       │
│                                                     │
│ ▼ Collections (3)                [+ Add Collection] │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ 📄 events                       [⚙️] [🗑️] [^]  ││
│ │                                                 ││
│ │ Collection Name: [events______________]        ││
│ │                                                 ││
│ │ Document Schema (JSON):       [Paste Sample]  ││
│ │ ┌───────────────────────────────────────────┐ ││
│ │ │ {                                         │ ││
│ │ │   "_id": "ObjectId",                      │ ││
│ │ │   "name": "string",                       │ ││
│ │ │   "date": "ISODate",                      │ ││
│ │ │   "venue": {                              │ ││
│ │ │     "id": "ObjectId",                     │ ││
│ │ │     "name": "string",                     │ ││
│ │ │     "capacity": "number"                  │ ││
│ │ │   },                                      │ ││
│ │ │   "seats": [                              │ ││
│ │ │     {                                     │ ││
│ │ │       "id": "string",                     │ ││
│ │ │       "status": "enum[avail,sold]",       │ ││
│ │ │       "price": "number"                   │ ││
│ │ │     }                                     │ ││
│ │ │   ],                                      │ ││
│ │ │   "tags": ["string"]                      │ ││
│ │ │ }                                         │ ││
│ │ └───────────────────────────────────────────┘ ││
│ │                         [Validate Schema]     ││
│ │                                                 ││
│ │ Indexes:                         [+ Add Index] ││
│ │ • _id (default)                                 ││
│ │ • date (ascending)                              ││
│ │ • venue.id (ascending)                          ││
│ │ • tags (multikey)                               ││
│ │                                                 ││
│ │ Access Pattern:                                 ││
│ │ ◉ Read-Heavy   ○ Write-Heavy   ○ Balanced      ││
│ │                                                 ││
│ │ Document Embedding Strategy:                    ││
│ │ ☑ Embed related data (denormalized)            ││
│ │   → Reduces joins, increases read speed        ││
│ │                                                 ││
│ │ Estimated Documents: [500,000_____]            ││
│ │ Avg Document Size: [2 KB______]                ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ 📄 orders                       [⚙️] [🗑️] [v]  ││
│ │ (collapsed)                                     ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ▼ Relationships (References)                        │
│ • orders.event_id → events._id                     │
│ • orders.user_id → users._id                       │
│                                                     │
│ [Export Schema] [Generate Sample Data] [Save]      │
└─────────────────────────────────────────────────────┘
```

**Key Differences for Document Stores:**
- JSON-based schema editor instead of column table
- "Collections" instead of "Tables"
- Embedded documents support
- Multikey indexes for arrays
- Denormalization hints
- "Paste Sample" button to auto-detect schema from example document

---

### 9D: Schema Editor - NoSQL Key-Value (DynamoDB/Redis)

When user selects **DynamoDB** or **Data Model: Key-Value**:

```
┌─────────────────────────────────────────────────────┐
│ 📝 Data Model Editor                          [×]   │
│                                                     │
│ Database: SessionStore (DynamoDB) - Key-Value       │
│                                                     │
│ ▼ Tables (1)                          [+ Add Table] │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ 🔑 sessions                     [⚙️] [🗑️] [^]  ││
│ │                                                 ││
│ │ Table Name: [sessions_____________]            ││
│ │                                                 ││
│ │ Partition Key (required):                       ││
│ │ ┌─────────────────────────────────────┐       ││
│ │ │ Name: [session_id_______] Type: [S▼]│       ││
│ │ │                                      │       ││
│ │ │ Types: S (String), N (Number),      │       ││
│ │ │        B (Binary)                    │       ││
│ │ └─────────────────────────────────────┘       ││
│ │                                                 ││
│ │ Sort Key (optional):                            ││
│ │ ☑ Enable Sort Key                               ││
│ │ ┌─────────────────────────────────────┐       ││
│ │ │ Name: [timestamp________] Type: [N▼]│       ││
│ │ └─────────────────────────────────────┘       ││
│ │                                                 ││
│ │ Attributes (non-key fields):                    ││
│ │ ┌───────────────────────────────────┐         ││
│ │ │ user_id       (S)                 │         ││
│ │ │ data          (M - Map)           │         ││
│ │ │ expires_at    (N)                 │         ││
│ │ │ ip_address    (S)                 │         ││
│ │ └───────────────────────────────────┘         ││
│ │                        [+ Add Attribute]      ││
│ │                                                 ││
│ │ Global Secondary Indexes (GSI):                 ││
│ │ [+ Add GSI]                                     ││
│ │ • GSI_user_id (PK: user_id, SK: timestamp)     ││
│ │                                                 ││
│ │ Time to Live (TTL):                             ││
│ │ ☑ Enable TTL on attribute: [expires_at ▼]     ││
│ │                                                 ││
│ │ Capacity Mode:                                  ││
│ │ ◉ On-Demand                                     ││
│ │ ○ Provisioned                                   ││
│ │   → RCU: [____]  WCU: [____]                   ││
│ │                                                 ││
│ │ Access Pattern:                                 ││
│ │ [High Read/Write ▼]                            ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ 💡 Tip: DynamoDB is optimized for single-item     │
│    lookups by partition key. Use GSIs for          │
│    alternate access patterns.                      │
│                                                     │
│ [Export Schema] [Generate Sample Data] [Save]      │
└─────────────────────────────────────────────────────┘
```

**Key Differences for Key-Value Stores:**
- Partition Key + Sort Key paradigm (DynamoDB)
- GSI configuration for alternate query patterns
- TTL settings for automatic expiration
- Capacity modes (on-demand vs provisioned)
- No complex joins or relationships
- Attribute types (S, N, B, M, L, etc.)

---

### 9E: Schema Editor - Graph Database (Neo4j)

When user selects **Data Model: Graph**:

```
┌─────────────────────────────────────────────────────┐
│ 📝 Data Model Editor                          [×]   │
│                                                     │
│ Database: SocialGraph (Neo4j) - Graph               │
│                                                     │
│ ▼ Node Types (3)                    [+ Add Node]   │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ 🔵 User                         [⚙️] [🗑️] [^]  ││
│ │                                                 ││
│ │ Label: [User_________]                         ││
│ │                                                 ││
│ │ Properties:                   [+ Add Property] ││
│ │ ┌───────────────────────────────────────────┐ ││
│ │ │ id          (string, indexed)             │ ││
│ │ │ name        (string)                      │ ││
│ │ │ email       (string, unique)              │ ││
│ │ │ created_at  (datetime)                    │ ││
│ │ └───────────────────────────────────────────┘ ││
│ │                                                 ││
│ │ Estimated Nodes: [1,000,000____]               ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ 🔵 Post                         [⚙️] [🗑️] [v]  ││
│ │ (collapsed)                                     ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ▼ Relationship Types (2)      [+ Add Relationship] │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ ➡️ FOLLOWS                     [⚙️] [🗑️] [^]  ││
│ │                                                 ││
│ │ Type: [FOLLOWS________]                        ││
│ │                                                 ││
│ │ From: [User ▼]  →  To: [User ▼]               ││
│ │                                                 ││
│ │ Properties:                   [+ Add Property] ││
│ │ ┌───────────────────────────────────────────┐ ││
│ │ │ since       (datetime)                    │ ││
│ │ │ notif       (boolean)                     │ ││
│ │ └───────────────────────────────────────────┘ ││
│ │                                                 ││
│ │ Directionality: ◉ Directed  ○ Undirected      ││
│ │                                                 ││
│ │ Estimated Relationships: [5,000,000____]       ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ ➡️ CREATED                     [⚙️] [🗑️] [v]  ││
│ │ (collapsed)                                     ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ Common Queries (for simulation):                   │
│ • Find followers of user (depth: 1)                │
│ • Find friends-of-friends (depth: 2)               │
│ • Shortest path between users                      │
│                                                     │
│ [Visualize Graph] [Export Cypher] [Save]           │
└─────────────────────────────────────────────────────┘
```

**Key Differences for Graph Databases:**
- Node types (labels) instead of tables
- Relationship types with directionality
- Properties on both nodes and relationships
- Common query patterns for simulation
- Graph visualization option
- Export to Cypher (Neo4j query language)

---

## 🔄 How Schema Editor Adapts to Database Type

The editor **automatically changes** based on what's selected in the **main Inspector (Screen 3)**:

| Database Type Selected | Schema Editor Shows |
|------------------------|---------------------|
| **PostgreSQL, MySQL** | Tables, Columns, SQL types, Foreign Keys, Indexes |
| **MongoDB** | Collections, JSON schema, Embedded docs, Multikey indexes |
| **DynamoDB** | Partition Key, Sort Key, GSIs, TTL, Capacity modes |
| **Redis** (if used as DB) | Key patterns, Value types (String/Hash/Set/ZSet), TTL |
| **Cassandra** | Keyspaces, Partition keys, Clustering columns, Replication strategy |
| **Neo4j** | Node labels, Relationship types, Properties, Directionality |

---

## 🔄 Complete User Flow: Database Selection → Schema Definition

### Step 1: User selects database type in Inspector

```
Inspector Panel:
┌─────────────────────────────┐
│ Database Type:              │
│ [PostgreSQL ▼]              │ ← User changes this
│   • PostgreSQL              │
│   • MySQL                   │
│   • MongoDB                 │
│   • DynamoDB                │
│   • Cassandra               │
│   • Neo4j                   │
│   • Redis                   │
└─────────────────────────────┘
```

### Step 2: Data Model auto-fills (or user overrides)

```
Data Model:
◉ Relational    ← Auto-selected for PostgreSQL
○ Document      ← Auto-selected for MongoDB
○ Key-Value     ← Auto-selected for DynamoDB/Redis
○ Graph         ← Auto-selected for Neo4j
```

### Step 3: User clicks "▼ Schema (Optional) [+]"

→ Schema editor opens with **appropriate UI** based on model type

### Step 4: User builds schema

- **SQL**: Add tables → Add columns → Define foreign keys
- **NoSQL Document**: Paste/write JSON schema → Define indexes
- **NoSQL Key-Value**: Define partition/sort keys → Add GSIs
- **Graph**: Define node types → Define relationship types

### Step 5: Schema auto-validates

- ✅ "Valid schema" indicator if all required fields filled
- ⚠️ Warnings for missing indexes on foreign keys
- ❌ Errors for duplicate names or invalid types

---

## 📤 Import Options

Users can also **import existing schemas**:

```
[📤 Import JSON] dropdown:
  • Upload schema.json file
  • Paste JSON schema
  • Import from DDL (SQL CREATE statements)
  • Import from ORM models (Prisma, Sequelize, Mongoose)
  • Connect to existing DB and introspect
```

---

## 💾 Data Representation (JSON)

When user clicks **[Save]**, the complete design is stored as JSON:

```json
{
  "nodes": [
    {
      "id": "db_orders",
      "type": "database",
      "label": "OrdersDB",
      "db_type": "Postgres",
      "model": "relational",
      "config": {
        "read_capacity": 10000,
        "write_capacity": 1000,
        "replication_factor": 3,
        "consistency": "strong",
        "sharding_key": "event_id"
      },
      "schema": {
        "tables": [
          {
            "name": "events",
            "columns": [
              {
                "name": "id",
                "type": "INT",
                "constraints": ["PK", "AUTO_INCREMENT"]
              },
              {
                "name": "name",
                "type": "VARCHAR(255)",
                "constraints": ["NOT NULL"]
              },
              {
                "name": "date",
                "type": "TIMESTAMP",
                "constraints": ["NOT NULL"]
              },
              {
                "name": "venue_id",
                "type": "INT",
                "constraints": ["FK:venues.id"]
              }
            ],
            "indexes": [
              "PRIMARY (id)",
              "INDEX idx_date (date)",
              "INDEX idx_venue (venue_id)"
            ],
            "access_pattern": "read_heavy",
            "estimated_rows": 1000000,
            "avg_row_size": 256
          }
        ],
        "relationships": [
          {
            "from": "orders.user_id",
            "to": "users.id",
            "type": "N:1"
          }
        ]
      }
    },
    {
      "id": "cache_main",
      "type": "redis",
      "label": "MainCache",
      "config": {
        "ttl": 30,
        "hit_ratio": 0.9,
        "mode": "write-through",
        "eviction_policy": "LRU",
        "persistence": true,
        "replication": {
          "enabled": true,
          "replicas": 2
        },
        "max_memory_gb": 16
      }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "from": "app_service",
      "to": "cache_main",
      "protocol": "redis",
      "serialization": "binary",
      "operation": "read",
      "calls_per_request": 1,
      "network_latency_ms": 2,
      "failure_probability": 0.001
    },
    {
      "id": "edge_2",
      "from": "cache_main",
      "to": "db_orders",
      "protocol": "sql",
      "serialization": "native",
      "operation": "read_fallback",
      "calls_per_request": 0.1
    }
  ],
  "traffic": {
    "workloads": [
      {
        "name": "Browse",
        "type": "read_heavy",
        "rate_rps": 10000,
        "db_reads_per_request": 2,
        "db_writes_per_request": 0
      },
      {
        "name": "Purchase",
        "type": "write_heavy",
        "rate_rps": 500,
        "db_reads_per_request": 3,
        "db_writes_per_request": 4
      }
    ],
    "pattern": "constant",
    "duration_seconds": 60,
    "slo": {
      "p99_latency_ms": 200,
      "error_rate_percent": 0.1
    }
  }
}
```

This rich metadata feeds directly into the **simulation engine** for accurate modeling!

---

## 🎨 Visual Design Principles

### Color Coding
- **Blue** for compute (servers, workers)
- **Green** for storage (databases, S3)
- **Red** for cache (Redis, Memcached)
- **Purple** for queues (Kafka, RabbitMQ)
- **Gray** for network (load balancers, CDN)
- **Orange** for analytics (Elasticsearch, ClickHouse)

### Icons
Use consistent icon set (Lucide, Heroicons, or similar)

### Tooltips
All controls have hover tooltips explaining their purpose

### Keyboard Shortcuts
- `Delete` = remove selected element
- `Ctrl+Z` / `Cmd+Z` = undo
- `Ctrl+Y` / `Cmd+Shift+Z` = redo
- `Ctrl+S` / `Cmd+S` = save
- `Space + Drag` = pan canvas
- `Ctrl+D` / `Cmd+D` = duplicate selected
- `Ctrl+C/V` / `Cmd+C/V` = copy/paste

### Responsive Design
- Minimum viewport: 1024x768
- Sidebars collapse on smaller screens
- Mobile view: vertical layout with tabs

---

## 🔬 Example User Scenario: TicketMaster Design

### Step 1: User loads "Booking System" template

Template creates:
- API Gateway
- App Service (3 replicas)
- Redis Cache
- PostgreSQL (OrdersDB)
- Pre-configured connections

### Step 2: User configures OrdersDB

- Selects PostgreSQL
- Opens Schema Editor
- Adds tables: `events`, `seats`, `orders`
- Defines foreign keys
- Sets sharding key: `event_id`
- Configures replication factor: 3

### Step 3: User configures Redis

- Sets TTL: 30s
- Cache mode: write-through
- Hit ratio: 90%

### Step 4: User configures traffic

- Browse: 10k RPS (read-heavy)
- Purchase: 500 RPS (write-heavy, 4 writes/request)
- SLO: p99 < 200ms, error rate < 0.1%

### Step 5: User runs simulation

Results show:
- ❌ DB utilization 95% (bottleneck)
- ⚠️ Cache hit ratio 75% (below target)
- ❌ p99 latency 285ms (exceeds SLO)

### Step 6: System suggests fixes

- Add read replica
- Increase write capacity to 2,000 ops/sec
- Increase cache TTL to 60s

### Step 7: User applies recommendations

- One-click "Apply Recommendations"
- System auto-adjusts configs

### Step 8: User re-runs simulation

Results show:
- ✅ DB utilization 68%
- ✅ Cache hit ratio 92%
- ✅ p99 latency 145ms (meets SLO)

### Step 9: User exports design

- Downloads JSON spec
- Exports PDF report
- Shares with team

---

## 🧠 Simulation Engine Integration

The UI feeds the following data to the simulation engine:

### From Nodes:
- Component type (DB, cache, queue, etc.)
- Capacity limits (RPS, throughput, storage)
- Latency characteristics
- Replication factor
- Consistency mode
- Schema metadata (for hot tables, contention modeling)

### From Edges:
- Protocol overhead
- Serialization cost
- Calls per request (fan-out factor)
- Network latency
- Failure probability

### From Traffic Config:
- Workload mix
- Request rates
- Read/write ratios
- Traffic patterns (constant, spike, ramp)

### Output:
- p50/p95/p99 latency distributions
- Throughput achieved vs target
- Error rates
- Component utilization
- Bottleneck identification
- Cost estimation
- Actionable recommendations

---

## 📦 Export Formats

### JSON Export
Complete system graph with all configurations

### PDF Report
- Visual diagram
- Configuration summary
- Simulation results
- Recommendations
- Cost breakdown

### Code Export (Future)
- Infrastructure as Code (Terraform)
- Docker Compose
- Kubernetes manifests
- Database DDL scripts

---

## 🚀 Implementation Priorities

### Phase 1: MVP (Core Canvas)
- Main canvas with drag-and-drop
- Component palette (basic types)
- Basic inspector (capacity, type)
- Save/load JSON

### Phase 2: Schema Editor
- SQL schema editor
- NoSQL adapters
- Schema validation
- Import/export

### Phase 3: Simulation
- Traffic configuration modal
- Basic simulation engine
- Results visualization
- Bottleneck detection

### Phase 4: Advanced Features
- Templates
- Recommendations engine
- Cost estimation
- Export to IaC

---

## 🎯 Success Metrics

### User Engagement
- Time to create first design: < 5 minutes
- Designs saved per user: > 3
- Simulation runs per design: > 2

### Learning Outcomes
- Users understand bottlenecks: 80%+
- Users can explain tradeoffs: 70%+
- Users apply recommendations: 60%+

### Technical Quality
- Valid designs: 95%+
- Simulation accuracy: ±15% of real-world
- UI responsiveness: < 100ms interaction latency

---

## 📚 Related Documents

- `IMPLEMENTATION_PLAN.md` - Technical implementation details
- `SIMULATION_ENGINE_SPEC.md` - Simulation algorithm documentation
- `COMPONENT_LIBRARY.md` - Complete component taxonomy
- `API_SPECIFICATION.md` - Backend API endpoints

---

## 🤝 Contributing

This is a living document. As we implement the UI, we'll refine these specifications based on:
- User feedback
- Technical constraints
- New feature ideas
- Simulation accuracy improvements

---

**Document Version:** 1.0
**Last Updated:** 2025-11-11
**Status:** Final - Ready for Implementation
