<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  socialType: "member",
  formInline: () => ({
    id: "",
    order: "",
    iconUrl: "",
    name: "",
    subtitle: "",
    openWay: 1,
    link: "",
    license: "",
    group: "",
    show: 2
  })
});

const openWayOptions = [
  { label: $t("operator.anotherOpenWay"), value: 1 },
  { label: $t("operator.iframe"), value: 2 },
  { label: "Livechat chatbot", value: 3 },
  { label: "tawk.to chatbot", value: 4 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

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
    <el-form-item :label="$t('operator.order')" prop="order">
      <el-input v-model="newFormInline.order" clearable />
    </el-form-item>

    <!-- TODO: 舊碼使用 UploadFile 元件上傳圖標（@/views/common/UploadFile，尚未移植），
         目前先以文字欄位填入圖標路徑替代 -->
    <el-form-item :label="$t('operator.icon')" prop="iconUrl">
      <el-input v-model="newFormInline.iconUrl" clearable />
    </el-form-item>

    <el-form-item :label="$t('operator.name')" prop="name">
      <el-input v-model="newFormInline.name" clearable />
    </el-form-item>

    <el-form-item
      v-if="props.socialType === 'member'"
      :label="$t('operator.subtitle')"
      prop="subtitle"
    >
      <el-input v-model="newFormInline.subtitle" clearable />
    </el-form-item>

    <el-form-item :label="$t('operator.openWay')" prop="openWay">
      <el-select v-model="newFormInline.openWay" class="w-full">
        <el-option
          v-for="item in openWayOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('operator.link')" prop="link">
      <el-input v-model="newFormInline.link" clearable />
    </el-form-item>

    <el-form-item :label="$t('operator.license')" prop="license">
      <el-input v-model="newFormInline.license" clearable />
    </el-form-item>

    <el-form-item :label="$t('operator.group')" prop="group">
      <el-input v-model="newFormInline.group" clearable />
    </el-form-item>

    <el-form-item :label="$t('operator.show')" prop="show">
      <el-switch
        v-model="newFormInline.show"
        :active-value="1"
        :inactive-value="2"
      />
    </el-form-item>
  </el-form>
</template>
