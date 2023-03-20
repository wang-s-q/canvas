// import '@/utils/ArrayFix'

// eslint-disable-next-line
const ASPDateRegex = /^\/?Date\((\-?\d+)/i;

/**
 * 随机主键
 * @returns
 */
export function uuid() {
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return uuid;
}

/**
 * 是否是String
 * @param {Object} object 对象
 */
export function isString(object) {
  return (
    object != null &&
    Object.prototype.toString.call(object) === "[object String]"
  );
}

/**
 * 是否是Number
 * @param {Object} object 对象
 */
export function isNumber(object) {
  return (
    object != null &&
    Object.prototype.toString.call(object) === "[object Number]"
  );
}

/**
 * 是否是Boolean
 * @param {Object} object 对象
 */
export function isBoolean(object) {
  return (
    object != null &&
    Object.prototype.toString.call(object) === "[object Boolean]"
  );
}

/**
 * 是否是Object
 * @param {Object} object 对象
 */
export function isObject(object) {
  return (
    object != null &&
    Object.prototype.toString.call(object) === "[object Object]"
  );
}

/**
 * 是否是Function
 * @param {Object} object 对象
 */
export function isFunction(object) {
  return (
    object != null &&
    Object.prototype.toString.call(object) === "[object Function]"
  );
}

/**
 * 对象是否为空
 * @param {Object} obj 对象
 */
export function isObjectEmpty(obj) {
  if (Object.getOwnPropertyNames) {
    return Object.getOwnPropertyNames(obj).length === 0;
  } else {
    let k;
    for (k in obj) {
      if (obj.hasOwnProperty(k)) {
        return false;
      }
    }
    return true;
  }
}

/**
 * 是否是undefined
 * @param {Object} obj 对象
 */
export function isUndefined(obj) {
  return obj === void 0;
}

/**
 * 继承属性：浅拷贝继承，类似Object.assign(a, b)
 * @param {Object} a 对象A
 * @param {Object} b 对象B
 * @returns
 */
export function extend(a, b) {
  for (var i = 1; i < arguments.length; i++) {
    var other = arguments[i];
    for (var prop in other) {
      if (other.hasOwnProperty(prop)) {
        a[prop] = other[prop];
      }
    }
  }
  return a;
}

/**
 * 继承属性：深拷贝[不太准确, 存在bug, If you want to use a perfect deep copy, use lodash's _.cloneDeep]
 * @param {*} a 默认对象
 * @param {*} b 传递进来的对象，覆盖a中部分属性
 * @param {*} protoExtend 可选参数，若为true，原型值也将被扩展
 * @param {*} allowDeletion 可选参数，若为true，则不会删除为空的字段的值
 * @returns {Object} a 返回被b对象覆盖的a对象
 */
export function deepExtend(a, b, protoExtend = false, allowDeletion = false) {
  for (var prop in b) {
    if (b.hasOwnProperty(prop) || protoExtend === true) {
      if (b[prop] && b[prop].constructor === Object) {
        if (a[prop] === undefined) {
          a[prop] = {};
        }
        if (a[prop].constructor === Object) {
          deepExtend(a[prop], b[prop], protoExtend);
        } else {
          if (
            b[prop] === null &&
            a[prop] !== undefined &&
            allowDeletion === true
          ) {
            delete a[prop];
          } else {
            a[prop] = b[prop];
          }
        }
      } else if (Array.isArray(b[prop])) {
        a[prop] = [];
        for (let i = 0; i < b[prop].length; i++) {
          a[prop].push(b[prop][i]);
        }
      } else {
        if (
          b[prop] === null &&
          a[prop] !== undefined &&
          allowDeletion === true
        ) {
          delete a[prop];
        } else {
          a[prop] = b[prop];
        }
      }
    }
  }
  return a;
}

/**
 * 递归删除dom元素
 * @param {Object} DomObject dom对象
 */
export function recursiveDOMDelete(DOMObject) {
  if (DOMObject) {
    while (DOMObject.hasChildNodes()) {
      recursiveDOMDelete(DOMObject.firstChild);
      DOMObject.removeChild(DOMObject.firstChild);
    }
  }
}

/**
 * 获取鼠标相对于屏幕的坐标
 * @param {MouseEvent} event 鼠标事件
 */
export function getMousePosition(event) {
  const e = event || window.event;
  const scrollX =
    document.documentElement.scrollLeft || document.body.scrollLeft;
  const scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  const x = e.pageX || e.clientX + scrollX;
  const y = e.pageY || e.clientY + scrollY;
  return {
    x,
    y,
  };
}

/**
 * canvas计算与逐行绘制
 * @param {*} text 需要绘制的文本
 * @param {*} x 文本绘制的水平参考点坐标
 * @param {*} y 文本绘制的垂直参考点坐标
 * @param {*} maxWidth 最大需要换行的宽度，此参数可缺省，默认会使用canvas画布的width宽度作为maxWidth
 * @param {*} lineHeight 行高，同样可缺省，默认会使用<canvas>元素在DOM中继承的line-height作为行高
 * @param {*} lineNum 显示几行 可缺省，默认展示所有
 * @returns
 */

export function wrapText(text, x, y, maxWidth, lineHeight, lineNum) {
  if (typeof text != "string" || typeof x != "number" || typeof y != "number") {
    return;
  }

  let context = this;
  let canvas = context.canvas;

  if (typeof maxWidth == "undefined") {
    maxWidth = (canvas && canvas.width) || 300;
  }
  if (typeof lineHeight == "undefined") {
    lineHeight =
      (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) ||
      parseInt(window.getComputedStyle(document.body).lineHeight);
  }

  // 字符分隔为数组
  var arrText = text.split("");
  var line = "";
  var rows = 0;
  for (var n = 0; n < arrText.length; n++) {
    var testLine = line + arrText[n];
    var metrics = context.measureText(testLine);
    // 文本宽度
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      rows += 1;
      if (lineNum && rows == lineNum) {
        line += "...";
      }
      context.fillText(line, x, y);
      if (lineNum && rows >= lineNum) return;
      line = arrText[n];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}
