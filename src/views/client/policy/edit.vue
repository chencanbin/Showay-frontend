<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">{{ this.$t('action.edit') }}</el-button>
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
          <el-select v-model="insurancePolicy.applicant.id" placeholder="请选择申请人" filterable style="width: 100%">
            <el-option
              v-for="item in client.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="受益人:" prop="beneficiary.name">
          <el-select v-model="insurancePolicy.beneficiary.id" placeholder="请选择申请人" filterable style="width: 100%">
            <el-option
              v-for="item in client.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
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
          <el-input v-model.number="insurancePolicy.premium"/>
        </el-form-item>
        <el-form-item label="保额:" prop="premium">
          <el-input v-model.number="insurancePolicy.amountInsured"/>
        </el-form-item>
        <el-form-item label="渠道:" prop="channel">
          <el-select v-model="insurancePolicy.channel.id" placeholder="请选择渠道" filterable style="width: 100%">
            <el-option
              v-for="item in channels.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="签单员:" prop="agent">
          <el-select v-model="insurancePolicy.agent.id" placeholder="请选择签单员" filterable style="width: 100%">
            <el-option
              v-for="item in agents"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="产品:" prop="product">
          <el-select v-model="insurancePolicy.product.id" placeholder="请选择产品" filterable style="width: 100%">
            <el-option
              v-for="item in products"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapState } from 'vuex'
import { policyStatus } from '@/utils/constant'
import elDragDialog from '@/directive/el-dragDialog'
const _ = require('lodash')
import Cookies from 'js-cookie'
export default {
  directives: { elDragDialog },
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
      currencyArray: [{
        id: 0,
        desc: 'USD'
      }, {
        id: 1,
        desc: 'HKD'
      }, {
        id: 2,
        desc: 'CNY'
      }],
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
        premium: null,
        amountInsured: null,
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
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      client: state => state.client.clientList,
      channels: state => state.user.users
    })
  },
  methods: {
    initForm() {
      this.language = Cookies.get('language') || 'en'
      this.dialogVisible = true
      this.getClient()
      this.getChannel()
      this.getAgents()
      this.getProducts()
      this.insurancePolicy = _.cloneDeep(this.data)
      this.insurancePolicy.currency = this.getCurrencyKey(this.data.currency)
      this.insurancePolicy.premium = _.toNumber(this.insurancePolicy.premium).toFixed(2)
      this.insurancePolicy.amountInsured = _.toNumber(this.insurancePolicy.amountInsured).toFixed(2)
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
    getProducts(params) {
      this.$api.product.fetchProductList().then(res => {
        this.products = res.data.list
      })
    },

    handleClose() {
      this.$refs['insurancePolicy'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['insurancePolicy'].validate((valid) => {
        if (valid) {
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
            this.handleClose()
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
