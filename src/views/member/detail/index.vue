<script setup lang="ts">
import { useMemberDetail } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";
import { changeRedColorForNegative } from "@/utils/number";

defineOptions({ name: "MemberDetail" });

const {
  loading,
  userDetail,
  walletData,
  luckMoneyData,
  tags,
  tagColor,
  comments,
  luckMoneyExpanded,
  searchAccount,
  searchID,
  memberDetailSchema,
  walletTotalSchema,
  luckMoneySchema,
  hasAuth,
  searchMember,
  searchMemberID,
  handleRemoveWithdrawalPassword,
  handleRecoverZombie,
  handleCloseMember,
  handleClearRealName,
  openWalletLog,
  openActionLog
} = useMemberDetail();

// 取得標籤顏色
function tagColorOf(groupID: number) {
  return tagColor.value.find((g: any) => g.id === groupID)?.color || "";
}

// 是否殭屍帳號
function isZombie(account?: string) {
  return !!account && account.includes("deletezombie_");
}
</script>

<template>
  <div class="main" v-loading="loading">
    <!-- 搜尋會員列 + 操作按鈕 -->
    <el-card shadow="never" class="mb-2">
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <el-input
            v-model="searchAccount"
            class="!w-[180px]"
            clearable
            @keyup.enter="searchMember"
          />
          <el-button type="primary" @click="searchMember">
            {{ $t("member.searchMember") }}
          </el-button>
        </div>
        <div class="flex items-center gap-2">
          <el-input
            v-model="searchID"
            class="!w-[180px]"
            clearable
            @keyup.enter="searchMemberID"
          />
          <el-button type="primary" @click="searchMemberID">
            {{ $t("member.searchMemberID") }}
          </el-button>
        </div>

        <div class="flex-1" />

        <el-button @click="openActionLog(userDetail.account)">
          {{ $t("member.handleRecord") }}
        </el-button>
        <el-button @click="openWalletLog">
          {{ $t("member.walletLog") }}
        </el-button>
        <el-button @click="handleRemoveWithdrawalPassword">
          {{ $t("member.handleRemoveWithdrawalPassword") }}
        </el-button>
      </div>
    </el-card>

    <!-- 會員主資料 -->
    <el-card shadow="never" class="mb-2">
      <template #header>
        <span class="font-medium">{{ $t("member.menuDetail") }}</span>
      </template>
      <el-descriptions :column="4" border>
        <el-descriptions-item
          v-for="item in memberDetailSchema"
          :key="item.field"
          :label="item.label"
          :span="item.span || 1"
        >
          <!-- 帳號：殭屍 / 關閉操作 -->
          <template v-if="item.field === 'account'">
            <span>{{ userDetail.account }}</span>
            <el-button
              v-if="hasAuth('__btn_member_deletezombie') && isZombie(userDetail.account)"
              class="ml-2"
              size="small"
              type="primary"
              @click="handleRecoverZombie(userDetail.account)"
            >
              {{ $t("member.memberRecover") }}
            </el-button>
            <el-button
              v-if="hasAuth('__btn_member_closed')"
              class="ml-2"
              size="small"
              type="primary"
              @click="handleCloseMember(userDetail.account)"
            >
              {{ $t("member.memberClosed") }}
            </el-button>
          </template>
          <!-- 姓名：清除真實姓名 -->
          <template v-else-if="item.field === 'name'">
            <span>{{ userDetail.name }}</span>
            <el-button
              v-if="hasAuth('__btn_clear_member_realname') && userDetail.name"
              class="ml-2"
              size="small"
              type="primary"
              @click="handleClearRealName"
            >
              {{ $t("member.clearRealName") }}
            </el-button>
          </template>
          <template v-else>
            {{ userDetail[item.field] }}
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-row :gutter="12">
      <!-- 左側：標籤 + 備註 -->
      <el-col :xl="10" :lg="24">
        <el-card shadow="never" class="mb-2" style="background: #fff2f2">
          <template #header>{{ $t("member.tag") }}</template>
          <el-table :data="tags" border size="small">
            <el-table-column :label="$t('member.tagWord')" prop="name">
              <template #default="{ row }">
                <el-tag :color="tagColorOf(row.tagGroupID)" effect="dark">
                  {{ row.name }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('member.updatedAt')" prop="updatedAt" />
          </el-table>
        </el-card>

        <el-card shadow="never" class="mb-2" style="background: #cbe6ff">
          <template #header>{{ $t("member.memberComments") }}</template>
          <el-collapse>
            <el-collapse-item
              v-for="comment in comments"
              :key="comment.id"
              :title="comment.title"
              :name="comment.id"
            >
              <p>{{ comment.content }}</p>
              <p class="text-right text-gray-400">
                {{ comment.updatedAt || comment.createdAt }} —
                By：{{ comment.updator || comment.creator }}
              </p>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>

      <!-- 右側：錢包資料 -->
      <el-col :xl="14" :lg="24">
        <el-card shadow="never" class="mb-2" style="background: #b4e3c9">
          <template #header>{{ $t("member.walletData") }}</template>
          <el-descriptions :column="5" border>
            <el-descriptions-item
              v-for="item in walletTotalSchema"
              :key="item.field"
              :label="item.label"
              :span="item.span || 1"
            >
              <span v-html="changeRedColorForNegative(walletData[item.field])" />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 新幣錢包資料（可收合） -->
        <el-card shadow="never" class="mb-2" style="background: #b4e3c9">
          <template #header>
            <div
              class="flex items-center justify-between cursor-pointer"
              @click="luckMoneyExpanded = !luckMoneyExpanded"
            >
              <span class="font-medium">{{ $t("member.luckMoneySection") }}</span>
              <span>{{ luckMoneyExpanded ? "▲" : "▼" }}</span>
            </div>
          </template>
          <el-descriptions v-if="luckMoneyExpanded" :column="4" border>
            <el-descriptions-item
              v-for="item in luckMoneySchema"
              :key="item.field"
              :label="item.label"
            >
              <span v-html="changeRedColorForNegative(luckMoneyData[item.field])" />
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.main {
  :deep(.el-card__header) {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
