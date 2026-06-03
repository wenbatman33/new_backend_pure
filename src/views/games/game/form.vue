<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { message } from "@/utils/message";
import { getImagPath } from "@/utils/imgUrl";
import { checkIsVD } from "@/utils/country";
import { fileUploadGameGroup } from "@/api/games";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    gameGroupID: undefined,
    gameTypeID: undefined,
    name: "",
    displayName: "",
    sort: "",
    bettingCode: "",
    gameCodePc: "",
    gameCodeH5: "",
    status: 1,
    trialPlay: 1,
    isHotGame: false,
    isNewGame: false,
    recommendedSort: 0,
    isSlot: 1,
    isReturn: 1,
    tagIDs: [],
    imageH5: "",
    imagePc: "",
    screenShotH5: "",
    screenShotPc: "",
    recommendedImageH5: ""
  }),
  isAdd: false,
  gameGroupOptions: () => [],
  gameTypeOptions: () => [],
  tagOptions: () => []
});

const imagPath = getImagPath();
const isVD = checkIsVD();
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 推薦排序選項 0~20
const recommendOptions = [{ label: $t("games.notRecommand"), value: 0 }];
for (let i = 1; i <= 20; i++) {
  recommendOptions.push({ label: `${$t("games.order")}${i}`, value: i });
}

const statusOptions = [
  { label: $t("games.open"), value: 1 },
  { label: $t("games.close"), value: 2 },
  { label: $t("games.maintain"), value: 3 },
  { label: $t("games.hide"), value: 4 }
];
const trialPlayOptions = [
  { label: $t("games.false"), value: 1 },
  { label: $t("games.true"), value: 2 }
];
const isSlotOptions = [
  { label: $t("games.noParticipate"), value: 1 },
  { label: $t("games.participate"), value: 2 }
];
const isReturnOptions = [
  { label: $t("games.true"), value: 1 },
  { label: $t("games.false"), value: 2 }
];

// 廠商變動連動遊戲類型
function onGroupChange(val) {
  const found = props.gameGroupOptions.find(i => i.value === val);
  if (found?.gameTypeID) newFormInline.value.gameTypeID = found.gameTypeID;
}

// 圖片預覽（編輯模式帶入既有 path）
const previewH5 = computed(() =>
  newFormInline.value.imageH5 ? imagPath + newFormInline.value.imageH5 : ""
);
const previewPc = computed(() =>
  newFormInline.value.imagePc ? imagPath + newFormInline.value.imagePc : ""
);

/**
 * 圖片上傳：type 1=H5圖 2=PC圖 3=H5截圖 4=PC截圖
 * 上傳成功後把回傳 url 寫回表單對應欄位
 */
async function uploadImage(file: File, type: number, field: string) {
  const form = new FormData();
  form.append("id", String(newFormInline.value.id ?? ""));
  form.append("type", String(type));
  form.append("file", file);
  const { success, data } = await fileUploadGameGroup(form);
  if (success) {
    (newFormInline.value as any)[field] = data?.url ?? "";
    message($t("common.uploadSuccess"), { type: "success" });
  }
  return false; // 阻止 el-upload 預設行為
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
    label-width="140px"
  >
    <el-row :gutter="16">
      <el-col v-if="!isAdd" :span="8">
        <el-form-item :label="$t('games.id')" prop="id">
          <el-input v-model="newFormInline.id" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.group')" prop="gameGroupID">
          <el-select
            v-model="newFormInline.gameGroupID"
            filterable
            clearable
            class="w-full"
            @change="onGroupChange"
          >
            <el-option
              v-for="item in gameGroupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.type')" prop="gameTypeID">
          <el-select
            v-model="newFormInline.gameTypeID"
            clearable
            class="w-full"
          >
            <el-option
              v-for="item in gameTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.name')" prop="name">
          <el-input v-model="newFormInline.name" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.displayName')" prop="displayName">
          <el-input v-model="newFormInline.displayName" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.sort')" prop="sort">
          <el-input v-model="newFormInline.sort" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.gameCodePc')" prop="gameCodePc">
          <el-input v-model="newFormInline.gameCodePc" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.gameCodeH5')" prop="gameCodeH5">
          <el-input v-model="newFormInline.gameCodeH5" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.bettingCode')" prop="bettingCode">
          <el-input v-model="newFormInline.bettingCode" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.status')" prop="status">
          <el-select v-model="newFormInline.status" class="w-full">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.trialPlay')" prop="trialPlay">
          <el-select v-model="newFormInline.trialPlay" class="w-full">
            <el-option
              v-for="item in trialPlayOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.isSlot')" prop="isSlot">
          <el-select v-model="newFormInline.isSlot" class="w-full">
            <el-option
              v-for="item in isSlotOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!isAdd" :span="8">
        <el-form-item :label="$t('games.isReturn')" prop="isReturn">
          <el-select v-model="newFormInline.isReturn" class="w-full">
            <el-option
              v-for="item in isReturnOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!isAdd" :span="8">
        <el-form-item
          :label="$t('games.recommendedSort')"
          prop="recommendedSort"
        >
          <el-select v-model="newFormInline.recommendedSort" class="w-full">
            <el-option
              v-for="item in recommendOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.isHotGame')" prop="isHotGame">
          <el-checkbox v-model="newFormInline.isHotGame" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('games.isNewGame')" prop="isNewGame">
          <el-checkbox v-model="newFormInline.isNewGame" />
        </el-form-item>
      </el-col>
      <el-col v-if="!isAdd" :span="24">
        <el-form-item :label="$t('games.tags')" prop="tagIDs">
          <el-checkbox-group v-model="newFormInline.tagIDs">
            <el-checkbox
              v-for="item in tagOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <!-- 圖片上傳（編輯模式才提供，沿用舊邏輯） -->
      <el-col v-if="!isAdd" :span="12">
        <el-form-item :label="$t('games.imageH5')">
          <el-upload
            :show-file-list="false"
            accept="image/*"
            :before-upload="
              (file: File) => uploadImage(file, 1, 'imageH5')
            "
          >
            <el-button type="primary" size="small">
              {{ $t("games.submit") }}
            </el-button>
          </el-upload>
          <img
            v-if="previewH5"
            :src="previewH5"
            style="max-height: 120px; margin-left: 12px; border-radius: 4px"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="!isAdd && !isVD" :span="12">
        <el-form-item :label="$t('games.imagePc')">
          <el-upload
            :show-file-list="false"
            accept="image/*"
            :before-upload="
              (file: File) => uploadImage(file, 2, 'imagePc')
            "
          >
            <el-button type="primary" size="small">
              {{ $t("games.submit") }}
            </el-button>
          </el-upload>
          <img
            v-if="previewPc"
            :src="previewPc"
            style="max-height: 120px; margin-left: 12px; border-radius: 4px"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
