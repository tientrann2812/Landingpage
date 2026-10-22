import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";

// Bộ nhận diện chung của Ryy TV: phong cách gaming neon (hồng / tím / xanh cyan).
// Dùng cho StartingSoon, StreamEnding, TalkshowOverlay. Mọi chuyển động lặp
// trong 300 frame (10 giây) để video nối vòng liền mạch.

// Bungee: chữ khối dày cho tên kênh. Chakra Petch: chữ công nghệ góc cạnh.
// Cả hai đều có dấu tiếng Việt và lưu sẵn trong public/fonts, không cần mạng.
export const DISPLAY_FONT = '"Bungee", sans-serif';
export const TECH_FONT = '"Chakra Petch", sans-serif';
loadFont({ family: "Bungee", url: staticFile("fonts/bungee/Bungee-Regular.ttf") });
loadFont({ family: "Chakra Petch", url: staticFile("fonts/chakrapetch/ChakraPetch-SemiBold.ttf"), weight: "600" });
loadFont({ family: "Chakra Petch", url: staticFile("fonts/chakrapetch/ChakraPetch-Bold.ttf"), weight: "700" });
loadFont({
  family: "Chakra Petch",
  url: staticFile("fonts/chakrapetch/ChakraPetch-BoldItalic.ttf"),
  weight: "700",
  style: "italic",
});

export const NEON_PINK = "#ff2e97";
export const NEON_PURPLE = "#9d4dff";
export const NEON_CYAN = "#22e4ff";
export const BG = "#0a0614";
export const GLASS = "linear-gradient(135deg, rgba(20,8,40,0.85), rgba(40,10,60,0.75))";

export const SOCIALS = [
  { app: "TikTok", handle: "@ryyfc.legit", icon: "🎵" },
  { app: "YouTube", handle: "@RyyRauRam", icon: "▶️" },
  { app: "Facebook", handle: "Ryy TV", icon: "📘" },
];

export type Box = { x: number; y: number; w: number; h: number };

// Mỗi mạng xã hội hiện 100 frame (3 cái = 10 giây), trượt lên khi đổi.
export const useSocialSlide = () => {
  const frame = useCurrentFrame();
  const slot = 100;
  const inSlot = frame % slot;
  return {
    social: SOCIALS[Math.floor(frame / slot) % SOCIALS.length],
    slide: interpolate(inSlot, [0, 12, slot - 12, slot], [40, 0, 0, -40]),
    fade: interpolate(inSlot, [0, 12, slot - 12, slot], [0, 1, 1, 0]),
  };
};

// Glitch xảy ra trong các khoảng frame này (mỗi vòng 10 giây).
const GLITCH_WINDOWS = [
  [58, 66],
  [148, 152],
  [232, 242],
];

export const isGlitching = (frame: number) =>
  GLITCH_WINDOWS.some(([a, b]) => frame >= a && frame < b);

// Đèn nhấp nháy dùng cho chấm LIVE / REC.
export const useBlink = () => Math.floor(useCurrentFrame() / 6) % 2 === 0;

// Chữ có hiệu ứng tách màu hồng / xanh, khi glitch thì bị cắt lệch từng lát.
// sliceBg là màu nền đằng sau chữ, để các lát cắt che đúng chữ gốc.
export const GlitchText: React.FC<{
  text: string;
  style: React.CSSProperties;
  sliceBg?: string;
}> = ({ text, style, sliceBg = BG }) => {
  const frame = useCurrentFrame();
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
              background: sliceBg,
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};

// Chữ viền neon rỗng ruột (STARTING SOON, THANKS FOR WATCHING...).
export const OutlineText: React.FC<{ text: string; style?: React.CSSProperties }> = ({
  text,
  style,
}) => {
  const glitch = isGlitching(useCurrentFrame());
  return (
    <div
      style={{
        fontWeight: 700,
        fontStyle: "italic",
        fontSize: 84,
        letterSpacing: 18,
        color: "transparent",
        WebkitTextStroke: `3px ${NEON_CYAN}`,
        textShadow: `0 0 18px ${NEON_CYAN}`,
        opacity: glitch ? 0.4 : 1,
        transform: glitch ? "translateX(12px) skewX(-8deg)" : "none",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Nhãn hồng hình bình hành, có chấm nhấp nháy.
export const NeonTag: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  color?: string;
  dot?: boolean;
}> = ({ x, y, children, color = NEON_PINK, dot = true }) => {
  const blink = useBlink();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "4px 24px",
        background: color,
        color: "#fff",
        fontFamily: TECH_FONT,
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: 4,
        whiteSpace: "nowrap",
        clipPath: "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
        boxShadow: `0 0 20px ${color}`,
      }}
    >
      {dot && <span style={{ opacity: blink ? 1 : 0.3 }}>● </span>}
      {children}
    </div>
  );
};

