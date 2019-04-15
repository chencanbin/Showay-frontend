<template>
  <el-col :span="24" class="el-table-add-col">
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>-->
    <el-button class="el-table-add-row" plain type="primary" @click="initForm">+ 添加</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="添加公司"
      width="500px">
      <el-form ref="company" :model="company" :rules="rule" label-width="120px">
        <el-form-item label="公司名(英文)" prop="en">
          <el-input ref="en" v-model="company.en" autofocus/>
        </el-form-item>
        <el-form-item label="公司名(中文)" prop="zhCN">
          <el-input v-model="company.zhCN"/>
        </el-form-item>
        <el-form-item label="公司缩写" prop="acronym">
          <el-input v-model="company.acronym"/>
        </el-form-item>
        <el-form-item label="签约时间" prop="contractEffectiveDate">
          <el-date-picker
            v-model="company.contractEffectiveDate"
            type="date"
            value-format="timestamp"
            style="width: 100%"/>
        </el-form-item>
        <el-form-item label="二级供应商" prop="secondary">
          <el-switch
            v-model="company.secondary"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>

<script type="text/ecmascript-6">
import elDragDialog from '@/directive/el-dragDialog'

export default {
  directives: { elDragDialog },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      company: {
        names: {}
      },
      rule: {
        en: [{ required: true, message: '公司名(英文)必须填', trigger: 'blur' }],
        zhCN: [{ required: true, message: '公司名(中文)必须填', trigger: 'blur' }],
        acronym: [{ required: true, message: '公司缩写必须填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    initForm() {
      this.dialogVisible = true
      this.$nextTick(function() {
        this.$refs['en'].focus()
      })
    },
    handleClose() {
      this.$refs['company'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['company'].validate((valid) => {
        if (valid) {
          this.loading = true
          const data = { acronym: '', localizedNames: [] }
          data.acronym = this.company.acronym
          data.secondary = this.company.secondary
          data.contractEffectiveDate = this.company.contractEffectiveDate
          data.localizedNames.push({ name: this.company.en, locale: 'en' })
          data.localizedNames.push({ name: this.company.zhCN, locale: 'zh_CN' })
          this.$api.company.addCompany(data).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('company/FetchCompanyList')
            this.loading = false
            this.handleClose()
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
