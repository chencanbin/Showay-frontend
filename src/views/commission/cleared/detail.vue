<template>
  <span id="paymentDetail">
    <el-button type="text" size="small" @click="initForm">{{ $t('commission.payment.payment_detail') }}</el-button>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      :title= "$t('commission.payment.payment_detail')"
      width="800px">
      <el-table
        :data="payments"
        stripe>
        <el-table-column :label="$t('commission.payment.channel')" prop="channel.name" show-overflow-tooltip/>
        <el-table-column :label="$t('common.amount')" prop="amount">
          <template slot-scope="scope">
            <span class="left_text">HK$ </span>
            <span class="right_text">{{ formatterCurrency(scope.row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('commission.payment.chequeNumber')" prop="mergedPayment.chequeNumber" show-overflow-tooltip/>
        <el-table-column :label="$t('commission.payment.chequeCopy')" prop="mergedPayment.chequeCopy" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="viewScanFile(scope.row.mergedPayment.chequeCopy)">{{ $t('common.view') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import checkPermission from '@/utils/permission' // 权限判断函数
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

import permission from '@/directive/permission/index.js' // 权限判断指令

const currencyFormatter = require('currency-formatter')
export default {
  name: 'PaymentDetail',

  directives: { permission },
  props: {
    payments: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapState({
      mergedPayment: state => state.commission.mergedPayment,
      mergedPaymentLoading: state => state.commission.mergedPaymentLoading
    }),
    disableSubmit: function() {
      return this.selectedRow.length === 0
    }
  },
  methods: {
    checkPermission,
    initForm() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, { symbol: '' })
    },
    viewScanFile(key) {
      this.$api.document.getCompanyDownloadLink(key).then(res => {
        this.chequeCopy = [res.data.url]
        const image = new Image()
        image.src = this.chequeCopy
        const viewer = new Viewer(image, {
          hidden: function() {
            viewer.destroy()
          }
        })
        viewer.show()
      })
    }
  }
}
</script>
<style type="text/scss" lang="scss">
  #paymentDetail {
    .el-dialog__body {
      padding: 0;
    }
  }
</style>
