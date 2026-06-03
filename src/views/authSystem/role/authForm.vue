<script setup lang="ts">
import { reactive, computed, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getRawFnList, getRoleFns } from "@/api/authSystem";

interface FnType {
  fnID: number;
  fnKey: string;
  fnName: string;
  parentID: number;
}

const props = defineProps<{
  /** 角色資料 */
  record: { roleID: number; roleName: string };
  /** authList（功能權限）或 menuList（選單） */
  type: "authList" | "menuList";
}>();

const state = reactive({
  searchText: "",
  authList: [] as FnType[],
  menuList: [] as FnType[],
  roleAuthList: [] as FnType[],
  roleMenuList: [] as FnType[],
  parentAuth: [] as FnType[],
  childAuth: [] as FnType[],
  checkedChildren: [] as number[],
  // 父層 parentID 為 0，預設 -2 避免一開啟就顯示父層
  selectedParent: -2
});

onMounted(async () => {
  const { data } = await getRawFnList(1000);
  const sortedFns: FnType[] = (data?.list?.all ?? []).sort((a, b) =>
    a.fnName > b.fnName ? 1 : -1
  );
  state.authList = sortedFns.filter(item => item.fnKey.indexOf("__menu") !== 0);
  state.menuList = sortedFns.filter(item => item.fnKey.indexOf("__menu") === 0);

  const res = await getRoleFns(props.record.roleID);
  const roleFns: FnType[] = res.data?.list ?? [];
  state.checkedChildren = roleFns.map(item => item.fnID);
  state.parentAuth = state[props.type].filter(item => item.parentID === 0);
  state.childAuth = state[props.type];
  state.roleAuthList = roleFns.filter(item => item.fnKey.indexOf("__menu") !== 0);
  state.roleMenuList = roleFns.filter(item => item.fnKey.indexOf("__menu") === 0);
});

const filteredParent = computed(() => {
  let filtered = state.parentAuth;
  if (state.searchText !== "") {
    filtered = state.parentAuth.filter(
      item =>
        item.fnName.includes(state.searchText) ||
        item.fnKey.includes(state.searchText)
    );
  }
  const all = { fnID: -1, fnName: $t("authSystem.all"), fnKey: "all", parentID: 0 };
  return [all, ...filtered];
});

const filteredChildren = computed(() => {
  let filtered = state.childAuth;
  if (state.selectedParent !== -1) {
    filtered = state.childAuth.filter(
      item => item.parentID === state.selectedParent
    );
    const parent = state.parentAuth.find(
      item => item.fnID === state.selectedParent
    );
    if (parent) filtered = [parent, ...filtered];
  } else {
    filtered = state.childAuth;
  }
  if (state.searchText !== "") {
    filtered = state.childAuth.filter(
      item =>
        item.fnName.includes(state.searchText) ||
        item.fnKey.includes(state.searchText)
    );
  }
  return filtered;
});

function chooseParent(record: FnType) {
  state.selectedParent = record.fnID;
}

function showChildCondition(item: FnType) {
  return filteredChildren.value.some(c => c.fnID === item.fnID);
}

function selectAll(checked: boolean) {
  const all = state.checkedChildren;
  const filterCheck = filteredChildren.value.map(item => item.fnID);
  if (checked) {
    state.checkedChildren = [...new Set(all.concat(filterCheck))];
  } else {
    state.checkedChildren = all.filter(item => !filterCheck.includes(item));
  }
}

/** 提交時：把另一類別（未顯示）的權限與目前勾選合併後送出 */
function getSubmitFnIDs() {
  const noShow = props.type === "authList" ? state.roleMenuList : state.roleAuthList;
  const noShowFns = noShow.map(item => item.fnID);
  return noShowFns.concat(state.checkedChildren);
}

defineExpose({ getSubmitFnIDs });
</script>

<template>
  <div>
    <el-row class="mb-4" :gutter="20">
      <el-col :span="8">
        <el-input
          v-model="state.searchText"
          clearable
          :placeholder="$t('authSystem.searchPermissions')"
        />
      </el-col>
      <el-col :span="16" class="text-right">
        <el-button type="primary" @click="selectAll(true)">
          {{ $t("authSystem.selectAll") }}
        </el-button>
        <el-button @click="selectAll(false)">
          {{ $t("authSystem.unselectAll") }}
        </el-button>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="10">
        <div class="auth-list">
          <div
            v-for="item in filteredParent"
            :key="item.fnID"
            class="auth-list-item"
            :class="{ active: item.fnID === state.selectedParent }"
            @click="chooseParent(item)"
          >
            {{ item.fnName }} | {{ item.fnKey }}
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="auth-list">
          <el-checkbox-group v-model="state.checkedChildren">
            <template v-for="item in state.childAuth" :key="item.fnID">
              <el-checkbox
                v-show="showChildCondition(item)"
                class="block"
                :value="item.fnID"
              >
                {{ item.fnName + " | " + item.fnKey }}
              </el-checkbox>
            </template>
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.auth-list {
  height: 460px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.auth-list-item {
  padding: 6px 10px;
  cursor: pointer;

  &.active,
  &:hover {
    color: #fff;
    background-color: var(--el-color-primary);
  }
}
</style>
