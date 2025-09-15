# Aegrid GitHub Project Setup

This document provides instructions for setting up GitHub Projects integration with the Aegrid release automation system.

## Project Structure

### Recommended Project Columns

1. **Backlog** - Low priority items and future enhancements
2. **To Do** - Ready to work on items
3. **In Progress** - Currently being worked on
4. **Review** - Items ready for code review
5. **Staging** - Items deployed to staging environment
6. **Production** - Items deployed to production
7. **Done** - Completed items

### Project Views

1. **Board View** - Kanban-style board for tracking work
2. **Table View** - Spreadsheet-style view for detailed tracking
3. **Roadmap View** - Timeline view for releases and milestones

## Setup Instructions

### 1. Create GitHub Project

1. Go to your GitHub repository
2. Click on **Projects** tab
3. Click **New project**
4. Choose **Table** or **Board** view
5. Name it "Aegrid Release Management"

### 2. Configure Columns

Add the following columns in order:

```
Backlog → To Do → In Progress → Review → Staging → Production → Done
```

### 3. Configure Automation

The GitHub Actions workflow will automatically:

- Move issues to appropriate columns based on labels
- Move pull requests through the workflow
- Track deployments to staging and production
- Move completed items to Done

### 4. Label Configuration

Configure the following labels for automatic project management:

#### Priority Labels
- `priority-high` - Moves to In Progress
- `priority-medium` - Moves to To Do  
- `priority-low` - Moves to Backlog

#### Type Labels
- `bug` - Bug fixes
- `enhancement` - New features
- `documentation` - Documentation updates
- `security` - Security-related changes
- `database` - Database changes
- `auth` - Authentication changes

#### Status Labels
- `needs-review` - Ready for code review
- `ready-for-staging` - Ready for staging deployment
- `ready-for-production` - Ready for production deployment
- `blocked` - Blocked by external dependencies

## Workflow Integration

### Issue Lifecycle

1. **Issue Created** → Automatically added to appropriate column based on labels
2. **Issue Assigned** → Moved to In Progress
3. **Issue Closed** → Moved to Done

### Pull Request Lifecycle

1. **PR Created** → Added to In Progress
2. **PR Merged** → Moved to Done
3. **PR Closed** → Moved to Done

### Deployment Tracking

1. **Push to develop** → Commit added to Staging column
2. **Push to main** → Commit added to Production column
3. **Release created** → Release tracked in Production column

## Custom Fields

### Add Custom Fields

1. **Effort** - Story points or time estimate
2. **Sprint** - Sprint assignment
3. **Release** - Target release version
4. **Component** - Affected component (auth, database, ui, etc.)
5. **Environment** - Target environment (staging, production)

### Field Configuration

```yaml
Effort:
  Type: Number
  Description: Story points or hours estimate

Sprint:
  Type: Text
  Description: Sprint name or number

Release:
  Type: Text
  Description: Target release version (e.g., v1.2.3)

Component:
  Type: Single select
  Options: [auth, database, ui, api, reporting, assets]

Environment:
  Type: Single select
  Options: [staging, production, both]
```

## Automation Rules

### Automatic Column Movement

```yaml
Rules:
  - When issue is labeled "priority-high" → Move to "In Progress"
  - When issue is labeled "priority-medium" → Move to "To Do"
  - When issue is labeled "priority-low" → Move to "Backlog"
  - When PR is opened → Move to "In Progress"
  - When PR is merged → Move to "Done"
  - When issue is closed → Move to "Done"
```

### Status Updates

```yaml
Status Updates:
  - When moved to "In Progress" → Add "in-progress" label
  - When moved to "Review" → Add "needs-review" label
  - When moved to "Staging" → Add "ready-for-staging" label
  - When moved to "Production" → Add "ready-for-production" label
```

## Reporting and Analytics

### Project Insights

1. **Velocity Tracking** - Track story points completed per sprint
2. **Cycle Time** - Measure time from To Do to Done
3. **Lead Time** - Measure time from issue creation to completion
4. **Burndown Charts** - Track progress toward sprint goals

### Custom Reports

1. **Release Progress** - Track items by target release
2. **Component Health** - Track issues by component
3. **Team Performance** - Track work by assignee
4. **Quality Metrics** - Track bug rates and resolution times

## Integration with Release Automation

### Release Tracking

The project automatically tracks:

1. **Feature Development** - Issues and PRs for new features
2. **Bug Fixes** - Issues and PRs for bug fixes
3. **Deployments** - Commits deployed to each environment
4. **Releases** - GitHub releases and their associated work

### Release Planning

Use the project to:

1. **Plan Releases** - Group issues by target release
2. **Track Progress** - Monitor completion status
3. **Identify Blockers** - Flag blocked items
4. **Estimate Delivery** - Use effort estimates for planning

## Best Practices

### Issue Management

1. **Use Descriptive Titles** - Clear, actionable issue titles
2. **Add Detailed Descriptions** - Include acceptance criteria
3. **Assign Appropriate Labels** - Use consistent labeling
4. **Set Effort Estimates** - Use story points or time estimates
5. **Link Related Issues** - Connect related work

### Pull Request Management

1. **Link to Issues** - Reference related issues in PRs
2. **Use Descriptive Titles** - Clear PR titles
3. **Add Reviewers** - Assign appropriate reviewers
4. **Update Project Status** - Move items through columns
5. **Close Related Issues** - Use "Fixes #123" syntax

### Release Management

1. **Plan Ahead** - Create issues for upcoming releases
2. **Track Progress** - Monitor completion status
3. **Identify Dependencies** - Flag dependent work
4. **Communicate Status** - Update stakeholders regularly
5. **Document Changes** - Maintain changelog

## Troubleshooting

### Common Issues

1. **Items not moving automatically**
   - Check GitHub Actions workflow is enabled
   - Verify project permissions
   - Check label configuration

2. **Wrong column assignments**
   - Review label-to-column mapping
   - Check automation rules
   - Verify label names match exactly

3. **Missing project updates**
   - Check GitHub Actions logs
   - Verify webhook configuration
   - Ensure project is active

### Verification Steps

1. **Test Issue Creation** - Create test issue with labels
2. **Test PR Workflow** - Create test PR and merge
3. **Test Deployment** - Push to develop/main branches
4. **Check Project Updates** - Verify items move correctly
5. **Review Automation** - Check automation rules are working
