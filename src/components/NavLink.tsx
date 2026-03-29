import Link from 'next/link';

export default function NavLink({
  href,
  active,
  children,
  mobile = false,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        ${mobile ? 'block w-full' : ''}
        px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
        ${
          active
            ? 'bg-accent/10 text-accent'
            : 'text-text-secondary hover:text-text-primary hover:bg-card2'
        }
      `}
    >
      {children}
    </Link>
  );
}
