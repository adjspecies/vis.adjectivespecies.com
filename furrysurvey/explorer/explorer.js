
var date = new Date();
function log(message) {
  var timestamp = new Date();
  console.log(timestamp, timestamp - date, message);
  d3.select('#status').html(function() {
    return d3.select(this).html() + "<br />" + message;
  });
}

d3.selectAll('.minimize')
  .on('click', function(d) {
    var charts = d3.select(this.parentNode.parentNode);
    charts.classed('minimized', !charts.classed('minimized'));
    d3.select(this).text(charts.classed('minimized') ? '+' : '-');
  });

log('Building charts...');
var charts = {
  year: dc.rowChart('#chart-year'),
  age: dc.barChart('#chart-age'),
  biosex: dc.pieChart('#chart-biosex'),
  gender: dc.pieChart('#chart-gender'),
  orientation: dc.pieChart('#chart-orientation'),
  education: dc.pieChart('#chart-education'),
  occupation: dc.pieChart('#chart-occupation'),
  religion: dc.pieChart('#chart-religion'),
  relationship: dc.pieChart('#chart-relationship'),
  partner_is_furry: dc.pieChart('#chart-partner_is_furry'),
  polyamorous_romantic: dc.pieChart('#chart-polyamorous-romantic'),
  polyamorous_sexual: dc.pieChart('#chart-polyamorous-sexual'),
  howfurry: dc.pieChart('#chart-howfurry'),
  how_much_human: dc.pieChart('#chart-how_much_human'),
  rp_as_different_gender: dc.pieChart('#chart-rp_as_different_gender'),
  years_known_fandom: dc.barChart('#chart-years_known_fandom'),
  years_as_furry: dc.barChart('#chart-years_as_furry'),
  furries_known: dc.barChart('#chart-furries_known'),
  furries_known_in_person: dc.barChart('#chart-furries_known_in_person'),
  state: dc.geoChoroplethChart('#chart-state'),
  //country: dc.geoChoroplethChart('#chart-country'),
  country: dc.pieChart('#chart-country'),
};
var ndx, dimensions, groups, activeDimensions = 1;

log('Loading data...');
d3.csv('results.csv', function(data) {
  log('...Data loaded...');
  d3.json('../lib/geojson/us-states.json', function(statesJson) {
    log('...States loaded...');
    d3.json('../lib/geojson/countries.json', function(countriesJson) {
      log('...Countries loaded...');
      log('Data loaded.');
      buildCharts(data, statesJson, countriesJson);
    });
  });
});

