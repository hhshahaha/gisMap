/**
 * 用到js函数的引用
 */
dojo.require("esri.map");
dojo.require("esri.basemaps")
dojo.require("dojo._base.event")
dojo.require("esri.layers.GraphicsLayer");
dojo.require("esri.graphic");
dojo.require("esri.geometry.Geometry");
dojo.require("esri.geometry.Point");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.Color");
dojo.require("esri.geometry.Extent");
dojo.require("esri.layers.LabelLayer");
dojo.require("esri.symbols.TextSymbol");
dojo.require("esri.symbols.SimpleMarkerSymbol");
dojo.require("esri.symbols.SimpleFillSymbol");
dojo.require("esri.geometry.Extent");
dojo.require("esri.symbols.Font");
/*******************************************************************************
 * 地图级别
 */

//地图
var map;
//小区点图层
var pointGraphicsLayer;
//装维打点图层
var drawPointGraphicsLayer;
//轨迹图层
var trajectoryGraphicsLayer;

//小区弹窗
var district;
var districtWindow = 0;
var districtBeforePoint;
var districtBeforeMapPoint;
//点击人员的弹窗
var personal;
var personalWindow = 0;
var personalBeforePoint;
var personalBeforeMapPoint;
//点击小红旗的弹窗
var flag;
var flagWindow = 0;
var flagBeforePoint;
var flagBeforeMapPoint;
//点击坐标点的弹窗
var mapLocation;
var locationWindow = 0;
var locationBeforePoint;
var locationBeforeMapPoint;
//位置轨迹的div
var locationAndTrack;
//当前点击的是人员位置还是小红旗
var tempClick;
//小区点图层点击控制事件
var pointGraphicsLayerClick;
var pointGraphicsLayerPan;
var pointGraphicsLayerPanEnd;
var pointGraphicsLayerZoom;
var pointGraphicsLayerZoomEnd;
//红旗、坐标和小人标志
var flagStatus;
var personStatus;
var locationStatus;

//加载地图
window.onload = function () {
  init();
};

function init() {
  map = new esri.Map("map", {
    basemap: {
      "baseMapLayers": [{
        "id": "china",
        "opacity": 1,
        "visibility": true,
        //"url": "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer"
        "url": "http://10.4.149.61:6080/arcgis/rest/services/bjMapService1106/MapServer"
      }],
      "title": "National Geographic"
    },//lods:lods,
    zoom: 6,
    slider: true,//隐藏比例尺控件
    logo: true,
    isScrollWheelZoom: false,
    center: [116.395645038, 39.9299857781]
  });
  loadDistrict();
  addExtentChange();
}


//当页面缩放当时候根据不同的级别控制不同的显示
function addExtentChange() {
  //地图当前的显示状态
  var nowStatus = "district";
  //地图缩放之后的显示状态
  var endStatus = "district";
  //设置地图级别范围改变事件
  //dojo.connect(map, "onExtentChange", showExtent);
  map.on("zoom-end", showExtent)

  function showExtent() {
    var zoom = map.getZoom();
    console.log(zoom);
    if (zoom <= 6) {
      endStatus = "district"
    } else if (zoom >= 7 && zoom <= 12) {
      //小区可以点击
      endStatus = "clickDistrict";
    } else if (zoom >= 13) {
      //显示打点和轨迹
      endStatus = "viewTrajectoryAndPoint";
    }
    console.log("地图事件改变前的状态为：" + nowStatus);
    console.log("地图事件改变后的状态为：" + endStatus);
    //判断地图状态是否发生变化
    if (endStatus == nowStatus) {
      //说明地图状态没有发生变化  不做任何处理
      console.log("地图级别没有发生改变");
      return;
    } else {
      console.log("地图级别发生了改变，改变后的状态为：" + endStatus);
      //将改变后的状态复制给当前状态  表示当前状态是地图级别缩放之后的状态
      nowStatus = endStatus;
      //说明地图级别发生了变化 根据变化之后的地图级别控制不同的显示
      //从其他级别跳转到小区点级别
      if (endStatus == "district") {
        //加载小区点
        loadDistrict();
      } else if (endStatus == "clickDistrict") {
        //调用小区可以点击方法
        console.log("地图图层设置为小区点可以点击");
        clickDistrict();
      } else if (endStatus == "viewDistrictName") {
        console.log("地图图层设置为小区直接显示小区名字并且可以点击")
        viewDistrictName();
      } else if (endStatus == "viewTrajectoryAndPoint") {
        console.log("地图图层设置为小区直接显示小区名字并且包含装维打点和轨迹");
        console.log("地图图层设置为轨迹可查询明细")
        viewTrajectoryAndPoint();
      }
    }
  }
}


