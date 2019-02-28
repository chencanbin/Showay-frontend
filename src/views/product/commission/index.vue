<template>
  <div class="table-container">
    <basic-container>
      <el-form :inline="true" style="display: inline-block; vertical-align: top; float: right">
        <el-form-item label="" prop="company">
          <el-select
            v-model="companyId"
            :remote-method="remoteSearch"
            filterable
            clearable
            remote
            placeholder="搜索供应商"
            @change="companyChange">
            <el-option
              v-for="company in companyList"
              :key="company.id"
              :value="company.id"
              :label="company.name"/>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        :data="commissionTableList.list"
        stripe
      >
        <el-table-column
          min-width="200px"
          prop="company.name"
          label="供应商"/>
        <el-table-column
          :formatter="dateFormat"
          width="200"
          prop="effectiveDate"
          label="生效时间"/>
        <el-table-column
          :formatter="dateFormat"
          width="200"
          prop="expirationDate"
          label="失效时间"/>
        <el-table-column
          width="100"
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">未发布</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success">已发布</el-tag>
            <el-tag v-if="scope.row.status === 2" type="warning">有改动</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status !== 0"
              type="text"
              icon="el-icon-view"
              style="margin-right: 5px"
              @click="handleView(scope.row.id)">
              查看
            </el-button>
            <commission-table :id="scope.row.id" :title="scope.row.company.name"/>
            <el-button
              v-if="scope.row.status !== 0"
              type="text"
              icon="el-icon-download"
              @click="exportExcel(scope.row)">导出Excel</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <add/>
      <pagination :total="commissionTableList.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
    </basic-container>
    <commission-view ref="commissionView"/>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { mapGetters, mapState } from 'vuex'
import commissionTable from './commissionTable'
import add from './add'
import commissionView from './view'
export default {
  components: {
    add,
    commissionView,
    commissionTable,
    pagination
  },
  data: function() {
    return {
      listQuery: {
        page: 1,
        limit: 50
      },
      companyId: ''
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState(
      {
        companyList: state => state.company.companyList.list,
        commissionTableList: state => state.commission.commissionTableList
      })
  },
  mounted() {
    this.getCompanyList()
    this.getCommissionTableList()
  },
  methods: {
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
      return parseTime(date)
    },
    remoteSearch(query) {
      this.$store.dispatch('company/FetchCompanyList', { name: query })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该策略表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.commission.deleteCommission(row.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getCommissionTableList()
        })
      })
    },
    exportExcel(row) {
      if (row.status === 2) {
        this.$confirm('导出的部分不包含未发布的内容, 是否继续导出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.location.href = process.env.BASE_API + `/commissionTable/${row.id}/export`
        })
      } else {
        window.location.href = process.env.BASE_API + `/commissionTable/${row.id}/export`
      }
    },
    handleView(id) {
      this.$refs.commissionView.openDialog(id)
    },
    dbRowClick(row) {
      this.$refs.commissionView.openDialog(row.id)
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
