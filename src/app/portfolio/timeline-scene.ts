import {
  Group,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';
import { advanceAngle, stopAngle, type AngleState } from './scene-focus';
import type { SceneFocus } from './timeline.model';

/** Distância dos pins até o centro. O modelo entra no mesmo grupo e gira com eles. */
export const TIMELINE_RADIUS = 2;

export interface TimelineAnchor {
  id: string;
  position: number;
}

export interface TimelineSceneOptions {
  reducedMotion?: boolean;
}

/**
 * Loop da linha do tempo, sem malha de planeta ou buraco negro.
 * `attachModel` recebe o corpo 3D. `attachPin` recebe a imagem de cada ponto.
 * O grupo inteiro gira sozinho nas seções sem pins e trava no trecho da seção visível.
 */
export class TimelineScene {
  readonly body = new Group();
  readonly model = new Group();
  readonly pins = new Group();

  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(42, 1, 0.1, 50);
  private readonly raycaster = new Raycaster();
  private readonly pointer = new Vector2();
  private readonly anchors = new Map<string, Group>();
  private readonly reducedMotion: boolean;

  private renderer: WebGLRenderer | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private currentAngle = 0;
  private targetAngle = 0;
  private mode: SceneFocus['mode'] = 'idle';
  private lastTime = 0;

  constructor(options: TimelineSceneOptions = {}) {
    this.reducedMotion = options.reducedMotion ?? false;
    this.body.add(this.model, this.pins);
    this.scene.add(this.body);
    this.camera.position.set(0, 0.35, 6.2);
  }

  mount(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
    this.lastTime = globalThis.performance?.now() ?? 0;
    this.resize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setAnimationLoop(this.tick);
  }

  unmount(): void {
    this.renderer?.setAnimationLoop(null);
    this.renderer?.dispose();
    this.renderer = null;
    this.canvas = null;
  }

  setFocus(focus: SceneFocus): void {
    this.mode = focus.mode;
    this.targetAngle = focus.targetAngle;
  }

  syncStops(stops: readonly TimelineAnchor[]): void {
    const ids = new Set(stops.map((stop) => stop.id));
    for (const [id, anchor] of this.anchors) {
      if (ids.has(id)) {
        continue;
      }
      this.pins.remove(anchor);
      this.anchors.delete(id);
    }

    for (const stop of stops) {
      const anchor = this.anchorFor(stop.id);
      const angle = stopAngle(stop.position);
      anchor.position.set(Math.sin(angle) * TIMELINE_RADIUS, 0, Math.cos(angle) * TIMELINE_RADIUS);
      anchor.rotation.set(0, angle, 0);
    }
  }

  attachModel(object: Object3D): void {
    this.model.clear();
    this.model.add(object);
  }

  attachPin(stopId: string, object: Object3D): void {
    const anchor = this.anchors.get(stopId);
    if (!anchor) {
      return;
    }
    anchor.clear();
    anchor.add(object);
  }

  resize(width: number, height: number): void {
    if (!this.renderer || width <= 0 || height <= 0) {
      return;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  /** Retorna o pin sob o cursor quando a malha já estiver em `attachPin`. */
  pick(clientX: number, clientY: number): string | null {
    const canvas = this.canvas;
    if (!canvas || canvas.clientWidth === 0 || canvas.clientHeight === 0) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const hits = this.raycaster.intersectObjects(this.pins.children, true);
    for (const hit of hits) {
      let node: Object3D | null = hit.object;
      while (node) {
        const stopId = node.userData['stopId'];
        if (typeof stopId === 'string') {
          return stopId;
        }
        node = node.parent;
      }
    }

    return null;
  }

  private anchorFor(stopId: string): Group {
    const existing = this.anchors.get(stopId);
    if (existing) {
      return existing;
    }

    const anchor = new Group();
    anchor.name = `pin:${stopId}`;
    anchor.userData['stopId'] = stopId;
    this.pins.add(anchor);
    this.anchors.set(stopId, anchor);
    return anchor;
  }

  private readonly tick = (time: number): void => {
    const deltaSeconds = Math.min(Math.max((time - this.lastTime) / 1000, 0), 0.05);
    this.lastTime = time;
    const state: AngleState = {
      currentAngle: this.currentAngle,
      targetAngle: this.targetAngle,
      mode: this.mode,
      reducedMotion: this.reducedMotion,
    };
    this.currentAngle = advanceAngle(state, deltaSeconds);
    this.body.rotation.y = -this.currentAngle;
    try {
      this.renderer?.render(this.scene, this.camera);
    } catch {
      this.renderer?.setAnimationLoop(null);
    }
  };
}
