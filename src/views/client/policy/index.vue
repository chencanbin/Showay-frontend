<template>
  <div id="policy" class="table-container">
    <basic-container>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            :placeholder="$t('client.insurance_policy.search')"
            clearable
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="year" :placeholder="$t('client.insurance_policy.date_filter')" type="year" clearable style="width: 180px"/>
        </el-form-item>
      </el-form>
      <add-client v-if="hasPermission(100039)" style="display:inline-block; margin-top: 9px"/>
      <pagination :total="insurancePolicy.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <el-table
        v-loading="insurancePolicyLoading"
        :height="height"
        :data="insurancePolicy.list"
        stripe
        row-key="id"
        @sort-change="handleSubmitDateSort"
        @expand-change="expandChange">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div>
              <el-form id="policy-table-expand" label-position="left" inline >
                <el-form-item :label="$t('client.insurance_policy.agent_name')" class="policy-form-item">
                  <span>{{ scope.row.agent.name }}</span>
                </el-form-item>
                <el-form-item :label="$t('client.insurance_policy.issueDate')" class="policy-form-item">
                  <span>{{ getFormattedDate(scope.row.issueDate) }}</span>
                </el-form-item>
                <el-form-item :label="$t('client.insurance_policy.amountInsured')" class="policy-form-item">
                  <span>{{ numberFormat(scope.row, scope.row.amountInsured) }}</span>
                </el-form-item>
                <el-form-item :label="$t('client.insurance_policy.premium')" class="policy-form-item">
                  <span>{{ numberFormat(scope.row, scope.row.premium) }}</span>
                </el-form-item>
                <el-form-item :label="$t('client.insurance_policy.premiumPlan')" class="policy-form-item">
                  <span>{{ formatterPremiumPlan(scope.row.premiumPlan) }}</span>
                </el-form-item>
                <el-form-item :label="$t('client.insurance_policy.channel')" class="policy-form-item">
                  <!--<detail :data="scope.row"/>-->
                  <span>{{ scope.row.channel.name }}</span>
                </el-form-item>
                <el-form-item label="DDA" class="policy-form-item">
                  <!--<detail :data="scope.row"/>-->
                  <span>{{ scope.row.dda ? 'Yes' : 'No' }}</span>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('client.insurance_policy.number')"
          prop="number"
          show-overflow-tooltip
          min-width="120"/>
        <el-table-column
          :label="$t('client.insurance_policy.sn')"
          prop="sn"
          show-overflow-tooltip
          min-width="120"
          sortable="custom"/>
        <el-table-column
          :formatter="dateFormat"
          :label="$t('client.insurance_policy.submitDate')"
          prop="submitDate"
          min-width="140"
          sortable="custom"/>
        <el-table-column
          :label="$t('client.insurance_policy.policyStatus')"
          prop="policyStatus"
          min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="isIneffectiveStatus(scope.row.policyStatus)" type="danger">
              {{ formatterPolicyStatus(scope.row.policyStatus) }}
            </el-tag>
            <el-tag v-else-if="scope.row.policyStatus === 1" type="warning">
              {{ formatterPolicyStatus(scope.row.policyStatus) }}
            </el-tag>
            <el-tag v-else-if="scope.row.policyStatus === 2" type="success">
              {{ formatterPolicyStatus(scope.row.policyStatus) }}
            </el-tag>
            <el-tag v-else style="margin-right: 10px; margin-bottom: 5px; color:#409EFF; background-color: rgba(64, 158, 255, 0.1); border: 1px solid rgba(64, 158, 255, 0.2)">
              {{ formatterPolicyStatus(scope.row.policyStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('client.insurance_policy.applicant_name')"
          prop="applicant.name"
          show-overflow-tooltip
          width="110"/>
        <el-table-column
          :label="$t('client.insurance_policy.beneficiary_name')"
          prop="beneficiary.name"
          show-overflow-tooltip/>
        <el-table-column
          :label="$t('client.insurance_policy.company_name')"
          prop="company.name"
          min-width="150"
          show-overflow-tooltip/>
        <el-table-column
          :label="$t('client.insurance_policy.product_name')"
          prop="product.name"
          min-width="200"
          show-overflow-tooltip/>
        <el-table-column :label="$t('common.action')">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="hasPermission(100047)">
                  <edit v-if="!isIneffectiveStatus(scope.row.policyStatus)" :list-query="listQuery" :data="scope.row"/>
                </el-dropdown-item>
                <el-dropdown-item v-if="hasPermission(100047)">
                  <riderBenefits v-if="!isIneffectiveStatus(scope.row.policyStatus)" :data="scope.row.riderBenefits" :id="scope.row.id" :company-id="scope.row.company.id" :currency="scope.row.currency" :submit-date="scope.row.submitDate"/>
                </el-dropdown-item>
                <el-dropdown-item v-if="hasPermission(100052)" divided>
                  <renewal v-if="!isIneffectiveStatus(scope.row.policyStatus) && (scope.row.premiumPlan === 3 || scope.row.riderBenefits.length > 0)" :id="scope.row.id" :currency="scope.row.currency" :premium-plan="scope.row.premiumPlan"/>
                </el-dropdown-item>
                <el-dropdown-item v-if="hasPermission(100050)">
                  <el-button
                    type="text"
                    size="small"
                    @click="handleReset(scope.row.id)">{{ $t('common.reset') }}
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="hasPermission(100048)" divided>
                  <el-button
                    type="text"
                    size="small"
                    @click="verifyPassword(scope.row.id)">{{ $t('common.delete') }}
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <company-expenses v-if="hasPermission(100113)" :policy="scope.row"/>
                </el-dropdown-item>
                <el-dropdown-item>
                  <channel-expenses v-if="hasPermission(100118)" :policy="scope.row"/>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <add v-if="hasPermission(100044)" :list-query="listQuery"/>
    </basic-container>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('common.password_verify') + ' - ' + name"
      width="400px">
      <el-input v-model="password" :placeholder="$t('login.password_placeholder')" type="password"/>
      <div class="tips_text">* {{ $t('common.password_verify_text') }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleDelete()">{{ $t('common.submitButton') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime, getYearFirst, getYearLast } from '@/utils'
import { policyStatus, premiumPlan } from '@/utils/constant'

import Cookies from 'js-cookie'
import { mapState, mapGetters } from 'vuex'
import add from './add'
import edit from './edit'
import addClient from './addClient'
import riderBenefits from './riderBenefits'
import renewal from './renewal'
import companyExpenses from './companyExpenses'
import channelExpenses from './channelExpenses'
import pagination from '@/components/Pagination'
import sha256 from 'sha256'
import elDragDialog from '@/directive/el-dragDialog'

const _ = require('lodash')
const currencyFormatter = require('currency-formatter')
export default {
  name: 'InsurancePolicy',
  components: {
    add,
    edit,
    addClient,
    riderBenefits,
    renewal,
    companyExpenses,
    channelExpenses,
    pagination
  },
  directives: { elDragDialog },
  data() {
    return {
      height: this.hasPermission(100044) ? document.body.clientHeight - 190 : document.body.clientHeight - 130,
      id: 0,
      dialogVisible: false,
      password: '',
      submitLoading: false,
      wildcard: '',
      year: '',
      listQuery: {
        page: 1,
        limit: 50
      },
      language: Cookies.get('language') || 'zh-CN',
      expandKeys: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    ...mapState(
      {
        insurancePolicy: state => state.client.insurancePolicyList,
        insurancePolicyLoading: state => state.client.insurancePolicyLoading
      })
  },
  watch: {
    year(val) {
      this.getInsurancePolicyList()
      // if (val) {
      //   const geSubmitDate = getYearFirst(val)
      //   const leSubmitDate = getYearLast(val)
      //   this.getInsurancePolicyList({ geSubmitDate, leSubmitDate })
      // } else {
      //   this.getInsurancePolicyList()
      // }
    }
  },
  created() {
    this.getInsurancePolicyList()
  },
  methods: {
    search: _.debounce(function() {
      this.listQuery = { page: 1, limit: 50 }
      this.getInsurancePolicyList()
    }, 500),
    // 获取保单列表
    getInsurancePolicyList(params) {
      params = Object.assign({ sort: 'submitDate,sn', order: 'asc,asc', wildcard: this.wildcard, ...params })
      if (this.year) {
        const geSubmitDate = getYearFirst(this.year)
        const leSubmitDate = getYearLast(this.year)
        params = Object.assign({ geSubmitDate, leSubmitDate, ...params })
      }
      this.$store.dispatch('client/FetchInsurancePolicyList', { params })
    },
    // 格式化事件
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date, '{y}-{m}-{d}')
    },
    getFormattedDate(value) {
      return parseTime(value, '{y}-{m}-{d}')
    },
    numberFormat(row, value) {
      return currencyFormatter.format(value, { code: row.currency })
    },
    // 处理删除保单事件
    handleDelete() {
      this.submitLoading = true
      this.$api.client.deleteInsurancePolicy(this.id, sha256(this.password)).then(res => {
        this.$message({
          message: this.$t('common.success'),
          type: 'success',
          duration: 5 * 1000
        })
        this.getInsurancePolicyList()
        this.submitLoading = false
        this.dialogVisible = false
      }).catch(_ => {
        this.submitLoading = false
      })
      // this.$confirm(this.$t('client.insurance_policy.tooltip.delete'), this.$t('common.prompt'), {
      //   confirmButtonText: this.$t('common.confirmButton'),
      //   cancelButtonText: this.$t('common.cancelButton'),
      //   type: 'warning',
      //   beforeClose: (action, instance, done) => {
      //     if (action === 'confirm') {
      //       instance.confirmButtonLoading = true
      //       this.$api.client.deleteInsurancePolicy(this.id, sha256(this.password)).then(res => {
      //         this.$message({
      //           message: this.$t('common.success'),
      //           type: 'success',
      //           duration: 5 * 1000
      //         })
      //         this.getInsurancePolicyList()
      //         instance.confirmButtonLoading = false
      //         done()
      //       }).catch(_ => {
      //         instance.confirmButtonLoading = false
      //       })
      //     } else {
      //       done()
      //     }
      //   }
      // })
    },
    verifyPassword(id) {
      this.id = id
      this.dialogVisible = true
    },
    handleClose() {
      this.password = ''
      this.dialogVisible = false
    },
    handleReset(id) {
      this.$confirm(this.$t('client.insurance_policy.tooltip.reset'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.confirmButton'),
        cancelButtonText: this.$t('common.cancelButton'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$api.client.resetInsurancePolicy(id).then(res => {
              this.$message({
                message: this.$t('common.success'),
                type: 'success',
                duration: 5 * 1000
              })
              const offset = (this.listQuery.page - 1) * this.listQuery.limit
              const max = this.listQuery.limit
              this.getInsurancePolicyList({ offset, max })
              instance.confirmButtonLoading = false
              done()
            }).catch(_ => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      }).then(() => {

      })
    },
    // 格式化保单状态
    formatterPolicyStatus(id) {
      let result = ''
      _.forEach(policyStatus, item => {
        if (id === item.id) {
          result = item[this.language]
          return
        }
      })
      return result
    },

    formatterPremiumPlan(id) {
      let result = ''
      _.forEach(premiumPlan, item => {
        if (id === item.id) {
          result = item[this.language]
          return
        }
      })
      return result
    },

    isIneffectiveStatus(status) {
      if (status === 3 || status === 6 || status === 7) {
        return true
      } else {
        return false
      }
    },

    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max }
      this.getInsurancePolicyList(params)
    },
    updatePage(val) {
      this.listQuery.page = val
    },
    updateLimit(val) {
      this.listQuery.limit = val
    },
    handleSubmitDateSort({ column, order, prop }) {
      let tem = 'asc'
      if (order === 'descending') {
        tem = 'desc'
      } else {
        tem = 'asc'
      }
      if (prop) {
        this.getInsurancePolicyList({ sort: prop, order: tem })
      } else {
        this.getInsurancePolicyList()
      }
    },
    expandChange(row, expandedRows) {
      if (this.expandKeys.indexOf(row.id) >= 0) {
        // 收起当前行
        this.expandKeys.shift()
        return
      }
      this.expandKeys.shift()
      this.expandKeys.push(row.id)
      if (expandedRows.length > 1) {
        // 只展开当前选项
        expandedRows.shift()
      }
    }
  }
}
</script>

<style type="text/scss"  lang="scss" scope>
  #policy {
    .el-dialog--center .el-dialog__body {
      padding: 15px 20px;
    }
    .el-table__expanded-cell {
      padding: 0 10px 10px 20px;
    }
    .policy-form-item{
      margin-right: 0;
      margin-bottom: 0;
      width: 20%;
      margin-top: 10px;
      label {
        color: #99a9bf;
      }
    }
    .tips_text {
      color: #5c5958;
      font-size: 14px;
      font-weight: bold;
      margin-top: 10px;
    }
  }

</style>
