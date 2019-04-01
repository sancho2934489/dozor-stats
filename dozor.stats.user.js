// ==UserScript==
// @name         Dozor stats
// @namespace    http://tampermonkey.net/
// @version      0.4
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
    var npole = [];
    var el, text;

    for (var i = 0; i < shapka.length; i++) {
        el = shapka[i];
        text = $(el).text();

        if (text.toLowerCase().indexOf('команды') != -1 || text.toLowerCase().indexOf('общее время') != -1)
            continue;

        $(el).parent().append('<br><input type="checkbox" data-id="' + i + '" class="virt" id="virt_' + i + '"><label for="virt_' + i + '">вирт</label>');
        $(el).parent().append('<br><input type="checkbox" data-id="' + i + '" class="pole" id="pole_' + i + '"><label for="pole_' + i + '">поле</label>');
        $(el).parent().append('<br><input type="checkbox" data-id="' + i + '" class="n_pole" id="n_pole_' + i + '"><label for="n_pole_' + i + '">нестандарт</label>');

        if ($('#virt_' + i).attr('checked') == 'checked')
            virt.push(i);

        if ($('#pole_' + i).attr('checked') == 'checked')
            pole.push(i);

        if ($('#n_pole_' + i).attr('checked') == 'checked')
            npole.push(i);
    }

    $('#suxx').find('#shapka').append('<th>Время по полю</th>');
    $('#suxx').find('#shapka').append('<th>Время по полю(нестандарт)</th>');
    $('#suxx').find('#shapka').append('<th>Время по штабу(виртуалки)</th>');
    $('#suxx').find('#shapka').append('<th>Отставание от лидера по полю</th>');
    $('#suxx').find('#shapka').append('<th>Отставание от лидера по нестандартам</th>');
    $('#suxx').find('#shapka').append('<th>Отставание от лидера по штабу</th>');

    var commands = $('#suxx').find('tr:not(#shapka)');
    var times, arText, secondsVirt, secondsPole, hourVirt, hourPole, minutePole, minuteVirt;
    var secondsNPole, hourNPole, minuteNPole;

    for (i = 0; i < commands.length; i++) {
        times = $(commands[i]).find('td span span');
        secondsVirt = 0;
        secondsPole = 0;
        secondsNPole = 0;
        hourPole = 0;
        hourNPole = 0;
        hourVirt = 0;
        minutePole = 0;
        minuteNPole = 0;
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
            } else if (npole.indexOf(j + 1) != -1) {
                text = $(times[j]).text();
                arText = text.split(/:/);
                if (arText.length == 3)
                    secondsNPole += +arText[0]*3600 + +arText[1]*60 + +arText[2];
            }
        }
        hourPole = Math.floor(secondsPole/3600);
        secondsPole = secondsPole - (hourPole * 3600);
        hourNPole = Math.floor(secondsNPole/3600);
        secondsNPole = secondsNPole - (hourNPole * 3600);
        hourVirt = Math.floor(secondsVirt/3600);
        secondsVirt = secondsVirt - (hourVirt * 3600);

        minutePole = Math.floor(secondsPole/60);
        secondsPole = secondsPole - (minutePole * 60);
        minuteNPole = Math.floor(secondsNPole/60);
        secondsNPole = secondsNPole - (minuteNPole * 60);
        minuteVirt = Math.floor(secondsVirt/60);
        secondsVirt = secondsVirt - (minuteVirt * 60);

        hourPole = hourPole.toString().length === 1 ? '0' + hourPole : hourPole;
        minutePole = minutePole.toString().length === 1 ? '0' + minutePole : minutePole;
        secondsPole = secondsPole.toString().length === 1 ? '0' + secondsPole : secondsPole;

        hourNPole = hourNPole.toString().length === 1 ? '0' + hourNPole : hourNPole;
        minuteNPole = minuteNPole.toString().length === 1 ? '0' + minuteNPole : minuteNPole;
        secondsNPole = secondsNPole.toString().length === 1 ? '0' + secondsNPole : secondsNPole;

        hourVirt = hourVirt.toString().length === 1 ? '0' + hourVirt : hourVirt;
        minuteVirt = minuteVirt.toString().length === 1 ? '0' + minuteVirt : minuteVirt;
        secondsVirt = secondsVirt.toString().length === 1 ? '0' + secondsVirt : secondsVirt;

        $(commands[i]).append('<td id="command_pole_' + i + '">' + hourPole + ':' + minutePole + ':' + secondsPole + '</td>');
        $(commands[i]).append('<td id="command_n_pole_' + i + '">' + hourNPole + ':' + minuteNPole + ':' + secondsNPole + '</td>');
        $(commands[i]).append('<td id="command_virt_' + i + '">' + hourVirt + ':' + minuteVirt + ':' + secondsVirt + '</td>');
        $(commands[i]).append('<td id="command_diff_pole_' + i + '">00:00:00</td>');
        $(commands[i]).append('<td id="command_diff_n_pole_' + i + '">00:00:00</td>');
        $(commands[i]).append('<td id="command_diff_virt_' + i + '">00:00:00</td>');
    }
    // Your code here...

    $('.pole, .virt, .n_pole').click(function() {
        var commands = $('#suxx').find('tr:not(#shapka)');
        var times, arText, secondsVirt, secondsPole, hourVirt, hourPole, minutePole, minuteVirt;
        var secondsNPole, hourNPole, minuteNPole;
        var pole = [];
        var npole = [];
        var virt = [];
        var item;

        for (var i = 0; i < $('.pole:checked').length; i++) {
            item = $('.pole:checked')[i];
            pole.push($(item).data('id'));
        }

        for (i = 0; i < $('.n_pole:checked').length; i++) {
            item = $('.n_pole:checked')[i];
            npole.push($(item).data('id'));
        }

        for (i = 0; i < $('.virt:checked').length; i++) {
            item = $('.virt:checked')[i];
            virt.push($(item).data('id'));
        }

        var liderPole = 0, liderVirt = 0, diffPoleHour, diffPoleMinute, diffPoleSeconds, diffVirtHour, diffVirtMinute, diffVirtSeconds, diffPoleSign, diffVirtSign;
        var liderNPole = 0, diffNPoleHour, diffNPoleMinute, diffNPoleSeconds, diffNPoleSign;

    for (i = 0; i < commands.length; i++) {
        times = $(commands[i]).find('td span span');
        secondsVirt = 0;
        secondsPole = 0;
        secondsNPole = 0;
        hourPole = 0;
        hourNPole = 0;
        hourVirt = 0;
        minutePole = 0;
        minuteNPole = 0;
        minuteVirt = 0;
        diffPoleHour = 0;
        diffPoleMinute = 0;
        diffPoleSeconds = 0;
        diffNPoleHour = 0;
        diffNPoleMinute = 0;
        diffNPoleSeconds = 0;
        diffVirtHour = 0;
        diffVirtMinute = 0;
        diffVirtSeconds = 0;
        diffPoleSign = '';
        diffNPoleSign = '';
        diffVirtSign = '';
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
            } else if (npole.indexOf(j + 1) != -1) {
                text = $(times[j]).text();
                arText = text.split(/:/);
                if (arText.length == 3)
                    secondsNPole += +arText[0]*3600 + +arText[1]*60 + +arText[2];
            }
        }

        if (i == 0) {
            liderPole = secondsPole;
            liderNPole = secondsNPole;
            liderVirt = secondsVirt;
        }

        diffPoleSeconds = secondsPole - liderPole;
        diffNPoleSeconds = secondsNPole - liderNPole;
        diffVirtSeconds = secondsVirt - liderVirt;

        if (diffPoleSeconds < 0) {
            diffPoleSign = '-';
            diffPoleSeconds = diffPoleSeconds * -1;
        }

        if (diffNPoleSeconds < 0) {
            diffNPoleSign = '-';
            diffNPoleSeconds = diffNPoleSeconds * -1;
        }

        if (diffVirtSeconds < 0) {
            diffVirtSign = '-';
            diffVirtSeconds = diffVirtSeconds * -1;
        }

        hourPole = Math.floor(secondsPole/3600);
        secondsPole = secondsPole - (hourPole * 3600);
        diffPoleHour = Math.floor(diffPoleSeconds/3600);
        diffPoleSeconds = diffPoleSeconds - (diffPoleHour * 3600);

        hourNPole = Math.floor(secondsNPole/3600);
        secondsNPole = secondsNPole - (hourNPole * 3600);
        diffNPoleHour = Math.floor(diffNPoleSeconds/3600);
        diffNPoleSeconds = diffNPoleSeconds - (diffNPoleHour * 3600);

        hourVirt = Math.floor(secondsVirt/3600);
        secondsVirt = secondsVirt - (hourVirt * 3600);
        diffVirtHour = Math.floor(diffVirtSeconds/3600);
        diffVirtSeconds = diffVirtSeconds - (diffVirtHour * 3600);

        minutePole = Math.floor(secondsPole/60);
        secondsPole = secondsPole - (minutePole * 60);
        diffPoleMinute = Math.floor(diffPoleSeconds/60);
        diffPoleSeconds = diffPoleSeconds - (diffPoleMinute * 60);

        minuteNPole = Math.floor(secondsNPole/60);
        secondsNPole = secondsNPole - (minuteNPole * 60);
        diffNPoleMinute = Math.floor(diffNPoleSeconds/60);
        diffNPoleSeconds = diffNPoleSeconds - (diffNPoleMinute * 60);

        minuteVirt = Math.floor(secondsVirt/60);
        secondsVirt = secondsVirt - (minuteVirt * 60);
        diffVirtMinute = Math.floor(diffVirtSeconds/60);
        diffVirtSeconds = diffVirtSeconds - (diffVirtMinute * 60);

        hourPole = hourPole.toString().length === 1 ? '0' + hourPole : hourPole;
        minutePole = minutePole.toString().length === 1 ? '0' + minutePole : minutePole;
        secondsPole = secondsPole.toString().length === 1 ? '0' + secondsPole : secondsPole;
        diffPoleHour = diffPoleHour.toString().length === 1 ? '0' + diffPoleHour : diffPoleHour;
        diffPoleMinute = diffPoleMinute.toString().length === 1 ? '0' + diffPoleMinute : diffPoleMinute;
        diffPoleSeconds = diffPoleSeconds.toString().length === 1 ? '0' + diffPoleSeconds : diffPoleSeconds;

        hourNPole = hourNPole.toString().length === 1 ? '0' + hourNPole : hourNPole;
        minuteNPole = minuteNPole.toString().length === 1 ? '0' + minuteNPole : minuteNPole;
        secondsNPole = secondsNPole.toString().length === 1 ? '0' + secondsNPole : secondsNPole;
        diffNPoleHour = diffNPoleHour.toString().length === 1 ? '0' + diffNPoleHour : diffNPoleHour;
        diffNPoleMinute = diffNPoleMinute.toString().length === 1 ? '0' + diffNPoleMinute : diffNPoleMinute;
        diffNPoleSeconds = diffNPoleSeconds.toString().length === 1 ? '0' + diffNPoleSeconds : diffNPoleSeconds;

        hourVirt = hourVirt.toString().length === 1 ? '0' + hourVirt : hourVirt;
        minuteVirt = minuteVirt.toString().length === 1 ? '0' + minuteVirt : minuteVirt;
        secondsVirt = secondsVirt.toString().length === 1 ? '0' + secondsVirt : secondsVirt;
        diffVirtHour = diffVirtHour.toString().length === 1 ? '0' + diffVirtHour : diffVirtHour;
        diffVirtMinute = diffVirtMinute.toString().length === 1 ? '0' + diffVirtMinute : diffVirtMinute;
        diffVirtSeconds = diffVirtSeconds.toString().length === 1 ? '0' + diffVirtSeconds : diffVirtSeconds;

        $('#command_pole_' + i).html(hourPole + ':' + minutePole + ':' + secondsPole);
        $('#command_n_pole_' + i).html(hourNPole + ':' + minuteNPole + ':' + secondsNPole);
        $('#command_virt_' + i).html(hourVirt + ':' + minuteVirt + ':' + secondsVirt);
        $('#command_diff_pole_' + i).html(diffPoleSign + diffPoleHour + ':' + diffPoleMinute + ':' + diffPoleSeconds);
        $('#command_diff_n_pole_' + i).html(diffNPoleSign + diffNPoleHour + ':' + diffNPoleMinute + ':' + diffNPoleSeconds);
        $('#command_diff_virt_' + i).html(diffVirtSign + diffVirtHour + ':' + diffVirtMinute + ':' + diffVirtSeconds);
    }
    });
})();
