<template>
  <span>
    <el-badge
      :hidden="events.length === 0"
      :value="events.length"
      :max="99"
      style="line-height: 35px"
    >
      <svg-icon
        icon-class="calendar"
        style="vertical-align: 1.1em; font-size: 20px"
        @click="initForm"
      />
    </el-badge>
    <el-dialog
      id="renewalCalendar"
      :visible="dialogVisible"
      :before-close="handleClose"
      :fullscreen="true"
      :title="$t('client.insurance_policy.renewal_calendar')"
      append-to-body
    >
      <full-calendar
        ref="fullCalendar"
        :events="events"
        locale="zh-cn"
        @changeMonth="changeMonth"
      >
        <template 
          slot="fc-event-more-item" 
          slot-scope="p">
          <el-popover 
            placement="top-start" 
            trigger="click">
            <el-card style="padding: 10px">
              <el-form label-width="80px">
                <el-form-item
                  :label="$t('client.insurance_policy.applicant_name')"
                  class="detail-item"
                >
                  {{ p.event.detail.applicant.name }}
                </el-form-item>
                <el-form-item
                  :label="$t('client.info.phone')"
                  class="detail-item"
                >
                  {{ p.event.detail.applicant.phone }}
                </el-form-item>
                <el-form-item
                  :label="$t('client.info.email')"
                  class="detail-item"
                >
                  {{ p.event.detail.applicant.email }}
                </el-form-item>
                <el-form-item
                  :label="$t('client.insurance_policy.renewal_time')"
                  class="detail-item"
                >
                  {{ getFormattedDate(p.event.start) }}
                </el-form-item>
                <el-form-item
                  :label="$t('client.insurance_policy.product')"
                  class="detail-item"
                >
                  {{ p.event.detail.product.name }}
                </el-form-item>
                <el-form-item
                  v-if="hasPermission(100053)"
                  :label="$t('client.insurance_policy.renewed')"
                  class="detail-item"
                >
                  <el-checkbox
                    :checked="p.event.detail.status === 1"
                    @change="renewalChange(p.event)"
                  />
                </el-form-item>
                <div style="text-align: center">
                  <el-button
                    v-if="hasRoles([1, 3])"
                    @click="handleSendEmail(p.event)"
                  >{{
                    $t("client.insurance_policy.renewal_notification")
                  }}</el-button
                  >
                </div>
              </el-form>
            </el-card>
            <el-tooltip
              slot="reference"
              :content="p.event.title"
              :open-delay="1000"
              effect="dark"
              placement="top-start"
            >
              <p :class="judgeEventStatus(p.event)">{{ p.event.title }}</p>
            </el-tooltip>
          </el-popover>
        </template>
        <template 
          slot="fc-event-card" 
          slot-scope="p">
          <el-popover 
            placement="top-start" 
            trigger="click">
            <el-card style="padding: 10px">
              <el-form label-width="80px">
                <el-form-item
                  :label="$t('client.insurance_policy.applicant_name')"
                  class="detail-item"
                >
                  {{ p.event.detail.applicant.name }}
                </el-form-item>
                <el-form-item
                  :label="$t('client.info.phone')"
                  class="detail-item"
                >
                  {{ p.event.detail.applicant.phone }}
                </el-form-item>
                <el-form-item
                  :label="$t('client.info.email')"
                  class="detail-item"
                >
                  {{ p.event.detail.applicant.email }}
                </el-form-item>
                <el-form-item
                  :label="$t('client.insurance_policy.renewal_time')"
                  class="detail-item"
                >
                  {{ getFormattedDate(p.event.start) }}
                </el-form-item>
                <el-form-item
                  :label="$t('client.insurance_policy.product')"
                  class="detail-item"
                >
                  {{ p.event.detail.product.name }}
                </el-form-item>
                <el-form-item
                  v-if="hasPermission(100053)"
                  :label="$t('client.insurance_policy.renewed')"
                  class="detail-item"
                >
                  <el-checkbox
                    :checked="p.event.detail.status === 1"
                    @change="renewalChange(p.event)"
                  />
                </el-form-item>
                <div style="text-align: center">
                  <el-button
                    v-if="hasRoles([1, 3])"
                    @click="handleSendEmail(p.event)"
                  >{{
                    $t("client.insurance_policy.renewal_notification")
                  }}</el-button
                  >
                </div>
              </el-form>
            </el-card>
            <!--<p slot="reference" :class="judgeEventStatus(p.event)">{{ p.event.title }}</p>-->
            <el-tooltip
              slot="reference"
              :content="p.event.title"
              :open-delay="1000"
              effect="dark"
              placement="top-start"
            >
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
        .catch((_) => {});
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
    renewalChange(val) {
      this.$api.client.editCalendarRenewal(val.detail.id).then((res) => {
        this.$message({
          message: this.$t("common.success"),
          type: "success",
          duration: 5 * 1000,
        });
        this.getCalendarRenewal({ from: this.from, to: this.to });
      });
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
  },
};
</script>

<style type="text/scss" lang="scss">
#renewalCalendar {
  line-height: 10px;
  .el-dialog__body {
    padding: 0;
  }
  .comp-full-calendar {
    max-width: 100%;
    padding: 10px;
    .weeks {
      line-height: 40px;
    }
    .event-item,
    .body-item {
      position: relative;
      padding: 1px 4px;
      font-size: 12px;
      width: 100%;
      height: 35px;
      line-height: 35px;
      .el-popover__reference {
        padding: 1px 4px;
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
