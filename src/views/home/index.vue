<!--  -->
<template>
  <div class='out-container' ref="graphRef">
    <div class="tabs">
        <div @click="change(1)">svg</div>
        <div  @click="change(2)">canvas</div>
    </div>
    <SvgGraph v-if="activeKey ==1"></SvgGraph>
    <CanvasGraph v-if="activeKey ==2"></CanvasGraph>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fabric } from 'fabric';
import SvgGraph from './svg/index.vue'
import CanvasGraph from "./canvas/index.vue"
let graphRef = ref(null)
let activeKey = ref(2)
const change = (n) =>{
    activeKey.value = n
}



onMounted(()=>{

})
</script>

<style lang='less' scoped>
.out-container{
    width:100vw;
    height:100vh;
    position:relative;
    background: #000;
    .tabs{
        position:fixed;
        width:200px;
        z-index:9999999;
        height:20px;
        background: #fff;
        display:flex;
        left:50%;
        margin-left:-100px;
        transition: all 0.3s;
        border-radius: 0 0 5px 5px;
        div{
            flex:1;
            display:flex;
            align-items: center;
            justify-content: center;
            color:#000;
            cursor: pointer;
            &:hover{
                background: rgb(196, 196, 196);
            }
        }
        &:hover{
            height:80px;
        }
    }
}
</style>