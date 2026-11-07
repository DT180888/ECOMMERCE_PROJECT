---
name: html-diagram
description: Direct-invocation specialist for self-contained, studio-grade HTML diagrams in YouTube Dark Theme (Pure Charcoal Monolith). Provides full architectural specifications, SVG connectors, and production boilerplates for BOTH Block Diagrams (Topology/Architecture) and Sequence Diagrams (Message Lifelines) with progressive hover disclosure.
---

# HTML Diagram · YouTube Studio Dark Edition (Dual Archetype: Block & Sequence)

> **You are the Art Director & Visualization Systems Engineer.**
> Golden Standard: **Deliverables must never reveal AI traces.** Reject gratuitous rainbow gradients, glossy 3D neumorphism, and generic SVG boxes. Every diagram must achieve studio-grade architectural rigor: 100% flat surface architecture, ultra-crisp hairline strokes (1px), generous breathing space, and razor-sharp typographic hierarchy.
> **Dual Archetype Requirement:** When illustrating system features, workflows, or backend protocols, provide **both the structural Block Diagram (Topology/Architecture) and the temporal Sequence Diagram (Lifelines/Messages)** with seamless tab switching within the same self-contained HTML deliverable.

---

## 1. Master Color System (YouTube Studio Cinematic Dark)

All generated diagrams must strictly implement the **YouTube Studio Dark Specification**:

| Semantic Token | Hex / Alpha Value | Architectural Role |
| :--- | :--- | :--- |
| `--bg-canvas` | `#0F0F0F` | Full viewport deep canvas background (True YouTube Obsidian) |
| `--bg-surface` | `#161616` | Logical cluster surface & Sequence lane background |
| `--bg-card` | `#212121` | Primary node card & Participant actor surface |
| `--bg-card-hover` | `#272727` | Interactive node hover state |
| `--border-hairline`| `rgba(255, 255, 255, 0.08)`| 1px hairline boundary separating nodes, cells, and lifelines |
| `--border-hover` | `rgba(255, 255, 255, 0.20)`| Interactive node hover border highlight |
| `--border-active`| `rgba(62, 166, 255, 0.60)`| Active path, focused node, and selected message arrow |
| `--text-primary` | `#F1F1F1` | Node titles, service headers, high-contrast identifiers |
| `--text-secondary`| `#AAAAAA` | Subtitles, HTTP methods (GET/POST), operational statuses |
| `--text-muted` | `#717171` | Timestamps, technical metrics, sequence step numbers |
| `--accent-tech` | `#3EA6FF` | **YouTube Tech Blue**: Primary indicator for active flows/arrows |
| `--accent-error` | `#FF4E4E` | **YouTube Alert Red**: Faulty paths, timeouts, exceptions |
| `--accent-success`| `#2ECC71` | **Emerald Green**: Healthy states, 200 OK responses, cache hits |
| `--accent-warning`| `#F1C40F` | **Amber Gold**: Pending states, background queue buffers |

---

## 2. Zero-Clutter Law & Progressive Disclosure

### A. Zero Decorative Noise (Eliminate 100% Visual Waste)
- ❌ **FORBIDDEN:** Arbitrary decorative stickers, artificial index numbers like `[01]`, `STUDIO` tags, overlapping decorative text frames.
- ❌ **FORBIDDEN:** Heavy drop shadows (`box-shadow: 0 20px 40px...`), 3D bevels, glassmorphism blur traps that degrade data readability.
- ✅ **REQUIRED:** 100% Flat (`box-shadow: none`), 1px hairline borders, micro corner radiuses `border-radius: 2px` or `0px`.

### B. Progressive Hover Disclosure
- **Rest State (Static):** Keep 100% clean. 
  - Block Nodes only expose `Mono Identifier` + `Single-line Title` + `Micro Status Dot`.
  - Sequence Arrows only expose `Step Number` + `Action Name`.
