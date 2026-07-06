import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

export type IndianPattern = 'paisley' | 'bandhani' | 'ikat' | 'rangoli';
export type SectionTone = 'cream' | 'blush' | 'saffron' | 'ivory' | 'maroon-wash';

const TONE_STYLES: Record<SectionTone, string> = {
  cream: 'bg-[#faf7f2]',
  ivory: 'bg-white',
  blush: 'bg-[#fdf5f3]',
  saffron: 'bg-[#fffaf3]',
  'maroon-wash': 'bg-[#faf5f5]',
};

export function IndianPatternOverlay({
  pattern,
  className = 'text-amber-900',
}: {
  pattern: IndianPattern;
  className?: string;
}) {
  if (pattern === 'bandhani') {
    return (
      <div
        className={`absolute inset-0 opacity-[0.06] pointer-events-none ${className}`}
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1.2px, transparent 1.2px)',
          backgroundSize: '16px 16px',
        }}
      />
    );
  }
  if (pattern === 'ikat') {
    return (
      <div
        className={`absolute inset-0 opacity-[0.05] pointer-events-none ${className}`}
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
          backgroundSize: '10px 10px',
        }}
      />
    );
  }
  if (pattern === 'rangoli') {
    return (
      <div
        className={`absolute inset-0 opacity-[0.05] pointer-events-none ${className}`}
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, currentColor 1.5px, transparent 1.5px),
            radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)`,
          backgroundSize: '28px 28px, 14px 14px, 14px 14px',
        }}
      />
    );
  }
  return (
    <div
      className={`absolute inset-0 opacity-[0.04] pointer-events-none ${className}`}
      style={{
        backgroundImage: `radial-gradient(ellipse 80% 50% at 10% 90%, currentColor 0%, transparent 55%),
          radial-gradient(ellipse 60% 40% at 90% 10%, currentColor 0%, transparent 50%)`,
      }}
    />
  );
}

function FestiveCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const pos = {
    tl: 'top-3 left-3 border-t-2 border-l-2 rounded-tl-md',
    tr: 'top-3 right-3 border-t-2 border-r-2 rounded-tr-md',
    bl: 'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-md',
    br: 'bottom-3 right-3 border-b-2 border-r-2 rounded-br-md',
  };
  return (
    <div
      className={`absolute w-8 h-8 md:w-10 md:h-10 pointer-events-none border-amber-600/25 ${pos[position]}`}
      aria-hidden
    />
  );
}

export function FestiveSectionBg({ pattern = 'bandhani' }: { pattern?: IndianPattern }) {
  return (
    <>
      <IndianPatternOverlay pattern={pattern} />
      <div className="absolute inset-0 bg-linear-to-b from-amber-50/30 via-transparent to-rose-50/20 pointer-events-none" />
    </>
  );
}

export function SectionDivider() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-xs h-px bg-linear-to-r from-transparent via-amber-600/30 to-transparent" />
    </div>
  );
}

export function HomeSection({
  children,
  tone = 'ivory',
  pattern = 'bandhani',
  className = '',
}: {
  children: ReactNode;
  tone?: SectionTone;
  pattern?: IndianPattern;
  className?: string;
}) {
  return (
    <section
      className={`relative border-b border-amber-900/8 overflow-hidden py-12 lg:py-16 ${TONE_STYLES[tone]} ${className}`}
    >
      <FestiveSectionBg pattern={pattern} />
      <FestiveCorner position="tl" />
      <FestiveCorner position="tr" />
      {children}
      <SectionDivider />
    </section>
  );
}

export function HomeSectionInner({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`container mx-auto px-4 lg:px-8 relative z-[1] ${className}`}>{children}</div>;
}

export function IndianSectionHeader({
  badge,
  title,
  titleAccent,
  subtitle,
  align = 'left',
}: {
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  const alignClass = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-2.5 mb-8 lg:mb-10 max-w-2xl ${alignClass}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-[10px] lg:text-xs font-semibold uppercase tracking-[0.18em] text-amber-900/80">
          <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
          {badge}
        </span>
      )}
      <h2 className="text-xl lg:text-3xl font-bold text-heading uppercase tracking-tight leading-tight">
        {title}
        {titleAccent && (
          <>
            {' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-700 via-rose-700 to-amber-800">
              {titleAccent}
            </span>
          </>
        )}
      </h2>
      {subtitle && <p className="text-sm text-gray-600 leading-relaxed max-w-lg">{subtitle}</p>}
      <div
        className={`h-0.5 w-14 rounded-full bg-linear-to-r from-amber-500 via-rose-400 to-amber-600/80 ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </div>
  );
}

export function FestiveCard({
  children,
  accent = 'amber',
  className = '',
}: {
  children: ReactNode;
  accent?: 'amber' | 'rose' | 'maroon' | 'saffron';
  className?: string;
}) {
  const accents = {
    amber: 'border-amber-200/80 hover:border-amber-300/80 bg-linear-to-b from-white to-amber-50/40',
    rose: 'border-rose-200/70 hover:border-rose-300/70 bg-linear-to-b from-white to-rose-50/30',
    maroon: 'border-red-200/60 hover:border-red-300/60 bg-linear-to-b from-white to-red-50/25',
    saffron: 'border-orange-200/70 hover:border-orange-300/70 bg-linear-to-b from-white to-orange-50/35',
  };
  return (
    <div
      className={`rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 ${accents[accent]} ${className}`}
    >
      {children}
    </div>
  );
}
