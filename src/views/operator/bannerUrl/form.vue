<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    status: 1,
    keyword: [],
    recommendTypeSort: []
  }),
  recommendTypeOptions: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 推薦類型排序：每一格各選一個值，已被其他格選走的不再出現（保留自己）
const slots = computed(() => props.recommendTypeOptions.length);

function filterSelect(index: number) {
  return props.recommendTypeOptions.filter(
    el =>
      el.value === newFormInline.value.recommendTypeSort[index] ||
      !newFormInline.value.recommendTypeSort.includes(el.value)
  );
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
    <el-form-item v-if="newFormInline.ID != null" label="ID">
      <span>{{ newFormInline.ID }}</span>
    </el-form-item>

    <el-form-item :label="$t('operator.name')" prop="name">
      <el-input v-model="newFormInline.name" clearable class="!w-[320px]" />
    </el-form-item>

    <el-form-item :label="$t('operator.status')" prop="status">
      <el-switch
        v-model="newFormInline.status"
        :active-value="1"
        :inactive-value="2"
        :active-text="$t('operator.enable')"
        :inactive-text="$t('operator.disable')"
        inline-prompt
      />
    </el-form-item>

    <el-form-item :label="$t('operator.keyword')" prop="keyword">
      <el-select
        v-model="newFormInline.keyword"
        multiple
        filterable
        allow-create
        default-first-option
        :reserve-keyword="false"
        class="!w-full"
        :placeholder="$t('operator.keyword')"
      />
    </el-form-item>

    <el-form-item
      :label="$t('operator.recommendTypeSort')"
      prop="recommendTypeSort"
    >
      <div class="w-full">
        <div
          v-for="index in slots"
          :key="index"
          class="flex flex-row items-center mb-2"
        >
          <span class="w-8 text-center">{{ index }}:</span>
          <el-select
            v-model="newFormInline.recommendTypeSort[index - 1]"
            clearable
            class="!w-[260px]"
          >
            <el-option
              v-for="item in filterSelect(index - 1)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>
