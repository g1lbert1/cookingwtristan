import { useRef, useState } from "react";
import { getErrorMessage } from "../graphql/errors";
import { imageSrc } from "../cloudinary";
import { ACCEPTED_TYPES, useCloudinaryUpload } from "../hooks/useCloudinaryUpload";

//The recipe's cover photo. The form stores only the URL; the upload itself
//is in hooks/useCloudinaryUpload.js and shared with GalleryUpload.

const buttonClass = "btn btn-secondary btn-sm";

export default function ImageUpload({ value, onChange, disabled }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const upload = useCloudinaryUpload();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    //Reset so picking the same file again after an error re-fires onChange.
    e.target.value = "";
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      onChange(await upload(file));
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
            className="aspect-[4/3] w-full max-w-xs rounded-xl border border-white/15 object-cover"
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
          className="flex aspect-[4/3] w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-white/25 text-sm text-white/60 transition-colors hover:border-white/60 hover:text-white disabled:opacity-50"
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
        <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>
      )}
    </div>
  );
}
