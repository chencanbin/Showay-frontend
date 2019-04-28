<template>
  <div class="table-container">
    <basic-container>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            :placeholder="$t('product.company.search_company_placeholder')"
            clearable
            @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search"/>
          </el-input>
        </el-form-item>
      </el-form>
      <pagination :total="companyList.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <el-table
        v-loading="companyLoading"
        :data="companyList.list"
        :height="height"
        row-key="id"
        stripe>
        <el-table-column :label="$t('product.company.table_header.name')" prop="name" min-width="150px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.acronym }}  - {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('product.company.table_header.level')" prop="level" width="150px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.secondary" type="warning">{{ $t('product.company.levelTab.level2') }}</el-tag>
            <el-tag v-else type="success">{{ $t('product.company.levelTab.level1') }}</el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column prop="contact" label="联系人" show-overflow-tooltip/>-->
        <el-table-column prop="phone" label="联系电话" show-overflow-tooltip/>
        <el-table-column prop="email" label="电子邮箱" show-overflow-tooltip/>
        <el-table-column prop="address" label="联系地址" show-overflow-tooltip/>
        <el-table-column prop="website" label="系统地址" show-overflow-tooltip/>
        <el-table-column
          :formatter="dateFormat"
          :label="$t('product.company.table_header.contractEffectiveDate')"
          prop="contractEffectiveDate"
          min-width="100px"/>
        <el-table-column v-if="checkPermission([1])" :label="$t('common.action')" width="80px">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit :id="scope.row.id"/>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    :loading="deleteLoading"
                    size="small"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)">{{ $t('common.delete') }}</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!--<edit :id="scope.row.id"/>-->

          </template>
        </el-table-column>
      </el-table>
      <add v-permission="[1]"/>
    </basic-container>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import { mapState } from 'vuex'
import { parseTime } from '@/utils'
import add from './add'
import edit from './edit'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数

const _ = require('lodash')

export default {
  name: 'Company',
  components: {
    pagination,
    add,
    edit
  },
  directives: { permission },
  data() {
    return {
      height: document.body.clientHeight - 190,
      wildcard: '',
      listQuery: {
        page: 1,
        limit: 50
      },
      tableLoading: true,
      deleteLoading: false
    }
  },
  computed: {
    ...mapState({
      companyList: state => state.company.companyList,
      companyLoading: state => state.company.companyLoading
    })
  },
  created() {
    if (!this.checkPermission([1])) {
      this.height = document.body.clientHeight - 130
    }
    this.getCompanyList()
  },
  methods: {
    checkPermission,
    search: _.debounce(function() {
      this.getCompanyList({ wildcard: this.wildcard })
    }, 500),
    handleDelete(row) {
      this.$confirm(this.$t('product.company.tooltip.delete'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.confirmButton'),
        cancelButtonText: this.$t('common.cancelButton'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$api.company.delCompany(row.id).then(res => {
              this.$message({
                message: this.$t('common.success'),
                type: 'success',
                duration: 5 * 1000
              })
              this.getCompanyList()
              instance.confirmButtonLoading = false
              done()
            }).catch(_ => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
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
