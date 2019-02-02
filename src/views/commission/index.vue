<template>
  <div class="table-container">
    <basic-container>
      <add/>
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
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <commission-table :id="scope.row.id" :title="scope.row.company.name"/>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </basic-container>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { mapGetters, mapState } from 'vuex'
import commissionTable from './commissionTable'
import add from './add'
export default {
  components: {
    add,
    commissionTable
  },
  data: function() {
    return {
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
    getCommissionTableList(id, param) {
      this.$store.dispatch('commission/FetchCommissionTableList', { id, param })
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
      this.$confirm('此操作将永久删除该管理员账号, 是否继续?', '提示', {
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
    }
  }
}
</script>
