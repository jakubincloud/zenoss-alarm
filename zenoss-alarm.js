// ==UserScript==
// @name           Zenoss Sound Notify
// @namespace      jakubzygmunt!
// @version        1.1
// @description    Plays a wav sound file to notify you when critical .
// @include        http://zenoss.cloudreach.co.uk:8080/zport/dmd/Events/evconsole
// ==/UserScript==


var ausrc = 'https://github.com/jakubincloud/zenoss-alarm/raw/master/sound/zenoss-alarm.wav';
var au = document.createElement('audio');
au.setAttribute('src', ausrc);
au.setAttribute('id', 'GMwavaudio');
document.body.appendChild(au);

var canvas_frame = document.getElementById('center');

if(canvas_frame){
    var doc, interval_1, interval_2, cache = Array(),
        getDeviceName = function(htmlObject) {
            a = htmlObject.parentElement.parentElement.parentElement.children[2].getElementsByTagName('a')[0];
            return a.innerText;
        },
        loopThroughElements = function(htmlArray) {
            var len = htmlArray.length,
                cache_time = 30 * 60, // 30 minutes
                playSound = false;

            for (var i = 0; i < len; i++) {
                var device_name = getDeviceName(htmlArray[i]);
                if (cache[device_name] == undefined) {
                    cache[device_name] = {last_time:0, count:0};
                }
                var current_time = Math.floor(new Date().getTime()/1000);
                if ( current_time - cache[device_name].last_time >= cache_time) {
                    cache[device_name].count = 0;
                }
                if (cache[device_name].count < 5  ) {
                    cache[device_name].count++;
                    cache[device_name].last_time = current_time;
                    playSound = true;
                }
            }
            return playSound;
        };


    // wait for frame to load
    interval_1 = window.setInterval(function(){
        var cpc = document.getElementById('center_panel_container');

        if(cpc){
            window.clearInterval(interval_1);
            interval_2 = window.setInterval(function() {
                var critical_icons = cpc.getElementsByClassName('severity-icon-small critical');
                var playSound = loopThroughElements(critical_icons);
                if (playSound) {
                    au.play();


                }
            },10000); //every 10 seconds seems reasonable


        }
    },2000);
}