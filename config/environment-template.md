# Aegrid Environment Configuration
# This file contains environment-specific settings for different deployment environments

# Environment Types
# - local: Development environment
# - staging: Pre-production testing environment  
# - production: Live production environment

# Environment Variables Reference
# Copy the appropriate section to your .env file and fill in the actual values

# =============================================================================
# LOCAL DEVELOPMENT ENVIRONMENT
# =============================================================================
# Copy this section to .env for local development

# NODE_ENV=development
# NEXT_PUBLIC_APP_ENV=local

# Database Configuration
# DATABASE_URL="postgresql://aegrid:password@localhost:5432/aegrid_dev"
# DIRECT_URL="postgresql://aegrid:password@localhost:5432/aegrid_dev"

# Authentication
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=local-development-secret-key-change-in-production

# External Services (Local/Mock)
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
# AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=devkey;EndpointSuffix=core.windows.net

# Feature Flags
# NEXT_PUBLIC_ENABLE_DEBUG=true
# NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Logging
# LOG_LEVEL=debug
# ENABLE_CONSOLE_LOGGING=true

# =============================================================================
# STAGING ENVIRONMENT
# =============================================================================
# Use these variables in Azure Container Apps or GitHub Actions secrets

# NODE_ENV=production
# NEXT_PUBLIC_APP_ENV=staging

# Database Configuration
# DATABASE_URL=${STAGING_DATABASE_URL}
# DIRECT_URL=${STAGING_DIRECT_URL}

# Authentication
# NEXTAUTH_URL=${STAGING_NEXTAUTH_URL}
# NEXTAUTH_SECRET=${STAGING_NEXTAUTH_SECRET}

# External Services
# NEXT_PUBLIC_API_URL=${STAGING_API_URL}
# AZURE_STORAGE_CONNECTION_STRING=${STAGING_AZURE_STORAGE_CONNECTION_STRING}

# Feature Flags
# NEXT_PUBLIC_ENABLE_DEBUG=false
# NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Logging
# LOG_LEVEL=info
# ENABLE_CONSOLE_LOGGING=false

# Monitoring
# APPLICATION_INSIGHTS_CONNECTION_STRING=${STAGING_APPLICATION_INSIGHTS_CONNECTION_STRING}

# =============================================================================
# PRODUCTION ENVIRONMENT
# =============================================================================
# Use these variables in Azure Container Apps or GitHub Actions secrets

# NODE_ENV=production
# NEXT_PUBLIC_APP_ENV=production

# Database Configuration
# DATABASE_URL=${PRODUCTION_DATABASE_URL}
# DIRECT_URL=${PRODUCTION_DIRECT_URL}

# Authentication
# NEXTAUTH_URL=${PRODUCTION_NEXTAUTH_URL}
# NEXTAUTH_SECRET=${PRODUCTION_NEXTAUTH_SECRET}

# External Services
# NEXT_PUBLIC_API_URL=${PRODUCTION_API_URL}
# AZURE_STORAGE_CONNECTION_STRING=${PRODUCTION_AZURE_STORAGE_CONNECTION_STRING}

# Feature Flags
# NEXT_PUBLIC_ENABLE_DEBUG=false
# NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Logging
# LOG_LEVEL=warn
# ENABLE_CONSOLE_LOGGING=false

# Monitoring
# APPLICATION_INSIGHTS_CONNECTION_STRING=${PRODUCTION_APPLICATION_INSIGHTS_CONNECTION_STRING}

# Security
# CORS_ORIGIN=${PRODUCTION_CORS_ORIGIN}
# RATE_LIMIT_MAX=${PRODUCTION_RATE_LIMIT_MAX}

# =============================================================================
# REQUIRED SECRETS FOR GITHUB ACTIONS
# =============================================================================
# Add these secrets to your GitHub repository settings

# Azure Container Registry
# ACR_NAME=your-acr-name
# ACR_USERNAME=your-acr-username
# ACR_PASSWORD=your-acr-password

# Azure Container Apps
# CONTAINER_APP_NAME_STAGING=aegrid-staging
# CONTAINER_APP_NAME_PRODUCTION=aegrid-production
# RESOURCE_GROUP=your-resource-group

# Database URLs
# STAGING_DATABASE_URL=postgresql://user:password@staging-db:5432/aegrid_staging
# PRODUCTION_DATABASE_URL=postgresql://user:password@production-db:5432/aegrid_production

# Authentication Secrets
# STAGING_NEXTAUTH_SECRET=your-staging-nextauth-secret
# PRODUCTION_NEXTAUTH_SECRET=your-production-nextauth-secret

# External Service URLs
# STAGING_URL=https://aegrid-staging.azurecontainerapps.io
# PRODUCTION_URL=https://aegrid.azurecontainerapps.io

# Notification
# SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/slack/webhook

# =============================================================================
# ENVIRONMENT-SPECIFIC NOTES
# =============================================================================

# Local Development:
# - Uses local PostgreSQL database
# - Debug logging enabled
# - Mock external services
# - Hot reloading enabled

# Staging:
# - Production-like configuration
# - Real external services
# - Limited debug information
# - Automated testing

# Production:
# - Optimised for performance
# - Minimal logging
# - Security hardening
# - Monitoring enabled
