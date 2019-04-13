<template>
  <span>
    <el-button type="text" size="mini" style="margin-right: 10px" @click="initForm">
      <svg-icon icon-class="renew"/>
      续费
    </el-button>
    <el-dialog
      v-el-drag-dialog
      :before-close="handleClose"
      :visible="dialogVisible"
      title="续费"
      width="400px"
      append-to-body>
      <el-form ref="renewal" :model="form" label-width="60px" style="width: 100%">
        <el-form-item label="产品:">
          <span>{{ data.product.name }}</span>
        </el-form-item>
        <el-form-item label="年期:" prop="year">
          <el-select v-model="form.year" placeholder="请选择年期" style="width: 100%">
            <el-option
              v-for="item in years"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="保费:" prop="premium">
          <currency-input ref="premium" v-model="form.premium" :symbol="getSymbol(currency)" placeholder="请输入保费"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
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
      dialogVisible: false,
      years: [],
      form: {
        premium: 0,
        year: ''
      }
    }
  },
  computed: {
    ...mapGetters(['loading'])
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
          this.$api.client.createRenewal(this.id, { product: this.data.product.id, premium: this.form.premium, year: this.form.year }).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('client/FetchRenewal', { id: this.id })
            this.handleClose()
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
