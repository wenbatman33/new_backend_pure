<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import dayjs from "dayjs";
import { transformI18n as $t } from "@/plugins/i18n";
import { message } from "@/utils/message";
import {
  selectCategory,
  fieldMetaMap,
  compareOptions,
  allFields
} from "./utils/data";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "",
    description: "",
    dateRangeType: "1",
    dateRange: null,
    start: "",
    end: "",
    requestData: {},
    responseData: {},
    mode: "create"
  }),
  vipSettingList: () => []
});

const form = reactive({ ...props.formInline });
const currentStep = ref(0);

// vipLevel 動態套入選項
const vipOptions = computed(() => props.vipSettingList);

// === Step1 表單 ===
const step1Ref = ref();
const step1Rules = {
  title: [{ required: true, message: $t("report.title"), trigger: "blur" }]
};

// === Step2：條件設定 ===
// 已勾選的條件欄位
const conditionSelected = ref<string[]>([]);
// 各欄位的值容器：input/select 直接存值；number 存 {sign,val}；date 存 [start,end]
const conditionValues = reactive<Record<string, any>>({});

function initStep2FromRequestData() {
  const rd = props.formInline.requestData || {};
  const keys = Object.keys(rd);
  const selected = new Set<string>();
  allFields.forEach(f => {
    const meta = fieldMetaMap[f];
    if (meta.type === "date") {
      if (rd[f + "Start"] !== undefined || rd[f + "End"] !== undefined) {
        selected.add(f);
        conditionValues[f] = [rd[f + "Start"] || "", rd[f + "End"] || ""];
      }
    } else if (meta.type === "number") {
      if (rd[f] !== undefined) {
        selected.add(f);
        conditionValues[f] = { sign: rd[f + "Sign"] || "1", val: rd[f] };
      }
    } else {
      if (rd[f] !== undefined) {
        selected.add(f);
        conditionValues[f] = rd[f];
      }
    }
  });
  conditionSelected.value = [...selected];
}

// 點分類大項：全選 / 全不選其 children
function toggleCategoryCondition(catValue: string) {
  const cat = selectCategory.find(c => c.value === catValue);
  if (!cat) return;
  const set = new Set(conditionSelected.value);
  const allIn = cat.children.every(c => set.has(c));
  if (allIn) {
    cat.children.forEach(c => set.delete(c));
  } else {
    cat.children.forEach(c => set.add(c));
  }
  conditionSelected.value = [...set];
}

// 已選且需要在右側顯示輸入的欄位
const visibleConditionFields = computed(() =>
  allFields.filter(f => conditionSelected.value.includes(f))
);

// === Step3：報表欄位設定 ===
const responseSelected = ref<string[]>([]);

function initStep3FromResponseData() {
  const rsp = props.formInline.responseData || {};
  responseSelected.value = Object.keys(rsp).filter(k => rsp[k] === 1);
}

function toggleCategoryResponse(catValue: string) {
  const cat = selectCategory.find(c => c.value === catValue);
  if (!cat) return;
  const set = new Set(responseSelected.value);
  const allIn = cat.children.every(c => set.has(c));
  if (allIn) {
    cat.children.forEach(c => set.delete(c));
  } else {
    cat.children.forEach(c => set.add(c));
  }
  responseSelected.value = [...set];
}

// 初始化（編輯/複製模式帶入）
initStep2FromRequestData();
initStep3FromResponseData();

// dateRangeType 切換時清空自訂區間
watch(
  () => form.dateRangeType,
  v => {
    if (v === "1") form.dateRange = null;
  }
);

// 組裝 requestData（送後端）
function buildRequestData() {
  const rd: Record<string, any> = {};
  conditionSelected.value.forEach(f => {
    const meta = fieldMetaMap[f];
    if (meta.type === "date") {
      const range = conditionValues[f];
      rd[f + "Start"] = range?.[0]
        ? dayjs(range[0]).format("YYYY-MM-DD 00:00:00")
        : "";
      rd[f + "End"] = range?.[1]
        ? dayjs(range[1]).format("YYYY-MM-DD 23:59:59")
        : "";
    } else if (meta.type === "number") {
      rd[f] = conditionValues[f]?.val ?? "";
      rd[f + "Sign"] = conditionValues[f]?.sign ?? "1";
    } else {
      rd[f] = conditionValues[f] ?? "";
    }
  });
  return rd;
}

