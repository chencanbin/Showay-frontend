<template>
  <div class="table-container">
    <basic-container>
      <pagination
        :total="templates.total"
        :page="listQuery.page"
        :limit="listQuery.limit"
        @pagination="pagination"
        @update:page="updatePage"
        @update:limit="updateLimit"
      />
      <el-table
        v-loading="loading"
        :data="templates.list"
        :height="height"
        stripe
      >
        <el-table-column 
          width="50px" 
          align="center">
          <template slot-scope="scope">
            <svg-icon
              v-if="scope.row.isBuiltin"
              icon-class="lock"
              style="font-size: 18px"
            />
          </template>
        </el-table-column>
        <el-table-column 
          :label="$t('template.title')" 
          prop="title" />
        <el-table-column 
          :label="$t('template.subject')" 
          prop="subject" />
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
                    :id="scope.row.id" 
                    @submitSuccess="submitSuccess" />
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    v-if="hasPermission(100085) && !scope.row.isBuiltin"
                    type="text"
                    size="small"
                    @click="handleDelete(scope.row.id)"
                  >{{ $t("common.delete") }}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <add @submitSuccess="submitSuccess" />
    </basic-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import pagination from "@/components/Pagination";
import edit from "./edit";
import add from "./add";

export default {
  name: "Template",
  components: {
    pagination,
    edit,
    add,
  },
  data() {
    return {
      height: window.screen.height - 280,
      listQuery: {
        page: 1,
        limit: 50,
      },
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.template.templateLoading,
      templates: (state) => state.template.templates,
    }),
  },

  created() {
    this.getTemplates();
  },
  methods: {
    getTemplates(params) {
      this.$store.dispatch("template/FetchTemplateList", { params });
    },

    handleDelete(id) {
      this.$confirm(
        this.$t("template.tooltip.delete"),
        this.$t("common.prompt"),
        {
          confirmButtonText: this.$t("common.confirmButton"),
          cancelButtonText: this.$t("common.cancelButton"),
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              this.$api.template
                .deleteEmailTemplate(id)
                .then((res) => {
                  this.$message({
                    message: this.$t("common.success"),
                    type: "success",
                    duration: 5 * 1000,
                  });
                  this.getTemplates();
                  instance.confirmButtonLoading = false;
                  done();
                })
                .catch((_) => {
                  instance.confirmButtonLoading = false;
                });
            } else {
              done();
            }
          },
        }
      ).then(() => {});
    },
    submitSuccess() {
      this.getTemplates();
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit;
      const max = pageObj.limit;
      const params = { offset, max };
      this.getTemplates(params);
    },
    updatePage(val) {
      this.listQuery.page = val;
    },
    updateLimit(val) {
      this.listQuery.limit = val;
    },
  },
};
</script>
