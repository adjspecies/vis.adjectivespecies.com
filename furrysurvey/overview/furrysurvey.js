var furrySurvey = function(d3, nv, _data) {
  var utils = {
    objectToArray: function(obj) {
      return obj instanceof Array ?
        obj :
        Object.keys(obj).map(function(k) {
          return {key: k, values: obj[k]};
        });
    },
    objectToChartData: function (n, obj) {
      return obj.map(function(item) {
        item.values = utils.objectToArray(item.values)
        .map(function(yearItem) {
          return {
            key: yearItem.key,
            values: yearItem.values / n[item.key] * 100
          }
        });
      return item;
      });
    },
    mean: function(n, obj) {
      _.each(obj, function(year) {
        year.values = utils.objectToArray(year.values);
      });
      return {
        n: _.reduce(_.values(n), function(m, n) {
          return m + (isNaN(parseInt(n)) ? 0 : n);
        }) / 60,
        values: _.map(obj[0].values, function(item, index) {
          return _.reduce(obj, function(m, year) {
            m.values += year.values[index].values;
            return m;
          }, {key: item.key, values: 0});
        })
      };
    },
    flip: function(arr) {
      var flipped = [];
      arr[0].values.forEach(function(item, idx) {
        flipped.push(arr.map(function(subArr) {
          return subArr[idx];
        }));
      });
      return flipped;
    }
  };

  function chartAge(n, _chartData) {
    var chartData = _chartData.map(function(item) {
      item.values = utils.objectToArray(item.values)
      .reverse()
      .map(function(yearItem) {
        return {
          key: parseInt(item.key) - parseInt(yearItem.key),
          values: yearItem.values / n[item.key] * 100
        };
      });
      return item;
    });
    nv.addGraph(function() {
      var vis = nv.models.lineChart()
        .useInteractiveGuideline(true)
        .isArea(true)
        .x(function(d) { return d.key; })
        .y(function(d) { return d.values; });

      vis.yAxis
        .tickFormat(function(d) { return d.toPrecision(2) + '%' })
        .axisLabel("Percentage of respondents");
      vis.xAxis.axisLabel("Age in years");

      d3.select('#age svg')
        .datum(chartData)
        .transition().duration(500)
        .call(vis);

      nv.utils.windowResize(vis.update);

      return vis;
    });
  }

  function chartStacked(n, _chartData, id) {
    var chartData = _.map(_.keys(_chartData[_chartData.length - 1].values), function(key) {
      return { key: key, values: _.map(_chartData, function(year) {
        return [ isNaN(year.values[key]) ? 0 : year.values[key] / n[year.key] * 100, parseInt(year.key) ];
      }) };
    });
    nv.addGraph(function() {
      var vis = nv.models.stackedAreaChart()
        .useInteractiveGuideline(true)
        .x(function(d) { return d[1]; })
        .y(function(d) { return d[0]; });
      vis.xAxis.tickFormat(function(d) { return d.toString(); });
      d3.select('#' + id + ' svg')
        .datum(chartData)
        .transition().duration(500)
        .call(vis);

      nv.utils.windowResize(vis.update);

      return vis;
    });
  }

  function chartPie(n, _chartData, id) {
    var means = utils.mean(n, utils.objectToChartData(n, utils.objectToArray(_chartData)));
    nv.addGraph(function() {
      var vis = nv.models.pieChart()
        .x(function(d) { return d.key; })
        .y(function(d) { return d.values; })
        .labelType('percent');
      d3.select('#' + id + ' svg')
        .datum(means.values)
        .transition().duration(500)
        .call(vis)

      nv.utils.windowResize(vis.update);

    return vis;
    })
  }

  function chartSexImportance(n, _chartData, id) {
    var means = utils.mean(n, utils.objectToChartData(n, utils.objectToArray(_chartData)));
    n.mean = means.n;
    _chartData.mean = means.values;
    var chartData = utils.objectToChartData(n, utils.objectToArray(_chartData));
    nv.addGraph(function() {
      var vis = nv.models.lineChart()
        .useInteractiveGuideline(true)
        .x(function(d) { return parseInt(d.key); })
        .y(function(d) { return d.values; });
      vis.yAxis
        .tickFormat(function(d) { return d.toPrecision(2) + '%'; })
        .axisLabel('Percentage of respondents');
      vis.xAxis.axisLabel('How sexual is furry - ' + id);
      d3.select('#sex_importance__' + id + ' svg')
        .datum(chartData)
        .transition().duration(500)
        .call(vis);

      nv.utils.windowResize(vis.update);

      return vis;
    });
  }

  chartPie(
    _data.n,
    utils.objectToArray(_data.furry_metadata.furry_status),
    'furry_status');

  chartAge(
    _data.n,
    utils.objectToArray(_data.demographics.age));

  chartPie(
    _data.n,
    utils.objectToArray(_data.demographics.gender_alignment),
    'gender_alignment')
    
  chartStacked(
    _data.n,
    utils.objectToArray(utils.objectToArray(_data.demographics.biological_sex)),
    'biological_sex');

  chartStacked(
    _data.n,
    utils.objectToArray(_data.demographics.gender_identity),
    'gender_identity');

  chartStacked(
    _data.n,
    utils.objectToArray(_data.demographics.sexual_orientation),
    'sexual_orientation');

  chartStacked(
    _data.n,
    utils.objectToArray(_data.demographics.race),
    'race');

  chartStacked(
    _data.n,
    utils.objectToArray(_data.demographics.political_views.social),
    'political_views__social');

  chartStacked(
    _data.n,
    utils.objectToArray(_data.demographics.political_views.economic),
    'political_views__economic');

  chartStacked(
    _data.n,
    utils.objectToArray(_data.demographics.relationship_status),
    'relationship');

  chartPie(
    _data.n,
    utils.objectToArray(_data.furry_metadata.partner_is_furry),
    'partner_is_furry');

  chartPie(
    _data.n,
    utils.objectToArray(_data.demographics.polyamory.sexuality),
    'polyamory__sexuality');

  chartPie(
    _data.n,
    utils.objectToArray(_data.demographics.polyamory.romantic),
    'polyamory__romantic');

  chartSexImportance(
    _data.n,
    _data.perception_of_fandom.importance_of_sex.self,
    'self');

  chartSexImportance(
    _data.n,
    _data.perception_of_fandom.importance_of_sex.others,
    'others');

  chartSexImportance(
    _data.n,
    _data.perception_of_fandom.importance_of_sex.public,
    'public');
};

d3.json('overview.json', function(data) {
  furrySurvey(d3, nv, data);
});
