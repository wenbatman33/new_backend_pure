import { h, ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { transformI18n as $t } from "@/plugins/i18n";
import { getImagPath } from "@/utils/imgUrl";
import editForm from "../form.vue";
import {
  getSocialConfig,
  putSocialConfig,
  publishSocial
} from "@/api/operator";
import type { SocialItem, SocialType, FormItemProps } from "./types";

const imagePath = getImagPath();

/** 開啟方式對應 */
const openWayMap: Record<number, string> = {
  1: $t("operator.anotherOpenWay"),
  2: $t("operator.iframe"),
  3: "Livechat chatbot",
  4: "tawk.to chatbot"
};

/** 產生 client 端唯一 id（取代舊碼 uuid 相依） */
function genId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function useSocialSetting() {
  const loading = ref(true);
  const memberList = ref<SocialItem[]>([]);
  const agentList = ref<SocialItem[]>([]);
  const formRef = ref();

  const openWayOptions = [
    { label: $t("operator.anotherOpenWay"), value: 1 },
    { label: $t("operator.iframe"), value: 2 },
    { label: "Livechat chatbot", value: 3 },
    { label: "tawk.to chatbot", value: 4 }
  ];

  /** 建立 columns，type 用來控制 subtitle 欄位是否顯示 */
  function buildColumns(type: SocialType): TableColumnList {
    const cols: TableColumnList = [
      { label: $t("operator.order"), prop: "order", width: 90 },
      {
        label: $t("operator.icon"),
        prop: "iconUrl",
        cellRenderer: ({ row }) =>
          row.iconUrl
            ? h("img", {
                src: imagePath + row.iconUrl,
                style: "height:24px;margin:auto;display:block"
              })
            : h("span", "-")
      },
      { label: $t("operator.name"), prop: "name" }
    ];
    if (type === "member") {
      cols.push({ label: $t("operator.subtitle"), prop: "subtitle" });
    }
    cols.push(
      {
        label: $t("operator.openWay"),
        prop: "openWay",
        cellRenderer: ({ row }) => (
          <span>{openWayMap[row.openWay] ?? row.openWay}</span>
        )
      },
      { label: $t("operator.link"), prop: "link", showOverflowTooltip: true },
      { label: $t("operator.license"), prop: "license" },
      { label: $t("operator.group"), prop: "group" },
      {
        label: $t("operator.show"),
        prop: "show",
        cellRenderer: ({ row }) => (
          <span>
            {row.show === 1 ? $t("operator.statusShow") : $t("operator.statusHidden")}
          </span>
        )
      },
      { label: $t("operator.operation"), fixed: "right", width: 160, slot: "operation" }
    );
    return cols;
  }

  const memberColumns = buildColumns("member");
  const agentColumns = buildColumns("agent");

  /** 取得設定並補上 client 端 id */
  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getSocialConfig();
      const normalize = (arr: SocialItem[] = []) =>
        arr.map(item => ({
          ...item,
          id: genId(),
          license: item.license ? item.license : ""
        }));
      memberList.value = normalize(data?.member);
      agentList.value = normalize(data?.agent);
    } finally {
      loading.value = false;
    }
  }

  /** 將兩張表整包送回後端後重新拉取 */
  async function saveAll() {
    const { success } = await putSocialConfig({
      member: memberList.value,
      agent: agentList.value
    });
    if (success) {
      await onSearch();
    }
  }

  function openDialog(type: SocialType, row?: SocialItem) {
    const isEdit = !!row;
    const formInline: FormItemProps = isEdit
      ? { ...(row as SocialItem) }
      : {
          id: genId(),
          order: "",
          iconUrl: "",
          name: "",
          subtitle: "",
          openWay: 1,
          link: "",
          license: "",
          group: "",
          show: 2
        };
    addDialog({
      title: isEdit ? $t("operator.editSocial") : $t("operator.addSocial"),
      props: { formInline, socialType: type },
      width: "500px",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(async (valid: boolean) => {
          if (!valid) return;
          const targetList = type === "member" ? memberList : agentList;
          if (isEdit) {
            const idx = targetList.value.findIndex(v => v.id === curData.id);
            if (idx > -1) targetList.value.splice(idx, 1, { ...curData });
          } else {
            targetList.value.push({ ...curData });
          }
          await saveAll();
          message(
            isEdit ? $t("operator.editSocial") : $t("operator.addSocial"),
            { type: "success" }
          );
          done();
        });
      }
    });
  }

  async function handleDelete(type: SocialType, row: SocialItem) {
    const targetList = type === "member" ? memberList : agentList;
    const idx = targetList.value.findIndex(v => v.id === row.id);
    if (idx > -1) targetList.value.splice(idx, 1);
    await saveAll();
    message($t("operator.delete"), { type: "success" });
  }

  /** 發佈到前台 */
  async function handlePublish() {
    const { success } = await publishSocial();
    if (success) {
      message($t("operator.publish"), { type: "success" });
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    memberList,
    agentList,
    memberColumns,
    agentColumns,
    openWayOptions,
    onSearch,
    openDialog,
    handleDelete,
    handlePublish
  };
}
