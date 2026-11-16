import FooterLink from './FooterLink';

export default function FooterLinkColumn({ column }) {
  return (
    <nav aria-labelledby={`footer-${column.id}`} className="min-w-0 space-y-3">
      <h3 id={`footer-${column.id}`} className="text-white font-semibold text-sm tracking-wider uppercase">{column.title}</h3>
      <ul className="space-y-2 text-xs leading-relaxed">
        {column.links.map(item => (
          <li key={item.href || item.label}>
            <FooterLink item={item} className="hover:text-cyan-300" />
          </li>
        ))}
      </ul>
    </nav>
  );
}
