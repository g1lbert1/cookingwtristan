import { useRef, useState } from "react";
import { getErrorMessage } from "../graphql/errors";
import { imageSrc } from "../cloudinary";
import { ACCEPTED_TYPES, useCloudinaryUpload } from "../hooks/useCloudinaryUpload";
import { GALLERY_MAX } from "../recipeOptions";

//Extra photos for a recipe, beyond the cover. Several files can be picked
//at once; they upload one after another (each needs its own signature) and
//every success lands in the form as it finishes, so one bad file never
//costs the others. The form stores only the URLs.

export default function GalleryUpload({ value, onChange, disabled, max = GALLERY_MAX }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null); // { done, total } while uploading
  const [errors, setErrors] = useState([]);
  const upload = useCloudinaryUpload();

  const remaining = max - value.length;

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const batch = files.slice(0, remaining);
    const skipped = files.length - batch.length;
    const failures = skipped > 0
      ? [`Only ${remaining} more ${remaining === 1 ? "photo fits" : "photos fit"}; ${skipped} ${skipped === 1 ? "was" : "were"} left out.`]
      : [];
    setErrors(failures);
    setProgress({ done: 0, total: batch.length });

    let urls = value;
    for (const [i, file] of batch.entries()) {
      try {
        const url = await upload(file);
        if (!urls.includes(url)) {
          urls = [...urls, url];
          onChange(urls);
        }
      } catch (err) {
        failures.push(`${file.name}: ${getErrorMessage(err)}`);
        setErrors([...failures]);
      }
      setProgress({ done: i + 1, total: batch.length });
    }
    setProgress(null);
  };

  const remove = (url) => onChange(value.filter((u) => u !== url));

  const busy = progress != null || disabled;

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <li key={url} className="group relative">
            <img
              src={imageSrc(url, { width: 400 })}
              alt={`Extra photo ${i + 1}`}
              className="aspect-square w-full rounded-xl border border-white/15 object-cover"
            />
            <button
              type="button"
              onClick={() => remove(url)}
              disabled={busy}
              className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white opacity-90 transition-opacity hover:bg-black group-hover:opacity-100 disabled:opacity-40"
              aria-label={`Remove extra photo ${i + 1}`}
            >
              Remove
            </button>
          </li>
        ))}
        {remaining > 0 && (
          <li>
            <button
              type="button"
              className="flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-white/25 px-3 text-center text-sm text-white/60 transition-colors hover:border-white/60 hover:text-white disabled:opacity-50"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {progress ? `Uploading ${Math.min(progress.done + 1, progress.total)} of ${progress.total}...` : "+ Add photos"}
            </button>
          </li>
        )}
      </ul>
      <p className="mt-2 text-xs text-white/50">
        {value.length} of {max} extra photos{remaining > 0 ? ". Pick several at once if you like." : "."}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={handleFiles}
        disabled={busy}
      />

      {errors.length > 0 && (
        <ul role="alert" className="mt-2 space-y-1 text-sm text-red-300">
          {errors.map((msg) => <li key={msg}>{msg}</li>)}
        </ul>
      )}
    </div>
  );
}
