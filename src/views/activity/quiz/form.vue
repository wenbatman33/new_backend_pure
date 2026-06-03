<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  mode: "edit",
  formInline: () => ({
    id: 0,
    quizId: 0,
    info: "",
    leagueName: "",
    eventTime: "",
    startTime: "",
    endTime: "",
    status: 0
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

/** 設為目前時間 */
function setNow(field: "startTime" | "endTime") {
  newFormInline.value[field] = dayjs().format("YYYY-MM-DD HH:mm:ss");
}

/** 結束時間設為與賽事時間相同 */
function setSameAsEvent() {
  newFormInline.value.endTime = newFormInline.value.eventTime;
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
    label-width="120px"
  >
    <el-form-item :label="$t('activity.matchInfo')">
      <span>{{ newFormInline.info }}</span>
    </el-form-item>

    <el-form-item :label="$t('activity.league')">
      <span>{{ newFormInline.leagueName }}</span>
    </el-form-item>

    <el-form-item :label="$t('activity.quizStartTime')" prop="startTime">
      <div class="flex items-center gap-2">
        <el-date-picker
          v-model="newFormInline.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          :placeholder="$t('activity.quizStartTime')"
        />
        <el-button type="primary" size="small" @click="setNow('startTime')">
          {{ $t("activity.now") }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item :label="$t('activity.quizEndTime')" prop="endTime">
      <div class="flex items-center gap-2">
        <el-date-picker
          v-model="newFormInline.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY/MM/DD HH:mm"
          :placeholder="$t('activity.quizEndTime')"
        />
        <el-button type="primary" size="small" @click="setSameAsEvent">
          {{ $t("activity.sameAsEventTime") }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item :label="$t('activity.isShow')" prop="status">
      <el-switch
        v-model="newFormInline.status"
        :active-value="1"
        :inactive-value="0"
        :active-text="$t('activity.show')"
        :inactive-text="$t('activity.hide')"
      />
    </el-form-item>
  </el-form>
</template>
