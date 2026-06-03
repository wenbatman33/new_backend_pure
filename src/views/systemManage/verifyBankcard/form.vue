<script setup lang="ts">
import { ref } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = defineProps<FormProps>();

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const record = newFormInline.value.record;
const editParams = record.params ?? {};

function has(key: string) {
  return Object.prototype.hasOwnProperty.call(record, key);
}
function hasParam(key: string) {
  return Object.prototype.hasOwnProperty.call(editParams, key);
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" label-width="160px">
    <el-form-item :label="$t('systemManage.tradeNames')">
      <span>{{ record.name }}</span>
    </el-form-item>

    <el-form-item v-if="has('url')" :label="$t('systemManage.manufacturerBackendURL')">
      <el-input v-model="newFormInline.backendUrl" clearable />
    </el-form-item>

    <el-form-item v-if="has('check_name_url')" :label="$t('systemManage.twoElementURL')">
      <el-input v-model="newFormInline.checkNameUrl" clearable />
    </el-form-item>

    <el-form-item v-if="has('get_belong_url')" :label="$t('systemManage.homeURL')">
      <el-input v-model="newFormInline.getBelongUrl" clearable />
    </el-form-item>

    <el-form-item v-if="has('boURL')" label="boURL">
      <el-input v-model="newFormInline.boURL" clearable />
    </el-form-item>

    <el-form-item v-if="has('apiDomain')" label="apiDomain">
      <el-input v-model="newFormInline.apiDomain" clearable />
    </el-form-item>

    <el-form-item v-if="has('api_domain')" :label="$t('systemManage.homeURL')">
      <el-input v-model="newFormInline.apiDomain" clearable />
    </el-form-item>

    <el-form-item v-if="hasParam('APPID')" label="APPID">
      <el-input v-model="newFormInline.params.APPID" clearable />
    </el-form-item>

    <el-form-item v-if="hasParam('APP_SECURITY')" label="APP_SECURITY">
      <el-input v-model="newFormInline.params.APP_SECURITY" clearable />
    </el-form-item>

    <el-form-item
      v-if="hasParam('KEY_CHECK_NAME')"
      :label="$t('systemManage.twoElementsRequestKey')"
    >
      <el-input v-model="newFormInline.params.KEY_CHECK_NAME" clearable />
    </el-form-item>

    <el-form-item
      v-if="hasParam('KEY_GET_BELONG')"
      :label="$t('systemManage.placeOfBelonging')"
    >
      <el-input v-model="newFormInline.params.KEY_GET_BELONG" clearable />
    </el-form-item>

    <el-form-item v-if="hasParam('OPEN_ID')" label="OPEN_ID">
      <el-input v-model="newFormInline.params.OPEN_ID" clearable />
    </el-form-item>

    <el-form-item v-if="hasParam('APP_ID')" label="APP_ID">
      <el-input v-model="newFormInline.params.APP_ID" clearable />
    </el-form-item>

    <el-form-item v-if="hasParam('APP_KEY')" label="APP_KEY">
      <el-input v-model="newFormInline.params.APP_KEY" clearable />
    </el-form-item>

    <el-form-item v-if="hasParam('URL_CHECK_QUOTA')" label="URL_CHECK_QUOTA">
      <el-input v-model="newFormInline.params.URL_CHECK_QUOTA" clearable />
    </el-form-item>
  </el-form>
</template>
