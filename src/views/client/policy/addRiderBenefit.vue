<template>
  <el-col span.number="24" class="el-table-add-col" style="padding: 0 0 10px 0">
    <!--<el-row style="margin-bottom: 5px">-->
    <!--<el-button type="primary" icon="el-icon-plus" style="margin-right: 10px" @click="initForm">添加副险</el-button>-->
    <!--</el-row>-->
    <div class="el-table-add-row" @click="initForm"><span>+ 添加副险</span></div>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="添加副险"
      width="600px"
      append-to-body>
      <el-form ref="riderBenefit" :model="riderBenefit" :rules="riderBenefitRule" label-width="80px" class="riderBenefit">
        <el-form-item label="产品:" prop="product" style="width: 100%;">
          <el-select
            v-model="riderBenefit.product"
            :loading="loading"
            :remote-method="searchProduct"
            value-key="id"
            placeholder="请输入产品关键词"
            filterable
            clearable
            remote
            style="width: 100%"
            @focus="onProductFocus"
          >
            <el-option
              v-for="item in products"
              :key="item.id"
              :label="item.name"
              :value="item">
              <span style="float: left;margin-right: 15px;">{{ item.name }}</span><span style="float: left; font-weight: bold">{{ item.acryonym }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保费:" prop="premium">
          <currency-input ref="premium" v-model="riderBenefit.premium" :symbol="getSymbol(currency)" placeholder="请输入保费"/>
        </el-form-item>
        <el-form-item label="保额:" prop="amountInsured">
          <currency-input ref="amountInsured" v-model="riderBenefit.amountInsured" :symbol="getSymbol(currency)" placeholder="请输入保额"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>

<script type="text/ecmascript-6">
import currencyInput from '@/components/CurrencyInput'
import elDragDialog from '@/directive/el-dragDialog'
import { mapGetters, mapState } from 'vuex'
import { getSymbol } from '@/utils'
import Cookies from 'js-cookie'

const _ = require('lodash')

export default {
  directives: { elDragDialog },
  components: {
    currencyInput
  },
  props: {
    companyId: {
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
      products: [],
      riderBenefit: {
        status: 0
      },
      language: '',
      queryProduct: {
        name: '',
        company: this.companyId,
        offset: 0,
        max: 50
      },
      riderBenefitRule: {
        premium: [{ required: true, message: '保费必须填', trigger: 'blur' }],
        product: [{ required: true, message: '请选择保险产品', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      companies: state => state.company.companyList.list
    })
  },
  methods: {
    getSymbol,
    initForm() {
      this.language = Cookies.get('language') || 'zh-CN'
      this.dialogVisible = true
    },
    handleClose() {
      this.$refs['riderBenefit'].resetFields()
      this.$refs['amountInsured'].currencyValue = 0
      this.$refs['premium'].currencyValue = 0
      this.dialogVisible = false
    },
    searchProduct(query) {
      this.queryProduct.name = query
      this.getProducts()
    },
    getProducts() {
      this.products = []
      this.$api.product.fetchProductList(this.queryProduct).then(res => {
        this.products = res.data.list
      })
    },
    onProductFocus() {
      this.queryProduct.name = ''
      this.getProducts()
    },
    handleSubmit() {
      this.$refs['riderBenefit'].validate((valid) => {
        if (valid) {
          const riderBenefit = _.cloneDeep(this.riderBenefit)
          this.$emit('afterAdd', riderBenefit)
          this.handleClose()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
  .riderBenefit {
    .el-form-item {
      margin-bottom: 20px;
    }
  }
</style>
