import { h, ref, reactive, onMounted } from "vue";
import { ElInput, ElUpload, ElButton, ElMessage } from "element-plus";
import { message } from "@/utils/message";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { i18n } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import { isArray } from "@/utils/is";
import editForm from "../form.vue";
import {
  getConfigure,
  postConfigure,
  putConfigureLevelEdit,
  postConfigureLevelInit,
  postConfigureLevelAdd,
  uploadFile,
  type ConfigureResult
} from "@/api/vip";
import type { LevelItem, ConfigForm, FormItemProps } from "./types";

/** 帶參數的 i18n（transformI18n 不支援插值，故直接走 i18n.global.t） */
const tt = (key: string, args?: any[]) =>
  args ? (i18n.global.t as any)(key, args) : (i18n.global.t as any)(key);

/** 圖片大小上限 30KB（對應舊 sizeCheck maxSize=3） */
const MAX_IMG_KB = 30;

/** 設定預設值 */
const defaultConfig = (): ConfigForm => ({
  vipStatus: true,
  isSpeedLevelUp: false,
  isUpgradeGift: true,
  isWeeklyGift: true,
  isMonthlyGift: true,
  isDailyGift: false,
  isBdGift: false,
  vipWeek: 0,
  vipMonth: 0,
  giftDeadline: 0,
  isBindCard: true,
  isShowRefund: false,
  customizedService: 0,
  isKeep: true,
  vipKeep: 0,
  vipKeepAging: 0,
  vipDowngrade: 0,
  bdGiftDeadline: 0
});

/** 新增等級表單空白值 */
const emptyForm = (): FormItemProps => ({
  name: "",
  vipImage: "",
  vipImageUrl: "",
  upgradeBetAmount: 0,
  upgradeRechargeAmount: 0,
  upgradeGift: 0,
  upgradeGiftMultiple: 0,
  birthdayGift: 0,
  birthdayGiftMultiple: 0,
  dailyGift: 0,
  dailyGiftRechargeMultiple: 0,
  dailyGiftBetMultiple: 0,
  dailyGiftMultiple: 0,
  weeklyGift: 0,
  weeklyGiftRechargeMultiple: 0,
  weeklyGiftBetMultiple: 0,
  weeklyGiftMultiple: 0,
  monthlyGift: 0,
  monthlyGiftRechargeMultiple: 0,
  monthlyGiftBetMultiple: 0,
  monthlyGiftMultiple: 0,
  withdrawAmountLimit: 0,
  withdrawTimesLimit: 0,
  singleWithdrawAmountLimit: 0
});

