<template>
  <div id="paymentAudit" class="table-container">
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="status in commissionPaymentStatus" :name="status.id" :label="statusFormatter(status.id)" :key="status.id" lazy>
          <el-form :inline="true" class="search-input" @submit.native.prevent>
            <el-form-item label="" prop="wildcard">
              <el-input
                v-model="wildcard"
                clearable
                placeholder="搜索"
                @input="search">
                <i slot="prefix" class="el-input__icon el-icon-search"/>
              </el-input>
            </el-form-item>
          </el-form>
          <pagination :total="auditPayment.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
          <el-table v-loading="loading" :height="height" :data="auditPayment.list" stripe border>
            <el-table-column label="渠道" prop="channel.name" min-width="150"/>
            <el-table-column label="预计应发总额" min-width="120">
              <template slot-scope="scope">
                <span class="left_text">HK$</span><span class="right_text">{{ formatterCurrency(scope.row.calculatedTotalInHkd) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="预计实发总额" min-width="120">
              <template slot-scope="scope">
                <span class="left_text">HK$</span><span class="right_text">{{ formatterCurrency(scope.row.predictedTotalInHkd) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="实发总额" min-width="120">
              <template slot-scope="scope">
                <span class="left_text">HK$</span><span class="right_text">{{ formatterCurrency(scope.row.amountInHkd) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="activeName === '3'" label="支票号码" prop="chequeNumber"/>
            <el-table-column v-if="activeName === '3'" label="支票扫描件" prop="chequeCopy">
              <template slot-scope="scope">
                <el-button type="text" @click="viewScanFile(scope.row.chequeCopy)">查看扫描件</el-button>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100" align="center">
              <template slot-scope="scope">
                <el-tag v-if="activeName === '-1'" style="color: #409eff;">{{ statusFormatter(activeName) }}</el-tag>
                <el-tag v-if="activeName === '0'" type="warning">{{ statusFormatter(activeName) }}</el-tag>
                <el-tag v-if="activeName === '2'" type="success">{{ statusFormatter(activeName) }}</el-tag>
                <el-tag v-if="activeName === '3'" type="info">{{ statusFormatter(activeName) }}</el-tag>
                <!--<statusBadge v-if="activeName === '-1'" :text="statusFormatter(activeName)" type="processing-badge"/>-->
                <!--<statusBadge v-if="activeName === '0'" :text="statusFormatter(activeName)" type="warning-badge"/>-->
                <!--<statusBadge v-if="activeName === '2'" :text="statusFormatter(activeName)" type="success-badge"/>-->
                <!--<statusBadge v-if="activeName === '3'" :text="statusFormatter(activeName)"/>-->
              </template>
            </el-table-column>
            <el-table-column v-if="activeName !== '3'" label="操作" width="150" align="center">
              <template slot-scope="scope">
                <detail v-if="activeName === '-1'" :channel="scope.row.channel" :id="scope.row.id || 0" :status="activeName"/>
                <detail v-if="activeName === '0'" :channel="scope.row.channel" :id="scope.row.id || 0" :status="activeName"/>
                <clear v-if="activeName === '2'" :id="scope.row.id || 0"/>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import statusBadge from '@/components/StatusBadge'
import { mapGetters, mapState } from 'vuex'
import { commissionPaymentStatus } from '@/utils/constant'
import Cookies from 'js-cookie'
import detail from './detail'
import clear from './clear'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
const currencyFormatter = require('currency-formatter')
const _ = require('lodash')
export default {
  name: 'ChannelCommissionPayment',
  components: {
    pagination,
    statusBadge,
    detail,
    clear
  },
  data() {
    return {
      activeName: '-1',
      wildcard: '',
      commissionPaymentStatus,
      language: Cookies.get('language') || 'zh-CN',
      height: window.screen.height - 310,
      chequeCopy: [],
      listQuery: {
        page: 1,
        limit: 50
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({ auditPayment: state => state.commission.auditPayment })
  },
  created() {
    this.getAuditPayment({ status: -1 })
  },
  methods: {
    search: _.debounce(function() {
      this.getAuditPayment({ status: this.activeName, wildcard: this.wildcard })
    }, 500),
    statusFormatter(value) {
      let result = ''
      _.forEach(commissionPaymentStatus, item => {
        if (value === item.id) {
          result = item[this.language]
          return
        }
      })
      return result
    },
    formatterCurrency(value) {
      return currencyFormatter.format(value, { symbol: '' })
    },
    percentFormatter(row, column) {
      const number = row[column.property]
      return _.toNumber(number).toFixed(2) + '%'
    },
    formatterPercent(value) {
      return _.toNumber(value).toFixed(2) + '%'
    },
    viewScanFile(key) {
      this.$api.document.getCompanyDownloadLink(key).then(res => {
        this.chequeCopy = [res.data.url]
        const image = new Image()
        image.src = this.chequeCopy
        const viewer = new Viewer(image, {
          hidden: function() {
            viewer.destroy()
          }
        })
        viewer.show()
      })
    },
    getAuditPayment(params) {
      this.$store.dispatch('commission/FetchAuditPayment', params)
    },
    handleClick(tab, event) {
      this.getAuditPayment({ status: tab.name })
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max }
      this.getAuditPayment(params)
    },
    updatePage(val) {
      this.listQuery.page = val
    },
    updateLimit(val) {
      this.listQuery.limit = val
    }
  }
}
</script>
<style type="text/scss" lang="scss">
  .channelCommissionPayment-table-expand {
    font-size: 0;
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 33.3%;
      label {
        color: #99a9bf;
      }
    }
  }

  .left_text {
    display: inline-block;
    float: left;
  }

  .right_text {
    display: inline-block;
    float: right;
  }
  #paymentAudit {
    .el-card__body {
      padding: 10px
    }
  }
</style>
