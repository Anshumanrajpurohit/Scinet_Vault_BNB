// Basic heuristic reproducibility scoring
export const ReproScoreService = {
  analyzeManifest(manifest = {}) {
    let score = 0;
    const diagnostics = [];
    const files = (manifest.files || []).map(f => f.name?.toLowerCase?.() || '');
    const has = (n) => files.some((f) => f.endsWith('/' + n) || f === n);

    if (has('readme.md')) { score += 20; diagnostics.push('README found'); }
    else diagnostics.push('Missing README.md');
    if (has('license') || has('license.md')) { score += 10; diagnostics.push('License present'); }
    else diagnostics.push('No license');
    if (has('requirements.txt') || has('environment.yml')) { score += 20; diagnostics.push('Environment specified'); }
    else diagnostics.push('No environment file');
    if (has('dockerfile')) { score += 10; diagnostics.push('Dockerfile present'); }
    if (files.some(f => f.includes('test') || f.includes('__tests__'))) { score += 20; diagnostics.push('Tests detected'); }
    else diagnostics.push('No tests detected');
    if (files.some(f => /package-lock.json|poetry.lock|Pipfile.lock/i.test(f))) { score += 10; diagnostics.push('Pinned dependencies'); }

    return { score: Math.min(100, score), diagnostics };
  },
};
