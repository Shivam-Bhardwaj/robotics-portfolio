#!/usr/bin/env node

/**
 * Coverage reporting and analysis script
 */

const fs = require('fs');
const path = require('path');

class CoverageReporter {
  constructor() {
    this.coverageDir = path.join(__dirname, '..', 'coverage');
    this.lcovFile = path.join(this.coverageDir, 'lcov.info');
    this.jsonSummaryFile = path.join(this.coverageDir, 'coverage-summary.json');
    this.thresholds = {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    };
  }

  log(message, type = 'info') {
    const prefix = {
      info: '📊',
      warn: '⚠️ ',
      error: '❌',
      success: '✅'
    }[type];
    
    console.log(`${prefix} ${message}`);
  }

  // Parse LCOV file for detailed coverage info
  parseLcovFile() {
    if (!fs.existsSync(this.lcovFile)) {
      this.log('LCOV file not found. Run tests with coverage first.', 'error');
      return null;
    }

    const lcovContent = fs.readFileSync(this.lcovFile, 'utf8');
    const files = [];
    let currentFile = null;

    lcovContent.split('\n').forEach(line => {
      if (line.startsWith('SF:')) {
        currentFile = {
          path: line.substring(3),
          functions: { hit: 0, found: 0 },
          lines: { hit: 0, found: 0 },
          branches: { hit: 0, found: 0 }
        };
        files.push(currentFile);
      } else if (line.startsWith('FNH:')) {
        currentFile.functions.hit = parseInt(line.substring(4));
      } else if (line.startsWith('FNF:')) {
        currentFile.functions.found = parseInt(line.substring(4));
      } else if (line.startsWith('LH:')) {
        currentFile.lines.hit = parseInt(line.substring(3));
      } else if (line.startsWith('LF:')) {
        currentFile.lines.found = parseInt(line.substring(3));
      } else if (line.startsWith('BRH:')) {
        currentFile.branches.hit = parseInt(line.substring(4));
      } else if (line.startsWith('BRF:')) {
        currentFile.branches.found = parseInt(line.substring(4));
      }
    });

    return files;
  }

  // Read JSON summary for overall stats
  readJsonSummary() {
    if (!fs.existsSync(this.jsonSummaryFile)) {
      this.log('Coverage summary JSON not found.', 'error');
      return null;
    }

    return JSON.parse(fs.readFileSync(this.jsonSummaryFile, 'utf8'));
  }

  // Calculate coverage percentage
  calculatePercentage(hit, total) {
    return total === 0 ? 100 : Math.round((hit / total) * 100 * 100) / 100;
  }

  // Generate detailed file-by-file report
  generateFileReport(files) {
    this.log('\n📁 File Coverage Report', 'info');
    this.log('='.repeat(80));

    const lowCoverageFiles = [];

    files.forEach(file => {
      const relativePath = path.relative(process.cwd(), file.path);
      
      // Skip test files and config files
      if (relativePath.includes('test') || 
          relativePath.includes('spec') || 
          relativePath.includes('.config.') ||
          relativePath.includes('node_modules')) {
        return;
      }

      const linesCoverage = this.calculatePercentage(file.lines.hit, file.lines.found);
      const functionsCoverage = this.calculatePercentage(file.functions.hit, file.functions.found);
      const branchesCoverage = this.calculatePercentage(file.branches.hit, file.branches.found);

      const avgCoverage = (linesCoverage + functionsCoverage + branchesCoverage) / 3;

      if (avgCoverage < this.thresholds.lines) {
        lowCoverageFiles.push({
          path: relativePath,
          coverage: avgCoverage,
          lines: linesCoverage,
          functions: functionsCoverage,
          branches: branchesCoverage
        });
      }

      const status = avgCoverage >= this.thresholds.lines ? '✅' : '❌';
      this.log(`${status} ${relativePath}: ${avgCoverage.toFixed(1)}% (L:${linesCoverage}% F:${functionsCoverage}% B:${branchesCoverage}%)`);
    });

    if (lowCoverageFiles.length > 0) {
      this.log('\n⚠️  Files below coverage threshold:', 'warn');
      lowCoverageFiles.forEach(file => {
        this.log(`   ${file.path}: ${file.coverage.toFixed(1)}%`);
      });
    }

    return lowCoverageFiles;
  }

  // Generate summary report
  generateSummaryReport(summary) {
    this.log('\n📈 Coverage Summary', 'info');
    this.log('='.repeat(50));

    const total = summary.total;
    
    const metrics = [
      { name: 'Statements', value: total.statements.pct, threshold: this.thresholds.statements },
      { name: 'Branches', value: total.branches.pct, threshold: this.thresholds.branches },
      { name: 'Functions', value: total.functions.pct, threshold: this.thresholds.functions },
      { name: 'Lines', value: total.lines.pct, threshold: this.thresholds.lines }
    ];

    let allPassed = true;

    metrics.forEach(metric => {
      const status = metric.value >= metric.threshold ? '✅' : '❌';
      const type = metric.value >= metric.threshold ? 'success' : 'error';
      
      if (metric.value < metric.threshold) {
        allPassed = false;
      }

      this.log(`${status} ${metric.name}: ${metric.value}% (threshold: ${metric.threshold}%)`, type);
    });

    return allPassed;
  }

