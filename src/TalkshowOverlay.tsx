import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { QrSwitcher } from "./DonateQR";
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

// Khung talkshow 1920x1080, nền trong suốt. Lặp 10 giây (300 frame) liền mạch,
// nên mọi chuyển động đều có chu kỳ chia hết cho 300 frame.
const CAM = { x: 48, y: 48, w: 1280, h: 720 };
const CHAT = { x: 1368, y: 48, w: 504, h: 720 };
const NAME = { x: 48, y: 812, w: 1280, h: 220 };
const DONATE = { x: 1368, y: 812, w: 504, h: 220 };

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
  { x: 1310, y: 760, delay: 0 },
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

  const { social, slide, fade } = useSocialSlide();

  const heartBeat = 1 + 0.08 * Math.max(0, Math.sin(t * Math.PI * 20));

  return (
    <AbsoluteFill style={{ fontFamily: BODY_FONT }}>
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
            top: -10,
            fontFamily: TITLE_FONT,
            fontSize: 84,
            lineHeight: 1.45,
            color: TEXT,
            textShadow: `4px 4px 0 #fff, 7px 7px 0 ${PINK}`,
          }}
        >
          Ryy TV
        </div>
        <div
          style={{
            position: "absolute",
            left: 54,
            top: 152,
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
              <div style={{ fontSize: 46, fontWeight: 700, color: TEXT }}>
                {social.handle}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 48,
            top: 170,
            width: 560,
            textAlign: "center",
            fontSize: 24,
            fontWeight: 600,
            color: TEXT,
            opacity: 0.75,
          }}
        >
          Gõ !lenh để xem các lệnh của bot
        </div>
      </Panel>

      <Panel box={DONATE}>
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 0,
            bottom: 0,
            width: 280,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            color: TEXT,
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          <div>
            Gõ{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${PINK}, ${LILAC})`,
                color: "#fff",
                borderRadius: 12,
                padding: "0 12px",
              }}
            >
              !donate
            </span>
          </div>
          <div>để support Ryy</div>
          <div>
            phát triển kênh{" "}
            <span style={{ display: "inline-block", transform: `scale(${heartBeat})` }}>💖</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 16,
            top: 14,
            width: 166,
            height: 180,
            padding: 6,
            boxSizing: "border-box",
            background: "#fff",
            borderRadius: 18,
            border: `3px dashed ${PINK}`,
          }}
        >
          <QrSwitcher width={148} height={162} />
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
        fontWeight: 700,
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
