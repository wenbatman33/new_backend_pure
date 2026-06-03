<script setup lang="ts">
import { ref } from "vue";
import { adjustFormRules } from "./utils/rule";
import { getAdjustTypeOptions } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import { message } from "@/utils/message";
import type { AdjustFormProps } from "./utils/types";

const props = withDefaults(defineProps<AdjustFormProps>(), {
  formInline: () => ({
    subject: "",
    type: 0,
    turnoverTimes: "",
    desc: "",
    targetList: []
  })
});

const typeOptions = getAdjustTypeOptions();

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
// 待加入的代理帳號
const addAccount = ref("");

function getRef() {
  return ruleFormRef.value;
}

// 加入單筆代理帳號
function addNew() {
  if (!addAccount.value) return;
  newFormInline.value.targetList.push({
    agencyAccount: addAccount.value,
    amount: 0
  });
  addAccount.value = "";
}

// 刪除單筆
function handleDelete(index: number) {
  newFormInline.value.targetList.splice(index, 1);
}

// TODO: 批次匯入(Excel)/範例下載原依賴 @/components/Excel（未移植），暫以提示佔位
function batchJoin() {
  message($t("agency.batchJoin"), { type: "info" });
}
function download() {
  message($t("agency.sampleDownload"), { type: "info" });
}

defineExpose({ getRef });
</script>

<template>
  <el-row :gutter="20">
    <el-col :xl="12" :lg="24">
      <el-form
        ref="ruleFormRef"
        :model="newFormInline"
        :rules="adjustFormRules"
        label-width="120px"
      >
        <el-form-item :label="$t('agency.name')" prop="subject">
          <el-input v-model="newFormInline.subject" clearable />
        </el-form-item>
        <el-form-item :label="$t('agency.transactionType')" prop="type">
          <el-select v-model="newFormInline.type" class="w-full">
            <el-option :label="$t('agency.chooseText')" :value="0" />
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('agency.turnoverLimit')" prop="turnoverTimes">
          <el-input
            v-model="newFormInline.turnoverTimes"
            clearable
            :placeholder="$t('agency.pleaseEnterANumberAbove0')"
          />
        </el-form-item>
        <el-form-item :label="$t('agency.describe')" prop="desc">
          <el-input v-model="newFormInline.desc" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :xl="12" :lg="24">
      <div class="flex items-center gap-2 mb-3 flex-wrap">
        <el-input
          v-model="addAccount"
          class="!w-[160px]"
          :placeholder="$t('agency.plzKeyAgencyAccount')"
        />
        <el-button type="primary" @click="addNew">
          {{ $t("agency.joinIn") }}
        </el-button>
        <el-button type="primary" @click="batchJoin">
          {{ $t("agency.batchJoin") }}
        </el-button>
        <el-button type="primary" @click="download">
          {{ $t("agency.sampleDownload") }}
        </el-button>
      </div>
      <el-table :data="newFormInline.targetList" border max-height="400">
        <el-table-column
          :label="$t('agency.agencyAccount')"
          prop="agencyAccount"
        />
        <el-table-column :label="$t('agency.amount')" width="140">
          <template #default="{ row }">
            <el-input v-model="row.amount" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('agency.action')" width="90">
          <template #default="{ $index }">
            <el-button link type="danger" @click="handleDelete($index)">
              {{ $t("agency.delText") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