function buildCharts(data, statesJson, countriesJson) {
  log('Setting up crossfilter...');
  ndx = crossfilter(data);
  var all = ndx.groupAll();

  log('Setting up dimensions and groups...');
  dimensions = {
    year: ndx.dimension(function(d) {
            return +d.year;
          }),
  };

  groups = {
    year:   dimensions.year.group(),
  };

  log('Building year chart...');
  charts.year.width(200)
    .height(200)
    .group(groups.year)
    .dimension(dimensions.year)
    .label(function(d) { return d.key; })
    .title(function(d) { return d.value; })
    .elasticX(true)
    .xAxis().ticks(2);

  log('Building demographics charts...');
  dimensions.age = ndx.dimension(function(d) {
    return Math.floor(
      (date.getFullYear() + (date.getMonth() + 1) / 12 + 1/24) -
      (+d.birthdate));
  });
  dimensions.biosex = ndx.dimension(function(d) {
    return d.biosex;
  });
  dimensions.gender = ndx.dimension(function(d) {
    return d.gender;
  });
  dimensions.orientation = ndx.dimension(function(d) {
    return d.orientation;
  });
  dimensions.occupation = ndx.dimension(function(d) {
    return d.occupation;
  });
  dimensions.education = ndx.dimension(function(d) {
    return d.education;
  });
  dimensions.religion = ndx.dimension(function(d) {
    return d.religion;
  });
  groups.age = dimensions.age.group();
  groups.biosex = dimensions.biosex.group();
  groups.gender = dimensions.gender.group();
  groups.orientation = dimensions.orientation.group();
  groups.occupation = dimensions.occupation.group();
  groups.education = dimensions.education.group();
  groups.religion = dimensions.religion.group();
  charts.age.width(510)
    .height(250)
    .x(d3.scale.linear().domain([0,100]))
    .group(groups.age)
    .dimension(dimensions.age)
    .elasticY(true)
    .title(function(d) { return d.key + ' (' + d.value + ')'; });
  charts.biosex.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.biosex)
    .dimension(dimensions.biosex);
  charts.gender.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.gender)
    .dimension(dimensions.gender);
  charts.orientation.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.orientation)
    .dimension(dimensions.orientation);
  charts.occupation.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.occupation)
    .dimension(dimensions.occupation);
  charts.education.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.education)
    .dimension(dimensions.education);
  charts.religion.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.religion)
    .dimension(dimensions.religion);
  dimensions.age.dispose();
  dimensions.biosex.dispose();
  dimensions.gender.dispose();
  dimensions.orientation.dispose();
  dimensions.occupation.dispose();
  dimensions.education.dispose();
  dimensions.religion.dispose();

  log('Building race charts...');
  race.forEach(function(r) {
    var rr = 'race_' + r;
    dimensions[rr] = ndx.dimension(function(d) {
      return d[rr];
    })
    groups[rr] = dimensions[rr].group();
    charts[rr] = dc.pieChart('#chart-' + rr).width(250)
      .height(250)
      .radius(120)
      .innerRadius(50)
      .colorCalculator(function(d) {
        return d == 1 ? '#51aeff' : '#ccc';
      })
      .renderLabel(false)
      .group(groups[rr])
      .dimension(dimensions[rr]);
    dimensions[rr].dispose();
  });

  log('Building politics charts...');
  politics.forEach(function(p) {
    var pp = 'politics_' + p;
    dimensions[pp] = ndx.dimension(function(d) {
      return +d[pp];
    });
    groups[pp] = dimensions[pp].group();
    charts[pp] = dc.barChart('#chart-' + pp).width(250)
      .height(250)
      .x(d3.scale.linear().domain([1,11]))
      .elasticY(true)
      .group(groups[pp])
      .dimension(dimensions[pp])
      .title(function(d) { return d.key + ' (' + d.value + ')'; });
    dimensions[pp].dispose();
  });

  log('Building relationship charts...');
  dimensions.relationship = ndx.dimension(function(d) {
    return d.relationship;
  });
  dimensions.partner_is_furry = ndx.dimension(function(d) {
    return d.relationship === 'Single' ? '' :
    d.partner_is_furry;
  });
  dimensions.polyamorous_romantic = ndx.dimension(function(d) {
    return d.polyamorous_romantic;
  });
  dimensions.polyamorous_sexual = ndx.dimension(function(d) {
    return d.polyamorous_sexual;
  });
  groups.relationship = dimensions.relationship.group();
  groups.partner_is_furry = dimensions.partner_is_furry.group();
  groups.polyamorous_romantic = dimensions.polyamorous_romantic.group();
  groups.polyamorous_sexual = dimensions.polyamorous_sexual.group();
  charts.relationship.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.relationship)
    .dimension(dimensions.relationship);
  charts.partner_is_furry.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.partner_is_furry)
    .dimension(dimensions.partner_is_furry);
  charts.polyamorous_romantic.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.polyamorous_romantic)
    .dimension(dimensions.polyamorous_romantic);
  charts.polyamorous_sexual.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.polyamorous_sexual)
    .dimension(dimensions.polyamorous_sexual);
  dimensions.relationship.dispose();
  dimensions.partner_is_furry.dispose();
  dimensions.polyamorous_romantic.dispose();
  dimensions.polyamorous_sexual.dispose();

  log('Building furry identity charts...');
  dimensions.howfurry = ndx.dimension(function(d) {
    return d.howfurry;
  });
  dimensions.how_much_human = ndx.dimension(function(d) {
    return d.how_much_human;
  });
  dimensions.rp_as_different_gender = ndx.dimension(function(d) {
    return d.rp_as_different_gender;
  });
  dimensions.years_known_fandom = ndx.dimension(function(d) {
    return +d.years_known_fandom;
  });
  dimensions.years_as_furry = ndx.dimension(function(d) {
    return +d.years_as_furry;
  });
  dimensions.furries_known = ndx.dimension(function(d) {
    return +d.furries_known;
  });
  dimensions.furries_known_in_person = ndx.dimension(function(d) {
    return +d.furries_known_in_person;
  });
  groups.howfurry = dimensions.howfurry.group();
  groups.how_much_human = dimensions.how_much_human.group();
  groups.rp_as_different_gender = dimensions.rp_as_different_gender.group();
  groups.years_known_fandom = dimensions.years_known_fandom.group();
  groups.years_as_furry = dimensions.years_as_furry.group();
  groups.furries_known = dimensions.furries_known.group();
  groups.furries_known_in_person = dimensions.furries_known_in_person.group();
  charts.howfurry.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.howfurry)
    .dimension(dimensions.howfurry);
  charts.how_much_human.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.how_much_human)
    .dimension(dimensions.how_much_human);
  charts.rp_as_different_gender.width(250)
    .height(250)
    .radius(120)
    .innerRadius(50)
    .group(groups.rp_as_different_gender)
    .dimension(dimensions.rp_as_different_gender);
  charts.years_known_fandom.width(300)
    .height(250)
    .x(d3.scale.linear().domain([0, 30]))
    .elasticY(true)
    .dimension(dimensions.years_known_fandom)
    .group(groups.years_known_fandom)
    .title(function(d) { return d.key + ' (' + d.value + ')'; });
  charts.years_as_furry.width(300)
    .height(250)
    .x(d3.scale.linear().domain([0, 30]))
    .elasticY(true)
    .dimension(dimensions.years_as_furry)
    .group(groups.years_as_furry)
    .title(function(d) { return d.key + ' (' + d.value + ')'; });
  charts.furries_known.width(300)
    .height(250)
    .x(d3.scale.linear().domain([0, 30]))
    .elasticY(true)
    .dimension(dimensions.furries_known)
    .group(groups.furries_known)
    .title(function(d) { return d.key + ' (' + d.value + ')'; });
  charts.furries_known_in_person.width(300)
    .height(250)
    .x(d3.scale.linear().domain([0, 30]))
    .elasticY(true)
    .dimension(dimensions.furries_known_in_person)
    .group(groups.furries_known_in_person)
    .title(function(d) { return d.key + ' (' + d.value + ')'; });
  dimensions.howfurry.dispose();
  dimensions.how_much_human.dispose();
  dimensions.rp_as_different_gender.dispose();
  dimensions.years_known_fandom.dispose();
  dimensions.years_as_furry.dispose();
  dimensions.furries_known.dispose();
  dimensions.furries_known_in_person.dispose();

  log('Building species charts...');
  species.forEach(function(s) {
    var ss = 'species_' + s;
    dimensions[ss] = ndx.dimension(function(d) {
      return d['animal_' + s];
    });
    groups[ss] = dimensions[ss].group();
    charts[ss] = dc.pieChart('#chart-' + ss).width(250)
      .height(250)
      .radius(120)
      .innerRadius(50)
      .colorCalculator(function(d) {
        return d == 1 ? '#51aeff' : '#ccc';
      })
      .renderLabel(false)
      .group(groups[ss])
      .dimension(dimensions[ss]);
    dimensions[ss].dispose();
  });

  log('Building how-often charts...');
  howoften.forEach(function(h) {
    var hh = 'howoften_' + h;
    dimensions[hh] = ndx.dimension(function(d) {
      return d[hh];
    });
    groups[hh] = dimensions[hh].group();
    charts[hh] = dc.pieChart('#chart-' + hh).width(250)
      .height(250)
      .radius(120)
      .innerRadius(50)
      .group(groups[hh])
      .dimension(dimensions[hh]);
    dimensions[hh].dispose();
  });

  log('Building self-described charts...');
  selfdescribed.forEach(function(i) {
    var ii = 'is_' + i;
    dimensions[ii] = ndx.dimension(function(d) {
      return d[ii];
    });
    groups[ii] = dimensions[ii].group();
    charts[ii] = dc.pieChart('#chart-' + ii).width(250)
      .height(250)
      .radius(120)
      .innerRadius(50)
      .colorCalculator(function(d) {
        return d == 1 ? '#51aeff' : '#ccc';
      })
      .renderLabel(false)
      .group(groups[ii])
      .dimension(dimensions[ii]);
    dimensions[ii].dispose();
  });

  log('Building opinion charts...');
  opinion.forEach(function(o) {
    var oo = 'opinion_' + o;
    dimensions[oo] = ndx.dimension(function(d) {
      return +d[oo];
    });
    groups[oo] = dimensions[oo].group();
    charts[oo] = dc.barChart('#chart-' + oo).width(250)
      .height(250)
      .x(d3.scale.linear().domain([1,11]))
      .elasticY(true)
      .group(groups[oo])
      .dimension(dimensions[oo])
      .title(function(d) { return d.key + ' (' + d.value + ')'; });
    dimensions[oo].dispose();
  });

  log('Building importance charts...');
  importance.forEach(function(i) {
    var ii = 'importance_' + i;
    dimensions[ii] = ndx.dimension(function(d) {
      return +d[ii];
    });
    groups[ii] = dimensions[ii].group();
    charts[ii] = dc.barChart('#chart-' + ii).width(250)
      .height(250)
      .x(d3.scale.linear().domain([1,11]))
      .elasticY(true)
      .group(groups[ii])
      .dimension(dimensions[ii])
      .title(function(d) { return d.key + ' (' + d.value + ')'; });
    dimensions[ii].dispose();
  });

  log('Building sex importance charts...');
  seximportance.forEach(function(s) {
    var ss = 'seximportance_' + s;
    dimensions[ss] = ndx.dimension(function(d) {
      return +d[ss];
    });
    groups[ss] = dimensions[ss].group();
    charts[ss] = dc.barChart('#chart-' + ss).width(250)
      .height(250)
      .x(d3.scale.linear().domain([1,11]))
      .elasticY(true)
      .group(groups[ss])
      .dimension(dimensions[ss])
      .title(function(d) { return d.key + ' (' + d.value + ')'; });
    dimensions[ss].dispose();
  });

  log('Building locations charts...');
  dimensions.state = ndx.dimension(function(d) {
    return d.state;
  });
  dimensions.country = ndx.dimension(function(d) {
    return d.country;
  });
  groups.state = dimensions.state.group();
  groups.country = dimensions.country.group();
  charts.state.width(990)
    .height(550)
    .dimension(dimensions.state)
    .group(groups.state)
    .colors(d3.scale.quantize().range(colorbrewer.PuBu[9]).domain([0, 350]))
    .colorCalculator(function (d) {
      return d ? charts.state.colors()(d) : '#ccc';
    })
    .overlayGeoJson(statesJson.features, 'state', function (d) {
      return d.properties.name;
    })
    .title(function(d) {
      return d.key + ': ' + d.value;
    });
  /*
  charts.country.width(990)
    .height(550)
    .dimension(dimensions.country)
    .group(groups.country)
    .projection(d3.geo.mercator)
    .colors(d3.scale.quantize().range([
        '#E2F2FF', '#C4E4FF', '#9ED2FF', '#81C5FF', '#6BBAFF',
        '#51AEFF', '#36A2FF', '#1E96FF', '#0089FF', '#0061B5'
      ]).domain([0, 400]))
    .colorCalculator(function (d) {
      return d ? charts.country.colors()(d) : '#ccc';
    })
    .overlayGeoJson(countriesJson.features, 'country', function (d) {
      return d.properties.iso_a2.toLowerCase();
    })
    .title(function(d) {
      return d.key + ': ' + d.value;
    });
  */
  charts.country.width(550)
    .height(550)
    .radius(270)
    .innerRadius(100)
    .colors(colorbrewer.PuBu[9])
    .colorDomain([0, 1500])
    .colorAccessor(function(d) {
      return d.value;
    })
    .group(groups.country)
    .dimension(dimensions.country);
  dimensions.state.dispose();
  dimensions.country.dispose();

  log('Rendering...');
  dc.renderAll()
  log('Finished.');
  d3.select('#overlay')
    .transition()
    .duration(750)
    .style('opacity', 0)
    .remove();
}