//当页面加载的时候加载小区点(提供小区数据list)  页面加载的时候调用一下该方法 初始化小区点数据

function loadDistrict() {
  //关闭所有的弹出框
  closeAllWindow();
  //1.每次进入的时候都要清除其他的图层
  clearAllGraphic();
  //2.先加载点图层
  addPointGraphicsLayer();
  //3.获取小区数据(调用vue方法)
  var districtList = getDistrictList();
  if (districtList.length == 0) {
    return;
  }
  //4.循环将小区的点添加到点图层上
  districtList.forEach(function (district) {
    addPoint(district);
  });
  //设置地图中心点和缩放级别
  map.centerAndZoom([116.395645038, 39.9299857781], 6);
}

//小区可以点击级别
function clickDistrict() {
  //关闭所有的弹出框
  closeAllWindow();
  //1.清除所有图层
  clearAllGraphic();
  //2.加载小区点图层
  addPointGraphicsLayer();
  //3.获取小区数据(调用vue方法)
  var districtList = getDistrictList();
  if (districtList == null) {
    return;
  }
  // 4.循环将小区的点添加到点图层上
  districtList.forEach(function (district) {
    addPoint(district);
  });
  //添加小区点可以点击的方法
  addDistrictPointWindow();
  //关闭位置轨迹div
  closeLocationAndTrack();
}

//小区直接显示名字
function viewDistrictName() {
  //关闭所有的弹出框
  closeAllWindow();
  //清除小区点图层事件
  removePointGraphicsLayerEnents();
  //1.清除所有图层
  clearAllGraphic();
  //2.加载小区点图层
  addPointGraphicsLayer();
  //3.获取小区数据(调用vue方法)
  var districtList = getDistrictList();
  if (districtList == null) {
    return;
  }
  // 4.循环将小区的点添加到点图层上
  districtList.forEach(function (district) {
    addTextPoint(district);
  });
  //添加小区点可以点击的方法
  addDistrictPointWindow();
  //关闭位置轨迹div
  closeLocationAndTrack();
}

//小区信息显示名字包含装维打点轨迹
function viewTrajectoryAndPoint() {
  //关闭所有的弹出框
  closeAllWindow();
  //清除小区点图层事件
  removePointGraphicsLayerEnents();
  //1.清除所有图层
  clearAllGraphic();
  //2.加载小区点图层
  addPointGraphicsLayer();
  //3.获取小区数据
  var districtList = getDistrictList();
  if (districtList == null) {
    return;
  }
  //4.循环将数据添加到点图层上
  districtList.forEach(function (district) {
    addTextPoint(district);
  });
  //5.添加小区点点击弹窗（包括装维打点和轨迹）
  addDistrictPointWindow();
  //开启位置轨迹div
  viewLocationAndTrack();
}


//小区单击人员位置
function drawPersonLoaction(personList) {
  if (personList == null) {
    return;
  }
  //1.清除人员轨迹点图层
  if (trajectoryGraphicsLayer) {
    trajectoryGraphicsLayer.clear();
  }
  //2.添加人员轨迹点图层
  addtrajectoryGraphicsLayer();
  //3.循环添加点到图层
  personList.forEach(function (person) {
    //调用添加点方法
    addPersonPoint(person, person.userId);
  });
}

//小区点击人员轨迹
function drawPersonTrajectory(personTrajectoryList) {
  if (personTrajectoryList == null) {
    return;
  }
  //1.清除人员轨迹点图层
  if (trajectoryGraphicsLayer) {
    trajectoryGraphicsLayer.clear();
  }
  //2.加载人员轨迹点图层
  addtrajectoryGraphicsLayer();
  //判断是不是轨迹位置可查明细的级别
  var zoom = map.getZoom();
  if (zoom >= 13) {
    addPersonWindow();
  }
  //3.添加轨迹到轨迹图层
  personTrajectoryList.forEach(function (personTrajectory) {
    //调用添加轨迹方法
    drawTrajectory(personTrajectory);
  });
}

