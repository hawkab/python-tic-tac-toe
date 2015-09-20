var cur = "";
if (GetCookie('lang')=='en-US')
{var cur = eng;SwitchLanguage('ru');}
else
{var cur = rus;SwitchLanguage('uk');}

LocalizeAuth();
if (GetCookie('player') > 0 || GetCookie('nick') != undefined)
{
	HideObj('invitation');
	ShowObj('busy');
	HideObj('game');
	HideObj('a');
	document.getElementById('overlay2').classList.add('open');
	document.getElementById('overlay').style.opacity=0;
	document.getElementById('overlay').classList.remove('open');	
	document.getElementById('invitation').innerHTML='open';
	var p = document.getElementById('players'), b = document.getElementById('busy');

	var newPos = p.offsetTop + p.offsetHeight + 20;
	b.style.top = newPos + 'px';

	GetPlayers();
	var timerId = setInterval(function() {
	  GetPlayers();
	}, 2000);
}
function CalculateWinLinePos(){

var s1 = document.getElementById("square1").innerHTML,
 s2 = document.getElementById("square2").innerHTML,
 s3 = document.getElementById("square3").innerHTML,
 s4 = document.getElementById("square4").innerHTML,
 s5 = document.getElementById("square5").innerHTML,
 s6 = document.getElementById("square6").innerHTML,
 s7 = document.getElementById("square7").innerHTML,
 s8 = document.getElementById("square8").innerHTML,
 s9 = document.getElementById("square9").innerHTML;
if ((s1=='X' && s2=='X' && s3=='X') || (!s1=='O' && !s2=='O' && !s3=='O'))
	PaintWinLine('horiz1');
if ((s4=='X' && s5=='X' && s6=='X') || (!s4=='O' && !s5=='O' && !s6=='O'))
	PaintWinLine('horiz2');
if ((s7=='X' && s8=='X' && s9=='X') || (!s7=='O' && !s8=='O' && !s9=='O'))
	PaintWinLine('horiz3');
if ((s1=='X' && s4=='X' && s7=='X') || (!s1=='O' && !s4=='O' && !s7=='O'))
	PaintWinLine('vert1');
if ((s2=='X' && s5=='X' && s8=='X') || (!s2=='O' && !s5=='O' && !s8=='O'))
	PaintWinLine('vert2');
if ((s3=='X' && s6=='X' && s9=='X') || (!s3=='O' && !s6=='O' && !s9=='O'))
	PaintWinLine('vert3');
if ((s1=='X' && s5=='X' && s9=='X') || (!s1=='O' && !s5=='O' && !s9=='O'))
	PaintWinLine('diag1');
if ((s3=='X' && s5=='X' && s7=='X') || (!s3=='O' && !s5=='O' && !s7=='O'))
	PaintWinLine('diag2');
}
function CanvasClear(){
	var canvas = document.getElementById("a");
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
}
function PaintWinLine(input){

	var canvas = document.getElementById("a");
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	if (input=='diag1')
	{
		context.moveTo(20, 10);
		context.lineTo(280, 134);
	}else if (input=='diag2')
	{
		context.moveTo(280, 10);
		context.lineTo(30, 140);
	} else if (input=='vert1')
	{
		context.moveTo(50, 10);
		context.lineTo(50, 140);
	} else if (input=='vert2')
	{
		context.moveTo(155, 10);
		context.lineTo(155, 140);
	} else if (input=='vert3')
	{
		context.moveTo(260, 10);
		context.lineTo(260, 140);
	} else if (input=='horiz1')
	{
		context.moveTo(50, 25);
		context.lineTo(260, 25);
	} else if (input=='horiz2')
	{
		context.moveTo(50, 75);
		context.lineTo(260, 75);
	} else if (input=='horiz3')
	{
		context.moveTo(50, 125);
		context.lineTo(260, 125);
	}
	context.strokeStyle = "red";
	context.stroke();
}
function GetMessages(player){
	GetResponse('POST','getmessages/','&player='+GetCookie('player'),
	function(r) {
		if (r.responseText.indexOf('nodata')==-1)
		{
			var o = JSON.parse(r.responseText);
			var m = document.getElementById('messages');
			m.innerHTML = '';
			var text='';
			for (var i=0; i < o.length; i++)
			{
				text += o[i].message+'\n';
			}
			m.innerHTML = text.slice(0, -1);
		}
	});
}
function SetMessage(){
	var m = document.getElementById('message').value.replace(/(?:\r\n|\r|\n)/g, '');
	document.getElementById('message').value = '';
	if (m!='' || m!=undefined){		
		var player = GetCookie('player');
		GetResponse('POST','sendmessage/','&player='+player+'&message='+m,'');
	}
}
function SwitchLanguage(to){
	var lang = document.getElementById('lang');
	if (to=='ru' || (to=='' && lang.title=="English")){
		lang.style.backgroundImage = "url('/static/home/png/r.png')";
		lang.title = "Русский";
		SetCookie("lang", "en-US", "", "tik-tak-toe.djangohost.name");
		 cur = eng;
	}else if (to=='uk' || (to=='' &&  lang.title=="Русский")){
		lang.style.backgroundImage = "url('/static/home/png/u.png')";
		lang.title = "English";
		SetCookie("lang", "ru-RU", "", "tik-tak-toe.djangohost.name");
		 cur = rus;
	}
	LocalizeAuth();
}
function LocalizeAuth(){
	try{
		document.getElementById('intro').innerHTML=cur.introduce;
		document.getElementById('id_nick').placeholder=cur.nick;
		document.getElementById('pass').placeholder=cur.pass;
		document.getElementById('submit').innerHTML=cur.submit;
	}
	catch(e){}
}
function MouseOver(input) {
    document.getElementById(input).style.boxShadow  = "0 0 10px rgba(15,27,39,.4)";
}
function MouseOut(input) {
    document.getElementById(input).style.boxShadow  = "";
}
function DisplayStatus(input) {
	if (input.indexOf(cur.ends)>-1)
		{ShowObj('a');}
    document.getElementById('status').innerHTML=input;
}
function Move(input) {
    if (document.getElementById('status').innerHTML.indexOf(cur.ends) < 0)
	{
		if (document.getElementById('status').innerHTML.indexOf(cur.youWalks) > -1)
		{
			if (!document.getElementById(input).innerHTML)
			{			
				if ("1" == GetCookie('first')) document.getElementById(input).innerHTML = "X";
				else document.getElementById(input).innerHTML = "O";
				ShowObj('a');
				GetResponse('POST','move/','&player='+GetCookie('player')+'&place='+input.replace('square',''),function(req) {HideObj('a');});
			}
		}
	}
}
function WhoMove(input){
if (input.toLowerCase() == GetCookie('nick').toLowerCase())
	return cur.youWalks;
else
	return cur.whoWalks+input;
}
function ClearMoves(){
	for (var i=0;i<9;i++)
		document.getElementById("square"+(i+1)).innerHTML = "";
}
function Paint(input){
	if (document.getElementById('status').innerHTML.indexOf(cur.ends) < 0)
	{
		GetResponse('POST','paint/','&player='+GetCookie('player'),function(req) {
			var obj = JSON.parse(req.responseText)[0];
				
			if (req.responseText.indexOf("nodata")>-1)
			{
				obj = JSON.parse(req.responseText);
				DisplayStatus(WhoMove(obj.nodata));
				ClearMoves();
			}
			else if (req.responseText.indexOf("none")==-1)
			{
				obj = JSON.parse(req.responseText)
				if (obj[2].winner.toLowerCase() == GetCookie('nick').toLowerCase())
					DisplayStatus(cur.youWon);
				else if (obj[2].winner == 'friendship')
					DisplayStatus(cur.draw);
				else
					DisplayStatus(cur.fail + obj[2].winner);
				var arrayX = obj[0].X, arrayO = obj[0].O;
				ClearMoves();
				arrayX.forEach(function(item, i, arrayX) {document.getElementById("square"+item).innerHTML = "X";});
				arrayO.forEach(function(item, i, arrayO) {document.getElementById("square"+item).innerHTML = "O";});
					
			} else 
			{
				var name=JSON.parse(req.responseText)[1].move;
				DisplayStatus(WhoMove(name));
				HideObj('a');
				var arrayX = obj.X, arrayO = obj.O;
				ClearMoves();
				arrayX.forEach(function(item, i, arrayX) {document.getElementById("square"+item).innerHTML = "X";});
				arrayO.forEach(function(item, i, arrayO) {document.getElementById("square"+item).innerHTML = "O";});
			}
		});
	}
}
function GetPlayers(){
	if (GetCookie('player') > 0 || GetCookie('nick') != undefined)
		GetResponse('POST','get_players/','',function(req) {ParseAndMapping(req);});
}
function ShowGame(game){
	if (document.getElementById('invitation').innerHTML!='')
	{
		document.getElementById('status').innerHTML = cur.game;
		var timerId = setTimeout(function() {
			ShowObj('game');
			setTimeout(function() {document.getElementById('invitation').innerHTML='';}, 2300);
			setTimeout(function() {		
				if (document.getElementById('game').innerHTML.indexOf('SendDecline') == -1) 
					document.getElementById('game').innerHTML += "<a href=# onclick=\"SendDecline("+game+");\" class=close>"+cur.exit+"</a>";
			}, 2000);
		}, 1500);
	}
}
function HideObj(input){
var inv = document.getElementById(input);

	inv.setAttribute('hideTop',(input=='invitation')?100:inv.offsetTop);
	if (input=='game'){
		for (var i=0; i<9;i++)
		{			
			document.getElementById('square'+(i+1)).setAttribute('hideTop', document.getElementById('square'+(i+1)).offsetTop);
			document.getElementById('square'+(i+1)).style.top=3000+'px';
			document.getElementById('square'+(i+1)).style.opacity = 0;
	}}
	inv.style.opacity = 0;
	inv.style.top=3000+'px';inv.classList.remove('open');	
}
function ShowObj(input){
	var inv = document.getElementById(input);
	if (inv.style.opacity != 1){
		if (inv.getAttribute('hideTop') != undefined || inv.getAttribute('hideTop')!="")
		{
			if (input=='game')
			{for (var i=0; i<9;i++)
			{
				document.getElementById('square'+(i+1)).style.top=((i<3)?51:(i<6)?162:273)+'px';
				document.getElementById('square'+(i+1)).style.opacity = 1;
			}}
			if (input=='a')
				{CanvasClear();}
			inv.style.top = (input=='invitation')?100+'px':inv.getAttribute('hideTop')+'px';
		}
			inv.style.opacity = 1;
		
	} if (inv.offsetTop>2998||inv.getAttribute('hideTop')>2998) {inv.style.top = 20+'px';inv.setAttribute('hideTop',20)} else inv.style.top = inv.getAttribute('hideTop')+'px';
}
function SendDecline(input){	
HideObj('invitation');SetCookie("first", "", "", "tik-tak-toe.djangohost.name");
GetResponse('POST','decide/','&second='+GetCookie('player')+'&decide=decline',function(r) {HideObj('invitation'); HideObj('game');} )
}
function Refused(){
	ShowObj('invitation');
	SetCookie("first", "", "", "tik-tak-toe.djangohost.name");
	document.getElementById('invitation').innerHTML = "<img src=\"\/static\/home\/png\/refused.png\" width=\"16\" style=\"position:absolute; top: 35%; left:20%\">"+cur.refused;
var timerId = setTimeout(function() {
	  HideObj('invitation'); 
	}, 2000);
}
function SendAccept(input){
	HideObj('invitation');
	SetCookie("first", "0", "", "tik-tak-toe.djangohost.name");
	GetResponse('POST','decide/','&second='+GetCookie('player')+'&decide=accept',function(r) {Сonsent();}	)
}
function Сonsent(){
	document.getElementById('invitation').innerHTML = "<img src=\"\/static\/home\/png\/accept.png\" width=\"16\" style=\"position:absolute; top: 35%; left:20%\">"+cur.begins;
	
var timerId = setTimeout(function() {
	  HideObj('invitation');	  
	}, 2000);
}
function SendInvitation(name){
SetCookie("first", "1", "", "tik-tak-toe.djangohost.name");
if (GetCookie('player') > 0 || GetCookie('nick') != undefined)
	GetResponse('POST','invitation/','&who='+GetCookie('player')+'&invite='+name,function(req) {
	if (req.responseText == 'sended'){
		document.getElementById('invitation').innerHTML = "<img src=\"\/static\/home\/gif\/wait.gif\" width=\"16\" style=\"position:absolute; top: 35%; left:15%\">"+cur.waitingResponse;
		ShowObj('invitation');}});	
}
function GetResponse(as, where, what, perform){
		var req = GetXmlHttp();
		req.onreadystatechange = function() {
			if (req.readyState == 4) {if (perform!=false) {perform(req);}}
		}
		req.open(as, where, true);
		var query= 'csrfmiddlewaretoken='+document.getElementsByName('csrfmiddlewaretoken')[0].value + what;
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.send(query);
}
function GetXmlHttp(){
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}
function ShowAuthError(object,error){
	var statusElem = document.getElementById('validate_status');
	document.getElementById(object).classList.add('error');
	statusElem.innerHTML = "<font color='#F85072'>"+error+"</font>";
}
function HideAuthError(object){
	document.getElementById('validate_status').innerHTML = '';
	
	if (object)
		document.getElementById(object).classList.remove('error');
	else{
		document.getElementById('id_nick').classList.remove('error');
		document.getElementById('pass').classList.remove('error');
	}
}
function Validate() {
	var nick = document.getElementById('id_nick').value;
	var pass = document.getElementById('pass').value;
	var statusElem = document.getElementById('validate_status');
	HideAuthError();
	if (nick=='')
		ShowAuthError('id_nick',cur.require);
	if (pass=='')
		ShowAuthError('pass',cur.require);	
	
	if (/[а-яА-Я]/.test(nick))
		ShowAuthError('id_nick',cur.enOnly);
	if (/[а-яА-Я]/.test(pass))
		ShowAuthError('pass',cur.enOnly);
	
	if (statusElem.innerHTML==''){
		GetResponse('POST','auth/','&nick='+nick+'&passw='+pass,function(req){  
			
			if (req.readyState == 4) {
				if(req.status == 200) {
						statusElem.innerHTML = "";					
						document.getElementById('pass').classList.remove('error');
						document.getElementById('id_nick').classList.remove('error');
						HideObj('invitation');
						document.getElementById('busy').style.opacity = 1;
						HideObj('game');
						document.getElementById('overlay2').classList.add('open');
						setTimeout(function() {document.getElementById('overlay').classList.remove('open');},1000);
						ParseAndMapping(req);
						var timerId = setInterval(function() { GetPlayers(); }, 2000);
				} else if(req.status == 400) { 
					var errMsg = req.statusText;
					if (req.responseText=="Bad password") 
					{
						ShowAuthError('pass',cur.badPass);
					} else
					{
						var json = req.responseText.replace(/\[/g,'').replace(/\]/g,'').replace(/\\/g,'').replace(/"}"/g,'"}').replace(/"{"/g,'{"'),
						obj = JSON.parse(json);
						
						if (obj.nick!=undefined)
							document.getElementById('id_nick').classList.add('error');
							if (obj.nick=="This field is required.")
								ShowAuthError('id_nick',cur.require);
						else
							HideAuthError('id_nick');
						if (obj.passw!=undefined)
							document.getElementById('pass').classList.add('error');
							if (obj.passw=="This field is required.")
								ShowAuthError('pass',cur.require);
						else
							HideAuthError('pass');
							
						statusElem.innerHTML = "<font color='#F85072'>"+errMsg+"</font>";
					}
				}
			}
		});	
	}
};
function GetCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};
function SetCookie (name, value, expires, path, domain, secure) {
      document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}
