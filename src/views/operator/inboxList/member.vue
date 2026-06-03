<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getLetterMember } from "@/api/operator";
import type { LetterMemberItem } from "./utils/types";

const props = defineProps<{ letterSettingId: number }>();

const account = ref("");
const members = ref<LetterMemberItem[]>([]);
const loading = ref(true);

// 依帳號關鍵字過濾
const filterMembers = computed(() => {
  if (!account.value) return members.value;
  return members.value.filter(item =>
    item.memberAccount.includes(account.value)
  );
});

async function fetchData() {
  loading.value = true;
  try {
    const { data } = await getLetterMember({
      letterSettingId: props.letterSettingId
    });
    members.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <div>
    <el-input
      v-model="account"
      clearable
      class="mb-3"
      :placeholder="$t('operator.plzInputMemberAccount')"
    />
    <el-table v-loading="loading" :data="filterMembers" border max-height="400">
      <el-table-column type="index" width="60" />
      <el-table-column
        :label="$t('operator.memberAccount')"
        prop="memberAccount"
        min-width="150"
      />
      <el-table-column :label="$t('operator.sendTime')" prop="sendAt" min-width="160" />
      <el-table-column :label="$t('operator.status')" prop="status" width="100" />
    </el-table>
  </div>
</template>
