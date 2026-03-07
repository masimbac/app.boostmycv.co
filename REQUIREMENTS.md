# BoostMyCV - Requirements Document

## 1. Project Overview

### 1.1 Project Name
BoostMyCV - AI-Powered Resume Optimization Platform

### 1.2 Project Description
BoostMyCV is a resume management platform that helps users optimize their CVs to match job descriptions using AI-powered analysis. The platform provides CV parsing, scoring, gap analysis, and automated improvement recommendations to increase job application success rates.

### 1.3 Target Audience
- Job seekers looking to improve their resumes
- Career changers needing to align CVs with new industries
- Professionals applying to multiple positions
- Recent graduates optimizing their first resumes

---

## 2. User Roles & Subscription Tiers

### 2.1 Free Tier (Basic User)
**Limitations:**
- Maximum 2 CVs stored
- 5 CV scores per month
- No AI-powered auto-boost feature
- Manual editing only
- Standard support

### 2.2 Pro Tier (Professional User)
**Price:** $9.00 USD/user/month

**Features:**
- Unlimited CVs stored
- Unlimited CV scoring
- AI-powered auto-boost recommendations
- Priority support
- Advanced analytics
- Export to multiple formats
- Version history tracking

---

## 3. Functional Requirements

### 3.1 Landing Page

#### 3.1.1 Hero Section
- Compelling headline and subheadline
- Primary CTA: "Get Started Free" button
- Secondary CTA: "See How It Works" button
- Hero image/illustration showcasing the platform
- Social proof (testimonials, user count, success rate)

#### 3.1.2 Products Section
- Overview of platform capabilities
- CV Upload & Parsing
- AI-Powered Scoring
- Gap Analysis
- Smart Recommendations
- One-Click Boost
- PDF Export

#### 3.1.3 Services Section
- CV Optimization
- Job Description Matching
- Keyword Analysis
- ATS Compatibility Check
- Professional Formatting

#### 3.1.4 Pricing Section
- Side-by-side comparison table
- Free vs Pro features
- Clear pricing: $9/month for Pro
- FAQ section
- "Start Free Trial" CTA

### 3.2 User Management

#### 3.2.1 Registration
- Email/password registration
- Social login options:
  - Google OAuth
  - LinkedIn OAuth
  - Facebook OAuth
- Email verification
- Terms of service acceptance
- Privacy policy acceptance

#### 3.2.2 Authentication (Supabase Auth)
- Secure login/logout
- Password reset functionality
- Session management
- Multi-device support
- Social account linking

#### 3.2.3 User Profile
- Personal information (name, email, phone)
- Profile picture
- Subscription status
- Usage statistics
- Account settings
- Notification preferences

### 3.3 Subscription Management

#### 3.3.1 Paystack Integration
- Subscription creation
- Payment processing
- Recurring billing
- Subscription upgrades
- Subscription cancellations
- Payment history
- Invoice generation

#### 3.3.2 Subscription States
- Active
- Canceled
- Past Due
- Trialing (if applicable)

### 3.4 CV Upload & Management

#### 3.4.1 CV Upload
- Supported formats: PDF, DOCX
- Maximum file size: 10MB
- Drag-and-drop interface
- File validation
- Upload progress indicator
- Error handling for invalid files

#### 3.4.2 CV Naming
- User-defined CV name (required)
- Auto-generated names (e.g., "Resume - Company Name")
- Name uniqueness validation per user
- Edit CV name functionality

#### 3.4.3 CV Parsing
**Flow:**
1. User uploads CV file
2. Backend extracts text content from PDF/DOCX
3. Content sent to ChatGPT API for structured parsing
4. ChatGPT returns standardized JSON format
5. Parsed data stored in DynamoDB
6. User notified of successful parsing

**Parsed JSON Structure:**
```json
{
  "cv_id": "uuid",
  "user_id": "uuid",
  "cv_name": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "personal_info": {
    "full_name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "portfolio": "string"
  },
  "professional_summary": "string",
  "work_experience": [
    {
      "company": "string",
      "position": "string",
      "location": "string",
      "start_date": "string",
      "end_date": "string",
      "current": "boolean",
      "responsibilities": ["string"],
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field_of_study": "string",
      "start_date": "string",
      "end_date": "string",
      "gpa": "string",
      "honors": ["string"]
    }
  ],
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "languages": ["string"],
    "certifications": ["string"]
  },
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "url": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string",
      "credential_id": "string"
    }
  ],
  "awards": ["string"],
  "publications": ["string"],
  "volunteer_experience": ["string"]
}
```

