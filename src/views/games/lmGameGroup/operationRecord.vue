<script setup lang="ts">
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "LmGameGroupOperationRecord" });

defineProps<{
  records: Array<{
    updatedAt: string;
    updatedUser: string;
    action: string;
    content: string;
  }>;
}>();
</script>

<template>
  <el-table :data="records" border max-height="500">
    <el-table-column
      :label="$t('games.lmGameGroupLogTime')"
      prop="updatedAt"
      width="200"
    />
    <el-table-column
      :label="$t('games.lmGameGroupLogOperator')"
      prop="updatedUser"
      width="150"
    />
    <el-table-column
      :label="$t('games.lmGameGroupLogProject')"
      prop="action"
      width="150"
    />
    <el-table-column :label="$t('games.lmGameGroupLogContent')">
      <template #default="{ row }">
        <div v-html="row.content" />
      </template>
    </el-table-column>
  </el-table>
</template>
