<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-info" style="margin-right: 10px" @click="initForm">详情</el-button>
    <el-dialog
      v-el-drag-dialog
      id="policy-detail-dialog"
      :before-close="handleClose"
      :visible="dialogVisible"
      title="保险详情"
      width="75%">
      <el-form label-position="left" inline class="detail-form" style="padding-bottom: 20px">
        <el-form-item label="渠道:">
          <span>{{ data.channel.name }}</span>
        </el-form-item>
        <el-form-item label="签单员:">
          <span>{{ data.agent.name }}</span>
        </el-form-item>
        <el-form-item label="保额:">
          <span>{{ numberFormat(data, data.amountInsured) }}</span>
        </el-form-item>
        <el-form-item label="保费:">
          <span>{{ numberFormat(data, data.premium) }}</span>
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
import elDragDialog from '@/directive/el-dragDialog'
const currencyFormatter = require('currency-formatter')
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
      dialogVisible: false
    }
  },
  methods: {
    initForm() {
      this.dialogVisible = true
    },
    numberFormat(row, value) {
      return currencyFormatter.format(value, { code: row.currency })
    },
    getFormattedDate(value) {
      return parseTime(value, '{y}-{m}-{d}')
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
        width: 20%;
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
