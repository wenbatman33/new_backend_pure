<template>
  <div>
    <div class="flex items-center">
      <!-- 自訂 http-request 上傳，不走 el-upload 預設行為 -->
      <el-upload
        :show-file-list="false"
        :accept="props.accept"
        :http-request="handleUpload"
      >
        <el-button size="small" type="primary" :icon="UploadIcon" />
      </el-upload>

      <img
        v-if="imageUrl && props.accept.includes('image')"
        :src="imageUrl"
        :style="{ width: `${props.width}px` }"
        class="ml-2"
      />
      <video
        v-if="imageUrl && props.accept.includes('video')"
        controls
        width="250"
        :src="imageUrl"
        class="ml-2"
      >
        Your browser does not support the video tag.
      </video>

      <el-icon
        v-if="imageUrl"
        v-show="props.showDelete"
        class="ml-2 cursor-pointer"
        @click="handleDelete"
      >
        <CircleClose />
      </el-icon>
    </div>
    <div v-if="imageSizeCheck" class="text-[red]">
      {{ sizeCheckHelper(props.sizeType) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { CircleClose, UploadFilled as UploadIcon } from "@element-plus/icons-vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { fileUpload } from "@/api/common";
import { apiServerUrl } from "@/utils/imgUrl";

defineOptions({ name: "UploadFile" });

const props = defineProps({
  imageFile: String,
  type: {
    type: String,
    default: "banner"
  },
  accept: {
    type: String,
    default: "image/*"
  },
  // sizeType 1=10kb 2=20kb 3=30kb 4=70kb，0=不檢查
  sizeType: {
    type: Number,
    default: 3
  },
  width: {
    type: Number,
    default: 100
  },
  showDelete: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(["update:imageFile"]);

const imageUrl = ref<string>("");
const imageSizeCheck = ref<boolean>(false);
const imageSize = ref<number>(0);

// 將舊 maxSize 代號換算為實際 KB 上限
function switchMaxSize(maxSize: number) {
  switch (maxSize) {
    case 1:
      return 10;
    case 2:
      return 20;
    case 3:
      return 30;
    case 4:
      return 70;
    default:
      return maxSize;
  }
}

// 檢查檔案大小是否在上限內
function sizeCheck(dataSize: number, maxSize = 3) {
  if (dataSize === 0 || maxSize === 0) return true;
  const max = switchMaxSize(maxSize);
  if (dataSize <= max * 1024) return true;
  ElMessage.error($t("common.uploadMaxSizeMessage"));
  return false;
}

// 提示文字：檔案大小上限
function sizeCheckHelper(maxSize = 3) {
  if (maxSize === 0) return "";
  const max = switchMaxSize(maxSize);
  return $t("common.uploadMaxSizeKb", { size: max });
}

// el-upload 自訂上傳：本地預覽 + 呼叫上傳 api
const handleUpload = async (options: { file: File }) => {
  const file = options.file;
  imageSizeCheck.value = !sizeCheck(file.size, props.sizeType);
  if (imageSizeCheck.value) return;
  const formData = new FormData();
  formData.append("type", props.type);
  formData.append("file", file);
  const { success, data } = await fileUpload(formData);
  if (!success) return;
  imageUrl.value = apiServerUrl(data.url);
  imageSize.value = file.size;
  emit("update:imageFile", data.url);
};

const handleDelete = () => {
  imageUrl.value = "";
  imageSize.value = 0;
  imageSizeCheck.value = false;
  emit("update:imageFile", "");
};

watch(
  () => props.imageFile,
  val => {
    imageUrl.value = val ? apiServerUrl(val) : "";
  },
  { immediate: true }
);

// sizeType 變更時重新檢查目前檔案
watch(
  () => props.sizeType,
  val => {
    imageSizeCheck.value = !sizeCheck(imageSize.value, val);
  }
);

// 表單校驗：尺寸合格才回 true
const validate = () => {
  if (imageSize.value === 0) return true;
  return sizeCheck(imageSize.value, props.sizeType);
};

// 對外手動更新 imageUrl（保持與舊版相容）
const updateImageFile = (val: string) => {
  imageUrl.value = val;
  emit("update:imageFile", val);
};

defineExpose({
  validate,
  updateImageFile
});
</script>
