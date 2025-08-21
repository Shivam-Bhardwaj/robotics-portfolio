# Deployment Scripts Documentation

## Overview

This document describes the improved deployment and testing scripts for the shivambhardwaj.com portfolio website. These scripts provide a comprehensive, robust deployment pipeline with proper error handling, validation, and testing capabilities.

## 🚀 Quick Start

```bash
# Pre-deployment validation
pre-deploy.bat

# Run all tests
test.bat

# Deploy to Firebase
deploy.bat firebase

# Deploy to Vercel
deploy.bat vercel

# Deploy to both platforms
deploy.bat both
```

## 📋 Script Inventory

### Core Deployment Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `deploy.bat` | Unified deployment pipeline | `deploy.bat [target] [options]` |
| `deploy-firebase.bat` | Firebase-specific deployment | `deploy-firebase.bat` |
| `deploy-vercel.bat` | Vercel-specific deployment | `deploy-vercel.bat` |
| `pre-deploy.bat` | Pre-deployment validation | `pre-deploy.bat` |
| `test.bat` | Comprehensive testing suite | `test.bat [test-type]` |

### Helper Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `build.bat` | Build the application | `build.bat` |
| `dev.bat` | Start development server | `dev.bat` |
| `lint.bat` | Run linting | `lint.bat` |
| `start.bat` | Start production server | `start.bat` |

## 🎯 Main Deployment Script (`deploy.bat`)

### Features
- **Unified Interface**: Single entry point for all deployment targets
- **Interactive Mode**: Menu-driven interface when run without arguments
- **Multiple Targets**: Deploy to Firebase, Vercel, or both
- **Quality Gates**: Automatic testing and validation before deployment
- **Skip Tests Option**: Fast deployment when needed
- **Color-coded Output**: Clear visual feedback with colored console output
- **Comprehensive Error Handling**: Detailed error messages and recovery suggestions

### Usage Examples

```bash
# Interactive mode (shows menu)
deploy.bat

# Deploy to Firebase
deploy.bat firebase

# Deploy to Vercel
deploy.bat vercel

# Deploy to both platforms
deploy.bat both

# Export static files only
deploy.bat static

# Skip tests for faster deployment
deploy.bat firebase --skip-tests

# Show help
deploy.bat help
```

### Deployment Workflow

1. **Environment Check**: Validates Node.js version (≥18.0)
2. **Dependency Management**: Installs/updates npm packages
3. **Code Quality & Testing**: Runs TypeScript, ESLint, and unit tests
4. **Build Application**: Creates optimized production build
5. **Prepare for Deployment**: Exports static files (Firebase) or prepares build (Vercel)
6. **Deploy**: Pushes to selected platform(s)

## 🧪 Testing Script (`test.bat`)

### Features
- **Multiple Test Suites**: Unit, E2E, accessibility, security, performance
- **Selective Testing**: Run specific test types
- **Coverage Reports**: Generate code coverage analysis
- **Watch Mode**: Continuous testing during development
- **Summary Report**: Clear pass/fail statistics

### Test Types

| Type | Command | Description |
|------|---------|-------------|
| All Tests | `test.bat` or `test.bat all` | Runs complete test suite |
| Unit Tests | `test.bat unit` | Component and function tests |
| E2E Tests | `test.bat e2e` | End-to-end browser tests |
| Accessibility | `test.bat a11y` | WCAG compliance tests |
| Security | `test.bat security` | Vulnerability scanning |
| Performance | `test.bat performance` | Lighthouse performance tests |
| Coverage | `test.bat coverage` | Generate coverage report |
| Watch Mode | `test.bat watch` | Auto-run tests on file changes |

### Test Suite Components

When running all tests (`test.bat`), the following checks are performed:

1. **TypeScript Type Checking**: Validates type safety
2. **ESLint Code Quality**: Checks code style and best practices
3. **Unit Tests**: Tests individual components and functions
4. **Integration Tests**: Tests component interactions
5. **Accessibility Tests**: Validates WCAG compliance
6. **Security Audit**: Checks for known vulnerabilities
7. **Build Test**: Verifies successful production build

## 🔍 Pre-deployment Validation (`pre-deploy.bat`)

### Features
- **10-Point Inspection**: Comprehensive environment and project validation
- **Dependency Analysis**: Checks for outdated or vulnerable packages
- **Configuration Verification**: Validates Firebase and Vercel setup
- **Git Status Check**: Warns about uncommitted changes
- **Performance Estimation**: Predicts build time based on project size
- **Clear Recommendations**: Actionable fixes for any issues found

### Validation Checklist

1. **Environment Validation**
   - Node.js version (≥18.0)
   - npm availability
   - Git installation (optional)

2. **Project Structure**
   - Required configuration files
   - Package.json integrity
   - TypeScript configuration

3. **Dependencies Status**
   - node_modules presence
   - Outdated packages check
   - Security vulnerabilities

4. **Firebase Configuration**
   - firebase.json existence
   - CLI installation
   - Authentication status

5. **Vercel Configuration**
   - CLI installation
   - Project linking

6. **Build Configuration**
   - Static export setup
   - Previous build cleanup

7. **Code Quality**
   - TypeScript errors
   - Linting issues

8. **Version Control**
   - Uncommitted changes
   - Current branch
   - Last commit

9. **Performance Metrics**
   - Project size analysis
   - Build time estimation

10. **Domain Configuration**
    - URL verification
    - DNS reminders

