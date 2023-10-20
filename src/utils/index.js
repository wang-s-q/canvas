/**
 * 获取字符‘字宽’
 * */
export const getLetterWidth = (letter, fontSize = 14) => {
  const letterWidths = {};
  if (!letterWidths[letter]) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${fontSize}px sans-serif`;
    letterWidths[letter] = context.measureText(letter).width;
  }
  return letterWidths[letter];
};
const pattern = /[\u4E00-\u9FA5]+/; // 区分汉字字母用
// 文字换行
export const fittingString = (str, maxWidth, fontSize, rows) => {
  let currentWidth = 0;
  let res = "";
  let inRows = 1;
  for (let i = 0; i < str.length; i++) {
    const letter = str[i];
    if (currentWidth > maxWidth) break;
    if (pattern.test(letter)) {
      currentWidth += fontSize;
    } else {
      currentWidth += getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth) {
      inRows++;
      if (rows && inRows >= rows) {
        res += "...";
        break;
      }
      res += `${letter}\n`;
      currentWidth = 0;
    } else {
      res += letter;
    }
  }
  return res.replace(/\n$/, "");
};
