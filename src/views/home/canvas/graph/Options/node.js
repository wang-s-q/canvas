/**
 * 节点配置属性
 */
const nodeOption = {
  size:{
    default:40
  },
  color: { // 节点颜色
    default: {
      border: '#409eff',
      background: '#409eff'
    },
    selection: {
      border: '#ffc70d',
      background: '#ffc70d'
    }
  },
  font: { // 字体
    color: {
      default: '#fff',
      selection: '#ffc70d'
    },
    size: {
      default: 12,
      hover: 13,
      selection: 13,
      dark: 12,
      f14: 14
    },
    face: 'PingFang SC',
    background: 'none',
    align: 'center',
    bold: {
      mod: 'bold'
    }
  }
}

export default nodeOption
