import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  height?: number;
}

export default function BrandLogo({ className = '', height = 40 }: BrandLogoProps) {
  return (
    <Link href="/" className={`flex items-center shrink-0 group ${className}`}>
      <Image
        src="/logo.png"
        alt="BLAK BLAZE"
        width={140}
        height={height}
        className="h-auto w-20 object-contain"
        priority
      />
    </Link>
  );
}
