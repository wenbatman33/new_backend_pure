<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { message } from "@/utils/message";
import { fileUploadGameGroup } from "@/api/games";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () =>
    ({
      name: "",
      displayName: "",
      status: 1
    }) as any
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 開啟方式選項
const openWayOptions = [
  { label: $t("games.gamesLobby"), value: 1 },
  { label: $t("games.gameList"), value: 2 },
  { label: $t("games.enterTheGame"), value: 3 },
  { label: $t("games.openSeparately"), value: 4 },
  { label: $t("games.embedHtml"), value: 5 },
  { label: "opus", value: 101 }
];
// 狀態選項
const statusOptions = [
  { label: $t("games.open"), value: 1 },
  { label: $t("games.closeText"), value: 2 },
  { label: $t("games.inMaintenance"), value: 3 },
  { label: $t("games.hidden"), value: 4 },
  { label: $t("games.siteClosed"), value: 99 }
];
// 是否後台顯示
const ishowOptions = [
  { label: $t("games.show"), value: 1 },
  { label: $t("games.noShow"), value: 2 }
];
// 遊戲結果類型
const gameResultTypeOptions = [
  { label: $t("games.gameResultType1"), value: 1 },
  { label: $t("games.gameResultType2"), value: 2 },
  { label: $t("games.gameResultType3"), value: 3 },
  { label: $t("games.gameResultType4"), value: 4 }
];
// 詳情連結按鈕
const showDetailOptions = [
  { label: $t("games.showDetailLinkButton0"), value: 0 },
  { label: $t("games.showDetailLinkButton1"), value: 1 }
];

// 圖片上傳：欄位 => 對應 image API type 與檔案大小限制（MB）
async function handleUpload(file: File, field: string) {
  const form = new FormData();
  form.append("id", String(newFormInline.value.id ?? ""));
  form.append("type", "1");
  form.append("file", file);
  const { success, data } = await fileUploadGameGroup(form);
  if (success && data?.url) {
    (newFormInline.value as any)[field] = data.url;
    message($t("games.updateSuccess"), { type: "success" });
  }
  // 阻止 el-upload 自動上傳
  return false;
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
    :rules="formRules"
    label-width="160px"
  >
    <el-row :gutter="12">
      <el-col :span="12">
        <el-form-item :label="$t('games.manufacturerID')" prop="id">
          <el-input v-model="newFormInline.id" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.affiliatedAgents')" prop="gameAgencyName">
          <el-input v-model="newFormInline.gameAgencyName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.walletType')" prop="walletType">
          <el-input v-model="newFormInline.walletType" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.gameOpeningMethodPC')" prop="openWayPc">
          <el-select v-model="newFormInline.openWayPc" class="w-full">
            <el-option
              v-for="o in openWayOptions"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.gameOpeningMethodH5')" prop="openWayH5">
          <el-select v-model="newFormInline.openWayH5" class="w-full">
            <el-option
              v-for="o in openWayOptions"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.websiteDisplayName')" prop="displayName">
          <el-input v-model="newFormInline.displayName" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="$t('games.manufacturerDefaultName')"
          prop="name"
        >
          <el-input v-model="newFormInline.name" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.manufacturerGameType')" prop="gameTypeID">
          <el-radio-group v-model="newFormInline.gameTypeID">
            <el-radio
              v-for="o in newFormInline.gameTypeOptions || []"
              :key="o.value"
              :value="o.value"
            >
              {{ o.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.websiteSorting')" prop="sort">
          <el-input-number
            v-model="newFormInline.sort"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.platformFee')" prop="platformFeeRatio">
          <el-input v-model="newFormInline.platformFeeRatio" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.status')" prop="status">
          <el-select v-model="newFormInline.status" class="w-full">
            <el-option
              v-for="o in statusOptions"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="newFormInline.status === 3" :span="12">
        <el-form-item :label="$t('games.maintenanceEndTime')" prop="maintainTime">
          <el-date-picker
            v-model="newFormInline.maintainTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="w-full"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="$t('games.whetherToDisplayInTheBackground')"
          prop="ishow"
        >
          <el-select v-model="newFormInline.ishow" class="w-full">
            <el-option
              v-for="o in ishowOptions"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('games.gameResultType')" prop="gameResultType">
          <el-select v-model="newFormInline.gameResultType" class="w-full">
            <el-option
              v-for="o in gameResultTypeOptions"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="$t('games.showDetailLinkButton')"
          prop="showDetailLinkButton"
        >
          <el-select v-model="newFormInline.showDetailLinkButton" class="w-full">
            <el-option
              v-for="o in showDetailOptions"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <!-- 圖片上傳區 -->
      <el-col
        v-for="img in [
          { field: 'imageH5', label: $t('games.manufacturerH5Picture') },
          { field: 'imagePc', label: $t('games.manufacturerPCDiagram') },
          { field: 'logoImage', label: $t('games.manufacturerLogo') },
          { field: 'logoImage2', label: $t('games.manufacturerLogo2') },
          { field: 'imgRecommend1', label: $t('games.imgRecommend1') }
        ]"
        :key="img.field"
        :span="12"
      >
        <el-form-item :label="img.label">
          <div class="flex items-center gap-2">
            <span v-if="newFormInline[img.field]" class="text-xs break-all">
              {{ newFormInline[img.field] }}
            </span>
            <el-upload
              :show-file-list="false"
              accept="image/*"
              :before-upload="(file: File) => handleUpload(file, img.field)"
            >
              <el-button size="small" type="primary">
                {{ $t("games.upload") }}
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
