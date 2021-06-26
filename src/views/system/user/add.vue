<template>
  <el-col class="el-table-add-col">
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>-->
    <el-button class="el-table-add-row" plain type="primary" @click="initForm">
      <i class="iconfont icon_add_small create-icon" /> <span>{{ $t("common.add") }}</span>
    </el-button>
    <el-dialog v-el-drag-dialog append-to-body :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('user.set.add_title')" width="500px">
      <el-form ref="account" :model="account" :rules="ruleAccount" label-width="80px">
        <el-form-item :label="$t('user.name')" prop="name">
          <el-input v-model="account.name" :placeholder="$t('user.set.name')" />
        </el-form-item>
        <el-form-item :label="$t('user.email')" prop="email">
          <el-input v-model="account.email" :placeholder="$t('user.set.email')" />
        </el-form-item>
        <el-form-item :label="$t('user.acronym')" prop="acronym">
          <el-input v-model="account.acronym" :placeholder="$t('user.set.acronym')" />
        </el-form-item>
        <el-form-item :label="$t('user.account')" prop="login">
          <el-input v-model="account.login" :placeholder="$t('user.set.account')" />
        </el-form-item>
        <el-form-item :label="$t('user.role')" prop="roles">
          <el-select v-model="account.roles" :placeholder="$t('user.set.role')" multiple style="width: 100%">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">{{
            $t("common.submitButton")
          }}</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>

<script type="text/ecmascript-6">
import elDragDialog from "@/directive/el-dragDialog";

export default {
  directives: { elDragDialog },
  data() {
    return {
      loading: false,
      roles: [],
      dialogVisible: false,
      account: {
        name: "",
        login: "",
        email: "",
        acronym: "",
        roles: [],
      },
      ruleAccount: {
        name: [
          {
            required: true,
            message: this.$t("user.set.name"),
            trigger: "blur",
          },
        ],
        login: [
          {
            required: true,
            message: this.$t("user.set.account"),
            trigger: "blur",
          },
        ],
        roles: [
          {
            required: true,
            message: this.$t("user.set.role"),
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: this.$t("user.set.email"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    initForm() {
      this.$api.role.fetchRoleList().then((res) => {
        this.roles = res.data.list;
        this.dialogVisible = true;
      });
    },
    handleClose() {
      this.$refs["account"].resetFields();
      this.dialogVisible = false;
    },
    handleSubmit() {
      this.$refs["account"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$api.user
            .addUser(this.account)
            .then((_) => {
              this.$message({
                message: this.$t("common.success"),
                type: "success",
                duration: 5 * 1000,
              });
              this.$store.dispatch("FetchUserList");
              this.handleClose();
              this.loading = false;
            })
            .catch((_) => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.el-table-add-col {
  width: 900px;
}
</style>
