import { interpolate, useCurrentFrame } from "remotion";

import { Cmd, NeonScene, SegmentBar, useBlink } from "./ryyTheme";

// Màn hình chờ "Starting soon" phong cách gaming neon, 1920x1080, có nền.
// Lặp 10 giây (300 frame) liền mạch.
export const StartingSoon: React.FC = () => {
  const frame = useCurrentFrame();
  const blink = useBlink();
  // Thanh loading chạy 0 → 100% trong 9 giây rồi nhấp nháy "READY" ở giây cuối.
  const progress = interpolate(frame, [0, 270], [0, 1], { extrapolateRight: "clamp" });
  const ready = frame >= 270;

  return (
    <NeonScene
      tag="STREAM STARTING"
      headline="STARTING SOON"
      hudLeft={[
        { text: "SYS // ONLINE" },
        { text: "CAM // STANDBY" },
        { text: "MIC // CHECK", highlight: true },
      ]}
      hudRight={[
        { text: "CHANNEL // RYY TV" },
        { text: "MODE // GAMING" },
        { text: <><span style={{ opacity: blink ? 1 : 0.2 }}>●</span> REC</>, highlight: true },
      ]}
      footer={<>Type <Cmd>!donate</Cmd> to support Ryy and help the channel grow</>}
    >
      <div style={{ marginTop: 26 }}>
        <SegmentBar
          value={progress}
          label={ready ? "READY" : `${Math.floor(progress * 100)}%`}
          flash={ready}
        />
      </div>
      <div style={{ marginTop: 18, fontSize: 36, fontWeight: 600, color: "#fff", letterSpacing: 2, opacity: 0.9 }}>
        Grab a snack, Ryy will be live in a moment!
      </div>
    </NeonScene>
  );
};
