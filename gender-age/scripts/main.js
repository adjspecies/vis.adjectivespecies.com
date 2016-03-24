(function () {
  // Data structures
  var genderData;
  var agesData;
  var agesMap;

  // Total counts used throughout in various calculations
  var totalCountAcrossAllGender;
  var averageAgeAcrossAllGender;

  // The selected gender chosen by the user. Array of gender objects.
  var selectedGender = [];

  // Chart constants
  var margin = {top: 15, right: 20, bottom: 35, left: 40};
  var width = 720 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var x = d3.scale
      .linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickFormat(d3.format('.0%'));

  var genderLine = d3.svg.line()
      .interpolate('monotone')
      .x(function (d) { return x(d.age); })
      .y(function (d) { return y(d.countRatio); });

  var averageLine = d3.svg.line()
      .interpolate('monotone')
      .x(function (d) { return x(d.age); })
      .y(function (d) { return y(d.countRatio); });

  var svg = d3.select('.chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var xAxisSVG = svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')');

  xAxisSVG.append('text')
      .attr('y', 30)
      .attr('x', 415)
      .text('Age');

  var yAxisSVG = svg.append('g')
      .attr('class', 'y axis');

  yAxisSVG.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Responses');

  var averageLineSVG = svg.append('g')
      .attr('class', 'total')
    .append('path')
      .attr('class', 'line');

  // The key in the top-right of the chart, which contains the line labels and average age values
  var key = svg.append('g')
      .attr('class', 'key')
      .attr('transform', 'translate(' + (width - 320) + ', 25)');

  var keyAll = key.append('g')
      .attr('class', 'key-all');

  keyAll.append('path')
      .attr('class', 'line')
      .attr('d', 'm0 0 h25');

  keyAll.append('text')
      .text('Average of all')
      .attr('x', 30)
      .attr('y', 3);

  var keyGender = key.append('g')
      .attr('class', 'key-gender');

  keyGender.append('path')
      .attr('class', 'line')
      .attr('d', 'm0 22 h25');

  keyGender.append('text')
      .text('All genders')
      .attr('x', 30)
      .attr('y', 25);

  // The "relative" checkbox
  d3.select('.additional-labels')
    .append('label')
      .attr('class', 'label-relative')
      .html('<input type="checkbox"> Relative y-axis')
    .select('input')
      .on('change', function () {
        if (this.checked) {
          setDataType('relative');
          drawChart();
        } else {
          setDataType('absolute');
          drawChart();
        }
      });

  /**
   * Returns the average age of an array of age objects
   * @param  {Array} ageData Array of age objects, containing .age and .count properties
   * @return {Number}
   */
  function getAverageAge(ageData) {
    var agesSum = 0;
    var countSum = 0;
    ageData.forEach(function (d) {
      agesSum += d.age * d.count;
      countSum += d.count;
    });
    return agesSum / countSum;
  }

  /**
   * Processes the data immediately after it's been loaded and parsed by D3. It restructures it into
   * a format that's more sympathetic to D3's drawing.
   * @param  {Array} data Basic array of parsed CSV data
   */
  function processData(data) {
    // Firstly filter out data we don't want
    data = data.filter(function (d) {
      return d.age >= 10 && d.age <= 90;
    });

    // Next we want to structure the data for d3, so we group by gender and sum up a few values.
    // All of the calculations are done up-front before we cut the data down to the top 20 gender.
    genderData = _(data)
      .groupBy('genderId')
      .map(function (ageData, genderId) {
        return {
          genderId: genderId.replace(/[-,/()&\s]/g, '').toLowerCase(),
          genderName: genderId,
          ages: _.sortBy(ageData, 'age'),
          totalCount: _.sum(ageData, 'count'),
          averageAge: getAverageAge(ageData)
        };
      })
      .sortByOrder(['totalCount'], ['desc'])
      .value();

    totalCountAcrossAllGender = _.sum(genderData, 'totalCount');

    // The agesMap is a object map of age to total counts. It is used as a quick lookup table when
    // calculating ratios.
    agesMap = _(data)
      .groupBy('age')
      .mapValues(function (d) {
        return _.sum(d, 'count');
      })
      .value();

    // Data used to draw the red average baseline in the chart, this is just the totals for each age
    agesData = _.map(agesMap, function (v, k) {
      return {
        age: +k,
        count: v
      };
    });

    averageAgeAcrossAllGender = getAverageAge(agesData);

    // Finally we want to cut the data down to the top 20 gender, filter out "other" gender,
    // and only include responses below age 40
    genderData = _(genderData)
      .filter(function (d) {
        return d.genderName !== 'Other';
        // return d.genderId.toLowerCase().indexOf('other') === -1;
      })
      .tap(function (genderData) {
        genderData.forEach(function (d) {
          d.ages = d.ages.filter(function (v) {
            return v.age <= 40;
          });
        });
      })
      .slice(0, 20)
      .value();

    // We also need to cut down the data for the red average baseline
    agesData = agesData.filter(function (d) {
      return d.age <= 40;
    });

    // Set the selected gender (ie. highlighted lines). By default we select all gender.
    selectedGender = _.clone(genderData);
  }

  /**
   * Sets the absolute or relative data types by adjusting the ratio values in the data.
   * @param {String} type Either "absolute" or "relative"
   */
  function setDataType(type) {
    // Set ratios for each age depending on the type ('absolute' or 'relative')
    genderData.forEach(function (gender) {
      gender.ages.forEach(function (age) {
        if (type === 'absolute') {
          age.countRatio = age.count / gender.totalCount;
        } else {
          age.countRatio = (age.count / gender.totalCount) - (agesMap[age.age] / totalCountAcrossAllGender);
        }
      });
    });

    // Also set the ratios for the average age array, for the relative chart we just
    // set the ratio to 0 so the line is straight
    agesData.forEach(function (age) {
      if (type === 'absolute') {
        age.countRatio = age.count / totalCountAcrossAllGender;
      } else {
        age.countRatio = 0;
      }
    });

    // Update the axis domain scales to reflect the new ranges of values
    x.domain([
      d3.min(genderData, function (d) {
        return d3.min(d.ages, function (v) {
          return v.age;
        });
      }),
      d3.max(genderData, function (d) {
        return d3.max(d.ages, function (v) {
          return v.age;
        });
      })
    ]);

    var yMin = d3.min(genderData, function (d) {
      return d3.min(d.ages, function (v) {
        return v.countRatio;
      });
    });

    var yMax = d3.max(genderData, function (d) {
      return d3.max(d.ages, function (v) {
        return v.countRatio;
      });
    });

    if (type === 'relative') {
      yMin = -Math.max(Math.abs(yMin), Math.abs(yMax));
      yMax = Math.max(Math.abs(yMin), Math.abs(yMax));
    }

    y.domain([yMin, yMax]);
  }

  /**
   * Draws the chart. Called whenever the user switches from absolute to relative.
   */
  function drawChart() {
    xAxisSVG.call(xAxis);
    yAxisSVG.transition().duration(750).call(yAxis);

    // Select the gender lines
    var gender = svg.selectAll('.gender')
      .data(genderData);

    // Enter
    gender.enter()
      .append('g')
        .attr('class', function (d) {
          return 'gender ' + d.genderId.toLowerCase();
        })
      .append('path')
        .attr('class', 'line')
        .attr('d', function (d) {
          return genderLine(d.ages);
        })
        .on('mouseover', onGenderButtonOver)
        .on('mouseout', onGenderButtonOut);

    // Update
    gender.select('.line')
      .transition()
      .duration(750)
      .attr('d', function (d) {
        return genderLine(d.ages);
      });

    // Update the red average line
    averageLineSVG
      .datum(agesData)
      .transition()
      .duration(750)
      .attr('d', function (d) {
        return averageLine(d);
      });
  }

  /**
   * Highlights the given gender lines on the chart
   * @param  {Array} genderToHighlight Array of gender objects
   */
  function highlightGender(genderToHighlight) {
    // Fade all gender lines out
    d3.selectAll('.gender')
      .classed('faded', true)
      .classed('active', false);

    // Highlight the selected lines
    genderToHighlight.forEach(function (d) {
      d3.select('.gender.' + d.genderId.toLowerCase())
        .classed('faded', false)
        .classed('active', true);
    });
  }

  /**
   * Highlights the given gender buttons next to the chart
   * @param  {Array} genderToHighlight Array of gender objects
   */
  function highlightGenderButton(genderToHighlight) {
    // Unselect all gender buttons
    d3.select('.labels').selectAll('.label-gender')
      .classed('active', false);

    // If all gender are selected then highlight the "All" button
    // otherwise highlight the specific gender button
    if (genderToHighlight.length === genderData.length) {
      d3.select('.labels .label-all').classed('active', true);
    } else {
      genderToHighlight.forEach(function (d) {
        d3.select('.label-gender.' + d.genderId.toLowerCase())
          .classed('active', true);
      });
    }
  }

  /**
   * Update the key in the chart to show the average of the currently highlighted gender
   * @param  {Array} genderToUpdate Array of gender objects (only the first entry is used)
   */
  function updateKey(genderToUpdate) {
    keyAll.select('text').text('Average of all (average age ' + averageAgeAcrossAllGender.toFixed(2) + ')');

    // If the user has selected "All" then we show the average age from all gender
    if (genderToUpdate.length === genderData.length) {
      keyGender.select('text').text('All genders (average age ' + averageAgeAcrossAllGender.toFixed(2) + ')');
    } else {
      keyGender.select('text').text(genderToUpdate[0].genderName + ' (average age ' + genderToUpdate[0].averageAge.toFixed(2) + ')');
    }
  }

  /**
   * Adds the gender buttons to the right of the chart
   */
  function addGenderButtons() {
    // The "All" button. We create a fake gender with a name of "all" to fudge
    // this behaviour into the rest of the chart
    d3.select('.labels')
      .selectAll('.label-all')
        .data([{gender: 'all'}])
      .enter()
        .append('label')
        .attr('class', 'label-all')
        .html('<input type="radio" name="gender" value="all"> All (' + totalCountAcrossAllGender + ')')
        .on('mouseover', onGenderButtonOver)
        .on('mouseout', onGenderButtonOut)
      .select('input')
        .on('change', onGenderButtonChange)
        .property('checked', true);

    // Create the labels for each of the gender
    d3.select('.labels')
      .selectAll('.label')
        .data(genderData)
      .enter()
        .append('label')
        .attr('class', function (d) {
          return 'label-gender ' + d.genderId.toLowerCase();
        })
        .html(function (d) {
          return '<input type="radio" name="gender" value="' + d.gender + '"> ' + d.genderName + ' (' + d.totalCount + ')';
        })
        .on('mouseover', onGenderButtonOver)
        .on('mouseout', onGenderButtonOut)
      .select('input')
        .on('change', onGenderButtonChange);
  }

  function onGenderButtonOver(d) {
    var genderToHighlight;
    if (d.gender === 'all') {
      genderToHighlight = _.clone(genderData);
    } else {
      genderToHighlight = [d];
    }
    highlightGender(genderToHighlight);
    updateKey(genderToHighlight);
  }

  function onGenderButtonOut(d) {
    highlightGender(selectedGender);
    updateKey(selectedGender);
  }

  function onGenderButtonChange(d) {
    if (d.gender === 'all') {
      selectedGender = _.clone(genderData);
    } else {
      selectedGender = [d];
    }
    highlightGender(selectedGender);
    highlightGenderButton(selectedGender);
    updateKey(selectedGender);
  }

  // Load gender data
  d3.csv('data/2015.csv')
    .row(function (d) {
      // Parse data
      return {
        genderId: d.gender,
        age: +d.age,
        count: +d.count
      };
    })
    .get(function (err, data) {
      // On success
      if (!err) {
        processData(data);
        setDataType('absolute');
        addGenderButtons();
        updateKey(selectedGender);
        drawChart();
      }
    });

})();
