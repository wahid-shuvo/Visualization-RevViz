var margin = {top: 40, right: 20, bottom: 50, left: 60},
    width = 480 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var barSvg = d3.select("#barViz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

function loadTextual() {
    barSvg.selectAll('g').remove();
    let xAxis = d3.scaleBand()
        .range([0, width])
        .padding(0.3)
        .domain(Object.keys(data2[comment_index]).filter((name) => name !== 'id' && name != 'shapValues'))
    // console.log( data2[comment_index-1]['id'])
    barSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis))

    let yAxis = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    barSvg.append("g")
        .call(d3.axisLeft(yAxis)
            .ticks(5));

    let bars = barSvg.selectAll(".bar")
        .data(Object.entries(data2[comment_index - 1]).filter(([name]) => name !== 'id' && name != 'shapValues'))
        .enter()
        .append("g")

    bars.append("rect")
        .attr("x", function (d) {
            return xAxis(d[0]);
        })
        .attr("y", function (d) {
            return yAxis(d[1]);
        })
        .attr("width", xAxis.bandwidth())
        .attr("height", function (d) {
            return height - yAxis(d[1])
        })
        .attr("fill", "#ec12cf")
        .append('g');

    bars.append("text")
        .text(function (d) {
            return (d[1] * 100).toFixed(2) + "%";
            // return "a";
        })
        .attr("x", function (d) {
            return xAxis(d[0]) + xAxis.bandwidth() / 2;
        })
        .attr("y", function (d) {
            return yAxis(d[1]) - 10;
        })
        .attr('font-weight', 'bold')
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .style("text-anchor", "middle")

    barSvg.append("g")
        .attr("transform", "translate(0,400)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("RE = Reading Ease")
    barSvg.append("g")
        .attr("transform", "translate(0,420)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("RENL= Natural Language Reading Ease ")

    barSvg.append("g")
        .attr("transform", "translate(0,440)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("SWR = Stop Word Ratio")

    barSvg.append("g")
        .attr("transform", "translate(0,455)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("QR = Question Ratio")
    barSvg.append("g")
        .attr("transform", "translate(180,400)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("SKR = Stop Keyword Ratio")
    barSvg.append("g")
        .attr("transform", "translate(180,420)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("CER = Code Element Ratio")
    barSvg.append("g")
        .attr("transform", "translate(180,440)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("CS = Conceptual Similarity")

}

function loadExternalFeatures() {
    barSvg.selectAll('g').remove();
    let xAxis = d3.scaleBand()
        .range([0, width])
        .padding(0.3)
        .domain(Object.keys(normalizedExternalDf[comment_index]))
    barSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis))

    let yAxis = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    barSvg.append("g")
        .call(d3.axisLeft(yAxis)
            .ticks(5));

    let bars = barSvg.selectAll(".bar")
        .data(Object.entries(normalizedExternalDf[comment_index - 1]))
        .enter()
        .append("g")

    bars.append("rect")
        .attr("x", function (d) {
            return xAxis(d[0]);
        })
        .attr("y", function (d) {
            return yAxis(d[1]);
        })
        .attr("width", xAxis.bandwidth())
        .attr("height", function (d) {
            return height - yAxis(d[1])
        })
        .attr("fill", "#0fd0ec")
        .append('g');

    bars.append("text")
        .text(function (d) {
            return (d[1]).toFixed(2) + '%';
            // return "a";
        })
        .attr("x", function (d) {
            return xAxis(d[0]) + xAxis.bandwidth() / 2;
        })
        .attr("y", function (d) {
            return yAxis(d[1]) - 10;
        })
        .attr('font-weight', 'bold')
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .style("text-anchor", "middle")

    barSvg.append("g")
        .attr("transform", "translate(0,400)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("ACF= Author Commits File")
    barSvg.append("g")
        .attr("transform", "translate(0,420)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("CT= Committed Twice ")

    barSvg.append("g")
        .attr("transform", "translate(0,440)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("TAC = Total Reviewed Commits")

    barSvg.append("g")
        .attr("transform", "translate(0,460)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("RT = Reviewing Twice")
    barSvg.append("g")
        .attr("transform", "translate(180,400)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("RCF = Reviewed Commits File")
    barSvg.append("g")
        .attr("transform", "translate(180,420)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("TRC = Total Reviewed Commit")
    barSvg.append("g")
        .attr("transform", "translate(180,440)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("RP = Reviewed Pull Request")
    barSvg.append("g")
        .attr("transform", "translate(180,460)")
        .append("text")
        .attr('font-size', '10')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .text("ExtLib = External Library Experience")
}

function  clearBarSVG() {
    barSvg.selectAll('g').remove();
}
