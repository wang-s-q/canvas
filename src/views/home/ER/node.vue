<!--  -->
<template>
  <div style="height:0">
    <div class="big-box">
      <button @click="icChange">展开</button>
      <div v-if="isShow" class="in-box" id="inBox1"></div>
      <div v-if="isShow" class="in-box2" id="inBox2"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
let emits = defineEmits(["change"]);
const isShow = ref(false);
const icChange = () => {
  isShow.value = !isShow.value;
  emits("change");
};
</script>
<script>
export default {
  name: "node-item",
};
</script>
<style lang="less" scoped>
.big-box {
  height: auto;
  width: auto;
  min-height: 0px;
  min-width: 200px;
  position: relative;
  padding: 20px;
  background: rgba(40, 63, 119, 0.07);
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #dcdfe6;
  button {
    position: absolute;
    top: 5px;
    left: 5px;
  }
  .in-box {
    height: 300px;
    width: 300px;
    background: #eb5050;
  }
  .in-box2 {
    height: 200px;
    width: 200px;
    background: #50eb6a;
  }
}
</style>
