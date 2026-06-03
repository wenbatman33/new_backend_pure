<script setup lang="ts">
import { useRecommend } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "IndependentEventRecommend" });

const {
  loading,
  formData,
  formDataDisabled,
  columns1,
  columns2,
  event1List,
  event2List,
  handleSubmitConfigure,
  handleCancelConfigure,
  handleAddEvent1,
  resetEvent1,
  handleSubmit1,
  resetEvent2,
  handleSubmit2
} = useRecommend();
</script>

<template>
  <div class="main">
    <!-- 设定区 -->
    <el-card shadow="never" class="mb-4">
      <el-form :inline="true" class="recommend-config">
        <el-form-item :label="$t('independentEvent.recommendForm1')">
          <el-switch
            v-model="formData.isRun"
            active-text="ON"
            inactive-text="OFF"
            :disabled="formDataDisabled"
          />
        </el-form-item>
        <el-form-item :label="$t('independentEvent.recommendForm2')">
          <el-input
            v-model="formData.event2UpperLimit"
            type="number"
            class="!w-[160px]"
            :disabled="formDataDisabled"
          />
        </el-form-item>
        <el-form-item :label="$t('independentEvent.recommendForm4')">
          <el-switch
            v-model="formData.event1IsShow"
            active-text="ON"
            inactive-text="OFF"
            :disabled="formDataDisabled"
          />
        </el-form-item>
        <el-form-item :label="$t('independentEvent.recommendForm5')">
          <el-switch
            v-model="formData.event2IsShow"
            active-text="ON"
            inactive-text="OFF"
            :disabled="formDataDisabled"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-show="formDataDisabled" @click="formDataDisabled = false">
            {{ $t("independentEvent.recommendEdit") }}
          </el-button>
          <el-button v-show="!formDataDisabled" @click="handleCancelConfigure">
            {{ $t("independentEvent.recommendCancel") }}
          </el-button>
          <el-button
            v-show="!formDataDisabled"
            type="primary"
            @click="handleSubmitConfigure"
          >
            {{ $t("independentEvent.recommendSave") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 活动一 -->
    <PureTableBar
      :title="$t('independentEvent.recommendEvent1Title')"
      :columns="columns1"
    >
      <template #buttons>
        <el-button @click="handleAddEvent1">
          {{ $t("independentEvent.recommendAddBtn") }}
        </el-button>
        <el-button @click="resetEvent1">
          {{ $t("independentEvent.recommendReset") }}
        </el-button>
        <el-button type="primary" @click="handleSubmit1">
          {{ $t("independentEvent.recommendSaveAll") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="event1List"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>

    <!-- 活动二 -->
    <PureTableBar
      :title="$t('independentEvent.recommendEvent2Title')"
      :columns="columns2"
      class="mt-4"
    >
      <template #buttons>
        <el-button @click="resetEvent2">
          {{ $t("independentEvent.recommendReset") }}
        </el-button>
        <el-button type="primary" @click="handleSubmit2">
          {{ $t("independentEvent.recommendSaveAll") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="event2List"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
.recommend-config {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
