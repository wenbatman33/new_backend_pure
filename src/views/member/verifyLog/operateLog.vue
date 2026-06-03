<script setup lang="ts">
import { useOperateLog } from "./utils/hook";
import type { OperateLogProps } from "./utils/types";

defineOptions({ name: "VerifyLogOperate" });

const props = withDefaults(defineProps<OperateLogProps>(), {
  logId: 0
});

const { dataList, loading, columns } = useOperateLog(props.logId);
</script>

<template>
  <pure-table
    align-whole="center"
    showOverflowTooltip
    table-layout="auto"
    :loading="loading"
    :data="dataList"
    :columns="columns"
    :header-cell-style="{
      background: 'var(--el-fill-color-light)',
      color: 'var(--el-text-color-primary)'
    }"
  />
</template>
