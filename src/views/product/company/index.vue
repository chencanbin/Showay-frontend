<template>
  <div class="table-container">
    <basic-container>
      <add/>
      <el-table v-loading="loading" :data="companyList.list" stripe>
        <el-table-column prop="id" label="ID" width="50px"/>
        <el-table-column prop="acronym" label="公司缩写"/>
        <el-table-column prop="name" label="公司名"/>
        <el-table-column
          :formatter="dateFormat"
          prop="creationDay"
          label="创建时间"
          min-width="100px"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <edit :id="scope.row.id"/>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="companyList.total" @pagination="pagination"/>
    </basic-container>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import { mapGetters, mapState } from 'vuex'
import { parseTime } from '@/utils'
import add from './add'
import edit from './edit'
export default {
  name: 'Company',
  components: {
    pagination,
    add,
    edit
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({ companyList: state => state.company.companyList })
  },
  mounted() {
    this.getCompanyList()
  },
  methods: {
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该管理员账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.company.delCompany(row.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getCompanyList()
        })
      })
    },
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date)
    },
    getCompanyList(param) {
      this.$store.dispatch('company/FetchCompanyList', param)
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max }
      this.getCompanyList(params)
    }
  }
}
</script>
