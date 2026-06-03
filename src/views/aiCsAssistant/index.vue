<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { transformI18n as $t } from "@/plugins/i18n";
import { askAiCsAssistant } from "@/api/aiCsAssistant";

defineOptions({ name: "AiCsAssistant" });

const question = ref("");
const displayAnswer = ref("");
const loading = ref(false);
const streaming = ref(false);
let streamTimer: ReturnType<typeof setInterval> | null = null;

// 清除逐字顯示計時器
function clearStreamTimer() {
  if (streamTimer !== null) {
    clearInterval(streamTimer);
    streamTimer = null;
  }
  streaming.value = false;
}

// 模擬逐字顯示 streaming 效果
function simulateStreaming(fullText: string) {
  clearStreamTimer();
  displayAnswer.value = "";
  streaming.value = true;
  let idx = 0;
  streamTimer = setInterval(() => {
    if (idx >= fullText.length) {
      clearStreamTimer();
      return;
    }
    displayAnswer.value += fullText.charAt(idx);
    idx += 1;
  }, 30);
}

function handleReset() {
  clearStreamTimer();
  question.value = "";
  displayAnswer.value = "";
}

async function handleSubmit() {
  const q = question.value.trim();
  if (!q) {
    ElMessage.warning($t("aiCsAssistant.pleaseInputQuestion"));
    return;
  }
  clearStreamTimer();
  displayAnswer.value = "";
  loading.value = true;
  try {
    // 後端 data 為一段 JSON 字串，內部結構為 { message: string }
    const { success, data } = await askAiCsAssistant({ question: q });
    if (!success) {
      ElMessage.error($t("aiCsAssistant.requestFailed"));
      return;
    }
    let answer = String(data ?? "");
    try {
      const parsed = JSON.parse(answer);
      if (parsed && typeof parsed === "object" && "message" in parsed) {
        answer = String(parsed.message ?? "");
      }
    } catch {
      // 後端若直接回純字串，保留原樣顯示
    }
    simulateStreaming(answer);
  } catch (e: any) {
    ElMessage.error(e?.message || $t("aiCsAssistant.requestFailed"));
  } finally {
    loading.value = false;
  }
}

onBeforeUnmount(() => {
  clearStreamTimer();
});
</script>

<template>
  <div class="main ai-cs-assistant">
    <!-- 問題區 -->
    <div class="ai-cs-assistant__section">
      <div class="ai-cs-assistant__header">
        <span class="ai-cs-assistant__title">
          {{ $t("aiCsAssistant.pleaseInputQuestion") }}
        </span>
      </div>
      <div class="ai-cs-assistant__box">
        <el-input
          v-model="question"
          type="textarea"
          :rows="9"
          :disabled="loading"
          resize="none"
          class="ai-cs-assistant__textarea"
        />
        <div class="ai-cs-assistant__actions">
          <el-button :disabled="loading" @click="handleReset">
            {{ $t("aiCsAssistant.reset") }}
          </el-button>
          <el-button type="danger" :loading="loading" @click="handleSubmit">
            {{ $t("aiCsAssistant.submit") }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 回答結果區 -->
    <div class="ai-cs-assistant__section">
      <div class="ai-cs-assistant__header">
        <span class="ai-cs-assistant__title">
          {{ $t("aiCsAssistant.answerResult") }}
        </span>
      </div>
      <div class="ai-cs-assistant__box ai-cs-assistant__box--answer">
        <div class="ai-cs-assistant__answer">
          {{ displayAnswer
          }}<span v-if="streaming" class="ai-cs-assistant__caret">|</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-cs-assistant {
  padding: 16px;

  &__section {
    margin-bottom: 24px;
  }

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
  }

  &__box {
    position: relative;
    min-height: 280px;
    padding: 16px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 4px;

    &--answer {
      min-height: 280px;
    }
  }

  &__textarea {
    width: 100%;
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 12px;
  }

  &__answer {
    min-height: 240px;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__caret {
    display: inline-block;
    margin-left: 2px;
    color: var(--el-text-color-secondary);
    animation: ai-cs-blink 1s steps(1) infinite;
  }
}

@keyframes ai-cs-blink {
  50% {
    opacity: 0;
  }
}
</style>
