# Aegrid VS Code Workspace

This workspace is configured for optimal development experience with the Aegrid Asset Lifecycle Intelligence Platform.

## Workspace Files

- `aegrid.code-workspace` - Main workspace configuration
- `.vscode/settings.json` - Project-specific VS Code settings
- `.vscode/extensions.json` - Recommended extensions
- `.vscode/tasks.json` - Common development tasks
- `.vscode/launch.json` - Debug configurations

## Quick Start

1. **Open Workspace**: Open `aegrid.code-workspace` in VS Code
2. **Install Extensions**: VS Code will prompt to install recommended extensions
3. **Start Development**: Use `Ctrl+Shift+P` → "Tasks: Run Task" → "dev"

## Available Tasks

### Development
- `dev` - Start Next.js development server
- `build` - Build the application
- `typecheck` - Run TypeScript type checking

### Testing
- `test` - Run Jest test suite
- `test:watch` - Run tests in watch mode

### Code Quality
- `lint` - Run ESLint
- `lint:fix` - Fix ESLint issues automatically

### Database
- `db:migrate` - Run Prisma migrations
- `db:seed` - Seed database with test data
- `prisma:studio` - Open Prisma Studio

### Tools
- `storybook` - Start Storybook development server
- `docker:up` - Start Docker containers
- `docker:down` - Stop Docker containers

## Debug Configurations

### Next.js Debugging
- **Next.js: debug server-side** - Debug server-side code
- **Next.js: debug client-side** - Debug client-side code in Chrome
- **Next.js: debug full stack** - Debug both server and client simultaneously

### Testing
- **Debug Jest Tests** - Debug all Jest tests
- **Debug Current Jest Test** - Debug the currently open test file

## Key Settings

### TypeScript
- Auto-imports enabled
- Relative import paths preferred
- Import organization on save

### Code Formatting
- Format on save enabled
- ESLint auto-fix on save
- Prettier integration

### File Management
- Smart file nesting enabled
- Excludes build artifacts from search
- Watches only relevant files

### Tailwind CSS
- IntelliSense for TypeScript/TSX files
- Class name suggestions
- CVA and cx function support

## Recommended Extensions

### Core Development
- **Tailwind CSS IntelliSense** - Tailwind class suggestions
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **TypeScript Importer** - Auto-imports

### Database & ORM
- **Prisma** - Database schema management

### Testing
- **Jest** - Test runner integration
- **Playwright** - E2E testing

### DevOps
- **Docker** - Container management
- **GitHub Actions** - CI/CD workflows

### Productivity
- **GitHub Copilot** - AI code completion
- **Path Intellisense** - File path autocomplete
- **Auto Rename Tag** - HTML/JSX tag renaming

## Workspace Features

### File Nesting
Related files are automatically nested:
- `package.json` → `package-lock.json`
- `tsconfig.json` → `tsconfig.tsbuildinfo`
- `*.tsx` → `*.ts`, `*.js`, `*.d.ts`

### Search Optimization
Excludes from search:
- `node_modules`
- `.next`
- `dist`
- `coverage`
- `prisma/migrations`

### Performance
- File watchers exclude build artifacts
- TypeScript incremental compilation
- Optimized for large codebases

## Troubleshooting

### Extensions Not Working
1. Ensure all recommended extensions are installed
2. Reload VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window")

### Tasks Not Running
1. Check that `npm` is available in terminal
2. Ensure dependencies are installed (`npm ci`)

### Debug Not Working
1. Verify Next.js is running (`npm run dev`)
2. Check that debug ports are available
3. Ensure Chrome is installed for client-side debugging

## Customization

To customize the workspace:

1. **Settings**: Edit `.vscode/settings.json`
2. **Tasks**: Modify `.vscode/tasks.json`
3. **Debug**: Update `.vscode/launch.json`
4. **Extensions**: Change `.vscode/extensions.json`

## Best Practices

1. **Use Tasks**: Prefer VS Code tasks over terminal commands
2. **Debug Mode**: Use debug configurations for development
3. **File Nesting**: Keep related files organized
4. **Extensions**: Install all recommended extensions
5. **Settings**: Don't override workspace settings globally

---

**Note**: This workspace is optimized for the Aegrid project structure and development workflow. Customize as needed for your specific requirements.
