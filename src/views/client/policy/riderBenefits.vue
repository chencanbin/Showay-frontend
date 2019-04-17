<template>
  <span id="riderBenefits">
    <el-button type="text" size="mini" style="margin-right: 5px" @click="initForm">
      <svg-icon icon-class="riderBenefit" style="margin-right: 5px"/>
      副险
    </el-button>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      :fullscreen="true"
      title= "副险列表"
      append-to-body>
      <el-table
        :data="riderBenefits"
        stripe>
        <el-table-column prop="product.name" label="产品"/>
        <el-table-column label="保费">
          <template slot-scope="scope">
            <span class="left_text">{{ getSymbol(currency) }}</span><span class="right_text">{{ formatterCurrency(scope.row.premium) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="premium" label="保额">
          <template slot-scope="scope">
            <span class="left_text">{{ getSymbol(currency) }}</span><span class="right_text">{{ formatterCurrency(scope.row.amountInsured) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="policyStatus"
          label="副险状态"
          min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="danger">
              {{ formatterRiderBenefitStatus(scope.row.status) }}
            </el-tag>
            <el-tag v-if="scope.row.status === 0" type="success">
              {{ formatterRiderBenefitStatus(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <edit :rider-benefit="scope.row" :company-id="companyId" :currency="currency"/>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <add :company-id="companyId" :currency="currency" style="margin-top: 10px" @afterAdd="afterAdd" />
      <div slot="footer" style="text-align: center">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="saveLoading" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import add from './addRiderBenefit'
import { getSymbol } from '@/utils'
import edit from './editRiderBenefit'
import { riderBenefitStatus } from '@/utils/constant'
import Cookies from 'js-cookie'

const _ = require('lodash')
const currencyFormatter = require('currency-formatter')

export default {
  name: 'RiderBenefits',
  components: {
    add,
    edit
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    id: {
      type: Number,
      default() {
        return 0
      }
    },
    currency: {
      type: String,
      default() {
        return ''
      }
    },
    companyId: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      language: '',
      saveLoading: false,
      dialogVisible: false,
      riderBenefits: []
    }
  },
  methods: {
    getSymbol,
    formatterCurrency(value) {
      return currencyFormatter.format(value, { symbol: '' })
    },
    initForm() {
      this.language = Cookies.get('language') || 'zh-CN'
      this.riderBenefits = this.data
      this.dialogVisible = true
    },
    afterAdd(riderBenefit) {
      this.riderBenefits.push(riderBenefit)
    },
    handleClose() {
      this.dialogVisible = false
      const params = { sort: 'submitDate,sn', order: 'asc,asc' }
      this.$store.dispatch('client/FetchInsurancePolicyList', { params })
    },
    // 处理删除保单事件
    handleDelete(index, row) {
      this.$confirm('此操作将删除该副险, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.riderBenefits.splice(index, 1)
      })
    },
    handleSubmit() {
      this.saveLoading = true
      const data = []
      this.riderBenefits.forEach(item => {
        data.push({ product: item.product.id, premium: item.premium, amountInsured: item.amountInsured, status: item.status })
      })
      this.$api.client.editInsurancePolicy(this.id, { riderBenefits: data }).then(_ => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        const params = { sort: 'submitDate,sn', order: 'asc,asc' }
        this.$store.dispatch('client/FetchInsurancePolicyList', { params })
        this.handleClose()
        this.saveLoading = false
      }).catch(_ => {
        this.saveLoading = false
      })
    },
    formatterRiderBenefitStatus(id) {
      let result = ''
      _.forEach(riderBenefitStatus, item => {
        if (id === item.id) {
          result = item[this.language]
          return
        }
      })
      return result
    }
  }
}
</script>

<style scoped>

</style>
