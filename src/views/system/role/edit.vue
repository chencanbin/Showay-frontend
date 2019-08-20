<template>
  <span>
    <el-button type="text" size="small" @click="initForm">{{ this.$t('common.edit') }}</el-button>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible="dialogVisible"
      :before-close="handleClose"
      :title="$t('user.set.edit_title')"
      width="500px"
      append-to-body>
      <el-form ref="role" label-width="80px">
        <el-form-item label="权限" prop="name">
          <el-tree
            ref="roleTree"
            :default-checked-keys="role.actionsMap && role.actionsMap.split(',')"
            :data="permission"
            node-key="id"
            show-checkbox />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">{{ $t('common.submitButton') }}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import elDragDialog from '@/directive/el-dragDialog'
import { permission } from '@/utils/constant'
export default {
  directives: { elDragDialog },
  props: {
    role: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      permission,
      loading: false,
      dialogVisible: false
    }
  },
  methods: {
    initForm() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleSubmit() {
      this.loading = true
      this.$api.role.editRole(this.role.id, { actionsMap: this.$refs.roleTree.getCheckedKeys() }).then(_ => {
        this.$message({
          message: this.$t('common.success'),
          type: 'success',
          duration: 5 * 1000
        })
        this.handleClose()
        this.$emit('afterUpdateRole')
        this.loading = false
      }).catch(_ => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">

</style>
