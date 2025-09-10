# CouncilWorks GitHub Secrets Configuration

This document outlines the required secrets for GitHub Actions workflows and deployment automation.

## Required GitHub Secrets

### Azure Container Registry (ACR)
```
ACR_NAME=your-acr-name
ACR_USERNAME=your-acr-username  
ACR_PASSWORD=your-acr-password
```

### Azure Container Apps
```
CONTAINER_APP_NAME_STAGING=councilworks-staging
CONTAINER_APP_NAME_PRODUCTION=councilworks-production
RESOURCE_GROUP=your-resource-group
```

### Database Configuration
```
STAGING_DATABASE_URL=postgresql://user:password@staging-db:5432/councilworks_staging
STAGING_DIRECT_URL=postgresql://user:password@staging-db:5432/councilworks_staging
PRODUCTION_DATABASE_URL=postgresql://user:password@production-db:5432/councilworks_production
PRODUCTION_DIRECT_URL=postgresql://user:password@production-db:5432/councilworks_production
```

### Authentication Secrets
```
STAGING_NEXTAUTH_URL=https://councilworks-staging.azurecontainerapps.io
STAGING_NEXTAUTH_SECRET=your-staging-nextauth-secret-32-chars-min
PRODUCTION_NEXTAUTH_URL=https://councilworks.azurecontainerapps.io
PRODUCTION_NEXTAUTH_SECRET=your-production-nextauth-secret-32-chars-min
```

### External Service URLs
```
STAGING_API_URL=https://councilworks-staging.azurecontainerapps.io/api
PRODUCTION_API_URL=https://councilworks.azurecontainerapps.io/api
STAGING_URL=https://councilworks-staging.azurecontainerapps.io
PRODUCTION_URL=https://councilworks.azurecontainerapps.io
```

### Azure Storage
```
STAGING_AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=stagingaccount;AccountKey=stagingkey;EndpointSuffix=core.windows.net
PRODUCTION_AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=productionaccount;AccountKey=productionkey;EndpointSuffix=core.windows.net
```

### Application Insights
```
STAGING_APPLICATION_INSIGHTS_CONNECTION_STRING=InstrumentationKey=staging-key;IngestionEndpoint=https://staging.in.applicationinsights.azure.com/
PRODUCTION_APPLICATION_INSIGHTS_CONNECTION_STRING=InstrumentationKey=production-key;IngestionEndpoint=https://production.in.applicationinsights.azure.com/
```

### Security Configuration
```
PRODUCTION_CORS_ORIGIN=https://councilworks.azurecontainerapps.io
PRODUCTION_RATE_LIMIT_MAX=100
```

### Notifications
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with the exact name and value from the list above

## Environment-Specific Notes

### Staging Environment
- Uses staging database and services
- Limited to internal testing
- Debug information available
- Automated deployment from `develop` branch

### Production Environment  
- Uses production database and services
- Public-facing application
- Minimal debug information
- Manual deployment from `main` branch only
- Requires approval for deployment

## Security Best Practices

1. **Never commit secrets to code**
2. **Use strong, unique secrets for each environment**
3. **Rotate secrets regularly**
4. **Limit access to production secrets**
5. **Use Azure Key Vault for sensitive data**
6. **Monitor secret usage and access**

## Troubleshooting

### Common Issues

1. **Deployment fails with authentication error**
   - Check ACR credentials
   - Verify Azure service principal permissions

2. **Database connection fails**
   - Verify database URL format
   - Check network connectivity
   - Ensure database server is running

3. **NextAuth authentication fails**
   - Verify NEXTAUTH_URL matches deployment URL
   - Check NEXTAUTH_SECRET is set correctly
   - Ensure secret is at least 32 characters

4. **External service calls fail**
   - Verify API URLs are correct
   - Check CORS configuration
   - Ensure services are accessible from Azure

### Verification Commands

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Test Azure CLI authentication
az login
az acr login --name $ACR_NAME

# Test container app deployment
az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP
```
