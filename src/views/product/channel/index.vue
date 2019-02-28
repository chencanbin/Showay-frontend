<template>
  <div class="table-container">
    <basic-container>
      <add/>
      <el-table
        v-loading="loading"
        id="channelTable"
        :data="users.list"
        :expand-row-keys="expandKeys"
        stripe
        row-key="id"
        @expand-change="expandChange">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table id="channelCommissionTableList" :data="channelCommissionTableList" :show-header="false">
              <el-table-column :formatter="dateFormat" label="有效时间" prop="effectiveDate" align="center"/>
              <el-table-column :label="$t('user.table_header.action')">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status !== 0"
                    type="text"
                    icon="el-icon-view"
                    style="margin-right: 5px"
                    @click="handleView(scope.row.id)">
                    查看
                  </el-button>
                  <el-button
                    type="text"
                    icon="el-icon-download"
                    @click="exportPDF(scope.row.id)">导出</el-button>
                  <editChannelCommissionTable :id="scope.row.id"/>
                  <el-button :loading="loading" type="text" size="small" icon="el-icon-delete" @click="handleDeleteChannelCommissionTable(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <addChannelCommissionTable :effective-date="scope.row.effectiveDate" :id="scope.row.id"/>
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="id" width="50px"/>
        <el-table-column :label="$t('user.table_header.name')" prop="name"/>
        <el-table-column :label="$t('user.table_header.account')" prop="login"/>
        <el-table-column label="上级" prop="superior.name"/>
        <el-table-column label="上级佣金率">
          <template slot-scope="scope">
            <span>{{ scope.row.superior && rateFormat(scope.row.superior.superiorCommissionRate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          :label="$t('user.table_header.create_time')"
          prop="creationDay"
          min-width="100px"/>
        <el-table-column :label="$t('user.table_header.action')">
          <template slot-scope="scope">
            <edit v-if="!scope.row.isBuiltin" :user="scope.row"/>
            <el-button
              v-if="!scope.row.isBuiltin"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">{{ $t('action.del') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="users.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
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
  name: 'User',
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
      listQuery: {
        page: 1,
        limit: 50
      },
      expandKeys: []
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
      this.$confirm('此操作将永久删除该渠道佣金表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.channel.deleteChannelCommissionPolicy(scope.row.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getChannelCommissionTableList({ channel: scope.row.channel.id })
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

</style>
