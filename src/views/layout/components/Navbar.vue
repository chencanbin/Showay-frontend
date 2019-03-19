<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip
          :content="$t('navbar.screenfull')"
          effect="dark"
          placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip
          :content="$t('navbar.size')"
          effect="dark"
          placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>
        <div style="display: inline-block;width: 1px;height: 25px; background: rgb(216, 208, 208); margin-bottom: 8px; margin-right: 5px "/>
        <!--<lang-select class="international right-menu-item"/>-->

      <!--<el-tooltip-->
        <!--:content="$t('navbar.theme')"-->
        <!--effect="dark"-->
        <!--placement="bottom">-->
        <!--<theme-picker class="theme-switch right-menu-item"/>-->
      <!--</el-tooltip>-->
      </template>
      <!--<el-tooltip-->
      <!--effect="dark"-->
      <!--content="用户头像"-->
      <!--placement="bottom">-->
      <!--<img-->
      <!--class="top-bar__img"-->
      <!--src="../../../assets/images/admin.png">-->
      <!--</el-tooltip>-->
      <el-dropdown class="avatar-container right-menu-item">
        <span class="el-dropdown-link">
          {{ name }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="handleOpenUpdateUserDialog">
              <svg-icon icon-class="password" style="margin-right: 5px"/>修改密码
            </span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <svg-icon icon-class="logout" style="margin-right: 5px"/>退出系统
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      :visible="showEditPasswordDialog"
      title="修改管理员密码"
      width="400px"
      class="passwordDialog"
      @close="handleCloseUpdateUserDialog">
      <el-form ref="password" :rules="rulePassword" :model="form" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码"/>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model.trim="form.password" type="password" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirm">
          <el-input v-model.trim="form.password_confirm" type="password" placeholder="请确认新密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseUpdateUserDialog">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleUpdatePassword">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import sha256 from 'sha256'
import { getUserId } from '@/utils/auth'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      showEditPasswordDialog: false,
      form: {
        oldPassword: '',
        password: ''
      },
      rulePassword: {
        oldPassword: [{ required: true, message: '旧密码必须填', trigger: 'blur' }],
        password: [{ required: true, message: '新密码必须填', trigger: 'blur' }],
        password_confirm: [{ required: true, message: '密码确认必须填', trigger: 'blur' }, { validator: validatePass, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    handleCloseUpdateUserDialog() {
      this.showEditPasswordDialog = false
    },
    handleOpenUpdateUserDialog() {
      this.showEditPasswordDialog = true
    },
    handleUpdatePassword() {
      this.$refs['password'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.form)
          data.oldPassword = sha256(this.form.oldPassword)
          data.password = sha256(this.form.password)
          this.loading = true
          const id = getUserId()
          this.$api.user.editUser(id, data).then(res => {
            this.loading = false
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.logout()
            this.handleCloseUpdateUserDialog()
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped type="text/scss">
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  border-bottom: solid 1px #ccc;
  box-shadow: 7px -7px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      top: -15px;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-left: 0;
      margin-right: 10px;
      vertical-align: text-bottom;
    }
    .top-bar__img {
      padding: 2px;
      width: 40px;
      height: 40px;
      border-radius: 100%;
      box-sizing: border-box;
      border: 1px solid #eee;
      vertical-align: baseline;
    }
  }

  .transverse {
    border-right: solid 1px #ccc;
    height: 50px;
    line-height: 50px;
  }
}
</style>
