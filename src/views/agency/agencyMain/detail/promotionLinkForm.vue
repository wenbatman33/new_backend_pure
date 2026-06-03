<script setup lang="ts">
import { ref } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import type { PromotionLinkFormProps } from "./utils/types";

const props = withDefaults(defineProps<PromotionLinkFormProps>(), {
  formInline: () => ({
    mode: "Add",
    id: "",
    promotionLink: "",
    newpromotionLink: ""
  })
});

const newFormInline = ref(props.formInline);

function getRef() {
  return newFormInline.value;
}

defineExpose({ getRef });
</script>

<template>
  <div>
    <!-- 編輯模式：顯示前綴 + 輸入框 -->
    <div v-if="newFormInline.mode === 'Edit'" style="margin-bottom: 16px">
      <el-input
        v-model="newFormInline.newpromotionLink"
        :placeholder="$t('agency.addPromotionLinkModal2')"
      >
        <template #prepend>{{ newFormInline.promotionLink }}</template>
      </el-input>
    </div>
    <!-- 新增模式 -->
    <div v-else style="margin-bottom: 16px">
      <el-input
        v-model="newFormInline.newpromotionLink"
        :placeholder="$t('agency.addPromotionLinkModal3')"
      />
      <h3 style="color: red; margin-top: 8px">
        {{ $t("agency.addPromotionLinkModal4") }}
      </h3>
    </div>
  </div>
</template>
