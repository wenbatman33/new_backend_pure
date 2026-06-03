import { h, ref, reactive } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import checkForm from "../form.vue";
import {
  getMemberDeviceGhostList,
  setMemberDeviceMultiAccount,
  getMemberDeviceRepeatList,
  setMemberDepositStatus,
  setMemberWithdrawStatus,
  setMemberLoginStatus
} from "@/api/member";
import type {
  GhostDevice,
  GhostMember,
  TagColorItem,
  RepeatDevice,
  CheckFormProps
} from "./types";

// 預設區間天數
const DEFAULT_INTERVAL = 90;

// 功能 key 對應顯示名稱
const checkMapping: Record<string, string> = {
  depositLimit: $t("member.deposit"),
  withdrawLimit: $t("member.withdrawal"),
  status: $t("member.login"),
  gameLogin: $t("member.game")
};

export function useMemberDeviceGhost() {
  const searchForm = reactive({
    memberName: "",
    deviceID: "",
    interval: DEFAULT_INTERVAL as number | string,
    isAccurate: false
  });

  const loading = ref(false);
  // 每個設備一組 GhostDevice，內含成員 list
  const deviceList = ref<GhostDevice[]>([]);
  // 展開的設備 deviceID 集合
  const activeNames = ref<string[]>([]);
  // 標籤群組顏色對照
  // TODO: 舊碼用 getTagGroup() 取標籤顏色（@/utils/dropdown 與 tag api 未移植），
  // 此處先以空陣列佔位，標籤顏色統一走預設色。
  const tagColor = ref<TagColorItem[]>([]);
  // 各設備已勾選的成員（key 為 deviceID）
  const selectedMap = reactive<Record<string, GhostMember[]>>({});

  // 會員表格欄位
  const memberColumns: TableColumnList = [
    { type: "selection", width: 50, align: "left" },
    { label: "ID", prop: "memberID", width: 80 },
    {
      label: $t("member.memberAccount"),
      prop: "account",
      width: 150,
      cellRenderer: ({ row }) => (
        <a
          href="javascript:void(0)"
          onClick={() => openURL(row)}
          style="color: var(--el-color-primary)"
        >
          {row.account}
        </a>
      )
    },
    { label: $t("member.name"), prop: "realName", width: 150 },
    { label: $t("member.agencyID"), prop: "agent", width: 120 },
    { label: $t("member.previousAgencyID"), prop: "agencyParent", width: 110 },
    {
      label: $t("member.registerIp"),
      prop: "registerIp",
      width: 150,
      cellRenderer: ({ row }) => (
        <div>
          <div>{row.registerIp}</div>
          <div>{row.registerArea}</div>
        </div>
      )
    },
    {
      label: $t("member.lastLoginIP"),
      prop: "loginIp",
      width: 150,
      cellRenderer: ({ row }) => (
        <div>
          <div>{row.loginIp}</div>
          <div>{row.lastLoginArea}</div>
        </div>
      )
    },
    { label: $t("member.createdAt"), prop: "registerDate", width: 170 },
    { label: $t("member.lastLoginAt2"), prop: "loginDate", width: 170 },
    {
      label: $t("member.tagWord"),
      prop: "tags",
      minWidth: 200,
      cellRenderer: ({ row }) => (
        <div>
          {(row.tags ?? []).map((tag: any) => (
            <el-tag key={tag.id} class="mr-1 mb-1" effect="plain">
              {tag.name}
              <br />
              {tag.updatedAt}
            </el-tag>
          ))}
        </div>
      )
    },
    {
      label: $t("member.operate"),
      fixed: "right",
      width: 320,
      slot: "operation"
    }
  ];

  // 最近可疑設備（重複設備）欄位
  const repeatColumns: TableColumnList = [
    {
      label: $t("member.deviceID"),
      prop: "deviceID",
      cellRenderer: ({ row }) => (
        <span style={`color: ${row.full ? "var(--el-color-info)" : "inherit"}`}>
          {row.deviceID}
        </span>
      )
    },
    { label: $t("member.totalMemberCount"), prop: "totalMemberCount" },
    {
      label: $t("member.lockedAccountsNumberOfPeople"),
      prop: "lockMemberCount"
    },
    {
      label: $t("member.numberOfTagsForMultipleAccounts"),
      prop: "multiAccountTag"
    },
    { label: $t("member.associatedAgentNumber"), prop: "relateAgent" }
  ];

  // 組搜尋參數
  function buildParams() {
    const params: Record<string, any> = {};
    if (searchForm.memberName) params.memberName = searchForm.memberName;
    if (searchForm.deviceID) params.deviceID = searchForm.deviceID;
    if (searchForm.interval) params.interval = Number(searchForm.interval);
    params.selectAmount = searchForm.isAccurate ? 1 : 2;
    return params;
  }

  async function onSearch() {
    if (
      (!searchForm.memberName && !searchForm.deviceID) ||
      searchForm.interval === "" ||
      searchForm.interval === undefined
    ) {
      message($t("member.pleaseEnterMemberOrDevice"), { type: "warning" });
      return;
    }
    loading.value = true;
    deviceList.value = [];
    try {
      const { data } = await getMemberDeviceGhostList(buildParams());
      const list = (data?.list ?? []) as GhostDevice[];
      deviceList.value = list;
      activeNames.value = list.map(item => item.deviceID);
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    searchForm.memberName = "";
    searchForm.deviceID = "";
    searchForm.interval = DEFAULT_INTERVAL;
    searchForm.isAccurate = false;
  }

  function openURL(row: GhostMember) {
    window.open("/memberDetail/detail/" + row.memberID);
  }

  // 全列表標記為多帳號
  async function remarkMulti() {
    const ids: number[] = [];
    deviceList.value.forEach(device => {
      (device.list ?? []).forEach(m => ids.push(m.memberID));
    });
    const memberIDs = [...new Set(ids)];
    if (memberIDs.length === 0) {
      message($t("member.thereAreNoUsersInTheList"), { type: "error" });
      return;
    }
    loading.value = true;
    try {
      const { success } = await setMemberDeviceMultiAccount({ memberIDs });
      if (success) {
        message($t("member.settingSuccess"), { type: "success" });
        onSearch();
      }
    } finally {
      loading.value = false;
    }
  }

  // 表格勾選變化
  function onSelectionChange(deviceID: string, rows: GhostMember[]) {
    selectedMap[deviceID] = rows;
  }

  // 開啟最近可疑設備對話框
  function openRepeatDialog() {
    const interval = ref(3);
    const repeatList = ref<RepeatDevice[]>([]);
    const repeatLoading = ref(false);

    const loadRepeat = async () => {
      repeatLoading.value = true;
      try {
        const { data } = await getMemberDeviceRepeatList({
          intervalDay: interval.value
        });
        repeatList.value = (data?.list ?? []) as RepeatDevice[];
      } finally {
        repeatLoading.value = false;
      }
    };
    loadRepeat();

    addDialog({
      title: $t("member.recentSuspiciousDevices"),
      width: "1000px",
      draggable: true,
      hideFooter: true,
      closeOnClickModal: false,
      contentRenderer: () => (
        <div>
          <el-radio-group
            modelValue={interval.value}
            onChange={(val: number) => {
              interval.value = val;
              loadRepeat();
            }}
            class="mb-3"
          >
            <el-radio-button label={3}>{`3${$t("member.day")}`}</el-radio-button>
            <el-radio-button label={30}>{`30${$t("member.day")}`}</el-radio-button>
          </el-radio-group>
          <pure-table
            border
            align-whole="center"
            row-key="deviceID"
            loading={repeatLoading.value}
            data={repeatList.value}
            columns={[
              ...repeatColumns,
              {
                label: $t("member.operate"),
                fixed: "right",
                width: 140,
                cellRenderer: ({ row }: { row: RepeatDevice }) => (
                  <el-button
                    link
                    type="primary"
                    onClick={() => {
                      searchForm.memberName = "";
                      searchForm.deviceID = row.deviceID;
                      onSearch();
                    }}
                  >
                    {$t("member.queryThisDevice")}
                  </el-button>
                )
              }
            ]}
          />
        </div>
      )
    });
  }

  // 開啟狀態切換確認對話框（存/提/登入）
  function openCheckDialog(row: GhostMember, type: string) {
    if (type === "gameLogin") {
      message($t("member.gameFunctionsAreNotYetAvailable"), { type: "warning" });
      return;
    }
    const formRef = ref();
    addDialog({
      title: $t("member.operationConfirmation"),
      width: "400px",
      draggable: true,
      closeOnClickModal: false,
      props: {
        formInline: {
          type,
          checkType: checkMapping[type] ?? "",
          memberName: row.account,
          memberID: row.memberID,
          status: (row as any)[type],
          comment: ""
        } as CheckFormProps
      },
      contentRenderer: () => h(checkForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as CheckFormProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const params = {
            memberIDs: [curData.memberID],
            status: curData.status === 1 ? 2 : 1,
            comment: curData.comment
          };
          let success = false;
          if (curData.type === "depositLimit") {
            ({ success } = await setMemberDepositStatus(params));
          } else if (curData.type === "withdrawLimit") {
            ({ success } = await setMemberWithdrawStatus(params));
          } else if (curData.type === "status") {
            ({ success } = await setMemberLoginStatus(params));
          }
          if (success) {
            message($t("member.settingSuccess"), { type: "success" });
            done();
            onSearch();
          }
        });
      }
    });
  }

  return {
    searchForm,
    loading,
    deviceList,
    activeNames,
    tagColor,
    selectedMap,
    memberColumns,
    onSearch,
    resetForm,
    remarkMulti,
    openURL,
    openRepeatDialog,
    openCheckDialog,
    onSelectionChange
  };
}
