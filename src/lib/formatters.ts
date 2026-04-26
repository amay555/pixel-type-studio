/**
 * 三种排版风格生成器
 */

const EMOJI_POOL = ["✨", "🔥", "💫", "🌙", "☁️", "🌿", "🍊", "💜", "🪐", "🌸"];

const STOPWORDS = new Set([
  "的", "了", "是", "在", "和", "也", "我", "你", "他", "她", "它", "我们", "你们", "他们",
  "就", "都", "而", "及", "与", "或", "但", "把", "被", "不", "没", "有", "这", "那", "一个",
  "可以", "什么", "怎么", "因为", "所以", "如果", "虽然", "但是", "the", "a", "an", "is", "are",
  "and", "or", "but", "to", "of", "in", "on", "for", "with", "as", "at", "by",
]);

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function splitSentences(paragraph: string): string[] {
  // 在中英文句末标点后切分，保留标点
  const parts = paragraph.split(/(?<=[。！？!?\.])\s*/);
  return parts.map((s) => s.trim()).filter(Boolean);
}

/** ① 简约清爽风：每句一行，段间空行，合并多余空格 */
export function formatMinimal(text: string): string {
  const paragraphs = splitParagraphs(text);
  if (paragraphs.length === 0) return "";
  return paragraphs
    .map((p) => {
      const cleaned = p.replace(/[ \t]+/g, " ");
      const sentences = splitSentences(cleaned);
      return sentences.length > 0 ? sentences.join("\n") : cleaned;
    })
    .join("\n\n");
}

/** ② 文艺治愈风：装饰线 + 引号包裹 + 分隔点 + 签名 */
export function formatHealing(text: string): string {
  const paragraphs = splitParagraphs(text);
  if (paragraphs.length === 0) return "";
  const wrapped = paragraphs.map((p) => `「${p}」`);
  const body = wrapped.join("\n\n· · ·\n\n");
  return `─── ✿ ───\n\n${body}\n\n─── ✿ ───\n— 致每个温柔的你 —`;
}

/** ③ 潮流个性风：emoji + ▍起头 + #标签# */
export function formatTrendy(text: string): string {
  const paragraphs = splitParagraphs(text);
  if (paragraphs.length === 0) return "";

  // 用句首位置稳定取 emoji，避免每次重渲染抖动
  const pickEmoji = (i: number) => EMOJI_POOL[i % EMOJI_POOL.length];

  const formatted = paragraphs
    .map((p, idx) => {
      const cleaned = p.replace(/[ \t]+/g, " ");
      const sentences = splitSentences(cleaned);
      const lines = (sentences.length > 0 ? sentences : [cleaned])
        .map((s, j) => `${pickEmoji(idx * 3 + j)} ${s}`)
        .join("\n");
      return `▍${lines}`;
    })
    .join("\n\n");

  // 提取关键词作为标签
  const tags = extractTags(text, 3);
  const tagLine = tags.length > 0 ? `\n\n${tags.map((t) => `#${t}#`).join(" ")}` : "";

  return `${formatted}${tagLine}`;
}

function extractTags(text: string, max: number): string[] {
  // 简易：取较长的中文词块和英文单词，按出现长度评分
  const candidates: string[] = [];

  // 中文：连续 2-6 个汉字
  const cn = text.match(/[\u4e00-\u9fa5]{2,6}/g) || [];
  candidates.push(...cn);

  // 英文：3+ 字母单词
  const en = text.match(/[A-Za-z]{3,}/g) || [];
  candidates.push(...en.map((w) => w.toLowerCase()));

  const counts = new Map<string, number>();
  for (const w of candidates) {
    if (STOPWORDS.has(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => {
      // 优先词频，其次字数（更长更有信息量）
      if (b[1] !== a[1]) return b[1] - a[1];
      return b[0].length - a[0].length;
    })
    .slice(0, max)
    .map(([w]) => w);
}

/** 兼容微信 webview 的复制 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallthrough
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.setAttribute("readonly", "");
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
