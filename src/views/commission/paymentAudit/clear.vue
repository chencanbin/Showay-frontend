<template>
  <span id="clear">
    <el-button type="text" size="small" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">结清</el-button>
    <el-dialog v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('commission.payment.cleared_title')" top="50px" width="600px">
      <el-form ref="clear" :model="clear" :rules="rule" label-width="110px">
        <el-form-item :label="$t('commission.payment.chequeNumber')" prop="chequeNumber">
          <el-input v-model="clear.chequeNumber" :placeholder="$t('commission.payment.set.chequeNumber')" />
        </el-form-item>
        <el-form-item :label="$t('commission.payment.chequeCopy')" prop="chequeCopy">
          <image-upload ref="uploadImage" @afterComplete="setChequeCopy" />
        </el-form-item>
        <el-form-item :label="$t('commission.payment.payment_date')" prop="chequeIssueDate">
          <el-date-picker v-model="clear.chequeIssueDate" :placeholder="$t('commission.payment.set.payment_date')" type="date" value-format="timestamp" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="$t('common.remarks')" prop="remarks">
          <el-input v-model="clear.remarks" :placeholder="$t('common.remarks_placeholder')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{
            $t("common.submitButton")
          }}</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog :close-on-click-modal="false" :visible="confirmDialogVisible" :before-close="handleCloseConfirmDialog" :title="$t('commission.payment.check_detail')" top="50px" width="400px">
      <el-form>
        <el-form-item :label="$t('commission.payment.chequeNumber')">
          <span style="float: right">{{ clear.chequeNumber }}</span>
        </el-form-item>
        <el-form-item :label="$t('commission.payment.chequeCopy')">
          <span style="float: right; width: 75%"><img v-if="imgSrc" :src="imgSrc" class="banner"></span>
        </el-form-item>
        <el-form-item :label="$t('commission.payment.payment_date')">
          <span style="float: right">{{
            parseTime(clear.chequeIssueDate, "{y}-{m}-{d}")
          }}</span>
        </el-form-item>
        <el-form-item :label="$t('common.remarks')">
          <span style="float: right">{{ clear.remarks }}</span>
        </el-form-item>
        <div class="el-divider el-divider--horizontal" />
        <div style="
            font-size: 16px;
            font-weight: bold;
            color: rgb(144, 0, 0);
            text-align: left;
          ">
          <el-checkbox v-model="confirm" style="vertical-align: text-bottom; margin-right: 5px" />
          * {{ $t("commission.payment.tooltip.clear") }}
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseConfirmDialog">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button :disabled="!confirm" :loading="loading" type="primary" @click="submitClear">{{ $t("common.confirmButton") }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import imageUpload from "@/components/upload/imageUpload";
import elDragDialog from "@/directive/el-dragDialog";
import { parseTime } from "@/utils";
export default {
  directives: { elDragDialog },
  components: {
    imageUpload,
  },
  props: {
    id: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      clear: {
        chequeNumber: "",
        chequeCopy: "",
        chequeIssueDate: "",
        remarks: "",
      },
      confirm: false,
      imgSrc: "",
      rule: {
        chequeNumber: [
          {
            required: true,
            message: this.$t("commission.payment.set.chequeNumber"),
            trigger: "blur",
          },
        ],
      },
      dialogVisible: false,
      confirmDialogVisible: false,
      loading: false,
    };
  },
  methods: {
    parseTime,
    initForm() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.$refs["clear"].resetFields();
      this.$refs["uploadImage"].clearImage();
      this.imgSrc = "";
      this.confirm = false;
      this.dialogVisible = false;
    },
    handleCloseConfirmDialog() {
      this.confirmDialogVisible = false;
    },
    handleSubmit() {
      this.$refs["clear"].validate((valid) => {
        if (valid) {
          this.confirmDialogVisible = true;
        } else {
          return false;
        }
      });
    },
    submitClear() {
      this.loading = true;
      this.$api.commission
        .mergedPaymentClear(this.id, this.clear)
        .then((_) => {
          this.$message({
            message: this.$t("common.success"),
            type: "success",
            duration: 5 * 1000,
          });
          this.$store.dispatch("commission/FetchAuditPayment", { status: 2 });
          this.handleClose();
          this.handleCloseConfirmDialog();
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    setChequeCopy(key, imgSrc) {
      this.clear.chequeCopy = key;
      this.imgSrc = imgSrc;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
#clear {
  .el-dialog--center .el-dialog__body {
    padding: 10px 20px;
  }
  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 18px 0;
  }
  .el-divider {
    background-color: #dcdfe6;
    position: relative;
  }
}
</style>
