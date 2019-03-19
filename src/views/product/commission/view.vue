<template>
  <el-dialog
    id="commissionTable"
    :visible="dialogVisible"
    :before-close="handleClose"
    :title="title"
    :fullscreen="fullscreen"
    width="90%">
    <div style="display: inline-block; position: absolute; right: 20px; z-index: 3000;">
      <el-button :loading="loading" size="small" plain icon="el-icon-download" type="primary" @click="exportExcel()">导出</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="基础佣金表" name="basic">
        <el-table :data="data" :max-height="tableHeight" stripe>
          <el-table-column prop="product.acronym" label="编号" width="100" fixed="left"/>
          <el-table-column prop="product.name" label="产品名称(中文)" show-overflow-tooltip min-width="180" fixed="left"/>
          <el-table-column prop="product.enName" label="产品名称(英文)" show-overflow-tooltip min-width="180" fixed="left"/>
          <el-table-column prop="product.period" label="年期" width="80"/>
          <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.conditions[index] ? numberFormatter(scope.row.conditions[index].overallCommissionRate) : '-' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="总佣金表" name="overall">
        <el-table :data="data" :max-height="tableHeight" stripe>
          <el-table-column prop="product.acronym" label="编号" width="120" fixed="left"/>
          <el-table-column prop="product.name" label="产品名称(中文)" fixed="left" min-width="180" show-overflow-tooltip/>
          <el-table-column prop="product.enName" label="产品名称(英文)" fixed="left" min-width="180" show-overflow-tooltip/>
          <el-table-column prop="product.period" label="年期" width="80"/>
          <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year" align="right" width="90">
            <template slot-scope="scope">
              <div>{{ scope.row.conditions[index] ? numberFormatter(scope.row.conditions[index].overallCommissionRate) : '-' }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import numbro from 'numbro'
const _ = require('lodash')
export default {
  name: 'CommissionView',
  data() {
    return {
      activeName: 'basic',
      tableHeight: window.screen.height - 250,
      dialogVisible: false,
      title: '',
      id: '',
      data: [],
      columnYear: [],
      fullscreen: true
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    numbro,
    openDialog(id) {
      this.$api.commission.fetchCommissionTable(id).then(res => {
        this.data = res.data.list
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
        this.dialogVisible = true
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleTabClick(tab, event) {
      this.activeName = tab.name
    },
    numberFormatter(value) {
      return _.toNumber(value).toFixed(2) + '%'
    },
    exportExcel() {
      window.location.href = process.env.BASE_API + `/commissionTable/${this.id}/export`
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  #commissionTable .el-dialog__body {
    padding: 5px 20px;
  }
</style>
