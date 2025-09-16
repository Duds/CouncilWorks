# Aegrid Release Automation System

## Overview

The Aegrid Release Automation System provides comprehensive CI/CD capabilities integrated with GitHub, Azure Container Apps, and local development environments. This system automates the entire release lifecycle from development to production deployment.

## Architecture

### Branch Strategy

```
main (production) ← develop (staging) ← feature branches
```

- **main**: Production-ready code, stable releases
- **develop**: Integration branch for ongoing development
- **feature/***: Individual feature development branches

### Environment Flow

```
Local Development → Staging → Production
```

- **Local**: Development environment with local database
- **Staging**: Pre-production testing environment (Azure Container Apps)
- **Production**: Live production environment (Azure Container Apps)

## Components

### 1. GitHub Actions Workflows

#### Continuous Integration (`ci.yml`)
- **Triggers**: Push to main/develop, Pull requests
- **Jobs**:
  - Lint and Type Check
  - Test Suite (Unit, Integration, E2E)
  - Build Application
  - Security Scan (Trivy)
- **Artifacts**: Build files, test coverage reports

#### Staging Deployment (`deploy-staging.yml`)
- **Triggers**: Push to develop, Manual dispatch
- **Environment**: Staging
- **Process**:
  - Build application
  - Deploy to Azure Container Apps
  - Run health checks
  - Update GitHub Projects
  - Send notifications

#### Production Deployment (`deploy-production.yml`)
- **Triggers**: Push to main, Manual dispatch
- **Environment**: Production
- **Process**:
  - Pre-deployment checks
  - Full test suite
  - Build application
  - Create release tag
  - Deploy to Azure Container Apps
  - Create GitHub release
  - Update GitHub Projects
  - Send notifications

#### Release Management (`release-management.yml`)
- **Triggers**: Manual dispatch
- **Process**:
  - Version bumping
  - Changelog generation
  - Release preparation
  - PR creation

#### Project Integration (`project-integration.yml`)
- **Triggers**: Issues, Pull requests, Push events
- **Process**:
  - Automatic project column updates
  - Issue/PR tracking
  - Deployment tracking

### 2. Local Release Management Scripts

#### Release Script (`scripts/release.sh`)
```bash
# Create a new release
./scripts/release.sh release minor

# Create a hotfix
./scripts/release.sh hotfix patch

# Check status
./scripts/release.sh status
```

**Features**:
- Version bumping (major, minor, patch)
- Changelog generation
- Release branch creation
- PR creation
- Test execution
- Build verification

#### Environment Script (`scripts/environment.sh`)
```bash
# Setup local environment
./scripts/environment.sh setup-local

# Generate environment config
./scripts/environment.sh generate staging

# Deploy to environment
./scripts/environment.sh deploy staging
```

**Features**:
- Environment configuration generation
- Local development setup
- Configuration validation
- Deployment triggering

### 3. Environment Configuration

#### Local Development
- Local PostgreSQL database
- Debug logging enabled
- Mock external services
- Hot reloading enabled

#### Staging Environment
- Production-like configuration
- Real external services
- Limited debug information
- Automated testing

#### Production Environment
- Optimised for performance
- Minimal logging
- Security hardening
- Monitoring enabled

### 4. GitHub Projects Integration

#### Project Columns
1. **Backlog** - Low priority items
2. **To Do** - Ready to work on
3. **In Progress** - Currently being worked on
4. **Review** - Ready for code review
5. **Staging** - Deployed to staging
6. **Production** - Deployed to production
7. **Done** - Completed items

#### Automation Rules
- Issues move based on labels
- PRs track through workflow
- Deployments update project status
- Releases tracked automatically

## Workflow Processes

### Feature Development

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/issue-123-feature-name
   ```

2. **Development**
   - Write code
   - Add tests
   - Update documentation
   - Commit changes

3. **Create Pull Request**
   - Use PR template
   - Link to issue
   - Request review
   - Run CI checks

4. **Code Review**
   - Review code
   - Run tests
   - Approve changes
   - Merge to develop

5. **Staging Deployment**
   - Automatic deployment to staging
   - Run integration tests
   - Update project status
   - Send notifications

### Release Process

1. **Prepare Release**
   ```bash
   ./scripts/release.sh release minor
   ```

2. **Review Release**
   - Check generated changelog
   - Verify version bump
   - Review PR

3. **Merge to Main**
   - Merge release PR
   - Trigger production deployment
   - Create GitHub release
   - Update project status

4. **Production Deployment**
   - Automatic deployment to production
   - Run health checks
   - Send notifications
   - Update monitoring

### Hotfix Process

1. **Create Hotfix**
   ```bash
   ./scripts/release.sh hotfix patch
   ```

2. **Deploy Hotfix**
   - Merge to main
   - Deploy to production
   - Merge back to develop

## Configuration

### Required GitHub Secrets

#### Azure Configuration
```
ACR_NAME=your-acr-name
ACR_USERNAME=your-acr-username
ACR_PASSWORD=your-acr-password
CONTAINER_APP_NAME_STAGING=aegrid-staging
CONTAINER_APP_NAME_PRODUCTION=aegrid-production
RESOURCE_GROUP=your-resource-group
```

#### Database Configuration
```
STAGING_DATABASE_URL=postgresql://user:password@staging-db:5432/aegrid_staging
PRODUCTION_DATABASE_URL=postgresql://user:password@production-db:5432/aegrid_production
```

#### Authentication
```
STAGING_NEXTAUTH_SECRET=your-staging-secret
PRODUCTION_NEXTAUTH_SECRET=your-production-secret
```

#### Notifications
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook
```

### Environment Variables

#### Local Development
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=local
DATABASE_URL=postgresql://aegrid:password@localhost:5432/aegrid_dev
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=local-development-secret
```

#### Staging
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=staging
DATABASE_URL=${STAGING_DATABASE_URL}
NEXTAUTH_URL=${STAGING_NEXTAUTH_URL}
NEXTAUTH_SECRET=${STAGING_NEXTAUTH_SECRET}
```

#### Production
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
DATABASE_URL=${PRODUCTION_DATABASE_URL}
NEXTAUTH_URL=${PRODUCTION_NEXTAUTH_URL}
NEXTAUTH_SECRET=${PRODUCTION_NEXTAUTH_SECRET}
```

## Usage Examples

### Creating a New Release

1. **Start Release Process**
   ```bash
   ./scripts/release.sh release minor
   ```

2. **Review Generated Changes**
   - Check version bump in package.json
   - Review changelog updates
   - Verify release notes

3. **Merge Release PR**
   - Review PR
   - Merge to main
   - Production deployment triggers automatically

### Setting Up Local Environment

1. **Initialize Local Environment**
   ```bash
   ./scripts/environment.sh setup-local
   ```

2. **Start Development Server**
   ```bash
   pnpm dev
   ```

3. **Verify Setup**
   - Check database connection
   - Verify authentication
   - Test API endpoints

### Deploying to Staging

1. **Deploy to Staging**
   ```bash
   ./scripts/environment.sh deploy staging
   ```

2. **Monitor Deployment**
   - Check GitHub Actions
   - Verify staging URL
   - Run smoke tests

### Managing Issues and PRs

1. **Create Issue**
   - Use issue templates
   - Add appropriate labels
   - Assign to project

2. **Create Pull Request**
   - Use PR template
   - Link to issue
   - Request review

3. **Track Progress**
   - Monitor project board
   - Update status
   - Communicate progress

## Monitoring and Alerting

### Deployment Monitoring

- **GitHub Actions**: Workflow status and logs
- **Azure Container Apps**: Application health and metrics
- **Application Insights**: Performance and error tracking
- **Slack Notifications**: Deployment status updates

### Health Checks

- **Application Health**: `/api/health` endpoint
- **Database Connectivity**: Connection verification
- **External Services**: Service availability
- **Performance Metrics**: Response times and throughput

## Troubleshooting

### Common Issues

#### Deployment Failures
1. **Check GitHub Actions logs**
2. **Verify Azure credentials**
3. **Check environment variables**
4. **Verify service health**

#### Database Issues
1. **Check connection strings**
2. **Verify database server status**
3. **Check network connectivity**
4. **Review migration logs**

#### Authentication Issues
1. **Verify NEXTAUTH_URL**
2. **Check NEXTAUTH_SECRET**
3. **Verify OAuth configuration**
4. **Check session handling**

### Debug Commands

```bash
# Check environment status
./scripts/environment.sh status

# Check release status
./scripts/release.sh status

# Validate configuration
./scripts/environment.sh validate staging

# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Check Azure CLI authentication
az login
az acr login --name $ACR_NAME
```

## Best Practices

### Development
1. **Use feature branches** for all development
2. **Write comprehensive tests** for all changes
3. **Update documentation** with changes
4. **Follow coding standards** and conventions
5. **Use semantic commit messages**

### Release Management
1. **Plan releases** in advance
2. **Test thoroughly** before release
3. **Document breaking changes**
4. **Communicate releases** to stakeholders
5. **Monitor post-deployment** metrics

### Security
1. **Never commit secrets** to code
2. **Use strong, unique secrets** for each environment
3. **Rotate secrets** regularly
4. **Limit access** to production secrets
5. **Monitor access** and usage

### Monitoring
1. **Set up alerts** for critical issues
2. **Monitor performance** metrics
3. **Track error rates** and patterns
4. **Review logs** regularly
5. **Update monitoring** as needed

## Future Enhancements

### Planned Features
1. **Automated rollback** capabilities
2. **Blue-green deployments**
3. **Canary releases**
4. **Advanced monitoring** dashboards
5. **Automated testing** in staging

### Integration Opportunities
1. **Jira integration** for issue tracking
2. **Slack integration** for notifications
3. **Teams integration** for Microsoft environments
4. **Email notifications** for stakeholders
5. **Webhook integrations** for external systems

## Support and Maintenance

### Regular Maintenance
1. **Update dependencies** regularly
2. **Review security** configurations
3. **Monitor performance** metrics
4. **Update documentation** as needed
5. **Test automation** workflows

### Getting Help
1. **Check documentation** first
2. **Review GitHub Issues** for known problems
3. **Check GitHub Actions** logs for errors
4. **Contact team** for support
5. **Create issue** for bugs or feature requests