//清除所有图层方法
function clearAllGraphic() {
  //清除点图层
  if (pointGraphicsLayer) {
    pointGraphicsLayer.clear();
  }
  //清除装维轨迹点图层
  if (trajectoryGraphicsLayer) {
    trajectoryGraphicsLayer.clear();
  }
}

//加载点图层
function addPointGraphicsLayer() {
  pointGraphicsLayer = new esri.layers.GraphicsLayer();
  map.addLayer(pointGraphicsLayer);
}

//添加轨迹图层
function addtrajectoryGraphicsLayer() {
  trajectoryGraphicsLayer = new esri.layers.GraphicsLayer();
  map.addLayer(trajectoryGraphicsLayer);
}

//添加装维打点图层
function addDrawPointGraphicsLayer() {
  drawPointGraphicsLayer = new esri.layers.GraphicsLayer();
  map.addLayer(drawPointGraphicsLayer);
}

//将点添加到点图层 （页面初始化  只有三种颜色）
function addPoint(district) {
  //1.创建图形
  var graphic = new esri.Graphic();
  //2.创建点
  //3.转换点
  var x=Number(district.longtitude);
  var y=Number(district.latitude);
  var point = new esri.geometry.Point({
    "x": x,
    "y": y,
    "spatialReference": {"wkid": 4326}
  });
  //3.创建点的样式（根据点的级别获取不同的样式）
  var symbol;
  var tempColor;
  //判断点的样式三种颜色
  if (district.waitingOrderNum > 20) {
    tempColor = [204, 129, 81, 255];
  } else if (district.waitingOrderNum <= 5) {
    tempColor = [72, 150, 96, 255];
  } else if (district.waitingOrderNum > 5 && district.waitingOrderNum <= 20) {
    tempColor = [0, 126, 201, 255];
  }
  symbol = getPointSymbol(tempColor);
  //4.创建属性
  var pointAtt = {
    "districtCode": district.districtCode,
    "districtName": district.districtName,
    "latitude": district.latitude,
    "longtitude": district.longtitude,
    "orderNum": district.orderNum
  }
  //4.设置图形
  graphic.setGeometry(point);
  graphic.setSymbol(symbol);
  graphic.setAttributes(pointAtt);
  //5.将图形添加到点图层上
  pointGraphicsLayer.add(graphic);
}

//绘制一条轨迹
function drawTrajectory(trajectory) {
  if (trajectory == null) {
    return;
  }
  var tracks = trajectory.tracks;
  if (tracks == null || tracks.length == 0) {
    return
  }
  //1.首先绘制线段
  //1.拿到坐标集合
  var arr = [];
  tracks.forEach(function (track) {
    var x=Number(track.longtitude);
    var y=Number(track.latitude);
    var tempArr = [x, y];
    arr.push(tempArr)
  });
  //2.绘制线段
  addLine(arr);
  //2.根据类型绘制线段  是小红旗还是点
  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    if (i == tracks.length - 1) {
      //最后一个位置 添加小人 传递userId
      addPersonPoint(track);
    } else {
      if (track.trackType == "0") {
        //说明是小红旗
        addFlagPoint(track);
      } else if (track.trackType == "1") {
        //添加坐标点 坐标图形
        addLocationPoint(track);
      }
    }
  }
  ;

}

//添加坐标点
function addLocationPoint(track) {
  //1.创建图形
  var graphic = new esri.Graphic();
  //2.创建点
  var x=Number(track.longtitude);
  var y=Number(track.latitude);
  var point = new esri.geometry.Point({"x": x, "y": y, "spatialReference": {"wkid": 4326}});
  //3.创建点的文字样式
  var symbol = new esri.symbol.PictureMarkerSymbol("static/uptownImg/location.png", 30, 30);
  //  创建属性
  var pointAtt = {
    "trackId": track.trackId,
    "type": "location"
  }
  //4.设置图形
  graphic.setGeometry(point);
  graphic.setSymbol(symbol);
  graphic.setAttributes(pointAtt);
  //5.将图形添加到点图层上
  trajectoryGraphicsLayer.add(graphic);
}

