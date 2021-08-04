<template>
  <div id="broker" class="table-container">
    <basic-container>
      <el-table :data="broker.list" v-loading="loading" stripe>
        <el-table-column :label="$t('broker.name')" prop="name" min-width="100"></el-table-column>
        <el-table-column :label="$t('broker.email')" prop="email" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.status')" min-width="100">
          <template slot-scope="{row}">
            <el-tag v-if="row.status === 0">已激活</el-tag>
            <el-tag type="danger" v-if="row.status === 1">已停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.action')" prop="action" width="80px">
          <template slot-scope="scope">
            <el-dropdown v-if="!scope.row.isBuiltin">
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit :broker="scope.row" />
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
        <add @fetchDate="brokerList" />
        <pagination :total="broker.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit" />
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
      broker: {
        list: []
      },
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
    this.brokerList();
  },
  methods: {
    brokerList() {
      this.$api.broker.fetch().then(res => {
        this.broker = res.data
      })
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
        this.$t("broker.tooltip.delete"),
        this.$t("common.prompt"),
        {
          confirmButtonText: this.$t("common.confirmButton"),
          cancelButtonText: this.$t("common.cancelButton"),
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              this.$api.broker.remove(row.id).then((res) => {
                this.$message({
                  message: this.$t("common.success"),
                  type: "success",
                  duration: 5 * 1000,
                });
                this.brokerList();
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
