<!--  -->
<template>
  <div class="container" ref="containerRef"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import G6 from "@antv/g6";
import GraphData from "./../data/data6.json";
import { getLetterWidth } from "@/utils";
let containerRef = ref(null);
let graphObj = null;
let nodeX = ref(100);
let nodeX2 = ref(100);
const levelArr = ref([]);
const nodeXArr = ref([]);
let clusterArr = ref([]);
const colorList = {
  上游: ["#00C0C2", "#00DBDD"],
  中游: ["#2CBA33", "#65E872"],
  下游: ["#5388F0", "#92B7FF"],
};
/**
 * 初始化数据
 */
const initData = () => {
  const bounding = containerRef.value.getBoundingClientRect();
  const height = bounding.height;
  const width = bounding.width;
  //   let combos = [];
  GraphData.nodes.forEach((v) => {
    v.id = v.id.toString();
    // v.label = v.name;
    v.cluster = v.icID.substring(0, 4); // 设置节点聚类的依据
    // v.comboId = v.icID.substring(0, 4).toString();
    if (!clusterArr.value.includes(v.cluster)) {
      clusterArr.value.push(v.cluster);
    }
    if (v.level == 1) {
      (v.type = "level1"), levelArr.value.push(v);
      v.label = v.name;
      v.fy = height / 2;
      v.fx = nodeX.value += 400;
      nodeXArr.value.push(nodeX.value);
    } else if (v.level == 2) {
      v.type = "level2";
      v.size = 8;
    } else if (v.level == 3) {
      v.type = "level3";
      v.size = 5;
    } else {
      v.type = "level4";
      v.size = 2;
    }
  });
  //   console.log(clusterArr.value);
  //   for (let i = 0; i < nodeXArr.value.length; i++) {
  //     if (combos.every((co) => co.id != v.comboId)) {
  //       combos.push({
  //         id: v.comboId,
  //         size: 500,
  //         fixSize: [500, 500],
  //       });
  //     }
  //   }
  GraphData.edges.forEach((v) => {
    v.source = v.source.toString();
    v.target = v.target.toString();
    v.style = {
      opacity: 1,
      lineWidth: 0.5,
    };
    if (v.name == "包含") {
      v.style.stroke = "#4397F8";
    } else {
      v.type = "selArc";
      //   v.curveOffset = -100;
      v.style.stroke = "#BA68C8";
    }
    if (v.name == "上游") {
      v.style.stroke = "#00DBDD";
    }
    if (v.name == "中游") {
      v.style.stroke = "#65E872";
    }
    if (v.name == "下游") {
      v.style.stroke = "#92B7FF";
    }
  });
  //   GraphData.combos = combos;
  // 连接一级节点
  for (let i = 0; i < levelArr.value.length; i++) {
    if (levelArr.value[i + 1]) {
      GraphData.edges.push({
        source: levelArr.value[i].id,
        target: levelArr.value[i + 1].id,
        style: {
          stroke: "#FD7100",
          opacity: 1,
          lineWidth: 1.5,
        },
      });
    }
  }
  //   console.log(GraphData.edges, "GraphData.edgesGraphData.edges");
  initGraphNode();
  initGraph(loadLayoutConfig(levelArr.value, height), height, width);
};
const initGraphNode = () => {
  // 自定义节点
  // level1
  G6.registerNode(
    "level1",
    {
      draw: (cfg, group) => {
        let width = getLetterWidth(cfg.label);
        const keyShape = group.addShape("rect", {
          attrs: {
            width: width + 16,
            height: 32,
            fill: "l(0) 0:#FD7100 1:#FFAF13",
            radius: 4,
          },
        });
        group.addShape("text", {
          attrs: {
            text: `${cfg.label}`,
            fill: "#fff",
            fontSize: 14,
            x: (width + 16) / 2,
            y: 23,
            textAlign: "center",
          },
        });
        return keyShape;
      },
    },
    "rect"
  );
  // level2
  G6.registerNode(
    "level2",
    {
      draw: (cfg, group) => {
        const keyShape = group.addShape("circle", {
          attrs: {
            r: 4,
            fill: "l(0) 0:#FF928B 1:#FF665C",
            radius: 4,
          },
        });
        /* 公司 */
        group.addShape("text", {
          attrs: {
            text: `···`,
            fill: "#fff",
            fontSize: 8,
            x: 0,
            y: 4.5,
            textAlign: "center",
          },
        });
        return keyShape;
      },
    },
    "circle"
  );
  // level3
  G6.registerNode(
    "level3",
    {
      draw: (cfg, group) => {
        const keyShape = group.addShape("circle", {
          attrs: {
            r: 2.5,
            fill: `l(0) 0:${colorList[cfg.location][0]} 1:${
              colorList[cfg.location][1]
            }`,
            radius: 4,
          },
        });
        return keyShape;
      },
    },
    "circle"
  );
  // level4
  G6.registerNode(
    "level4",
    {
      draw: (cfg, group) => {
        const keyShape = group.addShape("circle", {
          attrs: {
            r: 1,
            fill: "l(0) 0:#942AC6 1:#BA68C8",
            radius: 4,
          },
        });
        return keyShape;
      },
    },
    "circle"
  );
  // 自定义边
  G6.registerEdge(
    "selArc",
    {
      draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        cfg.style.stroke = "#BA68C8";
        cfg.curveOffset = -100;
        const shape = group.addShape("path", {
          attrs: {
            path: [
              ["M", startPoint.x, startPoint.y],
              ["L", endPoint.x, endPoint.y],
            ],
          },
        });
        //   console.log(cfg);
        return shape;
      },
    },
    "arc"
  );
};
/**
 * 初始化图谱
 * @param {*} layout 图谱配置
 * @param {*} height 容器高
 * @param {*} width 容器宽
 */
