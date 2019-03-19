<template>
  <el-col span.number="24" class="el-table-add-col">
    <div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="添加客户资料"
      width="70%">
      <el-form
        ref="insurancePolicy"
        :model="insurancePolicy"
        :rules="rule"
        inline
        class="insurance-policy-form"
        label-width="80px">
        <el-form-item label="保单号:" prop="number">
          <el-input v-model="insurancePolicy.number" placeholder="请输入保单号"/>
        </el-form-item>
        <el-form-item label="内部编号:" prop="sn" >
          <el-input v-model="insurancePolicy.sn" placeholder="请输入内部编号"/>
        </el-form-item>
        <el-form-item label="申请日期:" prop="submitDate">
          <el-date-picker
            v-model="insurancePolicy.submitDate"
            style="width: 100%"
            type="date"
            placeholder="选择日期"/>
        </el-form-item>
        <el-form-item label="生效日期:" prop="issueDate">
          <el-date-picker
            v-model="insurancePolicy.issueDate"
            style="width: 100%"
            type="date"
            placeholder="选择日期"/>
        </el-form-item>
        <el-form-item label="申请人:" prop="applicant.id">
          <el-select v-model="insurancePolicy.applicant.id" placeholder="请选择申请人" filterable style="width: 100%">
            <el-option
              v-for="item in client.list"
              :key="item.id"
              :value="item.id"
              :label="item.name">
              <span style="float: left; margin-right: 15px; max-width: 10em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.name }}</span><span style="float: right;">{{ item.idNumber }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="受保人:" prop="beneficiary.id">
          <el-select v-model="insurancePolicy.beneficiary.id" placeholder="请选择受保人" filterable style="width: 100%">
            <el-option
              v-for="item in client.list"
              :key="item.id"
              :value="item.id"
              :label="item.name">
              <span style="float: left; margin-right: 15px;max-width: 10em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.name }}</span><span style="float: right;">{{ item.idNumber }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保单状态:" prop="policyStatus">
          <el-select v-model="insurancePolicy.policyStatus" placeholder="请选择保单状态" filterable style="width: 100%">
            <el-option
              v-for="item in policyStatus"
              :key="item.id"
              :label="item[language]"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="币种:" prop="currency">
          <el-select v-model="insurancePolicy.currency" placeholder="请选中币种" style="width: 100%">
            <el-option v-for="item in currencyArray" :key="item.id" :value="item.id" :label="item.desc"/>
          </el-select>
        </el-form-item>
        <el-form-item label="保费:" prop="premium">
          <currency-input v-model="insurancePolicy.premium" :symbol="currency" placeholder="请输入保费"/>
          <!--<el-input v-model="insurancePolicy.premium" placeholder="请输入保费" />-->
        </el-form-item>
        <el-form-item label="保额:" prop="amountInsured">
          <currency-input v-model="insurancePolicy.amountInsured" :symbol="currency" placeholder="请输入保额" />
          <!--<el-input v-model="insurancePolicy.amountInsured" placeholder="请输入保额" />-->
        </el-form-item>
        <el-form-item label="渠道:" prop="channel.id">
          <el-select v-model="insurancePolicy.channel.id" placeholder="请选择渠道" filterable style="width: 100%">
            <el-option
              v-for="item in channels.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="签单员:" prop="agent.id">
          <el-select v-model="insurancePolicy.agent.id" placeholder="请选择签单员" filterable style="width: 100%">
            <el-option
              v-for="item in agents"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="产品:" prop="product.id" style="width: 100%">
          <el-select
            v-model="insurancePolicy.product.id"
            :remote-method="searchProduct"
            :loading="loading"
            placeholder="请输入产品名或产品编号"
            filterable
            remote
            style="width: 125%"
            @focus="onProductFocus">
            <el-option
              v-for="item in products"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left;margin-right: 15px;">{{ item.name }}</span><span style="float: left; font-weight: bold">{{ item.acryonym }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapState } from 'vuex'
