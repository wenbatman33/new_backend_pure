<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    memberAccounts: [],
    sendTimeType: 1,
    sendAt: "",
    title: "",
    titlePh: "",
    content: "",
    mode: "Create"
  })
});

const sendTimeOptions = [
  { label: $t("operator.immediately"), value: 1 },
  { label: $t("operator.reserve"), value: 2 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// read 模式僅供檢視，所有欄位 disabled
const readonly = computed(() => newFormInline.value.mode === "read");

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-form-item :label="$t('operator.recipient')" prop="memberAccounts">
      <!-- 收件人帳號：可輸入多筆（tag 模式）；人工型別或檢視模式停用 -->
      <el-select
        v-model="newFormInline.memberAccounts"
        multiple
        filterable
        allow-create
        default-first-option
        :disabled="readonly"
        class="w-full"
        :placeholder="$t('operator.plzInputMemberAccount')"
      />
    </el-form-item>

    <el-form-item :label="$t('operator.sendTime')" prop="sendTimeType">
      <el-radio-group v-model="newFormInline.sendTimeType" :disabled="readonly">
        <el-radio
          v-for="item in sendTimeOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      v-if="newFormInline.sendTimeType === 2"
      :label="$t('operator.reserve')"
      prop="sendAt"
    >
      <el-date-picker
        v-model="newFormInline.sendAt"
        type="datetime"
        :disabled="readonly"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY/MM/DD HH:mm"
        :placeholder="$t('operator.sendTime')"
      />
    </el-form-item>

    <el-form-item :label="$t('operator.title')" prop="title">
      <el-input
        v-model="newFormInline.title"
        clearable
        :disabled="readonly"
        :placeholder="$t('operator.plzInputTitle')"
      />
    </el-form-item>

    <el-form-item :label="$t('operator.titlePh')" prop="titlePh">
      <el-input
        v-model="newFormInline.titlePh"
        clearable
        :disabled="readonly"
        :placeholder="$t('operator.plzInputTitle')"
      />
    </el-form-item>

    <el-form-item :label="$t('operator.content')" prop="content">
      <!-- TODO: 舊版使用 Tinymce 富文字編輯器（含圖片上傳），pure 專案未移植，先以多行文字框替代 -->
      <el-input
        v-model="newFormInline.content"
        type="textarea"
        :rows="6"
        :disabled="readonly"
        :placeholder="$t('operator.content')"
      />
    </el-form-item>
  </el-form>
</template>
