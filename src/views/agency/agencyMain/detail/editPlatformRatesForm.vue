<script setup lang="ts">
import { ref } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import type { EditPlatformRatesFormProps } from "./utils/types";

const props = withDefaults(defineProps<EditPlatformRatesFormProps>(), {
  formInline: () => ({
    id: 0,
    gameGroupID: 0,
    gameGroupDisplayName: "",
    platformFeeRatio: 0
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
    <div class="mb-6">
      {{ $t("agency.edit") }} {{ newFormInline.gameGroupDisplayName }}
      {{ $t("agency.customGamePlatformRates") }}:
    </div>
    <el-input-number
      v-model="newFormInline.platformFeeRatio"
      :min="0"
      style="width: 120px"
    />
    %
  </div>
</template>