- **Hover State (Interactive):** Deep operational details (Payload schemas, Headers, DB table fields, Latencies) **fade into view on hover** (`opacity: 0` $\rightarrow$ `opacity: 1`, transition `150ms ease`) via subtle floating tooltips or anchored inspection drawers.

---

## 3. Specifications for the Two Primary Archetypes

### Archetype 1: Block & Topology Diagram (Sơ Đồ Khối Kiến Trúc)
- **Role:** Clarifies structural containment, service ownership, and communication topologies.
- **Clusters (Subgraphs):** Use `#161616` background containers with hairline border `rgba(255, 255, 255, 0.08)` to group logical domains (e.g., `Client Tier`, `API Gateway & Security`, `Core Services`, `Data Persistence`).
- **Nodes (Components):** Use `#212121` surfaces, micro `rounded-[2px]`, containing title and service type.
- **Connectors:** SVG hairline paths (`stroke-width: 1px`, `stroke: rgba(255, 255, 255, 0.15)`) routed using smooth cubic Bezier curves (`C`) or 90° orthogonal lines with filleted corners (`rx: 4px`). Sharp triangular arrowheads (`polygon`).

### Archetype 2: Sequence Diagram (Sơ Đồ Tuần Tự)
- **Role:** Clarifies ordered chronological interactions, protocols, payloads, and response loops.
- **Participants (Actors):** Positioned at the top as clean workstation cards (`#212121`, hairline border), with participant names in high contrast `#F1F1F1`.
- **Lifelines:** Vertical hairline dashed paths (`stroke: rgba(255, 255, 255, 0.12)`, `stroke-dasharray: 4 4`) extending from the bottom of each participant card.
- **Activation Boxes:** Narrow rectangular bars (`width: 10px`, `background: #272727`, border `rgba(255, 255, 255, 0.20)`) placed along the lifeline during active execution.
- **Message Types:**
  - **Synchronous Call:** Solid hairline stroke with filled triangular arrowhead (`#3EA6FF` on hover).
  - **Asynchronous / Event:** Solid hairline stroke with open stick arrowhead.
  - **Return Response:** Dashed hairline stroke (`stroke-dasharray: 3 3`) with open arrowhead, carrying response status (e.g., `200 OK`, `DTO payload`).
- **Grouping Frames (Alt / Loop / Opt):** Hairline dashed bounding boxes with a micro pill label at the top-left (e.g., `loop [poll every 5s]`, `alt [token expired]`).

---

## 4. Deliverable Protocol (Unified Dual-View Architecture)

- **100% Self-Contained:** Output exactly **one standalone HTML file** with all CSS, SVG, and vanilla JavaScript embedded inline. Zero dependencies on external CDNs or heavy runtimes.
- **Integrated View Switcher:** The top header dock provides instant view toggle tabs:
  - `[ Sơ đồ khối (Block / Topology) ]`
  - `[ Sơ đồ tuần tự (Sequence Diagram) ]`
  - `[ Zoom Controls (+ / - / 100%) ]`
