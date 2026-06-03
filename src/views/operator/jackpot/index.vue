<script setup lang="ts">
import { useJackpot } from "./utils/hook";
import { formRules } from "./utils/rule";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "OperatorJackpot" });

const { loading, formRef, formData, handleSubmit } = useJackpot();
</script>

<template>
  <div class="main">
    <el-card v-loading="loading" shadow="never" class="!w-[640px]">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="180px"
      >
        <!-- Jackpot 初始值（區間） -->
        <el-form-item :label="$t('operator.jackpotField1')" required>
          <div class="flex items-center">
            <el-form-item prop="min" class="!mb-0">
              <el-input v-model="formData.min" class="!w-[120px]" />
            </el-form-item>
            <span class="mx-2">~</span>
            <el-form-item prop="max" class="!mb-0">
              <el-input v-model="formData.max" class="!w-[120px]" />
            </el-form-item>
          </div>
        </el-form-item>

        <!-- 每次跳動頻率（秒） -->
        <el-form-item :label="$t('operator.jackpotField2')" prop="cycle">
          <el-input v-model="formData.cycle" class="!w-[120px]">
            <template #suffix>{{ $t("operator.timeSeconds") }}</template>
          </el-input>
        </el-form-item>

        <!-- 每次跳動金額（區間） -->
        <el-form-item :label="$t('operator.jackpotField3')" required>
          <div class="flex items-center">
            <el-form-item prop="min_cycle" class="!mb-0">
              <el-input v-model="formData.min_cycle" class="!w-[120px]" />
            </el-form-item>
            <span class="mx-2">~</span>
            <el-form-item prop="max_cycle" class="!mb-0">
              <el-input v-model="formData.max_cycle" class="!w-[120px]" />
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item v-if="hasAuth('__btn_fake_jackpot_edit')">
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            {{ $t("operator.saveText") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
