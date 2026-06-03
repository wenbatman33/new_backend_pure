<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useOperateLog } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({ name: "DeployOperateLog" });

const formRef = ref();
const {
  searchForm,
  dataList,
  loading,
  columns,
  pagination,
  onSearch,
  resetForm
} = useOperateLog();

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div>
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="mb-2"
    >
      <el-form-item :label="$t('systemManage.deployLogSendDate')" prop="startDate">
        <el-date-picker
          v-model="searchForm.startDate"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item label="~" prop="endDate">
        <el-date-picker
          v-model="searchForm.endDate"
          type="date"
          value-format="YYYY-MM-DD"
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" :loading="loading" @click="onSearch">
          {{ $t("systemManage.search") }}
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(formRef)">
          {{ $t("systemManage.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <pure-table
      align-whole="center"
      border
      :loading="loading"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
    />
  </div>
</template>
