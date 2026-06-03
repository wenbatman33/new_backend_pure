<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: 0,
    name: "",
    league: null,
    isActive: 1,
    startTime: "",
    endTime: ""
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
    label-width="90px"
  >
    <el-form-item :label="$t('activity.league')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="$t('activity.pleaseChoiceLeague')"
      />
    </el-form-item>

    <el-form-item :label="$t('activity.leagueID')" prop="league">
      <el-input-number
        v-model="newFormInline.league"
        :min="0"
        :controls="false"
        class="!w-full"
        :placeholder="$t('activity.pleaseEnterLeagueID')"
      />
    </el-form-item>

    <el-form-item :label="$t('activity.isActive')" prop="isActive">
      <el-switch
        v-model="newFormInline.isActive"
        :active-value="1"
        :inactive-value="2"
      />
    </el-form-item>

    <el-form-item :label="$t('activity.timeInterval')" prop="startTime">
      <el-date-picker
        v-model="newFormInline.startTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        :placeholder="$t('activity.startTime')"
        class="!w-full"
      />
    </el-form-item>

    <el-form-item label=" " prop="endTime">
      <el-date-picker
        v-model="newFormInline.endTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        :placeholder="$t('activity.endTime')"
        class="!w-full"
      />
    </el-form-item>
  </el-form>
</template>
