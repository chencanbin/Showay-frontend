<template>
  <span>
    <el-button type="text" size="small" @click="initForm">
      {{ $t("client.insurance_policy.set.company_expense") }}
    </el-button>
    <el-dialog v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('client.insurance_policy.set.company_expense')" width="3.125rem" class="company_expenses" append-to-body>
      <el-form>
        <el-card>
          <div class="header">
            <el-button :loading="addExpensesLoading" plain size="small" @click="addItem"><i class="iconfont icon_add_small create-icon" /><span>{{$t("client.insurance_policy.set.expense_item")}}</span></el-button>
          </div>
          <el-form-item v-for="(item, index) in expenses" :key="index" style="margin-top: 10px" class="input_item">
            <el-select v-model="item.type" placeholder="请选择" class="select_inner_item" @change="expensesTypeChange(item)">
              <el-option v-for="(item, index) in expensesType" :key="index" :label="item[language]" :value="item.id" />
            </el-select>
            <currency-input v-model="item.amount" symbol="HK$ " class="input_inner_item" @input="expensesAmountChange(item)" />
            <el-button :loading="removeExpensesLoading === item.id" icon="el-icon-remove-outline" size="small" class="action-button" @click="removeItem(item.id)" />
          </el-form-item>
        </el-card>
      </el-form>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import elDragDialog from "@/directive/el-dragDialog";
import currencyInput from "@/components/CurrencyInput";
import { expensesType } from "@/utils/constant";
import Cookies from "js-cookie";
export default {
  directives: { elDragDialog },
  components: {
    currencyInput,
  },
  props: {
    policy: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      removeExpensesLoading: "",
      addExpensesLoading: false,
      expenses: [],
      language: "",
      expensesType,
    };
  },
  created() { },
  methods: {
    initForm() {
      this.language = Cookies.get("language") || "zh-CN";
      this.getExpensesList();
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    onExchangeRateInput(val) {
      if (this.locked) {
        this.credit.amount = (val * this.credit.calculatedAmount).toFixed(2);
        this.$refs.amount.onChange(this.credit.amount);
      }
    },
    getExpensesList() {
      this.$api.commission
        .fetchExpenses({ insurancePolicy: this.policy.id })
        .then((res) => {
          this.expenses = res.data.list;
        });
    },
    addItem() {
      this.addExpensesLoading = true;
      this.$api.commission
        .addExpenses({ insurancePolicy: this.policy.id, type: 0, amount: 0 })
        .then((res) => {
          this.addExpensesLoading = false;
          this.getExpensesList();
        })
        .catch((_) => {
          this.addExpensesLoading = false;
        });
    },
    removeItem(id) {
      this.removeExpensesLoading = id;
      this.$api.commission
        .deleteExpenses(id)
        .then((res) => {
          this.removeExpensesLoading = 0;
          this.getExpensesList();
        })
        .catch((_) => {
          this.removeExpensesLoading = 0;
        });
    },
    expensesTypeChange(item) {
      this.$api.commission.editExpenses(item.id, item).then((res) => {
        this.getExpensesList();
      });
    },
    expensesAmountChange(item) {
      this.$api.commission.editExpenses(item.id, item).then((res) => {
        this.getExpensesList();
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
.company_expenses {
  .el-dialog__body {
    padding: 10px;
  }
  .header {
    text-align: right;
    padding-top: 12px;
    padding-bottom: 16px;
    .el-button {
      color: $--purple;
      background-color: $--purple-assist;
      width: 112px;
      height: 40px;
      background: #f2f2f8;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      padding: 0;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .el-form-item__content {
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
    .select_inner_item {
      width: 170px;
    }
    .input_inner_item {
      width: 254px;
    }
    .action-button {
      width: 64px;
      height: 36px;
      font-size: 24px;
      padding: 0;
    }
  }
}
</style>
