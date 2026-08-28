"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D78E";
const GOLD_DIM = "#6b5a22";

/**
 * یک فرمِ وایرفریمِ معماریِ انتزاعی («ساختمان»): فقط لبه‌ها (بدون
 * نور/سایه‌ی واقعی، چون هدف حس نقشه‌ی مهندسی/بلوپرینت است نه رندر
 * فوتورئال)، به‌علاوه یک حجمِ داخلیِ خیلی کم‌رنگ برای حس جرم، و چند
 * خط افقیِ «طبقه» تا فقط یک جعبه‌ی خالی به‌نظر نرسد.
 */
function Building({ x, y, z, w, h, d }: { x: number; y: number; z: number; w: number; h: number; d: number }) {
  const floorLines = useMemo(() => {
    const floors = Math.max(2, Math.round(h / 1.8));
    const pts: number[] = [];
    for (let i = 1; i < floors; i++) {
      const fy = -h / 2 + (h * i) / floors;
      pts.push(-w / 2, fy, d / 2, w / 2, fy, d / 2);
      pts.push(w / 2, fy, d / 2, w / 2, fy, -d / 2);
    }
    return new Float32Array(pts);
  }, [w, h, d]);

  return (
    <group position={[x, y, z]}>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color={GOLD_LIGHT} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.045} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[floorLines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={GOLD} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/** زمینِ نقشه‌کشیِ مهندسی — دو لایه: خطوط اصلی روشن‌تر، فرعی کم‌رنگ‌تر */
function BlueprintFloor({ size }: { size: number }) {
  return (
    <>
      <gridHelper args={[size, Math.round(size / 5)]} position={[0, -2.2, 0]}>
        <lineBasicMaterial attach="material" color={GOLD} transparent opacity={0.28} blending={THREE.AdditiveBlending} />
      </gridHelper>
      <gridHelper args={[size, size]} position={[0, -2.19, 0]}>
        <lineBasicMaterial attach="material" color={GOLD_DIM} transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </gridHelper>
    </>
  );
}

/** غبار/ذراتِ نور طلایی برای اتمسفر و عمق */
function GoldDust({ count, depth }: { count: number; depth: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 55;
      arr[i * 3 + 1] = Math.random() * 20 - 2;
      arr[i * 3 + 2] = -Math.random() * depth;
    }
    return arr;
  }, [count, depth]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={GOLD_LIGHT} size={0.12} transparent opacity={0.75} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/** هاله‌ی گرمِ افق برای حسِ اتمسفریکِ عمق */
function HorizonGlow({ depth }: { depth: number }) {
  return (
    <mesh position={[0, 6, -depth * 0.95]}>
      <planeGeometry args={[300, 60]} />
      <meshBasicMaterial color="#2a2210" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/**
 * دوربینی که بر اساس progress (۰ تا ۱، از بیرون داده می‌شود) در طول
 * صحنه به جلو «پرواز» می‌کند؛ کمی بالا/پایین و تابِ افقیِ ظریف برای
 * حسِ سینمایی، نه یک خطِ صافِ رباتیک.
 */
function FlythroughCamera({ progressRef, depth }: { progressRef: React.RefObject<number>; depth: number }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = progressRef.current;
    const z = -p * depth;
    const y = 4.5 - Math.sin(p * Math.PI) * 1.8;
    const sway = Math.sin(p * Math.PI * 2.4) * 1.6;
    camera.position.set(sway, y, z + 8);
    camera.lookAt(sway * 0.3, y - 1.2, z - 20);
  });
  return null;
}

export interface CinematicWorldProps {
  /** رفرنسی که هر فریم مقدار ۰..۱ پیشرفتِ اسکرول رو نگه می‌داره (از useScrollProgress پر می‌شه) */
  progressRef: React.RefObject<number>;
  /** عمقِ کلِ مسیر پرواز؛ هرچقدر بخش طولانی‌تر باشه (اسکرول بیشتر)، این عدد بزرگ‌تر باشه بهتره */
  depth?: number;
  /** تعداد ساختمان‌های وایرفریم که به‌صورت خودکار در طول مسیر پخش می‌شوند */
  buildingCount?: number;
}

/**
 * صحنه‌ی سه‌بعدیِ سینمایی — قابل‌استفاده‌ی مجدد برای هر بخشی از سایت
 * که بخواد پس‌زمینه‌ی «پرواز میان فرم‌های معماریِ طلایی» داشته باشه.
 * این کامپوننت هیچ متن/محتوایی رندر نمی‌کنه؛ فقط پس‌زمینه‌ی بصریه —
 * محتوای واقعیِ هر بخش (آمار، عنوان و...) در کامپوننتِ دربرگیرنده،
 * روی همین صحنه به‌عنوان لایه‌ی HTML قرار می‌گیره.
 */
export default function CinematicWorld({ progressRef, depth = 140, buildingCount = 9 }: CinematicWorldProps) {
  const buildings = useMemo(() => {
    const list: { x: number; y: number; z: number; w: number; h: number; d: number }[] = [];
    for (let i = 0; i < buildingCount; i++) {
      const t = (i + 1) / (buildingCount + 1);
      const side = i % 2 === 0 ? -1 : 1;
      const w = 2.6 + Math.random() * 2.4;
      const h = 5 + Math.random() * 10;
      const d = w;
      list.push({
        x: side * (6 + Math.random() * 6),
        y: h / 2 - 2.2,
        z: -t * depth,
        w, h, d,
      });
    }
    return list;
  }, [buildingCount, depth]);

  return (
    <Canvas
      dpr={1}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ fov: 52, near: 0.1, far: 200 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#050505"]} />
      <fogExp2 attach="fog" args={["#050505", 0.021]} />

      <FlythroughCamera progressRef={progressRef} depth={depth} />
      <BlueprintFloor size={220} />
      <HorizonGlow depth={depth} />
      <GoldDust count={400} depth={depth + 10} />
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}

      <EffectComposer>
        <Bloom intensity={0.75} luminanceThreshold={0.18} luminanceSmoothing={0.6} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
