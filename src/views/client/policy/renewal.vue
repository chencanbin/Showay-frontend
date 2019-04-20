<template>
  <span>
    <el-button type="text" size="mini" @click="initForm">
      <svg-icon icon-class="renewal" style="margin-right: 5px"/>
      续保
    </el-button>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      :fullscreen="true"
      title= "续保记录"
      append-to-body>
      <el-table
        v-loading="renewalLoading"
        id="riderBenefits"
        :data="renewal"
        stripe
        border
        row-key="product.id"
        @expand-change="expandChange">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div v-if="scope.row.renewals.length === 0" style="text-align: center; color: #909399;">
              无续保记录
            </div>
            <el-form v-for="item in scope.row.renewals" :key="item.id" inline>
              <el-form-item label="年期:" style="width: 10%;">
                <span>{{ item.year }}</span>
              </el-form-item>
              <el-form-item label="保费:" style="width: 15%">
                <span>{{ formatterCurrency(item.premium) }}</span>
              </el-form-item>
              <el-form-item style="width: 20%;">
                <edit :data="scope.row" :renewal="item" :id="id" :currency="currency"/>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDelete(item.id)">删除
                </el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="product.name" label="产品"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <renew v-if="(premiumPlan === 3 && scope.row.type === 0) || (scope.row.type === 1 && scope.row.status === 0)" :data="scope.row" :id="id" :currency="currency"/>
          </template>
        </el-table-column>
      </el-table>
      <!--<div slot="footer" style="text-align: center">-->
      <!--<el-button @click="handleClose">取 消</el-button>-->
      <!--<el-button type="primary" :loading="loading" @click="handleSubmit">提交</el-button>-->
      <!--</div>-->
    </el-dialog>
  </span>
</template>

<script>
import { mapState } from 'vuex'
import { getSymbol } from '@/utils'
import renew from './renew'
import edit from './editRenew'

const currencyFormatter = require('currency-formatter')

export default {
  name: 'Renewal',
  components: {
    renew,
    edit
  },
  props: {
    premiumPlan: {
      type: Number,
      default() {
        return 0
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
    }
  },
  data() {
    return {
      dialogVisible: false,
      expandKeys: []
    }
  },
  computed: {
    ...mapState({
      renewal: state => state.client.renewal,
      renewalLoading: state => state.client.renewalLoading
    })
  },
  methods: {
    getSymbol,
    formatterCurrency(value) {
      return currencyFormatter.format(value, { symbol: this.getSymbol(this.currency) })
    },
    initForm() {
      this.getRenewal(this.id)
      this.dialogVisible = true
    },
    getRenewal(id, params) {
      // this.$api.client.fetchRenewal(id, params).then(res => {
      //   this.renewal.push(res.data.primary)
      //   res.data.riders.forEach(item => {
      //     this.renewal.push(item)
      //   })
      // })
      this.$store.dispatch('client/FetchRenewal', { id, params })
    },
    handleClose() {
      this.dialogVisible = false
      // const params = { sort: 'submitDate', order: 'asc' }
      // this.$store.dispatch('client/FetchInsurancePolicyList', { params })
    },
    // 处理删除保单事件
    handleDelete(id) {
      this.$confirm('此操作将删除该续费记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$api.client.deleteRenewal(id).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.getRenewal(this.id)
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
    expandChange(row, expandedRows) {
      if (this.expandKeys.indexOf(row.id) >= 0) {
        // 收起当前行
        this.expandKeys.shift()
        return
      }
      this.expandKeys.shift()
      this.expandKeys.push(row.product.id)
      if (expandedRows.length > 1) {
        // 只展开当前选项
        expandedRows.shift()
      }
    }
  }
}
</script>

<style type="text/scss"  lang="scss">
  #riderBenefits {
    .el-table__expanded-cell {
      padding: 10px
    }
  }
</style>
