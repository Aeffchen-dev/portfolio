import { projects } from "@/data/projects";
import { ProjectGrid } from "@/components/ProjectGrid";

export default function Home() {
  return (
    <main
      style={{
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 80,
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

      {/* Projects grid + bottom sheet */}
      <ProjectGrid projects={projects} />
    </main>
  );
}
