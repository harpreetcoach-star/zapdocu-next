/** Apply a real PDF open password locally; pdf-lib's save() cannot encrypt. */
export async function protectPDF(file, password) {
  if (typeof password !== 'string' || !password.length) {
    throw new Error('Please enter a password.');
  }
  if (!globalThis.crypto?.subtle) {
    throw new Error('PDF encryption requires a secure connection. Open this site over HTTPS and try again.');
  }

  // Loaded only when protecting a document, and bundled with the static site.
  const { encryptPDF, saslPrep } = await import('@pdfsmaller/pdf-encrypt');
  const preparedPassword = saslPrep(password);
  const passwordBytes = new TextEncoder().encode(preparedPassword);
  if (!preparedPassword.trim()) {
    throw new Error('Please use a password containing visible characters.');
  }
  if (passwordBytes.length > 127) {
    throw new Error('The password must be at most 127 UTF-8 bytes. Please choose a shorter password.');
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  // Keep the permissions password separate from the user's open password.
  // Generate it locally; neither password is sent to a server or stored.
  const ownerPassword = Array.from(crypto.getRandomValues(new Uint8Array(32)),
    (byte) => byte.toString(16).padStart(2, '0')).join('');

  // The library rejects already-encrypted inputs instead of double-encrypting
  // ciphertext. Never fall back to an unencrypted download on failure.
  const encryptedBytes = await encryptPDF(bytes, password, {
    algorithm: 'AES-256',
    ownerPassword,
    allowPrinting: false,
    allowHighQualityPrint: false,
    allowModifying: false,
    allowCopying: false,
    allowAnnotating: false,
    allowFillingForms: false,
    allowExtraction: false,
    allowAssembly: false,
  });
  return new Blob([encryptedBytes], { type: 'application/pdf' });
}
