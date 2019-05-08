<template>
  <span>
    <el-button icon="el-icon-setting" type="text" size="small" @click="initForm" >
      {{ $t('common.edit') }}
    </el-button>
    <el-dialog
      id="channelCommissionTableDialog"
      :visible="dialogVisible"
      :before-close="handleClose"
      :fullscreen="true"
      :title="title"
      center
      append-to-body>
      <el-table v-loading="loading" id="channelCommissionTable" :data="policies" :max-height="tableHeight" stripe row-key="id">
        <!--<el-table-column
          label="优先级"
          type="index"
          width="80">
        </el-table-column>-->
        <el-table-column label="公司 / 产品" prop="name" min-width="300">
          <template slot-scope="scope">
            <el-tag v-for="product in scope.row.products" :key="product.id" style="margin-right: 10px; margin-bottom: 5px">{{ product.name }}</el-tag>
            <el-tag v-for="company in scope.row.companies" :key="company.id" style="margin-right: 10px; margin-bottom: 5px; color:#409EFF; background-color: rgba(64, 158, 255, 0.1); border: 1px solid rgba(64, 158, 255, 0.2)">{{ company.name }}</el-tag>
            <el-tag v-if="!scope.row.products && !scope.row.companies" type="success">ALL</el-tag>
            <el-tag v-if="scope.row.products && scope.row.companies && scope.row.products.length === 0 && scope.row.companies.length === 0" type="success">ALL</el-tag>
            <!--<el-tag v-if="scope.row.products.length === 0 && scope.row.companies.length === 0" type="success">ALL</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column prop="term" label="年期" width="60" align="center"/>
        <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" width="90" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.conditions[index] ? scope.row.conditions[index].ratio + '%' : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center" min-width="150"/>
        <el-table-column :label="$t('common.action')">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-delete" @click="deleteRow(scope.$index)">{{ $t('common.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <addPolicy @addPolicy="onAddPolicy"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="timeDialogVisible = true">{{ $t('common.submitButton') }}</el-button>
      </div>
      <!-- 佣金生效时间弹框 -->
      <el-dialog
        :visible.sync="timeDialogVisible"
        :title="$t('product.channel.set.save_dialog_title')"
        width="400px"
        append-to-body>
        <el-form ref="configForm" label-width="80px">
          <el-form-item :label="$t('product.channel.set.effectiveDate')">
            <el-date-picker
              v-model="effectiveDate"
              type="datetime"
              value-format="timestamp"
              style="width: 100%"/>
          </el-form-item>
          <el-form-item :label="$t('common.remarks')" prop="remarks">
            <el-input v-model="remarks" :placeholder="$t('common.remarks_placeholder')"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button :loading="saveLoading" type="primary" @click="handleSubmit">{{ this.$t('common.confirmButton') }}</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import addPolicy from './addPolicy'
