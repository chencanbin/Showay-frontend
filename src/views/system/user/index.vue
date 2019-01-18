<template>
  <div class="table-container">
    <basic-container>
      <add/>
      <el-table v-loading="loading" :data="users.list" stripe>
        <el-table-column prop="id" label="ID" width="50px"/>
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="login" label="账号"/>
        <el-table-column prop="roles" label="权限" min-width="150px">
          <template slot-scope="scope">
            <el-tag
              v-for="role in scope.row.roles"
              :key="role.id"
              style="margin-right: 5px">
              {{ role.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="creationDay"
          label="创建时间"
          min-width="100px"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <edit :user="scope.row"/>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    }
  }
}
</script>
