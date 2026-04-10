"use client";

import { useState, useCallback } from "react";
import { Project } from "@/types/blocks";
import { BottomSheet } from "./BottomSheet";
import Image from "next/image";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selected, setSelected] = useState<Project | null>(null);

  const open = useCallback((project: Project) => setSelected(project), []);
  const close = useCallback(() => setSelected(null), []);

  return (
    <>
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}
      >
        {projects.map((project) => (
          <button
            key={project.slug}
            onClick={() => open(project)}
            className="project-card-link"
            style={{
              gridColumn: "span 2",
              textDecoration: "none",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              className="project-card"
              style={{
                borderRadius: 16,
                backgroundColor: "#1a1a1a",
                overflow: "hidden",
              }}
            >
              {/* Cover image */}
              <div
                className="project-card-image-wrapper"
                style={{
                  aspectRatio: "16/9",
                  overflow: "hidden",
                  position: "relative",
                  backgroundColor: "#222222",
                }}
              >
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.client}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        fontWeight: 600,
                        color: "#2a2a2a",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {project.client}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "20px 24px 24px" }}>
                <p
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    color: "#666666",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {project.year}
                </p>
                <h2
                  style={{
                    fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                    fontWeight: 600,
                    color: "#f0f0f0",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                    marginBottom: 4,
                  }}
                >
                  {project.client}
                </h2>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "0.875rem",
                    lineHeight: 1.4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {project.title}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <BottomSheet project={selected} onClose={close} />
    </>
  );
}
