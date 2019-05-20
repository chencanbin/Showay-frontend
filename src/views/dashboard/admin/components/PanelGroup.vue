<template>
  <el-row :gutter="10" type="flex" justify="center" class="panel-group">
    <el-col v-if="showHomePage(1)" class="card-panel-col">
      <panel-item :title="$t('home.creditSum')" :item="0" :group-by="0" :from="from" :to="to"/>
    </el-col>
    <el-col v-if="showHomePage(2)" class="card-panel-col">
      <panel-item :title="$t('home.pendingCreditSum')" :item="1" :group-by="0" :from="from" :to="to"/>
    </el-col>
    <el-col v-if="showHomePage(3)" class="card-panel-col">
      <panel-item :title="$t('home.paymentSum')" :item="2" :group-by="0" :from="from" :to="to"/>
    </el-col>
    <el-col v-if="showHomePage(4)" class="card-panel-col">
      <panel-item :title="$t('home.pendingPaymentSum')" :item="3" :group-by="0" :from="from" :to="to"/>
    </el-col>
    <!--<el-col v-if="showHomePage(5)" class="card-panel-col">-->
    <!--<panel-item :title="$t('home.policyCount')" :item="5" :group-by="0" :from="from" :to="to"/>-->
    <!--</el-col>-->
    <el-col v-if="showHomePage(6)" class="card-panel-col">
      <panel-item :title="$t('home.normalPolicyCount')" :item="6" :group-by="0" :from="from" :to="to"/>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import panelItem from './panelItem'
import { getCurrentYearFirst, getCurrentYearLast } from '@/utils'
import { showHomePage } from '@/utils/permission'

export default {
  components: {
    CountTo,
    panelItem
  },
  data() {
    return {
      homePageSetting: this.$store.getters.homePageSetting,
      from: getCurrentYearFirst(),
      to: getCurrentYearLast(),
      clearedCredit: 0,
      pendingCredit: 0,
      clearedPayment: 0,
      pendingPayment: 0,
      insurancePolicyCount: 0,
      normalInsurancePolicyCount: 0
    }
  },
  methods: {
    showHomePage,
    panelClick(type) {
      this.$emit('panelClick', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped type="text/scss">
.panel-group {
  .card-panel-col{
    margin-bottom: 32px;
  }
}
</style>
