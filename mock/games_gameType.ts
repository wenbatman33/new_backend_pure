import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 遊戲類型假資料
const names = [
  "电子游戏",
  "真人娱乐",
  "体育竞技",
  "彩票游戏",
  "棋牌游戏",
  "捕鱼游戏",
  "电竞游戏",
  "区块链游戏",
  "斗鸡游戏",
  "街机游戏",
  "老虎机",
  "百家乐",
  "龙虎斗",
  "骰宝",
  "轮盘"
];

const list = names.map((name, i) => ({
  id: i + 1,
  name,
  second_name: `${name}-SUB`,
  sort: i + 1,
  refund: (0.5 + (i % 5) * 0.1).toFixed(1),
  is_recommended: (i % 2) + 1,
  is_tag_recommended: ((i + 1) % 2) + 1,
  is_show: i % 4 === 0 ? 2 : 1,
  dynamic: i % 3 === 0 ? 1 : 2,
  display: `display_${i + 1}`,
  icon: `game/icon_${i + 1}.png`,
  icon_color: `game/icon_color_${i + 1}.png`,
  icon_color2: `game/icon_color2_${i + 1}.png`
}));

export default defineFakeRoute([
  {
    url: "/backend/game/game_type",
    method: "get",
    response: () => {
      return { success: true, data: { list, total: list.length } };
    }
  },
  {
    url: "/backend/game/game_type",
    method: "put",
    response: () => {
      return { success: true, data: null };
    }
  },
  {
    // 圖檔上傳（沿用舊 endpoint /file/file/upload）
    url: "/file/file/upload",
    method: "post",
    response: () => {
      return { success: true, data: { url: "game/uploaded_demo.png" } };
    }
  }
]);
