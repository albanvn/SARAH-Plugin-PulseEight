/*
******************************************************
* File:PulseEight.js
* Date:6/11/2013
* Version: 1.0
* Author: Alban Vidal-Naquet (alban@albanvn.net)
* Sarah plugin for PulseEight
******************************************************
*/
const gs_cmdfile="Command.txt";
const gs_script="cecclient.cmd";

const gs_okmsg="Très bien je m'en occupe";
const gs_notconfigured="Vous devez configurer le plugue in";

const gs_timeout=2000;

var   g_listcmd=new Array();
var   g_cmd="";

exports.init = function(SARAH)
{
	var file = __dirname + "\\" + gs_cmdfile;
	var fs = require('fs');
	g_cmd=__dirname+ "\\" + gs_script;
	fs.readFileSync(file).toString().split("\n").forEach(function(line)
			{
			  if (line!="")
			  {
			    var v=line.split("=");
			    //console.log("add "+v[0]+":"+v[1]);
			    g_listcmd[v[0]]=v[1];
			  }
			});
}

exports.action = function(data, callback, config, SARAH)
{
    config=config.modules.PulseEight;
    if (!config.cecclient_path || typeof config.cecclient_path==="undefined")
	  SARAH.speak(gs_notconfigured);
	else if (data.cmd!="" && typeof data.cmd!=="undefined")
	{
	  var listcmd=data.cmd.split(",");
	  execute(listcmd, 0, config, SARAH);
	}
	if (typeof data.silent==="undefined" || data.silent==0)
	  SARAH.speak(gs_okmsg);
	callback();
}

function execute(listcmd, i, config, SARAH)
{
  if (i<listcmd.length)
  {
    if (listcmd[i]=="")
	{
	  //console.log("pause");
      setTimeout(function(){execute(listcmd, ++i, config, SARAH);}, gs_timeout);
	}
	else
	{
	  //console.log(listcmd[i]);
	  if (listcmd[i] in g_listcmd)
		SARAH.remote({ 'run' : g_cmd, 'runp' : g_listcmd[listcmd[i]] + " \"" + config.cecclient_path + "\" " + config.cecport});
	  else
		SARAH.remote({ 'run' : g_cmd, 'runp' : listcmd[i] + " \"" + config.cecclient_path + "\" " + config.cecport});
      setTimeout(function(){execute(listcmd, ++i, config, SARAH);}, gs_timeout);
	}	  
  }
}
