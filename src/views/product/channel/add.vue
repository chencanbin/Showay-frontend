<template>
  <el-col class="el-table-add-col">
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加</span></div>-->
    <el-button class="el-table-add-row" plain type="primary" @click="initForm"><i class="iconfont icon_add_small create-icon" /> <span>{{ $t("common.add") }}</span>
    </el-button>
    <el-dialog append-to-body v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('user.set.add_channel_title')" width="500px">
      <el-form ref="account" :model="account" :rules="ruleAccount" label-width="100px">
        <el-form-item :label="$t('client.insurance_policy.channel')" prop="channel">
          <el-select v-model="account.channel" :placeholder="$t('client.insurance_policy.set.channel_name')" filterable style="width: 100%" @change="onChannelChange">
            <el-option v-for="item in channels.list" :key="item.id" :label="item.name" :value="item.id" />
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
import { mapState } from "vuex";

export default {
  directives: { elDragDialog },
  data() {
    return {
      loading: false,
      users: [],
      dialogVisible: false,
      account: {
        channel: "",
      },
      ruleAccount: {
        channel: [
          {
            required: true,
            validator: this.validateChannel,
            trigger: "blur, change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      channels: (state) => state.user.users,
    }),
  },
  methods: {
    initForm() {
      this.getChannel();
      this.dialogVisible = true;
    },
    validateChannel(rule, value, callback) {
      if (!value) {
        callback(
          new Error(this.$t("client.insurance_policy.set.channel_name"))
        );
      } else {
        callback();
      }
    },
    getChannel(params) {
      const role = { role: 2 };
      if (params) {
        params.role = role;
      } else {
        params = role;
      }
      this.$store.dispatch("FetchUserList", params);
    },
    handleClose() {
      this.$refs["account"].resetFields();
      this.dialogVisible = false;
    },
    onChannelChange() {
      this.$refs["account"].validate();
    },
    handleSubmit() {
      this.$refs["account"].validate((valid) => {
        if (valid) {
          this.$emit("afterSelectChannel", this.account.channel);
          this.account.channel = "";
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.el-table-add-col {
  width: 900px;
}
</style>
