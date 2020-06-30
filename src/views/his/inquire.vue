<template>
  <div class="tab-container">
    <div class="title">查询相关</div>
    <div class="content">
<!--      <div class="other">占位</div>-->
      <el-tabs v-model="activeName" style="width:100%;" type="border-card">
        <el-tab-pane key="fee" label="费用明细" name="fee">
          <!-- 费用明细 -->
          <!--          搜索部分-->
          <div class="part-search">
            <div class="query-list">
              <span class="tit">筛选列表</span>
              <span class="first">收费日期</span>
              <span style="display: inline-flex;">
              <el-date-picker type="date" placeholder="选择日期" class="data-picker" v-model="date"></el-date-picker>
              <el-button class="search-btn" type="primary" icon="el-icon-date"></el-button></span>
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
              <el-button type="primary" class="list-btn">查找</el-button>
            </div>
          </div>
          <!--          表单-->
          <div class="title1"><span></span>项目明细</div>
          <div class="detailPart">
            <el-table :data="tableDataEnd" style="width: 100%;" height="500" border :span-method="objectSpanMethod">
              <el-table-column width="55" fixed prop="id">
                <!--                <template slot-scope="scope">-->
                <!--                  <el-checkbox  v-model="scope.row.checked" @change.native="getCurrentRow(scope.row)">&nbsp;</el-checkbox>-->
                <!--                </template>-->
                <template slot-scope="scope">
                  <el-radio :label="scope.$index" v-model="radio" @change.native="getCurrentRow(scope.row)">&nbsp;
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="applyId" label="申请单号" width="150" fixed>
              </el-table-column>
              <el-table-column prop="name" label="项目名称" width="150">
              </el-table-column>
              <el-table-column prop="num" label="数量" width="100">
              </el-table-column>
              <el-table-column prop="unit" label="单位" width="100">
              </el-table-column>
              <el-table-column prop="price" label="单价" width="100">
              </el-table-column>
              <el-table-column  label="金额" width="100">
                <template slot-scope="scope">
                  {{scope.row.price *scope.row.num}}
                </template>
              </el-table-column>
              <el-table-column prop="type" label="执行类别" width="100">
              </el-table-column>
              <el-table-column prop="department" label="开单科室" width="150">
              </el-table-column>
              <el-table-column prop="executive" label="执行科室" width="150">
              </el-table-column>
              <el-table-column label="状态" prop="pay_state" min-width="200">
                <template slot-scope="{row: {pay_state}}">
                  <div v-if="+pay_state === 1" class="state-part">
                    <el-button slot="reference" class="finish">已缴费</el-button>
                    <el-button slot="reference" class="complete">已开发票</el-button>
                  </div>
                  <div v-if="+pay_state === 2" class="state-part">
                    <el-button slot="reference" class="finish">已缴费</el-button>
                    <el-button slot="reference" class="no-complete">未开发票</el-button>
                  </div>
                  <div v-if="+pay_state === 3" class="state-part">
                    <el-button slot="reference" class="no-finish">已退费</el-button>
                    <el-button slot="reference" class="no-complete">未开发票</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5,10,15,20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"></el-pagination>
          </div>
          <!--          底部操作-->
          <div class="bottom">
            <div class="left">
              <span>合计费用：200元</span>
              <span>—</span>
              <span>退费费用：20元</span>
              <span>—</span>
              <span>实缴费用：180元</span>
            </div>
            <div class="right">
              <el-button type="primary" round icon="el-icon-d-caret" @click="review()" class="list-btn">预览清单明细</el-button>
              <el-button round icon="el-icon-printer" style="border: 1px solid #0755c3;color: #0755c3;">打印清单明细</el-button>
              <el-button round icon="el-icon-printer" style="border: 1px solid #19be6b;color: #19be6b;">打印发票</el-button>
            </div>
          </div>

          <el-drawer
            title="清单明细"
            :visible.sync="drawer"
            direction="rtl"
            size="50%">
            <el-card class="box-card" v-for="item in templateSelection" :key="item">
              <div slot="header" class="clearfix">
                <p>成都爱尔眼科医院</p>
                <h1>清单详情</h1>
              </div>
              <div class="selection-list">
                <div>申请单号：{{item.applyId}}</div>
                <div>项目名称：{{item.name}}</div>
                <div>数量：{{item.num}}</div>
                <div>单位：{{item.unit}}</div>
                <div>单价：{{item.price}}</div>
                <div>金额：{{item.money}}</div>
                <div>执行类别：{{item.type}}</div>
                <div>开单科室：{{item.department}}</div>
                <div>执行科室：{{item.executive}}</div>
                <div style="display: flex;">状态：
                  <span v-if="item.pay_state === 1">
                    <span style="color:#19be6b;">已缴费</span>|
                    <span style="color:#19be6b;">已开发票</span>
                  </span>
                  <span v-if="item.pay_state=== 2">
                    <span style="color:#19be6b;">已缴费</span>|
                    <span style="color: #ed4014;">未开发票</span>
                  </span>
                  <span v-if="item.pay_state=== 3">
                    <span style="color:#9fa7b3;">已退费</span>|
                    <span style="color: #ed4014;">未开发票</span>
                  </span>
                </div>
              </div>
            </el-card>
            <div class="action-part">
              <el-button round @click="drawer=false">取消</el-button>
              <el-button type="warning" round @click="drawer=false">确认</el-button>
            </div>
          </el-drawer>
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
        date:'',
        templateSelection: [],
        radio:'',
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
          applyId: '111111111111',
          name: '葡萄糖',
          price: '23',
          num: '5',
          money: '121',
          unit: '瓶',
          type: '',
          department: '外一科医生',
          executive: '',
          pay_state: 1,
        },
          {
            id: 1,
            applyId: '111111111111',
            name: '葡萄糖',
            scale: '13g*9s',
            price: '23',
            num: '5',
            money: '121',
            pay_state: 2,
            complete: true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 1,
            applyId: '111111111111',
            name: '葡萄糖',
            scale: '13g*9s',
            price: '23',
            num: '5',
            money: '121',
            pay_state: 3,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 2,
            applyId: '222222222222',
            name: '葡萄糖',
            scale: '6mg:200ug*24',
            price: '23',
            num: '5',
            money: '121',
            pay_state: 3,
            complete: false,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 2,
            applyId: '222222222222',
            name: '葡萄糖',
            scale: '13g*9s',
            price: '23',
            num: '5',
            money: '121',
            pay_state: 1,
            complete: true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 2,
            applyId: '222222222222',
            name: '葡萄糖',
            price: '23',
            num: '5',
            money: '121',
            pay_state: 2,
            complete: true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 3,
            applyId: '333333333333',
            name: '葡萄糖',
            scale: '13g*9s',
            price: '23',
            num: '5',
            money: '121',
            pay_state: 1,
            complete: true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 3,
            applyId: '333333333333',
            name: '葡萄糖',
            scale: '13g*9s',
            price: '23',
            num: '5',
            money: '121',
            pay_state: 1,
            complete: true,
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
          },
          {
            id: 4,
            applyId: '444444444444',
            name: '葡萄糖',
            scale: '6mg:200ug*24',
            price: '23',
            num: '5',
            money: '121',
            pay_state: 2,
            complete: true,
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
            money:'130',
            unit: '瓶',
            type: '',
            department: '外一科医生',
            executive: '',
            pay_state: 2,
          }
        ],
        // 清单明细
        gridData: [{
          paytype: '金额',
          card: '200',
          money: '50'
        }],
        total: 0,
        pageSize: 5,
        currentPage: 1,
        tableDataEnd: [],
        position: 0,
        rowSpanArr: [],
      }
    },
    watch: {
      activeName(val) {
        this.$router.push(`${this.$route.path}?tab=${val}`)
      },
      drawer(val){
        if(val===false){
          this.templateSelection=[];
          this.radio=''
        }
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
      this.getRowSpan();
    },
    methods: {
      getCurrentRow(row) { //获取选中数据
        this.templateSelection.push(row)
      },
      // 预览清单列表
      review(){
        let _this=this;
        if (_this.radio===''){
          this.$message({
            message: '请选择一条你要预览的清单',
            center: true
          });
          return false;
        }
        _this.drawer=true;
      },

// 获取合并的数组
      getRowSpan() {
        this.rowSpanArr = [];
        this.tableDataEnd.forEach((item, index) => {
          if (index == 0) {
            this.rowSpanArr.push(1);
            this.position = 0;
          } else {
            if (this.tableDataEnd[index].applyId == this.tableDataEnd[index - 1].applyId||this.tableDataEnd[index].id == this.tableDataEnd[index - 1].id) {
              this.rowSpanArr[this.position] += 1; //申请单号相同，合并到同一个数组中
              this.rowSpanArr.push(0);
              this.tableDataEnd[index].applyId = this.tableDataEnd[index - 1].applyId;
            } else {
              this.rowSpanArr.push(1);
              this.position = index;
            }
          }
        });
      },
      objectSpanMethod({ rowIndex, columnIndex }) {
        // 只合并区域位置
        if (columnIndex === 1||columnIndex===0) {
          const _row = this.rowSpanArr[rowIndex];
          return {
            rowspan: _row, //行
            colspan: 1 //列
          };
        }
      },


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
        this.getRowSpan();
      }
    }
  }
