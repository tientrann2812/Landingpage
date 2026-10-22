import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { useSocialSlide } from "./ryyTheme";

// Màn hình chờ "Starting soon" phong cách gaming neon, 1920x1080, có nền.
// Lặp 10 giây (300 frame) liền mạch: mọi chuyển động có chu kỳ chia hết cho 300.

// Bungee: chữ khối dày cho tên kênh. Chakra Petch: chữ công nghệ góc cạnh.
// Cả hai đều có dấu tiếng Việt.
const DISPLAY_FONT = '"Bungee", sans-serif';
const TECH_FONT = '"Chakra Petch", sans-serif';
loadFont({ family: "Bungee", url: staticFile("fonts/bungee/Bungee-Regular.ttf") });
loadFont({ family: "Chakra Petch", url: staticFile("fonts/chakrapetch/ChakraPetch-SemiBold.ttf"), weight: "600" });
loadFont({ family: "Chakra Petch", url: staticFile("fonts/chakrapetch/ChakraPetch-Bold.ttf"), weight: "700" });
loadFont({
  family: "Chakra Petch",
  url: staticFile("fonts/chakrapetch/ChakraPetch-BoldItalic.ttf"),
  weight: "700",
  style: "italic",
});

const NEON_PINK = "#ff2e97";
const NEON_PURPLE = "#9d4dff";
const NEON_CYAN = "#22e4ff";
const BG = "#0a0614";

// Glitch xảy ra trong các khoảng frame này (mỗi vòng 10 giây).
const GLITCH_WINDOWS = [
  [58, 66],
  [148, 152],
  [232, 242],
];

const isGlitching = (frame: number) =>
  GLITCH_WINDOWS.some(([a, b]) => frame >= a && frame < b);

// Sàn lưới synthwave chạy về phía người xem.
const GridFloor: React.FC<{ t: number }> = ({ t }) => {
  const cell = 90;
  const offset = (t * 4 * cell) % cell; // 4 ô mỗi vòng → lặp mượt
  return (
    <div
      style={{
        position: "absolute",
        left: -960,
        right: -960,
        top: 690,
        height: 900,
        transform: "perspective(500px) rotateX(62deg)",
        transformOrigin: "50% 0%",
        backgroundImage: `linear-gradient(${NEON_PINK} 2px, transparent 2px),
          linear-gradient(90deg, ${NEON_PURPLE} 2px, transparent 2px)`,
        backgroundSize: `${cell}px ${cell}px`,
        backgroundPosition: `0px ${offset}px`,
        opacity: 0.55,
        maskImage: "linear-gradient(to bottom, transparent 0%, #000 35%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 35%)",
      }}
    />
  );
};

// Mặt trời neon sọc ngang ở đường chân trời.
const NeonSun: React.FC<{ t: number }> = ({ t }) => {
  const stripeShift = (t * 3 * 28) % 28;
  return (
    <div
      style={{
        position: "absolute",
        left: 960 - 330,
        top: 690 - 330,
        width: 660,
        height: 660,
        borderRadius: "50%",
        background: `linear-gradient(180deg, #ffd23f 0%, ${NEON_PINK} 55%, ${NEON_PURPLE} 100%)`,
        boxShadow: `0 0 80px ${NEON_PINK}, 0 0 160px ${NEON_PURPLE}`,
        WebkitMaskImage: `repeating-linear-gradient(to bottom, #000 ${stripeShift}px, #000 ${stripeShift + 18}px, transparent ${stripeShift + 18}px, transparent ${stripeShift + 28}px)`,
        clipPath: "inset(0 0 50% 0)",
        opacity: 0.85,
      }}
    />
  );
};

// Góc khung HUD kiểu game.
const HudCorner: React.FC<{ x: number; y: number; flipX?: boolean; flipY?: boolean }> = ({
  x,
  y,
  flipX,
  flipY,
}) => (
  <svg
    width={120}
    height={120}
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
      filter: `drop-shadow(0 0 6px ${NEON_CYAN})`,
    }}
  >
    <path d="M4 116 L4 24 L24 4 L116 4" fill="none" stroke={NEON_CYAN} strokeWidth={5} />
    <path d="M18 116 L18 32 L32 18 L60 18" fill="none" stroke={NEON_PINK} strokeWidth={3} />
    <rect x={70} y={14} width={10} height={8} fill={NEON_PINK} />
    <rect x={86} y={14} width={10} height={8} fill={NEON_PINK} opacity={0.6} />
    <rect x={102} y={14} width={10} height={8} fill={NEON_PINK} opacity={0.3} />
  </svg>
);

