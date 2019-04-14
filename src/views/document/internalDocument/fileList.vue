<template>
  <el-dialog
    id="fileList"
    :visible="dialogVisible"
    :before-close="handleClose"
    :fullscreen="true"
    :title="title">
    <el-row style="margin-bottom: 5px; padding: 5px">
      <file-upload @afterComplete="afterComplete"/>
    </el-row>
    <el-table
      v-loading="loading"
      :data="folder.items"
      :height="tableHeight"
      stripe>
      <el-table-column
        prop="name"
        label="文件名称">
        <template slot-scope="scope">
          <svg-icon :icon-class="getFileType(scope.row.extention)" style="font-size: 30px; margin-right: 15px; vertical-align: middle"/>
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="文件大小" width="150">
        <template slot-scope="scope">
          {{ bytesToSize(scope.row.size) }}
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormat"
        label="创建时间"
        prop="creationDate"
        width="200px"/>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-download"
            @click="handleDownload(scope.$index, scope.row)">下载
          </el-button>
          <edit :data="scope.row" :id="id"/>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import fileUpload from './fileUpload'
import { mapGetters, mapState } from 'vuex'
import { fileType } from '@/utils/constant'
import { parseTime } from '@/utils'
import edit from './editFile'
import axios from 'axios'

export default {
  name: 'CompanyDocument',
  components: {
    fileUpload,
    edit
  },
  data() {
    return {
      id: '',
      title: '',
      dialogVisible: false,
      tableHeight: window.screen.height - 250
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState(
      {
        folder: state => state.document.folders
      })
  },
  methods: {
    openDialog(id, name) {
      this.id = id
      this.title = name
      this.dialogVisible = true
      this.getFileList(this.id)
    },
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date)
    },
    handleClose() {
      this.getFileList(2)
      this.dialogVisible = false
    },
    getFileType(val) {
      const type = fileType[val] || 'default'
      return `file_${type}`
    },
    bytesToSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1000 // or 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
    },
    getFileList(id, params) {
      this.$store.dispatch('document/FetchFolderById', { id, params })
    },
    handleDownload(index, row) {
      this.$api.document.getPrivateDownloadLink(row.resourceKey).then(res => {
        this.download(res.data.url, row.name)
      })
    },
    download(url, fileName) {
      axios.get(url, {
        responseType: 'blob'
      }).then(res => {
        const blob = new Blob([res.data])
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob) //  创建下载的链接
        downloadElement.href = href
        downloadElement.download = fileName //  下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() //  点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放blob对象
      })
    },
    afterComplete(_file) {
      this.$api.document.createFile({
        'name': _file.name,
        'parent': this.id,
        'size': _file.size,
        'extension': _file.type || '-',
        'resourceKey': _file.uid
      }).then(_ => {
        this.getFileList(this.id)
      })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', `提示`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.document.deleteFile(row.id).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getFileList(this.id)
        })
      })
    }
  }
}
</script>

<style type="text/scss" rel="stylesheet/scss">
  #fileList .el-dialog__body {
    padding: 5px 10px;
  }
</style>