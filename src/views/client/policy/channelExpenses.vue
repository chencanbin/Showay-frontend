/* eslint-disable vue/max-attributes-per-line */
<template>
  <span>
    <el-button type="text" size="small" @click="initForm">
      {{ $t("client.insurance_policy.set.channel_expense") }}
    </el-button>
    <el-dialog v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('client.insurance_policy.set.channel_expense')" width="400px" class="channel_expenses" append-to-body>
      <el-form>
        <el-card>
          <div slot="header" class="clearfix">
            <span style="margin-right: 10px; vertical-align: middle">{{
              $t("client.insurance_policy.set.expense_item")
            }}</span>
            <el-button :loading="addExpensesLoading" icon="el-icon-plus" size="small" style="min-width: 40px; font-size: 16px; padding: 5px" @click="addItem" />
          </div>
          <el-form-item v-for="(item, index) in expenses" :key="index" style="margin-top: 10px" class="input_item">
            <el-select v-model="item.type" placeholder="请选择" style="width: 100px; margin-right: -4px" class="select_inner_item" @change="expensesTypeChange(item)">
              <el-option v-for="(item, index) in expensesType" :key="index" :label="item[language]" :value="item.id" />
            </el-select>
            <currency-input v-model="item.amount" symbol="HK$ " style="width: 220px" class="input_inner_item" @input="expensesAmountChange(item)" />
            <el-button :loading="removeExpensesLoading === item.id" icon="el-icon-remove-outline" size="small" style="
                min-width: 50px;
                font-size: 20px; 
                padding: 6px;
                vertical-align: bottom;" @click="removeItem(item.id)" />
          </el-form-item>
        </el-card>
      </el-form>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import currencyInput from "@/components/CurrencyInput";
import elDragDialog from "@/directive/el-dragDialog";
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
      expenses: [],
      removeExpensesLoading: "",
      addExpensesLoading: false,
      language: "",
      expensesType,
    };
  },
  methods: {
    initForm() {
      this.language = Cookies.get("language") || "zh-CN";
      this.getExpensesList();
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    getExpensesList() {
      this.$api.channel
        .fetchChannelExpenses({ insurancePolicy: this.policy.id })
        .then((res) => {
          this.expenses = res.data.list;
        });
    },
    addItem() {
      this.addExpensesLoading = true;
      this.$api.channel
        .addChannelExpenses({
          insurancePolicy: this.policy.id,
          type: 0,
          amount: 0,
        })
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
      this.$api.channel
        .deleteChannelExpenses(id)
        .then((res) => {
          this.removeExpensesLoading = 0;
          this.getExpensesList();
        })
        .catch((_) => {
          this.removeExpensesLoading = 0;
        });
    },
    expensesTypeChange(item) {
      this.$api.channel.editChannelExpenses(item.id, item).then((res) => {
        this.getExpensesList();
      });
    },
    expensesAmountChange(item) {
      this.$api.channel.editChannelExpenses(item.id, item).then((res) => {
        this.getExpensesList();
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
.channel_expenses {
  .el-dialog__body {
    padding: 10px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
