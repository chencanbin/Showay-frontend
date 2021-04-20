<template>
  <span>
    <el-button 
      type="text" 
      size="small" 
      @click="initForm">{{
        this.$t("client.insurance_policy.policy_file")
      }}</el-button>
    <el-dialog
      id="policy_file"
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :fullscreen="true"
      :before-close="handleClose"
      :title="$t('client.insurance_policy.policy_file')"
      append-to-body
    >
      <basic-container>
        <el-col 
          :span="5" 
          :style="treeWrapper" 
          style="overflow: auto">
          <el-tree
            ref="tree"
            :load="loadFolder"
            :data="folderTree"
            :key="randomKey"
            :props="props"
            :default-expanded-keys="expandArray"
            node-key="id"
            auto-expand-parent
            lazy
            style="margin-top: 10px"
            @node-click="nodeExpand"
          >
            <span
              slot-scope="{ node, data }"
              :title="data.name"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              <svg-icon
                v-if="!data.extention"
                icon-class="folder"
                style="
                  font-size: 20px;
                  margin-right: 15px;
                  vertical-align: middle;
                "
              />
              <svg-icon
                v-else
                :icon-class="getFileType(data.extention)"
                style="
                  font-size: 20px;
                  margin-right: 15px;
                  vertical-align: middle;
                "
              />
              <a class="folderLink">{{ data.name }}</a>
            </span>
          </el-tree>
        </el-col>
        <el-col
          :span="19"
          style="border-left: 1px solid #cccccc; padding: 20px 10px 10px 10px"
        >
          <el-row style="margin-bottom: 5px">
            <el-breadcrumb
              separator-class="el-icon-arrow-right"
              style="font-size: 14px"
            >
              <el-breadcrumb-item 
                v-for="item in levelList" 
                :key="item.id">
                <a 
                  class="folderLink" 
                  @click="handleFolderClick(item)">{{
                    item.data.name
                  }}</a>
              </el-breadcrumb-item>
            </el-breadcrumb>
            <add
              v-if="hasPermission(100092)"
              :folder-id="folderId"
              @afterAddFolder="afterAddFolder"
            />
          </el-row>
          <el-table
            v-loading="fileLoading"
            :height="tableHeight"
            :data="folder.items"
            :show-header="false"
            stripe
          >
            <el-table-column 
              show-overflow-tooltip 
              prop="name">
              <template slot-scope="scope">
                <svg-icon
                  v-if="!scope.row.extention"
                  icon-class="folder"
                  style="
                    font-size: 30px;
                    margin-right: 15px;
                    vertical-align: middle;
                  "
                />
                <svg-icon
                  v-else
                  :icon-class="getFileType(scope.row.extention)"
                  style="
                    font-size: 30px;
                    margin-right: 15px;
                    vertical-align: middle;
                  "
                />
                <a
                  v-if="!scope.row.resourceKey"
                  class="folderLink"
                  @click="handleTableFolderClick(scope.row.id)"
                >{{ scope.row.name }}</a
                >
                <a
                  v-else-if="
                    scope.row.resourceKey &&
                      scope.row.extention === 'application/pdf'
                  "
                  class="folderLink"
                  @click="viewPdf(scope.row)"
                >{{ scope.row.name }}</a
                >
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template slot-scope="scope">
                {{ scope.row.size && bytesToSize(scope.row.size) }}
              </template>
            </el-table-column>
            <el-table-column
              :formatter="dateFormat"
              prop="creationDate"
              width="200px"
            />
            <el-table-column
              :label="$t('common.action')"
              width="100"
              align="center"
            >
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
                      <el-button
                        v-if="hasPermission(100078) && scope.row.resourceKey"
                        type="text"
                        size="small"
                        icon="el-icon-download"
                        @click="handleDownload(scope.$index, scope.row)"
                      >{{ $t("common.download") }}
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <edit
                        v-if="hasPermission(100084)"
                        :data="scope.row"
                        :folder-id="folderId"
                        @afterEdit="afterEdit"
                      />
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        v-if="hasPermission(100083)"
                        type="text"
                        size="small"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.$index, scope.row)"
                      >{{ $t("common.delete") }}
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <file-upload
            v-if="hasPermission(100081)"
            @afterComplete="afterComplete"
          />
        </el-col>
        <file-list ref="fileList" />
      </basic-container>
    </el-dialog>
  </span>
