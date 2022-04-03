let count = 0;

function generateLocalExplanation() {
    predictSvg.selectAll('g').remove();
    var shap = data2[comment_index-1]['shapValues']
    // console.log( data2[comment_index-1]['id'])
    //console.log(shap);
    var feature_name = ['RE', 'RENL', 'SWR', 'SKR', 'QR', 'CER', 'CS', 'ACF', 'CT', 'TAC', 'RT', 'RCF', 'TRC', 'RP', 'ExtLib', 'Sentiment'];
    var ShapDict = {};
    var transitionValue = baseValue
    let X_pos = baseValue;
    let X1_pos = baseValue;
    var x_max = 0;
    var x_min = 0;
    for (var i = 0; i < shap.length; i++) {
        if (shap[i] >= 0) {
            x_max = x_max + Math.abs(shap[i])
        } else {
            x_min = x_min + Math.abs(shap[i])
        }
    }
    x_max = x_max
    x_min = x_min
    for (var i = 0; i < feature_name.length; i++) {
        ShapDict[feature_name[i]] = shap[i];
    }

    const sortedShapDict = Object.entries(ShapDict)
        .sort(([, a], [, b]) => Math.abs(a) - Math.abs(b))
        .reduce((r, [k, v]) => ({...r, [k]: v}), {});
    let xAxis = d3.scaleLinear()
        .range([0, width])
        .domain([(baseValue - x_min)-.1, baseValue + x_max+.1])


    predictSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis))

    let yAxis = d3.scaleBand()
        .range([height, 0])
        .padding(0.3)
        .domain(Object.keys(sortedShapDict))

    predictSvg.append("g")
        .call(d3.axisLeft(yAxis))

    predictSvg.selectAll("myline")
        .data(Object.entries(sortedShapDict))
        .enter()
        .append('g')
        .append("line")
        .attr('x1', function (d, count) {
            if (count === 0) {
                count = count + 1;
                return xAxis(baseValue);
            } else {
                X1_pos = populateValue(count);
                return xAxis(X1_pos);
            }
        })
        .attr('x2', function (d) {
            transitionValue = transitionValue + parseFloat(d[1]);
            return xAxis(transitionValue)
        })
        .attr("y1", function (d) {
            return yAxis(d[0])
        })
        .attr("y2", function (d) {
            return yAxis(d[0])
        })
        .attr("stroke", function (d) {
            if (d[1] < 0) {
                return '#63e5ff';
            } else {
                return '#FF1493'
            }
        })
        .attr("stroke-width", yAxis.bandwidth() / 2)

    predictSvg.selectAll("myline")
        .data(Object.entries(sortedShapDict))
        .enter()
        .append('g')
        .append('text')
        .text(function (d) {
            if (d[1] >= 0) {
                return ("+" + Math.abs(d[1].toFixed(2)))
            } else {
                return ("-" + Math.abs(d[1].toFixed(2)))
            }
        })
        .attr('x', function (d) {
            // debugger
            if (d[1] >= 0) {
                X_pos = X_pos + parseFloat(d[1]);
                return xAxis(X_pos) + 20;
            } else {
                X_pos = X_pos + parseFloat(d[1]);
                return xAxis(X_pos) - 20;
            }
        })
        .attr('y', function (d) {
            return yAxis(d[0]) + yAxis.bandwidth() - 12;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "blue")
        .attr("font-weight", "600")
        .attr("text-anchor", "middle");

    predictSvg.append('g')
        .append('text')
        .text('Base value = ' + baseValue.toFixed(2))
        .attr('x', width-250)
        .attr('y', height + 50)
        .attr('font-size', '13')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')

     predictSvg.append('g')
        .append('text')
        .attr('x', width-350)
        .attr('y', height + 32)
        .text('Mean (|SHAP value|) impact on model output')
        .attr('font-size', '13')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')

    function populateValue(count) {
        base = baseValue
        shapVal = Object.values(sortedShapDict)
        for (var i = 0; i < count; i++) {
            base = base + shapVal[i];
        }
        return base;
    }

}

function clearPredictSVG() {
    predictSvg.selectAll('g').remove();
}
