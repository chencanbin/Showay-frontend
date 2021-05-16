<template>
  <div class="comp-full-calendar">
    <!-- header pick month -->
    <fc-header :current-month="currentMonth" :first-day="firstDay" :locale="locale" @change="emitChangeMonth">
    </fc-header>
    <!-- body display date day and events -->
    <div class="full-calendar-body" @click="showMore = false">
      <div class="weeks">
        <strong v-for="(dayIndex, index) in 7" :key="index" class="week">{{ (dayIndex - 1) | localeWeekDay(firstDay, locale) }}</strong>
      </div>
      <div ref="dates" class="dates">
        <div class="dates-bg">
          <div v-for="(week, index) in currentDates" :key="index" class="week-row">
            <div v-for="(day, index) in week" :key="index" :class="{ today: day.isToday, 'not-cur-month': !day.isCurMonth }" class="day-cell">

            </div>
          </div>
        </div>

        <!-- absolute so we can make dynamic td -->
        <div class="dates-events">
          <div v-for="(week, index) in currentDates" :key="index" class="events-week">
            <div v-for="(day, index) in week" :key="index" :class="{ today: day.isToday, 'not-cur-month': !day.isCurMonth }" track-by="$index" class="events-day" @click.stop="dayClick(day)">
              <!--@click.stop="dayClick(day.date, $event)"-->
              <p class="day-number">{{ day.monthDay }}</p>
              <span v-if="day.events.length" class="ordinary_tip">
                <i class="ordinary_icon" style="margin-right: 12px;"></i> {{ day.events[day.events.length - 1].cellIndex }}条普通</span>
              <!-- <div class="event-box">
                <event-card v-for="(event, index) in day.events" v-show="event.cellIndex <= eventLimit" :event="event" :date="day.date" :first-day="firstDay" :key="index" @click="eventClick">
                  <template slot-scope="p">
                    <slot :event="p.event" name="fc-event-card" />
                  </template>
                </event-card>
                <p v-if="day.events.length > eventLimit" class="more-link" @click.stop="selectThisDay(day, $event)">
                  + {{ day.events[day.events.length -1].cellIndex - eventLimit }} more
                </p>
              </div> -->
            </div>
          </div>
        </div>

        <!-- full events when click show more -->
        <!-- <div v-if="showMore" :style="{ left: morePos.left + 'px', top: morePos.top + 'px' }" class="more-events">
          <div class="more-header">
            <span class="title">{{ moreTitle(selectDay.date) }}</span>
            <span class="close" @click.stop="showMore = false">x</span>
          </div>
          <div class="more-body">
            <ul class="body-list">
              <li v-for="(event, index) in selectDay.events" v-if="event.isShow" :key="index" class="body-item" @click="eventClick(event, $event)">
                <slot :event="event" name="fc-event-more-item" />
              </li>
            </ul>
          </div>
        </div>
        <slot name="body-card" /> -->

      </div>
    </div>
    <el-drawer class="calendar_drawer" :title="drawerTitle" :visible.sync="drawer" :direction="direction" append-to-body size="450px">
      <el-collapse>
        <el-collapse-item name="ordinary">
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
                <div style="text-align: right">
                  <el-button v-if="hasRoles([1, 3])" @click="handleSendEmail(event)" type="primary">{{
                    $t("client.insurance_policy.renewal_notification")
                  }}</el-button>
                </div>
              </el-form>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="overdue">
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
      </el-collapse>
    </el-drawer>
    <send-email ref="sendEmail" />
  </div>
