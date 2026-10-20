import type { FocusFrame, PortfolioSection, SectionRect, TimelineStop } from './timeline.model';

const FULL_TURN = Math.PI * 2;
const VIEWPORT_ANCHOR = 0.4;
const FOCUS_SHARPNESS = 5;

/** Giro contínuo quando a seção visível não tem pins. */
export const IDLE_SPIN_RADIANS_PER_SECOND = 0.18;

export interface AngleState {
  currentAngle: number;
  targetAngle: number;
  mode: FocusFrame['mode'];
  reducedMotion: boolean;
}

export function stopAngle(position: number): number {
  return clamp(position, 0, 1) * FULL_TURN;
}

export function shortestAngleDelta(from: number, to: number): number {
  let delta = (to - from) % FULL_TURN;
  if (delta > Math.PI) {
    delta -= FULL_TURN;
  }
  if (delta < -Math.PI) {
    delta += FULL_TURN;
  }
  return delta;
}

export function dampAngle(current: number, target: number, deltaSeconds: number): number {
  const step = 1 - Math.exp(-FOCUS_SHARPNESS * Math.max(deltaSeconds, 0));
  return current + shortestAngleDelta(current, target) * step;
}

export function lerpAngle(from: number, to: number, progress: number): number {
  return from + shortestAngleDelta(from, to) * clamp(progress, 0, 1);
}

export function wrapAngle(angle: number): number {
  return ((angle % FULL_TURN) + FULL_TURN) % FULL_TURN;
}

export function advanceAngle(state: AngleState, deltaSeconds: number): number {
  if (state.mode === 'idle') {
    if (state.reducedMotion) {
      return wrapAngle(state.currentAngle);
    }
    return wrapAngle(state.currentAngle + IDLE_SPIN_RADIANS_PER_SECOND * deltaSeconds);
  }

  if (state.reducedMotion) {
    return wrapAngle(state.targetAngle);
  }

  return wrapAngle(dampAngle(state.currentAngle, state.targetAngle, deltaSeconds));
}

export function resolveScrollFocus(
  sections: readonly PortfolioSection[],
  stops: readonly TimelineStop[],
  rects: readonly SectionRect[],
  viewportHeight: number,
): FocusFrame {
  const fallback = sections[0]?.id ?? 'intro';
  if (viewportHeight <= 0 || rects.length === 0) {
    return idleFrame(fallback);
  }

  const active = sectionAtAnchor(rects, viewportHeight * VIEWPORT_ANCHOR);
  if (!active) {
    return idleFrame(fallback);
  }

  const sectionStops = stops
    .filter((stop) => stop.sectionId === active.id)
    .sort((left, right) => left.position - right.position);

  if (sectionStops.length === 0) {
    return idleFrame(active.id);
  }

  const progress = clamp(
    (viewportHeight * VIEWPORT_ANCHOR - active.top) / Math.max(active.height, 1),
    0,
    1,
  );
  const focused = angleAlongStops(sectionStops, progress);

  return {
    mode: 'locked',
    sectionId: active.id,
    stopId: focused.stopId,
    targetAngle: focused.angle,
  };
}

export function focusOnStop(stop: TimelineStop): FocusFrame {
  return {
    mode: 'locked',
    sectionId: stop.sectionId,
    stopId: stop.id,
    targetAngle: stopAngle(stop.position),
  };
}

function idleFrame(sectionId: FocusFrame['sectionId']): FocusFrame {
  return {
    mode: 'idle',
    sectionId,
    stopId: null,
    targetAngle: 0,
  };
}

function sectionAtAnchor(rects: readonly SectionRect[], anchor: number): SectionRect | null {
  let containing: SectionRect | null = null;
  let containingDistance = Infinity;
  let nearest: SectionRect | null = null;
  let nearestDistance = Infinity;

  for (const rect of rects) {
    const center = rect.top + rect.height / 2;
    const distance = Math.abs(center - anchor);
    const bottom = rect.top + rect.height;
    if (rect.top <= anchor && bottom >= anchor && distance < containingDistance) {
      containing = rect;
      containingDistance = distance;
    }
    if (distance < nearestDistance) {
      nearest = rect;
      nearestDistance = distance;
    }
  }

  return containing ?? nearest;
}

function angleAlongStops(
  stops: readonly TimelineStop[],
  progress: number,
): { stopId: string; angle: number } {
  const first = stops[0];
  if (!first || stops.length === 1) {
    return { stopId: first?.id ?? '', angle: stopAngle(first?.position ?? 0) };
  }

  const scaled = clamp(progress, 0, 1) * (stops.length - 1);
  const index = Math.min(Math.floor(scaled), stops.length - 2);
  const localProgress = scaled - index;
  const from = stops[index];
  const to = stops[index + 1];
  if (!from || !to) {
    return { stopId: first.id, angle: stopAngle(first.position) };
  }

  return {
    stopId: localProgress < 0.5 ? from.id : to.id,
    angle: lerpAngle(stopAngle(from.position), stopAngle(to.position), localProgress),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
