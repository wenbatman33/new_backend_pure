<script setup lang="ts">
import { useOperationLog } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import Search from "~icons/ep/search";

defineOptions({ name: "LoginSwitchOperationRecord" });

const { searchForm, dataList, loading, columns, onSearch } = useOperationLog();
</script>

<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="mb-2">
      <el-form-item :label="$t('systemManage.startTime')" prop="startTime">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="$t('systemManage.endTime')" prop="endTime">
        <el-date-picker
          v-model="searchForm.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("systemManage.search") }}
        </el-button>
      </el-form-item>
    </el-form>

    <pure-table
      align-whole="center"
      table-layout="auto"
      :loading="loading"
      :data="dataList"
      :columns="columns"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
    />
  </div>
</template>