- **System Typography:**
  - UI Labels: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif`
  - Code, Payloads & Sequence Numbers: `"JetBrains Mono", Consolas, Menlo, monospace` with `font-variant-numeric: tabular-nums`

---

## 5. Canonical Dual-View Production Template

Below is the complete, production-ready reference implementation containing **both** a functional Block Diagram and a functional Sequence Diagram in a single unified HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Architecture & Sequence Specification · YouTube Studio Dark</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --bg-canvas: #0F0F0F;
      --bg-surface: #161616;
      --bg-card: #212121;
      --bg-card-hover: #272727;
      --border: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(255, 255, 255, 0.20);
      --border-active: #3EA6FF;
      --text-primary: #F1F1F1;
      --text-secondary: #AAAAAA;
      --text-muted: #717171;
      --accent: #3EA6FF;
      --accent-error: #FF4E4E;
      --accent-success: #2ECC71;
      --accent-warning: #F1C40F;
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif;
      --font-mono: "JetBrains Mono", Consolas, Menlo, monospace;
    }

    body {
      background-color: var(--bg-canvas);
      color: var(--text-primary);
      font-family: var(--font-sans);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Top Workstation Dock ── */
    .topbar {
      height: 44px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      flex-shrink: 0;
      z-index: 50;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .topbar-title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    /* View Switcher Tabs */
    .view-switcher {
      display: inline-flex;
      background: var(--bg-canvas);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 2px;
      gap: 2px;
    }

    .view-tab {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 500;
      padding: 3px 12px;
      border-radius: 2px;
      cursor: pointer;
      transition: all 120ms ease;
    }

    .view-tab.active {
      background: var(--bg-card);
      color: var(--text-primary);
      box-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-dock {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 2px;
      cursor: pointer;
      transition: all 120ms ease;
    }

    .btn-dock:hover {
      background: var(--bg-card-hover);
      color: var(--text-primary);
      border-color: var(--border-hover);
    }

    /* ── Viewport & Canvas ── */
    .viewport {
      flex: 1;
      position: relative;
      overflow: auto;
      background-color: var(--bg-canvas);
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 24px 24px;
      cursor: grab;
    }

    .viewport:active { cursor: grabbing; }

    .canvas-plane {
      position: absolute;
      top: 0;
      left: 0;
      min-width: 1400px;
      min-height: 900px;
      padding: 40px;
      transform-origin: top left;
      transition: transform 120ms ease-out;
    }

    /* ── ARCHETYPE 1: BLOCK DIAGRAM STYLES ── */
    .block-view {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }

    .cluster {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 20px;
      position: absolute;
    }

    .cluster-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    .node {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 10px 14px;
      color: var(--text-primary);
      min-width: 200px;
      cursor: pointer;
      position: absolute;
      transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .node:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-hover);
      transform: translateY(-1px);
    }

    .node-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .node-title {
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
    }

    .node-tag {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-muted);
    }

    /* Progressive Tooltip */
    .node-details {
      display: none;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--border);
      font-size: 11px;
      color: var(--text-secondary);
      font-family: var(--font-mono);
      line-height: 1.4;
    }

    .node:hover .node-details {
      display: block;
      animation: fadeIn 120ms ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(2px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* SVG Connectors */
    svg.connections {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
    }

    .link-path {
      fill: none;
      stroke: rgba(255, 255, 255, 0.18);
      stroke-width: 1px;
      transition: stroke 150ms ease;
    }

    .link-path:hover, .link-path.active {
      stroke: var(--accent);
      stroke-width: 1.5px;
    }

    /* ── ARCHETYPE 2: SEQUENCE DIAGRAM STYLES ── */
    .sequence-view {
      display: none;
      position: relative;
      width: 1200px;
      margin: 0 auto;
      min-height: 800px;
    }

    .seq-actors-row {
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 30;
      padding: 10px 0;
    }

    .actor-box {
      width: 200px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 10px 14px;
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .actor-subtitle {
      font-size: 10px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-weight: normal;
      margin-top: 3px;
    }

    .seq-timeline-container {
      position: relative;
      margin-top: 10px;
      min-height: 650px;
    }

    /* Vertical Lifelines */
    .lifeline-track {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      border-left: 1px dashed rgba(255, 255, 255, 0.15);
      z-index: 1;
    }

    .activation-bar {
      position: absolute;
      width: 10px;
      background: var(--bg-surface);
      border: 1px solid var(--border-hover);
      border-radius: 1px;
      transform: translateX(-5px);
      z-index: 2;
    }

    /* Horizontal Message Arrows */
    .seq-message {
      position: absolute;
      display: flex;
      align-items: center;
      font-size: 11px;
      font-family: var(--font-mono);
      cursor: pointer;
      z-index: 15;
      transition: all 120ms ease;
    }

    .seq-message:hover {
      color: var(--accent);
    }

    .seq-message-label {
      position: absolute;
      top: -16px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      background: var(--bg-canvas);
      padding: 0 6px;
      color: var(--text-secondary);
      font-size: 11px;
    }

    .seq-arrow-line {
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, 0.25);
      position: relative;
      transition: background 120ms ease;
    }

    .seq-message:hover .seq-arrow-line {
      background: var(--accent);
    }

    .seq-arrow-line.return {
      background: transparent;
      border-top: 1px dashed rgba(255, 255, 255, 0.35);
    }

    .seq-arrow-head {
      position: absolute;
      right: 0;
      top: -3px;
      width: 0;
      height: 0;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 6px solid rgba(255, 255, 255, 0.45);
    }

    .seq-message:hover .seq-arrow-head {
      border-left-color: var(--accent);
    }

    .seq-arrow-head.left {
      right: auto;
      left: 0;
      border-left: none;
      border-right: 6px solid rgba(255, 255, 255, 0.45);
    }

    .seq-message:hover .seq-arrow-head.left {
      border-right-color: var(--accent);
    }

    /* Alt / Loop Boundary Box */
    .seq-loop-box {
      position: absolute;
      border: 1px dashed rgba(255, 255, 255, 0.15);
      background: rgba(22, 22, 22, 0.45);
      border-radius: 2px;
      padding: 6px;
      z-index: 5;
    }

    .seq-loop-badge {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 9.5px;
      color: var(--text-muted);
      border: 1px solid var(--border);
      background: var(--bg-surface);
      padding: 1px 6px;
      border-radius: 2px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <!-- Top Dock -->
  <header class="topbar">
    <div class="topbar-left">
      <span class="topbar-title">E-Commerce Architecture & Recovery Flow</span>
      
      <!-- Dual View Switcher -->
      <div class="view-switcher">
        <button class="view-tab active" id="tab-block" onclick="switchView('block')">Sơ đồ khối (Block / Topology)</button>
        <button class="view-tab" id="tab-sequence" onclick="switchView('sequence')">Sơ đồ tuần tự (Sequence)</button>
      </div>
    </div>

    <div class="controls">
      <button class="btn-dock" onclick="zoomReset()">Reset 100%</button>
      <button class="btn-dock" onclick="zoomIn()">Zoom +</button>
      <button class="btn-dock" onclick="zoomOut()">Zoom -</button>
    </div>
  </header>

  <!-- Viewport -->
  <main class="viewport" id="viewport">
    <div class="canvas-plane" id="plane">
      
      <!-- ── VIEW 1: BLOCK / TOPOLOGY ── -->
      <section class="block-view" id="view-block">
        <svg class="connections" id="svg-canvas">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(255, 255, 255, 0.4)" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#3EA6FF" />
            </marker>
          </defs>
          <!-- SVG Bezier Connectors -->
          <path d="M 280 145 C 370 145, 370 145, 460 145" class="link-path" marker-end="url(#arrow)" />
          <path d="M 280 325 C 370 325, 370 185, 460 185" class="link-path" marker-end="url(#arrow)" />
          <path d="M 700 165 C 770 165, 770 165, 840 165" class="link-path" marker-end="url(#arrow)" />
          <path d="M 1080 165 C 1140 165, 1140 280, 1140 380" class="link-path" marker-end="url(#arrow)" />
        </svg>

        <!-- Cluster 1: Frontend Clients -->
        <div class="cluster" style="left: 40px; top: 60px; width: 280px; height: 360px;">
          <div class="cluster-label">Client Tier (Decoupled SPAs)</div>
          
          <div class="node" style="left: 20px; top: 60px;">
            <div class="node-header">
              <span class="node-title">E-Commerce Client</span>
              <span class="node-tag">:3000</span>
            </div>
            <div class="node-details">Vite + React 19 Storefront<br/>Luxury Haute Couture Experience</div>
          </div>

          <div class="node" style="left: 20px; top: 240px;">
            <div class="node-header">
              <span class="node-title">CRM Admin App</span>
              <span class="node-tag">:3001</span>
            </div>
            <div class="node-details">Vite + React 19 Executive<br/>Pure Editorial Monolith</div>
          </div>
        </div>

        <!-- Cluster 2: API Gateway Tier -->
        <div class="cluster" style="left: 460px; top: 60px; width: 280px; height: 360px;">
          <div class="cluster-label">API Gateway & Auth</div>

          <div class="node" style="left: 20px; top: 80px;">
            <div class="node-header">
              <span class="node-title">Reverse Proxy & Router</span>
              <span class="node-tag">YARP / NGINX</span>
            </div>
            <div class="node-details">SSL Termination & Rate Limiter<br/>Token JWT Verification</div>
          </div>
        </div>

        <!-- Cluster 3: Core Domain Services -->
        <div class="cluster" style="left: 840px; top: 60px; width: 280px; height: 360px;">
          <div class="cluster-label">Application Core Services</div>

          <div class="node" style="left: 20px; top: 80px;">
            <div class="node-header">
              <span class="node-title">Cart & Order Service</span>
              <span class="node-tag">.NET 8 WebAPI</span>
            </div>
            <div class="node-details">Cart Recovery State Engine<br/>Checkout & Payment Handlers</div>
          </div>
        </div>

        <!-- Cluster 4: Data Layer -->
        <div class="cluster" style="left: 840px; top: 480px; width: 400px; height: 220px;">
          <div class="cluster-label">Data Persistence & Event Hub</div>

          <div class="node" style="left: 20px; top: 60px;">
            <div class="node-header">
              <span class="node-title">PostgreSQL Database</span>
              <span class="node-tag">:5432</span>
            </div>
            <div class="node-details">Cart, Orders, Customers<br/>ACID Compliant Storage</div>
          </div>

          <div class="node" style="left: 210px; top: 60px;">
            <div class="node-header">
              <span class="node-title">Redis Cache & Bus</span>
              <span class="node-tag">:6379</span>
            </div>
            <div class="node-details">Cart TTL Expiry Worker<br/>Live Notification Stream</div>
          </div>
        </div>
      </section>

      <!-- ── VIEW 2: SEQUENCE DIAGRAM ── -->
      <section class="sequence-view" id="view-sequence">
        <!-- Actors / Participants Row -->
        <div class="seq-actors-row">
          <div class="actor-box">
            Storefront Customer
            <div class="actor-subtitle">Browser / Web Client</div>
          </div>

          <div class="actor-box">
            API Gateway
            <div class="actor-subtitle">Route & Rate Limiter</div>
          </div>

          <div class="actor-box">
            Cart & Recovery Service
            <div class="actor-subtitle">Backend Core API</div>
          </div>

          <div class="actor-box">
            PostgreSQL & Redis
            <div class="actor-subtitle">Data Layer</div>
          </div>

          <div class="actor-box">
            CRM Admin Operator
            <div class="actor-subtitle">Admin Workstation</div>
          </div>
        </div>

        <!-- Vertical Lifelines & Messages -->
        <div class="seq-timeline-container">
          <!-- 5 Lifelines corresponding to actors (200px box + 50px offset) -->
          <div class="lifeline-track" style="left: 100px;"></div>
          <div class="lifeline-track" style="left: 350px;"></div>
          <div class="lifeline-track" style="left: 600px;"></div>
          <div class="lifeline-track" style="left: 850px;"></div>
          <div class="lifeline-track" style="left: 1100px;"></div>

          <!-- Activation Bars -->
          <div class="activation-bar" style="left: 100px; top: 40px; height: 120px;"></div>
          <div class="activation-bar" style="left: 350px; top: 40px; height: 280px;"></div>
          <div class="activation-bar" style="left: 600px; top: 60px; height: 420px;"></div>
          <div class="activation-bar" style="left: 850px; top: 80px; height: 100px;"></div>
          <div class="activation-bar" style="left: 1100px; top: 380px; height: 180px;"></div>

          <!-- Message 1: POST /api/cart -->
          <div class="seq-message" style="left: 100px; width: 250px; top: 50px;">
            <span class="seq-message-label">1. POST /api/cart/items</span>
            <div class="seq-arrow-line"><div class="seq-arrow-head"></div></div>
          </div>

          <!-- Message 2: Forward to Core Service -->
          <div class="seq-message" style="left: 350px; width: 250px; top: 70px;">
            <span class="seq-message-label">2. UpsertCartItem(cartId)</span>
            <div class="seq-arrow-line"><div class="seq-arrow-head"></div></div>
          </div>

          <!-- Message 3: Persist in DB -->
          <div class="seq-message" style="left: 600px; width: 250px; top: 90px;">
            <span class="seq-message-label">3. INSERT / UPDATE cart</span>
            <div class="seq-arrow-line"><div class="seq-arrow-head"></div></div>
          </div>

          <!-- Message 4: DB Result -->
          <div class="seq-message" style="left: 600px; width: 250px; top: 130px;">
            <span class="seq-message-label">4. 200 OK (Row Updated)</span>
            <div class="seq-arrow-line return"><div class="seq-arrow-head left"></div></div>
          </div>

          <!-- Loop / Inactive Timeout Box -->
          <div class="seq-loop-box" style="left: 480px; top: 190px; width: 500px; height: 120px;">
            <span class="seq-loop-badge">alt [Customer leaves checkout > 24 hours]</span>
            <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-top: 8px;">
              TTL triggers Redis Abandoned Cart Worker event
            </div>
          </div>

          <!-- Message 5: State change to ABANDONED -->
          <div class="seq-message" style="left: 600px; width: 250px; top: 250px;">
            <span class="seq-message-label">5. MarkAbandoned(cartId)</span>
            <div class="seq-arrow-line"><div class="seq-arrow-head"></div></div>
          </div>

          <!-- Message 6: Query Abandoned Carts from CRM -->
          <div class="seq-message" style="left: 600px; width: 500px; top: 390px;">
            <span class="seq-message-label">6. GET /api/admin/abandoned-carts</span>
            <div class="seq-arrow-line"><div class="seq-arrow-head left"></div></div>
          </div>

          <!-- Message 7: Trigger Recovery Campaign -->
          <div class="seq-message" style="left: 600px; width: 500px; top: 460px;">
            <span class="seq-message-label">7. POST /api/admin/abandoned-carts/recover</span>
            <div class="seq-arrow-line"><div class="seq-arrow-head left"></div></div>
          </div>

          <!-- Message 8: Send Recovery Email / Coupon -->
          <div class="seq-message" style="left: 100px; width: 500px; top: 520px;">
            <span class="seq-message-label">8. Dispatch Email Voucher (-10%)</span>
            <div class="seq-arrow-line"><div class="seq-arrow-head left"></div></div>
          </div>
        </div>
      </section>

    </div>
  </main>

  <script>
    // Zoom Engine
    let scale = 1;
    const plane = document.getElementById('plane');
    function zoomIn() { scale = Math.min(scale + 0.15, 2); updateZoom(); }
    function zoomOut() { scale = Math.max(scale - 0.15, 0.5); updateZoom(); }
    function zoomReset() { scale = 1; updateZoom(); }
    function updateZoom() { plane.style.transform = `scale(${scale})`; }

    // Dual View Switcher Engine
    function switchView(viewName) {
      const blockView = document.getElementById('view-block');
      const seqView = document.getElementById('view-sequence');
      const tabBlock = document.getElementById('tab-block');
      const tabSeq = document.getElementById('tab-sequence');

      if (viewName === 'block') {
        blockView.style.display = 'block';
        seqView.style.display = 'none';
        tabBlock.classList.add('active');
        tabSeq.classList.remove('active');
      } else {
        blockView.style.display = 'none';
        seqView.style.display = 'block';
        tabSeq.classList.add('active');
        tabBlock.classList.remove('active');
      }
      zoomReset();
    }
  </script>
</body>
</html>
```
