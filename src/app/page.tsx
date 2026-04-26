import Link from "next/link";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <main
      className="page-main"
      style={{
        backgroundColor: "#0d0d0d",
        minHeight: "100dvh",
        paddingLeft: 8,
        paddingRight: 8,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-between"
        style={{ paddingTop: 20, paddingBottom: 20 }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: "#f0f0f0", letterSpacing: "-0.01em" }}
        >
          Portfolio
        </span>
      </nav>

      {/* Header */}
      <header style={{ paddingTop: 60, paddingBottom: 60 }}>
        <h1
          className="font-semibold"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            color: "#f0f0f0",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Selected work
        </h1>
        <div
          style={{
            height: 1,
            backgroundColor: "#2a2a2a",
            marginTop: 48,
          }}
        />
      </header>

      {/* Projects grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
        }}
      >
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            style={{ gridColumn: "span 2", textDecoration: "none" }}
            className="group"
          >
            <div
              style={{
                borderRadius: 16,
                backgroundColor: "#1a1a1a",
                overflow: "hidden",
                transition: "background-color 0.2s",
              }}
            >
              {/* Placeholder image area */}
              <div
                style={{
                  aspectRatio: "16/9",
                  backgroundColor: "#222222",
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

              {/* Project info */}
              <div style={{ padding: "20px 24px 24px" }}>
                <p
                  className="text-xs font-medium mb-2"
                  style={{ color: "#666666", letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  {project.year}
                </p>
                <h2
                  className="font-semibold"
                  style={{
                    fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                    color: "#f0f0f0",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {project.client}
                </h2>
                <p
                  style={{
                    color: "#666666",
                    fontSize: "0.875rem",
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {project.tags.join(", ")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
