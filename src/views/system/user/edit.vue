<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">{{ this.$t('action.edit') }}</el-button>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('user.dialog_title.edit')"
      width="500px">
      <el-form ref="account" :model="account" :rules="ruleAccount" label-width="80px">
        <el-form-item :label="$t('user.form_label.name')" prop="name">
          <el-input v-model="account.name"/>
        </el-form-item>
        <el-form-item :label="$t('user.form_label.role')" prop="roles">
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
  props: {
    user: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      roles: [],
      account: {
        id: '',
        name: '',
        login: '',
        roles: []
      },
      dialogVisible: false,
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
      // 初始化参数，将传进来的对象字段复制给account
      this.user.roles.forEach(item => {
        this.account.roles.push(item.id)
      })
      this.account.id = this.user.id
      this.account.name = this.user.name
      // 调用roles接口拿到所有权限
      this.$api.role.fetchRoleList().then(res => {
        this.roles = res.data.list
        this.dialogVisible = true
      })
    },
    handleClose() {
      this.account = { roles: [] }
      this.$refs['account'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['account'].validate((valid) => {
        if (valid) {
          this.$api.user.editUser(this.account.id, this.account).then(_ => {
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
