<script setup lang="ts">
import { ref } from "vue";
import { checkFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { CheckProps } from "./utils/types";

// 狀態切換確認對話框內容（存/提/登入功能 開關）
const props = withDefaults(defineProps<CheckProps>(), {
  formInline: () => ({
    type: "",
    checkType: "",
    memberName: "",
    memberID: 0,
    status: 0,
    comment: ""
  })
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
    :rules="checkFormRules"
    label-width="0"
  >
    <p class="check-text">
      {{ $t("member.whether") }}
      <span class="emphasis">{{
        newFormInline.status === 1 ? $t("member.closeText") : $t("member.open")
      }}</span>
      {{ $t("member.member") }}：
      <i class="member-name">{{ newFormInline.memberName }}</i>
    </p>
    <p class="check-text">
      {{ $t("member.of") }}
      <span class="emphasis">{{ newFormInline.checkType }}</span>
      {{ $t("member.function") }}
    </p>
    <el-form-item prop="comment">
      <el-input
        v-model="newFormInline.comment"
        type="textarea"
        :rows="3"
        :placeholder="$t('member.addNewNote')"
      />
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.check-text {
  font-size: 1.1em;
  margin-bottom: 6px;

  .emphasis {
    color: #f00;
  }

  .member-name {
    color: #00f;
  }
}
</style>
