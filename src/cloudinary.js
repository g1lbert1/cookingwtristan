//Display helper for photo URLs. Cloudinary URLs look like
//  https://res.cloudinary.com/<cloud>/image/upload/v123/folder/name.jpg
//and accept transformations after "/upload/". We ask for automatic format
//and quality plus a width cap so a 4000px upload is served at display size.
//Any other URL (a file in /public, another host) is returned untouched.
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

export const imageSrc = (url, { width = 1600 } = {}) => {
  if (!url) return null;
  const match = CLOUDINARY_UPLOAD.exec(url);
  if (!match) return url;
  return `${match[1]}f_auto,q_auto,c_limit,w_${width}/${match[2]}`;
};
