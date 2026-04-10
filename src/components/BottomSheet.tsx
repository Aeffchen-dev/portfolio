"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Project } from "@/types/blocks";
import { BlockGrid } from "./BlockGrid";

interface BottomSheetProps {
  project: Project | null;
  onClose: () => void;
}

const CLOSE_AREA_BASE = 72;
const CLOSE_THRESHOLD = 100;

export function BottomSheet({ project, onClose }: BottomSheetProps) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const startY = useRef(0);

  // Mount → trigger open animation
  useEffect(() => {
    if (project) {
      setMounted(true);
      // Small delay so initial translateY(100%) is painted before we animate in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 420);
      return () => clearTimeout(t);
    }
  }, [project]);

  // Lock body scroll while open
  useEffect(() => {
    if (mounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mounted]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    (e.target as Element).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragY(Math.max(0, e.clientY - startY.current));
  }, [isDragging]);

  const onPointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY >= CLOSE_THRESHOLD) {
      onClose();
    }
    setDragY(0);
  }, [isDragging, dragY, onClose]);

  if (!mounted || !project) return null;

  const closeAreaHeight = CLOSE_AREA_BASE + dragY;
  const sheetTranslate = visible ? `translateY(${dragY}px)` : "translateY(100%)";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.75)",
          zIndex: 40,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          top: "4vh",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
          backgroundColor: "#0d0d0d",
          transform: sheetTranslate,
          transition: isDragging
            ? "none"
            : "transform 0.42s cubic-bezier(0.32, 0.72, 0, 1)",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Drag handle bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 12,
            paddingBottom: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#2a2a2a",
            }}
          />
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch" as never,
          }}
        >
          {/* Hero cover */}
          {project.coverImage && (
            <div
              style={{
                margin: "0 8px 8px",
                borderRadius: 12,
                overflow: "hidden",
                aspectRatio: "16/9",
                position: "relative",
                backgroundColor: "#1a1a1a",
              }}
            >
              <Image
                src={project.coverImage}
                alt={project.client}
                fill
                style={{ objectFit: "cover" }}
                sizes="100vw"
              />
            </div>
          )}

          {/* Header */}
          <div style={{ padding: "40px 16px 48px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "#666666",
                    backgroundColor: "#1a1a1a",
                    borderRadius: 100,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 6,
                    paddingBottom: 6,
                  }}
                >
                  {tag}
                </span>
              ))}
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "#444444",
                  backgroundColor: "#1a1a1a",
                  borderRadius: 100,
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 6,
                  paddingBottom: 6,
                }}
              >
                {project.year}
              </span>
            </div>

            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#666666",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              {project.client}
            </p>

            <h2
              style={{
                fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
                fontWeight: 600,
                color: "#f0f0f0",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                maxWidth: "16ch",
                marginBottom: 16,
              }}
            >
              {project.title}
            </h2>

            <p
              style={{
                color: "#888888",
                fontSize: "0.9375rem",
                lineHeight: 1.6,
                maxWidth: "48ch",
              }}
            >
              {project.description}
            </p>

            <div style={{ height: 1, backgroundColor: "#2a2a2a", marginTop: 40 }} />
          </div>

          {/* Content blocks */}
          <div style={{ padding: "0 8px" }}>
            <BlockGrid blocks={project.blocks} />
          </div>

          <div style={{ height: 40 }} />
        </div>

        {/* Close area — grows on drag */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            height: closeAreaHeight,
            flexShrink: 0,
            backgroundColor: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "none",
            transition: isDragging ? "none" : "height 0.3s ease",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "#444444",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Close
          </span>
        </div>
      </div>
    </>
  );
}
