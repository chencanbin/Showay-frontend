<template>
  <div class="table-container">
    <basic-container>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            clearable
            placeholder="搜索(公司缩写 | 公司名)"
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
      </el-form>
      <pagination :total="companyList.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <el-table v-loading="loading" :data="companyList.list" :height="height" stripe>
        <el-table-column prop="acronym" label="公司缩写" width="120px"/>
        <el-table-column prop="name" label="公司名" show-overflow-tooltip/>
        <el-table-column prop="level" label="级别" width="150px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.secondary" type="warning">二级</el-tag>
            <el-tag v-else type="success">一级</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="contractEffectiveDate"
          label="签约时间"
          min-width="100px"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <edit :id="scope.row.id"/>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <add/>
    </basic-container>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import { mapGetters, mapState } from 'vuex'
import { parseTime } from '@/utils'
import add from './add'
import edit from './edit'
const _ = require('lodash')

export default {
  name: 'Company',
  components: {
    pagination,
    add,
    edit
  },
  data() {
    return {
      height: document.body.clientHeight - 190,
      wildcard: '',
      listQuery: {
        page: 1,
        limit: 50
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({ companyList: state => state.company.companyList })
  },
  mounted() {
    this.getCompanyList()
  },
  methods: {
    search: _.debounce(function() {
      this.getCompanyList({ wildcard: this.wildcard })
    }, 500),
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该供应商, 是否继续?', '提示', {
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
      return parseTime(date, '{y}-{m}-{d}')
    },
    getCompanyList(param) {
      this.$store.dispatch('company/FetchCompanyList', param)
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit
      const max = pageObj.limit
      const params = { offset, max }
      this.getCompanyList(params)
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
<style>

</style>
