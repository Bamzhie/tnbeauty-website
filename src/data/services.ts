// Service data definitions for TNL Beauty booking system

export interface CoreService {
  id: string;
  name: string;
  price: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
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
}

// Core Services (required, multiple selection)
export const coreServices: CoreService[] = [
  { id: 'gel-x', name: 'Full Set Gel-X Extension', price: 50 },
  { id: 'acrylic', name: 'Full Set Acrylic', price: 45 },
  { id: 'biab', name: 'BIAB', price: 40 },
  { id: 'gel-manicure', name: 'Gel Manicure', price: 25 },
  { id: 'gel-toes', name: 'Gel on Toes', price: 25 },
];

// Nail Art Levels (optional, single selection)
export const nailArtLevels: NailArtLevel[] = [
  { 
    id: 'nail-art-1', 
    name: 'Level 1: Basic', 
    price: 10, 
    level: 1, 
    image: '/level1/img1.webp', // Main representative image
    description: 'Simple lines, dots, or single accent nail.',
    exampleImages: [
      '/level1/img1.webp',
      '/level1/img2.webp',
      '/level1/img3.webp'
    ]
  },
  { 
    id: 'nail-art-2', 
    name: 'Level 2: Advanced', 
    price: 20, 
    level: 2, 
    image: '/level2/img1.webp',
    description: 'French tips, swirls, or simple patterns on all nails.',
    exampleImages: [
      '/level2/img1.webp',
      '/level2/img2.webp',
      '/level2/img3.webp',
      '/level2/img4.webp'
    ]
  },
  { 
    id: 'nail-art-3', 
    name: 'Level 3: Intricate', 
    price: 25, 
    level: 3, 
    image: '/level3/img1.webp',
    description: 'Complex hand-painted designs, chrome, or mixed media.',
    exampleImages: [
      '/level3/img1.webp',
      '/level3/img2.webp',
      '/level3/img3.webp',
      '/level3/img4.webp'
    ]
  },
  { 
    id: 'nail-art-4', 
    name: 'Level 4: Extreme', 
    price: 35, 
    level: 4, 
    image: '/level4/img1.webp',
    description: '3D charms, heavy gems, or character art.',
    exampleImages: [
      '/level4/img1.webp',
      '/level4/img2.webp',
      '/level4/img3.webp',
      '/level4/20251123_213705.webp',
      '/level4/20251123_213710.webp'
    ]
  },
];

// Add-ons (optional, multiple selection) - REMOVED Nail Art
export const addOns: AddOn[] = [
  { id: 'chrome', name: 'Chrome', price: 10 },
  { id: 'cat-eye', name: 'Cat Eye', price: 10 },
  { id: 'gems', name: 'Gems', price: 5 },
  { id: 'airbrush', name: 'Airbrush (Aura / Ombre)', price: 15 },
];

// Removals (optional, multiple selection, checkbox-gated)
export const removals: Removal[] = [
  { id: 'gel-biab-removal', name: 'Gel / BIAB Removal', price: 10 },
  { id: 'acrylic-removal', name: 'Acrylic Removal', price: 15 },
  { id: 'gel-x-removal', name: 'Gel-X Removal', price: 10 },
];

// Helper function to calculate total price
export function calculateTotalPrice(
  selectedCoreServices: string[],
  selectedAddOns: string[],
  selectedRemovals: string[],
  selectedNailArtLevelId?: string | null
): number {
  let total = 0;

  // Add core services
  selectedCoreServices.forEach((id) => {
    const service = coreServices.find((s) => s.id === id);
    if (service) total += service.price;
  });

  // Add add-ons
  selectedAddOns.forEach((id) => {
    const addon = addOns.find((a) => a.id === id);
    if (addon) total += addon.price;
  });

  // Add nail art level
  if (selectedNailArtLevelId) {
    const level = nailArtLevels.find(l => l.id === selectedNailArtLevelId);
    if (level) total += level.price;
  }

  // Add removals
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
