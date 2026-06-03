<script setup lang="ts">
import { ref, computed } from "vue";
import { configSportRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { ConfigSportFormItemProps } from "./utils/types";

const props = defineProps<{
  formInline: ConfigSportFormItemProps;
  groupOptions: { label: string; value: number | string }[];
}>();

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const selectedGroupId = ref<number | string>();

// 尚未被選入排行榜的廠商
const filteredOptions = computed(() =>
  props.groupOptions.filter(
    o => !newFormInline.value.rankingGameGroupList.includes(o.value)
  )
);

function labelOf(val: number | string) {
  return props.groupOptions.find(o => o.value === val)?.label ?? "-";
}

function addRanking() {
  if (
    selectedGroupId.value !== undefined &&
    selectedGroupId.value !== null &&
    !newFormInline.value.rankingGameGroupList.includes(selectedGroupId.value)
  ) {
    newFormInline.value.rankingGameGroupList.push(selectedGroupId.value);
    selectedGroupId.value = undefined;
  }
}

function removeRanking(val: number | string) {
  newFormInline.value.rankingGameGroupList =
    newFormInline.value.rankingGameGroupList.filter(v => v !== val);
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="configSportRules"
    label-width="140px"
  >
    <el-form-item label="recommendGroupId" prop="recommendGroupId">
      <el-input v-model="newFormInline.recommendGroupId" clearable />
    </el-form-item>
    <el-form-item label="luckysportGroupId" prop="luckysportGroupId">
      <el-input v-model="newFormInline.luckysportGroupId" clearable />
    </el-form-item>
    <el-form-item
      :label="$t('games.whetherToDisplayVirtualEvents')"
      prop="isVirtual"
    >
      <el-radio-group v-model="newFormInline.isVirtual">
        <el-radio :value="1">{{ $t("games.yes") }}</el-radio>
        <el-radio :value="2">{{ $t("games.no") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('games.countRecord')" prop="countRecord">
      <el-input v-model="newFormInline.countRecord" clearable />
    </el-form-item>
    <el-form-item :label="$t('games.countDay')" prop="countDay">
      <div class="flex items-center gap-2">
        <el-input v-model="newFormInline.countDay" class="!w-[120px]" />
        <span>{{ $t("games.includeToday") }}</span>
      </div>
    </el-form-item>
    <el-form-item :label="$t('games.rankingGameGroupList')">
      <div class="flex items-center gap-2">
        <el-select
          v-model="selectedGroupId"
          clearable
          class="!w-[200px]"
          :placeholder="$t('games.pleaseSelect')"
        >
          <el-option
            v-for="o in filteredOptions"
            :key="o.value"
            :label="o.label"
            :value="o.value"
          />
        </el-select>
        <el-button type="primary" @click="addRanking">
          {{ $t("games.add") }}
        </el-button>
      </div>
      <div class="flex flex-wrap gap-1 mt-2">
        <el-tag
          v-for="item in newFormInline.rankingGameGroupList"
          :key="item"
          closable
          @close="removeRanking(item)"
        >
          {{ labelOf(item) }}
        </el-tag>
      </div>
    </el-form-item>
  </el-form>
</template>
