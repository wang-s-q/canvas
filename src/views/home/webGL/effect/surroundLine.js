import * as THREE from "three";
import { color } from "../config/index";
export class SurroundLine {
  constructor(scene, child, height) {
    this.scene = scene;
    this.child = child;
    this.height = height;
    this.createMesh();
    this.createLine();
  }
  // 计算高度差
  computedMesh() {
    this.child.geometry.computeBoundingBox();
    this.child.geometry.computeBoundingSphere();
  }
  createMesh() {
    this.computedMesh();
    const { max, min } = this.child.geometry.boundingBox;
    // 高度差
    const size = max.z - min.z;
    // 材质
    // const material = new THREE.MeshLambertMaterial({color:"#ff0000"});//#2f5478 //#1B3045
    const material = new THREE.ShaderMaterial({
      uniforms: {
        // 当前扫描的高度
        u_height: this.height,
        // 扫描线条的颜色
        u_up_color: {
          value: new THREE.Color(color.risingColor),
        },
        // 建筑物模型颜色
        u_city_color: {
          value: new THREE.Color(color.mesh),
        },
        // 建筑物头部颜色
        u_head_color: {
          value: new THREE.Color(color.head),
        },
        u_size: {
          value: size,
        },
      },
      vertexShader: `
          varying vec3 v_position;
          void main() {
            v_position = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
      fragmentShader: `
          varying vec3 v_position;
          uniform vec3 u_city_color;
          uniform vec3 u_head_color;
          uniform float u_size;

          uniform vec3 u_up_color;
          uniform float u_height;
          void main() {
            vec3 base_color = u_city_color;
            base_color = mix(base_color, u_head_color, v_position.z / u_size);

            // 上升线条高度
            if(u_height > v_position.z && u_height < v_position.z + 6.0){
                float f_index = (u_height - v_position.z) / 3.0;
                base_color = mix(u_up_color, base_color, abs(f_index - 1.0));
            }

            gl_FragColor = vec4(base_color, 1.0);
          }
      `,
    });
    const mesh = new THREE.Mesh(this.child.geometry, material);

    // 继承child 的旋转、缩放、平移
    mesh.position.copy(this.child.position);
    mesh.rotation.copy(this.child.rotation);
    mesh.scale.copy(this.child.scale);
    this.scene.add(mesh);
  }
  // 创建外围线条
  createLine() {
    // 获取建筑物外围
    const geometry = new THREE.EdgesGeometry(this.child.geometry);
    // api创建
    // const material = new THREE.LineBasicMaterial({ color: color.soundLine });
    // 自定义线条创建
    const material = new THREE.ShaderMaterial({
      uniforms: {
        line_color: {
          value: new THREE.Color(color.soundLine),
        },
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 line_color;
        void main() {
          gl_FragColor = vec4(line_color, 1.0);
        }
      `,
    });
    // 创建线条
    const line = new THREE.LineSegments(geometry, material);
    // 继承建筑物偏移和旋转
    line.scale.copy(this.child.scale);
    line.rotation.copy(this.child.rotation);
    line.position.copy(this.child.position);

    this.scene.add(line);
  }
}
