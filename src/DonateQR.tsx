import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Mỗi mã QR hiện 5 giây, chuyển cảnh mờ dần 0.5 giây. Tổng 10 giây, lặp liền mạch.
const SHOW = 150;
const FADE = 15;

const QRS = [staticFile("qr-zypage.png"), staticFile("qr-vnpay.png")];

// Độ mờ của từng mã QR tại một frame: mã 2 hiện dần quanh frame 150,
// mờ dần ở cuối vòng để nối lại mã 1.
export const useQrOpacities = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const second = interpolate(
    frame,
    [SHOW - FADE, SHOW, durationInFrames - FADE, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return [1 - second, second];
};

// Hai mã QR chồng lên nhau, chuyển qua lại.
export const QrSwitcher: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const opacities = useQrOpacities();
  return (
    <div style={{ position: "relative", width, height }}>
      {QRS.map((src, i) => (
        <Img
          key={src}
          src={src}
          style={{
            position: "absolute",
            inset: 0,
            width,
            height,
            objectFit: "contain",
            opacity: opacities[i],
          }}
        />
      ))}
    </div>
  );
};

export const DonateQR: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [, second] = useQrOpacities();

  // Chữ "đập" nhẹ như nhịp tim, chu kỳ 1 giây.
  const pulse = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);
  const pop = spring({ frame: frame % SHOW, fps, config: { damping: 12 } });
  const active = second > 0.5 ? 1 : 0;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #1b1035 0%, #3a1462 55%, #6a1b6e 100%)",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DejaVu Sans', 'Segoe UI', Arial, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 46,
          whiteSpace: "nowrap",
          fontWeight: 800,
          color: "#fff",
          textAlign: "center",
          transform: `scale(${pulse})`,
          textShadow: "0 0 18px #ff4fd8, 0 4px 10px rgba(0,0,0,0.5)",
          marginBottom: 36,
        }}
      >
        💖 Support Ryy tại đây 💖
      </div>

      <div
        style={{
          position: "relative",
          width: 560,
          height: 620,
          background: "#fff",
          borderRadius: 32,
          boxShadow: "0 0 40px rgba(255,79,216,0.55)",
          transform: `scale(${interpolate(pop, [0, 1], [0.96, 1])})`,
        }}
      >
        <div style={{ position: "absolute", inset: 24 }}>
          <QrSwitcher width={512} height={572} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
        {QRS.map((src, i) => (
          <div
            key={src}
            style={{
              width: i === active ? 40 : 14,
              height: 14,
              borderRadius: 7,
              background: i === active ? "#ff4fd8" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
