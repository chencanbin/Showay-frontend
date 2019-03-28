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
            <el-col v-loading="loading" :span="24">
              <el-form v-for="item in channelCommissionTableList" id="channelCommissionTableList" :key="item.id" :inline="true" label-width="100px">
                <el-row>
                  <el-col :span="6" :offset="2">
                    <el-form-item label="有效时间:" class="effectiveDate">
                      {{ parseTime(item.effectiveDate) }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="备注:" class="remarks">
                      {{ item.remarks || '-' }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="操作:" class="operation">
                      <el-button
                        v-if="item.status !== 0"
                        :loading="loading"
                        type="text"
                        size="mini"
                        icon="el-icon-view"
                        @click="handleView(item.id)">
                        查看
                      </el-button>
                      <el-button
                        :loading="loading"
                        type="text"
                        size="mini"
                        icon="el-icon-download"
                        @click="exportPDF(item.id)">导出</el-button>
                      <editChannelCommissionTable :id="item.id" :effective-date="item.effectiveDate" :remarks="item.remarks"/>
                      <el-button :loading="loading" type="text" size="mini" icon="el-icon-delete" @click="handleDeleteChannelCommissionTable(item)">删除</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <!--<el-table id="channelCommissionTableList" v-loading="loading" :data="channelCommissionTableList" :show-header="false">-->
              <!--<el-table-column :formatter="dateFormat" label="有效时间" prop="effectiveDate" align="center"/>-->
              <!--<el-table-column label="备注" prop="remarks" align="left"/>-->
              <!--<el-table-column :label="$t('user.table_header.action')">-->
              <!--<template slot-scope="scope">-->
              <!--<el-button-->
              <!--v-if="scope.row.status !== 0"-->
              <!--type="text"-->
              <!--icon="el-icon-view"-->
              <!--style="margin-right: 5px"-->
              <!--@click="handleView(scope.row.id)">-->
              <!--查看-->
              <!--</el-button>-->
              <!--<el-button-->
              <!--type="text"-->
              <!--icon="el-icon-download"-->
              <!--@click="exportPDF(scope.row.id)">导出</el-button>-->
              <!--<editChannelCommissionTable :id="scope.row.id" :effectiveDate="scope.row.effectiveDate" :remarks="scope.row.remarks"/>-->
              <!--<el-button :loading="loading" type="text" size="small" icon="el-icon-delete" @click="handleDeleteChannelCommissionTable(scope)">删除</el-button>-->
              <!--</template>-->
              <!--</el-table-column>-->
              <!--</el-table>-->
              <addChannelCommissionTable :effective-date="scope.row.effectiveDate" :id="scope.row.id"/>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="id" width="50px"/>
        <el-table-column :label="$t('user.table_header.name')" prop="name" show-overflow-tooltip/>
        <el-table-column :label="$t('user.table_header.account')" prop="login"/>
        <el-table-column label="上级" prop="superior.name"/>
        <el-table-column
          :formatter="dateFormat"
          :label="$t('user.table_header.create_time')"
          prop="creationDay"
          min-width="100px"/>
        <el-table-column :label="$t('user.table_header.action')" min-width="100px">
          <template slot-scope="scope">
            <el-button type="text" size="mini" style="margin-right: 10px" @click="toggleChannelPolicy(scope.row)">
              <svg-icon icon-class="commissionPolicy"/>
              渠道策略
            </el-button>
            <edit v-if="!scope.row.isBuiltin" :user="scope.row"/>
            <el-button
              v-if="!scope.row.isBuiltin"
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">{{ $t('action.del') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <add/>
      <channelCommissionView ref="channelCommissionView"/>
    </basic-container>
  </div>
</template>

<script>
import add from './add'
import edit from './edit'
import channelCommissionView from './view'
import addChannelCommissionTable from './addChannelCommissionTable'
import editChannelCommissionTable from './editChannelCommissionTable'
import channelCommissionTable from './channelCommissionTable'
import pagination from '@/components/Pagination'
import { mapGetters, mapState } from 'vuex'
import { parseTime } from '@/utils'
const _ = require('lodash')
export default {
  name: 'Channel',
  components: {
    add,
    edit,
    addChannelCommissionTable,
    editChannelCommissionTable,
    channelCommissionTable,
    pagination,
    channelCommissionView
  },
  data() {
    return {
      height: window.screen.height - 300,
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
    ...mapGetters(['loading']),
    ...mapState({
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
      this.$confirm('此操作将永久删除该管理员账号, 是否继续?', '提示', {
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
      console.log(scope)
      this.$confirm('此操作将永久删除该渠道佣金表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.channel.deleteChannelCommissionPolicy(scope.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getChannelCommissionTableList({ channel: scope.channel.id })
        })
      })
    },
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date)
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
      console.log(this.channelCommissionTableList)
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
      console.log(this.expandKeys[0])
    },
    handleView(id) {
      this.$refs.channelCommissionView.openDialog(id)
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
      padding: 5px;
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
 }
</style>
