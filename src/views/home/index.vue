<!--  -->
<template>
  <div class="out-container" ref="graphRef">
    <div class="tabs">
      <div @click="change(1)">d3-svg</div>
      <div @click="change(2)">d3-canvas</div>
      <div @click="change(3)">g6</div>
      <div @click="change(4)">cytoscape</div>
      <div @click="change(5)">产业画像</div>
      <div @click="change(6)">webGL</div>
    </div>
    <SvgGraph v-if="activeKey == 1"></SvgGraph>
    <CanvasGraph v-if="activeKey == 2"></CanvasGraph>
    <G6Graph v-if="activeKey == 3"></G6Graph>
    <Cytoscape v-if="activeKey == 4"></Cytoscape>
    <Dubang v-if="activeKey == 5"></Dubang>
    <WebGL v-if="activeKey == 6"></WebGL>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fabric } from "fabric";
import SvgGraph from "./svg/index.vue";
import CanvasGraph from "./canvas/index.vue";
import G6Graph from "./g6/index.vue";
import Cytoscape from "./cytoscape/index.vue";
import Dubang from "./dubang/index.vue";
import WebGL from "./webGL/index.vue"
let graphRef = ref(null);
let activeKey = ref(6);
const change = (n) => {
  activeKey.value = n;
};

onMounted(() => {});
</script>

<style lang="less" scoped>
.out-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #000;
  .tabs {
    position: fixed;
    width: 500px;
    z-index: 9999999;
    height: 20px;
    background: #fff;
    display: flex;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.3s;
    border-radius: 0 0 5px 5px;
    div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      cursor: pointer;
      &:hover {
        background: rgb(196, 196, 196);
      }
    }
    &:hover {
      height: 80px;
    }
  }
}
</style>
