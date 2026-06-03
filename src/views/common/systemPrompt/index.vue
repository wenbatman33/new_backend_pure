<script setup lang="ts">
import { ref, watch } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "SystemPrompt" });

const props = withDefaults(
  defineProps<{
    // 對外顯示控制（v-model）
    modelValue?: boolean;
    // 提示內容
    content?: string;
    // 標題
    title?: string;
    // 寬度
    width?: string | number;
  }>(),
  {
    modelValue: false,
    content: "",
    title: "",
    width: "420px"
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "ok"): void;
  (e: "cancel"): void;
  (e: "close"): void;
}>();

// 內部顯示狀態，與外部 v-model 同步
const visible = ref(props.modelValue);

watch(
  () => props.modelValue,
  val => {
    visible.value = val;
  }
);

watch(visible, val => {
  emit("update:modelValue", val);
});

// 提供命令式開啟方法（相容舊版 useModalInner 以 data.content 開啟的用法）
const innerContent = ref(props.content);

watch(
  () => props.content,
  val => {
    innerContent.value = val;
  }
);

function open(data?: { content?: string }) {
  if (data?.content !== undefined) innerContent.value = data.content;
  visible.value = true;
}

function close() {
  visible.value = false;
}

function handleOk() {
  emit("ok");
  close();
  emit("close");
}

function handleClose() {
  emit("cancel");
  emit("close");
}

defineExpose({ open, close });
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title || $t('common.systemPrompt')"
    :width="width"
    align-center
    append-to-body
    destroy-on-close
    @close="handleClose"
  >
    <div class="system-prompt-content">
      {{ innerContent || content }}
    </div>
    <template #footer>
      <el-button type="primary" @click="handleOk">
        {{ $t("common.close") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.system-prompt-content {
  min-height: 40px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
