"use client";

import { AdaptiveDpr, PerformanceMonitor, Sparkles, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useMemo, useRef } from "react";

const WORLD_DEPTH = 28;

type Vec3 = [number, number, number];

interface GardenCoreProps {
  scrollProgress: number;
}

interface ParticleLayerOptions {
  count: number;
  spread: number;
  depth: number;
  seed: number;
}

interface PortalNodeConfig {
  position: Vec3;
  rotation: Vec3;
  scale: number;
  color: string;
  accent: string;
  phase: number;
}

interface PlanetNodeConfig {
  position: Vec3;
  radius: number;
  color: string;
  accent: string;
  phase: number;
}

const PORTAL_NODES: PortalNodeConfig[] = [
  {
    position: [-3.2, 1.4, 8.6],
    rotation: [0.24, -0.34, 0.16],
    scale: 1.08,
    color: "#8b5cf6",
    accent: "#59efff",
    phase: 0.4,
  },
  {
    position: [3.2, -1.25, 5.1],
    rotation: [-0.2, 0.38, -0.12],
    scale: 0.86,
    color: "#59efff",
    accent: "#c9ff4a",
    phase: 1.8,
  },
  {
    position: [-3.05, 0.8, 1.15],
    rotation: [0.32, -0.22, -0.2],
    scale: 1.24,
    color: "#c9ff4a",
    accent: "#8b5cf6",
    phase: 3.1,
  },
  {
    position: [3.15, 1.2, -3.55],
    rotation: [-0.28, 0.34, 0.2],
    scale: 0.98,
    color: "#f58cff",
    accent: "#59efff",
    phase: 4.6,
  },
  {
    position: [-3.05, -1.4, -7.35],
    rotation: [0.2, -0.42, 0.15],
    scale: 1.18,
    color: "#62f6c7",
    accent: "#8b5cf6",
    phase: 5.8,
  },
  {
    position: [2.8, 0.9, -11.55],
    rotation: [-0.18, 0.3, -0.16],
    scale: 0.9,
    color: "#ffb86b",
    accent: "#59efff",
    phase: 7.2,
  },
];

const PLANET_NODES: PlanetNodeConfig[] = [
  { position: [-1.75, -1.75, 7.15], radius: 0.34, color: "#4c2a91", accent: "#c9ff4a", phase: 0.8 },
  { position: [1.95, 1.75, 3.05], radius: 0.24, color: "#164c72", accent: "#59efff", phase: 2.3 },
  { position: [2.1, -1.85, -0.85], radius: 0.42, color: "#74346a", accent: "#f58cff", phase: 4.1 },
  { position: [-2.2, 1.55, -4.95], radius: 0.3, color: "#245d59", accent: "#62f6c7", phase: 5.2 },
  { position: [1.65, -1.55, -9.15], radius: 0.36, color: "#6c452b", accent: "#ffb86b", phase: 6.7 },
];

const CORE_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vPosition;

  void main() {
    vec3 displaced = position;
    float wave = sin(position.y * 4.8 + uTime * 1.6) * 0.08;
    wave += sin(position.x * 7.4 - uTime * 1.1) * 0.045;
    wave += sin(position.z * 9.0 + uTime * 0.8) * 0.03;
    displaced += normal * wave * (0.8 + uEnergy * 0.3);

    vPosition = displaced;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const CORE_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  varying vec3 vPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float edge = pow(1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0), 2.4);
    float flow = 0.5 + 0.5 * sin(vPosition.y * 8.0 + vPosition.x * 4.0 + uTime * 2.0);
    float filament = 0.5 + 0.5 * sin(vPosition.z * 15.0 - uTime * 2.8 + flow * 3.0);
    vec3 color = mix(uColorA, uColorB, clamp(flow * 0.72 + edge * 0.5 + filament * 0.18, 0.0, 1.0));
    float glow = (0.72 + edge * 1.9 + flow * 0.42 + filament * 0.18) * (0.8 + uEnergy * 0.52);
    gl_FragColor = vec4(color * glow, 0.9);
  }
