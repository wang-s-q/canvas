<!--  -->
<template>
  <div class="er-container-box" ref="container">
    <div class="er-container" ref="X6Ref">111</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Graph, Node, Model } from "@antv/x6";
import { DagreLayout } from "@antv/layout";
import { register, getTeleport } from "@antv/x6-vue-shape";
import { Group, defaultConfig } from "./config";
import GraphData from "./data.json";
const X6Ref = ref();
const container = ref();
let graph = null as any;

// 设置node属性
// function updateTreeIteratively(root: any, childKey = "children") {
//   let queue = [root];
//   while (queue.length > 0) {
//     let node = queue.shift();
//     node.shape = "rect";
//     node.width = 100;
//     node.height = 32;
//     node.label = node.name;
//     node.attrs = {
//       body: {
//         fill: "#5F95FF",
//         stroke: "transparent",
//       },
//       label: {
//         fill: "#ffffff",
//       },
//     };
//     if (node[childKey]) {
//       queue.push(...node[childKey]);
//     }
//   }
// }
// const initDagreData = () => {
//   GraphData.nodes.forEach((v) => {
//     updateTreeIteratively(v, "childrenNode");
//   });
//   GraphData.edges.forEach((v) => {
//     v.source = v.src;
//     v.target = v.dest;
//     v.attrs = {
//       line: {
//         stroke: "#A2B1C3",
//         strokeWidth: 1,
//       },
//     };
//   });
// };
// const drawDagreGraph = () => {
//   let bounding = X6Ref.value.getBoundingClientRect();
//   graph = new Graph({
//     container: X6Ref.value,
//     width: bounding.width,
//     height: bounding.height,
//     ...defaultConfig,
//     grid: true,
//   });
//   const dagreLayout = new DagreLayout({
//     type: "dagre",
//     rankdir: "LR",
//     align: "UL",
//     ranksep: 35,
//     nodesep: 15,
//   });
//   const model = dagreLayout.layout(GraphData as any);
//   graph.fromJSON(model);
// };
// 视口变换

// ----------------------------------------------------------------------------------------------------------------
const initGraph = () => {
  let bounding = X6Ref.value.getBoundingClientRect();
  graph = new Graph({
    container: X6Ref.value,
    width: bounding.width,
    height: bounding.height,
    ...defaultConfig,
  });
};
/**
 *
 * @param id id
 * @param x x轴坐标
 * @param y y轴坐标
 * @param width 宽度
 * @param height 高度
 * @param fill 填充色
 * @param stroke 边框色
 */
function createGroup(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  stroke: string
) {
  const group = new Group({
    id,
    x,
    y,
    width,
    height,
    attrs: {
      body: { fill, stroke },
      label: { text: id },
    },
  });
  graph.addNode(group);
  return group;
}

function createNode(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string
) {
  return graph.addNode({
    id,
    x,
    y,
    width,
    height,
    attrs: {
      body: {
        fill: fill || "blue",
        stroke: "none",
      },
      label: {
        text: id,
        fill: "#fff",
        fontSize: 12,
      },
    },
  });
}

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
// 绘制子节点-队列
// const drawChildNode = (root: any, childKey = "children") => {
//   let queue = [root];
//   while (queue.length > 0) {
//     // 节点数据
//     let nodeItem = queue.shift();

//     if (nodeItem[childKey]) {
//       queue.push(...nodeItem[childKey]);
//     }
//   }
// };
// 一级坐标
let level1PointXArr: Array<number> = [];
let level1PointX = -400;
let level1PointY = 100;
// 绘制子节点-递归
const drawChildNode = (arr: any, group?: any) => {
//     console.log(arr);
    
//   arr.forEach((v: any, i: number) => {

//     let inGroup = createGroup(
//       v.name,
//       level1PointXArr[i] + 10,
//       level1PointY + 20,
//       300,
//       100,
//       "#daf4fa",
//       "#a7c7ce"
//     );
//     group.addChild(inGroup);
//     if (v.childrenNode) {
//       drawChildNode(v.childrenNode,inGroup);
//     }
    
//   });
};
const initData = () => {
  GraphData.nodes.forEach((v, i) => {
    let newX = (level1PointX += 500);
    level1PointXArr.push(newX);
    let level1Group = createGroup(
      v.name,
      newX,
      level1PointY,
      420,
      240,
      "#daf4fa",
      "#a7c7ce"
    );
    if (v.childrenNode) {
      drawChildNode(v.childrenNode, level1Group);
    }
    // drawChildNode(v,'childrenNode')
  });
  // const a = createGroup("a1111", 100, 40, 420, 240, "#daf4fa", "#a7c7ce");
  // const aa = createGroup("aa", 150, 100, 160, 120, "#47C769", "none");
  // const aaa = createGroup("aaa", 180, 150, 100, 50, "#3199FF", "none");
  // const c = createNode("c", 400, 180, 60, 40, "orange")
  // a.addChild(aa);
  // aa.addChild(aaa);
  // a.addChild(c);

  // createNode("d", 580, 140, 60, 40, "#000");

  createEdge("edge1", "数仓库元数据", "业务库元数据");
  //   createEdge("edge3", "d", "c", [
  // { x: 60, y: 140 },
  // { x: 60, y: 220 },
  //   ]);
  //   aa.addChild(
  //     createEdge("edge2", "aa", "aaa", [
  //       { x: 60, y: 140 },
  //       { x: 60, y: 220 },
  //     ])
  //   );
  // 展开收起
  graph.on("node:collapse", ({ node }: { node: Group }) => {
    node.toggleCollapse();

    const collapsed = node.isCollapsed();
    const collapse = (parent: Group) => {
      const cells = parent.getChildren();
      if (cells) {
        cells.forEach((cell) => {
          if (collapsed) {
            cell.hide();
          } else {
            cell.show();
          }

          if (cell instanceof Group) {
            if (!cell.isCollapsed()) {
              collapse(cell);
            }
          }
        });
      }
    };

    collapse(node);
  });
};
const resizeGraph = () => {
  let bounding = container.value.getBoundingClientRect();
  if (graph) {
    graph.resize(bounding.width, bounding.height);
  }
};
onMounted(() => {
  window.addEventListener("resize", resizeGraph);
  initGraph();
  initData();
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
