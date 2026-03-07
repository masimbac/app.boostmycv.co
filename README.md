# BoostMyCV

AI-powered resume optimization platform that helps job seekers boost their CVs to match job descriptions.

## Overview

BoostMyCV is a comprehensive resume management platform that leverages AI to analyze, score, and improve resumes based on job descriptions. The platform provides intelligent recommendations and automated improvements to help users increase their job application success rates.

## Key Features

- **CV Upload & Parsing** - Support for PDF and Word documents with AI-powered parsing
- **Intelligent Scoring** - Match CVs against job descriptions with detailed gap analysis
- **AI-Powered Recommendations** - Get specific, actionable suggestions for improvement
- **Auto-Boost** - Automatically apply recommendations to enhance your CV
- **Professional Templates** - Export to PDF using professional LaTeX templates
- **Multiple CVs** - Manage and optimize multiple versions of your resume
- **Social Authentication** - Sign in with Google, LinkedIn, or Facebook

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: AWS DynamoDB
- **Storage**: AWS S3 / Supabase Storage
- **Authentication**: Supabase Auth
- **AI**: OpenAI ChatGPT API
- **Payments**: Paystack
- **PDF Generation**: LaTeX with external API

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- AWS Account (for DynamoDB and S3)
- Supabase Account
- OpenAI API Key
- Paystack Account
- PDF Generation API access

## Getting Started

### 1. Clone and Install

```bash
cd /path/to/project
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DYNAMODB_TABLE_PREFIX=boostmycv
AWS_S3_BUCKET_NAME=boostmycv-uploads

# Paystack
PAYSTACK_SECRET_KEY=your_paystack_secret
PAYSTACK_PUBLIC_KEY=your_paystack_public
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret

# PDF Generation API
PDF_API_URL=your_pdf_api_url
PDF_API_KEY=your_pdf_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Setup

Create the required DynamoDB tables:

```bash
npm run setup:db
```

Or manually create tables as specified in `REQUIREMENTS.md` Section 4.2.3.

### 4. Configure Social Authentication

Set up OAuth providers in your Supabase dashboard:
- Google OAuth
- LinkedIn OAuth
- Facebook Login

Add the callback URLs:
- Development: `http://localhost:3000/api/auth/callback`
- Production: `https://your-domain.com/api/auth/callback`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
.
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Dashboard pages
│   ├── api/                 # API routes
│   │   └── v1/             # API v1 endpoints
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── cv/                 # CV-related components
│   ├── scoring/            # Scoring components
│   └── layout/             # Layout components
├── lib/                     # Utility libraries
│   ├── db/                 # Database utilities
│   ├── ai/                 # OpenAI integration
│   ├── auth/               # Auth utilities
│   ├── pdf/                # PDF generation
│   └── utils.ts            # Helper functions
├── types/                   # TypeScript types
├── public/                  # Static assets
├── templates/               # LaTeX templates
├── REQUIREMENTS.md          # Detailed requirements
└── README.md               # This file
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:coverage # Generate coverage report

# Database
npm run setup:db     # Setup DynamoDB tables
npm run migrate      # Run migrations

# Utilities
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
```

## API Documentation

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/social-login` - Social authentication

### CV Management
- `POST /api/v1/cvs/upload` - Upload and parse CV
- `GET /api/v1/cvs` - List user's CVs
- `GET /api/v1/cvs/:id` - Get CV details
- `PUT /api/v1/cvs/:id` - Update CV
- `DELETE /api/v1/cvs/:id` - Delete CV

### Scoring
- `POST /api/v1/scores/analyze` - Score CV against job description
- `GET /api/v1/scores/history` - Get scoring history

### Boost
- `POST /api/v1/boost/auto` - Auto-boost CV with AI
- `POST /api/v1/boost/apply` - Apply recommendations

### Export
- `POST /api/v1/export/pdf` - Export CV to PDF
- `POST /api/v1/export/docx` - Export CV to Word

See `REQUIREMENTS.md` for complete API specifications.

## Subscription Tiers

### Free Tier
- 2 CVs maximum
- 5 scores per month
- Manual editing only
- Standard support

### Pro Tier ($9/month)
- Unlimited CVs
- Unlimited scoring
- AI auto-boost
- Multiple templates
- Priority support
- Version history

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests
4. Run `npm run lint` and `npm run type-check`
5. Submit a pull request
6. Wait for review and CI checks

## Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Generate coverage
npm run test:coverage
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## Environment Variables

See `.env.example` for all required environment variables. Never commit `.env.local` to version control.

## Security

- All API routes require authentication (except public endpoints)
- File uploads are validated and scanned
- Sensitive data is encrypted at rest
- Rate limiting is enforced on all endpoints
- CORS is properly configured

Report security vulnerabilities to: security@boostmycv.co

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- Documentation: [REQUIREMENTS.md](./REQUIREMENTS.md)
- Issues: [GitHub Issues](https://github.com/yourusername/boostmycv/issues)
- Email: support@boostmycv.co

## Roadmap

- [ ] Cover letter generation
- [ ] LinkedIn profile optimization
- [ ] Interview preparation tips
- [ ] Industry-specific templates
- [ ] Multi-language support
- [ ] Team/enterprise plans
- [ ] Browser extension
- [ ] Mobile app

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [Next.js](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)
- [OpenAI](https://openai.com)
- [Paystack](https://paystack.com)

---

Built with ❤️ by the BoostMyCV Team
