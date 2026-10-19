/**
 * The PDF.js worker for `DocumentViewer`, at the exact PDF.js version
 * Scalewing pins and from the same legacy build: a module worker entry
 * that starts PDF.js's worker on import. A consumer bundles it as a worker
 * and passes its URL as `workerSrc`, such as Vite's
 * `import workerSrc from '@scalewing/react/document-viewer-worker?worker&url'`,
 * so the viewer and its worker are always the same version.
 */
import 'pdfjs-dist/legacy/build/pdf.worker.min.mjs';
