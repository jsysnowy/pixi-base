//~~tv:7110.20170418
//~~tc: Disable Display Features based on config setting 
//~~tc: Send Location parameter when clear vars is enabled


window.GoogleAnalyticsObject = "" || "ga";

window[window.GoogleAnalyticsObject] = window[window.GoogleAnalyticsObject] || function() {
  (window[window.GoogleAnalyticsObject].q = window[window.GoogleAnalyticsObject].q || []).push(arguments);
};

//tealium universal tag - utag.sender.7110 ut4.0.201710091559, Copyright 2017 Tealium.com Inc. All Rights Reserved.

try {
  (function(id, loader) {
    var u = {};
    utag.o[loader].sender[id] = u;
    // Start Tealium loader
    // Please do not modify
    if (utag.ut === undefined) { utag.ut = {}; } if (utag.ut.loader === undefined) { u.loader = function (o) { var a, b, c, l; a = document; if (o.type === "iframe") { b = a.createElement("iframe"); b.setAttribute("height", "1"); b.setAttribute("width", "1"); b.setAttribute("style", "display:none"); b.setAttribute("src", o.src); } else if (o.type === "img") { utag.DB("Attach img: " + o.src); b = new Image(); b.src = o.src; return; } else { b = a.createElement("script"); b.language = "javascript"; b.type = "text/javascript"; b.async = 1; b.src = o.src; } if (o.id) { b.id = o.id; } if (typeof o.cb === "function") { b.hFlag = 0; b.onreadystatechange = function () { if ((this.readyState === 'complete' || this.readyState === 'loaded') && !b.hFlag) { b.hFlag = 1; o.cb(); } }; b.onload = function () { if (!b.hFlag) { b.hFlag = 1; o.cb(); } }; } l = o.loc || "head"; c = a.getElementsByTagName(l)[0]; if (c) { utag.DB("Attach to " + l + ": " + o.src); if (l === "script") { c.parentNode.insertBefore(b, c); } else { c.appendChild(b); } } }; } else { u.loader = utag.ut.loader; }
    if (utag.ut.typeOf === undefined) { u.typeOf = function(e) {return ({}).toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase();};} else { u.typeOf = utag.ut.typeOf; }
    // End Tealium loader
    u.ev = {'view': 1, 'link': 1};
    u.o = window[window.GoogleAnalyticsObject];
    u.required = {};
    u.created = false;
    // Perform operation for all trackers (params used differently for "set")
    u.all = function(e, o, v, a, b, c) {
      for (var i = 0; i < u.data.account.length; i++) {
        var t = (u.data.name[i] ? u.data.name[i] + "." : "");
        if (o === "event") {
          u.o(t + e, o, v, a, b, c)
        } else if (v) {
          u.o(t + e, o, v)
        } else {
          u.o(t + e, o);
        }
      }
    };
    // this is a private function used for adding events to GA hits. must not be used for any other purpose
    u.setHitData = function(g, a, b, f) {
      var obj = u.data[a];
      for (var d in utag.loader.GV(obj)) {
        if (b && d.indexOf("enh_" + b + "-") !== 0 && d.indexOf("enh_all-") !== 0) {
          continue;
        }
        var idx = d.split("-")[1],
            val = obj[d];
        if (u.typeOf(val) !== "array") {
          g[idx] = val;
        } else {
          g[idx] = val[f];
        }
      }
    };

    //Add and event to GA {eventCategory : "", eventAction : "", eventValue : ""}
    u.addEvent = function(v) {
      if (typeof v.eventCategory == "undefined" || typeof v.eventAction == "undefined") {
        utag.DB("GA event Category or Action is not set");
        return;
      }
      if (isNaN(parseInt(v.eventValue))) {
        utag.DB("GA event Value is not a number");
        v.eventValue = null;
      } else {
        v.eventValue = parseInt(v.eventValue) || null;
      }
      u.data.ga_events.push(v);
    };
    // accepts an event type and the length of the product array, impression - true/false
    u.addproduct = function(event_type, len, imp) {
      var g = {}, i, j, k = [];

      if (imp === true) {
        k = ( u.data.enh_impression_id.length ? u.data.enh_impression_id : u.data.enh_impression_name );
        for (i = 0; i < k.length; i++) {
          g = {};
          g.id = (u.data.enh_impression_id[i] ? u.data.enh_impression_id[i] : "");
          g.name = (u.data.enh_impression_name[i] ? u.data.enh_impression_name[i] : "");
          g.brand = (u.data.enh_impression_brand[i] ? u.data.enh_impression_brand[i] : "");
          g.variant = (u.data.enh_impression_variant[i] ? u.data.enh_impression_variant[i] : "");
          g.category = (u.data.enh_impression_category[i] ? u.data.enh_impression_category[i] : "");
          g.list = (u.data.enh_impression_list[i] ? u.data.enh_impression_list[i] : "");
          g.price = (u.data.enh_impression_price[i] ? u.data.enh_impression_price[i] : "");
          g.position = (u.data.enh_impression_position[i] ? u.data.enh_impression_position[i] : "");
          u.setHitData(g, "enhecom_events", event_type, i);
          u.all('ec:addImpression', g);
        }
      } else {
        for (i = 0; i < len; i++) {
          g = {};
          if (u.data.autofill_params === "true") { //UI config & mapping to set default vals - default to true
            for (j = 0; j < u.data.product_id.length; j++) {
              u.data.product_name[j] = u.data.product_name[j] || u.data.product_id[j];
              u.data.product_unit_price[j] = u.data.product_unit_price[j] || "1.00";
              u.data.product_quantity[j] = u.data.product_quantity[j] || "1";
            }
          }
          g.id = u.data.product_id[i];
          g.name = (u.data.product_name[i] ? u.data.product_name[i] : "");
          g.brand = (u.data.product_brand[i] ? u.data.product_brand[i] : "");
          g.variant = (u.data.product_variant[i] ? u.data.product_variant[i] : "");
          g.category = (u.data.product_category[i] ? u.data.product_category[i] : "");
          g.price = (u.data.product_unit_price[i] ? u.data.product_unit_price[i] : "");
          g.quantity = (u.data.product_quantity[i] ? u.data.product_quantity[i] : "");
          g.coupon = (u.data.product_discount[i] ? u.data.product_discount[i] : "");
          g.position = (u.data.product_position[i] ? u.data.product_position[i] : "");
          u.setHitData(g, "enhecom_events", event_type, i);
          u.all('ec:addProduct', g);
        }
      }
    };

    u.addpromo = function(action, event) {
      var f, g;
      for (f = 0; f < u.data.enh_promo_id.length; f++) {
        g = {};
        g.id = u.data.enh_promo_id[f];
        g.name = (u.data.enh_promo_name[f] ? u.data.enh_promo_name[f] : u.data.enh_promo_id[f]);
        g.creative = (u.data.enh_promo_creative[f] ? u.data.enh_promo_creative[f] : "");
        g.position = (u.data.enh_promo_position[f] ? u.data.enh_promo_position[f] : "");
        u.all('ec:addPromo', g);
      }
      if (action === "promo_click" && event === "link") {
        u.all('ec:setAction', u.data.enh_action);
        if (u.data.autosend_events === "true"){
          u.all('send', 'event', 'Internal Promotions', 'click', (g.name ? g.name : g.id), {'hitCallback': u.data.enh_event_cb});
        }
      }
    };
    u.createTracker = function() {
      var i, tn, start;
      u.data.account = u.data.tid || u.data.account;
      if (u.typeOf(u.data.account) === "string") {
        u.data.account = u.data.account.replace(/\s/g, "").split(",");
      }
      // if there is no tracker name defined, but there are multiple trackers, auto-generate one with the name tealium_[1|2|3|4 etc.]
      if (u.typeOf(u.data.name) === "string" && u.data.name !== "") {
        u.data.name = u.data.name.replace(/\s/g, "").split(",");
      }

      if (!u.data.name || u.data.name.length !== u.data.account.length) {
        start = u.data.name.length !== u.data.account.length ? u.data.name.length : 0;
        tn = utag.tagsettings.gua.trackernames;
        u.data.name = u.data.name || [];
        for (i = start; i < u.data.account.length; i++) {
          u.data.name.push("tealium_" + (i + tn));
        }
        utag.tagsettings.gua.trackernames = tn + i;
      }
    };
    u.initTracker = function() {
      var c, f;
      if (!u.created) {
        u.created = true;
        for (f = 0; f < u.data.account.length; f++) {
          c = {};
          if (u.data.siteSpeedSampleRate) {c.siteSpeedSampleRate = parseInt(u.data.siteSpeedSampleRate);}
          if (u.data.sampleRate) {c.sampleRate = parseFloat(u.data.sampleRate);}
          c.cookieDomain = u.data.cookieDomain;
          if (u.data.cookieExpires || u.data.cookieExpires === "0") {c.cookieExpires = parseInt(u.data.cookieExpires);}
          if (u.data.legacyCookieDomain) {c.legacyCookieDomain = u.data.legacyCookieDomain;}
          c.allowLinker = u.data.allowLinker;
          if (typeof u.data.name[f] !== "undefined" && u.data.name[f] !== "") {c.name = u.data.name[f];}
          if (u.data.clientId) {c.clientId = u.data.clientId;}
          u.o("create", u.data.account[f], c);
        }
        if (u.data.global_event_cb) {
         u.all('set', 'hitCallback', u.data.global_event_cb);
        }
        if (u.data.optimizely === "true") { window.optimizely = window.optimizely || []; window.optimizely.push(['activateUniversalAnalytics']);}
      }
    };

    // loops through and sets all properties that have to be set using the "set" command
    u.setGlobalProperties = function (data, reset, custom_property) {
      // known params - this can be updated if more get introduced later
      // supports boolean (string or boolean) types also if "type" is set to "bool"
      var map = {
        "uid" : {"name" :"&uid", "type" : "exists", "reset" : true},
        "page" : {"name" : "page", "type" : "exists", "reset" : true},
        "title" : {"name" : "title", "type" : "exists", "reset" : true}, 
        "location" : {"name" : "location", "type" : "exists", "reset" : false},
        "campaignId" : {"name" :"campaignId", "type" : "exists", "reset" : true},
        "campaignName" : {"name" :"campaignName", "type" : "exists", "reset" : true},
        "campaignSource" : {"name" : "campaignSource", "type" : "exists", "reset" : true},
        "campaignMedium" : {"name" : "campaignMedium", "type" : "exists", "reset" : true},
        "campaignContent" : {"name" : "campaignContent", "type" : "exists", "reset" : true},
        "campaignKeyword" : {"name" : "campaignKeyword", "type" : "exists", "reset" : true},
        "dataSource" : {"name" : "dataSource", "type" : "exists", "reset" : true}
      },
      prop;
      // allow one-off items to be reset if passed in
      if (custom_property && reset) {
        u.all("set", custom_property, "");
      }
      // loop through the known parameters, and either reset them if reset is true, or set them if not
      for (prop in utag.loader.GV(map)) {
          if (reset && map[prop].reset) {
            u.all("set", map[prop].name, "");
          } else {
            // handle "boolean" case
            if (map[prop].type === "bool") {
              if (data[prop] == true || data[prop] === "true") {
                u.all("set", map[prop].name, true);
              }
            } 
            // handle default case and just check if the parameter exists on u.data
            else if (map[prop].type === "exists") {
              if (data[prop]) {
                u.all("set", map[prop].name, data[prop]);
              }
            }
          }
      }
    };

    window.utag.tagsettings  = window.utag.tagsettings || {};
    window.utag.tagsettings.gua =  window.utag.tagsettings.gua  || {};
    window.utag.tagsettings.gua.trackernames =  window.utag.tagsettings.gua.trackernames  || 0;

      u.map={"gua_tracking_id":"account","spa_synthetic_page":"page","spa_synthetic_title":"title","spa_synthetic_url":"location","t_gua_enh_ecomm_action":"enh_action","t_gua_eventCategory":"eventCategory","t_gua_eventAction":"eventAction","t_gua_eventLabel":"eventLabel","t_gua_eventValue":"eventValue","t_new_registration_flg":"pageview-metric1","t_gua_login_flg":"link-metric2","t_euromillions_played_flag":"pageview-metric3","t_iwg_play_flag":"pageview-metric9","t_gua_dbg_played_advanced_play_flg":"pageview-metric16,link-metric16","t_gua_iwg_try_flg":"pageview-metric20","gbl_site_section":"pageview-dimension1,link-dimension1","gbl_page_type":"pageview-dimension2,link-dimension2","gbl_page_type:dbg_play_slip":"detail","gbl_page_type:iwg_preplay":"detail","gbl_page_type:dbg_play_confirmation":"add","t_gua_iwg_preplay_flg:1":"add","game_id":"pageview-dimension4,link-dimension4","game_name":"pageview-dimension5,link-dimension5","game_type":"pageview-dimension6,link-dimension6","dbg_draw_dates":"transaction-dimension11,link-dimension11","dbg_draw_day":"pageview-dimension12,link-dimension12","dbg_jackpot_amount":"pageview-dimension13,link-dimension13","player_id":"pageview-dimension15,link-dimension15","t_gua_user_has_logged_in_during_visit":"pageview-dimension17","t_user_has_ever_played_a_game":"pageview-dimension18","t_gua_user_has_ever_seen_results_section":"pageview-dimension19","gbl_content_type":"pageview-dimension3,link-dimension3","game_sub_type":"pageview-dimension7,link-dimension7","gbl_journey_name":"pageview-dimension8,link-dimension8","dbg_number_of_draws":"pageview-dimension10,link-dimension10","dbg_number_of_lines_per_draw":"transaction-dimension14,link-dimension14","horses_number_of_bets":"transaction-dimension14,link-dimension14","sports_number_of_bets":"transaction-dimension14,link-dimension14","player_verification_status":"pageview-dimension16,link-dimension16","my_account_wallet_payment_method_type":"pageview-dimension20","t_swiss_lotto_play_flg":"pageview-metric4","t_loto_express_play_flg":"pageview-metric5,link-metric5","t_trio_magic_play_flg":"pageview-metric6","t_joker_play_flg":"pageview-metric7","t_superstar_play_flg":"pageview-metric8","t_horses_play_flag":"pageview-metric10","t_sports_play_flg":"pageview-metric11","t_bango_play_flg":"pageview-metric12,link-metric12","t_my_account_wallet_load_success":"pageview-metric13","t_my_account_wallet_withdrawal_success":"pageview-metric15","my_account_wallet_load_amount":"pageview-metric14","t_gua_number_of_draws_played":"pageview-metric17,link-metric17","t_gua_dbg_number_of_lines_per_draw":"pageview-metric18,link-metric18","t_gua_sports_number_of_bets":"pageview-metric18,link-metric18","t_gua_horses_number_of_bets":"pageview-metric18,link-metric18","t_gua_subscriptions_flg":"pageview-metric19,link-metric19","t_game_breakdown":"pageview-dimension9,link-dimension9","slgt_horses_tag":"tag.pmu","slgt_pages_tag":"tag.pages","slgt_sports_tag":"tag.sports","slgt_deposit":"tag.deposit","slgt_logged_tag":"tag.logged","t_gua_player_login_event":"pageview-metric2"};
  u.extend=[function(a,b){ try{ if((typeof b['event_name']!='undefined'&&b['event_name'].toString().toLowerCase()=='error'.toLowerCase())){b['t_gua_eventCategory']='Errors';b['t_gua_eventAction']='Error Event';b['t_gua_eventLabel']=b['error_event']} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if(b['t_new_registration_flg'].toString().toLowerCase()=='1'.toLowerCase()){b['t_gua_eventCategory']='Registrations';b['t_gua_eventAction']='Register Account'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['event_type']!='undefined'&&b['event_type'].toString().toLowerCase()=='player_login'.toLowerCase())){b['t_gua_eventCategory']='Logins';b['t_gua_eventAction']='Login to Site';b['t_gua_login_flg']='1'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['order_total_amount']!='undefined'&&typeof b['order_total_amount']!='undefined'&&b['order_total_amount']!='')){b['t_gua_eventCategory']='Play';try{b['t_gua_eventAction']="Play - " + b.game_type}catch(e){};try{b['t_gua_eventLabel']=b.game_name}catch(e){};try{b['t_gua_eventValue']=parseInt(b['order_total_amount'],10)}catch(e){};b['t_gua_game_play_flg']='Y'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['iwg_play_outcome']!='undefined'&&typeof b['iwg_play_outcome']!='undefined'&&b['iwg_play_outcome']!='')){b['t_gua_eventCategory']='IWG Play Outcomes';b['t_gua_eventAction']=b['iwg_play_outcome'];b['t_gua_eventLabel']=b['game_name']} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['iwg_try_outcome']!='undefined'&&typeof b['iwg_try_outcome']!='undefined'&&b['iwg_try_outcome']!='')){b['t_gua_eventCategory']='IWG Try Outcomes';b['t_gua_eventAction']=b['iwg_play_outcome'];b['t_gua_eventLabel']=b['game_name']} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['my_account_wallet_load_amount']!='undefined'&&b['my_account_wallet_load_success'].toString().toLowerCase()=='true'.toLowerCase())){b['t_gua_eventCategory']='Wallet';b['t_gua_eventAction']='Add Funds';b['t_gua_eventLabel']='My Account';try{b['t_gua_eventValue']=parseInt(b['my_account_wallet_load_amount'],10)}catch(e){}} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['my_account_wallet_withdrawal_amount']!='undefined'&&b['my_account_wallet_load_success'].toString().toLowerCase()=='true'.toLowerCase())){b['t_gua_eventCategory']='Wallet';b['t_gua_eventAction']='Withdraw Funds';b['t_gua_eventLabel']='My Account';try{b['t_gua_eventValue']=parseInt(b['my_account_wallet_withdrawal_amount'],10)}catch(e){}} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((b['dom.url'].toString().toLowerCase().indexOf('results'.toLowerCase())>-1&&b['dom.url'].toString().toLowerCase().indexOf('b.game_name'.toLowerCase())>-1)){b['t_gua_eventCategory']='Results';b['t_gua_eventAction']='Checked Results';b['t_gua_eventLabel']=b['game_name']} } catch(e){ utag.DB(e) }  },
