export default async function sitemap() {
  const baseUrl = 'https://zapdocu.com';
  
  // List of all your tool slugs
  const tools = [
    'merge-pdf', 'split-pdf', 'rearrange-pdf', 'rotate-pdf', 
    'extract-pages', 'watermark-pdf', 'compress-pdf', 'pdf-to-word', 
    'word-to-pdf', 'excel-to-pdf', 'pdf-to-jpg', 'jpg-to-pdf', 
    'heic-to-jpg', 'add-page-numbers', 'protect-pdf', 'unlock-pdf', 
    'image-resizer', 'webp-converter'
  ];

  const toolUrls = tools.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...toolUrls,
  ];
}