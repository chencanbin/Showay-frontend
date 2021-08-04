<template>
  <div id="company" class="table-container">
    <router-view />
    <div v-show="$route.meta.showContact">
      <div class="header">
        <el-form :inline="true" class="search-input" @submit.native.prevent>
          <el-form-item label="" prop="wildcard">
            <el-input v-model="wildcard" :placeholder="$t('product.company.search_company_placeholder')" clearable @input="search">
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form>
      </div>
      <basic-container>
        <el-scrollbar>
          <div v-loading="companyLoading" class="list">
            <div v-for="row in companyList.list" :key="row.id" class="list_item">
              <div class="row" style="height: 60px; line-height: 60px">
                <span class="company_name">{{ row.acronym }} - {{ row.name }}</span>
                <span>
                  <el-dropdown>
                    <el-button type="primary" plain size="mini">
                      <i class="el-icon-more" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <edit v-if="hasPermission(100008)" :id="row.id" />
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <!-- <contact v-if="hasPermission(100123)" :company="row" /> -->
                        <el-button type="text" size="small" @click="gotoContact(row)">
                          {{ $t("product.company.set.edit_contact_title") }}
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button v-if="hasPermission(100009)" :loading="deleteLoading" size="small" type="text" @click="handleDelete(row)">{{ $t("common.delete") }}</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </div>
              <div class="row">
                <span class="label">{{ $t('product.company.table_header.level') }}:</span>
                <span class="content">
                  <el-tag v-if="row.secondary" type="warning">{{
                    $t("product.company.levelTab.level2")
                  }}</el-tag>
                  <el-tag v-else type="success">{{
                    $t("product.company.levelTab.level1")
                  }}</el-tag>
                </span>
              </div>
              <!-- <div class="row">
            <span class="label">{{$t('product.company.table_header.name')}}:</span>
            <span class="content">{{ row.acronym }} - {{ row.name }}:</span>
          </div> -->
              <div class="row">
                <span class="label">{{ $t('product.company.table_header.phone') }}:</span>
                <span class="content">{{ row.phone }}</span>
              </div>
              <div class="row">
                <span class="label">{{ $t('product.company.table_header.email') }}:</span>
                <span class="content">{{ row.email }}</span>
              </div>
              <div class="row">
                <span class="label">{{ $t('product.company.table_header.contractEffectiveDate') }}:</span>
                <span class="content">{{ row.contractEffectiveDate }}</span>
              </div>
              <div v-for="(item, index) in row.contacts" :key="item.id" :label="$t('product.company.set.contacts') + (index + 1)" class="row">
                <span class="label">{{ $t('product.company.set.contacts') + (index + 1) }}:</span>

                <el-popover placement="top-start" trigger="hover">
                  <el-card style="padding: 10px">
                    <el-form label-width="80px">
                      <el-form-item :label="$t('product.company.set.contacts_title')" class="detail-item">
                        {{ item.title }}
                      </el-form-item>
                      <el-form-item :label="$t('product.company.set.contacts_phone')" class="detail-item">
                        {{ item.phone }}
                      </el-form-item>
                      <el-form-item :label="$t('product.company.set.contacts_email')" class="detail-item">
                        {{ item.email }}
                      </el-form-item>
                      <el-form-item :label="$t('product.company.set.address')" class="detail-item">
                        {{ item.address }}
                      </el-form-item>
                    </el-form>
                  </el-card>
                  <span slot="reference" class="content">{{ item.name }}</span>
                </el-popover>
              </div>
              <div v-for="(item, index) in row.websites" :key="item.id" class="row">
                <span class="label">{{ $t('product.company.table_header.website') + (index + 1) }}:</span>
                <span v-if="item.split('-').length > 1" class="content">
                  <a :href="item" class="link"><span class="link_remark">({{ item.split("-")[1] }})</span>{{ item.split("-")[0] }}</a>
                </span>
                <span v-else class="content">
                  <a :href="item" class="link">{{ item }}</a>
                </span>
              </div>
            </div>
            <div class="list_item_empty"></div>
            <div class="list_item_empty"></div>
            <div v-if="companyList.list && companyList.list.length === 0" class="list_empty">
              <img class="no-data-image" src="https://perfectdiary-public-dev.oss-cn-shenzhen.aliyuncs.com/material/image/2021/07/7ae9b327b8eb4e29a712b87518049e78.png" />
              數據為空
            </div>
          </div>
          <div class="table-bottom">
            <add v-if="hasPermission(100005)" />
            <pagination :total="companyList.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @updatme:page="updatePage" @update:limit="updateLimit" />
          </div>
        </el-scrollbar>
      </basic-container>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import { mapState } from "vuex";
