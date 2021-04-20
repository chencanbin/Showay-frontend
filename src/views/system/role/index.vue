<template>
  <div class="table-container">
    <basic-container>
      <el-table 
        v-loading="loading" 
        :data="roles" 
        :height="height" 
        stripe>
        <el-table-column 
          prop="id" 
          label="ID" />
        <el-table-column 
          :label="$t('role.name')" 
          prop="name" />
        <el-table-column
          :formatter="dateFormat"
          :label="$t('user.create_time')"
          prop="creationDay"
        />
        <el-table-column 
          :label="$t('common.action')" 
          width="80px">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button 
                type="primary" 
                plain 
                size="mini">
                <i class="el-icon-more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit 
                    :role="scope.row" 
                    @afterUpdateRole="afterUpdateRole" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import edit from "./edit";
export default {
  name: "Role",
  components: {
    edit,
  },
  data() {
    return {
      height: window.screen.height - 200,
      roles: [],
    };
  },
  created() {
    this.loading = true;
    this.getRoleList();
  },
  methods: {
    getRoleList() {
      this.$api.role
        .fetchRoleList()
        .then((res) => {
          this.roles = res.data.list;
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    dateFormat(row, column) {
      const date = row[column.property];
      return parseTime(date);
    },
    afterUpdateRole() {
      this.getRoleList();
    },
  },
};
</script>

<style lang="scss">
/*.table-container {*/
/*padding: 8px 10px;*/
/*}*/
</style>
