import { isObject, isArray } from '@/utils/is';
export const findByValue = (items, val) => {
  const found = items.find((element) => element.value === val);
  if (found) return found.label;
  return '';
};

export const arrayToOptions = (items, key, label) => {
  items = items.filter((el) => el[key]);
  return items.map((element) => {
    let labelContent = '';
    if (isArray(label)) {
      labelContent = `${element[label[0]]} (${element[label[1]]})`;
    } else {
      labelContent = element[label];
    }

    return Object.assign({}, element, {
      ...element,
      label: labelContent,
      value: element[key],
      key: element[key],
    });
  });
};

export const objectToOptions = (obj) => {
  if (!isObject(obj)) return [];
  return Object.keys(obj).map((key) => {
    return {
      label: obj[key],
      value: Number(key),
      key: Number(key),
    };
  });
};
// [{1: 'a'}, {2: 'b'}] => [{label: 'a', value: 1}, {label: 'b', value: 2}]
export const objectArrayToOptions = (items) => {
  if (!isArray(items)) return [];
  return items.map((element) => {
    const key = Object.keys(element)[0];
    return {
      label: element[key],
      value: Number(key),
      key: Number(key),
    };
  });
};

export const hoursOption = () =>
  Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map((i) => {
    return {
      value: i,
      label: i,
    };
  });

export const numberOption = (number) =>
  Array.from({ length: number }, (_, i) => String(i + 1)).map((i) => {
    return {
      value: i,
      label: i,
    };
  });

export const filterOption = (input: string, option: any) => {
  if (!option.label) return false;
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