function(a,b,c,d,e,f,g){d=b['gbl_page_type'];if(typeof d=='undefined')return;c=[{'dbg_playslip':'detail'},{'instant_win_information':'detail'},{'dbg_play_confirmation':'add'},{'instant_win_purchase_confirmation':'add'}];var m=false;for(e=0;e<c.length;e++){for(f in c[e]){if(d==f){b['t_gua_enh_ecomm_action']=c[e][f];m=true};};if(m)break};},
function(a,b){ try{ if((typeof b['dbg_number_of_draws']!='undefined'&&typeof b['order_id']!='undefined'&&parseFloat(b['dbg_number_of_draws'])>parseFloat(1))){b['t_gua_dbg_played_advanced_play_flg']='1'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['dbg_number_of_lines_per_draw']!='undefined'&&typeof b['order_id']!='undefined')){b['t_gua_dbg_number_of_lines_per_draw']=b['dbg_number_of_lines_per_draw']} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['dbg_number_of_draws']!='undefined'&&typeof b['order_id']!='undefined'&&b['dbg_number_of_draws'].toString().toLowerCase()!='continuous'.toLowerCase())){b['t_gua_number_of_draws_played']=b['dbg_number_of_draws']} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['dbg_number_of_draws']!='undefined'&&typeof b['order_id']!='undefined'&&b['dbg_number_of_draws'].toString().toLowerCase()=='continuous'.toLowerCase())){b['t_gua_subscriptions_flg']='1'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['horses_number_of_bets']!='undefined'&&typeof b['order_id']!='undefined')){b['t_gua_horses_number_of_bets']=b['horses_number_of_bets']} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['sports_number_of_bets']!='undefined'&&typeof b['order_id']!='undefined')){b['t_gua_sports_number_of_bets']=b['sports_number_of_bets']} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['gbl_page_type']!='undefined'&&typeof b['game_type']!='undefined'&&b['gbl_page_type'].toString().toLowerCase()=='try_game'.toLowerCase()&&b['game_type'].toString().toLowerCase()=='iwg'.toLowerCase())){b['t_gua_iwg_try_flg']='1';b['t_gua_eventCategory']='Try';b['t_gua_eventAction']='IWG';b['t_gua_eventLabel']=b['game_name']} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['gbl_content_type']!='undefined'&&b['gbl_content_type'].toString().toLowerCase()=='results'.toLowerCase())){b['t_gua_results_section_flg']='Y'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if(b['t_dailymillion_played_flg']=='1'){b['t_gua_eventCategory']='Play';b['t_gua_eventAction']='Play DM';b['t_gua_eventLabel']='DBG';try{b['t_gua_eventValue']=parseInt(b['game_cost'],10)}catch(e){}} } catch(e){ utag.DB(e) }  },
function(a,b){
if (b['t_iwg_play_flag'] == '1'){
  //raise an event back to tag 6, GUA  
  utag.link({t_gua_eventCategory : 'IWG Play Outcomes', t_gua_eventAction : b['iwg_play_outcome'], t_gua_eventLabel : b['game_name']},null,[6]);
}
},
function(a,b){ try{ if((typeof b['event_name']!='undefined'&&b['event_name'].toString().toLowerCase()=='close_account'.toLowerCase())){b['t_gua_eventCategory']='My Account';b['t_gua_eventAction']='Close Account'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['event_name']!='undefined'&&b['event_name'].toString().toLowerCase()=='suspend_account'.toLowerCase())){b['t_gua_eventCategory']='My Account';b['t_gua_eventAction']='Suspend Account'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['has_edited_account_details']!='undefined'&&b['has_edited_account_details'].toString().toLowerCase()=='Y'.toLowerCase())){b['t_gua_eventCategory']='My Account';b['t_gua_eventAction']='Edit Acount Details'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['event_name']!='undefined'&&b['event_name'].toString().toLowerCase()=='iwg_play_unfinished_game'.toLowerCase())){b['t_gua_eventCategory']='My Account';b['t_gua_eventAction']='Play Unfinished Games'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['event_name']!='undefined'&&b['event_name'].toString().toLowerCase()=='lock_game'.toLowerCase())){b['t_gua_eventCategory']='My Account';b['t_gua_eventAction']='Lock Games';b['t_gua_eventLabel']=b['locked_games']} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['gbl_page_type']!='undefined'&&typeof b['order_id']=='undefined'&&b['gbl_page_type'].toString().toLowerCase()=='play_game'.toLowerCase())){b['t_gua_iwg_preplay_flg']='1'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if(b['t_millionaire_raffle_played_flg']=='1'){try{b['dbg_nb_lines']=''}catch(e){}} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if(b['t_gua_game_play_flg']=='Y'){if(typeof b['cp.utag_main_has_ever_played_game']=='undefined'){utag.loader.SC('utag_main',{'has_ever_played_game':b['t_gua_game_play_flg']});b['cp.utag_main_has_ever_played_game']=b['t_gua_game_play_flg'];}}} catch(e){ utag.DB(e) } },
function(a,b){ try{ if(b['t_gua_results_section_flg']=='Y'){if(typeof b['cp.utag_main_has_ever_seen_results_section']=='undefined'){utag.loader.SC('utag_main',{'has_ever_seen_results_section':b['t_gua_results_section_flg']});b['cp.utag_main_has_ever_seen_results_section']=b['t_gua_results_section_flg'];}}} catch(e){ utag.DB(e) } },
function(a,b){ try{ if(1){try{b['t_user_has_ever_played_a_game']=b['cp.utag_main_has_ever_played_game'] == 'Y' ? 'Y' : 'N'}catch(e){}} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if(1){try{b['t_gua_user_has_ever_seen_results_section']=b['cp.utag_main_has_ever_seen_results_section'] == 'Y' ? 'Y': 'N'}catch(e){}} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['event_name']!='undefined'&&b['event_name'].toString().toLowerCase()=='card_added_event'.toLowerCase()&&typeof b['gbl_site_section']!='undefined'&&b['gbl_site_section'].toString().toLowerCase()=='My Account'.toLowerCase())){b['t_gua_card_added_flg']='1';b['t_gua_eventCategory']='My Account';b['t_gua_eventAction']='Edit Payment Details'} } catch(e){ utag.DB(e) }  },
function(a,b){
if (b['page_type'] == 'results_outcome'){

if (b['dbg_results_check_raffle'] == 'Y'){
  //raise an event back to tag 6, GUA  
  utag.link({t_gua_eventCategory : 'Results',
	     t_gua_eventAction : 'Check Raffle',
	     t_gua_eventLabel : b['cp.utag_main_last_game_on_check_ticket']},
	    null,[6]);
}

if (b['dbg_results_check_numbers'] == 'Y'){
  //raise an event back to tag 6, GUA  
  utag.link({t_gua_eventCategory : 'Check Results Ticket Outcome',
	     t_gua_eventAction : b['dbg_results_check_numbers_outcome'],
	     t_gua_eventLabel : b['cp.utag_main_last_game_on_check_ticket'],
	     t_gua_eventValue : parseInt(b['dbg_check_search_lines'],10)},
	    null,[6]);
}

if (b['dbg_results_check_raffle'] == 'Y'){
  //raise an event back to tag 6, GUA  
  utag.link({t_gua_eventCategory : 'Check Raffle Ticket Outcome',
	     t_gua_eventAction : b['dbg_results_check_raffle_outcome'],
	     t_gua_eventLabel : b['cp.utag_main_last_game_on_check_ticket']},
	    null,[6]);
}
}
},
function(a,b){ try{ if((typeof b['gbl_page_type']!='undefined'&&b['gbl_page_type'].toString().toLowerCase()=='check_results_page'.toLowerCase())){utag.loader.SC('utag_main',{'last_game_on_check_ticket':b['qp.game']+';exp-session'});b['cp.utag_main_last_game_on_check_ticket']=b['qp.game'];}} catch(e){ utag.DB(e) } },
function(a,b){ try{ if((typeof b['qp.game']=='undefined'&&typeof b['gbl_page_type']!='undefined'&&/^(check_results_page|view_results_page)$/i.test(b['gbl_page_type']))){b['qp.game']='lotto'} } catch(e){ utag.DB(e) }  },
function(a,b){ try{ if((typeof b['game_name']!='undefined'&&b['game_name'].toString().toLowerCase()=='Daily Million'.toLowerCase())){b['gua_dbg_dm_draw_time']=b['dbg_dm_draw_time']} } catch(e){ utag.DB(e) }  },
function(a,b,c,d,e,f,g){d=b['ut.env'];if(typeof d=='undefined')return;c=[{'dev':'UA-54466756-2'},{'qa':'UA-54466756-2'},{'prod':'UA-54466756-4'}];var m=false;for(e=0;e<c.length;e++){for(f in c[e]){if(d==f){b['gua_tracking_id']=c[e][f];m=true};};if(m)break};if(!m)b['gua_tracking_id']='UA-54466756-2';}];

    u.send = function(a, b) {
      if (u.ev[a] || u.ev.all !== undefined) {
        //##UTENABLEDEBUG##utag.DB("send:##UTID##");
        u.o = window[window.GoogleAnalyticsObject];
        b.ga_events = b.ga_events || []; // this has been superseded by u.data.ga_events. keeping for backward compatibility.
        var c, d, e, f, g, h, tn, prop;

        if (u.data && u.data.name) {
          tn = u.data.name;
        }

        u.data = {
          "qsp_delim": "&",
          "kvp_delim": "=",
          "base_url": "",
          "a": a,
          "cookieDomain": "" || utag.loader.lh(),
          "name": tn || "",
          "account": "UA-54466756-4",
          "anonymizeIp": "false",
          "allowLinker": "false",
          "crossDomainTrack": "",
          "enhancedLinkAttribution": "false",
          "enhancedecommerce": "true",
          "displayfeatures": "false",
          "screenView": "false",
          "optimizely": "false",
          "init_before_extensions": "false",
          "autofill_params": "true",
          "autosend_events": "true" || "true",
          "clear_global_vars" : "false",
          // Enhanced E-Commerce
          "enh_action": "",
          "enh_event_cb": "",
          "enh_checkout_step": "",
          "enh_checkout_option": "",
          "product_action_list": "",
          "product_variant": [],
          "enh_impression_id": [],
          "enh_impression_name": [],
          "enh_impression_price": [],
          "enh_impression_category": [],
          "enh_impression_brand": [],
          "enh_impression_variant": [],
          "enh_impression_list": [],
          "enh_impression_position": [],
          "enh_promo_id": [],
          "enh_promo_name": [],
          "enh_promo_creative": [],
          "enh_promo_position": [],
          // E-Commerce Vars
          "id": "",
          "product_id": [],
          "product_name": [],
          "product_brand": [],
          "product_category": [],
          "product_quantity": [],
          "product_unit_price": [],
          "product_discount": [],
          "product_position": [],
          "ga_events": [],
          "sessionControl": "",
          "set": {}
        };

        if (u.data.init_before_extensions === "true") {
          u.createTracker();
          u.initTracker();
        }

        for(c=0;c<u.extend.length;c++){try{d=u.extend[c](a,b);if(d==false)return}catch(e){}};

        c = [];

        // Start Mapping
        for (d in utag.loader.GV(u.map)) {
          if (b[d] !== undefined && b[d] !== "") {
            e = u.map[d].split(",");
            for (f = 0; f < e.length; f++) {
              if (e[f].indexOf("a.") === 0) {
                u.data["a"][e[f].substring(2)] = b[d];
              } else if (e[f].indexOf("set.") === 0) {
                  u.data.set[e[f].substring(4)] = b[d];
              } else {
                u.data[e[f]] = b[d];
              }
            }
          } else {
            h = d.split(":");
            if(h.length === 2 && b[h[0]] === h[1]){
              if(u.map[d]){
                u.data.enh_action = u.map[d];
              }
            }
          }
        }
        // End Mapping
        // handle mapped events. check b.ga_events for backward compatibility with the old template. new users should always use the mapping toolbox to set ga_events
        if (u.typeOf(u.data.ga_events) === "array" && u.typeOf(b.ga_events) === "array") {
          if (u.data.ga_events.length === 0 && b.ga_events.length > 0) {
            u.data.ga_events = b.ga_events;
          } else if (u.data.ga_events.length > 0 && b.ga_events.length > 0) {
            u.data.ga_events = u.data.ga_events.concat(b.ga_events); // if we have both ga_events AND u.data.ga_events, then join them together so we don't lose anything
          }
        }

        u.data.order_id = u.data.order_id || b._corder || "";
        u.data.order_total = u.data.order_total || b._ctotal || "";
        u.data.order_shipping = u.data.order_shipping || b._cship || "";
        u.data.order_tax = u.data.order_tax || b._ctax || "";
        u.data.order_store = u.data.order_store || b._cstore || "";
        u.data.order_currency = u.data.order_currency || b._ccurrency || "";
        u.data.order_coupon_code = u.data.order_coupon_code || b._cpromo || "";
        if (u.data.product_id.length === 0 && b._cprod !== undefined) { u.data.product_id = b._cprod.slice(0); }
        if (u.data.product_name.length === 0 && b._cprodname !== undefined) { u.data.product_name = b._cprodname.slice(0); }
        if (u.data.product_brand.length === 0 && b._cbrand !== undefined) { u.data.product_brand = b._cbrand.slice(0); }
        if (u.data.product_category.length === 0 && b._ccat !== undefined) { u.data.product_category = b._ccat.slice(0); }
        if (u.data.product_quantity.length === 0 && b._cquan !== undefined) { u.data.product_quantity = b._cquan.slice(0); }
        if (u.data.product_unit_price.length === 0 && b._cprice !== undefined) { u.data.product_unit_price = b._cprice.slice(0); }
        if (u.data.product_discount.length === 0 && b._cpdisc !== undefined) { u.data.product_discount = b._cpdisc.slice(0); }

        if (u.data.init_before_extensions !== "true") {
          u.createTracker();
          u.initTracker();
        }

        if (u.data.enhancedecommerce === "true" && !u.required["ec"]) {
          u.required["ec"] = !0;
          u.all("require", "ec");
        }

        // mobile
        u.data.app_id = u.data.app_id || u.data.appId || b.app_id;
        u.data.app_name = u.data.app_name || u.data.appName || b.app_name;
        u.data.app_version = u.data.app_version || u.data.appVersion || b.app_version;
        u.data.app_rdns = u.data.app_rdns || u.data.appInstallerId || b.app_rdns;
        u.data.screen_title = u.data.screen_title || u.data.screenName || b.screen_title;

        //changed to allow app information to be sent on events and page views
        if (u.data.app_id || u.data.app_name) {
          g = {};
          g.appName = u.data.app_name;
          g.appId = u.data.app_id || "";
          g.appVersion = u.data.app_version;
          g.appInstallerId = u.data.app_rdns;
          u.all("set", g);
        }

        //Moved out of screenview block as valid for all types
        u.data.exception_reason = u.data.exception_reason || b.exception_reason;
        if (u.data.exception_reason) {
          g = {};
          g.exDescription = u.data.exception_reason;
          g.exFatal = true;
          u.all("send", "exception", g);
        }

        if (u.data.allowLinker === "true" || u.data.allowLinker === true ) {
          if (!u.required["linker"]) {
            u.all("require", "linker");
            u.required["linker"] = !0;
          }

          if (u.data.crossDomainTrack) {
            if (u.typeOf(u.data.crossDomainTrack) === "string") {
              u.data.crossDomainTrack = u.data.crossDomainTrack.replace(/\s/g, '').split(',');
            }
            u.all("linker:autoLink", u.data.crossDomainTrack);
          }
        }

        // clear globally set vars 
        if (u.data.clear_global_vars === "true") {
          u.setGlobalProperties(u.data, true);  
          // clear custom vars set via "set.xxx"
          for (prop in utag.loader.GV(u.data.set)) {
            u.setGlobalProperties(u.data, true, prop);
          }
        }
        // now set the global properties with what's been passed into this utag.view/link hit
        u.setGlobalProperties(u.data, false);

        if (u.data.anonymizeIp === "true" || u.data.anonymizeIp === true ) {u.all("set", 'anonymizeIp', true);}
        if (u.data.uid) {u.all("set", "&uid", u.data.uid);}
        if (u.data.page) {u.all("set", "page", u.data.page);}
        if (u.data.title) {u.all("set", "title", u.data.title);}
        if (u.data.location) {u.all("set", "location", u.data.location);}
        if (u.data.campaignId) {u.all("set", "campaignId", u.data.campaignId);}
        if (u.data.campaignName) {u.all("set", "campaignName", u.data.campaignName);}
        if (u.data.campaignSource) {u.all("set", "campaignSource", u.data.campaignSource);}
        if (u.data.campaignMedium) {u.all("set", "campaignMedium", u.data.campaignMedium);}
        if (u.data.campaignContent) {u.all("set", "campaignContent", u.data.campaignContent);}
        if (u.data.campaignKeyword) {u.all("set", "campaignKeyword", u.data.campaignKeyword);}
        if (u.data.displayfeatures === "true" || u.data.displayfeatures === true) {
          if (!u.required["displayfeatures"]) {
            u.required["displayfeatures"] = !0;
            u.all("require", "displayfeatures");
          }
        } else {
          u.all("set", "displayFeaturesTask", null); 
        }
        if (u.data.dataSource) {u.all("set", "dataSource", u.data.dataSource);}
        for (prop in utag.loader.GV(u.data.set)) {
          u.all("set", prop, u.data.set[prop]);
        }


        u.data.transaction_events = {};
        u.data.pageview_events = {};
        u.data.link_events = {};
        u.data.enhecom_events = {};
        for (d in utag.loader.GV(u.data)) {
          if (d.indexOf("-") > -1 && (d.indexOf("metric") > -1 || d.indexOf("dimension") > -1 || d.indexOf("contentGroup") > -1)) {
            //new functionality to accept different mapping types
            //u.all("set", d, u[d]);
            if (d.indexOf("transaction-") === 0) {
              u.data.transaction_events[d] = u.data[d];
            } else if (d.indexOf("pageview-") === 0) {
              u.data.pageview_events[d] = u.data[d];
            } else if (d.indexOf("link-") === 0) {
              u.data.link_events[d] = u.data[d];
            } else if (u.data.enhancedecommerce === "true" && d.indexOf("enh_") === 0) {
              u.data.enhecom_events[d] = u.data[d];
            }
          } else if (d.indexOf("metric") === 0 || d.indexOf("dimension") === 0 || d.indexOf("contentGroup") === 0) {
            //old functionality
            u.all("set", d, u.data[d]);
          }
        }

        // Enhanced Link Attribution
        if (u.data.enhancedLinkAttribution === "true") {
          if (!u.required["enhancedLinkAttribution"]) {
            u.required["enhancedLinkAttribution"] = !0;
            u.all("require", "linkid", "linkid.js");
          }
        }

        u.data.order_id = (u.data.order_id ? u.data.order_id : u.data.id);

        //  begin Enhanced Ecommerce block
        if (u.data.enhancedecommerce === "true") {

          // set currency if mapped
          u.all("set", '&cu', (u.data.currency ? u.data.currency : u.data.order_currency));
          // ENH: REFUND start
          if (u.data.order_id && u.data.enh_action === "refund") {
            if (u.data.order_id instanceof Array && u.data.order_id.length > 0) {
              u.data.order_id = u.data.order_id[0];
            }
            for (f = 0; f < u.data.product_id.length; f++) {
              g = {};
              g.id = u.data.product_id[f];
              g.quantity = (u.data.product_quantity[f] ? u.data.product_quantity[f] : "1");
              u.setHitData(g, "enhecom_events", "product_refund", f);
              u.all('ec:addProduct', g);
            }

            g = {};
            g.id = u.data.order_id;
            u.setHitData(g, "enhecom_events", "refund");
            u.all('ec:setAction', 'refund', g);
            // ENH: REFUND end
          }
          //ENH: ORDER start
          else if (u.data.order_id) {
            if (u.data.order_id instanceof Array && u.data.order_id.length > 0) {
              u.data.order_id = u.data.order_id[0];
            }
            u.addproduct("product_purchase", u.data.product_id.length, false);
            g = {};
            g.id = u.data.order_id;
            g.affiliation = (u.data.affiliation ? u.data.affiliation : u.data.order_store);
            g.revenue = (u.data.revenue ? u.data.revenue : u.data.order_total);
            g.shipping = (u.data.shipping ? u.data.shipping : u.data.order_shipping);
            g.tax = (u.data.tax ? u.data.tax : u.data.order_tax);
            g.coupon = (u.data.coupon ? u.data.coupon : u.data.order_coupon_code);
            u.setHitData(g, "enhecom_events", "purchase");
            u.all('ec:setAction', 'purchase', g);
            // ENH: ORDER end
          }
          // ENH: PRODUCT CLICK start
          else if (u.data.enh_action === "product_click" && u.data.a === "link") {
            u.addproduct("product_click", 1, false);
            u.all('ec:setAction', 'click', {list: u.data.product_action_list});
            if (u.data.autosend_events === "true"){
              u.all('send', 'event', 'UX', 'click', 'Results', {'hitCallback': u.data.enh_event_cb});
            }
            // ENH: PRODUCT CLICK end
          }
          // ENH: DETAIL start
          else if (u.data.enh_action === "detail") {
            u.addproduct("detail", 1, false);
            g = {};
            u.setHitData(g,"list", u.data.product_action_list);
            u.all("ec:setAction", "detail");
            // ENH: DETAIL end
          }
          // ENH: PRODUCT ADD start
          else if (u.data.enh_action === "add") {
            u.addproduct("product_add", u.data.product_id.length, false);
            // does not support custom metrics and dimensions! (ref: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#enhanced-ecomm)
            u.all('ec:setAction', 'add', {list: u.data.product_action_list});
            if (u.data.a === "link" && u.data.autosend_events === "true") {
              u.all('send', 'event', 'UX', 'click', 'add to cart', {'hitCallback': u.data.enh_event_cb});
            }
            // ENH: PRODUCT ADD end
          }
          // ENH: PRODUCT REMOVE start
          else if (u.data.enh_action === "remove") {
            u.addproduct("product_remove", u.data.product_id.length, false);
            // does not support custom metrics and dimensions! (ref: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#enhanced-ecomm)
            u.all('ec:setAction', 'remove');
            if (u.data.a === "link" && u.data.autosend_events === "true") {
              u.all('send', 'event', 'UX', 'click', 'remove from cart', {'hitCallback': u.data.enh_event_cb});
            }
            // ENH: PRODUCT REMOVE end
          }
          // ENH: CHECKOUT start
          else if (u.data.enh_action === "checkout") {
            u.addproduct("product_checkout", u.data.product_id.length, false);
            g = {};
            // does not support custom metrics and dimensions! (ref: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#enhanced-ecomm)
            g.step = u.data.enh_checkout_step || "1";
            g.option = u.data.enh_checkout_option;
            u.all('ec:setAction', u.data.enh_action, g);
            // ENH: CHECKOUT end
          }
          // ENH: CHECKOUT OPTION start
          if (u.data.enh_action === "checkout_option" && u.data.a === "link") {
            g = {};
            // does not support custom metrics and dimensions! (ref: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#enhanced-ecomm)
            g.step = u.data.enh_checkout_step || "1";
            g.option = u.data.enh_checkout_option;
            u.all('ec:setAction', u.data.enh_action, g);
            if (u.data.autosend_events === "true") {
              u.all('send', 'event', 'Checkout', 'Option', {'hitCallback': u.data.enh_event_cb});
            }
            // ENH: CHECKOUT OPTION end
          }
          // ENH: ADD IMPRESSION start
          if (u.data.enh_impression_id) {
            u.addproduct("product_impression", u.data.enh_impression_id.length, true);
            // ENH: ADD IMPRESSION end
          }
          // ENH: ADD PROMO start
          // does not support custom metrics and dimensions! (ref: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#enhanced-ecomm)
          if (u.data.enh_promo_id) {
            // if you are sending a promo on a "link", you must make sure to send a GA event alongside it (i.e. map event_action and event_category)
            u.addpromo(u.data.enh_action, u.data.a);

            // ENH: ADD PROMO end
          }
          // ENH: SEND PAGEVIEW & ASSOCIATED EVENTS
          g = {};

          if (u.data.order_id) {
            u.setHitData(g, "transaction_events");
          }

          u.setHitData(g, "pageview_events");

          //Session Control
          //Used to control the session duration. A value of 'start' forces a new session to start with this hit and 'end' forces the current session to end with this hit. All other values are ignored.
          if (u.data.sessionControl === "start" || u.data.sessionControl === "end"){
            g.sessionControl = u.data.sessionControl;
          }

          if (u.data.a === "view") {
            if (u.data.screenView === "true" || u.data.screenView === true) {
              g.screenName = u.data.screen_title || "";
              u.all("send", "screenview", g);
            } else {
              g.hitType = "pageview";
              u.all("send", g); // Send page view request
            }
          }
          // end enhanced e-commerce block
        } else if (u.data.a === "view") {
          // begin standard page view block (enhanced e-commerce disabled)
          g = {};
          u.setHitData(g, "pageview_events");

          if (u.data.sessionControl === "start" || u.data.sessionControl === "end"){
            g.sessionControl = u.data.sessionControl;
          }

          if (u.data.screenView === "true" || u.data.screenView === true) {
            g.screenName = u.data.screen_title || "";
            u.all("send", "screenview", g);
          } else {
            g.hitType = "pageview";
            u.all("send", g); // Send page view request
          }

          if (u.data.order_id && !(u.data.order_id instanceof Array)) {
            if (!u.required["ecommerce"]) {
              u.required["ecommerce"] = !0;
              u.all("require", "ecommerce", "ecommerce.js");
            }
            g = {};
            u.setHitData(g, "transaction_events");
            g.id = u.data.order_id;
            g.affiliation = (u.data.affiliation ? u.data.affiliation : u.data.order_store);
            g.revenue = (u.data.revenue ? u.data.revenue : u.data.order_total);
            g.shipping = (u.data.shipping ? u.data.shipping : u.data.order_shipping);
            g.tax = (u.data.tax ? u.data.tax : u.data.order_tax);
            g.currency = (u.data.currency ? u.data.currency : u.data.order_currency);
            u.all('ecommerce:addTransaction', g);

            for (f = 0; f < u.data.product_id.length; f++) {
              g = {};
              g.id = u.data.order_id;
              g.sku = u.data.product_id[f];
              g.name = (u.data.product_name[f] ? u.data.product_name[f] : u.data.product_id[f]);
              g.category = (u.data.product_category[f] ? u.data.product_category[f] : "");
              g.price = (u.data.product_unit_price[f] ? u.data.product_unit_price[f] : "1.00");
              g.quantity = (u.data.product_quantity[f] ? u.data.product_quantity[f] : "1");
              u.setHitData(g, "transaction_events");
              u.all('ecommerce:addItem', g);
            }
            u.all('ecommerce:send');
          } else if (u.data.order_id instanceof Array && u.data.order_id.length > 0) {
            if (!u.required["ecommerce"]) {
              u.required["ecommerce"] = !0;
              u.all("require", "ecommerce", "ecommerce.js");
            }
            // an array of order ids will fire multiple transacations
            var lastindex = 0;
            for (f = 0; f < u.data.order_id.length; f++) {

              if (f === u.data.order_id.length - 1 || (u.data.order_id[f] !== u.data.order_id[f + 1])) {
                g = {};
                u.setHitData(g, "transaction_events");
                g.id = u.data.order_id[f];
                g.affiliation = (u.data.affiliation && typeof u.data.affiliation[f] !== "undefined" ? u.data.affiliation[f] : u.data.order_store);
                g.revenue = (u.data.revenue && typeof u.data.revenue[f] !== "undefined" ? u.data.revenue[f] : u.data.order_total);
                g.shipping = (u.data.shipping && typeof u.data.shipping[f] !== "undefined" ? u.data.shipping[f] : u.data.order_shipping);
                g.tax = (u.data.tax && typeof u.data.tax[f] !== "undefined" ? u.data.tax[f] : u.data.order_tax);
                g.currency = (u.data.currency ? u.data.currency : u.data.order_currency);
                u.all('ecommerce:addTransaction', g);

                for (e = lastindex; e < f + 1; e++) {
                  g = {};
                  g.id = u.data.order_id[f];
                  g.sku = u.data.product_id[e];
                  g.name = (u.data.product_name[e] ? u.data.product_name[e] : u.data.product_id[e]);
                  g.category = (u.data.product_category[e] ? u.data.product_category[e] : "");
                  g.price = (u.data.product_unit_price[e] ? u.data.product_unit_price[e] : "1.00");
                  g.quantity = (u.data.product_quantity[e] ? u.data.product_quantity[e] : "1");
                  u.setHitData(g, "transaction_events");
                  u.all('ecommerce:addItem', g);
                }
                lastindex = f + 1;
              }
            }
            u.all('ecommerce:send');
          }
          // end standard page view block
        }
        // begin event logic
        if (u.data.eventCategory && u.data.eventAction) {
          g = {};
          u.setHitData(g, "link_events");
          g.hitType = "event";
          g.eventCategory = u.data.eventCategory;
          if (u.data.nonInteraction) {g.nonInteraction = 1;}
          g.eventAction = u.data.eventAction;
          if (u.data.eventLabel) {
            g.eventLabel = u.data.eventLabel;
          }
          if (typeof u.data.eventValue !== "undefined" && u.data.eventValue !== "") {
            g.eventValue = u.data.eventValue;
          }
          if ( u.data.standard_event_cb ) {
            g.hitCallback = u.data.standard_event_cb;    
          }
          // send screenName on event call when mapped
          if (u.data.screenView === "true" || u.data.screenView === true) {
            g.screenName = u.data.screen_title || "";
          }
          if (u.data.sessionControl === "start" || u.data.sessionControl === "end"){
            g.sessionControl = u.data.sessionControl;
          }
          u.all("send", g);
          // clear variables after each event
          u.data.eventCategory = u.data.eventAction = u.data.eventLabel = u.data.eventValue = "";
        }

        for (e = 0; e < u.data.ga_events.length; e++) {
          g = {};
          u.setHitData(g, "link_events");
          g.hitType = "event";
          g.eventCategory = u.data.ga_events[e].eventCategory;
          g.eventAction = u.data.ga_events[e].eventAction;
          g.eventLabel = u.data.ga_events[e].eventLabel;
          g.eventValue = u.data.ga_events[e].eventValue;
          if (u.data.ga_events[e].nonInteraction) {g.nonInteraction = 1;}
          if (u.data.sessionControl === "start" || u.data.sessionControl === "end"){
            g.sessionControl = u.data.sessionControl;
          }
          u.all("send", g);
        }
        // end event logic
        if (u.data.socialNetwork && u.data.socialAction && u.data.socialTarget) {
          g = {};
          g.hitType = "social";
          g.socialNetwork = u.data.socialNetwork;
          g.socialAction = u.data.socialAction;
          g.socialTarget = u.data.socialTarget;
          u.all("send", g);
          u.data.socialNetwork = u.data.socialAction = u.data.socialTarget = "";
        }

        if (u.data.timingCategory && u.data.timingVar && u.data.timingValue) {
          g = {};
          g.hitType = "timing";
          g.timingCategory = u.data.timingCategory;
          g.timingVar = u.data.timingVar;
          g.timingValue = u.data.timingValue;
          g.timingLabel = u.data.timingLabel || "";
          u.all("send", g);
        }

        // Map account ID to ga-disable to disable tracking for that account
        if (u.data["ga-disable"]) {
          window["ga-disable-" + u.data["ga-disable"]] = true;
        }

        (function() {
          var id = 'tealium-tag-7110';
          if (document.getElementById(id)) { return;}
          u.loader({"type": "script",  "src": 'https://www.google-analytics.com/analytics.js',  "loc": "script", "id": id });
          u.o.l = 1 * new Date(); //This is required by Google. Current tiemstamp
        })();

        //##UTENABLEDEBUG##utag.DB("send:##UTID##:COMPLETE");
      }
    };
    utag.o[loader].loader.LOAD(id);
  }('6', 'loro.main'));
} catch (error) {
  utag.DB(error);
}
//end tealium universal tag
