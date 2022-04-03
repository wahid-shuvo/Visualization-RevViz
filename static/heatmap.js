var margin = {top: 40, right: 20, bottom: 100, left: 60},
    width = 480 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var heatSvg = d3.select("#heatMap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

function createTextualHeatMap() {
    heatSvg.selectAll('g').remove();

    let features = ['RE', 'RENL', "SWR", "SKR", "QR", "CER", "CS", "Sentiment", 'Class']
    let heatMapX = [["RE", "RE"], ["RE", "RENL"], ["RE", "SWR"], ["RE", "SKR"], ["RE", "QR"], ["RE", "CER"], ["RE", "CS"], ["RE", "Sentiment"], ["RE", "Class"],
        ["RENL", "RE"], ["RENL", "RENL"], ["RENL", "SWR"], ["RENL", "SKR"], ["RENL", "QR"], ["RENL", "CER"], ["RENL", "CS"], ["RENL", "Sentiment"], ["RENL", "Class"],
        ["SWR", "RE"], ["SWR", "RENL"], ["SWR", "SWR"], ["SWR", "SKR"], ["SWR", "QR"], ["SWR", "CER"], ["SWR", "CS"], ["SWR", "Sentiment"], ["SWR", "Class"],
        ["SKR", "RE"], ["SKR", "RENL"], ["SKR", "SWR"], ["SKR", "SKR"], ["SKR", "QR"], ["SKR", "CER"], ["SKR", "CS"], ["SKR", "Sentiment"], ["SKR", "Class"],
        ["QR", "RE"], ["QR", "RENL"], ["QR", "SWR"], ["QR", "SKR"], ["QR", "QR"], ["QR", "CER"], ["QR", "CS"], ["QR", "Sentiment"], ["QR", "Class"],
        ["CER", "RE"], ["CER", "RENL"], ["CER", "SWR"], ["CER", "SKR"], ["CER", "QR"], ["CER", "CER"], ["CER", "CS"], ["CER", "Sentiment"], ["CER", "Class"],
        ["CS", "RE"], ["CS", "RENL"], ["CS", "SWR"], ["CS", "SKR"], ["CS", "QR"], ["CS", "CER"], ["CS", "CS"], ["CS", "Sentiment"], ["CS", "Class"],
        ["Sentiment", "RE"], ["Sentiment", "RENL"], ["Sentiment", "SWR"], ["Sentiment", "SKR"], ["Sentiment", "QR"], ["Sentiment", "CER"], ["Sentiment", "CS"], ["Sentiment", "Sentiment"], ["Sentiment", "Class"],
        ["Class", "RE"], ["Class", "RENL"], ["Class", "SWR"], ["Class", "SKR"], ["Class", "QR"], ["Class", "CER"], ["Class", "CS"], ["Class", "Sentiment"], ["Class", "Class"]
    ];
    for (let i = 0; i < heatMapX.length; i++) {
        let j;
        for (j = 0; j < heatMapX[i].length; j++) {
        }
        heatMapX[i][j] = tex_cor_value[i]
    }
    let xAxisHeat = d3.scaleBand()
        .range([0, width])
        .domain(features)
        .padding(0.01);
    heatSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxisHeat))

    let yAxisHeat = d3.scaleBand()
        .range([height, 0])
        .domain(features)
        .padding(0.01);
    heatSvg.append("g")
        .call(d3.axisLeft(yAxisHeat));

    var myColor = d3.scaleLinear()
        .range(["lightpink", "#FF44cc"])
        .domain([1, 100]);
    heatSvg.selectAll().append('g')
        .data(heatMapX)
        .enter()
        .append('g')
        .append("rect")
        .attr("x", function (d) {
            return xAxisHeat(d[0])
        })
        .attr("y", function (d) {
            return yAxisHeat(d[1])
        })
        .attr("width", xAxisHeat.bandwidth())
        .attr("height", yAxisHeat.bandwidth())
        .style("fill", function (d) {
            return myColor(d[2])
        })
    heatSvg.selectAll().append('g')
        .data(heatMapX)
        .enter()
        .append('g')
        .append("text")
        .text(function (d) {
            return d[2].toFixed(1)
        })
        .attr("x", function (d) {
            return xAxisHeat(d[0]) + xAxisHeat.bandwidth() / 3;
        })
        .attr("y", function (d) {
            return yAxisHeat(d[1]) + yAxisHeat.bandwidth() / 2;
        })
        .attr('font-size', '10')

    heatSvg.append("g")
        .attr("transform", "translate(190,-20)")
        .append("text")
        .attr('font-weight', 'bold')
        .attr('font-size', '20')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .style("text-anchor", "middle")
        .text("Correlation between textual features")

    const rangeArray = []
    for (var i = 1; i <= 64; i++) {
        rangeArray.push(i)
    }
    var x = d3.scaleBand()
        .range([10, width - 30])
        .domain(rangeArray)
        .padding(0.01);

    heatSvg.append("g")
        .attr("transform", "translate(0," + (height + 80) + ")")
    var y = d3.scaleBand()
        .range([15, 0])
        .domain([1, 1])
        .padding(0.01);

    heatSvg.append("g")
        .attr("transform", "translate(0," + (height + 50) + ")")
    var bandarray = []
    var min = Math.min.apply(null, tex_cor_value),
        max = Math.max.apply(null, tex_cor_value);
    var minRangeColor = min;
    var colorGap = (Math.abs(min) + max) / 64;
    for (var i = 0; i < 64; i++) {
        var min = min + colorGap;
        bandarray.push([i + 1, min])
    }
    heatSvg.selectAll()
        .data(bandarray)
        .enter()
        .append('g')
        .append("rect")
        .attr("x", function (d) {
            return x(d[0])
        })
        .attr("y", function (d) {
            return y(1)
        })
        .attr("width", xAxisHeat.bandwidth() / 2)
        .attr("height", yAxisHeat.bandwidth() / 2)
        .attr("transform", "translate(0," + (height + 45) + ")")
        .style("fill", function (d) {
            return myColor(d[1])
        });

    heatSvg.append("g")
        .attr("transform", "translate(25,455)")
        .append("text")
        .attr('font-weight', 'bold')
        .attr('font-size', '12')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .style("text-anchor", "middle")
        .text("Low")
    heatSvg.append("g")
        .attr("transform", "translate(190,455)")
        .append("text")
        .attr('font-weight', 'bold')
        .attr('font-size', '12')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .style("text-anchor", "middle")
        .text("Medium")
    heatSvg.append("g")
        .attr("transform", "translate(350,455)")
        .append("text")
        .attr('font-weight', 'bold')
        .attr('font-size', '12')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .style("text-anchor", "middle")
        .text("High")
}

