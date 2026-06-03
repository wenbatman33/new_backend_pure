<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    info: "",
    worldCupScheduleId: 0,
    link1: "",
    link2: "",
    link3: "",
    link4: "",
    link5: "",
    isLiveLabel: 2,
    isLive: 2
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
    <el-form-item :label="$t('activity.streamingEventInfo')">
      <span>{{ newFormInline.info }}</span>
    </el-form-item>

    <el-form-item :label="$t('activity.streamingLink1')" prop="link1">
      <el-input
        v-model="newFormInline.link1"
        clearable
        :placeholder="$t('activity.streamingLink1Tip')"
      />
    </el-form-item>
    <el-form-item :label="$t('activity.streamingLink2')" prop="link2">
      <el-input
        v-model="newFormInline.link2"
        clearable
        :placeholder="$t('activity.streamingLink2Tip')"
      />
    </el-form-item>
    <el-form-item :label="$t('activity.streamingLink3')" prop="link3">
      <el-input
        v-model="newFormInline.link3"
        clearable
        :placeholder="$t('activity.streamingLink3Tip')"
      />
    </el-form-item>
    <el-form-item :label="$t('activity.streamingLink4')" prop="link4">
      <el-input
        v-model="newFormInline.link4"
        clearable
        :placeholder="$t('activity.streamingLink4Tip')"
      />
    </el-form-item>
    <el-form-item :label="$t('activity.streamingLink5')" prop="link5">
      <el-input
        v-model="newFormInline.link5"
        clearable
        :placeholder="$t('activity.streamingLink5Tip')"
      />
    </el-form-item>

    <el-form-item :label="$t('activity.streamingIsLiveLabel')" prop="isLiveLabel">
      <el-switch
        v-model="newFormInline.isLiveLabel"
        :active-value="1"
        :inactive-value="2"
      />
    </el-form-item>
    <el-form-item :label="$t('activity.streamingIsShow')" prop="isLive">
      <el-switch
        v-model="newFormInline.isLive"
        :active-value="1"
        :inactive-value="2"
      />
    </el-form-item>
  </el-form>
</template>
