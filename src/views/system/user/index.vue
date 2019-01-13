<template>
  <div class="table-container">
    <basic-container>
      <avue-crud :data="data" :option="option" v-model="obj" :before-close="beforeOpen"/>
    </basic-container>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      obj: {},
      data: [],
      option: {
        page: false,
        align: 'left',
        stripe: true,
        column: [
          {
            label: 'ID',
            prop: 'id',
            editVisdiplay: false
          },
          {
            label: '姓名',
            prop: 'name',
            filterable: true
          }
        ]
      }
    }
  },
  created() {
    this.$api.user.fetchUserList().then(res => {
      this.data = res.data.users
    })
  }
}
</script>

<style lang="scss">
  .table-container {
    padding: 8px 10px;
  }
</style>
