<script setup lang="ts">
import { useBindingAuth } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "SysBindingAuth" });

const { expired, qrCodeImg, handleLogin } = useBindingAuth();
</script>

<template>
  <div class="main binding-auth">
    <el-alert
      :title="$t('sys.bindingAuthTip')"
      :description="$t('sys.bindingAuthTipDesc')"
      type="warning"
      class="binding-auth__alert"
      show-icon
      :closable="false"
    />
    <el-card class="binding-auth__card" shadow="never">
      <div class="binding-auth__content">
        <img
          v-if="!expired && qrCodeImg"
          :src="qrCodeImg"
          alt="qrcode"
          class="binding-auth__qr"
        />
        <h1 v-if="expired" class="binding-auth__title">
          {{ $t("sys.bindingAuthExpired") }}
        </h1>
        <h1 v-else class="binding-auth__title">
          {{ $t("sys.bindingAuthScan") }}
        </h1>
        <div class="binding-auth__action">
          <el-button type="primary" @click="handleLogin">
            {{ $t("sys.bindingAuthRelogin") }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.binding-auth {
  width: 50%;
  margin: 0 auto;
  padding-top: 6vh;

  &__alert {
    margin-bottom: 16px;
  }

  &__card {
    width: 100%;
  }

  &__content {
    width: 500px;
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
  }

  &__qr {
    display: block;
    width: 500px;
    max-width: 100%;
    margin: 0 auto;
  }

  &__title {
    margin-top: 16px;
    font-size: 1.25rem;
    line-height: 1.6;
  }

  &__action {
    margin-top: 40px;
  }
}
</style>