import { parseTime } from "@/utils";
import add from "./add";
import edit from "./edit";
// import contact from "./contact";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数

const _ = require("lodash");

export default {
  name: "Company",
  components: {
    pagination,
    add,
    edit
  },
  directives: { permission },
  data() {
    return {
      height: document.body.clientHeight - 180,
      wildcard: "",
      expandKeys: [],
      listQuery: {
        page: 1,
        limit: 50,
      },
      tableLoading: true,
      deleteLoading: false,
    };
  },
  computed: {
    ...mapState({
      companyList: (state) => state.company.companyList,
      companyLoading: (state) => state.company.companyLoading,
    }),
  },
  created() {
    if (!this.checkPermission([1])) {
      this.height = document.body.clientHeight - 130;
    }
    this.getCompanyList();
  },
  methods: {
    checkPermission,
    search: _.debounce(function () {
      this.getCompanyList({ wildcard: this.wildcard });
    }, 500),
    handleDelete(row) {
      this.$confirm(
        this.$t("product.company.tooltip.delete"),
        this.$t("common.prompt"),
        {
          confirmButtonText: this.$t("common.confirmButton"),
          cancelButtonText: this.$t("common.cancelButton"),
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              this.$api.company
                .delCompany(row.id)
                .then((res) => {
                  this.$message({
                    message: this.$t("common.success"),
                    type: "success",
                    duration: 5 * 1000,
                  });
                  this.getCompanyList();
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
      );
    },
    dateFormat(row, column) {
      const date = row[column.property];
      return parseTime(date, "{y}-{m}-{d}");
    },
    getCompanyList(param) {
      this.$store.dispatch("company/FetchCompanyList", param);
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit;
      const max = pageObj.limit;
      const params = { offset, max };
      this.getCompanyList(params);
    },
    updatePage(val) {
      this.listQuery.page = val;
    },
    updateLimit(val) {
      this.listQuery.limit = val;
    },
    expandChange(row, expandedRows) {
      if (this.expandKeys.indexOf(row.id) >= 0) {
        // 收起当前行
        this.expandKeys.shift();
        return;
      }
      this.expandKeys.shift();
      this.expandKeys.push(row.id);
      if (expandedRows.length > 1) {
        // 只展开当前选项
        expandedRows.shift();
      }
    },
    gotoContact(row) {
      // this.getContact();
      // this.dialogVisible = true;
      this.$router.push({ path: `/product/company/contact?id=${row.id}&title=${row.name}` });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
#company {
  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    box-sizing: border-box;
    max-height: 70vh;
    overflow: auto;
    .company_name {
      font-weight: bold;
      color: $--content;
      font-size: 18px;
    }
    .list_item {
      width: 520px;
      padding: 8px 20px;
      border-radius: 8px;
      border: 1px solid #e9e8f0;
      margin-bottom: 24px;
      max-height: 1000px;
      .row {
        display: flex;
        justify-content: space-between;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        font-weight: 500;
        .label {
          color: $--label;
        }
        .content {
          font-weight: 500;
          text-align: right;
          color: $--content;
          a {
            display: inline-block;
          }
          .link {
            max-width: 324px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .link:hover {
            color: $--purple;
          }
          .link_remark {
            color: $--label;
            vertical-align: top;
            text-align: right;
          }
        }
      }
    }
    .list_item_empty {
      width: 520px;
    }
    .list_empty {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: #e9e8f0;
      font-size: 18px;
      margin-top: 160px;
      image {
        width: 280px;
        height: 280px;
      }
    }
  }
}
</style>
