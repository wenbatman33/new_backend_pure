<script setup lang="ts">
import { ref, watch } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { getBannerCategory, getLotteryList } from "@/api/systemManage";
import type { FormProps, IdOption } from "./utils/types";
import Delete from "~icons/ep/delete";
import Plus from "~icons/ep/plus";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    isUpdate: false,
    type: 1,
    id: "",
    name: "",
    content: [{ column: "", size: 0 }],
    idOptions: []
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 依資料表型別載入對應類別下拉
async function loadIdOptions(type: number) {
  const fn = type === 1 ? getBannerCategory : getLotteryList;
  const { success, data } = await fn();
  if (success) {
    const list = data?.list ?? [];
    newFormInline.value.idOptions = list.map((i: any) => ({
      label: `${i.id} (${i.name})`,
      value: i.id
    })) as IdOption[];
  }
}

function onTypeChange(val: number) {
  newFormInline.value.id = "";
  loadIdOptions(val);
}

// 新增模式進來時預載一次類別下拉
watch(
  () => newFormInline.value.isUpdate,
  isUpdate => {
    if (!isUpdate) loadIdOptions(newFormInline.value.type);
  },
  { immediate: true }
);

function addRow() {
  newFormInline.value.content.push({ column: "", size: 0 });
}

function delRow(index: number) {
  newFormInline.value.content.splice(index, 1);
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
    <!-- 新增模式：選擇資料表型別 -->
    <template v-if="!newFormInline.isUpdate">
      <el-form-item :label="$t('systemManage.dataSheet')" prop="type">
        <el-radio-group v-model="newFormInline.type" @change="onTypeChange">
          <el-radio :value="1">{{ $t("systemManage.advertise") }}</el-radio>
          <el-radio :value="2">{{ $t("systemManage.sitePage") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="ID:" prop="id">
        <el-select
          v-model="newFormInline.id"
          clearable
          class="!w-[260px]"
          filterable
        >
          <el-option
            v-for="item in newFormInline.idOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </template>

    <!-- 編輯模式：唯讀顯示型別與 ID -->
    <template v-else>
      <el-form-item :label="$t('systemManage.dataSheet')">
        <span>
          {{
            newFormInline.type === 1
              ? $t("systemManage.advertise")
              : $t("systemManage.sitePage")
          }}
        </span>
      </el-form-item>
      <el-form-item label="ID:">
        <span>{{ newFormInline.id }} ({{ newFormInline.name }})</span>
      </el-form-item>
    </template>

    <!-- 尺寸設定：欄位 + 限制大小（kb），可多筆 -->
    <el-form-item :label="$t('systemManage.imageFileName')">
      <div class="w-full">
        <div
          v-for="(item, index) in newFormInline.content"
          :key="index"
          class="flex items-center mb-3"
        >
          <el-input v-model="item.column" class="!w-[100px]" />
          <span class="mx-3">{{ $t("systemManage.restrictedSize") }}</span>
          <el-input v-model.number="item.size" class="!w-[100px]" />
          <span class="ml-2">kb</span>
          <el-button
            class="ml-6"
            :disabled="newFormInline.content.length === 1"
            :icon="Delete"
            @click="delRow(index)"
          />
        </div>
        <el-button :icon="Plus" @click="addRow">
          {{ $t("systemManage.add") }}
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>
