<template>
  <div class="table-container">
    <basic-container>
      <el-form :inline="true" style="display: inline-block; vertical-align: top; float: right">
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            clearable
            placeholder="请输入搜索内容"
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        :max-height="height"
        :data="client.list"
        stripe
      >
        <el-table-column
          prop="name"
          label="客户姓名"/>
        <el-table-column
          prop="idNumber"
          label="证件号"
          min-width="120"/>
        <el-table-column
          prop="locale"
          width="100"
          label="国籍"/>
        <el-table-column
          prop="sex"
          label="性别"
          width="50">
          <template slot-scope="scope">
            {{ scope.row.sex === 0 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="birthday"
          label="出生日期"/>
        <el-table-column
          prop="phone"
          label="电话号码"/>
        <el-table-column
          prop="email"
          label="电子邮箱"
          show-overflow-tooltip
          min-width="120"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <edit :data="scope.row"/>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <add/>
      <pagination :total="client.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
    </basic-container>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { mapGetters, mapState } from 'vuex'
import add from './add'
import edit from './edit'
import pagination from '@/components/Pagination'
const _ = require('lodash')
export default {
  components: {
    add,
    edit,
    pagination
  },
  data: function() {
    return {
      height: window.screen.height - 260,
      listQuery: {
        page: 1,
        limit: 50
      },
      wildcard: ''
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState(
      {
        client: state => state.client.clientList
      })
  },
  mounted() {
    this.getClient()
  },
  methods: {
    getClient(params) {
      this.$store.dispatch('client/FetchClientList', { params })
    },
    search: _.debounce(function() {
      this.getClient({ wildcard: this.wildcard })
    }, 500),
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date, '{y}-{m}-{d}')
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.client.deleteClient(row.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getClient()
        })
      })
    },

    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max }
      this.getClient(params)
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
