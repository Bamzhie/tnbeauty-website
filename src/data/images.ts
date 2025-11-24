// Dynamically import all images from the assets folder
const images = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', { eager: true });

export const galleryImages = Object.entries(images).map(([path, module]: [string, any]) => ({
  src: module.default,
  alt: path.split('/').pop()?.split('.')[0] || 'Gallery Image',
}));
