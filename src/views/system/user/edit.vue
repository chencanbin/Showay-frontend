<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-edit" @click="initForm">{{ this.$t('action.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="编辑渠道"
      width="500px"
      append-to-body>
      <el-form ref="account" :model="account" :rules="ruleAccount" label-width="80px">
        <el-form-item :label="$t('user.form_label.name')" prop="name">
          <el-input v-model="account.name"/>
        </el-form-item>
        <el-form-item label="缩写" prop="acronym">
          <el-input v-model="account.acronym"/>
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
        <el-form-item v-if="isChannel" label="上级" prop="superior">
          <el-select
            v-model="account.superior"
            clearable
            placeholder="请选择账户上级"
            style="width: 100%">
            <el-option
              v-for="item in users"
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
import elDragDialog from '@/directive/el-dragDialog'
export default {
  directives: { elDragDialog },
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
      loading: false,
      roles: [],
      users: [],
      account: {
        id: '',
        name: '',
        login: '',
        acronym: '',
        superior: '',
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
    isChannel() {
      if (this.account.roles.includes(2)) {
        return true
      }
      return false
    }
  },
  methods: {
    initForm() {
      this.$api.user.fetchUserList({ nid: this.user.id, role: 2 }).then(res => {
        this.users = res.data.list
        if (this.user.superior) {
          this.account.superior = this.user.superior.id
          // this.account.superiorCommissionRate = _.toNumber(this.user.superior.superiorCommissionRate).toFixed(2)
        }
      })
      // 初始化参数，将传进来的对象字段复制给account
      this.user.roles.forEach(item => {
        this.account.roles.push(item.id)
      })
      this.account.id = this.user.id
      this.account.name = this.user.name
      this.account.acronym = this.user.acronym
      this.account.superior = this.user.superior
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
          this.loading = true
          this.$api.user.editUser(this.account.id, this.account).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('FetchUserList')
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
