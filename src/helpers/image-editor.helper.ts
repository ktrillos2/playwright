import imglyRemoveBackground from '@imgly/background-removal';

export const removeBackground = async (imageUrl: string) => {
  const image = await imglyRemoveBackground(imageUrl);
  const url = URL.createObjectURL(image);
  return url;
};