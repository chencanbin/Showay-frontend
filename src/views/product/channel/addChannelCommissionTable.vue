<template>
  <el-col :span="24" style="margin-bottom: 10px; margin-top: 10px">
    <!--<div class="el-table-add-row" @click="initForm"><span style="font-size: 12px">+ 添加渠道佣金策略</span></div>-->
    <el-button class="el-table-add-row" plain type="primary" size="mini" style="height: 40px" @click="initForm" >+ 添加渠道佣金策略</el-button>
    <!--<el-button :loading="loading" type="primary" size="small" icon="el-icon-plus" @click="initForm">添加</el-button>-->
    <el-dialog
      id="createChannelCommissionTableDialog"
      :visible="dialogVisible"
      :before-close="handleClose"
      :fullscreen="true"
      center
      title="添加渠道佣金策略">
      <el-table id="createChannelCommissionTable" :data="policies" :max-height="tableHeight" stripe row-key="id">
        <!-- <el-table-column
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
          </template>
        </el-table-column>
        <el-table-column prop="term" label="年期" width="60" align="center"/>
        <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" width="70" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.conditions[index] ? scope.row.conditions[index].ratio + '%' : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remarks" align="center" min-width="150"/>
        <el-table-column :label="$t('common.action')" width="80" align="center">
          <template slot-scope="scope">
            <el-button :loading="loading" type="text" size="small" icon="el-icon-delete" @click="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <addPolicy @addPolicy="onAddPolicy"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="timeDialogVisible = true">保存策略</el-button>
      </div>
      <!-- 佣金生效时间弹框 -->
      <el-dialog
        :visible.sync="timeDialogVisible"
        width="300px"
        title="渠道佣金生效时间 / 备注"
        append-to-body>
        <el-form ref="configForm" label-width="80px">
          <el-form-item label="生效时间">
            <el-date-picker
              v-model="effectiveDate"
              type="datetime"
              value-format="timestamp"
              style="width: 100%"/>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="remarks" placeholder="请输入备注"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button :loading="saveLoading" type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </el-col>
</template>
<script type="text/ecmascript-6">
import addPolicy from './addPolicy'
import Sortable from 'sortablejs'
import prefixSelect from './component/prefixSelect'
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
    }
  },
  data() {
    return {
      effectiveDate: '',
      originalPolicies: [],
      policies: [],
      tableHeight: window.screen.height - 320,
      companies: [],
      products: [],
      columnYear: [],
      dialogVisible: false,
      timeDialogVisible: false,
      buttonLoading: false,
      remarks: '',
      saveLoading: false,
      loading: false
    }
  },
  methods: {
    initForm() {
      this.policies = []
      this.effectiveDate = (new Date()).valueOf()
      this.dialogVisible = true
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
          this.columnYear.push('15年之后')
        } else {
          this.columnYear.push('第' + item + '年')
        }
      })
    },
    handleClose() {
      this.$confirm('是否需要关闭次页面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.remarks = ''
        this.timeDialogVisible = false
        this.dialogVisible = false
      })
    },
    handleSubmit() {
      this.saveLoading = true
      // 处理companies 和 products 字段, 只提交id的数组
      const data = _.cloneDeep(this.originalPolicies)
      _.forEach(data, item => {
        const products = []
        const companies = []
        _.forEach(item.products, product => {
          products.push(product.id)
        })
        _.forEach(item.companies, company => {
          companies.push(company.id)
        })
        item.products = products
        item.companies = companies
      })
      this.$api.channel.createChannelCommissionPolicy({ channel: this.id, policies: data, effectiveDate: this.effectiveDate, remarks: this.remarks }).then(res => {
        this.dialogVisible = false
        this.timeDialogVisible = false
        this.saveLoading = false
        this.$store.dispatch('client/FetchChannelCommissionTable', { channel: this.id })
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
    onAddPolicy(result) {
      // clone 添加的策略对象, 并添加到原始数据的数组中
      const originalResult = _.cloneDeep(result)
      this.originalPolicies.push(originalResult)
      this.policies.push(result)
      this.formatterData(this.policies)
      this.rowDrop()
    },
    // 行拖拽函数
    rowDrop() {
      const tbody = document.querySelector('#createChannelCommissionTable .el-table__body-wrapper tbody')
      console.log(tbody)
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
    },
    getUsers(param) {
      const role = { role: 2 }
      if (param) {
        param.role = role
      } else {
        param = role
      }
      this.$store.dispatch('FetchUserList', param)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">

</style>
