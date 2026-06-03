<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    promoEventID: "",
    promoGameID: "",
    note: "",
    status: 1,
    eventStartTime: "",
    eventEndTime: ""
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
    label-width="120px"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item :label="$t('promotion.activityCode')" prop="promoEventID">
          <el-input v-model="newFormInline.promoEventID" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('promotion.eventNumber')" prop="promoGameID">
          <el-input v-model="newFormInline.promoGameID" clearable />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item :label="$t('promotion.eventDetails')" prop="note">
      <el-input v-model="newFormInline.note" type="textarea" :rows="2" clearable />
    </el-form-item>

    <el-form-item :label="$t('promotion.status')" prop="status">
      <el-switch
        v-model="newFormInline.status"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.eventStartTime')" prop="eventStartTime">
      <el-date-picker
        v-model="newFormInline.eventStartTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY/MM/DD HH:mm"
        class="!w-full"
        :placeholder="$t('promotion.eventStartTime')"
      />
    </el-form-item>

    <el-form-item :label="$t('promotion.eventEndTime')" prop="eventEndTime">
      <el-date-picker
        v-model="newFormInline.eventEndTime"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY/MM/DD HH:mm"
        class="!w-full"
        :placeholder="$t('promotion.eventEndTime')"
      />
    </el-form-item>
  </el-form>
</template>
