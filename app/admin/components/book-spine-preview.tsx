"use client";

import { StarRating } from "@/app/components";

type BookSpinePreviewProps = {
  title: string;
  author: string;
  stars: number;
  bgColor: string;
  textColor: string;
  starColor?: string;
  width: number;
  height: number;
  titleSize: string;
  titleWeight: string;
  titleTracking: string;
};

export function BookSpinePreview({
  title,
  author,
  stars,
  bgColor,
  textColor,
  starColor,
  width,
  height,
  titleSize,
  titleWeight,
  titleTracking,
}: BookSpinePreviewProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="font-label text-xs uppercase tracking-wider text-[#c9a86a]/70">
        Live Preview
      </h3>
      <div className="flex items-center justify-center rounded border border-[#c9a86a]/20 bg-[#0f0805] p-6">
        <div
          className={`flex flex-col items-center justify-between py-4 overflow-hidden ${textColor}`}
          style={{
            backgroundColor: bgColor,
            width: `${width}px`,
            height: `${height}px`,
            borderLeft: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <StarRating count={stars} color={starColor ?? undefined} />
          <div
            className={`text-vertical ${titleWeight} ${titleSize} ${titleTracking} grow pt-4 uppercase overflow-hidden min-h-0 whitespace-nowrap`}
          >
            {title}
          </div>
          <div className="text-vertical text-[9px] font-medium opacity-50 pb-2 uppercase whitespace-nowrap">
            {author}
          </div>
        </div>
      </div>
    </div>
  );
}
