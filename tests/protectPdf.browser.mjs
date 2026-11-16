import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, access } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright-core';
import { PDFDocument } from 'pdf-lib';
import { getDocument, PasswordResponses } from 'pdfjs-dist/legacy/build/pdf.mjs';

// Run after npm run build. Uses installed Chrome; CHROME_PATH overrides it.
const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
await access(chromePath);
const root = resolve('out');
await access(resolve(root, 'tools/protect-pdf.html'));
let downloadedPDF;
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.pdf': 'application/pdf' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/protected.pdf' && downloadedPDF) {
      res.writeHead(200, { 'Content-Type': 'application/pdf' });
      res.end(downloadedPDF);
      return;
    }
    let filename = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!filename.startsWith(root + sep)) throw new Error('Invalid path');
    if (!extname(filename)) filename += '.html';
    const data = await readFile(filename);
    res.writeHead(200, { 'Content-Type': mime[extname(filename)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage({ acceptDownloads: true });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const uploadedRequests = [];
  page.on('request', req => {
    if (req.postDataBuffer()) uploadedRequests.push(`${req.method()} ${req.url()}`);
  });
  await page.goto(`${origin}/tools/protect-pdf`);
  await page.waitForFunction(() => !!window.pdfjsLib, { timeout: 30000 });
  const doc = await PDFDocument.create();
  doc.addPage().drawText('Browser encryption regression fixture');
  await page.getByLabel('PDF to protect').setInputFiles({
    name: 'fixture.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await doc.save()),
  });
  await page.getByText('Loaded fixture.pdf successfully.', { exact: true }).waitFor();
  await page.getByLabel('Set Password', { exact: true }).fill('Browser-test-secret!42');
  await page.getByLabel('Confirm Password', { exact: true }).fill('mismatch');
  await page.getByRole('button', { name: 'Encrypt & Protect PDF' }).click();
  await page.getByText('Passwords do not match.', { exact: true }).waitFor();
  assert.equal(await page.getByRole('link', { name: 'Download Protected PDF' }).count(), 0);
  await page.getByLabel('Confirm Password', { exact: true }).fill('Browser-test-secret!42');
  await page.getByRole('button', { name: 'Encrypt & Protect PDF' }).click();
  await page.getByText('Success! PDF successfully encrypted.', { exact: true }).waitFor();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download Protected PDF' }).click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), 'protected-document.pdf');
  downloadedPDF = await readFile(await download.path());
  for (const password of [undefined, 'wrong-password', 'Browser-test-secret!42']) {
    const task = getDocument({
      data: new Uint8Array(downloadedPDF), password,
      standardFontDataUrl: resolve('node_modules/pdfjs-dist/standard_fonts').replaceAll('\\', '/') + '/',
    });
    try {
      if (password === 'Browser-test-secret!42') {
        const pdf = await task.promise;
        assert.equal(pdf.numPages, 1);
        const text = await (await pdf.getPage(1)).getTextContent();
        assert.ok(text.items.some(item => item.str === 'Browser encryption regression fixture'));
      } else {
        await assert.rejects(task.promise, error => error.name === 'PasswordException' &&
          error.code === (password ? PasswordResponses.INCORRECT_PASSWORD : PasswordResponses.NEED_PASSWORD));
      }
    } finally {
      await task.destroy();
    }
  }
  await page.getByLabel('Set Password', { exact: true }).fill('changed-password');
  assert.equal(await page.getByRole('link', { name: 'Download Protected PDF' }).count(), 0);
  await page.getByLabel('Set Password', { exact: true }).fill('a'.repeat(128));
  await page.getByLabel('Confirm Password', { exact: true }).fill('a'.repeat(128));
  await page.getByRole('button', { name: 'Encrypt & Protect PDF' }).click();
  await page.getByText('The password must be at most 127 UTF-8 bytes. Please choose a shorter password.', { exact: true }).waitFor();
  assert.equal(await page.getByRole('link', { name: 'Download Protected PDF' }).count(), 0);
  assert.deepEqual(uploadedRequests, [], 'Document processing must not upload data');
  assert.deepEqual(errors, []);

  // Exercise Chrome's built-in PDFium viewer as well as the independent PDF.js reader.
  const nativeViewer = await browser.newPage();
  const viewerReady = nativeViewer.waitForEvent('framenavigated', {
    predicate: frame => frame.url().startsWith('chrome-extension://'),
  });
  await nativeViewer.goto(`${origin}/protected.pdf`);
  const viewer = await viewerReady;
  const passwordInput = viewer.locator('input[type="password"]');
  await passwordInput.waitFor({ state: 'visible' });
  await passwordInput.fill('wrong-password');
  await passwordInput.press('Enter');
  await viewer.locator('cr-input[invalid]').waitFor();
  assert.ok(await passwordInput.isVisible());
  await passwordInput.fill('Browser-test-secret!42');
  await passwordInput.press('Enter');
  await passwordInput.waitFor({ state: 'hidden' });
  console.log('PASS Chrome static export: preview, mismatch validation, Web Crypto encryption, download, content preservation, stale download removal, no uploads');
  console.log('PASS password enforcement in independent PDF.js and native Chrome PDFium: missing/wrong passwords rejected; correct password opens');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
