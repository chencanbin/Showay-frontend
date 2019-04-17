<template>
  <el-dialog
    id="commissionTable"
    :visible="dialogVisible"
    :before-close="handleClose"
    :title="title"
    :fullscreen="fullscreen"
    width="90%">
    <div style="display: inline-block; position: absolute; right: 30px; top: 61px; z-index: 3000;">
      <el-input
        v-model="wildcard"
        clearable
        placeholder="搜索 (编号 | 中文 | 英文)"
        style="width: 300px;"
        @input="search">
        <i slot="prefix" class="el-input__icon el-icon-search"/>
      </el-input>
      <el-button :loading="loading" size="small" plain icon="el-icon-download" type="primary" @click="exportExcel()">导出</el-button>
    </div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="基础佣金表" name="basic">
        <el-table v-loading="viewLoading" :data="data" :max-height="tableHeight" stripe>
          <el-table-column prop="product.acronym" label="编号" width="100" fixed="left" show-overflow-tooltip/>
          <el-table-column prop="product.name" label="产品名称(中文)" show-overflow-tooltip min-width="180" fixed="left"/>
          <el-table-column prop="product.enName" label="产品名称(英文)" show-overflow-tooltip min-width="180" fixed="left"/>
          <el-table-column prop="product.period" label="年期" width="80"/>
          <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.conditions[index] ? numberFormatter(scope.row.conditions[index].basicCommissionRate) : '-' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      </el-tab-pane>
      <el-tab-pane label="总佣金表" name="overall">
        <span style="margin-bottom: 10px; display: inline-block">
          <el-checkbox v-model="ffyap" label="FFYAP" @change="ffyapChange"/>
        </span>
        <el-table v-loading="viewLoading" :data="data" :max-height="tableHeight" stripe>
          <el-table-column prop="product.acronym" label="编号" width="120" fixed="left" show-overflow-tooltip/>
          <el-table-column prop="product.name" label="产品名称(中文)" fixed="left" min-width="180" show-overflow-tooltip/>
          <el-table-column prop="product.enName" label="产品名称(英文)" fixed="left" min-width="180" show-overflow-tooltip/>
          <el-table-column prop="product.period" label="年期" width="80"/>
          <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" align="right" width="90">
            <template slot-scope="scope">
              <div>{{ scope.row.conditions[index] ? numberFormatter(scope.row.conditions[index].overallCommissionRate) : '-' }}</div>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import pagination from '@/components/Pagination'
const _ = require('lodash')
export default {
  name: 'CommissionView',
  components: {
    pagination
  },
  data() {
    return {
      viewLoading: false,
      ffyap: true,
      activeName: 'basic',
      wildcard: '',
      tableHeight: document.body.clientHeight - 180,
      dialogVisible: false,
      title: '',
      id: '',
      data: [],
      total: 0,
      columnYear: [],
      fullscreen: true,
      listQuery: {
        page: 1,
        limit: 50
      },
      offset: 0,
      max: 50
    }
  },
  methods: {
    search: _.debounce(function() {
      this.listQuery = { page: 1, limit: 50 }
      this.getCommissionTableList({ wildcard: this.wildcard })
    }, 500),
    openDialog(id) {
      this.dialogVisible = true
      this.viewLoading = true
      this.data = []
      this.$api.commission.fetchCommissionTable(id, { ffyap: this.ffyap }).then(res => {
        this.data = res.data.list
        this.total = res.data.total
        this.id = id
        this.title = res.data.company.name + ' 佣金表'
        const conditionLengthArray = []
        this.columnYear = []
        _.forEach(res.data.list, item => {
          conditionLengthArray.push(item.conditions.length)
        })
        _.forEach(_.range(1, _.max(conditionLengthArray) + 1), item => {
          if (item > 15) {
            this.columnYear.push('15年之后')
          } else {
            this.columnYear.push('第' + item + '年')
          }
        })
        this.viewLoading = false
      }).catch(_ => {
        this.viewLoading = false
      })
    },
    getCommissionTableList(p) {
      this.viewLoading = true
      const params = { offset: this.offset, max: this.max, ffyap: this.ffyap, wildcard: this.wildcard }
      this.$api.commission.fetchCommissionTable(this.id, params).then(res => {
        this.data = res.data.list
        this.total = res.data.total
        const conditionLengthArray = []
        this.columnYear = []
        _.forEach(res.data.list, item => {
          conditionLengthArray.push(item.conditions.length)
        })
        _.forEach(_.range(1, _.max(conditionLengthArray) + 1), item => {
          if (item > 15) {
            this.columnYear.push('15年之后')
          } else {
            this.columnYear.push('第' + item + '年')
          }
        })
        this.viewLoading = false
      }).catch(_ => {
        this.viewLoading = true
      })
    },
    handleClose() {
      this.wildcard = ''
      this.listQuery = { page: 1, limit: 50 }
      this.dialogVisible = false
    },
    numberFormatter(value) {
      return _.toNumber(value).toFixed(2) + '%'
    },
    exportExcel() {
      window.location.href = process.env.BASE_API + `/commissionTable/${this.id}/export`
    },
    pagination(pageObj) {
      this.offset = (pageObj.page - 1) * pageObj.limit
      this.max = pageObj.limit
      this.getCommissionTableList()
    },
    updatePage(val) {
      this.listQuery.page = val
    },
    updateLimit(val) {
      this.listQuery.limit = val
    },
    ffyapChange() {
      this.getCommissionTableList({ ffyap: this.ffyap })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
  #commissionTable .el-dialog__body {
    padding: 10px 10px 5px 10px;
    .el-tabs--border-card>.el-tabs__content {
      padding: 10px
    }
  }
</style>
