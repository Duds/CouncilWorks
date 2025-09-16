# Aegrid Release Automation Quick Start Guide

## Prerequisites

- Node.js 20+ and pnpm/npm
- Git with GitHub access
- Azure CLI (for deployments)
- GitHub CLI (optional, for PR creation)

## Initial Setup

### 1. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

```bash
# Azure Container Registry
ACR_NAME=your-acr-name
ACR_USERNAME=your-acr-username
ACR_PASSWORD=your-acr-password

# Azure Container Apps
CONTAINER_APP_NAME_STAGING=aegrid-staging
CONTAINER_APP_NAME_PRODUCTION=aegrid-production
RESOURCE_GROUP=your-resource-group

# Database URLs
STAGING_DATABASE_URL=postgresql://user:password@staging-db:5432/aegrid_staging
PRODUCTION_DATABASE_URL=postgresql://user:password@production-db:5432/aegrid_production

# Authentication
STAGING_NEXTAUTH_SECRET=your-staging-secret-32-chars-min
PRODUCTION_NEXTAUTH_SECRET=your-production-secret-32-chars-min

# URLs
STAGING_URL=https://aegrid-staging.azurecontainerapps.io
PRODUCTION_URL=https://aegrid.azurecontainerapps.io

# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook
```

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

1. Go to your GitHub repository
2. Click **Projects** → **New project**
3. Add columns: Backlog → To Do → In Progress → Review → Staging → Production → Done
4. Configure automation rules (see `config/github-projects-setup.md`)

## Daily Workflow

### Feature Development

1. **Create feature branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/issue-123-feature-name
   ```

2. **Develop and test**
   ```bash
   # Make changes
   git add .
   git commit -m "feat: add new feature"
   
   # Run tests
   pnpm test
   
   # Push branch
   git push -u origin feature/issue-123-feature-name
   ```

3. **Create pull request**
   - Use PR template
   - Link to issue
   - Request review

4. **Merge to develop**
   - Review approved
   - CI checks pass
   - Merge to develop
   - Automatic staging deployment

### Release Process

1. **Prepare release**
   ```bash
   ./scripts/release.sh release minor
   ```

2. **Review and merge**
   - Check generated PR
   - Review changelog
   - Merge to main
   - Automatic production deployment

### Hotfix Process

1. **Create hotfix**
   ```bash
   ./scripts/release.sh hotfix patch
   ```

2. **Deploy hotfix**
   - Merge to main
   - Deploy to production
   - Merge back to develop

## Environment Management

### Local Development
```bash
# Setup local environment
./scripts/environment.sh setup-local

# Check status
./scripts/environment.sh status

# Start development
pnpm dev
```

### Staging Deployment
```bash
# Deploy to staging
./scripts/environment.sh deploy staging

# Check deployment status
# Visit: https://aegrid-staging.azurecontainerapps.io
```

### Production Deployment
```bash
# Deploy to production
./scripts/environment.sh deploy production

# Check deployment status
# Visit: https://aegrid.azurecontainerapps.io
```

## Monitoring and Troubleshooting

### Check Status
```bash
# Check release status
./scripts/release.sh status

# Check environment status
./scripts/environment.sh status

# Check git status
git status
```

### Common Commands
```bash
# Run tests
pnpm test

# Build application
pnpm build

# Check database connection
psql $DATABASE_URL -c "SELECT version();"

# Check Azure CLI
az login
az acr login --name $ACR_NAME
```

### Troubleshooting

#### Deployment Issues
1. Check GitHub Actions logs
2. Verify Azure credentials
3. Check environment variables
4. Verify service health

#### Database Issues
1. Check connection strings
2. Verify database server status
3. Check network connectivity
4. Review migration logs

#### Authentication Issues
1. Verify NEXTAUTH_URL
2. Check NEXTAUTH_SECRET
3. Verify OAuth configuration
4. Check session handling

## Best Practices

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

## Getting Help

1. **Check documentation** first
2. **Review GitHub Issues** for known problems
3. **Check GitHub Actions** logs for errors
4. **Contact team** for support
5. **Create issue** for bugs or feature requests

## Quick Reference

### Scripts
```bash
# Release management
./scripts/release.sh release minor    # Create minor release
./scripts/release.sh hotfix patch    # Create hotfix
./scripts/release.sh status          # Check status

# Environment management
./scripts/environment.sh setup-local  # Setup local environment
./scripts/environment.sh deploy staging  # Deploy to staging
./scripts/environment.sh status      # Check environment status
```

### GitHub Actions
- **CI**: Runs on every push/PR
- **Staging**: Deploys develop branch to staging
- **Production**: Deploys main branch to production
- **Release**: Manages version bumping and releases
- **Project**: Updates GitHub Projects automatically

### Project Columns
- **Backlog**: Low priority items
- **To Do**: Ready to work on
- **In Progress**: Currently being worked on
- **Review**: Ready for code review
- **Staging**: Deployed to staging
- **Production**: Deployed to production
- **Done**: Completed items
