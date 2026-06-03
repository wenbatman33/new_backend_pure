<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { categoryOptions, statusOptions } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    ipRange: "",
    name: "",
    category: "",
    source: "",
    remark: "",
    status: 1
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
    <el-form-item :label="$t('systemManage.ipRange')" prop="ipRange">
      <el-input
        v-model="newFormInline.ipRange"
        clearable
        :placeholder="$t('systemManage.ipRangePlaceholder')"
      />
    </el-form-item>

    <el-form-item :label="$t('systemManage.name')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :placeholder="$t('systemManage.enterName')"
      />
    </el-form-item>

    <el-form-item :label="$t('systemManage.category')" prop="category">
      <el-select
        v-model="newFormInline.category"
        clearable
        class="w-full"
        :placeholder="$t('systemManage.selectCategory')"
      >
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('systemManage.source')" prop="source">
      <el-input
        v-model="newFormInline.source"
        clearable
        :placeholder="$t('systemManage.enterSource')"
      />
    </el-form-item>

    <el-form-item :label="$t('systemManage.remark')" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        type="textarea"
        :rows="2"
        clearable
        :placeholder="$t('systemManage.enterRemark')"
      />
    </el-form-item>

    <el-form-item :label="$t('systemManage.status')" prop="status">
      <el-select v-model="newFormInline.status" class="w-full">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
