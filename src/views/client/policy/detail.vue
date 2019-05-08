<template>
  <span>
    <el-button type="text" size="mini" icon="el-icon-info" style="margin-right: 10px" @click="initForm">详情</el-button>
    <el-dialog
      v-el-drag-dialog
      id="policy-detail-dialog"
      :close-on-click-modal="false"
      :before-close="handleClose"
      :visible="dialogVisible"
      title="保险详情"
      width="75%">
      <el-form label-position="left" inline class="detail-form" style="padding-bottom: 20px">
        <el-form-item label="内部编号:">
          <span>{{ data.sn }}</span>
        </el-form-item>
        <el-form-item label="渠道:" style="width: 25%">
          <span>{{ data.channel.name }}</span>
        </el-form-item>
        <el-form-item label="签单员:">
          <span>{{ data.agent.name }}</span>
        </el-form-item>
        <el-form-item label="保额:">
          <span v-if="!data.amountInsured || data.amountInsured === 0">N/A</span>
          <span v-else>{{ numberFormat(data, data.amountInsured) }}</span>
        </el-form-item>
        <el-form-item label="保费:">
          <span>{{ numberFormat(data, data.premium) }}</span>
        </el-form-item>
        <el-form-item label="续费计划:">
          <span>{{ formatterPremiumPlan(data.premiumPlan) }}</span>
        </el-form-item>
        <el-form-item label="生效时间:">
          <span>{{ getFormattedDate(data.issueDate) }}</span>
        </el-form-item>
      </el-form>
      <div v-if="data.riderBenefits && data.riderBenefits.length > 0">
        <div style="padding: 0px 10px 10px 0; font-size: 14px; font-weight: bold; color: #99a9bf;">副险列表</div>
        <div style="padding: 0px 10px 30px 0">
          <el-table :data="data.riderBenefits" style="width: 100%" stripe>
            <el-table-column prop="product.name" label="产品"/>
            <el-table-column prop="amountInsured" label="保费"/>
            <el-table-column prop="premium" label="保额"/>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { parseTime } from '@/utils'
import { premiumPlan } from '@/utils/constant'
import elDragDialog from '@/directive/el-dragDialog'
import Cookies from 'js-cookie'
const currencyFormatter = require('currency-formatter')
const _ = require('lodash')

export default {
  directives: { elDragDialog },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      language: Cookies.get('language') || 'zh-CN'
    }
  },
  methods: {
    initForm() {
      console.log('....................')
      this.dialogVisible = true
    },
    numberFormat(row, value) {
      return currencyFormatter.format(value, { code: row.currency })
    },
    getFormattedDate(value) {
      return parseTime(value, '{y}-{m}-{d}')
    },
    // 格式化保单状态
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
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style type="text/scss"  lang="scss">

  #policy-detail-dialog {
    .detail-form {
      font-size: 0;
      .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 19%;
        margin-right: 50px;
        label {
          color: #99a9bf;
        }
      }
    }
    .el-dialog__body {
      padding-top: 20px;
    }
  }
</style>