const initGraph = (layout, height, width) => {
  graphObj =
    graphObj ||
    new G6.Graph({
      container: containerRef.value,
      width,
      height,
      modes: {
        default: ["zoom-canvas", "drag-canvas", "drag-node"],
      },
      //   layout,
      //   {
      //     type: "force2",
      //     animate: true, // 设置为 false 可关闭布局动画
      //     maxSpeed: 100,
      //     center:[0,0],
      //     linkDistance: 2000,
      //     clustering: true,
      //     nodeClusterBy: "cluster",
      //     clusterNodeStrength: 300,
      //   }
      defaultNode: {
        size: 1,
        anchorPoints: [
          [0.5, 0.5],
          [0.5, 0.5],
        ],
      },
      defaultEdge: {
        type: "flow-line",
        size: 1,
        color: "#e2e2e2",
      },
    });
  graphObj.data(GraphData);
  graphObj.render();
  graphObj.on("click", (evt) => {
    console.log(evt.item); //事件触发的元素，null，画布
    // 一些操作
  });
  // 子图布局
  clusterArr.value.forEach((v) => {
    setForces(v);
  });
};
/**
 * 流水线子图布局配置
 * @param {*} arr
 * @param {*} height
 */
const loadLayoutConfig = (arr, height) => {
  const pipes = [];
  for (let i = 0; i < arr.length; i++) {
    const config = {
      type: "force2",
      animate: true, // 设置为 false 可关闭布局动画
      maxSpeed: 1000, //一次迭代的最大移动长度
      linkDistance: 50, //边长度
      //   nodeStrength: 1000, //节点作用力
      //   edgeStrength: 200, //边的作用力（引力）大小
      //   leafCluster: true,
      //   //   clustering: true, // 是否按照聚类布局
      //   nodeClusterBy: "cluster", //指定节点数据中的字段名称作为节点聚类的依据
      //   clusterNodeStrength: 10, //使用，指定聚类向心力的大小
      //   // gravity: 100, //中心力大小，指所有节点被吸引到 center 的力。数字越大，布局越紧凑
      //   factor: 1,
      //   centripetalOptions: {
      //     center: () => {
      //       return { x: nodeXArr.value[i], y: height / 2 };
      //     },
      //   },
      preventOverlap: false, // 防重叠
      //   workerEnabled: true,
      center: [nodeXArr.value[i], height / 2],
      nodesFilter: (node) => node.icID.startsWith(`040${i + 1}`),
    };
    pipes.push(config);
  }
  //   console.log(pipes);
  return { pipes };
};
/**
 * 子图布局
 */
const setForces = (nodeId) => {
  const nodes = GraphData.nodes;
  const edges = GraphData.edges;
  const newNodes = [];
  const newEdges = [];
  const newNodeMap = new Map();
  // fix the nodes[0]
  //   nodes[0].fx = nodes[0].x;
  //   nodes[0].fy = nodes[0].y;
  // add the nodes which should be re-layout
  let targetNode = null;
  nodes.forEach(function (node, i) {
    if (node.cluster == nodeId) {
      newNodes.push(node);
      newNodeMap.set(node.id, i);
    }
    if (node.icID == nodeId) {
      targetNode = node;
    }
  });
  // add related edges
  edges.forEach(function (edge) {
    const sourceId = edge.source;
    const targetId = edge.target;
    if (
      newNodeMap.get(sourceId) !== undefined &&
      newNodeMap.get(targetId) !== undefined
    ) {
      newEdges.push(edge);
    }
  });

  const subForceLayout = new G6.Layout.force({
    center: [targetNode.fx, targetNode.fy],
    linkDistance: 10, //边长度
    collideStrength: 1, //防止重叠的力强度，范围 [0, 1]
    nodeStrength: -5, //节点作用力，正数代表节点之间的引力作用，负数代表节点之间的斥力作用
    edgeStrength: 0.5, //边的作用力，范围是 0 到 1，默认根据节点的出入度自适应
    nodeSpacing: 10,
    preventOverlap: true,
    tick: function tick() {
      // tick函数显示布局过程的动画
      graphObj.refreshPositions();
    },
  });
  subForceLayout.init({
    nodes: newNodes,
    edges: newEdges,
  });
  subForceLayout.execute();
};
if (typeof window !== "undefined")
  window.onresize = () => {
    if (!graphObj || graphObj.get("destroyed")) return;
    if (!graphObj || !graphObj.scrollWidth || !graphObj.scrollHeight) return;
    graphObj.changeSize(graphObj.scrollWidth, graphObj.scrollHeight);
  };
onMounted(() => {
  // initData-->
  initData();
});
</script>

<style lang="less" scoped>
* {
  color: #fff;
}
.container {
  height: 100%;
  width: 100%;
  background: #fff;
}
</style>
