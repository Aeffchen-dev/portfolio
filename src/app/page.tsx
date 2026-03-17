import Link from "next/link";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <main
      style={{
        background: "linear-gradient(160deg, #1c1c1e 0%, #0d0d0d 50%)",
        minHeight: "100vh",
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 80,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-between"
        style={{ paddingTop: 28, paddingBottom: 28 }}
      >
        <span
          style={{
            color: "#f0f0f0",
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          portfolio
        </span>
        {/* Hamburger */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5, cursor: "pointer" }}>
          <span style={{ display: "block", width: 22, height: 1.5, backgroundColor: "#f0f0f0", borderRadius: 1 }} />
          <span style={{ display: "block", width: 22, height: 1.5, backgroundColor: "#f0f0f0", borderRadius: 1 }} />
        </div>
      </nav>

      {/* Hero */}
      <header style={{ paddingTop: 56, paddingBottom: 0 }}>
        <h1
          style={{
            fontSize: "clamp(3rem, 9vw, 7rem)",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            margin: 0,
          }}
        >
          Selected<br />
          Work
        </h1>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: "#2a2a2a", marginTop: 48, marginBottom: 32 }} />

        {/* Info rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { label: "Discipline", value: "Product Design · Brand · Web" },
            { label: "Availability", value: "Open to new projects" },
            { label: "Based in", value: "San Francisco, CA" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 600, color: "#f0f0f0", letterSpacing: "-0.01em" }}>
                {label}
              </p>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "#666666", marginTop: 2 }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Pill CTA */}
        <div style={{ marginTop: 36, marginBottom: 64 }}>
          <a
            href="mailto:hello@portfolio.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#8b8de8",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "10px 20px",
              borderRadius: 999,
            }}
          >
            Get in touch
          </a>
        </div>

        {/* Section divider before grid */}
        <div style={{ height: 1, backgroundColor: "#2a2a2a", marginBottom: 24 }} />
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
