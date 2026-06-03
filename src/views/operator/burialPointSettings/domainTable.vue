<script setup lang="ts">
import { h, ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { PureTableBar } from "@/components/RePureTableBar";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import domainForm from "./domainForm.vue";
import {
  getDomainSetting,
  postDomain,
  putDomain,
  delDomain
} from "@/api/operator";
import type { DomainFormItemProps } from "./utils/types";

import AddFill from "~icons/ri/add-circle-line";

defineOptions({ name: "BurialPointDomainTable" });

const loading = ref(true);
const dataList = ref<DomainFormItemProps[]>([]);
const formRef = ref();

const columns: TableColumnList = [
  { label: $t("operator.name"), prop: "displayName" },
  { label: $t("operator.domain"), prop: "domain" },
  { label: $t("operator.remark"), prop: "note" },
  { label: $t("operator.operate"), fixed: "right", width: 160, slot: "operation" }
];

async function onSearch() {
  loading.value = true;
  try {
    const { data } = await getDomainSetting();
    dataList.value = data?.children ?? [];
  } finally {
    loading.value = false;
  }
}

function openDialog(mode: "add" | "edit", row?: DomainFormItemProps) {
  const isAdd = mode === "add";
  const title =
    (isAdd ? $t("operator.add") : $t("operator.edit")) + $t("operator.domain");
  addDialog({
    title,
    props: {
      formInline: {
        id: row?.id,
        displayName: row?.displayName ?? "",
        domain: row?.domain ?? "",
        note: row?.note ?? ""
      }
    },
    width: "400px",
    draggable: true,
    closeOnClickModal: false,
    contentRenderer: () => h(domainForm, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const FormRef = formRef.value.getRef();
      const curData = options.props.formInline as DomainFormItemProps;
      FormRef.validate(async valid => {
        if (!valid) return;
        // 旧版固定带 groupID=1 与 name=siteUrl
        const payload = {
          displayName: curData.displayName,
          domain: curData.domain,
          note: curData.note,
          groupID: 1,
          name: "siteUrl"
        };
        const { success } = isAdd
          ? await postDomain(payload)
          : await putDomain({ ...payload, id: curData.id });
        if (success) {
          message($t("operator.editSuccess"), { type: "success" });
          done();
          onSearch();
        }
      });
    }
  });
}

// 旧版删除带 10 秒倒数确认，这里用二次确认对话框替代
function handleDelete(row: DomainFormItemProps) {
  ElMessageBox.confirm(
    $t("operator.confirmDeleteDomain", { domain: row.displayName }),
    $t("operator.delete") + $t("operator.domain"),
    { type: "warning" }
  )
    .then(async () => {
      const { success } = await delDomain({ id: row.id });
      if (success) {
        message($t("operator.deleteSuccess"), { type: "success" });
        onSearch();
      }
    })
    .catch(() => {});
}

onMounted(() => {
  onSearch();
});

defineExpose({ onSearch });
</script>

<template>
  <div>
    <PureTableBar
      :title="$t('operator.domainSetting')"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          v-if="hasAuth('__btn_system_management_add_domain')"
          type="primary"
          :icon="AddFill"
          @click="openDialog('add')"
        >
          {{ $t("operator.addDomain") }}
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('__btn_system_management_edit_onlydomain')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="openDialog('edit', row)"
            >
              {{ $t("operator.edit") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_system_management_del_demain')"
              class="reset-margin"
              link
              type="danger"
              :size="size"
              @click="handleDelete(row)"
            >
              {{ $t("operator.delete") }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
