import { useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_IMAGE_UPLOAD_SIGNATURE } from "../graphql/mutations";
import { getErrorMessage } from "../graphql/errors";
import { imageSrc } from "../cloudinary";

//Photo picker for the recipe form. The file goes from the browser straight
//to Cloudinary: we ask our API for a signed set of upload fields (signed-in
//users; the secret stays on the server), post the file plus those fields
//verbatim to Cloudinary, and hand the returned URL to the form. The form
//stores only the URL.
//
//The checks below are for a quick, friendly error. The real limits are
//inside the signature (allowed formats, size-capping transformation) and
//Cloudinary enforces them whatever the browser sends.

//Cloudinary's per-image ceiling on the free plan.
const MAX_BYTES = 10 * 1024 * 1024;
//Mirrors the server's allowed_formats. No SVG, no GIF.
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/avif"];

const buttonClass =
  "rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50";

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

export default function ImageUpload({ value, onChange, disabled }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [getSignature] = useMutation(CREATE_IMAGE_UPLOAD_SIGNATURE);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    //Reset so picking the same file again after an error re-fires onChange.
    e.target.value = "";
    if (!file) return;

    setError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG, WebP, HEIC or AVIF photo.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That photo is over 10 MB. Please pick a smaller one.");
      return;
    }

    setUploading(true);
    try {
      const { data } = await getSignature();
      const url = await uploadToCloudinary(file, data.createImageUploadSignature);
      onChange(url);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const busy = uploading || disabled;

  return (
    <div>
      {value ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <img
            src={imageSrc(value, { width: 480 })}
            alt="Recipe photo preview"
            className="aspect-[4/3] w-full max-w-xs rounded-lg border border-gray-200 object-cover"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={buttonClass}
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {uploading ? "Uploading..." : "Replace photo"}
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={() => onChange("")}
              disabled={busy}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="flex aspect-[4/3] w-full max-w-xs items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-50"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {uploading ? "Uploading..." : "+ Add a photo"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleFile}
        disabled={busy}
      />

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
