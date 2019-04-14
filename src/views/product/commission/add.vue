<template>
  <el-col span.number="24" class="el-table-add-col">
    <div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>
    <!--<el-button :loading="loading" type="primary" size="small" icon="el-icon-plus" @click="initForm">添加</el-button>-->
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="添加佣金表"
      width="500px">
      <el-form ref="commission" :model="commission" :rules="rule" label-width="100px">
        <el-form-item label="供应商:" prop="companyId">
          <el-select
            ref="company"
            v-model="commission.companyId"
            :remote-method="remoteSearch"
            placeholder="请选择供应商"
            remote
            filterable
            style="width: 100%;"
            @change="onCompanyChange">
            <el-option
              v-for="company in companyList"
              :key="company.id"
              :value="company.id"
              :label="company.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="佣金模板:" prop="template">
          <el-select
            ref="commissionTableList"
            v-model="commission.template"
            placeholder="请选择佣金模板(不选默认创建空白佣金表)"
            clearable
            style="width: 100%;">
            <el-option
              v-for="commissionTable in commissionTableList"
              :key="commissionTable.id"
              :value="commissionTable.id"
              :label="getFormattedDate(commissionTable.effectiveDate)"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="commission.template" label="生成佣金率:" prop="generateRates">
          <el-checkbox v-model="commission.generateRates"/>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-radio-group v-model="commission.template" style="margin-left: 70px">-->
        <!--<el-radio :label="false">以最新佣金表为模板</el-radio>-->
        <!--<el-radio :label="true">空白佣金表</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import elDragDialog from '@/directive/el-dragDialog'
import { parseTime } from '@/utils'

export default {
  directives: { elDragDialog },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      commission: {
        companyId: '',
        template: '',
        generateRates: false
      },
      commissionTableList: [],
      rule: {
        companyId: [{ required: true, message: '请选择供应商', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      companyList: state => state.company.companyList.list
    })
  },
  methods: {
    initForm() {
      this.$store.dispatch('company/FetchCompanyList', {})
      this.dialogVisible = true
    },
    getCommissionTableList(id, params) {
      this.$api.commission.fetchCommissionTableList(id, params).then(res => {
        this.commissionTableList = res.data.list
      })
    },
    remoteSearch(query) {
      this.$store.dispatch('company/FetchCompanyList', { name: query })
    },
    getFormattedDate(value) {
      if (isNaN(value)) {
        return value
      }
      return parseTime(value, '{y}-{m}-{d}')
    },
    onCompanyChange() {
      this.getCommissionTableList('', { company: this.commission.companyId, neStatus: 0 })
    },
    handleClose() {
      this.$refs['commission'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['commission'].validate((valid) => {
        if (valid) {
          this.loading = true
          const data = { company: this.commission.companyId }
          if (this.commission.template || this.commission.template === 0) {
            data.template = this.commission.template
          }
          if (this.commission.generateRates) {
            data.generateRates = this.commission.generateRates
          }
          this.$api.commission.addCommission(data).then(res => {
            this.$emit('afterAddCommissionTable', res.data.id, this.commission.companyId)
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('commission/FetchCommissionTableList', { id: this.commission.companyId })
            this.handleClose()
            this.loading = false
          }).catch(_ => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
