<template>
  <div style="display: inline-block; margin-left: 10px;">
    <!--<div class="el-table-add-row" @click="initForm"><span>+ 添加文件夾</span></div>-->
    <el-button size="small" type="primary" @click="initForm">+ {{ $t("document.add_button") }}</el-button>
    <el-dialog v-el-drag-dialog :close-on-click-modal="false" :visible="dialogVisible" :before-close="handleClose" :title="$t('document.add_title')" top="50px" width="450px">
      <el-form ref="folder" :model="folder" :rules="rule" label-width="80px">
        <el-form-item :label="$t('document.file_name')" prop="name">
          <el-input ref="folderName" v-model="folder.name" autofocus @submit.native.prevent />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">{{
            $t("common.submitButton")
          }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import elDragDialog from "@/directive/el-dragDialog";
export default {
  directives: { elDragDialog },
  props: {
    folderId: {
      type: Number,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      folder: {
        name: "",
      },
      rule: {
        name: [
          {
            required: true,
            message: this.$t("document.set.file_name"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    initForm() {
      this.dialogVisible = true;
      this.$nextTick(function () {
        this.$refs.folderName.focus();
      });
    },
    handleClose() {
      this.$refs["folder"].resetFields();
      this.dialogVisible = false;
    },
    handleSubmit() {
      this.$refs["folder"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.folder.parent = this.folderId;
          this.$api.document
            .createFolder(this.folder)
            .then((res) => {
              this.$message({
                message: this.$t("common.success"),
                type: "success",
                duration: 5 * 1000,
              });
              this.$store.dispatch("document/FetchFolderById", {
                id: this.folderId,
              });
              this.$emit("afterAddFolder", {
                id: res.data.id,
                name: this.folder.name,
              });
              this.handleClose();
              this.loading = false;
            })
            .catch((_) => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
