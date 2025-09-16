# Azure Container Apps Configuration for Aegrid

This directory contains Azure Container Apps deployment configurations for Aegrid.

## Files Overview

- `azure-container-apps.yaml` - Main Azure Container Apps configuration
- `azure-container-registry.yaml` - Azure Container Registry configuration
- `azure-monitoring.yaml` - Application Insights and monitoring configuration
- `azure-networking.yaml` - Networking and security configuration
- `deploy.sh` - Deployment script
- `README.md` - This file

## Prerequisites

1. Azure CLI installed and configured
2. Azure Container Registry
3. Azure Container Apps Environment
4. Azure Application Insights
5. Environment variables configured

## Deployment Steps

1. Create Azure Container Registry:
   ```bash
   az acr create --resource-group aegrid-rg --name aegridacr --sku Basic
   ```

2. Build and push container image:
   ```bash
   az acr build --registry aegridacr --image aegrid:latest .
   ```

3. Deploy to Azure Container Apps:
   ```bash
   ./deploy.sh
   ```

## Environment Variables

Required environment variables for production deployment:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `NEXTAUTH_URL` - Application URL
- `AZURE_STORAGE_CONNECTION_STRING` - Azure Storage connection
- `AZURE_COSMOS_DB_CONNECTION_STRING` - Cosmos DB connection
- `APPLICATION_INSIGHTS_CONNECTION_STRING` - App Insights connection

## Monitoring

- Application Insights integration
- Health check endpoints
- Performance monitoring
- Error tracking
- Custom metrics

## Security

- HTTPS enforcement
- Security headers
- Rate limiting
- DDoS protection
- Network security groups
