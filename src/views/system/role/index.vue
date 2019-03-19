<template>
  <div class="table-container">
    <basic-container>
      <el-table
        v-loading="loading"
        :data="roles"
        :height="height"
        stripe
      >
        <el-table-column
          prop="id"
          label="ID"/>
        <el-table-column
          prop="name"
          label="角色名"/>
        <el-table-column
          :formatter="dateFormat"
          prop="creationDay"
          label="创建时间"/>
      </el-table>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'

export default {
  name: 'Role',
  data() {
    return {
      height: window.screen.height - 200,
      roles: []
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  created() {
    this.$api.role.fetchRoleList().then(res => {
      this.roles = res.data.list
    })
  },
  methods: {
    dateFormat(row, column) {
      const date = row[column.property]
      return parseTime(date)
    }
  }
}
</script>

<style lang="scss">
  /*.table-container {*/
    /*padding: 8px 10px;*/
  /*}*/
</style>
