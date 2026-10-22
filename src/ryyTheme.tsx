import { loadFont } from "@remotion/fonts";
import { interpolate, staticFile, useCurrentFrame } from "remotion";

// Bộ nhận diện dùng chung cho các overlay của Ryy TV (talkshow, starting soon...).

// Font có dấu tiếng Việt lưu sẵn trong public/fonts, không cần mạng.
// Mali: chữ tròn dễ thương cho nội dung. Pacifico: chữ viết tay cho tên kênh.
export const BODY_FONT = '"Mali", sans-serif';
export const TITLE_FONT = '"Pacifico", cursive';
loadFont({ family: "Mali", url: staticFile("fonts/mali/Mali-SemiBold.ttf"), weight: "600" });
loadFont({ family: "Mali", url: staticFile("fonts/mali/Mali-Bold.ttf"), weight: "700" });
loadFont({ family: "Pacifico", url: staticFile("fonts/pacifico/Pacifico-Regular.ttf") });

// Bảng màu chung của Ryy TV: hồng pastel + tím nhạt.
export const PINK = "#ff9cc8";
export const LILAC = "#c9a8ff";
export const CREAM = "#fff5fa";
export const TEXT = "#8a2f63";

export const SOCIALS = [
  { app: "TikTok", handle: "@ryyfc.legit", icon: "🎵" },
  { app: "YouTube", handle: "@RyyRauRam", icon: "▶️" },
  { app: "Facebook", handle: "Ryy TV", icon: "📘" },
];

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

export type Box = { x: number; y: number; w: number; h: number };

// Viền gradient hồng tím, xoay chậm một vòng mỗi 10 giây.
export const Frame: React.FC<{ box: Box; id: string; angle: number }> = ({
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

export const Bow: React.FC<{ x: number; y: number; scale: number; rotate: number }> = ({
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

export const Panel: React.FC<{ box: Box; children: React.ReactNode }> = ({
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

export const Pill: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({
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
      fontWeight: 700,
      whiteSpace: "nowrap",
      textShadow: "0 2px 4px rgba(138,47,99,0.4)",
      boxShadow: "0 6px 14px rgba(138,47,99,0.3)",
    }}
  >
    {children}
  </div>
);