//添加文字点
function addTextPoint(district) {
  //1.创建图形
  var graphic = new esri.Graphic();
  //2.创建点
  var x=Number(district.longtitude);
  var y=Number(district.latitude);
  var point = new esri.geometry.Point({
    "x": x,
    "y": y,
    "spatialReference": {"wkid": 4326}
  });
  //3.创建点的文字样式
  var symbol = new esri.symbol.TextSymbol(district.districtName);
  symbol.setHaloColor(new esri.Color([255, 0, 0]));
  symbol.setHaloSize(1);
  //4.创建属性
  var pointAtt = {
    "districtCode": district.districtCode,
    "districtName": district.districtName,
    "latitude": district.latitude,
    "longtitude": district.longtitude,
    "orderNum": district.orderNum
  };
  //4.设置图形
  graphic.setGeometry(point);
  graphic.setSymbol(symbol);
  graphic.setAttributes(pointAtt);
  //5.将图形添加到点图层上
  pointGraphicsLayer.add(graphic);
}

//添加小人点小区位置
function addPersonPoint(person) {
  //1.创建图形
  var graphic = new esri.Graphic();
  //2.创建点
  var x=Number(person.longtitude);
  var y=Number(person.latitude);
  var point = new esri.geometry.Point({
    "x": x,
    "y": y,
    "spatialReference": {"wkid": 4326}
  });
  //3.创建点的文字样式
  var symbol = new esri.symbol.PictureMarkerSymbol("static/uptownImg/person.png", 30, 30);
  //设置属性
  var pointAtt = {
    "userId": person.userId,
    "type": "person"
  };
  //4.设置图形
  graphic.setGeometry(point);
  graphic.setSymbol(symbol);
  graphic.setAttributes(pointAtt);
  //5.将图形添加到点图层上
  trajectoryGraphicsLayer.add(graphic);
}

//添加装维打点
function addPersonPointZw(points) {
  //1.创建图形
  var graphic = new esri.Graphic();
  //2.创建点
  var x=Number(points.longtitude);
  var y=Number(points.latitude);
  var point = new esri.geometry.Point({"x": x, "y": y, "spatialReference": {"wkid": 4326}});
  //3.创建点的文字样式
  var symbol = new esri.symbol.PictureMarkerSymbol("static/uptownImg/person.png", 30, 30);
  //4.设置图形
  graphic.setGeometry(point);
  graphic.setSymbol(symbol);
  //5.将图形添加到点图层上
  drawPointGraphicsLayer.add(graphic);
}

//添加小红旗点(轨迹)
function addFlagPoint(track) {
  //根据orderType判断是蓝色的旗子还是红色的旗子
  //1.创建图形
  var graphic = new esri.Graphic();
  //2.创建点
  var x=Number(track.longtitude);
  var y=Number(track.latitude);
  var point = new esri.geometry.Point({"x": x, "y": y, "spatialReference": {"wkid": 4326}});
  //3.创建点的文字样式
  var symbol ;
  if(track.orderType=="2"){
    symbol = new esri.symbol.PictureMarkerSymbol("static/uptownImg/flag_red.png", 30, 30);
  }else if (track.orderType=="3"||track.orderType=="7") {
    symbol = new esri.symbol.PictureMarkerSymbol("static/uptownImg/flag_blue.png", 30, 30);
  }
  //  创建属性
  var pointAtt = {
    "orderId": track.orderId,
    "type": "flag"
  };
  //4.设置图形
  graphic.setGeometry(point);
  graphic.setSymbol(symbol);
  graphic.setAttributes(pointAtt);
  //5.将图形添加到点图层上
  trajectoryGraphicsLayer.add(graphic);
}

//创建点的样式（三种颜色、小人、红旗）
function getPointSymbol(color) {
  var result;
  result = new esri.symbol.SimpleMarkerSymbol({
    "color": color,
    "size": 6,
    "angle": -30,
    "type": "esriSMS",
    "style": "esriSMSCircle",
    "outline": {
      "color": color,
      "width": 1,
      "type": "esriSLS",
      "style": "esriSLSSolid"
    }
  });
  return result;
}