import { policyStatus } from '@/utils/constant'
import elDragDialog from '@/directive/el-dragDialog'
import { currencyArray } from '@/utils/constant'
import Cookies from 'js-cookie'
import currencyInput from '@/components/CurrencyInput'
const _ = require('lodash')
export default {
  directives: { elDragDialog },
  components: {
    currencyInput
  },
  data() {
    return {
      language: 'en',
      policyStatus,
      dialogVisible: false,
      submitLoading: false,
      agents: [],
      products: [],
      queryProduct: {
        name: '',
        offset: 0,
        max: 50
      },
      currencyArray,
      insurancePolicy: {
        number: null,
        sn: null,
        submitDate: null,
        policyStatus: null,
        applicant: {
          id: null
        },
        beneficiary: {
          id: null
        },
        currency: null,
        premium: null,
        amountInsured: null,
        channel: {
          id: null
        },
        agent: {
          id: null
        },
        product: {
          id: null
        },
        issueDate: null
      },
      rule: {
        name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        idNumber: [{ required: true, message: '请输入证件号', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      client: state => state.client.clientList,
      channels: state => state.user.users
    }),
    currency() {
      if (this.insurancePolicy.currency === 0) {
        return 'US$'
      } else if (this.insurancePolicy.currency === 1) {
        return 'HK$'
      } else if (this.insurancePolicy.currency === 2) {
        return 'CN¥'
      } else {
        return ''
      }
    }
  },
  methods: {
    initForm() {
      this.language = Cookies.get('language') || 'zh-CN'
      this.dialogVisible = true
      this.getClient()
      this.getChannel()
      this.getAgents()
    },
    getClient(params) {
      this.$store.dispatch('client/FetchClientList', { params })
    },
    getAgents() {
      this.$api.user.fetchUserList({ role: 3 }).then(res => {
        this.agents = res.data.list
      })
    },
    getChannel(params) {
      const role = { role: 2 }
      if (params) {
        params.role = role
      } else {
        params = role
      }
      this.$store.dispatch('FetchUserList', params)
    },

    getProducts() {
      this.products = []
      this.$api.product.fetchProductList(this.queryProduct).then(res => {
        this.products = res.data.list
      })
    },
    searchProduct(query) {
      this.queryProduct.name = query
      this.getProducts()
    },
    onProductFocus() {
      this.queryProduct.name = ''
      this.getProducts()
    },
    handleClose() {
      this.$confirm('窗口即将关闭, 是否放弃编辑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['insurancePolicy'].resetFields()
        this.insurancePolicy.premium = 0
        this.insurancePolicy.amountInsured = 0
        this.dialogVisible = false
      })
    },
    loadMoreProduct() {
      this.queryProduct.offset = this.queryProduct.max + this.queryProduct.offset
      this.$api.product.fetchProductList(this.queryProduct).then(res => {
        this.products = this.products.concat(res.data.list)
      })
    },
    handleSubmit() {
      this.$refs['insurancePolicy'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const data = _.cloneDeep(this.insurancePolicy)
          data.applicant = this.insurancePolicy.applicant.id
          data.beneficiary = this.insurancePolicy.beneficiary.id
          data.channel = this.insurancePolicy.channel.id
          data.product = this.insurancePolicy.product.id
          data.riderBenefits = [] // 副险暂时不参与编辑
          this.$api.client.createInsurancePolicy(data).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('client/FetchInsurancePolicyList', {})
            this.submitLoading = false
            this.$refs['insurancePolicy'].resetFields()
            this.insurancePolicy.premium = 0
            this.insurancePolicy.amountInsured = 0
            this.dialogVisible = false
          }).catch(_ => {
            this.submitLoading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style type="text/scss"  lang="scss">
  .insurance-policy-form {
    font-size: 0;
    .el-form-item {
      width: 48%;
    }
    .el-form-item__content {
      width: 65%;
    }
  }
</style>