`;

const PORTAL_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PORTAL_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uEnergy;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float radius = length(centered) * 2.0;
    float angle = atan(centered.y, centered.x);
    float spiral = 0.5 + 0.5 * sin(angle * 7.0 - radius * 18.0 - uTime * 1.8 + uPhase);
    float rings = 0.5 + 0.5 * sin(radius * 28.0 - uTime * 2.4 + uPhase);
    float mask = 1.0 - smoothstep(0.78, 1.0, radius);
    float edge = smoothstep(0.2, 0.75, radius) * (1.0 - smoothstep(0.75, 1.0, radius));
    vec3 color = mix(uColorA, uColorB, spiral);
    float alpha = (0.14 + spiral * 0.35 + rings * 0.18) * mask * (0.7 + uEnergy * 0.4);
    gl_FragColor = vec4(color * (0.8 + edge * 1.5 + uEnergy * 0.4), alpha);
  }
`;

function clampProgress(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

interface CameraBeat {
  progress: number;
  lift: number;
  lookAheadLift: number;
  roll: number;
  fov: number;
}

const CAMERA_BEATS: CameraBeat[] = [
  { progress: 0, lift: 0, lookAheadLift: 0, roll: 0, fov: 44 },
  { progress: 0.14, lift: 0.18, lookAheadLift: 0.12, roll: -0.026, fov: 43 },
  { progress: 0.29, lift: -0.12, lookAheadLift: -0.08, roll: 0.034, fov: 46 },
  { progress: 0.43, lift: 0.1, lookAheadLift: 0.16, roll: -0.02, fov: 44 },
  { progress: 0.57, lift: -0.18, lookAheadLift: -0.12, roll: 0.028, fov: 47 },
  { progress: 0.72, lift: 0.14, lookAheadLift: 0.1, roll: -0.034, fov: 43 },
  { progress: 0.86, lift: -0.08, lookAheadLift: -0.06, roll: 0.02, fov: 45 },
  { progress: 1, lift: 0, lookAheadLift: 0, roll: 0, fov: 44 },
];

function sampleCameraBeat(progress: number) {
  const normalizedProgress = clampProgress(progress);
  const nextIndex = Math.min(
    CAMERA_BEATS.length - 1,
    CAMERA_BEATS.findIndex((beat) => beat.progress >= normalizedProgress),
  );
  const safeNextIndex = nextIndex < 0 ? CAMERA_BEATS.length - 1 : nextIndex;
  const previousIndex = Math.max(0, safeNextIndex - 1);
  const previous = CAMERA_BEATS[previousIndex];
  const next = CAMERA_BEATS[safeNextIndex];
  const range = Math.max(next.progress - previous.progress, 0.0001);
  const localProgress = THREE.MathUtils.smoothstep((normalizedProgress - previous.progress) / range, 0, 1);

  return {
    lift: THREE.MathUtils.lerp(previous.lift, next.lift, localProgress),
    lookAheadLift: THREE.MathUtils.lerp(previous.lookAheadLift, next.lookAheadLift, localProgress),
    roll: THREE.MathUtils.lerp(previous.roll, next.roll, localProgress),
    fov: THREE.MathUtils.lerp(previous.fov, next.fov, localProgress),
  };
}

function createParticleGeometry({ count, spread, depth, seed }: ParticleLayerOptions) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const angle = index * 2.399963229728653 + seed * 0.7;
    const radialSeed = ((index * 83 + seed * 47) % 997) / 997;
    const heightSeed = ((index * 137 + seed * 19) % 991) / 991;
    const depthSeed = ((index * 61 + seed * 31) % 983) / 983;
    const radius = 0.45 + radialSeed * spread;
    const offset = index * 3;

    positions[offset] = Math.cos(angle) * radius + Math.sin(index * 0.17 + seed) * 0.6;
    positions[offset + 1] = (heightSeed - 0.5) * spread * 0.72 + Math.cos(index * 0.23) * 0.42;
    positions[offset + 2] = 11.5 - depthSeed * depth;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

function createSignalLatticeGeometry() {
  const positions: number[] = [];
  const tiers = 24;
  const spokes = 12;

  for (let tier = 0; tier < tiers - 1; tier += 1) {
    const progress = tier / (tiers - 1);
    const nextProgress = (tier + 1) / (tiers - 1);
    const z = 10.5 - progress * WORLD_DEPTH;
    const nextZ = 10.5 - nextProgress * WORLD_DEPTH;
    const radius = 2.75 + Math.sin(tier * 0.7) * 0.32;
    const nextRadius = 2.75 + Math.sin((tier + 1) * 0.7) * 0.32;

    for (let spoke = 0; spoke < spokes; spoke += 1) {
      const angle = (spoke / spokes) * Math.PI * 2 + tier * 0.16;
      const nextAngle = (spoke / spokes) * Math.PI * 2 + (tier + 1) * 0.16;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.58;
      const nextX = Math.cos(nextAngle) * nextRadius;
      const nextY = Math.sin(nextAngle) * nextRadius * 0.58;

      positions.push(x, y, z, nextX, nextY, nextZ);
      positions.push(x, y, z, Math.cos(angle + 0.42) * radius, Math.sin(angle + 0.42) * radius * 0.58, z);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function PortalSurface({ color, accent, phase, scrollProgress }: PortalNodeConfig & GardenCoreProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const baseAccent = useMemo(() => new THREE.Color(accent), [accent]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPhase: { value: phase },
      uEnergy: { value: 0.7 },
      uColorA: { value: baseColor.clone() },
      uColorB: { value: baseAccent.clone() },
    }),
    [baseAccent, baseColor, phase],
  );

  useFrame((state) => {
    const progress = clampProgress(scrollProgress);
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uEnergy.value = 0.62 + progress * 0.4 + Math.sin(state.clock.elapsedTime * 1.2 + phase) * 0.08;
    uniforms.uColorA.value.copy(baseColor).offsetHSL(progress * 0.08, 0, progress * 0.06);
    uniforms.uColorB.value.copy(baseAccent).offsetHSL(-progress * 0.06, 0, progress * 0.08);

    if (materialRef.current) {
      materialRef.current.opacity = 0.72 + progress * 0.14;
    }
  });

  return (
    <mesh scale={0.94} renderOrder={-1}>
      <circleGeometry args={[0.93, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={PORTAL_VERTEX_SHADER}
        fragmentShader={PORTAL_FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface OrbitingGeometryProps {
  radius: number;
  color: string;
  accent: string;
  speed: number;
  phase: number;
  scale?: number;
}

function OrbitingGeometry({ radius, color, accent, speed, phase, scale = 1 }: OrbitingGeometryProps) {
  const orbitRef = useRef<THREE.Group | null>(null);
  const satelliteRef = useRef<THREE.Mesh | null>(null);
  const haloRef = useRef<THREE.Mesh | null>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime * speed + phase;

    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * speed * 0.9;
      orbitRef.current.rotation.x = Math.sin(time * 0.7) * 0.18;
      orbitRef.current.rotation.z = Math.cos(time * 0.45) * 0.12;
    }

    if (satelliteRef.current) {
      satelliteRef.current.position.set(
        Math.cos(time) * radius,
        Math.sin(time * 1.35) * radius * 0.46,
        Math.sin(time) * radius * 0.72,
      );
      satelliteRef.current.rotation.x += delta * 1.8;
      satelliteRef.current.rotation.y += delta * 2.2;
    }

    if (haloRef.current) {
      haloRef.current.rotation.x -= delta * 0.6;
      haloRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={haloRef} rotation={[Math.PI / 2.6, 0.2, 0]}>
        <torusGeometry args={[radius * 0.82, 0.012 * scale, 6, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.42} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={satelliteRef} scale={scale}>
        <octahedronGeometry args={[0.13, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={accent}
          emissiveIntensity={1.6}
          metalness={0.55}
          roughness={0.24}
        />
      </mesh>
    </group>
  );
}

function PortalNode({ scrollProgress, ...config }: PortalNodeConfig & GardenCoreProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const innerRingRef = useRef<THREE.Mesh | null>(null);
  const planetRef = useRef<THREE.Mesh | null>(null);
  const planetMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const lightRef = useRef<THREE.PointLight | null>(null);

  useFrame((state, delta) => {
    const progress = clampProgress(scrollProgress);
    const time = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(time * 1.25 + config.phase) * 0.055 + progress * 0.035;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(config.scale * pulse);
      groupRef.current.rotation.z += delta * (0.018 + progress * 0.035);
      groupRef.current.position.y = config.position[1] + Math.sin(time * 0.34 + config.phase) * 0.06;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (0.14 + progress * 0.08);
      ringRef.current.rotation.x = Math.sin(time * 0.22 + config.phase) * 0.12;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * (0.22 + progress * 0.12);
      innerRingRef.current.rotation.y = Math.cos(time * 0.28 + config.phase) * 0.14;
    }

    if (planetRef.current) {
      planetRef.current.rotation.x += delta * 0.42;
      planetRef.current.rotation.y += delta * 0.66;
    }

    if (planetMaterialRef.current) {
      planetMaterialRef.current.emissiveIntensity = 0.8 + progress * 0.8 + Math.sin(time * 1.7 + config.phase) * 0.12;
    }

    if (ringMaterialRef.current) {
      ringMaterialRef.current.opacity = 0.34 + progress * 0.22 + Math.sin(time * 1.4 + config.phase) * 0.04;
    }

    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + progress * 1.2 + Math.sin(time * 1.2 + config.phase) * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={config.position} rotation={config.rotation} scale={config.scale}>
      <PortalSurface {...config} scrollProgress={scrollProgress} />
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.03, 0.036, 10, 96]} />
        <meshBasicMaterial
          ref={ringMaterialRef}
          color={config.accent}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0.14, 0.22]}>
        <torusGeometry args={[0.77, 0.012, 8, 80]} />
        <meshBasicMaterial color={config.color} transparent opacity={0.54} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={planetRef} position={[0, 0, 0.18]} scale={0.3}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          ref={planetMaterialRef}
          color={config.color}
          emissive={config.accent}
          emissiveIntensity={1.1}
          metalness={0.62}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, 0, 0.2]} scale={0.37}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={config.accent} wireframe transparent opacity={0.22} blending={THREE.AdditiveBlending} />
      </mesh>
      <OrbitingGeometry
        radius={0.58}
        color={config.accent}
        accent={config.color}
        speed={0.48 + config.phase * 0.015}
        phase={config.phase}
        scale={0.8}
      />
      <pointLight ref={lightRef} color={config.accent} intensity={1.1} distance={4.2} decay={2} />
    </group>
  );
}

function PlanetNode({ position, radius, color, accent, phase }: PlanetNodeConfig) {
  const groupRef = useRef<THREE.Group | null>(null);
  const planetRef = useRef<THREE.Mesh | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(time * 0.35 + phase) * 0.08;
      groupRef.current.rotation.z = Math.sin(time * 0.24 + phase) * 0.16;
    }

    if (planetRef.current) {
      planetRef.current.rotation.x += delta * 0.24;
      planetRef.current.rotation.y += delta * 0.5;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.36;
      ringRef.current.rotation.x = Math.PI / 2.2 + Math.sin(time * 0.18 + phase) * 0.08;
    }

    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.38 + Math.sin(time * 1.1 + phase) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={planetRef}>
        <icosahedronGeometry args={[radius, 2]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={accent}
          emissiveIntensity={0.48}
          metalness={0.46}
          roughness={0.4}
        />
      </mesh>
      <mesh scale={1.08}>
        <icosahedronGeometry args={[radius, 1]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0.18, 0]}>
        <torusGeometry args={[radius * 1.55, Math.max(0.008, radius * 0.035), 6, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.42} blending={THREE.AdditiveBlending} />
      </mesh>
      <OrbitingGeometry radius={radius * 1.9} color={accent} accent={color} speed={0.62} phase={phase} scale={0.52} />
      <pointLight color={accent} intensity={0.22} distance={radius * 7} decay={2} />
    </group>
  );
}

function GardenCore({ scrollProgress }: GardenCoreProps) {
  const worldRef = useRef<THREE.Group | null>(null);
  const latticeRef = useRef<THREE.LineSegments | null>(null);
  const nearParticlesMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const midParticlesMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const keyLightRef = useRef<THREE.PointLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const coreLightRef = useRef<THREE.PointLight | null>(null);
  const fogRef = useRef<THREE.FogExp2 | null>(null);
  const backgroundRef = useRef<THREE.Color | null>(null);
  const cameraTargetRef = useRef(new THREE.Vector3());
  const cameraPath = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.7, 12.2),
        new THREE.Vector3(2.4, 1.5, 9.4),
        new THREE.Vector3(-2.3, -0.7, 6.3),
        new THREE.Vector3(1.45, 1.15, 3.45),
        new THREE.Vector3(-1.8, -1.2, 0.2),
        new THREE.Vector3(1.7, 0.75, -3.35),
        new THREE.Vector3(-1.35, -1.15, -6.8),
        new THREE.Vector3(2.25, 1.35, -10.45),
        new THREE.Vector3(0.1, -0.45, -14.8),
      ]),
    [],
  );
  const nearParticleGeometry = useMemo(
    () => createParticleGeometry({ count: 420, spread: 6.4, depth: WORLD_DEPTH + 3, seed: 3 }),
    [],
  );
  const midParticleGeometry = useMemo(
    () => createParticleGeometry({ count: 720, spread: 9.8, depth: WORLD_DEPTH + 7, seed: 11 }),
    [],
  );
  const latticeGeometry = useMemo(createSignalLatticeGeometry, []);
  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0.78 },
      uColorA: { value: new THREE.Color("#8b5cf6") },
      uColorB: { value: new THREE.Color("#59efff") },
    }),
    [],
  );
  const coreMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const coreGroupRef = useRef<THREE.Group | null>(null);
  const coreRingRef = useRef<THREE.Mesh | null>(null);
  const coreRingSecondaryRef = useRef<THREE.Mesh | null>(null);

  useFrame((state, delta) => {
    const progress = clampProgress(scrollProgress);
    const time = state.clock.elapsedTime;
    const cameraBeat = sampleCameraBeat(progress);
    const pathProgress = Math.min(0.998, progress);
    const pathPosition = cameraPath.getPointAt(pathProgress);
    const lookAheadPosition = cameraPath.getPointAt(Math.min(0.999, pathProgress + 0.052));
    const parallax = 0.34 + progress * 0.24;
    const cameraDamping = 1 - Math.pow(0.0001, delta);

    pathPosition.y += cameraBeat.lift;
    lookAheadPosition.y += cameraBeat.lookAheadLift;
    pathPosition.x += state.pointer.x * parallax;
    pathPosition.y += state.pointer.y * (0.2 + progress * 0.14);
    lookAheadPosition.x += state.pointer.x * parallax * 0.6;
    lookAheadPosition.y += state.pointer.y * (0.13 + progress * 0.08);
    state.camera.position.lerp(pathPosition, cameraDamping);
    cameraTargetRef.current.lerp(lookAheadPosition, cameraDamping);
    state.camera.lookAt(cameraTargetRef.current);
    state.camera.rotation.z += cameraBeat.roll;

    const perspectiveCamera = state.camera as THREE.PerspectiveCamera;
    if (perspectiveCamera.isPerspectiveCamera) {
      perspectiveCamera.fov = THREE.MathUtils.damp(perspectiveCamera.fov, cameraBeat.fov, 4.5, delta);
      perspectiveCamera.updateProjectionMatrix();
    }

    if (worldRef.current) {
      worldRef.current.rotation.y = time * 0.012 + progress * 0.19;
      worldRef.current.rotation.x = Math.sin(time * 0.11) * 0.018 + progress * 0.025;
    }

    if (latticeRef.current) {
      latticeRef.current.rotation.y = -time * 0.018 + progress * -0.08;
      latticeRef.current.rotation.z = Math.sin(time * 0.16) * 0.025;
    }

    if (nearParticlesMaterialRef.current) {
      nearParticlesMaterialRef.current.size = 0.032 + progress * 0.018;
      nearParticlesMaterialRef.current.opacity = 0.38 + progress * 0.22;
    }

    if (midParticlesMaterialRef.current) {
      midParticlesMaterialRef.current.size = 0.018 + progress * 0.011;
      midParticlesMaterialRef.current.opacity = 0.2 + progress * 0.14;
    }

    const hue = 0.74 - progress * 0.4;
    fogRef.current?.color.setHSL(hue, 0.38, 0.04 + progress * 0.018);
    backgroundRef.current?.setHSL(hue + 0.02, 0.52, 0.012 + progress * 0.008);

    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = 0.2 + progress * 0.13;
    }

    if (keyLightRef.current) {
      keyLightRef.current.color.setHSL((hue + 0.05) % 1, 0.88, 0.63);
      keyLightRef.current.intensity = 4.6 + progress * 2.2 + Math.sin(time * 0.45) * 0.35;
      keyLightRef.current.position.set(2.4 + Math.sin(time * 0.22) * 0.8, 2.1, 4.2 - progress * 3.8);
    }

    if (rimLightRef.current) {
      rimLightRef.current.color.setHSL((hue + 0.48) % 1, 0.9, 0.66);
      rimLightRef.current.intensity = 2.8 + progress * 2.6;
      rimLightRef.current.position.set(-3.1, -1.5 + Math.cos(time * 0.27) * 0.65, 1.8 - progress * 7);
    }

    if (coreLightRef.current) {
      coreLightRef.current.color.setHSL((hue + 0.11) % 1, 0.92, 0.68);
      coreLightRef.current.intensity = 4.5 + progress * 4.5 + Math.sin(time * 1.4) * 0.45;
    }

    coreUniforms.uTime.value = time;
    coreUniforms.uEnergy.value = 0.74 + progress * 0.5 + Math.sin(time * 1.35) * 0.1;
    coreUniforms.uColorA.value.setHSL((0.74 - progress * 0.28) % 1, 0.82, 0.58);
    coreUniforms.uColorB.value.setHSL((0.54 - progress * 0.18 + 1) % 1, 0.88, 0.62);

    if (coreMaterialRef.current) {
      coreMaterialRef.current.opacity = 0.86 + progress * 0.1;
    }

    if (coreGroupRef.current) {
      const corePulse = 1 + Math.sin(time * 1.45) * 0.055 + progress * 0.1;
      coreGroupRef.current.scale.setScalar(corePulse);
      coreGroupRef.current.rotation.y += delta * (0.08 + progress * 0.06);
      coreGroupRef.current.rotation.z = Math.sin(time * 0.24) * 0.08 + progress * -0.16;
    }

    if (coreRingRef.current) {
      coreRingRef.current.rotation.x += delta * (0.18 + progress * 0.11);
      coreRingRef.current.rotation.y -= delta * 0.12;
    }

    if (coreRingSecondaryRef.current) {
      coreRingSecondaryRef.current.rotation.z -= delta * (0.25 + progress * 0.14);
      coreRingSecondaryRef.current.rotation.x = Math.PI / 2.4 + Math.sin(time * 0.22) * 0.12;
    }
  });

  return (
    <>
      <color ref={backgroundRef} attach="background" args={["#07050f"]} />
      <fogExp2 ref={fogRef} attach="fog" args={["#090a0f", 0.048]} />
      <group ref={worldRef}>
        <ambientLight ref={ambientLightRef} intensity={0.24} />
        <pointLight ref={keyLightRef} position={[2.4, 2.1, 4.2]} color="#8b5cf6" intensity={5.4} distance={15} decay={2} />
        <pointLight ref={rimLightRef} position={[-3.1, -1.5, 1.8]} color="#59efff" intensity={3.1} distance={13} decay={2} />

        <group ref={latticeRef}>
          <lineSegments geometry={latticeGeometry}>
            <lineBasicMaterial color="#8b5cf6" transparent opacity={0.14} blending={THREE.AdditiveBlending} />
          </lineSegments>
        </group>

        <points geometry={nearParticleGeometry}>
          <pointsMaterial
            ref={nearParticlesMaterialRef}
            color="#c9ff4a"
            size={0.034}
            transparent
            opacity={0.48}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
        <points geometry={midParticleGeometry}>
          <pointsMaterial
            ref={midParticlesMaterialRef}
            color="#59efff"
            size={0.019}
            transparent
            opacity={0.24}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <group position={[0, 0, -7]}>
          <Stars radius={24} depth={48} count={900} factor={2.4} saturation={0.72} fade speed={0.16} />
        </group>
        <group position={[0, 0, -2]}>
          <Stars radius={15} depth={30} count={520} factor={1.6} saturation={0.48} fade speed={0.32} />
        </group>
        <Sparkles count={110} scale={[10, 6, 32]} position={[0, 0, -2]} color="#59efff" size={2.5} speed={0.34} noise={[0.45, 0.75, 0.35]} />
        <Sparkles count={85} scale={[7, 4.5, 25]} position={[0, 0.2, -5]} color="#c9ff4a" size={2.1} speed={0.52} noise={[0.3, 0.5, 0.25]} />

        {PORTAL_NODES.map((node) => (
          <PortalNode key={`${node.position[2]}-${node.phase}`} {...node} scrollProgress={scrollProgress} />
        ))}
        {PLANET_NODES.map((node) => (
          <PlanetNode key={`${node.position[2]}-${node.phase}`} {...node} />
        ))}

        <group ref={coreGroupRef} position={[0, 0, -0.35]}>
          <pointLight ref={coreLightRef} color="#8b5cf6" intensity={5} distance={9} decay={2} />
          <mesh>
            <icosahedronGeometry args={[1.32, 4]} />
            <shaderMaterial
              ref={coreMaterialRef}
              uniforms={coreUniforms}
              vertexShader={CORE_VERTEX_SHADER}
              fragmentShader={CORE_FRAGMENT_SHADER}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh scale={1.1}>
            <icosahedronGeometry args={[1.32, 2]} />
            <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.22} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh ref={coreRingRef} rotation={[0.4, 0.2, 0.1]}>
            <torusGeometry args={[1.88, 0.018, 8, 128]} />
            <meshBasicMaterial color="#59efff" transparent opacity={0.54} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh ref={coreRingSecondaryRef} rotation={[Math.PI / 2.4, 0.4, 0]}>
            <torusGeometry args={[2.38, 0.012, 8, 128]} />
            <meshBasicMaterial color="#c9ff4a" transparent opacity={0.34} blending={THREE.AdditiveBlending} />
          </mesh>
          <OrbitingGeometry radius={2.15} color="#c9ff4a" accent="#59efff" speed={0.32} phase={0.6} scale={1.15} />
          <OrbitingGeometry radius={2.7} color="#f58cff" accent="#8b5cf6" speed={0.2} phase={2.6} scale={0.82} />
        </group>
      </group>
    </>
  );
}

interface SignalGardenCanvasProps {
  scrollProgress: number;
}

export default function SignalGardenCanvas({ scrollProgress }: SignalGardenCanvasProps) {
  return (
    <div className="signal-garden" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.7, 12.2], fov: 44, near: 0.1, far: 80 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <PerformanceMonitor flipflops={3} factor={0.7}>
          <AdaptiveDpr />
        </PerformanceMonitor>
        <GardenCore scrollProgress={scrollProgress} />
        <EffectComposer multisampling={0}>
          <Bloom intensity={1.35} luminanceThreshold={0.08} mipmapBlur />
          <Noise opacity={0.07} />
          <Vignette eskil={false} offset={0.14} darkness={0.84} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
