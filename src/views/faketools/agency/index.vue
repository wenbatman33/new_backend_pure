<script setup lang="ts">
import { useAgency } from "./utils/hook";
import { transformI18n as $t } from "@/plugins/i18n";

defineOptions({ name: "FaketoolsAgency" });

const {
  gameGroup,
  bulkAgencyParams,
  bulkAgencySuccess,
  agencyAccounts,
  bulkAgencyLoading,
  bulkMemberParams,
  bulkMemberLoading,
  agencyParams,
  agencyLogSuccess,
  agencyLogFakeRes,
  agencyLogLoading,
  updateDate,
  reportLoading,
  handleSelectChange,
  bulkAgencyHandleOK,
  bulkMemberHandleOK,
  agencyLogHandleOK,
  updateAgencyReport
} = useAgency();

// 總金額顯示
function totalAmount(cnt?: number, amount?: number) {
  return ((cnt || 0) * (amount || 0)).toLocaleString();
}
</script>

<template>
  <div class="main flex flex-col gap-4">
    <!-- 卡片一：新增代理會員 -->
    <el-card shadow="never">
      <p class="text-xl mb-4">{{ $t("faketools.addAgencyMember") }}</p>
      <div class="bg-[var(--el-fill-color-light)] p-4 rounded mb-4">
        <p>{{ $t("faketools.agencyHelpInput") }}</p>
        <p>{{ $t("faketools.agencyHelpExample") }}</p>
        <p>{{ $t("faketools.agencyHelpPassword") }}</p>
      </div>
      <div class="flex flex-wrap gap-5 mb-5">
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.accountPrefix") }}</span>
          <el-input v-model="bulkAgencyParams.accountPrefix" class="!w-[100px]" />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.startNumber") }}</span>
          <el-input
            v-model.number="bulkAgencyParams.startNumber"
            class="!w-[100px]"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.endNumber") }}</span>
          <el-input
            v-model.number="bulkAgencyParams.endNumber"
            class="!w-[100px]"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.regDate") }}</span>
          <el-date-picker
            v-model="bulkAgencyParams.regDate"
            type="datetime"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :placeholder="$t('faketools.selectDateTime')"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.childAgencyCnt") }}</span>
          <el-input
            v-model.number="bulkAgencyParams.childAgencyCnt"
            class="!w-[100px]"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.memberCnt") }}</span>
          <el-input
            v-model.number="bulkAgencyParams.memberCnt"
            class="!w-[100px]"
          />
        </div>
      </div>

      <!-- 顯示新增成功的資料 -->
      <div
        v-if="bulkAgencySuccess"
        class="border border-[var(--el-border-color)] rounded p-3 mb-4 overflow-y-auto"
        style="width: 900px; height: 180px"
      >
        <div class="grid grid-cols-4">
          <div class="col-span-1">
            <p>ID:</p>
            <p v-for="item in agencyAccounts.list" :key="item.agency_id">
              {{ item.agency_id }}
            </p>
          </div>
          <div class="col-span-1">
            <p>{{ $t("faketools.account") }}:</p>
            <p v-for="item in agencyAccounts.list" :key="item.agency_account">
              {{ item.agency_account }}
            </p>
          </div>
          <div class="col-span-2 flex gap-5">
            <p v-if="agencyAccounts.regDate">
              {{ $t("faketools.regDate") }}: {{ agencyAccounts.regDate }}
            </p>
            <p v-if="agencyAccounts.memberCnt">
              {{ $t("faketools.memberCnt") }}: {{ agencyAccounts.memberCnt }}
            </p>
            <p v-if="agencyAccounts.childAgencyCnt">
              {{ $t("faketools.childAgencyCnt") }}:
              {{ agencyAccounts.childAgencyCnt }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <el-button
          type="primary"
          :loading="bulkAgencyLoading"
          @click="bulkAgencyHandleOK"
        >
          {{ $t("faketools.createAgencyAccount") }}
        </el-button>
      </div>
    </el-card>

    <!-- 卡片二：新增代理直屬會員 -->
    <el-card shadow="never">
      <p class="text-xl mb-4">{{ $t("faketools.addAgencyDirectMember") }}</p>
      <div class="flex flex-wrap gap-5 mb-5">
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.agencyID") }}</span>
          <el-input
            v-model.number="bulkMemberParams.agencyID"
            class="!w-[100px]"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.memberAccountPrefix") }}</span>
          <el-input
            v-model="bulkMemberParams.accountPrefix"
            class="!w-[100px]"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.startNumber") }}</span>
          <el-input
            v-model.number="bulkMemberParams.startNumber"
            class="!w-[100px]"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.endNumber") }}</span>
          <el-input
            v-model.number="bulkMemberParams.endNumber"
            class="!w-[100px]"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.regDate") }}</span>
          <el-date-picker
            v-model="bulkMemberParams.regDate"
            type="datetime"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :placeholder="$t('faketools.selectDateTime')"
          />
        </div>
      </div>
      <div class="flex justify-end">
        <el-button
          type="primary"
          :loading="bulkMemberLoading"
          @click="bulkMemberHandleOK"
        >
          {{ $t("faketools.createMemberAccount") }}
        </el-button>
      </div>
    </el-card>

    <!-- 卡片三：新增代理直屬會員的存款單與流水 -->
    <el-card shadow="never">
      <p class="text-xl mb-4">{{ $t("faketools.addDepositAndLog") }}</p>
      <!-- TODO: 舊碼有「下載範例檔/匯入檔案」(ImpExcel)，@/components/Excel 未移植，暫移除，待補 -->
      <div class="flex flex-wrap gap-5 mb-5">
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.agencyIDsComma") }}</span>
          <el-input v-model="agencyParams.agencyIDs" class="!w-[150px]" />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.memberCnt") }}</span>
          <el-input v-model.number="agencyParams.memberCnt" class="!w-[100px]" />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.depositAmount") }}</span>
          <el-input
            v-model.number="agencyParams.depositAmount"
            class="!w-[100px]"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.bettingAmount") }}</span>
          <el-input
            v-model.number="agencyParams.bettingAmount"
            class="!w-[100px]"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.gameAgency") }}</span>
          <el-select
            class="!w-[200px]"
            filterable
            clearable
            :placeholder="$t('faketools.selectGame')"
            @change="handleSelectChange"
          >
            <el-option
              v-for="item in gameGroup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="flex items-center gap-2">
          <span>{{ $t("faketools.date") }}</span>
          <el-tooltip
            placement="top-start"
            :content="$t('faketools.dateMustGtRegDate')"
          >
            <span
              class="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs"
              style="color: #ff647c; border: 1px solid #ff647c"
              >!</span
            >
          </el-tooltip>
          <el-date-picker
            v-model="agencyParams.date"
            type="datetime"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :placeholder="$t('faketools.selectDateTime')"
          />
        </div>
      </div>

      <!-- 顯示新增成功的資料 -->
      <div
        v-if="agencyLogSuccess"
        class="border border-[var(--el-border-color)] rounded p-3 mb-4 overflow-y-auto grid grid-cols-4"
        style="width: 900px; height: 180px"
      >
        <div class="flex flex-col w-full">
          <p>{{ $t("faketools.agencyAccount") }}:</p>
          <p v-for="item in agencyLogFakeRes.agencyIDs?.split(',')" :key="item">
            {{ item }}
          </p>
        </div>
        <div class="col-span-3 flex flex-wrap gap-3">
          <p>{{ $t("faketools.gameAgency") }}: {{ agencyLogFakeRes.gameAgency }}</p>
          <p>{{ $t("faketools.memberCnt") }}: {{ agencyLogFakeRes.memberCnt }}</p>
          <p>
            {{ $t("faketools.totalDeposit") }}:
            {{
              totalAmount(
                agencyLogFakeRes.memberCnt,
                agencyLogFakeRes.depositAmount
              )
            }}
          </p>
          <p>
            {{ $t("faketools.totalBetting") }}:
            {{
              totalAmount(
                agencyLogFakeRes.memberCnt,
                agencyLogFakeRes.bettingAmount
              )
            }}
          </p>
          <p>{{ $t("faketools.date") }}: {{ agencyLogFakeRes.date }}</p>
        </div>
      </div>

      <div class="flex justify-end">
        <el-button
          type="primary"
          :loading="agencyLogLoading"
          @click="agencyLogHandleOK"
        >
          {{ $t("faketools.createDepositAndLog") }}
        </el-button>
      </div>
    </el-card>

    <!-- 卡片四：更新代理報表 -->
    <el-card shadow="never">
      <p class="text-xl mb-4">{{ $t("faketools.updateAgencyReport") }}</p>
      <div class="flex items-center gap-3">
        <el-date-picker
          v-model="updateDate.startTime"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :placeholder="$t('faketools.selectStartDate')"
        />
        <span>~</span>
        <el-date-picker
          v-model="updateDate.endTime"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :placeholder="$t('faketools.selectEndDate')"
        />
        <el-button
          type="primary"
          :loading="reportLoading"
          @click="updateAgencyReport"
        >
          {{ $t("faketools.updateAgencyReport") }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>
