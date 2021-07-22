<template>
  <div id="course" class="table-container">
    <basic-container>
      <el-table :data="course.list" v-loading="loading" stripe>
        <el-table-column :label="$t('course.title')" prop="title" min-width="100">
        </el-table-column>
        <el-table-column :label="$t('course.coverImage')" prop="coverImage" align="center">
          <template slot-scope="{ row }">
            <img :src="row.coverImage" class="cover-image" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('course.type')" prop="online" align="center">
          <template slot-scope="{ row }">
            <div v-if="row.online">{{ $t("course.online") }}</div>
            <div v-else>{{ $t("course.offline") }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('course.deadline')" prop="deadline" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div>{{ row.deadline }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('course.description')" prop="description" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('course.quota')" prop="quota" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('common.action')" prop="action" width="80px">
          <template slot-scope="scope">
            <el-dropdown v-if="!scope.row.isBuiltin">
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit :course="scope.row" />
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
        <add @fetchDate="courseList" />
        <pagination :total="course.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit" />
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
      course: {},
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
    this.courseList();
  },
  methods: {
    courseList() {
      this.loading = true;
      this.$api.course.fetch().then((res) => {
        console.log(res)
        this.course = res.data;
        this.loading = false;
      }).catch((e) => {
        this.loading = false;
      });
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
        this.$t("course.tooltip.delete"),
        this.$t("common.prompt"),
        {
          confirmButtonText: this.$t("common.confirmButton"),
          cancelButtonText: this.$t("common.cancelButton"),
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              this.$api.course.remove(row.id).then((res) => {
                this.$message({
                  message: this.$t("common.success"),
                  type: "success",
                  duration: 5 * 1000,
                });
                this.courseList();
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
