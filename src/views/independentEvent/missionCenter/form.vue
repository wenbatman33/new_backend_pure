<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    mode: "Create",
    name: "",
    internalName: "",
    type: 1,
    week: undefined,
    activeReset: false,
    receiveDay: undefined,
    startTime: "",
    endTime: "",
    status: 1
  })
});

const newFormInline = ref(props.formInline);
const ruleFormRef = ref();
// 步驟：0 活動設定 / 1 任務設定 / 2 篩選設定 / 3 上架設定
const current = ref(0);

// 檢視模式全欄唯讀；編輯模式部分欄位唯讀（沿用舊碼 mode!=='Create' 禁用）
const readonly = computed(() => newFormInline.value.mode !== "Create");

const typeOptions = [
  { label: $t("independentEvent.refreshedDaily"), value: 1 },
  { label: $t("independentEvent.refreshedWeek"), value: 2 },
  { label: $t("independentEvent.customize"), value: 3 }
];

const weekOptions = [
  { label: $t("independentEvent.monday"), value: 1 },
  { label: $t("independentEvent.tuesday"), value: 2 },
  { label: $t("independentEvent.wednesday"), value: 3 },
  { label: $t("independentEvent.thursday"), value: 4 },
  { label: $t("independentEvent.friday"), value: 5 },
  { label: $t("independentEvent.saturday"), value: 6 },
  { label: $t("independentEvent.sunday"), value: 7 }
];

// type=2（每週）時 week 變必填
watch(
  () => newFormInline.value.type,
  val => {
    (formRules.week as any)[0].required = val === 2;
  },
  { immediate: true }
);

function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });
</script>

<template>
  <div>
    <!-- 步驟列：對照舊版四步驟精靈 -->
    <el-steps :active="current" finish-status="success" align-center class="mb-6">
      <el-step :title="$t('independentEvent.activitySettings')" />
      <el-step :title="$t('independentEvent.taskSetting')" />
      <el-step :title="$t('independentEvent.filterSetting')" />
      <el-step :title="$t('independentEvent.listingSetting')" />
    </el-steps>

    <el-form
      ref="ruleFormRef"
      :model="newFormInline"
      :rules="formRules"
      label-width="150px"
      :disabled="newFormInline.mode === 'Watch'"
    >
      <!-- 步驟1：活動設定（任務型別細項，舊版依 taskType 動態渲染大量子表單） -->
      <template v-if="current === 0">
        <!-- TODO: 移植 settingsData 任務型別細項（存款/提款/遊戲項/免費遊戲/指定聯賽等），
             涉及 serviceCode/gameItem/平台登入等下拉，待相依下拉 API 與元件移植後補齊 -->
        <el-alert
          :title="$t('independentEvent.stepTodoTip')"
          type="info"
          :closable="false"
          show-icon
        />
      </template>

      <!-- 步驟2：任務設定（獎勵/錢包型別等，同樣依任務型別動態） -->
      <template v-else-if="current === 1">
        <!-- TODO: 移植任務獎勵設定（bonus / walletType 等） -->
        <el-alert
          :title="$t('independentEvent.stepTodoTip')"
          type="info"
          :closable="false"
          show-icon
        />
      </template>

      <!-- 步驟3：篩選設定（認證/註冊時間/排除標籤等） -->
      <template v-else-if="current === 2">
        <!-- TODO: 移植篩選設定（checkPhoneCert / checkWithdrawalInfoCert /
             registerStartTime / excludeMemberTag），excludeMemberTag 依賴會員標籤元件 -->
        <el-alert
          :title="$t('independentEvent.stepTodoTip')"
          type="info"
          :closable="false"
          show-icon
        />
      </template>

      <!-- 步驟4：上架設定（基礎欄位，完整實作） -->
      <template v-else>
        <el-form-item :label="$t('independentEvent.taskName')" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            :disabled="readonly"
          />
        </el-form-item>

        <el-form-item
          :label="$t('independentEvent.internalName')"
          prop="internalName"
        >
          <el-input
            v-model="newFormInline.internalName"
            clearable
            :disabled="readonly"
          />
        </el-form-item>

        <el-form-item :label="$t('independentEvent.taskType')" prop="type">
          <el-radio-group v-model="newFormInline.type" :disabled="readonly">
            <el-radio
              v-for="item in typeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="newFormInline.type === 2"
          :label="$t('independentEvent.refreshCycle')"
          prop="week"
        >
          <el-select
            v-model="newFormInline.week"
            clearable
            class="!w-[200px]"
            :disabled="readonly"
          >
            <el-option
              v-for="item in weekOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('independentEvent.resetPoints')">
          <el-switch v-model="newFormInline.activeReset" :disabled="readonly" />
          <span class="ml-2 text-gray-400">
            {{ $t("independentEvent.resetPointsDescription") }}
          </span>
        </el-form-item>

        <el-form-item :label="$t('independentEvent.continuousReceive')">
          <el-input-number
            v-model="newFormInline.receiveDay"
            :min="0"
            :precision="0"
            :disabled="readonly"
          />
          <span class="ml-2 text-gray-400">
            {{ $t("independentEvent.receiveDayDescription") }}
          </span>
        </el-form-item>

        <el-form-item :label="$t('independentEvent.taskStartTime')" prop="startTime">
          <el-date-picker
            v-model="newFormInline.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('independentEvent.taskStartTime')"
          />
        </el-form-item>

        <el-form-item :label="$t('independentEvent.taskEndTime')" prop="endTime">
          <el-date-picker
            v-model="newFormInline.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('independentEvent.taskEndTime')"
          />
        </el-form-item>
      </template>
    </el-form>

    <!-- 步驟切換 -->
    <div class="flex justify-center gap-3 mt-4">
      <el-button :disabled="current === 0" @click="current--">
        {{ $t("independentEvent.prevStep") }}
      </el-button>
      <el-button :disabled="current === 3" type="primary" @click="current++">
        {{ $t("independentEvent.nextStep") }}
      </el-button>
    </div>
  </div>
</template>
