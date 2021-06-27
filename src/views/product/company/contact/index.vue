<template>
  <basic-container id="contact-wrapper">
    <!-- <el-button type="text" size="small" @click="initForm">
      {{ $t("product.company.set.edit_contact_title") }}
    </el-button> -->
    <!-- <el-dialog id="contact-wrapper" :visible="dialogVisible" :before-close="handleClose" :title="generateTitle()" :fullscreen="true" center append-to-body> -->
    <el-table v-loading="contactLoading" :data="contactList.list" stripe>
      <el-table-column :label="$t('product.company.set.contacts_name')" prop="name" show-overflow-tooltip />
      <el-table-column :label="$t('product.company.set.contacts_title')" prop="title" show-overflow-tooltip />
      <el-table-column :label="$t('product.company.set.contacts_phone')" prop="phone" show-overflow-tooltip />
      <el-table-column :label="$t('product.company.set.contacts_email')" prop="email" show-overflow-tooltip />
      <el-table-column :label="$t('product.company.set.contacts_address')" prop="address" show-overflow-tooltip />
      <el-table-column :label="$t('common.action')" width="80px">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" plain size="mini">
              <i class="el-icon-more" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <edit :data="scope.row" :company="company" />
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button :loading="deleteLoading" size="small" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t("common.delete") }}</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="contact-bottom">
      <add :company="company" class="add-contact" />
    </div>
    <!-- </el-dialog> -->
  </basic-container>
</template>

<script type="text/ecmascript-6">
import { mapState } from "vuex";
import edit from "./editContact";
import add from "./addContact";
export default {
  name: "CompanyContact",
  components: {
    edit,
    add,
  },
  props: {
    company: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      height: document.body.clientHeight - 160,
      dialogVisible: false,
      selectSum: 0,
      deleteLoading: false,
    };
  },
  computed: {
    ...mapState({
      contactList: (state) => state.company.contactList,
      contactLoading: (state) => state.company.contactLoading,
    }),
  },
  created() {
    this.getContact(this.$route.query.id)
  },

  methods: {
    initForm() {
      // this.getContact();
      // this.dialogVisible = true;
      //this.$router.push({ name: 'companyContact', que: { userId: 'xxx' } })
    },
    generateTitle() {
      return `${this.$t("product.company.set.contacts")} - ${this.company.name
        } `;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    getContact(id) {
      this.$store.dispatch("company/FetchCompanyContact", {
        company: id,
      });
    },
    handleDelete(row) {
      this.$confirm(
        "此操作将永久删除该联系人, 是否继续?",
        this.$t("common.prompt"),
        {
          confirmButtonText: this.$t("common.confirmButton"),
          cancelButtonText: this.$t("common.cancelButton"),
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              this.$api.company
                .deleteCompanyContact(row.id)
                .then((res) => {
                  this.$message({
                    message: this.$t("common.success"),
                    type: "success",
                    duration: 5 * 1000,
                  });
                  this.getContact();
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
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss">
#contact-wrapper {
  .el-dialog {
    border-radius: 0;
    .el-dialog__body {
      padding: 5px 20px;
      tr:nth-child(odd) td {
        background-color: #ffffff;
      }
      tr:nth-child(even) td {
        background-color: #fafafa;
      }
    }
  }
  .contact-bottom {
    position: absolute;
    #add-contact {
      padding-left: 0;
    }
  }
  // .add-contact {
  //   position: absloute;
  //   overflow: hidden;
  // }
}
</style>