</template>

<script>
import fileUpload from "./fileUpload";
import { mapState } from "vuex";
import { fileType } from "@/utils/constant";
import add from "./add";
import edit from "./edit";
import { parseTime } from "@/utils";
import fileList from "./fileList";
import axios from "axios";

export default {
  name: "CompanyDocument",
  components: {
    fileUpload,
    add,
    edit,
    fileList,
  },
  props: {
    id: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      root: 0,
      tableHeight: this.hasPermission(100081)
        ? document.body.clientHeight - 315
        : document.body.clientHeight - 140,
      treeWrapper: {
        height: document.body.clientHeight - 80 + "px",
      },
      menuVisible: false,
      dialogVisible: false,
      levelList: [],
      expandArray: [],
      folderTree: [],
      node: "",
      resolve: "",
      folderId: "",
      randomKey: 0,
      currencyNode: "",
      props: {
        label: "name",
        isLeaf: "isLeaf",
        children: "items",
      },
    };
  },
  computed: {
    ...mapState({
      folder: (state) => state.document.folders,
      fileLoading: (state) => state.document.fileLoading,
    }),
  },
  created() {},

  methods: {
    initForm() {
      this.$api.document.fetchFolderById("", { name: "Policy" }).then((res) => {
        this.$api.document
          .fetchFolderById(res.data.items[0].id, { name: this.id })
          .then((res) => {
            this.root = res.data.items[0].id;
            this.getFolder(res.data.items[0].id);
            this.expandArray = [res.data.items[0].id];
            this.levelList = [
              { id: this.id, data: { name: res.data.items[0].name } },
            ];
            this.dialogVisible = true;
          });
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    nodeExpand(data, node) {
      if (!node) {
        return;
      }
      if (data.resourceKey) {
        return;
      }
      if (node === this.currencyNode) {
        return;
      } else {
        this.levelList = [];
        this.getBreadcrumb(node);
        this.levelList.reverse();
        this.currencyNode = node;
        this.getFolder(node.data.id);
      }
    },
    getBreadcrumb(node) {
      if (node && node.parent) {
        this.levelList.push(node);
        this.getBreadcrumb(node.parent);
      }
    },
    loadFolder(node, resolve) {
      this.node = node;
      this.resolve = resolve;
      if (node.level === 0) {
        this.folderTree = [
          { name: this.id, id: this.root, items: this.folder.items },
        ];
      } else {
        this.$api.document.fetchFolderById(node.data.id).then((res) => {
          const items = res.data.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].resourceKey) {
              items[i]["isLeaf"] = true;
            }
          }
          return resolve(items);
        });
      }

      // this.$api.document.fetchFolderById(node.id, params).then(res => {
      //   resolve(res.data.items)
      // })
    },
    dateFormat(row, column) {
      const date = row[column.property];
      return parseTime(date);
    },
    renderTree() {
      this.randomKey = +new Date();
    },
    getFileType(val) {
      const type = fileType[val] || "default";
      return `file_${type}`;
    },
    getFolder(id, params) {
      this.folderId = id;
      this.$store.dispatch("document/FetchFolderById", { id, params });
    },
    handleFileList(id, name) {
      this.$refs.fileList.openDialog(id, name);
    },
    handleFolderClick(node) {
      this.nodeExpand([], node);
    },
    viewPdf(row) {
      this.$api.document.getPrivateDownloadLink(row.resourceKey).then((res) => {
        axios
          .get(res.data.url, {
            responseType: "blob",
          })
          .then((res) => {
            const href = window.URL.createObjectURL(
              new Blob([res.data], { type: "application/pdf" })
            );
            window.open(href);
          });
      });
    },
    handleTableFolderClick(id) {
      this.expandArray.push(id);
      this.nodeExpand([], this.$refs.tree.getNode(id));
    },
    handleDelete(index, row) {
      this.$confirm(
        this.$t("document.tooltip.delete"),
        this.$t("common.prompt"),
        {
          confirmButtonText: this.$t("common.confirmButton"),
          cancelButtonText: this.$t("common.cancelButton"),
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              if (row.resourceKey) {
                this.$api.document
                  .deleteFile(row.id)
                  .then((res) => {
                    this.$message({
                      message: this.$t("common.success"),
                      type: "success",
                      duration: 5 * 1000,
                    });
                    this.$refs.tree.remove(row);
                    this.getFolder(this.folderId);
                    instance.confirmButtonLoading = false;
                    done();
                  })
                  .catch((_) => {
                    instance.confirmButtonLoading = false;
                  });
              } else {
                this.$api.document
                  .deleteFolder(row.id)
                  .then((res) => {
                    this.$message({
                      message: this.$t("common.success"),
                      type: "success",
                      duration: 5 * 1000,
                    });
                    this.$refs.tree.remove(row);
                    this.getFolder(this.folderId);
                    instance.confirmButtonLoading = false;
                    done();
                  })
                  .catch((_) => {
                    instance.confirmButtonLoading = false;
                  });
              }
            } else {
              done();
            }
          },
        }
      ).then(() => {});
    },
    handleRightSelect(key) {
      if (key === 1) {
        this.NodeAdd(this.NODE, this.DATA);
        this.menuVisible = false;
      } else if (key === 2) {
        this.NodeEdit(this.NODE, this.DATA);
        this.menuVisible = false;
      } else if (key === 3) {
        this.NodeDel(this.NODE, this.DATA);
        this.menuVisible = false;
      } else if (key === 4) {
        console.log("4");
      }
    },
    rihgtClick(event, object, value, element) {
      if (this.objectID !== object.id) {
        this.objectID = object.id;
        this.menuVisible = true;
        this.DATA = object;
        this.NODE = value;
      } else {
        this.menuVisible = !this.menuVisible;
      }
      document.addEventListener("click", (e) => {
        this.menuVisible = false;
      });
      const menu = document.querySelector("#rightClickMenu");
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX + 20 + "px";
      menu.style.top = event.clientY - 30 + "px";
      menu.style.position = "absolute"; // 为新创建的DIV指定绝对定位
      menu.style.width = 160 + "px";
    },
    afterComplete(_file) {
      this.$api.document
        .createFile({
          name: _file.name,
          parent: this.folderId,
          size: _file.size,
          extension: _file.type || "-",
          resourceKey: _file.uid,
        })
        .then((_) => {
          this.getFolder(this.folderId);
          this.loadFolder(this.node, this.resolve);
        });
    },
    afterEdit() {
      this.getFolder(this.folderId);
      this.loadFolder(this.node, this.resolve);
    },
    afterAddFolder(folder) {
      this.getFolder(this.folderId);
      this.$refs.tree.append(folder, this.folderId);
    },
    bytesToSize(bytes) {
      if (bytes === 0) return "0 B";
      const k = 1000; // or 1024
      const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },
    handleDownload(index, row) {
      this.$api.document.getPrivateDownloadLink(row.resourceKey).then((res) => {
        this.download(res.data.url, row.name);
      });
    },
    download(url, fileName) {
      axios
        .get(url, {
          responseType: "blob",
        })
        .then((res) => {
          const blob = new Blob([res.data]);
          const downloadElement = document.createElement("a");
          const href = window.URL.createObjectURL(blob); //  创建下载的链接
          downloadElement.href = href;
          downloadElement.download = fileName; //  下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //  点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放blob对象
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss">
#policy_file {
  .el-dialog__body {
    padding: 10px;
  }
}
.upload-demo .el-upload {
  margin-top: 20px;
  width: 100%;
  height: 200px;
}
.upload-demo .el-upload-dragger {
  width: 100%;
  height: 200px;
}
.folderLink {
  color: #424e67;
}
.el-tree-node__content {
  font-size: 14px;
  height: 32px !important;
}
.folderLink:active,
.folderLink:hover {
  cursor: pointer;
  text-decoration: none;
  color: #00701a;
}
.el-breadcrumb {
  display: inline-block;
  vertical-align: middle;
  margin-right: 20px;
}
</style>
