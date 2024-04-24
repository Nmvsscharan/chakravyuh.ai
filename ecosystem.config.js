try {
  const execSync = require('child_process').execSync;
  const output = execSync('yarn dev', { encoding: 'utf-8' });
  console.log('Output was:\n', output);
} catch (error) {
  console.error('Error occurred:', error);
}
