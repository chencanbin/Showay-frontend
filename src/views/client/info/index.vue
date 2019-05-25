<template>
  <div id="clientInfo" class="table-container">
    <basic-container>
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input
            v-model="wildcard"
            :placeholder="$t('client.info.search')"
            clearable
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
          :label="$t('client.info.name')"
          prop="name"
          show-overflow-tooltip/>
        <el-table-column
          :label="$t('client.info.idNumber')"
          prop="idNumber"
          min-width="120"
          show-overflow-tooltip/>
        <el-table-column
          :label="$t('client.info.locale')"
          prop="locale"
          width="135"/>
        <el-table-column
          :label="$t('client.info.sex')"
          prop="sex"
          width="80">
          <template slot-scope="scope">
            {{ scope.row.sex === 0 ? $t('client.info.male') : $t('client.info.female') }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('client.info.birthday')"
          :formatter="dateFormat"
          prop="birthday"
          width="100"/>
        <el-table-column
          :label="$t('client.info.phone')"
          prop="phone"
          min-width="120"
          show-overflow-tooltip/>
        <el-table-column
          :label="$t('client.info.email')"
          prop="email"
          show-overflow-tooltip
          min-width="120"/>
        <el-table-column :label="$t('common.action')" width="180" align="center">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit :data="scope.row" :list-query="listQuery"/>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    type="text"
                    size="small"
                    @click="verifyPassword(scope.row.id)">{{ $t('common.delete') }}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <add :list-query="listQuery"/>
      <el-dialog
        v-el-drag-dialog
        :close-on-click-modal="false"
        :visible="dialogVisible"
        :before-close="handleClose"
        :title="$t('common.password_verify') + ' - ' + name"
        width="400px">
        <el-input v-model="password" :placeholder="$t('login.password_placeholder')" type="password"/>
        <div class="tips_text">* {{ $t('common.password_verify_text') }}</div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
          <el-button :loading="submitLoading" type="primary" @click="handleDelete()">{{ $t('common.submitButton') }}</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { mapState, mapGetters } from 'vuex'
import add from './add'
import edit from './edit'
import pagination from '@/components/Pagination'
import sha256 from 'sha256'
import elDragDialog from '@/directive/el-dragDialog'

const _ = require('lodash')
export default {
  components: {
    add,
    edit,
    pagination
  },
  directives: { elDragDialog },
  data: function() {
    return {
      height: document.body.clientHeight - 190,
      id: 0,
      dialogVisible: false,
      password: '',
      submitLoading: false,
      listQuery: {
        page: 1,
        limit: 50
      },
      wildcard: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
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
    handleDelete() {
      this.submitLoading = true
      this.$api.client.deleteClient(this.id, sha256(this.password)).then(res => {
        this.$message({
          message: this.$t('common.success'),
          type: 'success',
          duration: 5 * 1000
        })
        this.getClient()
        this.submitLoading = false
        this.dialogVisible = false
      }).catch(_ => {
        this.submitLoading = false
      })
      // this.$confirm(this.$t('client.info.tooltip.delete'), this.$t('common.prompt'), {
      //   confirmButtonText: this.$t('common.confirmButton'),
      //   cancelButtonText: this.$t('common.cancelButton'),
      //   type: 'warning',
      //   beforeClose: (action, instance, done) => {
      //     if (action === 'confirm') {
      //       instance.confirmButtonLoading = true
      //       this.$api.client.deleteClient(row.id).then(res => {
      //         this.$message({
      //           message: this.$t('common.success'),
      //           type: 'success',
      //           duration: 5 * 1000
      //         })
      //         this.getClient()
      //         instance.confirmButtonLoading = false
      //         done()
      //       }).catch(_ => {
      //         instance.confirmButtonLoading = false
      //       })
      //     } else {
      //       done()
      //     }
      //   }
      // }).then(() => {
      // })
    },
    verifyPassword(id) {
      this.id = id
      this.dialogVisible = true
    },
    handleClose() {
      this.password = ''
      this.dialogVisible = false
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
<style lang="scss" rel="stylesheet/scss" type="text/scss">
  #clientInfo {
    .el-dialog--center .el-dialog__body {
      padding: 15px 20px;
    }
    .tips_text {
      color: #5c5958;
      font-size: 14px;
      font-weight: bold;
      margin-top: 10px;
    }
  }
</style>
