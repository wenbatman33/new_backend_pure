<template>
  <div class="deeplink-type flex gap-2">
    <!-- deeplink 類型 -->
    <el-select
      v-model="DLType"
      class="!w-[300px]"
      :placeholder="$t('common.plzSelect')"
      clearable
      @change="handleTypeOnChange"
    >
      <el-option
        v-for="item in deeplinkType"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <!-- 開啟頁面（deeplinkType === 1 時顯示） -->
    <el-select
      v-show="DLPageShow"
      v-model="DLPage"
      class="!w-[300px]"
      :placeholder="$t('common.plzInputOpenPage')"
      clearable
      @change="handlePageOnChange"
    >
      <el-option
        v-for="item in deeplinkPageType"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <!-- ID / URL 輸入 -->
    <el-input
      v-show="DlIDShow"
      v-model="DlID"
      class="!w-[300px]"
      :placeholder="placeholder"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "DeepLinkType" });

const props = defineProps<{
  deeplinkType?: number;
  deeplinkPage?: string;
  deeplinkID?: string;
}>();

const emit = defineEmits<{
  (e: "update:deeplinkType", v: number): void;
  (e: "update:deeplinkPage", v: string): void;
  (e: "update:deeplinkID", v: string): void;
}>();

// deeplink 主類型選項
const deeplinkType = [
  { label: $t("common.deeplinkNone"), value: 0 },
  { label: $t("common.deeplinkInProduct"), value: 1 },
  { label: $t("common.deeplinkInProductWeb"), value: 2 },
  { label: $t("common.deeplinkOpenAnotherWindow"), value: 3 },
  { label: $t("common.deeplinkNeedLogin"), value: 4 },
  { label: $t("common.deeplinkIndependentActivity"), value: 5 },
  { label: $t("common.deeplinkEnterGame"), value: 6 },
  { label: $t("common.deeplinkLottery"), value: 7 },
  { label: $t("common.deeplinkLink"), value: 8 },
  { label: $t("common.deeplinkOther"), value: 9 }
];

// 開啟頁面對照（value 為實際 deeplink scheme 字串）
const deeplinkPageType = [
  { label: $t("common.deeplinkHomePage"), value: "xinli://home" },
  { label: $t("common.deeplinkMine"), value: "xinli://personal" },
  { label: $t("common.deeplinkDiscount"), value: "xinli://promo" },
  { label: $t("common.deeplinkDiscountInsidePages"), value: "xinli://promo/?id=" },
  { label: $t("common.deeplinkBet"), value: "xinli://bet" },
  { label: $t("common.deeplinkMineGenerallyMessage"), value: "xinli://profile" },
  { label: $t("common.deeplinkMineWithdrawalManagement"), value: "xinli://atm" },
  { label: $t("common.deeplinkMineTransactionHistory"), value: "xinli://transaction" },
  { label: $t("common.deeplinkMineUserSecurity"), value: "xinli://security" },
  { label: $t("common.deeplinkTaskcenter"), value: "xinli://taskcenter/?id=" },
  { label: $t("common.deeplinkGameAssemblyPage"), value: "xinli://assemble" },
  { label: $t("common.deeplinkAssemble"), value: "xinli://assemble/?id=" },
  { label: $t("common.deeplinkGamepage"), value: "xinli://gamepage/?id=" },
  { label: $t("common.deeplinkVipClub"), value: "xinli://vip" },
  { label: $t("common.deeplinkDeposit"), value: "xinli://deposit" },
  { label: $t("common.deeplinkWithdrawMoney"), value: "xinli://withdrawal" },
  { label: $t("common.deeplinkSiteMessage"), value: "xinli://inbox" },
  { label: $t("common.deeplinkLogin"), value: "xinli://login" },
  { label: $t("common.deeplinkRegister"), value: "xinli://signup" },
  { label: $t("common.deeplinkApplyDiscounts"), value: "xinli://applypromo/?id=" },
  { label: $t("common.deeplinkDownloadPage"), value: "xinli://download" },
  { label: $t("common.deeplinkNews"), value: "xinli://news" },
  { label: $t("common.deeplinkChatroom"), value: "xinli://chatroom" },
  { label: $t("common.deeplinkRecommend"), value: "xinli://recommend" },
  { label: $t("common.deeplinkAgent"), value: "xinli://agent" },
  { label: $t("common.deeplinkWelfare1"), value: "xinli://welfare1" },
  { label: $t("common.deeplinkWelfare2"), value: "xinli://welfare2" }
];

