import { interpolate, useCurrentFrame } from "remotion";

import { Cmd, NeonScene, SegmentBar, useBlink } from "./ryyTheme";

// Màn hình kết thúc live, cùng phong cách với StartingSoon (1920x1080, có nền).
// Lặp 10 giây (300 frame) liền mạch.
export const StreamEnding: React.FC = () => {
  const frame = useCurrentFrame();
  const blink = useBlink();
  // Thanh "tắt máy" rút từ 100% về 0 trong 9 giây rồi nhấp nháy "OFFLINE".
  const power = interpolate(frame, [0, 270], [1, 0], { extrapolateRight: "clamp" });
  const offline = frame >= 270;

  return (
    <NeonScene
      tag="STREAM ENDED"
      headline="THANKS FOR WATCHING"
      hudLeft={[
        { text: "SYS // SHUTDOWN" },
        { text: "CAM // OFF" },
        { text: "MIC // OFF", highlight: true },
      ]}
      hudRight={[
        { text: "CHANNEL // RYY TV" },
        { text: "GG // WP" },
        { text: <><span style={{ opacity: blink ? 1 : 0.2 }}>●</span> OFFLINE</>, highlight: true },
      ]}
      footer={<>Follow Ryy so you never miss a stream · <Cmd>!donate</Cmd> to support the channel</>}
    >
      <div style={{ marginTop: 26 }}>
        <SegmentBar
          value={power}
          label={offline ? "OFFLINE" : `${Math.ceil(power * 100)}%`}
          flash={offline}
        />
      </div>
      <div style={{ marginTop: 18, fontSize: 36, fontWeight: 600, color: "#fff", letterSpacing: 2, opacity: 0.9 }}>
        GG everyone, see you next stream! ♥
      </div>
    </NeonScene>
  );
};
