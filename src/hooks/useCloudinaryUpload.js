import { useMutation } from "@apollo/client/react";
import { CREATE_IMAGE_UPLOAD_SIGNATURE } from "../graphql/mutations";

//One photo, browser to Cloudinary. We ask our API for a signed set of upload
//fields (signed-in users; the secret stays on the server), post the file
//plus those fields verbatim to Cloudinary, and return the stored URL.
//
//The checks here give a quick, friendly error. The real limits are inside
//the signature (allowed formats, size-capping transformation) and
//Cloudinary enforces them whatever the browser sends.

//Cloudinary's per-image ceiling on the free plan.
export const MAX_BYTES = 10 * 1024 * 1024;
//Mirrors the server's allowed_formats. No SVG, no GIF.
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/avif"];

//Why this file cannot be uploaded, or null if it can.
export const fileProblem = (file) => {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Please choose a JPG, PNG, WebP, HEIC or AVIF photo.";
  if (file.size > MAX_BYTES) return "That photo is over 10 MB. Please pick a smaller one.";
  return null;
};

const uploadToCloudinary = async (file, sig) => {
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sig.apiKey);
  //Every signed field, exactly as issued. Changing or dropping one breaks
  //the signature and Cloudinary refuses the upload.
  for (const { name, value } of sig.fields) body.append(name, value);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error?.message || `Upload failed (${res.status}).`);
  }
  return json.secure_url;
};

//Returns upload(file) -> url. Throws with a user-facing message.
export const useCloudinaryUpload = () => {
  const [getSignature] = useMutation(CREATE_IMAGE_UPLOAD_SIGNATURE);
  return async (file) => {
    const problem = fileProblem(file);
    if (problem) throw new Error(problem);
    const { data } = await getSignature();
    return uploadToCloudinary(file, data.createImageUploadSignature);
  };
};
