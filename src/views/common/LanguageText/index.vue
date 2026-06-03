<script setup lang="ts">
import { ref, computed, watch, reactive } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getLanguageOption } from "@/utils/country";
import { apiServerUrl } from "@/utils/imgUrl";
import { fileUpload } from "@/api/common";
import {
  ElMessage,
  type UploadRequestOptions,
  type UploadRawFile
} from "element-plus";

defineOptions({ name: "LanguageText" });

/**
 * 多語系文字輸入元件（原 Vben LanguageText + LanguageForm 合併）
 * 對外介面：
 *  - props.data: 舊版傳入的多語系資料陣列（[{ language, name, summary, ... }]）
 *  - v-model（modelValue）: 以 language 為 key 的物件
 *  - showSummary / showImageWeb / showImageH5 / showName / readonly: 欄位顯示控制
 *  - expose getLanguageData(): 回傳陣列格式（與舊版一致）
 */
interface LanguageItem {
  language?: string;
  name?: string;
  summary?: string;
  imageWeb?: string;
  imageH5?: string;
  content?: string;
  [key: string]: any;
}

const props = withDefaults(
  defineProps<{
    data?: LanguageItem[];
    modelValue?: Record<string, LanguageItem>;
    showSummary?: boolean;
    showImageWeb?: boolean;
    showImageH5?: boolean;
    showName?: boolean;
    readonly?: boolean;
  }>(),
  {
    data: () => [],
    modelValue: () => ({}),
    showSummary: true,
    showImageWeb: false,
    showImageH5: false,
    showName: true,
    readonly: false
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", val: Record<string, LanguageItem>): void;
}>();

// 語系選項（en 排前並標示為預設）
const languageOptions = computed(() => getLanguageOption());

// 當前 tab（以大寫語系顯示，內部以小寫 value 操作）
const activeKey = ref("en");

// 以 language 為 key 的資料容器
const languageData = reactive<Record<string, LanguageItem>>({
  ...(props.modelValue || {})
});

// 確保每個語系都有對應物件
function ensureLang(lang: string) {
  if (!languageData[lang]) {
    languageData[lang] = {
      language: lang,
      name: "",
      summary: "",
      imageWeb: "",
      imageH5: "",
      content: ""
    };
  }
}
languageOptions.value.forEach(o => ensureLang(o.value));

// 同步外部 data（陣列）→ 內部
watch(
  () => props.data,
  newValue => {
    if (Array.isArray(newValue)) {
      newValue.forEach((item: LanguageItem) => {
        if (item?.language) {
          ensureLang(item.language);
          Object.assign(languageData[item.language], item);
        }
      });
    }
  },
  { deep: true, immediate: true }
);

// 同步外部 v-model（物件）→ 內部
watch(
  () => props.modelValue,
  newValue => {
    if (newValue && typeof newValue === "object") {
      Object.keys(newValue).forEach(k => {
        ensureLang(k);
        Object.assign(languageData[k], newValue[k]);
      });
    }
  },
  { deep: true }
);

// 內部變更 → emit v-model
function emitUpdate() {
  emit("update:modelValue", { ...languageData });
}

// 從英文複製到指定語系
function copyFromEnglish(targetLanguage: string) {
  if (languageData["en"]) {
    languageData[targetLanguage] = { ...languageData["en"], language: targetLanguage };
    emitUpdate();
  }
}

// el-upload 自訂上傳：呼叫 fileUpload，回填圖片網址
function makeUploadRequest(lang: string, field: "imageWeb" | "imageH5") {
  return async (options: UploadRequestOptions) => {
    const file = options.file as UploadRawFile;
    if (file.size > 2048000) {
      ElMessage.error($t("common.imageSizeCannotBeLargerThan2MB"));
      return;
    }
    const formData = new FormData();
    formData.append("type", "game");
    formData.append("file", file);
    try {
      const { success, data } = await fileUpload(formData);
      if (success && data?.url) {
        ensureLang(lang);
        languageData[lang][field] = apiServerUrl(data.url);
        emitUpdate();
      }
    } catch (e) {
      ElMessage.error(String(e));
    }
  };
}

function clearImage(lang: string, field: "imageWeb" | "imageH5") {
  ensureLang(lang);
  languageData[lang][field] = "";
  emitUpdate();
}

// 對外提供陣列格式（與舊版 getLanguageData 一致）
function getLanguageData(): LanguageItem[] {
  return Object.keys(languageData).map(key => ({
    language: key,
    ...languageData[key]
  }));
}

defineExpose({ getLanguageData });
</script>

<template>
  <div class="language-text">
    <el-tabs v-model="activeKey">
      <el-tab-pane
        v-for="item in languageOptions"
        :key="item.value"
        :name="item.value"
        :label="
          `${item.label.toUpperCase()}${
            item.label.toUpperCase() === 'EN' ? ' (' + $t('common.default') + ')' : ''
          }`
        "
      >
        <div class="language-text__remind">
          <el-icon class="mr-1"><i-ep-warning-filled /></el-icon>
          <span>{{ $t("common.languageRemind") }}</span>
        </div>

        <div v-if="item.value !== 'en'" class="mb-3">
          <el-button
            type="primary"
            :disabled="props.readonly"
            @click="copyFromEnglish(item.value)"
          >
            {{ $t("common.copyENData") }}
          </el-button>
        </div>

        <el-form label-width="150px" label-position="right">
          <el-form-item
            v-if="props.showName"
            :label="$t('common.listingName')"
            required
          >
            <el-input
              v-model="languageData[item.value].name"
              :placeholder="$t('common.enterName')"
              :readonly="props.readonly"
              @input="emitUpdate"
            />
          </el-form-item>

          <el-form-item v-if="props.showSummary" :label="$t('common.summary')">
            <el-input
              v-model="languageData[item.value].summary"
              type="textarea"
              :rows="3"
              :placeholder="$t('common.enterSummary')"
              :readonly="props.readonly"
              @input="emitUpdate"
            />
          </el-form-item>

          <el-form-item v-if="props.showImageWeb" :label="`web ${$t('common.image')}`">
            <div class="language-text__upload">
              <img
                v-if="languageData[item.value].imageWeb"
                :src="languageData[item.value].imageWeb"
                class="language-text__preview"
              />
              <el-upload
                v-if="!props.readonly"
                :show-file-list="false"
                :http-request="makeUploadRequest(item.value, 'imageWeb')"
                accept="image/*"
              >
                <el-button>{{ $t("common.upload") }}</el-button>
              </el-upload>
              <el-button
                v-if="languageData[item.value].imageWeb && !props.readonly"
                link
                type="danger"
                @click="clearImage(item.value, 'imageWeb')"
              >
                {{ $t("common.delete") }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item
            v-if="props.showImageH5"
            :label="(props.showImageWeb ? 'h5 ' : '') + $t('common.image')"
          >
            <div class="language-text__upload">
              <img
                v-if="languageData[item.value].imageH5"
                :src="languageData[item.value].imageH5"
                class="language-text__preview"
              />
              <el-upload
                v-if="!props.readonly"
                :show-file-list="false"
                :http-request="makeUploadRequest(item.value, 'imageH5')"
                accept="image/*"
              >
                <el-button>{{ $t("common.upload") }}</el-button>
              </el-upload>
              <el-button
                v-if="languageData[item.value].imageH5 && !props.readonly"
                link
                type="danger"
                @click="clearImage(item.value, 'imageH5')"
              >
                {{ $t("common.delete") }}
              </el-button>
            </div>
          </el-form-item>

          <!-- 舊版為 Tinymce 富文本，新專案暫無富文本元件，先以多行文字輸入承接 content -->
          <el-form-item :label="$t('common.content')" required>
            <el-input
              v-model="languageData[item.value].content"
              type="textarea"
              :rows="8"
              :readonly="props.readonly"
              @input="emitUpdate"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.language-text__remind {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: var(--el-color-warning);
}
.language-text__upload {
  display: flex;
  align-items: center;
  gap: 12px;
}
.language-text__preview {
  max-width: 120px;
  max-height: 80px;
  object-fit: contain;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
</style>
