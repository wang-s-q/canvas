<!--  -->
<template>
  <div
    @click="setNode"
    style="height: 30px; width: 100px; background: #fff; color: #000"
  >
    btn
  </div>
  <div class="g6-container" ref="g6Ref"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import G6 from "@antv/g6";
import data from "../data/data2.json";
let props = defineProps({
  // 关系图数据
  chartData: {
    type: Object,
    default: () => null,
  },
  // 目标企业id
  targetId: {
    type: [String, Number],
    default: "37011363011190505584",
  },
  // 是否显示关系名
  relation: {
    type: Boolean,
    default: false,
  },
});
// import data from "../data/g6data.json";
const setSize = (category, nodeId, targetId) => {
  let size = 0;
  if (targetId === nodeId) {
    size = lengedData.filter((v) => v.category === "target")[0].size;
  } else {
    size = lengedData.filter((v) => v.category === category)?.[0]?.size ?? 0;
  }
  return size;
};
const globalFontSize = 12;
let lengedData = [
  {
    back: ["#FE9800", "#FD7100"],
    name: "目标企业",
    category: "target",
    size: 64,
  },
  {
    back: ["#00C2FF", "#116FFF"],
    name: "竞争企业",
    category: "Company",
    size: 52,
  },
  {
    back: ["#78FFD6", "#0DD9AF"],
    name: "企业标签",
    category: "CompanyLabel",
    size: 21,
  },
  {
    back: ["#FFFC00", "#FDB600"],
    name: "竞标项目",
    category: "BiddingProject",
    size: 21,
  },
  {
    back: ["#F7797D", "#FF554A"],
    name: "软著分类",
    category: "Software",
    size: 21,
  },
  {
    back: ["#A770EF", "#903AFF"],
    name: "专利IPC分类",
    category: "Patent",
    size: 21,
  },
];
let g6Ref = ref(null);
let graphObj = {
  graph: null,
};
const initGraph = () => {
  let newData = {
    nodes: data.nodes,
    edges: data.links,
  };
  // 节点属性配置
  newData.nodes.forEach((v) => {
    v.id = v.id.toString();
    v.nodeType = v.properties.code == props.targetId ? "target" : v.labels[0];
    v.size = setSize(v.labels[0], v.properties.code, props.targetId);
    v.back = lengedData.filter((l) => l.category == v.nodeType)[0].back;
    v.label =
      v.size > 30
        ? fittingString(v.properties.name, v.size, globalFontSize)
        : fittingString2(v.properties.name, 150, globalFontSize, 3);
    v.type = "rectNode"; // 自定义节点样式
  });
  // 关系线配置
  newData.edges.forEach((v) => {
    v.source = v.source.toString();
    v.target = v.target.toString();
    v.label = v.properties.relationName;
    v.labelCfg = {
      autoRotate: false, // 是否跟随节点旋转，true能感觉到明显卡顿
      style: {
        fill: "#116FFF",
      },
    };
    v.style = {
      lineWidth: 1,
      strokeStyle: "rgba(0, 154, 252, 0.5)",
      endArrow: false,
    };
  });
  G6.Util.processParallelEdges(newData.edges); //  处理多条关系
  // 自定义属性参考 https://www.bookstack.cn/read/g2-4.x/a21b5fb2c6bedf8f.md
  G6.registerNode("rectNode", {
    draw: (cfg, group) => {
      // 目标企业
      if (cfg.nodeType == "target") {
        // 小圈
        group.addShape("circle", {
          draggable: true,
          name: "l-shape",
          attrs: {
            r: cfg.size * 0.9,
            fill: "r(0.5,0.5,0.6) 0.5:rgba(255, 255, 255, 0.4) 0.8:rgba(254, 152, 0, 0.1) 1:rgba(253, 113, 0, 0.01)",
          },
        });
        // 中圈
        group.addShape("circle", {
          draggable: true,
          name: "m-shape",
          attrs: {
            r: cfg.size * 1.2,
            blur: 10,
            fill: "r(0.5,0.5,0.6) 0.65:rgba(253, 113, 0, 0.1) 0.8:rgba(254, 152, 0, 0.1) 1:rgba(253, 113, 0, 0.01)",
          },
        });
        // 大圈
        group.addShape("circle", {
          draggable: true,
          name: "b-shape",
          attrs: {
            r: cfg.size * 1.5,
            blur: 10,
            fill: "r(0.5,0.5,0.6) 0.65:rgba(253, 113, 0, 0.1) 0.9:rgba(254, 152, 0, 0.1) 1:rgba(253, 113, 0, 0.01)",
          },
        });
      }
      // 链主企业-标签
      if (cfg.properties.attrname == "链主企业") {
        group.addShape("image", {
          draggable: false,
          name: "tag-shape",
          attrs: {
            img: "/lz2.png",
            width: 70,
            height: 18,
            x: -35,
            y: 40,
          },
        });
      }
      // --------基本---------
      //最外面的那层
      const shape = group.addShape("circle", {
        draggable: true,
        name: "out-shape",
        attrs: {
          fill: `l(90) 0:${cfg.back[1]} 1:${cfg.back[0]}`,
          r: cfg.size / 2,
          shadowColor:
            cfg.nodeType != "target" ? cfg.back[1] : "rgba(255,255,255,0.5)",
          shadowBlur: cfg.nodeType != "target" ? 20 : 30,
        },
      });
      //里面的那层
      group.addShape("circle", {
        draggable: true,
        name: "in-shape",
        attrs: {
          r: cfg.size / 2,
          fill: "r(0.5,0.5,0.6) 0.7:rgba(255,255,255,0) 1:rgba(255,255,255,0.1)",
        },
      });
      //文字
      group.addShape("text", {
        draggable: true,
        name: "text-shape",
        attrs: {
          textBaseline: "center",
          textAlign: "center",
          y: cfg.size > 30 ? 0 : cfg.size * 2,
          x: 0,
          // lineHeight: 10,
          text: cfg.label,
          fill: "#fff",
        },
      });

      return shape;
    },
  });
  let bounding = g6Ref.value.getBoundingClientRect();
  // 关系图实例
  graphObj.graph = graphObj.graph || new G6.Graph({
    container: g6Ref.value,
    width: bounding.width,
    height: bounding.height,
    modes: {
      default: [
        "drag-node",
        {
          type: "zoom-canvas",
          enableOptimize: true,
        },
        {
          type: "drag-canvas",
          enableOptimize: true,
        },
      ],
    },
    // renderer:'svg',
    animate: true,
    defaultNode: {
      size: 64,
      style: {
        lineWidth: 2,
        stroke: "#5B8FF9",
        fill: "#C6E5FF",
      },
    },
    defaultEdge: {
      size: 1,
      color: "#e2e2e2",
      style: {
        // endArrow: {
        //   path: "M 0,0 L 8,4 L 8,-4 Z",
        //   fill: "#e2e2e2",
        // },
      },
    },
    layout: {
      type: "force",
      preventOverlap: true,
      linkDistance: 150,
      nodeStrength: -800,
      //   preventOverlap:true, // 是否防止重叠
      //   collideStrength:0.1, // 防止重叠的力强度，范围 [0, 1]
      //   alpha: 0.3, // 当前的迭代收敛阈值
      //   alphaDecay: 0.028, // 迭代阈值的衰减率。范围 [0, 1]。0.028 对应迭代数为 300
      //   alphaMin: 0.001, // 停止迭代的阈值
    },
  });
  graphObj.graph.data(newData);
  graphObj.graph.on("node:click", (evt) => {
    const node = evt.item;
    const model = node.getModel();
    if (model.nodeType == "target") return;
    console.log(model);
    // 一些操作
  });
  graphObj.graph.render();
  // 画布大小根据窗口变化
  if (typeof window !== "undefined")
    window.onresize = () => {
      if (!graphObj.graph || graphObj.graph.get("destroyed")) return;
      if (!g6Ref.value || !g6Ref.value.scrollWidth || !g6Ref.value.scrollHeight)
        return;
      graphObj.graph.changeSize(
        g6Ref.value.getBoundingClientRect().width,
        g6Ref.value.getBoundingClientRect().height
      );
    };
};
onMounted(() => {
  initGraph();
});
onBeforeUnmount(() => {});
const setNode = () => {
  let arr = graphObj.graph.getNodes();
  arr.forEach((v) => {
    let model = v.getModel();
    // graphObj.graph.setItemState(model.id, 'selected', true)
    // v.getModel().opacity = 0.1;
    // v.getModel().fillOpacity = 0.1;
    // console.log(v.getModel());
    graphObj.graph.updateItem(v, {
      style: {
        fill: "green",
        stroke: "green",
        opacity: 0.5,
        fillOpacity: 0.5,
      },
    });
  });
};
/**
 * 处理长文本 超出隐藏显示省略号
 * @param {string} str The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @return {string} the processed result
 */
const fittingString = (str, maxWidth, fontSize) => {
  const ellipsis = "...";
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp("[\u4E00-\u9FA5]+"); // distinguish the Chinese charactors and letters
  str.split("").forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return;
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`;
    }
  });
  return res;
};
/**
 * 处理长文本 超出换行
 * @param {string} str The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @param {number} rows 行
 * @return {string} the processed result
 */
const fittingString2 = (str, maxWidth, fontSize, rows) => {
  let currentWidth = 0;
  let res = "";
  let inRows = 0;
  const pattern = new RegExp("[\u4E00-\u9FA5]+"); // 区分汉字和字母
  str.split("").forEach((letter, i) => {
    if (currentWidth > maxWidth) return;
    if (pattern.test(letter)) {
      // 汉字
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // 别的
      // 根据fontSize得到单个字母的宽度
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth) {
      inRows++;
      if (rows && inRows >= rows) {
        res += "...";
        return false;
      }
      res += "\n";
      currentWidth = 0;

      //   res = `${str.substr(0, i)}\n${str.substr(i)}`;
    } else {
      res += letter;
    }
  });
  return res;
};
</script>

<style lang="less" scoped>
.g6-container {
  height: 100%;
  width: 100%;
}
</style>
