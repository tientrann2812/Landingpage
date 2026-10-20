import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Font Baloo 2 (có dấu tiếng Việt) lưu sẵn trong public/fonts, không cần mạng.
const fontFamily = "Baloo 2";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Baloo2.ttf"),
  weight: "400 800",
});

// Khung talkshow 1920x1080, nền trong suốt. Lặp 10 giây (300 frame) liền mạch,
// nên mọi chuyển động đều có chu kỳ chia hết cho 300 frame.
const PINK = "#ff9cc8";
const LILAC = "#c9a8ff";
const CREAM = "#fff5fa";
const TEXT = "#8a2f63";

const CAM = { x: 48, y: 48, w: 1280, h: 720 };
const CHAT = { x: 1368, y: 48, w: 504, h: 720 };
const NAME = { x: 48, y: 812, w: 1280, h: 220 };
const TIP = { x: 1368, y: 812, w: 504, h: 220 };

const SOCIALS = [
  { app: "TikTok", handle: "@ryyfc.legit", icon: "🎵" },
  { app: "YouTube", handle: "@RyyRauRam", icon: "▶️" },
  { app: "Facebook", handle: "Ryy TV", icon: "📘" },
];

type Box = { x: number; y: number; w: number; h: number };

// Viền gradient hồng tím, xoay chậm một vòng mỗi 10 giây.
const Frame: React.FC<{ box: Box; id: string; angle: number }> = ({
  box,
  id,
  angle,
}) => (
  <svg
    style={{ position: "absolute", left: 0, top: 0 }}
    width={1920}
    height={1080}
  >
    <defs>
      <linearGradient
        id={id}
        gradientUnits="userSpaceOnUse"
        x1={box.x}
        y1={box.y}
        x2={box.x + box.w}
        y2={box.y + box.h}
        gradientTransform={`rotate(${angle} ${box.x + box.w / 2} ${box.y + box.h / 2})`}
      >
        <stop offset="0" stopColor={PINK} />
        <stop offset="0.5" stopColor={LILAC} />
        <stop offset="1" stopColor={PINK} />
      </linearGradient>
    </defs>
    <rect
      x={box.x}
      y={box.y}
      width={box.w}
      height={box.h}
      rx={36}
      fill="none"
      stroke="#ffffff"
      strokeWidth={22}
    />
    <rect
      x={box.x}
      y={box.y}
      width={box.w}
      height={box.h}
      rx={36}
      fill="none"
      stroke={`url(#${id})`}
      strokeWidth={14}
    />
    <rect
      x={box.x + 14}
      y={box.y + 14}
      width={box.w - 28}
      height={box.h - 28}
      rx={26}
      fill="none"
      stroke="#ffffff"
      strokeOpacity={0.7}
      strokeWidth={3}
      strokeDasharray="2 12"
      strokeLinecap="round"
    />
  </svg>
);

const Bow: React.FC<{ x: number; y: number; scale: number; rotate: number }> = ({
  x,
  y,
  scale,
  rotate,
}) => (
  <svg
    width={160}
    height={110}
    viewBox="0 0 160 110"
    style={{
      position: "absolute",
      left: x - 80,
      top: y - 55,
      transform: `scale(${scale}) rotate(${rotate}deg)`,
      filter: "drop-shadow(0 4px 6px rgba(138,47,99,0.35))",
    }}
  >
    <path d="M80 50 C50 10 8 14 12 50 C16 84 54 82 80 56 Z" fill={PINK} stroke="#fff" strokeWidth={5} />
    <path d="M80 50 C110 10 152 14 148 50 C144 84 106 82 80 56 Z" fill={PINK} stroke="#fff" strokeWidth={5} />
    <path d="M72 56 L52 104 L68 98 L76 108 Z" fill={LILAC} stroke="#fff" strokeWidth={4} />
    <path d="M88 56 L108 104 L92 98 L84 108 Z" fill={LILAC} stroke="#fff" strokeWidth={4} />
    <circle cx={80} cy={52} r={14} fill="#ff7eb6" stroke="#fff" strokeWidth={5} />
  </svg>
);

