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


/**
 * 功能分析
 * 1。默认展示某一个分公司的所有的装维师傅的轨迹，该轨迹不可点击，没有详细点。
 * 2。放大展示详细的轨迹 轨迹可点击可查看明细
 * 3。小红旗点击框
 * 4。人员位置点击框
 */
//地图
//加载地图
dojo.addOnLoad(init);
var map;
//默认图层
var loadGraphicsLayer;
//点击图层
var clickGraphicsLayer;
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
//当前点击的是人员位置还是小红旗
var tempClick;
//红旗和小人标志
var flagStatus;
var personStatus;
var locationStatus;
//是否点击了查询
var status = "false";

//加载地图
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
    zoom: 9,
    slider: true,//隐藏比例尺控件
    logo: true,
    isScrollWheelZoom: false,
    center: [116.395645038, 39.9299857781]
  });
  addExtentChange();
}

function selectTrack(longtitude, latitude) {
  //点击查询的时候 切换地图的范围和级别
  console.log("轨迹--------")
  var zoom = map.getZoom();
  console.log(longtitude+"-"+latitude);
  console.log(zoom);
  map.centerAndZoom([longtitude, latitude], 9);
  //加载轨迹数据
  load();
  //设置状态为true
  status = true;
}

//当页面缩放当时候根据不同的级别控制不同的显示
function addExtentChange() {
  //地图当前的显示状态
  var nowStatus = "load";
  //地图缩放之后的显示状态
  var endStatus = "load";
  //设置地图级别范围改变事件
  map.on("zoom-end", showExtent)

  function showExtent() {
    var zoom = map.getZoom();
    console.log(zoom);
    if (zoom <= 12) {
      endStatus = "load"
    } else if (zoom > 12) {
      endStatus = "click";
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
      if (endStatus == "load" && status == "true") {
        //加载默认图层
        load();
      } else if (endStatus == "click" && status == "true") {
        //加载click图层
        click();
      }
    }
  }
}

//load方法
function load() {
  //清除所有弹窗
  closeAllWindow();
  //1.先清除所有的图层
  clearAllGraphic();
  //2.加载load图层
  loadGrahpicsLayer();
  //3.获取默认图层的数据（调用vue方法）
  var trackList = getTarckList();
  if (trackList.length == 0) {
    return;
  }
  //4.获取是否选择了班组
  var groupStatus = selectGroup();
  //循环添加默认图层的轨迹
  trackList.forEach(function (track) {
    //调用绘制轨迹的方法
    drawLoadTrack(track,groupStatus);
  });
}

//click方法
function click() {
  //1.清除所有的图层
  clearAllGraphic();
  //2.加载点击图层呢
  clickGrahpicsLayer();
  //3获取点击图层的数据(调用vue的方法)
  var trackList = getTarckList();
  if (trackList.length == 0) {
    return;
  }
  //4.获取是否选择了班组
  var groupStatus = selectGroup();
  //循环添加绘制轨迹的方法
  trackList.forEach(function (track) {
    //调用绘制点击图层的轨迹的方法
    drawClickTrack(track,groupStatus);
  });
  //添加点击方法
  addPersonWindow();
}

//加载默认图层
function loadGrahpicsLayer() {
  loadGraphicsLayer = new esri.layers.GraphicsLayer();
  map.addLayer(loadGraphicsLayer);
}

//加载点击图层
function clickGrahpicsLayer() {
  clickGraphicsLayer = new esri.layers.GraphicsLayer();
  map.addLayer(clickGraphicsLayer);
}

//清除所有图层方法
function clearAllGraphic() {
  //清除点图层
  if (loadGraphicsLayer) {
    loadGraphicsLayer.clear();
  }
  //清除装维轨迹点图层
  if (clickGraphicsLayer) {
    clickGraphicsLayer.clear();
  }
}

//绘制默认图层的轨迹
function drawLoadTrack(trajectory,groupStatus) {
  var tracks = trajectory.tracks;
  if (tracks == null || tracks.length == 0) {
    return
  }
  //1.添加线段取出坐标
  var arr = [];
  tracks.forEach(function (track) {
    var x=Number(track.longtitude);
    var y=Number(track.latitude);
    var tempArr = [x, y];
    arr.push(tempArr)
  });
  //添加线段
  addLoadLine(arr,groupStatus);
  //添加轨迹的最后一个点 样式是小人
  addLoacPoint(tracks[tracks.length - 1]);
}

