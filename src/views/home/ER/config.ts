import { Graph, Node } from "@antv/x6";

// 群组
class Group extends Node {
  private collapsed = false;
  private expandSize: { width: number; height: number };

  protected postprocess() {
    this.toggleCollapse(false);
  }

  isCollapsed() {
    return this.collapsed;
  }

  toggleCollapse(collapsed?: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed;
    if (target) {
      this.attr("buttonSign", { d: "M 1 5 9 5 M 5 1 5 9" }); //展开

      this.expandSize = this.getSize();
      this.resize(100, 32);
    } else {
      this.attr("buttonSign", { d: "M 2 5 8 5" }); //收起
      if (this.expandSize) {
        this.resize(this.expandSize.width, this.expandSize.height);
      }
    }
    this.collapsed = target;
  }
}
Group.config({
  markup: [
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "text",
      selector: "label",
    },
    {
      tagName: "g",
      selector: "buttonGroup",
      children: [
        {
          tagName: "rect",
          selector: "button",
          attrs: {
            "pointer-events": "visiblePainted",
          },
        },
        {
          tagName: "path",
          selector: "buttonSign",
          attrs: {
            fill: "none",
            "pointer-events": "none",
          },
        },
      ],
    },
  ],
  attrs: {
    body: {
      refWidth: "100%",
      refHeight: "100%",
      strokeWidth: 1,
      fill: "#ffffff",
      stroke: "none",
    //   radius: 40,
      rx: 4,
      ry: 4,
    },
    buttonGroup: {
      refX: 8,
      refY: 8,
    },
    button: {
      height: 14,
      width: 16,
      rx: 2,
      ry: 2,
      fill: "#f5f5f5",
      stroke: "#ccc",
      cursor: "pointer",
      event: "node:collapse",
    },
    buttonSign: {
      refX: 3,
      refY: 2,
      stroke: "#808080",
    },
    label: {
      fontSize: 12,
      fill: "#242424",
      refX: 32,
      refY: 10,
    },
  },
});

// 图谱配置
const defaultConfig = {
  panning: true, // 画布平移
  // 需要安装scroller插件
  // scroller: {
  //   enabled: true,
  //   pageVisible: false,
  //   pageBreak: false,
  //   pannable: true,
  // },
  /** 画布网格 */
  grid: {
    visible: true,
    size: 20,
    type: "dot",
    args: [
      {
        color: "#888",
      },
    ],
  },
  /** 全局连线配置 */
  connecting: {
    connector: {
      name: "rounded",
    },
    router: {
      name: "er",
      args: {
        direction: "H",
      },
    },
  },
  /** 对齐线 */
  //   snapline: {
  //     enabled: true,
  //   },
  /** 滚轮缩放 */
  mousewheel: {
    enabled: true, //是否开启滚轮缩放交互。
    zoomAtMousePosition: false, //是否将鼠标位置作为中心缩放，默认为 true。
    factor: 1.1, //滚动缩放因子。默认为 1.2。
  },
  //   keyboard: {
  //     enabled: true,
  //   },
  //   clipboard: {
  //     enabled: true,
  //   },
};

export { Group, defaultConfig };
