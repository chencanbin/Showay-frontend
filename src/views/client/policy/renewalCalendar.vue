<template>
  <span>
    <el-badge :hidden="events.length === 0" :value="events.length" :max="99" style="line-height: 35px">
      <!-- <svg-icon icon-class="calendar" style="vertical-align: 1.1em; font-size: 20px" @click="initForm" /> -->
      <i class="iconfont icon_date" @click="initForm" />
    </el-badge>
    <el-dialog id="renewalCalendar" :visible="dialogVisible" :before-close="handleClose" :fullscreen="true" :title="$t('client.insurance_policy.renewal_calendar')" append-to-body>
      <!-- // renewal: 续保 reservation： 预约 -->
      <div class="tabs__header">
        <span class="tabs_item" :class="activeName === 'renewal' ? 'active': ''" @click="switchTab('renewal')">{{$t('client.insurance_policy.renewal_calendar')}}</span>
        <span class="tabs_item" :class="activeName === 'reservation：' ? 'active': ''" @click="switchTab('reservation：')">预约日历</span>
      </div>
      <full-calendar ref="fullCalendar" :events="events" locale="zh-cn" @changeMonth="changeMonth" @updateRenewalStatus="updateRenewalStatus">
        <template slot="fc-event-more-item" slot-scope="p">
          <el-popover placement="top-start" trigger="click">
            <el-card style="padding: 10px">
              <el-form label-width="80px">
                <el-form-item :label="$t('client.insurance_policy.applicant_name')" class="detail-item">
                  {{ p.event.detail.applicant.name }}
                </el-form-item>
                <el-form-item :label="$t('client.info.phone')" class="detail-item">
                  {{ p.event.detail.applicant.phone }}
                </el-form-item>
                <el-form-item :label="$t('client.info.email')" class="detail-item">
                  {{ p.event.detail.applicant.email }}
                </el-form-item>
                <el-form-item :label="$t('client.insurance_policy.renewal_time')" class="detail-item">
                  {{ getFormattedDate(p.event.start) }}
                </el-form-item>
                <el-form-item :label="$t('client.insurance_policy.product')" class="detail-item">
                  {{ p.event.detail.product.name }}
                </el-form-item>
                <el-form-item v-if="hasPermission(100053)" :label="$t('client.insurance_policy.renewed')" class="detail-item">
                  <el-checkbox :checked="p.event.detail.status === 1" @change="renewalChange(p.event)" />
                </el-form-item>
                <div style="text-align: center">
                  <el-button v-if="hasRoles([1, 3])" @click="handleSendEmail(p.event)">{{
                    $t("client.insurance_policy.renewal_notification")
                  }}</el-button>
                </div>
              </el-form>
            </el-card>
            <el-tooltip slot="reference" :content="p.event.title" :open-delay="1000" effect="dark" placement="top-start">
              <p :class="judgeEventStatus(p.event)">{{ p.event.title }}</p>
            </el-tooltip>
          </el-popover>
        </template>
        <template slot="fc-event-card" slot-scope="p">
          <el-popover placement="top-start" trigger="click">
            <el-card style="padding: 10px">
              <el-form label-width="80px">
                <el-form-item :label="$t('client.insurance_policy.applicant_name')" class="detail-item">
                  {{ p.event.detail.applicant.name }}
                </el-form-item>
                <el-form-item :label="$t('client.info.phone')" class="detail-item">
                  {{ p.event.detail.applicant.phone }}
                </el-form-item>
                <el-form-item :label="$t('client.info.email')" class="detail-item">
                  {{ p.event.detail.applicant.email }}
                </el-form-item>
                <el-form-item :label="$t('client.insurance_policy.renewal_time')" class="detail-item">
                  {{ getFormattedDate(p.event.start) }}
                </el-form-item>
                <el-form-item :label="$t('client.insurance_policy.product')" class="detail-item">
                  {{ p.event.detail.product.name }}
                </el-form-item>
                <el-form-item v-if="hasPermission(100053)" :label="$t('client.insurance_policy.renewed')" class="detail-item">
                  <el-checkbox :checked="p.event.detail.status === 1" @change="renewalChange(p.event)" />
                </el-form-item>
                <div style="text-align: center">
                  <el-button v-if="hasRoles([1, 3])" @click="handleSendEmail(p.event)">{{
                    $t("client.insurance_policy.renewal_notification")
                  }}</el-button>
                </div>
              </el-form>
            </el-card>
            <p slot="reference" :class="judgeEventStatus(p.event)">{{ p.event.title }}</p>
            <el-tooltip slot="reference" :content="p.event.title" :open-delay="1000" effect="dark" placement="top-start">
              <p :class="judgeEventStatus(p.event)">{{ p.event.title }}</p>
            </el-tooltip>
          </el-popover>
        </template>
      </full-calendar>
    </el-dialog>
    <send-email ref="sendEmail" />
  </span>
