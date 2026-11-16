/**
 * Minimal, dependency-free 360° (equirectangular) photo viewer on WebGL 1.
 * Framework-agnostic: React mounts it in VirtualTour.tsx; the static preview
 * page reuses the same logic.
 *
 * Controls: drag / touch to look around, wheel or pinch-free +/- buttons to zoom,
 * arrow keys and +/- when the canvas has focus. Auto-rotates gently until the
 * user interacts, unless prefers-reduced-motion is set.
 */

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform sampler2D tex;
uniform float yaw, pitch, tanHalf, aspect;
const float PI = 3.141592653589793;
void main(){
  vec3 d = normalize(vec3(v.x * tanHalf * aspect, v.y * tanHalf, -1.0));
  float cp = cos(-pitch), sp = sin(-pitch);
  d = vec3(d.x, d.y * cp + d.z * sp, -d.y * sp + d.z * cp);
  float cy = cos(yaw), sy = sin(yaw);
  d = vec3(d.x * cy - d.z * sy, d.y, d.x * sy + d.z * cy);
  float lon = atan(d.x, -d.z);
  float lat = asin(clamp(d.y, -1.0, 1.0));
  gl_FragColor = texture2D(tex, vec2(lon / (2.0 * PI) + 0.5, 0.5 - lat / PI));
}`;

export type PanoOptions = { autoRotate?: boolean; initialYaw?: number; fov?: number };

export class PanoViewer {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private tex: WebGLTexture;
  private u: Record<string, WebGLUniformLocation | null> = {};
  yaw: number;
  pitch = 0;
  fov: number;
  private raf = 0;
  private dragging = false;
  private last = { x: 0, y: 0 };
  private interacted = false;
  private auto: boolean;
  private ro?: ResizeObserver;
  private cleanup: (() => void)[] = [];
  loaded = false;

  static supported(): boolean {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  }

  constructor(private canvas: HTMLCanvasElement, opts: PanoOptions = {}) {
    const gl = (canvas.getContext("webgl", { antialias: false }) || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    this.yaw = opts.initialYaw ?? 0;
    this.fov = opts.fov ?? 75;
    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.auto = (opts.autoRotate ?? true) && !reduce;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    this.prog = prog;
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ["tex", "yaw", "pitch", "tanHalf", "aspect"]) this.u[n] = gl.getUniformLocation(prog, n);
    this.tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this.bind();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    this.loop();
  }

  /** Loads an equirectangular image (2:1). Downscales if larger than the GPU allows. */
  load(src: string): Promise<void> {
    this.loaded = false;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        const gl = this.gl;
        const max = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
        let source: TexImageSource = img;
        if (img.naturalWidth > max) {
          const c = document.createElement("canvas");
          c.width = max;
          c.height = Math.round((max * img.naturalHeight) / img.naturalWidth);
          c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
          source = c;
        }
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
        this.loaded = true;
        resolve();
      };
      img.onerror = () => reject(new Error(`Could not load ${src}`));
      img.src = src;
    });
  }

  zoom(delta: number) {
    this.interacted = true;
    this.fov = Math.min(100, Math.max(35, this.fov + delta));
  }

  look(dYawDeg: number, dPitchDeg: number) {
    this.interacted = true;
    this.yaw += (dYawDeg * Math.PI) / 180;
    this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch + (dPitchDeg * Math.PI) / 180));
  }

  get headingDeg() {
    return ((((this.yaw * 180) / Math.PI) % 360) + 360) % 360;
  }

  private bind() {
    const c = this.canvas;
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, ev: K, fn: (e: HTMLElementEventMap[K]) => void, o?: AddEventListenerOptions) => {
      el.addEventListener(ev, fn as EventListener, o);
      this.cleanup.push(() => el.removeEventListener(ev, fn as EventListener));
    };
    on(c, "pointerdown", (e) => {
      this.dragging = true;
      this.interacted = true;
      this.last = { x: e.clientX, y: e.clientY };
      c.setPointerCapture(e.pointerId);
    });
    on(c, "pointermove", (e) => {
      if (!this.dragging) return;
      const k = this.fov / c.clientHeight;
      this.look(-(e.clientX - this.last.x) * k, (e.clientY - this.last.y) * k);
      this.last = { x: e.clientX, y: e.clientY };
    });
    const end = () => (this.dragging = false);
    on(c, "pointerup", end);
    on(c, "pointercancel", end);
    on(c, "wheel", (e) => {
      e.preventDefault();
      this.zoom(e.deltaY > 0 ? 4 : -4);
    }, { passive: false });
    on(c, "keydown", (e) => {
      const m: Record<string, () => void> = {
        ArrowLeft: () => this.look(-10, 0),
        ArrowRight: () => this.look(10, 0),
        ArrowUp: () => this.look(0, 8),
        ArrowDown: () => this.look(0, -8),
        "+": () => this.zoom(-6),
        "=": () => this.zoom(-6),
        "-": () => this.zoom(6),
      };
      if (m[e.key]) {
        e.preventDefault();
        m[e.key]();
      }
    });
  }

  private resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.gl.viewport(0, 0, w, h);
  }

  private loop = () => {
    const gl = this.gl;
    if (this.auto && !this.interacted && !document.hidden) this.yaw += 0.0012;
    gl.useProgram(this.prog);
    gl.uniform1i(this.u.tex, 0);
    gl.uniform1f(this.u.yaw, this.yaw);
    gl.uniform1f(this.u.pitch, this.pitch);
    gl.uniform1f(this.u.tanHalf, Math.tan(((this.fov / 2) * Math.PI) / 180));
    gl.uniform1f(this.u.aspect, this.canvas.width / this.canvas.height);
    if (this.loaded) gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.raf = requestAnimationFrame(this.loop);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    this.cleanup.forEach((f) => f());
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
