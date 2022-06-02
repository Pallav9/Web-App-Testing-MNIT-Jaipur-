/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 79.35301950340722, "KoPercent": 20.64698049659278};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06888854076917052, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "HomePage"], "isController": false}, {"data": [0.1834862385321101, 500, 1500, "Students/feeStructure-0"], "isController": false}, {"data": [0.13139204545454544, 500, 1500, "About Us-1"], "isController": false}, {"data": [0.043028685790527016, 500, 1500, "Students/feeStructure"], "isController": false}, {"data": [0.013571428571428571, 500, 1500, "HomePage-0"], "isController": false}, {"data": [0.22869318181818182, 500, 1500, "About Us-0"], "isController": false}, {"data": [0.005714285714285714, 500, 1500, "HomePage-1"], "isController": false}, {"data": [0.015010006671114077, 500, 1500, "Gallery"], "isController": false}, {"data": [0.0351668169522092, 500, 1500, "Gallery-1"], "isController": false}, {"data": [0.14562669071235348, 500, 1500, "Gallery-0"], "isController": false}, {"data": [0.09518348623853211, 500, 1500, "Students/feeStructure-1"], "isController": false}, {"data": [0.05470313542361575, 500, 1500, "About Us"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12767, 2636, 20.64698049659278, 38132.64188924574, 1, 159192, 21116.0, 80220.6, 99201.0, 111790.28, 42.74674720256072, 2037.8969951226873, 5.927817361199467], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HomePage", 1500, 800, 53.333333333333336, 52972.35333333337, 3219, 126998, 35831.5, 111296.8, 111382.0, 124874.28, 11.679059446412582, 468.97441130240975, 1.2454621987775918], "isController": false}, {"data": ["Students/feeStructure-0", 872, 0, 0.0, 44513.33600917437, 41, 107001, 51591.0, 64757.2, 71566.29999999999, 95164.40999999997, 3.282279829411787, 1.9771063216822438, 0.46798130380285247], "isController": false}, {"data": ["About Us-1", 704, 7, 0.9943181818181818, 11754.380681818186, 178, 31243, 14445.0, 16792.5, 17121.25, 29425.50000000053, 3.0881391768179007, 178.2115463410047, 0.40009380387245636], "isController": false}, {"data": ["Students/feeStructure", 1499, 627, 41.827885256837895, 45738.45030020015, 214, 123834, 54848.0, 79871.0, 89624.0, 110629.0, 5.323663845610197, 202.57485750253932, 0.8709997052274189], "isController": false}, {"data": ["HomePage-0", 700, 0, 0.0, 45022.51000000005, 263, 111399, 48181.0, 79861.9, 89779.2, 110857.93000000001, 6.196664424064304, 3.406955147215042, 0.7201201820934103], "isController": false}, {"data": ["About Us-0", 704, 0, 0.0, 49008.28267045454, 40, 112146, 59283.0, 72187.0, 77870.25, 104859.15000000007, 3.31389245854104, 1.9442253864638792, 0.4465987883580699], "isController": false}, {"data": ["HomePage-1", 700, 0, 0.0, 9201.201428571427, 1039, 17975, 8817.5, 16109.5, 16753.75, 17392.13, 5.468707275724408, 451.33390681518114, 0.614161461629206], "isController": false}, {"data": ["Gallery", 1499, 395, 26.350900600400266, 51129.303535690495, 486, 159192, 55225.0, 84519.0, 111255.0, 159178.0, 5.084027200732589, 499.78996180726307, 0.9968757419152435], "isController": false}, {"data": ["Gallery-1", 1109, 5, 0.4508566275924256, 13815.570784490537, 1, 23626, 15919.0, 17444.0, 17807.5, 19997.400000000012, 3.762229791160626, 494.25205248675246, 0.490103368026814], "isController": false}, {"data": ["Gallery-0", 1109, 0, 0.0, 35874.19206492338, 43, 103000, 40315.0, 59208.0, 63705.5, 82625.70000000001, 3.931648172439466, 2.3069787364395364, 0.5298510232389123], "isController": false}, {"data": ["Students/feeStructure-1", 872, 0, 0.0, 13001.55389908256, 161, 18482, 15533.5, 16888.0, 17289.7, 17609.81, 3.0974708724069338, 194.81039174614594, 0.4295320936345553], "isController": false}, {"data": ["About Us", 1499, 802, 53.502334889926615, 50823.01667778525, 1, 127112, 42050.0, 99333.0, 100723.0, 119178.0, 6.5481104835292525, 188.3233471167455, 0.8128742420966185], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.mnit.ac.in:80 [www.mnit.ac.in/210.212.97.131] failed: Connection timed out: connect", 1292, 49.013657056145675, 10.119840213049267], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 40, 1.5174506828528074, 0.31330774653403304], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 597, 22.647951441578147, 4.676118117020443], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to mnit.ac.in:443 [mnit.ac.in/210.212.97.131] failed: Connection timed out: connect", 2, 0.07587253414264036, 0.01566538732670165], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to mnit.ac.in:443 [mnit.ac.in/210.212.97.131] failed: Read timed out", 10, 0.37936267071320184, 0.07832693663350826], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: mnit.ac.in:443 failed to respond", 8, 0.30349013657056145, 0.0626615493068066], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.mnit.ac.in:80 failed to respond", 4, 0.15174506828528073, 0.0313307746534033], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 683, 25.910470409711685, 5.349729772068614], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12767, 2636, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.mnit.ac.in:80 [www.mnit.ac.in/210.212.97.131] failed: Connection timed out: connect", 1292, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 683, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 597, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 40, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to mnit.ac.in:443 [mnit.ac.in/210.212.97.131] failed: Read timed out", 10], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HomePage", 1500, 800, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.mnit.ac.in:80 [www.mnit.ac.in/210.212.97.131] failed: Connection timed out: connect", 368, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 278, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 126, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 28, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["About Us-1", 704, 7, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to mnit.ac.in:443 [mnit.ac.in/210.212.97.131] failed: Read timed out", 5, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Students/feeStructure", 1499, 627, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.mnit.ac.in:80 [www.mnit.ac.in/210.212.97.131] failed: Connection timed out: connect", 389, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 180, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 50, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 8, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Gallery", 1499, 395, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.mnit.ac.in:80 [www.mnit.ac.in/210.212.97.131] failed: Connection timed out: connect", 173, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 139, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 78, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: mnit.ac.in:443 failed to respond", 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to mnit.ac.in:443 [mnit.ac.in/210.212.97.131] failed: Connection timed out: connect", 1], "isController": false}, {"data": ["Gallery-1", 1109, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: mnit.ac.in:443 failed to respond", 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to mnit.ac.in:443 [mnit.ac.in/210.212.97.131] failed: Connection timed out: connect", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["About Us", 1499, 802, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.mnit.ac.in:80 [www.mnit.ac.in/210.212.97.131] failed: Connection timed out: connect", 362, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 236, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 191, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to mnit.ac.in:443 [mnit.ac.in/210.212.97.131] failed: Read timed out", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 4], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
