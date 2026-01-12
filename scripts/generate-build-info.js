#!/usr/bin/env node

/**
 * This script generates a JSON file with build information including
 * the last commit timestamp and details.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define output path once
const outputPath = path.join(__dirname, '..', 'public', 'build-info.json');

try {
  // Get the last commit information
  const lastCommitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  const lastCommitDate = execSync('git log -1 --format=%ai', { encoding: 'utf8' }).trim();
  const lastCommitAuthor = execSync('git log -1 --format=%an', { encoding: 'utf8' }).trim();
  const lastCommitMessage = execSync('git log -1 --format=%s', { encoding: 'utf8' }).trim();

  const buildInfo = {
    lastCommit: {
      hash: lastCommitHash,
      date: lastCommitDate,
      author: lastCommitAuthor,
      message: lastCommitMessage,
    },
    buildDate: new Date().toISOString(),
  };

  // Write to public directory so it's accessible at runtime
  fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

  console.log('Build info generated successfully:', outputPath);
  console.log(buildInfo);
} catch (error) {
  console.error('Error generating build info:', error.message);
  // Create a fallback file if git is not available
  const fallbackInfo = {
    lastCommit: {
      hash: 'unknown',
      date: new Date().toISOString(),
      author: 'unknown',
      message: 'Build info not available',
    },
    buildDate: new Date().toISOString(),
  };
  fs.writeFileSync(outputPath, JSON.stringify(fallbackInfo, null, 2));
  console.log('Fallback build info created');
}
