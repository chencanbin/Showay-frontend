<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!--<error-log class="errLog-container right-menu-item"/>-->
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
        <lang-select class="international right-menu-item"/>
        <div style="display: inline-block;width: 1px;height: 25px; background: rgb(216, 208, 208); margin-bottom: 8px; margin-right: 5px "/>
        <!--<el-tooltip-->
        <!--:content="$t('navbar.theme')"-->
        <!--effect="dark"-->
        <!--placement="bottom">-->
        <!--<theme-picker class="theme-switch right-menu-item"/>-->
        <!--</el-tooltip>-->
      </template>
      <el-tooltip
        content="首页配置"
        effect="dark"
        placement="bottom">
        <div class="setting_class right-menu-item">
          <svg-icon icon-class="setting" @click="showHomePageSetting = true"/>
        </div>
      </el-tooltip>
      <el-badge :hidden="credit.total + payment.total === 0" :value="credit.total + payment.total" :max="99" style="right: 12px">
        <el-popover width="150" trigger="click">
          <div v-if="hasPermission(100055)" class="notification-list-item">
            <a @click="handleCreditClick">
              <svg-icon icon-class="earning" class-name="icon-earning" />
              {{ credit.desc }}
              <div class="notification-badge-content">
                {{ credit.total }}
              </div>
            </a>
          </div>
          <div v-if="hasPaymentStatuses(130000)" class="notification-list-item">
            <a @click="handlePaymentClick">
              <svg-icon icon-class="paymentSum" class-name="icon-payment" />
              {{ payment.desc }}
              <div class="notification-badge-content is-fixed">
                {{ payment.total }}
              </div>
            </a>
          </div>
          <svg-icon slot="reference" icon-class="notification" class="notification" style="margin-left: 15px;"/>
        </el-popover>
      </el-badge>
      <el-tooltip
        v-if="hasPermission(100105)"
        :enterable="false"
        :content="$t('navbar.calendar')"
        effect="dark"
        placement="bottom">
        <renewal-calendar class="calendar right-menu-item" style="margin-right: 15px"/>
      </el-tooltip>
      <el-dropdown class="avatar-container right-menu-item">
        <span class="el-dropdown-link">
          {{ name }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item style="padding: 10px">
            <span style="display:block;" @click="handleOpenUpdateUserDialog">
              <svg-icon icon-class="password" style="margin-right: 5px"/>{{ $t('navbar.password') }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item style="padding: 10px" @click.native="logout">
            <svg-icon icon-class="logout" style="margin-right: 5px"/>{{ $t('navbar.logOut') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      :visible="showEditPasswordDialog"
      :title="$t('navbar.password')"
      width="400px"
      class="passwordDialog"
      @close="handleCloseUpdateUserDialog">
      <el-form ref="password" :rules="rulePassword" :model="form">
        <el-form-item :label="$t('navbar.oldPassword')" prop="oldPassword">
          <el-input v-model="form.oldPassword" :placeholder="$t('navbar.password_tip.oldPassword')" type="password"/>
        </el-form-item>
        <el-form-item :label="$t('navbar.newPassword')" prop="password">
          <el-input v-model.trim="form.password" :placeholder="$t('navbar.password_tip.password')" type="password"/>
        </el-form-item>
        <el-form-item :label="$t('navbar.confirmPassword')" prop="password_confirm">
          <el-input v-model.trim="form.password_confirm" :placeholder="$t('navbar.password_tip.password_confirm')" type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseUpdateUserDialog">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="loading" type="primary" @click="handleUpdatePassword">{{ $t('common.submitButton') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible="showHomePageSetting"
      title="首页配置"
      top="50px"
      width="400px"
      @close="showHomePageSetting = false">
      <el-checkbox-group v-model="homePageSetting">
        <el-checkbox v-for="item in allHomePageSetting" :key="item.id" :label="item.id" style="width: 140px; margin-left: 5px">{{ $t(item.name) }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showHomePageSetting = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="homePageConfigLoading" type="primary" @click="handleUpdateHomePageSetting">{{ $t('common.submitButton') }}</el-button>
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
import RenewalCalendar from '@/views/client/policy/renewalCalendar'
import sha256 from 'sha256'
import { getUserId } from '@/utils/auth'
import { hasPaymentStatuses } from '@/utils/permission'
import { getCurrentYearFirst, getCurrentYearLast } from '@/utils'
import { getAllHomePageConfig } from '@/utils/permission'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker,
    RenewalCalendar
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('navbar.password_tip.enter_password_again')))
      } else if (value !== this.form.password) {
        callback(new Error(this.$t('navbar.password_tip.difference_password')))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      showEditPasswordDialog: false,
      showHomePageSetting: false,
      homePageConfigLoading: false,
      homePageSetting: [],
      allHomePageSetting: this.getAllHomePageConfig(),
      form: {
        oldPassword: '',
        password: ''
      },
      rulePassword: {
        oldPassword: [{ required: true, message: this.$t('navbar.password_tip.difference_password'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('navbar.password_tip.password'), trigger: 'blur' }],
        password_confirm: [{ required: true, message: this.$t('navbar.password_tip.password_confirm'), trigger: 'blur' }, { validator: validatePass, trigger: 'blur' }]
      },
      credit: { desc: this.$t('navbar.credit'), total: 0 },
      payment: { desc: this.$t('navbar.payment'), total: 0 }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'device'
    ])
  },
  created() {
    if (!this.$store.getters.homePageSetting) {
      const result = this.getAllHomePageConfig()
      result.forEach(item => {
        this.homePageSetting.push(item.id)
      })
    } else {
      this.$store.getters.homePageSetting.forEach(item => {
        this.homePageSetting.push(item)
      })
    }
    if (this.hasPermission(100055)) {
      this.getCreditList()
    }
    if (this.hasPaymentStatuses(130000)) {
      this.getPayment()
    }
  },
  methods: {
    hasPaymentStatuses,
    getAllHomePageConfig,
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
    },
    handleUpdateHomePageSetting() {
      this.homePageConfigLoading = true
      this.$api.config.updateHomePageSetting({ homePage: this.homePageSetting }).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.showHomePageSetting = false
        this.homePageConfigLoading = false
        // this.$store.dispatch('GetUserInfo')
        location.reload()
      }).catch(_ => {
        this.homePageConfigLoading = false
      })
    },
    getCreditList() {
      const params = { status: 0, geDueDate: getCurrentYearFirst(), leDueDate: getCurrentYearLast() }
      this.$api.commission.fetchCommissionCredit(params).then(res => {
        this.credit.total = res.data.total
      })
    },
    getPayment() {
      this.$api.commission.fetchAuditPayment({ status: -1 }).then(res => {
        this.payment.total = res.data.total
      })
    },
    handleCreditClick() {
      this.$router.push({ path: '/commission/commissionCredit', query: { type: '0' }})
    },
    handlePaymentClick() {
      this.$router.push({ path: '/commission/paymentAudit' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss">
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
      margin: 0 10px;
    }
    .screenfull {
      height: 20px;
    }
    .setting_class {
      font-size: 20px;
      cursor: pointer;
      vertical-align: 13px;
    }
    .international{
      top: -15px;
    }
    .calendar {
      height: 20px;
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
    .notification {
      font-size: 20px;
      position: relative;
      margin-bottom: 17px;
    }
  }
  .transverse {
    border-right: solid 1px #ccc;
    height: 50px;
    line-height: 50px;
  }
  .el-dialog__header {
    line-height: 10px;
    .el-checkbox {
      line-height: 30px;
    }
  }
}
.el-popover {
  min-width: 200px!important;
  padding: 0!important;
}
.notification-list-item {
  padding: 15px;
  color: rgba(0,0,0,.65);
  font-size: 14px;
  line-height: 22px;
}
.notification-list-item:hover {
  background: #e6f7ff
}
.notification-badge-content {
  float: right;
  border-radius: 10px;
  color: #FFF;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #FFF;
  background-color: #F56C6C;
}
.icon-earning {
  font-size: 18px;
  margin-right: 5px;
  color: #36a3f7;
}
.icon-payment {
  font-size: 18px;
  margin-right: 5px;
  color: #E6A23C;
}

</style>
