#!/bin/bash

# Automated Monitoring & Review Setup Script for CouncilWorks
# This script sets up the automated-review branch and branch protection

set -e

echo "🚀 Setting up Automated Monitoring & Review System for CouncilWorks"
echo "=================================================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated with GitHub
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub CLI"
    echo "Please run: gh auth login"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Get repository information
REPO_OWNER=$(gh repo view --json owner -q .owner.login)
REPO_NAME=$(gh repo view --json name -q .name)

echo "📋 Repository: $REPO_OWNER/$REPO_NAME"

# Check if automated-review branch already exists
if git show-ref --verify --quiet refs/heads/automated-review; then
    echo "⚠️  automated-review branch already exists"
    read -p "Do you want to recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Deleting existing automated-review branch..."
        git branch -D automated-review 2>/dev/null || true
        git push origin --delete automated-review 2>/dev/null || true
    else
        echo "✅ Using existing automated-review branch"
        git checkout automated-review
    fi
else
    echo "🌿 Creating automated-review branch..."
    git checkout -b automated-review
    git push -u origin automated-review
fi

echo "🔒 Setting up branch protection rules..."

# Apply branch protection rules
echo "Setting up branch protection for automated-review branch..."
gh api repos/$REPO_OWNER/$REPO_NAME/branches/automated-review/protection \
  --method PUT \
  --input - << EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["test", "security"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF

echo "✅ Branch protection rules applied"

# Check if Dependabot is enabled
echo "🤖 Checking Dependabot configuration..."
if [ -f ".github/dependabot.yml" ]; then
    echo "✅ Dependabot configuration found"
    echo "📝 Dependabot will create PRs targeting automated-review branch"
else
    echo "⚠️  Dependabot configuration not found"
    echo "Please ensure .github/dependabot.yml exists"
fi

# Check if workflow files exist
echo "⚙️  Checking workflow configurations..."
if [ -f ".github/workflows/workflow-monitor.yml" ]; then
    echo "✅ Workflow monitor configuration found"
else
    echo "⚠️  Workflow monitor configuration not found"
fi

if [ -f ".github/workflows/automated-review.yml" ]; then
    echo "✅ Automated review workflow found"
else
    echo "⚠️  Automated review workflow not found"
fi

# Check if Cursor agent configuration exists
if [ -f ".cursor/background-agent.json" ]; then
    echo "✅ Cursor Background Agent configuration found"
else
    echo "⚠️  Cursor Background Agent configuration not found"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo "1. Review the automated-review branch protection rules"
echo "2. Test the automated review workflow by creating a test PR"
echo "3. Configure Slack notifications (optional)"
echo "4. Review and customize the monitoring configurations"
echo ""
echo "🔍 Monitoring:"
echo "- Check GitHub Actions tab for workflow runs"
echo "- Monitor Pull Requests tab for automated PRs"
echo "- Review Issues tab for persistent failure alerts"
echo ""
echo "📚 Documentation:"
echo "- See docs/development/automated-monitoring-setup.md for detailed information"
echo "- Review .github/branch-protection.yml for protection rules"
echo ""
echo "🚨 Important:"
echo "- All automated changes now go through automated-review branch"
echo "- Manual review required before promotion to develop"
echo "- Use workflow dispatch for manual promotion when needed"
echo ""
echo "Happy automating! 🤖"
