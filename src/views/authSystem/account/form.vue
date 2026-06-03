<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import type { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    adminID: undefined,
    account: "",
    password: "",
    password2: "",
    name: "",
    email: "",
    deptID: "",
    title: "",
    vpnIP: "",
    commentCategory: "",
    status: 2,
    fnRole: "",
    tagID: "",
    isUpdate: false
  }),
  deptList: () => [],
  roleList: () => [],
  tagList: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 確認密碼校驗：與 password 一致
function validatePassword2(_rule, value, callback) {
  if (!newFormInline.value.isUpdate) {
    if (!value) {
      callback(new Error($t("authSystem.passwordValidate")));
    } else if (value !== newFormInline.value.password) {
      callback(new Error($t("authSystem.passwordValidate")));
    } else {
      callback();
    }
  } else {
    callback();
  }
}

const extraRules = {
  ...formRules,
  password2: [{ validator: validatePassword2, trigger: "blur" }]
};

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="extraRules"
    label-width="130px"
  >
    <el-form-item v-if="newFormInline.isUpdate" label="ID">
      <el-input v-model="newFormInline.adminID" disabled />
    </el-form-item>

    <el-form-item
      v-if="!newFormInline.isUpdate"
      :label="$t('authSystem.columnHead1')"
      prop="account"
    >
      <el-input
        v-model="newFormInline.account"
        clearable
        autocomplete="new-password"
        :placeholder="$t('authSystem.accountValidate1')"
      />
    </el-form-item>

    <el-form-item
      v-if="!newFormInline.isUpdate"
      :label="$t('authSystem.password')"
      prop="password"
    >
      <el-input
        v-model="newFormInline.password"
        type="password"
        clearable
        show-password
        autocomplete="new-password"
      />
    </el-form-item>

    <el-form-item
      v-if="!newFormInline.isUpdate"
      :label="$t('authSystem.password2')"
      prop="password2"
    >
      <el-input
        v-model="newFormInline.password2"
        type="password"
        clearable
        show-password
      />
    </el-form-item>

    <el-form-item :label="$t('authSystem.name')" prop="name">
      <el-input v-model="newFormInline.name" clearable />
    </el-form-item>

    <el-form-item label="Email" prop="email">
      <el-input v-model="newFormInline.email" clearable />
    </el-form-item>

    <el-form-item :label="$t('authSystem.dept')" prop="deptID">
      <el-select
        v-model="newFormInline.deptID"
        clearable
        class="w-full"
        :placeholder="$t('authSystem.choseDept')"
      >
        <el-option
          v-for="item in deptList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('authSystem.title')" prop="title">
      <el-input v-model="newFormInline.title" clearable />
    </el-form-item>

    <el-form-item label="VPN IP" prop="vpnIP">
      <el-input v-model="newFormInline.vpnIP" clearable />
    </el-form-item>

    <el-form-item :label="$t('authSystem.fnRole')" prop="fnRole">
      <el-select
        v-model="newFormInline.fnRole"
        clearable
        class="w-full"
        :placeholder="$t('authSystem.chooseGroup')"
      >
        <el-option
          v-for="item in roleList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('authSystem.tagID')" prop="tagID">
      <el-select v-model="newFormInline.tagID" clearable class="w-full">
        <el-option
          v-for="item in tagList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
