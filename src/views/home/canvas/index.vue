<!--  -->
<template>
  <div class="container" ref="inGraphRefCan"></div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import * as d3 from "d3";
import { Status } from "./graph/Util/constant";
import Node from "./graph/Node/Node";
import Graph from "./graph/index";
import chartData from "../data/data.json";
let inGraphRefCan = ref(null);
let graph = null;
let lengedData = [
  { back: ['#FE9800',"#FD7100"], name: "目标企业", category: "target", size: 64 },
  { back: ["#00C2FF","#116FFF"], name: "竞争企业", category: "Company", size: 52 },
  { back: ["#78FFD6","#0DD9AF"], name: "企业标签", category: "CompanyLabel", size: 21 },
  { back: ["#FFFC00","#FDB600"], name: "竞标项目", category: "BiddingProject", size: 21 },
  { back: ["#F7797D","#FF554A"], name: "软著分类", category: "Software", size: 21 },
  { back: ["#A770EF","#903AFF"], name: "专利IPC分类", category: "Patent", size: 21 },
];
const setSize = (category, nodeId, targetId) => {
  let size = 0;
  if (targetId === nodeId) {
    size = lengedData.filter((v) => v.category === "target")[0].size;
  } else {
    size = lengedData.filter((v) => v.category === category)?.[0]?.size ?? 0;
  }
  return size;
};
// 初始化
const initializeGraph = () => {
  const option = {};
  const bounding = inGraphRefCan.value.getBoundingClientRect();
  // 画布
  graph = graph || new Graph(
    inGraphRefCan.value,
    { nodes: [], edges: [] },
    bounding.width,
    bounding.height,
    option
  );
};
// 注册事件
const initializeEvent = () => {
      const canvas = graph.body.nodeContainer
      d3.select(canvas)
        .on('click', () => graph.body.emitter.emit('tap', d3.mouse(canvas), d3.event, params => {
          console.log('单击')
          clickEvent(d3.mouse(canvas), d3.event, params)
        }))
        .on('contextmenu', () => graph.body.emitter.emit('tap', d3.mouse(canvas), d3.event, params => {
          // 阻止默认右键事件
          d3.event.returnValue = false
          console.log('右键')
        }))
        .on('dblclick', () => graph.body.emitter.emit('tap', d3.mouse(canvas), d3.event, params => {
          console.log('双击')
        }))
      // 注册窗口resize事件
      d3.select(window).on('resize', () => {
        graph.body.emitter.emit('resize', document.body.clientWidth, document.body.clientHeight)
      })
    }
/** 加载数据 */
const loadData = () => {
  let obj = {
    nodes: [],
    edges: [],
  };
  obj.nodes = chartData.nodes;
  obj.nodes.forEach(v=>{
    v.label = v.properties.name
    v.type = v.properties.code == '37011363011190505584'?'target':v.labels[0]
    v.size = setSize(v.labels[0], v.properties.code, '37011363011190505584')
    v.back = lengedData.filter(l=>l.category == v.type)[0].back
    // 太平洋康 37011363011190505584
    // 澳柯玛 37021363011190726664
    
  })
  console.log(obj.nodes);
  obj.edges = chartData.links;

  // 延时
  setTimeout(() => graph.setData(obj));
};
/** 点击事件 */
const clickEvent = (coordinates, evt, obj) => {
    console.log(obj);
  if (obj && obj instanceof Node) {
    const oldStatus = obj.status;
    obj.status =
      oldStatus === Status.selection ? Status.default : Status.selection;
    graph.body.emitter.emit("click.node", evt, obj);
  }
};
onMounted(() => {
  nextTick(() => {
    initializeGraph();
    initializeEvent();
    loadData();
  });
});
</script>

<style lang="less" scoped>
.container{
    height:100%;
    width:100%;
}
</style>
