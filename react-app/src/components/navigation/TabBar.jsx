import { useRef, useEffect, useCallback } from "react";
import { BASE_META } from "../../data/meta.js";

export default function TabBar({ subject, unit, onUnitChange, allMeta }) {
  const tabbarRef = useRef(null);
  const thumbRef = useRef(null);

  const updateScrollThumb = useCallback(() => {
    const el = tabbarRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;
    const ratio = el.clientWidth / el.scrollWidth;
    const pos =
      el.scrollWidth > el.clientWidth
        ? el.scrollLeft / (el.scrollWidth - el.clientWidth)
        : 0;
    thumb.style.width = ratio * 100 + "%";
    thumb.style.left = pos * (100 - ratio * 100) + "%";
  }, []);

  useEffect(() => {
    updateScrollThumb();
    const el = tabbarRef.current;
    if (el) el.addEventListener("scroll", updateScrollThumb);
    return () => {
      if (el) el.removeEventListener("scroll", updateScrollThumb);
    };
  }, [subject, updateScrollThumb]);

  const metaMap = allMeta || BASE_META;
  const currentSubjectMeta = metaMap[subject] || BASE_META[subject] || {};
  const units = currentSubjectMeta.units || {};

  return (
    <div className="tabbar-wrap">
      <div className="tabbar" ref={tabbarRef} role="tablist" aria-label="Select Unit">
        {Object.keys(units).map((uStr) => {
          const u = parseInt(uStr, 10);
          return (
            <button
              key={u}
              role="tab"
              aria-selected={unit === u}
              className={"tab" + (unit === u ? " active" : "")}
              onClick={() => onUnitChange(u)}
              id={`unit-tab-${u}`}
            >
              {units[u].icon || "📘"} U{u}
            </button>
          );
        })}
      </div>
      <div className="scroll-track">
        <div className="scroll-thumb" ref={thumbRef} />
      </div>
    </div>
  );
}