</template>
<script type="text/babel">
// import langSets from './dataMap/langSets'
import dateFunc from "./components/dateFunc";
import moment from "moment";
import EventCard from "./components/eventCard";
import { hasRoles } from "@/utils/permission";
import header from "./components/header";
import { parseTime } from "@/utils";
import sendEmail from "@/components/SendEmail";
export default {
  components: {
    "event-card": EventCard,
    "fc-header": header,
    sendEmail
  },
  filters: {
    localeWeekDay(weekday, firstDay, locale) {
      firstDay = parseInt(firstDay);
      const localMoment = moment().locale(locale);
      return localMoment.localeData().weekdaysShort()[(weekday + firstDay) % 7];
    },
  },
  props: {
    events: {
      // events will be displayed on calendar
      type: Array,
      default: function () {
        return [];
      },
    },
    locale: {
      type: String,
      default: function () {
        return "en";
      },
    },
    firstDay: {
      type: Number | String | Object,
      validator(val) {
        const res = parseInt(val);
        return res >= 0 && res <= 6;
      },
      default: function () {
        return 0;
      },
    },
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      drawerTitle: '',
      currentMonth: moment().startOf("month"),
      isLismit: true,
      eventLimit: 6,
      showMore: false,
      morePos: {
        top: 0,
        left: 0,
      },
      selectDay: {},
      currentDay: {}
    };
  },
  computed: {
    currentDates() {
      return this.getCalendar();
    },
  },
  mounted() {
    this.emitChangeMonth(this.currentMonth);
  },
  methods: {
    hasRoles,
    emitChangeMonth(firstDayOfMonth) {
      this.currentMonth = firstDayOfMonth;
      const start = dateFunc.getMonthViewStartDate(
        firstDayOfMonth,
        this.firstDay
      );
      const end = dateFunc.getMonthViewEndDate(firstDayOfMonth, this.firstDay);
      this.$emit("changeMonth", start, end, firstDayOfMonth);
    },
    moreTitle(date) {
      if (!date) return "";
      return moment(date).format("ll");
    },
    getCalendar() {
      // calculate 2d-array of each month
      const monthViewStartDate = dateFunc.getMonthViewStartDate(
        this.currentMonth,
        this.firstDay
      );
      const calendar = [];

      for (let perWeek = 0; perWeek < 6; perWeek++) {
        const week = [];
        for (let perDay = 0; perDay < 7; perDay++) {
          week.push({
            monthDay: monthViewStartDate.date(),
            isToday: monthViewStartDate.isSame(moment(), "day"),
            isCurMonth: monthViewStartDate.isSame(this.currentMonth, "month"),
            weekDay: perDay,
            date: moment(monthViewStartDate),
            events: this.slotEvents(monthViewStartDate),
          });

          monthViewStartDate.add(1, "day");
        }

        calendar.push(week);
      }

      return calendar;
    },
    slotEvents(date) {
      // find all events start from this date
      // const cellIndexArr = []
      const thisDayEvents = this.events.filter((day) => {
        const st = moment(day.start);
        const ed = moment(day.end ? day.end : st);

        return date.isBetween(st, ed, null, "[]");
      });

      // sort by duration
      thisDayEvents.sort((a, b) => {
        if (!a.cellIndex) return 1;
        if (!b.cellIndex) return -1;
        return a.cellIndex - b.cellIndex;
      });

      // mark cellIndex and place holder
      for (let i = 0; i < thisDayEvents.length; i++) {
        thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || i + 1;
        thisDayEvents[i].isShow = true;
        if (thisDayEvents[i].cellIndex === i + 1 || i > 2) continue;
        thisDayEvents.splice(i, 0, {
          title: "holder",
          cellIndex: i + 1,
          start: date.format(),
          end: date.format(),
          isShow: false,
        });
      }

      return thisDayEvents;
    },
    selectThisDay(day, jsEvent) {
      this.selectDay = day;
      this.showMore = true;
      this.morePos = this.computePos(event.target);
      this.morePos.left -= 240;
      const events = day.events.filter((item) => {
        return item.isShow === true;
      });
      this.$emit("moreClick", day.date, events, jsEvent);
    },
    computePos(target) {
      const eventRect = target.getBoundingClientRect();
      const pageRect = this.$refs.dates.getBoundingClientRect();
      return {
        left: eventRect.left - pageRect.left,
        top: eventRect.top + eventRect.height - pageRect.top,
      };
    },
    dayClick(day) {
      console.log(day)
      if (!day.events.length) {
        return
      }
      this.drawer = true;
      this.currentDay = day;
      this.drawerTitle = moment(day.date).format('YYYY-MM-DD');
      // this.$emit("dayClick", day);
    },
    eventClick(event, jsEvent) {
      if (!event.isShow) return;
      jsEvent.stopPropagation();
      const pos = this.computePos(jsEvent.target);
      this.$emit("eventClick", event, jsEvent, pos);
    },
    getFormattedDate(value) {
      return parseTime(value, "{y}-{m}-{d}");
    },
    renewalChange(val) {
      this.$api.client.editCalendarRenewal(val.detail.id).then((res) => {
        this.$message({
          message: this.$t("common.success"),
          type: "success",
          duration: 5 * 1000,
        });
        // this.getCalendarRenewal({ from: this.from, to: this.to });
        this.$emit("updateRenewalStatus");
      });
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
  },
};
</script>
<style lang="scss" type="text/scss">
.comp-full-calendar {
  // font-family: "elvetica neue", tahoma, "hiragino sans gb"
  padding: 20px;
  background: #fff;
  max-width: 960px;
  margin: 0 auto;

  ul,
  p {
    margin: 0;
    padding: 0;
  }
}
.ordinary_icon {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: $--purple;
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
.full-calendar-body {
  margin-top: 0;

  .weeks {
    display: flex;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;

    .week {
      flex: 1;
      text-align: center;
      border-right: 1px solid #e0e0e0;
      color: #8e919f;
    }
  }

  .dates {
    position: relative;
    .week-row {
      // width: 100%;
      // position:absolute;
      border-left: 1px solid #e0e0e0;
      display: flex;

      .day-cell {
        flex: 1;
        height: 220px;
        width: 193px;
        padding: 4px;
        border-right: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;

        .day-number {
          text-align: right;
          font-weight: bold;
          color: $--content;
          font-size: 22px;
        }

        &.not-cur-month {
          .day-number {
            color: rgba(0, 0, 0, 0.24);
          }
        }
      }
    }

    .dates-events {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;

      .events-week {
        display: flex;

        .events-day {
          cursor: pointer;
          flex: 1;
          height: 220px;
          width: 193px;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 24px;
          flex-direction: column;
          display: flex;
          justify-content: space-between;
          &:hover {
            background: #f2f2f8;
          }
          .day-number {
            color: $--content;
            font-size: 22px;
            font-weight: bold;
            text-align: right;
          }
          &.today {
            .day-number {
              font-size: 20px;
              color: $--purple;
              width: 48px;
              height: 48px;
              line-height: 48px;
              border-radius: 100%;
              text-align: center;
              background: $--purple-assist;
              align-self: flex-end;
            }
          }
          .ordinary_tip {
            width: 100%;
            height: 30px;
            line-height: 30px;
            background: $--purple-assist;
            color: $--purple;
            display: inline-block;
            border-radius: 16px;
            font-weight: 500;
            font-size: 14px;
            padding-left: 16px;
            align-self: flex-end;
          }

          &.not-cur-month {
            .day-number {
              color: rgba(0, 0, 0, 0.24);
            }
          }

          .event-box {
            .event-item {
              cursor: pointer;
              font-size: 12px;
              //background-color:#C7E6FD;
              margin-bottom: 2px;
              //color: rgba(0,0,0,.87);
              padding: 0;
              height: 18px;
              line-height: 18px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              &.is-start {
                margin-left: 0;
                // border-top-left-radius:4px;
                // border-bottom-left-radius:4px;
              }

              &.is-end {
                margin-right: 4px;
                // border-top-right-radius:4px;
                // border-bottom-right-radius:4px;
              }

              &.is-opacity {
                opacity: 0;
              }
            }
          }
        }
        .today {
        }
      }
    }

    .more-events {
      position: absolute;
      width: 280px;
      z-index: 2;
      border: 1px solid #eee;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

      .more-header {
        background-color: #eee;
        padding: 5px;
        display: flex;
        align-items: center;
        font-size: 14px;

        .title {
          flex: 1;
        }

        .close {
          margin-right: 2px;
          cursor: pointer;
          font-size: 16px;
        }
      }

      .more-body {
        height: 146px;
        overflow: hidden;

        .body-list {
          height: 144px;
          padding: 5px;
          overflow: auto;
          background-color: #fff;

          .body-item {
            cursor: pointer;
            font-size: 12px;
            margin-bottom: 4px;
            color: rgba(0, 0, 0, 0.87);
            padding: 0 0 0 4px;
            height: 30px;
            line-height: 30px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}

.calendar_drawer {
  .el-drawer {
    padding-top: 16px;
    padding-left: 32px;
    padding-right: 27px;
    overflow: auto;
    .el-drawer__header {
      margin-bottom: 0;
      padding: 0;
      height: 70px;
      line-height: 70px;
      color: $--content;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid rgba(233, 232, 240, 1);
    }
    .el-drawer__body {
      .el-collapse {
        border: 0;
        .el-collapse-item {
          min-height: 60px;
          border: 0;
          .el-collapse-item__header {
            border: 0;
            .title_wrapper {
              color: rgba(66, 71, 95, 1);
              font-weight: bold;
              font-size: 18px;
              width: 100%;
              .title {
                margin-right: 8px;
              }
              .icon_time {
                font-size: 22px;
                color: $--purple;
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
                border: 1px solid $--purple;
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
                  padding-bottom: 0;
                }
                .applicant_name {
                  color: $--content;
                  font-weight: bold;
                  font-size: 16px;
                }
              }
              .el-form-item__label {
                font-weight: 500;
                color: #8e919f;
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
    }
  }
}
</style>