//小区弹窗方法(弹出的是小区的工单信息)
function showChannelDistrict(evt) {
  var infos = evt.graphic.attributes;
  map.infoWindow.setTitle("弹窗测试");
  var content = "<p><span>渠道编码：</span><span>" + infos.name + "</span></p>" +
    "<p><span>渠道名称：<span>" + "dddddd" + "</span></p><p><span>渠道类型：</span><span>" + infos.hobby + "</span></p>" +
    "<p><span>渠道地址：</span><span>" + "infos.CADDR" + "<span></p>" +
    "<p><span>是否系统接入：</span><span>" + "infos.ISACCESSSYSTEM" + "</span></p>";
  map.infoWindow.setContent(content);
  centerPoint = map.toScreen(evt.mapPoint);
  map.infoWindow.show(centerPoint);
}

//添加小区点点击之后的弹窗
function addDistrictPointWindow() {
  //1.获取div
  district = document.getElementById("district");
  //2.设置鼠标单击方法
  pointGraphicsLayerClick = pointGraphicsLayer.on("click", leftClick);
  //3.设置地图拖动方法
  pointGraphicsLayerPan = map.on("pan", function (pan) {
    if (districtBeforePoint != null && districtWindow == 1) {
      var movePoint = pan.delta;
      showinfowindow((districtBeforePoint.x + movePoint.x), (districtBeforePoint.y + movePoint.y))
    }
  });
  //4.设置地图拖动结束方法
  pointGraphicsLayerPanEnd = map.on("pan-end", function (panend) {
    if (districtBeforePoint != null && districtWindow == 1) {
      var movedelta = panend.delta;
      districtBeforePoint.x = districtBeforePoint.x + movedelta.x;
      districtBeforePoint.y = districtBeforePoint.y + movedelta.y;
    }
  });
  //5.设置地图级别变化方法
  pointGraphicsLayerZoom = map.on("zoom", function () {
    if (districtBeforePoint != null && districtWindow == 1) {
      district.style.display = "none";
    }
  });
  //6.设置地图级别变化结束方法
  pointGraphicsLayerZoomEnd = map.on("zoom-end", function () {
    if (districtBeforePoint != null && districtWindow == 1) {
      var zoomPoint = map.toScreen(districtBeforeMapPoint);
      showinfowindow(zoomPoint.x, zoomPoint.y);
      districtBeforePoint = zoomPoint;
    }

  });

  //7.设置显示小区弹窗的方法
  function showinfowindow(x, y) {
    district.style.left = x + "px";
    district.style.top = y + "px";
    district.style.position = "absolute";
    district.style.display = "block";
  }

  //8.设置小区图层点点击的方法
  function leftClick(evt) {
    district.style.display = "none";
    var screenpoint = map.toScreen(evt.mapPoint);
    districtBeforeMapPoint = evt.mapPoint;
    districtBeforePoint = screenpoint;
    //调用vue接口 设置小区点击窗口值
    setDisTrictContext(evt.graphic.attributes.districtCode);
    showinfowindow(screenpoint.x, screenpoint.y);
    districtWindow = 1;
  }
}

//关闭小区弹窗
function closeDistrictWin() {
  district = document.getElementById("district");
  district.style.display = "none";
  districtWindow = 0;
}

//设置位置轨迹div不显示
function closeLocationAndTrack() {
  locationAndTrack = document.getElementById("locationAndTrack");
  locationAndTrack.style.display = "none";
}

//设置位置轨迹div显示
function viewLocationAndTrack() {
  locationAndTrack = document.getElementById("locationAndTrack");
  locationAndTrack.style.display = "block";
}

//清除小区点图层的事件
function removePointGraphicsLayerEnents() {
  pointGraphicsLayerClick.remove();
  pointGraphicsLayerPan.remove();
  pointGraphicsLayerPanEnd.remove();
  pointGraphicsLayerZoom.remove();
  pointGraphicsLayerZoomEnd.remove();
}



