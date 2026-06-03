<script setup lang="ts">
import { ref } from "vue";
import { editFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { EditFormProps } from "./utils/types";

const props = withDefaults(defineProps<EditFormProps>(), {
  formInline: () => ({
    id: 0,
    gameGroupID: undefined,
    gameTypeID: undefined,
    name: "",
    displayName: "",
    sort: "",
    bettingCode: "",
    gameCodePc: "",
    gameCodeH5: "",
    isNewGame: false,
    isHotGame: false,
    status: 1
  }),
  gameTypeOptions: () => [],
  gameGroupOptions: () => []
});

const statusOptions = [
  { label: $t("games.open"), value: 1 },
  { label: $t("games.close"), value: 2 },
  { label: $t("games.maintain"), value: 3 },
  { label: $t("games.hide"), value: 4 }
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
    :rules="editFormRules"
    label-width="120px"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item :label="$t('games.id')" prop="id">
          <el-input v-model="newFormInline.id" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.group')" prop="gameGroupID">
          <el-select
            v-model="newFormInline.gameGroupID"
            clearable
            class="w-full"
          >
            <el-option
              v-for="item in gameGroupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.type')" prop="gameTypeID">
          <el-select
            v-model="newFormInline.gameTypeID"
            disabled
            class="w-full"
          >
            <el-option
              v-for="item in gameTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.name')" prop="name">
          <el-input v-model="newFormInline.name" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.displayName')" prop="displayName">
          <el-input v-model="newFormInline.displayName" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.sort')" prop="sort">
          <el-input v-model="newFormInline.sort" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.gameCode')" prop="bettingCode">
          <el-input v-model="newFormInline.bettingCode" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.gameCodePc')" prop="gameCodePc">
          <el-input v-model="newFormInline.gameCodePc" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.gameCodeH5')" prop="gameCodeH5">
          <el-input v-model="newFormInline.gameCodeH5" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.status')" prop="status">
          <el-select v-model="newFormInline.status" class="w-full">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.isNewGame')" prop="isNewGame">
          <el-checkbox v-model="newFormInline.isNewGame" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.isHotGame')" prop="isHotGame">
          <el-checkbox v-model="newFormInline.isHotGame" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
