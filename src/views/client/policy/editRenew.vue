<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">{{ $t('common.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      id="editRenew"
      :before-close="handleClose"
      :visible="dialogVisible"
      :title= "$t('client.insurance_policy.renewal')"
      width="400px"
      append-to-body>
      <el-form id="editRenew" ref="renewal" :model="form" label-width="60px">
        <el-form-item :label="$t('client.insurance_policy.product_name')">
          <span>{{ data.product.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.term')" prop="year">
          <span>{{ renewal.year }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.premium')" prop="premium">
          <currency-input ref="premium" v-model="form.premium" :symbol="getSymbol(currency)" :placeholder="$t('client.insurance_policy.set.premium')"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">{{ $t('common.submitButton') }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { getSymbol } from '@/utils'
import currencyInput from '@/components/CurrencyInput'
import elDragDialog from '@/directive/el-dragDialog'

export default {
  directives: { elDragDialog },
  components: {
    currencyInput
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    renewal: {
      type: Object,
      default() {
        return {}
      }
    },
    currency: {
      type: String,
      default() {
        return {}
      }
    },
    id: {
      type: Number,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        premium: 0,
        year: ''
      }

    }
  },
  methods: {
    initForm() {
      this.form.premium = this.renewal.premium
      this.form.year = this.renewal.year
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['renewal'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.client.editRenewal(this.renewal.id, { insurancePolicy: this.id, product: this.data.product.id, premium: this.form.premium, year: this.renewal.year }).then(res => {
            this.$message({
              message: this.$t('common.success'),
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('client/FetchRenewal', { id: this.id })
            this.handleClose()
            this.loading = false
          }).catch(_ => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    getSymbol
  }
}
</script>

<style type="text/scss"  lang="scss">
  #editRenew {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
</style>
