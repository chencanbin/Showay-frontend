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
      data: [
        {
          name: '张三',
          sex: '男',
          date: '1994-02-23 00:00:00'
        }, {
          name: '李四',
          sex: '女',
          date: '1994-02-23 00:00:00'
        }, {
          name: '王五',
          sex: '女',
          date: '1994-02-23 00:00:00'
        }, {
          name: '赵六',
          sex: '男',
          date: '1994-02-23 00:00:00'
        }
      ],
      option: {
        page: false,
        border: false,
        menuWidth: 290,
        align: 'left',
        column: [
          {
            label: '姓名',
            prop: 'name'
          },
          {
            label: '性别',
            prop: 'sex'
          }, {
            label: '日期',
            prop: 'date',
            type: 'date',
            format: 'yyyy-MM-dd hh:mm:ss',
            valueFormat: 'yyyy-MM-dd hh:mm:ss'
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss">
  .table-container {
    padding: 8px 10px;
  }
</style>
