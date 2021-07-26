<template>
  <div id="enterprise" class="table-container">
    <basic-container>
      <el-table :data="enterprise.list" v-loading="loading" stripe>
        <el-table-column :label="$t('enterprise.name')" prop="title" min-width="100"></el-table-column>
        <el-table-column :label="$t('enterprise.account')" prop="title" min-width="100"></el-table-column>
        <el-table-column :label="$t('enterprise.email')" prop="title" min-width="100"></el-table-column>
        <el-table-column :label="$t('enterprise.certificate')" prop="title" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.action')" prop="action" width="80px">
          <template slot-scope="scope">
            <el-dropdown v-if="!scope.row.isBuiltin">
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit :enterprise="scope.row" />
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">{{ $t("common.delete") }}</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-bottom">
        <add @fetchDate="enterpriseList" />
        <pagination :total="enterprise.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit" />
      </div>
    </basic-container>
  </div>
</template>
<script>
import pagination from "@/components/Pagination";
import add from "./add";
import edit from "./edit";
export default {
  data() {
    return {
      loading: false,
      enterprise: {},
      listQuery: {
        page: 1,
        limit: 50,
      },
    };
  },
  components: {
    add,
    edit,
    pagination,
  },
  created() {
    this.enterpriseList();
  },
  methods: {
    enterpriseList() {

    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit;
      const max = pageObj.limit;
      const params = { offset, max };
      this.getUsers(params);
    },
    updatePage(val) {
      this.listQuery.page = val;
    },
    updateLimit(val) {
      this.listQuery.limit = val;
    },
    handleDelete(index, row) {
      this.$confirm(
        this.$t("enterprise.tooltip.delete"),
        this.$t("common.prompt"),
        {
          confirmButtonText: this.$t("common.confirmButton"),
          cancelButtonText: this.$t("common.cancelButton"),
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              this.$api.enterprise.remove(row.id).then((res) => {
                this.$message({
                  message: this.$t("common.success"),
                  type: "success",
                  duration: 5 * 1000,
                });
                this.enterpriseList();
                instance.confirmButtonLoading = false;
                done();
              }).catch((_) => {
                instance.confirmButtonLoading = false;
              });
            } else {
              done();
            }
          },
        }
      ).then(() => { });
    },
  },
};
</script>
<style lang="scss">
.cover-image {
  width: 200px;
}
</style>
