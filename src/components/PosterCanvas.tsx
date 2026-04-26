import { forwardRef } from "react";
import { PixelIcon } from "./PixelIcon";

export type StyleKey = "minimal" | "healing" | "trendy";

interface Props {
  styleKey: StyleKey;
  content: string;
}

/**
 * 1:1 海报渲染容器（1080x1080 逻辑像素，缩放显示）
 * 通过 ref 给 html2canvas 截图
 */
export const PosterCanvas = forwardRef<HTMLDivElement, Props>(
  ({ styleKey, content }, ref) => {
    return (
      <div className="flex justify-center">
        <div
          ref={ref}
          // 1080×1080 真实像素，CSS 缩放为预览
          style={{
            width: 1080,
            height: 1080,
            transform: "scale(var(--poster-scale, 0.4))",
            transformOrigin: "top center",
          }}
          className="shrink-0"
        >
          {styleKey === "minimal" && <MinimalPoster content={content} />}
          {styleKey === "healing" && <HealingPoster content={content} />}
          {styleKey === "trendy" && <TrendyPoster content={content} />}
        </div>
      </div>
    );
  }
);
PosterCanvas.displayName = "PosterCanvas";

/* ========== ① 简约清爽风 ========== */
function MinimalPoster({ content }: { content: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "hsl(40 50% 98%)",
        color: "hsl(24 18% 22%)",
        padding: 96,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Noto Sans SC", sans-serif',
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 32,
          borderBottom: "3px solid hsl(24 18% 22%)",
        }}
      >
        <div style={{ fontSize: 32, fontFamily: "VT323, monospace", letterSpacing: 4 }}>
          MINIMAL · 简约
        </div>
        <div style={{ display: "flex", gap: 12, color: "hsl(24 86% 60%)" }}>
          <PixelIcon name="leaf" size={36} />
          <PixelIcon name="sparkle" size={28} />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          marginTop: 64,
          fontSize: 44,
          lineHeight: 1.8,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          letterSpacing: 1,
        }}
      >
        {content}
      </div>

      <div
        style={{
          marginTop: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 22,
          color: "hsl(24 12% 45%)",
          fontFamily: "VT323, monospace",
          letterSpacing: 2,
        }}
      >
        <span>— made with 文字排版机 —</span>
        <span>♥ {new Date().toLocaleDateString("zh-CN")}</span>
      </div>
    </div>
  );
}

/* ========== ② 文艺治愈风 ========== */
function HealingPoster({ content }: { content: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(160deg, hsl(261 45% 92%) 0%, hsl(40 60% 96%) 60%, hsl(24 70% 92%) 100%)",
        color: "hsl(24 18% 22%)",
        padding: 96,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: '"Noto Sans SC", serif',
        position: "relative",
      }}
    >
      {/* 像素装饰 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          color: "hsl(261 32% 60%)",
          opacity: 0.7,
        }}
      >
        <PixelIcon name="cloud" size={64} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 90,
          right: 70,
          color: "hsl(24 86% 65%)",
          opacity: 0.8,
        }}
      >
        <PixelIcon name="sparkle" size={40} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 80,
          color: "hsl(24 86% 65%)",
          opacity: 0.6,
        }}
      >
        <PixelIcon name="heart" size={44} />
      </div>

      <div
        style={{
          fontSize: 28,
          letterSpacing: 16,
          color: "hsl(261 28% 50%)",
          marginTop: 40,
          marginBottom: 24,
          fontFamily: "VT323, monospace",
        }}
      >
        ─── ✿ ───
      </div>

      <div
        style={{
          flex: 1,
          width: "100%",
          fontSize: 42,
          lineHeight: 2,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          textAlign: "center",
          letterSpacing: 2,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>{content}</div>
      </div>

      <div
        style={{
          fontSize: 28,
          letterSpacing: 16,
          color: "hsl(261 28% 50%)",
          marginTop: 24,
          marginBottom: 12,
          fontFamily: "VT323, monospace",
        }}
      >
        ─── ✿ ───
      </div>
      <div style={{ fontSize: 22, color: "hsl(24 12% 45%)", letterSpacing: 4 }}>
        — 致每个温柔的你 —
      </div>
    </div>
  );
}

/* ========== ③ 潮流个性风 ========== */
function TrendyPoster({ content }: { content: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "hsl(24 18% 12%)",
        color: "hsl(40 50% 96%)",
        padding: 80,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Noto Sans SC", sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 像素方格点缀 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(hsl(24 86% 69% / 0.15) 2px, transparent 2px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />
      {/* 暖橘色块 */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 360,
          height: 360,
          background: "hsl(24 86% 69%)",
          transform: "rotate(15deg)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 240,
          height: 240,
          background: "hsl(261 32% 65%)",
          transform: "rotate(-10deg)",
          opacity: 0.85,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "inline-block",
            background: "hsl(24 86% 69%)",
            color: "hsl(24 18% 12%)",
            padding: "12px 28px",
            fontSize: 36,
            fontFamily: "VT323, monospace",
            letterSpacing: 4,
            border: "4px solid hsl(40 50% 96%)",
            boxShadow: "8px 8px 0 hsl(261 32% 65%)",
          }}
        >
          ▍TRENDY
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          marginTop: 64,
          fontSize: 42,
          lineHeight: 1.8,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          letterSpacing: 1,
          fontWeight: 500,
        }}
      >
        {content}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: 24,
          paddingTop: 24,
          borderTop: "2px dashed hsl(40 50% 96% / 0.4)",
          fontSize: 22,
          color: "hsl(40 50% 96% / 0.7)",
          fontFamily: "VT323, monospace",
          letterSpacing: 3,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>// 文字排版机 · TRENDY MODE</span>
        <span>★ {new Date().toLocaleDateString("zh-CN")}</span>
      </div>
    </div>
  );
}
