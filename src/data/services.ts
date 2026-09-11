// Service data definitions for TNL Beauty booking system

export interface CoreService {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

export interface NailArtLevel {
  id: string;
  name: string;
  price: number;
  level: number;
  image: string;
  description: string;
  exampleImages?: string[];
}

export interface Removal {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

// Core Services (required, multiple selection)
export const coreServices: CoreService[] = [
  {
    id: 'gel-x',
    name: 'Full Set Gel-X Extension',
    price: 50,
    description: 'Discover the ultimate in nail durability and beauty with our Full Set Gel-X Extensions. This innovative system combines the best of gel and acrylic for a lightweight, natural-looking finish that lasts.',
    image: '/level1/img1.webp',
  },
  {
    id: 'biab',
    name: 'BIAB',
    price: 40,
    description: 'Builder In A Bag (BIAB) is a strengthening overlay applied directly to your natural nails. This treatment promotes natural nail growth while providing a strong, protective layer.',
    image: '/level1/img2.webp',
  },
  {
    id: 'gel-manicure',
    name: 'Gel Manicure',
    price: 25,
    description: 'A classic gel polish application on your natural nails. Our gel manicure delivers a high-gloss, chip-free finish that stays flawless for up to two weeks.',
    image: '/level1/img3.webp',
  },
];

// Nail Art Levels (optional, single selection)
export const nailArtLevels: NailArtLevel[] = [
  {
    id: 'nail-art-1',
    name: 'Level 1: Basic',
    price: 10,
    level: 1,
    image: '/level1/img1.webp',
    description: 'Simple lines, dots, or single accent nail. Perfect for those who prefer subtle elegance.',
    exampleImages: ['/level1/img1.webp', '/level1/img2.webp', '/level1/img3.webp'],
  },
  {
    id: 'nail-art-2',
    name: 'Level 2: Advanced',
    price: 20,
    level: 2,
    image: '/level2/img1.webp',
    description: 'French tips, swirls, or simple patterns on all nails. A step up for those wanting more detail.',
    exampleImages: ['/level2/img1.webp', '/level2/img2.webp', '/level2/img3.webp', '/level2/img4.webp'],
  },
  {
    id: 'nail-art-3',
    name: 'Level 3: Intricate',
    price: 25,
    level: 3,
    image: '/level3/img1.webp',
    description: 'Complex hand-painted designs, chrome, or mixed media. For those who want their nails to make a statement.',
    exampleImages: ['/level3/img1.webp', '/level3/img2.webp', '/level3/img3.webp', '/level3/img4.webp'],
  },
  {
    id: 'nail-art-4',
    name: 'Level 4: Extreme',
    price: 35,
    level: 4,
    image: '/level4/img1.webp',
    description: '3D charms, heavy gems, or character art. The ultimate expression of nail artistry for bold personalities.',
    exampleImages: ['/level4/img1.webp', '/level4/img2.webp', '/level4/img3.webp', '/level4/20251123_213705.webp', '/level4/20251123_213710.webp'],
  },
];

// Add-ons (optional, multiple selection)
export const addOns: AddOn[] = [
  {
    id: 'chrome',
    name: 'Chrome',
    price: 10,
    description: 'Transform your nails with a stunning chrome finish that reflects light beautifully. This add-on creates a mirror-like effect that catches every eye.',
    image: '/level1/img1.webp',
  },
  {
    id: 'cat-eye',
    name: 'Cat Eye',
    price: 10,
    description: 'Create a mesmerising cat-eye effect with magnetic gel polish. This optical illusion effect adds depth and movement to your nails.',
    image: '/level1/img2.webp',
  },
  {
    id: 'gems',
    name: 'Gems',
    price: 5,
    description: 'Add sparkle with carefully placed gemstones. Each gem is individually applied and secured for lasting brilliance.',
    image: '/level1/img3.webp',
  },
  {
    id: 'airbrush',
    name: 'Airbrush (Aura / Ombre)',
    price: 15,
    description: 'Create stunning gradient effects with professional airbrush techniques. Perfect for aura, ombre, or custom colour blends.',
    image: '/level2/img1.webp',
  },
];

// Removals (optional, multiple selection)
export const removals: Removal[] = [
  {
    id: 'gel-biab-removal',
    name: 'Gel / BIAB Removal',
    price: 10,
    description: 'Safe and gentle removal of gel or BIAB products without damaging your natural nails. Includes careful filing and conditioning.',
    image: '/level1/img1.webp',
  },
  {
    id: 'acrylic-removal',
    name: 'Acrylic Removal',
    price: 15,
    description: 'Professional removal of acrylic extensions. Our gentle technique protects your natural nails while completely removing all product.',
    image: '/level1/img2.webp',
  },
  {
    id: 'gel-x-removal',
    name: 'Gel-X Removal',
    price: 10,
    description: 'Careful removal of Gel-X extensions to preserve the health of your natural nails. Includes soak-off and nail conditioning.',
    image: '/level1/img3.webp',
  },
];

// Helper function to calculate total price
export function calculateTotalPrice(
  selectedCoreServices: string[],
  selectedAddOns: string[],
  selectedRemovals: string[],
  selectedNailArtLevelId?: string | null
): number {
  let total = 0;

  selectedCoreServices.forEach((id) => {
    const service = coreServices.find((s) => s.id === id);
    if (service) total += service.price;
  });

  selectedAddOns.forEach((id) => {
    const addon = addOns.find((a) => a.id === id);
    if (addon) total += addon.price;
  });

  if (selectedNailArtLevelId) {
    const level = nailArtLevels.find(l => l.id === selectedNailArtLevelId);
    if (level) total += level.price;
  }

  selectedRemovals.forEach((id) => {
    const removal = removals.find((r) => r.id === id);
    if (removal) total += removal.price;
  });

  return total;
}

// Helper function to get service names for display
export function getSelectedServiceNames(
  selectedCoreServices: string[],
  selectedAddOns: string[],
  selectedRemovals: string[],
  selectedNailArtLevelId?: string | null
): { name: string; price: number }[] {
  const services: { name: string; price: number }[] = [];

  selectedCoreServices.forEach((id) => {
    const service = coreServices.find((s) => s.id === id);
    if (service) services.push({ name: service.name, price: service.price });
  });

  selectedAddOns.forEach((id) => {
    const addon = addOns.find((a) => a.id === id);
    if (addon) services.push({ name: addon.name, price: addon.price });
  });

  if (selectedNailArtLevelId) {
    const level = nailArtLevels.find(l => l.id === selectedNailArtLevelId);
    if (level) services.push({ name: level.name, price: level.price });
  }

  selectedRemovals.forEach((id) => {
    const removal = removals.find((r) => r.id === id);
    if (removal) services.push({ name: removal.name, price: removal.price });
  });

  return services;
}
