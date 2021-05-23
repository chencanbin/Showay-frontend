<template>
  <span class="credit-edit">
    <el-button type="text" size="small" icon="el-icon-edit" @click="initForm">{{
        $t("common.edit")
      }}</el-button>
    <el-dialog v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('commission.credit.set.edit_credit_title')" top="50px" width="400px">
      <div v-if="locked && credit.currency !== 'HKD'" class="lock-icon" @click="unlockCalculate()">
        <svg-icon icon-class="lock" />
      </div>
      <div v-if="!locked && credit.currency !== 'HKD'" class="lock-icon" @click="lockCalculate()">
        <svg-icon icon-class="unlock" />
      </div>
      <el-form ref="credit" :model="credit" label-width="80px">
        <el-form-item :label="$t('client.insurance_policy.number')" prop="name">
          {{ commissionCredit.insurancePolicy.number }}
        </el-form-item>
        <el-form-item :label="$t('commission.credit.year')" prop="name">
          {{ $t("commission.credit.years", [commissionCredit.year]) }}
        </el-form-item>
        <el-form-item :label="$t('client.insurance_policy.premium')" prop="name">
          {{
            getSymbol(commissionCredit.currency) +
              formatterCurrency(commissionCredit.premium)
          }}
        </el-form-item>
        <el-form-item :label="$t('common.commission_rate')" prop="name">
          {{
            credit.ffyap
              ? formatterNumber(commissionCredit.commissionRate) + "%"
              : formatterNumber(commissionCredit.commissionRateWithoutFfyap) +
                "%"
          }}
        </el-form-item>
        <el-form-item :label="$t('common.calculatedAmount')" prop="name">
          {{
            credit.ffyap
              ? getSymbol(commissionCredit.currency) +
                formatterCurrency(commissionCredit.calculatedAmount)
              : getSymbol(commissionCredit.currency) +
                formatterCurrency(commissionCredit.calculatedAmountWithoutFfyap)
          }}
        </el-form-item>
        <el-form-item v-if="credit.currency !== 'HKD'" :label="$t('common.exchangeRate')" prop="exchangeRateToHkd">
          <el-input v-model="credit.exchangeRateToHkd" :placeholder="$t('commission.credit.set.exchangeRate')" @input="onExchangeRateInput" />
        </el-form-item>
        <el-form-item :label="$t('common.amount')">
          <currency-input ref="amount" :value="credit.amount" symbol="HK$ " @input="onAmountInput" />
        </el-form-item>
        <el-form-item :label="$t('common.remarks')" prop="remarks">
          <el-input v-model="credit.remarks" :placeholder="$t('common.remarks_placeholder')" />
        </el-form-item>
        <el-form-item v-if="isBoolean(credit.ffyap)" label="FFYAP" prop="ffyap">
          <el-checkbox v-model="credit.ffyap" @change="ffyapChange" />
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
  </span>
</template>

<script type="text/ecmascript-6">
import elDragDialog from "@/directive/el-dragDialog";
import currencyInput from "@/components/CurrencyInput";
import { getSymbol } from "@/utils";
const currencyFormatter = require("currency-formatter");

const _ = require("lodash");
export default {
  directives: { elDragDialog },
  components: {
    currencyInput,
  },
  props: {
    sort: {
      type: String,
      default() {
        return "";
      },
    },
    order: {
      type: String,
      default() {
        return "";
      },
    },
    wildcard: {
      type: String,
      default() {
        return "";
      },
    },
    term: {
      type: [Number, String],
      default() {
        return 0;
      },
    },
    dateRange: {
      type: Array,
      default() {
        return [];
      },
    },
    activeName: {
      type: String,
      default() {
        return 0;
      },
    },
    commissionCredit: {
      type: Object,
      default() {
        return {};
      },
    },
    listQuery: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      credit: {
        id: "",
        ffyap: "",
        remarks: "",
        amount: "",
        exchangeRateToHkd: "",
      },
      locked: true,
      dialogVisible: false,
      loading: false,
    };
  },
  created() { },
  methods: {
    initForm() {
      this.credit = _.cloneDeep(this.commissionCredit);
      this.credit.amount = this.credit.calculatedAmountInHkd;
      this.$nextTick(function () {
        this.$refs["amount"].currencyValue = Number(
          this.credit.calculatedAmountInHkd
        ).toFixed(2);
      });
      this.dialogVisible = true;
    },
    isBoolean(value) {
      return typeof value === "boolean";
    },
    handleClose() {
      this.$refs["credit"].resetFields();
      this.dialogVisible = false;
    },
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, {
        symbol: "",
      });
    },
    getSymbol,
    handleSubmit() {
      this.$refs["credit"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$api.commission
            .editCommissionCredit(this.credit.id, this.credit)
            .then((_) => {
              this.$message({
                message: this.$t("common.success"),
                type: "success",
                duration: 5 * 1000,
              });
              const offset = (this.listQuery.page - 1) * this.listQuery.limit;
              const max = this.listQuery.limit;
              if (this.dateRange) {
                this.$store.dispatch("commission/FetchCommissionCredit", {
                  status: this.activeName,
                  geDueDate: this.dateRange[0],
                  leDueDate: this.dateRange[1],
                  wildcard: this.wildcard,
                  sort: this.sort,
                  order: this.order,
                  term: this.term,
                  offset,
                  max,
                });
              } else {
                this.$store.dispatch("commission/FetchCommissionCredit", {
                  status: this.activeName,
                  wildcard: this.wildcard,
                  sort: this.sort,
                  order: this.order,
                  offset,
                  max,
                });
              }
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
    formatterNumber(value) {
      return _.toNumber(value).toFixed(2);
    },
    unlockCalculate() {
      this.locked = !this.locked;
    },
    lockCalculate() {
      this.locked = !this.locked;
    },
    onAmountInput(val) {
      this.credit.amount = val;
      if (this.locked) {
        if (parseInt(this.credit.calculatedAmount) === 0) {
          return;
        }
        if (this.credit.ffyap) {
          this.credit.exchangeRateToHkd = (
            val / this.credit.calculatedAmount
          ).toFixed(2);
        } else {
          this.credit.exchangeRateToHkd = (
            val / this.credit.calculatedAmountWithoutFfyap
          ).toFixed(2);
        }
      }
    },
    ffyapChange() {
      if (this.credit.ffyap) {
        this.credit.amount = this.credit.calculatedAmountInHkd;
        this.$refs.amount.onChange(this.credit.amount);
      } else {
        this.credit.amount = this.credit.calculatedAmountInHkdWithoutFfyap;
        this.$refs.amount.onChange(this.credit.amount);
      }
    },
    onExchangeRateInput(val) {
      if (this.locked) {
        if (this.credit.ffyap) {
          this.credit.amount = (val * this.credit.calculatedAmount).toFixed(2);
          this.$refs.amount.onChange(this.credit.amount);
        } else {
          this.credit.amount = (
            val * this.credit.calculatedAmountWithoutFfyap
          ).toFixed(2);
          this.$refs.amount.onChange(this.credit.amount);
        }
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
.lock-icon {
  width: 28px;
  height: 50px;
  border: solid #aaaaaa 1px;
  border-right: 0;
  display: inline-block;
  position: absolute;
  top: 385px;
  left: 48px;
  font-size: 18px;
  z-index: 1000;
  svg {
    position: absolute;
    top: 15px;
    left: -9px;
  }
}
</style>
