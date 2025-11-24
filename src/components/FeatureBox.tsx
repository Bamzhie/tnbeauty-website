import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type IconName = {
  [K in keyof typeof LucideIcons]: 
    typeof LucideIcons[K] extends LucideIcon ? K : never
}[keyof typeof LucideIcons];

interface Props {
  title: string;
  subtitle?: string;
  cta?: string;
  icon: IconName;
}

const iconMap = Object.fromEntries(
  Object.entries(LucideIcons).filter(
    ([, Component]) => typeof Component === 'function' && 'iconNode' in Component
  )
) as Record<IconName, LucideIcon>;

export default function FeatureBox({ title, subtitle, cta, icon }: Props) {
  const Icon = iconMap[icon];
  if (!Icon) return null;

  return (
   <div className="bg-white/80 backdrop-blur rounded-2xl p-5 sm:p-6 shadow-md flex flex-col items-center text-center">
  <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--color-accent)] mb-3 sm:mb-4" />
  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{title}</h3>
  {subtitle && <p className="text-xs sm:text-sm text-[var(--color-muted)] mb-3 sm:mb-4">{subtitle}</p>}
  {cta && (
    <button className="mt-auto text-[var(--color-accent)] text-sm font-medium hover:underline">
      {cta}
    </button>
  )}
</div>
  );
}