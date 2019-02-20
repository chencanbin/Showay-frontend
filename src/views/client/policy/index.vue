<template>
  <div class="table-container">
    <basic-container>
      <el-table
        v-loading="loading"
        :data="insurancePolicy.list"
        stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="policy-table-expand">
              <el-form-item label="渠道:">
                <span>{{ scope.row.channel.name }}</span>
              </el-form-item>
              <el-form-item label="签单员:">
                <span>{{ scope.row.agent.name }}</span>
              </el-form-item>
              <el-form-item label="币种:">
                <span>{{ scope.row.currency }}</span>
              </el-form-item>
              <el-form-item label="年期:">
                <span/>
              </el-form-item>
              <el-form-item label="保额:">
                <span>{{ numberFormat(scope.row.amountInsured) }}</span>
              </el-form-item>
              <el-form-item label="保费:">
                <span>{{ numberFormat(scope.row.premium) }}</span>
              </el-form-item>
              <el-form-item label="AFYP:">
                <span/>
              </el-form-item>
              <el-form-item label="生效时间:">
                <span>{{ scope.row.issueDate }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="保单号"/>
        <el-table-column
          :formatter="dateFormat"
          prop="submitDate"
          label="申请日期"/>
        <el-table-column
          :formatter="formatterPolicyStatus"
          prop="policyStatus"
          label="保单状态"/>
        <el-table-column
          prop="applicant.name"
          label="申请人"/>
        <el-table-column
          prop="company.name"
          width="180"
          label="保险公司"/>
        <el-table-column
          prop="product.name"
          width="250"
          label="产品"/>

        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <edit :data="scope.row"/>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <add/>
    </basic-container>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { policyStatus } from '@/utils/constant'
import Cookies from 'js-cookie'
import { mapGetters, mapState } from 'vuex'
import add from './add'
import edit from './edit'
const _ = require('lodash')

export default {
  name: 'InsurancePolicy',
  components: {
    add,
    edit
  },
  data() {
    return {
      language: Cookies.get('language') || 'en'
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState(
      {
        insurancePolicy: state => state.client.insurancePolicyList
      })
  },
  created() {
  },
  mounted() {
    this.getInsurancePolicyList()
  },
  methods: {

    // 获取保单列表
    getInsurancePolicyList(param) {
      this.$store.dispatch('client/FetchInsurancePolicyList', { param })
    },

    // 格式化事件
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date, '{y}-{m}-{d}')
    },
    numberFormat(value) {
      if (value && _.isNumber(_.toNumber(value))) {
        return _.toNumber(value).toFixed(2)
      } else {
        return value
      }
    },
    // 处理删除保单事件
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.client.deleteClient(row.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getClient()
        })
      })
    },

    // 格式化保单状态
    formatterPolicyStatus(row, column) {
      const id = row[column.property]
      let result = ''
      _.forEach(policyStatus, item => {
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

<style type="text/scss"  lang="scss">
  .policy-table-expand {
    font-size: 0;
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 25%;
      label {
        color: #99a9bf;
      }
    }
  }
</style>
