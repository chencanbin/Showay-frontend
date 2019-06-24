<template>
  <div id="user" class="table-container">
    <basic-container>
      <pagination :total="users.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit"/>
      <el-table
        v-loading="userLoading"
        :data="users.list"
        :row-class-name="setClassName"
        :height="height"
        :expand-row-keys="expandKeys"
        row-key="id"
        stripe
        @expand-change="expandChange">
        <el-table-column v-if="hasPermission(100108)" type="expand">
          <template slot-scope="scope">
            <div v-loading="channelHierarchyLoading" class="clearfix">
              <el-timeline id="channelCommissionTableList">
                <div v-if="channelHierarchy.list && channelHierarchy.list.length === 0" style="text-align: center; color: #909399;">
                  {{ $t('user.set.none_superior') }}
                </div>
                <el-timeline-item v-for="(item, index) in channelHierarchy.list" :key="index" :timestamp="getFormattedDate(item.effectiveDate)" placement="top">
                  <el-dropdown class="action-dropdown">
                    <el-button type="primary" plain size="mini">
                      <i class="el-icon-more"/>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <edit-channel-hierarchy :hierarchy="item"/>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button type="text" size="small" @click="handleDeleteChannelHierarchy(item.id)">{{ $t('common.delete') }}</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-card>
                    <div class="bottom clearfix">
                      <p style="display: inline-block; margin-left: 12px">{{ $t('user.superior') }} : {{ item.superior ? item.superior.name: '-' }}</p>
                      <p style="display: inline-block; margin: 0 0 0 20px">{{ $t('common.remarks') }} : {{ item.remarks }}</p>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
              <add-channel-hierarchy :user="scope.row"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.name')" prop="name" show-overflow-tooltip/>
        <el-table-column :label="$t('user.acronym')" prop="acronym" show-overflow-tooltip/>
        <el-table-column :label="$t('user.account')" prop="login"/>
        <!--<el-table-column :label="$t('user.superior')" prop="superior.name" show-overflow-tooltip/>-->
        <el-table-column :label="$t('user.role')" prop="roles" min-width="100px">
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
          :label="$t('client.info.email')"
          prop="email"
          min-width="100px"/>
        <el-table-column
          :label="$t('user.locked')"
          min-width="100px">
          <template slot-scope="scope">
            <el-switch v-if="!scope.row.isBuiltin" v-model="scope.row.isLocked" :active-text="$t('user.locked')" @change="onLockAccount(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.action')" width="80px">
          <template slot-scope="scope">
            <el-dropdown v-if="!scope.row.isBuiltin">
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit v-if="hasPermission(100084)" :user="scope.row"/>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    v-if="hasPermission(100085) && !scope.row.isBuiltin"
                    type="text"
                    size="small"
                    @click="verifyPassword(scope.$index, scope.row)">{{ $t('common.reset_password') }}
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    v-if="hasPermission(100085) && !scope.row.isBuiltin"
                    type="text"
                    size="small"
                    @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <add v-if="hasPermission(100081)"/>
    </basic-container>
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
        <el-button :loading="resetLoading" type="primary" @click="handleResetPassword">{{ $t('common.submitButton') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import add from './add'
import edit from './edit'
import addChannelHierarchy from './addChannelHierarchy'
import editChannelHierarchy from './editChannelHierarchy'
import pagination from '@/components/Pagination'
import sha256 from 'sha256'
import { mapState, mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import elDragDialog from '@/directive/el-dragDialog'

export default {
  name: 'User',
  components: {
    add,
    edit,
    addChannelHierarchy,
    editChannelHierarchy,
    pagination
  },
  directives: { elDragDialog },
  data() {
    return {
      expandKeys: [],
      password: '',
      id: '',
      resetLoading: false,
      dialogVisible: false,
      height: this.hasPermission(100081) ? document.body.clientHeight - 180 : document.body.clientHeight - 120,
      listQuery: {
        page: 1,
        limit: 50
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    ...mapState({
      userLoading: state => state.user.userLoading,
      channelHierarchy: state => state.user.channelHierarchy,
      channelHierarchyLoading: state => state.user.channelHierarchyLoading,
      users: state => state.user.users
    })
  },
  created() {
    this.getUsers()
  },
  methods: {
    setClassName(scope) {
      let result = 'no_expand'
      scope.row.roles.forEach(item => {
        if (item.id === 2) {
          result = 'expand'
        }
      })
      return result
    },
    handleDelete(index, row) {
      this.$confirm(this.$t('user.tooltip.delete'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.confirmButton'),
        cancelButtonText: this.$t('common.cancelButton'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$api.user.deleteUser(row.id).then(res => {
              this.$message({
                message: this.$t('common.success'),
                type: 'success',
                duration: 5 * 1000
              })
              this.getUsers()
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
    handleDeleteChannelHierarchy(id) {
      this.$confirm(this.$t('user.tooltip.delete_superior'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.confirmButton'),
        cancelButtonText: this.$t('common.cancelButton'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$api.user.deleteChannelHierarchy(id).then(res => {
              this.$message({
                message: this.$t('common.success'),
                type: 'success',
                duration: 5 * 1000
              })
              this.getChannelHierarchy()
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
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date)
    },
    getUsers(param) {
      this.$store.dispatch('FetchUserList', param)
    },
    getChannelHierarchy(params) {
      this.$store.dispatch('FetchChannelHierarchy', params)
    },
    getFormattedDate(value) {
      return parseTime(value, '{y}-{m}-{d}')
    },
    expandChange(row, expandedRows) {
      if (this.expandKeys.indexOf(row.id) >= 0) {
        // 收起当前行
        this.expandKeys.shift()
        return
      }
      this.getChannelHierarchy({ owner: row.id })
      this.expandKeys.shift()
      this.expandKeys.push(row.id)
      if (expandedRows.length > 1) {
        // 只展开当前选项
        expandedRows.shift()
      }
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
    },
    verifyPassword(index, row) {
      this.name = row.login
      this.id = row.id
      this.dialogVisible = true
    },
    handleResetPassword() {
      this.resetLoading = true
      this.$api.user.resetPassword({ 'user': this.id, 'password': sha256(this.password) }).then(res => {
        this.$message({
          message: this.$t('common.success'),
          type: 'success',
          duration: 5 * 1000
        })
        this.resetLoading = false
        this.handleClose()
      }).catch(_ => {
        this.resetLoading = false
      })
    },
    handleClose() {
      this.password = ''
      this.dialogVisible = false
    },
    onLockAccount(account) {
      this.lockedLoading = account.id
      this.$api.user.editUser(account.id, { isLocked: account.isLocked }).then(res => {
        this.$message({
          message: this.$t('common.success'),
          type: 'success',
          duration: 5 * 1000
        })
      }).catch(_ => {
        account.isLocked = !account.isLocked
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
  #user {
    .tips_text {
      color: #5c5958;
      font-size: 14px;
      font-weight: bold;
      margin-top: 10px;
    }
    .el-dialog--center .el-dialog__body {
      padding: 15px 20px;
    }
    p {
      font-size: 14px;
      line-height: 1.5em;
      color: #5e6d82;
    }
    .action-dropdown {
      display: inline-block;
      position: relative;
      color: #606266;
      font-size: 14px;
      position: absolute;
      top: -2px;
      left: 110px;
    }
    .el-card.is-always-shadow {
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    .no_expand .el-table__expand-column .cell {
      display: none;
    }
    .el-table__expanded-cell {
      padding: 10px;
    }
  }

</style>
