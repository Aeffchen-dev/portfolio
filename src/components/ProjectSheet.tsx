"use client";

import { useEffect } from "react";
import { Project } from "@/types/blocks";
import { BlockGrid } from "./BlockGrid";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export function ProjectSheet({ project, onClose }: Props) {
  const isOpen = project !== null;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 199,
          background: isOpen ? "rgba(0,0,0,0.6)" : "transparent",
          pointerEvents: isOpen ? "auto" : "none",
          transition: "background 0.5s cubic-bezier(.4,0,.2,1)",
        }}
      />

      {/* Close bar */}
      <div
        role="button"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: "5vh",
          minHeight: 40,
          background: "#1a1a1a",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          zIndex: 201,
          cursor: "pointer",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.5s cubic-bezier(.4,0,.2,1)",
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Close
      </div>

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          width: "100vw",
          maxWidth: 1100,
          zIndex: 200,
          transform: isOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(100%)",
          transition: "transform 0.5s cubic-bezier(.4,0,.2,1)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div
          style={{
            maxHeight: "95dvh",
            overflowY: "auto",
            overscrollBehavior: "contain",
            borderRadius: "16px 16px 0 0",
            background: "#1a1a1a",
            paddingLeft: 8,
            paddingRight: 8,
            paddingBottom: 80,
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          {project && (
            <>
              <header style={{ paddingTop: 60, paddingBottom: 60 }}>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium"
                      style={{
                        color: "#666666",
                        backgroundColor: "#1a1a1a",
                        borderRadius: 100,
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingTop: 6,
                        paddingBottom: 6,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: "#444444",
                      backgroundColor: "#1a1a1a",
                      borderRadius: 100,
                      paddingLeft: 12,
                      paddingRight: 12,
                      paddingTop: 6,
                      paddingBottom: 6,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {project.year}
                  </span>
                </div>

                <p
                  className="font-semibold mb-3"
                  style={{
                    fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
                    color: "#666666",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}
                >
                  {project.client}
                </p>

                <h1
                  className="font-semibold"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 4.5rem)",
                    color: "#f0f0f0",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    maxWidth: "16ch",
                    marginTop: 2,
                  }}
                >
                  {project.title}
                </h1>

                <p
                  className="mt-6"
                  style={{
                    color: "#888888",
                    fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)",
                    maxWidth: "52ch",
                    lineHeight: 1.6,
                  }}
                >
                  {project.description}
                </p>

                <div style={{ height: 1, backgroundColor: "#2a2a2a", marginTop: 48 }} />
              </header>

              <BlockGrid blocks={project.blocks} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
