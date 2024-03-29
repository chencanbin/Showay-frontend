<template>
  <div id="channel" class="table-container">
    <basic-container>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            :placeholder="$t('product.channel.search_channel_placeholder')"
            clearable
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
            <div v-loading="channelCommissionLoading" class="clearfix" style="min-height: 50px;">
              <el-timeline id="channelCommissionTableList">
                <div v-if="channelCommissionTableList.list && channelCommissionTableList.list.length === 0" style="text-align: center; color: #909399;">
                  {{ $t('product.channel.no_channel_policy') }}
                </div>
                <el-timeline-item v-for="(item, index) in channelCommissionTableList.list" :key="index" :timestamp="getFormattedDate(item.effectiveDate)" placement="top">
                  <el-dropdown class="action-dropdown">
                    <el-button type="primary" plain size="mini">
                      <i class="el-icon-more"/>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-button
                          v-if="hasPermission(100035) && item.status !== 0"
                          type="text"
                          size="small"
                          @click="handleTimestampDialog(item.id, item.effectiveDate, scope.row.name)">
                          {{ $t('common.view') }}
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <editChannelCommissionTable v-if="hasPermission(100032)" :id="item.id" :effective-date="item.effectiveDate" :remarks="item.remarks" :channel-name="scope.row.name" :channel-id="scope.row.id"/>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button v-if="hasPermission(100033)" type="text" size="small" @click="verifyPassword(item)">{{ $t('common.delete') }}</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-card v-if="item.remarks">
                    <!--<p style="display: inline-block; margin-left: 20px">产品数 : {{ commissionTable.policyCount }}</p>-->
                    <div class="bottom clearfix">

                      <!--<el-button-->
                      <!--type="text"-->
                      <!--size="mini"-->
                      <!--icon="el-icon-download"-->
                      <!--@click="exportPDF(item.id)">导出</el-button>-->
                      <p style="display: inline-block; margin: 0">{{ $t('common.remarks') }} : {{ item.remarks }}</p>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.name')" prop="name" show-overflow-tooltip/>
        <el-table-column :label="$t('user.account')" prop="login"/>
        <el-table-column label="上级" prop="superior.name"/>
        <el-table-column v-if="false" :label="$t('common.action')" width="100px">
          <template slot-scope="scope">
            <el-dropdown style="margin-left: 10px">
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <commission-policy v-if="hasPermission(100025)" :id="scope.row.id"/>
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
      <add @afterSelectChannel="afterSelectChannel"/>
      <addChannelCommissionTable v-if="hasPermission(100029)" ref="addChannelCommissionTable"/>
    </basic-container>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="timeDialogVisible"
      :title="$t('product.channel.reference_time_title')"
      width="400px">
      <el-date-picker
        v-model="channelPolicyObj.timestamp"
        type="date"
        value-format="timestamp"
        style="width: 100%"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleView">{{ $t('common.confirmButton') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('common.password_verify') + ' - ' + name"
      width="400px">
      <el-input v-model="password" :placeholder="$t('login.password_placeholder')" type="password"/>
      <div class="tips_text">* {{ $t('common.password_verify_text') }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleDeleteChannelCommissionTable()">{{ $t('common.submitButton') }}</el-button>
      </div>
    </el-dialog>

    <channelCommissionView ref="channelCommissionView"/>
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
import sha256 from 'sha256'
import { mapState, mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import elDragDialog from '@/directive/el-dragDialog'

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
  directives: { elDragDialog },
  data() {
    return {
      height: document.body.clientHeight - 180,
      dialogVisible: false,
      password: '',
      submitLoading: false,
      timeDialogVisible: false,
      channelName: '',
      channelId: '',
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
    ...mapGetters([
      'name'
    ]),
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
      this.listQuery = { page: 1, limit: 50 }
      this.getUsers({ role: 2, wildcard: this.wildcard })
    }, 500),
    handleDelete(index, row) {
      this.$confirm(this.$t('product.channel.tooltip.delete'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.confirmButton'),
        cancelButtonText: this.$t('common.cancelButton'),
        type: 'warning'
      }).then(() => {
        this.$api.user.deleteUser(row.id).then(res => {
          this.$message({
            message: this.$t('common.success'),
            type: 'success',
            duration: 5 * 1000
          })
          this.getUsers()
        })
      })
    },
    verifyPassword(obj) {
      this.channelId = obj.channel.id
      this.channelPolicyObj.id = obj.id
      this.dialogVisible = true
    },
    handleDeleteChannelCommissionTable() {
      this.submitLoading = true
      this.$api.channel.deleteChannelCommissionPolicy(this.channelPolicyObj.id, sha256(this.password)).then(res => {
        this.$message({
          message: this.$t('common.success'),
          type: 'success',
          duration: 5 * 1000
        })
        this.getChannelCommissionTableList({ channel: this.channelId })
        this.submitLoading = false
        this.handleClose()
      }).catch(_ => {
        this.submitLoading = false
      })
      // this.$confirm(this.$t('product.channel.tooltip.delete_channel_commission_table'), this.$t('common.prompt'), {
      //   confirmButtonText: this.$t('common.confirmButton'),
      //   cancelButtonText: this.$t('common.cancelButton'),
      //   type: 'warning',
      //   beforeClose: (action, instance, done) => {
      //     if (action === 'confirm') {
      //       instance.confirmButtonLoading = true
      //       this.$api.channel.deleteChannelCommissionPolicy(scope.id).then(res => {
      //         this.$message({
      //           message: this.$t('common.success'),
      //           type: 'success',
      //           duration: 5 * 1000
      //         })
      //         this.getChannelCommissionTableList({ channel: scope.channel.id })
      //         instance.confirmButtonLoading = false
      //         done()
      //       }).catch(_ => {
      //         instance.confirmButtonLoading = false
      //       })
      //     } else {
      //       done()
      //     }
      //   }
      // })
    },
    handleClose() {
      this.password = ''
      this.dialogVisible = false
    },
    afterSelectChannel(id) {
      this.$refs.addChannelCommissionTable.initForm(id)
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
      params = Object.assign({ wildcard: this.wildcard, ...params })
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
    .el-dialog--center .el-dialog__body {
      padding: 15px 20px;
    }
    .tips_text {
      color: #5c5958;
      font-size: 14px;
      font-weight: bold;
      margin-top: 10px;
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
