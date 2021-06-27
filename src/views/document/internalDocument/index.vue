<template>
  <div id="internal-file-list" class="table-container">
    <basic-container>
      <div class="internal-file-list">
        <div class="file-menu-wrapper">
          <el-tree ref="tree" :load="loadFolder" :data="folderTree" :key="randomKey" :props="props" :default-expanded-keys="expandArray" node-key="id" auto-expand-parent lazy @node-click="nodeExpand">
            <span slot-scope="{ node, data }" :title="data.name" class="tree-item-wrapper">
              <span v-if="!data.extention" class="iconfont icon_file_select" />
              <span v-else class="iconfont" :class="getFileType(data.extention)" />
              <a class="folderLink">{{ data.name }}</a>
            </span>
          </el-tree>
        </div>

        <div class="file-list-wrapper" id="file-list-wrapper" @drop.native="onUploadFile(event)">
          <el-row class="file-list-header">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 14px">
              <el-breadcrumb-item v-for="item in levelList" :key="item.id">
                <a class="folderLink" @click="handleFolderClick(item)">{{
                  item.data.name
                }}</a>
              </el-breadcrumb-item>
            </el-breadcrumb>
            <add v-if="hasPermission(100092)" :folder-id="folderId" @afterAddFolder="afterAddFolder" />
          </el-row>
          <div class="content-wrapper">
            <div class="table-wrapper">
              <el-table v-loading="fileLoading" :data="folder.items" :show-header="false" stripe>
                <el-table-column show-overflow-tooltip prop="name" min-width="300">
                  <template slot-scope="scope">
                    <div class="file-item-wrapper">
                      <span v-if="!scope.row.extention" class="iconfont icon_file_nor" />
                      <span v-else class="iconfont" :class="getFileType(scope.row.extention)" />
                      <a v-if="!scope.row.resourceKey" class="folderLink" @click="handleTableFolderClick(scope.row.id)">{{ scope.row.name }}</a>
                      <a v-else-if="scope.row.resourceKey && scope.row.extention === 'application/pdf'" class="folderLink" @click="viewPdf(scope.row)">{{ scope.row.name }}</a>
                      <span v-else>{{ scope.row.name }}</span>
                    </div>
                  </template>

                </el-table-column>
                <el-table-column width="150">
                  <template slot-scope="scope">
                    {{ scope.row.size && bytesToSize(scope.row.size) }}
                  </template>
                </el-table-column>
                <el-table-column :formatter="dateFormat" prop="creationDate" width="200px" />
                <el-table-column :label="$t('common.action')" width="100" align="center">
                  <template slot-scope="scope">
                    <el-dropdown>
                      <el-button type="primary" plain size="mini">
                        <i class="el-icon-more" />
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="hasPermission(100078) && scope.row.resourceKey">
                          <el-button v-if="hasPermission(100078) && scope.row.resourceKey" type="text" size="small" @click="handleDownload(scope.$index, scope.row)">{{ $t("common.download") }}
                          </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <edit v-if="hasPermission(100080)" :data="scope.row" :folder-id="folderId" @afterEdit="afterEdit" />
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <el-button v-if="hasPermission(100079)" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">{{ $t("common.delete") }}
                          </el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <file-upload v-if="hasPermission(100077)" @afterComplete="afterComplete" />
          </div>
        </div>
      </div>
      <file-list ref="fileList" />
    </basic-container>
  </div>
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
  data() {
    return {
      tableHeight: this.hasPermission(100077)
        ? document.body.clientHeight - 380
        : document.body.clientHeight - 140,
      menuVisible: false,
      levelList: [],
      expandArray: [2],
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
  created() {
    this.getFolder(2);
    this.levelList = [
      { id: 2, data: { name: this.$t("document.internal_file") } },
    ];
  },
  mounted() {
    const fileListArea = document.getElementById("file-list-wrapper");
    console.log(fileListArea);
  },
  methods: {
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
          {
            name: this.$t("document.internal_file"),
            id: 2,
            items: this.folder.items,
          },
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
      return fileType[val] ? `icon_file_${fileType[val]}` : "icon_home_wendang_nor";
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
      ).then(() => { });
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
    onUploadFile(e) {
      conole.log(e);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" type="text/scss" scoped>
/deep/#internal-file-list {
  .el-card__body {
    padding-bottom: 0;
  }
  .basic-container {
    padding-bottom: 0;
    padding-right: 0;
    padding-top: 0;
    border-radius: 0;
  }
  height: 92vh;
}
/deep/.internal-file-list {
  display: flex;
  height: 92vh;
  overflow: auto;
  .file-menu-wrapper {
    padding-top: 16px;
    flex-basis: 20%;
    border-right: 1px solid #e9e8f0;
    padding-right: 16px;
    overflow: auto;
  }
  .file-list-wrapper {
    flex: 1;
    min-width: 0;
    padding-left: 24px;
    padding-right: 24px;
    position: relative;
    .file-list-header {
      padding-left: 24px;
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #e9e8f0;
    }
    .content-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: calc(100% - 84px);
      overflow: auto;
      .table-wrapper {
        position: relative;
        margin-top: 24px;
        .el-table::before {
          display: none;
        }
      }
    }
  }
  .el-icon-caret-right::before {
    font-family: "iconfont" !important;
    font-size: 30px;
    font-style: normal;
    content: "\e6c";
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    position: absolute;
    right: 0;
  }
  .upload-demo .el-upload {
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
    height: 50px !important;
    border-radius: 6px;
    &:hover {
      background: $--purple-assist;
    }
    .expanded + .tree-item-wrapper {
      .iconfont {
        color: #6f78cf;
      }
    }
  }
  .folderLink:active,
  .folderLink:hover {
    cursor: pointer;
    text-decoration: none;
    color: $--purple;
  }
  .el-breadcrumb {
    display: inline-block;
    vertical-align: middle;
    margin-right: 20px;
  }
  .tree-item-wrapper,
  .file-item-wrapper {
    display: flex;
    align-items: center;
    font-size: 14px;
    .iconfont {
      font-size: 28px;
      color: #cccfd7;
      margin-right: 8px;
    }
    .folderLink {
      display: inline-block;
      width: 260px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .icon_file_pdf {
      color: #ce5656 !important;
    }
    .icon_file_word {
      color: #6f78cf !important;
    }
    .icon_file_excel {
      color: #4aa794 !important;
    }
    .icon_file_ppt {
      color: #e96030 !important;
    }
  }
}
</style>