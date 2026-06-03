<script setup lang="ts">
import { ref } from "vue";
import { useTeam } from "./utils/hook";
import { hasAuth } from "@/router/utils";
import { transformI18n as $t } from "@/plugins/i18n";
import { commaDecimalFormat } from "@/utils/number";
import Search from "~icons/ep/search";
import Download from "~icons/ep/download";

defineOptions({ name: "AgencyTeam" });

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  tableData,
  teamAgencyCount,
  onSearch,
  resetForm,
  handleExport
} = useTeam();
</script>

<template>
  <div class="main">
    <!-- 搜尋區 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item :label="$t('agency.teamSearchForm1')" prop="agencyID">
        <el-input
          v-model="searchForm.agencyID"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.teamSearchForm2')" prop="agencyAccount">
        <el-input
          v-model="searchForm.agencyAccount"
          clearable
          class="!w-[160px]"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.teamStartDate')" prop="startDate">
        <el-date-picker
          v-model="searchForm.startDate"
          type="date"
          value-format="YYYY-MM-DD"
          clearable
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item :label="$t('agency.teamEndDate')" prop="endDate">
        <el-date-picker
          v-model="searchForm.endDate"
          type="date"
          value-format="YYYY-MM-DD"
          clearable
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          :loading="loading"
          @click="onSearch"
        >
          {{ $t("agency.teamQuery") }}
        </el-button>
        <el-button @click="resetForm(formRef)">
          {{ $t("agency.teamReset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 報表區 -->
    <div v-loading="loading" class="report-block bg-bg_color mt-2">
      <div v-if="tableData.length > 0" class="flex justify-end mb-3">
        <el-button
          v-if="hasAuth('__btn_agency_team_report_export')"
          type="primary"
          :icon="Download"
          @click="handleExport"
        >
          {{ $t("agency.teamExportExcel") }}
        </el-button>
      </div>

      <table v-if="tableData.length > 0" class="team-table">
        <!-- header -->
        <tr class="head-row">
          <th colspan="2">{{ $t("agency.teamColumn1") }} {{ teamAgencyCount }}</th>
          <th v-for="item in columns" :key="item.key">
            <div class="flex items-center justify-center">
              {{ item.title }}
              <el-tooltip
                v-if="item.helpMsg"
                placement="top"
                effect="dark"
              >
                <template #content>
                  <div v-for="(msg, idx) in item.helpMsg" :key="idx">
                    {{ msg }}
                  </div>
                </template>
                <el-icon class="ml-1 cursor-pointer"><Search /></el-icon>
              </el-tooltip>
            </div>
          </th>
        </tr>

        <!-- 用戶 -->
        <tr class="block-user">
          <td rowspan="3" class="center">{{ $t("agency.teamRow1") }}</td>
          <td class="center">{{ $t("agency.teamRowA") }}</td>
          <td v-for="n in 7" :key="n">
            {{ commaDecimalFormat(tableData[n - 1]["loginMemberCount"], 0) }}
          </td>
        </tr>
        <tr class="block-user">
          <td class="center">{{ $t("agency.teamRowB") }}</td>
          <td v-for="n in 7" :key="n">
            {{ commaDecimalFormat(tableData[n - 1]["registerMemberCount"], 0) }}
          </td>
        </tr>
        <tr class="block-user">
          <td class="center">{{ $t("agency.teamRowC") }}</td>
          <td v-for="n in 7" :key="n">
            {{
              commaDecimalFormat(tableData[n - 1]["firstDepositMemberCount"], 0)
            }}
          </td>
        </tr>

        <!-- 紅利 -->
        <tr class="block-bonus">
          <td rowspan="2" class="center">{{ $t("agency.teamRow2") }}</td>
          <td class="center">{{ $t("agency.teamRowD") }}</td>
          <td v-for="n in 7" :key="n">
            {{ commaDecimalFormat(tableData[n - 1]["totalBonus"], 2) }}
          </td>
        </tr>
        <tr class="block-bonus">
          <td class="center">{{ $t("agency.teamRowE") }}</td>
          <td v-for="n in 7" :key="n">
            {{ commaDecimalFormat(tableData[n - 1]["totalBonusMemberCount"], 0) }}
          </td>
        </tr>

        <!-- 投注 -->
        <tr class="block-bet">
          <td rowspan="3" class="center">{{ $t("agency.teamRow3") }}</td>
          <td class="center">{{ $t("agency.teamRowF") }}</td>
          <td v-for="n in 7" :key="n">
            {{ commaDecimalFormat(tableData[n - 1]["betAmount"], 2) }}
          </td>
        </tr>
        <tr class="block-bet">
          <td class="center">{{ $t("agency.teamRowG") }}</td>
          <td
            v-for="n in 7"
            :key="n"
            :class="
              tableData[n - 1]['winAmount'] >= 0 ? 'text-green' : 'text-red'
            "
          >
            {{ commaDecimalFormat(tableData[n - 1]["winAmount"], 2) }}
          </td>
        </tr>
        <tr class="block-bet">
          <td class="center">{{ $t("agency.teamRowH") }}</td>
          <td v-for="n in 7" :key="n">
            {{ commaDecimalFormat(tableData[n - 1]["betMemberCount"], 0) }}
          </td>
        </tr>

        <!-- 存款 -->
        <tr class="block-deposit">
          <td rowspan="2" class="center">{{ $t("agency.teamRow4") }}</td>
          <td class="center">{{ $t("agency.teamRowD") }}</td>
          <td v-for="n in 7" :key="n">
            {{ commaDecimalFormat(tableData[n - 1]["rechargeAmount"], 2) }}
          </td>
        </tr>
        <tr class="block-deposit">
          <td class="center">{{ $t("agency.teamRowE") }}</td>
          <td v-for="n in 7" :key="n">
            {{ commaDecimalFormat(tableData[n - 1]["rechargeMemberCount"], 0) }}
          </td>
        </tr>

        <!-- 提款 -->
        <tr class="block-withdraw">
          <td rowspan="2" class="center">{{ $t("agency.teamRow5") }}</td>
          <td class="center">{{ $t("agency.teamRowD") }}</td>
          <td v-for="n in 7" :key="n">
            {{ commaDecimalFormat(tableData[n - 1]["withdrawAmount"], 2) }}
          </td>
        </tr>
        <tr class="block-withdraw">
          <td class="center">{{ $t("agency.teamRowE") }}</td>
          <td v-for="n in 7" :key="n">
            {{ commaDecimalFormat(tableData[n - 1]["withdrawMemberCount"], 0) }}
          </td>
        </tr>

        <!-- footer -->
        <tr>
          <td colspan="2" class="center">{{ $t("agency.teamRow6") }}</td>
          <td v-for="n in 7" :key="n">
            <span v-if="tableData[n - 1]['netProfit'] == null"> - </span>
            <span v-else>
              {{ commaDecimalFormat(tableData[n - 1]["netProfit"], 2) }}
            </span>
          </td>
        </tr>
      </table>

      <div v-else class="nodata flex items-center justify-center">
        <span>{{ $t("agency.teamNodata") }}</span>
      </div>

      <div class="mt-6 tooltip-text">{{ $t("agency.teamTooltip") }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.report-block {
  position: relative;
  padding: 16px 20px 40px;
}

.team-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px;
    text-align: right;
    border: 1px solid var(--el-border-color);
  }

  th {
    text-align: center;
    background-color: var(--el-fill-color-light);
    color: var(--el-text-color-primary);
  }

  .center {
    text-align: center;
  }

  .block-user td {
    background-color: #f0f7ff;
  }

  .block-bonus td {
    background-color: #fff4ea;
  }

  .block-bet td {
    background-color: #ffedef;
  }

  .block-deposit td {
    background-color: #f4f1fd;
  }

  .block-withdraw td {
    background-color: #fafdf3;
  }

  .text-green {
    color: var(--el-color-success);
  }

  .text-red {
    color: var(--el-color-danger);
  }
}

.nodata {
  height: 200px;
  border: 1px solid var(--el-border-color);
  color: var(--el-text-color-secondary);
}

.tooltip-text {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style>
