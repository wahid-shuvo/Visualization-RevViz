function generateGlobalExplanation() {
    predictSvg.selectAll('g').remove();
    const sum_pos_feature_imp = new Array(global_pos_shap_values[0].length).fill(0);
    const sum_neg_feature_imp = new Array(global_neg_shap_values[0].length).fill(0);
    const mean_pos_feature_imp = new Array(global_pos_shap_values[0].length).fill(0)
    const mean_neg_feature_imp = new Array(global_neg_shap_values[0].length).fill(0)
    for (var i = 0; i < global_pos_shap_values.length; i++) {
        for (var j = 0; j < global_pos_shap_values[i].length; j++) {
            sum_pos_feature_imp[j] = sum_pos_feature_imp[j] + Math.abs(global_pos_shap_values[i][j])
        }
    }
    for (var i = 0; i < global_neg_shap_values.length; i++) {
        for (var j = 0; j < global_neg_shap_values[i].length; j++) {
            sum_neg_feature_imp[j] = sum_neg_feature_imp[j] + Math.abs(global_neg_shap_values[i][j])
        }
    }
    for (var i = 0; i < sum_pos_feature_imp.length; i++) {
        mean_pos_feature_imp[i] = (sum_pos_feature_imp[i] / global_pos_shap_values.length)
    }
    for (var i = 0; i < sum_pos_feature_imp.length; i++) {
        mean_neg_feature_imp[i] = (mean_neg_feature_imp[i] / global_neg_shap_values.length)
    }

    var feature_name = ['RE', 'RENL', 'SWR', 'SKR', 'QR', 'CER', 'CS', 'ACF', 'CT', 'TAC', 'RT', 'RCF', 'TRC', 'RP', 'ExtLib', 'Sentiment'];
    var ShapPosDict = {};
    var ShapNegDict = {};
    var x_domain = d3.extent(mean_pos_feature_imp);

    for (var i = 0; i < feature_name.length; i++) {
        ShapPosDict[feature_name[i]] = mean_pos_feature_imp[i];
    }

    for (var i = 0; i < feature_name.length; i++) {
        ShapNegDict[feature_name[i]] = mean_pos_feature_imp[i];
    }
    const sortedShapPosDict = Object.entries(ShapPosDict)
        .sort(([, a], [, b]) => Math.abs(a) - Math.abs(b))
        .reduce((r, [k, v]) => ({...r, [k]: v}), {});

    const sortedShapNegDict = Object.entries(ShapPosDict)
        .sort(([, a], [, b]) => Math.abs(a) - Math.abs(b))
        .reduce((r, [k, v]) => ({...r, [k]: v}), {});

    let xAxis = d3.scaleLinear()
        .range([0, width])
        .domain([0.00, x_domain[1] * 2])

    predictSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis))

    let yAxis = d3.scaleBand()
        .range([height, 0])
        .padding(0.08)
        .domain(Object.keys(sortedShapPosDict))

    predictSvg.append("g")
        .call(d3.axisLeft(yAxis))

    let line1 = predictSvg.selectAll("myline")
        .data(Object.entries(sortedShapPosDict))
        .enter()
        .append("g")
    line1.append("line")
        .attr("x1", function (d) {
            return xAxis(0.00);
        })
        .attr("y1", function (d) {
            return yAxis(d[0]) + yAxis.bandwidth() / 2;
        })
        .attr("x2", function (d) {
            return xAxis(d[1]);
        })
        .attr("y2", function (d) {
            return yAxis(d[0]) + yAxis.bandwidth() / 2;
        })
        .attr("stroke", '#FF1493')
        .attr("stroke-width", yAxis.bandwidth());

    let line2 = predictSvg.selectAll("myline")
        .data(Object.entries(sortedShapNegDict))
        .enter()
        .append("g")

    line2.append("line")
        .attr("x1", function (d) {
            prev_x1 = getPrevx1(d[0])
            return xAxis(prev_x1);
        })
        .attr("y1", function (d) {
            return yAxis(d[0]) + yAxis.bandwidth() / 2;
        })
        .attr("x2", function (d) {
            return xAxis(d[1]) * 2;
        })
        .attr("y2", function (d) {
            return yAxis(d[0]) + yAxis.bandwidth() / 2;
        })
        .attr("stroke", '#63e5ff')
        .attr("stroke-width", yAxis.bandwidth());


    function getPrevx1(key) {
        return sortedShapPosDict[key]
    }

    predictSvg.append('g')
        .append('line')
        .attr('x1', width - 100)
        .attr('x2', width - 70)
        .attr('y1', height - 40)
        .attr('y2', height - 40)
        .attr("stroke", '#FF1493')
        .attr("stroke-width", '5px')

    predictSvg.append('g')
        .append('text')
        .attr('x', width - 65)
        .attr('y', height - 36)
        .text('Useful')
        .attr('font-size', '12')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')

        predictSvg.append('g')
        .append('line')
        .attr('x1', width - 100)
        .attr('x2', width - 70)
        .attr('y1', height - 20)
        .attr('y2', height - 20)
        .attr("stroke", '#63e5ff')
        .attr("stroke-width", '5px')

    predictSvg.append('g')
        .append('text')
        .attr('x', width - 65)
        .attr('y', height - 16)
        .text('Non-Useful')
        .attr('font-size', '12')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')

    predictSvg.append('g')
        .append('text')
        .attr('x', width-350)
        .attr('y', height + 40)
        .text('Mean (|SHAP value|) average impact on model output')
        .attr('font-size', '14')
        .attr('font-family', 'Segoe UI bold')
        .attr('fill', 'black')

}