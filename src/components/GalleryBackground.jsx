import { GALLERY_IMAGES } from "../galleryImages";
import { imageSrc } from "../cloudinary";

//Full-bleed wall of photos behind the landing page, on the plum ground. The
//photos are dealt round-robin into columns; each column is rendered twice,
//stacked, and animated by exactly half its height so the loop is seamless.
//Odd columns drift up, even columns drift down. Keyframes live in index.css,
//which also pauses the motion when the user prefers reduced motion.
//
//The photos are plain images: nothing here reacts to the cursor, so the wall
//stays a backdrop and the panel in front keeps the attention. Columns are
//about a quarter of the viewport, so 600px wide is plenty.

const COLUMNS = 4;

const columns = Array.from({ length: COLUMNS }, (_, c) =>
  GALLERY_IMAGES.filter((_, i) => i % COLUMNS === c),
);

const GalleryBackground = () => (
  <div className="absolute inset-0 overflow-hidden bg-plum" aria-hidden="true">
    <div className="flex h-full w-full gap-3 px-3">
      {columns.map((images, c) => (
        <div key={c} className="min-w-0 flex-1 overflow-hidden">
          <div
            className={`flex flex-col gap-3 ${c % 2 === 0 ? "gallery-scroll-up" : "gallery-scroll-down"}`}
            style={{ animationDuration: `${50 + c * 10}s` }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex flex-col gap-3">
                {images.map((src) => (
                  <img
                    key={src}
                    src={imageSrc(src, { width: 600 })}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    className="mx-auto aspect-[4/5] w-[90%] rounded-2xl object-cover"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    {/* A light plum wash so the wall sits behind the panel instead of competing with it. */}
    <div className="absolute inset-0 bg-plum/40" />
  </div>
);
export default GalleryBackground;
