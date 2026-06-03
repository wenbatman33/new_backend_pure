<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { deeplinkTypeOptions } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  isEdit: false,
  formInline: () => ({
    startType: 1,
    sendTime: "",
    memberType: 1,
    platform: 1,
    deeplinkType: 0,
    deeplinkPage: "",
    deeplinkID: "",
    title: "",
    content: ""
  })
});

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
    <!-- 發送時間 -->
    <el-form-item :label="$t('operator.jpushSendTime')" prop="startType">
      <el-radio-group v-model="newFormInline.startType">
        <el-radio :value="1">{{ $t("operator.immediately") }}</el-radio>
        <el-radio :value="2">{{ $t("operator.reserve") }}</el-radio>
      </el-radio-group>
      <el-date-picker
        v-if="Number(newFormInline.startType) === 2"
        v-model="newFormInline.sendTime"
        type="datetime"
        class="ml-3 !w-[220px]"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY/MM/DD HH:mm"
        :placeholder="$t('operator.jpushSendTime')"
      />
    </el-form-item>

    <!-- 對象 -->
    <el-form-item :label="$t('operator.jpushTarget')">
      <el-radio-group v-model="newFormInline.memberType">
        <el-radio :value="1">{{ $t("operator.jpushAllSite") }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 平台 -->
    <el-form-item :label="$t('operator.jpushPlatform')">
      <el-radio-group v-model="newFormInline.platform">
        <el-radio :value="1">Android App</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 引導位置 -->
    <el-form-item :label="$t('operator.openMethod')" prop="deeplinkType">
      <el-select v-model="newFormInline.deeplinkType" class="!w-[220px]">
        <el-option
          v-for="item in deeplinkTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-if="Number(newFormInline.deeplinkType) > 0"
        v-model="newFormInline.deeplinkID"
        clearable
        class="ml-3 !w-[200px]"
        :placeholder="$t('operator.jpushDeeplinkId')"
      />
    </el-form-item>

    <!-- 標題 -->
    <el-form-item :label="$t('operator.jpushColTitle')" prop="title">
      <el-input
        v-model="newFormInline.title"
        clearable
        :placeholder="$t('operator.jpushTitlePlaceholder')"
      />
    </el-form-item>

    <!-- 內容 -->
    <el-form-item :label="$t('operator.jpushColContent')" prop="content">
      <el-input
        v-model="newFormInline.content"
        type="textarea"
        :rows="4"
        :placeholder="$t('operator.jpushContentPlaceholder')"
      />
    </el-form-item>
  </el-form>
</template>
