<template>
  <span>
    <el-row style="margin-bottom: 10px">
      <el-button :loading="loading" type="primary" size="small" icon="el-icon-plus" @click="initForm">添加</el-button>
    </el-row>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="添加公司"
      width="500px">
      <el-form ref="company" :model="company" :rules="rule" label-width="120px">
        <el-form-item label="公司名(英文)" prop="en">
          <el-input v-model="company.en"/>
        </el-form-item>
        <el-form-item label="公司名(中文)" prop="zhCN">
          <el-input v-model="company.zhCN"/>
        </el-form-item>
        <el-form-item label="公司缩写" prop="acronym">
          <el-input v-model="company.acronym"/>
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
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      dialogVisible: false,
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
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    initForm() {
      this.dialogVisible = true
    },
    handleClose() {
      this.$refs['company'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['company'].validate((valid) => {
        if (valid) {
          const data = { acronym: '', localizedNames: [] }
          data.acronym = this.company.acronym
          data.localizedNames.push({ name: this.company.en, locale: 'en' })
          data.localizedNames.push({ name: this.company.zhCN, locale: 'zh_CN' })
          this.$api.company.addCompany(data).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('company/FetchCompanyList')
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
