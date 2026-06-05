import { useEffect, useState } from 'react';

const S = 52; // cube side length in px

// Dot layout [left%, top%] for each face value
const DOTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[27, 73], [73, 27]],
  3: [[27, 73], [50, 50], [73, 27]],
  4: [[27, 27], [73, 27], [27, 73], [73, 73]],
  5: [[27, 27], [73, 27], [50, 50], [27, 73], [73, 73]],
  6: [[27, 18], [73, 18], [27, 50], [73, 50], [27, 82], [73, 82]],
};

// Face value → scene rotation that brings it to the front
const TO_FRONT: Record<number, string> = {
  1: 'rotateX(0deg)   rotateY(0deg)',
  2: 'rotateX(90deg)  rotateY(0deg)',
  3: 'rotateY(-90deg) rotateX(0deg)',
  4: 'rotateY(90deg)  rotateX(0deg)',
  5: 'rotateX(-90deg) rotateY(0deg)',
  6: 'rotateX(0deg)   rotateY(180deg)',
};

// Face definitions: [faceValue, CSS transform that positions the face on the cube]
const FACES: [number, string][] = [
  [1, `translateZ(${S / 2}px)`],
  [6, `rotateY(180deg) translateZ(${S / 2}px)`],
  [3, `rotateY(90deg)  translateZ(${S / 2}px)`],
  [4, `rotateY(-90deg) translateZ(${S / 2}px)`],
  [2, `rotateX(-90deg) translateZ(${S / 2}px)`],
  [5, `rotateX(90deg)  translateZ(${S / 2}px)`],
];

function DotFace({ faceValue, faceTransform }: { faceValue: number; faceTransform: string }) {
  return (
    <div style={{
      position: 'absolute',
      width: S, height: S,
      transform: faceTransform,
      backfaceVisibility: 'hidden',
      background: 'linear-gradient(145deg, #faf5e8 0%, #eee0c2 60%, #e4d0aa 100%)',
      border: '1.5px solid #b08040',
      borderRadius: 8,
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 6px rgba(100,60,10,0.15)',
    }}>
      {(DOTS[faceValue] ?? []).map(([x, y], i) => (
        <div key={i} style={{
          position: 'absolute',
          width: S * 0.21, height: S * 0.21,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #7a3d12, #2e1205)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,200,100,0.15)',
          left: `calc(${x}% - ${S * 0.105}px)`,
          top:  `calc(${y}% - ${S * 0.105}px)`,
        }} />
      ))}
    </div>
  );
}

export function Dice3D({ value, rolling }: { value: number; rolling: boolean }) {
  const [sceneTransform, setSceneTransform] = useState<string>(TO_FRONT[1]!);
  const [animating, setAnimating]           = useState(false);

  useEffect(() => {
    if (rolling) {
      setAnimating(true);
    } else {
      setAnimating(false);
      if (value >= 1 && value <= 6) {
        setSceneTransform(TO_FRONT[value]!);
      }
    }
  }, [rolling, value]);

  return (
    <div style={{
      width: S + 8, height: S + 8,
      perspective: `${S * 4}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: S, height: S,
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform:  animating ? undefined : sceneTransform,
        animation:  animating ? 'dice-tumble 0.22s linear infinite' : 'none',
        // Spring-like settle when landing on a face
        transition: animating ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1)',
      }}>
        {FACES.map(([faceVal, faceTransform]) => (
          <DotFace key={faceVal} faceValue={faceVal} faceTransform={faceTransform} />
        ))}
      </div>
    </div>
  );
}