// Chữ có hiệu ứng tách màu hồng / xanh, khi glitch thì bị cắt lệch từng lát.
const GlitchText: React.FC<{
  text: string;
  frame: number;
  style: React.CSSProperties;
}> = ({ text, frame, style }) => {
  const glitch = isGlitching(frame);
  const split = glitch ? 10 : 3 + Math.sin((frame / 300) * Math.PI * 6) * 1.5;
  const slices = glitch ? 5 : 0;
  return (
    <div style={{ position: "relative", ...style }}>
      <div style={{ position: "absolute", inset: 0, color: NEON_CYAN, transform: `translate(${-split}px, 0)`, opacity: 0.85, mixBlendMode: "screen" }}>
        {text}
      </div>
      <div style={{ position: "absolute", inset: 0, color: NEON_PINK, transform: `translate(${split}px, 0)`, opacity: 0.85, mixBlendMode: "screen" }}>
        {text}
      </div>
      <div style={{ position: "relative", color: "#fff" }}>{text}</div>
      {Array.from({ length: slices }, (_, i) => {
        const top = random(`top-${frame}-${i}`) * 90;
        const h = 4 + random(`h-${frame}-${i}`) * 12;
        const dx = (random(`dx-${frame}-${i}`) - 0.5) * 80;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              color: i % 2 ? NEON_CYAN : "#fff",
              clipPath: `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`,
              transform: `translateX(${dx}px)`,
              background: BG,
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};

// Tia sáng nhỏ bay lên (hình vuông xoay), vị trí cố định theo seed.
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: random(`px-${i}`) * 1920,
  speed: 1 + Math.floor(random(`ps-${i}`) * 2),
  offset: random(`po-${i}`),
  size: 4 + random(`sz-${i}`) * 8,
  color: [NEON_PINK, NEON_CYAN, NEON_PURPLE][i % 3],
}));

export const StartingSoon: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  const glitch = isGlitching(frame);
  const { social, slide, fade } = useSocialSlide();

  // Thanh loading chạy 0 → 100% trong 9 giây rồi nhấp nháy "READY" ở giây cuối.
  const progress = interpolate(frame, [0, 270], [0, 1], { extrapolateRight: "clamp" });
  const segments = 24;
  const lit = Math.floor(progress * segments);
  const ready = frame >= 270;
  const blink = Math.floor(frame / 6) % 2 === 0;
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin(t * Math.PI * 10));

  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden", fontFamily: TECH_FONT }}>
      {/* Bầu trời gradient tím */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 60%, #3a1060 0%, #1a0a30 45%, ${BG} 80%)`,
        }}
      />
      <NeonSun t={t} />
      {/* Đường chân trời phát sáng */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 688,
          height: 4,
          background: NEON_PINK,
          boxShadow: `0 0 20px ${NEON_PINK}, 0 0 60px ${NEON_PINK}`,
        }}
      />
      <GridFloor t={t} />

      {PARTICLES.map((p, i) => {
        const prog = (t * p.speed + p.offset) % 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: interpolate(prog, [0, 1], [1100, -40]),
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              transform: `rotate(${prog * 360}deg)`,
              opacity: interpolate(prog, [0, 0.1, 0.8, 1], [0, 0.9, 0.9, 0]),
            }}
          />
        );
      })}

      {/* Bảng chữ chính, nền kính tối cắt góc */}
      <div
        style={{
          position: "absolute",
          left: 960 - 680,
          top: 150,
          width: 1360,
          height: 520,
          background: "linear-gradient(135deg, rgba(20,8,40,0.82), rgba(40,10,60,0.7))",
          clipPath: "polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)",
          border: `2px solid ${NEON_PURPLE}`,
          boxShadow: `inset 0 0 60px rgba(157,77,255,0.35)`,
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <polygon
          points="320,150 1640,150 1640,630 1600,670 280,670 280,190"
          fill="none"
          stroke={NEON_PINK}
          strokeWidth={4}
          style={{ filter: `drop-shadow(0 0 8px ${NEON_PINK})` }}
          strokeDasharray="1400 200"
          strokeDashoffset={-t * 3200}
        />
      </svg>

      {/* Nhãn LIVE nhấp nháy */}
      <div
        style={{
          position: "absolute",
          left: 320,
          top: 128,
          padding: "4px 22px",
          background: NEON_PINK,
          color: "#fff",
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 4,
          clipPath: "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
          boxShadow: `0 0 20px ${NEON_PINK}`,
        }}
      >
        <span style={{ opacity: blink ? 1 : 0.3 }}>●</span> STREAM STARTING
      </div>

      <AbsoluteFill style={{ alignItems: "center" }}>
        <GlitchText
          text="RYY TV"
          frame={frame}
          style={{
            marginTop: 175,
            fontFamily: DISPLAY_FONT,
            fontSize: 190,
            lineHeight: 1.1,
            letterSpacing: 8,
            textShadow: `0 0 30px ${NEON_PINK}`,
          }}
        />
        <div
          style={{
            marginTop: 0,
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: 84,
            letterSpacing: 18,
            color: "transparent",
            WebkitTextStroke: `3px ${NEON_CYAN}`,
            textShadow: `0 0 18px ${NEON_CYAN}`,
            opacity: glitch ? 0.4 : 1,
            transform: glitch ? "translateX(12px) skewX(-8deg)" : "none",
          }}
        >
          STARTING SOON
        </div>

        {/* Thanh loading chia ô */}
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 26 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: segments }, (_, i) => {
              const on = ready ? blink : i < lit;
              const color = i < segments / 2 ? NEON_PINK : NEON_PURPLE;
              return (
                <div
                  key={i}
                  style={{
                    width: 26,
                    height: 26,
                    transform: "skewX(-20deg)",
                    background: on ? color : "rgba(255,255,255,0.08)",
                    boxShadow: on ? `0 0 12px ${color}` : "none",
                    border: `1px solid ${on ? color : "rgba(255,255,255,0.2)"}`,
                  }}
                />
              );
            })}
          </div>
          <div
            style={{
              width: 140,
              fontSize: 40,
              fontWeight: 700,
              color: NEON_CYAN,
              textShadow: `0 0 12px ${NEON_CYAN}`,
            }}
          >
            {ready ? "READY" : `${Math.floor(progress * 100)}%`}
          </div>
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 36,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: 2,
            opacity: 0.9,
          }}
        >
          Grab a snack, Ryy will be live in a moment!
        </div>
      </AbsoluteFill>

      {/* Ô mạng xã hội hình bình hành */}
      <div
        style={{
          position: "absolute",
          left: 960 - 360,
          top: 820,
          width: 720,
          height: 100,
          background: "rgba(10,6,20,0.85)",
          border: `3px solid ${NEON_CYAN}`,
          boxShadow: `0 0 20px rgba(34,228,255,0.5), inset 0 0 20px rgba(34,228,255,0.2)`,
          transform: "skewX(-14deg)",
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
            gap: 20,
            transform: `skewX(14deg) translateY(${slide}px)`,
            opacity: fade,
          }}
        >
          <span style={{ fontSize: 44 }}>{social.icon}</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: NEON_PINK, letterSpacing: 3 }}>
            {social.app.toUpperCase()}
          </span>
          <span style={{ fontSize: 46, fontWeight: 700, color: "#fff" }}>{social.handle}</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 948,
          textAlign: "center",
          fontSize: 30,
          fontWeight: 600,
          color: "#fff",
          letterSpacing: 1,
        }}
      >
        Type{" "}
        <span style={{ color: NEON_PINK, textShadow: `0 0 10px ${NEON_PINK}`, fontWeight: 700 }}>
          !donate
        </span>{" "}
        to support Ryy and help the channel grow
      </div>

      {/* HUD 4 góc + chữ kỹ thuật */}
      <HudCorner x={30} y={30} />
      <HudCorner x={1920 - 150} y={30} flipX />
      <HudCorner x={30} y={1080 - 150} flipY />
      <HudCorner x={1920 - 150} y={1080 - 150} flipX flipY />
      <div style={{ position: "absolute", left: 70, top: 160, color: NEON_CYAN, fontSize: 20, fontWeight: 600, letterSpacing: 2, lineHeight: 1.7, opacity: 0.8 }}>
        <div>SYS // ONLINE</div>
        <div>CAM // STANDBY</div>
        <div style={{ color: NEON_PINK, opacity: pulse }}>MIC // CHECK</div>
      </div>
      <div style={{ position: "absolute", right: 70, top: 160, textAlign: "right", color: NEON_CYAN, fontSize: 20, fontWeight: 600, letterSpacing: 2, lineHeight: 1.7, opacity: 0.8 }}>
        <div>CHANNEL // RYY TV</div>
        <div>MODE // GAMING</div>
        <div style={{ color: NEON_PINK }}>
          <span style={{ opacity: blink ? 1 : 0.2 }}>●</span> REC
        </div>
      </div>

      {/* Lớp scanline + viền tối cho cảm giác màn hình */}
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      {glitch && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(90deg, transparent, rgba(34,228,255,0.08), transparent)`,
            transform: `translateY(${(random(`g-${frame}`) - 0.5) * 400}px)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
