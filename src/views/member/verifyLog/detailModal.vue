<script setup lang="ts">
import { transformI18n as $t } from "@/plugins/i18n";
import type { DetailProps } from "./utils/types";

defineOptions({ name: "VerifyLogDetail" });

withDefaults(defineProps<DetailProps>(), {
  detail: () => ({ verifyData: "", code: "", context: "" })
});
</script>

<template>
  <el-descriptions :column="1" border>
    <el-descriptions-item :label="$t('member.verificationInfo')">
      {{ detail.verifyData }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('member.verificationCode')">
      {{ detail.code }}
    </el-descriptions-item>
    <el-descriptions-item :label="$t('member.content')">
      {{ detail.context }}
    </el-descriptions-item>
  </el-descriptions>
</template>
