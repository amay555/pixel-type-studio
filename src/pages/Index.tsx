import { useMemo, useState } from "react";
import { Sparkles, Eraser } from "lucide-react";
import { PixelIcon } from "@/components/PixelIcon";
import { ResultCard } from "@/components/ResultCard";
import { formatHealing, formatMinimal, formatTrendy } from "@/lib/formatters";

const MAX_LEN = 1000;
const SAMPLE =
  "今天的风很温柔。\n走在回家的路上，听见树叶沙沙响，像谁在轻声说晚安。\n生活有时很慢，但总会变好。";

interface ResultItem {
  title: string;
  subtitle: string;
  content: string;
  tone: "minimal" | "healing" | "trendy";
  iconName: "leaf" | "sparkle" | "heart";
}

const Index = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState<ResultItem[] | null>(null);

  const trimmed = text.trim();
  const canGenerate = trimmed.length > 0;
  const count = useMemo(() => text.length, [text]);

  const handleGenerate = () => {
    if (!canGenerate) return;
    setResults([
      {
        title: "简约清爽风",
        subtitle: "Minimal · 干净易读",
        content: formatMinimal(text),
        tone: "minimal",
        iconName: "leaf",
      },
      {
        title: "文艺治愈风",
        subtitle: "Healing · 温柔诗意",
        content: formatHealing(text),
        tone: "healing",
        iconName: "sparkle",
      },
      {
        title: "潮流个性风",
        subtitle: "Trendy · 活力出片",
        content: formatTrendy(text),
        tone: "trendy",
        iconName: "heart",
      },
    ]);
    // 平滑滚动到结果
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleClear = () => {
    setText("");
    setResults(null);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[480px] px-4 pb-16 pt-6">
        {/* Header */}
        <header className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-3 text-primary">
            <PixelIcon name="star" size={18} />
            <h1 className="font-pixel text-3xl tracking-wider text-foreground">
              文字排版机
            </h1>
            <PixelIcon name="heart" size={18} className="text-secondary" />
          </div>
          <p className="text-xs text-muted-foreground">
            一键生成 · 三种风格 · 复制即用
          </p>

          {/* 像素云朵装饰 */}
          <div className="mt-3 flex items-center justify-center gap-3 text-secondary/70">
            <PixelIcon name="cloud" size={20} />
            <PixelIcon name="sparkle" size={12} className="text-primary" />
            <PixelIcon name="cloud" size={16} />
          </div>
        </header>

        {/* 输入区 */}
        <section
          aria-label="文字输入"
          className="pixel-border rounded-2xl bg-card p-3 shadow-pixel-soft"
        >
          <label htmlFor="text-input" className="sr-only">
            输入文字
          </label>
          <textarea
            id="text-input"
            value={text}
            maxLength={MAX_LEN}
            onChange={(e) => setText(e.target.value)}
            placeholder={`在这里输入你想排版的文字…\n\n例如：\n${SAMPLE}`}
            className="block min-h-[180px] w-full resize-y rounded-xl border-0 bg-transparent px-2 py-2 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <div className="mt-1 flex items-center justify-between px-2 pb-1 text-[11px] text-muted-foreground">
            <button
              type="button"
              onClick={handleClear}
              disabled={text.length === 0}
              className="press-pixel inline-flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <Eraser size={12} />
              清空
            </button>
            <span>
              {count} / {MAX_LEN}
            </span>
          </div>
        </section>

        {/* 主操作按钮 */}
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="press-pixel pixel-border shadow-pixel inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-pixel text-xl text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles size={18} />
            一键排版
            <Sparkles size={18} />
          </button>
        </div>

        {/* 结果区 */}
        <section id="results" className="mt-8 space-y-5">
          {results ? (
            results.map((r, i) => (
              <ResultCard
                key={r.title}
                index={i}
                title={r.title}
                subtitle={r.subtitle}
                content={r.content}
                tone={r.tone}
                iconName={r.iconName}
              />
            ))
          ) : (
            <div className="pixel-border rounded-2xl border-dashed bg-card/60 px-4 py-10 text-center text-sm text-muted-foreground">
              <div className="mb-2 flex justify-center text-secondary">
                <PixelIcon name="cloud" size={28} />
              </div>
              输入文字后，点击上方按钮
              <br />
              这里会出现三种风格的排版结果
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-[11px] text-muted-foreground/80">
          <p>在微信中打开可直接复制分享 · Made with ♥</p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
