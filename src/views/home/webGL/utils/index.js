import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// 创建加载器
const fbxLoader = new FBXLoader();
export const loadFBX = (url) => {
  return new Promise((res, rej) => {
    fbxLoader.load(
      url,
      (obj) => {
        res(obj);
      },
      () => {},
      (error) => {
        rej(error);
      }
    );
  });
};
