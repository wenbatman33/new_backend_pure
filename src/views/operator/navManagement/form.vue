<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    lobbyType: 1,
    navigationName: [],
    sort: 0,
    status: false,
    dynamic: false,
    icon: "",
    iconColor: "",
    iconColor2: "",
    content: "",
    note: "",
    gameGroup: undefined,
    gameListId: undefined
  }),
  languageList: () => [],
  gameGroupOptions: () => [],
  gameList: () => []
});

// lobbyType 下拉（1 遊戲分類僅展示用，新增時不可選；沿用舊碼把 1 設 disabled）
const lobbyTypeOptions = [
  { label: $t("operator.naviGameCategory"), value: 1, disabled: true },
  { label: $t("operator.naviStartTheGame"), value: 2 },
  { label: $t("operator.naviGoToSpecifiedPage"), value: 3 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// lobbyType=2 時依廠商過濾遊戲清單
const filterGameList = computed(() => {
  const gid = newFormInline.value.gameGroup;
  return props.gameList
    .filter(item => item.gameGroup === gid)
    .map(item => ({ label: item.displayName, value: item.id }));
});

// 切換廠商時，自動選第一個遊戲
watch(
  () => newFormInline.value.gameGroup,
  () => {
    const first = filterGameList.value[0];
    newFormInline.value.gameListId = first ? first.value : undefined;
  }
);

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
    label-width="90px"
  >
    <el-form-item :label="$t('operator.type')" prop="lobbyType">
      <el-select
        v-model="newFormInline.lobbyType"
        class="!w-[240px]"
        :placeholder="$t('operator.naviChoose')"
      >
        <el-option
          v-for="item in lobbyTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </el-select>
    </el-form-item>

    <!-- 各語系導覽名稱 -->
    <el-form-item :label="$t('operator.naviName')" prop="navigationName">
      <div class="w-full">
        <div
          v-for="(item, index) in newFormInline.navigationName"
          :key="index"
          class="flex items-center mb-2"
        >
          <el-input
            v-model="item.name"
            class="!w-[240px] mr-2"
            :placeholder="$t('operator.naviName')"
          />
          <span class="text-[13px] text-[var(--el-text-color-secondary)]">
            {{ $t("operator.naviLanguage") }}：{{ item.language }}
          </span>
        </div>
      </div>
    </el-form-item>

    <el-form-item :label="$t('operator.sort')" prop="sort">
      <el-input-number v-model="newFormInline.sort" :min="0" controls-position="right" />
    </el-form-item>

    <el-form-item :label="$t('operator.showOrHidden')" prop="status">
      <el-switch
        v-model="newFormInline.status"
        :active-text="$t('operator.show')"
        :inactive-text="$t('operator.hidden')"
        inline-prompt
      />
    </el-form-item>

    <el-form-item :label="$t('operator.dynamic')" prop="dynamic">
      <el-switch
        v-model="newFormInline.dynamic"
        :active-text="$t('operator.dynamic')"
        :inactive-text="$t('operator.unDynamic')"
        inline-prompt
      />
    </el-form-item>

    <!-- 三個 icon URL（TODO：原舊碼為 UploadFile 上傳元件，pure 尚未移植上傳元件，先用網址輸入） -->
    <el-form-item label="icon" prop="icon">
      <el-input v-model="newFormInline.icon" class="!w-[240px]" placeholder="icon URL" />
    </el-form-item>
    <el-form-item label="iconColor" prop="iconColor">
      <el-input
        v-model="newFormInline.iconColor"
        class="!w-[240px]"
        placeholder="iconColor URL"
      />
    </el-form-item>
    <el-form-item label="iconColor2" prop="iconColor2">
      <el-input
        v-model="newFormInline.iconColor2"
        class="!w-[240px]"
        placeholder="iconColor2 URL"
      />
    </el-form-item>

    <!-- content：依 lobbyType 切換 -->
    <el-form-item
      v-if="newFormInline.lobbyType === 1 || newFormInline.lobbyType === 3"
      :label="$t('operator.naviContent')"
      prop="content"
    >
      <el-input
        v-model="newFormInline.content"
        class="!w-[360px]"
        :placeholder="$t('operator.naviInputText')"
      />
    </el-form-item>

    <template v-if="newFormInline.lobbyType === 2">
      <el-form-item :label="$t('operator.naviGameManufacturer')">
        <el-select v-model="newFormInline.gameGroup" class="!w-[240px]">
          <el-option
            v-for="item in gameGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('operator.naviSpecifyGameList')">
        <el-select v-model="newFormInline.gameListId" class="!w-[240px]">
          <el-option
            v-for="item in filterGameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </template>

    <el-form-item :label="$t('operator.naviNote')" prop="note">
      <el-input
        v-model="newFormInline.note"
        class="!w-[360px]"
        :placeholder="$t('operator.naviRecommendedFiveWords')"
      />
    </el-form-item>
  </el-form>
</template>
