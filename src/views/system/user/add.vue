<template>
  <el-col span.number="24" class="el-table-add-col">
    <div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('user.dialog_title.add')"
      width="500px">
      <el-form ref="account" :model="account" :rules="ruleAccount" label-width="80px">
        <el-form-item :label="$t('user.form_label.name')" prop="name">
          <el-input v-model="account.name"/>
        </el-form-item>
        <el-form-item :label="$t('user.form_label.account')" prop="login">
          <el-input v-model="account.login"/>
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
  </el-col>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-dragDialog'

export default {
  directives: { elDragDialog },
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
