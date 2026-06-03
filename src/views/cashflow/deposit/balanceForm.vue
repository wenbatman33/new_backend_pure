<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { balanceDateFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { BalanceDateFormProps } from "./utils/types";

const props = withDefaults(defineProps<BalanceDateFormProps>(), {
  formInline: () => ({
    balanceDate: dayjs().format("YYYY-MM-DD"),
    note: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function handleToday() {
  newFormInline.value.balanceDate = dayjs().format("YYYY-MM-DD");
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
    :rules="balanceDateFormRules"
    label-width="120px"
  >
    <el-form-item :label="$t('cashflow.balanceDate')" prop="balanceDate">
      <div class="flex w-full items-center">
        <el-date-picker
          v-model="newFormInline.balanceDate"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled-date="(d: Date) => d.getTime() > Date.now()"
          class="flex-grow"
        />
        <el-button type="primary" class="ml-2" @click="handleToday">
          {{ $t("cashflow.balanceDateModal3") }}
        </el-button>
      </div>
    </el-form-item>
    <el-form-item :label="$t('cashflow.description')" prop="note">
      <el-input v-model="newFormInline.note" type="textarea" :rows="3" />
    </el-form-item>
  </el-form>
</template>
