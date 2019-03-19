<template>
  <div class="table-container">
    <basic-container>
      <el-table v-loading="loading" :data="users.list" :height="height" stripe>
        <el-table-column label="ID" prop="id" width="50px"/>
        <el-table-column :label="$t('user.table_header.name')" prop="name" show-overflow-tooltip/>
        <el-table-column :label="$t('user.table_header.account')" prop="login"/>
        <el-table-column :label="$t('user.table_header.role')" prop="roles" min-width="150px">
          <template slot-scope="scope">
            <el-tag
              v-for="role in scope.row.roles"
              :key="role.id"
              type="success"
              style="margin-right: 5px">
              {{ role.name }}
            </el-tag>
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
              @click="handleDelete(scope.$index, scope.row)">{{ $t('action.del') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <add/>
      <pagination :total="users.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
    </basic-container>
  </div>
</template>

<script>
import add from './add'
import edit from './edit'
import pagination from '@/components/Pagination'
import { mapGetters, mapState } from 'vuex'
import { parseTime } from '@/utils'

export default {
  name: 'User',
  components: {
    add,
    edit,
    pagination
  },
  data() {
    return {
      height: window.screen.height - 310,
      listQuery: {
        page: 1,
        limit: 50
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({ users: state => state.user.users })
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
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date)
    },
    getUsers(param) {
      this.$store.dispatch('FetchUserList', param)
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max }
      this.getUsers(params)
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
