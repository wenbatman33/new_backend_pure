<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { getImagPath, apiServerUrl } from "@/utils/imgUrl";
import { getLanguageOption } from "@/utils/country";
import {
  getPageContentList,
  postPageContent,
  putPageContent,
  deletePageContent,
  uploadPageImg
} from "@/api/operator";
import type { ContentItem } from "./utils/types";

const props = defineProps<{ pageId: number; pageName: string }>();

const imagPath = getImagPath();
const languageOptions = [
  { label: $t("operator.all"), value: "" },
  ...getLanguageOption()
];

const displayList = ref<ContentItem[]>([]);
const filterLanguage = ref("");
const loading = ref(false);

// 排序行內編輯
const sortingId = ref<number | "">("");
const sortNumber = ref(0);

// 型別對應 icon 文字（pure 無對應 icon，用文字標示）
const typeLabel: Record<number, string> = {
  1: $t("operator.text"),
  2: $t("operator.image"),
  3: "html",
  4: $t("operator.hyperLink")
};

async function getData() {
  loading.value = true;
  try {
    const { data } = await getPageContentList({
      id: props.pageId,
      language: filterLanguage.value
    });
    displayList.value = (data?.list ?? []) as ContentItem[];
  } finally {
    loading.value = false;
  }
}

function formatContent(content: string) {
  return (content || "").replace(/<[^>]*>?/gm, "");
}

function startSort(row: ContentItem) {
  sortingId.value = row.id;
  sortNumber.value = row.sort;
}

async function confirmSort(row: ContentItem) {
  const { success } = await putPageContent({
    id: row.id,
    sort: sortNumber.value,
    content: row.content,
    contentH5: row.contentH5,
    description: row.description,
    language: row.language,
    group: row.group
  });
  if (success) {
    message($t("operator.editSuccess"), { type: "success" });
    sortingId.value = "";
    getData();
  }
}

function handleDelete(id: number) {
  ElMessageBox.confirm($t("operator.confirmDeleteMessage"), "", {
    type: "warning"
  })
    .then(async () => {
      const { success } = await deletePageContent(id);
      if (success) {
        message($t("operator.deleteSuccess"), { type: "success" });
        getData();
      }
    })
    .catch(() => {});
}

// ===== 內容新增/編輯表單 =====
const formVisible = ref(false);
const formStatus = ref<"new" | "edit">("new");
const editForm = reactive({
  type: 1,
  contentId: 0,
  sort: 0,
  content: "",
  contentH5: "",
  group: "",
  description: "",
  language: "",
  startTime: "",
  endTime: ""
});

function openContentForm(type: number, status: "new" | "edit", row?: ContentItem) {
  formStatus.value = status;
  editForm.type = type;
  editForm.content = "";
  editForm.contentH5 = "";
  editForm.group = "";
  editForm.description = "";
  editForm.startTime = "";
  editForm.endTime = "";
  editForm.contentId = 0;
  editForm.sort = 0;
  if (status === "edit" && row) {
    editForm.contentId = row.id;
    editForm.sort = row.sort;
    editForm.content = row.content;
    editForm.contentH5 = row.contentH5;
    editForm.group = row.group;
    editForm.description = row.description;
    editForm.language = row.language;
    editForm.startTime =
      row.startTime && row.startTime !== "0000-00-00 00:00:00" ? row.startTime : "";
    editForm.endTime =
      row.endTime && row.endTime !== "0000-00-00 00:00:00" ? row.endTime : "";
  } else {
    // 新增時預設語系為第一個（排除「全部」）
    editForm.language = getLanguageOption()[0]?.value ?? "";
  }
  formVisible.value = true;
}

// 圖片上傳：el-upload 自訂 http-request
async function handleUpload(option: any, isH5: boolean) {
  const formData = new FormData();
  formData.append("type", "banner");
  formData.append("file", option.file);
  try {
    const { data } = await uploadPageImg(formData);
    if (isH5) {
      editForm.contentH5 = data?.url ?? "";
    } else {
      editForm.content = data?.url ?? "";
    }
    message($t("operator.uploadSuccess"), { type: "success" });
  } catch (_) {
    message($t("operator.uploadError"), { type: "error" });
  }
}