// 組裝 responseData：所有條件勾選欄位預設 0，被選為報表欄位者設 1
function buildResponseData() {
  const rsp: Record<string, number> = {};
  conditionSelected.value.forEach(f => {
    rsp[f] = responseSelected.value.includes(f) ? 1 : 0;
  });
  // 也允許報表欄位獨立勾選
  responseSelected.value.forEach(f => {
    rsp[f] = 1;
  });
  return rsp;
}

/**
 * 由父層 beforeSure 呼叫：依序校驗三步驟，組裝 payload。
 * 校驗失敗會跳到對應步驟並回傳 null。
 */
async function submit(cb: (payload: any) => void) {
  // Step1
  const valid1 = await new Promise<boolean>(resolve => {
    step1Ref.value.validate((ok: boolean) => resolve(ok));
  });
  if (!valid1) {
    currentStep.value = 0;
    return cb(null);
  }
  if (form.dateRangeType === "2") {
    if (!form.dateRange || !form.dateRange[0] || !form.dateRange[1]) {
      currentStep.value = 0;
      message($t("report.dateRange"), { type: "warning" });
      return cb(null);
    }
  }
  // Step2：至少選一個條件
  if (conditionSelected.value.length === 0) {
    currentStep.value = 1;
    message($t("report.conditionSetting"), { type: "warning" });
    return cb(null);
  }

  // 時間範圍
  if (form.dateRangeType === "1") {
    form.start = "";
    form.end = "";
  } else {
    form.start = dayjs(form.dateRange![0]).format("YYYY-MM-DD 00:00:00");
    form.end = dayjs(form.dateRange![1]).format("YYYY-MM-DD 23:59:59");
  }

  const payload: Record<string, any> = {
    title: form.title,
    description: form.description,
    start: form.start,
    end: form.end,
    requestData: buildRequestData(),
    responseData: buildResponseData()
  };
  // 編輯帶 id
  if (form.mode === "edit" && form.id != null) payload.id = form.id;
  cb(payload);
}

defineExpose({ submit });
</script>

