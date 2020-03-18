<template>
  <div id="citywide">
    <!-- <div class="banner" :style="bg"></div>  -->
    <div class="banner">
      <!-- <div :style="bg" ></div> -->
      <img class="map-img" src="static/citywideImg/bg1.jpg" width="1440" alt />
    </div>
    <div id="dialog">
      <div :class="data.class" v-for="data of tableData">
        <div class="remind">
          <p class="company">{{data.cityName}}</p>
          <p>实际出勤人数：{{data.attendMtnUserNum}}</p>
          <p>新建装机工单：{{data.newOpenOrderNum}}</p>
          <p>在途投诉工单：{{data.dealComplainOrderNum}}</p>
          <p>当日投诉工单：{{data.newComplainOrderNum}}</p>
          <p>待处理工单：{{data.dealOpenOrderNum}}</p>
        </div>
        <div :class="data.line">
          <img :src="data.src" alt />
        </div>
      </div>
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
    <!-- <div class="routerLink">
      <a href="/uptown.html">小区概览</a>
      <a href="/track.html">装维轨迹</a>
    </div>-->
    <!-- 刷新 -->
    <div class="refresh" @click="refresh">
      <img src="@/assets/refresh.png" alt />
    </div>
    <!-- 详细信息 -->
    <div class="bigbox">
      <div class="zhuangji module">
        <div class="txt">装机</div>
        <div class="status1 status">
          <p>当日新建装机量</p>
          <p>{{detail.newOpenOrderNum}}</p>
        </div>
        <div class="status2 status">
          <p>当日待处理装机量</p>
          <p>{{detail.dealOpenOrderNum}}</p>
        </div>
      </div>
      <div class="complain module">
        <div class="txt">投诉</div>
        <div class="status3 status">
          <p>当日新建投诉量</p>
          <p>{{detail.newComplainOrderNum}}</p>
        </div>
        <div class="status4 status">
          <p>全量在途投诉工单量</p>
          <p>{{detail.dealComplainOrderNum}}</p>
        </div>
      </div>
      <div class="chuqin module">
        <div class="txt">出勤</div>
        <div class="status5 status">
          <p>实时出勤人数</p>
          <p>{{detail.attendMtnUserNum}}</p>
        </div>
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
      <div class="txt msg">信息详情</div>
      <el-table
        :header-cell-style="{background:'#0099FF',color:'#fff',fontWeight:400}"
        v-if="showRow"
        :data="tableData"    
        stripe
        style="width: 100%"
      >
        <el-table-column prop="cityName" label="分公司"></el-table-column>
        <el-table-column prop="attendMtnUserNum" label="实际出勤人数"></el-table-column>
        <el-table-column prop="newOpenOrderNum" label="新建装机工单"></el-table-column>
        <el-table-column prop="dealComplainOrderNum" label="在途投诉工单"></el-table-column>
        <el-table-column label="当日投诉工单" prop="newComplainOrderNum"></el-table-column>
        <el-table-column label="待处理工单" prop="dealOpenOrderNum"></el-table-column>
      </el-table>
      <!-- 表头 -->
      <div class="tableHeader" v-if="showHeader">
        <el-table
          :header-cell-style="{background:'#0099FF',color:'#fff',fontWeight:400}"
          stripe
          style="width: 100%"
        >
          <el-table-column label="分公司"></el-table-column>
          <el-table-column label="实际出勤人数"></el-table-column>
          <el-table-column label="新建装机工单"></el-table-column>
          <el-table-column label="在途投诉工单"></el-table-column>
          <el-table-column label="当日投诉工单"></el-table-column>
          <el-table-column label="待处理工单"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "Citywide",
  data() {
    return {
      date: "",
      time: "",
      showRow: false,
      showHeader: true,
      rotate: false,
      tableData: [],
      initData: [
        {
          cityCode: "YQ",
          class: "dialog1",
          src: "static/citywideImg/yq.png",
          line: "yq1"
        },
        //{ cityCode: "CY", class: "dialog2",src:"/static/img/cy.png",line:"cy2" },
        { cityCode: "CY", class: "dialog2" },
        {
          cityCode: "HR",
          class: "dialog3",
          src: "static/citywideImg/hr.png",
          line: "hr3"
        },
        {
          cityCode: "MY",
          class: "dialog4",
          src: "static/citywideImg/my.png",
          line: "my4"
        },
        {
          cityCode: "PG",
          class: "dialog5",
          src: "static/citywideImg/pg.png",
          line: "pg5"
        },
        {
          cityCode: "TZ",
          class: "dialog6",
          src: "static/citywideImg/tz.png",
          line: "tz6"
        },
        {
          cityCode: "SY",
          class: "dialog7",
          src: "static/citywideImg/sy.png",
          line: "sy7"
        },
        {
          cityCode: "CE",
          class: "dialog8",
          src: "static/citywideImg/ce.png",
          line: "ce8"
        },
        {
          cityCode: "FS",
          class: "dialog9",
          src: "static/citywideImg/fs.png",
          line: "fs9"
        },
        {
          cityCode: "CS",
          class: "dialog10",
          src: "static/citywideImg/cs.png",
          line: "cs10"
        },
        {
          cityCode: "CP",
          class: "dialog11",
          src: "static/citywideImg/cp.png",
          line: "cp11"
        },
        {
          cityCode: "DX",
          class: "dialog12",
          src: "static/citywideImg/dx.png",
          line: "dx12"
        },
        { cityCode: "ALL", class: "dialog13" }
      ],
      detail: {},
      api:'http://172.30.197.151:18080/api',
      //api:'http://172.30.205.13:18081',
      //api: "http://180.168.70.186:50083",
      //api:"http://221.179.140.189:9999/simtest",
      // api:"http://221.179.140.189:9999/api",
      token: "",
      userId: "1"
    };
  },
  mounted() {
    //接受token
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

    this.$axios({
      url: `${this.api}/gis/city`,
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
        if (res.data.bean) {
          //console.log(res.data,"data")
          this.detail = res.data.bean;
          this.tableData = res.data.bean.cityDatas;

          this.initData.forEach(ele => {
            this.tableData.forEach(element => {
              if (ele.cityCode == element.cityCode) {
                element.class = ele.class;
                element.src = ele.src;
                element.line = ele.line;
              }
            });
          });
        }
      })
      .catch(err => {
        this.$notify.error({
          title: "error",
          message: err
        });
      });
    // 数字时钟
    var timerID = setInterval(this.updateTime, 1000);
    this.updateTime();
    // 定时刷新
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        window.location.reload();
        console.log("定时刷新");
      }, 300000);
    }

    /* const oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = 'https://js.arcgis.com/3.29/';
    document.body.appendChild(oScript);

      
    const aScript = document.createElement('script');
    aScript.type = 'text/javascript';
    aScript.src = '/static/js/citywide.js';

    oScript.onload = function() {
      document.body.appendChild(aScript);
    }, */
    function zeroPadding(num, digit) {
      var zero = "";
      for (var i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    }
  },
  methods: {
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    ngOnInit() {},
    data: function() {
      //console.log("data")
    },
    // 刷新
    refresh() {
      // this.reload();
      window.location.reload();
    },
    //表格
    showTable() {
      this.rotate = !this.rotate;
      if (this.showRow == false && this.showHeader == true) {
        this.showRow = true;
        this.showHeader = false;
      } else {
        this.showRow = false;
        this.showHeader = true;
      }
    },
    // 当前时间
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
    }
  }
};
</script>

