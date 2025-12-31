# Gen AI Exchange

A comprehensive career development platform that provides personalized insights, roadmaps, and tools for professional growth. Built with Node.js, Express, and Firebase, featuring AI-powered recommendations and LaTeX resume compilation.

## Features

### 🎯 Career Analytics & Insights

- **Skills Assessment**: Comprehensive skill evaluation and progress tracking
- **Career Scoring**: Dynamic career score calculation based on skills, experience, and achievements
- **Personalized Dashboard**: Real-time analytics with progress visualization
- **Industry Trends**: Integration with news APIs and Google Trends for market insights

### 📊 Data Intelligence

- **BigQuery Integration**: Advanced analytics and data processing
- **Vertex AI**: AI-powered career recommendations and insights
- **News Analysis**: Real-time industry news aggregation and analysis
- **Trend Monitoring**: Automated tracking of skill demand and market trends

### 🗺️ Roadmap Management

- **Personalized Roadmaps**: Custom learning paths based on career goals
- **Milestone Tracking**: Progress monitoring with deadline management
- **Skill Progression**: Detailed skill development tracking
- **Achievement System**: Gamified learning with progress rewards

### 📄 Resume Management

- **PDF Upload & Storage**: Secure resume storage with Cloudinary integration
- **LaTeX Compilation**: Professional resume generation using LaTeX/Tectonic
- **Real-time Preview**: Live LaTeX editing with instant PDF preview
- **Version Control**: Resume history and version management

### 🔐 Authentication & Security

- **PASETO Tokens**: Secure authentication with public key cryptography
- **Role-based Access**: Granular permission system
- **Email Integration**: Automated notifications with Nodemailer
- **Data Validation**: Comprehensive input validation with Zod schemas

## Tech Stack

### Backend

- **Runtime**: Node.js 22+ (CommonJS)
- **Framework**: Express.js 5.x
- **Database**: Firebase Firestore
- **Authentication**: PASETO V4 with RSA keys
- **Validation**: Zod schemas
- **File Storage**: Cloudinary
- **Document Processing**: Tectonic LaTeX engine

### Cloud Services

- **Google Cloud Platform**:
  - BigQuery for analytics
  - Vertex AI for machine learning
  - Firebase for database and auth
- **Third-party APIs**:
  - News API for industry insights
  - Google Trends API for market analysis

### Development

- **Package Manager**: npm
- **Development Server**: Nodemon
- **Containerization**: Docker with Debian bookworm-slim
- **Deployment**: Render (Docker-based)

## Quick Start

### Prerequisites

- Node.js 22+
- npm or yarn
- Docker (optional, for containerized deployment)
- Firebase project with Firestore enabled
- Google Cloud Project with BigQuery and Vertex AI APIs enabled

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Raamprathap/Gen_AI_Exchange.git
cd Gen_AI_Exchange
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**
   Create a `.env` file in the root directory:

```env
PORT=3002
NODE_ENV=development

# Firebase Configuration
PROJECT_ID=your-firebase-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json

# API Keys
NEWS_API_KEY=your-news-api-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# LaTeX Configuration (optional)
TECTONIC_PATH=/usr/bin/tectonic
LATEX_TIMEOUT_MS=15000
LATEX_WARMUP=1
```

4. **Generate RSA Keys**

```bash
# Visit http://localhost:3002/generate-keys after starting the server
# This will generate the required PASETO signing keys
```

5. **Start Development Server**

```bash
npm run dev
```

The server will start on `http://localhost:3002`

## API Documentation

### Authentication

All protected routes require a valid PASETO token in the Authorization header:

```
Authorization: Bearer <your-paseto-token>
```

### Core Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

#### Profile Management

- `GET /api/profile/user` - Get user profile
- `PATCH /api/profile/user` - Update user profile
- `GET /api/profile/dashboard` - Get dashboard analytics
- `POST /api/profile/resume` - Upload resume (PDF only)

#### Roadmap Management

- `GET /api/roadmaps` - List user roadmaps
- `POST /api/roadmaps` - Create new roadmap
- `GET /api/roadmaps/:id` - Get specific roadmap
- `PATCH /api/roadmaps/:id` - Update roadmap
- `DELETE /api/roadmaps/:id` - Delete roadmap

#### LaTeX Compilation

- `POST /api/compile` - Compile LaTeX to PDF
  - Content-Type: `text/plain`
  - Body: Raw LaTeX source
  - Returns: PDF binary or error details

#### Insights & Analytics

- `GET /api/insights` - Get career insights
- `POST /api/ingest/news` - Ingest news data
- `GET /api/setup` - Setup analytics pipeline

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and run**

```bash
docker build -t gen-ai-exchange .
docker run -p 3002:3002 --env-file .env gen-ai-exchange
```

