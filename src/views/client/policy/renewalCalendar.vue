<template>
  <span>
    <el-badge :hidden="events.length === 0" :value="events.length" :max="99">
      <!-- <svg-icon icon-class="calendar" style="vertical-align: 1.1em; font-size: 20px" @click="initForm" /> -->
      <svg class="iconfont" aria-hidden="true" @click="initForm">
        <use xlink:href="#icon_date"></use>
      </svg>
    </el-badge>
    <el-dialog id="renewalCalendar" :visible="dialogVisible" :before-close="handleClose" :fullscreen="true" :title="$t('client.insurance_policy.renewal_calendar')" append-to-body>
      <!-- // renewal: 续保 reservation： 预约 -->
      <div class="calendar-wrapper">
        <div class="calendar">
          <div class="tabs__header">
            <span class="tabs_item" :class="activeName === 'renewal' ? 'active': ''" @click="switchTab('renewal')">{{$t('client.insurance_policy.renewal_calendar')}}</span>
            <span class="tabs_item" :class="activeName === 'reservation：' ? 'active': ''" @click="switchTab('reservation：')">预约日历</span>
          </div>
          <full-calendar ref="fullCalendar" :events="events" locale="zh-cn" @triggerDay="triggerDay" @changeMonth="changeMonth">
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
        </div>
        <transition name="el-zoom-in-right">
          <div class="calendar-detail" v-show="currentDay">
            <div class="detail-header">
              {{detailTitle}} <i class="el-icon-close icon-close" @click="closeDetail"></i>
            </div>
            <el-collapse v-if="currentDay.events && currentDay.events.length  > 0">
              <el-collapse-item name="overdue" v-if="currentDay.events && currentDay.events.length  > 0">
                <template slot="title">
                  <div class="title_wrapper overdue_title">
                    <span class="iconfont icon_time"></span> <span class="title">逾期</span><i class="overdue_icon"></i>
                  </div>
                </template>
                <div class="events-wrapper">
                  <!-- events -->
                  <div v-for="event in currentDay.events" :key="event.detail.id" class="event-wrapper">
                    <el-form>
                      <el-form-item :label="$t('client.insurance_policy.applicant_name')" class="detail-item">
                        {{ event.detail.applicant.name }}
                      </el-form-item>
                      <el-form-item :label="$t('client.insurance_policy.term')" class="detail-item">
                        {{ event.detail.term }}
                      </el-form-item>

                      <el-form-item :label="$t('client.info.phone')" class="detail-item">
                        {{ event.detail.applicant.phone }}
                      </el-form-item>
                      <el-form-item :label="$t('client.info.email')" class="detail-item">
                        {{ event.detail.applicant.email }}
                      </el-form-item>
                      <el-form-item :label="$t('client.insurance_policy.renewal_time')" class="detail-item">
                        {{ getFormattedDate(event.start) }}
                      </el-form-item>
                      <el-form-item :label="$t('client.insurance_policy.product')" class="detail-item">
                        {{ event.detail.product.name }}
                      </el-form-item>
                      <el-form-item v-if="hasPermission(100053)" :label="$t('client.insurance_policy.renewed')" class="detail-item">
                        <el-checkbox :checked="event.detail.status === 1" @change="renewalChange(event)" />
                      </el-form-item>
                      <div style="text-align: right">
                        <el-button v-if="hasRoles([1, 3])" @click="handleSendEmail(event)" type="primary">{{
                    $t("client.insurance_policy.renewal_notification")
                  }}</el-button>
                      </div>
                    </el-form>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item name="ordinary" v-if="currentDay.events && currentDay.events.length  > 0">
                <template slot="title">
                  <div class="title_wrapper">
                    <span class="iconfont icon_time"></span> <span class="title">普通</span><i class="ordinary_icon"></i>
                    <span class="event_count" v-if="currentDay.events">{{currentDay.events.length}}</span>
                  </div>
                </template>
                <div class="events-wrapper">
                  <!-- events -->
                  <div v-for="event in currentDay.events" :key="event.detail.id" class="event-wrapper">
                    <el-form>
                      <div class="applicant_name_wrapper">
                        <span class="applicant_name">{{ event.detail.applicant.name }} </span><i class="ordinary_icon"></i>
                      </div>
                      <el-form-item :label="$t('client.insurance_policy.term')" class="detail-item">
                        {{ event.detail.term }}
                      </el-form-item>
                      <el-form-item :label="$t('client.info.phone')" class="detail-item">
                        {{ event.detail.applicant.phone }}
                      </el-form-item>
                      <el-form-item :label="$t('client.info.email')" class="detail-item">
                        {{ event.detail.applicant.email }}
                      </el-form-item>
                      <el-form-item :label="$t('client.insurance_policy.renewal_time')" class="detail-item">
                        {{ getFormattedDate(event.start) }}
                      </el-form-item>
                      <el-form-item :label="$t('client.insurance_policy.product')" class="detail-item">
                        {{ event.detail.product.name }}
                      </el-form-item>
                      <el-form-item v-if="hasPermission(100053)" :label="$t('client.insurance_policy.renewed')" class="detail-item">
                        <el-checkbox :checked="event.detail.status === 1" @change="renewalChange(event)" />
                      </el-form-item>
                      <div class="detail-form-bottom">
                        <el-button v-if="hasRoles([1, 3])" @click="handleSendEmail(event)" type="primary">{{
                    $t("client.insurance_policy.renewal_notification")
                  }}</el-button>
                      </div>
                    </el-form>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div v-else class="no_calendar_data_container">
              <img src="../../../assets/images/no_calendar_data.png" alt="" srcset="" class="no_calendar_data_img">
              <span class="no_calendar_data_text">暂无续保信息</span>
            </div>
          </div>
        </transition>
      </div>
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
      activeName: 'renewal',// renewal: 续保 reservation： 预约
      currentDay: '',
      detailTitle: ''
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
    renewalChange(val) {
      this.$api.client.editCalendarRenewal(val.detail.id).then((res) => {
        this.$message({
          message: this.$t("common.success"),
          type: "success",
          duration: 5 * 1000,
        });
        // this.getCalendarRenewal({ from: this.from, to: this.to });
        this.updateRenewalStatus();
      });
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
    },
    triggerDay(day) {
      this.detailTitle = moment(day.date).format('YYYY-MM-DD');
      console.log(this.detailTitle)
      this.currentDay = day;
    },
    closeDetail() {
      // this.currentDay = ""
      this.dialogVisible = false;
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
        color: $--label;
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
  .calendar-wrapper {
    display: flex;
    justify-content: space-between;
    .calendar {
      flex: 1;
      min-width: 0;
      position: relative;
      flex: 1;
      .comp-full-calendar {
        max-width: 100%;
        margin: 0 48px 0 32px;
        background: #f6f6f7;
        height: calc(100vh - 88px);
        overflow: auto;
        padding-bottom: 40px;
        .full-calendar-header {
          background: #fff;
          color: #42475f;
          font-size: 14px;
          position: absolute;
          right: 48px;
          height: 40px;
          padding-left: 16px;
          padding-right: 16px;
          top: 31px;
          border: 1px solid #ededf1;
          border-radius: 6px;
          .el-input__inner {
            background: #fff;
            padding-left: 0 !important;
            padding-right: 17px;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            color: #42475f;
            line-height: 18px;
          }
          .header-center {
            flex: auto;
          }
        }
        .full-calendar-body {
          background: #fff;
          border-radius: 16px 16px 0px 0px;
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
      }
    }

    .calendar-detail {
      // width: 480px;
      width: 20%;
      height: 100vh;
      background: #ffffff;
      box-shadow: -10px 0px 30px 0px rgba(0, 0, 0, 0.06);
      padding: 16px 32px 60px 32px;
      overflow: auto;
      .detail-header {
        margin-bottom: 0;
        padding: 0;
        height: 70px;
        line-height: 70px;
        color: $--content;
        font-size: 20px;
        font-weight: bold;
        border-bottom: 1px solid #e9e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .el-collapse {
        border: 0;
        .el-collapse-item {
          min-height: 60px;
          border: 0;
          .el-collapse-item__header {
            border: 0;
            height: 60px;
            .title_wrapper {
              color: rgba(66, 71, 95, 1);
              font-weight: bold;
              font-size: 18px;
              width: 100%;
              .title {
                margin-right: 8px;
              }
              .icon_time {
                font-size: 30px;
                color: $--purple !important;
                vertical-align: middle;
              }
              .event_count {
                padding-left: 6px;
                padding-right: 6px;
                float: right;
                margin-right: 10px;
                margin-top: 18px;
                height: 16px;
                line-height: 16px;
                display: inline-block;
                color: $--purple;
                background: $--purple-assist;
                border: 0.5px solid $--purple;
                border-radius: 8px;
                font-weight: bold;
                font-size: 10px;
              }
            }
          }
          .el-collapse-item__wrap {
            border: 0;

            .event-wrapper {
              background: #f6f6f7;
              border-radius: 6px;
              padding: 16px 24px;
              margin-bottom: 16px;
              .applicant_name_wrapper {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .el-collapse-item__content {
                  padding-bottom: 0 !important;
                }
                .applicant_name {
                  color: $--content;
                  font-weight: bold;
                  font-size: 16px;
                }
              }
              .el-form-item__label {
                font-weight: 500;
                color: $--label;
                font-size: 14px;
              }
              .el-form-item__content {
                text-align: right;
                font-weight: 500;
                font-size: 14px;
                color: $--content;
              }
            }
          }
        }
      }
      .no_calendar_data_container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 285px;
        .no_calendar_data_img {
          width: 263px;
          height: 175px;
          margin-bottom: 31px;
        }
        .no_calendar_data_text {
          color: #42475f;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }
  .el-collapse-item__content {
    padding-bottom: 0 !important;
  }
  .ordinary_icon {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background: #818be2;
    display: inline-block;
  }
  .overdue_icon {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background: $--yellow;
    display: inline-block;
    margin-right: 12px;
  }
}
.el-icon-arrow-right {
  font-family: "iconfont" !important;
  color: #d8d8d8;
  font-size: 26px;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: "\e6c";
  }
}
.detail-item {
  margin-bottom: 0px !important;
}
.detail-form-bottom {
  margin-top: 16px;
  text-align: right;
}
</style>