// Toggles
function updateDimensionsSelected() {
  d3.select('#dimensions-selected').text(activeDimensions);
}

function toggleSimple(attr) {
  var toggle = d3.select('#toggle-' + attr);
  if (!toggle.classed('enabled')) {
    if (activeDimensions < 32) {
      dimensions[attr] = ndx.dimension(function(d) {
        return d[attr];
      });
      groups[attr] = dimensions[attr].group();
      charts[attr].dimension(dimensions[attr]);
      charts[attr].group(groups[attr]);
      activeDimensions++;
      toggle.classed('enabled', true);
    } else {
      alert('Maximum dimensions already selected!');
    }
  } else {
    dimensions[attr].dispose();
    activeDimensions--;
    toggle.classed('enabled', false);
  }
  updateDimensionsSelected();
}

function toggleNumeric(attr) {
  var toggle = d3.select('#toggle-' + attr);
  if (!toggle.classed('enabled')) {
    if (activeDimensions < 32) {
      dimensions[attr] = ndx.dimension(function(d) {
        return +d[attr];
      });
      groups[attr] = dimensions[attr].group();
      charts[attr].dimension(dimensions[attr]);
      charts[attr].group(groups[attr]);
      charts[attr].redraw();
      activeDimensions++;
      toggle.classed('enabled', true);
    } else {
      alert('Maximum dimensions already selected!');
    }
  } else {
    dimensions[attr].dispose();
    charts[attr].redraw();
    activeDimensions--;
    toggle.classed('enabled', false);
  }
  updateDimensionsSelected();
}

