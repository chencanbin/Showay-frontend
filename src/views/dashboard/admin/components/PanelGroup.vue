<template>
  <el-row :gutter="40" class="panel-group">
    <el-col v-permission="[1]" :xs="24" :sm="24" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="panelClick('creditSum')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="income" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('home.creditSum') }}</div>
          <count-to :start-val="0" :end-val="overall.creditSum" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col v-permission="[1]" :xs="24" :sm="24" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="panelClick('pendingCreditSum')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="earning" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('home.pendingCreditSum') }}</div>
          <count-to :start-val="0" :end-val="overall.pendingCreditSum" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col v-permission="[1, 2]" :xs="24" :sm="24" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="panelClick('paymentSum')">
        <div class="card-panel-icon-wrapper icon-payment-sum">
          <svg-icon icon-class="paymentSum" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('home.pendingPaymentSum') }}</div>
          <count-to :start-val="0" :end-val="overall.pendingPaymentSum" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col v-permission="[1, 3]" :xs="24" :sm="24" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="panelClick('policyCount')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="order" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('home.policyCount') }}</div>
          <count-to :start-val="0" :end-val="overall.policyCount" :duration="1000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  components: {
    CountTo
  },
  directives: { permission },
  props: {
    overall: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
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
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-payment-sum {
        background: #E6A23C;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-payment-sum {
      color: #E6A23C;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
