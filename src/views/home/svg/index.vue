<!--  -->
<template>
  <div class="container" ref="inGraphRefSvg"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import data from "./data.json";
import data3 from "../data/data2.json";
import * as d3 from "d3";
let inGraphRefSvg = ref(null)
//增加拖拽功能
const drag = (simulation) => {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged( d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};
function init() {

  let newLinkes = data3.links;
  let newNodes = data3.nodes;
  const bounding = inGraphRefSvg.value.getBoundingClientRect()
  // newNodes.forEach(v=>{
  //     v.name = v.properties.name
  // })
  const height = bounding.height;
  const width = bounding.width;
//   const root = d3.hierarchy(data3);
//   const links = root.links();
//   const nodes = root.descendants();
  const simulation = d3
    .forceSimulation(newNodes)
    .force(
      "link",
      d3
        .forceLink(newLinkes)
        .id((d) => d.id)
        //设置距离
        .distance(300)
        //设置聚合，越小越分散
        .strength(0.1)
    )
    //设置边距
    //设置超出拉扯距离，越小越不会超出画布
    .force("charge", d3.forceManyBody().strength(-100))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  //指定容器
  const svg = d3
    .select(".container")
    .append("svg")
    //设置展示到画板中间
    .attr("viewBox", [-width / 2, -height / 2, width, height]);
  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(newLinkes)
    .join("line");

  const node1 = svg
    .append("g")
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .selectAll("circle")
    .data(newNodes)
    .join("circle")
    //给圆设置背景色
    .attr("fill", (d) => (d.children ? null : "lightgreen"))
    .attr("stroke", (d) => (d.children ? null : "lightgreen"))
    //指定圆的半径
    .attr("r", 20)
    //应用拖拽
    .call(drag(simulation));

  const node = svg
    .append("g")
    //给元素设置class属性，目前给定了元素的样式但是不生效，和style一样的疑问？？
    .attr("class", "my-class")
    .selectAll(".my-class")
    .data(newNodes)
    .join("text")
    //可以直接设置style属性，试了很多属性不起作用，除了font-size和fill属性，暂时还没找到原因？？
    .attr("style", "font-family: arial; ;")
    //设置两个text会被覆盖
    .text((d) => {
      return d.text||d.properties.name;
    })
    //应用拖拽
    .call(drag(simulation));

  // node
  //   .append("g")
  //   .append("text")
  //   .style("font-weight", 500)
  //   .style("font-family", "Arial")
  //   .style("fill", "red")
  //   .text("矩形1");

  simulation.on("tick", () => {
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;
    //线条需要用四个点来确定位置
    link
      .attr("x1", (d) => {
        // console.log(d);
        x1 = d.source.x;
        return x1;
      })
      .attr("y1", (d) => {
        y1 = d.source.y;
        return y1;
      })
      .attr("x2", (d) => {
        x2 = d.target.x;
        return x2;
      })
      .attr("y2", (d) => {
        y2 = d.target.y;
        return y2;
      });
    //设置坐标进行定位
    node
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y;
      });
    //画圆的时候需要用到的，指定cx和cy
    node1.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });

  // invalidation.then(() => simulation.stop());

  return svg.node();
}
onMounted(() => {
  init();
});
</script>

<style lang="less" scoped>
.classA {
  display: block;
  padding: 2px;
  background-color: rgb(255, 146, 127);
}
.style-text {
  display: block;
  padding: 2px;
  background-color: rgb(255, 200, 127);
}
.container{
    height:100%;
    width:100%;
}
</style>
