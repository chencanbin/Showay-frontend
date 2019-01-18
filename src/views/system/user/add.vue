<template>
  <span>
    <el-row style="margin-bottom: 10px">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="initForm">添加</el-button>
    </el-row>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="添加账号"
      width="500px">
      <el-form ref="account" :model="account" :rules="ruleAccount" label-width="80px">
        <el-form-item label="账号" prop="name">
          <el-input v-model="account.name"/>
        </el-form-item>
        <el-form-item label="姓名" prop="login">
          <el-input v-model="account.login"/>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select
            v-model="account.roles"
            placeholder="请选择账户角色"
            multiple
            style="width: 100%">
            <el-option
              v-for="item in roles"
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
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      roles: [],
      dialogVisible: false,
      account: {
        name: '',
        login: '',
        roles: []
      },
      ruleAccount: {
        name: [{ required: true, message: '姓名必须填', trigger: 'blur' }],
        login: [{ required: true, message: '账号必须填', trigger: 'blur' }],
        roles: [{ required: true, message: '角色必须选', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    initForm() {
      this.$api.role.fetchRoleList().then(res => {
        this.roles = res.data.list
        this.dialogVisible = true
      })
    },
    handleClose() {
      this.$refs['account'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['account'].validate((valid) => {
        if (valid) {
          this.$api.user.addUser(this.account).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('FetchUserList')
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
