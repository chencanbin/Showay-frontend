<template>
  <div class="table-container">
    <basic-container>
      <add/>
      <el-table v-loading="loading" :data="users.list" stripe>
        <el-table-column label="ID" prop="id" width="50px"/>
        <el-table-column :label="$t('user.table_header.name')" prop="name"/>
        <el-table-column :label="$t('user.table_header.account')" prop="login"/>
        <el-table-column
          :formatter="dateFormat"
          :label="$t('user.table_header.create_time')"
          prop="creationDay"
          min-width="100px"/>
        <el-table-column :label="$t('user.table_header.action')">
          <template slot-scope="scope">
            <channelCommissionTable/>
            <edit v-if="!scope.row.isBuiltin" :user="scope.row"/>
            <el-button
              v-if="!scope.row.isBuiltin"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">{{ $t('action.del') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="users.total" @pagination="pagination"/>
      <!--
      <el-pagination
        ref="pagination"
        class="pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="users.total"
      >
      </el-pagination>
-->
    </basic-container>
  </div>
</template>

<script>
import add from './add'
import edit from './edit'
import channelCommissionTable from './channelCommissionTable'
import pagination from '@/components/Pagination'
import { mapGetters, mapState } from 'vuex'
import { parseTime } from '@/utils'

export default {
  name: 'User',
  components: {
    add,
    edit,
    channelCommissionTable,
    pagination
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      users: state => state.user.users,
      commissionTable: state => state.client.commissionTableList
    })
  },
  created() {
    this.getChannelCommissionTableList()
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
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date)
    },
    getUsers(param) {
      const role = { role: 2 }
      if (param) {
        param.role = role
      } else {
        param = role
      }
      this.$store.dispatch('FetchUserList', param)
    },
    getChannelCommissionTableList(params) {
      this.$store.dispatch('client/FetchChannelCommissionTable', params)
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max }
      this.getUsers(params)
    }
  }
}
</script>