//关闭所有弹出框的方法
function closeAllWindow() {
  district = document.getElementById("district");
  personal = document.getElementById("personal");
  flag = document.getElementById("flag");
  mapLocation = document.getElementById("location");
  //关闭
  personal.style.display = "none";
  district.style.display = "none";
  flag.style.display = "none";
  mapLocation.style.display = "none";
  districtWindow = 0;
  flagWindow = 0;
  personalWindow = 0;
  locationWindow = 0;
}

//添加轨迹点图层的点击事件（点击小人，点击小红旗、坐标点）
function addPersonWindow() {
  //1.获取div
  personal = document.getElementById("personal");
  flag = document.getElementById("flag");
  mapLocation = document.getElementById("location");
  //2.设置鼠标单击方法
  trajectoryGraphicsLayer.on("click", leftClick);
  //3.设置地图拖动方法
  map.on("pan", function (pan) {
    //判断点击的是小红旗还是人员位置
    if (personStatus == "person") {
      if (personalBeforePoint != null && personalWindow == 1) {
        var movePoint = pan.delta;
        showinfowindowPerson((personalBeforePoint.x + movePoint.x), (personalBeforePoint.y + movePoint.y))
      }
    }
    if (flagStatus == "flag") {
      if (flagBeforePoint != null && flagWindow == 1) {
        var movePoint = pan.delta;
        showinfowindowFlag((flagBeforePoint.x + movePoint.x), (flagBeforePoint.y + movePoint.y))
      }
    }
    if (locationStatus == "location") {
      if (locationBeforePoint != null && locationWindow == 1) {
        var movePoint = pan.delta;
        showInfowindowLocation((locationBeforePoint.x + movePoint.x), (locationBeforePoint.y + movePoint.y))
      }
    }
  });
  //4.设置地图拖动结束方法
  map.on("pan-end", function (panend) {
    //判断点击的是小红旗还是人员位置
    if (personStatus == "person") {
      if (personalBeforePoint != null && personalWindow == 1) {
        var movedelta = panend.delta;
        personalBeforePoint.x = personalBeforePoint.x + movedelta.x;
        personalBeforePoint.y = personalBeforePoint.y + movedelta.y;
      }
    }
    if (flagStatus == "flag") {
      if (flagBeforePoint != null && flagWindow == 1) {
        var movedelta = panend.delta;
        flagBeforePoint.x = flagBeforePoint.x + movedelta.x;
        flagBeforePoint.y = flagBeforePoint.y + movedelta.y;
      }
    }
    if (locationStatus == "location") {
      if (locationBeforePoint != null && locationWindow == 1) {
        var movedelta = panend.delta;
        locationBeforePoint.x = locationBeforePoint.x + movedelta.x;
        locationBeforePoint.y = locationBeforePoint.y + movedelta.y;
      }
    }
  });
  //5.设置地图级别变化方法
  map.on("zoom", function () {
    //判断点击的是小红旗还是人员位置
    if (personStatus == "person") {
      if (personalBeforePoint != null && personalWindow == 1) {
        personal.style.display = "none";
      }
    }
    if (flagStatus == "flag") {
      if (flagBeforePoint != null && flagWindow == 1) {
        flag.style.display = "none";
      }
    }
    if (locationStatus == "location") {
      if (locationBeforePoint != null && locationWindow == 1) {
        mapLocation.style.display = "none";
      }
    }
  });
  //6.设置地图级别变化结束方法
  map.on("zoom-end", function () {
    //判断点击的是小红旗还是人员位置
    if (personStatus == "person") {
      if (personalBeforePoint != null && personalWindow == 1) {
        var zoomPoint = map.toScreen(personalBeforeMapPoint);
        showinfowindowPerson(zoomPoint.x, zoomPoint.y);
        personalBeforePoint = zoomPoint;
      }
    }
    if (flagStatus == "flag") {
      if (flagBeforePoint != null && flagWindow == 1) {
        var zoomPoint = map.toScreen(flagBeforeMapPoint);
        showinfowindowFlag(zoomPoint.x, zoomPoint.y);
        flagBeforePoint = zoomPoint;
      }
    }
    if (locationStatus == "location") {
      if (locationBeforePoint != null && locationWindow == 1) {
        var zoomPoint = map.toScreen(locationBeforeMapPoint);
        showInfowindowLocation(zoomPoint.x, zoomPoint.y);
        locationBeforePoint = zoomPoint;
      }
    }

  });

  //7.设置显示轨迹弹窗的方法
  function showinfowindowPerson(x, y) {
    personal.style.left = x + "px";
    personal.style.top = y + "px";
    personal.style.position = "absolute";
    personal.style.display = "block";
  }

  function showinfowindowFlag(x, y) {
    flag.style.left = x + "px";
    flag.style.top = y + "px";
    flag.style.position = "absolute";
    flag.style.display = "block";
  }
  function showInfowindowLocation(x, y) {
    mapLocation.style.left = x + "px";
    mapLocation.style.top = y + "px";
    mapLocation.style.position = "absolute";
    mapLocation.style.display = "block";
  }

  //8.设置轨迹图层点点击的方法
  function leftClick(evt) {
    tempClick = evt.graphic.attributes.type;
    //判断是小红旗点击还是人员位置点击还是坐标点
    if (evt.graphic.attributes.type == "location") {
      //如果是坐标点
      locationStatus = "location";
      var screenpoint = map.toScreen(evt.mapPoint);
      locationBeforeMapPoint = evt.mapPoint;
      locationBeforePoint = screenpoint;
      mapLocation.style.display = "none";
      //调用vue接口 设置人员点击窗口值
      setLocationContext(evt.graphic.attributes.trackId);
      showInfowindowLocation(screenpoint.x, screenpoint.y);
      locationWindow = 1;
    }else if (tempClick == "person") {
      personStatus = "person";
      var screenpoint = map.toScreen(evt.mapPoint);
      personalBeforeMapPoint = evt.mapPoint;
      personalBeforePoint = screenpoint;
      personal.style.display = "none";
      //调用vue接口 设置人员点击窗口值
      setPersonalContext(evt.graphic.attributes.userId);
      showinfowindowPerson(screenpoint.x, screenpoint.y);
      personalWindow = 1;
    } else if (tempClick == "flag") {
      flagStatus = "flag";
      var screenpoint = map.toScreen(evt.mapPoint);
      flagBeforeMapPoint = evt.mapPoint;
      flagBeforePoint = screenpoint;
      flag.style.display = "none";
      //调用vue接口 设置人员点击窗口值
      setFlagContext(evt.graphic.attributes.orderId);
      showinfowindowFlag(screenpoint.x, screenpoint.y);
      flagWindow = 1;
    }
  }
}

