import Link from 'next/link';

export default function FooterLink({ item, className = '', children }) {
  if (item.comingSoon) {
    return (
      <span className="text-slate-500">
        {item.label} <span className="text-[10px] whitespace-nowrap">(Coming soon)</span>
      </span>
    );
  }

  const sharedProps = {
    className: `transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 ${className}`,
    title: item.title,
    'aria-label': item.ariaLabel,
  };
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" {...sharedProps}>
      {children || item.label}
    </a>
  ) : (
    <Link href={item.href} {...sharedProps}>{children || item.label}</Link>
  );
}