const DLType = ref<number>(0);
const DLPage = ref<string | undefined>(undefined);
const DlID = ref<string>("");
const DLPageShow = ref<boolean>(false);
const DlIDShow = ref<boolean>(false);
const placeholder = ref<string>("");

// 依 deeplinkType 切換顯示哪些欄位與 placeholder（與舊版邏輯一致）
const typeOnChange = (value: any) => {
  if (value === 2 || value === 3 || value === 4 || value === 5 || value === 9) {
    if (value === 9) {
      DlID.value = DLPage.value || "";
      DLPage.value = "";
    }
    DLPageShow.value = false;
    DlIDShow.value = true;
    placeholder.value = $t("common.plzInputURL");
  } else if (value === 6 || value === 7) {
    DLPageShow.value = false;
    DlIDShow.value = true;
    placeholder.value = $t("common.plzInputId");
  } else if (value === 1) {
    // step 1 如果有 DLID 但沒有 DLPage 要補上 /?id=
    if (!DLPage.value?.includes("/?id=") && DlID.value) {
      DLPage.value = DLPage.value + "/?id=";
    }
    // step 2 如果 DLPage 有 ?id= 則 DlIDShow 為 true
    DlIDShow.value = !!DLPage.value?.includes("/?id=");
    DLPageShow.value = true;
    placeholder.value = $t("common.plzInputId");
  } else {
    DLPageShow.value = false;
    DlIDShow.value = false;
  }
};

const handleTypeOnChange = (value: any) => {
  DLPage.value = undefined;
  DlID.value = "";
  typeOnChange(value);
  syncOut();
};

const handlePageOnChange = (value: any) => {
  DlIDShow.value = (value || "").includes("?id=");
  syncOut();
};

// v-model 對外同步
const syncOut = () => {
  emit("update:deeplinkType", Number(DLType.value));
  emit("update:deeplinkPage", DLPage.value || "");
  emit("update:deeplinkID", DlID.value);
};

// 輸出 payload（與舊版 transformDeeplink 完全一致，供父層 defineExpose 呼叫）
const transformDeeplink = (payload: any) => {
  payload.deeplinkType = Number(DLType.value);
  payload.deeplinkID = DlID.value;
  if (payload.deeplinkType === 9) {
    payload.deeplinkPage = DlID.value;
    payload.deeplinkID = "";
  } else if (payload.deeplinkType === 1) {
    if (DLPage.value?.includes("/?id=")) {
      payload.deeplinkPage = DLPage.value.split("/?id=")[0];
    } else {
      payload.deeplinkPage = DLPage.value || "";
      payload.deeplinkID = "";
    }
  } else if (payload.deeplinkType === 2) {
    payload.deeplinkPage = "xinli://inapp";
  } else if (payload.deeplinkType === 3) {
    payload.deeplinkPage = "xinli://outapp";
  } else if (payload.deeplinkType === 4) {
    payload.deeplinkPage = "xinli://loginapp";
  } else if (payload.deeplinkType === 5) {
    payload.deeplinkPage = "xinli://event";
  } else if (payload.deeplinkType === 6) {
    payload.deeplinkPage = "xinli://opengame";
  } else if (payload.deeplinkType === 7) {
    payload.deeplinkPage = "xinli://lottery";
  }
  return payload;
};

defineExpose({ transformDeeplink });

// 監聽 props 變化，回填內部狀態（與舊版 deep+immediate watch 一致）
watch(
  () => props,
  newProps => {
    DLType.value = Number(newProps.deeplinkType ?? 0);
    DlID.value = newProps.deeplinkID || "";
    DLPage.value = newProps.deeplinkPage || "";
    typeOnChange(DLType.value);
  },
  { deep: true, immediate: true }
);
</script>
