import { TextBlock as ITextBlock } from "@/types/blocks";

export function TextBlock({ block }: { block: ITextBlock }) {
  const isCenter = block.align === "center";

  return (
    <div
      className="flex flex-col justify-center h-full"
      style={{
        borderRadius: 16,
        backgroundColor: "#1a1a1a",
        padding: "40px 40px",
        textAlign: isCenter ? "center" : "left",
        alignItems: isCenter ? "center" : "flex-start",
        minHeight: 280,
      }}
    >
      {block.eyebrow && (
        <p
          className="text-xs font-medium tracking-widest uppercase mb-4"
          style={{ color: "#666666", letterSpacing: "0.12em" }}
        >
          {block.eyebrow}
        </p>
      )}
      {block.heading && (
        <h2
          className="font-semibold leading-tight mb-5"
          style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
            color: "#f0f0f0",
            letterSpacing: "-0.02em",
            maxWidth: isCenter ? "48rem" : undefined,
          }}
        >
          {block.heading}
        </h2>
      )}
      <p
        className="leading-relaxed"
        style={{
          color: "#888888",
          fontSize: "0.9375rem",
          maxWidth: isCenter ? "42rem" : "38rem",
        }}
      >
        {block.body}
      </p>
    </div>
  );
}
