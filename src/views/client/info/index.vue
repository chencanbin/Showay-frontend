<template>
  <div id="clientInfo" class="table-container">
    <div class="header">
      <el-form :inline="true" class="search-input" @submit.native.prevent>
        <el-form-item label="" prop="wildcard">
          <el-input v-model="wildcard" :placeholder="$t('client.info.search')" clearable @input="search">
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form>
    </div>
    <basic-container>
      <div class="client_list_wrapper" v-loading="clientLoading">
        <div class="create_client" @click="createClient">
          <i class="el-icon-plus"></i>
          <span class="create_client_tip">{{$t("common.add")}}</span>
        </div>
        <div class="client_info_wrapper" v-for="scope in client.list" :key="scope.id">
          <div class="client_info ">
            <span class="client_name">{{scope.name}}</span>
            <el-dropdown>
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit :data="scope" :list-query="listQuery" />
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="text" size="small" @click="verifyPassword(scope.id)">{{ $t("common.delete") }}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="client_info">
            <span class="label">{{$t('client.info.idNumber')}}:</span>
            <span class="value">{{scope.idNumber}}</span>
          </div>
          <div class="client_info">
            <span class="label">{{$t('client.info.locale')}}:</span>
            <span class="value">{{scope.locale}}</span>
          </div>
          <div class="client_info">
            <span class="label">{{$t('client.info.sex')}}</span>
            <span class="value" v-if="!scope.isOrganization">
              {{scope.sex === 0? $t("client.info.male"): $t("client.info.female")}}
            </span>
          </div>
          <div class="client_info">
            <span class="label">{{$t('client.info.birthday')}}</span>
            <span class="value">{{scope.birthday | dateFormat}}</span>
          </div>
          <div class="client_info">
            <span class="label">{{$t('client.info.phone')}}</span>
            <span class="value">{{scope.phone}}</span>
          </div>
          <div class="client_info">
            <span class="label">{{$t('client.info.email')}}</span>
            <el-tooltip :content="scope.email" placement="top"><span class="value">{{scope.email}}</span></el-tooltip>
          </div>
          <div class="client_info">
            <span class="label">{{$t('client.info.type')}}</span>
            <el-tag v-if="scope.isOrganization" type="success">{{$t("client.info.organization")}}</el-tag>
            <el-tag v-else>{{$t("client.info.individual")}}</el-tag>
          </div>
        </div>
        <div class="client_empty"></div>
        <div class="client_empty"></div>
        <div class="client_empty"></div>
        <div class="client_empty"></div>
        <div class="client_empty"></div>
      </div>
      <div class="table-bottom">
        <add :list-query="listQuery" ref="addClient" />
        <pagination :total="client.total" :page="listQuery.page" :limit="listQuery.limit" @pagination="pagination" @update:page="updatePage" @update:limit="updateLimit" />

      </div>
      <el-dialog v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('common.password_verify') + ' - ' + name" width="400px">
        <el-input v-model="password" :placeholder="$t('login.password_placeholder')" type="password" />
        <div class="tips_text">* {{ $t("common.password_verify_text") }}</div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{
            $t("common.cancelButton")
          }}</el-button>
          <el-button :loading="submitLoading" type="primary" @click="handleDelete()">{{ $t("common.submitButton") }}</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import { mapState, mapGetters } from "vuex";
import add from "./add";
import edit from "./edit";
import pagination from "@/components/Pagination";
import sha256 from "sha256";
import elDragDialog from "@/directive/el-dragDialog";

const _ = require("lodash");
export default {
  components: {
    add,
    edit,
    pagination,
  },
  directives: { elDragDialog },
  data: function () {
    return {
      height: document.body.clientHeight - 180,
      id: 0,
      dialogVisible: false,
      password: "",
      submitLoading: false,
      listQuery: {
        page: 1,
        limit: 50,
      },
      wildcard: "",
    };
  },
  computed: {
    ...mapGetters(["name"]),
    ...mapState({
      clientLoading: (state) => state.client.clientLoading,
      client: (state) => state.client.clientList,
    }),
  },
  mounted() {
    this.getClient();
  },
  filters: {
    dateFormat(val) {
      return parseTime(val, "{y}-{m}-{d}");
    },
  },
  methods: {
    createClient() {
      this.$refs.addClient.initForm();
    },
    getClient(params) {
      params = Object.assign({ wildcard: this.wildcard, ...params });
      this.$store.dispatch("client/FetchClientList", { params });
    },
    search: _.debounce(function () {
      this.listQuery = { page: 1, limit: 50 };
      this.getClient({ wildcard: this.wildcard });
    }, 500),
    dateFormat(row, column) {
      const date = row[column.property];
      return parseTime(date, "{y}-{m}-{d}");
    },
    handleDelete() {
      this.submitLoading = true;
      this.$api.client
        .deleteClient(this.id, sha256(this.password))
        .then((res) => {
          this.$message({
            message: this.$t("common.success"),
            type: "success",
            duration: 5 * 1000,
          });
          this.getClient();
          this.submitLoading = false;
          this.handleClose();
        })
        .catch((_) => {
          this.submitLoading = false;
        });
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
      this.id = id;
      this.dialogVisible = true;
    },
    handleClose() {
      this.password = "";
      this.dialogVisible = false;
    },
    pagination(pageObj) {
      const offset = (pageObj.page - 1) * pageObj.limit;
      const max = pageObj.limit;
      const params = { offset, max };
      this.getClient(params);
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
<style lang="scss" rel="stylesheet/scss" type="text/scss">
#clientInfo {
  background: #eff0f3;

  .el-dialog--center .el-dialog__body {
    padding: 15px 20px;
  }
  .tips_text {
    color: #5c5958;
    font-size: 14px;
    font-weight: bold;
    margin-top: 10px;
  }

  .client_list_wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    box-sizing: border-box;
    height: 78vh;
    overflow: auto;
    .create_client {
      width: 310px;
      min-height: 300px;
      border-radius: 8px;
      border: 1px dashed #e9e8f0;
      margin-bottom: 24px;
      color: $--label;
      font-size: 18px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .el-icon-plus {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
    .create_client:hover {
      border-color: $--purple;
      color: #fff;
      background: $--purple;
      transition: all 0.5s;
    }
    .client_empty {
      width: 310px;
    }
    .client_info_wrapper {
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e9e8f0;
      margin-bottom: 24px;
      padding: 24px;
      width: 310px;
      .client_name {
        font-size: 18px;
        color: #42475f;
        font-size: 18px;
      }
      .client_info {
        font-size: 14px;
        font-weight: 500;
        height: 36px;
        line-height: 36px;
        display: flex;
        justify-content: space-between;
        .label {
          color: $--label;
        }
        .value {
          color: #42475f;
          word-wrap: normal;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: right;
          width: 150px;
        }
      }
    }
  }
}
</style>