// XXX These can be simplified by storing the dimension functions in a separate
// object, so they can be reused wherever.
function toggleAge() {
  var toggle = d3.select('#toggle-age');
  if (!toggle.classed('enabled')) {
    if (activeDimensions < 32) {
      dimensions.age = ndx.dimension(function(d) {
        return Math.floor(
            (date.getFullYear() + (date.getMonth() + 1) / 12 + 1/24) -
            (+d.birthdate)); });
      groups.age = dimensions.age.group();
      charts.age.dimension(dimensions.age);
      charts.age.group(groups.age);
      charts.age.redraw();
      activeDimensions++;
      toggle.classed('enabled', true);
    } else {
      alert('Maximum dimensions already selected!');
    }
  } else {
    dimensions.age.dispose();
    charts.age.redraw();
    activeDimensions--;
    toggle.classed('enabled', false);
  }
  updateDimensionsSelected();
}

function togglePartnerIsFurry() {
  var toggle = d3.select('#toggle-partner_is_furry');
  if (!toggle.classed('enabled')) {
    if (activeDimensions < 32) {
      dimensions.partner_is_furry = ndx.dimension(function(d) {
        return d.relationship === 'Single' ? '' :
        d.partner_is_furry;
      });
      groups.partner_is_furry = dimensions.partner_is_furry.group();
      charts.partner_is_furry.dimension(dimensions.partner_is_furry);
      charts.partner_is_furry.group(groups.partner_is_furry);
      charts.partner_is_furry.redraw();
      activeDimensions++;
      toggle.classed('enabled', true);
    } else {
      alert('Maximum dimensions already selected!');
    }
  } else {
    dimensions.partner_is_furry.dispose();
    activeDimensions--;
    charts.partner_is_furry.redraw();
    toggle.classed('enabled', false);
  }
  updateDimensionsSelected();
}

function toggleSpecies(s) {
  var attr = 'species_' + s;
  var toggle = d3.select('#toggle-' + attr);
  if (!toggle.classed('enabled')) {
    if (activeDimensions < 32) {
      dimensions[attr] = ndx.dimension(function(d) {
        return d['animal_' + s];
      });
      groups[attr] = dimensions[attr].group();
      charts[attr].dimension(dimensions[attr]);
      charts[attr].group(groups[attr]);
      activeDimensions++;
      toggle.classed('enabled', true);
    } else {
      alert('Maximum dimensions already selected!');
    }
  } else {
    dimensions[attr].dispose();
    activeDimensions--;
    toggle.classed('enabled', false);
  }
  updateDimensionsSelected();
}

function clearToggles() {
  d3.selectAll('.toggles .enabled').each(function() {
    d3.select(this).classed('enabled', false);
  });
  Object.keys(dimensions).forEach(function(k) {
    if (k !== 'year') {
      dimensions[k].dispose();
      charts[k].redraw();
    }
  });
  activeDimensions = 1;
  updateDimensionsSelected();
}
