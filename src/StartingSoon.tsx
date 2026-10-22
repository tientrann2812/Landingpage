import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  BODY_FONT,
  Bow,
  Frame,
  LILAC,
  PINK,
  Panel,
  Pill,
  TEXT,
  TITLE_FONT,
  useSocialSlide,
} from "./ryyTheme";

// Màn hình chờ "Starting soon" 1920x1080, có nền (dùng toàn màn hình trước khi live).
// Lặp 10 giây (300 frame) liền mạch như overlay talkshow.
const CARD = { x: 360, y: 170, w: 1200, h: 580 };

// Các đốm sáng mờ trôi chậm trên nền.
const BLOBS = [
  { x: 300, y: 250, r: 360, color: PINK, phase: 0 },
  { x: 1600, y: 300, r: 420, color: LILAC, phase: 0.33 },
  { x: 960, y: 950, r: 480, color: "#ff7eb6", phase: 0.66 },
];

// Tim và sao bay lên khắp màn hình; tốc độ nguyên vòng mỗi 10 giây để lặp mượt.
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: 60 + ((i * 337) % 1800),
  speed: 1 + (i % 2),
  offset: (i * 0.137) % 1,
  char: ["♡", "✦", "✧", "♡"][i % 4],
  size: 22 + ((i * 7) % 18),
}));

const SPARKLES = [
  { x: CARD.x + 20, y: CARD.y + CARD.h - 10, delay: 0 },
  { x: CARD.x + CARD.w - 30, y: CARD.y + 30, delay: 0.25 },
  { x: 200, y: 820, delay: 0.5 },
  { x: 1720, y: 760, delay: 0.75 },
];

export const StartingSoon: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  const angle = t * 360;
  const wobble = Math.sin(t * Math.PI * 4) * 6;
  const heartBeat = 1 + 0.08 * Math.max(0, Math.sin(t * Math.PI * 20));
  const float = Math.sin(t * Math.PI * 2) * 8;
  const { social, slide, fade } = useSocialSlide();

  // Dấu "..." tăng dần 1 → 3 chấm, đổi mỗi 0.5 giây.
  const dots = (Math.floor(frame / 15) % 3) + 1;
  // Trái tim chạy qua lại trên thanh "loading".
  const barPos = (1 - Math.cos(t * Math.PI * 4)) / 2;

  return (
    <AbsoluteFill
      style={{
        fontFamily: BODY_FONT,
        background:
          "linear-gradient(160deg, #2a1640 0%, #46205e 55%, #6e2669 100%)",
        overflow: "hidden",
      }}
    >
      {BLOBS.map((b, i) => {
        const k = (t + b.phase) * Math.PI * 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x + Math.cos(k) * 60 - b.r,
              top: b.y + Math.sin(k) * 40 - b.r,
              width: b.r * 2,
              height: b.r * 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
              opacity: 0.35,
            }}
          />
        );
      })}

      {PARTICLES.map((p, i) => {
        const progress = (t * p.speed + p.offset) % 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: interpolate(progress, [0, 1], [1100, -60]),
              transform: `translateX(${Math.sin((progress + i) * Math.PI * 4) * 10}px)`,
              fontSize: p.size,
              color: i % 2 === 0 ? PINK : LILAC,
              opacity: interpolate(progress, [0, 0.1, 0.85, 1], [0, 0.8, 0.8, 0]),
              textShadow: "0 0 8px #fff",
            }}
          >
            {p.char}
          </div>
        );
      })}

      <div style={{ position: "absolute", inset: 0, transform: `translateY(${float}px)` }}>
        <Panel box={CARD}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: TEXT,
            }}
          >
            <div
              style={{
                marginTop: 14,
                fontFamily: TITLE_FONT,
                fontSize: 150,
                lineHeight: 1.45,
                textShadow: `5px 5px 0 #fff, 9px 9px 0 ${PINK}`,
              }}
            >
              Ryy TV
            </div>
            <div
              style={{
                marginTop: 34,
                fontSize: 88,
                fontWeight: 700,
                letterSpacing: 4,
                background: `linear-gradient(90deg, ${PINK}, ${LILAC}, ${PINK})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: "drop-shadow(0 3px 0 #fff)",
              }}
            >
              starting soon
              <span style={{ display: "inline-block", width: 90, textAlign: "left" }}>
                {".".repeat(dots)}
              </span>
            </div>
            <div style={{ position: "relative", width: 640, height: 44, marginTop: 14 }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 14,
                  height: 16,
                  borderRadius: 8,
                  background: "#fff",
                  border: `3px dashed ${PINK}`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: barPos * (640 - 44),
                  fontSize: 38,
                  lineHeight: "44px",
                  transform: `scale(${heartBeat})`,
                }}
              >
                💖
              </div>
            </div>
            <div style={{ fontSize: 38, fontWeight: 600, marginTop: 14 }}>
              Ryy lên sóng liền nè, chờ xíu nha ♡
            </div>
          </div>
        </Panel>
        <Frame box={CARD} id="cardGrad" angle={angle} />
        <Bow x={CARD.x + 40} y={CARD.y + 20} scale={1.3} rotate={-18 + wobble} />
        <Pill x={CARD.x + CARD.w - 220} y={CARD.y}>
          <span style={{ display: "inline-block", transform: `scale(${heartBeat})` }}>●</span>{" "}
          LIVE SẮP BẮT ĐẦU
        </Pill>
      </div>

      <div
        style={{
          position: "absolute",
          left: 960 - 330,
          top: 830,
          width: 660,
          height: 110,
          borderRadius: 999,
          background: "#fff",
          border: `5px solid ${PINK}`,
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            transform: `translateY(${slide}px)`,
            opacity: fade,
          }}
        >
          <span style={{ fontSize: 50 }}>{social.icon}</span>
          <span style={{ fontSize: 30, fontWeight: 600, color: "#b07cd9" }}>
            {social.app}
          </span>
          <span style={{ fontSize: 44, fontWeight: 700, color: TEXT }}>
            {social.handle}
          </span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 962,
          textAlign: "center",
          fontSize: 30,
          fontWeight: 600,
          color: "#fff",
          opacity: 0.85,
        }}
      >
        Gõ !donate để support Ryy phát triển kênh{" "}
        <span style={{ display: "inline-block", transform: `scale(${heartBeat})` }}>💖</span>
      </div>

      {SPARKLES.map((s, i) => {
        const phase = (t * 2 + s.delay) % 1;
        const k = Math.sin(phase * Math.PI);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              transform: `translate(-50%, -50%) scale(${0.4 + k * 0.9}) rotate(${phase * 90}deg)`,
              opacity: k,
              fontSize: 48,
              color: "#fff",
              textShadow: `0 0 10px ${PINK}, 0 0 20px ${LILAC}`,
            }}
          >
            ✦
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
