<template>
  <span id="paymentDetail">
    <el-button v-loading="loading" type="text" size="mini" @click="initForm">{{ generateButtonText() }}</el-button>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      :title= "generateTitle()"
      :fullscreen="true"
      center>
      <el-row style="margin-bottom: 10px">
        <el-button v-if="status === '-1'" :disabled="disableSubmit" type="primary" @click="handleSubmit">提交审核</el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :max-height="height"
        :data="mergedPayment.payments"
        stripe
        border
        @selection-change="handleSelectionChange">
        <el-table-column
          v-if="status === '-1'"
          align="center"
          type="selection"
          width="55" />
        <el-table-column label="保单号" prop="insurancePolicy.number"/>
        <el-table-column label="保费">
          <template slot-scope="scope">
            <span class="left_text">{{ getSymbol(scope.row.currency) }}</span><span class="right_text">{{ formatterCurrency(scope.row.insurancePolicy.premium) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="期序">
          <template slot-scope="scope">
            <span>第 {{ scope.row.year }} 期</span>
          </template>
        </el-table-column>
        <el-table-column label="兑港币汇率" prop="exchangeRateToHkd"/>
        <el-table-column label="预计应发数额">
          <template slot-scope="scope">
            <span class="left_text">HK$</span><span class="right_text">{{ formatterCurrency(scope.row.calculatedAmountInHkd) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预计实发数额" prop="amount">
          <template slot-scope="scope">
            <span class="left_text">HK$</span><span class="right_text">{{ formatterCurrency(scope.row.predictedAmountInHkd) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发数额" prop="amount">
          <template slot-scope="scope">
            <div v-if="scope.row.amount">
              <span class="left_text">HK$</span><span class="right_text">{{ formatterCurrency(scope.row.amount) }}</span>
            </div>
            <div v-else>
              <span class="left_text">HK$</span><span class="right_text">{{ formatterCurrency(scope.row.predictedAmountInHkd) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="佣金率">
          <template slot-scope="scope">
            {{ formatPercent(scope.row.commissionRate) }}
          </template>
        </el-table-column>
        <el-table-column v-if="status === '-1'" label="操作">
          <template slot-scope="scope">
            <edit :payment="scope.row" :key="scope.row.id"/>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="status === '0'" slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="danger" @click="handleReject">拒绝</el-button>
        <el-button :loading="loading" type="primary" @click="handleApprove">批准</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapState } from 'vuex'
import edit from './edit'
import { getSymbol } from '@/utils'

const _ = require('lodash')
const currencyFormatter = require('currency-formatter')
export default {
  name: 'MergedPayment',
  components: {
    edit
  },
  props: {
    channel: {
      type: Object,
      default() {
        return {}
      }
    },
    status: {
      type: String,
      default() {
        return ''
      }
    },
    id: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      height: window.screen.height - 220,
      dialogVisible: false,
      selectedRow: []
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({ mergedPayment: state => state.commission.mergedPayment }),
    disableSubmit: function() {
      return this.selectedRow.length === 0
    }
  },
  methods: {
    initForm() {
      this.getMergedPayment()
      this.dialogVisible = true
    },
    getRandom() {
      return Math.random()
    },
    generateTitle() {
      if (this.status === '-1') {
        return '渠道佣金待发放列表 ( ' + this.channel.name + ' )'
      } else if (this.status === '0') {
        return '渠道佣金审核放列表 ( ' + this.channel.name + ' )'
      }
    },
    generateButtonText() {
      if (this.status === '-1') {
        return '待发放列表'
      } else if (this.status === '0') {
        return '待审核列表'
      }
    },
    getSymbol,
    handleClose() {
      this.dialogVisible = false
    },
    getMergedPayment() {
      this.$store.dispatch('commission/FetchMergedPayment', { id: this.id, params: { channel: this.channel.id }})
    },
    formatterCurrency(value) {
      return currencyFormatter.format(value, { symbol: '' })
    },
    handleSelectionChange(val) {
      this.selectedRow = val
    },
    formatPercent(value) {
      return _.toNumber(value).toFixed(2) + '%'
    },
    handleReject() {
      this.$api.commission.mergedPaymentReject(this.id).then(_ => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.$store.dispatch('commission/FetchAuditPayment', { status: 0 })
        this.dialogVisible = false
      })
    },
    handleApprove() {
      this.$api.commission.mergedPaymentApprove(this.id).then(_ => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.$store.dispatch('commission/FetchAuditPayment', { status: 0 })
        this.dialogVisible = false
      })
    },
    handleSubmit() {
      this.$confirm('此操作会将选中的渠道佣金记录提交审核, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        const data = []
        _.forEach(this.selectedRow, item => {
          let obj = {}
          if (item.amount) {
            obj = { id: item.id, amount: item.amount }
          } else {
            obj = { id: item.id, amount: item.predictedAmountInHkd }
          }
          // if(item.currency !== 'HKD') {
          //   obj.exchangeRate = item.exchangeRateToHkd
          // }
          data.push(obj)
        })
        this.$api.commission.mergedPayment({ payments: data }).then(res => {
          this.getMergedPayment()
          this.$store.dispatch('commission/FetchAuditPayment', { status: -1 })
          this.loading = false
        }).catch(_ => {
          this.loading = false
        })
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  #paymentDetail .el-dialog__body {
    padding: 5px 20px;
  }
</style>
