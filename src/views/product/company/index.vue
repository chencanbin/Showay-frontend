<template>
  <div id="company" class="table-container">
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
      <!-- <el-table v-loading="companyLoading" :data="companyList.list" :height="height" :expand-row-keys="expandKeys" row-key="id" stripe @expand-change="expandChange">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form id="policy-table-expand" label-position="left" inline>
              <el-form-item :label="$t('product.company.table_header.address')" class="company-form-item" style="width: 100%">
                <span>{{ scope.row.address }}</span>
              </el-form-item>
              <el-form-item v-for="(item, index) in scope.row.websites" :key="index" :label="
                  $t('product.company.table_header.website') + (index + 1)
                " class="company-form-item">
                <div v-if="item.split('-').length > 1">
                  <a :href="item" class="link">{{ item.split("-")[0] }}</a> (
                  {{ item.split("-")[1] }} )
                </div>
                <div v-else>
                  <a :href="item" class="link">{{ item }}</a>
                </div>
              </el-form-item>
              <br>
              <el-form-item v-for="(item, index) in scope.row.contacts" :key="index" :label="$t('product.company.set.contacts') + (index + 1)" class="company-form-item" style="width: 30%">
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
                  <span slot="reference">
                    {{ item.name }}
                  </span>
                </el-popover>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column :label="$t('product.company.table_header.name')" prop="name" min-width="150px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.acronym }} - {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('product.company.table_header.level')" prop="level" width="150px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.secondary" type="warning">{{
                $t("product.company.levelTab.level2")
              }}</el-tag>
            <el-tag v-else type="success">{{
                $t("product.company.levelTab.level1")
              }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('product.company.table_header.phone')" prop="phone" show-overflow-tooltip />
        <el-table-column :label="$t('product.company.table_header.email')" prop="email" show-overflow-tooltip />
        <el-table-column :formatter="dateFormat" :label="$t('product.company.table_header.contractEffectiveDate')" prop="contractEffectiveDate" min-width="100px" />
        <el-table-column :label="$t('common.action')" width="80px">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit v-if="hasPermission(100008)" :id="scope.row.id" />
                </el-dropdown-item>
                <el-dropdown-item>
                  <contact v-if="hasPermission(100123)" :company="scope.row" />
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="hasPermission(100009)" :loading="deleteLoading" size="small" type="text" @click="handleDelete(scope.row)">{{ $t("common.delete") }}</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <edit :id="scope.row.id" />
          </template>
        </el-table-column>
      </el-table> -->
      <div class="list" v-loading="companyLoading">
        <div class="list_item" v-for="row in companyList.list" :key="row.id">
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
                    <contact v-if="hasPermission(100123)" :company="row" />
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button v-if="hasPermission(100009)" :loading="deleteLoading" size="small" type="text" @click="handleDelete(row)">{{ $t("common.delete") }}</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
          <div class="row">
            <span class="label">{{$t('product.company.table_header.level')}}:</span>
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
            <span class="label">{{$t('product.company.table_header.phone')}}:</span>
            <span class="content">{{ row.phone }}</span>
          </div>
          <div class="row">
            <span class="label">{{$t('product.company.table_header.email')}}:</span>
            <span class="content">{{ row.email }}</span>
          </div>
          <div class="row">
            <span class="label">{{$t('product.company.table_header.contractEffectiveDate')}}:</span>
            <span class="content">{{ row.contractEffectiveDate }}</span>
          </div>
          <div v-for="(item, index) in row.contacts" :key="item.id" :label="$t('product.company.set.contacts') + (index + 1)" class="row">
            <span class="label">{{$t('product.company.set.contacts') + (index + 1)}}:</span>

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
            <span class="label">{{$t('product.company.table_header.website') + (index + 1)}}:</span>
            <span v-if="item.split('-').length > 1" class="content">
              <a :href="item" class="link"><span class="link_remark">({{item.split("-")[1]}})</span>{{ item.split("-")[0] }}</a>
            </span>
            <span v-else class="content">
              <a :href="item" class="link">{{ item }}</a>
            </span>
          </div>
        </div>
        <div class="list_item_empty"></div>
      </div>
      <div class="company-list-bottom">
        <add v-if="hasPermission(100005)" />
        <pagination :total="companyList.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @updatme:page="updatePage" @update:limit="updateLimit" />
      </div>
    </basic-container>

  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import { mapState } from "vuex";
import { parseTime } from "@/utils";
import add from "./add";
import edit from "./edit";
import contact from "./contact";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import checkPermission from "@/utils/permission"; // 权限判断函数

const _ = require("lodash");

export default {
  name: "Company",
  components: {
    pagination,
    add,
    edit,
    contact,
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
    .company_name {
      font-weight: bold;
      color: $--content;
      font-size: 18px;
    }
    .list_item {
      width: 455px;
      padding: 8px 20px;
      border-radius: 8px;
      border: 1px solid #e9e8f0;
      margin-bottom: 24px;
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
      width: 530px;
    }
  }
  .company-list-bottom {
    position: fixed;
    bottom: 0;
    left: 216px;
    height: 60px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    border-top: #e9e8f0 solid 1px;
    box-sizing: border-box;
    width: calc(100% - 200px - 32px);
  }
}
</style>
