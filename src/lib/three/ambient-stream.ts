import * as THREE from 'three';

export interface AmbientStreamOptions {
  color: THREE.Color;
  count: number;
  speed: number;
  lane: number; // -1 = left, 0 = center, 1 = right
}

export class AmbientStream {
  group: THREE.Group;
  private points: THREE.Points;
  private positions: Float32Array;
  private velocities: Float32Array;
  private phases: Float32Array;
  private baseSpeed: number;
  private paused = false;
  private count: number;
  private lane: number;

  constructor({ color, count, speed, lane }: AmbientStreamOptions) {
    this.group = new THREE.Group();
    this.baseSpeed = speed;
    this.count = count;
    this.lane = lane;

    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count);
    this.phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      this.positions[i3] = lane * 2.5 + (Math.random() - 0.5) * 1.2;
      this.positions[i3 + 1] = (Math.random() - 0.5) * 6; // spread vertically
      this.positions[i3 + 2] = (Math.random() - 0.5) * 8; // spread in depth

      this.velocities[i] = speed * (0.7 + Math.random() * 0.6);
      this.phases[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color,
      size: 0.12,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, material);
    this.group.add(this.points);
  }

  setPaused(paused: boolean) {
    this.paused = paused;
  }

  update(delta: number, elapsed: number, scrollSpeed: number) {
    if (this.paused) return;

    const scrollInfluence = 1 + Math.min(scrollSpeed, 0.15) * 2; // caps at 1.3x

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      const phase = this.phases[i];
      const vel = this.velocities[i];

      // Gentle upward float
      this.positions[i3 + 1] += vel * scrollInfluence * delta * 60;

      // Sinusoidal lateral sway
      this.positions[i3] +=
        Math.sin(elapsed * 0.8 + phase) * 0.003 * delta * 60;

      // Very gentle z-axis drift for parallax depth
      this.positions[i3 + 2] +=
        Math.sin(elapsed * 0.3 + phase * 2) * 0.001 * delta * 60;

      // Reset when particle floats above view
      if (this.positions[i3 + 1] > 4) {
        this.positions[i3 + 1] = -4 - Math.random() * 2;
        this.positions[i3] = this.lane * 2.5 + (Math.random() - 0.5) * 1.2;
        this.positions[i3 + 2] = (Math.random() - 0.5) * 8;
      }
    }

    this.points.geometry.attributes.position.needsUpdate = true;
  }

  dispose() {
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
