#!/bin/bash

# CouncilWorks Environment Management Script
# Manages environment-specific configurations and deployments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENTS=("local" "staging" "production")
CONFIG_DIR="config"
ENV_FILE=".env"

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create environment configuration directory
create_config_dir() {
    if [ ! -d "$CONFIG_DIR" ]; then
        mkdir -p "$CONFIG_DIR"
        log_info "Created configuration directory: $CONFIG_DIR"
    fi
}

# Generate environment configuration
generate_env_config() {
    local env=$1
    
    log_info "Generating configuration for environment: $env"
    
    case $env in
        "local")
            cat > "$CONFIG_DIR/.env.local" << EOF
# Local Development Environment
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=local

# Database
DATABASE_URL="postgresql://councilworks:password@localhost:5432/councilworks_dev"
DIRECT_URL="postgresql://councilworks:password@localhost:5432/councilworks_dev"

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=local-development-secret-key-change-in-production

# External Services (Local/Mock)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=devkey;EndpointSuffix=core.windows.net

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Logging
LOG_LEVEL=debug
ENABLE_CONSOLE_LOGGING=true
EOF
            ;;
        "staging")
            cat > "$CONFIG_DIR/.env.staging" << EOF
# Staging Environment
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=staging

# Database
DATABASE_URL=\${STAGING_DATABASE_URL}
DIRECT_URL=\${STAGING_DIRECT_URL}

# Authentication
NEXTAUTH_URL=\${STAGING_NEXTAUTH_URL}
NEXTAUTH_SECRET=\${STAGING_NEXTAUTH_SECRET}

# External Services
NEXT_PUBLIC_API_URL=\${STAGING_API_URL}
AZURE_STORAGE_CONNECTION_STRING=\${STAGING_AZURE_STORAGE_CONNECTION_STRING}

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Logging
LOG_LEVEL=info
ENABLE_CONSOLE_LOGGING=false

# Monitoring
APPLICATION_INSIGHTS_CONNECTION_STRING=\${STAGING_APPLICATION_INSIGHTS_CONNECTION_STRING}
EOF
            ;;
        "production")
            cat > "$CONFIG_DIR/.env.production" << EOF
# Production Environment
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production

# Database
DATABASE_URL=\${PRODUCTION_DATABASE_URL}
DIRECT_URL=\${PRODUCTION_DIRECT_URL}

# Authentication
NEXTAUTH_URL=\${PRODUCTION_NEXTAUTH_URL}
NEXTAUTH_SECRET=\${PRODUCTION_NEXTAUTH_SECRET}

# External Services
NEXT_PUBLIC_API_URL=\${PRODUCTION_API_URL}
AZURE_STORAGE_CONNECTION_STRING=\${PRODUCTION_AZURE_STORAGE_CONNECTION_STRING}

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Logging
LOG_LEVEL=warn
ENABLE_CONSOLE_LOGGING=false

# Monitoring
APPLICATION_INSIGHTS_CONNECTION_STRING=\${PRODUCTION_APPLICATION_INSIGHTS_CONNECTION_STRING}

# Security
CORS_ORIGIN=\${PRODUCTION_CORS_ORIGIN}
RATE_LIMIT_MAX=\${PRODUCTION_RATE_LIMIT_MAX}
EOF
            ;;
    esac
    
    log_success "Configuration generated for $env environment"
}

# Setup local environment
setup_local() {
    log_info "Setting up local development environment..."
    
    # Generate local config
    generate_env_config "local"
    
    # Create .env file for local development
    if [ ! -f "$ENV_FILE" ]; then
        cp "$CONFIG_DIR/.env.local" "$ENV_FILE"
        log_success "Created local .env file"
    else
        log_warning ".env file already exists. Backup created as .env.backup"
        cp "$ENV_FILE" "$ENV_FILE.backup"
    fi
    
    # Install dependencies
    if command -v pnpm &> /dev/null; then
        log_info "Installing dependencies with pnpm..."
        pnpm install
    elif command -v npm &> /dev/null; then
        log_info "Installing dependencies with npm..."
        npm install
    else
        log_error "Neither pnpm nor npm found. Please install a package manager."
        exit 1
    fi
    
    # Setup database (if Prisma is configured)
    if [ -f "prisma/schema.prisma" ]; then
        log_info "Setting up database..."
        if command -v pnpm &> /dev/null; then
            pnpm prisma generate
            pnpm prisma db push
            pnpm prisma db seed
        else
            npx prisma generate
            npx prisma db push
            npx prisma db seed
        fi
        log_success "Database setup completed"
    fi
    
    log_success "Local environment setup completed!"
    log_info "Next steps:"
    echo "1. Start the development server: pnpm dev"
    echo "2. Open http://localhost:3000"
    echo "3. Check the database connection"
}