### Deploy to Render

1. **Create a new Web Service on Render**

   - Environment: Docker
   - Build Command: (automatic from Dockerfile)
   - Start Command: (automatic from Dockerfile)

2. **Set Environment Variables**

   - Add all variables from your `.env` file
   - Use Secret Files for service account JSON
   - Set `TECTONIC_PATH=/usr/bin/tectonic`

3. **Health Check**
   - Path: `/health`
   - The service automatically includes health monitoring

## Project Structure

```
src/
├── config/
│   ├── connectDB.js          # Firebase Firestore connection
│   └── cloudinary.js         # Cloudinary configuration
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── profile.controller.js # User profile management
│   ├── roadmap.controller.js # Roadmap CRUD operations
│   └── compile.controller.js # LaTeX compilation
├── middlewares/
│   ├── auth/
│   │   ├── tokenCreation.js  # PASETO token generation
│   │   └── tokenValidation.js # Token verification
│   ├── mail/
│   │   ├── mailer.js         # Email service
│   │   └── mail_template.js  # Email templates
│   └── rsa/
│       ├── key.js            # RSA key generation
│       └── *.pem             # Public/private key files
├── routes/
│   ├── auth.route.js         # Authentication routes
│   ├── profile.route.js      # Profile routes
│   ├── roadmap.route.js      # Roadmap routes
│   ├── compile.route.js      # LaTeX compilation routes
│   └── insights.route.js     # Analytics routes
├── Schema/
│   ├── userSchema.js         # User data validation
│   └── roadmapSchema.js      # Roadmap validation
├── utils/
│   └── latexWarmup.js        # LaTeX engine initialization
└── index.js                  # Application entry point
```

## Key Features in Detail

### LaTeX Resume Compilation

The platform includes a full LaTeX-to-PDF compilation service using Tectonic:

- **Real-time Compilation**: Convert LaTeX source to PDF instantly
- **Error Handling**: Detailed error messages for debugging
- **Template Support**: Automatic document wrapping for fragments
- **Security**: Sandboxed compilation with timeouts and cleanup
- **Performance**: Warm-up optimization for fast first-time compilation

### Career Analytics

Advanced analytics powered by Google Cloud:

- **Skill Trending**: Track industry skill demands using BigQuery
- **Market Analysis**: Real-time job market insights
- **Personalized Recommendations**: AI-powered career suggestions
- **Progress Tracking**: Detailed skill development metrics

### Roadmap System

Comprehensive career planning tools:

- **Custom Roadmaps**: User-created learning paths
- **Milestone Management**: Track progress with deadlines
- **Phase Organization**: Structured learning progression
- **Achievement Tracking**: Gamified skill development

## Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run build` - No-op (Node.js project)

### Code Style

- **Format**: CommonJS modules
- **Linting**: Follow standard JavaScript practices
- **Error Handling**: Comprehensive try-catch blocks
- **Logging**: Structured logging for debugging
- **Validation**: Zod schemas for all inputs

### Testing

```bash
# Health check
curl http://localhost:3002/health

# LaTeX compilation test
curl -X POST -H "Content-Type: text/plain" \
  --data-binary "Hello from LaTeX" \
  http://localhost:3002/api/compile -o test.pdf
```

## Environment Variables Reference

| Variable                         | Required | Description                                       |
| -------------------------------- | -------- | ------------------------------------------------- |
| `PORT`                           | No       | Server port (default: 3002)                       |
| `NODE_ENV`                       | No       | Environment mode (development/production)         |
| `PROJECT_ID`                     | Yes      | Firebase project ID                               |
| `GOOGLE_APPLICATION_CREDENTIALS` | Yes      | Path to Firebase service account JSON             |
| `NEWS_API_KEY`                   | Yes      | News API access key                               |
| `CLOUDINARY_CLOUD_NAME`          | Yes      | Cloudinary cloud name                             |
| `CLOUDINARY_API_KEY`             | Yes      | Cloudinary API key                                |
| `CLOUDINARY_API_SECRET`          | Yes      | Cloudinary API secret                             |
| `TECTONIC_PATH`                  | No       | Path to Tectonic binary (auto-detected in Docker) |
| `LATEX_TIMEOUT_MS`               | No       | LaTeX compilation timeout (default: 15000)        |
| `LATEX_WARMUP`                   | No       | Enable LaTeX warm-up (default: 1)                 |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Health Check**: Monitor service status at `/health` endpoint

## Roadmap

- [ ] Enhanced AI recommendations with Vertex AI
- [ ] Real-time collaboration on roadmaps
- [ ] Advanced analytics dashboard
- [ ] Mobile API optimization
- [ ] Integration with more career platforms
- [ ] Enhanced LaTeX template library

---

Built with ❤️ for career development and professional growth.
