<template>
  <div class="table-container">
    <basic-container>
      <commission-table ref="commissionTable" :id="commissionTableId" :company-id="companyId" :created="true" :show-button="false"/>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            :placeholder="$t('product.company.search_company_placeholder')"
            clearable
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
      </el-form>
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
            <div v-loading="commissionTableListLoading" class="clearfix">
              <el-timeline v-loading="commissionTableListLoading" id="commissionTableList">
                <div v-if="commissionTableList.list && commissionTableList.list.length === 0" style="text-align: center; color: #909399;">
                  {{ $t('product.commission.no_commission_table') }}
                </div>
                <el-timeline-item v-for="(commissionTable, index) in commissionTableList.list" :type="getCommissionStatus(commissionTable.status)" :key="index" :timestamp="getFormattedDate(commissionTable.effectiveDate)" placement="top">
                  <el-dropdown class="action-dropdown">
                    <el-button type="primary" plain size="mini">
                      <i class="el-icon-more"/>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-button
                          v-if="hasPermission(100017) && commissionTable.status !== 0"
                          size="small"
                          type="text"
                          icon="el-icon-view"
                          style="margin-right: 5px"
                          @click="handleView(commissionTable.id)">
                          {{ $t('common.view') }}
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <commission-table v-if="hasPermission(100018)" :id="commissionTable.id" :company-id="scope.row.id" :commission-remarks="commissionTable.remarks" :title="commissionTable.company.name"/>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          v-if="hasPermission(100020) && commissionTable.status !== 0"
                          :ref="`export_${commissionTable.id}`"
                          size="small"
                          type="text"
                          icon="el-icon-download"
                          @click="exportExcel(commissionTable)">{{ $t('common.export') }}</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          v-if="hasPermission(100019)"
                          size="small"
                          type="text"
                          icon="el-icon-delete"
                          @click="handleDelete(commissionTable, scope.row.id)">{{ $t('common.delete') }}
                        </el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-card>
                    <p style="display: inline-block">{{ $t('product.commission.commission_table_list.status') }} :
                      <el-tag v-if="commissionTable.status === 0" type="info" size="mini">{{ $t('product.commission.commission_table_list.status_info') }}</el-tag>
                      <el-tag v-if="commissionTable.status === 1" type="success" size="mini">{{ $t('product.commission.commission_table_list.status_success') }}</el-tag>
                      <el-tag v-if="commissionTable.status === 2" type="warning" size="mini">{{ $t('product.commission.commission_table_list.product_count') }}</el-tag>
                    </p>
                    <p style="display: inline-block; margin-left: 20px">{{ $t('product.commission.commission_table_list.product_count') }} : {{ commissionTable.policyCount }}</p>
                    <p v-if="commissionTable.remarks" style="display: inline-block; margin: 0 0 0 20px">{{ $t('common.remarks') }} : {{ commissionTable.remarks }}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('product.company.table_header.name')" prop="name" min-width="150px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.acronym }}  - {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('product.company.table_header.level')" prop="level" width="150px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.secondary" type="warning">{{ $t('product.company.levelTab.level2') }}</el-tag>
            <el-tag v-else type="success">{{ $t('product.company.levelTab.level1') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          :label="$t('product.company.table_header.contractEffectiveDate')"
          prop="contractEffectiveDate"
          min-width="100px"/>
      </el-table>
      <add v-if="hasPermission(100015)" @afterAddCommissionTable="handleAfterCreateCommissionTable"/>
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
const _ = require('lodash')
export default {
  components: {
    add,
    commissionView,
    commissionTable,
    pagination
  },
  data: function() {
    return {
      wildcard: '',
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
    search: _.debounce(function() {
      this.getCompanyList({ wildcard: this.wildcard })
    }, 500),
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
      this.$confirm(this.$t('product.commission.tooltip.delete'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.confirmButton'),
        cancelButtonText: this.$t('common.cancelButton'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$api.commission.deleteCommission(row.id).then(res => {
              this.$message({
                message: this.$t('common.success'),
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
        this.$confirm(this.$t('product.commission.tooltip.export'), this.$t('common.prompt'), {
          confirmButtonText: this.$t('common.confirmButton'),
          cancelButtonText: this.$t('common.cancelButton'),
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
        this.$confirm(this.$t('product.commission.tooltip.download'), this.$t('common.prompt'), {
          confirmButtonText: this.$t('common.confirmButton'),
          cancelButtonText: this.$t('common.cancelButton'),
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
                console.log(_)
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
  .el-table__body-wrapper {
    overflow-y: auto!important;
  }
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