  // Generate trends report (if previous coverage exists)
  generateTrendsReport(summary) {
    const previousCoverageFile = path.join(this.coverageDir, 'previous-coverage.json');
    
    if (!fs.existsSync(previousCoverageFile)) {
      // Save current coverage as baseline
      fs.writeFileSync(previousCoverageFile, JSON.stringify(summary.total, null, 2));
      this.log('\n📊 Baseline coverage saved for future comparisons');
      return;
    }

    const previousCoverage = JSON.parse(fs.readFileSync(previousCoverageFile, 'utf8'));
    const currentCoverage = summary.total;

    this.log('\n📈 Coverage Trends', 'info');
    this.log('='.repeat(50));

    ['statements', 'branches', 'functions', 'lines'].forEach(metric => {
      const current = currentCoverage[metric].pct;
      const previous = previousCoverage[metric].pct;
      const diff = current - previous;
      
      let trend = '→';
      let type = 'info';
      
      if (diff > 0) {
        trend = '↗️';
        type = 'success';
      } else if (diff < 0) {
        trend = '↘️';
        type = 'warn';
      }

      this.log(`${trend} ${metric}: ${current}% (${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%)`, type);
    });

    // Update previous coverage
    fs.writeFileSync(previousCoverageFile, JSON.stringify(currentCoverage, null, 2));
  }

  // Generate HTML badge for README
  generateBadge(summary) {
    const coverage = summary.total.lines.pct;
    let color = 'red';
    
    if (coverage >= 80) color = 'brightgreen';
    else if (coverage >= 70) color = 'yellow';
    else if (coverage >= 60) color = 'orange';

    const badgeUrl = `https://img.shields.io/badge/coverage-${coverage}%25-${color}`;
    
    this.log(`\n🏷️  Coverage Badge: ![Coverage](${badgeUrl})`);
    
    // Save badge info for CI
    const badgeData = {
      coverage: coverage,
      color: color,
      url: badgeUrl,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(this.coverageDir, 'badge.json'), 
      JSON.stringify(badgeData, null, 2)
    );
  }

  // Generate uncovered lines report
  generateUncoveredReport(files) {
    const uncoveredFiles = files.filter(file => {
      const linesCoverage = this.calculatePercentage(file.lines.hit, file.lines.found);
      return linesCoverage < 100 && linesCoverage > 0;
    });

    if (uncoveredFiles.length === 0) {
      this.log('\n🎉 All files have 100% line coverage!', 'success');
      return;
    }

    this.log('\n🔍 Files with uncovered lines:', 'info');
    this.log('='.repeat(50));

    uncoveredFiles.forEach(file => {
      const relativePath = path.relative(process.cwd(), file.path);
      const uncoveredLines = file.lines.found - file.lines.hit;
      const coverage = this.calculatePercentage(file.lines.hit, file.lines.found);
      
      this.log(`📄 ${relativePath}: ${uncoveredLines} uncovered lines (${coverage}%)`);
    });
  }

  // Main report generation
  async run() {
    this.log('🚀 Generating coverage report...', 'info');

    const files = this.parseLcovFile();
    const summary = this.readJsonSummary();

    if (!files || !summary) {
      this.log('Coverage data not available. Please run tests with coverage.', 'error');
      process.exit(1);
    }

    // Generate reports
    const lowCoverageFiles = this.generateFileReport(files);
    const thresholdsPassed = this.generateSummaryReport(summary);
    this.generateTrendsReport(summary);
    this.generateBadge(summary);
    this.generateUncoveredReport(files);

    // Final summary
    this.log('\n🎯 Coverage Report Summary', 'info');
    this.log('='.repeat(50));
    this.log(`Total files analyzed: ${files.length}`);
    this.log(`Files below threshold: ${lowCoverageFiles.length}`);
    this.log(`Overall coverage: ${summary.total.lines.pct}%`);

    if (thresholdsPassed) {
      this.log('\n🎉 All coverage thresholds passed!', 'success');
    } else {
      this.log('\n⚠️  Some coverage thresholds not met. Consider adding more tests.', 'warn');
    }

    // Generate machine-readable report for CI
    const ciReport = {
      timestamp: new Date().toISOString(),
      thresholdsPassed,
      totalCoverage: summary.total.lines.pct,
      lowCoverageFiles: lowCoverageFiles.length,
      metrics: {
        statements: summary.total.statements.pct,
        branches: summary.total.branches.pct,
        functions: summary.total.functions.pct,
        lines: summary.total.lines.pct
      }
    };

    fs.writeFileSync(
      path.join(this.coverageDir, 'ci-report.json'),
      JSON.stringify(ciReport, null, 2)
    );

    // Exit with appropriate code
    if (!thresholdsPassed) {
      process.exit(1);
    }
  }
}

// Run the coverage reporter
if (require.main === module) {
  const reporter = new CoverageReporter();
  reporter.run().catch(error => {
    console.error('Coverage report generation failed:', error);
    process.exit(1);
  });
}

module.exports = CoverageReporter;