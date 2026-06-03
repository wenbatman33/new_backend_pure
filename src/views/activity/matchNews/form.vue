<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    homeScore: "",
    awayScore: "",
    homePc: "",
    homeH5: "",
    awayPc: "",
    awayH5: "",
    homeExplain: "",
    awayExplain: "",
    recommend: "",
    matchExplain: ""
  }),
  isEdit: false
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
    label-width="90px"
  >
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('activity.matchNewsEventTime')">
          <span>{{ newFormInline.eventTime }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('activity.matchNewsLeague')">
          <span>{{ newFormInline.leagueName }}</span>
        </el-form-item>
      </el-col>

      <!-- 主隊區塊 -->
      <el-col :span="24">
        <el-form-item :label="$t('activity.matchNewsHomeTeam')">
          <span>{{ newFormInline.homeTeam }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="13">
        <el-form-item :label="$t('activity.matchNewsHomeScore')" prop="homeScore">
          <el-input v-model="newFormInline.homeScore" class="!w-[120px]" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <!-- TODO: 舊版為圖片上傳元件（Upload + fileUpload /file/file/upload），pure 尚未移植上傳元件，暫以檔名/網址輸入替代 -->
        <el-form-item :label="$t('activity.matchNewsPcImg')">
          <el-input v-model="newFormInline.homePc" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('activity.matchNewsH5Img')">
          <el-input v-model="newFormInline.homeH5" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item :label="$t('activity.matchNewsExplain')">
          <el-input
            v-model="newFormInline.homeExplain"
            type="textarea"
            :rows="2"
            :placeholder="$t('activity.matchNewsExplainTip')"
          />
        </el-form-item>
      </el-col>

      <!-- 客隊區塊 -->
      <el-col :span="24">
        <el-form-item :label="$t('activity.matchNewsAwayTeam')">
          <span>{{ newFormInline.awayTeam }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="13">
        <el-form-item :label="$t('activity.matchNewsAwayScore')" prop="awayScore">
          <el-input v-model="newFormInline.awayScore" class="!w-[120px]" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('activity.matchNewsPcImg')">
          <el-input v-model="newFormInline.awayPc" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('activity.matchNewsH5Img')">
          <el-input v-model="newFormInline.awayH5" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item :label="$t('activity.matchNewsExplain')">
          <el-input
            v-model="newFormInline.awayExplain"
            type="textarea"
            :rows="2"
            :placeholder="$t('activity.matchNewsExplainTip')"
          />
        </el-form-item>
      </el-col>

      <!-- 推薦文字 -->
      <el-col :span="18">
        <el-form-item :label="$t('activity.matchNewsRecommend')">
          <el-input
            v-model="newFormInline.recommend"
            type="textarea"
            :rows="2"
            :placeholder="$t('activity.matchNewsRecommendTip')"
          />
        </el-form-item>
      </el-col>

      <!-- 分析（舊版為 Tinymce 富文本，pure 尚未移植富文本元件，暫以多行文字替代） -->
      <el-col :span="24">
        <el-form-item :label="$t('activity.matchNewsAnalysis')">
          <el-input
            v-model="newFormInline.matchExplain"
            type="textarea"
            :rows="6"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
