//~~tv:template.20140711
//~~tc: Updating the base_url.

//tealium universal tag - utag.sender.template ut4.0.201709211439, Copyright 2017 Tealium.com Inc. All Rights Reserved.
try {
  (function (id, loader) {
    var u = {};
    utag.o[loader].sender[id] = u;
    // Start Tealium loader
    // Please do not modify
    if (utag.ut === undefined) { utag.ut = {}; } if (utag.ut.loader === undefined) { u.loader = function (o) { var a, b, c, l; a = document; if (o.type === "iframe") { b = a.createElement("iframe"); b.setAttribute("height", "1"); b.setAttribute("width", "1"); b.setAttribute("style", "display:none"); b.setAttribute("src", o.src); } else if (o.type === "img") { utag.DB("Attach img: " + o.src); b = new Image(); b.src = o.src; return; } else { b = a.createElement("script"); b.language = "javascript"; b.type = "text/javascript"; b.async = 1; b.src = o.src; } if (o.id) { b.id = o.id; } if (typeof o.cb === "function") { b.hFlag = 0; b.onreadystatechange = function () { if ((this.readyState === 'complete' || this.readyState === 'loaded') && !b.hFlag) { b.hFlag = 1; o.cb(); } }; b.onload = function () { if (!b.hFlag) { b.hFlag = 1; o.cb(); } }; } l = o.loc || "head"; c = a.getElementsByTagName(l)[0]; if (c) { utag.DB("Attach to " + l + ": " + o.src); if (l === "script") { c.parentNode.insertBefore(b, c); } else { c.appendChild(b); } } }; } else { u.loader = utag.ut.loader; }
    // End Tealium loader
    u.ev = {'view' : 1};
      u.map={"game_name":"tag.game_name","gbl_page_name":"tag.page_name","gbl_pagename":"tag.page_name","gbl_language_code":"tag.language_code","gbl_player_logged_in":"tag.player_logged_in","gbl_site_section":"tag.site_section","gbl_device_type":"tag.device_type","gbl_day_of_week":"tag.gbl_day_of_week","gbl_hour_of_day":"tag.hour_of_day","dom.referrer":"tag.traffic_source","slgt_euromillions_tag":"tag.Euromillions","slgt_swissloto_tag":"tag.SwissLoto","slgt_triomagic_tag":"tag.TrioMagic","slgt_iwg_tag":"tag.IWG"};
  u.extend=[function(a,b){ try{ if(b['dom.url'].toString().indexOf('/games/euromillions')>-1){b['slgt_euromillions_tag']='Viewed'} } catch(e){ utag.DB(e) }  },
function(a,b,c,d,e,f,g){d=b['dom.url'];if(typeof d=='undefined')return;c=[{'/games/euromillions/confirm':'Playing'},{'/games/euromillions/summary':'Playing'},{'/games/euromillions/receipt':'Played'},{'/games/euromillions/superstar/summary':'Playing'},{'/games/euromillions/superstar/receipt':'Played'}];var m=false;for(e=0;e<c.length;e++){for(f in c[e]){if(d.toString().indexOf(f)>-1){b['slgt_euromillions_tag']=c[e][f];m=true};};if(m)break};},
function(a,b){ try{ if(b['dom.url'].toString().indexOf('/games/swissloto')>-1){b['slgt_swissloto_tag']='Viewed'} } catch(e){ utag.DB(e) }  },
function(a,b,c,d,e,f,g){d=b['dom.url'];if(typeof d=='undefined')return;c=[{'/games/swissloto/confirm':'Playing'},{'/games/swissloto/summary':'Playing'},{'/games/swissloto/receipt':'Played'},{'/games/swissloto/superstar/summary':'Playing'},{'/games/swissloto/superstar/receipt':'Played'}];var m=false;for(e=0;e<c.length;e++){for(f in c[e]){if(d.toString().indexOf(f)>-1){b['slgt_swissloto_tag']=c[e][f];m=true};};if(m)break};},
function(a,b){ try{ if(b['dom.url'].toString().indexOf('/games/magic/triomagic')>-1){b['slgt_triomagic_tag']='Viewed'} } catch(e){ utag.DB(e) }  },
function(a,b,c,d,e,f,g){d=b['dom.url'];if(typeof d=='undefined')return;c=[{'/games/triomagic/confirm':'Playing'},{'/games/triomagic/summary':'Playing'},{'/games/triomagic/receipt':'Played'}];var m=false;for(e=0;e<c.length;e++){for(f in c[e]){if(d.toString().indexOf(f)>-1){b['slgt_triomagic_tag']=c[e][f];m=true};};if(m)break};},
function(a,b){ try{ if(b['gbl_page_type'].toString().indexOf('iwg')>-1){b['slgt_iwg_tag']='Viewed'} } catch(e){ utag.DB(e) }  },
function(a,b,c,d,e,f,g){d=b['dom.url'];if(typeof d=='undefined')return;c=[{'iwg_confirm_purchase_page':'Playing'},{'iwg_play_page':'Played'}];var m=false;for(e=0;e<c.length;e++){for(f in c[e]){if(d.toString().indexOf(f)>-1){b['slgt_iwg_tag']=c[e][f];m=true};};if(m)break};},
function(a,b){ try{ if(b['dom.url'].toString().indexOf('/sports/')>-1){b['slgt_sports_tag']='Viewed'} } catch(e){ utag.DB(e) }  },
function(a,b,c,d,e,f,g){d=b['gbl_page_type'];if(typeof d=='undefined')return;c=[{'sports_bet_confirmation_page':'Playing'},{'sports_bet_placed_page':'Played'}];var m=false;for(e=0;e<c.length;e++){for(f in c[e]){if(d.toString().indexOf(f)>-1){b['slgt_sports_tag']=c[e][f];m=true};};if(m)break};},
function(a,b){ try{ if(b['dom.url'].toString().indexOf('/horses/')>-1){b['slgt_horses_tag']='Viewed'} } catch(e){ utag.DB(e) }  },
function(a,b,c,d,e,f,g){d=b['gbl_page_type'];if(typeof d=='undefined')return;c=[{'horses_play_page':'Playing'},{'horses_bet_placed_page':'Played'}];var m=false;for(e=0;e<c.length;e++){for(f in c[e]){if(d.toString().indexOf(f)>-1){b['slgt_horses_tag']=c[e][f];m=true};};if(m)break};},
function(a,b){ try{ if(b['dom.url'].toString().toLowerCase().indexOf('successful-email-verification-sent'.toLowerCase())>-1){b['slgt_pages_tag']='Registration'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if(1){b['slgt_pages_tag']=b['gbl_player_logged_in']} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if(b['gbl_content_type'].toString().toLowerCase().indexOf('results'.toLowerCase())>-1){b['slgt_pages_tag']='Results'} } catch(e){ utag.DB(e) }  }];

    u.send = function (a, b) {
      if (u.ev[a] || u.ev.all !== undefined) {
        //##UTENABLEDEBUG##utag.DB("send:##UTID##");

        var c, d, e, f, g;

        u.data = {
          "base_url" : "//targetemsecure.blob.core.windows.net/",
          "universe_id" : "a5f187fb-79af-439f-a13a-75d3bd2826b2",
          "customIdentifier" : "",
          "tags" : [],
          "useConfig" : "",
          "finishedCallback" : "",
          "async" : "",
          "isEvent" : ""
        };

        for(c=0;c<u.extend.length;c++){try{d=u.extend[c](a,b);if(d==false)return}catch(e){}};

        g = {};

        // Start Mapping
        for (d in utag.loader.GV(u.map)) {
          if (b[d] !== undefined && b[d] !== "") {
            e = u.map[d].split(",");
            for (f = 0; f < e.length; f++) {
              if (e[f].indexOf("tag.") === 0) {
                var obj = {
                  "tag" : e[f].substr(4),
                  "value" : b[d]
                }
                u.data.tags.push(obj);
              } else {
                u.data[e[f]] = b[d];
              }
            }
          }
        }
        // End Mapping

        window.wa = {};
        window.wa.bt_queue = [];
        window.wa_u = u.data.universe_id;

        if (u.data.customIdentifier !== "") { g.customIdentifier = u.data.customIdentifier; }
        if (u.data.tags.length > 0) { g.tags = u.data.tags; }
        if (u.data.useConfig !== "") { g.useConfig = u.data.useConfig; }
        if (u.data.finishedCallback !== "") { g.finishedCallback = u.data.finishedCallback; }
        if (u.data.async !== "") { g.async = u.data.async; }
        if (u.data.isEvent !== "") { g.isEvent = u.data.isEvent; }

        window.wa.bt_queue.push(JSON.stringify(g));

        // Start Loader Callback
        u.loader_cb = function () {
        };
        // End Loader Callback

        u.data.base_url += u.data.universe_id + "/target.emsecure.min.js";

        u.loader({ "type" : "script", "src" : u.data.base_url, "cb" : u.loader_cb, "loc" : "script", "id" : 'utag_8' });

        //##UTENABLEDEBUG##utag.DB("send:##UTID##:COMPLETE");
      }
    };
    utag.o[loader].loader.LOAD(id);
  }('8', 'loro.main'));
} catch (error) {
  utag.DB(error);
}
//end tealium universal tag

