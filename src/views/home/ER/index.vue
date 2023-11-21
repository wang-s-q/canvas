<!--  -->
<template>
  <div class="er-container-box" ref="container">
    <relation-graph ref="graphRef" :options="options">
      <div class="er-container">
        <NodeTT
          style="margin-left: 100px"
          v-for="tree in GraphData.nodes"
          :key="tree.id"
          :id="'analy' + tree.id"
          @change="nodeChange"
        ></NodeTT>
      </div>
    </relation-graph>
  </div>
</template>

<script setup>
import RelationGraph from "relation-graph/vue3";
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import NodeTT from "./node.vue";
import GraphData from "./data.json";

const graphRef = ref();
const options = {
  debug: false,
  allowShowMiniToolBar: false,
  //   allowSwitchLineShape: true,
  //   allowSwitchJunctionPoint: true,
  //   allowShowDownloadButton: true,
  //   defaultJunctionPoint: "border",
  //   placeOtherNodes: false,
  //   placeSingleNode: false,
  graphOffset_x: -400,
  graphOffset_y: -200,
  defaultLineMarker: {
    markerWidth: 8,
    markerHeight: 8,
    refX: 3,
    refY: 3,
    data: "M 0 0, V 6, L 4 3, Z",
  },
  //   layout: {
  //     layoutName: "fixed",
  //   },
};
//---------------------------
// const showGraph = () => {
//   const graphInstance = graphRef.value.getInstance();
//   // 为了导出图片，定义两个看不见的节点，节点的位置决定了能导出的范围
//   // In order to export the picture, define two invisible nodes. The position of the node determines the range that can be exported.
//   graphInstance.addNodes([
//     { id: "startNode", text: "", opacity: 0, x: -300, y: -300 },
//     { id: "endNode", text: "", opacity: 0, x: 700, y: 700 },
//   ]);
//   setTimeout(() => {
//     // Wait dom ready
//     onGroupClick("a");
//   }, 200);
// };
const addEdge = (from, to) => {
  const htmlElementLines = [];
  htmlElementLines.push({
    from: "analy" + from,
    to: "analy" + to,
    color: "#A5B9D9",
    lineWidth: 1,
    lineShape: 6,
    // animation: 2,
  });
  const graphInstance = graphRef.value.getInstance();
  graphInstance.clearElementLines();
  graphInstance.addElementLines(htmlElementLines);
};
const nodeChange = () => {
  drawGraph();
  // addEdge()
};
// 绘制
const drawGraph = () => {
  GraphData.edges.forEach((edge, i) => {
    addEdge(edge.src, edge.dest);
  });
};
onMounted(() => {
  nextTick(() => {
    drawGraph();
  });
  //   graphRef.value.setJsonData(jsonData);
});
onBeforeUnmount(() => {});
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
  color: #000;
  display: flex;
  .er-item {
    height: 40px;
    width: auto;
    &:nth-of-type(2) {
      margin-left: 200px;
      margin-top: 100px;
    }
  }
  //   background: #fff;
}
</style>
