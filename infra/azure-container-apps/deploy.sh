#!/bin/bash

# Azure Container Apps Deployment Script for Aegrid
# This script deploys Aegrid to Azure Container Apps with proper configuration

set -e

# Configuration
RESOURCE_GROUP="aegrid-rg"
CONTAINER_REGISTRY="aegridacr"
CONTAINER_APP_ENVIRONMENT="aegrid-env"
CONTAINER_APP_NAME="aegrid-app"
LOCATION="Australia East"
IMAGE_TAG="latest"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Azure CLI is installed
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if logged in to Azure
    if ! az account show &> /dev/null; then
        log_error "Not logged in to Azure. Please run 'az login' first."
        exit 1
    fi
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    log_info "Prerequisites check passed."
}

# Create resource group
create_resource_group() {
    log_info "Creating resource group: $RESOURCE_GROUP"
    
    if az group show --name $RESOURCE_GROUP &> /dev/null; then
        log_warn "Resource group $RESOURCE_GROUP already exists."
    else
        az group create --name $RESOURCE_GROUP --location "$LOCATION"
        log_info "Resource group created successfully."
    fi
}

# Create Azure Container Registry
create_container_registry() {
    log_info "Creating Azure Container Registry: $CONTAINER_REGISTRY"
    
    if az acr show --name $CONTAINER_REGISTRY --resource-group $RESOURCE_GROUP &> /dev/null; then
        log_warn "Container Registry $CONTAINER_REGISTRY already exists."
    else
        az acr create \
            --resource-group $RESOURCE_GROUP \
            --name $CONTAINER_REGISTRY \
            --sku Basic \
            --admin-enabled true
        log_info "Container Registry created successfully."
    fi
}

# Build and push Docker image
build_and_push_image() {
    log_info "Building and pushing Docker image..."
    
    # Login to ACR
    az acr login --name $CONTAINER_REGISTRY
    
    # Build and push image
    az acr build \
        --registry $CONTAINER_REGISTRY \
        --image aegrid:$IMAGE_TAG \
        --file Dockerfile \
        .
    
    log_info "Docker image built and pushed successfully."
}

# Create Container Apps Environment
create_container_apps_environment() {
    log_info "Creating Container Apps Environment: $CONTAINER_APP_ENVIRONMENT"
    
    if az containerapp env show --name $CONTAINER_APP_ENVIRONMENT --resource-group $RESOURCE_GROUP &> /dev/null; then
        log_warn "Container Apps Environment $CONTAINER_APP_ENVIRONMENT already exists."
    else
        az containerapp env create \
            --name $CONTAINER_APP_ENVIRONMENT \
            --resource-group $RESOURCE_GROUP \
            --location "$LOCATION"
        log_info "Container Apps Environment created successfully."
    fi
}

# Create Container App
create_container_app() {
    log_info "Creating Container App: $CONTAINER_APP_NAME"
    
    # Get ACR login server
    ACR_LOGIN_SERVER=$(az acr show --name $CONTAINER_REGISTRY --resource-group $RESOURCE_GROUP --query loginServer --output tsv)
    
    # Create Container App
    az containerapp create \
        --name $CONTAINER_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --environment $CONTAINER_APP_ENVIRONMENT \
        --image $ACR_LOGIN_SERVER/aegrid:$IMAGE_TAG \
        --target-port 3000 \
        --ingress external \
        --min-replicas 1 \
        --max-replicas 10 \
        --cpu 0.5 \
        --memory 1Gi \
        --env-vars \
            NODE_ENV=production \
            DATABASE_URL="$(az keyvault secret show --vault-name aegrid-kv --name database-url --query value -o tsv)" \
            NEXTAUTH_SECRET="$(az keyvault secret show --vault-name aegrid-kv --name nextauth-secret --query value -o tsv)" \
            NEXTAUTH_URL="https://aegrid.azurecontainerapps.io" \
            AZURE_STORAGE_CONNECTION_STRING="$(az keyvault secret show --vault-name aegrid-kv --name azure-storage-connection --query value -o tsv)" \
            AZURE_COSMOS_DB_CONNECTION_STRING="$(az keyvault secret show --vault-name aegrid-kv --name cosmos-db-connection --query value -o tsv)" \
            APPLICATION_INSIGHTS_CONNECTION_STRING="$(az keyvault secret show --vault-name aegrid-kv --name app-insights-connection --query value -o tsv)"
    
    log_info "Container App created successfully."
}

# Configure custom domain and SSL
configure_domain() {
    log_info "Configuring custom domain and SSL..."
    
    # Add custom domain
    az containerapp hostname add \
        --name $CONTAINER_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --hostname aegrid.azurecontainerapps.io
    
    log_info "Custom domain configured successfully."
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring..."
    
    # Create Application Insights
    az monitor app-insights component create \
        --app aegrid-insights \
        --location "$LOCATION" \
        --resource-group $RESOURCE_GROUP
    
    log_info "Monitoring setup completed."
}

# Main deployment function
deploy() {
    log_info "Starting Aegrid deployment to Azure Container Apps..."
    
    check_prerequisites
    create_resource_group
    create_container_registry
    build_and_push_image
    create_container_apps_environment
    create_container_app
    configure_domain
    setup_monitoring
    
    log_info "Deployment completed successfully!"
    log_info "Application URL: https://aegrid.azurecontainerapps.io"
    log_info "Container Registry: $CONTAINER_REGISTRY.azurecr.io"
    log_info "Resource Group: $RESOURCE_GROUP"
}

# Cleanup function
cleanup() {
    log_warn "Cleaning up resources..."
    
    az group delete --name $RESOURCE_GROUP --yes --no-wait
    
    log_info "Cleanup initiated. Resources will be deleted shortly."
}

# Help function
show_help() {
    echo "Aegrid Azure Container Apps Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy    Deploy Aegrid to Azure Container Apps"
    echo "  cleanup   Clean up all resources"
    echo "  help      Show this help message"
    echo ""
    echo "Prerequisites:"
    echo "  - Azure CLI installed and configured"
    echo "  - Docker installed"
    echo "  - Azure Key Vault with required secrets"
    echo "  - Appropriate Azure permissions"
}

# Main script logic
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
