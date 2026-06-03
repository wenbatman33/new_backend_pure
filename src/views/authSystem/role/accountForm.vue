<script setup lang="ts">
import { ref, onMounted } from "vue";
import { transformI18n as $t } from "@/plugins/i18n";
import { getRoleUsers } from "@/api/authSystem";

const props = defineProps<{
  record: { roleID: number; roleName: string };
}>();

const roleUsers = ref<{ adminID: number; account: string }[]>([]);

onMounted(async () => {
  const { data } = await getRoleUsers(props.record.roleID);
  roleUsers.value = data?.list ?? [];
});
</script>

<template>
  <el-card :header="props.record.roleName" shadow="never">
    <el-tag
      v-for="tag in roleUsers"
      :key="tag.adminID"
      class="mr-2 mb-2"
    >
      {{ tag.account }}
    </el-tag>
    <el-empty
      v-if="roleUsers.length === 0"
      :description="$t('authSystem.noData')"
    />
  </el-card>
</template>