#### 3.4.4 CV List View
- Display all CVs for logged-in user
- CV card showing:
  - CV name
  - Last updated date
  - Upload date
  - Quick actions (View, Edit, Delete, Score)
- Search/filter functionality
- Sort options (date, name, score)

### 3.5 CV Scoring

#### 3.5.1 Scoring Interface
- Job description textarea (required)
- CV selection dropdown (from user's CVs)
- "Score CV" button
- Loading state during analysis
- Results display panel

#### 3.5.2 Scoring Process
**Flow:**
1. User pastes job description
2. User selects CV from their list
3. User clicks "Score" button
4. Backend sends both CV JSON and job description to ChatGPT
5. ChatGPT analyzes match and returns structured response
6. Results displayed to user
7. Score saved to database with timestamp

**ChatGPT Scoring Prompt Structure:**
```
Analyze the following resume against the job description and provide:
1. Overall match score (0-100%)
2. Detailed gap analysis
3. Specific recommendations for improvement

Resume: [CV JSON]
Job Description: [User Input]

Return response in the following JSON format:
{
  "overall_score": number,
  "score_breakdown": {
    "skills_match": number,
    "experience_match": number,
    "education_match": number,
    "keywords_match": number
  },
  "gaps": [
    {
      "category": "string",
      "description": "string",
      "severity": "high|medium|low"
    }
  ],
  "recommendations": [
    {
      "section": "string",
      "recommendation": "string",
      "priority": "high|medium|low",
      "specific_action": "string"
    }
  ],
  "missing_keywords": ["string"],
  "strengths": ["string"]
}
```

#### 3.5.3 Score Display
**Score Card:**
- Overall score percentage (visual gauge/progress bar)
- Score breakdown by category
- Color-coded rating (0-50% red, 51-75% yellow, 76-100% green)

**Gaps Section:**
- List of identified gaps
- Severity indicators
- Category grouping
- Expandable details

**Recommendations Section:**
- Prioritized list
- Section-specific recommendations
- Actionable suggestions
- "Apply Recommendations" CTA

**Additional Insights:**
- Missing keywords list
- Strength highlights
- ATS compatibility notes

### 3.6 CV Boosting

#### 3.6.1 Manual Editing
- Inline editor for all CV sections
- Rich text formatting
- Real-time preview
- Validation
- Auto-save functionality
- Version history (Pro users only)

#### 3.6.2 AI-Powered Auto-Boost (Pro Only)
**Flow:**
1. User clicks "Auto-Boost" button
2. System sends CV JSON + recommendations to ChatGPT
3. ChatGPT applies recommendations and returns updated CV JSON
4. User reviews changes (diff view)
5. User accepts/rejects changes
6. Updated CV saved as new version or replaces existing

**Auto-Boost Prompt:**
```
Apply the following recommendations to improve this resume:

Current Resume: [CV JSON]
Recommendations: [Recommendations Array]
Job Description Context: [Original Job Description]

Return the improved resume in the same JSON structure with all recommendations applied.
Ensure:
- Professional tone maintained
- No fabricated information
- Keyword optimization
- ATS-friendly formatting
- Quantifiable achievements emphasized
```

#### 3.6.3 Save Options
- Save as new CV (creates copy)
- Update existing CV (replaces current)
- Confirmation dialog
- Success notification

### 3.7 CV Export

#### 3.7.1 PDF Generation
**Flow:**
1. User clicks "Download PDF" button
2. Backend merges CV JSON with LaTeX template
3. Merged LaTeX sent to external PDF generation API
4. PDF returned to user for download
5. PDF stored temporarily (24-hour expiry)

**LaTeX Templates:**
- Professional template (default)
- Modern template (Pro)
- Academic template (Pro)
- Creative template (Pro)

#### 3.7.2 Template Selection (Pro Users)
- Template preview
- Customization options:
  - Font family
  - Color scheme
  - Section ordering
  - Layout (single/two-column)

#### 3.7.3 Export Formats
- PDF (all users)
- DOCX (Pro users)
- JSON (Pro users - for backup)

---

## 4. Technical Requirements

### 4.1 Frontend

#### 4.1.1 Framework
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components

#### 4.1.2 State Management
- React Context API / Zustand
- React Query for server state

#### 4.1.3 Form Handling
- React Hook Form
- Zod validation

#### 4.1.4 File Upload
- react-dropzone
- Client-side file validation

#### 4.1.5 Rich Text Editor
- Tiptap / Lexical

### 4.2 Backend

#### 4.2.1 API Architecture
- Next.js API Routes / Route Handlers
- RESTful API design
- API versioning (/api/v1/)

#### 4.2.2 Authentication
- Supabase Auth SDK
- JWT token management
- Session handling
- Social OAuth providers configuration

#### 4.2.3 Database
**Primary Database: DynamoDB**

**Tables:**

**Users Table:**
```
PK: user_id (uuid)
Attributes:
  - email (string)
  - full_name (string)
  - profile_picture_url (string)
  - subscription_tier (string: "free" | "pro")
  - subscription_id (string)
  - created_at (timestamp)
  - updated_at (timestamp)
  - usage_stats (map)
```

**CVs Table:**
```
PK: cv_id (uuid)
SK: user_id (uuid)
GSI: user_id (for querying user's CVs)
Attributes:
  - cv_name (string)
  - parsed_data (map/JSON)
  - original_file_url (string)
  - created_at (timestamp)
  - updated_at (timestamp)
  - version (number)
  - parent_cv_id (uuid, nullable)
```

**Scores Table:**
```
PK: score_id (uuid)
SK: cv_id (uuid)
GSI: user_id (for user's scoring history)
Attributes:
  - user_id (uuid)
  - job_description (string)
  - overall_score (number)
  - score_breakdown (map)
  - gaps (list)
  - recommendations (list)
  - missing_keywords (list)
  - strengths (list)
  - created_at (timestamp)
```

**Subscriptions Table:**
```
PK: subscription_id (uuid)
SK: user_id (uuid)
Attributes:
  - paystack_subscription_id (string)
  - status (string)
  - plan (string)
  - amount (number)
  - currency (string)
  - start_date (timestamp)
  - next_billing_date (timestamp)
  - canceled_at (timestamp, nullable)
```

#### 4.2.4 File Storage
- AWS S3 / Supabase Storage
- Separate buckets:
  - cv-uploads (original files)
  - cv-exports (generated PDFs)
  - profile-pictures
- Signed URLs for secure access
- Automatic cleanup for temporary files

#### 4.2.5 File Parsing
- pdf-parse (for PDF extraction)
- mammoth (for DOCX extraction)
- Error handling for corrupted files

### 4.3 Third-Party Integrations

#### 4.3.1 OpenAI ChatGPT API
**Configuration:**
- Model: GPT-4 or GPT-4-turbo
- Temperature: 0.3 (for consistency)
- Max tokens: 4000
- Response format: JSON mode

**API Endpoints:**
- CV Parsing
- CV Scoring
- Auto-Boost recommendations

**Error Handling:**
- Rate limiting
- Retry logic
- Fallback mechanisms

#### 4.3.2 Supabase Auth
**Configuration:**
- Email/password authentication
- Social providers:
  - Google OAuth 2.0
  - LinkedIn OAuth 2.0
  - Facebook Login
- Email verification enabled
- Password reset flows
- Session management

#### 4.3.3 Paystack
**Integration:**
- Payment plans setup
- Subscription creation API
- Webhook endpoints:
  - subscription.create
  - subscription.disable
  - charge.success
  - invoice.payment_failed
- Customer management
- Subscription management API

#### 4.3.4 PDF Generation API
**Options:**
- LaTeX.Online API
- Overleaf API
- Self-hosted LaTeX compiler (Docker)

**Requirements:**
- Accepts LaTeX source code
- Returns compiled PDF
- Error handling for compilation failures

### 4.4 API Specifications

#### 4.4.1 Authentication Endpoints

```
POST /api/v1/auth/register
Body: { email, password, full_name }
Response: { user, session }

POST /api/v1/auth/login
Body: { email, password }
Response: { user, session }

POST /api/v1/auth/social-login
Body: { provider, token }
Response: { user, session }

POST /api/v1/auth/logout
Response: { success: true }

POST /api/v1/auth/reset-password
Body: { email }
Response: { message }
```

#### 4.4.2 User Management Endpoints

```
GET /api/v1/users/me
Response: { user, subscription }

PUT /api/v1/users/me
Body: { full_name, profile_picture_url }
Response: { user }

GET /api/v1/users/me/usage
Response: { cv_count, scores_this_month, subscription_tier }
```

#### 4.4.3 Subscription Endpoints

```
POST /api/v1/subscriptions/create
Body: { plan: "pro", payment_method }
Response: { subscription, authorization_url }

POST /api/v1/subscriptions/cancel
Response: { success: true }

GET /api/v1/subscriptions/current
Response: { subscription }

POST /api/v1/webhooks/paystack
Body: { event, data }
Response: { success: true }
```

#### 4.4.4 CV Management Endpoints

```
POST /api/v1/cvs/upload
Body: FormData { file, cv_name }
Response: { cv_id, status: "processing" }

GET /api/v1/cvs
Query: { limit, offset }
Response: { cvs: [], total, page }

GET /api/v1/cvs/:cv_id
Response: { cv }

PUT /api/v1/cvs/:cv_id
Body: { cv_name, parsed_data }
Response: { cv }

DELETE /api/v1/cvs/:cv_id
Response: { success: true }

GET /api/v1/cvs/:cv_id/status
Response: { status: "processing" | "completed" | "failed", parsed_data }
```

#### 4.4.5 Scoring Endpoints

```
POST /api/v1/scores/analyze
Body: { cv_id, job_description }
Response: { score_id, overall_score, gaps, recommendations }

GET /api/v1/scores/:score_id
Response: { score }

GET /api/v1/scores/history
Query: { cv_id?, limit, offset }
Response: { scores: [], total }
```

#### 4.4.6 Boost Endpoints

```
POST /api/v1/boost/auto
Body: { cv_id, score_id }
Response: { boosted_cv_data, changes: [] }

POST /api/v1/boost/apply
Body: { cv_id, boosted_data, save_as_new }
Response: { cv }
```

#### 4.4.7 Export Endpoints

```
POST /api/v1/export/pdf
Body: { cv_id, template_id? }
Response: { pdf_url, expires_at }

POST /api/v1/export/docx
Body: { cv_id }
Response: { docx_url, expires_at }
```

### 4.5 Security Requirements

#### 4.5.1 Authentication & Authorization
- JWT token validation on all protected routes
- Role-based access control (RBAC)
- Rate limiting on auth endpoints
- Password strength requirements (min 8 chars, 1 uppercase, 1 number)
- Account lockout after failed login attempts

#### 4.5.2 Data Protection
- Encryption at rest (DynamoDB encryption)
- Encryption in transit (HTTPS/TLS)
- Secure file upload validation
- CORS configuration
- XSS protection
- CSRF protection
- SQL injection prevention (parameterized queries)

#### 4.5.3 API Security
- API key rotation
- Environment variable management
- Secrets management (AWS Secrets Manager / Vercel Env)
- Input validation and sanitization
- Output encoding
- Rate limiting per user/IP

#### 4.5.4 Privacy & Compliance
- GDPR compliance (data export, deletion)
- Privacy policy
- Terms of service
- Cookie consent
- Data retention policies
- Audit logging

### 4.6 Performance Requirements

#### 4.6.1 Response Times
- Page load: < 2 seconds
- API responses: < 500ms (excluding AI processing)
- CV parsing: < 30 seconds
- CV scoring: < 15 seconds
- PDF generation: < 10 seconds

#### 4.6.2 Scalability
- Support 10,000 concurrent users
- Handle 1,000 CV uploads per hour
- Process 5,000 scoring requests per hour

#### 4.6.3 Optimization
- Image optimization (Next.js Image)
- Code splitting
- Lazy loading
- Caching strategy (CDN, Redis)
- Database query optimization
- Connection pooling

### 4.7 Monitoring & Logging

#### 4.7.1 Application Monitoring
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (Better Uptime / UptimeRobot)

#### 4.7.2 Logging
- Application logs (Winston/Pino)
- API request/response logging
- Error logging with stack traces
- User activity logging
- Webhook event logging

#### 4.7.3 Metrics
- User registrations
- Subscription conversions
- CV uploads
- Scoring requests
- Export requests
- API response times
- Error rates

---

## 5. UI/UX Requirements

### 5.1 Design System
- Consistent color palette
- Typography scale
- Spacing system (Tailwind)
- Component library (shadcn/ui)
- Responsive breakpoints
- Accessibility (WCAG 2.1 AA)

### 5.2 User Flows

#### 5.2.1 Onboarding Flow
1. Landing page
2. Sign up (email or social)
3. Email verification (if email signup)
4. Welcome tour (optional)
5. Upload first CV prompt
6. Dashboard

#### 5.2.2 CV Scoring Flow
1. Dashboard
2. Select/upload CV
3. Enter job description
4. Initiate scoring
5. View results
6. Apply recommendations
7. Download improved CV

### 5.3 Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly controls on mobile
- Collapsible navigation
- Adaptive layouts

### 5.4 Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast ratios (4.5:1 minimum)
- Focus indicators
- Alt text for images

### 5.5 Loading States
- Skeleton screens
- Progress indicators
- Optimistic UI updates
- Error boundaries
- Retry mechanisms

---

## 6. Development Phases

### Phase 1: Foundation (Weeks 1-2)
- Project setup (Next.js, TypeScript, Tailwind, shadcn/ui)
- Landing page design and development
- Authentication setup (Supabase Auth)
- Basic user registration and login
- Database schema design (DynamoDB)

### Phase 2: Core Features (Weeks 3-5)
- CV upload functionality
- File parsing (PDF/DOCX)
- ChatGPT integration for CV parsing
- CV storage in DynamoDB
- CV list view and management
- User dashboard

### Phase 3: Scoring System (Weeks 6-7)
- Job description input interface
- ChatGPT integration for scoring
- Score display interface
- Gap analysis visualization
- Recommendations display

### Phase 4: Boosting Features (Week 8)
- Manual CV editing interface
- AI auto-boost functionality
- Version management
- Change tracking and diff view

### Phase 5: Export & Templates (Week 9)
- LaTeX template design
- PDF generation API integration
- Export functionality
- Template selection (Pro feature)

### Phase 6: Payments (Week 10)
- Paystack integration
- Subscription management
- Webhook handling
- Usage tracking and limits

### Phase 7: Polish & Launch (Weeks 11-12)
- User testing
- Bug fixes
- Performance optimization
- SEO optimization
- Documentation
- Production deployment

---

## 7. Testing Requirements

### 7.1 Unit Tests
- Component testing (React Testing Library)
- API route testing
- Utility function testing
- Coverage target: 80%

### 7.2 Integration Tests
- Authentication flows
- Payment flows
- CV upload and parsing
- Scoring pipeline
- Export functionality

### 7.3 End-to-End Tests
- User registration and login
- Complete CV scoring workflow
- Subscription purchase flow
- CV export flow
- Playwright or Cypress

### 7.4 Manual Testing
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile device testing (iOS, Android)
- Accessibility testing
- Performance testing
- Security testing

---

## 8. Deployment Requirements

### 8.1 Hosting
- Vercel (recommended for Next.js)
- AWS (alternative)
- Environment: Production, Staging, Development

### 8.2 Domain & SSL
- Custom domain
- SSL certificate (automatic with Vercel)
- DNS configuration

### 8.3 Environment Variables
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# AWS
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DYNAMODB_TABLE_PREFIX=
AWS_S3_BUCKET_NAME=

# Paystack
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_WEBHOOK_SECRET=

# PDF Generation API
PDF_API_URL=
PDF_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
NODE_ENV=
```

### 8.4 CI/CD Pipeline
- GitHub Actions / Vercel CI
- Automated testing on PR
- Automated deployment on merge to main
- Database migrations
- Environment promotion workflow

---

## 9. Post-Launch Requirements

### 9.1 Monitoring
- Error tracking setup
- Performance monitoring
- User analytics
- Conversion tracking

### 9.2 Maintenance
- Regular dependency updates
- Security patches
- Database backups
- Log rotation

### 9.3 Support
- Help documentation
- FAQ section
- Email support
- In-app chat support (Pro users)

### 9.4 Future Enhancements
- Cover letter generation
- LinkedIn profile optimization
- Interview preparation tips
- Industry-specific templates
- Multi-language support
- Team/enterprise plans
- API for third-party integrations
- Browser extension
- Mobile app

---

## 10. Success Metrics

### 10.1 Business Metrics
- User registrations per month
- Free to Pro conversion rate (target: 5%)
- Monthly recurring revenue (MRR)
- Customer lifetime value (CLV)
- Churn rate (target: < 5%)

### 10.2 Product Metrics
- CV upload success rate (target: > 95%)
- Average score improvement after boost
- Time to first CV score (target: < 5 minutes)
- Feature adoption rates
- User engagement (DAU/MAU)

### 10.3 Technical Metrics
- API uptime (target: 99.9%)
- Average response time
- Error rate (target: < 1%)
- Page load time
- Core Web Vitals scores

---

## 11. Risks & Mitigations

### 11.1 Technical Risks
- **OpenAI API rate limits**: Implement queuing system, cache common requests
- **PDF generation failures**: Multiple fallback services, error recovery
- **File parsing errors**: Comprehensive validation, user feedback, manual override

### 11.2 Business Risks
- **Low conversion rate**: A/B testing, feature trials, compelling value proposition
- **High churn**: User surveys, feature requests, customer success outreach
- **Payment fraud**: Paystack fraud detection, usage monitoring, account verification

### 11.3 Security Risks
- **Data breaches**: Regular security audits, penetration testing, encryption
- **API key exposure**: Environment variable management, key rotation
- **File upload vulnerabilities**: Strict validation, virus scanning, sandboxing

---

## 12. Glossary

- **ATS**: Applicant Tracking System - software used by employers to filter resumes
- **CV**: Curriculum Vitae - document outlining work experience, education, and skills
- **Boost**: Process of improving CV based on AI recommendations
- **Gap**: Missing element in CV compared to job requirements
- **Score**: Percentage match between CV and job description
- **LaTeX**: Document preparation system used for high-quality PDF generation
- **DynamoDB**: NoSQL database service by AWS
- **Supabase**: Open-source Firebase alternative for authentication and database

---

## 13. Appendices

### Appendix A: LaTeX Template Example Structure
```latex
\documentclass[11pt,a4paper]{article}
\usepackage{geometry}
\usepackage{enumitem}
\usepackage{hyperref}

\begin{document}

% Personal Info Section
\begin{center}
{\LARGE \textbf{{{FULL_NAME}}}}\\
{{EMAIL}} | {{PHONE}} | {{LOCATION}}\\
{{LINKEDIN}} | {{PORTFOLIO}}
\end{center}

% Professional Summary
\section*{Professional Summary}
{{PROFESSIONAL_SUMMARY}}

% Work Experience
\section*{Work Experience}
{{WORK_EXPERIENCE_LOOP}}

% Education
\section*{Education}
{{EDUCATION_LOOP}}

% Skills
\section*{Skills}
{{SKILLS_SECTION}}

\end{document}
```

### Appendix B: Sample API Error Responses
```json
{
  "error": {
    "code": "CV_PARSE_FAILED",
    "message": "Unable to parse CV content",
    "details": "File may be corrupted or in unsupported format",
    "timestamp": "2026-03-07T10:30:00Z"
  }
}
```

### Appendix C: Webhook Event Examples
```json
{
  "event": "subscription.create",
  "data": {
    "subscription_code": "SUB_xxxxx",
    "email_token": "xxxxx",
    "customer": {
      "email": "user@example.com"
    },
    "plan": {
      "name": "Pro Plan",
      "amount": 900
    }
  }
}
```

---

**Document Version:** 1.0
**Last Updated:** 2026-03-07
**Author:** Requirements Specification
**Status:** Draft for Review
