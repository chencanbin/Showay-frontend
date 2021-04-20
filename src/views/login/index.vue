<template>
  <div 
    class="login-container pull-height" 
    @keyup.enter.native="handleLogin">
    <div class="login-wrapper">
      <div class="login-left animated fadeInLeft">
        <div class="login-info">
          <img
            class="login-info-title"
            src="../../assets/images/logo.png"
            alt=""
            width="420px"
            height="80px"
          >
          <ul class="login-info-list">
            <li
              v-for="(item, index) in website.info.list"
              :key="index"
              class="login-info-item"
            >
              <i class="el-icon-check" />&nbsp;{{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="login-border animated fadeInRight">
        <div class="login-main">
          <h4 class="login-title">登录 {{ website.title }}</h4>
          <userLogin />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import userLogin from "./userlogin";
import { validatenull } from "@/utils/validate";
export default {
  name: "Login",
  components: {
    userLogin,
  },
  data() {
    return {
      website: {
        title: "宏鑫资产",
        info: {
          title: "宏鑫资产管理系统",
          list: ["可视化的数据界面", "高效数据整理", "提高团队协同效率"],
        },
      },
    };
  },
  watch: {
    $route() {
      const params = this.$route.query;
      this.socialForm.state = params.state;
      this.socialForm.code = params.code;
      if (!validatenull(this.socialForm.state)) {
        const loading = this.$loading({
          lock: true,
          text: `${
            this.socialForm.state === "WX" ? "微信" : "QQ"
          }登录中,请稍后。。。`,
          spinner: "el-icon-loading",
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
      }
    },
  },
};
</script>

<style lang="scss">
.pull-height {
  height: 100%;
  overflow: hidden;
}
.login-container {
  position: relative;
  width: 100%;
  margin: 0 auto;
}
.login-wrapper {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 500px;
  margin-top: -200px;
}
.login-container::before {
  z-index: -1024;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/login_bg.png");
  background-size: cover;
}
.login-left {
  float: left;
  width: 50%;
  top: 10%;
  position: relative;
}
.login-logo {
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 50px;
  padding-left: 100px;
  font-size: 24px;
  color: #333;
}
.login-info {
  /*text-align: center;*/
  padding-left: 100px;
}
.login-info-title {
  margin-bottom: 20px;
}
.login-info-item {
  font-size: 14px;
  line-height: 2.5;
  color: rgb(33, 37, 41);
}
.login-border {
  width: 50%;
  float: left;
  box-sizing: border-box;
}
.login-main {
  margin: 0 auto;
  width: 50%;
  box-sizing: border-box;
}
.login-main > h3 {
  margin-bottom: 20px;
}
.login-main > p {
  color: #76838f;
}
.login-title {
  margin-bottom: 40px;
  font-weight: 500;
  font-size: 22px;
  text-align: center;
  letter-spacing: 4px;
}
.login-menu {
  width: 100%;
  text-align: center;
  a {
    color: rgb(153, 153, 153);
    font-size: 12px;
    margin: 0px 8px;
  }
}
.login-index {
  margin-top: 40px !important;
  width: 180px;
  height: 48px;
  text-align: center;
  border-radius: 50px !important;
  background: transparent !important;
  color: #333 !important;
  font-size: 16px !important;
  border: 1px solid rgb(152, 22, 244);
}
.login-submit {
  display: block !important;
  margin: 40px auto 10px auto !important;
  width: 200px;
  height: 48px;
  font-size: 14px !important;
  text-align: center;
  border-radius: 50px !important;
  border: 0px;
  box-shadow: rgba(152, 22, 244, 0.19) 0px 5px 10px 2px;
}
.login-form {
  margin: 10px 0;
  /*i {*/
  /*color: #999;*/
  /*}*/
  .el-form-item__content {
    width: 100%;
  }
  .el-form-item {
    margin-bottom: 12px;
  }
  .el-input {
    input {
      padding-bottom: 10px;
      text-indent: 5px;
      background: transparent;
      border: none;
      border-radius: 0;
      color: #333;
      border-bottom: 1px solid rgb(235, 237, 242);
    }
    .el-input__prefix {
      i {
        padding: 0 5px;
        font-size: 16px !important;
      }
    }
  }
}
.login-code {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 0 0 10px;
}
.login-code-img {
  margin-top: 2px;
  width: 100px;
  height: 38px;
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 38px;
  text-indent: 5px;
  text-align: center;
}
</style>
