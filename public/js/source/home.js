/*jslint browser: true*/
/*global $, jQuery, alert*/
window.alert = function (text) {
    'use strict';
    console.log('tried to alert: ' + text);
    return true;
};

var $genaral = $('#general-stats'), $statics_table;

var gen_connections = $('#gen-connections'), gen_items = $('#gen-items'),
gen_cashits = $('#gen-cashits'), gen_casmisses = $('#gen-casmisses'),
gen_getcom = $('#gen-getcom'), gen_setcom = $('#gen-setcom'),
storage_message = $('#storage-message'),
storage_progress = $('#storage-progress'),
command_message = $('#command-message'),
command_progress = $('#command-progress'),
$refreshtime = $('#refresh-time'), timer = 0;

function initDataTables() {
    'use strict';
    //connect to the server before getting informaton
    //stats tab
    //Get generatl stats
    $.get('first')
    .done(function (data) {
        $.get('onlinservers', function (data) {
            $('.server-onoff').html(data);
        });

        $.get('service', function (data) {
            //fill stats table
            $statics_table = $('#global-statics-table').dataTable({
                'data' : data.data
            });
            $genaral.html(data.overall);
        });
    });
}

$(document).ready(function () {
    'use strict';

    $.get('servers', function (data) {
        var $list = $('#list');
        $list.html(data);
    })
    .done(function () {
        //connect to the server before getting informaton
        initDataTables();
    });

    $('body').tooltip({
        selector: '[rel=tooltip]'
    });

    setInterval(function () {
        $statics_table.api().clear().draw();

        $.get('onlinservers', function (data) {
            $('.server-onoff').html(data);
        });

        $.get('service', function (data) {
            //fill stats table
            if (data.data.length > 0) {
                $statics_table.fnAddData(data.data);
                $genaral.html(data.overall);
            }
        });
        timer = 0;
    }, 300000);
    
    //count up timer
    setInterval(function () {
        timer += 1;
        var minutes = Math.floor(timer / 60); // 7
        var seconds = timer % 60; // 30
        
        $refreshtime.text(minutes + 'min and ' + seconds + 's ago');
    }, 1000);
});