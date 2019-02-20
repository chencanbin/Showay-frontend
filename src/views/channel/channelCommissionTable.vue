<template>
  <span style="margin-right: 5px">
    <el-button :loading="loading" icon="el-icon-setting" type="text" size="small" style="margin-left: 5px" @click="initForm" >
      设置佣金
    </el-button>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      :fullscreen="fullscreen"
      title="设置渠道佣金表">
      <el-table :data="data" :max-height="tableHeight" stripe>
        <el-table-column prop="viewableConditions.company.name" label="公司" width="80"/>
        <el-table-column prop="viewableConditions.product.name" label="产品" width="200"/>
        <el-table-column prop="term.period" label="年期"/>
        <el-table-column v-for="(year, index) in columnYear" :key="index" :label="year">
          <template slot-scope="scope">
            <span>{{ scope.row.conditions[index] ? scope.row.conditions[index].rate + '%' : '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
const _ = require('lodash')
export default {
  props: {
    users: {
      type: Array,
      default() {
        return []
      }
    },
    user: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      data: [],
      columnYear: [],
      fullscreen: true,
      dialogVisible: false,
      tableHeight: window.screen.height - 250
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    initForm() {
      this.$api.commission.fetchChannelCommissionTable().then(res => {
        if (res.data.list[res.data.list.length - 1]) {
          const id = res.data.list[res.data.list.length - 1].id
          this.$api.commission.getChannelCommissionTable(id).then(res => {
            this.data = res.data
            const conditionLengthArray = []
            this.columnYear = []
            _.forEach(res.data.viewableConditions.conditions, item => {
              conditionLengthArray.push(item.length)
            })
            _.forEach(_.range(1, _.max(conditionLengthArray) + 1), item => {
              if (item > 15) {
                this.columnYear.push('15年之后')
              } else {
                this.columnYear.push('第' + item + '年')
              }
            })
          })
        }
        this.dialogVisible = true
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleSubmit() {}
  }
}
</script>