# Validate environment configuration
validate_config() {
    local env=$1
    
    log_info "Validating configuration for environment: $env"
    
    local config_file="$CONFIG_DIR/.env.$env"
    
    if [ ! -f "$config_file" ]; then
        log_error "Configuration file not found: $config_file"
        return 1
    fi
    
    # Check for required variables
    local required_vars=("NODE_ENV" "NEXT_PUBLIC_APP_ENV" "DATABASE_URL" "NEXTAUTH_URL" "NEXTAUTH_SECRET")
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$config_file"; then
            log_error "Required variable missing: $var"
            return 1
        fi
    done
    
    log_success "Configuration validation passed for $env"
    return 0
}

# Deploy to environment
deploy() {
    local env=$1
    
    if [ -z "$env" ]; then
        log_error "Environment required. Usage: $0 deploy [staging|production]"
        exit 1
    fi
    
    if [[ ! " ${ENVIRONMENTS[@]} " =~ " ${env} " ]]; then
        log_error "Invalid environment: $env. Available: ${ENVIRONMENTS[*]}"
        exit 1
    fi
    
    log_info "Deploying to $env environment..."
    
    # Validate configuration
    if ! validate_config "$env"; then
        log_error "Configuration validation failed for $env"
        exit 1
    fi
    
    # Check if we're on the correct branch
    local current_branch=$(git branch --show-current)
    local expected_branch=""
    
    case $env in
        "staging")
            expected_branch="develop"
            ;;
        "production")
            expected_branch="main"
            ;;
    esac
    
    if [ "$current_branch" != "$expected_branch" ]; then
        log_warning "Expected branch for $env deployment: $expected_branch"
        log_warning "Current branch: $current_branch"
        read -p "Continue with deployment? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deployment cancelled"
            exit 0
        fi
    fi
    
    # Run tests
    log_info "Running tests before deployment..."
    if command -v pnpm &> /dev/null; then
        pnpm test
    else
        npm test
    fi
    
    # Build application
    log_info "Building application for $env..."
    if command -v pnpm &> /dev/null; then
        pnpm build
    else
        npm run build
    fi
    
    # Trigger GitHub Actions deployment
    log_info "Triggering GitHub Actions deployment..."
    
    if command -v gh &> /dev/null; then
        case $env in
            "staging")
                gh workflow run deploy-staging.yml
                ;;
            "production")
                gh workflow run deploy-production.yml
                ;;
        esac
        log_success "GitHub Actions workflow triggered for $env deployment"
    else
        log_warning "GitHub CLI (gh) not found. Please trigger deployment manually:"
        echo "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\)\.git.*/\1/')/actions"
    fi
}

# Show environment status
show_status() {
    log_info "Environment Status"
    echo
    
    # Current environment
    if [ -f "$ENV_FILE" ]; then
        current_env=$(grep "^NEXT_PUBLIC_APP_ENV=" "$ENV_FILE" | cut -d'=' -f2 || echo "unknown")
        echo "Current environment: $current_env"
    else
        echo "Current environment: Not configured"
    fi
    
    # Available configurations
    echo "Available configurations:"
    for env in "${ENVIRONMENTS[@]}"; do
        config_file="$CONFIG_DIR/.env.$env"
        if [ -f "$config_file" ]; then
            echo "  ✓ $env"
        else
            echo "  ✗ $env (not configured)"
        fi
    done
    
    # Git status
    echo
    echo "Git status:"
    current_branch=$(git branch --show-current)
    echo "Current branch: $current_branch"
    
    # Uncommitted changes
    if git diff-index --quiet HEAD --; then
        echo "Working directory: Clean"
    else
        echo "Working directory: Has uncommitted changes"
    fi
}

# Show help
show_help() {
    cat << EOF
CouncilWorks Environment Management Script

Usage: $0 <command> [options]

Commands:
    setup-local         Setup local development environment
    generate <env>      Generate configuration for environment (local|staging|production)
    validate <env>      Validate configuration for environment
    deploy <env>        Deploy to environment (staging|production)
    status              Show environment status
    help                Show this help message

Examples:
    $0 setup-local              # Setup local development environment
    $0 generate staging          # Generate staging configuration
    $0 validate production       # Validate production configuration
    $0 deploy staging            # Deploy to staging environment
    $0 status                    # Show current status

Environment Configuration:
    - Local: Development configuration with local database
    - Staging: Production-like configuration for testing
    - Production: Production configuration with security settings

Requirements:
    - Git repository
    - Node.js and npm/pnpm
    - GitHub CLI (gh) for deployments (optional)
    - Database setup (PostgreSQL)

EOF
}

# Main script logic
case "${1:-}" in
    "setup-local")
        create_config_dir
        setup_local
        ;;
    "generate")
        create_config_dir
        generate_env_config "$2"
        ;;
    "validate")
        validate_config "$2"
        ;;
    "deploy")
        deploy "$2"
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        log_error "No command specified"
        show_help
        exit 1
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
