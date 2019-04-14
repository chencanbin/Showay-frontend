<template>
  <span>
    <el-button type="text" size="mini" icon="el-icon-edit" style="margin-right: 5px" @click="initForm">{{ this.$t('action.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="编辑保单"
      top="50px"
      width="800px">
      <el-form
        ref="insurancePolicy"
        :model="insurancePolicy"
        inline
        class="insurance-policy-form"
        label-width="80px">
        <el-form-item label="保单号:" prop="number">
          <el-input v-model="insurancePolicy.number"/>
        </el-form-item>
        <el-form-item label="内部编号:" prop="sn">
          <el-input v-model="insurancePolicy.sn"/>
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
        <el-form-item label="申请人:" prop="applicant.name">
          <el-select
            v-model="insurancePolicy.applicant.id"
            :loading="clientLoading"
            :remote-method="searchClient"
            placeholder="请选择申请人"
            filterable
            remote
            style="width: 100%"
            @focus="onClientFocus"
          >
            <el-option
              v-for="item in client.list"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left; margin-right: 15px; max-width: 10em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.name }}</span><span style="float: right;">{{ item.idNumber }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="受保人:" prop="beneficiary.name">
          <el-select
            v-model="insurancePolicy.beneficiary.id"
            :loading="clientLoading"
            :remote-method="searchClient"
            placeholder="请选择申请人"
            filterable
            remote
            style="width: 100%"
            @focus="onClientFocus">
            <el-option
              v-for="item in client.list"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left; margin-right: 15px; max-width: 10em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.name }}</span><span style="float: right;">{{ item.idNumber }}</span>
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
        </el-form-item>
        <el-form-item label="保额:" prop="premium">
          <currency-input v-model="insurancePolicy.amountInsured" :symbol="currency" placeholder="请输入保额"/>
        </el-form-item>
        <el-form-item label="续保计划:" prop="premiumPlan">
          <el-select v-model="insurancePolicy.premiumPlan" placeholder="请选择续保计划" style="width: 100%">
            <el-option v-for="item in premiumPlan" :key="item.id" :value="item.id" :label="item[language]"/>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道:" prop="channel">
          <el-select
            v-model="insurancePolicy.channel.id"
            :remote-method="searchChannel"
            placeholder="请选择渠道"
            filterable
            remote
            style="width: 100%"
            @focus="onChannelFocus"
          >
            <el-option
              v-for="item in channels"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="签单员:" prop="agent">
          <el-select
            v-model="insurancePolicy.agent.id"
            :remote-method="searchAgent"
            placeholder="请选择签单员"
            filterable
            remote
            style="width: 100%"
            @focus="onAgentFocus">
            <el-option
              v-for="item in agents"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="公司:" prop="company.id">
          <el-select
            :remote-method="searchCompany"
            :loading="companyLoading"
            v-model="insurancePolicy.company.id"
            placeholder="请选择公司"
            clearable
            filterable
            remote
            style="width: 100%"
            @focus="onCompanyFocus">
            <el-option
              v-for="item in companies"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="产品:" prop="product" style="width: 124%;">
          <el-select
            v-model="insurancePolicy.product.id"
            :loading="productLoading"
            :remote-method="searchProduct"
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
  </span>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { policyStatus, premiumPlan } from '@/utils/constant'
import elDragDialog from '@/directive/el-dragDialog'
import currencyInput from '@/components/CurrencyInput'
import { currencyArray } from '@/utils/constant'

const _ = require('lodash')
import Cookies from 'js-cookie'
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
    }
  },
  data() {
    return {
      language: 'en',
      policyStatus,
      dialogVisible: false,
      agents: [],
      products: [],
      channels: [],
      currencyArray,
      premiumPlan,
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
        company: {
          id: null
        },
        premium: 0,
        amountInsured: 0,
        currency: null,
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
      queryProduct: {
        name: '',
        company: '',
        offset: 0,
        max: 50
      },
      submitLoading: false,
      productLoading: false
    }
  },
  computed: {
    ...mapState({
      clientLoading: state => state.client.clientLoading,
      companyLoading: state => state.company.companyLoading,
      client: state => state.client.clientList,
      companies: state => state.company.companyList.list
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
      // this.getChannel()
      // this.getAgents()

      this.insurancePolicy = _.cloneDeep(this.data)
      this.products = [this.insurancePolicy.product]
      this.$store.commit('company/SET_COMPANY_LIST', { list: [this.insurancePolicy.company] })
      this.agents = [this.insurancePolicy.agent]
      this.channels = [this.insurancePolicy.channel]
      this.insurancePolicy.currency = this.getCurrencyKey(this.data.currency)
      this.getClient()
      this.getCompanies()
      this.dialogVisible = true
    },
    getCompanies(params) {
      this.$store.dispatch('company/FetchCompanyList', params)
    },
    getClient(params) {
      this.$store.dispatch('client/FetchClientList', { params })
    },
    onClientFocus() {
      this.getClient({ name: '' })
    },
    searchClient(query) {
      this.getClient({ name: query })
    },
    getAgents(params) {
      this.$api.user.fetchUserList({ role: 3, ...params }).then(res => {
        this.agents = res.data.list
      })
    },
    searchAgent(query) {
      this.getAgents({ name: query })
    },
    onAgentFocus() {
      this.getAgents()
    },
    getChannel(params) {
      this.$api.user.fetchUserList({ role: 2, ...params }).then(res => {
        this.channels = res.data.list
      })
    },
    searchChannel(query) {
      this.getChannel({ name: query })
    },
    onChannelFocus() {
      this.getChannel()
    },
    getCurrencyKey(value) {
      let result = ''
      _.forEach(this.currencyArray, item => {
        if (value === item.desc) {
          result = item.id
          return
        }
      })
      return result
    },

    getProducts() {
      this.productLoading = true
      this.products = []
      this.queryProduct.company = this.insurancePolicy.company.id
      this.$api.product.fetchProductList(this.queryProduct).then(res => {
        this.products = res.data.list
        this.productLoading = false
      }).catch(_ => {
        this.productLoading = false
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
    searchCompany(query) {
      this.getCompanies({ wildcard: query })
    },
    onCompanyFocus() {
      this.getCompanies()
    },
    handleClose() {
      this.$refs['insurancePolicy'].resetFields()
      this.dialogVisible = false
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
          delete data.riderBenefits
          this.$api.client.editInsurancePolicy(this.insurancePolicy.id, data).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            const params = { sort: 'submitDate', order: 'desc' }
            this.$store.dispatch('client/FetchInsurancePolicyList', { params })
            this.submitLoading = false
            this.handleClose()
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
      margin-bottom: 15px;
      margin-right: 10px;
      width: 48%;
    }
  }

</style>
