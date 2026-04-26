/**
 * 内联 SVG 像素风小图标（8×8 / 10×10 网格风格）
 */
type IconName = "star" | "heart" | "cloud" | "sparkle" | "leaf";

interface Props {
  name: IconName;
  size?: number;
  className?: string;
}

const PATHS: Record<IconName, { d: string; viewBox: string }> = {
  // 5x5 像素星星
  star: {
    viewBox: "0 0 10 10",
    d: "M4 0h2v2h2v2h2v2H8v2h2v2H6V8H4v2H0V8h2V6H0V4h2V2h2z",
  },
  heart: {
    viewBox: "0 0 10 9",
    d: "M1 0h2v1h1V1H3V0H1zM6 0h2v1h1V1H8V0H6zM0 1h1v2H0zM4 1h2v1H4zM9 1h1v2H9zM1 3h1v1H1zM3 3h1v1H3zM6 3h1v1H6zM8 3h1v1H8zM2 4h1v1H2zM4 4h2v1H4zM7 4h1v1H7zM3 5h1v1H3zM6 5h1v1H6zM4 6h2v1H4z",
  },
  cloud: {
    viewBox: "0 0 12 7",
    d: "M3 0h3v1H3zM2 1h1v1H2zM6 1h2v1H6zM1 2h1v1H1zM8 2h2v1H8zM0 3h1v2H0zM10 3h2v2h-2zM1 5h10v1H1zM2 6h8v1H2z",
  },
  sparkle: {
    viewBox: "0 0 7 7",
    d: "M3 0h1v2H3zM0 3h2v1H0zM5 3h2v1H5zM3 5h1v2H3zM2 2h1v1H2zM4 2h1v1H4zM2 4h1v1H2zM4 4h1v1H4z",
  },
  leaf: {
    viewBox: "0 0 8 8",
    d: "M5 0h3v3H5zM2 1h2v1H2zM4 2h1v2H4zM1 2h1v2H1zM0 4h2v2H0zM2 4h2v1H2zM3 5h2v1H3zM1 6h3v1H1zM2 7h2v1H2z",
  },
};

export function PixelIcon({ name, size = 16, className }: Props) {
  const { d, viewBox } = PATHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d={d} />
    </svg>
  );
}
