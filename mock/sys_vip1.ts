import { defineFakeRoute } from "vite-plugin-fake-server/client";

// sys/vip1：VIP 遊戲資訊查詢，/backend/vipjob/game 回傳單一遊戲的 group / agency / list
export default defineFakeRoute([
  {
    url: "/backend/vipjob/game",
    method: "get",
    response: ({ query }) => {
      const id = Number(query.id) || 1;
      const now = "2026-06-03 10:30:00";
      return {
        success: true,
        data: {
          group: {
            id,
            name: `game_group_${id}`,
            display_name: `游戏群组 ${id}`,
            maintain_time: "2026-06-01 00:00:00 ~ 2026-06-01 02:00:00",
            wallet_type: "single",
            platform_fee_ratio: "0.05",
            game_agency_id: 10 + id,
            game_type_id: 3,
            game_url: `https://game.example.com/group/${id}`,
            game_wallet_id: 200 + id,
            open_game_list_id: 300 + id,
            open_way: "iframe",
            sort: id,
            status: 1,
            created_at: now,
            updated_at: now,
            image_h5: `https://img.example.com/group_${id}_h5.png`,
            image_pc: `https://img.example.com/group_${id}_pc.png`,
            logo_image: `https://img.example.com/group_${id}_logo.png`
          },
          agency: {
            id: 10 + id,
            name: `agency_${10 + id}`,
            status: 1,
            created_at: now,
            updated_at: now,
            image_pc: `https://img.example.com/agency_${10 + id}_pc.png`,
            image_h5: `https://img.example.com/agency_${10 + id}_h5.png`
          },
          list: {
            id: 300 + id,
            name: `game_list_${300 + id}`,
            display_name: `游戏 ${300 + id}`,
            game_group_id: id,
            game_type_id: 3,
            is_hot_game: 1,
            is_slot: 0,
            is_special: 0,
            room_url: `https://game.example.com/room/${300 + id}`,
            demo_url: `https://game.example.com/demo/${300 + id}`,
            trial_play: 1,
            betting_code: `BC${300 + id}`,
            game_code_h5: `H5_${300 + id}`,
            game_code_pc: `PC_${300 + id}`,
            sort: 1,
            status: 1,
            created_at: now,
            updated_at: now,
            image_h5: `https://img.example.com/list_${300 + id}_h5.png`,
            image_pc: `https://img.example.com/list_${300 + id}_pc.png`,
            recommended_image_h5: `https://img.example.com/list_${300 + id}_rec_h5.png`,
            recommended_image_pc: `https://img.example.com/list_${300 + id}_rec_pc.png`,
            recommended_sort: 1,
            screen_shot_h5: `https://img.example.com/list_${300 + id}_ss_h5.png`,
            screen_shot_pc: `https://img.example.com/list_${300 + id}_ss_pc.png`
          }
        }
      };
    }
  }
]);