function ParseAndMapping(req){
	if (isJson(req.responseText))
	{
		var obj = JSON.parse(req.responseText), gobj=obj.filter(function (row) { if(row.inGame) { return true; } else { return false; }});
		obj = obj.filter(function (row) { if(!row.inGame) { return true; } else { return false; }});
		var inv = document.getElementById('invitation');
		var p="",g="";
		for (var i=0; i< obj.length; i++)
		{
			if (obj[i].pk==GetCookie('player'))
			{
				if (document.getElementById('game').style.opacity==1) { if (document.getElementById('status').innerHTML.indexOf(cur.ends)==-1) {Refused();console.log('oppa');}setTimeout("HideObj('game');", 2000);}
				if (obj[i].free==false)
				{				
					if (obj[i].invated!="")
					{
						if (inv.innerHTML.indexOf(cur.begin)>-1)
						{ShowGame(obj[i].invated);}
							else
						{
							GetResponse('POST','decide/','&second='+obj[i].pk+'&decide=wait',function(r) {
								var o = JSON.parse(r.responseText);
								inv.innerHTML = "<strong>"+o.first+"</strong>"+cur.invitesYou+"<br><a href=# class=accept onclick=\"SendAccept("+o.game+");\">"+cur.adopt+"</a><a href=# class=decline onclick=\"SendDecline("+o.game+");\">"+cur.reject+"</a><br><br><br>";
								ShowObj('invitation');});
						}
					} else {
						inv.innerHTML = "<img src=\"\/static\/home\/gif\/wait.gif\" width=\"16\" style=\"position:absolute; top: 35%; left:20%\">"+cur.waitingResponse;					
						ShowObj('invitation');
					}
				} else if (obj[i].free==true && inv.innerHTML.indexOf(cur.waiting)>-1) {Refused();}
				if (obj.length==1 && inv.style.opacity==1 && (inv.innerHTML.indexOf(cur.waiting)>-1 || inv.innerHTML.indexOf(cur.invites)>-1)){SendDecline(obj[i].invated);setTimeout("Refused();", 2000);}
			}
			
			var upd = new Date(obj[i].updated);
			if (window.navigator.userAgent.indexOf("MSIE ")>0 || navigator.userAgent.match(/Trident.*rv\:11\./))
				upd.setHours(upd.getHours()+3);

			p += "<tr><td>"+(i+1)+".</td>";
			p += "<td><a href=\"#\" onclick=\""+((obj[i].pk!=GetCookie('player'))?"SendInvitation('"+obj[i].pk+"');":"false;")+"\" class=\"tooltip\">"+obj[i].nick+"<span>";
			p += "<img class=\"callout\" src=\"\/static\/home\/gif\/callout.gif\"><strong>"+obj[i].nick+"</strong><br>"+cur.updated+" "+upd.toLocaleTimeString ()+";<br>"+cur.wins+" "+obj[i].score+", "+cur.fails+" "+obj[i].fails+";"+((obj[i].pk!=GetCookie('player')) ? "<br><font size=1>("+cur.invite+")" : "") + "</span></a></td><td>";
			p += "<span id='tooltip' name='"+obj[i].pk+"'></span>";
			p += "</td></tr>";			
		}		
		if ((gobj.length % 2)==1)
		{
			for (var i=0; i< gobj.length-1; i++)
			{
				A(gobj[i]);
				g += "<tr><td>"+(i+1)+":</td>";
				g += "<td>"+gobj[i].nick+", "+gobj[i+1].nick+".</td></tr>";
				i++;
				A(gobj[i]);
			}
			if (gobj[gobj.length-1].nick==GetCookie('nick'))
					SendDecline(gobj[gobj.length-1].invated);				
		}else
		{
			for (var i=0; i< gobj.length; i++)
			{
				A(gobj[i]);
				g += "<tr><td>"+(i+1)+":</td>";
				g += "<td>"+gobj[i].nick+", "+gobj[i+1].nick+".</td></tr>";
				i++;
				A(gobj[i]);				
			}
		}
		
		document.getElementById('players').innerHTML = "<h1>"+cur.freePlayers+"</h1><table id=score>"+p+"</table>"+ ((obj.length ==1) ? "<br><img src=\"\/static\/home\/png\/falone.png\" height=32 width=32>" : ((obj.length ==0 && gobj.length>0)?cur.allBusy:"")) +"<a href=\"#\" class=close onclick=\"Exit();\">"+cur.exit+"<\/a>";
		document.getElementById('busy').innerHTML = "<h1>"+cur.games+"</h1><table id=games>"+g+"</table>"+((gobj.length ==0) ? cur.noGames : "");
		for (var i=0; i< obj.length; i++)
		{
			if (obj[i].pk==GetCookie('player')) {
				document.getElementsByName(obj[i].pk)[0].innerHTML = cur.thisYou;
				if (!obj[i].inGame && document.getElementById('game').opacity==1)
					{SendDecline(obj[i].invated);}
			}			
		}
		var p = document.getElementById('players'), b = document.getElementById('busy');
		var newPos = p.offsetTop + p.offsetHeight + 20;
		b.style.top = newPos + 'px'; if (document.getElementById('status').innerHTML.indexOf(cur.ends)>-1) CalculateWinLinePos(); else {CanvasClear();HideObj('a');}
	}
	else
	{
		document.location.href = '';
		return false;
	}
}
function A(input) {
	var player = GetCookie('player');
	if (input.pk==player)
	{
		ShowGame(input.invated);Paint(player); GetMessages();
		if (document.getElementById('invitation').innerHTML.indexOf(cur.waiting)>-1)
			Сonsent();
	}
}
function Exit() {
SetCookie("first", "", "", "tik-tak-toe.djangohost.name");
	document.getElementById('overlay2').classList.remove('open')
setTimeout("document.location.href = 'exit/';", 300);
}
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
setTimeout("document.getElementById('overlay').classList.add('open')", 500);