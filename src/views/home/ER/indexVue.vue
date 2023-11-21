<!--  -->
<template>
  <div class="er-container-box" ref="container">
    <div class="er-container" ref="X6Ref">111</div>
    <TeleportContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Graph, Node, Model } from "@antv/x6";
import { DagreLayout } from "@antv/layout";
import { register, getTeleport } from "@antv/x6-vue-shape";
import { Group, defaultConfig } from "./config";
import GraphData from "./data.json";
import NodeTT from "./node.vue";
const X6Ref = ref();
const container = ref();
let graph = null as any;
register({
  shape: "custom-vue-node",
  width: 100,
  height: 100,
  component: NodeTT,
});
const TeleportContainer = getTeleport();
// ----------------------------------------------------------------------------------------------------------------
const initGraph = () => {
  let bounding = X6Ref.value.getBoundingClientRect();
  graph = new Graph({
    container: X6Ref.value,
    width: bounding.width,
    height: bounding.height,
    ...defaultConfig,
    background: {
      color: "#F2F7FA",
    },
    autoResize: true,
  });
  drawNode();
  createEdge("edge1", "graph-0", "graph-1");
  //   graph.addNode({
  //     shape: "custom-vue-node",
  //     x: 100,
  //     y: 60,
  //   });
};
// 一级坐标
let level1PointXArr: Array<number> = [];
let level1PointX = -400;
let level1PointY = 100;
// 绘制子节点-递归
const drawNode = () => {
  GraphData.nodes.forEach((v, i) => {
    let newX = (level1PointX += 500);
    level1PointXArr.push(newX);
    graph.addNode({
      id: "graph-" + i,
      shape: "custom-vue-node",
      x: newX,
      y: level1PointY,
    });
  });
};
function createEdge(
  id: string,
  source: string,
  target: string,
  vertices?: { x: number; y: number }[]
) {
  return graph.addEdge({
    id,
    source,
    target,
    vertices,
    label: id,
    attrs: {
      label: {
        fontSize: 12,
      },
    },
  });
}
const resizeGraph = () => {
  let bounding = container.value.getBoundingClientRect();
  if (graph) {
    graph.resize(bounding.width, bounding.height);
  }
};
onMounted(() => {
  window.addEventListener("resize", resizeGraph);
  initGraph();
  //   initData();
  //   initDagreData();
  //   drawDagreGraph();
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeGraph);
});
</script>

<style lang="less" scoped>
.er-container-box {
  height: 100%;
  width: 100%;
  background: #fff;
}
.er-container {
  height: 100%;
  width: 100%;
  //   background: #fff;
}
</style>
