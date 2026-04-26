import { useEffect, useRef, useState } from "react";
import { Sparkles, Eraser, Download, ArrowLeft, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { PixelIcon } from "@/components/PixelIcon";
import { PosterCanvas, type StyleKey } from "@/components/PosterCanvas";
import {
  copyText,
  formatHealing,
  formatMinimal,
  formatTrendy,
} from "@/lib/formatters";

const MAX_LEN = 600;
const SAMPLE =
  "今天的风很温柔。\n走在回家的路上，听见树叶沙沙响，像谁在轻声说晚安。\n生活有时很慢，但总会变好。";

interface StyleOption {
  key: StyleKey;
  title: string;
  subtitle: string;
  iconName: "leaf" | "sparkle" | "heart";
  preview: string;
  bg: string;
}

const STYLES: StyleOption[] = [
  {
    key: "minimal",
    title: "简约清爽风",
    subtitle: "Minimal · 干净易读",
    iconName: "leaf",
    preview: "每句一行 · 留白舒适\n纯文本 · 阅读优先",
    bg: "bg-[hsl(40_50%_96%)]",
  },
  {
    key: "healing",
    title: "文艺治愈风",
    subtitle: "Healing · 温柔诗意",
    iconName: "sparkle",
    preview: "─── ✿ ───\n「温柔的句子」\n— 致每个温柔的你 —",
    bg: "bg-[hsl(261_45%_94%)]",
  },
  {
    key: "trendy",
    title: "潮流个性风",
    subtitle: "Trendy · 活力出片",
    iconName: "heart",
    preview: "▍TRENDY\n✨ 高对比 · #标签#\n暗色系 · 出片感",
    bg: "bg-[hsl(24_18%_18%)] text-[hsl(40_50%_96%)]",
  },
];

type Step = "input" | "pick" | "result";

const Index = () => {
  const [text, setText] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [picked, setPicked] = useState<StyleKey | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const trimmed = text.trim();
  const canGenerate = trimmed.length > 0;

  const formattedContent = (() => {
    if (!picked) return "";
    if (picked === "minimal") return formatMinimal(text);
    if (picked === "healing") return formatHealing(text);
    return formatTrendy(text);
  })();

  // 动态计算预览缩放：海报 1080，让其适配视口宽度（最多 ~420px）
  useEffect(() => {
    if (step !== "result") return;
    const update = () => {
      const max = Math.min(window.innerWidth - 32, 420);
      const scale = max / 1080;
      document.documentElement.style.setProperty("--poster-scale", String(scale));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [step]);

  const handleClear = () => {
    setText("");
  };

  const handleNext = () => {
    if (!canGenerate) return;
    setStep("pick");
  };

  const handlePick = (key: StyleKey) => {
    setPicked(key);
    setStep("result");
  };

  const handleBack = () => {
    if (step === "result") {
      setStep("pick");
      setPicked(null);
    } else if (step === "pick") {
      setStep("input");
    }
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        // 忽略 CSS transform 缩放，按真实 1080×1080 渲染
        width: 1080,
        height: 1080,
        windowWidth: 1080,
        windowHeight: 1080,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `文字排版_${picked}_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("图片已保存");
    } catch (e) {
      console.error(e);
      toast.error("生成失败，请重试");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyText = async () => {
    const ok = await copyText(formattedContent);
    if (ok) {
      setCopied(true);
      toast.success("文字已复制");
      setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error("复制失败，请长按选择");
    }
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
            写文字 · 选风格 · 一键出图
          </p>
        </header>

        {/* 步骤指示 */}
        <div className="mb-5 flex items-center justify-center gap-2 text-[11px] font-pixel text-muted-foreground">
          <StepDot label="01 写字" active={step === "input"} done={step !== "input"} />
          <span>—</span>
          <StepDot
            label="02 选风格"
            active={step === "pick"}
            done={step === "result"}
          />
          <span>—</span>
          <StepDot label="03 出图" active={step === "result"} done={false} />
        </div>

        {/* 步骤 1：输入 */}
        {step === "input" && (
          <>
            <section
              aria-label="文字输入"
              className="pixel-border rounded-2xl bg-card p-3 shadow-pixel-soft"
            >
              <textarea
                value={text}
                maxLength={MAX_LEN}
                onChange={(e) => setText(e.target.value)}
                placeholder={`在这里输入想排版的文字…\n\n例如：\n${SAMPLE}`}
                className="block min-h-[200px] w-full resize-y rounded-xl border-0 bg-transparent px-2 py-2 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <div className="mt-1 flex items-center justify-between px-2 pb-1 text-[11px] text-muted-foreground">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={text.length === 0}
                  className="press-pixel inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-foreground disabled:opacity-40"
                >
                  <Eraser size={12} />
                  清空
                </button>
                <span>
                  {text.length} / {MAX_LEN}
                </span>
              </div>
            </section>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGenerate}
                className="press-pixel pixel-border shadow-pixel inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-pixel text-xl text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles size={18} />
                下一步 · 选风格
                <Sparkles size={18} />
              </button>
            </div>
          </>
        )}

        {/* 步骤 2：选择风格 */}
        {step === "pick" && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="press-pixel inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={14} /> 返回修改
              </button>
              <span className="font-pixel text-xs text-muted-foreground">
                选一个风格生成图片
              </span>
            </div>

            <div className="space-y-4">
              {STYLES.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => handlePick(s.key)}
                  className={`fade-up press-pixel pixel-border shadow-pixel-soft block w-full overflow-hidden rounded-2xl ${s.bg} text-left`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center justify-between border-b-2 border-foreground/80 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="pixel-border flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <PixelIcon name={s.iconName} size={18} />
                      </span>
                      <div className="leading-tight">
                        <h3 className="font-pixel text-lg">{s.title}</h3>
                        <p className="text-[11px] opacity-70">{s.subtitle}</p>
                      </div>
                    </div>
                    <span className="font-pixel text-xs opacity-70">选 →</span>
                  </div>
                  <pre className="whitespace-pre-wrap break-words px-4 py-4 font-sans text-[13px] leading-relaxed opacity-90">
{s.preview}
                  </pre>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 步骤 3：结果出图 */}
        {step === "result" && picked && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="press-pixel inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={14} /> 换个风格
              </button>
              <span className="font-pixel text-xs text-muted-foreground">
                {STYLES.find((s) => s.key === picked)?.title}
              </span>
            </div>

            {/* 海报预览（按视口缩放） */}
            <div
              className="fade-up pixel-border overflow-hidden rounded-2xl bg-card shadow-pixel-soft"
              style={{
                // 容器高度跟随缩放后海报
                height: "calc(var(--poster-scale, 0.4) * 1080px)",
              }}
            >
              <PosterCanvas
                ref={posterRef}
                styleKey={picked}
                content={formattedContent}
              />
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="press-pixel pixel-border shadow-pixel inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-pixel text-lg text-primary-foreground disabled:opacity-60"
              >
                <Download size={18} />
                {downloading ? "生成中…" : "保存图片到相册"}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="press-pixel pixel-border shadow-pixel-soft inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 font-pixel text-base text-secondary-foreground"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "已复制" : "复制文字"}
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="press-pixel pixel-border shadow-pixel-soft inline-flex items-center justify-center gap-2 rounded-xl bg-card px-4 py-2.5 font-pixel text-base"
                >
                  换风格
                </button>
              </div>
            </div>

            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              图片为 1080×1080 高清正方形 · 适合发微博 / 小红书 / IG
            </p>
          </>
        )}

        {/* Footer */}
        <footer className="mt-10 text-center text-[11px] text-muted-foreground/80">
          <p>在微信中长按图片可保存 · Made with ♥</p>
        </footer>
      </div>
    </main>
  );
};

function StepDot({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <span
      className={`rounded-md px-2 py-1 ${
        active
          ? "bg-primary text-primary-foreground"
          : done
          ? "bg-secondary/60 text-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {label}
    </span>
  );
}

export default Index;