// Khung cắt góc: nền kính tối (tùy chọn) + viền hồng chạy vòng + viền cyan mảnh bên trong.
export const NeonFrame: React.FC<{
  box: Box;
  cut?: number;
  fill?: string;
  speed?: number;
}> = ({ box, cut = 40, fill, speed = 1 }) => {
  const t = useCurrentFrame() / 300;
  const { x, y, w, h } = box;
  const outline = (inset: number) => {
    const c = Math.max(0, cut - inset * 0.6);
    const [l, r, tp, b] = [x + inset, x + w - inset, y + inset, y + h - inset];
    return `${l + c},${tp} ${r},${tp} ${r},${b - c} ${r - c},${b} ${l},${b} ${l},${tp + c}`;
  };
  const perimeter = 2 * (w + h);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {fill && <polygon points={outline(0)} fill={fill} />}
      <polygon
        points={outline(0)}
        fill="none"
        stroke={NEON_PURPLE}
        strokeWidth={2}
        opacity={0.8}
      />
      <polygon
        points={outline(0)}
        fill="none"
        stroke={NEON_PINK}
        strokeWidth={5}
        style={{ filter: `drop-shadow(0 0 8px ${NEON_PINK})` }}
        strokeDasharray={`${perimeter * 0.42} ${perimeter * 0.08}`}
        strokeDashoffset={-t * perimeter * speed}
      />
      <polygon
        points={outline(12)}
        fill="none"
        stroke={NEON_CYAN}
        strokeWidth={1.5}
        opacity={0.6}
        strokeDasharray="2 10"
      />
    </svg>
  );
};

// Góc khung HUD kiểu game.
export const HudCorner: React.FC<{
  x: number;
  y: number;
  flipX?: boolean;
  flipY?: boolean;
  size?: number;
}> = ({ x, y, flipX, flipY, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
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

// 4 góc HUD ở mép màn hình.
export const HudCorners: React.FC = () => (
  <>
    <HudCorner x={30} y={30} />
    <HudCorner x={1920 - 150} y={30} flipX />
    <HudCorner x={30} y={1080 - 150} flipY />
    <HudCorner x={1920 - 150} y={1080 - 150} flipX flipY />
  </>
);

// Cột chữ kỹ thuật ở mép (SYS // ONLINE ...). Dòng có highlight hiện màu hồng.
export const HudText: React.FC<{
  lines: { text: React.ReactNode; highlight?: boolean }[];
  side: "left" | "right";
  top?: number;
}> = ({ lines, side, top = 160 }) => (
  <div
    style={{
      position: "absolute",
      [side]: 70,
      top,
      textAlign: side,
      color: NEON_CYAN,
      fontFamily: TECH_FONT,
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: 2,
      lineHeight: 1.7,
      opacity: 0.8,
    }}
  >
    {lines.map((l, i) => (
      <div key={i} style={l.highlight ? { color: NEON_PINK } : undefined}>
        {l.text}
      </div>
    ))}
  </div>
);

// Ô mạng xã hội hình bình hành, đổi lần lượt TikTok / YouTube / Facebook.
export const SocialTicker: React.FC<{ box: Box; skew?: number }> = ({ box, skew = 14 }) => {
  const { social, slide, fade } = useSocialSlide();
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        background: "rgba(10,6,20,0.85)",
        border: `3px solid ${NEON_CYAN}`,
        boxShadow: `0 0 20px rgba(34,228,255,0.5), inset 0 0 20px rgba(34,228,255,0.2)`,
        transform: `skewX(-${skew}deg)`,
        overflow: "hidden",
        boxSizing: "border-box",
        fontFamily: TECH_FONT,
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
          transform: `skewX(${skew}deg) translateY(${slide}px)`,
          opacity: fade,
        }}
      >
        <span style={{ fontSize: box.h * 0.44 }}>{social.icon}</span>
        <span style={{ fontSize: box.h * 0.28, fontWeight: 700, color: NEON_PINK, letterSpacing: 3 }}>
          {social.app.toUpperCase()}
        </span>
        <span style={{ fontSize: box.h * 0.46, fontWeight: 700, color: "#fff" }}>{social.handle}</span>
      </div>
    </div>
  );
};

