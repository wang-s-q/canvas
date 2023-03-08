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
import chartData from "../data/data2.json";
let inGraphRefCan = ref(null);
let graph = null;

// 初始化
const initializeGraph = () => {
  const option = {};
  const bounding = inGraphRefCan.value.getBoundingClientRect();
  console.log(bounding.width,bounding.height);
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
  obj.nodes = chartData.nodes.map((v) => {
    return {
      id: v.id,
      label: v.properties.name,
    };
  });
  obj.edges = chartData.links.map((v) => {
    return {
      source: v.source,
      target: v.target,
    };
  });

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
