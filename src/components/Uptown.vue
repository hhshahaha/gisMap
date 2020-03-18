<template>
  <div id="overview">
    <div id="map"></div>
    <!-- 小区弹窗 -->
    <div class="district" id="district" style="display:none">
      <span class="disappear" @click="disappearDistrict">+</span>
      <div class="top">
        <p class="districtName fontstyle">{{districtName}}</p>
        <el-table :data="testData" border @cell-click="cellClick">
          <el-table-column prop="type" label>
            <template slot-scope="scope">
              <span>{{scope.row.type}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deal" label="待处理" column-key="0">
            <template slot-scope="scope">
              <span>{{scope.row.deal}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="comp" label="已完成" column-key="1">
            <template slot-scope="scope">
              <span>{{scope.row.comp}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="down" id="locationAndTrack" style="display:none">
        <p class="txt">显示该小区负责班组人员</p>
        <div>
          <el-radio-group v-model="radio" @click="changeRadio">
            <el-radio label="位置" @change="location">位置</el-radio>
            <el-radio label="轨迹" @change="track">轨迹</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 工单列表弹窗 -->
      <div class="orderList" v-show="showOrderList">
        <div class="orderListTxt">
          {{title}}
          <span class="disappear" @click="showOrderList=false">+</span>
        </div>

        <el-table :data="orderDatas" border>
          <!-- <el-table-column prop="orderId" label="工单号"></el-table-column> -->
          <el-table-column prop="orderId" label="工单号">
            <template slot-scope="scope1">
              <span
                v-if="scope1.row.isWarningCn=='是' && scope1.row.urgentTypeCn=='是'"
                style="color:#FFA500"
              >{{scope1.row.orderId}}</span>
              <span
                v-else-if="scope1.row.isWarningCn=='是'"
                style="color:#FF0000"
              >{{scope1.row.orderId}}</span>
              <span
                v-else-if="scope1.row.urgentTypeCn=='是'"
                style="color:#FFA500"
              >{{scope1.row.orderId}}</span>
              <span v-else style="color:#C0C0C0">{{scope1.row.orderId}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mtnUserAccount" label="当前处理人"></el-table-column>
          <el-table-column prop="mtnUserPhone" label="处理人电话"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 明细详情弹窗 -->
    <div class="detail" v-show="detailShow">
      <p class="fontstyle detail-title">
        {{detailTitle}}
        <span class="disappear" @click="detailShow=false">+</span>
      </p>
      <div class="detail-list">
        <div class="list listStyle" v-for="(workOrderList,index) in workOrderList" :key="index">
          <div style="background-color: #ededed;height:2px;"></div>
          <p>
            工单号：
            <span>{{workOrderList.orderId}}</span>
          </p>
          <p>
            工单类型：
            <span>{{workOrderList.actType}}</span>
          </p>
          <p>
            用户姓名：
            <span>{{workOrderList.custName}}</span>
          </p>
          <p>
            装维人员：
            <span>{{workOrderList.mtnUserName}}</span>
          </p>
          <p>
            装维人员电话：
            <span>{{workOrderList.mtnUserPhone}}</span>
          </p>
          <p>
            小区名称：
            <span>{{workOrderList.districtName}}</span>
          </p>
          <p>
            用户地址：
            <span>{{workOrderList.userAddress}}</span>
          </p>
          <p>
            预约上门时间：
            <span>{{workOrderList.appointEntryTime}}</span>
          </p>
          <p>
            完成时间：
            <span>{{workOrderList.closeTime}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 人物弹窗 -->
    <div id="personal" style="display:none">
      <span class="disappear" @click="disappearPersonal">+</span>
      <p>
        <span class="hint">姓名：</span>
        <span>{{personal.userName}}</span>
      </p>
      <p>
        <span class="hint">电话：</span>
        <span>{{personal.userMobile}}</span>
      </p>
      <p>
        <span class="hint">班组：</span>
        <span>{{personal.mtnGroupName}}</span>
      </p>
      <template>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="待处理" name="first">
            <table border="1">
              <tr>
                <td></td>
                <td class="hint">个人</td>
                <td class="hint">班组</td>
              </tr>
              <tr>
                <td>装机待处理</td>
                <td
                  @click="detilUserOrGroup('user','0','新装','0','0')"
                >{{personal.userDealOpenOrderNum}}</td>
                <td
                  @click="detilUserOrGroup('group','0','新装','0','0')"
                >{{personal.groupDealOpenOrderNum}}</td>
              </tr>
              <tr>
                <td>投诉待处理</td>
                <td
                  @click="detilUserOrGroup('user','0','投诉','0','0')"
                >{{personal.userDealCompOrderNum}}</td>
                <td
                  @click="detilUserOrGroup('group','0','投诉','0','0')"
                >{{personal.groupDealCompOrderNum}}</td>
              </tr>
              <tr>
                <td>装机催单</td>
                <td
                  @click="detilUserOrGroup('user','0','新装','0','1')"
                >{{personal.userDealOpenOrderUrgentNum}}</td>
                <td
                  @click="detilUserOrGroup('group','0','新装','0','1')"
                >{{personal.groupDealOpenOrderUrgentNum}}</td>
              </tr>
              <tr>
                <td>投诉催单</td>
                <td
                  @click="detilUserOrGroup('user','0','投诉','0','1')"
                >{{personal.userDealCompOrderUrgentNum}}</td>
                <td
                  @click="detilUserOrGroup('group','0','投诉','0','1')"
                >{{personal.groupDealCompOrderUrgentNum}}</td>
              </tr>
              <tr>
                <td>装机预警</td>
                <td
                  @click="detilUserOrGroup('user','0','新装','1','0')"
                >{{personal.userDealOpenOrderWarnNum}}</td>
                <td
                  @click="detilUserOrGroup('group','0','新装','1','0')"
                >{{personal.groupDealOpenOrderWarnNum}}</td>
              </tr>
              <tr>
                <td>投诉预警</td>
                <td
                  @click="detilUserOrGroup('user','0','投诉','1','0')"
                >{{personal.userDealCompOrderWarnNum}}</td>
                <td
                  @click="detilUserOrGroup('group','0','投诉','1','0')"
                >{{personal.groupDealCompOrderWarnNum}}</td>
              </tr>
            </table>
          </el-tab-pane>
          <el-tab-pane label="已完成" name="second">
            <table border="1">
              <tr>
                <td></td>
                <td class="hint">个人</td>
                <td class="hint">班组</td>
              </tr>
              <tr>
                <td>装机已完成</td>
                <td
                  @click="detilUserOrGroup('user','1','新装','0','0')"
                >{{personal.userFinishOpenOrderNum}}</td>
                <td
                  @click="detilUserOrGroup('group','1','新装','0','0')"
                >{{personal.groupFinishOpenOrderNum}}</td>
              </tr>
              <tr>
                <td>投诉已完成</td>
                <td
                  @click="detilUserOrGroup('user','1','投诉','0','0')"
                >{{personal.userFinishCompOrderNum}}</td>
                <td
                  @click="detilUserOrGroup('group','1','投诉','0','0')"
                >{{personal.groupFinishCompOrderNum}}</td>
              </tr>
              <tr>
                <td>装机催单</td>
                <td
                  @click="detilUserOrGroup('user','1','新装','0','1')"
                >{{personal.userfinishOpenOrderUrgentNum}}</td>
                <td
                  @click="detilUserOrGroup('group','1','新装','0','1')"
                >{{personal.groupfinishOpenOrderUrgentNum}}</td>
              </tr>
              <tr>
                <td>投诉催单</td>
                <td
                  @click="detilUserOrGroup('user','1','投诉','0','1')"
                >{{personal.userfinishCompOrderUrgentNum}}</td>
                <td
                  @click="detilUserOrGroup('group','1','投诉','0','1')"
                >{{personal.groupfinishCompOrderUrgentNum}}</td>
              </tr>
            </table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
    <!-- 水滴弹窗 -->
    <div class="flag" id="location" style="display:none">
      <span @click="disappearLocation" class="disappear">+</span>
      <table border="1" style="table-layout: fixed;">
        <tr>
          <td>采集人姓名</td>
          <td>采集时间</td>
        </tr>
        <tr>
          <td>{{seat.mtnUserName}}</td>
          <td>{{seat.createTime}}</td>
        </tr>
      </table>
    </div>
    <!-- flag弹窗 -->
    <div class="flag" id="flag" style="display:none">
      <span @click="disappearFlag" class="disappear">+</span>
      <table border="1" style="table-layout: fixed;">
        <tr>
          <td>工单号</td>
          <td>处理人姓名</td>
          <td>签到时间</td>
        </tr>
        <tr>
          <td>{{flag.orderId}}</td>
          <td>{{flag.mtnUserName}}</td>
          <td>{{flag.signTime}}</td>
        </tr>
      </table>
    </div>
    <!-- 表单搜索 -->
    <div class="searchForm">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="form">
        <el-form-item label="分公司" prop="company">
          <el-select v-model="formInline.company" placeholder="全部" @change="selectChange($event)">
            <el-option
              v-for="(list,index) in companyList"
              :label="list.itemValue"
              :value="list.itemKey"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="小区" prop="uptown">
          <el-select
            v-model="formInline.uptown"
            class="inputbox"
            multiple
            filterable
            remote
            :remote-method="dataFilter"
            reserve-keyword
            placeholder="全部"
            @focus="dataFilter"
            @change="dataChange($event)"
          >
            <el-option
              v-for="item in uptownOptions"
              :key="item.itemKey"
              :label="item.itemValue"
              :value="item.itemKey"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="工单状态" prop="status">
          <el-select
            v-model="formInline.status"
            placeholder="全部"
            multiple
            @change="statusChange($event)"
          >
            <el-option
              v-for="(status,index) in status"
              :key="index"
              :label="status.label"
              :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单类型" prop="type">
          <el-select
            v-model="formInline.type"
            placeholder="全部"
            multiple
            @change="typeChange($event)"
          >
            <el-option
              v-for="(type,index) in type"
              :key="index"
              :label="type.label"
              :value="type.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否已催" prop="urge">
          <el-select
            v-model="formInline.urge"
            placeholder="全部"
            multiple
            @change="urgeChange($event)"
          >
            <el-option
              v-for="(urge,index) in urge"
              :key="index"
              :label="urge.label"
              :value="urge.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否预警" prop="warning">
          <el-select
            v-model="formInline.warning"
            placeholder="全部"
            multiple
            @change="warningChange($event)"
          >
            <el-option
              v-for="(warning,index) in warning"
              :key="index"
              :label="warning.label"
              :value="warning.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="win100">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 时间 -->
    <div class="timer">
      <div class="timerImg">
        <img src="@/assets/timer.png" alt />
      </div>
      <div class="time">
        <p>{{date}}</p>
        <p>{{time}}</p>
      </div>
    </div>
    <!-- 详细信息 -->
    <div class="box">
      <div class="box1">
        <p class="title">工单总览</p>
        <div class="status1 status">
          <p>待处理工单量</p>
          <p>{{pandect.waitDealOrderNum}}</p>
        </div>
        <div class="status2 status">
          <p>已完成工单量</p>
          <p>{{pandect.closeOrderNum}}</p>
        </div>
      </div>
      <div class="box1-1">
        <div class="status3 status">
          <p>已催单工单量</p>
          <p>{{pandect.urgentOrderNum}}</p>
        </div>
        <div class="status4 status">
          <p>预警工单量</p>
          <p>{{pandect.warningOrderNum}}</p>
        </div>
      </div>
      <div class="box2">
        <p class="title">小区工单数</p>
        <div>
          <div>
            <button class="sub">
              <img src="static/uptownImg/green.png" alt />
            </button>
            <span>1~5</span>
          </div>
          <div class>
            <button class="sub">
              <img src="static/uptownImg/blue.png" alt />
            </button>
            <span>5~20</span>
          </div>
          <div>
            <button class="sub">
              <img src="static/uptownImg/khaki.png" alt />
            </button>
            <span>20以上</span>
          </div>
        </div>
      </div>
      <div class="box3">
        <el-checkbox v-model="checked" @change="drawPoint">
          <span>装维打点</span>
        </el-checkbox>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <div class="circle">
        <img src="@/assets/circle.png" alt />
      </div>
      <div class="arrows" @click="showTable" :class="[rotate?'go':'aa']">
        <img src="@/assets/arrows.png" alt />
      </div>
      <div class="txt">
        信息详情
        <el-button style="margin-left:20px;" @click="exportExcel" :disabled="disableButton">导出数据</el-button>
      </div>
      <!-- 分页 -->
      <div v-if="showRow">
        <el-table
          class="xlsxTable"
          :header-cell-style="{background:'#0099FF',color:'#fff',fontWeight:400}"
          :data="tableData"
          height="200"
          stripe
          style="width: 100%"
          @cell-click="gridClick"
        >
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="districtName" label="小区名称" width="180"></el-table-column>
          <el-table-column prop="dealNewOpenOrderNum" label="装机待处理" width="180"></el-table-column>
          <el-table-column prop="finishNewOpenOrderNum" label="装机已完成"></el-table-column>
          <el-table-column prop="dealCompOrderNum" label="投诉待处理"></el-table-column>
          <el-table-column prop="finishCompOrderNum" label="投诉已完成"></el-table-column>
          <el-table-column prop="dealMoveOpenOrderNum" label="移机待处理"></el-table-column>
          <el-table-column prop="finishMoveOpenOrderNum" label="移机已完成"></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="total,prev, pager, next"
            :total="total"
            :current-page="currentPage"
            :page-size="10"
            @current-change="current_change"
          ></el-pagination>
        </div>
      </div>
      <div class="tableHeader" v-if="showHeader">
        <el-table
          :header-cell-style="{background:'#0099FF',color:'#fff',fontWeight:400}"
          height="200"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="districtName" label="小区名称" width="180"></el-table-column>
          <el-table-column prop="dealNewOpenOrderNum" label="装机待处理" width="180"></el-table-column>
          <el-table-column prop="finishNewOpenOrderNum" label="装机已完成"></el-table-column>
          <el-table-column prop="dealCompOrderNum" label="投诉待处理"></el-table-column>
          <el-table-column prop="finishCompOrderNum" label="投诉已完成"></el-table-column>
          <el-table-column prop="dealMoveOpenOrderNum" label="移机待处理"></el-table-column>
          <el-table-column prop="finishMoveOpenOrderNum" label="移机已完成"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "Citywide",
  data() {
    return {
      activeName: "first", //tab选项卡
      query: "",
      disableButton: true,
      total: 100,
      currentPage: 1,
      changeRadio: true,
      testData: [
        {
          type: "新装",
          deal: "待装机",
          comp: "已装机"
        },
        { type: "投诉", deal: "待投诉", comp: "已投诉" },
        {
          type: "移机新装",
          deal: "待移机",
          comp: "已移机"
        }
      ],
      title: "", //工单列表名称
      orderDatas: [], //工单列表
      pagination: {
        //表格分页
      },
      pandect: [],
      date: "",
      time: "",
      showRow: false,
      showHeader: true,
      rotate: false,
      tableData: [],
      formInline: {
        company: [],
        uptown: [],
        status: [],
        type: [],
        urge: [],
        warning: []
      },
      uptownOptions: [],
      oldSearchBankType: [],
      status: [
        { value: "", label: "全部" },
        { value: "0", label: "待处理" },
        { value: "1", label: "已完成" }
      ],
      type: [
        { value: "", label: "全部" },
        { label: "装机", value: "新装" },
        { label: "移机", value: "移机新装" },
        { label: "投诉", value: "投诉" }
      ],
      urge: [
        { label: "全部", value: "" },
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],
      warning: [
        { label: "全部", value: "" },
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],

      selectList: [],
      timeout: null,
      checked: false, //装维打点
      radio: "", //小区面板radio的value值
      radio1: "", //人物信息面板用户radio
      radio2: "", //人物信息面板班组radio
      detailShow: false, //明细详情弹窗
      introShow: false, //明细简介弹窗
      personalShow: false,
      intro: "", //明细简介title
      orderList: [], //明细简介list
      introData: [], //明细简介表格
      showOrderList: false, //工单列表显隐
      districtList: [],
      companyList: [],
      cityCode: [],
      getList: [],
      setCode: "", //地图打点时传过来的小区编码
      orderData: [],
      flag: {}, //旗帜弹窗
      seat: {}, //水滴弹窗
      cellDetailList: [], //打点后显示弹窗数据
      districtName: "", //小区面板title
      personal: {}, //点击人物信息
      personalId: "", //点击人物后获取的用户id
      groupId: "", //点击人物后获取的班组id
      workOrderList: [], //工单明细
      detailTitle: "", //工单面板title
      sum: 0,
      load: 0,
      api:'http://172.30.197.151:18080/api',
      //api:'http://172.30.205.13:18081',
      //api: "http://180.168.70.186:50083",
      //api:"http://221.179.140.189:9999/simtest",
      //api: "http://221.179.140.189:9999/api",
      userId: "1", //登录userid
      token: "",
      a: 0
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      if (window.location.search.length > 1) {
        var token = this.GetQueryString("token");
        var userId = this.GetQueryString("userId");
        this.token = token;
        this.userId = userId;
        console.log(token, userId, "url参数");
      } else {
        this.token =
          "eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJwcm92aW5jZUNvZGUiOiJCSiIsInVzZXJUeXBlIjoxLCJ1c2VyUm9sZSI6OTAsImV4cCI6MTY0NjU0NzQ1Miwib3BlcmF0b3JJZCI6MSwib3BlcmF0b3JOYW1lIjoiYWRtaW4ifQ.RebKvNmDf2bbdbKx3-tzbnBVILTTE4r0RocFkMAiW4A";
      }

      this.cellGrid(); //表格数据
      this.querySearchCompany(); //分公司数据
      this.onSubmit(); //form提交
      this.cellSummary(); //右侧工单总览
      //map
      window.getDistrictList = this.getDistrictList;
      window.setDisTrictContext = this.setDisTrictContext;
      window.setPersonalContext = this.setPersonalContext;
      window.setFlagContext = this.setFlagContext;
      window.setLocationContext = this.setLocationContext; //水滴弹窗
      // 数字时钟
      var timerID = setInterval(this.updateTime, 1000);
      this.updateTime();
      function zeroPadding(num, digit) {
        var zero = "";
        for (var i = 0; i < digit; i++) {
          zero += "0";
        }
        return (zero + num).slice(-digit);
      }
    });
  },
  methods: {
    //获取url参数
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    //关闭小区弹窗
    disappearDistrict() {
      closeDistrictWin();
    },
    //关闭水滴弹窗
    disappearLocation() {
      closeLocationWin();
    },
    //关闭人物弹窗
    disappearPersonal() {
      closePersonalWin();
    },
    //关闭小旗弹窗
    disappearFlag() {
      closeFlagWin();
    },
    //右侧工单总览
    cellSummary() {
      var arr = [];
      if (this.formInline.company) {
        arr.push(this.formInline.company);
      }
      this.$axios({
        url: `${this.api}/gis/cell/summary`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            cityCodes: arr,
            districtCodes: this.formInline.uptown,
            userId: this.userId,
            dealOrFinishs: this.formInline.status,
            orderTypeCns: this.formInline.type,
            isUrgents: this.formInline.urge,
            isWarnings: this.formInline.warning
          }
        }
      })
        .then(res => {
          //console.log(res.data);
          this.pandect = res.data.bean;
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //表格数据
    cellGrid() {
      var arr = [];
      if (this.formInline.company) {
        arr.push(this.formInline.company);
      }
      this.$axios({
        url: `${this.api}/gis/cell/grid`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            cityCodes: arr,
            districtCodes: this.formInline.uptown,
            userId: this.userId,
            dealOrFinishs: this.formInline.status,
            orderTypeCns: this.formInline.type,
            isUrgents: this.formInline.urge,
            isWarnings: this.formInline.warning,
            limit: 10,
            page: this.currentPage
          }
        }
      })
        .then(res => {
          this.tableData = res.data.beans;
          this.total = res.data.bean.total;
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //表格数据点击
    gridClick(row, column, cell, event) {
      console.log(
        row.latitude,
        row.longtitude,
        typeof row.latitude,
        "表格经纬度"
      );
      if (row.latitude || row.longtitude) {
        let x=Number(row.longtitude);
        let y=Number(row.latitude)
        setDistrictCenter(x,y);
      }
    },
    //表格分页
    current_change: function(currentPage) {
      this.currentPage = currentPage;
      this.cellGrid(currentPage);
    },
    // 导出Excel公用方法
    exportMethod(data) {
      axios({
        method: data.method,
        url: data.url,
        data: data.data,
        headers: data.headers,
        responseType: "blob"
      })
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);

          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = data.fileName; //下载的文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //表格导出
    exportExcel() {
      var arr = [];
      if (this.formInline.company) {
        arr.push(this.formInline.company);
      }
      let myObj = {
        method: "post",
        url: `${this.api}/gis/cell/export`,
        fileName: "信息详情",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            cityCodes: arr,
            districtCodes: this.formInline.uptown,
            userId: this.userId,
            dealOrFinishs: this.formInline.status,
            orderTypeCns: this.formInline.type,
            isUrgents: this.formInline.urge,
            isWarnings: this.formInline.warning
          }
        }
      };
      this.exportMethod(myObj);
    },
    //装维打点
    drawPoint() {
      var arr = [];
      if (this.formInline.company) {
        arr.push(this.formInline.company);
      }
      if (this.checked == true) {
        this.$axios({
          url: `${this.api}/gis/cell/mtnuser/location`,
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": this.token
          },
          data: {
            params: {
              cityCodes: arr,
              districtCodes: this.formInline.uptown,
              userId: this.userId,
              dealOrFinishs: this.formInline.status,
              orderTypeCns: this.formInline.type,
              isUrgents: this.formInline.urge
            }
          }
        })
          .then(res => {
            let pointList = res.data.beans;
            console.log(pointList, "装维打点");
            if (pointList.length != 0) {
              drawPoint(pointList);
            } else {
              this.$notify({
                title: " warning ",
                message: "当前数据为空",
                type: "warning"
              });
            }
          })
          .catch(err => {
            this.$notify.error({
              title: "error",
              message: err
            });
          });
      } else if (this.checked == false) {
        clearDrawPoint();
      }
    },
    //点击水滴
    setLocationContext(trackId) {
      this.$axios({
        url: `${this.api}/gis/cell/trackdetail`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            trackId: trackId
          }
        }
      })
        .then(res => {
          console.log(res.data, "水滴数据");
          this.seat = res.data.bean;
        })
        .catch(err => {
          console.log(err, "err");
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //点击小旗
    setFlagContext(orderId) {
      this.$axios({
        url: `${this.api}/gis/cell/signorder`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            orderId: orderId
          }
        }
      })
        .then(res => {
          this.flag = res.data.bean;
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //点击人物信息
    setPersonalContext(personalId) {
      this.detailShow = false;
      this.personalId = personalId;
      console.log(personalId, "点击人物的personalId");
      this.$axios({
        url: `${this.api}/gis/cell/mtnuser/order/stat`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            mtnUserId: this.personalId
          }
        }
      })
        .then(res => {
          console.log(res.data, "人物数据");
          this.personal = res.data.bean;
          if (res.data.bean.mtnGroupId) {
            this.groupId = res.data.bean.mtnGroupId; //班组id
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //人物信息tab
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //人物弹窗点击工单明细
    detilUserOrGroup(isUser, isFinish, type, iswarn, isurgent) {
      let list = {
        userOrGroup: isUser,
        dealOrFinish: isFinish,
        orderTypeCn: type,
        warnType: iswarn,
        urgentType: isurgent
      };
      let params = JSON.parse(JSON.stringify(list));
      if (params.userOrGroup == "user") {
        params.id = this.personalId;
      } else {
        console.log("paramsId");
        params.id = this.groupId;
      }

      if (params.warnType == "0") {
        delete params.warnType;
      }
      if (params.urgentType == "0") {
        delete params.urgentType;
      }
      //params.id = "4024";
      console.log(params, "params2");

      this.introShow = false;

      this.$axios({
        url: `${this.api}/gis/cell/order/detail/userorgroup`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: params
        }
      })
        .then(res => {
          this.detailShow = true;
          this.workOrderList = res.data.bean.orderDatas;
          this.detailTitle = res.data.bean.title;
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //radio点击事件
    /* dealOrFinish(x, y) {
      var Id;
      if (x == "user") {
        Id = this.personalId;
      } else {
        Id = this.groupId;
      }
      if (y == "0") {
        this.intro = "待处理明细工单";
      } else {
        this.intro = "已完成明细工单";
      }
      console.log(x, y, "xy");
      this.introShow = true;
      this.detailShow = false;
      this.$axios({
        url: `${this.api}/gis/cell/order/detail/district`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            id: Id,
            userOrGroup: x,
            dealOrFinish: y
          }
        }
      })
        .then(res => {
          this.orderList = res.data.beans;
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    }, */

    //点击显示小区面板
    setDisTrictContext(code) {
      this.showOrderList = false;
      this.setCode = code;
      console.log(code, "当前点击code");

      this.$axios({
        url: `${this.api}/gis/cell/detail`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            districtCode: code
          }
        }
      })
        .then(res => {
          this.radio = "";
          if (res.data.bean) {
            const objectTemp1 = this.testData[0];
            objectTemp1.type = "装机";
            objectTemp1.deal = res.data.bean.dealNewOpenOrderNum;
            objectTemp1.comp = res.data.bean.finishNewOpenOrderNum;
            this.testData.splice(0, 1, objectTemp1);

            const objectTemp2 = this.testData[1];
            objectTemp2.type = "投诉";
            objectTemp2.deal = res.data.bean.dealCompOrderNum;
            objectTemp2.comp = res.data.bean.finishCompOrderNum;
            this.testData.splice(1, 1, objectTemp2);

            const objectTemp3 = this.testData[2];
            objectTemp3.type = "移机";
            objectTemp3.deal = res.data.bean.dealMoveOpenOrderNum;
            objectTemp3.comp = res.data.bean.finishMoveOpenOrderNum;
            this.testData.splice(2, 1, objectTemp3);

            this.districtName = res.data.bean.districtName;
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //小区工单数据点击
    cellClick(row, column, cell, event) {
      console.log(row, "row数据单击");

      var type = row.type;
      if (row.type == "装机") {
        type = "新装";
      } else if (row.type == "移机") {
        type = "移机新装";
      }
      var columnKey = column.columnKey;
      this.$axios({
        url: `${this.api}/gis/cell/order/detail`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            districtCode: this.setCode,
            orderTypeCn: type,
            dealOrFinish: columnKey
          }
        }
      })
        .then(res => {
          this.showOrderList = true;
          this.orderDatas = res.data.bean.orderDatas; //工单列表
          this.title = res.data.bean.title; //列表面板名称
          //console.log(res.data.bean.orderDatas[0].isWarningCn, "是否预警");
        })
        .catch(err => {
          console.log(err, "err");
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //小区面板选择位置
    location() {
      console.log(this.setCode, "当前小区code");
      var arr = [];
      // if (this.formInline.company) {
      //   arr.push(this.formInline.company);
      // }
      if (this.setCode) {
        arr.push(this.setCode);
      }
      console.log("点击位置");
      this.$axios({
        url: `${this.api}/gis/cell/mtnuser/location`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            // userId: this.userId,
            // cityCodes: arr,
            districtCodes: arr
          }
        }
      })
        .then(res => {
          console.log(res.data.beans, "位置");
          let location = res.data.beans;
          if (location.length != 0) {
            drawPersonLoaction(location);
          } else {
            this.$notify({
              title: " warning ",
              message: "当前位置数据为空",
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //小区面板选择轨迹
    track() {
      console.log("点击轨迹");
      var arr = [];
      if (this.setCode) {
        arr.push(this.setCode);
      }
      this.$axios({
        url: `${this.api}/gis/cell/mtnuser/location/detail`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            cityCodes: [],
            districtCodes: arr,
            userId: this.userId,
            dealOrFinishs: this.formInline.status,
            orderTypeCns: this.formInline.type,
            isUrgents: this.formInline.urge
          }
        }
      })
        .then(res => {
          console.log(res.data, "选择轨迹数据");
          let track = res.data.beans;
          console.log(track,"track")
          //test2();
          if (track.length != 0) {
            drawPersonTrajectory(track);
          } else {
            this.$notify({
              title: " warning ",
              message: "当前数据为空",
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //重置表单
    resetForm() {
      this.$refs.form.resetFields();
    },
    showTable() {
      this.rotate = !this.rotate;
      if (this.showRow == false && this.showHeader == true) {
        this.showRow = true;
        this.disableButton = false;
        this.showHeader = false;
      } else {
        this.showRow = false;
        this.disableButton = true;
        this.showHeader = true;
      }
    },
    updateTime() {
      var cd = new Date();
      this.time =
        this.zeroPadding(cd.getHours(), 2) +
        ":" +
        this.zeroPadding(cd.getMinutes(), 2) +
        ":" +
        this.zeroPadding(cd.getSeconds(), 2);
      this.date =
        this.zeroPadding(cd.getFullYear(), 4) +
        "-" +
        this.zeroPadding(cd.getMonth() + 1, 2) +
        "-" +
        this.zeroPadding(cd.getDate(), 2);
    },
    zeroPadding(num, digit) {
      var zero = "";
      for (var i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },
    onSubmit() {
      let num = 0;
      var arr = [];
      if (this.formInline.company) {
        arr.push(this.formInline.company);
      }
      /*  if (this.sum != 0 && this.formInline.status[0] == "") {
        this.formInline.status = [];
      }
      if (this.sum != 0 && this.formInline.type[0] == "") {
        this.formInline.type = [];
      }
      if (this.sum != 0 && this.formInline.urge[0] == "") {
        this.formInline.urge = [];
      } */

      this.$axios({
        url: `${this.api}/gis/cell/list`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            cityCodes: arr,
            districtCodes: this.formInline.uptown,
            userId: this.userId,
            dealOrFinishs: this.formInline.status,
            orderTypeCns: this.formInline.type,
            isUrgents: this.formInline.urge,
            isWarnings: this.formInline.warning
          }
        }
      })
        .then(res => {
          this.sum++;
          this.getList = res.data.beans;
          this.cellGrid(); //更新表格数据
          this.cellSummary(); //更新右侧信息

          if (res.data.beans.length == 0) {
            this.$notify({
              title: " warning ",
              message: "查询数据为空",
              type: "warning"
            });
          }

          if (this.sum != 1) {
            loadDistrict();
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //查询小区发送
    getDistrictList() {
      var arr = [];
      if (this.formInline.company) {
        arr.push(this.formInline.company);
      }
      if (this.load == 0) {
        this.$axios({
          url: `${this.api}/gis/cell/list`,
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": this.token
          },
          data: {
            params: {
              cityCodes: arr,
              districtCodes: this.formInline.uptown,
              userId: this.userId,
              dealOrFinishs: this.formInline.status,
              orderTypeCns: this.formInline.type,
              isUrgents: this.formInline.urge,
              isWarnings: this.formInline.warning
            }
          }
        })
          .then(res => {
            this.load++;
            this.getList = res.data.beans;
            loadDistrict();
          })
          .catch(err => {
            this.$notify.error({
              title: "error",
              message: err
            });
          });
      }
      return this.getList;
    },
    //分公司列表
    querySearchCompany() {
      this.$axios({
        url: `${this.api}/gis/select/city?`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            userId: this.userId
          }
        }
      })
        .then(res => {
          //console.log(res.data.beans);
          console.log("querySearchCompany", res);
          this.companyList = res.data.beans;
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    selectChange(code) {
      console.log(code,"code")
      this.cityCode = code;
      console.log(this.cityCode, "当前分公司");
      this.formInline.uptown=[];
      this.formInline.status=[],
      this.formInline.type=[],
      this.formInline.urge=[],
      this.formInline.warning=[]
    },
    statusChange(status) {
      if (
        status.indexOf("") != -1 ||
        (status.indexOf("1") != -1 && status.indexOf("0") != -1)
      ) {
        this.formInline.status = [];
      }
    },
    urgeChange(urge) {
      if (
        urge.indexOf("") != -1 ||
        (urge.indexOf("1") != -1 && urge.indexOf("0") != -1)
      ) {
        this.formInline.urge = [];
      }
    },
    warningChange(warning) {
      if (
        warning.indexOf("") != -1 ||
        (warning.indexOf("1") != -1 && warning.indexOf("0") != -1)
      ) {
        this.formInline.warning = [];
      }
    },
    typeChange(type) {
      if (
        type.indexOf("") != -1 ||
        (type.indexOf("新装") != -1 &&
          type.indexOf("移机新装") != -1 &&
          type.indexOf("投诉") != -1)
      ) {
        this.formInline.type = [];
      }
    },
    dataChange(e) {
      console.log(e, "小区当前值");
    },
    //小区下拉列表
    dataFilter(val) {
      //console.log(val, "当前输入值");
      if (typeof val == "string") {
        var districtName = val;
      }
      this.query = val;
      var districtList = this.districtList;
      var cityCode = this.cityCode;
      this.$axios({
        url: `${this.api}/gis/select/district`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            cityCode: cityCode,
            districtName: districtName
          }
        }
      })
        .then(res => {
          this.uptownOptions = res.data.beans;
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    handleSelect(item) {
      console.log(item);
    }
  }
};
</script>


<style scoped>
/deep/.table .el-table td,
/deep/.table .el-table th {
  padding: 8px 0 !important;
}
/* form表单重置样式 */
/deep/.searchForm .el-form-item__label {
  padding: 0 5px 0 0 !important;
}
>>> .el-form-item__label,
.el-input {
  font-size: 12px;
}

>>> .inputbox .el-input__inner {
  height: 35px;
}
>>> .inputbox .el-select__tags {
  max-width: 100px !important;
  max-height: 200px !important;
  overflow: auto;
}

>>> .inputbox .el-select__tags::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
>>> .inputbox .el-select__tags::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

>>> .tableHeader .el-table {
  height: 48px !important;
}
>>> .tableHeader .el-table__empty-block {
  display: none;
}
>>> .el-table td,
.el-table th {
  text-align: center;
}
>>> .el-table th > .cell {
  text-align: center;
}
>>> .el-form-item__content {
  width: 100px;
}
>>> .win100 .el-form-item__content {
  width: 100%;
}
.table img {
  width: 100%;
  height: 100%;
}
#citywide {
  width: 100%;
  height: 100%;
}
html,
body,
#app,
#overview {
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
/* 地图 */
#map {
  height: 100%;
}
/* 表单 */
>>> .el-form-item {
  /* margin: 11px 10px 11px 0; */
  margin: 5px 10px 5px 0;
}
>>> .el-form-item__content {
  width: 85px;
}
>>> .el-input__inner {
  height: 35px;
  max-height: 200px;
  overflow: auto;
}
>>> .el-button {
  padding: 5px 10px;
}
.searchForm {
  position: absolute;
  right: 20px;
  top: 20px;
  height: 50px;
  padding-left: 10px;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
  background-color: #fff;
}
/* 右侧信息 */
.box {
  position: absolute;
  right: 20px;
  top: 90px;
  width: 322px;
  z-index: 0;
}
.box > div {
  margin-bottom: 12px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
}
.box span {
  font-family: "Arial Normal", "Arial";
  font-size: 12px;
  color: #333333;
}
.box1 {
  height: 108px;
}
.box1-1 {
  height: 80px;
  padding-top: 10px;
}
.box2 {
  height: 58px;
}
.box2 > div {
  display: flex;
  justify-content: space-around;
}
.box3 {
  height: 40px;
  line-height: 40px;
  text-align: left;
  text-indent: 8px;
}
.sub {
  cursor: pointer;
  vertical-align: sub;
  border: 0;
  outline: none;
  background-color: transparent;
}
>>> .el-checkbox__label {
  padding-left: 0;
}

.title {
  text-align: left;
  text-indent: 20px;
  /* padding: 14px 0 8px; */
  padding: 5px 0 5px;
  font-weight: 700;
  font-style: normal;
  color: #0099ff;
  font-size: 14px;
}
.status {
  width: 144px;
  height: 70px;
  color: #f9f9f9;
  border-radius: 5px;
  display: inline-block;
  margin-left: 10px;
  text-align: left;
  box-sizing: border-box;
  padding-left: 10px;
  padding-top: 8px;
}
.status p:first-child {
  font-size: 12px;
}
.status p:last-child {
  font-weight: 700;
  font-size: 36px;
  font-family: "Impact Bold", "Impact";
}
.status1 {
  background: linear-gradient(
    30deg,
    rgba(95, 103, 250, 1) 0%,
    rgba(95, 103, 250, 1) 0%,
    rgba(157, 97, 247, 1) 100%,
    rgba(157, 97, 247, 1) 100%
  );
}
.status2 {
  background: linear-gradient(
    30deg,
    rgba(55, 173, 247, 1) 0%,
    rgba(55, 173, 247, 1) 0%,
    rgba(127, 116, 255, 1) 100%,
    rgba(127, 116, 255, 1) 100%
  );
}
.status3 {
  background: linear-gradient(
    30deg,
    rgba(204, 153, 0, 1) 0%,
    rgba(204, 153, 0, 1) 0%,
    rgba(255, 204, 102, 1) 100%,
    rgba(255, 204, 102, 1) 100%
  );
}
.status4 {
  background: linear-gradient(
    30deg,
    rgba(255, 51, 51, 1) 0%,
    rgba(255, 51, 51, 1) 0%,
    rgba(255, 153, 102, 1) 100%,
    rgba(255, 153, 102, 1) 100%
  );
}
.routerIndex {
  position: absolute;
  left: 60px;
  top: 100px;
  width: 152px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 8px;
  box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
}
.routerIndex a {
  text-decoration: none;
  color: #999;
}
/* 其他 */
.remind {
  width: 133px;
  height: 147px;
  background-color: rgba(212, 228, 241, 1);
  border: none;
  border-radius: 5px;
  text-align: left;
  box-sizing: border-box;
  padding: 16px;
}
.remind p {
  font-size: 12px;
  color: #666666;
  line-height: 20px;
}
.remind .company {
  font-family: "Arial Negreta", "Arial";
  font-weight: 700;
  font-size: 14px;
  font-style: normal;
  color: #0099ff;
}
.txt {
  color: #0099ff;
  font-weight: 700;
  text-align: left;
  font-size: 14px;
  margin-bottom: 5px;
}
.table {
  width: 95%;
  margin: 0 auto;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 5px 10px 0;
  box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
}
.circle {
  position: absolute;
  left: 50%;
  top: -28px;
  width: 62px;
  height: 62px;
  transform: translate(-50%);
}
.aa {
  transition: all 0.3s;
  transform: translate(-50%) rotate(180deg) !important;
}
.go {
  transform: rotate(-180deg);
  transition: all 0.3s;
}
.arrows {
  width: 24px;
  height: 24px;
  position: absolute;
  left: 50%;
  top: -22px;
  transform: translate(-50%);
}

.timer {
  position: absolute;
  left: 70px;
  top: 20px;
  height: 65px;
  width: 150px;
  text-indent: 5px;
  background: inherit;
  background-color: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 8px;
  -moz-box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
  -webkit-box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
  box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
}
.timerImg {
  width: 48px;
  display: inline-block;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.time {
  display: inline-block;
  color: #0099ff;
  line-height: 24px;
  font-size: 12px;
}
/* 小区弹窗*/
>>> .district .has-gutter th {
  border-right: none;
}

>>> .top .el-table .cell,
>>> .orderList .el-table .cell,
>>> .detail-list .cell {
  padding-left: 0;
  padding-right: 0;
  line-height: normal;
  color: #999;
  font-weight: 500;
}
>>> .top .el-table td,
>>> .top .el-table th,
>>> .orderList .el-table td,
>>> .orderList .el-table th,
>>> .detail-list .el-table td,
>>> .detail-list .el-table th {
  padding: 5px 0 !important;
}
>>> .top table,
>>> .orderList table,
>>> .detail-list table {
  width: unset !important;
}
>>> .orderList .el-table__body-wrapper {
  max-height: 200px;
  overflow-y: auto;
}
.fontstyle {
  font-family: "Arial Negreta", "Arial";
  font-weight: 700;
}
.district {
  position: relative;
  width: 190px;
}
.district > div {
  padding: 5px;
}
.district > div,
.personal > div,
.detail,
.orderList {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(188, 188, 188, 0.349019607843137);
  margin-bottom: 5px;
}
.districtName,
.username {
  font-size: 14px;
  color: #0099ff;
  padding: 5px 0;
}
.districtName {
  height: 15px;
  text-align: center;
}
.top {
  width: 180px;
  height: 142px;
  margin-bottom: 5px;
}
table {
  width: 200px;
  height: 95px;
  font-size: 12px;
  text-align: center;
  border: 1px solid #ccc;
  border-collapse: collapse;
  margin: 0 auto;
}
.district table tr td:first-child + td {
  color: #0099ff;
}
.district table tr td:first-child + td + td {
  color: #cc6633;
}

.down {
  padding: 5px;
}
/* 小区工单弹窗 */
.orderList {
  width: 300px;
  position: absolute;
  left: 200px;
  top: 100px;
}
.orderListTxt {
  position: relative;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
/* 人物弹窗 */
.hint {
  font-family: "Arial Negreta", "Arial";
  font-weight: 700;
  font-size: 12px;
  color: #0099ff;
  /* text-align: left; */
  /* padding: 0 0 5px 5px; */
}
.personal {
  width: 260px;
  position: absolute;
  left: 600px;
  top: 155px;
}
.personal .top {
  text-align: left;
  padding: 10px;
}
.personal table {
  width: 100%;
  height: 120px;
}
.top-table {
  position: relative;
  text-align: left;
  padding: 10px;
}
/* .top-table table {
  width: 240px;
  height: 160px;
} */
/* 明细弹窗 */
.detail {
  position: absolute;
  left: 20px;
  top: 110px;
  width: 300px;
  height: 395px;
  padding: 0 10px 0;
}
.detail-list {
  overflow-y: auto;
  height: 350px;
  text-align: left;
}
.detail-list > div {
  margin-bottom: 10px;
}
.listStyle {
  font-size: 12px;
  color: #0099ff;
  line-height: 20px;
}
.listStyle span {
  color: #666666;
}
.detail-title {
  position: relative;
  line-height: 40px;
  color: #0099ff;
}
.list table tr:nth-of-type(1),
.flag table tr:nth-of-type(1) {
  color: #0099ff;
}
.list-top {
  position: relative;
  height: 25px;
  color: #fff;
  margin-bottom: 5px;
  background-color: #999;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.list-top span {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.msg span:first-child {
  color: #0099ff;
  font-size: 12px;
  line-height: 24px;
}
.msg span:last-child {
  font-size: 12px;
  color: #666666;
  line-height: 24px;
}
.list p {
  padding-left: 20px;
}
.disappear {
  cursor: pointer;
  position: absolute;
  right: -20px;
  top: -20px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 24px;
  border-radius: 50%;
  border: 1px solid #ededed;
  text-align: center;
  transform: rotate(45deg);
  background-color: #fff;
  color: #0099ff;
}
/* flag弹窗 */
.flag {
  background-color: #fff;
  position: absolute;
  left: 0;
  top: 200px;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(188, 188, 188, 0.349019607843137);
}
/* 人物信息弹窗tab */

>>> .el-tabs--card > .el-tabs__header,
>>> .el-tabs--card > .el-tabs__header .el-tabs__item,
>>> .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
}
>>> .el-tabs__item {
  border-radius: 3px;
  width: 117px;
  text-align: center;
  height: 30px;
  line-height: 30px;
}
>>> .el-tabs__item.is-active {
  color: #fff;
  background-color: rgba(9, 159, 244, 1);
}
>>> .el-tabs__item {
  color: #099ff4;
  background-color: rgba(9, 159, 244, 0.0980392156862745);
}
#personal {
  position: absolute;
  box-sizing: border-box;
  padding: 22px;
  right: 374px;
  top: 83px;
  background-color: #fff;
  width: 280px;
  height: 370px;
  font-size: 12px;
  color: #666666;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(188, 188, 188, 0.349019607843137);
}
#personal p {
  margin-bottom: 5px;
}
#personal table {
  table-layout: fixed;
  width: 235px;
  height: 215px;
}
</style>