// Hạt sáng vuông bay lên. xs: các vị trí x được phép (để chỉ bay ở khe trống).
export const Particles: React.FC<{ count: number; xs?: number[] }> = ({ count, xs }) => {
  const t = useCurrentFrame() / 300;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x = xs ? xs[i % xs.length] + (random(`jx-${i}`) - 0.5) * 16 : random(`px-${i}`) * 1920;
        const speed = 1 + Math.floor(random(`ps-${i}`) * 2);
        const prog = (t * speed + random(`po-${i}`)) % 1;
        const size = 4 + random(`sz-${i}`) * 8;
        const color = [NEON_PINK, NEON_CYAN, NEON_PURPLE][i % 3];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: interpolate(prog, [0, 1], [1100, -40]),
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 10px ${color}`,
              transform: `rotate(${prog * 360}deg)`,
              opacity: interpolate(prog, [0, 0.1, 0.8, 1], [0, 0.9, 0.9, 0]),
            }}
          />
        );
      })}
    </>
  );
};

// Phông nền synthwave: bầu trời tím, mặt trời neon sọc, đường chân trời, sàn lưới chạy.
export const SynthwaveBackdrop: React.FC<{ horizon?: number }> = ({ horizon = 690 }) => {
  const t = useCurrentFrame() / 300;
  const cell = 90;
  const gridOffset = (t * 4 * cell) % cell; // 4 ô mỗi vòng → lặp mượt
  const stripeShift = (t * 3 * 28) % 28;
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 60%, #3a1060 0%, #1a0a30 45%, ${BG} 80%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 960 - 330,
          top: horizon - 330,
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
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: horizon - 2,
          height: 4,
          background: NEON_PINK,
          boxShadow: `0 0 20px ${NEON_PINK}, 0 0 60px ${NEON_PINK}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -960,
          right: -960,
          top: horizon,
          height: 900,
          transform: "perspective(500px) rotateX(62deg)",
          transformOrigin: "50% 0%",
          backgroundImage: `linear-gradient(${NEON_PINK} 2px, transparent 2px),
            linear-gradient(90deg, ${NEON_PURPLE} 2px, transparent 2px)`,
          backgroundSize: `${cell}px ${cell}px`,
          backgroundPosition: `0px ${gridOffset}px`,
          opacity: 0.55,
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 35%)",
        }}
      />
    </>
  );
};

// Lớp sọc scanline + viền tối + vệt glitch, phủ lên trên cùng màn hình.
export const ScreenFx: React.FC<{ vignette?: boolean }> = ({ vignette = true }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)",
        }}
      />
      {vignette && (
        <AbsoluteFill
          style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%)" }}
        />
      )}
      {isGlitching(frame) && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(90deg, transparent, rgba(34,228,255,0.08), transparent)",
            transform: `translateY(${(random(`g-${frame}`) - 0.5) * 400}px)`,
          }}
        />
      )}
    </>
  );
};

// Thanh chia ô kiểu game. value: 0..1. flash: nhấp nháy toàn bộ (READY / OFFLINE).
export const SegmentBar: React.FC<{ value: number; label: string; flash?: boolean }> = ({
  value,
  label,
  flash,
}) => {
  const blink = useBlink();
  const segments = 24;
  const lit = Math.floor(value * segments);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: segments }, (_, i) => {
          const on = flash ? blink : i < lit;
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
          minWidth: 140,
          fontSize: 40,
          fontWeight: 700,
          color: NEON_CYAN,
          textShadow: `0 0 12px ${NEON_CYAN}`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// Màn hình toàn cảnh dùng chung cho Starting Soon / Stream Ending:
// phông synthwave + bảng kính giữa + nhãn + tên kênh + mạng xã hội + HUD.
export const NeonScene: React.FC<{
  tag: string;
  headline: string;
  hudLeft: { text: React.ReactNode; highlight?: boolean }[];
  hudRight: { text: React.ReactNode; highlight?: boolean }[];
  footer: React.ReactNode;
  children: React.ReactNode;
}> = ({ tag, headline, hudLeft, hudRight, footer, children }) => {
  const PANEL = { x: 280, y: 150, w: 1360, h: 520 };
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden", fontFamily: TECH_FONT }}>
      <SynthwaveBackdrop />
      <Particles count={28} />
      <NeonFrame box={PANEL} fill="rgba(20,8,40,0.78)" />
      <NeonTag x={PANEL.x + 40} y={PANEL.y - 22}>
        {tag}
      </NeonTag>

      <AbsoluteFill style={{ alignItems: "center" }}>
        <GlitchText
          text="RYY TV"
          sliceBg="#160a2a"
          style={{
            marginTop: 175,
            fontFamily: DISPLAY_FONT,
            fontSize: 190,
            lineHeight: 1.1,
            letterSpacing: 8,
            textShadow: `0 0 30px ${NEON_PINK}`,
          }}
        />
        {/* Câu dài (THANKS FOR WATCHING) thu nhỏ lại cho vừa khung */}
        <OutlineText
          text={headline}
          style={headline.length > 14 ? { fontSize: 66, letterSpacing: 12, margin: "12px 0" } : undefined}
        />
        {children}
      </AbsoluteFill>

      <SocialTicker box={{ x: 960 - 360, y: 820, w: 720, h: 100 }} />
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
        {footer}
      </div>

      <HudCorners />
      <HudText side="left" lines={hudLeft} />
      <HudText side="right" lines={hudRight} />
      <ScreenFx />
    </AbsoluteFill>
  );
};

// Chữ hồng phát sáng để nhấn mạnh lệnh chat (!donate, !lenh).
export const Cmd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: NEON_PINK, textShadow: `0 0 10px ${NEON_PINK}`, fontWeight: 700 }}>
    {children}
  </span>
);
