<template>
  <div class="table-container">
    <basic-container>
      <el-table
        v-loading="fileLoading"
        :data="folder.items"
        :height="tableHeight"
        stripe>
        <el-table-column
          prop="name"
          label="文件夹名称">
          <template slot-scope="scope">
            <svg-icon v-if="!scope.row.extention" icon-class="folder" style="font-size: 30px; margin-right: 15px; vertical-align: middle"/>
            <svg-icon v-else :icon-class="getFileType(scope.row.extention)" style="font-size: 30px; margin-right: 15px; vertical-align: middle"/>
            <a class="folderLink" @click="handleFileList(scope.row.id, scope.row.name)">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          label="创建时间"
          prop="creationDate"
          width="200px"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" plain size="mini">
                <i class="el-icon-more"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <edit :data="scope.row"/>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <add/>
      <file-list ref="fileList"/>
    </basic-container>
  </div>
</template>

<script>
import fileUpload from './fileUpload'
import { mapState } from 'vuex'
import { fileType } from '@/utils/constant'
import add from './add'
import edit from './edit'
import fileList from './fileList'
import { parseTime } from '@/utils'

export default {
  name: 'CompanyDocument',
  components: {
    fileUpload,
    add,
    edit,
    fileList
  },
  data() {
    return {
      tableHeight: document.body.clientHeight - 130
    }
  },
  computed: {
    ...mapState(
      {
        folder: state => state.document.folders,
        fileLoading: state => state.document.fileLoading
      })
  },
  created() {
    this.getFolder()
  },

  methods: {
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date)
    },
    getFileType(val) {
      const type = fileType[val] || 'default'
      return `file_${type}`
    },
    getFolder() {
      this.$store.dispatch('document/FetchFolderById', { id: 1 })
    },
    handleFileList(id, name) {
      this.$refs.fileList.openDialog(id, name)
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该文件夹, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$api.document.deleteFolder(row.id).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.getFolder()
              instance.confirmButtonLoading = false
              done()
            }).catch(_ => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      })
    }
  }
}
</script>

<style scoped type="text/scss">
  .folderLink {
    color: #424e67;
  }
  .folderLink:active, .folderLink:hover {
    cursor: pointer;
    text-decoration: none;
    color: #00701A;
  }
</style>
