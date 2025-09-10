# Troubleshooting

Use this guide to diagnose and resolve common issues in development and deployment.

## Quick Fixes
- Reset dev state: clear caches, restart dev server
- Verify environment variables in `.env`
- Reinstall dependencies if builds fail

## Common Areas
- Build/TypeScript errors: run typecheck and lint
- Testing failures: clear test cache, run isolated suites
- Database issues: regenerate Prisma client, check connection
- API 404s: verify route files and restart dev server

## References
- `../development/developer-brief.md`
- `../development/testing-guide.md`
- `../security/rbac-implementation.md`
