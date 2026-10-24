import { useEffect, useRef, useState } from "react";
//m is used as <m.div>; this ESLint setup does not track JSX member usage.
// eslint-disable-next-line no-unused-vars
import { LazyMotion, domAnimation, m, useMotionValue, useSpring } from "motion/react";

//Adapted from React Bits' TiltedCard (https://reactbits.dev): the card tilts
//toward the cursor on spring physics and eases back when the pointer leaves.
//This version wraps arbitrary content instead of a single image, and drops
//the tooltip and mobile warning. The tilt only runs for a fine pointer that
//can hover and when the visitor has not asked for reduced motion; touch and
//keyboard users get the plain card, which is the complete experience.
//LazyMotion loads only the DOM animation features, keeping the bundle small.

const SPRING = { damping: 30, stiffness: 100, mass: 2 };
const TILT_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const useTiltEnabled = () => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(TILT_QUERY);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return enabled;
};

export default function TiltCard({
  children,
  className = "",
  rotateAmplitude = 8,
  scaleOnHover = 1.02,
}) {
  const ref = useRef(null);
  const enabled = useTiltEnabled();
  const rotateX = useSpring(useMotionValue(0), SPRING);
  const rotateY = useSpring(useMotionValue(0), SPRING);
  const scale = useSpring(1, SPRING);

  const handleMouse = (e) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  };
  const handleEnter = () => {
    if (enabled) scale.set(scaleOnHover);
  };
  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        ref={ref}
        className={`[perspective:800px] ${className}`}
        onMouseMove={handleMouse}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <m.div
          className="h-full [transform-style:preserve-3d] will-change-transform"
          style={{ rotateX, rotateY, scale }}
        >
          {children}
        </m.div>
      </div>
    </LazyMotion>
  );
}