const Panel: React.FC<{ box: Box; children: React.ReactNode }> = ({
  box,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: box.x,
      top: box.y,
      width: box.w,
      height: box.h,
      borderRadius: 36,
      background: `linear-gradient(135deg, ${CREAM} 0%, #ffe3f1 60%, #efe3ff 100%)`,
      border: "6px solid #fff",
      boxShadow: `0 0 0 6px ${PINK}, 0 10px 24px rgba(138,47,99,0.3)`,
      boxSizing: "border-box",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

const Pill: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({
  x,
  y,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      padding: "6px 26px",
      borderRadius: 999,
      background: `linear-gradient(90deg, ${PINK}, ${LILAC})`,
      border: "5px solid #fff",
      color: "#fff",
      fontSize: 30,
      fontWeight: 800,
      whiteSpace: "nowrap",
      textShadow: "0 2px 4px rgba(138,47,99,0.4)",
      boxShadow: "0 6px 14px rgba(138,47,99,0.3)",
    }}
  >
    {children}
  </div>
);

// Tim và sao bay lên dọc các khe giữa khung. Tốc độ là số nguyên vòng mỗi 10 giây
// để lặp không bị giật.
const PARTICLES = [
  { x: 24, speed: 1, offset: 0.0, char: "♡", size: 30 },
  { x: 24, speed: 1, offset: 0.5, char: "✦", size: 22 },
  { x: 1348, speed: 1, offset: 0.2, char: "♡", size: 28 },
  { x: 1348, speed: 2, offset: 0.65, char: "✧", size: 24 },
  { x: 1896, speed: 1, offset: 0.35, char: "♡", size: 30 },
  { x: 1896, speed: 2, offset: 0.85, char: "✦", size: 22 },
];

const SPARKLES = [
  { x: 1300, y: 60, delay: 0 },
  { x: 70, y: 760, delay: 0.33 },
  { x: 1860, y: 790, delay: 0.66 },
  { x: 1380, y: 36, delay: 0.5 },
];

export const TalkshowOverlay: React.FC<{ preview?: boolean }> = ({
  preview = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames; // 0..1 trong một vòng lặp
  const angle = t * 360;
  const wobble = Math.sin(t * Math.PI * 4) * 6;

  // Mỗi mạng xã hội hiện 100 frame, trượt lên khi đổi.
  const slot = 100;
  const socialIndex = Math.floor(frame / slot) % SOCIALS.length;
  const inSlot = frame % slot;
  const slide = interpolate(inSlot, [0, 12, slot - 12, slot], [40, 0, 0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade = interpolate(inSlot, [0, 12, slot - 12, slot], [0, 1, 1, 0]);
  const social = SOCIALS[socialIndex];

  const heartBeat = 1 + 0.08 * Math.max(0, Math.sin(t * Math.PI * 20));

  return (
    <AbsoluteFill style={{ fontFamily: `"${fontFamily}", sans-serif` }}>
      {preview && <PreviewBackground />}

      <Frame box={CAM} id="camGrad" angle={angle} />
      <Frame box={CHAT} id="chatGrad" angle={-angle} />

      <Bow x={CAM.x + 40} y={CAM.y + 20} scale={1} rotate={-18 + wobble} />
      <Pill x={CAM.x + CAM.w - 200} y={CAM.y}>
        <span style={{ color: "#fff", transform: `scale(${heartBeat})`, display: "inline-block" }}>
          ●
        </span>{" "}
        ON AIR ♡ TALKSHOW
      </Pill>
      <Pill x={CHAT.x + CHAT.w / 2} y={CHAT.y}>
        💬 chat với Ryy
      </Pill>

      <Panel box={NAME}>
        <div
          style={{
            position: "absolute",
            left: 48,
            top: 22,
            fontSize: 104,
            fontWeight: 800,
            lineHeight: 1.1,
            color: TEXT,
            letterSpacing: 2,
            textShadow: `4px 4px 0 #fff, 7px 7px 0 ${PINK}`,
          }}
        >
          Ryy TV
        </div>
        <div
          style={{
            position: "absolute",
            left: 54,
            top: 140,
            fontSize: 34,
            fontWeight: 600,
            color: TEXT,
            opacity: 0.85,
          }}
        >
          ♡ tâm sự cùng Ryy ♡
        </div>

        <div
          style={{
            position: "absolute",
            right: 48,
            top: 50,
            width: 560,
            height: 116,
            borderRadius: 28,
            background: "#fff",
            border: `4px dashed ${PINK}`,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              gap: 20,
              paddingLeft: 28,
              transform: `translateY(${slide}px)`,
              opacity: fade,
            }}
          >
            <span style={{ fontSize: 56 }}>{social.icon}</span>
            <div style={{ lineHeight: 1.05 }}>
              <div style={{ fontSize: 28, fontWeight: 600, color: "#b07cd9" }}>
                {social.app}
              </div>
              <div style={{ fontSize: 46, fontWeight: 800, color: TEXT }}>
                {social.handle}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel box={TIP}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: TEXT,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 800 }}>
            Gõ{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${PINK}, ${LILAC})`,
                color: "#fff",
                borderRadius: 14,
                padding: "0 14px",
              }}
            >
              !donate
            </span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, marginTop: 4 }}>
            để support Ryy{" "}
            <span style={{ display: "inline-block", transform: `scale(${heartBeat})` }}>💖</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 6, opacity: 0.7 }}>
            !lenh để xem các lệnh
          </div>
        </div>
      </Panel>

      {PARTICLES.map((p, i) => {
        const progress = (t * p.speed + p.offset) % 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: interpolate(progress, [0, 1], [1080, -40]),
              transform: `translateX(-50%) translateX(${Math.sin((progress + i) * Math.PI * 4) * 6}px)`,
              fontSize: p.size,
              color: i % 2 === 0 ? PINK : LILAC,
              opacity: interpolate(progress, [0, 0.1, 0.85, 1], [0, 1, 1, 0]),
              textShadow: "0 0 6px #fff",
            }}
          >
            {p.char}
          </div>
        );
      })}

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
              transform: `translate(-50%, -50%) scale(${0.4 + k * 0.8}) rotate(${phase * 90}deg)`,
              opacity: k,
              fontSize: 40,
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

// Chỉ dùng để xem thử: giả lập webcam và khung chat phía sau overlay.
const PreviewBackground: React.FC = () => (
  <AbsoluteFill style={{ background: "#2a2233" }}>
    <div
      style={{
        position: "absolute",
        left: CAM.x,
        top: CAM.y,
        width: CAM.w,
        height: CAM.h,
        borderRadius: 36,
        background: "linear-gradient(135deg, #4b3b5c, #2f2a3d)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.35)",
        fontSize: 64,
        fontWeight: 800,
      }}
    >
      WEBCAM
    </div>
    <div
      style={{
        position: "absolute",
        left: CHAT.x + 30,
        top: CHAT.y + 60,
        width: CHAT.w - 60,
        color: "rgba(255,255,255,0.75)",
        fontSize: 26,
        lineHeight: 1.6,
      }}
    >
      {["minh: hello Ryy 👋", "lan: nay talk gì đó", "Nightbot: 👋 Chào lan nha", "tuan: !donate"].map(
        (line) => (
          <div key={line}>{line}</div>
        ),
      )}
    </div>
  </AbsoluteFill>
);
