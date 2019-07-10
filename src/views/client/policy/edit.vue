<template>
  <span>
    <el-button type="text" size="small" @click="initForm">{{ this.$t('common.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('client.insurance_policy.set.edit_title')"
      top="50px"
      width="800px"
      append-to-body>
      <el-form
        ref="insurancePolicy"
        :model="insurancePolicy"
        inline
        class="insurance-policy-form"
        label-width="120px">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('client.insurance_policy.basic_info')" name="basic">
            <el-form-item :label="$t('client.insurance_policy.number')" prop="number">
              <el-input v-model="insurancePolicy.number" :placeholder="$t('client.insurance_policy.set.number')"/>
            </el-form-item>
            <el-form-item :label="$t('client.insurance_policy.sn')" prop="sn">
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
            <el-form-item :label="$t('client.insurance_policy.premiumDate ')" prop="premiumDate">
              <el-date-picker
                v-model="insurancePolicy.premiumDate "
                :placeholder="$t('client.insurance_policy.set.premiumDate ')"
                style="width: 100%"
                type="date"/>
            </el-form-item>
            <el-form-item :label="$t('client.insurance_policy.applicant_name')" prop="applicant.name">
              <el-select
                v-model="insurancePolicy.applicant.id"
                :loading="applicantLoading"
                :remote-method="searchApplicants"
                :placeholder="$t('client.insurance_policy.set.applicant_name')"
                filterable
                remote
                style="width: 100%"
                @focus="onApplicantsFocus"
              >
                <el-option
                  v-for="item in applicants"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left; margin-right: 15px; max-width: 10em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.name }}</span><span style="float: right;">{{ item.idNumber }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('client.insurance_policy.insured_name')" prop="insured.name">
              <el-select
                v-model="insurancePolicy.insured.id"
                :loading="beneficiaryLoading"
                :remote-method="searchBeneficiaries"
                :placeholder="$t('client.insurance_policy.set.insured_name')"
                filterable
                remote
                style="width: 100%"
                @focus="onBeneficiariesFocus">
                <el-option
                  v-for="item in insured"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left; margin-right: 15px; max-width: 10em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.name }}</span><span style="float: right;">{{ item.idNumber }}</span>
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
              <currency-input v-model="insurancePolicy.premium" :symbol="currency" :placeholder="$t('client.insurance_policy.set.premium')"/>
            </el-form-item>
            <el-form-item :label="$t('client.insurance_policy.amountInsured')" prop="amountInsured">
              <currency-input v-model="insurancePolicy.amountInsured" :symbol="currency" :placeholder="$t('client.insurance_policy.set.amountInsured')" />
            </el-form-item>
            <el-form-item :label="$t('client.insurance_policy.premiumPlan')" prop="premiumPlan">
              <el-select v-model="insurancePolicy.premiumPlan" :placeholder="$t('client.insurance_policy.set.premiumPlan')" style="width: 100%">
                <el-option v-for="item in premiumPlan" :key="item.id" :value="item.id" :label="item[language]"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('client.insurance_policy.channel')" prop="channel">
              <el-select
                v-model="insurancePolicy.channel.id"
                :remote-method="searchChannel"
                :placeholder="$t('client.insurance_policy.set.channel_name')"
                filterable
                remote
                style="width: 100%"
                @focus="onChannelFocus">
                <el-option
                  v-for="item in channels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('client.insurance_policy.agent_name')" prop="agent">
              <el-select
                v-model="insurancePolicy.agent.id"
                :remote-method="searchAgent"
                :placeholder="$t('client.insurance_policy.set.agent_name')"
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
            <el-form-item :label="$t('client.insurance_policy.company')" prop="company.id">
              <el-select
                :remote-method="searchCompany"
                :loading="companyLoading"
                v-model="insurancePolicy.company.id"
                :placeholder="$t('client.insurance_policy.set.company_name')"
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
            <el-form-item label="DDA">
              <el-checkbox v-model="insurancePolicy.dda"/>
            </el-form-item>
            <el-form-item :label="$t('client.insurance_policy.product')" prop="product" style="width: 124%;">
              <el-select
                v-model="insurancePolicy.product.id"
                :loading="productLoading"
                :remote-method="searchProduct"
                :placeholder="$t('client.insurance_policy.set.product_name')"
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
          </el-tab-pane>
          <el-tab-pane :label="$t('client.insurance_policy.beneficiary_name')" name="beneficiary">
            <el-card>
              <div slot="header" class="clearfix">
                <el-button style="float: right; padding: 3px 0" type="text" @click="addBeneficiary">{{ $t('client.insurance_policy.set.add_beneficiary') }}</el-button>
              </div>
              <div v-for="(item, index) in insurancePolicy.beneficiaries" :key="index" style="margin-bottom: 10px">
                <el-form-item
                  :rules="{ required: true, message: $t('client.insurance_policy.set.beneficiary_name'), trigger: ['blur', 'change'] }"
                  :prop="'beneficiaries.' + index + '.name'"
                  :label="$t('client.insurance_policy.beneficiary_name')"
                  class="beneficiary_form_item">
                  <el-select
                    v-model="item.name"
                    :loading="clientLoading"
                    :remote-method="searchClient"
                    value-key="id"
                    filterable
                    remote
                    style="width: 100%"
                    @focus="onClientFocus">
                    <el-option
                      v-for="item in client.list"
                      :key="item.id"
                      :value="item"
                      :label="item.name">
                      <span style="float: left; margin-right: 15px;max-width: 10em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.name }}</span><span style="float: right;">{{ item.idNumber }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('client.insurance_policy.relationship')" class="beneficiary_form_item">
                  <el-input v-model="item.relationship"/>
                </el-form-item>
                <el-form-item
                  :prop="'beneficiaries.' + index + '.percentage'"
                  :rules="{ required: true, message: $t('client.insurance_policy.set.percentage'), trigger: ['blur', 'change'] }"
                  :label="$t('client.insurance_policy.percentage')"
                  class="beneficiary_form_item">
                  <el-input v-model="item.percentage">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
                <el-button icon="el-icon-remove-outline" size="small" style="min-width: 40px; font-size: 20px; padding: 6px; vertical-align: middle;" @click="removeBeneficiary(index)"/>
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmit">{{ $t('common.submitButton') }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { policyStatus, premiumPlan } from '@/utils/constant'
import { getYearFirst, getYearLast } from '@/utils'
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
    },
    listQuery: {
      type: Object,
      default() {
        return {}
      }
    },
    year: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      language: 'en',
      policyStatus,
      activeName: 'basic',
      dialogVisible: false,
      agents: [],
      products: [],
      companies: [],
      channels: [],
      applicants: [],
      insured: [],
      currencyArray,
      premiumPlan,
      insurancePolicy: {
        number: null,
        sn: null,
        submitDate: null,
        issueDate: null,
        premiumDate: null,
        policyStatus: null,
        dda: false,
        applicant: {
          id: null,
          name: ''
        },
        beneficiaries: [],
        insured: {
          id: null,
          name: ''
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
        }
      },
      queryProduct: {
        name: '',
        company: '',
        offset: 0,
        max: 50
      },
      submitLoading: false,
      productLoading: false,
      companyLoading: false,
      applicantLoading: false,
      beneficiaryLoading: false
    }
  },
  computed: {
    ...mapState({
      clientLoading: state => state.client.clientLoading,
      client: state => state.client.clientList
      // companyLoading: state => state.company.companyLoading,
      // companies: state => state.company.companyList.list
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
      this.insurancePolicy = _.cloneDeep(this.data)
      this.products = [this.insurancePolicy.product]
      this.companies = [this.insurancePolicy.company]
      this.agents = [this.insurancePolicy.agent]
      this.channels = [this.insurancePolicy.channel]
      this.applicants = [this.insurancePolicy.applicant]
      this.insured = [this.insurancePolicy.insured]
      this.insurancePolicy.currency = this.getCurrencyKey(this.data.currency)
      this.dialogVisible = true
    },
    getCompanies(params) {
      this.companyLoading = true
      this.$api.company.fetchCompanyList(params).then(res => {
        this.companies = res.data.list
        this.companyLoading = false
      }).catch(_ => {
        this.companyLoading = false
      })
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
    addBeneficiary() {
      this.insurancePolicy.beneficiaries.push({ 'client': '', percentage: '' })
    },
    removeBeneficiary(index) {
      this.insurancePolicy.beneficiaries.splice(index, 1)
    },
    getApplicants(params) {
      this.applicantLoading = true
      this.$api.client.fetchClientList(params).then(res => {
        this.applicants = res.data.list
        this.applicantLoading = false
      }).catch(_ => {
        this.applicantLoading = false
      })
    },
    onApplicantsFocus() {
      this.getApplicants({ name: '' })
    },
    searchApplicants(query) {
      this.getApplicants({ name: query })
    },
    getBeneficiaries(params) {
      this.beneficiaryLoading = true
      this.$api.client.fetchClientList(params).then(res => {
        this.insured = res.data.list
        this.beneficiaryLoading = false
      }).catch(_ => {
        this.beneficiaryLoading = false
      })
    },
    onBeneficiariesFocus() {
      this.getBeneficiaries({ name: '' })
    },
    searchBeneficiaries(query) {
      this.getBeneficiaries({ name: query })
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
      this.queryProduct.sort = 'localizedNames'
      this.queryProduct.order = 'asc'
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
          data.insured = this.insurancePolicy.insured.id
          data.channel = this.insurancePolicy.channel.id
          data.product = this.insurancePolicy.product.id
          data.agent = this.insurancePolicy.agent.id
          const beneficiaries = []
          data.beneficiaries.forEach(item => {
            let client = item.id
            if (typeof (item.name) === 'object') {
              client = item.name.id
            }
            beneficiaries.push({ client, percentage: item.percentage, relationship: item.relationship })
          })
          data.beneficiaries = beneficiaries
          delete data.riderBenefits
          this.$api.client.editInsurancePolicy(this.insurancePolicy.id, data).then(_ => {
            this.$message({
              message: this.$t('common.success'),
              type: 'success',
              duration: 5 * 1000
            })
            const offset = (this.listQuery.page - 1) * this.listQuery.limit
            const max = this.listQuery.limit
            let params = { sort: 'sn,submitDate', order: 'asc,asc', max, offset }
            if (this.year) {
              const geSubmitDate = getYearFirst(this.year)
              const leSubmitDate = getYearLast(this.year)
              params = Object.assign({ geSubmitDate, leSubmitDate, ...params })
            }
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
    .el-form-item__content {
      width: 65%;
    }
    .beneficiary_form_item {
      .el-form-item__label {
        width: 70px!important;
      }
      width: 30%;
    }
    .el-card__header {
      padding: 10px 20px;
      margin-bottom: 10px;
    }
  }

</style>
