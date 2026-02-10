import * as THREE from 'three';

export interface DataStreamOptions {
  color: THREE.Color;
  count: number;
  speed: number;
  lane: number; // -1 = left, 0 = center, 1 = right
}

export class DataStream {
  group: THREE.Group;
  private meshes: THREE.InstancedMesh;
  private dummy: THREE.Object3D;
  private speeds: Float32Array;
  private baseSpeed: number;
  private paused = false;
  private count: number;
  private lane: number;

  constructor({ color, count, speed, lane }: DataStreamOptions) {
    this.group = new THREE.Group();
    this.baseSpeed = speed;
    this.count = count;
    this.lane = lane;
    this.dummy = new THREE.Object3D();
    this.speeds = new Float32Array(count);

    // Create instanced geometry for performance
    const geometry = new THREE.BoxGeometry(0.15, 0.04, 0.04);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    this.meshes = new THREE.InstancedMesh(geometry, material, count);

    for (let i = 0; i < count; i++) {
      const x = lane * 2.5 + (Math.random() - 0.5) * 1.2;
      const y = (Math.random() - 0.5) * 2;
      const z = -Math.random() * 30; // Spread along z-axis (towards camera)

      this.dummy.position.set(x, y, z);
      this.dummy.rotation.z = (Math.random() - 0.5) * 0.3;
      this.dummy.updateMatrix();
      this.meshes.setMatrixAt(i, this.dummy.matrix);

      this.speeds[i] = speed * (0.7 + Math.random() * 0.6);
    }

    this.meshes.instanceMatrix.needsUpdate = true;
    this.group.add(this.meshes);
  }

  setPaused(paused: boolean) {
    this.paused = paused;
  }

  update(delta: number, scrollSpeed: number) {
    if (this.paused) return;

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    for (let i = 0; i < this.count; i++) {
      this.meshes.getMatrixAt(i, matrix);
      matrix.decompose(position, rotation, scale);

      position.z += this.speeds[i] * (1 + scrollSpeed * 2) * delta * 60;

      // Reset when past camera
      if (position.z > 5) {
        position.z = -30 - Math.random() * 10;
        position.x = this.lane * 2.5 + (Math.random() - 0.5) * 1.2;
        position.y = (Math.random() - 0.5) * 2;
      }

      this.dummy.position.copy(position);
      this.dummy.quaternion.copy(rotation);
      this.dummy.scale.copy(scale);
      this.dummy.updateMatrix();
      this.meshes.setMatrixAt(i, this.dummy.matrix);
    }

    this.meshes.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    this.meshes.geometry.dispose();
    (this.meshes.material as THREE.Material).dispose();
  }
}
