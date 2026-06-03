<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    name: "",
    gameGroups: [],
    gameLists: [],
    status: 1
  })
});

// 狀態下拉（不含全部）
const statusOptions = [
  { label: $t("games.statusOpen"), value: 1 },
  { label: $t("games.statusClose"), value: 2 },
  { label: $t("games.statusMaintenance"), value: 3 },
  { label: $t("games.statusHidden"), value: 4 }
];

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
    label-width="160px"
  >
    <el-row :gutter="16">
      <el-col :span="8">
        <el-form-item label="ID" prop="id">
          <el-input v-model="newFormInline.id" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.agentName')" prop="name">
          <el-input v-model="newFormInline.name" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          :label="$t('games.subsidiaryManufacturers')"
          prop="gameGroups"
        >
          <el-input
            :model-value="
              Array.isArray(newFormInline.gameGroups)
                ? newFormInline.gameGroups.join(' ')
                : newFormInline.gameGroups
            "
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.agentGameType')" prop="gameLists">
          <el-input
            :model-value="
              Array.isArray(newFormInline.gameLists)
                ? newFormInline.gameLists.join(' ')
                : newFormInline.gameLists
            "
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('games.status')" prop="status">
          <el-select
            v-model="newFormInline.status"
            class="w-full"
            :placeholder="$t('games.status')"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
