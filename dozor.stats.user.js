// ==UserScript==
// @name         Dozor stats
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       sancho
// @downloadURL  https://raw.githubusercontent.com/sancho2934489/dozor-stats/master/dozor.stats.user.js
// @match        http://*.dzzzr.ru/*/?section=arc&gmid=*&what=stat
// @require 	 https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var shapka = $('#suxx').find('#shapka').find('th').find('a');
    var virt = [];
    var pole = [];
    var el, text;

    for (var i = 0; i < shapka.length; i++) {
        el = shapka[i];
        text = $(el).text();

        if (text.toLowerCase().indexOf('команды') != -1 || text.toLowerCase().indexOf('общее время') != -1)
            continue;

        $(el).parent().append('<br><input type="checkbox" data-id="' + i + '" class="virt" id="virt_' + i + '"><label for="virt_' + i + '">вирт</label>');
        $(el).parent().append('<br><input type="checkbox" data-id="' + i + '" class="pole" id="pole_' + i + '"><label for="pole_' + i + '">поле</label>');

        if ($('#virt_' + i).attr('checked') == 'checked')
            virt.push(i);

        if ($('#pole_' + i).attr('checked') == 'checked')
            pole.push(i);
    }

    $('#suxx').find('#shapka').append('<th>Время по полю</th>');
    $('#suxx').find('#shapka').append('<th>Время по штабу(виртуалки)</th>');

    var commands = $('#suxx').find('tr:not(#shapka)');
    var times, arText, secondsVirt, secondsPole, hourVirt, hourPole, minutePole, minuteVirt;

    for (i = 0; i < commands.length; i++) {
        times = $(commands[i]).find('td span span');
        secondsVirt = 0;
        secondsPole = 0;
        hourPole = 0;
        hourVirt = 0;
        minutePole = 0;
        minuteVirt = 0;
        for (var j = 0; j < times.length; j++) {
            arText = [];
            if (virt.indexOf(j + 1) != -1) {
                text = $(times[j]).text();
                arText = text.split(/:/);
                if (arText.length == 3)
                    secondsVirt += +arText[0]*3600 + +arText[1]*60 + +arText[2];
            } else if (pole.indexOf(j + 1) != -1) {
                text = $(times[j]).text();
                arText = text.split(/:/);
                if (arText.length == 3)
                    secondsPole += +arText[0]*3600 + +arText[1]*60 + +arText[2];
            }
        }
        hourPole = Math.floor(secondsPole/3600);
        secondsPole = secondsPole - (hourPole * 3600);
        hourVirt = Math.floor(secondsVirt/3600);
        secondsVirt = secondsVirt - (hourVirt * 3600);

        minutePole = Math.floor(secondsPole/60);
        secondsPole = secondsPole - (minutePole * 60);
        minuteVirt = Math.floor(secondsVirt/60);
        secondsVirt = secondsVirt - (minuteVirt * 60);

        hourPole = hourPole.toString().length === 1 ? '0' + hourPole : hourPole;
        minutePole = minutePole.toString().length === 1 ? '0' + minutePole : minutePole;
        secondsPole = secondsPole.toString().length === 1 ? '0' + secondsPole : secondsPole;

        hourVirt = hourVirt.toString().length === 1 ? '0' + hourVirt : hourVirt;
        minuteVirt = minuteVirt.toString().length === 1 ? '0' + minuteVirt : minuteVirt;
        secondsVirt = secondsVirt.toString().length === 1 ? '0' + secondsVirt : secondsVirt;

        $(commands[i]).append('<td id="command_pole_' + i + '">' + hourPole + ':' + minutePole + ':' + secondsPole + '</td>');
        $(commands[i]).append('<td id="command_virt_' + i + '">' + hourVirt + ':' + minuteVirt + ':' + secondsVirt + '</td>');
    }
    // Your code here...

    $('.pole, .virt').click(function() {
        var commands = $('#suxx').find('tr:not(#shapka)');
        var times, arText, secondsVirt, secondsPole, hourVirt, hourPole, minutePole, minuteVirt;
        var pole = [];
        var virt = [];
        var item;

        for (var i = 0; i < $('.pole:checked').length; i++) {
            item = $('.pole:checked')[i];
            pole.push($(item).data('id'));
        }

        for (i = 0; i < $('.virt:checked').length; i++) {
            item = $('.virt:checked')[i];
            virt.push($(item).data('id'));
        }

    for (i = 0; i < commands.length; i++) {
        times = $(commands[i]).find('td span span');
        secondsVirt = 0;
        secondsPole = 0;
        hourPole = 0;
        hourVirt = 0;
        minutePole = 0;
        minuteVirt = 0;
        for (var j = 0; j < times.length; j++) {
            arText = [];
            if (virt.indexOf(j + 1) != -1) {
                text = $(times[j]).text();
                arText = text.split(/:/);
                if (arText.length == 3)
                    secondsVirt += +arText[0]*3600 + +arText[1]*60 + +arText[2];
            } else if (pole.indexOf(j + 1) != -1) {
                text = $(times[j]).text();
                arText = text.split(/:/);
                if (arText.length == 3)
                    secondsPole += +arText[0]*3600 + +arText[1]*60 + +arText[2];
            }
        }
        hourPole = Math.floor(secondsPole/3600);
        secondsPole = secondsPole - (hourPole * 3600);
        hourVirt = Math.floor(secondsVirt/3600);
        secondsVirt = secondsVirt - (hourVirt * 3600);

        minutePole = Math.floor(secondsPole/60);
        secondsPole = secondsPole - (minutePole * 60);
        minuteVirt = Math.floor(secondsVirt/60);
        secondsVirt = secondsVirt - (minuteVirt * 60);

        hourPole = hourPole.toString().length === 1 ? '0' + hourPole : hourPole;
        minutePole = minutePole.toString().length === 1 ? '0' + minutePole : minutePole;
        secondsPole = secondsPole.toString().length === 1 ? '0' + secondsPole : secondsPole;

        hourVirt = hourVirt.toString().length === 1 ? '0' + hourVirt : hourVirt;
        minuteVirt = minuteVirt.toString().length === 1 ? '0' + minuteVirt : minuteVirt;
        secondsVirt = secondsVirt.toString().length === 1 ? '0' + secondsVirt : secondsVirt;

        $('#command_pole_' + i).html(hourPole + ':' + minutePole + ':' + secondsPole);
        $('#command_virt_' + i).html(hourVirt + ':' + minuteVirt + ':' + secondsVirt);
    }
    });
})();