</template>

<script>
import { mapGetters } from "vuex";
import FullCalendar from "@/components/FullCalendar";
import { parseTime } from "@/utils";
import sendEmail from "@/components/SendEmail";
import moment from "moment";
import { hasRoles } from "@/utils/permission";
const currencyFormatter = require("currency-formatter");

export default {
  name: "Renewal",
  components: {
    FullCalendar,
    sendEmail,
  },
  data() {
    return {
      events: [],
      dialogVisible: false,
      renewed: false,
      from: "",
      to: "",
      count: "",
      activeName: 'renewal'// renewal: 续保 reservation： 预约
    };
  },
  computed: {
    ...mapGetters(["loading"]),
  },
  created() {
    this.getCalendarRenewal();
  },
  methods: {
    hasRoles,
    changeMonth(start, end, current) {
      this.from = start.format("x");
      this.to = end.format("x");
      this.$api.client
        .calendarRenewal({ from: this.from, to: this.to })
        .then((res) => {
          this.events = res.data;
        });
    },
    getCalendarRenewal(params) {
      this.$api.client
        .calendarRenewal(params)
        .then((res) => {
          this.events = res.data;
          console.log(this.events);
        })
        .catch((_) => { });
    },
    judgeEventStatus(event) {
      const now = new Date().valueOf();
      if (event.detail.status === 1) {
        return "el-tag--success";
      } else if (event.detail.status === 0 && event.start < now) {
        return "el-tag--danger";
      } else {
        return "el-tag--warning";
      }
    },
    updateRenewalStatus(val) {
      this.getCalendarRenewal({ from: this.from, to: this.to });
    },
    formatterCurrency(value) {
      return currencyFormatter.format(Math.floor(value * 100) / 100, {
        symbol: this.getSymbol(this.currency),
      });
    },
    initForm() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.$refs.fullCalendar.emitChangeMonth(moment().startOf("month"));
      this.dialogVisible = false;
    },
    getFormattedDate(value) {
      return parseTime(value, "{y}-{m}-{d}");
    },
    handleSendEmail(event) {
      const policy = {};
      policy.dueDate = event.start;
      policy.applicant = event.detail.applicant;
      policy.premium = event.detail.premium;
      policy.number = event.detail.number;
      policy.currency = event.detail.currency;
      this.$refs.sendEmail.openEmailDialog(policy);
    },
    switchTab(val) {
      // renewal: 续保 reservation： 预约
      this.activeName = val;
    }
  },
};
</script>

<style type="text/scss" lang="scss">
#renewalCalendar {
  .el-dialog {
    border-radius: 0;
    background: #f6f6f7;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      .tabs__header {
        margin-top: 11px;
        padding-left: 24px;
        height: 76px;
        line-height: 76px;
        font-size: 22px;
        font-weight: bold;
        color: #8e919f;
        display: inline-block;
        .tabs_item:first-child {
          margin-right: 30px;
        }
        .tabs_item {
          cursor: pointer;
        }
        .active {
          color: #42475f;
          position: relative;
          &::after {
            content: "";
            width: 16px;
            height: 8px;
            background: $--purple;
            border-radius: 8px 8px 0 0;
            position: absolute;
            bottom: -12px;
            left: 39px;
          }
        }
      }
    }
  }
  line-height: 10px;

  .comp-full-calendar {
    max-width: 100%;
    padding: 0 24px 24px 24px;
    background: #f6f6f7;
    .full-calendar-header {
      background: #fff;
      color: #42475f;
      font-size: 14px;
      position: absolute;
      right: 25px;
      width: 170px;
      height: 40px;
      top: 40px;
      border: 1px solid #ededf1;
      border-radius: 6px;
      .el-input__inner {
        background: #fff;
        padding-left: 17px;
        padding-right: 17px;
        text-align: center;
      }
      .header-center {
        flex: auto;
      }
    }
    .full-calendar-body {
      background: #fff;
      border-radius: 6px;
      .weeks {
        line-height: 60px;
        border-bottom: 1px solid #efefef;
        border-top: 0;
        border-left: 0;
        .week {
          border-right: 0;
        }
      }
      .dates .week-row {
        border-left: 0;
        .day-cell {
          padding-top: 24px;
          padding-right: 24px;
        }
        .day-cell:last-child {
          border-right: 0;
        }
      }
      // .events-day {
      //   height: 220px;
      //   width: 190px;
      // }
    }

    .event-item,
    .body-item {
      position: relative;
      font-size: 12px;
      width: 100%;
      .el-popover__reference {
        overflow: hidden;
        text-overflow: ellipsis;
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
  margin-bottom: 0px !important;
}
</style>
