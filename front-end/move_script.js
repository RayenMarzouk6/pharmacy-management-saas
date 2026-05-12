const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'app');
const dashboardDir = path.join(root, '(dashboard)');
const appDir = path.join(root, '(app)');

if (fs.existsSync(dashboardDir)) {
  fs.renameSync(dashboardDir, appDir);
}

const dirsToCreate = [
  path.join(appDir, 'admin'),
  path.join(appDir, 'superadmin'),
  path.join(appDir, 'pos')
];

dirsToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const moves = [
  { src: path.join(appDir, 'dashboard'), dest: path.join(appDir, 'admin', 'dashboard') },
  { src: path.join(appDir, 'medicaments'), dest: path.join(appDir, 'admin', 'medicaments') },
  { src: path.join(appDir, 'fournisseurs'), dest: path.join(appDir, 'admin', 'fournisseurs') },
  { src: path.join(appDir, 'ventes'), dest: path.join(appDir, 'admin', 'ventes') },
  { src: path.join(appDir, 'pharmaciens'), dest: path.join(appDir, 'admin', 'pharmaciens') },
  { src: path.join(appDir, 'pharmacies'), dest: path.join(appDir, 'superadmin', 'pharmacies') }
];

moves.forEach(move => {
  if (fs.existsSync(move.src)) {
    fs.renameSync(move.src, move.dest);
  }
});

// For POS, move the contents of caisse to pos
const caisseDir = path.join(appDir, 'caisse');
const posDir = path.join(appDir, 'pos');
if (fs.existsSync(caisseDir)) {
  const files = fs.readdirSync(caisseDir);
  files.forEach(file => {
    fs.renameSync(path.join(caisseDir, file), path.join(posDir, file));
  });
  fs.rmdirSync(caisseDir);
}

console.log("Move complete.");
