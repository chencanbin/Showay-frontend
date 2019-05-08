<template>
  <el-col span.number="24" class="el-table-add-col">
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>-->
    <el-button class="el-table-add-row" plain type="primary" @click="initForm">+ {{ $t('common.add') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('user.set.add_channel_title')"
      width="500px">
      <el-form ref="account" :model="account" :rules="ruleAccount" label-width="100px">
        <el-form-item :label="$t('user.set.name')" prop="name">
          <el-input v-model="account.name"/>
        </el-form-item>
        <el-form-item :label="$t('user.set.account')" prop="login">
          <el-input v-model="account.login"/>
        </el-form-item>
        <el-form-item :label="$t('user.set.superior')" prop="superior">
          <el-select
            v-model="account.superior"
            :placeholder="$t('user.set.superior_placeholder')"
            clearable
            style="width: 100%">
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      <!--<el-form-item v-if="account.superior" label="上级佣金率" prop="superiorCommissionRate">-->
        <!--<el-input v-if="account.superior" v-model.number="account.superiorCommissionRate">-->
        <!--<template slot="append">%</template>-->
        <!--</el-input>-->
      <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">{{ $t('common.submitButton') }}</el-button>
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
      loading: false,
      users: [],
      dialogVisible: false,
      account: {
        name: '',
        login: '',
        roles: [2],
        superior: null
        // superiorCommissionRate: null
      },
      ruleAccount: {
        name: [{ required: true, message: '姓名必须填', trigger: 'blur' }],
        login: [{ required: true, message: '账号必须填', trigger: 'blur' }]
        // superiorCommissionRate: [
        //   { required: true, message: '上级佣金率必须选', trigger: 'blur' },
        //   { type: 'number', message: '上级佣金率必须为数字', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    initForm() {
      this.$api.user.fetchUserList({ role: 2 }).then(res => {
        this.users = res.data.list
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
          this.loading = true
          this.$api.user.addUser(this.account).then(_ => {
            this.$message({
              message: this.$t('common.success'),
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('FetchUserList', { role: 2 })
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