async function submitContent() {
  if (editForm.type !== 2 && !editForm.content) {
    message($t("operator.plzUploadPcImage"), { type: "error" });
    return;
  }
  if (editForm.type === 2 && !editForm.content) {
    message($t("operator.plzUploadPcImage"), { type: "error" });
    return;
  }
  if (formStatus.value === "new") {
    const { success } = await postPageContent({
      platformPageID: props.pageId,
      type: editForm.type,
      content: editForm.content,
      contentH5: editForm.contentH5,
      description: editForm.description || "",
      group: editForm.group || "",
      language: editForm.language,
      startTime: editForm.startTime || "",
      endTime: editForm.endTime || ""
    });
    if (!success) return;
  } else {
    const { success } = await putPageContent({
      id: editForm.contentId,
      sort: editForm.sort,
      content: editForm.content,
      contentH5: editForm.contentH5,
      description: editForm.description || "",
      group: editForm.group || "",
      language: editForm.language,
      startTime: editForm.startTime || "",
      endTime: editForm.endTime || ""
    });
    if (!success) return;
  }
  message($t("operator.editSuccess"), { type: "success" });
  formVisible.value = false;
  getData();
}

onMounted(() => {
  getData();
});
</script>

<template>
  <div v-loading="loading" class="px-2">
    <!-- 頁面名稱 + 新增按鈕列 -->
    <div class="flex items-center flex-wrap gap-3 mb-4">
      <span class="font-semibold">{{ $t("operator.name") }}：</span>
      <span class="font-semibold mr-4">{{ props.pageName }}</span>
      <el-button type="primary" size="small" @click="openContentForm(1, 'new')">
        {{ $t("operator.addText") }}
      </el-button>
      <el-button type="primary" size="small" @click="openContentForm(2, 'new')">
        {{ $t("operator.addImage") }}
      </el-button>
      <el-button type="primary" size="small" @click="openContentForm(3, 'new')">
        {{ $t("operator.add") }} html code
      </el-button>
      <el-button type="primary" size="small" @click="openContentForm(4, 'new')">
        {{ $t("operator.add") }} {{ $t("operator.hyperLink") }}
      </el-button>
    </div>

    <!-- 語系篩選 -->
    <div class="mb-3">
      <el-select
        v-model="filterLanguage"
        class="!w-[150px]"
        @change="getData"
      >
        <el-option
          v-for="item in languageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <!-- 內容列表 -->
    <el-table :data="displayList" border>
      <el-table-column label="sort" width="160">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <el-input-number
              v-if="sortingId === row.id"
              v-model="sortNumber"
              :min="0"
              :step="1"
              size="small"
              class="!w-[90px]"
            />
            <span v-else>{{ row.sort }}</span>
            <el-button
              v-if="sortingId !== row.id"
              link
              type="primary"
              size="small"
              @click="startSort(row)"
            >
              {{ $t("operator.edit") }}
            </el-button>
            <el-button
              v-else
              link
              type="success"
              size="small"
              @click="confirmSort(row)"
            >
              OK
            </el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="$t('operator.content')" min-width="200">
        <template #default="{ row }">
          <img
            v-if="row.type === 2"
            :src="imagPath + row.content"
            class="object-contain max-h-[80px]"
          />
          <div v-else class="line-clamp-3">{{ formatContent(row.content) }}</div>
        </template>
      </el-table-column>

      <el-table-column :label="$t('operator.language')" width="90">
        <template #default="{ row }">{{ row.language || "--" }}</template>
      </el-table-column>
      <el-table-column :label="$t('operator.group')" width="100">
        <template #default="{ row }">{{ row.group || "--" }}</template>
      </el-table-column>
      <el-table-column :label="$t('operator.describe')" min-width="120">
        <template #default="{ row }">{{ row.description || "--" }}</template>
      </el-table-column>
      <el-table-column :label="$t('operator.startTime')" width="160">
        <template #default="{ row }">{{ row.startTime || "--" }}</template>
      </el-table-column>
      <el-table-column :label="$t('operator.endTime')" width="160">
        <template #default="{ row }">{{ row.endTime || "--" }}</template>
      </el-table-column>

      <el-table-column :label="$t('operator.edit')" width="140" fixed="right">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="openContentForm(row.type, 'edit', row)"
          >
            {{ $t("operator.edit") }}
          </el-button>
          <el-button
            link
            type="danger"
            size="small"
            @click="handleDelete(row.id)"
          >
            {{ $t("operator.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 內容新增/編輯彈窗 -->
    <el-dialog
      v-model="formVisible"
      :title="`${formStatus === 'new' ? $t('operator.add') : $t('operator.edit')} ${typeLabel[editForm.type]}`"
      width="760px"
      append-to-body
      destroy-on-close
    >
      <el-form label-width="120px">
        <!-- 文字 / 超連結 -->
        <el-form-item
          v-if="editForm.type === 1"
          :label="$t('operator.content')"
        >
          <el-input
            v-model="editForm.content"
            type="textarea"
            :rows="12"
            clearable
            :placeholder="$t('operator.inputText')"
          />
        </el-form-item>
        <el-form-item
          v-if="editForm.type === 4"
          :label="$t('operator.hyperLink')"
        >
          <el-input
            v-model="editForm.content"
            clearable
            :placeholder="$t('operator.inputText')"
          />
        </el-form-item>

        <!-- html code：pure 無 Tinymce 元件，暫以 textarea 編輯原始 html -->
        <el-form-item v-if="editForm.type === 3" label="html code">
          <el-input
            v-model="editForm.content"
            type="textarea"
            :rows="12"
            clearable
            :placeholder="$t('operator.inputText')"
          />
        </el-form-item>

        <!-- 圖片：PC + H5 -->
        <template v-if="editForm.type === 2">
          <el-form-item label="PC">
            <div class="flex flex-col gap-2">
              <el-upload
                :show-file-list="false"
                accept="image/*"
                :http-request="(o: any) => handleUpload(o, false)"
              >
                <el-button type="primary">{{ $t("operator.add") }}</el-button>
              </el-upload>
              <img
                v-if="editForm.content"
                :src="apiServerUrl(editForm.content)"
                class="object-contain max-h-[120px]"
              />
            </div>
          </el-form-item>
          <el-form-item label="H5">
            <div class="flex flex-col gap-2">
              <el-upload
                :show-file-list="false"
                accept="image/*"
                :http-request="(o: any) => handleUpload(o, true)"
              >
                <el-button type="primary">{{ $t("operator.add") }}</el-button>
              </el-upload>
              <img
                v-if="editForm.contentH5"
                :src="apiServerUrl(editForm.contentH5)"
                class="object-contain max-h-[120px]"
              />
            </div>
          </el-form-item>
        </template>

        <!-- 共用：分組 / 描述 / 語系 / 起訖時間 -->
        <el-form-item :label="$t('operator.group')">
          <el-input
            v-model="editForm.group"
            clearable
            class="!w-[300px]"
            :placeholder="$t('operator.inputText')"
          />
        </el-form-item>
        <el-form-item :label="$t('operator.describe')">
          <el-input
            v-model="editForm.description"
            clearable
            class="!w-[300px]"
            :placeholder="$t('operator.inputText')"
          />
        </el-form-item>
        <el-form-item :label="$t('operator.language')">
          <el-select v-model="editForm.language" class="!w-[150px]">
            <el-option
              v-for="item in getLanguageOption()"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('operator.startTime')">
          <el-date-picker
            v-model="editForm.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('operator.selectStartTime')"
          />
        </el-form-item>
        <el-form-item :label="$t('operator.endTime')">
          <el-date-picker
            v-model="editForm.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('operator.selectEndTime')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">{{ $t("operator.cancel") }}</el-button>
        <el-button type="primary" @click="submitContent">
          {{ $t("operator.confirm") }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
