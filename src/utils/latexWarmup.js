const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

async function makeTempDir() {
  const base = path.join(os.tmpdir(), 'latex-warm-');
  return await fsp.mkdtemp(base);
}

async function safeRmDir(dir) {
  try { await fsp.rm(dir, { recursive: true, force: true }); } catch (_) {}
}

function startLatexWarmup() {
  if (process.env.LATEX_WARMUP === '0' || process.env.LATEX_WARMUP === 'false') {
    return; // disabled explicitly
  }
  const tectonicCmd = process.env.TECTONIC_PATH || 'tectonic';
  (async () => {
    const tmpDir = await makeTempDir();
    const texPath = path.join(tmpDir, 'warm.tex');
    const content = '\\documentclass{article}\n\\begin{document}\nWarmup\\end{document}';
    await fsp.writeFile(texPath, content, 'utf8');
    const args = ['-o', tmpDir, 'warm.tex'];
    const child = spawn(tectonicCmd, args, { cwd: tmpDir, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    let timedOut = false;
    const timeout = Number(process.env.LATEX_WARMUP_TIMEOUT_MS || 60000);
    const timer = setTimeout(() => { timedOut = true; try { child.kill('SIGKILL'); } catch (_) {} }, timeout);
    child.on('close', async (code) => {
      clearTimeout(timer);
      if (timedOut) console.warn('[compile] Warmup timed out');
      else if (code !== 0) console.warn(`[compile] Warmup exited with code ${code}`);
      else console.log('[compile] Warmup complete');
      await safeRmDir(tmpDir);
    });
    child.on('error', async (err) => {
      clearTimeout(timer);
      console.warn('[compile] Warmup failed to start:', err && err.message ? err.message : String(err));
      await safeRmDir(tmpDir);
    });
  })().catch((e) => console.warn('[compile] Warmup error:', e && e.message ? e.message : String(e)));
}

module.exports = { startLatexWarmup };