//关闭小红旗弹窗
function closeFlagWin() {
  flag = document.getElementById("flag");
  flag.style.display = "none";
  flagWindow = 0;
}

//关闭人物弹窗
function closePersonalWin() {
  personal = document.getElementById("personal");
  personal.style.display = "none";
  personalWindow = 0;
}

//关闭坐标弹窗
function closeLocationWin() {
  mapLocation = document.getElementById("location");
  mapLocation.style.display = "none";
  locationWindow = 0;
}

//往线图层中添加线段
function addLine(arr) {
  //创建图形
  var graphic = new esri.Graphic();
  //创建线段
  //var polyline = new esri.geometry.Polyline([[116.395645038, 39.9299857781],[116.398645038, 39.9299857781],[116.393645038, 39.9299857781]]);
  var polyline = new esri.geometry.Polyline(arr);
  //创建格式 线段类型  颜色  宽度
  var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2);
  //设置图形
  graphic.setSymbol(symbol);
  graphic.setGeometry(polyline);
  //将图形添加到轨迹图层上
  trajectoryGraphicsLayer.add(graphic);
}

//装维打点
function drawPoint(pointList) {
  if (pointList == null) {
    return;
  }
  //添加装维打点图层
  addDrawPointGraphicsLayer();
  //循环绘制点
  pointList.forEach(function (point) {
    addPersonPointZw(point);
  });
}

//取消装维打点图层
function clearDrawPoint() {
  if (drawPointGraphicsLayer) {
    drawPointGraphicsLayer.clear();
  }
}

//设置小区中心点
function setDistrictCenter(longtitude,latitude) {
  //获取地图的当前缩放级别
  var zoom = map.getZoom();
  console.log("小区+++++++")
  console.log(longtitude+"-"+latitude)
  console.log(zoom)
  map.centerAndZoom([longtitude,latitude], zoom);
}




