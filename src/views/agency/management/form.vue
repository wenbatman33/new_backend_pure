<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "",
    sort: 0,
    online: true,
    startTime: "",
    endTime: "",
    imagePc: "",
    imageH5: "",
    status: 1,
    contents: ""
  })
});

const imagePath = getImagPath();
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
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('agency.managementModal5')" prop="title">
          <el-input
            v-model="newFormInline.title"
            clearable
            :placeholder="$t('agency.managementModal5')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.managementTable3')" prop="sort">
          <el-input-number
            v-model="newFormInline.sort"
            :min="0"
            controls-position="right"
            class="!w-full"
            :placeholder="$t('agency.managementModal7')"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('agency.managementModal8')" prop="online">
          <el-switch v-model="newFormInline.online" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.withdrawal15')" prop="status">
          <el-switch
            v-model="newFormInline.status"
            :active-value="1"
            :inactive-value="2"
            :active-text="$t('agency.commissionChildTable9')"
            :inactive-text="$t('agency.commissionChildTable10')"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col v-if="!newFormInline.online" :span="12">
        <el-form-item :label="$t('agency.managementModal9')" prop="startTime">
          <el-date-picker
            v-model="newFormInline.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="!w-full"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.managementModal10')" prop="endTime">
          <el-date-picker
            v-model="newFormInline.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="!w-full"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('agency.managementModal11')" prop="imagePc">
          <el-input v-model="newFormInline.imagePc" clearable />
          <div
            v-if="newFormInline.imagePc"
            class="mt-2 thumb"
            :style="{ backgroundImage: `url(${imagePath + newFormInline.imagePc})` }"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('agency.managementModal12')" prop="imageH5">
          <el-input v-model="newFormInline.imageH5" clearable />
          <div
            v-if="newFormInline.imageH5"
            class="mt-2 thumb"
            :style="{ backgroundImage: `url(${imagePath + newFormInline.imageH5})` }"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item :label="$t('agency.managementModal15')" prop="contents">
      <!-- TODO: 舊版使用 Tinymce 富文本編輯器，pure 專案尚未移植，暫以多行文字輸入替代 -->
      <el-input
        v-model="newFormInline.contents"
        type="textarea"
        :rows="6"
        clearable
      />
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.thumb {
  width: 200px;
  height: 80px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
