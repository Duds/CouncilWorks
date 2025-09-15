#!/bin/bash

# Aegrid Release Management Script
# This script provides local release management capabilities

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_NAME="Aegrid"
MAIN_BRANCH="main"
DEVELOP_BRANCH="develop"
CHANGELOG_FILE="docs/releases/changelog.md"

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

# Check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
}

# Check if working directory is clean
check_clean_working_dir() {
    if ! git diff-index --quiet HEAD --; then
        log_error "Working directory is not clean. Please commit or stash your changes."
        exit 1
    fi
}

# Get current version from package.json
get_current_version() {
    node -p "require('./package.json').version"
}

# Bump version
bump_version() {
    local version_type=$1
    local current_version=$(get_current_version)
    
    log_info "Current version: $current_version"
    
    case $version_type in
        "major")
            npm version major --no-git-tag-version
            ;;
        "minor")
            npm version minor --no-git-tag-version
            ;;
        "patch")
            npm version patch --no-git-tag-version
            ;;
        *)
            log_error "Invalid version type: $version_type. Use major, minor, or patch"
            exit 1
            ;;
    esac
    
    local new_version=$(get_current_version)
    log_success "Version bumped to: $new_version"
    echo $new_version
}

# Generate release notes
generate_release_notes() {
    local version=$1
    local last_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
    
    log_info "Generating release notes for version $version"
    
    if [ -z "$last_tag" ]; then
        log_warning "No previous tags found. Using all commits."
        git log --oneline --pretty=format:"- %s" HEAD > /tmp/release_notes.txt
    else
        log_info "Comparing with last tag: $last_tag"
        git log --oneline --pretty=format:"- %s" $last_tag..HEAD > /tmp/release_notes.txt
    fi
    
    # Create formatted release notes
    cat > /tmp/release_notes_formatted.txt << EOF
## [$version] - $(date +"%Y-%m-%d")

### Added
- New features and enhancements

### Changed
- Changes to existing functionality

### Fixed
- Bug fixes and improvements

### Security
- Security updates and patches

### Commits in this release:
$(cat /tmp/release_notes.txt)

---
EOF
    
    # Update changelog
    if [ -f "$CHANGELOG_FILE" ]; then
        cat /tmp/release_notes_formatted.txt "$CHANGELOG_FILE" > /tmp/changelog_new.txt
        mv /tmp/changelog_new.txt "$CHANGELOG_FILE"
        log_success "Changelog updated"
    else
        log_warning "Changelog file not found: $CHANGELOG_FILE"
    fi
    
    # Clean up temp files
    rm -f /tmp/release_notes.txt /tmp/release_notes_formatted.txt
}

# Run tests
run_tests() {
    log_info "Running test suite..."
    
    if command -v pnpm &> /dev/null; then
        pnpm test
    elif command -v npm &> /dev/null; then
        npm test
    else
        log_error "Neither pnpm nor npm found. Please install a package manager."
        exit 1
    fi
    
    log_success "All tests passed"
}

# Build application
build_app() {
    log_info "Building application..."
    
    if command -v pnpm &> /dev/null; then
        pnpm build
    elif command -v npm &> /dev/null; then
        npm run build
    else
        log_error "Neither pnpm nor npm found. Please install a package manager."
        exit 1
    fi
    
    log_success "Application built successfully"
}

# Create release branch
create_release_branch() {
    local version=$1
    local release_branch="release/$version"
    
    log_info "Creating release branch: $release_branch"
    
    # Check if branch already exists
    if git show-ref --verify --quiet refs/heads/$release_branch; then
        log_warning "Release branch $release_branch already exists"
        read -p "Do you want to delete and recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git branch -D $release_branch
        else
            log_info "Switching to existing release branch"
            git checkout $release_branch
            return
        fi
    fi
    
    git checkout -b $release_branch
    log_success "Release branch created: $release_branch"
}

# Commit release changes
commit_release_changes() {
    local version=$1
    
    log_info "Committing release changes..."
    
    git add package.json package-lock.json "$CHANGELOG_FILE"
    git commit -m "chore: prepare release $version"
    
    log_success "Release changes committed"
}

# Push release branch
push_release_branch() {
    local version=$1
    local release_branch="release/$version"
    
    log_info "Pushing release branch to remote..."
    
    git push -u origin $release_branch
    
    log_success "Release branch pushed to remote"
}

# Create pull request
create_pull_request() {
    local version=$1
    local release_branch="release/$version"
    
    log_info "Creating pull request for release $version..."
    
    # Check if gh CLI is available
    if ! command -v gh &> /dev/null; then
        log_warning "GitHub CLI (gh) not found. Please create PR manually:"
        echo "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\)\.git.*/\1/')/compare/$release_branch...$MAIN_BRANCH"
        return
    fi
    
    # Create PR using GitHub CLI
    gh pr create \
        --title "Release $version" \
        --body "## Release $version

This PR contains the release preparation for version $version.

### Changes:
- Version bumped to $version
- Changelog updated
- All tests passing
- Build successful

### Checklist:
- [ ] Code review completed
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Documentation updated
- [ ] Ready for production deployment

### Deployment:
Once this PR is merged to main, the production deployment workflow will automatically trigger." \
        --base $MAIN_BRANCH \
        --head $release_branch \
        --label "release,automated"
    
    log_success "Pull request created"
}

