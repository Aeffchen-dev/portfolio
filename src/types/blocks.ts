export type BlockWidth = "full" | "half";

export interface ImageVideoBlock {
  type: "image" | "video";
  width: BlockWidth;
  src: string;
  alt?: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  caption?: string;
}

export interface TextBlock {
  type: "text";
  width: BlockWidth;
  eyebrow?: string;
  heading?: string;
  body: string;
  align?: "left" | "center";
}

export interface FigmaBlock {
  type: "figma";
  width: BlockWidth;
  embedUrl: string;
  title?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/4";
}

export type ContentBlock = ImageVideoBlock | TextBlock | FigmaBlock;

export interface Project {
  slug: string;
  client: string;
  title: string;
  year: string;
  tags: string[];
  description: string;
  coverImage?: string;
  blocks: ContentBlock[];
}
