// Append links here to extend the footer without changing its markup.
// Omit href and set comingSoon for features that are not available yet.
export const pdfSuiteLinks = [
  { label: 'Merge PDF', href: '/tools/merge-pdf' },
  { label: 'Split PDF', href: '/tools/split-pdf' },
  { label: 'Rearrange PDF', href: '/tools/rearrange-pdf' },
  { label: 'Rotate PDF', href: '/tools/rotate-pdf' },
  { label: 'Extract Pages', href: '/tools/extract-pages' },
  { label: 'Watermark PDF', href: '/tools/watermark-pdf' },
  { label: 'Compress PDF', href: '/tools/compress-pdf' },
  { label: 'PDF to Word', href: '/tools/pdf-to-word' },
  { label: 'Word to PDF', href: '/tools/word-to-pdf' },
];

export const conversionSecurityLinks = [
  { label: 'Excel to PDF', href: '/tools/excel-to-pdf' },
  { label: 'PDF to JPG', href: '/tools/pdf-to-jpg' },
  { label: 'JPG to PDF', href: '/tools/jpg-to-pdf' },
  { label: 'HEIC to JPG', href: '/tools/heic-to-jpg' },
  { label: 'Add Page Numbers', href: '/tools/add-page-numbers' },
  { label: 'Protect PDF', href: '/tools/protect-pdf' },
  { label: 'Unlock PDF', href: '/tools/unlock-pdf' },
  { label: 'Image Resizer', href: '/tools/image-resizer' },
  { label: 'WEBP Converter', href: '/tools/webp-converter' },
];

export const resourceLinks = [
  { label: 'Blog & Insights', href: '/blog' },
  { label: 'SEO PDF Guides / Tutorials', href: '/guides' },
  { label: 'Security & Privacy Whitepaper', href: '/security' },
  { label: 'FAQ & Help Center', href: '/faq' },
  { label: 'Developer API', comingSoon: true },
];

export const footerColumns = [
  { id: 'pdf-suite', title: 'PDF Suite', links: pdfSuiteLinks },
  { id: 'conversions-security', title: 'Conversions & Security', links: conversionSecurityLinks },
  { id: 'resources', title: 'Resources', links: resourceLinks },
];

export const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export const developerCredit = {
  label: 'Universal Stack',
  href: 'https://universalstack.co.nz/',
  external: true,
  title: 'Universal Stack | Website Design, Software Development & AI Solutions',
};

export const connectLinks = [
  {
    "label": "X",
    "ariaLabel": "ZapDocu on X",
    "href": "https://x.com",
    "external": true,
    "iconPath": "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
  },
  {
    "label": "LinkedIn",
    "ariaLabel": "ZapDocu on LinkedIn",
    "href": "https://linkedin.com",
    "external": true,
    "iconPath": "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
  },
  {
    "label": "YouTube",
    "ariaLabel": "ZapDocu on YouTube",
    "href": "https://youtube.com",
    "external": true,
    "iconPath": "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
  }
];

export const connectLegalLinks = { connect: connectLinks, legal: legalLinks };
