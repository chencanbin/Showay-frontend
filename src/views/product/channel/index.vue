<template>
  <div id="channel" class="table-container">
    <basic-container>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            clearable
            placeholder="搜索 (姓名 | 账号)"
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
      </el-form>
      <pagination :total="users.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <el-table
        v-loading="userLoading"
        id="channelTable"
        ref="channelTable"
        :height="height"
        :data="users.list"
        :expand-row-keys="expandKeys"
        stripe
        row-key="id"
        @expand-change="expandChange">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-timeline v-loading="channelCommissionLoading" id="channelCommissionTableList">
              <div v-if="channelCommissionTableList.list.length === 0" style="text-align: center; color: #909399;">
                无渠道佣金策略
              </div>
              <el-timeline-item v-for="(item, index) in channelCommissionTableList.list" :key="index" :timestamp="getFormattedDate(item.effectiveDate)" placement="top">
                <el-card>
                  <!--<p style="display: inline-block; margin-left: 20px">产品数 : {{ commissionTable.policyCount }}</p>-->
                  <div class="bottom clearfix">
                    <el-button
                      v-if="item.status !== 0"
                      type="text"
                      size="mini"
                      icon="el-icon-view"
                      @click="handleTimestampDialog(item.id, item.effectiveDate, scope.row.name)">
                      查看
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-download"
                      @click="exportPDF(item.id)">导出</el-button>
                    <editChannelCommissionTable :id="item.id" :effective-date="item.effectiveDate" :remarks="item.remarks"/>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click="handleDeleteChannelCommissionTable(item)">删除</el-button>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <addChannelCommissionTable :effective-date="scope.row.effectiveDate" :id="scope.row.id"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.table_header.name')" prop="name" show-overflow-tooltip/>
        <el-table-column :label="$t('user.table_header.account')" prop="login"/>
        <el-table-column label="上级" prop="superior.name"/>
        <el-table-column :label="$t('common.action')" width="250px">
          <template slot-scope="scope">
            <!--<el-button type="text" size="mini" style="margin-right: 10px" @click="toggleChannelPolicy(scope.row)">-->
            <!--<svg-icon icon-class="commissionPolicy"/>-->
            <!--渠道策略-->
            <!--</el-button>-->
            <el-dropdown style="margin-left: 10px">
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit v-if="!scope.row.isBuiltin" :user="scope.row"/>
                </el-dropdown-item>
                <el-dropdown-item>
                  <commission-policy :id="scope.row.id"/>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!--<el-button-->
            <!--v-if="!scope.row.isBuiltin"-->
            <!--type="text"-->
            <!--size="mini"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.$index, scope.row)">{{ $t('action.del') }}-->
            <!--</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <add/>
      <channelCommissionView ref="channelCommissionView"/>
      <el-dialog
        :visible.sync="timeDialogVisible"
        width="400px"
        title="选择参考时间">
        <el-date-picker
          v-model="channelPolicyObj.timestamp"
          type="date"
          value-format="timestamp"
          style="width: 100%"/>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleView">确定</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import add from './add'
import edit from './edit'
import channelCommissionView from './view'
import addChannelCommissionTable from './addChannelCommissionTable'
import editChannelCommissionTable from './editChannelCommissionTable'
import commissionPolicy from './commissionPolicy'
import pagination from '@/components/Pagination'
import { mapState } from 'vuex'
import { parseTime } from '@/utils'
const _ = require('lodash')
export default {
  name: 'Channel',
  components: {
    add,
    edit,
    addChannelCommissionTable,
    editChannelCommissionTable,
    pagination,
    channelCommissionView,
    commissionPolicy
  },
  data() {
    return {
      height: document.body.clientHeight - 190,
      timeDialogVisible: false,
      channelName: '',
      channelPolicyObj: {
        id: '',
        timestamp: ''
      },
      wildcard: '',
      listQuery: {
        page: 1,
        limit: 50
      },
      expandKeys: [],
      showExpandRow: false
    }
  },
  computed: {
    ...mapState({
      userLoading: state => state.user.userLoading,
      channelCommissionLoading: state => state.client.channelCommissionLoading,
      users: state => state.user.users,
      channelCommissionTableList: state => state.client.channelCommissionTableList
    })
  },
  created() {
    this.getUsers()
  },
  methods: {
    parseTime,
    search: _.debounce(function() {
      this.getUsers({ role: 2, wildcard: this.wildcard })
    }, 500),
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该渠道账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.user.deleteUser(row.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getUsers()
        })
      })
    },
    handleDeleteChannelCommissionTable(scope) {
      this.$confirm('此操作将永久删除该渠道佣金表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$api.channel.deleteChannelCommissionPolicy(scope.id).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.getChannelCommissionTableList({ channel: scope.channel.id })
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
    },
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date)
    },
    getFormattedDate(value) {
      return parseTime(value, '{y}-{m}-{d}')
    },
    rateFormat(value) {
      if (value) {
        return _.toNumber(value).toFixed(2) + '%'
      }
      return ''
    },
    getUsers(params = { role: 2 }) {
      this.$store.dispatch('FetchUserList', params)
    },
    getChannelCommissionTableList(params) {
      return this.$store.dispatch('client/FetchChannelCommissionTable', params)
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max, role: 2 }
      this.getUsers(params)
    },
    expandChange(row, expandedRows) {
      if (this.expandKeys.indexOf(row.id) >= 0) {
        // 收起当前行
        this.expandKeys.shift()
        return
      }
      this.getChannelCommissionTableList({ channel: row.id })
      this.expandKeys.shift()
      this.expandKeys.push(row.id)
      if (expandedRows.length > 1) {
        // 只展开当前选项
        expandedRows.shift()
      }
    },
    toggleChannelPolicy(row) {
      if (this.expandKeys[0] && row.id !== this.expandKeys[0]) {
        this.showExpandRow = true
      } else {
        this.showExpandRow = !this.showExpandRow
      }
      this.$refs.channelTable.toggleRowExpansion(row, this.showExpandRow)
    },
    handleTimestampDialog(id, effectiveDate, name) {
      this.channelPolicyObj.timestamp = effectiveDate
      this.channelPolicyObj.id = id
      this.channelName = name
      this.timeDialogVisible = true
    },
    handleView() {
      this.$refs.channelCommissionView.openDialog(this.channelPolicyObj, this.channelName)
      this.timeDialogVisible = false
    },
    exportPDF(id) {
      window.location.href = process.env.BASE_API + `/channelCommissionTable/${id}/export`
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
<style lang="scss" rel="stylesheet/scss" type="text/scss">
  #channel {
    .el-table__expanded-cell {
      padding: 20px 20px 5px 20px;
    }
  }
 #channelCommissionTableList {
   .el-form-item {
     margin-bottom: 12px;
     .el-form-item__label {
       color: #99a9bf;
       font-size: 12px;
     }
     .el-form-item__content {
       font-size: 12px;
     }
   }
    p {
     font-size: 14px;
     color: #5e6d82;
     line-height: 1.5em;
    }
   .el-card {
     padding: 15px;
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
 }
</style>
