<template>
  <span>
    <el-button type="text" size="small" style="margin-right: 10px" @click="initForm">
      <svg-icon icon-class="renew"/>
      {{ $t('client.insurance_policy.renewal') }}
    </el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      :visible="dialogVisible"
      :title= "$t('client.insurance_policy.renewal')"
      width="400px"
      append-to-body>
      <el-form ref="renewal" :model="form" label-width="60px" style="width: 100%">
        <el-form-item :label="$t('client.insurance_policy.product_name')">
          <span>{{ data.product.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.term')" prop="year">
          <el-select v-model="form.year" :placeholder="$t('client.insurance_policy.set.term')" style="width: 100%">
            <el-option
              v-for="item in years"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
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
const _ = require('lodash')
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
    id: {
      type: Number,
      default() {
        return {}
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
      loading: false,
      dialogVisible: false,
      years: [],
      form: {
        premium: 0,
        year: ''
      }
    }
  },
  methods: {
    initForm() {
      const years = _.range(2, this.data.maxYear + 1)
      this.data.renewals.forEach(item => {
        _.pull(years, item.year)
      })
      this.years = years
      this.dialogVisible = true
    },
    handleClose() {
      this.$refs.premium.currencyValue = 0
      this.form.year = ''
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['renewal'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.client.createRenewal(this.id, { product: this.data.product.id, premium: this.form.premium, year: this.form.year }).then(res => {
            this.$message({
              message: this.$t('common.success'),
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('client/FetchRenewal', { id: this.id })
            this.loading = false
            this.handleClose()
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

</style>
