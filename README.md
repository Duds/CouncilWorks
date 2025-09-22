# Aegrid - Asset Lifecycle Intelligence Platform

**Resilient asset management for critical infrastructure**

Aegrid transforms traditional asset management from reactive maintenance into proactive risk management through the application of The Aegrid Rules - a resilience-first philosophy that creates antifragile asset management systems.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker
- PostgreSQL (via Docker)

### Local Development Setup

```bash
# Clone and setup
git clone <repository-url>
cd CouncilWorks

# Environment setup
cp .env.example .env
# Edit .env with your configuration

# Start database
docker compose up -d db

# Install dependencies and setup database
npm ci
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed

# Start development server
npm run dev
```

### Health Check

- **Application**: http://localhost:3000/api/health
- **Database**: Connection verified via Prisma

### Testing

```bash
npm test              # Run test suite
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🎯 Core Philosophy: The Aegrid Rules

Aegrid is built on four foundational rules that ensure resilient asset management:

1. **Every Asset Has a Purpose** - Connect assets to critical control systems
2. **Risk Sets the Rhythm** - Let consequence × likelihood drive maintenance decisions
3. **Respond to the Real World** - Adapt resources when conditions change
4. **Operate with Margin** - Build practical slack for resilience

[Read the complete Aegrid Rules →](docs/core/aegrid-rules.md)

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL + PostGIS (relational), Azure Cosmos DB Gremlin API (graph)
- **Authentication**: NextAuth.js with role-based access control
- **Deployment**: Azure Container Apps with GitHub Actions CI/CD

### Hybrid Database Architecture

- **PostgreSQL**: Transactional data, asset records, user management
- **Cosmos DB Gremlin**: Graph relationships, asset hierarchies, risk modeling
- **PostGIS**: Spatial asset data and geographic queries

## 📁 Project Structure

```
├── app/                    # Next.js App Router
├── components/             # React components
├── lib/                    # Utility libraries
├── prisma/                 # Database schema and migrations
├── docs/                   # Documentation
├── scripts/                # Utility scripts
└── public/                 # Static assets
```

### Path Aliases

- `@/components/*` → `components/*`
- `@/lib/*` → `lib/*`
- `@/hooks/*` → `hooks/*`
- `@/utils/*` → `utils/*`

## 🔐 Security & Authentication

- **NextAuth.js**: Secure authentication with multiple providers
- **Role-Based Access Control**: ADMIN, MANAGER, SUPERVISOR, CREW, EXEC, CITIZEN roles
- **Multi-Factor Authentication**: Optional MFA for enhanced security
- **Session Management**: Secure session handling with proper expiration

## 🗂️ Key Features

### Asset Management

- **Asset Register**: Comprehensive asset database with spatial capabilities
- **Critical Control Mapping**: Connect assets to the critical controls they enable
- **Risk-Based Maintenance**: Maintenance schedules driven by risk assessment
- **Spatial Analysis**: PostGIS integration for geographic asset management

### User Roles & Permissions

- **ADMIN**: Full system access and user management
- **MANAGER**: Asset management and planning capabilities
- **SUPERVISOR**: Operational oversight and crew coordination
- **CREW**: Field execution and asset inspection
- **EXEC**: Strategic oversight and reporting
- **CITIZEN**: Public asset information and issue reporting

### Resilience Features

- **Signal Detection**: Real-time monitoring of asset condition and performance
- **Adaptive Scheduling**: Dynamic maintenance schedules that respond to conditions
- **Margin Management**: Built-in capacity for handling unexpected demands
- **Critical Asset Protection**: Enhanced monitoring and response for high-consequence assets

## 📚 Documentation

- **[The Aegrid Rules](docs/core/aegrid-rules.md)** - Core principles and philosophy
- **[Architecture Documentation](docs/architecture/)** - System design and technical details
- **[Development Guide](docs/development/)** - Development standards and practices
- **[Security Documentation](docs/security/)** - Security implementation and best practices

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production

- **Staging**: Automatic deployment from `develop` branch
- **Production**: Manual deployment from `main` branch
- **CI/CD**: GitHub Actions with automated testing and security scanning

[See Release Automation Guide →](docs/development/release-automation.md)

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

- **Documentation**: Check the [docs](docs/) directory
- **Issues**: Report bugs via GitHub Issues
- **Contact**: hello@aegrid.com

---

**Built with resilience in mind** - Every decision, every feature, every interaction follows The Aegrid Rules to ensure genuine value delivery.
