(function () {
  // Data structures
  var speciesData;
  var agesData;
  var agesMap;

  // Total counts used throughout in various calculations
  var totalCountAcrossAllSpecies;
  var averageAgeAcrossAllSpecies;

  // The selected species chosen by the user. Array of species objects.
  var selectedSpecies = [];

  // Chart constants
  var margin = {top: 15, right: 80, bottom: 35, left: 40};
  var width = 860 - margin.left - margin.right;
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

  var speciesLine = d3.svg.line()
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
      .attr('transform', 'translate(' + (width - 235) + ', 25)');

  var keyAll = key.append('g')
      .attr('class', 'key-all');

  keyAll.append('path')
      .attr('class', 'line')
      .attr('d', 'm0 0 h25');

  keyAll.append('text')
      .text('Average of all')
      .attr('x', 30)
      .attr('y', 3);

  var keySpecies = key.append('g')
      .attr('class', 'key-species');

  keySpecies.append('path')
      .attr('class', 'line')
      .attr('d', 'm0 22 h25');

  keySpecies.append('text')
      .text('All species')
      .attr('x', 30)
      .attr('y', 25);

  // The "relative" checkbox
  d3.select('body')
    .append('label')
      .attr('class', 'relative-checkbox')
      .html('<input type="checkbox"> Relative')
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

    // Next we want to structure the data for d3, so we group by species and sum up a few values.
    // All of the calculations are done up-front before we cut the data down to the top 20 species.
    speciesData = _(data)
      .groupBy('speciesId')
      .map(function (ageData, speciesId) {
        return {
          speciesId: speciesId,
          speciesName: _.capitalize(speciesId.replace('-', ' ')),
          ages: _.sortBy(ageData, 'age'),
          totalCount: _.sum(ageData, 'count'),
          averageAge: getAverageAge(ageData)
        };
      })
      .sortByOrder(['totalCount'], ['desc'])
      .value();

    totalCountAcrossAllSpecies = _.sum(speciesData, 'totalCount');

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

    averageAgeAcrossAllSpecies = getAverageAge(agesData);

    // Finally we want to cut the data down to the top 20 species, filter out "other" species,
    // and only include responses below age 40
    speciesData = _(speciesData)
      .filter(function (d) {
        return d.speciesId.toLowerCase().indexOf('other') === -1;
      })
      .tap(function (speciesData) {
        speciesData.forEach(function (d) {
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

    // Set the selected species (ie. highlighted lines). By default we select all species.
    selectedSpecies = _.clone(speciesData);
  }

  /**
   * Sets the absolute or relative data types by adjusting the ratio values in the data.
   * @param {String} type Either "absolute" or "relative"
   */
  function setDataType(type) {
    // Set ratios for each age depending on the type ('absolute' or 'relative')
    speciesData.forEach(function (species) {
      species.ages.forEach(function (age) {
        if (type === 'absolute') {
          age.countRatio = age.count / species.totalCount;
        } else {
          age.countRatio = (age.count / species.totalCount) - (agesMap[age.age] / totalCountAcrossAllSpecies);
        }
      });
    });

    // Also set the ratios for the average age array, for the relative chart we just
    // set the ratio to 0 so the line is straight
    agesData.forEach(function (age) {
      if (type === 'absolute') {
        age.countRatio = age.count / totalCountAcrossAllSpecies;
      } else {
        age.countRatio = 0;
      }
    });

    // Update the axis domain scales to reflect the new ranges of values
    x.domain([
      d3.min(speciesData, function (d) {
        return d3.min(d.ages, function (v) {
          return v.age;
        });
      }),
      d3.max(speciesData, function (d) {
        return d3.max(d.ages, function (v) {
          return v.age;
        });
      })
    ]);

    var yMin = d3.min(speciesData, function (d) {
      return d3.min(d.ages, function (v) {
        return v.countRatio;
      });
    });

    var yMax = d3.max(speciesData, function (d) {
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

    // Select the species lines
    var species = svg.selectAll('.species')
      .data(speciesData);

    // Enter
    species.enter()
      .append('g')
        .attr('class', function (d) {
          return 'species ' + d.speciesId.toLowerCase();
        })
      .append('path')
        .attr('class', 'line')
        .attr('d', function (d) {
          return speciesLine(d.ages);
        })
        .on('mouseover', onSpeciesButtonOver)
        .on('mouseout', onSpeciesButtonOut);

    // Update
    species.select('.line')
      .transition()
      .duration(750)
      .attr('d', function (d) {
        return speciesLine(d.ages);
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
   * Highlights the given species lines on the chart
   * @param  {Array} speciesToHighlight Array of species objects
   */
  function highlightSpecies(speciesToHighlight) {
    // Fade all species lines out
    d3.selectAll('.species')
      .classed('faded', true)
      .classed('active', false);

    // Highlight the selected lines
    speciesToHighlight.forEach(function (d) {
      d3.select('.species.' + d.speciesId.toLowerCase())
        .classed('faded', false)
        .classed('active', true);
    });
  }

  /**
   * Highlights the given species buttons next to the chart
   * @param  {Array} speciesToHighlight Array of species objects
   */
  function highlightSpeciesButton(speciesToHighlight) {
    // Unselect all species buttons
    d3.select('.labels').selectAll('.label')
      .classed('active', false);

    // If all species are selected then highlight the "All" button
    // otherwise highlight the specific species button
    if (speciesToHighlight.length === speciesData.length) {
      d3.select('.labels .label-all').classed('active', true);
    } else {
      speciesToHighlight.forEach(function (d) {
        d3.select('.label.' + d.speciesId.toLowerCase())
          .classed('active', true);
      });
    }
  }

  /**
   * Update the key in the chart to show the average of the currently highlighted species
   * @param  {Array} speciesToUpdate Array of species objects (only the first entry is used)
   */
  function updateKey(speciesToUpdate) {
    keyAll.select('text').text('Average of all (average age ' + averageAgeAcrossAllSpecies.toFixed(2) + ')');

    // If the user has selected "All" then we show the average age from all species
    if (speciesToUpdate.length === speciesData.length) {
      keySpecies.select('text').text('All species (average age ' + averageAgeAcrossAllSpecies.toFixed(2) + ')');
    } else {
      keySpecies.select('text').text(speciesToUpdate[0].speciesName + ' (average age ' + speciesToUpdate[0].averageAge.toFixed(2) + ')');
    }
  }

  /**
   * Adds the species buttons to the right of the chart
   */
  function addSpeciesButtons() {
    // The "All" button. We create a fake species with a name of "all" to fudge
    // this behaviour into the rest of the chart
    d3.select('.labels')
      .selectAll('.label-all')
        .data([{species: 'all'}])
      .enter()
        .append('label')
        .attr('class', 'label-all')
        .html('<input type="radio" name="species" value="all"> All (' + totalCountAcrossAllSpecies + ')')
        .on('mouseover', onSpeciesButtonOver)
        .on('mouseout', onSpeciesButtonOut)
      .select('input')
        .on('change', onSpeciesButtonChange)
        .property('checked', true);

    // Create the labels for each of the species
    d3.select('.labels')
      .selectAll('.label')
        .data(speciesData)
      .enter()
        .append('label')
        .attr('class', function (d) {
          return 'label ' + d.speciesId.toLowerCase();
        })
        .html(function (d) {
          return '<input type="radio" name="species" value="' + d.species + '"> ' + d.speciesName + ' (' + d.totalCount + ')';
        })
        .on('mouseover', onSpeciesButtonOver)
        .on('mouseout', onSpeciesButtonOut)
      .select('input')
        .on('change', onSpeciesButtonChange);
  }

  function onSpeciesButtonOver(d) {
    var speciesToHighlight;
    if (d.species === 'all') {
      speciesToHighlight = _.clone(speciesData);
    } else {
      speciesToHighlight = [d];
    }
    highlightSpecies(speciesToHighlight);
    updateKey(speciesToHighlight);
  }

  function onSpeciesButtonOut(d) {
    highlightSpecies(selectedSpecies);
    updateKey(selectedSpecies);
  }

  function onSpeciesButtonChange(d) {
    if (d.species === 'all') {
      selectedSpecies = _.clone(speciesData);
    } else {
      selectedSpecies = [d];
    }
    highlightSpecies(selectedSpecies);
    highlightSpeciesButton(selectedSpecies);
    updateKey(selectedSpecies);
  }

  // Load species data
  d3.csv('data/2015.csv')
    .row(function (d) {
      // Parse data
      return {
        speciesId: d.species,
        age: +d.age,
        count: +d.count
      };
    })
    .get(function (err, data) {
      // On success
      if (!err) {
        processData(data);
        setDataType('absolute');
        addSpeciesButtons();
        updateKey(selectedSpecies);
        drawChart();
      }
    });
})();
