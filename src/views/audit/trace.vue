<template>
  <span id="trace">
    <el-button type="text" size="mini" icon="el-icon-edit" style="margin-right: 10px" @click="initForm">审计列表</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="保单审计列表"
      top="10px"
      width="450px">
      <div class="block" style="min-height: 200px">
        <el-timeline v-loading="loading">
          <el-timeline-item v-for="trace in traceList" :key="trace.id" :timestamp="dateFormat(trace.timestamp)" placement="top">
            <el-card>
              <h4>{{ getTraceDesc(trace.type) }}</h4>
              <p>操作者: {{ trace.doer.name }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog'
import { parseTime } from '@/utils'
import { insurancePolicyTrace } from '@/utils/constant'
import Cookies from 'js-cookie'

export default {
  name: '',
  directives: { elDragDialog },
  props: {
    number: {
      type: String,
      default: '',
      desc: '保单号'
    }
  },
  data() {
    return {
      language: '',
      traceList: [],
      dialogVisible: false,
      loading: false
    }
  },
  methods: {
    initForm() {
      this.dialogVisible = true
      this.language = Cookies.get('language') || 'zh-CN'
      this.loading = true
      this.$api.product.traceInsurancePolicy(this.number).then(res => {
        this.traceList = res.data.list
        this.loading = false
      }).catch(_ => {
        this.loading = false
      })
    },
    dateFormat(date) {
      return parseTime(date)
    },
    handleClose() {
      this.dialogVisible = false
    },
    getTraceDesc(type) {
      for (let i = 0; i < insurancePolicyTrace.length; i++) {
        if (insurancePolicyTrace[i].id === type) {
          return insurancePolicyTrace[i][this.language]
        }
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss">
 #trace {
   h4 {
     margin: 10px 0;
     font-weight: 400;
     color: #1f2f3d;
   }
   p {
     font-size: 14px;
     color: #5e6d82;
     line-height: 1.5em;
   }
   .el-card {
     padding: 0 15px
   }
   .el-card.is-always-shadow {
     box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
   }
 }
</style>
