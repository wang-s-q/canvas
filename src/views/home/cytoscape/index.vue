<!--  -->
<template>
  <div class="container" ref="inGraphRefE"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import cytoscape from "cytoscape";
import data from "./../data/data.json";
let graph = ref(null);
let inGraphRefE = ref(null);
const init = () => {
  graph.value = cytoscape({
    container: inGraphRefE.value,
    layout: {
      name: "cose",
    },
    style: [
      {
        selector: "node",
        css: {
          content: "data(name)",
          color: "white",
          "text-valign": "center",
          "text-outline-color": "#6699FF",
          "background-color": "#6699FF",
          height: 60,
          width: 60,
          "font-size": "14px",
          "font-weight": "bold",
        },
      },

      {
        selector: "edge",
        css: {
          content: "data(relationship)",
          "curve-style": "bezier", //曲线类型为贝塞尔曲线
          "target-arrow-shape": "triangle",
          "line-color": "#CCCCCC",
          width: 1,
          "font-size": "14px",
          color: "#fff",
        },
      },
    ],
    elements: {
      //   nodes: {
      //     data: {
      //       group: "nodes", // 'nodes'是节点元素, 'edges'是边线元素
      //       //group字段可以自动推断出来，但是指定它会在初始化元素时给您很好的调试消息
      //       position: {
      //         //节点的模型位置(初始化时可选，初始化后必选)
      //         x: 100,
      //         y: 100,
      //       },
      //       selected: false, // 元素是否被选中(默认为false)
      //       selectable: true, // 选择状态是否可变(默认为true)
      //       locked: false, // 锁定时，节点的位置是不可变的(默认为false)
      //       grabbable: true, // 节点是否可以被用户抓取和移动
      //       pannable: false, //拖动节点是否会导致平移而不是抓取
      //       classes: ["foo", "bar"], //元素的类名数组(或空格分隔的字符串)
      //       renderedPosition: { x: 200, y: 200 }, //可以选择指定位置在屏幕上渲染像素
      //       pannable: true // 拖动边缘是否会导致平移

      //     },
      //   },
      nodes: data.nodes.map((v) => {
        return {
          data: {
            id: v.id,
            name: v.properties.name,
          },
        };
      }),
      // {data: { id: "e1", relationship: "照顾1", source: "n2", target: "n1" },},
      edges: data.links.map((v) => {
        return {
          data: {
            id: v.id,
            relationship: v.properties.relationName,
            source: v.source,
            target: v.target,
          },
        };
      }),
    },
  });
  graph.value.nodes().on("click", (evt) => {
    console.log(evt);
  });
  graph.value.edges().on("click", (evt) => {
    console.log(evt);
  });
};

onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
}
</style>
