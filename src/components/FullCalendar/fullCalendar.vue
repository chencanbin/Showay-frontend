<template>
  <div class="comp-full-calendar">
    <!-- header pick month -->
    <fc-header
      :current-month="currentMonth"
      :first-day="firstDay"
      :locale="locale"
      @change="emitChangeMonth"
    >
      <div slot="header-left">
        <slot name="fc-header-left" />
      </div>
      <div slot="header-right">
        <slot name="fc-header-right" />
      </div>
    </fc-header>
    <!-- body display date day and events -->
    <div 
      class="full-calendar-body" 
      @click="showMore = false">
      <div class="weeks">
        <strong 
          v-for="(dayIndex, index) in 7" 
          :key="index" 
          class="week">{{
            (dayIndex - 1) | localeWeekDay(firstDay, locale)
          }}</strong>
      </div>
      <div 
        ref="dates" 
        class="dates">
        <div class="dates-bg">
          <div
            v-for="(week, index) in currentDates"
            :key="index"
            class="week-row"
          >
            <div
              v-for="(day, index) in week"
              :key="index"
              :class="{ today: day.isToday, 'not-cur-month': !day.isCurMonth }"
              class="day-cell"
            >
              <p class="day-number">{{ day.monthDay }}</p>
            </div>
          </div>
        </div>

        <!-- absolute so we can make dynamic td -->
        <div class="dates-events">
          <div
            v-for="(week, index) in currentDates"
            :key="index"
            class="events-week"
          >
            <div
              v-for="(day, index) in week"
              :key="index"
              :class="{ today: day.isToday, 'not-cur-month': !day.isCurMonth }"
              track-by="$index"
              class="events-day"
            >
              <!--@click.stop="dayClick(day.date, $event)"-->
              <p class="day-number">{{ day.monthDay }}</p>
              <sup
                v-if="day.events.length > eventLimit"
                class="el-badge__content more-link"
                @click.stop="selectThisDay(day, $event)"
              >{{
                day.events[day.events.length - 1].cellIndex - eventLimit
              }}</sup
              >
              <div class="event-box">
                <event-card
                  v-for="(event, index) in day.events"
                  v-show="event.cellIndex <= eventLimit"
                  :event="event"
                  :date="day.date"
                  :first-day="firstDay"
                  :key="index"
                  @click="eventClick"
                >
                  <template slot-scope="p">
                    <slot 
                      :event="p.event" 
                      name="fc-event-card" />
                  </template>
                </event-card>
                <!--<p-->
                <!--v-if="day.events.length > eventLimit"-->
                <!--class="more-link"-->
                <!--@click.stop="selectThisDay(day, $event)">-->
                <!--+ {{ day.events[day.events.length -1].cellIndex - eventLimit }} more-->
                <!--</p>-->
              </div>
            </div>
          </div>
        </div>

        <!-- full events when click show more -->
        <div
          v-if="showMore"
          :style="{ left: morePos.left + 'px', top: morePos.top + 'px' }"
          class="more-events"
        >
          <div class="more-header">
            <span class="title">{{ moreTitle(selectDay.date) }}</span>
            <span 
              class="close" 
              @click.stop="showMore = false">x</span>
          </div>
          <div class="more-body">
            <ul class="body-list">
              <li
                v-for="(event, index) in selectDay.events"
                v-if="event.isShow"
                :key="index"
                class="body-item"
                @click="eventClick(event, $event)"
              >
                <slot 
                  :event="event" 
                  name="fc-event-more-item" />
              </li>
            </ul>
          </div>
        </div>
        <slot name="body-card" />
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
// import langSets from './dataMap/langSets'
import dateFunc from "./components/dateFunc";
import moment from "moment";
import EventCard from "./components/eventCard";
import header from "./components/header";

export default {
  components: {
    "event-card": EventCard,
    "fc-header": header,
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
      currentMonth: moment().startOf("month"),
      isLismit: true,
      eventLimit: 6,
      showMore: false,
      morePos: {
        top: 0,
        left: 0,
      },
      selectDay: {},
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
    dayClick(day, jsEvent) {
      this.$emit("dayClick", day, jsEvent);
    },
    eventClick(event, jsEvent) {
      if (!event.isShow) return;

      jsEvent.stopPropagation();
      const pos = this.computePos(jsEvent.target);
      this.$emit("eventClick", event, jsEvent, pos);
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
        min-height: 250px;
        padding: 4px;
        border-right: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;

        .day-number {
          text-align: left;
        }

        &.today {
          background-color: #fcf8e3;
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
          min-height: 250px;
          overflow: hidden;
          text-overflow: ellipsis;

          .day-number {
            text-align: right;
            padding: 6px;
            opacity: 0;
          }

          &.not-cur-month {
            .day-number {
              color: rgba(0, 0, 0, 0.24);
            }
          }
          .more-link {
            cursor: pointer;
            // text-align: right;
            margin-top: -14px;
            margin-right: 4px;
            float: right;
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
</style>
