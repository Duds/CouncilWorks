# Testing Guide

Last updated: 10/09/2025

## Strategy
- Unit tests for utilities and pure logic
- Component tests with React Testing Library
- API tests with mocks for external services
- Integration tests with test DB/container
- E2E tests (Phase 2) for critical flows

## Coverage Targets
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## Structure
```
__tests__/
  lib/
  components/
  api/
  integration/
```

## Commands
```bash
pnpm test
pnpm test:coverage
pnpm test:unit
pnpm test:components
pnpm test:api
pnpm test:integration
```

## CI
- Run tests and coverage in CI pipelines
- Fail builds when below thresholds

## References
- `../development/developer-brief.md`
- `../security/rbac-implementation.md`
