<script setup lang="ts">
import { useWebprofile } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import EditPen from "~icons/ep/edit-pen";

defineOptions({ name: "OperatorWebprofile" });

const {
  loading,
  profile,
  editStatus,
  tempKeyword,
  isEditing,
  keywordList,
  toggleEdit,
  addKeyword,
  removeKeyword,
  saveProfile,
  cancelEdit,
  publish
} = useWebprofile();

const canEdit = hasAuth("_btn_menu_webprofile_edit");
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never">
      <h1 class="title">{{ $t("operator.webprofileTitle") }}</h1>

      <!-- 網站名稱 -->
      <div class="row">
        <div class="row__label">{{ $t("operator.webprofileName") }}</div>
        <div class="row__content">
          <el-input
            v-if="editStatus.includes('name')"
            v-model="profile.nuxtPublicName"
            class="!w-[320px]"
            :placeholder="$t('operator.webprofileNamePlaceholder')"
          />
          <p v-else class="break-all">{{ profile.nuxtPublicName }}</p>
          <el-button
            v-if="canEdit"
            :icon="EditPen"
            circle
            :type="editStatus.includes('name') ? 'info' : 'primary'"
            @click="toggleEdit('name')"
          />
        </div>
      </div>

      <!-- 網站標題 -->
      <div class="row">
        <div class="row__label">{{ $t("operator.webprofileTitleField") }}</div>
        <div class="row__content">
          <el-input
            v-if="editStatus.includes('title')"
            v-model="profile.nuxtPublicTitle"
            class="!w-[320px]"
            :placeholder="$t('operator.webprofileTitlePlaceholder')"
          />
          <p v-else class="break-all">{{ profile.nuxtPublicTitle }}</p>
          <el-button
            v-if="canEdit"
            :icon="EditPen"
            circle
            :type="editStatus.includes('title') ? 'info' : 'primary'"
            @click="toggleEdit('title')"
          />
        </div>
      </div>

      <!-- 網站描述 -->
      <div class="row">
        <div class="row__label">{{ $t("operator.webprofileDescription") }}</div>
        <div class="row__content">
          <el-input
            v-if="editStatus.includes('description')"
            v-model="profile.nuxtPublicDescription"
            type="textarea"
            :rows="4"
            class="!w-[320px]"
            :placeholder="$t('operator.webprofileDescriptionPlaceholder')"
          />
          <p v-else class="break-all">{{ profile.nuxtPublicDescription }}</p>
          <el-button
            v-if="canEdit"
            :icon="EditPen"
            circle
            :type="editStatus.includes('description') ? 'info' : 'primary'"
            @click="toggleEdit('description')"
          />
        </div>
      </div>

      <!-- 網站關鍵字 -->
      <div class="row">
        <div class="row__label">{{ $t("operator.webprofileKeywords") }}</div>
        <div class="row__content">
          <div class="keywords">
            <el-tag
              v-for="(item, index) in keywordList"
              :key="index"
              :closable="editStatus.includes('keyword')"
              type="primary"
              @close="removeKeyword(item)"
            >
              {{ item }}
            </el-tag>
            <el-input
              v-if="editStatus.includes('keyword')"
              v-model="tempKeyword"
              class="!w-[200px]"
              :placeholder="$t('operator.webprofileKeywordsPlaceholder')"
              @keyup.enter="addKeyword"
            />
          </div>
          <el-button
            v-if="canEdit"
            :icon="EditPen"
            circle
            :type="editStatus.includes('keyword') ? 'info' : 'primary'"
            @click="toggleEdit('keyword')"
          />
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div v-if="canEdit" class="actions">
        <el-button type="primary" @click="publish">
          {{ $t("operator.publish") }}
        </el-button>
        <div class="actions__right">
          <el-button :disabled="!isEditing" @click="cancelEdit">
            {{ $t("operator.cancel") }}
          </el-button>
          <el-button :disabled="!isEditing" type="primary" @click="saveProfile">
            {{ $t("operator.save") }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.title {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
}

.row {
  display: flex;
  width: 100%;
  margin: 16px 0;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;

  &__label {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 240px;
    padding: 0 16px;
    color: #fff;
    background-color: var(--el-color-primary);
  }

  &__content {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 24px;
  }
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;

  &__right {
    display: flex;
    gap: 12px;
  }
}
</style>
