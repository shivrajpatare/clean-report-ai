# Aura

**AI Civic Intelligence Platform**

A platform that helps cities detect, prioritize, and resolve urban sanitation issues using artificial intelligence and citizen participation.

https://aura-ai-one-liard.vercel.app/

---

## Overview

Aura transforms how cities handle civic complaints by replacing slow, manual reporting systems with an intelligent, photo-based detection platform. Citizens become real-time sensors for urban cleanliness, while authorities gain instant visibility into issues across the city.

The platform combines computer vision powered by Google Gemini, automatic geolocation, and live administrative dashboards to create a responsive civic infrastructure that can identify problems before they escalate.

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
The platform analyzes uploaded images using Google Gemini 2.5 Flash to identify issue categories including:
- Garbage accumulation
- Uncleaned dustbins
- Burning waste
- Open manholes
- Stagnant water
- Dead animals
- Sewage overflow
- Sweeping not done

Each detection includes a confidence score and severity assessment.

### Automatic Location Tagging
GPS coordinates are captured at the moment of reporting and converted to readable addresses using reverse geocoding. This eliminates manual address entry and ensures precise location data for field teams.

### Priority Assessment
Based on the detected issue type and visual analysis, the system assigns priority levels (Critical, High, Medium, Low) to help authorities allocate resources effectively.

### Live Administrative Map
A real-time map displays all reported issues with color-coded markers by status and priority. Administrators can filter, search, and click any marker to view full report details including the original photo.

### Circular Economy Network
A dedicated B2B portal connects municipal waste streams with certified processing partners, featuring:
- AI-verified material stream analytics
- Partner integration request system
- Live recovery stream tracking
- Circular value metrics

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
                            |  React + Vite    |
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
              [Gemini AI]     [PostgreSQL]   [Storage]
              [Vision API]    [Reports DB]   [Images]
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Component library |
| Framer Motion | Animations |
| Leaflet | Interactive maps |
| React Query | Server state management |
| React Hook Form | Form handling |
| Zod | Schema validation |

### Backend
| Technology | Purpose |
|------------|---------|
| Lovable Cloud | Serverless infrastructure |
| PostgreSQL | Database |
| Edge Functions | API endpoints |
| Row Level Security | Data protection |

### AI
| Technology | Purpose |
|------------|---------|
| Google Gemini 2.5 Flash | Image analysis and classification |
| Lovable AI Gateway | API management |

### Maps
| Technology | Purpose |
|------------|---------|
| Leaflet | Map rendering |
| OpenStreetMap | Tile provider |
| Marker Clustering | Performance optimization |

---

## Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   │   ├── AdminMapPanel.tsx
│   │   └── ReportDetailPanel.tsx
│   ├── map/             # Map utilities
│   │   └── mapUtils.ts
│   ├── ui/              # shadcn/ui components
│   ├── AuraNavbar.tsx   # Navigation
│   ├── AuraHero.tsx     # Landing hero
│   ├── CaptureScreen.tsx # Photo capture
│   ├── AIAnalysisResult.tsx
│   ├── AdminDashboard.tsx
│   ├── IssuesMap.tsx
│   └── ...
├── pages/
│   ├── Index.tsx        # Main landing page
│   ├── CircularNetwork.tsx # B2B partner portal
│   └── NotFound.tsx
├── hooks/               # Custom React hooks
├── integrations/
│   └── supabase/        # Database client and types
├── lib/                 # Utilities
└── test/                # Test setup
supabase/
├── functions/
│   └── analyze-issue/   # AI analysis edge function
└── config.toml
```

---

## Key Screens

### Citizen Reporting Interface
A camera-first design with:
- Real-time AI status feedback
- Flash toggle and gallery upload
- Automatic location detection
- Community motivation messages
- Privacy reassurance

### Administrative Dashboard
A command center featuring:
- Live statistics cards
- Filterable report list
- Interactive map panel
- Report detail slide-out
- Status management controls

### City Issues Map
Public-facing map showing:
- All reported issues across Pune
- Status-based color coding
- Marker clustering for performance
- Filter by status
- Click-to-view details

### Circular Economy Portal
B2B interface displaying:
- System health metrics
- Material stream analytics
- Partner integration form
- Available recovery streams
- AI purity scores

---

## Database Schema

### Reports Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| category | ENUM | Issue type |
| priority | ENUM | Severity level |
| status | ENUM | Current status |
| latitude | FLOAT | GPS latitude |
| longitude | FLOAT | GPS longitude |
| address | TEXT | Reverse geocoded address |
| before_image_url | TEXT | Original photo URL |
| ai_description | TEXT | AI-generated description |
| ai_confidence | FLOAT | Detection confidence |
| created_at | TIMESTAMP | Report time |

### Issue Categories
- garbage_dump
- dustbin_not_cleaned
- burning_garbage
- open_manhole
- stagnant_water
- dead_animal
- sewage_overflow
- sweeping_not_done
- other

### Priority Levels
- critical
- high
- medium
- low

### Report Statuses
- pending
- in_progress
- resolved
- duplicate

---

## Workflow

1. Citizen spots a civic issue
2. Opens Aura and captures a photo through the camera interface
3. AI analyzes the image using Gemini Vision
4. Issue category, severity, and description are generated
5. Location coordinates are automatically attached
6. Report is stored in the database with image in cloud storage
7. Admin sees the issue appear on the live dashboard map
8. Admin reviews details and assigns to field team
9. Team addresses the issue and updates status
10. Citizen can track progress through the map view

---

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or bun

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd aura

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Variables

The project uses Lovable Cloud which automatically configures:
- `VITE_SUPABASE_URL` - Database endpoint
- `VITE_SUPABASE_PUBLISHABLE_KEY` - API key
- `VITE_SUPABASE_PROJECT_ID` - Project identifier

### Running Tests

```bash
npm run test
```

---

## API Reference

### Edge Functions

**POST /analyze-issue**

Analyzes an uploaded image for civic issues.

Request:
```json
{
  "imageBase64": "base64-encoded-image-data"
}
```

Response:
```json
{
  "category": "garbage_dump",
  "priority": "high",
  "description": "Large pile of mixed waste including plastic bags...",
  "confidence": 0.92
}
```

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

## Collaboration

Aura welcomes partnerships with:

- Municipal corporations seeking modern civic engagement tools
- Waste management companies interested in data-driven operations
- Recycling facilities looking for verified material streams
- NGOs and civic organizations focused on urban cleanliness
- Technology partners with complementary solutions

For partnership inquiries, visit the Circular Economy Network portal at `/partners`.

---

## AI and Data Sources

### Models

| Model | Provider | Purpose |
|-------|----------|---------|
| Gemini 2.5 Flash | Google via Lovable AI Gateway | Image classification and severity assessment |

The platform uses zero-shot classification without custom training data. The model analyzes uploaded images in real-time and returns structured JSON with category, confidence score, and description.

### Data Sources

| Data Type | Source | License |
|-----------|--------|---------|
| Map tiles | OpenStreetMap | ODbL |
| Geocoding | Nominatim | ODbL |
| Report images | User uploads | Platform ToS |
| Location data | Device GPS | User consent |

All civic reports are user-generated. No synthetic data is used in production. Historical report data remains within the platform database and is not shared externally.

---

## Evaluation and Guardrails

### Confidence Thresholds

The AI assigns a confidence score (0 to 1) with each classification. Reports with confidence below 0.5 are flagged for manual review by administrators.

### Human-in-the-Loop Verification

Municipal administrators (Keepers) review AI-detected categories and severity levels through the dashboard before dispatching field teams. This prevents incorrect classifications from wasting resources.

### Bias Mitigation

- Category definitions are explicit and documented in the system prompt
- Priority levels are rule-based (mapped from category), not AI-determined
- All reports receive equal initial visibility regardless of location

### Privacy Protections

- Reporter contact information (name, phone) is excluded from public views
- Public map shows issue details without personal identifiers
- Row Level Security enforces data access boundaries

### Rate Limiting

- AI endpoint implements rate limiting (429 responses) to prevent abuse
- Credit exhaustion returns 402 with clear messaging

---

## Known Limitations and Risks

### Current Limitations

| Limitation | Impact | Planned Resolution |
|------------|--------|-------------------|
| English only | Excludes non-English speakers | Multi-language support in roadmap |
| GPS required | Cannot report without location services | Address-based fallback planned |
| Online only | No offline reporting capability | Local queue with sync under consideration |
| Single city | Currently designed for Pune | Multi-city architecture in development |

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Model hallucination | Medium | Medium | 0.5 confidence threshold + human review |
| Spam submissions | Medium | Low | Rate limiting + duplicate detection |
| Location spoofing | Low | Medium | Cross-reference with known landmarks |
| Image manipulation | Low | Low | AI consistency checks + admin verification |

### Not Yet Implemented

- Predictive analytics for issue forecasting
- Automated field team routing
- Citizen notification system for status updates
- Integration with existing municipal software

---

## Team

Built with dedication by:

| Name | Role | Contact |
|------|------|---------|
| Shivraj Patare | AI/ML Integration & Frontend | shivrajpatarre@gmail.com |
| Soham Ghadge | Backend & Research | sohamghadge7900@gmail.com |

---

## License

MIT License

---

Built to help cities operate cleaner and respond faster.
