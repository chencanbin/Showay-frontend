<template>
  <span>
    <el-button :loading="loading" type="text" icon="el-icon-edit" size="mini" style="margin-right: 10px" @click="initForm">编辑</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="编辑公司"
      width="500px">
      <el-form ref="company" :model="company" :rules="rule" label-width="120px">
        <el-form-item label="公司名(英文)" prop="en">
          <el-input v-model="company.en"/>
        </el-form-item>
        <el-form-item label="公司名(中文)" prop="zh">
          <el-input v-model="company.zh"/>
        </el-form-item>
        <el-form-item label="公司缩写" prop="acronym">
          <el-input v-model="company.acronym"/>
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
  </span>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-dragDialog'
export default {
  directives: { elDragDialog },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogVisible: false,
      company: {
        acronym: '',
        secondary: false,
        en: '',
        zh: ''
      },
      rule: {
        en: [{ required: true, message: '公司名(英文)必须填', trigger: 'blur' }],
        zh: [{ required: true, message: '公司名(中文)必须填', trigger: 'blur' }],
        acronym: [{ required: true, message: '公司缩写必须填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    initForm() {
      this.$api.company.getCompany(this.id).then(res => {
        this.company.acronym = res.data.acronym
        this.company.secondary = res.data.secondary
        this.company.en = res.data.en
        this.company.zh = res.data.zh
        this.dialogVisible = true
      })
    },
    handleClose() {
      this.$refs['company'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['company'].validate((valid) => {
        if (valid) {
          this.$api.company.editCompany(this.id, this.company).then(_ => {
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
