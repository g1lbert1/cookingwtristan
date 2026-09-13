import TiltedCard from "./TiltedCard";
import { GALLERY_IMAGES } from "../galleryImages";
import { imageSrc } from "../cloudinary";

//Full-bleed wall of photos behind the landing page. The photos are dealt
//round-robin into columns; each column is rendered twice, stacked, and
//animated by exactly half its height so the loop is seamless. Odd columns
//drift up, even columns drift down. Keyframes live in index.css, which also
//pauses the motion when the user prefers reduced motion.
//
//Each photo is a ReactBits-style TiltedCard that leans toward the cursor on
//spring physics. Scale is pinned to 1 so photos tilt without growing.
//Columns are about a quarter of the viewport, so 600px wide is plenty.

const COLUMNS = 4;

const columns = Array.from({ length: COLUMNS }, (_, c) =>
  GALLERY_IMAGES.filter((_, i) => i % COLUMNS === c),
);

const GalleryBackground = () => (
  <div className="absolute inset-0 overflow-hidden bg-gray-950" aria-hidden="true">
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
                  <div key={src} className="aspect-[4/5] w-full">
                    <TiltedCard
                      imageSrc={imageSrc(src, { width: 600 })}
                      altText=""
                      containerWidth="100%"
                      containerHeight="100%"
                      imageWidth="100%"
                      imageHeight="100%"
                      rotateAmplitude={12}
                      scaleOnHover={1}
                      showMobileWarning={false}
                      showTooltip={false}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default GalleryBackground;
