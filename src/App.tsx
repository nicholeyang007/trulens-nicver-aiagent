import { useEffect, useRef, useState, type ReactNode } from "react";

type Screen = "home" | "workspace" | "chat" | "result";
type RecentTask = "makeup" | "serum" | "whitening";
type DimensionCode = "T" | "R" | "U" | "S";

const allDimensions: DimensionCode[] = ["T", "R", "U", "S"];

function inferDimensions(prompt: string, filename: string): DimensionCode[] {
  const content = `${prompt} ${filename}`.toLowerCase();
  const normalizedPrompt = prompt.trim().toLowerCase();
  const mentionsComments = /评论|评论区|留言|回复|comment/.test(content);
  const mentionsAccount = /账号|帐号|博主|主页|历史内容|account|profile/.test(content);
  const mentionsImage = /配图|图片|图像|照片|视觉|对比图|image|photo/.test(content);
  const requestsFullAnalysis = /全部|完整|多模态|整篇帖子|小红书笔记|full/.test(content);
  const hasAnyLink =
    /(?:https?:\/\/|www\.)\S+|(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:\/\S*)?/.test(normalizedPrompt);

  if (hasAnyLink) return allDimensions;
  if (requestsFullAnalysis && filename) return allDimensions;
  if (mentionsComments) return ["U", "S"];
  if (mentionsAccount) return ["T", "S"];
  if (mentionsImage) return ["R", "S"];
  if (filename) return ["R", "S"];
  return ["S"];
}

const portrait =
  "https://images.unsplash.com/photo-1675773051474-55c4b7d2cf53?crop=faces&fit=crop&fm=jpg&q=85&w=1200&h=1400";
const postImage =
  "https://images.unsplash.com/photo-1752245818739-890854ca3b81?crop=faces&fit=crop&fm=jpg&q=85&w=900&h=1100";
const roleAvatarByCode: Record<DimensionCode, string> = {
  T: "/agents/t.png",
  R: "/agents/r.png",
  U: "/agents/u.png",
  S: "/agents/s.png",
};

function Icon({
  children,
  size = 20,
  className = "",
}: {
  children: ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
}

const Sparkle = ({ size = 20 }: { size?: number }) => (
  <Icon size={size}>
    <path
      d="M12 2.5c.7 5.2 3.4 8 8.7 8.7-5.3.7-8 3.5-8.7 8.8-.7-5.3-3.4-8.1-8.7-8.8C8.6 10.5 11.3 7.7 12 2.5Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </Icon>
);

function Logo() {
  return (
    <button className="logo" onClick={() => window.scrollTo({ top: 0 })}>
      <span className="logo-mark">
        <Sparkle size={15} />
      </span>
      <span className="brand-name">TruLens</span>
    </button>
  );
}

function Arrow({ size = 20 }: { size?: number }) {
  return (
    <Icon size={size}>
      <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </Icon>
  );
}

function canvasCard(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}

function canvasParagraph(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  let line = "";
  let currentY = y;
  for (const character of text) {
    if (context.measureText(line + character).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = character;
      currentY += lineHeight;
    } else {
      line += character;
    }
  }
  context.fillText(line, x, currentY);
}

async function exportTrustLongImage() {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1440;
  canvas.height = 2920;
  const context = canvas.getContext("2d");
  if (!context) return;

  const background = context.createLinearGradient(0, 0, 1440, 2920);
  background.addColorStop(0, "#fbfafd");
  background.addColorStop(0.5, "#f2eff9");
  background.addColorStop(1, "#faf4f3");
  context.fillStyle = background;
  context.fillRect(0, 0, 1440, 2920);

  context.fillStyle = "rgba(211,199,241,.32)";
  context.beginPath();
  context.arc(1190, 430, 370, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "rgba(242,207,216,.26)";
  context.beginPath();
  context.arc(100, 2310, 390, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#292535";
  context.font = '500 34px "DM Mono", monospace';
  context.fillText("✦ TruLens", 90, 110);
  context.textAlign = "right";
  context.font = '400 20px "DM Mono", monospace';
  context.fillStyle = "#817a89";
  context.fillText("TRUST PROFILE · 2025.06.18", 1350, 108);
  context.textAlign = "left";
  context.font = '500 76px "Noto Sans SC", sans-serif';
  context.fillStyle = "#272332";
  context.fillText("这篇种草，值得相信吗？", 90, 260);
  context.font = '400 25px "Noto Sans SC", sans-serif';
  context.fillStyle = "#827b88";
  context.fillText("秋冬奶油肌底妆分享 · 多模态内容可信度报告", 94, 316);

  context.fillStyle = "rgba(255,255,255,.8)";
  canvasCard(context, 90, 390, 1260, 650, 42);
  context.beginPath();
  context.arc(390, 705, 180, -Math.PI / 2, Math.PI * 1.18);
  context.strokeStyle = "#776b9d";
  context.lineWidth = 24;
  context.lineCap = "round";
  context.stroke();
  context.beginPath();
  context.arc(390, 705, 180, Math.PI * 1.18, Math.PI * 1.5);
  context.strokeStyle = "rgba(119,107,157,.14)";
  context.stroke();
  context.textAlign = "center";
  context.fillStyle = "#292535";
  context.font = '500 150px "Playfair Display", serif';
  context.fillText("84", 390, 740);
  context.font = '400 18px "DM Mono", monospace';
  context.fillStyle = "#89828e";
  context.fillText("TRUST SCORE / 100", 390, 790);

  context.textAlign = "left";
  context.fillStyle = "#e3f0e9";
  canvasCard(context, 680, 520, 150, 46, 23);
  context.fillStyle = "#547664";
  context.font = '500 19px "Noto Sans SC", sans-serif';
  context.fillText("●  高可信", 705, 551);
  context.fillStyle = "#292535";
  context.font = '500 52px "Noto Sans SC", sans-serif';
  context.fillText("真实内容为主，", 680, 660);
  context.fillText("有轻度 AI 修图。", 680, 730);
  context.fillStyle = "#756e7b";
  context.font = '400 23px "Noto Sans SC", sans-serif';
  canvasParagraph(context, "没有发现系统性 AI 造假或虚假营销证据。图片中存在局部生成式修饰，但不影响产品展示的主要真实性。", 680, 805, 540, 42);

  context.fillStyle = "#8b8491";
  context.font = '500 18px "DM Mono", monospace';
  context.fillText("FOUR DIMENSIONS", 90, 1145);
  const exportDimensions = [
    ["T", "账号可信度", "82", "#eee9fb", "账号运营稳定，历史内容与商业合作节奏自然。"],
    ["R", "图像真实性", "88", "#e8f1fa", "发现两处生成式皮肤细化，但产品主体保持真实。"],
    ["U", "评论真实性", "74", "#f8eae7", "12% 短评存在相似句式，整体互动结构仍较自然。"],
    ["S", "宣传安全性", "91", "#e7f2ec", "未使用绝对化功效承诺，合作标识与体验边界清晰。"],
  ];
  exportDimensions.forEach(([code, title, score, color, copy], index) => {
    const x = 90 + (index % 2) * 640;
    const y = 1210 + Math.floor(index / 2) * 430;
    context.fillStyle = color;
    canvasCard(context, x, y, 610, 390, 32);
    context.fillStyle = "#332e3c";
    context.font = '500 66px "Playfair Display", serif';
    context.fillText(code, x + 34, y + 85);
    context.font = '500 30px "Noto Sans SC", sans-serif';
    context.fillText(title, x + 34, y + 137);
    context.textAlign = "right";
    context.font = '500 72px "Playfair Display", serif';
    context.fillText(score, x + 565, y + 97);
    context.textAlign = "left";
    context.fillStyle = "rgba(49,43,59,.12)";
    canvasCard(context, x + 34, y + 174, 542, 6, 3);
    context.fillStyle = "#746982";
    canvasCard(context, x + 34, y + 174, 542 * (Number(score) / 100), 6, 3);
    context.fillStyle = "#716a77";
    context.font = '400 21px "Noto Sans SC", sans-serif';
    canvasParagraph(context, copy, x + 34, y + 237, 530, 38);
  });

  context.fillStyle = "rgba(255,255,255,.72)";
  canvasCard(context, 90, 2115, 1260, 480, 38);
  context.fillStyle = "#81788d";
  context.font = '500 18px "DM Mono", monospace';
  context.fillText("TruLens DECISION SUPPORT", 135, 2185);
  context.fillStyle = "#292535";
  context.font = '500 48px "Noto Sans SC", sans-serif';
  context.fillText("可以参考，但请关注真实肤质差异。", 135, 2275);
  context.fillStyle = "#716a77";
  context.font = '400 24px "Noto Sans SC", sans-serif';
  canvasParagraph(context, "这篇内容可以作为妆效灵感与色号参考。由于博主对皮肤纹理做过局部 AI 修饰，不建议仅依据“零毛孔”效果判断产品遮瑕力。购买前可再查看自然光下的素人试色视频。", 135, 2360, 1150, 44);
  context.textAlign = "center";
  context.fillStyle = "#96909b";
  context.font = '400 18px "Noto Sans SC", sans-serif';
  context.fillText("由 TruLens 多模态模型生成 · AI 判断不构成医疗或购买建议", 720, 2750);
  context.font = '500 18px "DM Mono", monospace';
  context.fillText("TruLens — BEAUTY, VERIFIED WITH INTELLIGENCE.", 720, 2815);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 1));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "TruLens-美妆内容可信度报告.png";
  link.click();
  URL.revokeObjectURL(url);
}

function ShareMenu({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [exportingImage, setExportingImage] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const copyReportLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("report", "true");
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("复制这份报告链接", url.toString());
    }
  };

  return (
    <div className="share-menu" ref={menuRef}>
      <div className="share-menu-title">
        <strong>分享鉴别结果</strong>
        <small>链接接收者可直接查看报告</small>
      </div>
      <button onClick={copyReportLink}>
        <span className="share-action-icon">
          <Icon size={17}>
            <path d="m9.5 14.5 5-5M7.3 16.7l-1 1a3.5 3.5 0 0 1-5-5l3.2-3.2a3.5 3.5 0 0 1 5 0M16.7 7.3l1-1a3.5 3.5 0 1 1 5 5l-3.2 3.2a3.5 3.5 0 0 1-5 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          </Icon>
        </span>
        <span><strong>{copied ? "链接已复制" : "复制分享链接"}</strong><small>{copied ? "可以发送给好友了" : "生成可直接访问的报告链接"}</small></span>
        <span className={copied ? "copy-state copied" : "copy-state"}>{copied ? "✓" : "⌘C"}</span>
      </button>
      <button
        onClick={async () => {
          setExportingImage(true);
          await exportTrustLongImage();
          setExportingImage(false);
        }}
      >
        <span className="share-action-icon image">
          <Icon size={17}>
            <rect height="17" rx="2.5" stroke="currentColor" strokeWidth="1.5" width="18" x="3" y="3.5" />
            <circle cx="8.5" cy="9" r="1.6" stroke="currentColor" strokeWidth="1.4" />
            <path d="m5.5 18 4.2-4.6 2.7 2.6 2.2-2 3.9 4" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
          </Icon>
        </span>
        <span><strong>{exportingImage ? "正在生成长图…" : "导出成长图"}</strong><small>适合保存到相册或社交平台分享</small></span>
        <Arrow size={15} />
      </button>
      <button
        onClick={() => {
          onClose();
          window.setTimeout(() => window.print(), 100);
        }}
      >
        <span className="share-action-icon pdf">
          <Icon size={17}>
            <path d="M6 3h8l4 4v14H6V3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M14 3v5h4M9 14h6M9 17h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          </Icon>
        </span>
        <span><strong>导出为 PDF</strong><small>保存或打印完整鉴别报告</small></span>
        <Arrow size={15} />
      </button>
      <p>报告不包含原帖作者的私密信息</p>
    </div>
  );
}

const storyScene = {
  step: "01 / READ",
  eyebrow: "BEFORE YOU BUY",
  title: "你还相信你自己看到的吗？",
  body: "一张完美的照片、一篇动人的分享、成千上万条好评，都可能隐藏着你看不到的信息。",
};

function StoryVisual() {
  return (
    <div className="story-post">
      <div className="post-browser">
        <span /><span /><span />
        <small>note / 3285491</small>
      </div>
      <div className="post-image">
        <img alt="模拟美妆种草帖子" src={postImage} />
        <span className="post-image-tag">原始内容 · 6 张图片</span>
      </div>
      <div className="post-copy">
        <div className="mock-avatar" />
        <div><strong>秋冬奶油肌底妆分享</strong><span>今天也要认真护肤 · 2 小时前</span></div>
      </div>
      <div className="post-lines"><i /><i /><i /></div>
      <div className="reading-line"><span /></div>
      <small className="reading-caption">正在建立内容语境 · 68%</small>
    </div>
  );
}

