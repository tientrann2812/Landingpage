import { AbsoluteFill } from "remotion";

import { QrSwitcher } from "./DonateQR";
import {
  Cmd,
  DISPLAY_FONT,
  GlitchText,
  NEON_CYAN,
  NEON_PINK,
  NeonFrame,
  NeonTag,
  Particles,
  SocialTicker,
  TECH_FONT,
  useBlink,
} from "./ryyTheme";

// Khung talkshow 1920x1080, nền trong suốt, cùng phong cách gaming neon với
// StartingSoon / StreamEnding. Lặp 10 giây (300 frame) liền mạch.
const CAM = { x: 48, y: 48, w: 1280, h: 720 };
const CHAT = { x: 1368, y: 48, w: 504, h: 720 };
const NAME = { x: 48, y: 812, w: 1280, h: 220 };
const DONATE = { x: 1368, y: 812, w: 504, h: 220 };

const PANEL_FILL = "rgba(16,6,32,0.88)";

export const TalkshowOverlay: React.FC<{ preview?: boolean }> = ({
  preview = false,
}) => {
  const blink = useBlink();

  return (
    <AbsoluteFill style={{ fontFamily: TECH_FONT }}>
      {preview && <PreviewBackground />}

      {/* Hạt sáng chỉ bay ở các khe giữa khung, không che webcam */}
      <Particles count={9} xs={[24, 1348, 1896]} />

      <NeonFrame box={CAM} />
      <div
        style={{
          position: "absolute",
          left: CAM.x + 36,
          top: CAM.y + 30,
          color: NEON_CYAN,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: 3,
          textShadow: "0 0 6px rgba(0,0,0,0.8)",
        }}
      >
        CAM 01 // <span style={{ color: NEON_PINK, opacity: blink ? 1 : 0.3 }}>●</span> LIVE
      </div>
      <NeonTag x={CAM.x + CAM.w - 400} y={CAM.y - 22}>
        ON AIR // TALKSHOW
      </NeonTag>

      <NeonFrame box={CHAT} cut={30} fill="rgba(10,6,20,0.55)" speed={-1} />
      <NeonTag x={CHAT.x + 40} y={CHAT.y - 22} color="#0fa9c4" dot={false}>
        💬 LIVE CHAT
      </NeonTag>

      <NeonFrame box={NAME} cut={36} fill={PANEL_FILL} />
      <GlitchText
        text="RYY TV"
        sliceBg="#120626"
        style={{
          position: "absolute",
          left: NAME.x + 50,
          top: NAME.y + 22,
          fontFamily: DISPLAY_FONT,
          fontSize: 104,
          lineHeight: 1.15,
          letterSpacing: 6,
          textShadow: `0 0 24px ${NEON_PINK}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: NAME.x + 56,
          top: NAME.y + 150,
          color: NEON_CYAN,
          fontSize: 30,
          fontWeight: 700,
          fontStyle: "italic",
          letterSpacing: 6,
          textShadow: `0 0 12px ${NEON_CYAN}`,
        }}
      >
        JUST CHATTING WITH RYY
      </div>
      <SocialTicker box={{ x: NAME.x + 690, y: NAME.y + 44, w: 520, h: 92 }} />
      <div
        style={{
          position: "absolute",
          left: NAME.x + 690,
          width: 520,
          top: NAME.y + 154,
          textAlign: "center",
          color: "#fff",
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: 1,
          opacity: 0.9,
        }}
      >
        Type <Cmd>!lenh</Cmd> to see bot commands
      </div>

      <NeonFrame box={DONATE} cut={30} fill={PANEL_FILL} speed={-1} />
      <div
        style={{
          position: "absolute",
          left: DONATE.x + 24,
          top: DONATE.y,
          height: DONATE.h,
          width: 290,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "#fff",
          fontSize: 26,
          fontWeight: 600,
          lineHeight: 1.35,
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700 }}>
          Type <Cmd>!donate</Cmd>
        </div>
        <div>to support Ryy</div>
        <div>& grow the channel</div>
      </div>
      {/* Mã QR cần nền trắng để điện thoại quét được */}
      <div
        style={{
          position: "absolute",
          left: DONATE.x + DONATE.w - 186,
          top: DONATE.y + 20,
          width: 166,
          height: 180,
          padding: 6,
          boxSizing: "border-box",
          background: "#fff",
          border: `3px solid ${NEON_PINK}`,
          boxShadow: `0 0 16px ${NEON_PINK}`,
        }}
      >
        <QrSwitcher width={148} height={162} />
      </div>
    </AbsoluteFill>
  );
};

// Chỉ dùng để xem thử: giả lập webcam và khung chat phía sau overlay.
const PreviewBackground: React.FC = () => (
  <AbsoluteFill style={{ background: "#1c1626" }}>
    <div
      style={{
        position: "absolute",
        left: CAM.x,
        top: CAM.y,
        width: CAM.w,
        height: CAM.h,
        background: "linear-gradient(135deg, #3b3150, #241f33)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.3)",
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
        color: "rgba(255,255,255,0.8)",
        fontSize: 24,
        lineHeight: 1.7,
      }}
    >
      {["minh: hello Ryy 👋", "lan: what are we talking about today", "Nightbot: 👋 hi lan", "tuan: !donate"].map(
        (line) => (
          <div key={line}>{line}</div>
        ),
      )}
    </div>
  </AbsoluteFill>
);
