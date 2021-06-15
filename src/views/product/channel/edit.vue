<template>
  <span>
    <el-button type="text" size="small" icon="el-icon-edit" @click="initForm">{{
        this.$t("common.edit")
      }}</el-button>
    <el-dialog v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('user.set.edit_channel_title')" append-to-body width="500px">
      <el-form ref="account" :model="account" :rules="ruleAccount" label-width="100px">
        <el-form-item :label="$t('user.set.name')" prop="name">
          <el-input v-model="account.name" />
        </el-form-item>
        <el-form-item :label="$t('user.set.superior')" prop="superior">
          <el-select v-model="account.superior" :placeholder="$t('user.set.superior_placeholder')" clearable style="width: 100%">
            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!--<el-form-item v-if="account.superior" label="上级佣金率" prop="superiorCommissionRate">-->
        <!--<el-input v-if="account.superior" v-model.number="account.superiorCommissionRate">-->
        <!--<template slot="append">%</template>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
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
  </span>
</template>

<script type="text/ecmascript-6">
import elDragDialog from "@/directive/el-dragDialog";
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
      users: [],
      account: {
        id: "",
        name: "",
        login: "",
        superior: "",
      },
      dialogVisible: false,
      ruleAccount: {
        name: [
          {
            required: true,
            message: this.$t("user.set.verify_message.name"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    initForm() {
      this.$api.user
        .fetchUserList({ nid: this.user.id, role: 2 })
        .then((res) => {
          this.users = res.data.list;
          if (this.user.superior) {
            this.account.superior = this.user.superior.id;
            // this.account.superiorCommissionRate = _.toNumber(this.user.superior.superiorCommissionRate).toFixed(2)
          }
          this.account.id = this.user.id;
          this.account.name = this.user.name;
        });
      this.dialogVisible = true;
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
            .editUser(this.account.id, this.account)
            .then((_) => {
              this.$message({
                message: this.$t("common.success"),
                type: "success",
                duration: 5 * 1000,
              });
              this.$store.dispatch("FetchUserList", { role: 2 });
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
