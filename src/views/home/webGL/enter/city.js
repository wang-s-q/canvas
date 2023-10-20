import { loadFBX } from "../utils/index";
export class City {
  constructor(scene) {
    this.scene = scene;
    this.loadCity();
  }
  loadCity() {
    //加载模型并渲染
    loadFBX("/src/model/sehir.fbx").then((obj) => {
        this.scene.add(obj)
    });
  }
  start() {
    //----
  }
}
