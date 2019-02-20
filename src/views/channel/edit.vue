<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">{{ this.$t('action.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('user.dialog_title.edit')"
      width="500px">
      <el-form ref="account" :model="account" :rules="ruleAccount" label-width="80px">
        <el-form-item :label="$t('user.form_label.name')" prop="name">
          <el-input v-model="account.name"/>
        </el-form-item>
        <el-form-item label="上级" prop="superior">
          <el-select
            v-model="account.superior"
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
import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-dragDialog'

export default {
  directives: { elDragDialog },
  props: {
    users: {
      type: Array,
      default() {
        return []
      }
    },
    user: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      account: {
        id: '',
        name: '',
        login: '',
        superior: ''
      },
      dialogVisible: false,
      ruleAccount: {
        name: [{ required: true, message: '姓名必须填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    initForm() {
      this.$api.user.fetchUserList({ nid: this.user.id, role: 2 }).then(res => {
        this.users = res.data.list
      })
      this.account.id = this.user.id
      this.account.name = this.user.name
      this.dialogVisible = true
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
            this.$store.dispatch('FetchUserList', { role: 2 })
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
