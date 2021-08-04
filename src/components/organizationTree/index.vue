<template>
  <el-dialog id="organizationTree" title="渠道上下級關係" :visible.sync="dialogVisible" @closed="handleClose" append-to-body width="500px">
    <el-input placeholder="輸入關鍵字進行過濾" v-model="filterText">
    </el-input>

    <el-tree class="filter-tree" :data="data" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree">
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      dialogVisible: false,
      filterText: '',
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    openDialog() {
      this.dialogVisible = true;
    }

  },
}
</script>
<style lang="scss">
#organizationTree {
  .filter-tree {
    margin-top: 10px;
  }
}
</style>