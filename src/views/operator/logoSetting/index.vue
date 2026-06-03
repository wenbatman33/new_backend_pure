<script setup lang="ts">
import { useLogoSetting } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import Upload from "~icons/ep/upload";

defineOptions({ name: "OperatorLogoSetting" });

const {
  logo,
  loading,
  editStatus,
  fields,
  uploadSizeCheck,
  sizeCheckHelper,
  beforeUpload,
  handleSave,
  handleCancel,
  handlePublish
} = useLogoSetting();
</script>

<template>
  <div class="main" v-loading="loading">
    <el-card shadow="never">
      <h1 class="mb-4 text-2xl font-bold">
        {{ $t("operator.logoSettingTitle") }}
      </h1>
      <p class="mb-6 text-base text-[var(--el-text-color-secondary)]">
        {{ $t("operator.logoSettingSubtitle") }}
      </p>

      <div
        v-for="item in fields"
        :key="item.key"
        class="flex my-4 w-full border border-[var(--el-border-color)]"
      >
        <div
          class="flex justify-center items-center w-60 text-white bg-[var(--el-color-primary)] px-4 text-center"
        >
          {{ item.title }}
        </div>
        <div class="flex flex-col flex-1 px-6 py-8">
          <p class="mb-6">{{ item.desc }}</p>
          <div
            class="relative flex justify-center items-center gap-5 border border-dashed border-[var(--el-border-color)]"
            style="width: 300px; height: 50px"
          >
            <span v-if="!logo.data[item.key]">
              {{ $t("operator.logoSettingEmpty") }}
            </span>
            <el-image
              v-else
              :src="logo.data[item.key]"
              fit="contain"
              style="width: 300px; height: 50px"
            />
            <div
              v-if="hasAuth('__btn_menu_logosetting_edit')"
              :style="
                logo.data[item.key]
                  ? 'position: absolute; bottom: 0; right: 0'
                  : ''
              "
            >
              <el-upload
                :show-file-list="false"
                accept="image/*"
                :before-upload="(file: File) => beforeUpload(file, item.key)"
              >
                <el-button type="primary" :icon="Upload">
                  {{ $t("operator.logoSettingUpload") }}
                </el-button>
              </el-upload>
            </div>
          </div>
          <div v-if="uploadSizeCheck[item.key]" class="mt-2 text-red-500">
            {{ sizeCheckHelper }}
          </div>
        </div>
      </div>

      <div
        v-if="hasAuth('__btn_menu_logosetting_edit')"
        class="flex justify-between mt-8 w-full"
      >
        <div v-if="hasAuth('__btn_frontend_logosetting_deploy')">
          <el-button type="primary" @click="handlePublish">
            {{ $t("operator.logoSettingPublish") }}
          </el-button>
        </div>
        <div class="flex gap-3">
          <el-button :disabled="editStatus !== 1" @click="handleCancel">
            {{ $t("operator.logoSettingCancel") }}
          </el-button>
          <el-button
            type="primary"
            :disabled="editStatus !== 1"
            @click="handleSave"
          >
            {{ $t("operator.logoSettingSave") }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