</script>

<style lang="scss">
  .tab-container {
    margin: 0;
  }

  body, html {
    background: #f8f8f9;
    margin: 0;
    padding: 0;
  }

  /*模块标题*/
  .title {
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    color: #17233d;
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
    font-size: 18px;
    font-weight: 600;
  }

  .part-search .query-list span {
    color: #515a6e;
    font-size: 16px;
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

  .data-picker .el-icon-date:before {
    content: '';
  }
  .el-input--prefix .el-input__inner{
    padding:0 20px;
  }

  .data-picker .el-input--prefix .el-input__inner {
    padding: 0 20px;
  }
  .el-date-editor.el-input{
    width: 240px;
  }
  /*表单*/
  .detailPart {
    padding: 20px 30px;
  }

  .title1 {
    font-size: 16px;
    color: #17233d;
    font-weight: 600;
    display: flex;
    height: 50px;
    line-height: 50px;
    margin-left: 30px;
  }

  .title1 span {
    border-radius: 50%;
    background: #4090ff;
    min-width: 16px;
    height: 16px;
    margin-top: 17px;
    margin-right: 5px;
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

  /*表单状态*/
  .state-part {
    display: flex;
  }

  .finish, .finish:focus, .finish:hover {
    /*height: 28px;*/
    /*width: 60px;*/
    /*padding: 0;*/
    color: #4090ff;
    background: #4090ff4d;
    border-color: #4090ff;
    border-radius: 5px;
  }

  .no-finish, .no-finish:focus, .no-finish:hover {
    /*height: 28px;*/
    /*width: 60px;*/
    /*padding: 0;*/
    color: #c3cbd6;
    background: #e9eaec4d;
    border-color: #e9eaec;
    border-radius: 5px;
  }

  .complete, .complete:focus, .complete:hover {
    /*height: 28px;*/
    /*width: 60px;*/
    /*padding: 0;*/
    color: #19be6b;
    background: #f8f8f9;
    border-color: #19be6b;
    border-radius: 5px;
  }

  .no-complete, .no-complete:focus, .no-complete:hover {
    /*height: 28px;*/
    /*width: 60px;*/
    /*padding: 0;*/
    color: #ed4014;
    background: #f8f8f9;
    border-color: #ed4014;
    border-radius: 5px;
  }

  .el-table__footer-wrapper, .el-table__header-wrapper {
    background: #5e97e64d;
  }

  .el-table th.is-leaf {
    border: none !important;
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

  .bottom {
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
  }

  .bottom .left {
    line-height: 54px;
  }

  .bottom .left span {
    color: #4090ff;
    font-size: 18px;
  }
  .list-btn,
  .el-radio-button__orig-radio:checked+.el-radio-button__inner ,
  {
    background-color: #4090ff;
    border-color: #4090ff;
  }
  .list-btn:focus,
  .list-btn:hover,
  .el-radio-button__orig-radio:checked+.el-radio-button__inner:focus,
  .el-radio-button__orig-radio:checked+.el-radio-button__inner:hover{
    background: #1877fb;
    border-color:#1877fb;
  }
  /*抽屉*/
  .el-drawer__open .el-drawer.rtl{
    border-left:10px solid #4090ff;
  }
  .el-drawer__body{
    padding: 15px 30px;
  }
  .el-drawer__header{
    padding: 20px 30px;
    background: #5e97e64d;
  }
  .el-drawer__header span{
    font-size: 18px;
    font-weight: 600;
    color: #17233d;
  }
  .el-drawer__header button{
    color:#515a6e;
    font-weight: 600;
  }
  .el-drawer__header span:focus{
    outline: 0;
  }
  .action-part {
    float: right;
    margin-top: 100px;
  }
  .clearfix p{
    margin: 0;
    font-weight: 600;
    font-size: 18px;
    text-align: center;
  }
  .clearfix h1{
    margin: 0;
    text-align: center;
    font-size: 24px;
    margin-top: 10px;
  }
  .selection-list div{
    margin: 5px 0;
    color: #515a6e;
  }
  .el-card.is-always-shadow{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }
</style>
