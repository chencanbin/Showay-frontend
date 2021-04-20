<template>
  <span>
    <el-button 
      type="text" 
      size="small" 
      @click="initForm">{{
        this.$t("common.edit")
      }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('user.set.edit_title')"
      width="500px"
      append-to-body
    >
      <el-form
        ref="account"
        :model="account"
        :rules="ruleAccount"
        label-width="80px"
      >
        <el-form-item 
          :label="$t('user.name')" 
          prop="name">
          <el-input v-model="account.name" />
        </el-form-item>
        <el-form-item 
          :label="$t('user.email')" 
          prop="email">
          <el-input v-model="account.email" />
        </el-form-item>
        <el-form-item 
          :label="$t('user.acronym')" 
          prop="acronym">
          <el-input v-model="account.acronym" />
        </el-form-item>
        <el-form-item 
          :label="$t('user.role')" 
          prop="roles">
          <el-select
            v-model="account.roles"
            :placeholder="$t('user.set.role')"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div 
        slot="footer" 
        class="dialog-footer">
        <el-button @click="handleClose">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button 
          :loading="loading" 
          type="primary" 
          @click="handleSubmit">{{
            $t("common.submitButton")
          }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import elDragDialog from "@/directive/el-dragDialog";
const _ = require("lodash");
export default {
  directives: { elDragDialog },
  props: {
    user: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      roles: [],
      account: {
        id: "",
        name: "",
        email: "",
        login: "",
        acronym: "",
        superior: "",
        roles: [],
      },
      dialogVisible: false,
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
            message: this.$t("user.set.role"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    initForm() {
      // 初始化参数，将传进来的对象字段复制给account
      this.account.roles = [];
      this.user.roles.forEach((item) => {
        this.account.roles.push(item.id);
      });
      this.account.id = this.user.id;
      this.account.email = this.user.email;
      this.account.name = this.user.name;
      this.account.acronym = this.user.acronym;
      // 调用roles接口拿到所有权限
      this.$api.role.fetchRoleList().then((res) => {
        this.roles = res.data.list;
        this.dialogVisible = true;
      });
    },
    handleClose() {
      // this.account = { roles: [] }
      // this.$refs['account'].resetFields()
      this.dialogVisible = false;
    },
    handleSubmit() {
      this.$refs["account"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = _.cloneDeep(this.account);
          this.$api.user
            .editUser(this.account.id, data)
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

<style lang="scss" rel="stylesheet/scss">
</style>
