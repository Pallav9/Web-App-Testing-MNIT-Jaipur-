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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9358333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.78, 500, 1500, "HomePage"], "isController": false}, {"data": [1.0, 500, 1500, "Students/feeStructure-0"], "isController": false}, {"data": [0.9766666666666667, 500, 1500, "About Us-1"], "isController": false}, {"data": [0.9733333333333334, 500, 1500, "Students/feeStructure"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "HomePage-0"], "isController": false}, {"data": [1.0, 500, 1500, "About Us-0"], "isController": false}, {"data": [0.8133333333333334, 500, 1500, "HomePage-1"], "isController": false}, {"data": [0.9133333333333333, 500, 1500, "Gallery"], "isController": false}, {"data": [0.92, 500, 1500, "Gallery-1"], "isController": false}, {"data": [1.0, 500, 1500, "Gallery-0"], "isController": false}, {"data": [0.9766666666666667, 500, 1500, "Students/feeStructure-1"], "isController": false}, {"data": [0.96, 500, 1500, "About Us"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1800, 0, 0.0, 260.55888888888836, 10, 5863, 90.0, 461.40000000000055, 898.4999999999982, 3856.790000000002, 167.9261125104954, 9491.225605525236, 29.135617828155613], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HomePage", 150, 0, 0.0, 867.44, 52, 5863, 211.5, 3866.9, 3992.2999999999997, 5085.760000000014, 14.238253440911247, 1199.8286960132891, 3.2536633839582345], "isController": false}, {"data": ["Students/feeStructure-0", 150, 0, 0.0, 29.633333333333333, 11, 298, 14.0, 36.0, 148.199999999998, 295.96000000000004, 16.852039096730707, 10.137554769127064, 2.4027321368385577], "isController": false}, {"data": ["About Us-1", 150, 0, 0.0, 156.7666666666667, 15, 1777, 90.0, 287.6, 420.5999999999997, 1644.9100000000024, 16.75977653631285, 976.0933135474861, 2.1931738826815645], "isController": false}, {"data": ["Students/feeStructure", 150, 0, 0.0, 203.10666666666665, 34, 1246, 130.0, 417.70000000000005, 571.6999999999999, 1233.7600000000002, 16.776646907504755, 1065.0221766301308, 4.7184319427357115], "isController": false}, {"data": ["HomePage-0", 150, 0, 0.0, 281.31333333333333, 10, 3633, 15.0, 630.6000000000018, 2551.6999999999907, 3615.6600000000003, 14.30615164520744, 7.854412553648069, 1.662531294706724], "isController": false}, {"data": ["About Us-0", 150, 0, 0.0, 29.29333333333334, 12, 300, 14.0, 37.80000000000001, 146.5999999999981, 297.96000000000004, 16.80672268907563, 9.847798494397757, 2.264968487394958], "isController": false}, {"data": ["HomePage-1", 150, 0, 0.0, 584.8933333333331, 39, 5738, 173.5, 2529.600000000002, 2954.599999999999, 4667.000000000019, 14.550392860607237, 1218.1435441725678, 1.6340773232127268], "isController": false}, {"data": ["Gallery", 150, 0, 0.0, 307.4200000000001, 47, 2220, 226.0, 585.7, 784.6499999999992, 1756.4100000000083, 16.75603217158177, 2220.9269751172924, 4.450821045576408], "isController": false}, {"data": ["Gallery-1", 150, 0, 0.0, 284.7466666666667, 33, 2207, 205.5, 565.2, 736.0, 1742.9000000000083, 16.782277914522265, 2214.572349099351, 2.196118398970687], "isController": false}, {"data": ["Gallery-0", 150, 0, 0.0, 22.526666666666667, 11, 282, 14.0, 31.0, 54.799999999999955, 276.9000000000001, 16.876687668766877, 9.888684180918093, 2.274397361611161], "isController": false}, {"data": ["Students/feeStructure-1", 150, 0, 0.0, 173.2933333333333, 20, 1215, 109.5, 404.30000000000007, 513.1499999999994, 1211.43, 16.801075268817204, 1056.466051327285, 2.3298366095430105], "isController": false}, {"data": ["About Us", 150, 0, 0.0, 186.27333333333334, 28, 1790, 110.5, 337.70000000000005, 576.8999999999997, 1661.4800000000023, 16.733601070950467, 984.3738016301315, 4.444862784471218], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1800, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
