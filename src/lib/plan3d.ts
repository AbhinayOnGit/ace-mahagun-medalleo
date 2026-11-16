/**
 * 3D "dollhouse" view built from the official 2D brochure floor plan.
 *
 * - The brochure plan (cropped) is the floor texture, so every room, label and
 *   dimension shown is the developer's own drawing.
 * - Walls are rectangles traced automatically from that drawing by
 *   scripts/plans3d.py (see /public/plans3d/*.json) and extruded to an
 *   illustrative cut-away height. Nothing is invented; heights are not to scale.
 *
 * Three.js is imported dynamically so it only loads when a visitor opens 3D.
 */

export type PlanWalls = { w: number; h: number; rects: [number, number, number, number][] };
export type Plan3D = {
  topView(): void;
  isoView(): void;
  rotate(deg: number): void;
  zoom(factor: number): void;
  destroy(): void;
};

export async function mountPlan3D(el: HTMLElement, textureUrl: string, walls: PlanWalls): Promise<Plan3D> {
  const THREE = await import("three");
  const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
  const { mergeGeometries } = await import("three/examples/jsm/utils/BufferGeometryUtils.js");

  const S = 0.01; // 1 plan pixel = 0.01 scene units
  const W = walls.w * S, H = walls.h * S;
  const wallH = Math.max(W, H) * 0.055; // illustrative cut-away height

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.touchAction = "none";
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 200);

  // Floor = the official plan
  const tex = await new THREE.TextureLoader().loadAsync(textureUrl);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, alphaTest: 0.5, transparent: false }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Walls (traced) + dark section caps, merged into two meshes
  const sides: InstanceType<typeof THREE.BoxGeometry>[] = [];
  const caps: InstanceType<typeof THREE.PlaneGeometry>[] = [];
  for (const [x, y, w, h] of walls.rects) {
    const cx = (x + w / 2) * S - W / 2, cz = (y + h / 2) * S - H / 2;
    const g = new THREE.BoxGeometry(w * S, wallH, h * S);
    g.translate(cx, wallH / 2, cz);
    sides.push(g);
    const c = new THREE.PlaneGeometry(w * S, h * S);
    c.rotateX(-Math.PI / 2);
    c.translate(cx, wallH + 0.0015, cz);
    caps.push(c);
  }
  if (sides.length) {
    const wallMesh = new THREE.Mesh(mergeGeometries(sides), new THREE.MeshStandardMaterial({ color: 0xf1ece2, roughness: 0.9 }));
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    scene.add(wallMesh);
    scene.add(new THREE.Mesh(mergeGeometries(caps), new THREE.MeshBasicMaterial({ color: 0x2b2f2e })));
  }

  scene.add(new THREE.HemisphereLight(0xfff8ee, 0x8a8273, 1.6));
  const sun = new THREE.DirectionalLight(0xfff1dc, 1.4);
  sun.position.set(-W * 0.6, Math.max(W, H) * 1.2, H * 0.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const r = Math.max(W, H) * 0.75;
  Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 0.1, far: 100 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  controls.maxPolarAngle = Math.PI * 0.46; // never go under the floor
  const span = Math.max(W, H);
  controls.minDistance = span * 0.35;
  controls.maxDistance = span * 2.8;
  controls.target.set(0, 0, 0);

  const place = (polar: number, azimuth: number, distF = 1.15) => {
    const d = span * distF;
    camera.position.set(d * Math.sin(polar) * Math.sin(azimuth), d * Math.cos(polar), d * Math.sin(polar) * Math.cos(azimuth));
    camera.lookAt(0, 0, 0);
    controls.update();
  };
  const narrow = () => (el.clientWidth || 800) < 640;
  const isoView = () => place(0.85, -0.55, narrow() ? 1.45 : 1.2);
  const topView = () => place(0.0001, 0, narrow() ? 1.6 : 1.3);
  const resize = () => {
    const w = el.clientWidth || 1, h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();
  isoView();

  let raf = 0;
  const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };
  loop();

  return {
    topView,
    isoView,
    rotate(deg) {
      const off = camera.position.clone().sub(controls.target);
      off.applyAxisAngle(new THREE.Vector3(0, 1, 0), (deg * Math.PI) / 180);
      camera.position.copy(controls.target).add(off);
      controls.update();
    },
    zoom(f) {
      const off = camera.position.clone().sub(controls.target).multiplyScalar(f);
      const len = Math.min(controls.maxDistance, Math.max(controls.minDistance, off.length()));
      camera.position.copy(controls.target).add(off.setLength(len));
      controls.update();
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        const m = o as unknown as { geometry?: { dispose(): void }; material?: { dispose(): void; map?: { dispose(): void } } };
        m.geometry?.dispose();
        m.material?.map?.dispose();
        m.material?.dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
