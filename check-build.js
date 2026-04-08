const { execSync } = require('child_process');
try {
  const build = execSync('npm run build', { encoding: 'utf-8', stdio: 'pipe' });
  console.log("BUILD SUCCESS:");
  console.log(build);
} catch (e) {
  console.log("BUILD ERROR:");
  console.log(e.stdout);
  console.log(e.stderr);
}