function StoryScroller() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardScrollRef = useRef<HTMLDivElement>(null);
  const countFrameRef = useRef(0);
  const dataPlayedRef = useRef(false);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [answers, setAnswers] = useState<Array<QuizChoice | null>>([null, null, null]);
  const [dataValues, setDataValues] = useState([0, 0, 0]);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);
  const score = answers.reduce((total, answer, index) => total + (answer === aiImageQuizQuestions[index].aiAnswer ? 1 : 0), 0);
  const unanswered = answers.filter((answer) => answer === null).length;
  const resultTitle = score === 3 ? "眼力不错。" : score === 2 ? "差一点。" : "这很正常，这正是 AI 图的厉害之处。";
  const activeStep = currentPanel === 0 ? "data" : currentPanel < 4 ? "quiz" : "result";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.cancelAnimationFrame(countFrameRef.current);
    if (!sectionVisible || currentPanel !== 0 || dataPlayedRef.current) return;
    dataPlayedRef.current = true;
    const targets = [66, 57, 35.7];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDataValues(targets);
      return;
    }
    const start = performance.now();
    const animate = (time: number) => {
      const amount = Math.min(1, (time - start) / 1200);
      const eased = 1 - Math.pow(1 - amount, 3);
      setDataValues(targets.map((target) => target * eased));
      if (amount < 1) countFrameRef.current = window.requestAnimationFrame(animate);
    };
    countFrameRef.current = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(countFrameRef.current);
  }, [currentPanel, sectionVisible]);

  const scrollToPanel = (nextPanel: number) => {
    const scroller = cardScrollRef.current;
    if (!scroller) return;
    const targetPanel = Math.max(0, Math.min(4, nextPanel));
    scroller.scrollTo({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      top: targetPanel * scroller.clientHeight,
    });
  };

  const choose = (questionIndex: number, choice: QuizChoice) => {
    if (answers[questionIndex]) return;
    setAnswers((current) => current.map((answer, index) => index === questionIndex ? choice : answer));
  };

  const resetQuiz = () => {
    setAnswers([null, null, null]);
    scrollToPanel(1);
  };

  return (
    <section className="story-scroller story-scene-0 relative" ref={sectionRef}>
      <div className="story-sticky">
        <div className="story-ambient ambient-one" />
        <div className="story-ambient ambient-two" />
        <div className="story-rail">
          <span>TruLens / HOW IT WORKS</span>
          <div><i style={{ height: `${((currentPanel + 1) / 5) * 100}%` }} /></div>
          <small>01</small>
        </div>
        <div className="story-copy-stack">
          <article className="story-copy-layer is-active">
            {storyScene.step !== "01 / READ" && <span className="story-step">{storyScene.step}</span>}
            <small>{storyScene.eyebrow}</small>
            <h2>{storyScene.title}</h2>
            <p>{storyScene.body}</p>
            <div className="read-step-list">
              <button className={activeStep === "data" ? "active" : ""} onClick={() => scrollToPanel(0)}>
                <span>01</span><strong>数字</strong><i />
              </button>
              <button className={activeStep === "quiz" ? "active" : ""} onClick={() => scrollToPanel(activeStep === "quiz" ? currentPanel : 1)}>
                <span>02</span><strong>小测{activeStep === "quiz" ? ` · 第 ${currentPanel} / 3 题` : ""}</strong><i />
              </button>
              <button className={activeStep === "result" ? "active" : ""} onClick={() => scrollToPanel(4)}>
                <span>03</span><strong>结果</strong><i />
              </button>
            </div>
          </article>
        </div>
        <div className="merged-story-visual">
          <i className="merged-orbit merged-orbit-one" />
          <i className="merged-orbit merged-orbit-two" />
          <div className="merged-story-card">
            <div
              aria-label="互动内容，可在卡片内上下滚动"
              className="merged-card-scroll"
              onScroll={(event) => {
                const scroller = event.currentTarget;
                const nextPanel = Math.max(0, Math.min(4, Math.round(scroller.scrollTop / scroller.clientHeight)));
                setCurrentPanel(nextPanel);
                if (scroller.scrollTop > 4) setScrollHintVisible(false);
              }}
              ref={cardScrollRef}
              tabIndex={0}
            >
              <section className="merged-track-screen merged-data-screen">
                <span className="merged-panel-kicker">不只是你 · NOT JUST YOU</span>
                {[
                  ["66", dataValues[0], "消费者自信能识别 AI 图片", "Clutch Survey · 2025 年 9 月"],
                  ["57", dataValues[1], "人在实测中判断出错", "Clutch Survey · 2025 年 9 月"],
                  ["35.7", dataValues[2], "第三方测评账号涉嫌虚假测评", "中消协《第三方测评消费体验调查》"],
                ].map(([target, value, label]) => (
                  <div key={String(target)}>
                    <strong>{Number(value).toFixed(String(target).includes(".") ? 1 : 0)}%</strong>
                    <span>{label}</span>
                  </div>
                ))}
                <small>来源：Clutch Survey, Sep 2025；中消协《第三方测评消费体验调查》</small>
              </section>
              {aiImageQuizQuestions.map((question, index) => {
                const answer = answers[index];
                return (
                  <section className="merged-track-screen merged-quiz-screen" key={question.title}>
                    <header><span>试试看 · TRY IT</span><small>第 {index + 1} / 3 题 · {question.title}</small></header>
                    <h3>哪一张是 AI 生成的？</h3>
                    <div className="quiz-options">
                      {question.images.map((image) => {
                        const answered = answer !== null;
                        const isSelected = answer === image.choice;
                        const isAi = question.aiAnswer === image.choice;
                        return (
                          <div className="quiz-option" key={image.choice}>
                            <button
                              aria-label={`选择 ${image.choice}`}
                              className={`quiz-image-placeholder ${image.image} ${isSelected ? "selected" : ""}`}
                              disabled={answered}
                              onClick={() => choose(index, image.choice)}
                            >
                              <span>{image.choice}</span>
                              <small>示例图</small>
                              {image.icon === "product" ? (
                                <Icon size={52}><path d="M8 8c2-4 6-4 8 0 1.8 3.5-1 7.5-4 10-3-2.5-5.8-6.5-4-10Z" stroke="currentColor" strokeWidth="1.2" /><path d="M9 13c2 .8 4 .8 6 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" /></Icon>
                              ) : image.icon === "compare" ? (
                                <Icon size={52}><rect height="15" rx="3" stroke="currentColor" strokeWidth="1.2" width="18" x="3" y="4.5" /><path d="M12 5v14M6 15l3-3 3 2 3-4 3 3" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" /></Icon>
                              ) : (
                                <Icon size={52}><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.2" /><path d="M7 10c2-2 3 2 5 0s3 2 5 0M7 14c2-2 3 2 5 0s3 2 5 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" /></Icon>
                              )}
                              {answered && isAi && (
                                <i
                                  className="quiz-ai-marker"
                                  style={{ left: question.reveal.left, top: question.reveal.top }}
                                >
                                  <b />
                                  <em>{question.reveal.label}</em>
                                </i>
                              )}
                            </button>
                            <button className="quiz-choice-button" disabled={answered} onClick={() => choose(index, image.choice)}>
                              我选 {image.choice}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div aria-live="polite" className="quiz-reveal">
                      {answer && (
                        <>
                          <strong className={answer === question.aiAnswer ? "correct" : "incorrect"}>
                            <i>{answer === question.aiAnswer ? "✓" : "!"}</i>
                            {answer === question.aiAnswer ? "答对了" : "差一点"}
                          </strong>
                          <p>{question.explanation}</p>
                          <small>继续向下滚动 <i>↓</i></small>
                        </>
                      )}
                    </div>
                  </section>
                );
              })}
              <section className="merged-track-screen merged-result-screen">
                <span className="quiz-result-kicker">你的结果 · YOUR RESULT</span>
                <strong>{score} <small>/ 3</small></strong>
                <h3>{resultTitle}</h3>
                {unanswered > 0 && <p>还有 {unanswered} 题没答，向上滚动可以回去答。</p>}
                <small>接下来，让 TruLens 帮你看。</small>
                <div className="quiz-result-actions">
                  <button onClick={() => document.querySelector(".trust-section")?.scrollIntoView({ behavior: "smooth" })}>
                    让 TruLens 帮你看 <span><Arrow size={18} /></span>
                  </button>
                  <button onClick={resetQuiz}>再测一次</button>
                </div>
              </section>
            </div>
            <i className="merged-card-mask mask-top" />
            <i className="merged-card-mask mask-bottom" />
            {scrollHintVisible && <span className="merged-scroll-hint">在卡片内滚动 <i>↓</i></span>}
            <div className="merged-card-controls">
              <small>示例内容 · 图片为占位</small>
              <div>
                <span>{currentPanel + 1} / 5</span>
                <button aria-label="上一个面板" disabled={currentPanel === 0} onClick={() => scrollToPanel(currentPanel - 1)}>
                  <Icon size={17}><path d="m7 14 5-5 5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></Icon>
                </button>
                <button aria-label="下一个面板" disabled={currentPanel === 4} onClick={() => scrollToPanel(currentPanel + 1)}>
                  <Icon size={17}><path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></Icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type QuizChoice = "A" | "B";

const aiImageQuizQuestions: Array<{
  title: string;
  aiAnswer: QuizChoice;
  images: Array<{ choice: QuizChoice; image: string; icon: "texture" | "product" | "compare" }>;
  reveal: { left: string; top: string; label: string };
  explanation: string;
}> = [
  {
    title: "肤质特写",
    aiAnswer: "B",
    images: [
      { choice: "A", image: "soft-lilac", icon: "texture" },
      { choice: "B", image: "soft-pink", icon: "texture" },
    ],
    reveal: { left: "62%", top: "42%", label: "高光与肤色过渡" },
    explanation: "高光方向与背景光源不一致，肤色过渡出现断层。",
  },
  {
    title: "产品质地图",
    aiAnswer: "A",
    images: [
      { choice: "A", image: "soft-blue", icon: "product" },
      { choice: "B", image: "soft-lilac", icon: "product" },
    ],
    reveal: { left: "55%", top: "58%", label: "质地边缘与反光" },
    explanation: "质地边缘过于平滑，缺少真实的反光颗粒。",
  },
  {
    title: "使用前后对比",
    aiAnswer: "B",
    images: [
      { choice: "A", image: "soft-pink", icon: "compare" },
      { choice: "B", image: "soft-blue", icon: "compare" },
    ],
    reveal: { left: "68%", top: "48%", label: "前后阴影方向" },
    explanation: "前后对比图里的阴影方向前后矛盾。",
  },
];

const evidenceHotspots = [
  {
    id: 1,
    label: "光影一致性",
    text: "高光方向与背景光源不一致",
    x: "62%",
    y: "24%",
  },
  {
    id: 2,
    label: "拼接痕迹",
    text: "脸颊与颈部边缘存在不自然的过渡",
    x: "38%",
    y: "56%",
  },
  {
    id: 3,
    label: "色彩过渡",
    text: "肤色渐变出现断层",
    x: "68%",
    y: "72%",
  },
];

function EvidenceSection({ onStart }: { onStart: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const lensTargetRef = useRef({ x: 50, y: 45 });
  const lensCurrentRef = useRef({ x: 50, y: 45 });
  const lensAnimationRef = useRef(0);
  const demoTimersRef = useRef<number[]>([]);
  const demoPlayedRef = useRef(false);
  const touchDraggingRef = useRef(false);
  const touchMovedRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [lensVisible, setLensVisible] = useState(false);
  const [lensRender, setLensRender] = useState({
    x: 50,
    y: 45,
    backgroundWidth: 774,
    backgroundHeight: 968,
    backgroundX: -337,
    backgroundY: -389,
  });
  const [comparison, setComparison] = useState(0);
  const [mobileForensic, setMobileForensic] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [nearbyHotspot, setNearbyHotspot] = useState<number | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!lensVisible) return;
    const animateLens = () => {
      const frame = imageFrameRef.current;
      if (!frame) return;
      const current = lensCurrentRef.current;
      const target = lensTargetRef.current;
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;

      const bounds = frame.getBoundingClientRect();
      const diameter = Math.max(180, Math.min(300, bounds.width * 0.4));
      const pointX = (current.x / 100) * bounds.width;
      const pointY = (current.y / 100) * bounds.height;
      const backgroundWidth = bounds.width * 1.8;
      const backgroundHeight = bounds.height * 1.8;
      setLensRender({
        x: current.x,
        y: current.y,
        backgroundWidth,
        backgroundHeight,
        backgroundX: diameter / 2 - pointX * 1.8,
        backgroundY: diameter / 2 - pointY * 1.8,
      });

      let nearest: number | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;
      evidenceHotspots.forEach((hotspot) => {
        const hotspotX = (Number.parseFloat(hotspot.x) / 100) * bounds.width;
        const hotspotY = (Number.parseFloat(hotspot.y) / 100) * bounds.height;
        const distance = Math.hypot(pointX - hotspotX, pointY - hotspotY);
        if (distance < diameter * 0.3 && distance < nearestDistance) {
          nearest = hotspot.id;
          nearestDistance = distance;
        }
      });
      setNearbyHotspot(nearest);
      lensAnimationRef.current = window.requestAnimationFrame(animateLens);
    };
    lensAnimationRef.current = window.requestAnimationFrame(animateLens);
    return () => window.cancelAnimationFrame(lensAnimationRef.current);
  }, [lensVisible]);

  useEffect(() => {
    if (!visible || userInteracted || demoPlayedRef.current) return;
    demoPlayedRef.current = true;
    const moveDemoLens = (hotspotIndex: number) => {
      const hotspot = evidenceHotspots[hotspotIndex];
      lensTargetRef.current = {
        x: Number.parseFloat(hotspot.x),
        y: Number.parseFloat(hotspot.y),
      };
    };
    demoTimersRef.current = [
      window.setTimeout(() => {
        setDemoRunning(true);
        setLensVisible(true);
        moveDemoLens(0);
      }, 500),
      window.setTimeout(() => moveDemoLens(1), 1700),
      window.setTimeout(() => moveDemoLens(2), 2900),
      window.setTimeout(() => {
        setDemoRunning(false);
        setLensVisible(false);
        setNearbyHotspot(null);
      }, 5000),
    ];
    return () => demoTimersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, [visible, userInteracted]);

  const stopDemoAndTakeControl = () => {
    if (!userInteracted) setUserInteracted(true);
    demoTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    demoTimersRef.current = [];
    setDemoRunning(false);
  };

  const setLensTargetFromPointer = (
    clientX: number,
    clientY: number,
    verticalOffset = 0,
  ) => {
    const frame = imageFrameRef.current;
    if (!frame) return;
    const bounds = frame.getBoundingClientRect();
    lensTargetRef.current = {
      x: Math.max(0, Math.min(100, ((clientX - bounds.left) / bounds.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - bounds.top - verticalOffset) / bounds.height) * 100)),
    };
  };

  const nearbyEvidence = nearbyHotspot
    ? evidenceHotspots.find((hotspot) => hotspot.id === nearbyHotspot)
    : null;

  return (
    <section className={`evidence-section reveal-section ${visible ? "is-visible" : ""}`} ref={sectionRef}>
      <div className="evidence-heading">
        <span className="section-tag">THE EVIDENCE</span>
        <h2>证据，不是结论</h2>
        <p>每一个判断，都指给你看它是从哪里来的。</p>
      </div>

      <div className="evidence-layout">
        <div className="evidence-copy">
          <div className="evidence-points">
            <div>
              <span>
                <Icon size={19}>
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m16 16 4 4M8 11h6M11 8v6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                </Icon>
              </span>
              <p><strong>图像取证</strong><small>检查光影、拼接痕迹、色彩过渡</small></p>
            </div>
            <div>
              <span>
                <Icon size={19}>
                  <path d="M6 3h9l3 3v15H6V3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d="M15 3v4h3M9 11h6M9 15h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                </Icon>
              </span>
              <p><strong>文案分析</strong><small>识别绝对化的功效宣称</small></p>
            </div>
            <div>
              <span>
                <Icon size={19}>
                  <path d="M5 6.5h14v9H9l-4 3v-12Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d="M8 10h8M8 13h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                </Icon>
              </span>
              <p><strong>评论模式</strong><small>发现批量灌水与句式雷同</small></p>
            </div>
          </div>
          <p className="evidence-note">判定依据同步呈现，每一步都可追溯。</p>
          <button className="evidence-cta" onClick={onStart}>
            体验 TruLens Agent
            <span className="circle-arrow"><Arrow size={19} /></span>
          </button>
        </div>

        <div className="evidence-card">
          <div
            className={`evidence-image-frame ${mobileForensic ? "mobile-forensic" : ""}`}
            onClick={() => {
              if (window.matchMedia("(hover: none)").matches && !touchMovedRef.current) {
                setMobileForensic((current) => !current);
              }
              touchMovedRef.current = false;
            }}
            onPointerDown={(event) => {
              if (event.pointerType !== "touch") return;
              touchDraggingRef.current = true;
              touchMovedRef.current = false;
              event.currentTarget.setPointerCapture(event.pointerId);
              stopDemoAndTakeControl();
              setLensVisible(true);
              setLensTargetFromPointer(event.clientX, event.clientY, 90);
            }}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setLensVisible(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse" && !demoRunning) {
                setLensVisible(false);
                setNearbyHotspot(null);
              }
              setActiveHotspot(null);
            }}
            onPointerMove={(event) => {
              if (event.pointerType === "mouse") {
                stopDemoAndTakeControl();
                setLensVisible(true);
                setLensTargetFromPointer(event.clientX, event.clientY);
              } else if (touchDraggingRef.current) {
                touchMovedRef.current = true;
                stopDemoAndTakeControl();
                setLensTargetFromPointer(event.clientX, event.clientY, 90);
              }
            }}
            onPointerUp={(event) => {
              if (event.pointerType !== "touch") return;
              touchDraggingRef.current = false;
              setLensVisible(false);
              setNearbyHotspot(null);
            }}
            ref={imageFrameRef}
          >
            <img alt="肤质特写占位图" className="evidence-base-image" src={portrait} />
            <div
              className="evidence-forensic-layer evidence-slider-layer"
              style={{ clipPath: mobileForensic ? "inset(0)" : `inset(0 ${100 - comparison}% 0 0)` }}
            >
              <img alt="" src={portrait} />
              <span />
            </div>
            <div className={`evidence-image-dim ${lensVisible ? "visible" : ""}`} />
            <div
              className={`evidence-lens ${lensVisible ? "visible" : ""} ${nearbyHotspot ? "hotspot-near" : ""}`}
              style={{ left: `${lensRender.x}%`, top: `${lensRender.y}%` }}
            >
              <div
                className="evidence-lens-image"
                style={{
                  backgroundImage: `url(${portrait})`,
                  backgroundPosition: `${lensRender.backgroundX}px ${lensRender.backgroundY}px`,
                  backgroundSize: `${lensRender.backgroundWidth}px ${lensRender.backgroundHeight}px`,
                }}
              />
              <div className="evidence-lens-heat" />
              <div className="evidence-lens-grid" />
              <div className="evidence-lens-scan" />
              <div className="evidence-lens-glare" />
              <div className="evidence-reticle"><i /><b /><b /><b /><b /></div>
              <span>{nearbyEvidence ? `${nearbyEvidence.label} · 异常` : "取证层 · 扫描中"}</span>
            </div>
            <div className={`evidence-operation-hint ${userInteracted ? "hidden" : ""}`}>
              <Icon size={12}>
                <path d="m7 4 9 8-4 .8 2.2 4.2-2.2 1.1-2.1-4.2L7 17V4Z" fill="currentColor" />
              </Icon>
              移动鼠标，用镜头检查这张图
            </div>

            {evidenceHotspots.map((hotspot) => (
              <div
                className={`evidence-hotspot-wrap ${activeHotspot === hotspot.id ? "active" : ""} ${nearbyHotspot === hotspot.id ? "nearby" : ""}`}
                key={hotspot.id}
                style={{ left: hotspot.x, top: hotspot.y }}
              >
                <button
                  aria-label={`查看${hotspot.label}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveHotspot((current) => current === hotspot.id ? null : hotspot.id);
                  }}
                  onMouseEnter={() => setActiveHotspot(hotspot.id)}
                >
                  <i />
                </button>
                {activeHotspot === hotspot.id && (
                  <div className="hotspot-popover">
                    <small>钉 {hotspot.id}</small>
                    <strong>{hotspot.label}</strong>
                    <p>{hotspot.text}</p>
                  </div>
                )}
              </div>
            ))}
            <span className="mobile-evidence-hint">点击切换原图 / 取证层</span>
          </div>

          <div className="evidence-slider">
            <span>原图</span>
            <input
              aria-label="调整原图与取证层对比"
              max="100"
              min="0"
              onChange={(event) => setComparison(Number(event.target.value))}
              style={{ "--slider-value": `${comparison}%` } as React.CSSProperties}
              type="range"
              value={comparison}
            />
            <span>取证层</span>
          </div>
          <small className="example-data">示例数据</small>
        </div>
      </div>
    </section>
  );
}

const agentScenes: Array<{
  code: DimensionCode;
  label: string;
  input: string;
  question: string;
  description: string;
  score: number;
}> = [
  {
    code: "T",
    label: "账号可信度",
    input: "账号主页",
    question: "这个账号长期可靠吗？",
    description: "分析发布节奏、带货占比和历史内容的一致性。",
    score: 6,
  },
  {
    code: "R",
    label: "图片真实性",
    input: "图片",
    question: "这张图是真的吗？",
    description: "检查光影一致性、拼接痕迹和色彩过渡。",
    score: 3,
  },
  {
    code: "U",
    label: "评论区真实性",
    input: "评论",
    question: "评论是真人说的吗？",
    description: "检查句式相似度、发布时间与账号特征。",
    score: 4,
  },
  {
    code: "S",
    label: "文案真实性",
    input: "文案",
    question: "这段话是体验，还是写好的脚本？",
    description: "识别模板化话术、绝对化用语和缺少依据的功效宣称。",
    score: 5,
  },
];

const dimensionImageHotspots = [
  { id: 1, left: 34, top: 58, tag: "光影", text: "高光方向与背景光源不一致" },
  { id: 2, left: 78, top: 82, tag: "色彩过渡", text: "肤色过渡出现断层" },
];

function AgentSceneVisual({ code, instance }: { code: DimensionCode; instance: string }) {
  const [ratioHovered, setRatioHovered] = useState(false);
  const [commentHover, setCommentHover] = useState<"similar" | "time" | null>(null);
  const [commentSelected, setCommentSelected] = useState<"similar" | "time" | null>(null);
  const commentFocus = commentHover ?? commentSelected;

  if (code === "T") {
    const bars = [24, 38, 31, 66, 42, 76, 54, 28, 70, 48, 84, 61, 35, 73, 58, 88, 46, 69, 53, 78, 39, 67, 82, 49, 72, 57, 86, 63, 44, 75];
    return (
      <div className={`agent-account-card ${ratioHovered ? "ratio-highlight" : ""}`}>
        <div className="account-placeholder-head">
          <span className="account-placeholder-avatar"><Sparkle size={17} /></span>
          <div><strong>账号名占位</strong><small>@beauty_profile</small></div>
          <em>疑似营销号</em>
        </div>
        <div className="account-placeholder-data">
          <div className="posting-rhythm">
            <span>近 30 篇笔记发布节奏</span>
            <div>{bars.map((height, index) => (
              <button
                aria-label={`第 ${index + 1} 篇笔记${index < 24 ? "，带商品链接" : ""}`}
                className={index < 24 ? "commerce-bar" : ""}
                key={index}
                style={{ height: `${height}%` }}
              >
                {index < 24 && <span>这一篇带商品链接</span>}
              </button>
            ))}</div>
            <small><b /> 日常内容 <b /> 带货内容</small>
          </div>
          <div className="commerce-ratio">
            <span>带货占比</span>
            <button
              aria-describedby={`commerce-ratio-tip-${instance}`}
              onBlur={() => setRatioHovered(false)}
              onFocus={() => setRatioHovered(true)}
              onMouseEnter={() => setRatioHovered(true)}
              onMouseLeave={() => setRatioHovered(false)}
            >
              <strong>80%</strong><small>近 30 篇</small>
              <em id={`commerce-ratio-tip-${instance}`}>近 30 篇笔记中 24 篇带商品链接</em>
            </button>
          </div>
        </div>
        <small className="agent-visual-example">示例数据</small>
      </div>
    );
  }

  if (code === "R") {
    return <DimensionImageForensics instance={instance} />;
  }

  if (code === "U") {
    const comments = [
      "质地很轻薄，用了一周真的很服帖！",
      "质地很轻盈，用了一周妆效特别服帖。",
      "用了一周，质地轻薄而且真的很服帖！",
      "质地轻薄不厚重，一周后依然很服帖。",
      "鼻翼位置四小时后有一点卡粉，干皮需要先保湿。",
    ];
    return (
      <div className="agent-comment-evidence">
        <div className="comment-evidence-tabs">
          <button className={commentFocus === "similar" ? "active" : ""} onBlur={() => setCommentHover(null)} onClick={() => setCommentSelected(commentSelected === "similar" ? null : "similar")} onFocus={() => setCommentHover("similar")} onMouseEnter={() => setCommentHover("similar")} onMouseLeave={() => setCommentHover(null)}>句式相似</button>
          <button className={commentFocus === "time" ? "active" : ""} onBlur={() => setCommentHover(null)} onClick={() => setCommentSelected(commentSelected === "time" ? null : "time")} onFocus={() => setCommentHover("time")} onMouseEnter={() => setCommentHover("time")} onMouseLeave={() => setCommentHover(null)}>集中发布</button>
        </div>
        <div className={`comment-evidence-list ${commentFocus === "similar" ? "highlighted" : ""}`}>
          {comments.map((comment, index) => <p className={index < 4 ? "similar" : ""} key={comment}><i />{comment}</p>)}
        </div>
        <div className={`comment-time-axis ${commentFocus === "time" ? "highlighted" : ""}`}>
          <span>00:00</span><span>12:00</span><span>24:00</span>
          <div>{[8, 12, 14, 16, 18, 21, 23, 67, 82].map((left, index) => <i className={index < 6 ? "clustered" : ""} key={index} style={{ left: `${left}%` }} />)}</div>
          <em>2 小时内集中发布</em>
        </div>
        <small>62 条评论中 41 条句式相似</small>
        <small className="agent-visual-example">示例数据</small>
      </div>
    );
  }

  return (
    <div className="agent-copy-card script-evidence-card">
      <div className="copy-card-head"><i /><span>种草笔记文案</span><small>内容检查</small></div>
      <p>
        <button aria-describedby={`script-tip-template-${instance}`}>姐妹们闭眼入<span id={`script-tip-template-${instance}`}>模板化话术</span></button>！这款粉底液一抹显白，
        <button className="risk" aria-describedby={`script-tip-risk-${instance}`}>24 小时不脱妆<span id={`script-tip-risk-${instance}`}>绝对化用语</span></button>，油皮干皮都适用，
        <button className="claim" aria-describedby={`script-tip-claim-${instance}`}>用完皮肤状态真的变好了<span id={`script-tip-claim-${instance}`}>功效缺少依据</span></button>。
      </p>
      <div className="copy-risk-labels">
        <span>模板化话术</span><span>绝对化用语</span><span>功效缺少依据</span>
      </div>
      <small className="agent-visual-example">示例数据</small>
    </div>
  );
}

function DimensionImageForensics({ instance }: { instance: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: dimensionImageHotspots[0].left, y: dimensionImageHotspots[0].top });
  const currentRef = useRef({ x: 50, y: 48 });
  const animationRef = useRef(0);
  const autoTimerRef = useRef(0);
  const [lensPosition, setLensPosition] = useState({ x: 50, y: 48 });
  const [manual, setManual] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [userMoved, setUserMoved] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let hotspotIndex = 0;
    const moveAutomatically = () => {
      if (!manual) {
        const hotspot = dimensionImageHotspots[hotspotIndex % dimensionImageHotspots.length];
        targetRef.current = { x: hotspot.left, y: hotspot.top };
        hotspotIndex += 1;
      }
    };
    moveAutomatically();
    autoTimerRef.current = window.setInterval(moveAutomatically, 2000);
    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.12;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.12;
      setLensPosition({ ...currentRef.current });
      const nearby = dimensionImageHotspots.find((hotspot) => Math.hypot(hotspot.left - currentRef.current.x, hotspot.top - currentRef.current.y) < 12);
      if (!manual) setActiveHotspot(nearby?.id ?? null);
      animationRef.current = window.requestAnimationFrame(animate);
    };
    animationRef.current = window.requestAnimationFrame(animate);
    return () => {
      window.clearInterval(autoTimerRef.current);
      window.cancelAnimationFrame(animationRef.current);
    };
  }, [manual]);

  const moveLens = (clientX: number, clientY: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const bounds = frame.getBoundingClientRect();
    targetRef.current = {
      x: Math.max(0, Math.min(100, ((clientX - bounds.left) / bounds.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - bounds.top) / bounds.height) * 100)),
    };
  };

  return (
    <div
      className="dimension-image-forensics"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setManual(true);
      }}
      onPointerLeave={() => {
        setManual(false);
        setActiveHotspot(null);
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        setUserMoved(true);
        moveLens(event.clientX, event.clientY);
      }}
      ref={frameRef}
    >
      <img alt="秋冬奶油肌底妆分享肤质特写示例" src={portrait} />
      <div
        className="dimension-forensic-lens"
        style={{
          backgroundImage: `url(${portrait})`,
          backgroundPosition: `${lensPosition.x}% ${lensPosition.y}%`,
          left: `${lensPosition.x}%`,
          top: `${lensPosition.y}%`,
        }}
      >
        <i /><b />
        <span>取证层 · 扫描中</span>
      </div>
      {dimensionImageHotspots.map((hotspot) => (
        <button
          aria-describedby={`dimension-hotspot-${instance}-${hotspot.id}`}
          aria-label={`查看${hotspot.tag}证据`}
          className={`dimension-hotspot ${activeHotspot === hotspot.id ? "active" : ""}`}
          key={hotspot.id}
          onBlur={() => setActiveHotspot(null)}
          onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
          onFocus={() => setActiveHotspot(hotspot.id)}
          onMouseEnter={() => setActiveHotspot(hotspot.id)}
          onMouseLeave={() => {
            if (manual) setActiveHotspot(null);
          }}
          style={{ left: `${hotspot.left}%`, top: `${hotspot.top}%` }}
        >
          <i />
          {activeHotspot === hotspot.id && <span id={`dimension-hotspot-${instance}-${hotspot.id}`}><small>{hotspot.tag}</small>{hotspot.text}</span>}
        </button>
      ))}
      {!userMoved && <p>移动鼠标，用放大镜查看</p>}
      <small className="agent-visual-example">示例数据</small>
    </div>
  );
}

function FlowConnector({
  direction,
  lineProgress,
  ruleProgress = 0,
}: {
  direction: "in" | "out";
  lineProgress: number[];
  ruleProgress?: number;
}) {
  const inputPaths = ["M0 24 L120 120", "M0 72 L120 120", "M0 168 L120 120", "M0 216 L120 120"];
  const outputPaths = ["M0 120 L145 48", "M0 120 L145 120", "M0 120 L145 192"];
  const paths = direction === "in" ? inputPaths : outputPaths;
  return (
    <div className={`agent-flow-connector connector-${direction}`} aria-hidden="true">
      <svg viewBox={`0 0 ${direction === "in" ? 120 : 145} 240`}>
        {paths.map((path, index) => (
          <path
            d={path}
            key={path}
            pathLength="1"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 - (lineProgress[index] ?? 0) }}
          />
        ))}
      </svg>
      {direction === "out" && (
        <div className="rule-score-node" style={{ "--rule-progress": ruleProgress } as React.CSSProperties}>
          <strong>规则评分</strong>
          <small>分数由公开规则计算，<br />不由 AI 一句话拍板</small>
        </div>
      )}
    </div>
  );
}

function CheckSection({ active, replayKey, staticMode }: { active: boolean; replayKey: number; staticMode: boolean }) {
  const previousIndexRef = useRef(0);
  const [activeCode, setActiveCode] = useState<DimensionCode>("T");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [autoStopped, setAutoStopped] = useState(false);

  useEffect(() => {
    setActiveCode("T");
    previousIndexRef.current = 0;
    setDirection("forward");
    setAutoStopped(false);
  }, [replayKey]);

  useEffect(() => {
    if (!active || staticMode || autoStopped) return;
    const timer = window.setInterval(() => {
      const nextIndex = (previousIndexRef.current + 1) % agentScenes.length;
      setDirection(nextIndex === 0 ? "backward" : "forward");
      previousIndexRef.current = nextIndex;
      setActiveCode(agentScenes[nextIndex].code);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [active, autoStopped, replayKey, staticMode]);

  const activateScene = (code: DimensionCode) => {
    const index = agentScenes.findIndex((scene) => scene.code === code);
    setDirection(index > previousIndexRef.current ? "forward" : "backward");
    previousIndexRef.current = index;
    setActiveCode(code);
  };

  const selectScene = (code: DimensionCode) => {
    setAutoStopped(true);
    activateScene(code);
  };

  const renderPanel = (scene: (typeof agentScenes)[number], mobile = false) => (
    <div
      aria-hidden={!mobile && scene.code !== activeCode}
      className={`agent-dimension-panel ${mobile ? "mobile-panel" : `${scene.code === activeCode ? "active" : ""} slide-${direction}`}`}
      id={mobile ? `dimension-panel-${scene.code.toLowerCase()}` : undefined}
      inert={!mobile && scene.code !== activeCode}
      key={`${mobile ? "mobile" : "desktop"}-${scene.code}`}
    >
      {mobile && <h3 className="mobile-dimension-title"><span>{scene.code}</span>{scene.label}</h3>}
      <div className="agent-scene-copy">
        <span>{scene.code} · {scene.label}</span>
        <h3>{scene.question}</h3>
        <p>{scene.description}</p>
        <small>TruLens 的四个维度之一</small>
        <div className="agent-dimension-score">
          <span>该维度评分</span>
          <strong>{scene.score.toFixed(1)}</strong>
          <div><i style={{ width: `${scene.score * 10}%` }} /></div>
          <small>/ 10</small>
        </div>
      </div>
      <div className={`agent-scene-visual scene-${scene.code.toLowerCase()}`}>
        <AgentSceneVisual code={scene.code} instance={mobile ? "mobile" : "desktop"} />
      </div>
    </div>
  );

  return (
      <section
        className="one-agent-section"
        id="how-check"
      >
        <div className="one-agent-sticky">
          <div className="one-agent-heading">
            <span className="section-tag">02 / 查</span>
            <h2>四个维度，各自取证</h2>
            <p>证据，不是结论。每一个判断，都能指给你看它从哪里来。</p>
          </div>

          <div aria-label="选择 TruLens 核验维度" className="agent-segmented" role="tablist">
            {agentScenes.map((scene) => (
              <button
                aria-selected={activeCode === scene.code}
                className={activeCode === scene.code ? "active" : ""}
                key={scene.code}
                onClick={() => selectScene(scene.code)}
                role="tab"
              >
                <span>{scene.code}</span>{scene.label}
                {activeCode === scene.code && active && !autoStopped && !staticMode && <i className="agent-tab-timer" key={`${replayKey}-${scene.code}`} />}
              </button>
            ))}
          </div>

          <div className="agent-scene-shell" onFocusCapture={() => setAutoStopped(true)} onPointerEnter={() => setAutoStopped(true)}>
            {agentScenes.map((scene) => renderPanel(scene))}
          </div>
          <div className="agent-mobile-panels">
            {agentScenes.map((scene) => renderPanel(scene, true))}
          </div>
        </div>
      </section>
  );
}

function MergeSection({ active, replayKey, staticMode }: { active: boolean; replayKey: number; staticMode: boolean }) {
  const animationFrameRef = useRef(0);
  const [elapsed, setElapsed] = useState(staticMode ? 4.6 : 0);

  useEffect(() => {
    window.cancelAnimationFrame(animationFrameRef.current);
    if (staticMode) {
      setElapsed(4.6);
      return;
    }
    if (!active) {
      setElapsed(0);
      return;
    }
    const startedAt = performance.now();
    const animate = (now: number) => {
      const nextElapsed = Math.min(4.6, (now - startedAt) / 1000);
      setElapsed(nextElapsed);
      if (nextElapsed < 4.6) animationFrameRef.current = window.requestAnimationFrame(animate);
    };
    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrameRef.current);
  }, [active, replayKey, staticMode]);

  const timedProgress = (start: number, duration: number) => Math.min(1, Math.max(0, (elapsed - start) / duration));
  const resultProgress = agentScenes.map((_, index) => timedProgress(0.3 + index * 0.6, 0.7));
  const convergenceProgress = timedProgress(2.8, 0.5);
  const outputProgress = [timedProgress(3.4, 0.9), timedProgress(3.7, 0.5), timedProgress(4, 0.5)];
  const verdictProgress = timedProgress(4.3, 0.2);

  return (
      <section className={`architecture-section ${active || staticMode ? "merge-visible" : ""}`} id="how-merge">
        <div className="architecture-sticky">
          <div className="architecture-heading">
            <span className="section-tag">03 / 合</span>
            <h2>四个结果，汇成一个分数</h2>
            <p>不是四个工具拼在一起，而是同一个 Agent 的四种视角。</p>
          </div>

          <div className="one-agent-flow">
            <div className="flow-inputs merge-results">
              <small>四个维度的结果</small>
              {agentScenes.map((scene, index) => (
                <div
                  aria-label={`${scene.code} ${scene.label}，评分 ${scene.score.toFixed(1)}`}
                  className={`merge-result result-${scene.code.toLowerCase()}`}
                  key={scene.code}
                  style={{ "--result-progress": resultProgress[index] } as React.CSSProperties}
                >
                  <span>{scene.code}</span>
                  <div>
                    <strong>{scene.label}</strong>
                    <i><b style={{ width: `${scene.score * 10 * resultProgress[index]}%` }} /></i>
                  </div>
                  <em>{resultProgress[index] > 0 ? (scene.score * resultProgress[index]).toFixed(1) : ""}</em>
                </div>
              ))}
            </div>

            <FlowConnector direction="in" lineProgress={resultProgress} />

            <div className="aperture-column">
              <div className="aperture-orbits">
            <i className="aperture-orbit orbit-inner" />
            <i className="aperture-orbit orbit-outer" />
            <svg aria-label="TruLens 的四个核验维度" className="agent-aperture" viewBox="0 0 280 280">
              {[
                { code: "T" as DimensionCode, path: "M138 18A122 122 0 0 0 18 138H92a48 48 0 0 1 46-46Z", x: 75, y: 80, label: "账号可信度" },
                { code: "R" as DimensionCode, path: "M142 18a122 122 0 0 1 120 120h-74a48 48 0 0 0-46-46Z", x: 205, y: 80, label: "图片真实性" },
                { code: "U" as DimensionCode, path: "M262 142a122 122 0 0 1-120 120v-74a48 48 0 0 0 46-46Z", x: 205, y: 205, label: "评论区真实性" },
                { code: "S" as DimensionCode, path: "M138 262A122 122 0 0 1 18 142h74a48 48 0 0 0 46 46Z", x: 75, y: 205, label: "文案真实性" },
              ].map((petal, index) => (
                <g
                  aria-label={`${petal.code} ${petal.label}`}
                  className={`aperture-petal petal-${petal.code.toLowerCase()}`}
                  key={petal.code}
                  style={{ "--petal-progress": resultProgress[index] } as React.CSSProperties}
                >
                  <path d={petal.path} />
                  <text className="petal-letter" textAnchor="middle" x={petal.x} y={petal.y}>{petal.code}</text>
                  <text className="petal-label" textAnchor="middle" x={petal.x} y={petal.y + 16}>{petal.label}</text>
                </g>
              ))}
              <g className="merge-rays" style={{ "--merge-progress": convergenceProgress } as React.CSSProperties}>
                <line pathLength="1" x1="75" x2="140" y1="80" y2="140" />
                <line pathLength="1" x1="205" x2="140" y1="80" y2="140" />
                <line pathLength="1" x1="205" x2="140" y1="205" y2="140" />
                <line pathLength="1" x1="75" x2="140" y1="205" y2="140" />
              </g>
              <g className="aperture-core">
                <circle cx="140" cy="140" r="45" />
                <g transform="translate(128 113)"><Sparkle size={24} /></g>
                <text textAnchor="middle" x="140" y="158">TruLens</text>
              </g>
            </svg>
              </div>
            </div>

            <FlowConnector direction="out" lineProgress={outputProgress} ruleProgress={convergenceProgress} />

            <div className="flow-outputs">
              <small>统一输出</small>
              <div
                aria-label={`Trust Score ${Math.round(43 * outputProgress[0])} / 100，存疑，谨慎参考`}
                className="merge-output score-output"
                style={{ "--output-progress": outputProgress[0], "--verdict-progress": verdictProgress } as React.CSSProperties}
              >
                <span>Trust Score</span>
                <strong>{Math.round(43 * outputProgress[0])}<small>/ 100</small></strong>
                <em>存疑 · 谨慎参考</em>
              </div>
              <div className="merge-output" style={{ "--output-progress": outputProgress[1] } as React.CSSProperties}>证据与解释</div>
              <div className="merge-output" style={{ "--output-progress": outputProgress[2] } as React.CSSProperties}>购买建议</div>
            </div>
          </div>

          <small className="one-agent-example">示例数据</small>
        </div>
      </section>
  );
}

// Kept as a hot-reload compatibility bridge for sessions that still reference
// the pre-narrative component name. The current Home renders HowNarrative.
function OneAgentSection() {
  return (
    <>
      <CheckSection active replayKey={0} staticMode={false} />
      <MergeSection active replayKey={0} staticMode={false} />
    </>
  );
}

type ReportPart = "score" | "band" | "radar" | "evidence" | "missing" | "advice";

const reportDimensions = [
  { code: "T" as DimensionCode, name: "账号可信度", score: 6, evidence: "近 30 篇笔记中 24 篇带商品链接" },
  { code: "R" as DimensionCode, name: "图片真实性", score: 3, evidence: "高光方向与背景光源不一致，肤色过渡出现断层" },
  { code: "U" as DimensionCode, name: "评论区真实性", score: 4, evidence: "62 条评论中 41 条句式相似，集中在 2 小时内发布" },
  { code: "S" as DimensionCode, name: "文案真实性", score: 5, evidence: '文案模板化，并含绝对化用语“24 小时不脱妆”' },
];

const reportCallouts: Array<{ number: string; text: string; part: ReportPart; side: "left" | "right" }> = [
  { number: "01", text: "Trust Score 综合得分", part: "score", side: "left" },
  { number: "02", text: "风险色带", part: "band", side: "left" },
  { number: "03", text: "四维雷达图", part: "radar", side: "left" },
  { number: "04", text: "逐项证据，每个维度都附依据", part: "evidence", side: "right" },
  { number: "05", text: "购买建议，告诉你下一步", part: "advice", side: "right" },
];

function ReportSection({ active, onStart, staticMode }: { active: boolean; onStart: () => void; staticMode: boolean }) {
  const missingComments = false;
  const [activePart, setActivePart] = useState<ReportPart | null>(null);
  const [activeDimension, setActiveDimension] = useState<DimensionCode | null>(null);

  const focusCallout = (part: ReportPart | null) => {
    setActivePart(part);
    setActiveDimension(part === "missing" ? "U" : null);
  };

  const radarPoints = missingComments
    ? "M120 56 L147 110 M75 110 L120 56"
    : "M120 56 L147 110 L120 146 L75 110 Z";

  return (
    <section className={`report-showcase-section ${active || staticMode ? "is-visible" : ""} ${staticMode ? "is-static" : ""}`} id="how-report">
      <div className="report-showcase-heading">
        <span className="section-tag">04 / 报</span>
        <h2>一份报告，读懂一条种草</h2>
        <p>不只告诉你真假，更告诉你为什么，以及下一步怎么做。</p>
      </div>

      <div className="report-showcase-stage">
        <div className="report-mode-switch single" role="tablist" aria-label="报告展示方式">
          <button
            aria-selected="true"
            className="active"
            role="tab"
          >
            多维可视化报告
          </button>
        </div>

        <article className={`trust-report-card ${missingComments ? "has-missing-data" : ""}`} data-focus={activePart ?? undefined}>
          <header className="trust-report-head">
            <div><strong>TruLens 核验报告</strong><small>秋冬奶油肌底妆分享 · 同一个 Agent 汇总四个维度</small></div>
            <span>示例数据</span>
          </header>

          <section className="report-score-block report-highlight part-score">
            <div className="report-score-ring">
              <span>Trust Score</span>
              <strong className="report-state-swap" key={missingComments ? "score-missing" : "score-complete"}>
                {missingComments ? "暂不评分" : <>43 <small>/ 100</small></>}
              </strong>
              {missingComments && <em>评论数据不足，已核验 3 / 4 个维度</em>}
            </div>
            <span className={`report-verdict ${missingComments ? "missing" : ""}`} key={missingComments ? "verdict-missing" : "verdict-complete"}>
              {missingComments ? "数据不足" : "存疑 · 谨慎参考"}
            </span>
          </section>

          <section className="report-risk-band report-highlight part-band">
            <div><i /></div>
            <span>高风险</span><span>可信</span>
          </section>

          <section className="report-dimensions-block">
            <div className="report-radar report-highlight part-radar">
              <svg aria-label="T R U S 四维雷达图" viewBox="0 0 240 220">
                {[0.25, 0.5, 0.75, 1].map((scale) => {
                  const radius = 90 * scale;
                  return (
                    <polygon
                      className="radar-grid"
                      key={scale}
                      points={`120,${110 - radius} ${120 + radius},110 120,${110 + radius} ${120 - radius},110`}
                    />
                  );
                })}
                {[
                  { code: "T" as DimensionCode, x: 120, y: 20, tx: 120, ty: 12 },
                  { code: "R" as DimensionCode, x: 210, y: 110, tx: 224, ty: 114 },
                  { code: "U" as DimensionCode, x: 120, y: 200, tx: 120, ty: 215 },
                  { code: "S" as DimensionCode, x: 30, y: 110, tx: 16, ty: 114 },
                ].map((axis) => (
                  <g
                    aria-label={`${axis.code} 维度`}
                    className={`radar-axis axis-${axis.code.toLowerCase()} ${activeDimension && activeDimension !== axis.code ? "dimmed" : ""} ${missingComments && axis.code === "U" ? "missing" : ""}`}
                    key={axis.code}
                    onBlur={() => setActiveDimension(null)}
                    onClick={() => setActiveDimension((current) => current === axis.code ? null : axis.code)}
                    onFocus={() => setActiveDimension(axis.code)}
                    onMouseEnter={() => setActiveDimension(axis.code)}
                    onMouseLeave={() => setActiveDimension(null)}
                    role="button"
                    tabIndex={0}
                  >
                    <line x1="120" x2={axis.x} y1="110" y2={axis.y} />
                    <circle cx={axis.x} cy={axis.y} r="10" />
                    <text textAnchor="middle" x={axis.tx} y={axis.ty}>{axis.code}</text>
                    {axis.code === "S" && <text className="radar-axis-name" textAnchor="start" x="4" y="130">文案真实性</text>}
                  </g>
                ))}
                <path className="radar-data" d={radarPoints} />
                {[
                  ["T", 120, 56],
                  ["R", 147, 110],
                  ["U", 120, 146],
                  ["S", 75, 110],
                ].map(([code, x, y]) => (
                  !(missingComments && code === "U") && (
                    <circle
                      className={`radar-point ${activeDimension && activeDimension !== code ? "dimmed" : ""}`}
                      cx={x}
                      cy={y}
                      key={code}
                      r="4"
                    />
                  )
                ))}
                {missingComments && <circle className="radar-point missing-point" cx="120" cy="146" r="5" />}
              </svg>
              <small>四维核验分布</small>
            </div>

            <div className="report-dimension-list">
              {reportDimensions.map((dimension) => {
                const isMissing = missingComments && dimension.code === "U";
                return (
                  <div
                    className={`report-dimension-row report-highlight part-evidence ${dimension.code === "U" ? "part-missing" : ""} ${activeDimension && activeDimension !== dimension.code ? "dimension-dimmed" : ""} ${activeDimension === dimension.code ? "dimension-active" : ""} ${isMissing ? "is-missing" : ""}`}
                    key={dimension.code}
                    onClick={() => setActiveDimension((current) => current === dimension.code ? null : dimension.code)}
                    onMouseEnter={() => setActiveDimension(dimension.code)}
                    onMouseLeave={() => setActiveDimension(null)}
                  >
                    <span className={`report-dimension-badge badge-${dimension.code.toLowerCase()}`}>{dimension.code}</span>
                    <div>
                      <span className="report-state-swap" key={`${dimension.code}-${isMissing ? "missing" : "complete"}`}>
                        <strong>{dimension.name}</strong><b>{isMissing ? "数据不足，未评分" : dimension.score.toFixed(1)}</b>
                      </span>
                      <div className="dimension-meter"><i style={{ width: isMissing ? "100%" : `${dimension.score * 10}%` }} /></div>
                      <small>{isMissing ? "数据不足，未评分" : dimension.evidence}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="report-advice report-highlight part-advice">
            <h3>下单前先核实 3 件事</h3>
            {[
              ["T", "看这个账号的其他笔记，是不是几乎都在带货"],
              ["U", "等 30 天后的追评，比首周的好评更有参考价值"],
              ["R", "先拿小样或线下试用，再决定整瓶下单"],
            ].map(([code, text]) => (
              <div className={missingComments && code === "U" ? "advice-muted" : ""} key={code}>
                <span className={`report-dimension-badge badge-${code.toLowerCase()}`}>{code}</span>
                <p>{text}</p>
              </div>
            ))}
          </section>
        </article>

        <div className="report-callouts" aria-label="报告结构说明">
          {reportCallouts.map((callout, index) => (
            <button
              className={`report-callout callout-${callout.side} callout-${index + 1} ${activePart === callout.part ? "active" : ""}`}
              key={callout.number}
              onClick={() => focusCallout(activePart === callout.part ? null : callout.part)}
              onMouseEnter={() => focusCallout(callout.part)}
              onMouseLeave={() => focusCallout(null)}
            >
              <span>{callout.number}</span>
              <strong>{callout.text}</strong>
              <i />
            </button>
          ))}
        </div>
      </div>

      <div className="report-final-action">
        <button onClick={onStart}>
          体验 TruLens Agent
          <span><Arrow size={18} /></span>
        </button>
        <small>示例数据，仅用于展示报告结构</small>
      </div>
    </section>
  );
}

const agentIntroExamples = [
  {
    label: "种草笔记",
    attachments: ["种草笔记截图.png", "评论区截图.png"],
    prompt: "这篇种草笔记可信吗？",
    score: 43,
    verdict: "存疑 · 谨慎参考",
    tone: "caution",
    reply: "账号带货占比高、评论句式相似、出现绝对化用语。下单前先核实 3 件事。",
  },
  {
    label: "清一色好评的评论区",
    attachments: ["评论区截图.png"],
    prompt: "这些好评是真的吗？",
    score: 31,
    verdict: "高风险",
    tone: "risk",
    reply: "62 条评论里有 41 条句式相似，集中在 2 小时内发布。",
  },
  {
    label: "过度修图的对比图",
    attachments: ["对比图.png"],
    prompt: "这张对比图被修过吗？",
    score: 28,
    verdict: "高风险",
    tone: "risk",
    reply: "高光方向与背景光源不一致，肤色过渡出现断层。",
  },
];

function AgentIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const demoTimersRef = useRef<number[]>([]);
  const playedRef = useRef(false);
  const [activeExample, setActiveExample] = useState(0);
  const [visibleAttachments, setVisibleAttachments] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [sendPulse, setSendPulse] = useState(false);
  const [replyVisible, setReplyVisible] = useState(false);
  const [uploadHint, setUploadHint] = useState(false);
  const example = agentIntroExamples[activeExample];

  const clearDemoTimers = () => {
    demoTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    demoTimersRef.current = [];
  };

  const playDemo = (exampleIndex = activeExample) => {
    clearDemoTimers();
    const nextExample = agentIntroExamples[exampleIndex];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setUploadHint(false);
    setVisibleAttachments(0);
    setTypedText("");
    setSendPulse(false);
    setReplyVisible(false);

    if (reduceMotion) {
      setVisibleAttachments(nextExample.attachments.length);
      setTypedText(nextExample.prompt);
      setReplyVisible(true);
      return;
    }

    nextExample.attachments.forEach((_, index) => {
      demoTimersRef.current.push(window.setTimeout(() => {
        setVisibleAttachments(index + 1);
      }, 180 + index * 200));
    });

    const typingStart = 300 + nextExample.attachments.length * 200;
    nextExample.prompt.split("").forEach((_, index) => {
      demoTimersRef.current.push(window.setTimeout(() => {
        setTypedText(nextExample.prompt.slice(0, index + 1));
      }, typingStart + index * 60));
    });

    const typingEnd = typingStart + nextExample.prompt.length * 60;
    demoTimersRef.current.push(window.setTimeout(() => setSendPulse(true), typingEnd + 180));
    demoTimersRef.current.push(window.setTimeout(() => setSendPulse(false), typingEnd + 620));
    demoTimersRef.current.push(window.setTimeout(() => setReplyVisible(true), typingEnd + 520));
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playedRef.current) {
          playedRef.current = true;
          playDemo(0);
          observer.disconnect();
        }
      },
      { threshold: 0.28 },
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      clearDemoTimers();
    };
  }, []);

  const selectExample = (index: number) => {
    setActiveExample(index);
    playDemo(index);
  };

  const showUploadHint = () => {
    setUploadHint(true);
    demoTimersRef.current.push(window.setTimeout(() => setUploadHint(false), 2000));
  };

  return (
    <section className="agent-intro-section" ref={sectionRef}>
      <div className="agent-intro-heading">
        <span className="section-tag">WHAT IS TRULENS</span>
        <h2>丢进一条种草笔记</h2>
        <p>TruLens 把它变成一份看得见依据的<span>可信度画像</span>。</p>
      </div>

      <div className="agent-intro-demo">
        <div className="agent-prompt-card">
          <div className="agent-prompt-attachments">
            {example.attachments.map((attachment, index) => (
              <span className={visibleAttachments > index ? "visible" : ""} key={attachment}>
                <i>
                  <Icon size={15}>
                    <rect height="14" rx="2" stroke="currentColor" strokeWidth="1.4" width="17" x="3.5" y="5" />
                    <circle cx="9" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="m5.5 17 4-4 2.7 2.5 2.1-2 3.2 3.5" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
                  </Icon>
                </i>
                {attachment}
              </span>
            ))}
          </div>
          <div className="agent-prompt-text" aria-label={example.prompt}>
            {typedText}<i className="typing-cursor" />
          </div>
          <div className="agent-prompt-actions">
            <button aria-label="添加附件" className="agent-add-button" onClick={showUploadHint}>
              <Icon size={20}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></Icon>
            </button>
            {uploadHint && <span className="agent-upload-hint" role="status">演示版本，暂不支持上传</span>}
            <button
              aria-label="发送并重新播放演示"
              className={`agent-send-button ${sendPulse ? "pulse" : ""}`}
              onClick={() => playDemo()}
            >
              <Icon size={21}><path d="M12 19V5m0 0L7 10m5-5 5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></Icon>
            </button>
          </div>
        </div>

        <div aria-live="polite" className="agent-intro-reply-live">
          {replyVisible && (
            <div className={`agent-intro-reply ${example.tone}`}>
              <div className="agent-reply-score" style={{ "--agent-score": example.score } as React.CSSProperties}>
                <div><strong>{example.score}</strong><small>/ 100</small></div>
              </div>
              <div className="agent-reply-copy">
                <span>{example.verdict}</span>
                <p>{example.reply}</p>
              </div>
              <small>示例数据</small>
            </div>
          )}
        </div>

        <div className="agent-example-row">
          <small>试试示例：</small>
          <div>
            {agentIntroExamples.map((item, index) => (
              <button
                aria-pressed={activeExample === index}
                className={activeExample === index ? "active" : ""}
                key={item.label}
                onClick={() => selectExample(index)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="agent-intro-note">基于开源大模型 · 每个判断都附证据 · 数据不足时不硬判</p>
      <button
        className="agent-intro-next"
        onClick={() => document.querySelector(".story-scroller")?.scrollIntoView({ behavior: "smooth" })}
      >
        往下看，为什么你需要它
        <Icon size={16}><path d="M12 5v14m0 0-5-5m5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></Icon>
      </button>
    </section>
  );
}

const HOW_SCENE_RANGES = [
  { id: "trust", number: "01", label: "拆", start: 0, end: 0.18, status: "已收到" },
  { id: "how-check", number: "02", label: "查", start: 0.18, end: 0.55, status: "取证中" },
  { id: "how-merge", number: "03", label: "合", start: 0.55, end: 0.77, status: "评分中" },
  { id: "how-report", number: "04", label: "报", start: 0.77, end: 1, status: "报告已生成" },
];

function HowChapterRail({ activeChapter, onSelect, progress }: { activeChapter: number; onSelect: (index: number) => void; progress: number }) {
  return (
    <nav aria-label="How 章节导航" className="how-chapter-rail visible">
      <div>
        <span className="how-rail-progress" style={{ height: `${progress * 100}%` }} />
        {HOW_SCENE_RANGES.map((chapter, index) => (
          <button className={activeChapter === index ? "active" : ""} key={chapter.id} onClick={() => onSelect(index)}>
            <i /><span>{chapter.number}</span><strong>{chapter.label}</strong>
          </button>
        ))}
      </div>
      <button className="how-report-link" onClick={() => onSelect(3)}>直接看报告</button>
    </nav>
  );
}

function TrustScene({ active }: { active: boolean }) {
  return (
    <section className={`trust-section ${active ? "is-entered" : ""}`} id="trust">
      <div className="trust-heading">
        <span className="section-tag">01 / 拆</span>
        <h2>认识你的 AI 信任顾问团队</h2>
        <p>从四种信号，读懂一条种草笔记</p>
      </div>
      <svg aria-hidden="true" className="trust-split-lines" preserveAspectRatio="none" viewBox="0 0 1200 100">
        {["M600 0 L110 100", "M600 0 L430 100", "M600 0 L770 100", "M600 0 L1090 100"].map((path, index) => (
          <path d={path} key={path} pathLength="1" style={{ "--line-index": index } as React.CSSProperties} />
        ))}
      </svg>
      <div className="trust-grid">
        <div className="trust-marquee-track">
          {[0, 1].map((group) => (
            <div aria-hidden={group === 1} className="trust-marquee-group" inert={group === 1} key={group}>
              {[
                ["T", "账号侦探", "Trustworthiness", "近 30 篇笔记的发布节奏与带货记录"],
                ["R", "视觉取证师", "Reality", "图片的光影、拼接痕迹与色彩过渡"],
                ["U", "口碑观察员", "User Voice", "评论的句式相似度与发布时间"],
                ["S", "文字检察官", "Script", "文案的话术模板与夸大用语"],
              ].map(([letter, name, title, text], index) => (
                <article className={`trust-card card-${index + 1}`} key={`${group}-${letter}`} tabIndex={group === 0 ? 0 : -1}>
                  <span>{letter}</span><h3>{name}</h3>
                  <div><strong>{title}</strong><p><small>它看什么</small>它看：{text}</p></div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowNarrative({ onStart }: { onStart: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const frameRef = useRef(0);
  const previousSceneRef = useRef(0);
  const previousStageVisibleRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [stageVisible, setStageVisible] = useState(false);
  const [linearMode, setLinearMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visibleScenes, setVisibleScenes] = useState<Set<number>>(new Set([0]));
  const [replayKeys, setReplayKeys] = useState([1, 0, 0, 0]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 899px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMode = () => {
      setLinearMode(mobileQuery.matches || motionQuery.matches);
      setReducedMotion(motionQuery.matches);
    };
    updateMode();
    mobileQuery.addEventListener("change", updateMode);
    motionQuery.addEventListener("change", updateMode);
    return () => {
      mobileQuery.removeEventListener("change", updateMode);
      motionQuery.removeEventListener("change", updateMode);
    };
  }, []);

  useEffect(() => {
    if (linearMode) return;
    const update = () => {
      const container = containerRef.current;
      if (!container) return;
      const bounds = container.getBoundingClientRect();
      const distance = container.offsetHeight - window.innerHeight;
      const nextProgress = Math.min(1, Math.max(0, -bounds.top / distance));
      const nextScene = HOW_SCENE_RANGES.findIndex((range, index) => nextProgress >= range.start && (index === 3 || nextProgress < range.end));
      const nextStageVisible = bounds.top < window.innerHeight * 0.65 && bounds.bottom > window.innerHeight * 0.35;
      setProgress(nextProgress);
      setActiveScene(nextScene);
      setStageVisible(nextStageVisible);
      if (nextStageVisible && !previousStageVisibleRef.current) {
        setReplayKeys((keys) => keys.map((key, index) => index === nextScene ? key + 1 : key));
      }
      previousStageVisibleRef.current = nextStageVisible;
      if (nextScene !== previousSceneRef.current) {
        previousSceneRef.current = nextScene;
        setReplayKeys((keys) => keys.map((key, index) => index === nextScene ? key + 1 : key));
      }
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [linearMode]);

  useEffect(() => {
    if (!linearMode || reducedMotion) {
      if (reducedMotion) setVisibleScenes(new Set([0, 1, 2, 3]));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Number((entry.target as HTMLElement).dataset.scene);
        setVisibleScenes((current) => {
          const next = new Set(current);
          if (entry.isIntersecting) next.add(index);
          else next.delete(index);
          return next;
        });
        if (entry.isIntersecting) {
          setActiveScene(index);
          setReplayKeys((keys) => keys.map((key, sceneIndex) => sceneIndex === index ? key + 1 : key));
        }
      });
    }, { threshold: 0.18 });
    sceneRefs.current.forEach((scene) => scene && observer.observe(scene));
    return () => observer.disconnect();
  }, [linearMode, reducedMotion]);

  const scrollToScene = (index: number) => {
    const container = containerRef.current;
    if (!container || linearMode) {
      document.getElementById(HOW_SCENE_RANGES[index].id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }
    const top = window.scrollY + container.getBoundingClientRect().top;
    const distance = container.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + HOW_SCENE_RANGES[index].start * distance, behavior: "smooth" });
  };

  const presentation = (index: number) => {
    if (linearMode) return undefined;
    const range = HOW_SCENE_RANGES[index];
    const enter = index === 0 ? 1 : Math.min(1, Math.max(0, (progress - (range.start - 0.025)) / 0.05));
    const exit = index === 3 ? 1 : 1 - Math.min(1, Math.max(0, (progress - (range.end - 0.025)) / 0.05));
    const opacity = Math.min(enter, exit);
    const translateY = enter < 1 ? 32 * (1 - enter) : exit < 1 ? -24 * (1 - exit) : 0;
    return { opacity, transform: `translateY(${translateY}px) scale(${0.97 + opacity * 0.03})`, visibility: opacity > 0.01 ? "visible" : "hidden" } as React.CSSProperties;
  };

  const scenes = [
    <TrustScene active={linearMode ? visibleScenes.has(0) : stageVisible && activeScene === 0} />,
    <CheckSection active={linearMode ? visibleScenes.has(1) : stageVisible && activeScene === 1} replayKey={replayKeys[1]} staticMode={linearMode} />,
    <MergeSection active={linearMode ? visibleScenes.has(2) : stageVisible && activeScene === 2} replayKey={replayKeys[2]} staticMode={linearMode} />,
    <ReportSection active={linearMode ? visibleScenes.has(3) : stageVisible && activeScene === 3} onStart={onStart} staticMode={linearMode} />,
  ];

  return (
    <div className={`how-narrative ${linearMode ? "linear" : ""}`} id="how-journey" ref={containerRef}>
      <div className="how-stage">
        {!linearMode && <HowChapterRail activeChapter={activeScene} onSelect={scrollToScene} progress={progress} />}
        {!linearMode && (
          <div className="how-progress-card">
            <img alt="" src={portrait} />
            <div><strong>秋冬奶油肌底妆分享</strong><small key={activeScene}>{HOW_SCENE_RANGES[activeScene].status}</small></div>
          </div>
        )}
        <div aria-live="polite" className="sr-only">当前：{HOW_SCENE_RANGES[activeScene].number} {HOW_SCENE_RANGES[activeScene].label}</div>
        {scenes.map((scene, index) => {
          const interactive = linearMode || activeScene === index;
          return (
            <div
              aria-hidden={!linearMode && !interactive}
              className={`how-scene ${visibleScenes.has(index) ? "mobile-visible" : ""}`}
              data-scene={index}
              inert={!linearMode && !interactive}
              key={HOW_SCENE_RANGES[index].id}
              ref={(element) => { sceneRefs.current[index] = element; }}
              style={presentation(index)}
            >
              <div className="how-scene-canvas">{scene}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type HeroAttachment = {
  id: string;
  name: string;
  kind: "image" | "link";
  preview?: string;
  example?: boolean;
  value?: string;
};

const heroDemoPhrases = [
  "这篇种草笔记可信吗？",
  "这些好评是真的吗？",
  "这张对比图被修过吗？",
];

function HeroComposer({
  onSubmit,
}: {
  onSubmit: (prompt: string, filename: string, example: boolean) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idleTimerRef = useRef<number | null>(null);
  const exampleRunRef = useRef(0);
  const objectUrlsRef = useRef<string[]>([]);
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<HeroAttachment[]>([]);
  const [interacted, setInteracted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [demoText, setDemoText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const idleDemo = !interacted && !focused && !value && attachments.length === 0;
  const canSubmit = Boolean(value.trim() || attachments.length);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 174)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 174 ? "auto" : "hidden";
  }, [value]);

  useEffect(() => {
    if (!idleDemo) {
      setDemoText("");
      return;
    }
    if (reducedMotion) {
      setDemoText(heroDemoPhrases[0]);
      return;
    }
    let cancelled = false;
    const wait = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration));
    const run = async () => {
      let phraseIndex = 0;
      while (!cancelled) {
        const phrase = heroDemoPhrases[phraseIndex];
        for (let index = 1; index <= phrase.length && !cancelled; index += 1) {
          setDemoText(phrase.slice(0, index));
          await wait(90);
        }
        await wait(1800);
        for (let index = phrase.length - 1; index >= 0 && !cancelled; index -= 1) {
          setDemoText(phrase.slice(0, index));
          await wait(35);
        }
        phraseIndex = (phraseIndex + 1) % heroDemoPhrases.length;
      }
    };
    run();
    return () => { cancelled = true; };
  }, [idleDemo, reducedMotion]);

  const activate = () => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    exampleRunRef.current += 1;
    setInteracted(true);
    setDemoText("");
  };

  const addFiles = (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (!images.length) return;
    activate();
    setAttachments((current) => [
      ...current,
      ...images.map((file) => {
        const preview = URL.createObjectURL(file);
        objectUrlsRef.current.push(preview);
        return { id: `${file.name}-${file.lastModified}-${Math.random()}`, name: file.name, kind: "image" as const, preview };
      }),
    ]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.preview?.startsWith("blob:")) URL.revokeObjectURL(target.preview);
      return current.filter((item) => item.id !== id);
    });
  };

  const addLink = (url: string) => {
    activate();
    setAttachments((current) => [
      ...current,
      { id: `link-${Date.now()}`, name: url.length > 30 ? `${url.slice(0, 30)}…` : url, kind: "link", value: url },
    ]);
  };

  const selectExample = async (index: number) => {
    textareaRef.current?.focus();
    activate();
    const runId = exampleRunRef.current;
    const example = agentIntroExamples[index];
    const previews = [postImage, "/evidence/comments-1.jpg", "/evidence/skin-comparison.jpg"];
    setValue("");
    setAttachments([{
      id: `example-${index}`,
      name: example.attachments[0],
      kind: "image",
      preview: previews[index],
      example: true,
    }]);
    if (reducedMotion) {
      setValue(example.prompt);
      return;
    }
    for (let character = 1; character <= example.prompt.length; character += 1) {
      if (runId !== exampleRunRef.current) return;
      setValue(example.prompt.slice(0, character));
      await new Promise((resolve) => window.setTimeout(resolve, 50));
    }
  };

  const submit = () => {
    if (!canSubmit) {
      setShaking(false);
      window.requestAnimationFrame(() => setShaking(true));
      window.setTimeout(() => setShaking(false), 240);
      activate();
      textareaRef.current?.focus();
      return;
    }
    const link = attachments.find((attachment) => attachment.kind === "link");
    const writtenPrompt = value.trim();
    const linkValue = link?.value ?? link?.name;
    const prompt = writtenPrompt
      ? `${writtenPrompt}${linkValue ? `\n链接：${linkValue}` : ""}`
      : (linkValue ? `请帮我鉴别这个链接：${linkValue}` : "请帮我鉴别我上传的美妆种草内容");
    const filename = attachments.find((attachment) => attachment.kind === "image")?.name ?? "";
    onSubmit(prompt, filename, attachments.some((attachment) => attachment.example));
  };

  return (
    <div className="hero-composer-wrap hero-sequence-4">
      <div
        className={`hero-composer ${focused ? "focused" : ""} ${dragging ? "dragging" : ""} ${shaking ? "shake" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          activate();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(Array.from(event.dataTransfer.files));
        }}
      >
        {dragging && <div className="hero-drop-overlay">松开以添加截图</div>}
        {attachments.length > 0 && (
          <div className="hero-attachments">
            {attachments.map((attachment) => (
              <span className="hero-attachment" key={attachment.id}>
                {attachment.kind === "image" ? (
                  <img alt="" src={attachment.preview} />
                ) : (
                  <i><Icon size={14}><path d="M10 13a4 4 0 0 0 5.7.1l2.4-2.4A4 4 0 0 0 12.4 5l-1.3 1.3M14 11a4 4 0 0 0-5.7-.1l-2.4 2.4A4 4 0 0 0 11.6 19l1.3-1.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" /></Icon></i>
                )}
                <b>{attachment.name}</b>
                {attachment.example && <em>示例</em>}
                <button aria-label="移除附件" onClick={() => removeAttachment(attachment.id)}>×</button>
              </span>
            ))}
          </div>
        )}
        <div className="hero-textarea-shell">
          {idleDemo && <span aria-hidden="true" className="hero-demo-placeholder">{demoText}<i /></span>}
          <textarea
            aria-label="输入你想鉴别的种草内容"
            onBlur={() => {
              setFocused(false);
              if (!value && attachments.length === 0) {
                idleTimerRef.current = window.setTimeout(() => setInteracted(false), 4000);
              }
            }}
            onChange={(event) => {
              activate();
              setValue(event.target.value);
            }}
            onFocus={() => {
              activate();
              setFocused(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            onPaste={(event) => {
              const pastedText = event.clipboardData.getData("text").trim();
              const imageFiles = Array.from(event.clipboardData.files).filter((file) => file.type.startsWith("image/"));
              if (imageFiles.length) {
                event.preventDefault();
                addFiles(imageFiles);
              } else if (/^https?:\/\//i.test(pastedText)) {
                event.preventDefault();
                addLink(pastedText);
              }
            }}
            ref={textareaRef}
            rows={2}
            value={value}
          />
        </div>
        <div className="hero-composer-tools">
          <button
            aria-label="添加截图"
            className="hero-add-button"
            onClick={() => {
              activate();
              fileInputRef.current?.click();
            }}
          >
            <Icon size={21}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></Icon>
          </button>
          <input
            accept="image/*"
            hidden
            multiple
            onChange={(event) => {
              addFiles(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
            ref={fileInputRef}
            type="file"
          />
          <button
            aria-disabled={!canSubmit}
            aria-label="开始鉴别"
            className={`hero-send-button ${canSubmit ? "" : "disabled"}`}
            onClick={submit}
          >
            <Icon size={21}><path d="M12 19V5m0 0L7 10m5-5 5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></Icon>
          </button>
        </div>
      </div>
      <p className="hero-promises hero-sequence-6">
        <span>每个判断都附证据</span><i /><span>数据不足时不硬判</span><i /><span>你可以反驳</span>
      </p>
    </div>
  );
}

function Home({
  onStart,
  onSubmit,
}: {
  onStart: () => void;
  onSubmit: (prompt: string, filename: string, example: boolean) => void;
}) {

  return (
    <main className="home">
      <nav className="home-nav">
        <Logo />
        <button className="home-fixed-cta" onClick={onStart}>
          上传帖子开始鉴别 <span className="circle-arrow"><Arrow size={17} /></span>
        </button>
      </nav>

      <section className="hero">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="eyebrow hero-sequence-1">
          <span className="live-dot" />
          MULTIMODAL BEAUTY INTELLIGENCE
        </div>
        <h1 className="cover-title hero-sequence-1">
          <span>TruLens<sup><Sparkle size={25} /></sup></span>
          <strong />
          <em>Your AI BeautyTrust Agent</em>
        </h1>
        <h2 className="hero-definition hero-sequence-2">丢进一条种草笔记，得到一份看得见依据的可信度画像</h2>
        <HeroComposer onSubmit={onSubmit} />
      </section>

      <StoryScroller />

      <HowNarrative onStart={onStart} />
    </main>
  );
}

function Sidebar({
  active,
  activeTask,
  archivedScore,
  collapsed,
  historyCleared,
  onNew,
  onLogout,
  onResetAgent,
  onReport,
  onTask,
  onToggle,
}: {
  active: Screen;
  activeTask: RecentTask;
  archivedScore: number | null;
  collapsed: boolean;
  historyCleared: boolean;
  onNew: () => void;
  onLogout: () => void;
  onResetAgent: () => void;
  onReport: (task: RecentTask) => void;
  onTask: (task: RecentTask) => void;
  onToggle: () => void;
}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [accountDialog, setAccountDialog] = useState<"help" | "reset" | "add" | "logout" | null>(null);
  const [accountInput, setAccountInput] = useState("");
  const [accountAdded, setAccountAdded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<"all" | "reports">("all");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchableTasks: Array<{ task: RecentTask; title: string; date: string; status: string; score: number }> = [
    { task: "makeup", title: "秋冬奶油肌底妆分享", date: "今天", status: archivedScore ? `已归档 · ${archivedScore} 分` : "高可信", score: archivedScore ?? 84 },
    { task: "serum", title: "热门精华测评合集", date: "昨天", status: "存在风险", score: 58 },
    { task: "whitening", title: "七天美白挑战", date: "3 天前", status: "疑似营销", score: 39 },
  ];
  const filteredSearchTasks = historyCleared
    ? []
    : searchableTasks.filter((item) =>
      `${item.title} ${item.date} ${item.status}`.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );

  useEffect(() => {
    if (!accountDialog) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountDialog(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [accountDialog]);

  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [searchOpen]);

  const openDialog = (dialog: Exclude<typeof accountDialog, null>) => {
    setAccountMenuOpen(false);
    setAccountDialog(dialog);
    if (dialog === "add") {
      setAccountInput("");
      setAccountAdded(false);
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="side-top">
        <Logo />
        <div className="side-top-actions">
          <button
            aria-label="搜索历史对话和报告"
            className="icon-button sidebar-search-button"
            onClick={() => {
              setAccountMenuOpen(false);
              setSearchQuery("");
              setSearchCategory("all");
              setSearchOpen(true);
            }}
            title="搜索"
          >
            <Icon size={18}>
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
            </Icon>
          </button>
          <button
            aria-label={collapsed ? "展开侧栏" : "收起侧栏"}
            aria-pressed={collapsed}
            className="icon-button mobile-hide sidebar-toggle"
            onClick={onToggle}
            title={collapsed ? "展开侧栏" : "收起侧栏"}
          >
            <Icon size={18}>
              <path d="M4 5h16M4 12h10M4 19h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
            </Icon>
          </button>
        </div>
      </div>
      <button className="new-analysis" onClick={onNew}>
        <span>
          <Sparkle size={17} /> 新建鉴别
        </span>
        <small>⌘ K</small>
      </button>
      <button
        className="sidebar-report-library"
        onClick={() => {
          setAccountMenuOpen(false);
          setSearchQuery("");
          setSearchCategory("reports");
          setSearchOpen(true);
        }}
        title="报告库"
      >
        <span>
          <Icon size={17}>
            <path d="M6 3h9l3 3v15H6V3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" />
            <path d="M15 3v4h3M9 11h6M9 14h6M9 17h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
          </Icon>
          报告库
        </span>
        <small>{historyCleared ? 0 : searchableTasks.length}</small>
      </button>
      <div className="side-label">最近任务</div>
      <div className="history">
        {historyCleared ? (
          <p className="history-empty">暂无检测记录</p>
        ) : (
          <>
            <button className={activeTask === "makeup" && (active === "chat" || active === "result") ? "active" : ""} onClick={() => onTask("makeup")}>
              <span className="history-thumb">
                <img alt="" src={postImage} />
              </span>
              <span>
                <strong>秋冬奶油肌底妆分享</strong>
                <small>{archivedScore ? `今天 · 已归档 · ${archivedScore} 分` : "今天 · 高可信"}</small>
              </span>
            </button>
            <button className={activeTask === "serum" && (active === "chat" || active === "result") ? "active" : ""} onClick={() => onTask("serum")}>
              <span className="history-thumb purple">
                <Sparkle size={15} />
              </span>
              <span>
                <strong>热门精华测评合集</strong>
                <small>昨天 · 存在风险</small>
              </span>
            </button>
            <button className={activeTask === "whitening" && (active === "chat" || active === "result") ? "active" : ""} onClick={() => onTask("whitening")}>
              <span className="history-thumb blue">S</span>
              <span>
                <strong>七天美白挑战</strong>
                <small>3 天前 · 疑似营销</small>
              </span>
            </button>
          </>
        )}
      </div>
      {searchOpen && (
        <div
          aria-modal="true"
          className="global-search-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSearchOpen(false);
          }}
          role="dialog"
        >
          <div className="global-search-dialog">
            <header className="global-search-header">
              <div className="global-search-input">
                <Icon size={21}>
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                </Icon>
                <input
                  aria-label="搜索历史对话和报告"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="搜索历史对话或报告…"
                  ref={searchInputRef}
                  value={searchQuery}
                />
                {searchQuery && <button aria-label="清空搜索" onClick={() => setSearchQuery("")}>×</button>}
              </div>
              <button aria-label="关闭搜索" className="global-search-close" onClick={() => setSearchOpen(false)}>
                <Icon size={20}><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></Icon>
              </button>
            </header>

            <div className="global-search-tabs" role="tablist">
              <button
                aria-selected={searchCategory === "all"}
                className={searchCategory === "all" ? "active" : ""}
                onClick={() => setSearchCategory("all")}
                role="tab"
              >
                <span>
                  <Icon size={18}><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" /></Icon>
                </span>
                <strong>全部</strong>
                <small>历史对话</small>
              </button>
              <button
                aria-selected={searchCategory === "reports"}
                className={searchCategory === "reports" ? "active" : ""}
                onClick={() => setSearchCategory("reports")}
                role="tab"
              >
                <span>
                  <Icon size={18}><path d="M6 3h9l3 3v15H6V3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" /><path d="M15 3v4h3M9 11h6M9 14h6M9 17h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" /></Icon>
                </span>
                <strong>报告库</strong>
                <small>历史报告合集</small>
              </button>
            </div>

            <div className="global-search-results">
              <div className="global-search-result-heading">
                <span>{searchCategory === "all" ? "历史对话" : "报告库"}</span>
                <small>{filteredSearchTasks.length} 项结果</small>
              </div>
              {filteredSearchTasks.length ? filteredSearchTasks.map((item) => (
                <button
                  className="global-search-result"
                  key={`${searchCategory}-${item.task}`}
                  onClick={() => {
                    setSearchOpen(false);
                    if (searchCategory === "reports") onReport(item.task);
                    else onTask(item.task);
                  }}
                >
                  <span className={`global-search-result-icon ${searchCategory === "reports" ? "report" : ""}`}>
                    {searchCategory === "reports" ? (
                      <Icon size={18}><path d="M6 3h9l3 3v15H6V3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" /><path d="M9 11h6M9 14h6M9 17h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" /></Icon>
                    ) : (
                      <Icon size={18}><path d="M4 5h16v11H9l-5 4V5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" /></Icon>
                    )}
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.date} · {item.status}</small>
                  </span>
                  {searchCategory === "reports" && <b>{item.score}<small>/100</small></b>}
                  <i>›</i>
                </button>
              )) : (
                <div className="global-search-empty">
                  <Icon size={24}><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.4" /><path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" /></Icon>
                  <strong>没有找到相关内容</strong>
                  <small>尝试搜索任务名称、日期或核验状态</small>
                </div>
              )}
            </div>
            <footer className="global-search-footer"><span><kbd>Esc</kbd> 关闭</span><span>点击结果即可打开</span></footer>
          </div>
        </div>
      )}
      {accountMenuOpen && <button aria-label="关闭账户菜单" className="account-menu-scrim" onClick={() => setAccountMenuOpen(false)} />}
      {accountMenuOpen && (
        <div className="account-menu">
          <button onClick={() => openDialog("help")}>
            <span className="account-menu-icon">
              <Icon size={20}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><path d="M9.7 9.2a2.5 2.5 0 1 1 3.1 2.4c-.6.3-.8.8-.8 1.5M12 16.7v.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" /></Icon>
            </span>
            <span><strong>帮助指引</strong><small>使用教程、FAQ</small></span>
            <i>›</i>
          </button>
          <button className="account-menu-reset" onClick={() => openDialog("reset")}>
            <span className="account-menu-icon">
              <Icon size={20}><path d="M19 8a7 7 0 1 0 .2 7.6M19 4v4h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></Icon>
            </span>
            <span><strong>重置 Agent</strong><small>清空聊天与检测历史</small></span>
          </button>
          <div className="account-menu-divider" />
          <button onClick={() => openDialog("add")}>
            <span className="account-menu-icon">
              <Icon size={20}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" /><path d="M12 8v8M8 12h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></Icon>
            </span>
            <span><strong>添加账号</strong><small>绑定另一个登录账号</small></span>
          </button>
          <button onClick={() => openDialog("logout")}>
            <span className="account-menu-icon">
              <Icon size={20}><path d="M10 5H5v14h5M14 8l4 4-4 4M9 12h9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></Icon>
            </span>
            <span><strong>退出登录</strong><small>退出当前个人账户</small></span>
          </button>
        </div>
      )}
      <div className="side-bottom">
        <button
          aria-expanded={accountMenuOpen}
          className={accountMenuOpen ? "account-trigger active" : "account-trigger"}
          onClick={() => setAccountMenuOpen((open) => !open)}
        >
          <span className="avatar">YZ</span>
          <span>
            <strong>Yuzuki</strong>
            <small>个人账户</small>
          </span>
          <span className="dots">
            <Icon size={18}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></Icon>
          </span>
        </button>
      </div>

      {accountDialog && (
        <div
          aria-modal="true"
          className="account-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setAccountDialog(null);
          }}
          role="dialog"
        >
          <div className="account-dialog">
            <button aria-label="关闭弹窗" className="account-dialog-close" onClick={() => setAccountDialog(null)}>×</button>
            {accountDialog === "help" && (
              <>
                <span className="account-dialog-tag">HELP CENTER</span>
                <h2>帮助指引</h2>
                <p>快速了解如何使用 TruLens 完成一次内容核验。</p>
                <div className="help-guide">
                  <section>
                    <h3>使用教程</h3>
                    <ol>
                      <li><span>1</span><div><strong>提供内容</strong><small>粘贴种草链接，或上传需要核验的图片。</small></div></li>
                      <li><span>2</span><div><strong>等待四维核验</strong><small>TruLens 从账号、图片、评论和宣传维度检查证据。</small></div></li>
                      <li><span>3</span><div><strong>阅读报告</strong><small>查看 Trust Score、逐项依据和购买建议。</small></div></li>
                    </ol>
                  </section>
                  <section className="help-faq">
                    <h3>FAQ</h3>
                    <details><summary>链接无法识别怎么办？</summary><p>请确认链接可公开访问，也可以补充截图或原始文案。</p></details>
                    <details><summary>Agent 的核查结论可以当作最终定论吗？</summary><p>TruLens Agent 是辅助核验工具，AI 存在误判、信息遗漏风险，不能直接作为事实定论，重要内容建议交叉查阅权威原始来源。</p></details>
                    <details><summary>数据不足会怎样显示？</summary><p>缺失维度会明确标注“数据不足”，不会由 AI 自动补全。</p></details>
                  </section>
                </div>
              </>
            )}
            {accountDialog === "reset" && (
              <>
                <span className="account-dialog-tag">RESET AGENT</span>
                <h2>重置 TruLens Agent？</h2>
                <p>这会清空当前聊天信息和所有检测历史。操作完成后无法恢复。</p>
                <div className="reset-summary"><span>聊天内容</span><strong>全部清空</strong><span>检测历史</span><strong>全部清空</strong></div>
                <div className="account-dialog-actions">
                  <button onClick={() => setAccountDialog(null)}>取消</button>
                  <button className="danger" onClick={() => { onResetAgent(); setAccountDialog(null); }}>确认重置</button>
                </div>
              </>
            )}
            {accountDialog === "add" && (
              <>
                <span className="account-dialog-tag">ADD ACCOUNT</span>
                <h2>添加账号</h2>
                <p>输入邮箱，将另一个账号添加到当前设备。</p>
                {accountAdded ? (
                  <div className="account-added"><span>✓</span><strong>账号已添加</strong><small>{accountInput}</small></div>
                ) : (
                  <>
                    <label className="account-input-label">邮箱地址<input onChange={(event) => setAccountInput(event.target.value)} placeholder="name@example.com" type="email" value={accountInput} /></label>
                    <div className="account-dialog-actions">
                      <button onClick={() => setAccountDialog(null)}>取消</button>
                      <button disabled={!accountInput.includes("@")} onClick={() => setAccountAdded(true)}>添加账号</button>
                    </div>
                  </>
                )}
              </>
            )}
            {accountDialog === "logout" && (
              <>
                <span className="account-dialog-tag">SIGN OUT</span>
                <h2>退出当前账户？</h2>
                <p>退出后将返回首页，本地检测记录不会被删除。</p>
                <div className="account-dialog-actions">
                  <button onClick={() => setAccountDialog(null)}>取消</button>
                  <button className="danger" onClick={() => { onLogout(); setAccountDialog(null); }}>退出登录</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

const suggestionItems = [
  ["鉴别配图真实性", "上传截图或粘贴帖子链接"],
  ["分析博主的历史可信度", "输入主页链接，检索长期行为"],
  ["检查产品功效宣传", "识别夸大、误导与安全风险"],
];

function Composer({
  compact = false,
  filename,
  onFile,
  onPauseToggle,
  onSubmit,
  pauseDisabled = false,
  paused = false,
  preset = "",
}: {
  compact?: boolean;
  filename: string;
  onFile: (name: string) => void;
  onPauseToggle?: () => void;
  onSubmit: (prompt: string) => void;
  pauseDisabled?: boolean;
  paused?: boolean;
  preset?: string;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(preset);
  }, [preset]);

  const submit = () => {
    if (value.trim() || filename) {
      onSubmit(value.trim() || "请帮我鉴别这篇美妆种草帖子是否由 AI 造假");
      setValue("");
    }
  };

  return (
    <div className={`composer ${compact ? "composer-compact" : ""}`}>
      <textarea
        aria-label="输入鉴别需求"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder={compact ? "继续追问这份报告…" : "粘贴帖子链接，或告诉我你想鉴别什么…"}
        rows={compact ? 1 : 3}
        value={value}
      />
      {filename && (
        <div className="file-chip">
          <span className="file-preview"><img alt="" src={postImage} /></span>
          <span><strong>{filename}</strong><small>已准备进行图像取证</small></span>
          <button aria-label="移除附件" onClick={() => onFile("")}>×</button>
        </div>
      )}
      <div className="composer-actions">
        <div>
          <input
            accept="image/*"
            hidden
            onChange={(event) => onFile(event.target.files?.[0]?.name || "")}
            ref={inputRef}
            type="file"
          />
          <button className="tool-button" onClick={() => inputRef.current?.click()} title="上传图片">
            <Icon size={18}>
              <path d="M12 4v16M4 12h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
            </Icon>
          </button>
          {!compact && (
            <button className="tool-button" title="粘贴链接">
              <Icon size={18}>
                <path d="m9.5 14.5 5-5M7.3 16.7l-1 1a3.5 3.5 0 0 1-5-5l3.2-3.2a3.5 3.5 0 0 1 5 0M16.7 7.3l1-1a3.5 3.5 0 1 1 5 5l-3.2 3.2a3.5 3.5 0 0 1-5 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
              </Icon>
            </button>
          )}
          {!compact && <span className="composer-hint">支持图片、视频、链接与文案</span>}
        </div>
        <div className="composer-submit-actions">
          {compact && onPauseToggle && (
            <button
              aria-label={pauseDisabled ? "当前回答已完成" : paused ? "继续生成" : "暂停生成"}
              className={paused ? "composer-pause paused" : "composer-pause"}
              disabled={pauseDisabled}
              onClick={onPauseToggle}
              title={pauseDisabled ? "当前回答已完成" : paused ? "继续生成" : "暂停生成"}
            >
              <Icon size={21}>
                {paused ? (
                  <path d="m8 5 11 7-11 7V5Z" fill="currentColor" />
                ) : (
                  <>
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
                    <rect fill="currentColor" height="6" rx="1.2" width="6" x="9" y="9" />
                  </>
                )}
              </Icon>
            </button>
          )}
          <button className="send-button" disabled={!value.trim() && !filename} onClick={submit}>
            <Arrow size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Workspace({
  filename,
  onFile,
  onHome,
  onSubmit,
}: {
  filename: string;
  onFile: (name: string) => void;
  onHome: () => void;
  onSubmit: (prompt: string) => void;
}) {
  const [starter, setStarter] = useState("");
  return (
    <section className="workspace">
      <div className="workspace-orb orb-left" />
      <div className="workspace-orb orb-right" />
      <header className="workspace-header">
        <div className="workspace-status-group">
          <button aria-label="返回首页" className="workspace-home" onClick={onHome} title="返回首页">
            <Icon size={22}>
              <path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </Icon>
          </button>
        </div>
      </header>
      <div className="workspace-center">
        <div className="agent-symbol"><Sparkle size={29} /></div>
        <p className="hello">你好，我是 TruLens</p>
        <h2>今天想鉴别什么？</h2>
        <p className="workspace-intro">上传美妆种草内容，我会从账号、图像、评论和文案四个维度寻找 AI 生成与营销造假痕迹。</p>
        <Composer
          filename={filename}
          onFile={onFile}
          onSubmit={(prompt) => onSubmit(starter || prompt)}
        />
        <div className="suggestions" />
      </div>
    </section>
  );
}

function AnalysisSteps({
  done,
  activeDimensions,
  paused,
}: {
  done: boolean;
  activeDimensions: DimensionCode[];
  paused: boolean;
}) {
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const roles = [
    {
      code: "T",
      role: "账号侦探",
      dimension: "Trustworthiness",
      weight: 25,
      score: 82,
      verdict: "可信",
      thinking: "正在回溯 286 篇历史内容与商业合作轨迹…",
      thinkingLabels: ["我正在冷静思考", "让我核对一下", "事实不会说谎"],
      insight: "账号持续运营 2.3 年，商业内容占比 18%，身份与发布节奏稳定。",
      evidence: ["历史内容连续，无集中删帖", "商业合作均有明确标识", "互动增长曲线未见突变"],
    },
    {
      code: "R",
      role: "视觉取证师",
      dimension: "Reality",
      weight: 30,
      score: 88,
      verdict: "轻度修饰",
      thinking: "正在比对皮肤纹理、边缘结构与光影方向…",
      thinkingLabels: ["我在快速扫图", "有异常，抓到了", "我再确认一遍"],
      insight: "面中存在两处生成式细化痕迹，但产品主体与整体光影保持真实。",
      evidence: ["局部毛孔纹理重复", "产品边缘连续自然", "环境光线方向一致"],
    },
    {
      code: "U",
      role: "口碑观察员",
      dimension: "User Voice",
      weight: 20,
      score: 74,
      verdict: "需留意",
      thinking: "正在聚类评论语义、发布时间与互动关系…",
      thinkingLabels: ["我在听大家说", "我在头脑风暴中", "慢慢拼出共识"],
      insight: "12% 的短评存在相似句式，其余评论具有具体问题与真实讨论特征。",
      evidence: ["有效评论 168 条", "同质短评占比 12%", "未发现批量账号联动"],
    },
    {
      code: "S",
      role: "宣传安全官",
      dimension: "Safety",
      weight: 25,
      score: 91,
      verdict: "安全",
      thinking: "正在核验功效承诺、广告表达与风险边界…",
      thinkingLabels: ["正在严谨审阅", "我按规范核验", "准备出具意见"],
      insight: "未发现绝对化功效承诺，合作标识清晰，个人体验边界完整。",
      evidence: ["无医疗功效宣称", "包含个体差异说明", "品牌合作标识清晰"],
    },
  ];
  const activeRoles = roles.filter((item) => activeDimensions.includes(item.code as DimensionCode));
  const activeWeightTotal = activeRoles.reduce((total, item) => total + item.weight, 0);
  const analysisScore = Math.round(activeRoles.reduce((total, item) => total + item.score, 0) / activeRoles.length);
  const dimensionWord = ["", "单", "双", "三", "四"][activeRoles.length];

  useEffect(() => {
    if (done || paused) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => Math.min(10, current + 0.1));
    }, 100);
    return () => window.clearInterval(timer);
  }, [done, paused]);

  const thinkingStage = Math.min(2, Math.floor(elapsedSeconds / 1.8));
  const reasoningStage = done ? 4 : Math.min(4, Math.floor(elapsedSeconds / 2));
  const reasoningFlow = [
    [`调用${activeRoles.length}个分析视角`, `正在唤醒 ${activeRoles.map((item) => item.code).join(" / ")} 分析角色`],
    [`生成${dimensionWord}维评分`, "正在校准各维度分数与证据权重"],
    ["发现关键风险", "正在定位可能改变消费判断的核心风险"],
    ["内部推理", "Reasoning · 正在消解不同证据之间的冲突"],
    ["生成最终报告", "正在组织可解释结论与决策依据"],
  ];
  const debateMessages = [
    ["T", "账号侦探", "提出判断", "账号轨迹稳定，现有证据不支持系统性造假。"],
    ["R", "视觉取证师", "提出异议", "我不同意完全放行。两处生成式修饰必须降低图像证据权重。"],
    ["U", "口碑观察员", "补充证据", "评论里确有相似话术，但多数反馈具体，暂不足以否定整篇内容。"],
    ["S", "宣传安全官", "形成裁定", "综合各方证据，建议保留风险说明后判定为高可信。"],
  ];
  const activeDebateMessages = debateMessages.filter(([code]) => activeDimensions.includes(code as DimensionCode));
  const debateDuration = 4 / activeDebateMessages.length;
  const debateIndex = Math.min(activeDebateMessages.length - 1, Math.floor(Math.max(0, elapsedSeconds - 4) / debateDuration));
  const activeDebate = activeDebateMessages[debateIndex];
  const debateFocus = activeDimensions.includes("R")
    ? "图像修饰是否足以改变宣传安全维度的判断？"
    : activeDimensions.includes("U")
      ? "评论异常是否足以推翻文案本身的安全性？"
      : "账号历史信号与当前宣传表达是否相互一致？";

  return (
    <div className={`trus-council ${done ? "is-complete" : "is-thinking"} ${paused ? "is-paused" : ""}`}>
      <div className="council-header">
        <div className="council-avatars">
          {activeRoles.map((item) => (
            <span className={`council-avatar role-${item.code.toLowerCase()}`} key={item.code}>
              <img alt="" src={roleAvatarByCode[item.code as DimensionCode]} />
              <i>{item.code}</i>
            </span>
          ))}
        </div>
        <div className="council-title">
          <span>TRUS REASONING COUNCIL</span>
          <strong>你的 AI 信任评审团正在讨论</strong>
          <small>{done ? `${activeRoles.length} 个角色已完成验证，点击角色查看证据` : `${activeRoles.length} 个角色正在分析当前输入`}</small>
        </div>
        <div className="council-state">
          <i />
          {done ? `${activeRoles.length} / ${activeRoles.length} 完成 · ${elapsedSeconds.toFixed(1)} 秒` : paused ? `已暂停 · ${elapsedSeconds.toFixed(1)} 秒` : `已思考 ${elapsedSeconds.toFixed(1)} 秒`}
        </div>
      </div>

      <div className="reasoning-flow">
        <div className="reasoning-flow-steps">
          {reasoningFlow.map(([label], index) => (
            <div
              className={index < reasoningStage || done ? "completed" : index === reasoningStage ? "active" : ""}
              key={label}
            >
              <span>{index < reasoningStage || done ? "✓" : index + 1}</span>
              <small>{label}</small>
            </div>
          ))}
        </div>
        <p key={reasoningStage}>
          <Sparkle size={13} />
          {done ? "推理链已完成，最终报告已生成" : reasoningFlow[reasoningStage][1]}
        </p>
      </div>

      <div className="council-columns">
        <span>分析视角与观点</span>
        <span>权重</span>
        <span>判断</span>
      </div>

      <div className="council-roles">
        {activeRoles.map((item, index) => (
          <div className={`council-role-wrap ${expandedRole === item.code ? "expanded" : ""}`} key={item.code}>
            <button
              className={`council-role role-${item.code.toLowerCase()}`}
              onClick={() => setExpandedRole((current) => current === item.code ? null : item.code)}
              style={{ "--role-delay": `${index * 120}ms` } as React.CSSProperties}
            >
              <span className="role-persona">
                <span className="role-avatar">
                  <img alt={`${item.role}角色`} src={roleAvatarByCode[item.code as DimensionCode]} />
                  <i>{item.code}</i>
                </span>
                <span>
                  <strong>{item.role}</strong>
                  <small>{item.dimension}</small>
                  <p>{done ? item.insight : item.thinking}</p>
                </span>
              </span>
              <span className="role-weight">{Math.round((item.weight / activeWeightTotal) * 100)}%</span>
              <span className="role-judgement">
                {done ? (
                  <><strong>{item.score}</strong><small>{item.verdict}</small></>
                ) : reasoningStage >= 1 ? (
                  <><strong>{item.score}</strong><small>{item.thinkingLabels[thinkingStage]}</small></>
                ) : (
                  <><i /><small>{item.thinkingLabels[thinkingStage]}</small></>
                )}
              </span>
              <span className="role-chevron">⌄</span>
            </button>
            <div className="role-progress"><i style={{ "--role-score": `${item.score}%` } as React.CSSProperties} /></div>
            {expandedRole === item.code && (
              <div className="role-evidence">
                <span>证据链</span>
                {item.evidence.map((evidence) => <p key={evidence}>✓ {evidence}</p>)}
              </div>
            )}
          </div>
        ))}
      </div>

      {reasoningStage >= 2 && reasoningStage < 4 && activeDebateMessages.length > 1 && (
        <div className="expert-debate">
          <div className="debate-header">
            <span><i /> EXPERT DISCUSSION</span>
            <div className="debate-cast">
              {activeDebateMessages.map(([code], index) => (
                <i className={index === debateIndex ? "active" : index < debateIndex ? "heard" : ""} key={code}>
                  {code}
                </i>
              ))}
            </div>
            <small>{debateIndex + 1} / {activeDebateMessages.length}</small>
          </div>
          <div className={`debate-message role-${activeDebate[0].toLowerCase()}`} key={debateIndex}>
            <span className="debate-avatar">
              <img alt="" src={portrait} />
              <i>{activeDebate[0]}</i>
            </span>
            <div>
              <span><strong>{activeDebate[1]}</strong><small>{activeDebate[2]}</small></span>
              <p>“{activeDebate[3]}”</p>
            </div>
          </div>
          <div className="debate-focus">
            <span>争议焦点</span>
            {debateFocus}
          </div>
        </div>
      )}

      {reasoningStage >= 2 && reasoningStage < 4 && activeDebateMessages.length === 1 && (
        <div className="reasoning-finding stage-3">
          <span>INDEPENDENT REVIEW</span>
          <p>{activeDebate[3]}</p>
        </div>
      )}

      {reasoningStage >= 4 && (
        <div className="debate-consensus">
          <span><Sparkle size={13} /> {activeRoles.length > 1 ? `${activeRoles.length} 位专家达成共识` : `${activeRoles[0].role}完成独立审查`}</span>
          <p>{activeRoles.length > 1 ? "已结合当前可用模态完成交叉验证，并生成对应维度的可信度报告。" : "当前输入仅支持单维度判断，报告会明确标注证据范围。"}</p>
        </div>
      )}

      <div className="council-result">
        <div>
          {activeRoles.map((item, index) => (
            <span key={item.code}>
              {index > 0 && <i>+</i>}
              <span>{item.code} {Math.round((item.weight / activeWeightTotal) * 100)}%</span>
            </span>
          ))}
        </div>
        <div>
          <small>{done ? "加权结果" : `等待交叉验证 · ${elapsedSeconds.toFixed(1)}s`}</small>
          {done ? <><strong>{analysisScore}</strong><span>{analysisScore >= 80 ? "高可信" : "需留意"}</span></> : <span className="council-loading"><i /><i /><i /></span>}
        </div>
      </div>
    </div>
  );
}

const initialQuickFollowups = [
  "哪些图片区域可能经过 AI 修饰？",
  "评论区有哪些异常话术？",
  "这个博主长期可信吗？",
  "我该购买吗",
];

const appealPrompt = "我想申诉或辩解当前核验结论";
const appealOptions: Array<{
  code: DimensionCode;
  label: string;
  role: string;
  reply: string;
}> = [
  {
    code: "R",
    label: "视觉取证不准",
    role: "视觉专家",
    reply: "收到您的申诉！视觉专家 R 正在重新对该区域进行局部像素频域分析……正在剥离环境光影干扰……请稍候。",
  },
  {
    code: "T",
    label: "账号侦测误判",
    role: "账号专家",
    reply: "收到您的申诉！账号专家 T 正在重新回溯主页简介、历史动态与商业合作轨迹……正在排除账号成长周期带来的误判……请稍候。",
  },
  {
    code: "U",
    label: "评论区误伤",
    role: "评论专家",
    reply: "收到您的申诉！评论专家 U 正在重新聚类评论句式、发布时间与互动关系……正在区分真实共鸣与协同传播……请稍候。",
  },
  {
    code: "S",
    label: "文案检查误判",
    role: "文案专家",
    reply: "收到您的申诉！文案专家 S 正在重新核对原文语境、体验边界与功效主张……正在排除修辞表达造成的误判……请稍候。",
  },
];

function getInitialQuickFollowups(activeDimensions: DimensionCode[]) {
  if (activeDimensions.length === 1) {
    return ["文案中有哪些夸大表达？", "是否存在绝对化宣传？", "这段文案足以支持决策吗？", "还需要补充什么证据？"];
  }
  if (activeDimensions.includes("U")) {
    return ["哪些评论最像批量生成的？", "评论与文案结论一致吗？", "真实用户主要在讨论什么？", "评论区整体可信吗？"];
  }
  if (activeDimensions.includes("T")) {
    return ["这个博主长期可信吗？", "商业合作比例高吗？", "历史内容有没有异常？", "账号与文案是否一致？"];
  }
  return ["哪些图片区域可能经过 AI 修饰？", "图片与文案结论一致吗？", "有没有整图生成痕迹？", "当前证据足够可信吗？"];
}

function getNextQuickFollowups(question?: string) {
  if (!question) return initialQuickFollowups;
  if (question.includes("图片区域") || question.includes("AI 修饰")) {
    return [
      "这些修饰会影响产品效果判断吗？",
      "能进一步解释脸颊区域的异常吗？",
      "这是普通美化还是 AI 造假？",
      "我还需要查看哪些原图？",
    ];
  }
  if (question.includes("效果") || question.includes("美化") || question.includes("原图")) {
    return [
      "这项图像风险会如何影响帖子可信度？",
      "如果图片可信度降低，我该如何决策？",
      "哪些证据能够抵消这项风险？",
      "评论是否支持图片中的结论？",
    ];
  }
  if (question.includes("评论") || question.includes("话术")) {
    return [
      "哪些评论最像批量生成的？",
      "真实用户主要在意什么问题？",
      "评论异常会影响可信分吗？",
      "结合图片给我最终建议",
    ];
  }
  if (question.includes("博主") || question.includes("账号")) {
    return [
      "她的商业合作比例高吗？",
      "历史内容有没有前后矛盾？",
      "哪些账号行为值得警惕？",
      "结合本篇内容给出可信结论",
    ];
  }
  if (question.includes("购买") || question.includes("最终建议") || question.includes("相差")) {
    return [
      "哪些证据最影响这次购买决定？",
      "如果只看可信度，我该如何选择？",
      "当前还缺少什么关键证据？",
      "帮我总结这次决策的风险等级",
    ];
  }
  return [
    "这条证据的置信度是多少？",
    "还有其他风险需要注意吗？",
    "它会如何影响购买决定？",
    "帮我总结当前结论",
  ];
}

function ContextualFollowupAnswer({ question }: { question: string }) {
  let title = "已结合当前报告继续核验";
  let answer = "这条新问题与已有的账号、图像、评论和文案证据进行了交叉验证。目前没有出现足以推翻原结论的新风险信号。";
  let facts = ["与原始证据一致", "未发现新增高风险项", "综合可信度保持稳定"];

  if (question.includes("影响产品效果")) {
    title = "会影响对遮瑕力的判断，但不影响色号参考";
    answer = "AI 细化主要抹平了面中毛孔和轻微卡粉，因此画面会高估底妆的柔焦与遮瑕表现。产品色号、光泽方向和整体服帖度没有明显被改变。";
    facts = ["遮瑕表现可能被高估", "色号参考仍有效", "建议查看 4 小时持妆图"];
  } else if (question.includes("脸颊区域")) {
    title = "异常来自过度均匀的高频皮肤纹理";
    answer = "真实皮肤的毛孔、绒毛和细小纹理通常具有随机变化；该区域出现重复频率和方向高度一致的纹理，同时没有对应的光影起伏。";
    facts = ["纹理周期重复", "毛孔方向一致", "缺少自然光影起伏"];
  } else if (question.includes("普通美化") || question.includes("AI 造假")) {
    title = "更接近 AI 辅助美化，而非整图造假";
    answer = "人物结构、产品边缘和环境光线都保持连续，异常只集中在局部皮肤纹理。这说明工具可能用于精修肤质，而不是重新生成产品效果。";
    facts = ["主体结构真实", "局部生成式精修", "未改变产品形态"];
  } else if (question.includes("哪些原图") || question.includes("确认什么")) {
    title = "优先补充三类未经精修的证据";
    answer = "自然光近景、四小时后的持妆图，以及包含鼻翼与下颌边缘的视频帧，最能验证遮瑕、卡粉和真实皮肤纹理。";
    facts = ["自然光近景", "四小时持妆图", "连续视频原帧"];
  } else if (question.includes("评论")) {
    title = "评论区存在少量同质话术，但未形成批量水评";
    answer = "约 12% 的短评使用了相似的情绪词和购买号召，发布时间也较集中；其余评论包含肤质差异、使用时长和具体问题，整体仍有真实讨论特征。";
    facts = ["相似短评 12%", "真实提问占多数", "未发现大规模账号联动"];
  } else if (question.includes("帖子可信度") || question.includes("图像风险")) {
    title = "图像证据折损会降低结论强度，但不会让整篇帖子失信";
    answer = "当前图像维度的异常只影响视觉展示证据，账号轨迹、评论结构和文案安全性仍提供独立支持。因此综合可信度会小幅下降，而不是直接变成“不可信”。";
    facts = ["视觉证据权重下降", "其他模态仍可验证", "综合结论保持中高可信"];
  } else if (
    question.includes("购买") ||
    question.includes("决策") ||
    question.includes("风险等级") ||
    question.includes("只看可信度") ||
    question.includes("关键证据")
  ) {
    title = "帖子可以作为参考，但不足以单独支持购买决定";
    answer = "账号历史和文本表达提供了正向可信信号，局部图像修饰则降低了展示证据的可靠性。更稳妥的决策方式，是把这篇帖子作为一个信息来源，并等待其他独立内容对关键结论形成交叉验证。";
    facts = ["整体可信度较高", "图像证据存在折损", "需要独立来源交叉验证"];
  }

  return (
    <div className="contextual-answer">
      <span className="contextual-answer-tag">FOLLOW-UP INSIGHT</span>
      <strong>{title}</strong>
      <p>{answer}</p>
      <div>{facts.map((fact) => <span key={fact}>✓ {fact}</span>)}</div>
    </div>
  );
}

function ArgueReviewFlow({
  evidenceName,
  explanation,
  onArchive,
  option,
}: {
  evidenceName: string;
  explanation: string;
  onArchive: (score: number) => void;
  option: (typeof appealOptions)[number];
}) {
  const [stage, setStage] = useState(0);
  const [archived, setArchived] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const accepted = option.code === "R" || option.code === "S";
  const oldScore = 84;
  const newScore = option.code === "R" ? 93 : option.code === "S" ? 90 : oldScore;
  const decisionCopy = option.code === "R"
    ? "感谢纠错，经二次复核，该区域确系环境强反光与底妆高光叠加，并非 AI 生成式修饰。我们已降低原异常信号权重，并对视觉取证结论作出修正。"
    : option.code === "S"
      ? "感谢补充。结合完整上下文后，原文属于个人体验描述而非确定性功效承诺，文案风险等级已下调。"
      : option.code === "U"
        ? "您的申诉部分成立：部分短评可能来自真实用户的品牌共识，但评论区仍存在明显的同质化传播痕迹，因此综合信任分维持原样，建议重点关注评论风险。"
        : "您的申诉部分成立：账号的高关注数不足以单独证明互关增长，但历史内容中的产品推荐密度依然较高，因此综合信任分维持原样，并优化账号风险提示。";
  const thinkingLabels = [
    `正在仅调用 ${option.role} ${option.code} 接收申诉材料`,
    `${option.role} ${option.code} 正在独立重检争议证据`,
    "单维复核完成，T / R / U / S 圆桌会议已启动",
    "四位专家正在交换反证并重新校准权重",
    "圆桌会诊结束，重新评估报告已生成",
  ];

  useEffect(() => {
    if (stage >= 4) return;
    const timer = window.setTimeout(() => setStage((current) => current + 1), stage >= 2 ? 1700 : 1300);
    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [stage]);

  return (
    <div className="argue-consultation">
      <div className="argue-consultation-head">
        <div>
          <span>ARGUE COUNCIL · 重新会诊</span>
          <strong>{stage < 2 ? `${option.role}正在单独复核“${option.label}”` : stage < 4 ? "四位专家正在进行圆桌会议" : "重新评估报告已生成"}</strong>
          {explanation && <small>用户补充：“{explanation}”</small>}
          {evidenceName && <small>新增证据：{evidenceName}</small>}
        </div>
        <span className="argue-live"><i /> {stage < 4 ? "会诊中" : "已完成"}</span>
      </div>

      <div className="argue-council-cast">
        {(["T", "R", "U", "S"] as DimensionCode[]).map((code) => (
          <span className={`${code === option.code ? "lead" : ""} ${code === option.code || stage >= 2 ? "active" : ""}`} key={code}>
            <img alt={`${code} 专家`} src={roleAvatarByCode[code]} />
            <i>{code}</i>
          </span>
        ))}
        <div>
          <span>{thinkingLabels[stage]}</span>
          <small>{Math.min(100, 18 + stage * 22)}% · 正在重新计算证据权重</small>
        </div>
      </div>

      <div className="argue-thinking-flow">
        {["专属专家接单", "单维证据复核", "四专家圆桌会议", "生成重评报告"].map((label, index) => (
          <span className={stage > index ? "complete" : stage === index ? "active" : ""} key={label}>
            <i>{stage > index ? "✓" : index + 1}</i>{label}
          </span>
        ))}
      </div>

      {stage >= 1 && (
        <div className={`argue-expert-feedback role-${option.code.toLowerCase()}`}>
          <span>
            <img alt={`${option.role} ${option.code}`} src={roleAvatarByCode[option.code]} />
            <i>{option.code}</i>
          </span>
          <div><small>{option.role} · 单专家二次取证</small><p>{option.reply}</p></div>
        </div>
      )}

      {stage >= 2 && stage < 4 && (
        <div className="argue-roundtable-note">
          <span><Sparkle size={13} /> ROUND TABLE</span>
          <p>专项复核结果已提交圆桌。T / R / U / S 正在从账号、图像、评论与文案四个维度重新评估其对综合信任分的影响。</p>
        </div>
      )}

      {stage >= 4 && (
        <div className={`argue-final-decision ${accepted ? "accepted" : "partial"}`}>
          <header>
            <div>
              <span>重新评估报告 · {accepted ? "申诉已采纳" : "申诉部分成立"}</span>
              <strong>{accepted ? "AI 已修正原核验结论" : "保留原分数，风险提示已优化"}</strong>
            </div>
            <div className="argue-score-change">
              <span>{oldScore}</span><i>→</i><strong>{newScore}</strong><small>/100</small>
            </div>
          </header>
          <p>{decisionCopy}</p>
          <div className="argue-decision-meta">
            <span>复核编号 TL-A-{option.code}-0618</span>
            <span>原始报告与申诉过程已保留</span>
          </div>
          <button
            className={archived ? "archived" : ""}
            disabled={archived}
            onClick={() => {
              setArchived(true);
              onArchive(newScore);
            }}
          >
            {archived ? "✓ 已保存到避坑 / 鉴真收藏夹" : "归档最终版报告"}
            {!archived && <Arrow size={16} />}
          </button>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}

function Chat({
  prompt,
  filename,
  isExampleSubmission,
  activeDimensions,
  onArchiveReport,
  onFile,
  onHome,
  onResult,
}: {
  prompt: string;
  filename: string;
  isExampleSubmission: boolean;
  activeDimensions: DimensionCode[];
  onArchiveReport: (score: number) => void;
  onFile: (name: string) => void;
  onHome: () => void;
  onResult: () => void;
}) {
  const [done, setDone] = useState(false);
  const [paused, setPaused] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState("");
  const [followups, setFollowups] = useState<Array<{ id: number; question: string; answered: boolean; detail?: string; evidenceName?: string }>>([]);
  const [appealDraftCode, setAppealDraftCode] = useState<DimensionCode | null>(null);
  const [appealExplanation, setAppealExplanation] = useState("");
  const [appealEvidenceName, setAppealEvidenceName] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const replyTimerRef = useRef<number | null>(null);
  const analysisRemainingRef = useRef(10000);
  const analysisStartedAtRef = useRef(0);
  const followupRemainingRef = useRef(1100);
  const followupStartedAtRef = useRef(0);
  const latestFollowup = followups[followups.length - 1];
  const hasAppealed = followups.some((followup) => followup.question === appealPrompt);
  const selectedAppeal = appealOptions.find((option) =>
    followups.some((followup) => followup.question === option.label),
  );
  const isGenerating = !done || Boolean(latestFollowup && !latestFollowup.answered);
  const isArgueFlow = hasAppealed && (!latestFollowup || latestFollowup.question === appealPrompt || Boolean(selectedAppeal));
  const quickFollowups = isArgueFlow
    ? []
    : latestFollowup && !latestFollowup.answered
    ? []
    : latestFollowup
      ? getNextQuickFollowups(latestFollowup.question)
      : getInitialQuickFollowups(activeDimensions);
  const expertNames: Record<DimensionCode, string> = {
    T: "账号侦探",
    R: "视觉取证师",
    U: "口碑观察员",
    S: "宣传安全官",
  };
  const scoreByDimension: Record<DimensionCode, number> = { T: 82, R: 88, U: 74, S: 91 };
  const analysisScore = Math.round(activeDimensions.reduce((total, code) => total + scoreByDimension[code], 0) / activeDimensions.length);
  const analysisSummary = activeDimensions.includes("R")
    ? "图像主体可信，但存在轻度 AI 修饰痕迹"
    : activeDimensions.includes("U")
      ? "评论整体可参考，但存在少量相似话术"
      : activeDimensions.includes("T")
        ? "账号轨迹稳定，宣传表达未见明显风险"
        : "文案表达整体安全，未见高风险宣传承诺";
  useEffect(() => {
    if (paused || done) return;
    analysisStartedAtRef.current = Date.now();
    const timer = window.setTimeout(() => {
      analysisRemainingRef.current = 0;
      setDone(true);
    }, analysisRemainingRef.current);
    return () => {
      window.clearTimeout(timer);
      analysisRemainingRef.current = Math.max(
        0,
        analysisRemainingRef.current - (Date.now() - analysisStartedAtRef.current),
      );
    };
  }, [paused, done]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [done, followups]);

  useEffect(() => {
    if (!latestFollowup || latestFollowup.answered || paused) return;
    const followupId = latestFollowup.id;
    followupStartedAtRef.current = Date.now();
    replyTimerRef.current = window.setTimeout(() => {
      followupRemainingRef.current = 0;
      setFollowups((current) =>
        current.map((item) => item.id === followupId ? { ...item, answered: true } : item),
      );
    }, followupRemainingRef.current);
    return () => {
      if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
      followupRemainingRef.current = Math.max(
        0,
        followupRemainingRef.current - (Date.now() - followupStartedAtRef.current),
      );
    };
  }, [latestFollowup, paused]);

  const sendFollowup = (question: string, detail?: string, evidenceName?: string) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || (latestFollowup && !latestFollowup.answered)) return;
    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    setQuickPrompt("");
    setPaused(false);
    followupRemainingRef.current = 1100;
    const id = Date.now();
    setFollowups((current) => [...current, { id, question: cleanQuestion, answered: false, detail, evidenceName }]);
  };

  const submitAppeal = () => {
    const option = appealOptions.find((item) => item.code === appealDraftCode);
    if (!option) return;
    sendFollowup(option.label, appealExplanation.trim(), appealEvidenceName);
  };

  return (
    <section className="chat">
      <header className="chat-header">
        <div className="chat-header-main">
          <button aria-label="返回首页" className="chat-home-button" onClick={onHome} title="返回首页">
            <Icon size={22}>
              <path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </Icon>
          </button>
          <div className="chat-header-title">
            <strong>{activeDimensions.length === 1 ? "文案安全性鉴别" : `${activeDimensions.length} 维内容鉴别`}</strong>
            <small>{paused && isGenerating ? "生成已暂停" : !done ? `正在调用 ${activeDimensions.map((code) => expertNames[code]).join("、")}…` : latestFollowup && !latestFollowup.answered ? "正在生成追问回答…" : "分析完成"}</small>
          </div>
        </div>
        <div className="chat-header-actions">
          <div className="share-wrap">
            <button className="header-share" onClick={() => setShareOpen((open) => !open)}>
              <Icon size={17}>
                <circle cx="18" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="18" cy="19" r="2.2" stroke="currentColor" strokeWidth="1.5" />
                <path d="m8 11 8-5M8 13l8 5" stroke="currentColor" strokeWidth="1.5" />
              </Icon>
              分享
            </button>
            {shareOpen && <ShareMenu onClose={() => setShareOpen(false)} />}
          </div>
        </div>
      </header>
      <div className="chat-scroll">
        <div className="demo-version-banner">
          <Sparkle size={14} />
          <span><strong>演示版本</strong>以下为示例结果，并非对你输入内容的判断</span>
        </div>
        <div className="user-message">
          <div>
            <p>{prompt}</p>
            {filename && (
              <span className="message-attachment">
                <img alt="待分析美妆帖子预览" src={postImage} />
                <span><strong>{filename}</strong><small>{isExampleSubmission ? "示例 · 演示附件" : "图片内容 · 已上传"}</small></span>
              </span>
            )}
          </div>
          <span className="avatar user-avatar">YZ</span>
        </div>

        <div className="agent-message">
          <span className="agent-avatar"><Sparkle size={17} /></span>
          <div className="agent-content">
            <div className="agent-name">TruLens <span>多模态鉴别 Agent</span></div>
            <p>收到。根据当前输入，我将调用 {activeDimensions.map((code) => expertNames[code]).join("和")}，只分析有足够证据支持的维度。</p>
            <AnalysisSteps activeDimensions={activeDimensions} done={done} paused={paused} />
            {!done ? (
              <div className={`thinking ${paused ? "paused" : ""}`}><i /><i /><i /> {paused ? "分析已暂停，点击继续恢复推理" : activeDimensions.length > 1 ? `${activeDimensions.length} 位专家正在交换证据并校准权重` : `${expertNames[activeDimensions[0]]}正在独立核验证据`}</div>
            ) : (
              <>
                <div className="analysis-complete">
                  <div className="mini-score" style={{ "--mini-score": analysisScore } as React.CSSProperties}>
                    <span><strong>{analysisScore}</strong>/100</span>
                    <small>综合可信度</small>
                  </div>
                  <div>
                    <strong>{analysisSummary}</strong>
                    <p>本次结论仅基于当前输入可识别的 {activeDimensions.join(" / ")} 维度生成；未提供的模态不会被模型假设或补全。</p>
                    <div className="evidence-tags">
                      {activeDimensions.map((code) => <span key={code}>{expertNames[code]}已完成</span>)}
                    </div>
                  </div>
                  <button className="report-button" onClick={onResult}>
                    查看完整信任报告 <Arrow size={17} />
                  </button>
                </div>
                <button
                  className="appeal-button"
                  disabled={hasAppealed}
                  onClick={() => sendFollowup(appealPrompt)}
                >
                  {hasAppealed ? "已进入申诉辩论" : "申诉或辩解"}
                </button>
              </>
            )}
          </div>
        </div>

        {followups.map((followup, index) => {
          const isImageDetection = followup.question.includes("图片区域") || followup.question.includes("AI 修饰");
          const isAppealStart = followup.question === appealPrompt;
          const appealSelection = appealOptions.find((option) => option.label === followup.question);
          return (
            <div className="followup-thread" key={followup.id}>
              <div className="user-message followup-user-message">
                <div>
                  <p>{followup.question}</p>
                  {followup.detail && <small className="appeal-user-detail">我觉得这里没问题，因为：{followup.detail}</small>}
                  {followup.evidenceName && <small className="appeal-user-evidence">附件证据 · {followup.evidenceName}</small>}
                </div>
                <span className="avatar user-avatar">YZ</span>
              </div>
              <div className="agent-message followup-agent-message">
                <span className="agent-avatar"><Sparkle size={17} /></span>
                <div className="agent-content">
                  <div className="agent-name">
                    TruLens
                    <span>
                      {isAppealStart || appealSelection
                        ? "ARGUE · 结论复议"
                        : isImageDetection
                          ? "图像取证 Agent"
                          : `上下文推理 · 回合 ${index + 2}`}
                    </span>
                  </div>
                  {!followup.answered ? (
                    <div className={`agent-typing ${paused ? "paused" : ""}`}>
                      <span><i /><i /><i /></span>
                      {paused
                        ? "回答已暂停，点击顶部继续"
                        : isAppealStart
                          ? "正在建立申诉议题并召回复核专家"
                          : appealSelection
                            ? `正在将异议移交给${appealSelection.role} ${appealSelection.code}`
                            : "正在结合上一轮证据生成回答"}
                    </div>
                  ) : isAppealStart ? (
                    <div className="argue-entry">
                      <div className="argue-entry-head">
                        <span><Sparkle size={14} /> 已进入 ARGUE 辩论环节</span>
                        <small>原结论暂不变更</small>
                      </div>
                      <strong>收到。你不同意当前核验结果的哪一部分？</strong>
                      <p>请选择一项具体异议，TruLens 会将原始证据和评分依据交给对应专家重新审查。</p>
                      <div className="argue-options">
                        {appealOptions.map((option) => (
                          <div
                            className={`argue-option-card ${(selectedAppeal?.code ?? appealDraftCode) === option.code ? "selected" : ""}`}
                            key={option.code}
                          >
                            <button
                              disabled={Boolean(selectedAppeal)}
                              onClick={() => {
                                setAppealDraftCode(option.code);
                                setAppealExplanation("");
                                setAppealEvidenceName("");
                              }}
                            >
                              <span className={`report-dimension-badge badge-${option.code.toLowerCase()}`}>{option.code}</span>
                              <span><strong>{option.label}</strong><small>{option.role}重新核验</small></span>
                              <i aria-hidden="true">{appealDraftCode === option.code ? "⌄" : "→"}</i>
                            </button>
                            {appealDraftCode === option.code && !selectedAppeal && (
                              <div className="argue-appeal-input">
                                <label htmlFor={`appeal-${option.code}`}>补充你的判断依据 <small>选填</small></label>
                                <textarea
                                  id={`appeal-${option.code}`}
                                  onChange={(event) => setAppealExplanation(event.target.value)}
                                  placeholder="我觉得这里没问题，因为……"
                                  rows={3}
                                  value={appealExplanation}
                                />
                                <div className="argue-appeal-actions">
                                  <label className="argue-evidence-upload" title="上传图片或其他证据">
                                    <input
                                      accept="image/*,.pdf,.doc,.docx,.txt"
                                      onChange={(event) => setAppealEvidenceName(event.target.files?.[0]?.name ?? "")}
                                      type="file"
                                    />
                                    <Icon size={15}><path d="M12 16V4m0 0L8 8m4-4 4 4M5 14v5h14v-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></Icon>
                                    <span>{appealEvidenceName || "上传图片或其他证据"}</span>
                                  </label>
                                  <div>
                                    <button className="skip" onClick={submitAppeal}>跳过，不填写</button>
                                    <button onClick={submitAppeal}>{appealExplanation.trim() || appealEvidenceName ? "提交申诉材料" : "直接提交"} <Arrow size={14} /></button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : appealSelection ? (
                    <ArgueReviewFlow
                      evidenceName={followup.evidenceName ?? ""}
                      explanation={followup.detail ?? ""}
                      onArchive={onArchiveReport}
                      option={appealSelection}
                    />
                  ) : isImageDetection ? (
                    <>
                      <p>检测完成。我在主图中定位到 <strong>2 处疑似 AI 辅助修饰区域</strong>。它们更接近局部美化，而不是整张图片由 AI 生成。</p>
                      <div className="photo-detection-result">
                        <div className="detected-photo">
                          <img alt="照片 AI 修饰区域检测结果" src={postImage} />
                          <span className="detection-box zone-a"><i>A</i></span>
                          <span className="detection-box zone-b"><i>B</i></span>
                          <div className="detection-scanline" />
                          <small>IMAGE FORENSICS · FRAME 01</small>
                        </div>
                        <div className="detection-findings">
                          <div className="detection-score">
                            <span>图像真实性</span>
                            <strong>88<small>/100</small></strong>
                          </div>
                          <div className="finding-item">
                            <span>A</span>
                            <div>
                              <strong>面中与脸颊纹理</strong>
                              <p>局部毛孔纹理重复且过于均匀，疑似使用生成式皮肤细化。</p>
                            </div>
                            <em>78%</em>
                          </div>
                          <div className="finding-item">
                            <span>B</span>
                            <div>
                              <strong>唇周与下颌边缘</strong>
                              <p>边缘过渡异常平滑，但光影方向与原图保持一致。</p>
                            </div>
                            <em>64%</em>
                          </div>
                        </div>
                      </div>
                      <div className="detection-conclusion">
                        <span>结论</span>
                        <p>产品主体、背景和整体光影未发现生成痕迹。修饰主要集中在肤质优化，可能会让底妆遮瑕力看起来优于真实效果，建议参考自然光下的素人试妆。</p>
                      </div>
                    </>
                  ) : (
                    <ContextualFollowupAnswer question={followup.question} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="chat-end-anchor" ref={chatEndRef} />
      </div>
      <div className="chat-composer-wrap">
        {!isArgueFlow && (
          <div className="quick-followups">
            <span>{quickFollowups.length ? "继续追问" : "正在生成追问"}</span>
            <div>
              {quickFollowups.length ? quickFollowups.map((question) => (
                <button
                  className={quickPrompt === question ? "active" : ""}
                  key={question}
                  onClick={() => setQuickPrompt(question)}
                >
                  {question}
                </button>
              )) : <span className="quick-loading"><i /><i /><i /></span>}
            </div>
          </div>
        )}
        <Composer
          compact
          filename=""
          onFile={onFile}
          onPauseToggle={() => setPaused((current) => !current)}
          onSubmit={sendFollowup}
          pauseDisabled={!isGenerating}
          paused={paused}
          preset={quickPrompt}
        />
        <small>TruLens 可能会出错，请结合实际体验判断。</small>
      </div>
    </section>
  );
}

const dimensions = [
  { code: "T", title: "账号可信度", en: "Trustworthiness", score: 82, status: "可信", tone: "violet", text: "“贴贴银河”的公开身份、地域与美妆护肤定位一致，历史笔记长期围绕护肤产品展开；内容轨迹稳定，但产品推荐密度较高。", evidence: ["粉丝 3.5 万", "获赞与收藏 24.6 万", "历史内容垂直"] },
  { code: "R", title: "图像真实性", en: "Reality", score: 88, status: "轻度修饰", tone: "blue", text: "左右脸对比中的人物结构、拍摄角度和环境光线基本一致；右侧皮肤微纹理明显减少，存在局部磨皮或生成式细化信号。", evidence: ["人物结构一致", "右脸纹理减少", "未见整图生成"] },
  { code: "U", title: "评论真实性", en: "User Voice", score: 74, status: "需留意", tone: "peach", text: "评论样本中多条仅重复“兰蔻菁纯面霜”，存在同质化传播信号；同时保留干皮、滋润度和具体使用感等差异化反馈。", evidence: ["品牌词重复出现", "评论地域分散", "存在具体体验"] },
  { code: "S", title: "宣传安全性", en: "Safety", score: 91, status: "安全", tone: "green", text: "未使用绝对化功效承诺，色号、持妆与肤质描述均保留了个人体验边界。", evidence: ["无医疗功效宣称", "含个体差异说明", "合作标识清晰"] },
];

const archivedTasks = {
  makeup: {
    date: "今天",
    title: "秋冬奶油肌底妆分享",
    subtitle: "秋冬奶油肌底妆分享 · 多模态可信度报告",
    score: 84,
    status: "高可信",
    tone: "trusted",
    headline: "内容整体可信，图像存在轻度修饰痕迹。",
    summary: "账号身份与历史内容轨迹稳定，评论区保留真实体验反馈，文案表达边界清晰；右侧肤质细节存在局部优化，但未发现整图生成证据。",
    risks: [
      ["图像修饰", "右侧眼下与面中区域的微纹理明显减少", "低"],
      ["评论同质", "部分短评重复品牌名称，缺少具体体验", "中"],
      ["账号内容", "历史笔记长期垂直于美妆护肤领域", "低"],
    ],
    dimensions,
    decision: "这篇内容可以作为底妆效果参考，但局部肤质可能经过优化。建议结合自然光原图和其他真实用户的持妆反馈作出购买决定。",
  },
  serum: {
    date: "2025.06.17",
    title: "热门精华测评合集",
    subtitle: "12 款热门精华横向测评 · 多模态可信度报告",
    score: 58,
    status: "存在风险",
    tone: "warning",
    headline: "部分结论可信，评论与功效表达存在异常。",
    summary: "账号本身具有稳定运营记录，但测评中的排序逻辑缺少统一标准；部分评论存在协同传播特征，三项功效结论未提供可追溯依据。",
    risks: [
      ["评论协同", "27 个账号在 18 分钟内发布高度相似的推荐话术", "高"],
      ["测评标准", "不同产品使用了不同观察周期，横向排名依据不足", "中"],
      ["功效表达", "“修护翻倍”等结论未标注数据来源", "中"],
    ],
    dimensions: [
      { code: "T", title: "账号可信度", en: "Trustworthiness", score: 68, status: "一般", tone: "violet", text: "账号持续运营 1.8 年，但近 30 天商业合作密度明显上升。", evidence: ["历史发布 174 篇", "商业内容占比 42%", "近期合作集中"] },
      { code: "R", title: "图像真实性", en: "Reality", score: 81, status: "较真实", tone: "blue", text: "产品包装与质地图片未发现明显生成痕迹，部分对比图曝光不一致。", evidence: ["主体边缘自然", "两组曝光差异", "无整图生成"] },
      { code: "U", title: "评论真实性", en: "User Voice", score: 42, status: "高风险", tone: "peach", text: "评论区存在集中发布与重复句式，真实体验反馈被营销话术稀释。", evidence: ["相似评论 31%", "27 个关联账号", "发布时间集中"] },
      { code: "S", title: "宣传安全性", en: "Safety", score: 47, status: "需核验", tone: "green", text: "多处功效对比缺乏统一条件，部分结论超出个人体验表达边界。", evidence: ["3 项无来源结论", "对比标准不统一", "合作标识存在"] },
    ],
    decision: "暂缓将该合集作为主要决策依据。建议寻找采用统一测试周期、披露合作关系，并能提供原始观察记录的独立测评进行交叉验证。",
  },
  whitening: {
    date: "2025.06.15",
    title: "七天美白挑战",
    subtitle: "短周期功效挑战 · 多模态可信度报告",
    score: 39,
    status: "疑似营销",
    tone: "danger",
    headline: "内容具有明显营销结构，关键效果证据不足。",
    summary: "账号、评论和文案同时出现营销信号。前后对比图拍摄条件不一致，“七天显著变白”的核心结论缺少可验证记录，不足以支持内容主张。",
    risks: [
      ["视觉对比", "前后图片的白平衡、曝光与拍摄角度均不一致", "高"],
      ["时间证据", "未提供连续七天的原始记录或可验证时间信息", "高"],
      ["传播结构", "核心口号在多个关联账号中同步出现", "高"],
    ],
    dimensions: [
      { code: "T", title: "账号可信度", en: "Trustworthiness", score: 55, status: "需留意", tone: "violet", text: "账号存在真实历史内容，但挑战发布前后集中出现同品牌合作。", evidence: ["运营 11 个月", "合作发布集中", "关联账号 8 个"] },
      { code: "R", title: "图像真实性", en: "Reality", score: 43, status: "条件异常", tone: "blue", text: "对比图未发现整图生成，但曝光和白平衡差异足以改变视觉结果。", evidence: ["曝光差异 +18%", "白平衡不一致", "拍摄角度变化"] },
      { code: "U", title: "评论真实性", en: "User Voice", score: 38, status: "低可信", tone: "peach", text: "大量评论重复挑战口号，缺少具体使用过程与差异化体验。", evidence: ["重复话术 36%", "短时集中发布", "体验细节不足"] },
      { code: "S", title: "宣传安全性", en: "Safety", score: 22, status: "高风险", tone: "green", text: "短周期确定性功效表达缺乏依据，并使用明显的结果导向措辞。", evidence: ["绝对化表达 4 处", "无证据来源", "缺少差异说明"] },
    ],
    decision: "不建议根据该帖子作出购买决定。核心主张缺少可追溯证据，且三个模态的风险信号相互强化，应等待独立来源或更完整记录。",
  },
};

const archivedConversations = {
  makeup: {
    prompt: "请帮我鉴别这篇“秋冬奶油肌底妆分享”是否可信，重点检查账号、图片和评论区。",
    acknowledgement: "收到。我已完成账号历史、左右脸肤质对比、评论区原文和宣传文案的多模态核验，并保留了生成报告时使用的证据。",
    followups: [
      ["图片里哪些地方可能经过修饰？", "右侧眼下与面中区域的毛孔和微纹理明显少于左侧，但人物结构、拍摄角度与主光方向保持一致，更接近局部磨皮或生成式细化，而不是整图生成。"],
      ["评论区整体可信吗？", "评论中有多条仅重复“兰蔻菁纯面霜”，存在同质化传播信号；同时也包含干皮适配、滋润度和具体使用感等差异化反馈，因此整体仍可参考，但需要保留风险提示。"],
    ],
  },
  serum: {
    prompt: "帮我核验这篇 12 款热门精华横向测评，重点看排名依据和评论真实性。",
    acknowledgement: "收到。我会对账号历史、测评图片、评论传播结构和功效文案进行交叉核验，并检查不同产品是否使用了统一测评标准。",
    followups: [
      ["这些产品的测评标准一致吗？", "不完全一致。部分产品观察 7 天，部分产品观察 28 天，肤质、用量和搭配产品也没有统一，因此现有横向排名不能直接比较。"],
      ["评论区有没有协同传播？", "有明显信号。27 个账号在 18 分钟内发布高度相似的推荐话术，且多个账号缺少其他真实互动记录。"],
    ],
  },
  whitening: {
    prompt: "这篇“七天美白挑战”可信吗？请检查前后对比图和功效宣传。",
    acknowledgement: "收到。我会核验账号合作记录、前后图片条件、评论区传播结构，以及“七天显著变白”等核心功效主张。",
    followups: [
      ["前后对比图的问题在哪里？", "两组图片的曝光、白平衡和拍摄角度均不一致。即使没有整图生成，这些条件差异也足以让后图看起来更亮。"],
      ["“七天显著变白”有依据吗？", "当前内容没有提供连续七天的原始记录、统一光线下的测量结果或可追溯数据，因此不足以支持确定性功效结论。"],
    ],
  },
};

function ArchivedConversation({
  onHome,
  onResult,
  task,
}: {
  onHome: () => void;
  onResult: () => void;
  task: RecentTask;
}) {
  const data = archivedTasks[task];
  const conversation = archivedConversations[task];
  return (
    <section className="chat archived-chat">
      <header className="chat-header">
        <div className="chat-header-main">
          <button aria-label="返回首页" className="chat-home-button" onClick={onHome} title="返回首页">
            <Icon size={22}><path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></Icon>
          </button>
          <div className="chat-header-title"><strong>{data.title}</strong><small>{data.date} · 历史对话记录</small></div>
        </div>
      </header>

      <div className="chat-scroll">
        <div className="user-message">
          <div><p>{conversation.prompt}</p></div>
          <span className="avatar user-avatar">YZ</span>
        </div>
        <div className="agent-message">
          <span className="agent-avatar"><Sparkle size={17} /></span>
          <div className="agent-content">
            <div className="agent-name">TruLens <span>多模态鉴别 Agent</span></div>
            <p>{conversation.acknowledgement}</p>
            <div className="archive-analysis-summary">
              <span className="archive-chat-score">{data.score}<small>/100</small></span>
              <div><strong>{data.headline}</strong><p>{data.summary}</p></div>
              <button className="report-button" onClick={onResult}>查看核验报告 <Arrow size={17} /></button>
            </div>
          </div>
        </div>

        {conversation.followups.map(([question, answer], index) => (
          <div className="followup-thread" key={question}>
            <div className="user-message followup-user-message">
              <div><p>{question}</p></div>
              <span className="avatar user-avatar">YZ</span>
            </div>
            <div className="agent-message followup-agent-message">
              <span className="agent-avatar"><Sparkle size={17} /></span>
              <div className="agent-content">
                <div className="agent-name">TruLens <span>上下文推理 · 回合 {index + 2}</span></div>
                <p>{answer}</p>
              </div>
            </div>
          </div>
        ))}
        <p className="archive-chat-end">历史对话已结束 · 报告保留生成时的证据与结论</p>
      </div>
    </section>
  );
}

type UnifiedReportDimension = {
  code: string;
  title: string;
  en: string;
  score: number;
  status: string;
  tone: string;
  text: string;
  evidence: string[];
};

function ReportEvidenceModal({
  code,
  dimension,
  onClose,
}: {
  code: DimensionCode;
  dimension: UnifiedReportDimension;
  onClose: () => void;
}) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const modalTitle = {
    T: "账号可信度证据链",
    R: "图像真实性证据链",
    U: "评论区真实性证据链",
    S: "文案真实性证据链",
  }[code];

  return (
    <div
      aria-label={modalTitle}
      aria-modal="true"
      className={`report-evidence-backdrop evidence-${code.toLowerCase()}`}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
      role="dialog"
    >
      <article className="report-evidence-modal">
        <header className="report-evidence-header">
          <div>
            <span className={`report-dimension-badge badge-${code.toLowerCase()}`}>{code}</span>
            <div>
              <small>EVIDENCE CHAIN · 可解释评分依据</small>
              <strong>{modalTitle}</strong>
            </div>
          </div>
          <div className="evidence-modal-score">
            <span>维度评分</span>
            <strong>{(dimension.score / 10).toFixed(1)}</strong>
          </div>
          <button aria-label="关闭证据链" className="evidence-modal-close" onClick={onClose}>
            <Icon size={18}><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></Icon>
          </button>
        </header>

        <div className="evidence-chain-summary">
          <span>结论</span>
          <p>{dimension.text}</p>
          <div>{dimension.evidence.map((item) => <small key={item}>{item}</small>)}</div>
        </div>

        {code === "T" && (
          <div className="account-evidence-layout">
            <div className="evidence-source-pair">
              <figure>
                <img alt="贴贴银河账号主页原始材料" src="/evidence/account-profile.jpg" />
                <figcaption>图 1 · 账号主页与公开资料</figcaption>
              </figure>
              <figure>
                <img alt="贴贴银河历史美妆护肤笔记原始材料" src="/evidence/account-history.jpg" />
                <figcaption>图 2 · 历史笔记内容抽样</figcaption>
              </figure>
            </div>
            <div className="evidence-document account-evidence-document">
              <div className="evidence-document-head">
                <span className="evidence-profile-avatar">贴</span>
                <div><strong>贴贴银河</strong><small>小红书号 601047506 · IP 广东</small></div>
                <em>账号材料 2 份</em>
              </div>
              <div className="account-metrics">
                <span><strong>1264</strong>关注</span>
                <span><strong>3.5 万</strong>粉丝</span>
                <span><strong>24.6 万</strong>获赞与收藏</span>
              </div>
              <section>
                <small>账号简介</small>
                <p>“分享宝藏 美妆护肤”｜广东广州｜公开商务邮箱。<mark>关注账号数量较高，需结合互动关系排除互关增长</mark>。</p>
              </section>
              <section>
                <small>历史动态文本抽样</small>
                <p><b>05-15</b> 人间灭火器！理肤泉你是真的卷啊 <em>♡ 464</em></p>
                <p><b>2 天前</b> <mark>天天扛着高压赶方案，全靠这瓶告别斑味儿</mark> <em>♡ 410</em></p>
                <p><b>09-22</b> 扒一扒最近疯狂回购的冬季精华油 <em>♡ 452</em></p>
                <p><b>09-21</b> 眼周纹路丛生 / 松弛的“救星”来了！ <em>♡ 426</em></p>
              </section>
              <footer><span>身份信息完整</span><span>内容垂直稳定</span><span className="attention">产品推荐密度较高</span></footer>
            </div>
          </div>
        )}

        {code === "R" && (
          <div className="image-evidence-layout">
            <div className="report-forensic-image">
              <img alt="同一人物左右脸肤质对比原始材料" src="/evidence/skin-comparison.jpg" />
              <span className="forensic-anchor anchor-one">①</span>
              <span className="forensic-anchor anchor-two">②</span>
              <small>图 3 · 左右脸肤质对比原图</small>
            </div>
            <div className="forensic-findings">
              <span>锚点检测</span>
              <div><b>①</b><p><strong>左侧原始肤质区域</strong><small>毛孔、色素点与细小起伏分布自然，保留随机高频纹理，可作为真实皮肤基准。</small></p><em>基准</em></div>
              <div><b>②</b><p><strong>右侧眼下与面中区域</strong><small>微纹理和毛孔明显减少，表面平滑度显著高于左侧，符合局部磨皮或生成式细化特征。</small></p><em>72%</em></div>
              <p>两侧五官结构、镜头角度和主光方向基本一致，未见拼接错位或整图生成；当前风险集中在右侧肤质呈现被优化。</p>
            </div>
          </div>
        )}

        {code === "U" && (
          <div className="comment-evidence-layout">
            <div className="comment-source-stack">
              <figure><img alt="评论区原始材料上半部分" src="/evidence/comments-1.jpg" /><figcaption>图 4 · 评论原文</figcaption></figure>
              <figure><img alt="评论区原始材料下半部分" src="/evidence/comments-2.jpg" /><figcaption>图 5 · 评论原文</figcaption></figure>
            </div>
            <div className="evidence-document comment-evidence-document">
              <div className="comment-analysis-head"><span>评论区原文抽样</span><small>可见样本 12 条 · 重复品牌短句 5 条</small></div>
              <div className="report-comment similar"><i>A</i><p><strong>A000美礼联钛业**小黄</strong><mark>全新兰蔻菁纯面霜</mark></p><time>广东</time></div>
              <div className="report-comment"><i>猫</i><p><strong>媛喵喵喵的</strong>无限回购！</p><time>湖北</time></div>
              <div className="report-comment similar"><i>浪</i><p><strong>你浪不够还是爱自由</strong><mark>兰蔻菁纯面霜</mark></p><time>山西</time></div>
              <div className="report-comment"><i>橙</i><p><strong>HE BEAUTY 橙子</strong>真的很好用，很适合干皮</p><time>广东</time></div>
              <div className="report-comment similar"><i>梦</i><p><strong>梦想当富婆</strong><mark>兰蔻菁纯面霜</mark></p><time>江苏</time></div>
              <div className="report-comment similar"><i>薯</i><p><strong>小红薯 65BF70B1</strong><mark>兰蔻菁纯面霜</mark></p><time>天津</time></div>
              <div className="report-comment similar"><i>苏</i><p><strong>苏苏</strong><mark>兰蔻菁纯面霜</mark></p><time>山东</time></div>
              <div className="report-comment"><i>停</i><p><strong>一种停留</strong>轻盈还是滋润</p><time>辽宁</time></div>
              <div className="report-comment detailed"><i>薯</i><p><strong>小红薯 674049C7</strong>更喜欢 CPB 金致乳霜，脸看起来更饱满，细纹也淡了一些。</p><time>福建</time></div>
              <footer><span className="comment-swatch" />浅粉色标记重复品牌短句 <b>同质化明显 · 但存在真实差异反馈</b></footer>
            </div>
          </div>
        )}

        {code === "S" && (
          <div className="evidence-document copy-evidence-document">
            <div className="evidence-document-head copy-source-head">
              <div><small>帖子原文</small><strong>秋冬奶油肌底妆分享</strong></div>
              <em>语义主张检测</em>
            </div>
            <p>
              最近换季皮肤有点干，试了这套底妆。妆前薄涂，粉底少量叠加，在我脸上大约能维持 8 小时。<mark>像开了原生柔焦一样，毛孔直接隐形</mark>，但鼻翼到下午还是会有一点卡粉。色号是按我自己的肤色选的，<mark className="claim">所有肤质都能放心入</mark>。本篇含品牌合作，具体效果会因肤质和上妆方式不同。
            </p>
            <div className="copy-annotations">
              <span><b>01</b><p><strong>视觉夸张表达</strong><small>“毛孔直接隐形”不可作为确定性效果承诺。</small></p></span>
              <span><b>02</b><p><strong>泛化适用范围</strong><small>“所有肤质”缺少测试范围与客观依据。</small></p></span>
            </div>
            <footer><span>已披露品牌合作</span><span>保留个体体验边界</span><span className="attention">2 处表述需留意</span></footer>
          </div>
        )}

        <footer className="evidence-modal-footer">
          <p><span /> 原始信号 <i /> 模型检测 <em /> 评分结论</p>
          <button onClick={onClose}>返回报告</button>
        </footer>
      </article>
    </div>
  );
}

function UnifiedReportTemplate({
  decision,
  dimensions: availableDimensions,
  onContinue,
  continueLabel,
  score,
  status,
  subtitle,
  title,
  tone,
}: {
  decision: string;
  dimensions: UnifiedReportDimension[];
  onContinue: () => void;
  continueLabel: string;
  score: number;
  status: string;
  subtitle: string;
  title: string;
  tone: string;
}) {
  const [openEvidence, setOpenEvidence] = useState<DimensionCode | null>(null);
  const orderedCodes = ["T", "R", "U", "S"];
  const dimensionMap = new Map(availableDimensions.map((dimension) => [dimension.code, dimension]));
  const radarCoordinates = orderedCodes.map((code, index) => {
    const dimension = dimensionMap.get(code);
    const radius = dimension ? dimension.score * 0.9 : 0;
    if (index === 0) return [120, 110 - radius];
    if (index === 1) return [120 + radius, 110];
    if (index === 2) return [120, 110 + radius];
    return [120 - radius, 110];
  });
  return (
    <div className="unified-report-page">
      <article className={`unified-report-card ${tone}`}>
        <header>
          <div><strong>TruLens 核验报告</strong><small>{title} · 同一个 Agent 汇总四个维度</small></div>
          <span>AI 生成报告</span>
        </header>

        <div className="unified-score-row">
          <div className="unified-score">
            <span>Trust Score</span>
            <strong>{score}<small>/ 100</small></strong>
          </div>
          <span className="unified-verdict">{status}</span>
        </div>

        <div className="unified-risk-band">
          <div><i style={{ left: `${score}%` }} /></div>
          <span>高风险</span><span>可信</span>
        </div>

        <div className="unified-dimensions">
          <div className="unified-radar">
            <svg aria-label="T R U S 四维核验分布" viewBox="0 0 240 220">
              {[0.25, 0.5, 0.75, 1].map((scale) => {
                const radius = 90 * scale;
                return <polygon className="radar-grid" key={scale} points={`120,${110 - radius} ${120 + radius},110 120,${110 + radius} ${120 - radius},110`} />;
              })}
              <line x1="120" x2="120" y1="20" y2="200" />
              <line x1="30" x2="210" y1="110" y2="110" />
              <polygon className="unified-radar-data" points={radarCoordinates.map(([x, y]) => `${x},${y}`).join(" ")} />
              {[
                ["T", 120, 20, 120, 10],
                ["R", 210, 110, 226, 114],
                ["U", 120, 200, 120, 217],
                ["S", 30, 110, 14, 114],
              ].map(([code, x, y, tx, ty]) => (
                <g className={dimensionMap.has(String(code)) ? "" : "missing"} key={code}>
                  <circle cx={x} cy={y} r="10" />
                  <text textAnchor="middle" x={tx} y={ty}>{code}</text>
                </g>
              ))}
              {radarCoordinates.map(([x, y], index) => dimensionMap.has(orderedCodes[index]) && <circle className="unified-radar-point" cx={x} cy={y} key={orderedCodes[index]} r="4" />)}
            </svg>
            <small>四维核验分布</small>
          </div>

          <div className="unified-dimension-list">
            {orderedCodes.map((code) => {
              const dimension = dimensionMap.get(code);
              return (
                <button
                  aria-label={dimension ? `查看${dimension.title}评分证据链` : `${code} 维度数据不足`}
                  className={`unified-dimension-row ${dimension ? "" : "missing"}`}
                  disabled={!dimension}
                  key={code}
                  onClick={() => dimension && setOpenEvidence(code as DimensionCode)}
                >
                  <span className={`report-dimension-badge badge-${code.toLowerCase()}`}>{code}</span>
                  <div>
                    <span>
                      <strong>{dimension?.title ?? { T: "账号可信度", R: "图片真实性", U: "评论区真实性", S: "文案真实性" }[code as DimensionCode]}</strong>
                      <b>{dimension ? <>{(dimension.score / 10).toFixed(1)} <i aria-hidden="true">↗</i></> : "数据不足"}</b>
                    </span>
                    <div><i style={{ width: dimension ? `${dimension.score}%` : "0%" }} /></div>
                    <small>{dimension?.text ?? "尚未提供该维度所需材料，未参与评分。"}</small>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <section className="unified-advice">
          <span>TruLens 决策支持</span>
          <h3>{subtitle}</h3>
          <p>{decision}</p>
          <button onClick={onContinue}>{continueLabel} <Arrow size={17} /></button>
        </section>
      </article>
      <p className="method-note">本报告由 TruLens 根据当前可用信号生成；未提供的模态不参与判断，AI 结论不构成医疗或购买建议。</p>
      {openEvidence && dimensionMap.get(openEvidence) && (
        <ReportEvidenceModal
          code={openEvidence}
          dimension={dimensionMap.get(openEvidence)!}
          onClose={() => setOpenEvidence(null)}
        />
      )}
    </div>
  );
}

function ArchivedResult({
  task,
  onBack,
}: {
  task: Exclude<RecentTask, "makeup">;
  onBack: () => void;
}) {
  const data = archivedTasks[task];
  return (
    <section className="result archive-result">
      <header className="result-header">
        <button aria-label="返回新鉴别" className="back-button" onClick={onBack} title="返回新鉴别">
          <Icon size={22}><path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></Icon>
        </button>
        <div className="result-actions">
          <button onClick={() => window.print()}>
            <Icon size={17}><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></Icon>
            导出 PDF
          </button>
        </div>
      </header>
      <UnifiedReportTemplate
        continueLabel="开始新的鉴别"
        decision={data.decision}
        dimensions={data.dimensions}
        onContinue={onBack}
        score={data.score}
        status={data.status}
        subtitle={data.headline}
        title={data.title}
        tone={data.tone}
      />
    </section>
  );
}

function Result({
  onBack,
  activeDimensions,
}: {
  onBack: () => void;
  activeDimensions: DimensionCode[];
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const reportDimensions = dimensions.filter((item) => activeDimensions.includes(item.code as DimensionCode));
  const reportScore = Math.round(reportDimensions.reduce((total, item) => total + item.score, 0) / reportDimensions.length);
  const dimensionName = ["", "单维", "双维", "三维", "四维"][reportDimensions.length];
  const reportHeadline = activeDimensions.includes("R")
    ? "图片主体可信，存在轻度 AI 修饰。"
    : activeDimensions.includes("U")
      ? "评论整体自然，少量话术需留意。"
      : activeDimensions.includes("T")
        ? "账号轨迹稳定，长期行为可信。"
        : "文案表达安全，未见高风险宣称。";
  return (
    <section className="result">
      <header className="result-header">
        <button aria-label="返回对话" className="back-button" onClick={onBack} title="返回对话">
          <Icon size={22}><path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></Icon>
        </button>
        <div className="result-actions">
          <button onClick={() => window.print()}>
            <Icon size={17}><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></Icon>
            导出 PDF
          </button>
          <div className="share-wrap">
            <button onClick={() => setShareOpen((open) => !open)}>
              <Icon size={17}><circle cx="18" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="6" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="18" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" /><path d="m8 11 8-5M8 13l8 5" stroke="currentColor" strokeWidth="1.5" /></Icon>
              分享
            </button>
            {shareOpen && <ShareMenu onClose={() => setShareOpen(false)} />}
          </div>
        </div>
      </header>
      <UnifiedReportTemplate
        continueLabel="向 Agent 继续追问"
        decision={activeDimensions.length < 4
          ? "当前输入不足以完成四维交叉验证。建议补充账号主页、原始图片或评论区，以获得更完整的可信度判断。"
          : "当前四种信号已完成交叉验证，报告可以作为内容可信度与消费决策之间的参考依据。"}
        dimensions={reportDimensions}
        onContinue={onBack}
        score={reportScore}
        status={reportScore >= 80 ? "高可信" : "需留意"}
        subtitle={reportHeadline}
        title={activeDimensions.includes("R") ? "当前美妆种草内容" : `${dimensionName}内容核验`}
        tone={reportScore >= 80 ? "trusted" : "warning"}
      />
    </section>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(() =>
    new URLSearchParams(window.location.search).get("report") === "true" ? "result" : "home",
  );
  const [filename, setFilename] = useState("");
  const [prompt, setPrompt] = useState("请帮我鉴别这篇美妆种草帖子是否由 AI 造假");
  const [activeTask, setActiveTask] = useState<RecentTask>("makeup");
  const [activeDimensions, setActiveDimensions] = useState<DimensionCode[]>(allDimensions);
  const [exampleSubmission, setExampleSubmission] = useState(false);
  const [historyCleared, setHistoryCleared] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewingHistory, setViewingHistory] = useState(false);
  const [archivedScore, setArchivedScore] = useState<number | null>(() => {
    const saved = window.localStorage.getItem("trulens-archived-score");
    return saved ? Number(saved) : null;
  });

  const start = () => {
    setActiveTask("makeup");
    setExampleSubmission(false);
    setViewingHistory(false);
    setScreen("workspace");
  };
  const submit = (newPrompt: string, submittedFilename = filename, isExample = false) => {
    setActiveTask("makeup");
    setViewingHistory(false);
    setFilename(submittedFilename);
    setExampleSubmission(isExample);
    setActiveDimensions(inferDimensions(newPrompt, submittedFilename));
    setPrompt(newPrompt);
    setScreen("chat");
  };

  if (screen === "home") {
    return (
      <Home
        onStart={start}
        onSubmit={(newPrompt, submittedFilename, isExample) => submit(newPrompt, submittedFilename, isExample)}
      />
    );
  }

  return (
    <main className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        active={screen}
        activeTask={activeTask}
        archivedScore={archivedScore}
        collapsed={sidebarCollapsed}
        historyCleared={historyCleared}
        onLogout={() => {
          setFilename("");
          setScreen("home");
        }}
        onNew={() => {
          setFilename("");
          setExampleSubmission(false);
          setActiveTask("makeup");
          setActiveDimensions(allDimensions);
          setViewingHistory(false);
          setScreen("workspace");
        }}
        onResetAgent={() => {
          setFilename("");
          setExampleSubmission(false);
          setPrompt("请帮我鉴别这篇美妆种草帖子是否由 AI 造假");
          setActiveTask("makeup");
          setActiveDimensions(allDimensions);
          setHistoryCleared(true);
          setViewingHistory(false);
          setArchivedScore(null);
          window.localStorage.removeItem("trulens-archived-score");
          setScreen("workspace");
        }}
        onReport={(task) => {
          setActiveTask(task);
          setViewingHistory(true);
          if (task === "makeup") setActiveDimensions(allDimensions);
          setScreen("result");
        }}
        onTask={(task) => {
          setActiveTask(task);
          setViewingHistory(true);
          if (task === "makeup") setActiveDimensions(allDimensions);
          setScreen("chat");
        }}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      {screen === "workspace" && <Workspace filename={filename} onFile={setFilename} onHome={() => setScreen("home")} onSubmit={submit} />}
      {screen === "chat" && activeTask === "makeup" && !viewingHistory && (
        <Chat
          activeDimensions={activeDimensions}
          filename={filename}
          isExampleSubmission={exampleSubmission}
          onArchiveReport={(score) => {
            setArchivedScore(score);
            setHistoryCleared(false);
            window.localStorage.setItem("trulens-archived-score", String(score));
          }}
          onFile={setFilename}
          onHome={() => setScreen("home")}
          onResult={() => {
            setActiveTask("makeup");
            setScreen("result");
          }}
          prompt={prompt}
        />
      )}
      {screen === "chat" && viewingHistory && (
        <ArchivedConversation
          onHome={() => {
            setViewingHistory(false);
            setScreen("workspace");
          }}
          onResult={() => setScreen("result")}
          task={activeTask}
        />
      )}
      {screen === "result" && activeTask === "makeup" && <Result activeDimensions={activeDimensions} onBack={() => setScreen("chat")} />}
      {screen === "result" && activeTask !== "makeup" && (
        <ArchivedResult task={activeTask} onBack={() => setScreen("chat")} />
      )}
    </main>
  );
}
