"use strict";
import Node from "./Node";
import { hideLabelScale } from "../Util/constant";
import { wrapText } from "../Util/index";
/**
 * 图标节点类型
 * @param {Object} body body对象
 * @param {Object} data 节点对象
 * @param {Object} globalOptions 全局配置
 * @param {Object} options 节点配置
 */
class CircleNode extends Node {
  constructor(body, data, globalOptions, options) {
    super(body, data, globalOptions, options);
    this.r = this.iconRadius();
  }

  /**
   * 绘制节点
   * @param {Object} d 节点对象
   */
  draw() {
    const d = this;
    const body = this.body;
    const ctx = body.nodeContainer.getContext("2d");
    const scale = body.scale;
    const isHideLabel = body.hideLabel;
    // 去除浮点小数保证坐标为整数, 防止抗锯齿性能低下
    d.x = Math.floor(d.x);
    d.y = Math.floor(d.y);
    ctx.save();
    // 节点渐变背景色,外阴影效果
    this.drawIconBack(ctx, false);
    // 节点内阴影效果
    this.drawIconIn(ctx, false)
    // 节点名称
    if (
      d.globalOptions.showLabel &&
      d.label !== undefined &&
      d.label !== null &&
      !isHideLabel &&
      scale.k >= hideLabelScale
    ) {
      this.drawLabel(ctx, d);
    }
    ctx.restore();
  }

  /**
   * 绘制缩略图中的节点
   */
  //   drawThumbnail (ctx) {
  //     const d = this
  //     // 去除浮点小数保证坐标为整数, 防止抗锯齿性能低下
  //     d.x = Math.floor(d.x)
  //     d.y = Math.floor(d.y)
  //     ctx.save()
  //     // 节点图标
  //     this.drawIcon(ctx, true)
  //     ctx.restore()
  //   }

  /**
   * 绘制节点名称
   * @param {Object} ctx canvas 上下文
   * @param {Object} d 当前节点对象
   * canvas 处理字体换行 参考
   * https://www.zhangxinxu.com/wordpress/2018/02/canvas-text-break-line-letter-spacing-vertical/
   */
  drawLabel(ctx, d) {
    ctx.save();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const opt = d.options;
    ctx.fillStyle = opt.font.color.default;
    ctx.font = `${opt.font.size.default}px ${opt.font.face}`;
    let h = d.y + d.r / 2 - d.size / 4;
    if (d.size > 30) {
      ctx.wrapText(d.label, d.x, h-5,d.size-10,15,2)
    } else {
      ctx.wrapText(d.label, d.x, h+d.size,150,15,3);
    }
    ctx.restore();
  }

  /**
   * 绘制节点背景及外阴影效果
   * https://blog.csdn.net/netcy/article/details/111507525   canvas 内外阴影效果的实现
   * @param {Object} ctx canvas上下文
   */
  drawIconBack(ctx) {
    const d = this;
    ctx.save();
    // 开始绘制
    ctx.beginPath();
    ctx.moveTo(d.x + d.r, d.y);
    // this.fillNodeStyle(ctx);
    ctx.shadowColor = this.back[1] || "#116FFF";
    // ctx.shadowOffsetX = 0;
    // ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 20;
    let radial = ctx.createLinearGradient(
      d.x - d.size / 2,
      d.y - d.size / 2,
      d.x - d.size / 2,
      d.y + d.size / 2
    );
    radial.addColorStop(0, this.back[1] || "#116FFF");
    radial.addColorStop(1, this.back[0] || "#00C2FF");
    ctx.fillStyle = radial;
    // ctx.stroke();
    // ctx.fill();
    ctx.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
  /**
   * 绘制节点内阴影效果
   * @param {*} ctx canvas 上下文
   */
  drawIconIn(ctx) {
    const d = this;
    ctx.save();
    // 开始绘制
    ctx.beginPath();
    ctx.moveTo(d.x + d.r, d.y);
    // this.fillNodeStyle(ctx);
    let radialS = ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.size/2);
    radialS.addColorStop(0.6,'rgba(255,255,255,0)');
    radialS.addColorStop(1,'rgba(255,255,255,0.2)');
    ctx.fillStyle = radialS
    ctx.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
}

export default CircleNode;
