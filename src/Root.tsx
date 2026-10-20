import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { DonateQR } from "./DonateQR";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DonateQR"
        component={DonateQR}
        durationInFrames={300}
        fps={30}
        width={720}
        height={900}
      />
    </>
  );
};