<style scoped>
/deep/.table .el-table td,/deep/.table .el-table th{
  padding: 8px 0 !important;
}
>>> .el-table thead {
  color: red;
}
>>> .tableHeader .el-table {
  height: 48px !important;
}
>>> .tableHeader .el-table__empty-block {
  display: none;
}

.map-img {
  position: absolute;
  width: 1350px;
  bottom: -150px;
  left: -80px;
}

.table img {
  width: 100%;
  height: 100%;
}

#citywide {
  width: 100%;
  height: 100%;
  position: relative;
}
html,
body {
  /* height: 100%; */
  margin: 0;
  padding: 0;
  font-size: 14px;
}
.banner img {
  /* width: 100vw; */
  /* height: 100vh; */
}
.banner {
  height: 535px;
  overflow: hidden;
  position: relative;
}
#dialog {
  position: absolute;
  top: -120px;
  left: -73px;
}
.dialog1 {
  position: absolute;
  left: 493px;
  top: 120px;
}
.dialog2 {
  position: absolute;
  top: 165px;
  left: 280px;
}
.dialog3 {
  position: absolute;
  left: 816px;
  top: 120px;
}
.dialog3 .remind {
  background-color: rgba(225, 241, 254, 1);
}
.dialog4 {
  position: absolute;
  left: 950px;
  top: 140px;
}
.dialog5 {
  position: absolute;
  left: 1030px;
  top: 281px;
}
.dialog6 {
  position: absolute;
  left: 860px;
  top: 500px;
}
.dialog6 .remind {
  background-color: rgba(239, 190, 186, 1);
}
.dialog7 {
  position: absolute;
  left: 990px;
  top: 420px;
}
.dialog7 .remind {
  background-color: rgba(239, 190, 209, 1);
}
.dialog8 {
  position: absolute;
  left: 104px;
  top: 320px;
}
.dialog9 {
  position: absolute;
  left: 290px;
    top: 495px;
}
.dialog9 .remind {
  background-color: rgba(207, 205, 247, 1);
}
.dialog10 {
  position: absolute;
  left: 272px;
  top: 323px;
}
.dialog10 .remind {
  background-color: rgba(239, 213, 186, 1);
}
.dialog11 {
  position: absolute;
  left: 405px;
    top: 260px;
}
.dialog12 {
  position: absolute;
      left: 110px;
    top: 487px;
}
.dialog11 .remind {
  background-color: rgba(229, 204, 244, 1);
}
.dialog13 {
  display: none;
}
.yq1 {
  position: absolute;
  left: -20px;
  top: 45px;
}
.cy2 {
  position: absolute;
  left: -95px;
  top: -55px;
}
.hr3 {
  position: absolute;
      left: -80px;
    top: 5px;
}
.my4 {
  position: absolute;
  left: -115px;
    top: 175px;
}
.pg5 {
  position: absolute;
  left: -100px;
  top: -12px;
}
.tz6 {
  position: absolute;
  top: 10px;
  left: -83px;
}
.sy7 {
  position: absolute;
     top: -57px;
    left: -210px;
}
.ce8 {
  position: absolute;
      left: -35px;
    top: 50px;
}
.fs9 {
  position: absolute;
  top: 70px;
    left: 318px;
}
.cs10 {
  position: absolute;
  top: -24px;
  left: 88px;
}
.cp11 {
  position: absolute;
     left: 45px;
    top: 35px;
}
.dx12 {
  position: absolute;
      left: -25px;
    top: 5px;
}
.remind {
  /* width: 110px; */
  height: 130px;
  white-space: nowrap;
  background-color: rgba(212, 228, 241, 1);
  border: none;
  border-radius: 5px;
  text-align: left;
  box-sizing: border-box;
  padding: 5px;
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
  padding-top: 5px;
  margin-bottom: 5px !important;
}
>>> .el-table td,
.el-table th {
  text-align: center;
}
>>> .el-table th > .cell {
  text-align: center;
}
.table {
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 0px 10px 10px;
  box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
}
.msg {
  margin-bottom: 5px;
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
  top: -18px;
  transform: translate(-50%);
}
.routerLink {
  position: absolute;
  left: 35px;
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
.routerLink a {
  text-decoration: none;
  color: #999;
}
.timer {
  position: absolute;
  left: 25px;
  top: 20px;
  width: 152px;
  height: 65px;
  text-align: center;
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
.refresh {
  cursor: pointer;
  position: absolute;
  right: 170px;
  top: 20px;
  width: 68px;
  height: 55px;
  text-align: center;
  background: inherit;
  background-color: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 8px;
  -moz-box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
  -webkit-box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
  box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
}
.refresh img {
  width: 32px;
  height: 32px;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.bigbox {
  position: absolute;
  right: 10px;
  top: 20px;
  width: 150px;
}
.module {
  width: 150px;
  height: 185px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 8px;
  box-shadow: 5px 5px 5px rgba(188, 188, 188, 0.349019607843137);
  margin-bottom: 10px;
}
.module > div {
  margin: 0 10px 10px;
}
.chuqin {
  height: 105px;
}
.status {
  width: 130px;
  height: 70px;
  color: #f9f9f9;
  border-radius: 5px;
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
    rgba(255, 129, 130, 1) 0%,
    rgba(255, 129, 130, 1) 0%,
    rgba(255, 169, 92, 1) 100%,
    rgba(255, 169, 92, 1) 100%
  );
}
.status4 {
  background: linear-gradient(
    30deg,
    rgba(102, 204, 204, 1) 0%,
    rgba(102, 204, 204, 1) 0%,
    rgba(102, 153, 102, 1) 100%,
    rgba(102, 153, 102, 1) 100%
  );
}
.status5 {
  background: linear-gradient(
    30deg,
    rgba(109, 213, 237, 1) 0%,
    rgba(109, 213, 237, 1) 0%,
    rgba(33, 147, 176, 1) 100%,
    rgba(33, 147, 176, 1) 100%
  );
}
>>>.table .el-table__body-wrapper::-webkit-scrollbar {
  width:8px;
  }
>>>.table .el-table__body-wrapper::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.2);
        }

</style>
