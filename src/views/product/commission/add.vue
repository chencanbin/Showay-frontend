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
      <el-form ref="commission" :model="commission" :rules="rule" label-width="120px">
        <el-form-item label="供应商:" prop="companyId">
          <el-select
            v-model="commission.companyId"
            :remote-method="remoteSearch"
            placeholder="请选择供应商"
            remote
            filterable
            style="width: 100%;">
            <el-option
              v-for="company in companyList"
              :key="company.id"
              :value="company.id"
              :label="company.name"/>
          </el-select>
        </el-form-item>
        <el-radio-group v-model="commission.template" style="margin-left: 50px">
          <el-radio :label="false">以最新佣金表为模板</el-radio>
          <el-radio :label="true">空白佣金表</el-radio>
        </el-radio-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapState } from 'vuex'
import elDragDialog from '@/directive/el-dragDialog'

export default {
  directives: { elDragDialog },
  data() {
    return {
      dialogVisible: false,
      companyId: '',
      commission: {
        companyId: '',
        template: false
      },
      rule: {
        companyId: [{ required: true, message: '请选择供应商', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({ companyList: state => state.company.companyList.list })
  },
  methods: {
    initForm() {
      this.$store.dispatch('company/FetchCompanyList', {})
      this.dialogVisible = true
    },
    remoteSearch(query) {
      this.$store.dispatch('company/FetchCompanyList', { name: query })
    },
    // companyChange() {
    //   this.$store.dispatch('company/FetchCompanyList', {})
    // },
    handleClose() {
      this.$refs['commission'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['commission'].validate((valid) => {
        if (valid) {
          const data = { company: this.commission.companyId }
          if (!this.commission.template) {
            data.template = ''
          }
          this.$api.commission.addCommission(data).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('commission/FetchCommissionTableList', {})
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
<style lang="scss" rel="stylesheet/scss">

</style>
