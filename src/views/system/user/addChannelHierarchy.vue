<template>
  <el-col span.number="24" class="el-table-add-col">
    <el-button class="el-table-add-row" plain type="primary" @click="initForm"><i class="iconfont icon_add_small create-icon" />
      <span>{{ $t("common.add") }}</span>
    </el-button>
    <el-dialog append-to-body v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" title="添加渠道上级" width="400px">
      <el-form ref="channel" :model="channel" label-width="80px">
        <el-form-item :label="$t('user.name')" prop="name">
          {{ user.name }}
        </el-form-item>
        <el-form-item :label="$t('user.acronym')" prop="acronym">
          {{ user.acronym }}
        </el-form-item>
        <el-form-item :label="$t('user.account')" prop="login">
          {{ user.login }}
        </el-form-item>
        <el-form-item :label="$t('user.superior')" prop="superior">
          <el-select v-model="channel.superior" :placeholder="$t('user.set.superior')" clearable style="width: 100%">
            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('user.effectiveDate')" prop="effectiveDate">
          <el-date-picker v-model="channel.effectiveDate" :placeholder="$t('user.set.effectiveDate')" type="date" value-format="timestamp" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="$t('common.remarks')" prop="remarks">
          <el-input v-model="channel.remarks" :placeholder="$t('common.remarks_placeholder')" />
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
      dialogVisible: false,
      channel: {
        superior: "",
        effectiveDate: "",
        remarks: "",
      },
    };
  },
  methods: {
    initForm() {
      this.dialogVisible = true;
      this.$api.user.fetchUserList({ role: 2 }).then((res) => {
        this.users = res.data.list;
      });
    },
    handleClose() {
      this.$refs["channel"].resetFields();
      this.dialogVisible = false;
    },
    handleSubmit() {
      this.$refs["channel"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$api.user
            .addChannelHierarchy({
              owner: this.user.id,
              superior: this.channel.superior,
              effectiveDate: this.channel.effectiveDate,
              remarks: this.channel.remarks,
            })
            .then((_) => {
              this.$message({
                message: this.$t("common.success"),
                type: "success",
                duration: 5 * 1000,
              });
              this.$store.dispatch("FetchChannelHierarchy", {
                owner: this.user.id,
              });
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
.el-table-add-row {
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }
}
</style>
