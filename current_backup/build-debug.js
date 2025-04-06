const { execSync } = require('child_process');
const fs = require('fs');

// Configuration
const memoryLimit = '4096m'; // Increase Node.js memory limit

// Function to run a command and catch errors
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      env: {
        ...process.env,
        NODE_OPTIONS: `--max-old-space-size=${memoryLimit.replace('m', '')}`
      }
    });
    console.log('Command succeeded');
    return { success: true, output };
  } catch (error) {
    console.error('Command failed with error:');
    console.error(error.message);
    return { 
      success: false, 
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }
}

// Main build process
console.log('=== BUILD DEBUG SCRIPT ===');
console.log('Environment:');
console.log(`Node.js: ${process.version}`);
console.log(`Memory limit: ${memoryLimit}`);
console.log('Working directory:', process.cwd());

// Check for package.json
console.log('\nChecking for package.json...');
if (!fs.existsSync('./package.json')) {
  console.error('ERROR: package.json not found!');
  process.exit(1);
}

// Check next.config.js
console.log('\nChecking next.config.js...');
if (fs.existsSync('./next.config.js')) {
  console.log('next.config.js found');
} else {
  console.log('next.config.js not found, will use defaults');
}

// Install dependencies
console.log('\nInstalling dependencies...');
const installResult = runCommand('npm install --legacy-peer-deps --no-audit --no-fund');
if (!installResult.success) {
  console.error('Failed to install dependencies');
  process.exit(1);
}

// Run build
console.log('\nRunning build...');
const buildResult = runCommand('npx --no-install next build');

// Save diagnostics
const diagnostics = {
  timestamp: new Date().toISOString(),
  nodeVersion: process.version,
  memoryLimit,
  buildSuccess: buildResult.success,
  buildOutput: buildResult.success ? buildResult.output : buildResult.stderr
};

fs.writeFileSync('./build-diagnostics.json', JSON.stringify(diagnostics, null, 2));
console.log('\nBuild diagnostics saved to build-diagnostics.json');

// Exit with appropriate code
process.exit(buildResult.success ? 0 : 1); 