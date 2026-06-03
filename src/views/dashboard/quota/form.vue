<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { useTypeOptions } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(
  defineProps<FormProps & { websiteName?: string }>(),
  {
    websiteName: "",
    formInline: () => ({
      useType: "",
      createdAt: "",
      adjustMoney: "",
      note: ""
    })
  }
);

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
    label-width="150px"
  >
    <el-form-item :label="$t('dashboard.formWebsiteName')">
      <span>{{ websiteName }}</span>
    </el-form-item>

    <el-form-item :label="$t('dashboard.formUseType')" prop="useType">
      <el-select
        v-model="newFormInline.useType"
        class="w-full"
        :placeholder="$t('dashboard.formUseType')"
      >
        <el-option
          v-for="item in useTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('dashboard.formCreatedAt')" prop="createdAt">
      <el-date-picker
        v-model="newFormInline.createdAt"
        class="w-full"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        :placeholder="$t('dashboard.formCreatedAt')"
      />
    </el-form-item>

    <el-form-item :label="$t('dashboard.formAdjustMoney')" prop="adjustMoney">
      <el-input-number
        v-model="newFormInline.adjustMoney"
        class="!w-full"
        :controls="false"
        :placeholder="$t('dashboard.plzEnterAmount')"
      />
    </el-form-item>

    <el-form-item :label="$t('dashboard.formNote')" prop="note">
      <el-input
        v-model="newFormInline.note"
        type="textarea"
        :rows="3"
        :placeholder="$t('dashboard.plzEnterRemark')"
      />
    </el-form-item>
  </el-form>
</template>
