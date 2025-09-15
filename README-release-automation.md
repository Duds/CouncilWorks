# Aegrid Release Automation System

## 🚀 Overview

The Aegrid Release Automation System provides comprehensive CI/CD capabilities integrated with GitHub, Azure Container Apps, and local development environments. This system automates the entire release lifecycle from development to production deployment.

## 📋 System Components

### 1. GitHub Actions Workflows
- **Continuous Integration** (`ci.yml`) - Linting, testing, building, security scanning
- **Staging Deployment** (`deploy-staging.yml`) - Automated staging deployments
- **Production Deployment** (`deploy-production.yml`) - Production releases with safety checks
- **Release Management** (`release-management.yml`) - Version bumping and release preparation
- **Project Integration** (`project-integration.yml`) - Automatic GitHub Projects updates

### 2. Local Release Management Scripts
- **Release Script** (`scripts/release.sh`) - Version management and release creation
- **Environment Script** (`scripts/environment.sh`) - Environment configuration and deployment

### 3. Environment Configuration
- **Local Development** - Development environment with local database
- **Staging** - Pre-production testing environment
- **Production** - Live production environment

### 4. GitHub Projects Integration
- **Automated Tracking** - Issues, PRs, and deployments tracked automatically
- **Workflow Management** - Visual representation of development progress
- **Release Planning** - Project-based release management

## 🔄 Workflow Process

### Feature Development
1. Create feature branch from `develop`
2. Develop and test locally
3. Create pull request with proper templates
4. Code review and merge to `develop`
5. Automatic staging deployment
6. Testing and validation in staging

### Release Process
1. Run release script: `./scripts/release.sh release minor`
2. Review generated changes and PR
3. Merge release PR to `main`
4. Automatic production deployment
5. GitHub release creation
6. Project status updates

### Hotfix Process
1. Run hotfix script: `./scripts/release.sh hotfix patch`
2. Deploy directly to production
3. Merge back to `develop`
4. Update project tracking

## 🛠️ Setup Instructions

### 1. Configure GitHub Secrets
Add required secrets to your GitHub repository (see `config/github-secrets.md` for complete list):
- Azure Container Registry credentials
- Database connection strings
- Authentication secrets
- Notification webhooks

### 2. Setup Local Environment
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Setup local development environment
./scripts/environment.sh setup-local

# Start development server
pnpm dev
```

### 3. Configure GitHub Project
1. Create new project in GitHub
2. Add columns: Backlog → To Do → In Progress → Review → Staging → Production → Done
3. Configure automation rules (see `config/github-projects-setup.md`)

## 📚 Documentation

- **[Release Automation Guide](development/release-automation.md)** - Complete system documentation
- **[Quick Start Guide](development/release-quickstart.md)** - Getting started quickly
- **[GitHub Secrets Configuration](config/github-secrets.md)** - Required secrets setup
- **[GitHub Projects Setup](config/github-projects-setup.md)** - Project configuration
- **[Environment Template](config/environment-template.md)** - Environment variables reference

## 🎯 Key Features

### Automated CI/CD
- **Continuous Integration** - Automated testing and building
- **Staging Deployment** - Automatic deployment from develop branch
- **Production Deployment** - Safe production releases with approval
- **Security Scanning** - Automated vulnerability scanning

### Release Management
- **Version Bumping** - Automatic version management
- **Changelog Generation** - Automated changelog updates
- **Release Notes** - Comprehensive release documentation
- **GitHub Releases** - Automatic release creation

### Project Integration
- **Issue Tracking** - Automatic project column updates
- **PR Management** - Pull request workflow tracking
- **Deployment Tracking** - Environment deployment status
- **Release Planning** - Project-based release management

### Environment Management
- **Local Development** - Easy local environment setup
- **Staging Environment** - Pre-production testing
- **Production Environment** - Live production deployment
- **Configuration Management** - Environment-specific settings

## 🔧 Usage Examples

### Creating a Release
```bash
# Create minor release
./scripts/release.sh release minor

# Create hotfix
./scripts/release.sh hotfix patch

# Check status
./scripts/release.sh status
```

### Environment Management
```bash
# Setup local environment
./scripts/environment.sh setup-local

# Deploy to staging
./scripts/environment.sh deploy staging

# Check environment status
./scripts/environment.sh status
```

### Daily Development
```bash
# Create feature branch
git checkout develop
git checkout -b feature/issue-123-feature-name

# Develop and test
pnpm test
pnpm build

# Create PR and merge
# Automatic staging deployment follows
```

## 📊 Monitoring and Alerts

### Deployment Monitoring
- **GitHub Actions** - Workflow status and logs
- **Azure Container Apps** - Application health and metrics
- **Application Insights** - Performance and error tracking
- **Slack Notifications** - Deployment status updates

### Health Checks
- **Application Health** - `/api/health` endpoint
- **Database Connectivity** - Connection verification
- **External Services** - Service availability
- **Performance Metrics** - Response times and throughput

## 🚨 Troubleshooting

### Common Issues
1. **Deployment Failures** - Check GitHub Actions logs, verify Azure credentials
2. **Database Issues** - Check connection strings, verify server status
3. **Authentication Issues** - Verify NEXTAUTH_URL and secrets
4. **Project Updates** - Check automation rules and permissions

### Debug Commands
```bash
# Check status
./scripts/release.sh status
./scripts/environment.sh status

# Test database
psql $DATABASE_URL -c "SELECT version();"

# Check Azure CLI
az login
az acr login --name $ACR_NAME
```

## 🔒 Security Features

### Authentication & Authorization
- **NextAuth.js Integration** - Secure authentication
- **Role-Based Access Control** - User permission management
- **Session Security** - Secure session handling
- **Input Validation** - Zod schema validation

### Security Scanning
- **Trivy Vulnerability Scanner** - Automated security scanning
- **Dependency Auditing** - Package vulnerability detection
- **Code Quality Checks** - ESLint and TypeScript validation
- **Secret Management** - Secure secret handling

## 📈 Best Practices

### Development
- Use feature branches for all development
- Write comprehensive tests for all changes
- Update documentation with changes
- Follow coding standards and conventions
- Use semantic commit messages

### Release Management
- Plan releases in advance
- Test thoroughly before release
- Document breaking changes
- Communicate releases to stakeholders
- Monitor post-deployment metrics

### Security
- Never commit secrets to code
- Use strong, unique secrets for each environment
- Rotate secrets regularly
- Limit access to production secrets
- Monitor access and usage

## 🎉 Getting Started

1. **Review Documentation** - Read the complete guides
2. **Configure Secrets** - Set up GitHub secrets
3. **Setup Local Environment** - Run setup scripts
4. **Configure GitHub Project** - Set up project tracking
5. **Start Developing** - Create your first feature branch

## 📞 Support

- **Documentation** - Check guides and references
- **GitHub Issues** - Report bugs and request features
- **Team Support** - Contact development team
- **Community** - Join project discussions

---

*This release automation system provides a robust, scalable solution for managing Aegrid releases from development to production. Follow the documentation and best practices for optimal results.*
