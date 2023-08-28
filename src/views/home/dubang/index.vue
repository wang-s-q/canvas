<!--  -->
<template>
  <div class="container" ref="containerRef"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import G6 from "@antv/g6";
import GraphData from "./../data/data6.json";
let containerRef = ref(null);
let graphObj = null;
let nodeX = ref(100);
let nodeX2 = ref(100);
const levelArr = ref([]);
const nodeXArr = ref([]);
let clusterArr = ref([]);
// 初始化数据
const initData = () => {
  const bounding = containerRef.value.getBoundingClientRect();
  const height = bounding.height;
  const width = bounding.width;
  GraphData.nodes.forEach((v) => {
    v.id = v.id.toString();
    v.cluster = v.icID.substring(0, 4); // 设置节点聚类的依据
    // if (clusterArr.value.indexOf(v.cluster) !== -1) {
    //   clusterArr.value.push(v.cluster);
    // } else {
    //   v.x = nodeX2.value += 400;
    //   v.y = height / 2;
    // }
    if (v.level == 1) {
      levelArr.value.push(v);
      v.size = 60;
      v.label = v.name;
      v.fy = height / 2;
      v.fx = nodeX.value += 400;
      nodeXArr.value.push(nodeX.value);
    } else if (v.level == 2) {
      v.size = 8;
    } else if (v.level == 3) {
      v.size = 4;
    } else {
      v.size = 2;
    }
  });
  GraphData.edges.forEach((v) => {
    v.source = v.source.toString();
    v.target = v.target.toString();
  });
  // 连接一级节点
  for (let i = 0; i < levelArr.value.length; i++) {
    if (levelArr.value[i + 1]) {
      GraphData.edges.push({
        source: levelArr.value[i].id,
        target: levelArr.value[i + 1].id,
      });
    }
  }
  initGraph(loadLayoutConfig(levelArr.value, height), height, width);
};
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
      layout,
      defaultNode: {
        size: 20,
      },
      defaultEdge: {
        size: 1,
        color: "#e2e2e2",
      },
    });

  graphObj.data(GraphData);
  graphObj.render();
};
//  流水线子图布局配置
const loadLayoutConfig = (arr, height) => {
  const pipes = [];
  for (let i = 0; i < arr.length; i++) {
    const config = {
      type: "force",
      animate: true, // 设置为 false 可关闭布局动画
      //   maxSpeed: 100,//一次迭代的最大移动长度
      linkDistance: 50, //边长度
      nodeStrength: 0.9, //节点作用力
      //   edgeStrength: 200, //边的作用力（引力）大小
      clustering: true, // 是否按照聚类布局
      nodeClusterBy: "cluster", //指定节点数据中的字段名称作为节点聚类的依据
      clusterNodeStrength: 300, //使用，指定聚类向心力的大小
      gravity: 100, //中心力大小，指所有节点被吸引到 center 的力。数字越大，布局越紧凑
      centripetalOptions: {
        center: () => {
          return { x: nodeXArr.value[i], y: height / 2 };
        },
      },
    // type: 'radial',
    // unitRadius: 50,
      preventOverlap: true, // 防重叠
      //   workerEnabled: true,
      center: [nodeXArr.value[i], height / 2],
      nodesFilter: (node) => node.icID.startsWith(`040${i + 1}`),
    };
    pipes.push(config);
  }
  //   console.log(pipes);
  return { pipes };
};
if (typeof window !== "undefined")
  window.onresize = () => {
    if (!graphObj || graphObj.get("destroyed")) return;
    if (!graphObj || !graphObj.scrollWidth || !graphObj.scrollHeight) return;
    graphObj.changeSize(graphObj.scrollWidth, graphObj.scrollHeight);
  };
onMounted(() => {
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
