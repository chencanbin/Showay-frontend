<template>
  <span style="margin-right: 5px">
    <el-button icon="el-icon-setting" type="text" size="mini" style="margin-left: 5px" @click="initForm" >
      佣金策略
    </el-button>
    <el-dialog
      id="channelCommissionTableDialog"
      :visible="dialogVisible"
      :before-close="handleClose"
      :fullscreen="true"
      center
      title="编辑渠道佣金策略">
      <el-table id="channelCommissionTable" :data="policies" :max-height="tableHeight" stripe row-key="id">
        <!--<el-table-column
          label="优先级"
          type="index"
          width="80">
        </el-table-column>-->
        <el-table-column label="公司 / 产品" prop="name" min-width="300">
          <template slot-scope="scope">
            <el-tag v-for="product in scope.row.products" :key="product.id" type="warning" style="margin-right: 10px; margin-bottom: 5px">{{ product.name }}</el-tag>
            <el-tag v-for="company in scope.row.companies" :key="company.id" style="margin-right: 10px; margin-bottom: 5px; color:#409EFF; background-color: rgba(64, 158, 255, 0.1); border: 1px solid rgba(64, 158, 255, 0.2)">{{ company.name }}</el-tag>
            <el-tag v-if="!scope.row.products && !scope.row.companies" type="success">ALL</el-tag>
            <el-tag v-if="scope.row.products && scope.row.companies && scope.row.products.length === 0 && scope.row.companies.length === 0" type="success">ALL</el-tag>
            <!--<el-tag v-if="scope.row.products.length === 0 && scope.row.companies.length === 0" type="success">ALL</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column prop="term" label="年期" width="60" align="center"/>
        <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" width="70" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.conditions[index] ? formatterNumber(scope.row.conditions[index].commissionRate) + '%' : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center" min-width="150"/>
        <el-table-column :label="$t('common.action')">
          <template slot-scope="scope">
            <el-button :loading="loading" type="text" size="small" icon="el-icon-delete" @click="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <addPolicy @addPolicy="onAddPolicy"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">保存</el-button>
      </div>
      <!-- 佣金生效时间弹框 -->
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import addPolicy from './addCommissionPolicy'
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
    },
    effectiveDate: {
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
      originalPolicies: [],
      policies: [],
      tableHeight: window.screen.height - 320,
      companies: [],
      products: [],
      columnYear: [],
      fullscreen: true,
      dialogVisible: false,
      configButtonLoading: false
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    initForm() {
      this.$api.commission.fetchCommissionPolicy({ channel: this.id }).then(res => {
        this.originalPolicies = _.cloneDeep(res.data.list)
        this.formatterData(res.data.list)
        this.dialogVisible = true
        this.$nextTick(() => {
          this.rowDrop()
        })
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
        this.dialogVisible = false
      })
    },
    handleSubmit() {
      this.configButtonLoading = true
      // 处理companies 和 products 字段, 只提交id的数组
      console.log(this.originalPolicies)
      _.forEach(this.originalPolicies, item => {
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
      this.$api.commission.editCommissionPolicy({ channel: this.id, policies: this.originalPolicies }).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.dialogVisible = false
        this.configButtonLoading = false
      }).catch(_ => {
        this.configButtonLoading = false
      })
    },

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
    },
    formatterNumber(val) {
      return Number(val).toFixed(2)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">

</style>
