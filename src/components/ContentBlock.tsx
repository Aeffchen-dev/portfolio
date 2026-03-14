import { ContentBlock as IContentBlock } from "@/types/blocks";
import { ImageVideoBlock } from "./blocks/ImageVideoBlock";
import { TextBlock } from "./blocks/TextBlock";
import { FigmaBlock } from "./blocks/FigmaBlock";

interface ContentBlockProps {
  block: IContentBlock;
}

export function ContentBlock({ block }: ContentBlockProps) {
  switch (block.type) {
    case "image":
    case "video":
      return <ImageVideoBlock block={block} />;
    case "text":
      return <TextBlock block={block} />;
    case "figma":
      return <FigmaBlock block={block} />;
    default:
      return null;
  }
}
