<template>
  <div class="navbar" :class="!sidebar.opened && 'mobile_navbar'">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!--<error-log class="errLog-container right-menu-item"/>-->
        <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item" />
        </el-tooltip> -->
        <lang-select class="international right-menu-item" />
        <div class="split-line" />
        <!-- <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item" />
        </el-tooltip> -->
      </template>
      <el-tooltip content="首页配置" effect="dark" placement="bottom">
        <div class="setting_class right-menu-item">
          <svg class="iconfont" aria-hidden="true" @click="showHomePageSetting = true">
            <use xlink:href="#icon_shouye_peizhi"></use>
          </svg>
        </div>
      </el-tooltip>
      <el-badge :hidden="credit.total + payment.total === 0" :value="credit.total + payment.total" :max="99" class="right-menu-item">
        <el-popover width="150" trigger="click">
          <div v-if="hasPermission(100055)" class="notification-list-item">
            <a @click="handleCreditClick" class="notification-content-wrapper">
              <div class="notification-content">
                <svg class="iconfont" aria-hidden="true">
                  <use xlink:href="#icon_collect_money"></use>
                </svg>
                {{ credit.desc }}
              </div>
              <div class="notification-badge-content">
                {{ credit.total }}
              </div>
            </a>
          </div>
          <div v-if="hasPaymentStatuses(130000)" class="notification-list-item">
            <a @click="handlePaymentClick" class="notification-content-wrapper">
              <div class="notification-content">
                <svg class="iconfont" aria-hidden="true">
                  <use xlink:href="#icon-60"></use>
                </svg>
                {{ payment.desc }}
              </div>
              <div class="notification-badge-content is-fixed">
                {{ payment.total }}
              </div>
            </a>
          </div>
          <svg slot="reference" class="iconfont" aria-hidden="true">
            <use xlink:href="#icon_notice"></use>
          </svg>
        </el-popover>
      </el-badge>
      <el-tooltip v-if="hasPermission(100105)" :enterable="false" :content="$t('navbar.calendar')" effect="dark" placement="bottom">
        <renewal-calendar class="calendar right-menu-item" />
      </el-tooltip>
      <div class="split-line" />
      <el-dropdown class="avatar-container right-menu-item">
        <span class="el-dropdown-link">
          {{ name }}
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleOpenUpdateUserDialog">
            <svg class="iconfont" aria-hidden="true">
              <use xlink:href="#icon_password"></use>
            </svg>
            <span>{{ $t("navbar.password") }}</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <svg class="iconfont" aria-hidden="true">
              <use xlink:href="#icon_sign_out"></use>
            </svg>
            <span>{{ $t("navbar.logOut") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--修改密码弹窗 -->
    <el-dialog :visible="showEditPasswordDialog" :title="$t('navbar.password')" width="500px" class="passwordDialog" @close="handleCloseUpdateUserDialog" append-to-body>
      <el-form ref="password" :rules="rulePassword" :model="form" label-width="80px">
        <el-form-item :label="$t('navbar.oldPassword')" prop="oldPassword">
          <el-input v-model="form.oldPassword" :placeholder="$t('navbar.password_tip.oldPassword')" type="password" />
        </el-form-item>
        <el-form-item :label="$t('navbar.newPassword')" prop="password">
          <el-input v-model.trim="form.password" :placeholder="$t('navbar.password_tip.password')" type="password" />
        </el-form-item>
        <el-form-item :label="$t('navbar.confirmPassword')" prop="password_confirm">
          <el-input v-model.trim="form.password_confirm" :placeholder="$t('navbar.password_tip.password_confirm')" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseUpdateUserDialog">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button :loading="loading" type="primary" @click="handleUpdatePassword">{{ $t("common.submitButton") }}</el-button>
      </div>
    </el-dialog>

    <!-- 首页配置弹窗 -->
    <el-dialog :visible="showHomePageSetting" title="首页配置" width="500px" @close="showHomePageSetting = false" append-to-body>
      <el-checkbox-group v-model="homePageSetting">
        <el-checkbox v-for="item in allHomePageSetting" :key="item.id" :label="item.id" style="width:210px; height: 50px; line-height: 50px; margin-right:0; ">{{ $t(item.name) }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showHomePageSetting = false">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button :loading="homePageConfigLoading" type="primary" @click="handleUpdateHomePageSetting">{{ $t("common.submitButton") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import SizeSelect from "@/components/SizeSelect";
import LangSelect from "@/components/LangSelect";
import ThemePicker from "@/components/ThemePicker";
import RenewalCalendar from "@/views/client/policy/renewalCalendar";
import sha256 from "sha256";
import { getUserId } from "@/utils/auth";
import { hasPaymentStatuses } from "@/utils/permission";
import { getCurrentYearFirst, getCurrentYearLast } from "@/utils";
import { getAllHomePageConfig } from "@/utils/permission";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    SizeSelect,
    LangSelect,
    ThemePicker,
    RenewalCalendar,
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(
          new Error(this.$t("navbar.password_tip.enter_password_again"))
        );
      } else if (value !== this.form.password) {
        callback(new Error(this.$t("navbar.password_tip.difference_password")));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      showEditPasswordDialog: false,
      showHomePageSetting: false,
      homePageConfigLoading: false,
      homePageSetting: [],
      allHomePageSetting: this.getAllHomePageConfig(),
      form: {
        oldPassword: "",
        password: "",
      },
      rulePassword: {
        oldPassword: [
          {
            required: true,
            message: this.$t("navbar.password_tip.difference_password"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("navbar.password_tip.password"),
            trigger: "blur",
          },
        ],
        password_confirm: [
          {
            required: true,
            message: this.$t("navbar.password_tip.password_confirm"),
            trigger: "blur",
          },
          { validator: validatePass, trigger: "blur" },
        ],
      },
      credit: { desc: this.$t("navbar.credit"), total: 0 },
      payment: { desc: this.$t("navbar.payment"), total: 0 },
    };
  },
  computed: {
    ...mapGetters(["sidebar", "name", "device"]),
  },
  created() {
    if (!this.$store.getters.homePageSetting) {
      const result = this.getAllHomePageConfig();
      result.forEach((item) => {
        this.homePageSetting.push(item.id);
      });
    } else {
      this.$store.getters.homePageSetting.forEach((item) => {
        this.homePageSetting.push(item);
      });
    }
    if (this.hasPermission(100055)) {
      this.getCreditList();
    }
    if (this.hasPaymentStatuses(130000)) {
      this.getPayment();
    }
  },
  methods: {
    hasPaymentStatuses,
    getAllHomePageConfig,
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
      });
    },
    handleCloseUpdateUserDialog() {
      this.showEditPasswordDialog = false;
    },
    handleOpenUpdateUserDialog() {
      this.showEditPasswordDialog = true;
    },
    handleUpdatePassword() {
      this.$refs["password"].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.form);
          data.oldPassword = sha256(this.form.oldPassword);
          data.password = sha256(this.form.password);
          this.loading = true;
          const id = getUserId();
          this.$api.user.editUser(id, data).then((res) => {
            this.loading = false;
            this.$message({
              message: this.$t("common.success"),
              type: "success",
              duration: 5 * 1000,
            });
            this.logout();
            this.handleCloseUpdateUserDialog();
          });
        }
      });
    },
    handleUpdateHomePageSetting() {
      this.homePageConfigLoading = true;
      this.$api.config
        .updateHomePageSetting({ homePage: this.homePageSetting })
        .then((res) => {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 5 * 1000,
          });
          this.showHomePageSetting = false;
          this.homePageConfigLoading = false;
          // this.$store.dispatch('GetUserInfo')
          location.reload();
        })
        .catch((_) => {
          this.homePageConfigLoading = false;
        });
    },
    getCreditList() {
      const params = {
        status: 0,
        geDueDate: getCurrentYearFirst(),
        leDueDate: getCurrentYearLast(),
      };
      this.$api.commission
        .fetchCommissionCredit(params)
        .then((res) => {
          this.credit.total = res.data.total;
        })
        .catch((_) => { });
    },
    getPayment() {
      this.$api.commission
        .fetchAuditPayment({ status: -1 })
        .then((res) => {
          this.payment.total = res.data.total;
        })
        .catch((_) => { });
    },
    handleCreditClick() {
      this.$router.push({
        path: "/commission/commissionCredit",
        query: { type: "0" },
      });
    },
    handlePaymentClick() {
      this.$router.push({ path: "/commission/paymentAudit" });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss">
.notification-content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .notification-content {
    display: flex;
    align-items: center;
  }
}
.navbar {
  padding-right: 40px;
  color: #fff;
  height: 60px;
  line-height: 60px;
  border-radius: 0px !important;
  border-bottom: solid 1px #ccc;
  background-color: $--purple;
  position: fixed;
  z-index: 10;
  width: calc(100% - 180px);
  .hamburger-container {
    line-height: 60px;
    height: 60px;
    float: left;
    padding: 0 10px;
    display: flex;
    align-items: center;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .calendar {
    .el-badge__content.is-fixed {
      top: 0px !important;
      right: 15px;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    .split-line {
      display: inline-block;
      width: 1px;
      height: 16px;
      background: #cbceed;
      margin-bottom: 6px;
      margin-right: 30px;
    }
    .iconfont {
      margin-right: 0;
    }
    .el-badge {
      display: flex;
    }
    .el-badge__content {
      background: $--orange;
    }
    .el-badge__content.is-fixed {
      top: 0;
    }
    &:focus {
      outline: none;
    }
    .right-menu-item {
      margin-right: 34px;
      .iconfont {
        color: rgba(203, 206, 237, 1) !important;
      }
    }
    .setting_class {
      cursor: pointer;
      vertical-align: 13px;
      display: flex;
    }
    .el-popover__reference-wrapper {
      display: flex;
    }
    .theme-switch {
      vertical-align: 8px;
    }
    .avatar-container {
      height: 50px;
      line-height: 50px;
      margin-left: 0;
      margin-right: 10px;
      color: #fff;
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
  .el-dialog__header {
    line-height: 10px;
    .el-checkbox {
      line-height: 30px;
    }
  }
  .avatar-container {
    .el-dropdown-menu__item {
      display: flex;
      align-items: center;
      height: 50px;
      line-height: 50px;
      min-width: 118px;
      color: #43475f;
      font-size: 16px;
      padding: 0;
      padding-left: 26px;

      &:hover {
        background-color: $--purple-assist;

        .el-button--text {
          color: $--purple !important;
        }
      }

      .el-button--text {
        color: #43475f;
      }

      &:hover {
        i {
          color: $--purple !important;
          background-color: $--purple-assist;
        }
      }
    }
  }
}
.mobile_navbar {
  width: 100%;
  .right-menu {
    margin-right: 60px;
  }
}
.el-popover {
  min-width: 200px !important;
  padding: 0 !important;
}
.notification-list-item {
  padding: 15px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 22px;
}
.notification-list-item:hover {
  background: #e6f7ff;
}
.notification-badge-content {
  float: right;
  border-radius: 10px;
  color: $--orange;
  display: inline-block;
  font-size: 10px;
  height: 16px;
  line-height: 16px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid $--orange;
  background-color: $--orange-assist;
  position: relative;
  &::before {
    position: absolute;
    content: "";
    width: 6px;
    height: 6px;
    background: $--orange;
    border-radius: 50%;
    left: -10px;
    top: 50%;
    margin-top: -3px;
  }
}
.icon-earning {
  font-size: 18px;
  margin-right: 5px;
  color: #36a3f7;
}
.icon-payment {
  font-size: 18px;
  margin-right: 5px;
  color: #e6a23c;
}
</style>
