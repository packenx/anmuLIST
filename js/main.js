"use strict";

var coar = new Array();
var setint = 0;
var runint = 0;
var tout = null;
var rut = 0;

chrome.tabs.query({ active: true }, function(tabList) {
    startInit(tabList[0].url);
});

function startInit(tagurl) {
    var REGurl = document.createElement('a');
    REGurl.href = tagurl;
    //console.log(REGurl.hostname);
    if( "m.iqiyi.com" != REGurl.hostname && "www.iqiyi.com" != REGurl.hostname ) {
        var intx = document.createElement("input");
        intx.type = "text";
        intx.id = "putare";
        var inbt = document.createElement("input");
        inbt.id = "btare";
        inbt.type = "button";
        inbt.value = "确定";
        document.getElementById("txtare").appendChild(intx);
        document.getElementById("txtare").appendChild(inbt);
        document.getElementById("btare").onclick = function(event) { readyDo(document.getElementById("putare").value); };
    }
    else {
        readyDo(tagurl);
    }
}

function readyDo(furl) {
  document.getElementById("txtare").innerHTML="分析中";
  window.onerror = function(errorMessage, scriptURI, lineNumber) {
    document.getElementById("txtare").innerHTML="出错了";
    return;
  }
  var cuturl = document.createElement('a');
  cuturl.href = furl;
  cuturl.hostname = "m.iqiyi.com";
  retBody(cuturl.href,true);
}

function doMobText(e) {
  var textbdo = this.responseText;
  try {var tvid = textbdo.match(/playInfo\.tvid = ".*"/)[0].match(/[0-9]{1,}/)[0];}
  catch(en) {var tvid = textbdo.match(/tvId:.*,/)[0].match(/[0-9]{1,}/)[0];}
  try {var timel = textbdo.match(/playInfo\.duration = ".*"/)[0].match(/[0-9]{1,}/)[0];}
  catch(en) {var timel = "2900";}
  //alert(tvid+"*"+timel+"*");
  var mUrl = "http://cmts.iqiyi.com/bullet/";
  var tUrl = mUrl+tvid.slice(-4,-2)+"/"+tvid.slice(-2)+"/"+tvid+"_300_";
  var ti = parseInt(timel);
  //alert(typeof(ti)+"*"+ti+"*");
  var i = 0;
  for(;ti>-1;ti=ti-300) {
    i = i+1;
    retBody(tUrl+i+".z",false);
  }
  setint = i;
  tout = setInterval(checkint,1000);
}
function doNext(event) {
  var ziped = new Uint8Array(this.response);
  var body = WebModule.ZLib.inflate(ziped);
  var the = u8ab2str(body);
  var carr = fortag(the);
  if(carr.length) {
    coar[carr[0][0]] = carr;
  }
  runint = runint + 1;
}
function checkint() {
  if(runint == setint) {
    clearInterval(tout);
    showtag();
  }
  else {
    var vtx = ["处理中","处理中.","处理中..","处理中..."];
    var s = rut;
    rut = rut + 1;
    if(rut==4) rut = 0;
    document.getElementById("txtare").innerHTML=vtx[s];
  }
}
function showtag() {
  if(coar.length==0) {
    document.getElementById("txtare").innerHTML="没有弹幕";
    return;
  }
  //alert(coar.length);
  var sotarr = new Array();
  for(var ky in coar) {
    //alert(ky);
    sotarr.push(ky);
  }
  sotarr.sort(function(a,b) {
    var c = parseInt(a);
    var d = parseInt(b);
    return c-d;
  });
  
  var tbls = document.createElement("table");
  var trth = document.createElement("tr");
  var thtm = document.createElement("th");
  thtm.appendChild(document.createTextNode("时间"));
  trth.appendChild(thtm);
  var thid = document.createElement("th");
  thid.appendChild(document.createTextNode("用户名"));
  trth.appendChild(thid);
  var thco = document.createElement("th");
  thco.appendChild(document.createTextNode("内容"));
  trth.appendChild(thco);
  tbls.appendChild(trth);
  for(var n=0;n<sotarr.length;n++) {
    var ty = sotarr[n];
    //alert(ty);
    for(var i=0;i<coar[ty].length;i++) {
      var mst = parseInt(coar[ty][i][0]);
      var mtw = Math.floor(mst/60);
      var stw = mst%60;
      var trtd = document.createElement("tr");
      var tdtm = document.createElement("td");
      tdtm.appendChild(document.createTextNode(mtw+":"+stw));
      trtd.appendChild(tdtm);
      var tdid = document.createElement("td");
      tdid.appendChild(document.createTextNode(coar[ty][i][1]));
      trtd.appendChild(tdid);
      var tdco = document.createElement("td");
      tdco.appendChild(document.createTextNode(coar[ty][i][2]));
      trtd.appendChild(tdco);
      tbls.appendChild(trtd);
    }
  }
  document.getElementById("txtare").innerHTML="";
  document.getElementById("txtare").appendChild(tbls);
}
function fortag(the) {
  var contarr = new Array();
  var gstime = "";
  var gsname = "";
  var gscont = "";
  var xdoc = new DOMParser().parseFromString(the,"text/xml");
  //var tags = xdoc.getElementsByTagName("entry");
  //for(var i=0;i<tags.length;i++) {
    //var gs = tags[i].getElementsByTagName("bulletInfo");
    var gs = xdoc.getElementsByTagName("bulletInfo");
    for(var t=0;t<gs.length;t++) {
      try {gstime = gs[t].getElementsByTagName("showTime")[0].childNodes[0].nodeValue;} catch(e) {gstime = "0";}
      try {gsname = gs[t].getElementsByTagName("name")[0].childNodes[0].nodeValue;} catch(e) {gsname = "UnDef";}
      try {gscont = gs[t].getElementsByTagName("content")[0].childNodes[0].nodeValue;} catch(e) {gscont = "UnDef";}
      contarr.push([gstime,gsname,gscont]);
    }
  //}
  //alert(contarr.length);
  return contarr;
}
function retBody(furl,txt) {
  //alert(typeof(furl)+"*"+furl+"*");
  var xhr = new XMLHttpRequest();
  if(txt) {
    xhr.onload = doMobText;
  }
  else {
    xhr.responseType = "arraybuffer";
    xhr.onload = doNext;
  }
  xhr.open("get",furl,true);
  if(txt) { xhr.setRequestHeader("x-ua-mark", "mark"); }
  xhr.send();
}
function u8ab2str(auf) {
  var i = 0;
  var retstr = "";
  var tmpstr = "";
  if(auf[0].toString(16)=="ef"&&auf[1].toString(16)=="bb"&&auf[2].toString(16)=="bf") i=3;
  for(;i<auf.length;i++) {
    tmpstr=auf[i].toString(16);
    if (tmpstr.length < 2) tmpstr="0"+tmpstr;
    retstr = retstr+"%"+tmpstr;
  }
  return decodeURIComponent(retstr);
}