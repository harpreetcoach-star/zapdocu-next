import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolve } from 'node:path';
import { PDFDocument, PDFName } from 'pdf-lib';
import { getDocument, PasswordResponses } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { protectPDF } from '../src/utils/pdfProtection.js';

async function fixture() {
  const doc = await PDFDocument.create();
  doc.setTitle('Private document (metadata)');
  doc.addPage([300, 400]).drawText('Confidential first page');
  const page = doc.addPage([500, 600]);
  page.drawText('Confidential second page', { y: 500 });
  const field = doc.getForm().createTextField('Customer (name)');
  field.setText('Private form value');
  field.addToPage(page, { x: 20, y: 20, width: 200, height: 25 });
  return new Blob([await doc.save()], { type: 'application/pdf' });
}

async function readPDF(blob, password, inspect = () => {}) {
  const task = getDocument({
    data: new Uint8Array(await blob.arrayBuffer()),
    password,
    standardFontDataUrl: resolve('node_modules/pdfjs-dist/standard_fonts').replaceAll('\\', '/') + '/',
  });
  try {
    return await inspect(await task.promise);
  } finally {
    await task.destroy();
  }
}

test('AES-256 requires the password and preserves pages, metadata and form fields', async () => {
  const original = await fixture();
  const encrypted = await protectPDF(original, 'Strong-test-password!42');
  assert.equal(encrypted.type, 'application/pdf');
  const parsed = await PDFDocument.load(await encrypted.arrayBuffer(), { ignoreEncryption: true });
  assert.equal(parsed.isEncrypted, true);
  const encryption = parsed.context.lookup(parsed.context.trailerInfo.Encrypt);
  assert.equal(encryption.get(PDFName.of('V')).asNumber(), 5);
  assert.equal(encryption.get(PDFName.of('R')).asNumber(), 6);
  assert.equal(encryption.get(PDFName.of('Length')).asNumber(), 256);

  for (const password of [undefined, '', 'incorrect-password']) {
    await assert.rejects(readPDF(encrypted, password), (error) => {
      assert.equal(error.name, 'PasswordException');
      assert.equal(error.code, password ? PasswordResponses.INCORRECT_PASSWORD : PasswordResponses.NEED_PASSWORD);
      return true;
    });
  }
  await readPDF(encrypted, 'Strong-test-password!42', async (pdf) => {
    assert.equal(pdf.numPages, 2);
    assert.deepEqual((await pdf.getPage(1)).view, [0, 0, 300, 400]);
    const page = await pdf.getPage(2);
    assert.deepEqual(page.view, [0, 0, 500, 600]);
    assert.ok((await page.getTextContent()).items.some(item => item.str === 'Confidential second page'));
    assert.equal((await pdf.getMetadata()).info.Title, 'Private document (metadata)');
    const fields = await pdf.getFieldObjects();
    assert.ok(fields.get('Customer (name)').some(field => field.value === 'Private form value'));
  });
  await readPDF(original, undefined, (pdf) => assert.equal(pdf.numPages, 2));
  await assert.rejects(protectPDF(encrypted, 'another-password'), /already password-protected/);
});

test('non-ASCII passwords work in an independent PDF reader', async () => {
  const encrypted = await protectPDF(await fixture(), 'S\u00e9curit\u00e9-\u79d8\u5bc6-42!');
  await readPDF(encrypted, 'S\u00e9curit\u00e9-\u79d8\u5bc6-42!', (pdf) => assert.equal(pdf.numPages, 2));
  await assert.rejects(readPDF(encrypted, 'Securite-42!'), { name: 'PasswordException' });
});

test('rejects empty, invisible, oversized passwords and invalid PDF inputs', async () => {
  const file = await fixture();
  for (const password of [undefined, '', '   ', '\u00ad', '\u200b']) {
    await assert.rejects(protectPDF(file, password), /password/i);
  }
  await assert.rejects(protectPDF(file, 'a'.repeat(128)), /127 UTF-8 bytes/);
  await assert.rejects(protectPDF(new Blob(['not a PDF']), 'secret'), /Failed to encrypt PDF/);
});

test('fails closed when Web Crypto is unavailable', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  const file = await fixture();
  try {
    Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
    await assert.rejects(protectPDF(file, 'secret'), /secure connection/);
  } finally {
    Object.defineProperty(globalThis, 'crypto', descriptor);
  }
});