# Main release function
release() {
    local version_type=$1
    
    if [ -z "$version_type" ]; then
        log_error "Version type required. Usage: $0 release [major|minor|patch]"
        exit 1
    fi
    
    log_info "Starting release process for $version_type version..."
    
    # Pre-flight checks
    check_git_repo
    check_clean_working_dir
    
    # Ensure we're on develop branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "$DEVELOP_BRANCH" ]; then
        log_warning "Not on $DEVELOP_BRANCH branch. Current branch: $current_branch"
        read -p "Do you want to switch to $DEVELOP_BRANCH? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git checkout $DEVELOP_BRANCH
            git pull origin $DEVELOP_BRANCH
        else
            log_error "Release must be created from $DEVELOP_BRANCH branch"
            exit 1
        fi
    fi
    
    # Run tests before release
    run_tests
    
    # Bump version
    new_version=$(bump_version $version_type)
    
    # Generate release notes and update changelog
    generate_release_notes $new_version
    
    # Build application
    build_app
    
    # Create release branch
    create_release_branch $new_version
    
    # Commit changes
    commit_release_changes $new_version
    
    # Push release branch
    push_release_branch $new_version
    
    # Create pull request
    create_pull_request $new_version
    
    log_success "Release $new_version prepared successfully!"
    log_info "Next steps:"
    echo "1. Review the pull request"
    echo "2. Merge to main when ready"
    echo "3. Production deployment will trigger automatically"
}

# Hotfix function
hotfix() {
    local version_type=$1
    
    if [ -z "$version_type" ]; then
        log_error "Version type required. Usage: $0 hotfix [major|minor|patch]"
        exit 1
    fi
    
    log_info "Starting hotfix process for $version_type version..."
    
    # Pre-flight checks
    check_git_repo
    check_clean_working_dir
    
    # Ensure we're on main branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "$MAIN_BRANCH" ]; then
        log_warning "Not on $MAIN_BRANCH branch. Current branch: $current_branch"
        read -p "Do you want to switch to $MAIN_BRANCH? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git checkout $MAIN_BRANCH
            git pull origin $MAIN_BRANCH
        else
            log_error "Hotfix must be created from $MAIN_BRANCH branch"
            exit 1
        fi
    fi
    
    # Get current version and bump
    current_version=$(get_current_version)
    new_version=$(bump_version $version_type)
    
    # Create hotfix branch
    hotfix_branch="hotfix/$new_version"
    git checkout -b $hotfix_branch
    
    # Generate release notes
    generate_release_notes $new_version
    
    # Run tests
    run_tests
    
    # Build application
    build_app
    
    # Commit changes
    commit_release_changes $new_version
    
    # Push hotfix branch
    git push -u origin $hotfix_branch
    
    log_success "Hotfix $new_version prepared successfully!"
    log_info "Next steps:"
    echo "1. Create PR from $hotfix_branch to $MAIN_BRANCH"
    echo "2. Merge to main when ready"
    echo "3. Merge back to develop"
    echo "4. Production deployment will trigger automatically"
}

# Show help
show_help() {
    cat << EOF
Aegrid Release Management Script

Usage: $0 <command> [options]

Commands:
    release <type>    Create a new release (major|minor|patch)
    hotfix <type>     Create a hotfix release (major|minor|patch)
    status            Show current release status
    help              Show this help message

Examples:
    $0 release minor     # Create a minor release (1.0.0 -> 1.1.0)
    $0 hotfix patch      # Create a hotfix (1.0.0 -> 1.0.1)
    $0 status            # Show current status

Workflow:
    1. Release: develop -> release branch -> PR to main -> production
    2. Hotfix: main -> hotfix branch -> PR to main -> production

Requirements:
    - Git repository with main and develop branches
    - Node.js and npm/pnpm
    - GitHub CLI (gh) for automatic PR creation (optional)
    - Clean working directory

EOF
}

# Show status
show_status() {
    log_info "Aegrid Release Status"
    echo
    
    # Current branch
    current_branch=$(git branch --show-current)
    echo "Current branch: $current_branch"
    
    # Current version
    current_version=$(get_current_version)
    echo "Current version: $current_version"
    
    # Last tag
    last_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "No tags found")
    echo "Last tag: $last_tag"
    
    # Uncommitted changes
    if git diff-index --quiet HEAD --; then
        echo "Working directory: Clean"
    else
        echo "Working directory: Has uncommitted changes"
    fi
    
    # Remote status
    git fetch --quiet
    local_ahead=$(git rev-list --count HEAD ^origin/$current_branch 2>/dev/null || echo "0")
    remote_ahead=$(git rev-list --count origin/$current_branch ^HEAD 2>/dev/null || echo "0")
    
    if [ "$local_ahead" -gt 0 ]; then
        echo "Local branch is $local_ahead commits ahead of remote"
    fi
    
    if [ "$remote_ahead" -gt 0 ]; then
        echo "Remote branch is $remote_ahead commits ahead of local"
    fi
    
    if [ "$local_ahead" -eq 0 ] && [ "$remote_ahead" -eq 0 ]; then
        echo "Branch is up to date with remote"
    fi
    
    echo
    log_info "Available branches:"
    git branch -a | grep -E "(main|develop|release|hotfix)" | sed 's/^/  /'
}

# Main script logic
case "${1:-}" in
    "release")
        release "$2"
        ;;
    "hotfix")
        hotfix "$2"
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
