<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    sort: 999,
    hidden: false,
    top: false,
    start: "",
    language: "en",
    title: "",
    context: ""
  }),
  mode: "Create",
  announcementMultiple: () => [],
  languageList: () => ["en"]
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 語系選項：en 顯示為 en(預設)，並把 en 置頂
const languageOptions = props.languageList
  .map(item =>
    item === "en"
      ? { label: `en(${$t("operator.default")})`, value: "en" }
      : { label: item, value: item }
  )
  .sort((a, b) => (a.value === "en" ? -1 : b.value === "en" ? 1 : 0));

// 切換語系時，編輯模式下回填對應語系的標題/內容
function handleLanguageChange(val: string) {
  if (props.mode !== "Edit") return;
  const matched = props.announcementMultiple.find(i => i.language === val);
  if (matched) {
    newFormInline.value.title = matched.title;
    newFormInline.value.context = matched.context;
  } else {
    newFormInline.value.title = "";
    newFormInline.value.context = "";
  }
}

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
    label-width="120px"
  >
    <el-form-item :label="$t('operator.addedTime')" prop="start">
      <el-date-picker
        v-model="newFormInline.start"
        type="datetime"
        value-format="YYYY/MM/DD HH:mm:ss"
        format="YYYY/MM/DD HH:mm"
        class="!w-[260px]"
        :placeholder="$t('operator.addedTime')"
      />
    </el-form-item>

    <el-form-item :label="$t('operator.sort')" prop="sort">
      <el-input-number v-model="newFormInline.sort" :min="0" />
    </el-form-item>

    <el-form-item :label="$t('operator.hiddenYesOrNo')" prop="hidden">
      <el-switch v-model="newFormInline.hidden" />
    </el-form-item>

    <el-form-item :label="$t('operator.pinToTop')" prop="top">
      <el-checkbox v-model="newFormInline.top" />
    </el-form-item>

    <el-form-item :label="$t('operator.language')" prop="language">
      <el-radio-group
        v-model="newFormInline.language"
        @change="handleLanguageChange"
      >
        <el-radio-button
          v-for="item in languageOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
      <div class="ml-2 text-[12px] text-[var(--el-text-color-secondary)]">
        <div>{{ $t("operator.helpMessage1") }}</div>
        <div>{{ $t("operator.helpMessage2") }}</div>
      </div>
    </el-form-item>

    <el-form-item :label="$t('operator.title')" prop="title">
      <el-input
        v-model="newFormInline.title"
        clearable
        :placeholder="$t('operator.plzInputAnnouncementTitle')"
      />
    </el-form-item>

    <!-- TODO: 舊版用 Tinymce 富文字編輯器；pure 專案尚未移植，先以 textarea 替代 -->
    <el-form-item :label="$t('operator.content')" prop="context">
      <el-input
        v-model="newFormInline.context"
        type="textarea"
        :rows="6"
        clearable
      />
    </el-form-item>
  </el-form>
</template>
