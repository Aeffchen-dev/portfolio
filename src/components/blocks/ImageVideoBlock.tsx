"use client";

import { ImageVideoBlock as IImageVideoBlock } from "@/types/blocks";
import Image from "next/image";
import { useRef, useEffect } from "react";

export function ImageVideoBlock({ block }: { block: IImageVideoBlock }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (block.type === "video" && block.autoplay && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [block]);

  return (
    <div className="block-wrapper group">
      <div
        className="relative overflow-hidden"
        style={{ borderRadius: 16, backgroundColor: "#1a1a1a" }}
      >
        {block.type === "image" ? (
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <Image
              src={block.src}
              alt={block.alt ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
        ) : (
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <video
              ref={videoRef}
              src={block.src}
              poster={block.poster}
              autoPlay={block.autoplay}
              loop={block.loop}
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      {block.caption && (
        <p
          className="mt-3 text-sm"
          style={{ color: "#666666", paddingLeft: 4, paddingRight: 4 }}
        >
          {block.caption}
        </p>
      )}
    </div>
  );
}
