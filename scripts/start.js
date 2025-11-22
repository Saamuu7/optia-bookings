import { existsSync, copyFileSync } from 'fs';
import { spawn, spawnSync } from 'child_process';

function run(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true });
    child.on('exit', code => (code === 0 ? resolve(code) : reject(new Error(`${cmd} exited ${code}`))));
    child.on('error', reject);
  });
}

function isAvailable(cmd) {
  try {
    const result = spawnSync(cmd, ['--version'], { stdio: 'ignore', shell: true });
    return result.status === 0;
  } catch {
    return false;
  }
}

function choosePackageManager() {
  // Prefer manager based on lockfile and availability
  if (existsSync('bun.lockb') && isAvailable('bun')) return 'bun';
  if (existsSync('pnpm-lock.yaml') && isAvailable('pnpm')) return 'pnpm';
  if (existsSync('yarn.lock') && isAvailable('yarn')) return 'yarn';
  if (isAvailable('npm')) return 'npm';
  // fallback to npm command even if detection failed
  return 'npm';
}

(async () => {
  try {
    console.log('Preparando el proyecto...');

    // Node version check
    const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
    if (Number.isInteger(nodeMajor) && nodeMajor < 18) {
      console.warn(`Advertencia: Node ${process.versions.node} detectado. Recomendado Node 18+.`);
    }

    const pkgManager = choosePackageManager();
    console.log(`Usando gestor de paquetes detectado: ${pkgManager}`);

    // For development we prefer to run Vite bound to localhost for security
    // (avoid exposing the network URL during `npm start`). If the user
    // explicitly wants network access they can run `npm run dev` manually.

    // 1) instalar dependencias si falta node_modules
    if (!existsSync('node_modules')) {
      console.log('No se detectó `node_modules`. Instalando dependencias...');
      try {
        if (pkgManager === 'bun') await run('bun', ['install']);
        else if (pkgManager === 'pnpm') await run('pnpm', ['install']);
        else if (pkgManager === 'yarn') await run('yarn', []);
        else await run('npm', ['install']);
      } catch (err) {
        console.warn('La instalación con el gestor detectado falló, intentando con `npm install` como fallback...');
        await run('npm', ['install']);
      }
    } else {
      console.log('`node_modules` ya existe, saltando instalación.');
    }

    // 2) copiar .env si no existe
    if (!existsSync('.env') && existsSync('.env.example')) {
      console.log('No se detectó `.env`. Creando a partir de `.env.example`...');
      copyFileSync('.env.example', '.env');
      console.log('Se creó `.env` desde `.env.example`. Revisa y actualiza las variables sensibles si es necesario.');
    } else if (!existsSync('.env') && !existsSync('.env.example')) {
      console.log('No se encontró `.env` ni `.env.example`. Continúo sin archivo de entorno.');
    } else {
      console.log('`.env` ya existe, saltando creación.');
    }

    // 3) arrancar servidor de desarrollo (vite)
    console.log('Iniciando servidor de desarrollo...');
    try {
      if (pkgManager === 'bun') await run('bun', ['run', 'dev']);
      else if (pkgManager === 'pnpm') await run('pnpm', ['run', 'dev']);
      else if (pkgManager === 'yarn') await run('yarn', ['dev']);
      else await run('npm', ['run', 'dev']);
    } catch (err) {
      console.error('Error al iniciar el servidor de desarrollo con el gestor elegido:', err.message || err);
      console.log('Intentando `npm run dev` como fallback...');
      await run('npm', ['run', 'dev']);
    }
  } catch (err) {
    console.error('\nError durante el proceso de arranque:', err.message || err);
    process.exit(1);
  }
})();
