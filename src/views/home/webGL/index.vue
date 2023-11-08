<!--  -->
<template>
  <div class="web-gl-container">
    <canvas id="webgl"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { initCity } from "./enter/index";
onMounted(() => {
  initCity();
});
</script>

<style lang="less" scoped>
.web-gl-container {
  width: 100%;
  height: 100%;
  background: #000;
  position: relative;
  z-index: 4;
  overflow: hidden;
  #webgl{
    position: relative;
    z-index: 2;
  }
//   &::before {
//     position: absolute;
//     top: 0;
//     left: 0;
//     content: "";
//     width: 100%;
//     height: 100%;
//     background-image: linear-gradient(
//         0deg,
//         #1f2733 0px,
//         #1f2733 1px,
//         transparent 1px,
//         transparent 100px
//       ),
//       linear-gradient(
//         90deg,
//         #1f2733 0px,
//         #1f2733 1px,
//         transparent 1px,
//         transparent 100px
//       );
//     background-size: 40px 40px;
//     // opacity: 0.1;
//     // z-index: 1;
//   }
}
</style>
