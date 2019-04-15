<template>
  <div class="table-container">
    <basic-container>
      <commission-table ref="commissionTable" :id="commissionTableId" :company-id="companyId" :created="true" :show-button="false"/>
      <!--<el-form :inline="true" class="search-input" @submit.native.prevent>-->
      <!--<el-form-item label="" prop="company">-->
      <!--<el-select-->
      <!--v-model="companyId"-->
      <!--:remote-method="remoteSearch"-->
      <!--filterable-->
      <!--clearable-->
      <!--remote-->
      <!--placeholder="搜索(供应商)"-->
      <!--@change="companyChange">-->
      <!--<el-option-->
      <!--v-for="company in companyList"-->
      <!--:key="company.id"-->
      <!--:value="company.id"-->
      <!--:label="company.name"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <pagination :total="companyList.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <el-table
        v-loading="companyLoading"
        ref="companyTable"
        :expand-row-keys="expandKeys"
        :height="height"
        :data="companyList.list"
        row-key="id"
        stripe
        @expand-change="expandChange"
      >
        <el-table-column type="expand" width="60px">
          <template slot-scope="scope" style="width: 50%;">
            <el-timeline v-loading="commissionTableListLoading" id="commissionTableList">
              <div v-if="commissionTableList.list && commissionTableList.list.length === 0" style="text-align: center; color: #909399;">
                无佣金表
              </div>
              <el-timeline-item v-for="(commissionTable, index) in commissionTableList.list" :type="getCommissionStatus(commissionTable.status)" :key="index" :timestamp="getFormattedDate(commissionTable.effectiveDate)" placement="top">
                <el-dropdown class="action-dropdown">
                  <el-button type="primary" plain size="mini">
                    <i class="el-icon-more"/>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <el-button
                        v-if="commissionTable.status !== 0"
                        size="mini"
                        type="text"
                        icon="el-icon-view"
                        style="margin-right: 5px"
                        @click="handleView(commissionTable.id)">
                        查看
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <commission-table :id="commissionTable.id" :company-id="scope.row.id" :title="commissionTable.company.name"/>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        v-if="commissionTable.status !== 0"
                        :ref="`export_${commissionTable.id}`"
                        size="mini"
                        type="text"
                        icon="el-icon-download"
                        @click="exportExcel(commissionTable)">导出Excel</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(commissionTable, scope.row.id)">删除
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-card>
                  <p style="display: inline-block">状态 :
                    <el-tag v-if="commissionTable.status === 0" type="info" size="mini">未发布</el-tag>
                    <el-tag v-if="commissionTable.status === 1" type="success" size="mini">已发布</el-tag>
                    <el-tag v-if="commissionTable.status === 2" type="warning" size="mini">有改动</el-tag>
                  </p>
                  <p style="display: inline-block; margin-left: 20px">产品数 : {{ commissionTable.policyCount }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </template>
        </el-table-column>
        <el-table-column prop="acronym" label="公司缩写"/>
        <el-table-column prop="name" label="公司名" show-overflow-tooltip min-width="200px"/>
        <el-table-column prop="level" label="级别">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.secondary" type="warning">二级</el-tag>
            <el-tag v-else type="success">一级</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="contractEffectiveDate"
          label="签约时间"
          min-width="100px"/>
          <!--<el-table-column label="操作">-->
          <!--<template slot-scope="scope">-->
          <!--<el-button type="text" size="mini" @click="toggleCommissionTableList(scope.row)">-->
          <!--<svg-icon icon-class="commissionList"/>-->
          <!--佣金列表-->
          <!--</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--:formatter="dateFormat"-->
          <!--width="200"-->
          <!--prop="effectiveDate"-->
          <!--label="生效时间"/>-->
          <!--<el-table-column-->
          <!--:formatter="dateFormat"-->
          <!--width="200"-->
          <!--prop="expirationDate"-->
          <!--label="失效时间"/>-->
          <!--<el-table-column-->
          <!--align="center"-->
          <!--width="140"-->
          <!--prop="status"-->
          <!--label="状态">-->
          <!--<template slot-scope="scope">-->
          <!--<el-tag v-if="scope.row.status === 0" type="info">未发布</el-tag>-->
          <!--<el-tag v-if="scope.row.status === 1" type="success">已发布</el-tag>-->
          <!--<el-tag v-if="scope.row.status === 2" type="warning">有改动</el-tag>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="操作" width="300">-->
          <!--<template slot-scope="scope">-->
          <!--<el-button-->
          <!--v-if="scope.row.status !== 0"-->
          <!--size="mini"-->
          <!--type="text"-->
          <!--icon="el-icon-view"-->
          <!--style="margin-right: 5px"-->
          <!--@click="handleView(scope.row.id)">-->
          <!--查看-->
          <!--</el-button>-->
          <!--<commission-table :id="scope.row.id" :title="scope.row.company.name"/>-->
          <!--<el-button-->
          <!--v-if="scope.row.status !== 0"-->
          <!--size="mini"-->
          <!--type="text"-->
          <!--icon="el-icon-download"-->
          <!--@click="exportExcel(scope.row)">导出Excel</el-button>-->
          <!--<el-button-->
          <!--size="mini"-->
          <!--type="text"-->
          <!--icon="el-icon-delete"-->
          <!--@click="handleDelete(scope.$index, scope.row)">删除-->
          <!--</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
      </el-table>
      <add @afterAddCommissionTable="handleAfterCreateCommissionTable"/>
    </basic-container>
    <commission-view ref="commissionView"/>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { mapState } from 'vuex'
import commissionTable from './commissionTable'
import add from './add'
import commissionView from './view'
import axios from 'axios'

export default {
  components: {
    add,
    commissionView,
    commissionTable,
    pagination
  },
  data: function() {
    return {
      expandKeys: [],
      showExpandRow: false,
      height: document.body.clientHeight - 190,
      listQuery: {
        page: 1,
        limit: 50
      },
      companyId: 0,
      commissionTableId: 0
    }
  },
  computed: {
    ...mapState(
      {
        commissionTableListLoading: state => state.commission.commissionTableListLoading,
        companyLoading: state => state.company.companyLoading,
        companyList: state => state.company.companyList,
        commissionTableList: state => state.commission.commissionTableList
      })
  },
  mounted() {
    this.getCompanyList()
    // this.getCommissionTableList()
  },
  methods: {
    getCommissionTableList(id, params) {
      this.$store.dispatch('commission/FetchCommissionTableList', { id, params })
    },
    getCompanyList(param) {
      this.$store.dispatch('company/FetchCompanyList', param)
    },
    companyChange(value) {
      this.getCommissionTableList(value)
    },
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date, '{y}-{m}-{d}')
    },
    getCommissionStatus(val) {
      if (val === 0) {
        return 'info'
      } else if (val === 1) {
        return 'success'
      } else if (val === 2) {
        return 'warning'
      }
    },
    getFormattedDate(value) {
      return parseTime(value, '{y}-{m}-{d}')
    },
    remoteSearch(query) {
      this.$store.dispatch('company/FetchCompanyList', { name: query })
    },
    handleDelete(row, companyId) {
      this.$confirm('此操作将永久删除该策略表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$api.commission.deleteCommission(row.id).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 5 * 1000
              })
              instance.confirmButtonLoading = false
              done()
              this.getCommissionTableList(companyId)
            }).catch(_ => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      })
    },
    // showCommissionTable(id) {
    //   this.$store.commit('commission/SHOW_COMMISSION_TABLE_DIALOG_VISIBLE', id)
    // },
    exportExcel(row) {
      const effectiveDate = parseTime(row.effectiveDate, '{y}-{m}-{d}')
      const fileName = `${row.company.name} EffectiveDate ${effectiveDate}.xlsx`
      const url = process.env.BASE_API + `/commissionTable/${row.id}/export`
      if (row.status === 2) {
        this.$confirm('导出的部分不包含未发布的内容, 是否继续导出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              axios.get(url, {
                responseType: 'blob'
              }).then(res => {
                const blob = new Blob([res.data])
                const downloadElement = document.createElement('a')
                const href = window.URL.createObjectURL(blob) //  创建下载的链接
                downloadElement.href = href
                downloadElement.download = fileName //  下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() //  点击下载
                document.body.removeChild(downloadElement) // 下载完成移除元素
                window.URL.revokeObjectURL(href) // 释放blob对象
                instance.confirmButtonLoading = false
                done()
              }).catch(_ => {
                instance.confirmButtonLoading = false
              })
            } else {
              done()
            }
          }
        })
      } else {
        this.$confirm('导出文件需要较多时间, 是否继续导出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              axios.get(url, {
                responseType: 'blob'
              }).then(res => {
                const blob = new Blob([res.data])
                const downloadElement = document.createElement('a')
                const href = window.URL.createObjectURL(blob) //  创建下载的链接
                downloadElement.href = href
                downloadElement.download = fileName //  下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() //  点击下载
                document.body.removeChild(downloadElement) // 下载完成移除元素
                window.URL.revokeObjectURL(href) // 释放blob对象
                instance.confirmButtonLoading = false
                done()
              }).catch(_ => {
                instance.confirmButtonLoading = false
              })
            } else {
              done()
            }
          }
        })
      }
    },
    // exportExcel(row) {
    //   if (row.status === 2) {
    //     this.$confirm('导出的部分不包含未发布的内容, 是否继续导出?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       window.location.href = process.env.BASE_API + `/commissionTable/${row.id}/export`
    //     })
    //   } else {
    //     window.location.href = process.env.BASE_API + `/commissionTable/${row.id}/export`
    //   }
    // },
    handleView(id) {
      this.$refs.commissionView.openDialog(id)
    },
    dbRowClick(row) {
      this.$refs.commissionView.openDialog(row.id)
    },
    handleAfterCreateCommissionTable(id, companyId) {
      this.commissionTableId = id
      this.companyId = companyId
      this.$refs.commissionTable.initForm()
    },
    toggleCommissionTableList(row) {
      if (this.expandKeys[0] && row.id !== this.expandKeys[0]) {
        this.showExpandRow = true
      } else {
        this.showExpandRow = !this.showExpandRow
      }
      this.$refs.companyTable.toggleRowExpansion(row, this.showExpandRow)
    },
    expandChange(row, expandedRows) {
      if (this.expandKeys.indexOf(row.id) >= 0) {
        // 收起当前行
        this.expandKeys.shift()
        return
      }
      this.getCommissionTableList(row.id)
      this.expandKeys.shift()
      this.expandKeys.push(row.id)
      if (expandedRows.length > 1) {
        // 只展开当前选项
        expandedRows.shift()
      }
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max }
      this.getCommissionTableList('', params)
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
  #commissionTableList {
    .el-table__expanded-cell {
      padding: 20px;
    }
    /*h4 {*/
      /*margin: 10px 0;*/
      /*font-weight: 400;*/
      /*color: #1f2f3d;*/
    /*}*/
    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.5em;
    }
    .el-card {
      padding: 0 15px;
      .button {
        padding: 0;
        float: right;
      }
      .clearfix:before, .clearfix:after {
        display: table;
        content: "";
      }
      .clearfix:after {
        clear: both
      }
    }
    .el-card.is-always-shadow {
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    .action-dropdown {
      display: inline-block;
      position: relative;
      color: #606266;
      font-size: 14px;
      position: absolute;
      top: -2px;
      left: 110px;
    }
  }
</style>

