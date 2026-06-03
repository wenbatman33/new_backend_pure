<script setup lang="ts">
import { useRegionRestrictedPage } from "./utils/hook";
import { formRules } from "./utils/rule";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "OperatorRegionRestrictedPageManagement" });

const {
  formRef,
  loading,
  form,
  logoFile,
  handleUploadLogo,
  handleSubmit,
  handleRelease
} = useRegionRestrictedPage();
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never">
      <div class="pl-2 mb-4 text-[var(--el-text-color-secondary)]">
        {{ $t("operator.regionRestrictedPageManagementRemind") }}
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item :label="$t('operator.pageTitle')" prop="title">
          <el-input
            v-model="form.title"
            clearable
            :placeholder="$t('operator.inputText')"
          />
        </el-form-item>

        <el-form-item :label="$t('operator.platformLogo')" prop="logo">
          <div class="flex items-center gap-3">
            <el-upload
              :show-file-list="false"
              accept="image/*"
              :http-request="(o: any) => handleUploadLogo(o)"
            >
              <el-button type="primary">{{ $t("operator.add") }}</el-button>
            </el-upload>
            <img
              v-if="logoFile"
              :src="logoFile"
              class="object-contain h-[40px] w-[100px]"
            />
          </div>
        </el-form-item>

        <el-form-item :label="$t('operator.customerServiceWebsite')" prop="url">
          <el-input
            v-model="form.url"
            clearable
            :placeholder="$t('operator.inputText')"
          />
        </el-form-item>

        <el-form-item :label="$t('operator.buttonContent')" prop="buttonContent">
          <el-input
            v-model="form.buttonContent"
            clearable
            :placeholder="$t('operator.inputText')"
          />
        </el-form-item>

        <!-- 說明內容：pure 無 Tinymce 元件，暫以 textarea 編輯原始 HTML -->
        <el-form-item :label="$t('operator.instructions')" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="12"
            :placeholder="$t('operator.inputText')"
          />
        </el-form-item>

        <el-form-item>
          <div class="flex justify-between w-full">
            <el-button
              v-if="hasAuth('__btn_regional_restrictions_deploy')"
              type="primary"
              @click="handleRelease"
            >
              {{ $t("operator.updateRelease") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_regional_restrictions_edit')"
              type="primary"
              @click="handleSubmit"
            >
              {{ $t("operator.saveText") }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
