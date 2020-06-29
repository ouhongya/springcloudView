<template>
  <div class="tab-container">
    <div class="title">查询相关</div>
    <div class="content">
      <div class="other">占位</div>
      <el-tabs v-model="activeName" style="width:80%;" type="border-card">
        <el-tab-pane key="fee" label="费用明细" name="fee">
          <!-- 费用明细 -->
          <div class="part-search">
            <div class="query-list">
              <span class="tit">筛选列表</span>
              <span class="first">收费日期</span>
              <el-date-picker type="datetime" placeholder="选择日期" class="data-picker"></el-date-picker>
              <el-button class="search-btn" type="primary" icon="el-icon-date"></el-button>
              <span class="second">收费员</span>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <el-radio-group v-model="choosed" class="condition">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="use">有效</el-radio-button>
              <el-radio-button label="used">作废</el-radio-button>
            </el-radio-group>

            <div class="action">
              <el-button>清空</el-button>
              <el-button type="primary">查找</el-button>
            </div>
          </div>
          <el-divider></el-divider>
          <div class="detailPart">
            <el-table :data="tableDataEnd" style="width: 100%;" height="500">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column fixed prop="applyId" label="申请单号" >
              </el-table-column>
              <el-table-column prop="name" label="项目名称" >
              </el-table-column>
              <el-table-column prop="num" label="数量" >
              </el-table-column>
              <el-table-column prop="unit" label="单位" >
              </el-table-column>
              <el-table-column prop="price" label="单价" >
              </el-table-column>
              <el-table-column prop="money" label="金额" >
              </el-table-column>
              <el-table-column prop="type" label="执行类别">
              </el-table-column>
              <el-table-column prop="department" label="开单科室">
              </el-table-column>
              <el-table-column prop="executive" label="执行科室">
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <el-popover placement="right" width="300" trigger="hover">
                    <el-table :data="gridData">
                      <el-table-column width="100" property="paytype" label="支付方式"></el-table-column>
                      <el-table-column width="100" property="card" label="社保"></el-table-column>
                      <el-table-column width="100" property="money" label="现金"></el-table-column>
                    </el-table>
                    <el-button slot="reference" @click="drawer = true" class="finish" v-if="state">已缴费</el-button>
                    <el-button slot="reference" @click="drawer = true" class="no-finish" v-else>未缴费</el-button>
                    <el-button slot="reference" @click="drawer = true" class="finish" v-if="complete">已开发票</el-button>
                    <el-button slot="reference" @click="drawer = true" class="no-finish" v-else>未开发票</el-button>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <el-drawer :visible.sync="drawer" :direction="direction" size="50%">
              <div class="detailpay">
                <h1>清单明细</h1>
                <el-table :data="gridData">
                  <el-table-column width="100" property="paytype" label="支付方式"></el-table-column>
                  <el-table-column width="100" property="card" label="社保"></el-table-column>
                  <el-table-column width="100" property="money" label="现金"></el-table-column>
                </el-table>
                <h1>合计</h1>
                <p>实收退款：250元</p>
                <div class="action-part">
                  <el-button round>取消</el-button>
                  <el-button type="warning" round>确认退款</el-button>
                </div>
              </div>
            </el-drawer>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[2, 5, 8, 10]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"></el-pagination>

            <!--          <el-divider></el-divider>-->
            <!--          <el-button @click="toPage">测试跳转</el-button>-->
            <!--          <el-button @click="back">回到上一页</el-button>-->
          </div>
        </el-tab-pane>
        <el-tab-pane key="hospitalpay" label="住院预交金" name="hospitalpay">
        </el-tab-pane>
        <el-tab-pane key="bill" label="发票查询" name="bill">
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 打开抽屉
        drawer: false,
        direction: 'rtl',
        activeName: 'fee',
        choosed: 'all',
        seachTitle: '',
        // 下拉框
        options: [{
          value: '1',
          label: '张三'
        }, {
          value: '2',
          label: '李四'
        }, {
          value: '3',
          label: '王五'
        }],
        value: '',
        //费用明细表单
        feeDetail: [{
          id: 1,
          applyId: '1562625262662',
          name: '葡萄糖',
          price: '23',
          num: '5',
          money:price*num,
          state:true,
          complete:false,
          unit: '瓶',
          type: '',
          department: '外一科医生',
          executive: '',
        },
          {
            id: 2,
            applyId: '1562625262662',
            name: '葡萄糖',
            scale: '13g*9s',
            price: '23',
            num: '5',
            money:price*num,
            state:true,
            complete:true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 3,
            applyId: '1562625262662',
            name: '葡萄糖',
            scale: '13g*9s',
            price: '23',
            num: '5',
            money:price*num,
            state:true,
            complete:true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 4,
            applyId: '1562625262662',
            name: '葡萄糖',
            scale: '6mg:200ug*24',
            price: '23',
            num: '5',
            money:price*num,
            state:true,
            complete:false,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 5,
            applyId: '196262525662',
            name: '葡萄糖',
            scale: '13g*9s',
            price: '23',
            num: '5',
            money:price*num,
            state:true,
            complete:true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 6,
            applyId: '1562625262662',
            name: '葡萄糖',
            price: '23',
            num: '5',
            money:price*num,
            state:true,
            complete:true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 7,
            applyId: '1562625262662',
            name: '葡萄糖',
            scale: '13g*9s',
            price: '23',
            num: '5',
            money:price*num,
            state:true,
            complete:true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 8,
            applyId: '1562625262662',
            name: '葡萄糖',
            scale: '13g*9s',
            price: '23',
            num: '5',
            money:price*num,
            state:true,
            complete:true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 9,
            applyId: '1562625262662',
            name: '葡萄糖',
            scale: '6mg:200ug*24',
            price: '23',
            num: '5',
            money:price*num,
            state:true,
            complete:true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 10,
            applyId: '196262525662',
            name: '葡萄糖',
            scale: '13g*9s',
            price: '23',
            num: '5',
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          }
        ],
        // 清单明细
        gridData: [{
          paytype: '金额',
          card: '200',
          money: '50'
        }],
        total: 0,
        pageSize: 2,
        currentPage: 1,
        tableDataEnd: []
      }
    },
    watch: {
      activeName(val) {
        this.$router.push(`${this.$route.path}?tab=${val}`)
      }
    },
    created() {
      // init the default selected tab
      const tab = this.$route.query.tab;
      if (tab) {
        this.activeName = tab
      }
      this.total = this.feeDetail.length;
      if (this.total > this.pageSize) {
        for (let index = 0; index < this.pageSize; index++) {
          this.tableDataEnd.push(this.feeDetail[index]);
        }
      } else {
        this.tableDataEnd = this.feeDetail;
      }
    },
    methods: {
      toPage() {
        let _this = this;
        _this.$router.push("/test");
      },
      back() {
        let _this = this;
        _this.$router.go(-1);
      },
      handleSizeChange: function (pageSize) { // 每页条数切换
        this.pageSize = pageSize;
        this.handleCurrentChange(this.currentPage);
      },
      handleCurrentChange: function (currentPage) {//页码切换
        this.currentPage = currentPage;
        this.currentChangePage(this.feeDetail, currentPage);

      },
      //分页方法（重点）
      currentChangePage(list, currentPage) {
        let from = (currentPage - 1) * this.pageSize;
        let to = currentPage * this.pageSize;
        this.tableDataEnd = [];
        for (; from < to; from++) {
          if (list[from]) {
            this.tableDataEnd.push(list[from]);
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .tab-container {
    margin: 0;
  }
  body,html{
    background: #f8f8f9;
    margin: 0;
    padding: 0;
  }
  /*模块标题*/
  .title{
    height: 50px;
    line-height:50px;
    font-size:18px;
    color:#17233d;
    font-weight: bold;
    padding-left: 40px;
    background: #fff;
  }

  .content {
    display: flex;
    padding: 20px;
  }

  /*占位*/
  .other {
    width: 5%;
    height: 500px;
    margin-right: 20px;
    border: 1px solid #dcdee2;
  }

  /*tab切换*/
  .el-tabs__item {
    height: 60px;
    line-height: 60px;
    font-weight: 600;
    font-size: 16px;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    color: #17233d;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #4090ff;
    background-color: #f8f8f9;
    font-weight: bold;
  }

  .el-tabs--border-card > .el-tabs__content {
    background-color: #f8f8f9;
  }

  /*搜索部分*/
  .part-search {
    display: flex;
    padding: 20px 30px;
  }

  .part-search .tit {
    color: #17233d;
    font-size:  18px;
    font-weight: 600;
  }

  .part-search .query-list span {
    color: #515a6e;
    font-size:16px;
  }

  .part-search .query-list span.first {
    margin-left: 60px;
    margin-right: 20px;
  }

  .part-search .query-list span.second {
    margin-left: 72px;
    margin-right: 20px;
  }

  .data-picker input {
    border-radius: 5px 0 0 5px;
  }

  .data-picker .el-icon-time:before {
    content: '';
  }

  .data-picker .el-input--prefix .el-input__inner {
    padding: 0 20px;
  }

  .detailPart {
    padding: 20px 30px;
  }

  .condition {
    margin: 0 30px;
  }


  /* 搜索输入框 */
  .search-btn .el-icon-search {
    font-size: 20px;
  }

  .search-btn {
    color: #FFF;
    background-color: #4090ff;
    border-color: #4090ff;
    height: 40px;
    width: 60px;
    padding: 0;
    border-radius: 0 5px 5px 0;
    margin-left: 0;
  }

  .search-btn:focus,
  .search-btn:hover {
    background: #1877fb;
    border-color: #1877fb;
    color: #FFF;
  }

  .search-btn.is-active,
  .search-btn:active {
    background: #0755c3;
    border-color: #0755c3;
    color: #FFF;
  }

  /*特殊按钮*/
  .finish {
    height: 28px;
    width: 60px;
    padding: 0;
    color: #19be6b;
    background-color: #d1ebdd;
    border-color: #19be6b;
    border-radius: 5px;
  }
  .no-finish{
    height: 28px;
    width: 60px;
    padding: 0;
    color: #17233d;
    background-color:#9fa7b3;
    border-color: #9fa7b3;
    border-radius: 5px;
  }

  .spelcialbtn:focus,
  .spelcialbtn:hover {
    background: #ff7e00;
    border-color: #ff7e00;
    color: #fff;
  }

  .spelcialbtn.is-active,
  .spelcialbtn:active {
    background: #ff6000;
    border-color: #ff6000;
    color: #fff;
  }

  .searchInput {
    width: 360px;
    position: absolute;
  }

  .searchInput .el-input__inner {
    border-radius: 5px 0 0 5px;
    padding-left: 20px;
  }

  .el-form {
    margin-left: 30px;
  }

  /* 普通输入框 */
  .el-form-item__label {
    padding: 0 20px 0 0;
    color: #515a6e;
    font-size: 16px;
    text-align: left;
  }

  .el-form-item__content {
    width: 300px;
  }

  .el-form-item {
    margin-bottom: 30px;
  }

  .el-input__inner {
    padding: 0 20px;
  }


  /*// table表单*/
  .el-table tr th {
    background-color: #5e97e64d;
    height: 32px;
    color: #4090ff;
    padding: 0;
  }
  .el-table td {
    height: 64px;
  }

  .el-table .cell,
  .el-table--border td:first-child .cell,
  .el-table--border th:first-child .cell {
    padding-left: 20px;
  }

  .el-table th > .cell {
    padding-left: 20px;
    font-weight: normal;
  }

  .detailpay {
    margin: 0 60px;
  }

  /*// 操作按钮*/
  .el-button.is-round {
    width: 200px;
    height: 54px;
    border-radius: 27px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-size: 22px;
  }

  .action-part {
    float: right;
  }
</style>
