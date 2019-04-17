<template>
  <div class="table-container">
    <basic-container>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            clearable
            placeholder="搜索(客户姓名 | 证件号)"
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
      </el-form>
      <pagination :total="client.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <el-table
        v-loading="clientLoading"
        :height="height"
        :data="client.list"
        stripe
      >
        <el-table-column
          prop="name"
          label="客户姓名"
          show-overflow-tooltip/>
        <el-table-column
          prop="idNumber"
          label="证件号"
          min-width="120"
          show-overflow-tooltip/>
        <el-table-column
          prop="locale"
          width="100"
          label="国籍"/>
        <el-table-column
          prop="sex"
          label="性别"
          width="70">
          <template slot-scope="scope">
            {{ scope.row.sex === 0 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="birthday"
          label="出生日期"
          width="100"/>
        <el-table-column
          prop="phone"
          label="电话号码"
          min-width="120"
          show-overflow-tooltip/>
        <el-table-column
          prop="email"
          label="电子邮箱"
          show-overflow-tooltip
          min-width="120"/>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit :data="scope.row"/>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <add/>
    </basic-container>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { mapState } from 'vuex'
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
      height: document.body.clientHeight - 190,
      listQuery: {
        page: 1,
        limit: 50
      },
      wildcard: ''
    }
  },
  computed: {
    ...mapState(
      {
        clientLoading: state => state.client.clientLoading,
        client: state => state.client.clientList
      })
  },
  mounted() {
    this.getClient()
  },
  methods: {
    getClient(params) {
      params = Object.assign({ wildcard: this.wildcard, ...params })
      this.$store.dispatch('client/FetchClientList', { params })
    },
    search: _.debounce(function() {
      this.listQuery = { page: 1, limit: 50 }
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
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$api.client.deleteClient(row.id).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.getClient()
              instance.confirmButtonLoading = false
              done()
            }).catch(_ => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      }).then(() => {
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