<template>
  <div class="custom-member-form">
    <el-steps :active="currentStep" finish-status="success" align-center>
      <el-step :title="$t('report.basicInfo')" />
      <el-step :title="$t('report.memberFilter')" />
      <el-step :title="$t('report.reportFieldSetting')" />
    </el-steps>

    <!-- Step1 基本資料 -->
    <div v-show="currentStep === 0" class="step-container">
      <el-form
        ref="step1Ref"
        :model="form"
        :rules="step1Rules"
        label-width="120px"
      >
        <el-form-item :label="$t('report.title')" prop="title">
          <el-input v-model="form.title" clearable class="!w-[320px]" />
        </el-form-item>
        <el-form-item :label="$t('report.description')" prop="description">
          <el-input v-model="form.description" clearable class="!w-[320px]" />
        </el-form-item>
        <el-form-item :label="$t('report.dateRange')">
          <el-radio-group v-model="form.dateRangeType">
            <div>
              <el-radio value="1">{{ $t("report.noLimitTime") }}</el-radio>
            </div>
            <div class="mt-2 flex items-center">
              <el-radio value="2">{{ $t("report.customTime") }}</el-radio>
              <el-date-picker
                v-model="form.dateRange"
                type="daterange"
                value-format="YYYY-MM-DD HH:mm:ss"
                :disabled="form.dateRangeType !== '2'"
                range-separator="~"
                :start-placeholder="$t('report.startDate')"
                :end-placeholder="$t('report.endDate')"
                class="!ml-2"
              />
            </div>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <!-- Step2 條件設定 -->
    <div v-show="currentStep === 1" class="step-container">
      <el-row :gutter="16">
        <el-col :span="9">
          <div class="panel">
            <div class="panel-title">
              {{ $t("report.specifiedCondition") }}
            </div>
            <el-checkbox-group v-model="conditionSelected">
              <div v-for="cat in selectCategory" :key="cat.value">
                <div class="cat-header">
                  <el-checkbox
                    :model-value="
                      cat.children.every(c =>
                        conditionSelected.includes(c)
                      )
                    "
                    @change="toggleCategoryCondition(cat.value)"
                  >
                    {{ cat.label }}
                  </el-checkbox>
                </div>
                <div class="cat-children">
                  <el-checkbox
                    v-for="child in cat.children"
                    :key="child"
                    :value="child"
                  >
                    {{ $t("report." + child) }}
                  </el-checkbox>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </el-col>
        <el-col :span="15">
          <div class="panel">
            <div class="panel-title">{{ $t("report.conditionSetting") }}</div>
            <el-form label-width="160px">
              <el-form-item
                v-for="f in visibleConditionFields"
                :key="f"
                :label="$t('report.' + fieldMetaMap[f].labelKey)"
              >
                <!-- input -->
                <el-input
                  v-if="fieldMetaMap[f].type === 'input'"
                  v-model="conditionValues[f]"
                  clearable
                  class="!w-[220px]"
                />
                <!-- select -->
                <el-select
                  v-else-if="fieldMetaMap[f].type === 'select'"
                  v-model="conditionValues[f]"
                  :multiple="fieldMetaMap[f].multiple"
                  clearable
                  class="!w-[220px]"
                >
                  <el-option
                    v-for="opt in fieldMetaMap[f].field === 'vipLevel'
                      ? vipOptions
                      : fieldMetaMap[f].options"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
                <!-- date -->
                <el-date-picker
                  v-else-if="fieldMetaMap[f].type === 'date'"
                  v-model="conditionValues[f]"
                  type="daterange"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  range-separator="~"
                  :start-placeholder="$t('report.startDate')"
                  :end-placeholder="$t('report.endDate')"
                />
                <!-- number with sign -->
                <template v-else>
                  <el-select
                    v-model="conditionValues[f].sign"
                    class="!w-[100px] mr-2"
                  >
                    <el-option
                      v-for="opt in compareOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>
                  <el-input-number
                    v-model="conditionValues[f].val"
                    :controls="false"
                    class="!w-[120px]"
                  />
                </template>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Step3 報表欄位設定 -->
    <div v-show="currentStep === 2" class="step-container">
      <div class="mb-3">
        <span class="text-red-500 mr-1">*</span>
        <span class="mr-3">{{ $t("report.fixedField") }}</span>
        <el-checkbox :model-value="true" disabled>
          {{ $t("report.memberID") }}
        </el-checkbox>
        <el-checkbox :model-value="true" disabled>
          {{ $t("report.memberAccount") }}
        </el-checkbox>
      </div>
      <div class="mb-2">
        <span class="text-red-500 mr-1">*</span>
        <span>{{ $t("report.selectField") }}</span>
      </div>
      <el-checkbox-group v-model="responseSelected">
        <table class="resp-table">
          <tbody>
            <tr v-for="cat in selectCategory" :key="cat.value">
              <td class="resp-cat">
                <el-checkbox
                  :model-value="
                    cat.children.every(c => responseSelected.includes(c))
                  "
                  @change="toggleCategoryResponse(cat.value)"
                >
                  {{ cat.label }}
                </el-checkbox>
              </td>
              <td class="resp-children">
                <el-checkbox
                  v-for="child in cat.children"
                  :key="child"
                  :value="child"
                >
                  {{ $t("report." + child) }}
                </el-checkbox>
              </td>
            </tr>
          </tbody>
        </table>
      </el-checkbox-group>
    </div>

    <!-- 步驟切換 -->
    <div class="step-actions">
      <el-button :disabled="currentStep === 0" @click="currentStep--">
        {{ $t("report.lastStep") }}
      </el-button>
      <el-button :disabled="currentStep === 2" @click="currentStep++">
        {{ $t("report.nextStep") }}
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-member-form {
  .step-container {
    padding: 20px 8px;
  }

  .panel {
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    padding: 16px;
    min-height: 360px;
  }

  .panel-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .cat-header {
    background-color: var(--el-fill-color-light);
    padding: 8px 12px;
    margin: 8px 0;
  }

  .cat-children {
    display: flex;
    flex-wrap: wrap;
    padding-left: 16px;

    :deep(.el-checkbox) {
      margin-right: 16px;
    }
  }

  .resp-table {
    width: 100%;
    border-collapse: collapse;

    td {
      border: 1px solid var(--el-border-color);
      padding: 12px;
      vertical-align: middle;
    }

    .resp-cat {
      width: 20%;
      text-align: center;
    }

    .resp-children {
      :deep(.el-checkbox) {
        margin-right: 16px;
      }
    }
  }

  .step-actions {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 16px;
  }
}
</style>
