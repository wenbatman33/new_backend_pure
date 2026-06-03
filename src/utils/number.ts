import { h } from 'vue';

function toCurrency(num) {
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

//無條件捨去到小數點第二位
export const roundDown = (num, decimal) => {
  return Math.floor((num + Number.EPSILON) * Math.pow(10, decimal)) / Math.pow(10, decimal);
};
export const roundDownNagative = (num, decimal) => {
  return Math.ceil((num + Number.EPSILON) * Math.pow(10, decimal)) / Math.pow(10, decimal);
};

export const commaDecimalFormat = (value: number | string, decimal = 0, floor = false): string => {
  value = Number(value || '0');
  if (floor && decimal > 0) {
    const n = Math.pow(10, decimal);
    value = Math.floor(value * n) / n;
  }

  if (decimal > 0) {
    value = value.toFixed(decimal);
  }
  return toCurrency(value);
  // try {
  //   if (decimal === 0) {
  //     return value.toLocaleString('zh-CN', {
  //       minimumFractionDigits: decimal,
  //     });
  //   } else {
  //     return value.toLocaleString('zh-CN', {
  //       maximumFractionDigits: decimal,
  //       minimumFractionDigits: decimal,
  //     });
  //   }
  // } catch (e) {
  //   return value.toString();
  // }
};

export const tableCustomRender = (text, n = 0) => {
  return text === '' || text === undefined ? '-' : commaDecimalFormat(text, n);
};

//數字都需要加上千分位，到小數點第二位四捨五入，可以選擇是否補0
export const formatNumber = (num, addZero = false) => {
  let hasNegative = false;
  if (num < 0) {
    hasNegative = true;
    num = Math.abs(num);
  }
  num = Number(num || 0);
  // 获取整数部分和小数部分
  let intPart = Math.trunc(num).toString();
  let decPart = num.toString().split('.')[1];

  // 对整数部分添加千分位分隔
  intPart = intPart.replace(/(\d)(?=(\d{3})+$)/g, '$1,');

  // 处理小数部分
  if (decPart) {
    decPart = parseFloat('0.' + decPart).toFixed(2);

    // 判断末尾是否为0,如果是则删除
    if (decPart.slice(-1) === '0' && !addZero) {
      decPart = decPart.slice(0, -1);
    }
    decPart = decPart.slice(1);
  } else {
    decPart = '';
  }
  return (hasNegative ? '-' : '') + intPart + decPart;
};

export const changeRedColorForNegative = (text) => {
  if (
    (typeof text === 'string' && text.length === 1) ||
    typeof text === 'undefined' ||
    text === 0
  ) {
    return text;
  }

  if (typeof text === 'number') {
    return text > 0
      ? formatNumber(text)
      : h(
          'span',
          {
            style: 'color: #F00',
          },
          formatNumber(text)
        );
  }

  if (typeof text === 'string') {
    return text.indexOf('-') === -1
      ? text
      : h(
          'span',
          {
            style: 'color: #F00',
          },
          text
        );
  }
};

// 格式化金額（千分號 + 小數點後兩位）
export const formatAmount = (value: number | string) => {
  if (value === null || value === undefined || value === '') return '0.00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// 格式化輸贏金額（負數紅字）
export const formatAmountWithRed = (value: number | string) => {
  if (value === null || value === undefined || value === '') return '0.00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  const formatted = formatAmount(num);
  return num < 0 ? h('span', { style: { color: 'red' } }, formatted) : formatted;
};
