import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { BlockGrid } from "@/components/BlockGrid";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.client} — Portfolio`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

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
        <Link
          href="/"
          className="text-sm font-medium transition-colors"
          style={{ color: "#f0f0f0", textDecoration: "none", letterSpacing: "-0.01em" }}
        >
          Portfolio
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "#666666", textDecoration: "none" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All work
        </Link>
      </nav>

      {/* Hero header */}
      <header style={{ paddingTop: 60, paddingBottom: 60 }}>
        {/* Tags */}
        <div
          className="flex flex-wrap gap-2 mb-6"
        >
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

        {/* Client name */}
        <p
          className="font-semibold mb-3"
          style={{
            fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
            color: "#666666",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {project.client}
        </p>

        {/* Title */}
        <h1
          className="font-semibold"
          style={{
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            color: "#f0f0f0",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            maxWidth: "16ch",
          }}
        >
          {project.title}
        </h1>

        {/* Description */}
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

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "#2a2a2a",
            marginTop: 48,
          }}
        />
      </header>

      {/* Content blocks */}
      <BlockGrid blocks={project.blocks} />
    </main>
  );
}
