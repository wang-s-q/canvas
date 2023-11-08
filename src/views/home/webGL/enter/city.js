import { loadFBX } from "../utils/index";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { SurroundLine } from "../effect/surroundLine";
import { Background } from "../effect/background";
export class City {
  constructor(scene, camera,controls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.tweenPosition = null;
    this.tweenRotation = null;
    this.height = {
      value: 5,
    };
    this.loadCity();
  }
  loadCity() {
    //加载模型并渲染
    loadFBX("/src/model/XG3.fbx").then((obj) => {
      obj.traverse((child) => {
        if (child.isMesh) {
          new SurroundLine(this.scene, child, this.height);
        }
      });
      this.initEffect();
    });
  }

  initEffect() {
    new Background(this.scene);
    // 添加点击选择
    this.addClick();
    this.addWhell()
  }
  addWhell() {
    const body = document.body;
    body.onmousewheel = (event) => {
      const value = 30;
      // 鼠标当前坐标信息
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      const vector = new THREE.Vector3(x, y, 0.5);
      vector.unproject(this.camera);
      vector.sub(this.camera.position).normalize();
      if (event.wheelDelta > 0) {
        this.camera.position.x += vector.x * value;
        this.camera.position.y += vector.y * value;
        this.camera.position.z += vector.z * value;

        this.controls.target.x += vector.x * value;
        this.controls.target.y += vector.y * value;
        this.controls.target.z += vector.z * value;
      } else {
        this.camera.position.x -= vector.x * value;
        this.camera.position.y -= vector.y * value;
        this.camera.position.z -= vector.z * value;

        this.controls.target.x -= vector.x * value;
        this.controls.target.y -= vector.y * value;
        this.controls.target.z -= vector.z * value;
      }
    };
  }
  addClick() {
    let flag = true;
    document.onmousedown = () => {
      flag = true;
      document.onmousemove = () => {
        flag = false;
      };
    };
    document.onmouseup = (event) => {
      if (flag) {
        this.clickEvent(event);
      }
      document.onmousemove = null;
    };
  }
  clickEvent(event) {
    //获取到浏览器坐标
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 + 1;
    // 创建设备坐标（三维）
    const standarVector = new THREE.Vector3(x, y, 0.5);
    // 转化为世界坐标
    const worldVector = standarVector.unproject(this.camera);
    // 做序列化
    const ray = worldVector.sub(this.camera.position).normalize();
    // 点击选中
    // 创建射线发射器，发射一条射线
    const raycaster = new THREE.Raycaster(this.camera.position, ray);
    //返回射线碰撞到的物体
    const intersects = raycaster.intersectObjects(this.scene.children, true);
    let point3d = null;
    if (intersects.length) {
      point3d = intersects[0];
    }
    if (point3d) {
      // 距离倍数
      const propportin = 1;
      // 开始动画修改观察点
      const time = 3000;
      this.tweenPosition = new TWEEN.Tween(this.camera.position)
        .to(
          {
            x: point3d.point.x * propportin,
            y: point3d.point.y * propportin,
            z: point3d.point.z * propportin,
          },
          time
        )
        .start();
      this.tweenRotation = new TWEEN.Tween(this.camera.rotation)
        .to(
          {
            x: this.camera.rotation.x,
            y: this.camera.rotation.y,
            z: this.camera.rotation.z,
          },
          time
        )
        .start();
    }
  }
  start() {
    if (this.tweenPosition && this.tweenRotation) {
      this.tweenPosition.update();
      this.tweenRotation.update();
    }
    this.height.value += 0.4;
    if (this.height.value > 420) {
      this.height.value = 5;
    }
    //----
  }
}
