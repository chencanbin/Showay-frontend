<template>
  <span>
    <el-button type="text" size="mini" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">{{ this.$t('action.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="编辑保单"
      width="800px">
      <el-form
        ref="insurancePolicy"
        :model="insurancePolicy"
        :rules="rule"
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
            :loading="loading"
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
            :loading="loading"
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
        <el-form-item label="渠道:" prop="channel">
          <el-select
            v-model="insurancePolicy.channel.id"
            :loading="loading"
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
            :loading="loading"
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
        <el-form-item label="产品:" prop="product" style="width: 100%">
          <el-select
            v-model="insurancePolicy.product.id"
            :loading="loading"
            :remote-method="searchProduct"
            placeholder="请输入产品关键词"
            filterable
            remote
            style="width: 125%"
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
import { mapGetters, mapState } from 'vuex'
import { policyStatus } from '@/utils/constant'
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
      submitLoading: false,
      agents: [],
      products: [],
      channels: [],
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
      rule: {
        name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        idNumber: [{ required: true, message: '请输入证件号', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]
      },
      queryProduct: {
        name: '',
        offset: 0,
        max: 50
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      client: state => state.client.clientList
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
      this.getClient()
      this.insurancePolicy = _.cloneDeep(this.data)
      this.products = [this.insurancePolicy.product]
      this.agents = [this.insurancePolicy.agent]
      this.channels = [this.insurancePolicy.channel]
      console.log(this.channels)
      this.insurancePolicy.currency = this.getCurrencyKey(this.data.currency)
      this.dialogVisible = true
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
          data.riderBenefits = [] // 暂时不编辑副险
          this.$api.client.editInsurancePolicy(this.insurancePolicy.id, data).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('client/FetchInsurancePolicyList', {})
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
      width: 48%;
    }
    .el-form-item__content {
      width: 65%;
    }
  }
</style>
