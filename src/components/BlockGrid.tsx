import { ContentBlock as IContentBlock } from "@/types/blocks";
import { ContentBlock } from "./ContentBlock";

interface BlockGridProps {
  blocks: IContentBlock[];
}

/**
 * Lays out content blocks in a 4-column grid.
 * Full-width blocks span all 4 columns.
 * Half-width blocks span 2 columns.
 * Two consecutive half-width blocks are paired in the same row.
 */
export function BlockGrid({ blocks }: BlockGridProps) {
  // Group blocks into rows: pair consecutive halves, full blocks get their own row
  const rows: IContentBlock[][] = [];
  let i = 0;

  while (i < blocks.length) {
    const current = blocks[i];

    if (current.width === "half") {
      const next = blocks[i + 1];
      if (next && next.width === "half") {
        rows.push([current, next]);
        i += 2;
      } else {
        // Lone half-block — treat as full
        rows.push([current]);
        i += 1;
      }
    } else {
      rows.push([current]);
      i += 1;
    }
  }

  return (
    <div
      className="flex flex-col"
      style={{ gap: 8 }}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          {row.map((block, blockIndex) => (
            <div
              key={blockIndex}
              style={{
                gridColumn:
                  row.length === 2
                    ? "span 2"
                    : "span 4",
              }}
            >
              <ContentBlock block={block} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
