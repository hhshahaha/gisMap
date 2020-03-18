<template>
  <div id="updown">
    <div id="map"></div>
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

        <el-form-item label="代维班组" prop="uptown">
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
            @change="getUptown($event)"
          >
            <el-option
              v-for="uptown in uptownOptions"
              :key="uptown.itemKey"
              :label="uptown.itemValue"
              :value="uptown.itemKey"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="代维姓名" prop="user">
          <el-select
            v-model="formInline.user"
            class="inputbox"
            multiple
            filterable
            remote
            :remote-method="userFilter"
            reserve-keyword
            placeholder="全部"
            @focus="userFilter"
          >
            <el-option
              v-for="user in userOptions"
              :key="user.itemKey"
              :label="user.itemValue"
              :value="user.itemKey"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="代维账号" prop="inputAccount">
          <el-input v-model="formInline.inputAccount" placeholder="请输入内容"></el-input>
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
    <!-- 提示图片 -->
    <div class="hint remindImg">
      <div style="font-size:14px">位置图例</div>
      <div>
        <span class="styleImg">
          <img src="static/uptownImg/icon1.png" alt />
        </span>
        <span class="styleSpan">采集经纬度</span>
      </div>
      <div>
        <span class="styleImg">
          <img src="static/uptownImg/icon2.png" alt />
        </span>
        <span class="styleSpan">签到经纬度</span>
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
      <div v-if="showRow">
        <el-table
          class="xlsxTable"
          :header-cell-style="{background:'#0099FF',color:'#fff',fontWeight:400}"
          v-if="showRow"
          :data="tableData"
          height="200"
          stripe
          style="width: 100%"
        >
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="mtnUserName" label="姓名"></el-table-column>
          <el-table-column prop="dealTotalOrderNum" label="待处理工单总数"></el-table-column>
          <el-table-column prop="finishTotalOrderNum" label="已完成工单总数"></el-table-column>
          <el-table-column prop="dealNewOpenOrderNum" label="装机待处理"></el-table-column>
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
          <el-table-column prop="mtnUserName" label="姓名"></el-table-column>
          <el-table-column prop="dealTotalOrderNum" label="待处理工单总数"></el-table-column>
          <el-table-column prop="finishTotalOrderNum" label="已完成工单总数"></el-table-column>
          <el-table-column prop="dealNewOpenOrderNum" label="装机待处理"></el-table-column>
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
      userName: "",
      total: 100,
      currentPage: 1,
      disableButton: true,
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
        user: [],
        inputAccount: ""
      },
      cityCode: [], //分公司当前选中
      uptownOptions: [], //代维班组下拉
      queryGroup: "", //代维班组输入
      groupIds: [], //代维班组当前选中
      userOptions: [], //代维姓名下拉
      queryName: "", //代维姓名输入
      inputAccount: "", //账号输入
      status: [
        { value: "", label: "全部" },
        { value: "0", label: "待处理" },
        { value: "1", label: "已完成" }
      ],
      type: [
        { value: "", label: "全部" },
        { label: "装机", value: "装机" },
        { label: "移机新装", value: "移机新装" },
        { label: "投诉", value: "投诉" }
      ],
      urge: [
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
      intro: "", //明细简介title
      orderList: [], //明细简介list
      introData: [], //明细简介表格
      showOrderList: false, //工单列表显隐
      districtList: [],
      companyList: [],

      getList: [],
      setCode: "", //地图打点时传过来的小区编码
      orderData: [],
      flag: {},
      seat: {},
      cellDetailList: [], //打点后显示弹窗数据
      districtName: "", //小区面板title
      personal: {}, //点击人物信息
      personalId: "", //点击人物后获取的用户id
      groupId: "", //点击人物后获取的班组id
      workOrderList: [], //工单明细
      detailTitle: "", //工单面板title
      sum: 0,
      load: 0,
      api: "http://172.30.197.151:18080/api",
      //api: "http://172.30.205.13:18081",
      //api: "http://180.168.70.186:50083",
      //api:"http://221.179.140.189:9999/simtest",
      userId: "1",
      token: ""
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
        // console.log(this.token, "url参数");
      } else {
        this.token =
          "eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJwcm92aW5jZUNvZGUiOiJCSiIsInVzZXJUeXBlIjoxLCJ1c2VyUm9sZSI6OTAsImV4cCI6MTY0NjU0NzQ1Miwib3BlcmF0b3JJZCI6MSwib3BlcmF0b3JOYW1lIjoiYWRtaW4ifQ.RebKvNmDf2bbdbKx3-tzbnBVILTTE4r0RocFkMAiW4A";
      }

      this.cellGrid(); //表格数据
      //map
      window.getTarckList = this.getTarckList;
      window.setDisTrictContext = this.setDisTrictContext;
      window.setPersonalContext = this.setPersonalContext;
      window.setFlagContext = this.setFlagContext;
      window.setLocationContext = this.setLocationContext; //水滴弹窗
      window.selectGroup = this.selectGroup; //是否选择班组

      //分公司数据
      this.querySearchCompany();
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
    //关闭人物弹窗
    disappearPersonal() {
      closePersonalWin();
    },
    //关闭水滴弹窗
    disappearLocation() {
      closeLocationWin();
    },
    //关闭小旗弹窗
    disappearFlag() {
      closeFlagWin();
    },
    //表格数据
    cellGrid() {
      var arr = [];
      if (this.formInline.company) {
        arr.push(this.formInline.company);
      }
      this.$axios({
        url: `${this.api}/gis/mtn/grid`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            cityCodes: arr,
            districtCodes: [],
            userId: this.userId,
            dealOrFinishs: [],
            orderTypeCns: [],
            isUrgents: [],
            mtnGroupIds: this.formInline.uptown,
            mtnUserIds: this.formInline.user,
            mtnLoginAccount: this.formInline.inputAccount,
            limit: 10,
            page: this.currentPage
          }
        }
      })
        .then(res => {
          //console.log(res.data.bean, "表格总数据");
          this.tableData = res.data.beans;
          this.total = res.data.bean.total;
        })
        .catch(err => {
          this.$notify.error({
            title: "错误",
            message: err
          });
        });
    },
    //表格数据点击
    /* gridClick(row, column, cell, event) {
      console.log(row,"row")
      console.log(row.latitude, row.longtitude, "表格数据");
      if (row.latitude || row.longtitude) {
        selectTrack(row.longtitude, row.latitude);
      }
    }, */
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
          this.$Notice.error({
            title: "错误",
            desc: "网络连接错误"
          });
        });
    },
    // 导出表格数据
    exportExcel() {
      var arr = [];
      if (this.formInline.company) {
        arr.push(this.formInline.company);
      }
      let myObj = {
        method: "post",
        url: `${this.api}/gis/mtn/export`,
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
            isUrgents: this.formInline.urge
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
            drawPoint(pointList);
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
      console.log(trackId, "trackId");
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
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //点击小旗
    setFlagContext(orderId) {
      //console.log(orderId, "orderId");
      if (orderId == "") {
        return;
      }
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
          if (Object.keys(res.data.bean).length == 0) {
            this.$notify({
              title: " warning ",
              message: "查询数据为空",
              type: "warning"
            });
          } else {
            this.flag = res.data.bean;
          }
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
          if (res.data.bean.hasOwnProperty("mtnGroupId")) {
            this.groupId = res.data.bean.mtnGroupId; //班组id
          } else {
            console.log(res.data.bean, "not mtnGroupId");
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
    //点击人物弹窗信息
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
        params.id = this.groupId;
      }
      if (params.warnType == "0") {
        delete params.warnType;
      }
      if (params.urgentType == "0") {
        delete params.urgentType;
      }

      console.log(params, "传参");

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
          if (res.data.bean.orderDatas.length == 0) {
            this.$notify({
              title: " warning ",
              message: "当前数据为空",
              type: "warning"
            });
          } else {
            this.workOrderList = res.data.bean.orderDatas;
            this.detailShow = true;
          }
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
    dealOrFinish(x, y) {
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
      // console.log(x, y, "xy");
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
          if (res.data.beans.length == 0) {
            this.$notify({
              title: " warning ",
              message: "查询数据为空",
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
    selectGroup() {
      console.log(this.formInline.uptown, "班组");
      if (this.formInline.uptown.length != 0) {
        return true;
      }
    },
    //提交查询
    onSubmit() {
      var arr = [];
      if (this.formInline.company) {
        arr.push(this.formInline.company);
      }
      this.selectGroup();
      this.$axios({
        url: `${this.api}/gis/mtn/location/detail`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            cityCodes: arr,
            mtnGroupIds: this.formInline.uptown,
            userId: this.userId,
            mtnUserIds: this.formInline.user,
            mtnLoginAccount: this.formInline.inputAccount
          }
        }
      })
        .then(res => {
          console.log(res.data.beans, "表单查询结果");
          this.sum++;
          this.cellGrid();
          this.getList = res.data.beans;
          if (this.sum != 0) {
            console.log("not the first load")
            if (res.data.beans.length!=0) {
              console.log(res.data.beans[0].longtitude,res.data.beans[0].latitude,"send firstData")
              let longtitude=Number(res.data.beans[0].longtitude);
              let latitude=Number(res.data.beans[0].latitude);
              selectTrack(longtitude, latitude);
            } else {
              this.$notify({
                title: " warning ",
                message: "查询数据为空",
                type: "warning"
              });
            }
          }
        })
        .catch(err => {
          console.log(err, "err");
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //页面初次加载地图显示
    getTarckList() {
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
          this.companyList = res.data.beans;
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //获取选中当前分公司
    selectChange(code) {
      this.cityCode = code;
      // str[i] = obj[i].text
      console.log(this.cityCode, "当前code");
    },
    //获取当前选中班组
    getUptown(groupIds) {
      this.groupIds = groupIds;
      console.log(groupIds, "groups");
    },
    statusChange(status) {
      console.log(status, "status");
    },
    urgeChange(urge) {
      console.log(urge, "yrge");
    },
    typeChange(type) {
      console.log(type, "");
    },
    //代维班组下拉列表
    dataFilter(val) {
      if (typeof val == "string") {
        var groupName = val;
      }
      this.queryGroup = val;
      console.log(val, "val");
      var districtList = this.districtList;
      var cityCode = this.cityCode;
      this.$axios({
        url: `${this.api}/gis/select/group`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            cityCode: cityCode,
            groupName: groupName
          }
        }
      })
        .then(res => {
          this.uptownOptions = res.data.beans;
          let options = res.data.beans;
          for (let i of res.data.beans) {
            i.itemValue = i.itemValue;
            i.itemKey = i.itemKey;
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "error",
            message: err
          });
        });
    },
    //代维姓名下拉列表
    userFilter(val) {
      //console.log(typeof(val), "type");
      if (typeof val == "string") {
        this.userName = val;
      }
      this.queryName = val;
      console.log(val, "姓名");
      var districtList = this.districtList;
      var cityCode = this.cityCode;
      this.$axios({
        url: `${this.api}/gis/select/user`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": this.token
        },
        data: {
          params: {
            groupIds: this.groupIds,
            userName: this.userName
          }
        }
      })
        .then(res => {
          this.userOptions = res.data.beans;
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
>>> .el-table thead {
  color: red;
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
#updown {
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
>>> .el-form {
  height: 52px;
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
  width: 2px;
  height: 2px;
}
>>> .inputbox .el-select__tags::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
>>> .el-form-item {
  margin: 5px 10px 5px 0;
}
>>> .el-button {
  padding: 10px 20px;
}
.searchForm {
  position: absolute;
  left: 222px;
  top: 20px;
  height: 52px;
  padding-left: 10px;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
  background-color: #fff;
}
.title {
  text-align: left;
  text-indent: 32px;
  padding: 14px 0;
  font-weight: 700;
  font-style: normal;
  color: #0099ff;
  font-size: 14px;
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
  padding: 10px;
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
.remindImg {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 135px;
  padding: 10px !important;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 8px;
  box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
}
.remindImg > div {
  margin: 10px 0;
}
.styleImg {
  display: inline-block;
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
.styleImg img {
  width: 100%;
}
.styleSpan {
  font-weight: normal;
  margin-left: 5px;
}
.timer {
  position: absolute;
  text-indent: 5px;
  left: 60px;
  top: 20px;
  width: 152px;
  height: 65px;
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
  font-size: 14px;
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
  height: 200px;
  overflow-y: auto;
}
.fontstyle {
  font-family: "Arial Negreta", "Arial";
  font-weight: 700;
}
.district {
  position: relative;
  width: 180px;
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
}
/* 人物弹窗 */
.hint {
  font-family: "Arial Negreta", "Arial";
  font-weight: 700;
  font-size: 12px;
  color: #0099ff;
  padding: 0 0 5px 5px;
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
  height: 360px;
  padding: 0 10px 0;
}
.detail-list {
  overflow-y: auto;
  height: 310px;
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
