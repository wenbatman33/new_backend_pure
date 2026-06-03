<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  mode: "Create",
  serviceCodeOptions: () => [],
  payChannelOptions: () => [],
  showFrontDeskName: false,
  formInline: () => ({
    id: "",
    payChannelID: "",
    status: 0,
    show: 1,
    name: "",
    device: "",
    weight: "",
    serviceCode: [],
    qrcodeImage: "",
    displayName: "",
    note: "",
    lowerLimit: "",
    upperLimit: "",
    dayLimit: "",
    fee: "",
    perFee: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 查看模式時所有欄位唯讀
const isDisabled = computed(() => props.mode === "ShowRowData");
// weight / show 僅編輯模式顯示
const isEdit = computed(() => props.mode === "Edit");

const deviceOptions = [
  { label: "PC", value: "1" },
  { label: "H5", value: "2" }
];

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
    :disabled="isDisabled"
    label-width="140px"
  >
    <el-row :gutter="16">
      <el-col :span="12">
        <el-form-item :label="$t('payment.payChannelID')" prop="payChannelID">
          <el-select
            v-model="newFormInline.payChannelID"
            clearable
            class="w-full"
            :disabled="isEdit"
            :placeholder="$t('payment.payChannelIDPhd')"
          >
            <el-option
              v-for="item in payChannelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item :label="$t('payment.status')" prop="status">
          <el-switch
            v-model="newFormInline.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-col>

      <el-col v-if="isEdit" :span="6">
        <el-form-item :label="$t('payment.show')" prop="show">
          <el-switch
            v-model="newFormInline.show"
            :active-value="1"
            :inactive-value="2"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('payment.lineName')" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            :placeholder="$t('payment.lineNameTip')"
          />
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item :label="$t('payment.device')" prop="device">
          <el-radio-group v-model="newFormInline.device" disabled>
            <el-radio-button
              v-for="item in deviceOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>

      <el-col v-if="isEdit" :span="6">
        <el-form-item :label="$t('payment.proportion')" prop="weight">
          <el-input-number
            v-model="newFormInline.weight"
            class="w-full"
            :controls="false"
            :placeholder="$t('payment.proportion')"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('payment.payment')" prop="serviceCode">
          <el-checkbox-group v-model="newFormInline.serviceCode">
            <el-checkbox
              v-for="item in serviceCodeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>

      <!-- 14572 菲站可上傳支付 QRcode；UploadFile 元件尚未移植，暫以 URL 輸入替代 -->
      <el-col v-if="isEdit" :span="12">
        <el-form-item label="QRcode" prop="qrcodeImage">
          <el-input
            v-model="newFormInline.qrcodeImage"
            clearable
            placeholder="QRcode URL"
          />
        </el-form-item>
      </el-col>

      <el-col v-if="showFrontDeskName" :span="12">
        <el-form-item :label="$t('payment.frontDeskName')" prop="displayName">
          <el-input v-model="newFormInline.displayName" clearable />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('payment.remark')" prop="note">
          <el-input
            v-model="newFormInline.note"
            type="textarea"
            :rows="2"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('payment.lowerLimit')" prop="lowerLimit">
          <el-input
            v-model="newFormInline.lowerLimit"
            clearable
            :placeholder="$t('payment.lowerLimitTip')"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('payment.upperLimit')" prop="upperLimit">
          <el-input
            v-model="newFormInline.upperLimit"
            clearable
            :placeholder="$t('payment.upperLimitTip')"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label="$t('payment.dayLimit')" prop="dayLimit">
          <el-input
            v-model="newFormInline.dayLimit"
            clearable
            :placeholder="$t('payment.dayLimitTip')"
          />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item :label="$t('payment.handlingFee')" prop="perFee">
          <div class="flex flex-row items-center w-full">
            <span class="flex-shrink-0 px-2">{{ $t("payment.amount") }} x</span>
            <el-input v-model="newFormInline.fee" type="number" />
            <span class="flex-shrink-0 px-2">‰ ＋ {{ $t("payment.one") }}</span>
            <el-input v-model="newFormInline.perFee" type="number" />
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
