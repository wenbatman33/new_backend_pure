<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    sportId: "",
    specificCompetition: false,
    competitionId: [],
    start: "",
    end: "",
    route: "",
    hidden: false,
    isReview: false
  }),
  sportIdOptions: () => []
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
    <el-form-item :label="$t('saba.tableName')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        :disabled="newFormInline.isReview"
        class="!w-[320px]"
      />
    </el-form-item>

    <el-form-item :label="$t('saba.searchSportId')" prop="sportId">
      <el-select
        v-model="newFormInline.sportId"
        :disabled="newFormInline.isReview"
        class="!w-[320px]"
      >
        <el-option
          v-for="item in sportIdOptions.filter(o => o.value > 0)"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('saba.tableStart')" prop="start">
      <el-date-picker
        v-model="newFormInline.start"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        :disabled="newFormInline.isReview"
        class="!w-[320px]"
      />
    </el-form-item>

    <el-form-item :label="$t('saba.tableEnd')" prop="end">
      <el-date-picker
        v-model="newFormInline.end"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        :disabled="newFormInline.isReview"
        class="!w-[320px]"
      />
    </el-form-item>

    <el-form-item :label="$t('saba.promotionRoute')" prop="route">
      <el-input
        v-model="newFormInline.route"
        clearable
        :placeholder="$t('saba.promotionRouteRule')"
        :disabled="newFormInline.isReview || !!newFormInline.id"
        class="!w-[450px]"
      />
    </el-form-item>
  </el-form>
</template>
