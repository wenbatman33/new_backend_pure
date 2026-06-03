<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormRules } from "element-plus";
import {
  getCompetitionKeyword,
  addCompetitionKeyword,
  deleteCompetitionKeyword
} from "@/api/promotion";
import { keywordRules } from "./utils/rule";
import type { KeywordFormProps } from "./utils/types";

const props = withDefaults(defineProps<KeywordFormProps>(), {
  leagueID: 0,
  formInline: () => ({
    gameTypeID: "",
    gameGroupID: "",
    keyword: "",
    exclude: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const rules = keywordRules as FormRules;

// 已設定的關鍵字標籤
const selectedTags = ref<{ value: number; label: string }[]>([]);

// TODO: 遊戲類型/群組下拉依賴 @/utils/dropdown（gameOptions）尚未移植，先以空陣列佔位
const gameTypeOptions = ref<{ label: string; value: number }[]>([]);
const gameGroupOptions = ref<{ label: string; value: number }[]>([]);

// 關鍵字提示說明
const helpMessages = [
  $t("promotion.keywordHelpMessage1"),
  $t("promotion.keywordHelpMessage2"),
  $t("promotion.keywordHelpMessage3"),
  $t("promotion.keywordHelpMessage4")
];

async function getKeywordList() {
  const { data } = await getCompetitionKeyword({ ID: props.leagueID });
  selectedTags.value = (data?.list ?? []).map((item: any) => ({
    value: item.ID,
    label: item.keyword
  }));
}

function createKeyword() {
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    const gameGroupID = newFormInline.value.gameGroupID || 0;
    const { success } = await addCompetitionKeyword({
      ...newFormInline.value,
      leagueID: props.leagueID,
      gameGroupID
    });
    if (success) {
      message($t("promotion.addedKeywordSuccessfully"), { type: "success" });
      newFormInline.value.keyword = "";
      newFormInline.value.exclude = "";
      getKeywordList();
    }
  });
}

async function removeTag(tag: { value: number; label: string }) {
  const { success } = await deleteCompetitionKeyword(tag.value);
  if (success) {
    message(`${$t("promotion.deleteKeywords")}: ${tag.label}`, {
      type: "success"
    });
    selectedTags.value = selectedTags.value.filter(t => t.value !== tag.value);
  }
}

onMounted(() => {
  getKeywordList();
});
</script>

<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="newFormInline"
      :rules="rules"
      :inline="true"
      label-width="130px"
    >
      <el-form-item :label="$t('promotion.gameType')" prop="gameTypeID">
        <el-select
          v-model="newFormInline.gameTypeID"
          clearable
          class="!w-[180px]"
        >
          <el-option
            v-for="item in gameTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.gameGroup')" prop="gameGroupID">
        <el-select
          v-model="newFormInline.gameGroupID"
          clearable
          class="!w-[180px]"
        >
          <el-option
            v-for="item in gameGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('promotion.keywords')" prop="keyword">
        <el-input
          v-model="newFormInline.keyword"
          clearable
          class="!w-[180px]"
          :placeholder="$t('promotion.inputText')"
        />
      </el-form-item>
      <el-form-item :label="$t('promotion.negativeKeywords')" prop="exclude">
        <el-input
          v-model="newFormInline.exclude"
          clearable
          class="!w-[180px]"
          :placeholder="$t('promotion.inputText')"
        >
          <template #append>
            <el-tooltip placement="bottom">
              <template #content>
                <div v-for="(msg, idx) in helpMessages" :key="idx">
                  {{ msg }}
                </div>
              </template>
              <span>?</span>
            </el-tooltip>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createKeyword">
          {{ $t("promotion.add") }}
        </el-button>
      </el-form-item>
    </el-form>

    <el-card
      shadow="never"
      :header="$t('promotion.vendorAndLeagueKeywordSettingsHaveBeenSet')"
    >
      <div class="keyword-tags">
        <el-tag
          v-for="tag in selectedTags"
          :key="tag.value"
          closable
          class="mb-2 mr-2"
          @close="removeTag(tag)"
        >
          {{ tag.label }}
        </el-tag>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.keyword-tags {
  min-height: 60px;
}
</style>