//添加默认图层的线段（曲线）
function addLoadLine(arr,groupStatus) {
  var color;
  if(groupStatus){
    color = getColor();
  }else {
    color = [255, 0, 0];
  }
  //创建图形
  var graphic = new esri.Graphic();
  //创建线段
  //var polyline = new esri.geometry.Polyline([[116.395645038, 39.9299857781],[116.398645038, 39.9299857781],[116.393645038, 39.9299857781]]);
  var polyline = new esri.geometry.Polyline(arr);
  //创建格式 线段类型（虚线）  颜色  宽度
  var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color(color), 2);
  //设置图形
  graphic.setSymbol(symbol);
  graphic.setGeometry(polyline);
  //将图形添加到轨迹图层上
  loadGraphicsLayer.add(graphic);
}

//添加默认图岑的点（小人）
function addLoacPoint(person) {
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
  //4.设置图形
  graphic.setGeometry(point);
  graphic.setSymbol(symbol);
  //5.将图形添加到点图层上
  loadGraphicsLayer.add(graphic);
}

//绘制点击图岑的轨迹
function drawClickTrack(trajectory,groupStatus) {
  var tracks = trajectory.tracks;
  if (tracks == null || tracks.length == 0) {
    return
  }
  //1.添加线段取出坐标
  var arr = [];
  tracks.forEach(function (track) {
    var x=Number(track.longtitude);
    var y=Number(track.latitude);
    var tempArr = [x, y];
    arr.push(tempArr)
  });
  //添加线段
  addClickLine(arr,groupStatus);
  //2.根据类型绘制点  是小红旗还是点
  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    if (i == tracks.length - 1) {
      //最后一个位置 添加小人
      addPersonPoint(track);
    } else {
      if (track.trackType == "0") {
        //添加坐标点 坐标图形
        addFlagPoint(track);
      } else if (track.trackType == "1") {
        //说明是小红旗
        addLocationPoint(track);
      }
    }
  }
  ;
}

function addClickLine(arr,groupStatus) {
  var color;
  if(groupStatus){
    color = getColor();
  }else {
    color = [255, 0, 0];
  }
  //创建图形
  var graphic = new esri.Graphic();
  //创建线段
  //var polyline = new esri.geometry.Polyline([[116.395645038, 39.9299857781],[116.398645038, 39.9299857781],[116.393645038, 39.9299857781]]);
  var polyline = new esri.geometry.Polyline(arr);
  //创建格式 线段类型（虚线）  颜色  宽度
  var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(color), 2);
  //设置图形
  graphic.setSymbol(symbol);
  graphic.setGeometry(polyline);
  //将图形添加到轨迹图层上
  clickGraphicsLayer.add(graphic);
}

//添加小红旗点(轨迹)
function addFlagPoint(track) {
  //1.创建图形
  var graphic = new esri.Graphic();
  //2.创建点
  var x=Number(track.longtitude);
  var y=Number(track.latitude);
  var point = new esri.geometry.Point({"x": x, "y": y, "spatialReference": {"wkid": 4326}});
  //3.创建点的文字样式
  var symbol;
  if (track.orderType == "2") {
    symbol = new esri.symbol.PictureMarkerSymbol("static/uptownImg/flag_red.png", 30, 30);
  } else if (track.orderType == "3" || track.orderType == "7") {
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
  clickGraphicsLayer.add(graphic);
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
  clickGraphicsLayer.add(graphic);
}

//添加小人点小区位置
function addPersonPoint(person) {
  console.log(person, "person")
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
  clickGraphicsLayer.add(graphic);
}

//添加轨迹点图层的点击事件（点击小人，点击小红旗）
function addPersonWindow() {
  //1.获取div
  personal = document.getElementById("personal");
  flag = document.getElementById("flag");
  mapLocation = document.getElementById("location");
  //2.设置鼠标单击方法
  clickGraphicsLayer.on("click", leftClick);
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
    if (evt.graphic.attributes.type == "location") {
      locationStatus = "location";
      var screenpoint = map.toScreen(evt.mapPoint);
      locationBeforeMapPoint = evt.mapPoint;
      locationBeforePoint = screenpoint;
      mapLocation.style.display = "none";
      //调用vue接口 设置人员点击窗口值
      setLocationContext(evt.graphic.attributes.trackId);
      showInfowindowLocation(screenpoint.x, screenpoint.y);
      locationWindow = 1;
    } else if (tempClick == "person") {
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

//关闭坐标点弹窗
function closeLocationWin() {
  mapLocation = document.getElementById("location");
  mapLocation.style.display = "none";
  locationWindow = 0;
}

//关闭所有弹出框的方法
function closeAllWindow() {
  personal = document.getElementById("personal");
  flag = document.getElementById("flag");
  mapLocation = document.getElementById("location");
  //关闭
  personal.style.display = "none";
  flag.style.display = "none";
  mapLocation.style.display = "none";
  flagWindow = 0;
  personalWindow = 0;
  locationWindow = 0;
}

//随机生成rbg颜色
function getColor() {
  var a = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  var c = Math.floor(Math.random() * 255);
  var color = [a,b,c];
  return color;
}