export function useVipLevel() {
  const imagePath = getImagPath();
  const loading = ref(false);
  /** -1=尚未載入，0=未設定（顯示初始化引導），>0=已有等級 */
  const dataLength = ref(-1);
  /** 初始化流程：是否進入「輸入等級數」步驟 */
  const goSetup = ref(false);
  const initLevel = ref<string>("");
  /** 設定區是否唯讀（編輯前唯讀） */
  const formDataDisabled = ref(true);

  const formData = ref<ConfigForm>(defaultConfig());
  const originalData = ref<ConfigForm>(defaultConfig());
  const dataList = ref<LevelItem[]>([]);
  const dialogFormRef = ref();

  /** 月份 1~28 排程選項（保級計算排程） */
  const vipKeepOptions = (() => {
    const opts = [{ label: $t("vip.setting11"), value: 0 }];
    for (let i = 1; i <= 28; i++) {
      opts.push({ label: tt("vip.choiceNdEveryMonth", [i]), value: i });
    }
    return opts;
  })();

  /** 保級時效（月） */
  const vipKeepAgingOptions = [
    { label: $t("vip.setting11"), value: 0 },
    { label: tt("vip.choiceMonths", [1]), value: 1 },
    { label: tt("vip.choiceMonths", [2]), value: 2 },
    { label: tt("vip.choiceMonths", [3]), value: 3 }
  ];

  /** 降級模式 */
  const vipDowngradeOptions = [
    { label: $t("vip.setting11"), value: 0 },
    { label: $t("vip.downgradeToLowestLevel"), value: 1 },
    { label: $t("vip.downgradeOneLevel"), value: 2 }
  ];

  /** 專屬優惠顯示 0~4 */
  const customizedServiceOptions = [0, 1, 2, 3, 4].map(v => ({
    label: v,
    value: v
  }));

  /** 禮金過期天數選項（共用於晉級禮金 / 生日禮金） */
  const giftDeadlineOptions = (() => {
    const value = [0, 1, 2, 3, 5, 7, 14, 30, 60, 90, 180, 365];
    return value.map(v =>
      v === 0
        ? { label: $t("vip.giftDeadline0"), value: 0 }
        : { label: tt("vip.giftDeadline", [v]), value: v }
    );
  })();

  /** 週礼金派發時間（週一~週日） */
  const vipWeekOptions = [
    { label: $t("vip.setting11"), value: 0 },
    { label: $t("vip.settingWeek1"), value: 1 },
    { label: $t("vip.settingWeek2"), value: 2 },
    { label: $t("vip.settingWeek3"), value: 3 },
    { label: $t("vip.settingWeek4"), value: 4 },
    { label: $t("vip.settingWeek5"), value: 5 },
    { label: $t("vip.settingWeek6"), value: 6 },
    { label: $t("vip.settingWeek7"), value: 7 }
  ];

  /** 月礼金派發時間（每月 1~27 日） */
  const vipMonthOptions = (() => {
    const opts = [{ label: $t("vip.setting11"), value: 0 }];
    for (let i = 1; i <= 27; i++) {
      opts.push({ label: $t(`vip.settingDate${i}`), value: i });
    }
    return opts;
  })();

  /** 圖片上傳（沿用舊 customRequest 邏輯，type=banner，限制 30KB） */
  async function handleUpload(data: any, record: LevelItem) {
    const sizeOk = data.file.size <= MAX_IMG_KB * 1024;
    record.vipImageSizeCheck = !sizeOk;
    if (!sizeOk) {
      ElMessage.error($t("vip.maxSizeMessage"));
      return;
    }
    const fd = new FormData();
    fd.append("type", "banner");
    fd.append("file", data.file);
    const { success, data: res } = await uploadFile(fd);
    if (success) {
      record.vipImageUrl = imagePath + res.url;
      record.vipImage = res.url;
    }
  }

  /** 可編輯文字欄位 cellRenderer */
  const editableCell = (prop: keyof LevelItem) => ({ row }: { row: LevelItem }) =>
    h(ElInput, {
      modelValue: row[prop] as any,
      size: "small",
      "onUpdate:modelValue": (val: string) => {
        (row as any)[prop] = val;
      }
    });

  const columns: TableColumnList = [
    { label: $t("vip.level"), prop: "level", width: 60, fixed: "left" },
    {
      label: $t("vip.vipImage"),
      prop: "vipImage",
      width: 90,
      cellRenderer: ({ row }) => {
        row.vipImageUrl = row.vipImage ? imagePath + row.vipImage : "";
        return h("div", [
          h("div", { class: "flex items-center gap-1" }, [
            row.vipImageUrl
              ? h("img", {
                  src: row.vipImageUrl,
                  style: "width:32px;height:32px;object-fit:contain"
                })
              : null,
            h(
              ElUpload,
              {
                showFileList: false,
                accept: "image/*",
                httpRequest: (opt: any) => handleUpload(opt, row)
              },
              {
                default: () =>
                  h(ElButton, { size: "small", type: "primary" }, () =>
                    $t("vip.vipImage")
                  )
              }
            )
          ]),
          row.vipImageSizeCheck
            ? h(
                "div",
                { class: "text-[var(--el-color-danger)] text-xs" },
                $t("vip.maxSizeKb")
              )
            : null
        ]);
      }
    },
    { label: $t("vip.name"), prop: "name", width: 120, cellRenderer: editableCell("name") },
    { label: $t("vip.upgradeBetAmount"), prop: "upgradeBetAmount", width: 120, cellRenderer: editableCell("upgradeBetAmount") },
    { label: $t("vip.upgradeRechargeAmount"), prop: "upgradeRechargeAmount", width: 120, cellRenderer: editableCell("upgradeRechargeAmount") },
    { label: $t("vip.effectiveFlowOfRelegation"), prop: "keepBetAmount", width: 120, cellRenderer: editableCell("keepBetAmount") },
    { label: $t("vip.cumulativeMaintenanceDeposits"), prop: "keepRechargeAmount", width: 120, cellRenderer: editableCell("keepRechargeAmount") },
    { label: $t("vip.upgradeGift"), prop: "upgradeGift", width: 120, cellRenderer: editableCell("upgradeGift") },
    { label: `${$t("vip.upgradeGift")}/${$t("vip.multiple")}`, prop: "upgradeGiftMultiple", width: 120, cellRenderer: editableCell("upgradeGiftMultiple") },
    { label: $t("vip.dailyGift"), prop: "dailyGift", width: 120, cellRenderer: editableCell("dailyGift") },
    { label: `${$t("vip.receivedDay")}/${$t("vip.rechargeMultiple")}`, prop: "dailyGiftRechargeMultiple", width: 120, cellRenderer: editableCell("dailyGiftRechargeMultiple") },
    { label: `${$t("vip.receivedDay")}/${$t("vip.turnoverMultiple")}`, prop: "dailyGiftBetMultiple", width: 120, cellRenderer: editableCell("dailyGiftBetMultiple") },
    { label: `${$t("vip.dailyGift")}/${$t("vip.multiple")}`, prop: "dailyGiftMultiple", width: 120, cellRenderer: editableCell("dailyGiftMultiple") },
    { label: $t("vip.weeklyGift"), prop: "weeklyGift", width: 120, cellRenderer: editableCell("weeklyGift") },
    { label: `${$t("vip.receivedWeekly")}/${$t("vip.rechargeMultiple")}`, prop: "weeklyGiftRechargeMultiple", width: 120, cellRenderer: editableCell("weeklyGiftRechargeMultiple") },
    { label: `${$t("vip.receivedWeekly")}/${$t("vip.turnoverMultiple")}`, prop: "weeklyGiftBetMultiple", width: 120, cellRenderer: editableCell("weeklyGiftBetMultiple") },
    { label: `${$t("vip.weeklyGift")}/${$t("vip.multiple")}`, prop: "weeklyGiftMultiple", width: 120, cellRenderer: editableCell("weeklyGiftMultiple") },
    { label: $t("vip.monthlyGift"), prop: "monthlyGift", width: 120, cellRenderer: editableCell("monthlyGift") },
    { label: `${$t("vip.receivedMonthly")}/${$t("vip.rechargeMultiple")}`, prop: "monthlyGiftRechargeMultiple", width: 120, cellRenderer: editableCell("monthlyGiftRechargeMultiple") },
    { label: `${$t("vip.receivedMonthly")}/${$t("vip.turnoverMultiple")}`, prop: "monthlyGiftBetMultiple", width: 120, cellRenderer: editableCell("monthlyGiftBetMultiple") },
    { label: `${$t("vip.monthlyGift")}/${$t("vip.multiple")}`, prop: "monthlyGiftMultiple", width: 120, cellRenderer: editableCell("monthlyGiftMultiple") },
    { label: $t("vip.bdGift"), prop: "birthdayGift", width: 120, cellRenderer: editableCell("birthdayGift") },
    { label: `${$t("vip.bdGift")}/${$t("vip.multiple")}`, prop: "birthdayGiftMultiple", width: 120, cellRenderer: editableCell("birthdayGiftMultiple") },
    { label: $t("vip.withdrawAmountLimit"), prop: "withdrawAmountLimit", width: 120, cellRenderer: editableCell("withdrawAmountLimit") },
    { label: $t("vip.withdrawTimesLimit"), prop: "withdrawTimesLimit", width: 120, cellRenderer: editableCell("withdrawTimesLimit") },
    { label: $t("vip.singleWithdrawAmountLimit"), prop: "singleWithdrawAmountLimit", width: 120, cellRenderer: editableCell("singleWithdrawAmountLimit") }
  ];

  /** 載入設定與等級列表 */
  async function getData() {
    loading.value = true;
    formDataDisabled.value = true;
    try {
      const { success, data } = await getConfigure();
      if (!success) return;
      const res = data as ConfigureResult;
      formData.value = { ...defaultConfig(), ...res };
      originalData.value = { ...defaultConfig(), ...res };
      const list = isArray(res?.levelList) ? res.levelList : [];
      dataLength.value = list.length;
      dataList.value = list;
    } finally {
      loading.value = false;
    }
  }

  /** 初始化建立 N 級 VIP */
  async function handleSubmitInit() {
    const { success } = await postConfigureLevelInit(initLevel.value);
    if (success) {
      message($t("vip.setting7"), { type: "success" });
      getData();
    }
  }

  /** 儲存設定區 */
  async function handleSubmitConfigure() {
    if (!formData.value.isKeep) {
      formData.value.vipKeep = 1;
      formData.value.vipKeepAging = 1;
      formData.value.vipDowngrade = 1;
    }
    const { success } = await postConfigure({ ...formData.value });
    if (success) {
      message($t("vip.setting7"), { type: "success" });
      getData();
    }
  }

  /** 取消編輯設定區 */
  function handleCancelConfigure() {
    formDataDisabled.value = true;
    formData.value = { ...originalData.value };
  }

  /** 儲存整張等級表 */
  async function handleSubmitTable() {
    const { success } = await putConfigureLevelEdit({ list: dataList.value });
    if (success) {
      message($t("vip.setting7"), { type: "success" });
      getData();
    }
  }

  /** 新增等級對話框 */
  function openEditDialog() {
    addDialog({
      title: $t("vip.editTitle"),
      props: { formInline: emptyForm() },
      width: "1000px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: dialogFormRef }),
      footerButtons: [
        {
          label: $t("vip.editOkBtn"),
          type: "default",
          btnClick: ({ dialog: { options, index } }) =>
            submitAddLevel(options, index, false)
        },
        {
          label: $t("vip.editOkText"),
          type: "primary",
          btnClick: ({ dialog: { options, index } }) =>
            submitAddLevel(options, index, true)
        }
      ]
    });
  }

  /** 送出新增等級；openReturn=true 時新增後另開反水設定頁 */
  function submitAddLevel(options: any, index: number, openReturn: boolean) {
    const FormRef = dialogFormRef.value.getRef();
    const curData = options.props.formInline as FormItemProps;
    FormRef.validate(async (valid: boolean) => {
      if (!valid) return;
      const { success } = await postConfigureLevelAdd({ ...curData });
      if (success) {
        message($t("vip.editTitle"), { type: "success" });
        // 關閉對話框
        closeDialog(options, index);
        getData();
        if (openReturn) {
          window.open("/vip/vipReturn", "_blank");
        }
      }
    });
  }

  onMounted(() => {
    getData();
  });

  return {
    loading,
    dataLength,
    goSetup,
    initLevel,
    formDataDisabled,
    formData,
    dataList,
    columns,
    vipKeepOptions,
    vipKeepAgingOptions,
    vipDowngradeOptions,
    customizedServiceOptions,
    giftDeadlineOptions,
    vipWeekOptions,
    vipMonthOptions,
    getData,
    handleSubmitInit,
    handleSubmitConfigure,
    handleCancelConfigure,
    handleSubmitTable,
    openEditDialog
  };
}
