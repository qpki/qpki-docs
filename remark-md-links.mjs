// Remark plugin to transform .md links to Starlight URLs
import { visit } from 'unist-util-visit';
import path from 'path';

export function remarkMdLinks() {
  return (tree, file) => {
    const filePath = file.history[0] || '';

    // Detect source: via symlink from real repo path or via content/docs
    // Use negative lookahead to avoid matching post-quantum-pki-lab
    const isQpkiRepo = /post-quantum-pki(?!-lab)/.test(filePath);
    const isQlabRepo = filePath.includes('post-quantum-pki-lab/');

    // Get directory relative to content/docs (for files accessed via symlink paths)
    const docsMatch = filePath.match(/content\/docs\/(.+)$/);
    const currentDir = docsMatch ? path.dirname(docsMatch[1]) : '';
    const isQpki = currentDir.startsWith('qpki') || isQpkiRepo;
    const isQlab = currentDir.startsWith('qlab') || isQlabRepo;

    visit(tree, 'link', (node) => {
      if (!node.url || node.url.startsWith('http')) return;

      // Handle .md links
      if (node.url.endsWith('.md')) {
        let resolvedPath;

        // QPKI: docs/... links from README.md (repo root) → qpki/...
        if (isQpki && node.url.startsWith('docs/')) {
          resolvedPath = 'qpki/' + node.url.slice(5); // remove 'docs/'
        }
        // QLAB: docs/... links → qlab/docs/...
        else if (isQlab && node.url.startsWith('docs/')) {
          resolvedPath = 'qlab/' + node.url;
        }
        // QLAB: journey/... links → qlab/journey/...
        else if (isQlab && node.url.startsWith('journey/')) {
          resolvedPath = 'qlab/' + node.url;
        }
        // Standard relative path resolution
        else if (docsMatch) {
          resolvedPath = path.join(currentDir, node.url);
        }
        // Fallback for symlinked files: use link as-is with prefix
        else if (isQpki) {
          resolvedPath = 'qpki/' + node.url;
        } else if (isQlab) {
          resolvedPath = 'qlab/' + node.url;
        } else {
          resolvedPath = node.url;
        }

        // Normalize: remove .md, lowercase
        resolvedPath = resolvedPath.replace(/\.md$/i, '').toLowerCase();

        // Clean up path (remove leading ./ or extra slashes, normalize)
        resolvedPath = resolvedPath.replace(/^\.\//, '');
        resolvedPath = path.normalize(resolvedPath).replace(/\\/g, '/');

        node.url = `/${resolvedPath}/`;
      }
      // Handle QLAB journey directory links (e.g. journey/00-revelation/)
      else if (isQlab && /^journey\/\d{2}-[^/]+\/?$/.test(node.url)) {
        const dir = node.url.replace(/\/$/, '');
        node.url = `/qlab/${dir}/readme/`;
      }
    });
  };
}
