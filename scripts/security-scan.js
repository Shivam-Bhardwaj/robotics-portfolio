#!/usr/bin/env node

/**
 * Security scanning script for the robotics portfolio
 * Performs various security checks on the codebase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SecurityScanner {
  constructor() {
    this.issues = [];
    this.srcDir = path.join(__dirname, '..', 'src');
    this.publicDir = path.join(__dirname, '..', 'public');
    this.rootDir = path.join(__dirname, '..');
  }

  log(message, type = 'info') {
    const prefix = {
      info: '📋',
      warn: '⚠️ ',
      error: '❌',
      success: '✅'
    }[type];
    
    console.log(`${prefix} ${message}`);
  }

  addIssue(severity, message, file = '') {
    this.issues.push({ severity, message, file });
    this.log(`${severity.toUpperCase()}: ${message} ${file ? `(${file})` : ''}`, 
             severity === 'high' ? 'error' : 'warn');
  }

  // Check for hardcoded secrets
  checkForSecrets() {
    this.log('🔍 Scanning for hardcoded secrets...');
    
    const secretPatterns = [
      { pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'password' },
      { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'API key' },
      { pattern: /(?:secret|token)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'secret/token' },
      { pattern: /(?:private[_-]?key|privatekey)\s*[:=]\s*['"][^'"]+['"]/gi, name: 'private key' },
      { pattern: /sk_live_[a-zA-Z0-9]+/g, name: 'Stripe live key' },
      { pattern: /pk_live_[a-zA-Z0-9]+/g, name: 'Stripe publishable key' },
    ];

    this.scanDirectory(this.srcDir, secretPatterns);
  }

  // Check for unsafe dependencies
  checkDependencies() {
    this.log('🔍 Checking dependencies for vulnerabilities...');
    
    try {
      const auditResult = execSync('npm audit --json', { 
        cwd: this.rootDir,
        encoding: 'utf8'
      });
      
      const audit = JSON.parse(auditResult);
      
      if (audit.vulnerabilities) {
        Object.entries(audit.vulnerabilities).forEach(([pkg, vuln]) => {
          if (vuln.severity === 'high' || vuln.severity === 'critical') {
            this.addIssue('high', 
              `Vulnerable dependency: ${pkg} (${vuln.severity})`,
              'package.json'
            );
          } else if (vuln.severity === 'moderate') {
            this.addIssue('medium', 
              `Moderate vulnerability in dependency: ${pkg}`,
              'package.json'
            );
          }
        });
      }
    } catch (error) {
      // npm audit might exit with non-zero code if vulnerabilities found
      if (error.stdout) {
        try {
          const audit = JSON.parse(error.stdout);
          if (audit.vulnerabilities && Object.keys(audit.vulnerabilities).length > 0) {
            this.addIssue('medium', 
              `Found ${Object.keys(audit.vulnerabilities).length} vulnerable dependencies`,
              'package.json'
            );
          }
        } catch (parseError) {
          this.log('Could not parse npm audit results', 'warn');
        }
      }
    }
  }

  // Check for unsafe coding patterns
  checkUnsafePatterns() {
    this.log('🔍 Scanning for unsafe coding patterns...');
    
    const unsafePatterns = [
      { 
        pattern: /dangerouslySetInnerHTML/g, 
        name: 'dangerouslySetInnerHTML usage',
        severity: 'medium'
      },
      { 
        pattern: /eval\s*\(/g, 
        name: 'eval() usage',
        severity: 'high'
      },
      { 
        pattern: /innerHTML\s*=\s*[^;]+;/g, 
        name: 'innerHTML assignment',
        severity: 'medium'
      },
      { 
        pattern: /document\.write\s*\(/g, 
        name: 'document.write usage',
        severity: 'medium'
      },
      { 
        pattern: /window\[.*\]/g, 
        name: 'Dynamic window property access',
        severity: 'low'
      },
    ];

    this.scanDirectory(this.srcDir, unsafePatterns, true);
  }

  // Check file permissions and structure
  checkFilePermissions() {
    this.log('🔍 Checking file permissions and structure...');
    
    // Check for sensitive files that shouldn't be public
    const sensitiveFiles = [
      '.env',
      '.env.local',
      '.env.development',
      '.env.production',
      'config.json',
      'secrets.json',
    ];

    sensitiveFiles.forEach(file => {
      const filePath = path.join(this.publicDir, file);
      if (fs.existsSync(filePath)) {
        this.addIssue('high', 
          `Sensitive file exposed in public directory: ${file}`,
          filePath
        );
      }
    });

    // Check for backup files
    this.checkForBackupFiles(this.srcDir);
    this.checkForBackupFiles(this.publicDir);
  }

  checkForBackupFiles(dir) {
    const backupPatterns = [
      /\.bak$/,
      /\.backup$/,
      /\.old$/,
      /\.tmp$/,
      /~$/,
    ];

    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.checkForBackupFiles(filePath);
      } else {
        backupPatterns.forEach(pattern => {
          if (pattern.test(file)) {
            this.addIssue('medium', 
              `Backup file found: ${file}`,
              filePath
            );
          }
        });
      }
    });
  }

  // Check for proper CSP configuration
  checkContentSecurityPolicy() {
    this.log('🔍 Checking Content Security Policy configuration...');
    
    // Check if CSP is configured in Next.js config
    const nextConfigPath = path.join(this.rootDir, 'next.config.ts');
    
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      if (!configContent.includes('contentSecurityPolicy')) {
        this.addIssue('medium', 
          'No Content Security Policy found in Next.js config',
          'next.config.ts'
        );
      }
    }
  }

  // Scan directory for patterns
  scanDirectory(dir, patterns, includeSeverity = false) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.scanDirectory(filePath, patterns, includeSeverity);
      } else if (/\.(js|jsx|ts|tsx|json)$/.test(file)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        patterns.forEach(({ pattern, name, severity = 'medium' }) => {
          const matches = content.match(pattern);
          if (matches) {
            const issueLevel = includeSeverity ? severity : 'medium';
            this.addIssue(issueLevel, 
              `Found ${name}: ${matches.length} occurrence(s)`,
              path.relative(this.rootDir, filePath)
            );
          }
        });
      }
    });
  }

  // Check for proper error handling
  checkErrorHandling() {
    this.log('🔍 Checking error handling patterns...');
    
    const errorPatterns = [
      { 
        pattern: /console\.(log|error|warn|info)\s*\(/g, 
        name: 'Console statements (should be removed in production)',
        severity: 'low'
      },
      { 
        pattern: /throw\s+new\s+Error\s*\(\s*['"][^'"]*['"][^)]*\)/g, 
        name: 'Generic error throwing (consider custom error types)',
        severity: 'low'
      },
    ];

    this.scanDirectory(this.srcDir, errorPatterns, true);
  }

  // Check TypeScript configuration
  checkTypeScriptConfig() {
    this.log('🔍 Checking TypeScript configuration...');
    
    const tsconfigPath = path.join(this.rootDir, 'tsconfig.json');
    
    if (fs.existsSync(tsconfigPath)) {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      
      // Check for strict mode
      if (!tsconfig.compilerOptions?.strict) {
        this.addIssue('medium', 
          'TypeScript strict mode is not enabled',
          'tsconfig.json'
        );
      }
      
      // Check for noImplicitAny
      if (tsconfig.compilerOptions?.noImplicitAny === false) {
        this.addIssue('low', 
          'TypeScript noImplicitAny is disabled',
          'tsconfig.json'
        );
      }
    } else {
      this.addIssue('medium', 
        'No TypeScript configuration found',
        'tsconfig.json'
      );
    }
  }

  // Generate security report
  generateReport() {
    this.log('\n🔍 Security Scan Summary', 'info');
    this.log('='.repeat(50));
    
    const severityCounts = {
      high: 0,
      medium: 0,
      low: 0
    };

    this.issues.forEach(issue => {
      severityCounts[issue.severity]++;
    });

    this.log(`High severity issues: ${severityCounts.high}`, 
             severityCounts.high > 0 ? 'error' : 'success');
    this.log(`Medium severity issues: ${severityCounts.medium}`, 
             severityCounts.medium > 0 ? 'warn' : 'success');
    this.log(`Low severity issues: ${severityCounts.low}`, 'info');

    if (this.issues.length === 0) {
      this.log('\n🎉 No security issues found!', 'success');
    } else {
      this.log(`\n📋 Total issues found: ${this.issues.length}`, 'info');
      
      // Group by severity
      ['high', 'medium', 'low'].forEach(severity => {
        const severityIssues = this.issues.filter(i => i.severity === severity);
        if (severityIssues.length > 0) {
          this.log(`\n${severity.toUpperCase()} SEVERITY:`);
          severityIssues.forEach(issue => {
            this.log(`  • ${issue.message} ${issue.file ? `(${issue.file})` : ''}`);
          });
        }
      });
    }

    // Exit with error if high severity issues found
    if (severityCounts.high > 0) {
      process.exit(1);
    }
  }

  // Run all security checks
  async run() {
    this.log('🚀 Starting security scan...', 'info');
    
    this.checkForSecrets();
    this.checkDependencies();
    this.checkUnsafePatterns();
    this.checkFilePermissions();
    this.checkContentSecurityPolicy();
    this.checkErrorHandling();
    this.checkTypeScriptConfig();
    
    this.generateReport();
  }
}

// Run the security scanner
if (require.main === module) {
  const scanner = new SecurityScanner();
  scanner.run().catch(error => {
    console.error('Security scan failed:', error);
    process.exit(1);
  });
}

module.exports = SecurityScanner;