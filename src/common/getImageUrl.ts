import { ImagesEntity } from './images/images.entity';

export const getImageUrl = (
  img?: ImagesEntity | number,
): string | undefined => {
  if (!img) return undefined;
  return typeof img === 'number'
    ? `/api/images/${img}`
    : `/api/images/${img.id}`;
};
