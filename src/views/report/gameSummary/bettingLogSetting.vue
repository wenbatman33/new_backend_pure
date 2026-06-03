<script setup lang="ts">
import { computed } from "vue";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import { timeColumnOptions } from "./utils/hook";
import type { BettingLogItem } from "@/api/report";
import AddFill from "~icons/ri/add-circle-line";

const props = withDefaults(
  defineProps<{
    dataList: BettingLogItem[];
    loading: boolean;
  }>(),
  {
    dataList: () => [],
    loading: false
  }
);

const emit = defineEmits<{
  (e: "add"): void;
  (e: "edit", row: BettingLogItem): void;
  (e: "delete", row: BettingLogItem): void;
}>();

// 流水帐设定 value -> label
const timeColumnLabel = (val: string) =>
  timeColumnOptions.find(o => o.value === val)?.label ?? "";

const list = computed(() => props.dataList);
</script>

<template>
  <div>
    <div style="margin-bottom: 12px; text-align: right">
      <el-button
        v-if="hasAuth('__btn_bettinglog_setting_create')"
        type="primary"
        :icon="AddFill"
        @click="emit('add')"
      >
        {{ $t("report.add") }}
      </el-button>
    </div>
    <el-table :data="list" v-loading="loading" border size="small">
      <el-table-column label="ID" prop="id" width="60" />
      <el-table-column
        :label="$t('report.vendorID')"
        prop="gameGroupID"
        width="100"
      />
      <el-table-column :label="$t('report.vendor')" prop="gameGroupName" />
      <el-table-column :label="$t('report.bettingLogColumn')" prop="timeColumn">
        <template #default="{ row }">
          {{ timeColumnLabel(row.timeColumn) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('report.recordStatus')"
        prop="statusFilterString"
      />
      <el-table-column :label="$t('report.action')" width="140">
        <template #default="{ row }">
          <el-button
            v-if="hasAuth('__btn_bettinglog_setting_edit')"
            link
            type="primary"
            @click="emit('edit', row)"
          >
            {{ $t("report.edit") }}
          </el-button>
          <el-popconfirm
            :title="$t('report.confirmDelete')"
            @confirm="emit('delete', row)"
          >
            <template #reference>
              <el-button
                v-if="hasAuth('__btn_bettinglog_setting_edit')"
                link
                type="danger"
              >
                {{ $t("report.delete") }}
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
