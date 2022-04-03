var margin = {top: 40, right: 20, bottom: 100, left: 60},
    width = 480 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var comment_index;

const selectEl = document.getElementById('comment-selection');
selectEl.onchange = function (e) {
    comment_index = e.target.value;
    barSvg.selectAll('g').remove();
    heatSvg.selectAll('g').remove();
    predictSvg.selectAll('g').remove();
    document.getElementById("feature-selection").selectedIndex = 0
    document.getElementById("featureCor").selectedIndex = 0
    document.getElementById("modelExplain").selectedIndex = 0
}
const predictBtn = document.getElementById('predictBtn').onclick = function () {
    document.getElementById("modelExplain").selectedIndex = 0
    showPrediction();
}

var predictSvg = d3.select("#predictClass")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

function showPrediction() {
    predictSvg.selectAll('g').remove();
    var bar = predictSvg.selectAll('g')
        .data([y_pred[comment_index - 1]])
        .enter()
        .append('g');

    bar.append('rect')
        .attr("x", 20)
        .attr("y", 150)
        .attr("width", 300)
        .attr("height", 70)
        .style("fill", '#63e5ff')

    bar.append("text")
        .attr("x", 150)
        .attr("y", 185)
        .attr("dy", ".35em")
        .text(function (d) {
            if (d == 0) {
                return "Non-Useful"
            } else
                return "Useful"
        })
        .attr('font-weight', 'bold')
        .attr('font-size', '22')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')
        .style("text-anchor", "middle")


}