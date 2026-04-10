"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Project } from "@/types/blocks";
import { BlockGrid } from "./BlockGrid";

interface BottomSheetProps {
  project: Project | null;
  projects: Project[];
  onClose: () => void;
}

const CLOSE_AREA_BASE = 72;
const CLOSE_THRESHOLD = 100;

// ─── Inner panel (defined outside to avoid re-mount on parent re-render) ──────

interface PanelProps {
  project: Project;
  nextProject: Project | null;
  onNext: () => void;
}

function ProjectPanel({ project, nextProject, onNext }: PanelProps) {
  return (
    <div style={{ height: "100%", overflowY: "auto", WebkitOverflowScrolling: "touch" as never }}>
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

      {/* Next project link */}
      {nextProject && (
        <button
          onClick={onNext}
          style={{
            display: "block",
            width: "100%",
            padding: "40px 16px",
            background: "none",
            border: "none",
            borderTop: "1px solid #2a2a2a",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
          }}
        >
          <p
            style={{
              fontSize: "0.6875rem",
              fontWeight: 500,
              color: "#444444",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Next project
          </p>
          <p
            style={{
              fontSize: "clamp(1.25rem, 3vw, 2rem)",
              fontWeight: 600,
              color: "#f0f0f0",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {nextProject.client}
          </p>
          <p
            style={{
              color: "#666666",
              fontSize: "0.875rem",
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            {nextProject.title}
          </p>
        </button>
      )}

      <div style={{ height: 40 }} />
    </div>
  );
}

// ─── Bottom sheet ──────────────────────────────────────────────────────────────

export function BottomSheet({ project, projects, onClose }: BottomSheetProps) {
  // Sheet open/close
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Content transition: active panel exits up, entering panel comes from below
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [enteringProject, setEnteringProject] = useState<Project | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startY = useRef(0);

  // Sync sheet open/close from parent
  useEffect(() => {
    if (project) {
      setActiveProject(project);
      setEnteringProject(null);
      setIsTransitioning(false);
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        setMounted(false);
        setActiveProject(null);
      }, 420);
      return () => clearTimeout(t);
    }
  }, [project]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = mounted ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mounted]);

  // Navigate to next project with push animation
  const goToNext = useCallback(() => {
    if (!activeProject || isTransitioning) return;
    const idx = projects.findIndex((p) => p.slug === activeProject.slug);
    const next = projects[(idx + 1) % projects.length];

    // 1. Mount entering panel off-screen (translateY 100%, no transition)
    setEnteringProject(next);

    // 2. After paint, trigger both transitions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTransitioning(true);

        // 3. After animation, finalise
        setTimeout(() => {
          setActiveProject(next);
          setEnteringProject(null);
          setIsTransitioning(false);
        }, 460);
      });
    });
  }, [activeProject, projects, isTransitioning]);

  // Close-area drag handlers
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
    if (dragY >= CLOSE_THRESHOLD) onClose();
    setDragY(0);
  }, [isDragging, dragY, onClose]);

  if (!mounted || !activeProject) return null;

  const activeIdx = projects.findIndex((p) => p.slug === activeProject.slug);
  const nextProject = projects.length > 1
    ? projects[(activeIdx + 1) % projects.length]
    : null;

  const closeAreaHeight = CLOSE_AREA_BASE + dragY;
  const sheetTranslate = visible ? `translateY(${dragY}px)` : "translateY(100%)";

  // Entering panel's "next" (project after the entering one)
  const enteringIdx = enteringProject
    ? projects.findIndex((p) => p.slug === enteringProject.slug)
    : -1;
  const enteringNextProject = enteringProject && projects.length > 1
    ? projects[(enteringIdx + 1) % projects.length]
    : null;

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
        {/* Drag handle */}
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

        {/* Content viewport — clips panels during transition */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

          {/* Active panel — exits upward */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: isTransitioning ? "translateY(-100%)" : "translateY(0)",
              transition: isTransitioning
                ? "transform 0.46s cubic-bezier(0.32, 0.72, 0, 1)"
                : "none",
            }}
          >
            <ProjectPanel
              project={activeProject}
              nextProject={nextProject}
              onNext={goToNext}
            />
          </div>

          {/* Entering panel — rises from below */}
          {enteringProject && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: isTransitioning ? "translateY(0)" : "translateY(100%)",
                transition: isTransitioning
                  ? "transform 0.46s cubic-bezier(0.32, 0.72, 0, 1)"
                  : "none",
              }}
            >
              <ProjectPanel
                project={enteringProject}
                nextProject={enteringNextProject}
                onNext={goToNext}
              />
            </div>
          )}
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
