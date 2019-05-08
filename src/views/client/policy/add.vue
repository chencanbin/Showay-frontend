<template>
  <el-col span.number="24" class="el-table-add-col">
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>-->
    <el-button class="el-table-add-row" plain type="primary" @click="initForm">+ {{ $t('common.add') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('client.insurance_policy.set.add_title')"
      top="10px"
      width="70%">
      <el-form
        ref="insurancePolicy"
        :model="insurancePolicy"
        inline
        class="insurance-policy-form"
        label-width="120px">
        <el-form-item :label="$t('client.insurance_policy.number')" prop="number">
          <el-input ref="number" v-model="insurancePolicy.number" :placeholder="$t('client.insurance_policy.set.number')" autofocus/>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.sn')" prop="sn" >
          <el-input v-model="insurancePolicy.sn" :placeholder="$t('client.insurance_policy.set.sn')"/>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.submitDate')" prop="submitDate">
          <el-date-picker
            v-model="insurancePolicy.submitDate"
            :placeholder="$t('client.insurance_policy.set.submitDate')"
            style="width: 100%"
            type="date"/>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.issueDate')" prop="issueDate">
          <el-date-picker
            v-model="insurancePolicy.issueDate"
            :placeholder="$t('client.insurance_policy.set.issueDate')"
            style="width: 100%"
            type="date"/>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.applicant_name')" prop="applicant.id">
          <el-select
            v-model="insurancePolicy.applicant.id"
            :placeholder="$t('client.insurance_policy.set.applicant_name')"
            :remote-method="searchClient"
            filterable
            remote
            style="width: 100%"
            @focus="onClientFocus">
            <el-option
              v-for="item in client.list"
              :key="item.id"
              :value="item.id"
              :label="item.name">
              <span style="float: left; margin-right: 15px; max-width: 10em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.name }}</span><span style="float: right;">{{ item.idNumber }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.beneficiary_name')" prop="beneficiary.id">
          <el-select
            v-model="insurancePolicy.beneficiary.id"
            :placeholder="$t('client.insurance_policy.set.beneficiary_name')"
            :remote-method="searchClient"
            filterable
            remote
            style="width: 100%"
            @focus="onClientFocus">
            <el-option
              v-for="item in client.list"
              :key="item.id"
              :value="item.id"
              :label="item.name">
              <span style="float: left; margin-right: 15px;max-width: 10em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.name }}</span><span style="float: right;">{{ item.idNumber }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.policyStatus')" prop="policyStatus">
          <el-select v-model="insurancePolicy.policyStatus" :placeholder="$t('client.insurance_policy.set.policyStatus')" filterable style="width: 100%">
            <el-option
              v-for="item in policyStatus"
              :key="item.id"
              :label="item[language]"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.currency')" prop="currency">
          <el-select v-model="insurancePolicy.currency" :placeholder="$t('client.insurance_policy.set.currency')" style="width: 100%">
            <el-option v-for="item in currencyArray" :key="item.id" :value="item.id" :label="item.desc"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.premium')" prop="premium">
          <currency-input ref="premium" v-model="insurancePolicy.premium" :symbol="currency" :placeholder="$t('client.insurance_policy.set.premium')"/>
          <!--<el-input v-model="insurancePolicy.premium" placeholder="请输入保费" />-->
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.amountInsured')" prop="amountInsured">
          <currency-input ref="amountInsured" v-model="insurancePolicy.amountInsured" :symbol="currency" :placeholder="$t('client.insurance_policy.set.amountInsured')" />
          <!--<el-input v-model="insurancePolicy.amountInsured" placeholder="请输入保额" />-->
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.premiumPlan')" prop="premiumPlan">
          <el-select v-model="insurancePolicy.premiumPlan" :placeholder="$t('client.insurance_policy.set.premiumPlan')" style="width: 100%">
            <el-option v-for="item in premiumPlan" :key="item.id" :value="item.id" :label="item[language]"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.channel')" prop="channel.id">
          <el-select v-model="insurancePolicy.channel.id" :placeholder="$t('client.insurance_policy.set.channel_name')" filterable style="width: 100%">
            <el-option
              v-for="item in channels.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.agent_name')" prop="agent.id">
          <el-select v-model="insurancePolicy.agent.id" :placeholder="$t('client.insurance_policy.set.agent_name')" filterable style="width: 100%">
            <el-option
              v-for="item in agents"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.company')" prop="company.id">
          <el-select
            :remote-method="searchCompany"
            :loading="companyLoading"
            v-model="insurancePolicy.company.id"
            :placeholder="$t('client.insurance_policy.set.company_name')"
            filterable
            remote
            clearable
            style="width: 100%"
            @focus="onCompanyFocus">
            <el-option
              v-for="item in companies"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.product')" prop="product.id" style="width: 124%;">
          <el-select
            v-model="insurancePolicy.product.id"
            :remote-method="searchProduct"
            :loading="productLoading"
            :placeholder="$t('client.insurance_policy.set.product_name')"
            filterable
            remote
            clearable
            style="width: 100%"
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
        <el-form-item label="DDA">
          <el-checkbox v-model="insurancePolicy.dda"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmit">{{ $t('common.submitButton') }}</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { policyStatus } from '@/utils/constant'
import elDragDialog from '@/directive/el-dragDialog'
import { currencyArray, premiumPlan } from '@/utils/constant'
import Cookies from 'js-cookie'
import currencyInput from '@/components/CurrencyInput'
const _ = require('lodash')
export default {
  directives: { elDragDialog },
  components: {
    currencyInput
  },
  props: {
    listQuery: {
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
      queryProduct: {
        name: '',
        company: ''
      },
      dda: false,
      currencyArray,
      premiumPlan,
      insurancePolicy: {
        number: null,
        sn: null,
        submitDate: null,
        policyStatus: 0,
        applicant: {
          id: null
        },
        beneficiary: {
          id: null
        },
        currency: null,
        premiumPlan: 1,
        premium: '0',
        amountInsured: '0',
        company: {
          id: ''
        },
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
      submitLoading: false,
      productLoading: false
    }
  },
  computed: {
    ...mapState({
      companyLoading: state => state.company.companyLoading,
      client: state => state.client.clientList,
      channels: state => state.user.users,
      companies: state => state.company.companyList.list
    }),
    currency() {
      if (this.insurancePolicy.currency === 0) {
        return 'US$'
      } else if (this.insurancePolicy.currency === 1) {
        return 'HK$ '
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
      // this.getClient()
      // this.getCompanies()
      this.getChannel()
      this.getAgents()
      this.$nextTick(function() {
        this.$refs.number.focus()
      })
    },
    getCompanies(params) {
      this.$store.dispatch('company/FetchCompanyList', params)
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
      this.productLoading = true
      this.products = []
      this.queryProduct.company = this.insurancePolicy.company.id
      if (this.insurancePolicy.submitDate) {
        this.queryProduct.timestamp = new Date(this.insurancePolicy.submitDate).valueOf()
      }
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
    searchClient(query) {
      console.log(query)
      this.getClient({ wildcard: query })
    },
    onClientFocus() {
      this.getClient()
    },
    handleClose() {
      this.$confirm(this.$t('common.tooltip.close'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.confirmButton'),
        cancelButtonText: this.$t('common.cancelButton'),
        type: 'warning'
      }).then(() => {
        this.$refs['insurancePolicy'].resetFields()
        this.$refs['premium'].currencyValue = 0
        this.$refs['amountInsured'].currencyValue = 0
        this.dialogVisible = false
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
              message: this.$t('common.success'),
              type: 'success',
              duration: 5 * 1000
            })
            const offset = (this.listQuery.page - 1) * this.listQuery.limit
            const max = this.listQuery.limit
            this.$store.dispatch('client/FetchInsurancePolicyList', { params: { sort: 'submitDate,sn', order: 'asc,asc', max, offset }})
            this.$refs['insurancePolicy'].resetFields()
            this.$refs['premium'].currencyValue = 0
            this.$refs['amountInsured'].currencyValue = 0
            this.dialogVisible = false
            this.submitLoading = false
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
