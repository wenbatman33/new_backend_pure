<script setup lang="ts">
import { transformI18n as $t } from "@/plugins/i18n";
import type { OnlineUserItem } from "./utils/types";

const props = withDefaults(
  defineProps<{ detail: Partial<OnlineUserItem> }>(),
  {
    detail: () => ({
      account: "",
      roleName: "",
      deptName: "",
      adminID: undefined
    })
  }
);

// 強制登出僅為確認操作，無表單欄位，提供空 getRef 以符合 addDialog 慣例
function getRef() {
  return null;
}

defineExpose({ getRef });
</script>

<template>
  <div class="force-logout">
    <div class="row">
      <span class="label">{{ $t("authSystem.userAccount") }}</span>
      <span class="value">{{ props.detail.account }}</span>
    </div>
    <div class="row">
      <span class="label">{{ $t("authSystem.group") }}</span>
      <span class="value">{{ props.detail.roleName }}</span>
    </div>
    <div class="row">
      <span class="label">{{ $t("authSystem.dept") }}</span>
      <span class="value">{{ props.detail.deptName }}</span>
    </div>
    <div class="tip">{{ $t("authSystem.forceLogoutMessage") }}</div>
  </div>
</template>

<style scoped lang="scss">
.force-logout {
  padding: 8px 4px;

  .row {
    display: flex;
    margin-bottom: 16px;

    .label {
      width: 90px;
      margin-right: 16px;
      font-weight: 600;
      text-align: right;
    }
  }

  .tip {
    margin-top: 8px;
    color: var(--el-color-danger);
  }
}
</style>
