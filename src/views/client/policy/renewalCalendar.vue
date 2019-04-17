<template>
  <span>
    <el-badge :value="events.length" :max="99" style="line-height: 35px">
      <svg-icon icon-class="calendar" style="vertical-align: 1.1em; font-size: 20px" @click="initForm"/>
    </el-badge>
    <el-dialog
      id="renewalCalendar"
      :visible="dialogVisible"
      :before-close="handleClose"
      :fullscreen="true"
      title= "续保日历"
      append-to-body>
      <full-calendar :events="events" locale="zh-cn" @changeMonth="changeMonth">
        <template slot="fc-event-card" slot-scope="p">
          <el-popover
            placement="top-start"
            trigger="hover">
            <el-card>
              <el-form label-width="80px">
                <el-form-item label="投保人:" class="detail-item">
                  {{ p.event.detail.applicant.name }}
                </el-form-item>
                <el-form-item label="电话:" class="detail-item">
                  {{ p.event.detail.applicant.phone }}
                </el-form-item>
                <el-form-item label="邮箱:" class="detail-item">
                  {{ p.event.detail.applicant.email }}
                </el-form-item>
                <el-form-item label="续保时间:" class="detail-item">
                  {{ getFormattedDate(p.event.start) }}
                </el-form-item>
                <el-form-item label="产品:" class="detail-item">
                  {{ p.event.detail.product.name }}
                </el-form-item>
              </el-form>
              <!--<div class="renewDetail">投保人: {{ p.event.detail.applicant.name }}</div>-->
              <!--<div class="renewDetail">电话: {{ p.event.detail.applicant.phone }}</div>-->
              <!--<div class="renewDetail">邮箱: {{ p.event.detail.applicant.email }}</div>-->
              <!--<div class="renewDetail">时间: {{ getFormattedDate(p.event.start) }}</div>-->
              <!--<div class="renewDetail">产品: {{ p.event.detail.product.name }}</div>-->
            </el-card>
            <p slot="reference">{{ p.event.title }}</p>
          </el-popover>
        </template>
      </full-calendar>
    </el-dialog>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
import FullCalendar from '@/components/FullCalendar'
import { parseTime } from '@/utils'

const currencyFormatter = require('currency-formatter')

export default {
  name: 'Renewal',
  components: {
    FullCalendar
  },
  data() {
    return {
      events: [],
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  created() {
    this.$api.client.calendarRenewal().then(res => {
      this.events = res.data
    })
  },
  methods: {
    changeMonth(start, end, current) {
      const from = start.format('x')
      const to = end.format('x')
      this.$api.client.calendarRenewal({ from, to }).then(res => {
        this.events = res.data
      })
    },
    formatterCurrency(value) {
      return currencyFormatter.format(value, { symbol: this.getSymbol(this.currency) })
    },
    initForm() {
      this.dialogVisible = true
    },
    handleClose() {
      this.$api.client.calendarRenewal().then(res => {
        this.events = res.data
      })
      this.dialogVisible = false
    },
    getFormattedDate(value) {
      return parseTime(value, '{y}-{m}-{d}')
    }
  }
}
</script>

<style type="text/scss" lang="scss">
  #renewalCalendar {
    line-height: 10px;
    .el-dialog__body {
      padding: 0
    }
    .comp-full-calendar {
      max-width: 100%;
      padding: 10px;
      .weeks {
        line-height: 40px;
      }
      .event-item, .body-item {
        background-color: rgb(225, 238, 220);
        font-size: 13px;
        width: 100%;
        height: 25px;
        line-height: 25px;
        .el-popover__reference {
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
      .more-header {
        background-color: #00701a;
        color: #fafafa;
        padding: 10px;
      }
    }
    /*.el-badge__content.is-fixed {*/
      /*top: 15px;*/
    /*}*/
  }
  .detail-item {
    margin-bottom: 0px!important;
  }
</style>
