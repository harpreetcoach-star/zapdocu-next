This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## PDF password protection

Protect PDF uses the bundled [`@pdfsmaller/pdf-encrypt`](https://github.com/smither777/pdf-encrypt) library to apply AES-256 standard PDF encryption (revision 6). Encryption runs locally through Web Crypto, with no document or password uploads. Production must use HTTPS; localhost also supports Web Crypto. `output: 'export'` remains enabled, and no API route or server is needed.

The user's password is required to open the downloaded PDF. A random owner password declares the existing print/edit/copy restrictions; reader permissions are advisory. Already-encrypted inputs are rejected rather than encrypted a second time. Empty/invisible passwords and passwords exceeding 127 UTF-8 bytes after PDF password normalization are rejected. Errors never return an unencrypted fallback.

Run the regression checks with Node 22.13+ (tested with Node 24):

```bash
npm run test:pdf-protection
npm run build
npm run test:pdf-protection:browser
npm run lint
```

The browser test uses installed Chrome on Windows by default. Set `CHROME_PATH` to its executable on another system. It serves `out/` locally and checks previews, encryption, downloads, failure states, and password enforcement in both PDF.js and Chrome's native PDFium viewer. Preview loading uses the existing PDF.js CDN and needs internet access. PDF.js and Playwright Core are development dependencies only.

For manual reader compatibility checks, download a protected PDF, open it in Adobe Acrobat and macOS Preview, verify that a missing/wrong password cannot open it, and verify that the correct password reveals the original pages and form contents. Those applications are not exercised by the automated tests.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
