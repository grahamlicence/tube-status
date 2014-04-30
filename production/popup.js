var Tube=function(){var e=[];var t=new XMLHttpRequest;var n=function(){t.open("GET","http://cloud.tfl.gov.uk/TrackerNet/LineStatus",true);t.onload=r;t.send(null)};var r=function(){if(!t.responseXML){document.getElementsByTagName("body")[0].innerHTML="<p>Error: no connection to internet or TfL feed</p>";return}var n=t.responseXML.getElementsByTagName("LineStatus"),r=0,i='<div class="main"><a class="popupclosebtn" title="close popup"></a>',s="",o="",u="",f="on",l='<span class="message">No updates set</span>',c=false;for(var h=0,p=n.length;h<p;h+=1){if(e[h]){u="";f="on"}else{u="off ";f="off"}s=n[h].getElementsByTagName("Status")[0].getAttribute("Description");o=n[h].getElementsByTagName("Line")[0].getAttribute("Name");u+=o.toLowerCase().replace(/\s/g,"-");if(s!=="Good Service"){c=n[h].getAttribute("StatusDetails").replace(/GOOD SERVICE/g,"<br />GOOD SERVICE").replace(/MINOR DELAYS/g,"<br />MINOR DELAYS").replace(/A Good Service/g,"<br />A Good Service").replace(/Good Service/g,"<br />Good Service").replace(/No service/g,"<br />No service")}else{c=false}i+='<p class="'+u+'">';i+='<span class="line">'+o+"</span> ";i+='<span class="status">'+s+"</span> "+l+' <a class="toggle on" data-class="'+u.replace("off ","")+'" data-pos="'+h+'">'+f+"</a>";if(c){if(c.charAt(0)==="<"){c=c.substring(6)}i+=' <span class="details">'+c+"</span>"}i+="</p></div>"}document.getElementsByTagName("body")[0].innerHTML=i;a();document.querySelector(".popupclosebtn").addEventListener("click",function(){window.close()})};var s=function(){var t=document.querySelector(".toggle");var n=function(){var t=this.innerHTML,n=this.getAttribute("data-class"),r=0,i=parseInt(this.getAttribute("data-pos"),10);if(t==="on"){this.innerHTML="off";document.querySelector("."+n).className=n+" off"}else{this.innerHTML="on";r=1;document.querySelector("."+n).className=n}e[i]=r===0?false:true;o()};var r=new WebKitMutationObserver(function(e){e.forEach(function(e){if(e.addedNodes){for(i=0,l=e.addedNodes.length;i<l;i+=1){e.addedNodes[i].querySelector(".toggle").addEventListener("click",n)}}})});var s={attributes:true,childList:true,characterData:true};r.observe(document.querySelector("body"),s)};var o=function(){var t=[],n=0;for(n;n<13;n+=1){t[n]=e[n]===true?1:0}localStorage.lines=JSON.stringify(t);a()};var u=function(){var t=[],n=0;t=JSON.parse(localStorage.lines);for(n;n<13;n+=1){e[n]=t[n]===1?true:false}};var a=function(){var n=t.responseXML.getElementsByTagName("LineStatus"),r="",i=0,s=0,o=0,u=0,a=0,f=0,l=0,c=0,h=0,p="",d="",v="",m="",g="",y="",b=" ";for(var w=0,E=n.length;w<E;w+=1){if(e[w]){b=" ";r=n[w].getElementsByTagName("Status")[0].getAttribute("Description");if(r==="Suspended"){if(c){b=", "}c+=1;d+=b+n[w].getElementsByTagName("Line")[0].getAttribute("Name")+" Line"}else if(r==="Part Suspended"){if(l){b=", "}l+=1;p+=b+n[w].getElementsByTagName("Line")[0].getAttribute("Name")+" Line"}else if(r==="Planned Closure"||r==="Service Closed"){if(f){b=", "}f+=1;y+=b+n[w].getElementsByTagName("Line")[0].getAttribute("Name")+" Line"}else if(r==="Part Closure"){a+=1}else if(r==="Severe Delays"){if(u){b=", "}u+=1;v+=b+n[w].getElementsByTagName("Line")[0].getAttribute("Name")+" Line"}else if(r==="Special Service"){if(h){b=", "}h+=1;g+=b+n[w].getElementsByTagName("Line")[0].getAttribute("Name")+" Line"}else if(r==="Reduced Service"){o+=1}else if(r==="Bus Service"){s+=1}else if(r==="Minor Delays"){if(i){b=", "}i+=1;m+=b+n[w].getElementsByTagName("Line")[0].getAttribute("Name")+" Line"}}}if(f>0){chrome.browserAction.setIcon({path:"images/bad.png"});chrome.browserAction.setTitle({title:y+" closed"})}else if(c>0){chrome.browserAction.setIcon({path:"images/bad.png"});chrome.browserAction.setTitle({title:d+" suspended"})}else if(l>0){chrome.browserAction.setIcon({path:"images/bad.png"});chrome.browserAction.setTitle({title:p+" part suspended"})}else if(u>0){chrome.browserAction.setIcon({path:"images/bad.png"});chrome.browserAction.setTitle({title:v+" severe delays"})}else if(h>0){chrome.browserAction.setIcon({path:"images/delay.png"});chrome.browserAction.setTitle({title:g+" special service"})}else if(i>0){chrome.browserAction.setIcon({path:"images/delay.png"});chrome.browserAction.setTitle({title:m+" minor delays"})}else{chrome.browserAction.setIcon({path:"images/good.png"});chrome.browserAction.setTitle({title:"No issues reported"})}};var f=function(){if(localStorage.lines){u()}else{for(var t=0;t<13;t+=1){e[t]=true}o()}};return{update:function(){n()},init:function(){f();n();document.addEventListener("DOMContentLoaded",s)}()}}();var _gaq=_gaq||[];_gaq.push(["_setAccount","UA-2103529-14"]);_gaq.push(["_trackPageview"]);(function(){var e=document.createElement("script");e.type="text/javascript";e.async=true;e.src="https://ssl.google-analytics.com/ga.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})()