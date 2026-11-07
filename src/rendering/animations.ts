import type { GridPos } from '../core/types';
import { gridToScreen, lerpScreen } from './isoMath';
import type { ScreenPos } from './isoMath';

export interface Animation {
  readonly from: GridPos;
  readonly to: GridPos;
  readonly duration: number; // milliseconds
  elapsed: number;
}

export class AnimationManager {
  private animations = new Map<string, Animation>();

  /** Start a new animation for an entity. */
  startAnimation(entityId: string, from: GridPos, to: GridPos, duration: number) {
    this.animations.set(entityId, { from, to, duration, elapsed: 0 });
  }

  /** Advance all animations by dt milliseconds. */
  update(dt: number) {
    for (const [id, anim] of this.animations) {
      anim.elapsed += dt;
      if (anim.elapsed >= anim.duration) {
        this.animations.delete(id);
      }
    }
  }

  /** Get the animated screen position for an entity. Returns null if not animating. */
  getAnimatedPos(entityId: string): ScreenPos | null {
    const anim = this.animations.get(entityId);
    if (!anim) return null;

    const t = Math.min(anim.elapsed / anim.duration, 1);
    // Ease-out cubic for smoother motion
    const eased = 1 - Math.pow(1 - t, 3);
    const fromScreen = gridToScreen(anim.from);
    const toScreen = gridToScreen(anim.to);
    return lerpScreen(fromScreen, toScreen, eased);
  }

  /** Check if any animations are currently running. */
  isAnimating(): boolean {
    return this.animations.size > 0;
  }

  /** Check if a specific entity is animating. */
  isEntityAnimating(entityId: string): boolean {
    return this.animations.has(entityId);
  }

  /** Clear all animations. */
  clear() {
    this.animations.clear();
  }
}
