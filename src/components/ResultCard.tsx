import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { copyText } from "@/lib/formatters";
import { PixelIcon } from "./PixelIcon";

interface Props {
  title: string;
  subtitle: string;
  content: string;
  /** 卡片配色风格 */
  tone: "minimal" | "healing" | "trendy";
  iconName: "leaf" | "sparkle" | "heart";
  index: number;
}

const TONE_CLASSES: Record<Props["tone"], { badge: string; ring: string }> = {
  minimal: {
    badge: "bg-[hsl(40_50%_92%)] text-[hsl(24_18%_22%)]",
    ring: "shadow-pixel-soft",
  },
  healing: {
    badge: "bg-secondary text-secondary-foreground",
    ring: "shadow-pixel-secondary",
  },
  trendy: {
    badge: "bg-primary text-primary-foreground",
    ring: "shadow-pixel",
  },
};

export function ResultCard({ title, subtitle, content, tone, iconName, index }: Props) {
  const [copied, setCopied] = useState(false);
  const t = TONE_CLASSES[tone];

  const handleCopy = async () => {
    const ok = await copyText(content);
    if (ok) {
      setCopied(true);
      toast.success("已复制到剪贴板");
      setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error("复制失败，请长按选择复制");
    }
  };

  return (
    <article
      className={`fade-up pixel-border rounded-2xl bg-card ${t.ring}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <header className="flex items-center justify-between gap-2 border-b-2 border-foreground/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-md pixel-border ${t.badge}`}
          >
            <PixelIcon name={iconName} size={16} />
          </span>
          <div className="leading-tight">
            <h3 className="font-pixel text-lg">{title}</h3>
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`press-pixel inline-flex items-center gap-1 rounded-md pixel-border px-3 py-1.5 text-xs font-medium ${
            copied ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
          } shadow-pixel-soft`}
          aria-label="复制排版结果"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "已复制" : "复制"}
        </button>
      </header>

      <div className="px-4 py-4">
        <pre className="whitespace-pre-wrap break-words font-sans text-[14px] leading-relaxed text-foreground">
{content}
        </pre>
      </div>
    </article>
  );
}
