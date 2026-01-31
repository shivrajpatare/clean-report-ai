# Aura

**AI Civic Intelligence Platform**

A platform that helps cities detect, prioritize, and resolve urban sanitation issues using artificial intelligence and citizen participation.

---

## Overview

Aura transforms how cities handle civic complaints by replacing slow, manual reporting systems with an intelligent, photo-based detection platform. Citizens become real-time sensors for urban cleanliness, while authorities gain instant visibility into issues across the city.

The platform combines computer vision, automatic geolocation, and live administrative dashboards to create a responsive civic infrastructure that can identify problems before they escalate.

---

## Problem

Urban sanitation management faces several challenges:

- Traditional complaint systems rely on phone calls and written forms, causing delays
- Citizens often abandon reporting due to complex processes
- Authorities lack real-time visual data to assess severity
- Issues like illegal dumping or overflowing bins grow into larger problems before action is taken
- No centralized view exists to prioritize and coordinate response teams

---

## Solution

Aura addresses these challenges through:

**For Citizens**
- Simple photo-based reporting through a camera-first interface
- No forms to fill; AI automatically detects the issue type
- Automatic location capture ensures accurate placement
- Track report status from submission to resolution

**For Authorities**
- Live dashboard showing all active issues on an interactive map
- AI-assigned priority levels help teams focus on critical problems first
- Assignment and status tracking for field teams
- Analytics on response times and resolution rates

---

## Features

### Intelligent Issue Detection
The platform analyzes uploaded images to identify issue categories including garbage accumulation, uncleaned dustbins, burning waste, open manholes, stagnant water, sewage overflow, and more. Each detection includes a confidence score.

### Automatic Location Tagging
GPS coordinates are captured at the moment of reporting and converted to readable addresses. This eliminates manual address entry and ensures precise location data for field teams.

### Priority Assessment
Based on the detected issue type and visual analysis, the system assigns priority levels (Critical, High, Medium, Low) to help authorities allocate resources effectively.

### Live Administrative Map
A real-time map displays all reported issues with color-coded markers by status and priority. Administrators can filter, search, and click any marker to view full report details.

### Circular Economy Network
A dedicated portal connects municipal waste streams with certified processing partners, enabling material recovery tracking from street-level detection to industrial processing.

---

## System Architecture

```
                    Citizens                         Administrators
                       |                                   |
                       v                                   v
              [Mobile Camera UI]                  [Dashboard + Map]
                       |                                   |
                       v                                   v
              -------------------------------------------------
                            |  Frontend Layer  |
                            |  React + Tailwind |
              -------------------------------------------------
                                    |
                                    v
              -------------------------------------------------
                            |   API Layer      |
                            |   Edge Functions |
              -------------------------------------------------
                                    |
                    --------------------------------
                    |               |              |
                    v               v              v
              [AI Analysis]   [Database]    [Storage]
              [Image Model]   [Reports]     [Images]
```

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Leaflet for interactive maps
- Framer Motion for animations

### Backend
- Serverless edge functions
- RESTful API design
- Real-time data subscriptions

### Database
- PostgreSQL with row-level security
- Structured tables for reports, users, and assignments
- Geospatial queries for location-based filtering

### AI Processing
- Computer vision for waste and issue detection
- Category classification across nine issue types
- Confidence scoring for quality assessment

---

## Key Screens

### Citizen Reporting Interface
A camera-first design guides users through capturing clear photos. The interface provides real-time AI feedback, automatic location detection, and a streamlined submission flow.

### Administrative Dashboard
A command center view combining statistics, a filterable report list, and an interactive map. Administrators can review details, assign teams, and update statuses from a single screen.

### City Issues Map
A public-facing map showing the current state of reported issues across the city. Markers indicate status (Pending, In Progress, Resolved) and cluster automatically at lower zoom levels.

### Partner Integration Portal
A B2B interface for waste processing partners to view available material streams, request allocations, and track circular economy metrics.

---

## Workflow

1. A citizen notices a civic issue such as garbage dumping
2. They open Aura and capture a photo through the camera interface
3. The AI analyzes the image and identifies the issue category
4. Location coordinates are automatically attached to the report
5. The report appears on the administrative dashboard
6. An administrator reviews and assigns the report to a field team
7. The team addresses the issue and updates the status
8. The citizen can track progress and verify resolution

---

## Future Development

**Predictive Analytics**
Using historical data to forecast where issues are likely to occur, enabling proactive deployment of cleaning crews.

**Hotspot Detection**
Identifying recurring problem areas to inform infrastructure improvements and policy decisions.

**Municipal System Integration**
APIs to connect with existing city management software, work order systems, and resource planning tools.

**Extended Material Recovery**
Expanding the circular economy network to track material flow from collection through processing to end use.

**Civic Health Metrics**
Aggregate dashboards showing city-wide cleanliness scores, response efficiency, and trend analysis over time.

---

## Impact

**Faster Response**
Immediate visibility into issues reduces the time between citizen observation and authority action.

**Better Resource Allocation**
Priority-based queuing ensures critical issues receive attention first.

**Increased Reporting**
A simple photo-based flow removes barriers that discourage citizens from reporting.

**Data-Driven Planning**
Historical reports create a dataset for analyzing patterns and improving sanitation infrastructure.

**Accountability**
Transparent status tracking builds trust between citizens and municipal bodies.

---

## Technology

| Layer | Technologies |
|-------|-------------|
| Frontend | React, TypeScript, Tailwind CSS, Framer Motion, Leaflet |
| Backend | Edge Functions, PostgreSQL, Real-time Subscriptions |
| AI | Computer Vision Models, Image Classification |
| Infrastructure | Cloud-hosted, Serverless Architecture |

---

## Installation

### Frontend

```bash
git clone <repository-url>
cd aura
npm install
npm run dev
```

The development server will start at `http://localhost:5173`

### Environment Variables

Create a `.env` file with the required configuration:

```
VITE_SUPABASE_URL=<your-database-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-api-key>
```

---

## Collaboration

Aura welcomes partnerships with:

- Municipal corporations seeking modern civic engagement tools
- Waste management companies interested in data-driven operations
- Recycling facilities looking for verified material streams
- NGOs and civic organizations focused on urban cleanliness
- Technology partners with complementary solutions

For partnership inquiries, use the Partner Integration Request form on the platform.

---

## License

MIT License

---

Built to help cities operate cleaner and respond faster.