function createExternalHeatMap() {
    heatSvg.selectAll('g').remove();

    let features = ['ACF', 'CT', 'TAC', 'RT', 'RCF', 'TRC', 'RP', 'ExtLib', 'Class']
    let heatMapX = [["ACF", "ACF"], ["ACF", "CT"], ["ACF", "TAC"], ["ACF", "RT"], ["ACF", "RCF"], ["ACF", "TRC"], ["ACF", "RP"], ["ACF", "ExtLib"], ["ACF", "Class"],
        ["CT", "ACF"], ["CT", "CT"], ["CT", "TAC"], ["CT", "RT"], ["CT", "RCF"], ["CT", "TRC"], ["CT", "RP"], ["CT", "ExtLib"], ["CT", "Class"],
        ["TAC", "ACF"], ["TAC", "CT"], ["TAC", "TAC"], ["TAC", "RT"], ["TAC", "RCF"], ["TAC", "TRC"], ["TAC", "RP"], ["TAC", "ExtLib"], ["TAC", "Class"],
        ["RT", "ACF"], ["RT", "CT"], ["RT", "TAC"], ["RT", "RT"], ["RT", "RCF"], ["RT", "TRC"], ["RT", "RP"], ["RT", "ExtLib"], ["RT", "Class"],
        ["RCF", "ACF"], ["RCF", "CT"], ["RCF", "TAC"], ["RCF", "RT"], ["RCF", "RCF"], ["RCF", "TRC"], ["RCF", "RP"], ["RCF", "ExtLib"], ["RCF", "Class"],
        ["TRC", "ACF"], ["TRC", "CT"], ["TRC", "TAC"], ["TRC", "RT"], ["TRC", "RCF"], ["TRC", "TRC"], ["TRC", "RP"], ["TRC", "ExtLib"], ["TRC", "Class"],
        ["RP", "ACF"], ["RP", "CT"], ["RP", "TAC"], ["RP", "RT"], ["RP", "RCF"], ["RP", "TRC"], ["RP", "RP"], ["RP", "ExtLib"], ["RP", "Class"],
        ["ExtLib", "ACF"], ["ExtLib", "CT"], ["ExtLib", "TAC"], ["ExtLib", "RT"], ["ExtLib", "RCF"], ["ExtLib", "TRC"], ["ExtLib", "RP"], ["ExtLib", "ExtLib"], ["ExtLib", "Class"],
        ["Class", "ACF"], ["Class", "CT"], ["Class", "TAC"], ["Class", "RT"], ["Class", "RCF"], ["Class", "TRC"], ["Class", "RP"], ["Class", "ExtLib"], ["Class", "Class"],
    ];
    for (let i = 0; i < heatMapX.length; i++) {
        let j;
        for (j = 0; j < heatMapX[i].length; j++) {
        }
        heatMapX[i][j] = ext_cor_value[i]
    }

    let xAxisHeat = d3.scaleBand()
        .range([0, width])
        .domain(features)
        .padding(0.01);
    heatSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxisHeat))

    let yAxisHeat = d3.scaleBand()
        .range([height, 0])
        .domain(features)
        .padding(0.01);
    heatSvg.append("g")
        .call(d3.axisLeft(yAxisHeat));

    var myColor = d3.scaleLinear()
        .range(["lightblue", "#0c8ae3"])
        .domain([1, 100]);


    heatSvg.selectAll().append('g')
        .data(heatMapX)
        .enter()
        .append('g')
        .append("rect")
        .attr("x", function (d) {
            return xAxisHeat(d[0])
        })
        .attr("y", function (d) {
            return yAxisHeat(d[1])
        })
        .attr("width", xAxisHeat.bandwidth())
        .attr("height", yAxisHeat.bandwidth())
        .style("fill", function (d) {
            return myColor(d[2])
        })
    heatSvg.selectAll().append('g')
        .data(heatMapX)
        .enter()
        .append('g')
        .append("text")
        .text(function (d) {
            return d[2].toFixed(1)
        })
        .attr("x", function (d) {
            return xAxisHeat(d[0]) + xAxisHeat.bandwidth() / 3;
        })
        .attr("y", function (d) {
            return yAxisHeat(d[1]) + yAxisHeat.bandwidth() / 2;
        })
        .attr('font-size', '10')
    heatSvg.append("g")
        .attr("transform", "translate(190,-20)")
        .append("text")
        .attr('font-weight', 'bold')
        .attr('font-size', '20')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .style("text-anchor", "middle")
        .text("Correlation between external features")

    const rangeArray = []
    for (var i = 1; i <= 64; i++) {
        rangeArray.push(i)
    }
    var x = d3.scaleBand()
        .range([10, width - 30])
        .domain(rangeArray)
        .padding(0.01);

    heatSvg.append("g")
        .attr("transform", "translate(0," + (height + 80) + ")")
    var y = d3.scaleBand()
        .range([15, 0])
        .domain([1, 1])
        .padding(0.01);

    heatSvg.append("g")
        .attr("transform", "translate(0," + (height + 50) + ")")
    var bandarray = []
    var min = Math.min.apply(null, ext_cor_value),
        max = Math.max.apply(null, ext_cor_value);
    var minRangeColor = min;
    var colorGap = (Math.abs(min) + max) / 64;
    for (var i = 0; i < 64; i++) {
        var min = min + colorGap;
        bandarray.push([i + 1, min])
    }
    heatSvg.selectAll()
        .data(bandarray)
        .enter()
        .append('g')
        .append("rect")
        .attr("x", function (d) {
            return x(d[0])
        })
        .attr("y", function (d) {
            return y(1)
        })
        .attr("width", xAxisHeat.bandwidth() / 2)
        .attr("height", yAxisHeat.bandwidth() / 2)
        .attr("transform", "translate(0," + (height + 45) + ")")
        .style("fill", function (d) {
            return myColor(d[1])
        });

    heatSvg.append("g")
        .attr("transform", "translate(25,455)")
        .append("text")
        .attr('font-weight', 'bold')
        .attr('font-size', '12')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .style("text-anchor", "middle")
        .text("Low")
    heatSvg.append("g")
        .attr("transform", "translate(190,455)")
        .append("text")
        .attr('font-weight', 'bold')
        .attr('font-size', '12')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .style("text-anchor", "middle")
        .text("Medium")
    heatSvg.append("g")
        .attr("transform", "translate(350,455)")
        .append("text")
        .attr('font-weight', 'bold')
        .attr('font-size', '12')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .style("text-anchor", "middle")
        .text("High")
}

function clearSVG() {
    heatSvg.selectAll('g').remove();
}