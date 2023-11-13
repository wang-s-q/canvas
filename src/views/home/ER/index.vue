<!--  -->
<template>
  <div class="er-container-box" ref="container">
    <div class="er-container" ref="X6Ref">111</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import G6 from "@antv/g6";
const X6Ref = ref(null);
const container = ref(null);
/**
 * 演示通过扩展内置的圆圈组合来定制组合类型
 * by Shiwu
 *
 */

// 组合内标记的符号
const collapseIcon = (x, y, r) => {
  return [
    ["M", x - r, y],
    ["a", r, r, 0, 1, 0, r * 2, 0],
    ["a", r, r, 0, 1, 0, -r * 2, 0],
    ["M", x - r + 4, y],
    ["L", x - r + 2 * r - 4, y],
  ];
};
const expandIcon = (x, y, r) => {
  return [
    ["M", x - r, y],
    ["a", r, r, 0, 1, 0, r * 2, 0],
    ["a", r, r, 0, 1, 0, -r * 2, 0],
    ["M", x - r + 4, y],
    ["L", x - r + 2 * r - 4, y],
    ["M", x - r + r, y - r + 4],
    ["L", x, y + r - 4],
  ];
};
// const tooltip = new G6.Tooltip({
//   offsetX: 10,
//   offsetY: 20,
//   getContent(e) {
//     const outDiv = document.createElement("div");
//     outDiv.style.width = "180px";
//     outDiv.innerHTML = `
//       <h4>自定义tooltip</h4>
//       <ul>
//         <li>Label: ${e.item.getModel().label || e.item.getModel().id}</li>
//       </ul>`;
//     return outDiv;
//   },
//   itemTypes: ["node", "combo"],
//   fixToNode: [1, 0.5],
// });
const data = {
  nodes: [
    { id: "node1", x: 250, y: 200, comboId: "combo1" },
    { id: "node2", x: 300, y: 200, comboId: "combo1" },
    { id: "node3", x: 100, y: 200, comboId: "combo3" },
  ],
  combos: [
    { id: "combo1", label: "Combo 1", parentId: "combo2" },
    { id: "combo2", label: "Combo 2" },
    { id: "combo3", label: "Combo 3", collapsed: true },
  ],
  edges: [
    {
      source: "combo3",
      target: "combo1",
    },
    {
      source: "node3",
      target: "node1",
    },
    {
      source: "node3",
      target: "node2",
    },
  ],
};

// const descriptionDiv = document.createElement("div");
// descriptionDiv.innerHTML =
//   "Click the right marker to collapse/expand the combo.";
// const container = document.getElementById("container");
// container.appendChild(descriptionDiv);

// if (typeof window !== "undefined")
//   window.onresize = () => {
//     if (!graph || graph.get("destroyed")) return;
//     if (!container || !container.scrollWidth || !container.scrollHeight) return;
//     graph.changeSize(container.scrollWidth, container.scrollHeight - 20);
//   };
const initStyle = () => {
  G6.registerCombo(
    "cRect",
    {
      drawShape: function drawShape(cfg, group) {
        const self = this;
        // 从配置中获取填充
        cfg.padding = cfg.padding || [50, 20, 20, 20];
        // 获取形状的样式，样式。宽度和样式。高度对应于内建矩形组合图中的宽度和高度
        const style = self.getShapeStyle(cfg);
        // 添加一个矩形形状作为keyShape，这是相同的扩展矩形组合
        const rect = group.addShape("rect", {
          attrs: {
            ...style,
            x: -style.width / 2 - cfg.padding[3],
            y: -style.height / 2 - cfg.padding[0],
            width: style.width,
            height: style.height,
          },
          draggable: true,
          // 必须在G6 3.3及以后的版本中分配。它可以是您想要的任何字符串，但在自定义项类型中应该是唯一的
          name: "combo-keyShape",
        });
        // 加上右边的圆圈
        group.addShape("marker", {
          attrs: {
            ...style,
            fill: "#fff",
            opacity: 1,
            // cfg.style.width和cfg.style. height对应于内建矩形组合示意图中的innerWidth和innerHeight
            x: cfg.style.width / 2 + cfg.padding[1],
            y: (cfg.padding[2] - cfg.padding[0]) / 2,
            r: 10,
            symbol: collapseIcon,
          },
          draggable: true,
          // 必须在G6 3.3及以后的版本中分配。它可以是您想要的任何字符串，但在自定义项类型中应该是唯一的
          name: "combo-marker-shape",
        });
        return rect;
      },
      // 定义右圆的更新逻辑
      afterUpdate: function afterUpdate(cfg, combo) {
        const group = combo.get("group");
        // 根据名称在组合的图形组中找到圆形形状
        const marker = group.find(
          (ele) => ele.get("name") === "combo-marker-shape"
        );
        // 更新右圆的位置
        marker.attr({
          // cfg.style.width和cfg.style. height对应于内建矩形组合示意图中的innerWidth和innerHeight
          x: cfg.style.width / 2 + cfg.padding[1],
          y: (cfg.padding[2] - cfg.padding[0]) / 2,
          // 组合数据中的属性'collapse '表示组合的折叠状态
          // 根据'collapse '更新符号
          symbol: cfg.collapsed ? expandIcon : collapseIcon,
        });
      },
    },
    "rect"
  );
};
const initGraph = () => {
  let bounding = X6Ref.value.getBoundingClientRect();
  const width = bounding.width;
  const height = bounding.height;
  const graph = new G6.Graph({
    container: X6Ref.value,
    width,
    height,
    // Set groupByTypes to false to get rendering result with reasonable visual zIndex for combos
    groupByTypes: false,
    // Configure the combos globally
    defaultCombo: {
      // The type of the combos. You can also assign type in the data of combos
      type: "cRect",
      // ... Other global configurations for combos
    },
    comboStateStyles: {
      dragenter: {
        lineWidth: 4,
        stroke: "#FE9797",
      },
    },
    modes: {
      default: ["drag-combo", "drag-node", "drag-canvas", "click-select"],
    },
    // plugins: [tooltip],
  });
  graph.data(data);
  graph.render();

  // collapse/expand when click the marker
  graph.on("combo:click", (e) => {
    if (e.target.get("name") === "combo-marker-shape") {
      // graph.collapseExpandCombo(e.item.getModel().id);
      graph.collapseExpandCombo(e.item);
      if (graph.get("layout")) graph.layout();
      else graph.refreshPositions();
    }
  });

  graph.on("combo:dragend", (e) => {
    graph.getCombos().forEach((combo) => {
      graph.setItemState(combo, "dragenter", false);
    });
  });
  graph.on("node:dragend", (e) => {
    graph.getCombos().forEach((combo) => {
      graph.setItemState(combo, "dragenter", false);
    });
  });

  graph.on("combo:dragenter", (e) => {
    graph.setItemState(e.item, "dragenter", true);
  });
  graph.on("combo:dragleave", (e) => {
    graph.setItemState(e.item, "dragenter", false);
  });

  graph.on("combo:mouseenter", (evt) => {
    const { item } = evt;
    graph.setItemState(item, "active", true);
  });

  graph.on("combo:mouseleave", (evt) => {
    const { item } = evt;
    graph.setItemState(item, "active", false);
  });
};
onMounted(() => {
  initStyle();
  initGraph();
});
</script>

<style lang="less" scoped>
.er-container-box {
  height: 100%;
  width: 100%;
  background: #fff;
}
.er-container {
  height: 100%;
  width: 100%;
  //   background: #fff;
}
</style>
