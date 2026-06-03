<script setup lang="ts">
import { useLoginSwitch } from "./utils/hook";
import LoginSwitchForm from "./form.vue";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "SystemManageLoginSwitch" });

const {
  pcForm,
  h5Form,
  registerOptions,
  loginOptions,
  showYesNoOptions,
  requiredOptions,
  reconfirmOptions,
  forceUpdateOptions,
  handlePCSubmit,
  handleH5Submit,
  openOperationRecord,
  hasAuth
} = useLoginSwitch();
</script>

<template>
  <div class="main">
    <div class="flex justify-end mb-3">
      <el-button type="primary" @click="openOperationRecord">
        {{ $t("systemManage.handleRecord") }}
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never">
          <el-divider class="title-divider">
            PC {{ $t("systemManage.setting") }}
          </el-divider>
          <LoginSwitchForm
            :model="pcForm"
            :register-options="registerOptions"
            :login-options="loginOptions"
            :show-yes-no-options="showYesNoOptions"
            :required-options="requiredOptions"
            :reconfirm-options="reconfirmOptions"
            :force-update-options="forceUpdateOptions"
          />
          <div class="flex justify-center mt-3">
            <el-button
              v-if="hasAuth('__btn_system_management_save_PC')"
              type="primary"
              @click="handlePCSubmit"
            >
              {{ $t("systemManage.savePCSetting") }}
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never">
          <el-divider class="title-divider danger">
            H5 {{ $t("systemManage.setting") }}
          </el-divider>
          <LoginSwitchForm
            :model="h5Form"
            :register-options="registerOptions"
            :login-options="loginOptions"
            :show-yes-no-options="showYesNoOptions"
            :required-options="requiredOptions"
            :reconfirm-options="reconfirmOptions"
            :force-update-options="forceUpdateOptions"
          />
          <div class="flex justify-center mt-3">
            <el-button
              v-if="hasAuth('__btn_system_management_save_H5_PWA')"
              type="primary"
              @click="handleH5Submit"
            >
              {{ $t("systemManage.saveH5AndPWASetting") }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.title-divider {
  :deep(.el-divider__text) {
    font-size: 1.3rem;
  }
  &.danger :deep(.el-divider__text) {
    color: #f00;
  }
}
</style>