## 🔥 Firebase Deployment (`deploy-firebase.bat`)

### Features
- **10-Step Pipeline**: Comprehensive deployment process
- **Static Export**: Automatic Next.js static export
- **Authentication Check**: Ensures Firebase login
- **File Count Verification**: Validates export completeness
- **Deployment URLs**: Shows all accessible URLs post-deployment
- **Browser Launch**: Optional automatic site opening

### Deployment Steps

1. Check Node.js version
2. Verify dependencies
3. Run TypeScript type check
4. Run ESLint
5. Execute unit tests
6. Clean previous builds
7. Build application
8. Export static files
9. Verify Firebase CLI and authentication
10. Deploy to Firebase Hosting

### URLs After Deployment
- `https://anti-mony.web.app`
- `https://anti-mony.firebaseapp.com`
- `https://shivambhardwaj.com` (if DNS configured)

## ⚡ Vercel Deployment (`deploy-vercel.bat`)

### Features
- **9-Step Pipeline**: Optimized for Vercel platform
- **Project Linking**: Automatic detection of linked projects
- **First-time Setup**: Interactive configuration for new projects
- **Production Deployment**: Direct production deployment with `--prod` flag
- **Build Verification**: Ensures `.next` directory exists

### Deployment Steps

1. Check Node.js version
2. Verify dependencies
3. Run TypeScript type check
4. Run ESLint
5. Execute unit tests
6. Clean previous builds
7. Build application
8. Verify Vercel CLI
9. Deploy to Vercel

### Post-deployment Options
- View deployment in Vercel dashboard
- Check deployment logs: `vercel logs`
- List all deployments: `vercel list`
- Manage environment variables: `vercel env`

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### Build Failures
```bash
# Clear cache and rebuild
rmdir /s /q .next node_modules
npm install
npm run build
```

#### TypeScript Errors
```bash
# Check for TypeScript issues
npm run type-check

# Fix common issues
npm install --save-dev @types/react @types/node
```

#### Linting Errors
```bash
# Auto-fix linting issues
npm run lint:fix

# Manual check
npm run lint
```

#### Firebase Login Issues
```bash
# Re-authenticate
firebase logout
firebase login

# Check current user
firebase login:list
```

#### Vercel Login Issues
```bash
# Re-authenticate
vercel logout
vercel login

# Check authentication
vercel whoami
```

#### Security Vulnerabilities
```bash
# View detailed audit report
npm audit

# Auto-fix vulnerabilities
npm audit fix

# Force fixes (use cautiously)
npm audit fix --force
```

## 📊 Exit Codes

All scripts use consistent exit codes:

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Failure/Error |

Scripts can be chained based on exit codes:
```bash
pre-deploy.bat && deploy.bat firebase
```

## 🎨 Color Coding

Scripts use ANSI color codes for better readability:

- 🔴 **Red**: Errors that must be fixed
- 🟡 **Yellow**: Warnings to review
- 🟢 **Green**: Successful operations
- 🔵 **Blue**: Informational headers
- 🟣 **Magenta**: Main titles
- 🔷 **Cyan**: Section headers

## 🔒 Security Considerations

1. **Never commit sensitive data** to version control
2. **Use environment variables** for API keys and secrets
3. **Run security audits** regularly: `npm audit`
4. **Keep dependencies updated**: `npm update`
5. **Review deployment logs** for sensitive information leakage

## 📈 Best Practices

1. **Always run pre-deployment validation** before deploying
2. **Commit changes** before deployment for rollback capability
3. **Test locally** with `npm run dev` before deployment
4. **Monitor deployment** through platform dashboards
5. **Keep scripts updated** as project requirements change
6. **Document custom modifications** to scripts
7. **Use `--skip-tests` sparingly** and only for hotfixes

## 🔄 Continuous Improvement

### Adding New Tests
Edit `test.bat` to add new test suites:
```batch
:run_custom
echo Running custom tests...
call npm run test:custom
goto :show_results
```

### Customizing Deployment
Modify `deploy.bat` for additional platforms:
```batch
if "%DEPLOY_TARGET%"=="netlify" call :deploy_netlify
```

### Environment-Specific Configuration
Add environment checks in `pre-deploy.bat`:
```batch
if "%NODE_ENV%"=="production" (
    echo Production environment detected
)
```

## 📝 Maintenance

### Regular Updates
- Update Node.js version requirements as needed
- Add new validation checks for new dependencies
- Update URLs when domains change
- Refresh color codes for new Windows Terminal versions

### Script Versioning
Current versions:
- `deploy.bat`: v2.0
- `test.bat`: v1.5
- `pre-deploy.bat`: v1.0
- `deploy-firebase.bat`: v2.0
- `deploy-vercel.bat`: v2.0

## 🤝 Contributing

When modifying deployment scripts:

1. Test changes thoroughly in a development environment
2. Update this documentation
3. Maintain backward compatibility
4. Add error handling for new features
5. Use consistent color coding and formatting
6. Include helpful error messages

## 📞 Support

For issues with deployment scripts:

1. Run `pre-deploy.bat` for diagnostics
2. Check script output for specific error messages
3. Review this documentation
4. Check platform-specific documentation:
   - [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
   - [Vercel Docs](https://vercel.com/docs)
   - [Next.js Deployment](https://nextjs.org/docs/deployment)

---

*Last Updated: January 2025*
*Scripts Version: 2.0*
*Compatible with: Windows 10/11 with ANSI color support*
