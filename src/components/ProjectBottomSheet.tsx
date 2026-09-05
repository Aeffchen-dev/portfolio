"use client";

import { useState, useRef, useCallback } from "react";
import { projects } from "@/data/projects";
import type { Project } from "@/types/blocks";
import { BlockGrid } from "@/components/BlockGrid";

interface Props {
  currentSlug: string;
}

type ContentPhase = "idle" | "exiting" | "entering";
type CloseMode = "fade" | "pinch";

export function ProjectBottomSheet({ currentSlug }: Props) {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  const initialNext = projects[(currentIndex + 1) % projects.length];

  // Visibility / open state
  const [mounted, setMounted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Content transition
  const [displayedProject, setDisplayedProject] = useState<Project>(initialNext);
  const [contentKey, setContentKey] = useState(0);
  const [contentPhase, setContentPhase] = useState<ContentPhase>("idle");

  // Drag
  const [isDragging, setIsDragging] = useState(false);
  const isClosingRef = useRef(false);
  const dragStartY = useRef(0);
  const lastDragY = useRef(0);
  const lastDragTime = useRef(0);
  const velocityRef = useRef(0);

  // Refs for direct DOM manipulation during drag (avoids 60fps re-renders)
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const handlePillRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ─── Open ────────────────────────────────────────────────────────────────

  const openSheet = useCallback(() => {
    isClosingRef.current = false;
    setMounted(true);
    setContentPhase("idle");
    // Double rAF: let the DOM paint at translateY(100%) first, then animate in
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setSheetOpen(true))
    );
  }, []);

  // ─── Close ───────────────────────────────────────────────────────────────

  const closeSheet = useCallback(
    (mode: CloseMode = "fade") => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;

      setSheetOpen(false);

      // "Pinch from center" backdrop close for drag-triggered dismissal
      if (mode === "pinch" && backdropRef.current) {
        backdropRef.current.style.transformOrigin = "50% 50%";
        backdropRef.current.style.transition =
          "transform 0.44s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.44s ease";
        backdropRef.current.style.transform = "scaleY(0)";
        backdropRef.current.style.opacity = "0";
      }

      setTimeout(() => {
        setMounted(false);
        setDisplayedProject(initialNext);
        setContentKey(0);
        setContentPhase("idle");
        isClosingRef.current = false;
        // Reset direct DOM styles so next open is clean
        if (backdropRef.current) {
          backdropRef.current.style.transform = "";
          backdropRef.current.style.transformOrigin = "";
          backdropRef.current.style.transition = "";
          backdropRef.current.style.opacity = "";
        }
      }, 500);
    },
    [initialNext]
  );

  // ─── Drag ────────────────────────────────────────────────────────────────

  const startDrag = useCallback((clientY: number) => {
    setIsDragging(true);
    dragStartY.current = clientY;
    lastDragY.current = clientY;
    lastDragTime.current = Date.now();
    velocityRef.current = 0;
  }, []);

  const moveDrag = useCallback((clientY: number) => {
    const delta = Math.max(0, clientY - dragStartY.current);

    // Track velocity for flick detection
    const now = Date.now();
    const dt = now - lastDragTime.current;
    if (dt > 0) velocityRef.current = (clientY - lastDragY.current) / dt;
    lastDragY.current = clientY;
    lastDragTime.current = now;

    // Direct DOM updates — skip React render loop for silky drag
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
      sheetRef.current.style.transition = "none";
    }
    if (backdropRef.current) {
      const progress = Math.min(delta / (window.innerHeight * 0.55), 1);
      backdropRef.current.style.opacity = String(0.72 * (1 - progress));
      backdropRef.current.style.transition = "none";
    }
    if (handlePillRef.current) {
      // Pill stretches as drag builds confidence
      const stretch = Math.min(delta / 80, 1);
      handlePillRef.current.style.width = `${32 + stretch * 12}px`;
      handlePillRef.current.style.backgroundColor =
        delta > 24 ? "#555" : "#2a2a2a";
    }
  }, []);

  const endDrag = useCallback(
    (clientY: number) => {
      setIsDragging(false);
      const delta = Math.max(0, clientY - dragStartY.current);
      const v = velocityRef.current; // px/ms

      if (delta > 130 || v > 0.45) {
        // Commit close: let the sheet slide out from current drag position
        if (sheetRef.current) {
          sheetRef.current.style.transition =
            "transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)";
          sheetRef.current.style.transform = "translateY(100%)";
        }
        closeSheet("pinch");
      } else {
        // Snap back with spring
        if (sheetRef.current) {
          sheetRef.current.style.transition =
            "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)";
          sheetRef.current.style.transform = "translateY(0)";
        }
        if (backdropRef.current) {
          backdropRef.current.style.transition = "opacity 0.4s ease";
          backdropRef.current.style.opacity = "0.72";
        }
        if (handlePillRef.current) {
          handlePillRef.current.style.width = "32px";
          handlePillRef.current.style.backgroundColor = "#2a2a2a";
        }
      }
    },
    [closeSheet]
  );

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => startDrag(e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => moveDrag(e.touches[0].clientY);
  const onTouchEnd = (e: React.TouchEvent) =>
    endDrag(e.changedTouches[0].clientY);

  // Mouse handlers (desktop drag)
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startDrag(e.clientY);
    const onMove = (ev: MouseEvent) => moveDrag(ev.clientY);
    const onUp = (ev: MouseEvent) => {
      endDrag(ev.clientY);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ─── Content transition ──────────────────────────────────────────────────

  const goToNext = useCallback(() => {
    const idx = projects.findIndex((p) => p.slug === displayedProject.slug);
    const next = projects[(idx + 1) % projects.length];

    // Phase 1: exit current content
    setContentPhase("exiting");

    setTimeout(() => {
      // Phase 2: swap (invisible)
      setDisplayedProject(next);
      setContentKey((k) => k + 1);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setContentPhase("entering");

      // Phase 3: reveal — next rAF so "entering" paints first
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setContentPhase("idle"))
      );
    }, 260);
  }, [displayedProject]);

  // ─── Derived styles ──────────────────────────────────────────────────────

  const sheetTransform = sheetOpen ? "translateY(0)" : "translateY(100%)";
  const sheetTransition = isDragging
    ? "none"
    : sheetOpen
      ? "transform 0.55s cubic-bezier(0.32, 0.72, 0, 1)"
      : "transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)";

  // Content crossfade — exiting slides up + fades, entering jumps below + fades in
  const contentStyle: React.CSSProperties =
    contentPhase === "exiting"
      ? {
          opacity: 0,
          transform: "translateY(-10px) scale(0.995)",
          transition: "opacity 0.24s ease, transform 0.24s ease",
          pointerEvents: "none",
        }
      : contentPhase === "entering"
        ? {
            opacity: 0,
            transform: "translateY(0)",
            transition: "none",
          }
        : {
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 0.18s ease",
          };

  const nextDisplayedProject =
    projects[
      (projects.findIndex((p) => p.slug === displayedProject.slug) + 1) %
        projects.length
    ];

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Next project trigger (bottom of page) ── */}
      <div
        style={{
          padding: "72px 8px 96px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.6875rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#444",
          }}
        >
          Next project
        </p>
        <button
          onClick={openSheet}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 22px",
            border: "1px solid #2a2a2a",
            borderRadius: 100,
            background: "none",
            cursor: "pointer",
            color: "#f0f0f0",
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            fontFamily: "inherit",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#555";
            e.currentTarget.style.background = "#1a1a1a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#2a2a2a";
            e.currentTarget.style.background = "none";
          }}
        >
          {initialNext.client}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 7H11M8 4L11 7L8 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Sheet portal ── */}
      {mounted && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            pointerEvents: sheetOpen ? "auto" : "none",
          }}
        >
          {/* Backdrop — fades in on open, "pinch to center" on drag-close */}
          <div
            ref={backdropRef}
            onClick={() => closeSheet("fade")}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#000",
              opacity: sheetOpen ? 0.72 : 0,
              transition: isDragging ? "none" : "opacity 0.44s ease",
            }}
          />

          {/* Sheet */}
          <div
            ref={sheetRef}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "90vh",
              backgroundColor: "#0d0d0d",
              borderRadius: "18px 18px 0 0",
              transform: sheetTransform,
              transition: sheetTransition,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 -6px 48px rgba(0,0,0,0.65)",
            }}
          >
            {/* Drag handle */}
            <div
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              style={{
                flexShrink: 0,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "grab",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            >
              <div
                ref={handlePillRef}
                style={{
                  width: 32,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#2a2a2a",
                  transition: isDragging
                    ? "none"
                    : "width 0.3s ease, background-color 0.3s ease",
                }}
              />
            </div>

            {/* Scrollable content area */}
            <div
              ref={scrollRef}
              style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}
            >
              {/* Crossfade wrapper — keyed so stagger CSS animations replay on swap */}
              <div key={contentKey} style={contentStyle}>
                {/* ── Project header with staggered entry ── */}
                <div
                  style={{
                    padding: "8px 8px 48px",
                    fontFamily:
                      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}
                >
                  {/* Tags — stagger slot 1 */}
                  <div
                    className="sheet-stagger-1"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 24,
                    }}
                  >
                    {displayedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color: "#666",
                          backgroundColor: "#1a1a1a",
                          borderRadius: 100,
                          padding: "6px 12px",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "#3a3a3a",
                        backgroundColor: "#1a1a1a",
                        borderRadius: 100,
                        padding: "6px 12px",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {displayedProject.year}
                    </span>
                  </div>

                  {/* Client — stagger slot 2 */}
                  <p
                    className="sheet-stagger-2"
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: "#555",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                      margin: "0 0 12px",
                    }}
                  >
                    {displayedProject.client}
                  </p>

                  {/* Title — stagger slot 3 */}
                  <h2
                    className="sheet-stagger-3"
                    style={{
                      fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
                      fontWeight: 600,
                      color: "#f0f0f0",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.05,
                      maxWidth: "16ch",
                      margin: "0 0 16px",
                    }}
                  >
                    {displayedProject.title}
                  </h2>

                  {/* Description — stagger slot 4 */}
                  <p
                    className="sheet-stagger-4"
                    style={{
                      color: "#888",
                      fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
                      maxWidth: "52ch",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {displayedProject.description}
                  </p>

                  {/* Divider — stagger slot 5 */}
                  <div
                    className="sheet-stagger-5"
                    style={{
                      height: 1,
                      backgroundColor: "#2a2a2a",
                      marginTop: 40,
                    }}
                  />
                </div>

                {/* Content blocks — stagger slot 6 */}
                <div className="sheet-stagger-6">
                  <BlockGrid blocks={displayedProject.blocks} />
                </div>

                {/* ── Next project trigger inside sheet ── */}
                <div
                  style={{
                    padding: "64px 8px 80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                    fontFamily:
                      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.6875rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#444",
                    }}
                  >
                    Next project
                  </p>
                  <button
                    onClick={goToNext}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 22px",
                      border: "1px solid #2a2a2a",
                      borderRadius: 100,
                      background: "none",
                      cursor: "pointer",
                      color: "#f0f0f0",
                      fontSize: "1rem",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      fontFamily: "inherit",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#555";
                      e.currentTarget.style.background = "#1a1a1a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#2a2a2a";
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    {nextDisplayedProject.client}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 7H11M8 4L11 7L8 10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