import Sortable from 'sortablejs'
import { parseTime } from '@/utils'
import prefixSelect from './component/prefixSelect'
import { numberAcronym } from '@/utils/constant'
import Cookies from 'js-cookie'
const _ = require('lodash')
export default {
  components: {
    prefixSelect,
    addPolicy
  },
  props: {
    id: {
      type: Number,
      default() {
        return 0
      }
    },
    effectiveDate: {
      type: Number,
      default() {
        return 0
      }
    },
    channelName: {
      type: String,
      default() {
        return ''
      }
    },
    channelId: {
      type: Number,
      default() {
        return 0
      }
    },
    remarks: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      title: '',
      originalPolicies: [],
      policies: [],
      tableHeight: window.screen.height - 320,
      companies: [],
      products: [],
      columnYear: [],
      fullscreen: true,
      dialogVisible: false,
      timeDialogVisible: false,
      saveLoading: false,
      loading: false
    }
  },
  // mounted () {
  //   this.rowDrop()
  // },

  methods: {
    initForm() {
      this.title = `${this.$t('product.channel.set.edit_title')} - ${this.channelName} ( ${parseTime(this.effectiveDate, '{y}-{m}-{d}')} )`
      this.loading = true
      this.dialogVisible = true
      this.$api.channel.fetchChannelCommissionPolicy(this.id).then(res => {
        this.originalPolicies = _.cloneDeep(res.data.policies)
        this.formatterData(res.data.policies)
        this.$nextTick(() => {
          this.rowDrop()
        })
        this.loading = false
      }).catch(_ => {
        this.loading = false
      })
    },

    // 格式化策略数据, 原始策略数据的conditions 只提供缩减版的数组，需要将数据进行展开
    formatterData(policies) {
      const conditionLengthArray = []
      this.columnYear = []
      _.forEach(policies, item => {
        const conditionsOriginalSize = item.conditions.length
        const lastCondition = item.conditions[conditionsOriginalSize - 1]
        for (let i = 0; i < item.term - conditionsOriginalSize; i++) {
          item.conditions.push(lastCondition)
        }
        conditionLengthArray.push(item.conditions.length)
      })
      this.policies = policies
      _.forEach(_.range(1, _.max(conditionLengthArray) + 1), item => {
        if (item > 15) {
          this.columnYear.push(this.$t('common.after_15_year'))
        } else {
          if (Cookies.get('language') === 'en') {
            this.columnYear.push(this.$t('common.year', [numberAcronym[item - 1]]))
          } else {
            this.columnYear.push(this.$t('common.year', [item]))
          }
        }
      })
    },
    handleClose() {
      this.$confirm(this.$t('common.tooltip.close'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.confirmButton'),
        cancelButtonText: this.$t('common.cancelButton'),
        type: 'warning'
      }).then(() => {
        this.dialogVisible = false
      })
    },
    handleSubmit() {
      this.saveLoading = true
      //  处理companies 和 products 字段, 只提交id的数组
      const data = _.cloneDeep(this.originalPolicies)
      _.forEach(data, function(item) {
        const products = []
        const companies = []
        _.forEach(item.products, function(product) {
          products.push(product.id)
        })
        _.forEach(item.companies, function(company) {
          companies.push(company.id)
        })
        item.products = products
        item.companies = companies
      })
      this.$api.channel.editChannelCommissionPolicy(this.id, { policies: data, effectiveDate: this.effectiveDate, remarks: this.remarks }).then(res => {
        this.dialogVisible = false
        this.timeDialogVisible = false
        this.saveLoading = false
        this.$store.dispatch('client/FetchChannelCommissionTable', { channel: this.channelId })
      }).catch(_ => {
        this.saveLoading = false
      })
    },
    getProducts(params) {
      this.$api.product.fetchProductList().then(res => {
        this.products = res.data.list
      })
    },
    getCompanies(params) {
      this.$api.company.fetchCompanyList(params).then(res => {
        this.companies = res.data.list
      })
    },
    // searchProduct(query) {
    //   console.log(query)
    //   this.$api.product.fetchProductList({name: query}).then(res => {
    //     return res.data.list
    //   })
    // },
    // searchCompany(query) {
    //   this.$api.company.fetchCompanyList({name: query}).then(res => {
    //     return res.data.list
    //   })
    // },
    onAddPolicy(result) {
      // clone 添加的策略对象, 并添加到原始数据的数组中
      const originalResult = _.cloneDeep(result)
      this.originalPolicies.push(originalResult)
      this.policies.push(result)
      this.formatterData(this.policies)
    },
    // 行拖拽函数
    rowDrop() {
      const tbody = document.querySelector('#channelCommissionTable .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const oldRow = _this.policies[oldIndex]
          const newRow = _this.policies[newIndex]
          _this.policies[newIndex] = oldRow
          _this.policies[oldIndex] = newRow
          _this.originalPolicies = _.cloneDeep(_this.policies)
        }
      })
    },
    deleteRow(index) {
      this.policies.splice(index, 1)
      this.originalPolicies = _.cloneDeep(this.policies)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">

</style>
