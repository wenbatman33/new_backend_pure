<script setup lang="ts">
import { ref } from "vue";
import { replaceFormRules } from "./utils/rule";
import { transformI18n as $t } from "@/plugins/i18n";
import { message } from "@/utils/message";
import { searchReplaceDomain } from "@/api/systemManage";
import type { ReplaceFormItemProps } from "./utils/types";

const props = withDefaults(
  defineProps<{ formInline?: ReplaceFormItemProps }>(),
  {
    formInline: () => ({
      searchDomain: "",
      replaceDomain: "",
      searchPort: "",
      replacePort: "",
      matchType: 1
    })
  }
);

const matchTypeOptions = [
  { label: $t("systemManage.matchTypeFull"), value: 1 },
  { label: $t("systemManage.matchTypeMain"), value: 2 }
];

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const searchResult = ref<any[]>([]);

function getRef() {
  return ruleFormRef.value;
}
function getModel() {
  return newFormInline.value;
}

// 預覽搜尋
async function onPreview() {
  await ruleFormRef.value.validateField(
    ["searchDomain", "replaceDomain", "matchType"],
    async valid => {
      if (!valid) return;
      const { data } = await searchReplaceDomain({ ...newFormInline.value });
      const list = data?.list ?? [];
      if (list.length > 0) {
        searchResult.value = list;
      } else {
        searchResult.value = [];
        message($t("systemManage.noSearchResult"), { type: "error" });
      }
    }
  );
}

// 將命中文字以顏色標記
function domainHighlight(text: string, replace = false) {
  if (!text) return "";
  const searchDomain = replace
    ? newFormInline.value.replaceDomain
    : newFormInline.value.searchDomain;
  const searchPort = replace
    ? newFormInline.value.replacePort
    : newFormInline.value.searchPort;
  let html = text;
  if (searchDomain) {
    html = html.replaceAll(
      searchDomain,
      `<span style="color:#F00">${searchDomain}</span>`
    );
  }
  if (searchPort) {
    html = html.replaceAll(
      searchPort,
      `<span style="color:#3d40cb">${searchPort}</span>`
    );
  }
  return html;
}

defineExpose({ getRef, getModel });
</script>

<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="newFormInline"
      :rules="replaceFormRules"
      label-width="170px"
    >
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item
            :label="$t('systemManage.searchDomain')"
            prop="searchDomain"
          >
            <el-input v-model="newFormInline.searchDomain" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('systemManage.replaceTo')"
            prop="replaceDomain"
          >
            <el-input v-model="newFormInline.replaceDomain" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="port" prop="searchPort">
            <el-input v-model="newFormInline.searchPort" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('systemManage.replaceTo')" prop="replacePort">
            <el-input v-model="newFormInline.replacePort" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('systemManage.matchType')" prop="matchType">
            <el-select v-model="newFormInline.matchType" class="w-full">
              <el-option
                v-for="item in matchTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" @click="onPreview">
              {{ $t("systemManage.searchPreview") }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div v-if="searchResult.length > 0" class="mb-2">
      {{ $t("systemManage.totalCount") }}{{ searchResult.length
      }}{{ $t("systemManage.countUnit") }}
    </div>
    <el-table
      v-if="searchResult.length > 0"
      :data="searchResult"
      border
      max-height="300"
    >
      <el-table-column
        :label="$t('systemManage.platform')"
        prop="domainDisplayName"
        width="100"
      />
      <el-table-column
        :label="$t('systemManage.siteParam')"
        prop="domainName"
        width="100"
      />
      <el-table-column :label="$t('systemManage.originalUrl')">
        <template #default="{ row }">
          <p class="m-0" v-html="domainHighlight(row.domain)" />
        </template>
      </el-table-column>
      <el-table-column width="30">
        <template #default> → </template>
      </el-table-column>
      <el-table-column :label="$t('systemManage.afterReplace')">
        <template #default="{ row }">
          <p class="m-0" v-html="domainHighlight(row.replaceDomain, true)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
