<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    name: "",
    sort: "",
    isLeftShow: false,
    tagImg: "",
    tagIcon: "",
    gameTypeID: "",
    mode: "Create"
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
    :rules="formRules"
    label-width="100px"
  >
    <el-form-item v-if="newFormInline.mode === 'Edit'" label="Tag ID" prop="id">
      <el-input v-model="newFormInline.id" disabled class="!w-[260px]" />
    </el-form-item>

    <el-form-item :label="$t('games.tagName')" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        class="!w-[260px]"
        :placeholder="$t('games.plzEnterTagName')"
      />
    </el-form-item>

    <el-form-item :label="$t('games.sort')" prop="sort">
      <el-input v-model="newFormInline.sort" clearable class="!w-[260px]" />
    </el-form-item>

    <el-form-item :label="$t('games.isLeftShow')" prop="isLeftShow">
      <el-radio-group v-model="newFormInline.isLeftShow">
        <el-radio-button :value="true">{{ $t("games.yes") }}</el-radio-button>
        <el-radio-button :value="false">{{ $t("games.no") }}</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <!-- TODO: 舊版用 UploadFile 上傳組件（未移植），此處改為直接填圖片 URL -->
    <el-form-item :label="$t('games.tagImg')" prop="tagImg">
      <el-input
        v-model="newFormInline.tagImg"
        clearable
        class="!w-[260px]"
        :placeholder="$t('games.plzEnterImgUrl')"
      />
    </el-form-item>

    <el-form-item :label="$t('games.tagIcon')" prop="tagIcon">
      <el-input
        v-model="newFormInline.tagIcon"
        clearable
        class="!w-[260px]"
        :placeholder="$t('games.plzEnterImgUrl')"
      />
    </el-form-item>
  </el-form>
</template>
