<template>
  <el-card class="card-file-list">
    <div slot="header">
      <span class="card-header-title">{{
        $t("home.news")
      }}</span>
    </div>
    <!-- <el-table v-loading="loading" :data="fileList" :show-header="false" height="307">
      <el-table-column prop="name" label="文件名称" show-overflow-tooltip>
        <template slot-scope="scope"> -->
    <!--<svg-icon :icon-class="getFileType(scope.row.extention)" style="font-size: 30px; margin-right: 15px; vertical-align: middle"/>-->
    <div style="height:320px;">
      <div v-for="(file,index) in fileList" :key="index" class="file-list-wrapper">
        <a type="text" class="folderLink" @click="handleDownload(file)">{{ fileNameFormatter(file.name) }}</a>
      </div>
    </div>
    <!-- </template>
      </el-table-column>
    </el-table> -->
  </el-card>
</template>

<script>
import axios from "axios";

export default {
  name: "",
  data() {
    return {
      fileList: [],
      loading: false,
    };
  },

  created() {
    this.getFileList(6);
  },
  methods: {
    fileNameFormatter(name) {
      const pattern = /\.{1}[a-z]{1,}$/;
      if (pattern.exec(name) !== null) {
        return name.slice(0, pattern.exec(name).index);
      } else {
        return name;
      }
    },
    getFileList(id, params) {
      // this.$store.dispatch('document/FetchFolderById', { id, params })
      this.loading = true;
      this.$api.document
        .getHomePageFileList({
          showInHomePage: true,
          sort: "creationDate",
          order: "desc",
        })
        .then((res) => {
          this.fileList = res.data.list;
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
        });
    },

    handleDownload(row) {
      this.$api.document.getCompanyDownloadLink(row.resourceKey).then((res) => {
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

<style rel="stylesheet/scss" lang="scss" type="text/scss">
.card-file-list {
  background: #fff;
  height: 408px;

  .el-card__header {
    border: 0;
    height: 60px;
    line-height: 60px;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
  .el-card__body {
    overflow: auto;
    padding-left: 24px;
    padding-right: 24px;
  }
  .file-list-wrapper {
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px dashed #e9e8f0;
    .folderLink {
      color: #43475f;
      font-size: 16px;
      display: block;
      padding-left: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .folderLink:active,
    .folderLink:hover {
      cursor: pointer;
      text-decoration: none;
      color: $--purple;
    }
  }
}
</style>
