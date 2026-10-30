import { notFound } from 'next/navigation';
import ToolRenderer from '@/components/ToolRenderer';

const toolMetadata = {
  'merge-pdf': {
    title: 'Secure PDF Merger | Combine PDFs Offline in Browser',
    description: 'Merge multiple PDF files into a single document entirely in your browser RAM. Fast, secure, and private with zero server storage.',
    heading: 'Secure PDF Merger Online',
    subheading: 'Combine multiple PDF documents instantly. All document stitching happens locally on your device RAM.',
    content: 'Traditional online file utilities require you to upload sensitive contracts, legal agreements, or financial records to third-party cloud servers, risking your data security. ZapDocu redefines digital document management by processing your files entirely client-side. When you use our Secure PDF Merger, your browser reads and stitches your PDF files together locally using advanced browser memory (RAM). Your confidential files never travel across the internet, ensuring absolute privacy, zero tracking, and elite data protection. Whether you are merging multi-page business invoices, academic research papers, or personal tax records, our tool delivers lighting-fast performance without any cloud upload bottlenecks or file size restrictions. Experience a smoother, entirely private way to manage your workflow directly from your browser.',
    faqs: [
      { q: 'Are my merged PDF files uploaded to a server?', a: 'No. The merge process runs 100% locally inside your browser RAM. Your data never leaves your computer.' },
      { q: 'Is there a limit on how many PDFs I can combine?', a: 'Because processing relies on your device RAM, you can batch-process multiple large documents quickly without cloud bottlenecks.' },
      { q: 'Do I need to install any software plugins?', a: 'No installations or browser plugins are required. Everything runs natively inside any modern web browser.' }
    ]
  },
  'split-pdf': {
    title: 'Split PDF Pages Online | Extract PDF Pages Securely',
    description: 'Extract specific pages or split large PDF files into separate documents locally in your browser with zero data exposure.',
    heading: 'Split PDF Pages Securely',
    subheading: 'Isolate, extract, or separate individual PDF pages locally in your browser memory.',
    content: 'Managing heavy documentation often requires isolating specific chapters, single pages, or custom page ranges from bulky PDF files. Traditional online converters force you to upload your sensitive records to external cloud databases, creating significant privacy risks. ZapDocu provides a 100% private, client-side alternative built for speed and complete confidentiality. By executing page extraction entirely within your browser RAM, your sensitive documents remain strictly on your local machine. You can effortlessly select exact page ranges, split massive files into bite-sized documents, and download your results instantly. Protect your workflow from third-party interception while enjoying a clean, intuitive, and lightning-fast user interface designed for maximum efficiency.',
    faqs: [
      { q: 'Can I select custom page ranges?', a: 'Yes, you can specify exact page numbers or ranges to extract into new individual PDF files.' },
      { q: 'Do I need an active internet connection to split PDFs?', a: 'Once the page loads, the processing engine runs locally on your device hardware, allowing offline functionality.' },
      { q: 'Will the extracted pages lose formatting quality?', a: 'No, all vector graphics, fonts, and layouts remain completely pristine and unaltered.' }
    ]
  },
  'rearrange-pdf': {
    title: 'Rearrange PDF Pages | Reorder & Organize Pages Locally',
    description: 'Visually reorder, move, and delete PDF pages directly inside your browser RAM with zero cloud uploads.',
    heading: 'Rearrange PDF Pages Securely',
    subheading: 'Organize and sequence document pages visually with complete local privacy.',
    content: 'Structuring a professional presentation, legal contract, or corporate report often requires changing the sequence of pages. ZapDocu gives you an intuitive, visual page organizer that executes document restructuring entirely inside your browser memory. Instead of wrestling with complex desktop software or risking data leaks on sketchy cloud platforms, you can drag, drop, rotate, and delete pages with absolute peace of mind. Every modification is rendered instantly in real-time, giving you total creative and structural control over your files. Once your layout is finalized, export your perfectly sequenced document in seconds with zero server tracking or external exposure.',
    faqs: [
      { q: 'Can I delete unwanted pages while rearranging?', a: 'Yes, you can remove or reorder pages seamlessly before exporting your final PDF document.' },
      { q: 'Is my document sent to an external server?', a: 'Never. All page reordering operations happen locally within your web browser RAM.' },
      { q: 'Is there a limit to how many pages I can reorder?', a: 'You can handle large multi-page portfolios limited only by your computer physical RAM capacity.' }
    ]
  },
  'rotate-pdf': {
    title: 'Rotate PDF Pages Online | Fix Document Orientation Securely',
    description: 'Rotate portrait or landscape PDF pages instantly. Processed completely offline in your browser for maximum privacy.',
    heading: 'Rotate PDF Pages Securely',
    subheading: 'Correct document orientation instantly with zero cloud transfers.',
    content: 'Scanned documents, architectural drawings, and mixed-orientation files frequently end up sideways or upside-down, making them frustrating to read and review. ZapDocu allows you to rotate individual pages or entire documents instantly inside your browser workspace. Whether you need a quick 90-degree shift or a complete 180-degree turnaround, our client-side engine executes the fix directly in your device memory. This ensures your confidential paperwork never gets intercepted or stored on remote servers. Clean up your digital files effortlessly and maintain professional presentation standards without compromising on data privacy.',
    faqs: [
      { q: 'Can I rotate individual pages selectively?', a: 'Yes, you can target specific pages that require orientation fixes without altering correctly aligned pages.' },
      { q: 'Are rotations saved permanently?', a: 'Yes, once you download the processed file, the rotation orientations are permanently locked into the document structure.' }
    ]
  },
  'extract-pages': {
    title: 'Extract PDF Pages | Pull Individual Pages Locally',
    description: 'Isolate and pull specific pages out of your PDF files into brand-new documents securely in your browser.',
    heading: 'Extract PDF Pages Locally',
    subheading: 'Pull specific pages out into standalone documents without cloud exposure.',
    content: 'When working with bulky documentation, you often need to isolate specific pages, receipts, or chapters into clean, standalone files. ZapDocu provides a secure extraction utility that operates entirely within your browser RAM. By bypassing external cloud servers entirely, we eliminate security risks associated with uploading confidential files online. Select your desired page indices with precision, run the extraction sequence instantly, and save your new file directly to your local drive. It is the fastest, safest way to curate your document library without installing bulky desktop applications or paying for enterprise software subscriptions.',
    faqs: [
      { q: 'Can I extract multiple non-consecutive pages?', a: 'Yes, you can select any combination of non-consecutive pages to compile into a new extracted PDF file.' },
      { q: 'Does extraction alter original image quality?', a: 'No, embedded images and typography remain completely identical to the source document.' }
    ]
  },
  'watermark-pdf': {
    title: 'Watermark PDF Online | Add Secure Text & Image Stamps',
    description: 'Protect your documents by stamping custom text or image watermarks locally in your browser. Zero cloud tracking.',
    heading: 'Secure PDF Watermarker',
    subheading: 'Stamp confidential drafts, copyright notices, or ownership labels locally.',
    content: 'Protecting intellectual property, restricted corporate reports, and draft agreements requires applying clear, unremovable ownership watermarks. ZapDocu allows you to stamp custom text overlays directly onto your documents inside your browser RAM. Customize opacity levels, font scaling, and angular rotation to fit your branding guidelines perfectly. Because all rendering occurs on your client-side hardware, your sensitive drafts are never exposed to third-party data harvesters. Ensure compliance, discourage unauthorized distribution, and stamp your documents with absolute confidence and speed.',
    faqs: [
      { q: 'Can I customize watermark opacity and position?', a: 'Yes, positioning, transparency levels, and rotation angles can be customized effortlessly.' },
      { q: 'Does watermarking affect underlying text readability?', a: 'You can adjust transparency so your watermark overlays cleanly without obstructing underlying text.' }
    ]
  },
  'compress-pdf': {
    title: 'Private PDF Compressor | 100% Client-Side RAM Compression',
    description: 'Compress PDF file size securely in your browser RAM. Zero cloud uploads, no registration required, and 100% privacy guaranteed.',
    heading: 'Secure, Client-Side PDF Compressor',
    subheading: 'Reduce PDF file size locally in your browser RAM without uploading confidential documents to any remote server.',
    content: 'Oversized PDF file sizes can slow down email transmissions, choke web portals, and exceed strict attachment limits. Our browser-based PDF compressor analyzes and shrinks your files locally using advanced client-side optimization routines. Unlike standard online compressors that force you to upload confidential papers to unknown cloud servers, ZapDocu keeps your documents strictly confined to your device hardware. Experience drastic reductions in file weight while preserving crystal-clear text legibility and image fidelity. Streamline your digital communications securely, efficiently, and completely free from server queues.',
    faqs: [
      { q: 'Will compression blur document text?', a: 'No, our intelligent algorithms optimize redundant data streams while keeping text rendering pin-sharp.' },
      { q: 'Are there file size restrictions for compression?', a: 'Since processing relies on your browser memory, you can optimize large files limited only by your device specs.' }
    ]
  },
  'pdf-to-word': {
    title: 'Convert PDF to Word Online | Secure Text Extraction',
    description: 'Extract and convert PDF files into editable Word documents securely in your browser RAM without cloud storage.',
    heading: 'Convert PDF to Word',
    subheading: 'Transform static PDFs into editable text documents locally in your browser.',
    content: 'Editing static PDF files can be frustrating when you cannot modify text directly. ZapDocu provides a secure, client-side conversion pathway that parses text streams and transforms them into editable Microsoft Word (.docx) documents entirely within your browser RAM. Say goodbye to manual retyping and data exposure risks on unverified web converters. Our local tool preserves your structural layouts, heading hierarchies, and paragraph formatting, giving you an instantly usable document ready for professional editing. Maintain complete data sovereignty while updating your files with zero friction.',
    faqs: [
      { q: 'Are my files stored on remote servers?', a: 'No, all parsing and conversion steps happen inside your browser session with zero server retention.' },
      { q: 'Can I open the output file in Microsoft Word?', a: 'Yes, the generated output is a native `.docx` file fully compatible with Word, Google Docs, and LibreOffice.' }
    ]
  },
  'word-to-pdf': {
    title: 'Convert Word to PDF Online | Secure Document Formatter',
    description: 'Convert DOC and DOCX text documents into professional PDF files locally in your browser with absolute privacy.',
    heading: 'Word to PDF Converter',
    subheading: 'Transform Word documents into polished PDFs securely on your local device.',
    content: 'Converting text documents into universally accepted formats is essential for professional sharing. ZapDocu lets you transform Microsoft Word resumes, contracts, and reports into polished, unalterable PDF files directly inside your browser RAM. By keeping execution local, you prevent corporate memos or personal data from leaking across the web. The formatting engine locks fonts, margins, and graphics into place so your recipients view your files exactly as intended. Enjoy fast, reliable, and entirely confidential document conversion without needing heavyweight office software suites.',
    faqs: [
      { q: 'What Word formats are supported?', a: 'The tool supports standard Microsoft Word file formats including `.doc` and `.docx` files.' },
      { q: 'Does formatting stay consistent across devices?', a: 'Yes, converting to PDF locks down fonts and layouts so they appear identical on any screen or printer.' }
    ]
  },
  'excel-to-pdf': {
    title: 'Convert Excel to PDF Online | Secure Client-Side Converter',
    description: 'Convert Excel (.xlsx, .xls) and CSV sheets into clean, formatted PDF tables privately in your browser without cloud tracking.',
    heading: 'Excel to PDF Converter',
    subheading: 'Turn spreadsheets into professional PDF layouts securely without exposing your financial data to cloud servers.',
    content: 'Financial models, budgets, and operational spreadsheets contain sensitive data that should never be uploaded to third-party cloud servers. ZapDocu solves this by transforming raw spreadsheet data into clean, presentation-ready PDF reports directly inside your web browser. Our client-side rendering engine maps rows, columns, and cell values into structured PDF pages without leaking business intelligence or accounting records. Protect your financial integrity, comply with strict privacy standards, and share your numerical data in a universally readable format with absolute peace of mind.',
    faqs: [
      { q: 'What spreadsheet formats are supported?', a: 'The tool supports standard Microsoft Excel formats including `.xlsx`, `.xls`, and comma-separated `.csv` files.' },
      { q: 'Are formulas evaluated before conversion?', a: 'Calculated cell values and static text strings are rendered smoothly into clean, printable table layouts.' }
    ]
  },
  'pdf-to-jpg': {
    title: 'Convert PDF to JPG Images | Secure Client-Side Extraction',
    description: 'Convert PDF pages into high-resolution JPG or PNG images directly inside your browser with complete local privacy.',
    heading: 'PDF to JPG Image Converter',
    subheading: 'Extract crisp image formats from PDF pages securely without server interaction.',
    content: 'Transforming document pages into versatile image graphics is ideal for social media sharing, portfolio displays, and presentation embedding. ZapDocu renders and exports PDF pages as high-quality JPG or PNG images entirely on your local machine. Because processing happens client-side, you avoid remote server rendering queues and bandwidth restrictions. Each page is captured in high resolution to guarantee that fine text and complex diagrams remain legible and sharp. Experience fast batch extraction and immediate image downloads with zero data exposure.',
    faqs: [
      { q: 'Can I batch convert multi-page PDFs?', a: 'Yes, multi-page documents are processed locally into downloadable individual image files simultaneously.' },
      { q: 'What image formats are generated?', a: 'You can export high-clarity JPG or PNG graphics depending on your design needs.' }
    ]
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF Converter | Turn Images into Document Files',
    description: 'Transform JPG or PNG images into clean, standardized PDF documents locally in your browser memory.',
    heading: 'JPG to PDF Image Converter',
    subheading: 'Turn image files into structured PDF documents securely offline.',
    content: 'Compiling scanned receipts, ID photographs, and graphic portfolios into uniform documents is a frequent administrative chore. ZapDocu lets you drag-and-drop multiple image files, sequence them intuitively, and compile them into a professional PDF document directly within your browser RAM. Complete client-side processing guarantees that your personal photos and sensitive scans remain private to your device. Enjoy automated scaling, clean margin alignments, and instantaneous compilation without dealing with complex software or online security vulnerabilities.',
    faqs: [
      { q: 'Can I combine multiple image files into one PDF?', a: 'Yes, batch select multiple photos or scans to compile them into a single unified multi-page PDF document.' },
      { q: 'Are image ratios automatically adjusted?', a: 'Yes, images are scaled neatly to fit standard page dimensions cleanly.' }
    ]
  },
  'heic-to-jpg': {
    title: 'HEIC to JPG Converter | Convert iPhone Photos Securely',
    description: 'Convert iPhone HEIC photos into universal JPG images locally in your browser with zero cloud storage.',
    heading: 'HEIC to JPG Image Converter',
    subheading: 'Convert Apple HEIC photos into universal JPG format locally in browser memory.',
    content: 'Apple devices capture photos in HEIC format by default to save storage space, but Windows PCs and many web applications struggle to open them. ZapDocu lets you convert iPhone HEIC images into universal JPG format instantly inside your browser RAM. By processing your personal photo library entirely client-side, we ensure your memories and private captures never touch external cloud storage. Enjoy rapid batch conversion, seamless drag-and-drop support, and immediate file downloads with absolute data confidentiality.',
    faqs: [
      { q: 'Can I batch convert multiple HEIC photos?', a: 'Yes, drop multiple Apple HEIC files into the tool interface for instant local batch conversion.' },
      { q: 'Why convert HEIC files to JPG?', a: 'JPG offers universal compatibility across all operating systems, web browsers, and printing services.' }
    ]
  },
  'add-page-numbers': {
    title: 'Add Page Numbers to PDF | Insert Headers & Footers Securely',
    description: 'Insert professional page numbers into your PDF documents locally in your browser with zero cloud tracking.',
    heading: 'Add Page Numbers to PDF',
    subheading: 'Stamp professional page headers and footers locally in your browser.',
    content: 'Structuring legal briefs, academic dissertations, and corporate manuals requires clean, sequential page numbering for easy reference. ZapDocu lets you stamp professional page headers and footers directly into any PDF document locally inside your browser memory. Choose your preferred alignment, customize font styles, and define custom start offsets without uploading your files to remote servers. Maintain complete confidentiality while giving your documents a polished, publication-ready finish in a matter of seconds.',
    faqs: [
      { q: 'Where can page numbers be positioned?', a: 'You can align numbers flexibly across top or bottom headers and footers with custom formatting choices.' },
      { q: 'Can I skip numbering on cover pages?', a: 'Yes, you can configure custom start index numbers to begin pagination past title pages.' }
    ]
  },
  'protect-pdf': {
    title: 'Protect PDF Security | Encrypt Documents Locally in Browser',
    description: 'Add robust password encryption to your PDF files securely in your browser RAM without exposing security credentials.',
    heading: 'Password Protect PDF Files',
    subheading: 'Secure sensitive documents with heavy encryption locally on your device.',
    content: 'Restricting unauthorized access to confidential payroll records, legal agreements, and medical documents is critical for data security. ZapDocu lets you lock your PDFs with robust password encryption locally within your browser memory. Encryption keys and private documents are processed entirely client-side using advanced cryptographic libraries, ensuring your passwords and files never touch a remote database. Protect your sensitive assets against interception and comply with rigorous privacy standards with zero configuration friction.',
    faqs: [
      { q: 'Is my password transmitted to any server?', a: 'No, encryption happens 100% inside your local browser session. We never see or store your password.' },
      { q: 'What security standard is applied?', a: 'The tool uses standard cryptographic specifications to secure your PDF structure against unauthorized opening.' }
    ]
  },
  'unlock-pdf': {
    title: 'Unlock PDF Password | Remove Restrictions Securely in Browser',
    description: 'Remove passwords and document restrictions securely in your browser RAM. 100% offline and confidential processing.',
    heading: 'Unlock PDF Password Security',
    subheading: 'Remove known passwords and viewing restrictions locally without server exposure.',
    content: 'Tired of typing security passwords every time you open recurring financial statements or administrative documents you own? ZapDocu allows you to strip known passwords and editing restrictions directly within your browser RAM. By handling decryption client-side, your confidential files remain completely secure and private. Simply input your authorized password once to permanently unlock the document, export the clean copy, and streamline your daily workflow without sacrificing data safety.',
    faqs: [
      { q: 'Do I need to know the original document password?', a: 'Yes, you must input the authorized password once to successfully decrypt and remove restrictions.' },
      { q: 'Are unlocked files handled securely?', a: 'Yes, the decrypted output is processed entirely in local browser RAM and downloaded directly to your device.' }
    ]
  },
  'image-resizer': {
    title: 'Image Resizer | Resize & Compress Image Dimensions Securely',
    description: 'Adjust image dimensions, scale resolutions, and optimize file sizes instantly in your browser.',
    heading: 'Image Resizer Utility',
    subheading: 'Scale image dimensions and optimize file sizes locally on your device.',
    content: 'Optimizing image dimensions for web uploads, passport photo submissions, or email attachments is essential for fast performance. ZapDocu lets you adjust pixel dimensions, scale aspect ratios, and reduce image file weights directly within your browser RAM. Our client-side image processor handles PNG, JPEG, and WEBP formats seamlessly without sending your personal photos to remote servers. Enjoy precise width and height controls, instant preview rendering, and rapid downloads while keeping your image data 100% private.',
    faqs: [
      { q: 'Can I specify custom pixel dimensions?', a: 'Yes, you can enter exact custom width and height parameters to meet specific guidelines.' },
      { q: 'Will image aspect ratios stay locked?', a: 'Aspect ratio locking is enabled by default to prevent image distortion during scaling.' }
    ]
  },
  'webp-converter': {
    title: 'WEBP Converter | Convert Images to Standard Formats',
    description: 'Convert modern WEBP web images into standard PNG and JPEG formats securely in your browser.',
    heading: 'WEBP Image Converter',
    subheading: 'Transform modern WEBP files into universal PNG and JPEG formats locally.',
    content: 'Downloading modern WEBP images from the web can be annoying when your legacy photo editors or design software refuse to open them. ZapDocu lets you transform WEBP files into universal PNG or JPEG formats instantly inside your browser RAM. By bypassing third-party cloud conversion services, your downloaded graphics stay entirely on your local machine. Enjoy blazing-fast batch conversions, transparent background preservation for PNGs, and absolute privacy protection with every click.',
    faqs: [
      { q: 'What target formats are supported?', a: 'You can convert modern WEBP files into standard high-compatibility JPEG or transparent PNG outputs.' },
      { q: 'Is transparency preserved when converting to PNG?', a: 'Yes, transparent backgrounds in source WEBP graphics are fully retained in the converted PNG files.' }
    ]
  }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = toolMetadata[slug];

  if (!tool) {
    return {
      title: 'Tool Not Found | ZapDocu',
      description: 'Secure browser-based PDF utilities.',
    };
  }

  return {
    title: tool.title,
    description: tool.description,
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `https://zapdocu.com/tools/${slug}`,
      siteName: 'ZapDocu',
      type: 'website',
    },
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = toolMetadata[slug];

  if (!tool) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {tool.heading}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {tool.subheading}
          </p>
        </div>

        {/* Dynamic Tool Component Renderer */}
        <ToolRenderer slug={slug} />

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4">
            <h3 className="font-semibold text-emerald-400 text-sm">⚡ Zero Cloud Uploads</h3>
            <p className="text-xs text-slate-400 mt-1">Files never leave your local device storage.</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4">
            <h3 className="font-semibold text-indigo-400 text-sm">🔒 100% Browser RAM</h3>
            <p className="text-xs text-slate-400 mt-1">Processed securely using browser memory.</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4">
            <h3 className="font-semibold text-cyan-400 text-sm">🚀 Instant Processing</h3>
            <p className="text-xs text-slate-400 mt-1">No server wait times or file queues.</p>
          </div>
        </div>

        {/* Bottom SEO Content & FAQs */}
        <section className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">About This Tool & Privacy Guarantee</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {tool.content}
          </p>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="font-semibold text-white text-sm">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {tool.faqs.map((faq, index) => (
                <div key={index} className="space-y-1 text-sm">
                  <p className="text-slate-200 font-medium">{faq.q}</p>
                  <p className="text-slate-400 text-xs pl-4">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}