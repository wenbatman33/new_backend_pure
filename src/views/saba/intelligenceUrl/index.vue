<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { transformI18n as $t } from "@/plugins/i18n";
import { countryCheck } from "@/utils/country";
import { postGetIntelligenceUrl } from "@/api/saba";
import type { ProviderOption } from "./utils/types";

defineOptions({ name: "SabaIntelligenceUrl" });

const { locale } = useI18n();
// pure-admin locale 為 zh/en；後端情報網址語系需 cs（簡中）/ en
const lang = computed(() => (locale.value === "zh" ? "cs" : "en"));

// 供應商選項：PH 站台只有 JOLLY，其他站台為 SABA 系列
const providerOption = computed<ProviderOption[]>(() => {
  if (countryCheck("PH")) {
    return [{ label: "JOLLY", value: "JOLLY" }];
  }
  return [
    { label: "SABA", value: "SABA" },
    { label: "SABA188", value: "SABA188" },
    { label: "SABA188xl", value: "SABA188xl" }
  ];
});

const provider = ref(providerOption.value[0].value);
const url = ref("");
const loading = ref(false);

const fetchUrl = async () => {
  loading.value = true;
  try {
    const { success, data } = await postGetIntelligenceUrl({
      lang: lang.value,
      provider: provider.value
    });
    if (success) {
      url.value = data?.url ?? "";
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUrl();
});
</script>

<template>
  <div class="main flex flex-col h-full">
    <div class="flex gap-3 items-center bg-bg_color p-4">
      <el-select v-model="provider" class="!w-[140px]">
        <el-option
          v-for="item in providerOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" :loading="loading" @click="fetchUrl">
        {{ $t("saba.save") }}
      </el-button>
      <span class="text-text_color_regular">
        {{ $t("saba.intelligenceUrlMsg") }}
      </span>
    </div>
    <iframe
      v-if="url"
      class="w-full flex-1 border-0"
      :src="url"
    />
  </div>
</template>

<style scoped lang="scss">
.main {
  min-height: calc(100vh - 120px);
}
</style>
