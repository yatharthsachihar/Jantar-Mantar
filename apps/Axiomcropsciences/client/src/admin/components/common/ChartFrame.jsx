import { useRef, useState, useEffect } from "react";

/**
 * Drop-in replacement for recharts <ResponsiveContainer>.
 *
 * recharts' ResponsiveContainer can render BLANK in production / React 19 when
 * its internal ResizeObserver measures the container at the wrong moment (e.g.
 * while the dashboard's entry animation is running, or before layout settles).
 * This version measures the container width itself, re-measures on resize, and
 * passes EXPLICIT pixel width/height to the chart — so the chart always draws.
 *
 * Usage:
 *   <ChartFrame height={320}>
 *     {(width, height) => (
 *       <AreaChart width={width} height={height} data={...}> ... </AreaChart>
 *     )}
 *   </ChartFrame>
 */
export default function ChartFrame({ height = 300, children }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setWidth((prev) => (prev !== w ? w : prev));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // Belt-and-suspenders: re-measure after the first paint and again once any
    // entry animation has settled, in case clientWidth was 0 at mount.
    const raf = requestAnimationFrame(measure);
    const t = setTimeout(measure, 400);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", height }}>
      {width > 0 ? children(width, height) : null}
    </div>
  );
}
