(function() {

  var animalList = [
    {key: 'animal_wolf', name: 'Wolf'},
    {key: 'animal_redfox', name: 'Red fox'},
    {key: 'animal_dragon', name: 'Dragon'},
    {key: 'animal_domesticcat', name: 'Domestic cat'},
    {key: 'animal_tiger', name: 'Tiger'},
    {key: 'animal_husky', name: 'Husky'},
    {key: 'animal_otherdog', name: 'Other dog'},
    {key: 'animal_otherfeline', name: 'Other feline'},
    {key: 'animal_otherfox', name: 'Other fox'},
    {key: 'animal_arcticfox', name: 'Arctic fox'},
    {key: 'animal_rabbit', name: 'Rabbit'},
    {key: 'animal_kitsune', name: 'Kitsune'},
    {key: 'animal_lion', name: 'Lion'},
    {key: 'animal_othercanine', name: 'Other canine'},
    {key: 'animal_raccoon', name: 'Raccoon'},
    {key: 'animal_leopard', name: 'Leopard'},
    {key: 'animal_greyfox', name: 'Grey fox'},
    {key: 'animal_coyote', name: 'Coyote'},
    {key: 'animal_horse', name: 'Horse'},
    {key: 'animal_riverotter', name: 'River otter'},
    {key: 'animal_panther', name: 'Panther'},
    {key: 'animal_cheetah', name: 'Cheetah'},
    {key: 'animal_hyaena', name: 'Hyaena'},
    {key: 'animal_bat', name: 'Bat'},
    {key: 'animal_skunk', name: 'Skunk'},
    {key: 'animal_raptor', name: 'Raptor'},
    {key: 'animal_germanshepherd', name: 'German shepherd'},
    {key: 'animal_griffin', name: 'Griffin'},
    {key: 'animal_lizard', name: 'Lizard'},
    {key: 'animal_otherbird', name: 'Other bird'},
    {key: 'animal_deer', name: 'Deer'},
    {key: 'animal_squirrel', name: 'Squirrel'},
    {key: 'animal_raven', name: 'Raven'},
    {key: 'animal_otherreptile', name: 'Other reptile'},
    {key: 'animal_cougar', name: 'Cougar'},
    {key: 'animal_otherungulate', name: 'Other ungulate'},
    {key: 'animal_kangaroo', name: 'Kangaroo'},
    {key: 'animal_dinosaur', name: 'Dinosaur'},
    {key: 'animal_weasel', name: 'Weasel'},
    {key: 'animal_rat', name: 'Rat'},
    {key: 'animal_mouse', name: 'Mouse'},
    {key: 'animal_collie', name: 'Collie'},
    {key: 'animal_redpanda', name: 'Red panda'},
    {key: 'animal_pandabear', name: 'Panda bear'},
    {key: 'animal_seaotter', name: 'Sea otter'},
    {key: 'animal_othermustelid', name: 'Other mustelid'},
    {key: 'animal_polarbear', name: 'Polar bear'},
    {key: 'animal_grizzlybear', name: 'Grizzly bear'},
    {key: 'animal_brownbear', name: 'Brown bear'},
    {key: 'animal_other', name: 'Other'},
    {key: 'animal_otherbear', name: 'Other bear'},
    {key: 'animal_lemur', name: 'Lemur'},
    {key: 'animal_othermarsupial', name: 'Other marsupial'},
    {key: 'animal_badger', name: 'Badger'},
    {key: 'animal_othermusteloid', name: 'Other musteloid'},
    {key: 'animal_monkey', name: 'Monkey'},
    {key: 'animal_otherprimate', name: 'Other primate'},
    {key: 'animal_koala', name: 'Koala'}
  ];


  // We combine some of the gender and orientations into similar groups, as defined below
  // This is achieved via the UI (see the <select> options in the html file)

  var sexList = [
    ['.','All'],
    ['a','Male'],
    ['b','Female'],
    ['c','Other']
  ];

  var genderList = [
    ['.','All'],
    ['a','Completely male'], // male
    ['b','Predominantly male'], // other
    ['c','Equal parts male and female'], // other
    ['d','Predominantly female'], // other
    ['e','Completely female'], // female
    ['f','Other'] // other
  ];
    
  var orientationList = [
    ['.','All'],
    ['0','Completely heterosexual'], // heterosexual
    ['1','Mostly heterosexual'], // heterosexual
    ['2','Bisexual leaning heterosexual'], // bisexual
    ['3','Bisexual'], // bisexual
    ['4','Bisexual leaning homosexual'], // bisexual
    ['5','Mostly homosexual'], // homosexual
    ['6','Completely homosexual'] // homosexual
  ];


  _.mixin({
    // Sums together the values of a specific key in an array of objects
    sum: function(arr, key, memo) {
      return _.reduce(arr, function(mem, val) {
        return mem + (val[key] || 0);
      }, memo || 0);
    }
  });


  // D3 graph setup stuff
  var margin = {top: 22, right: 0, bottom: 0, left: 100};
  var width = 850 - margin.left - margin.right;
  var height = 1600 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y0 = d3.scale.ordinal()
      .rangeRoundBands([0, height], .2);

  var y1 = d3.scale.ordinal();

  var color = d3.scale.ordinal()
      .range(['#9280a2', '#98abc5']);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('top')
      .tickFormat(d3.format('%'));

  var yAxis = d3.svg.axis()
      .scale(y0)
      .orient('left');

  var svg = d3.select('#graph').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var xAxisSVG = svg.append('g')
      .attr('class', 'x axis');

  var yAxisSVG = svg.append('g')
      .attr('class', 'y axis');

  // Provided by the d3-tip extension library
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var parentData = d3.select(this.parentNode).datum();
        var percent = Math.round(d.percent * 10000) / 100;
        return parentData.animalName + ': ' + percent + '%' +
               ' (' + d.value + ' of ' + d.totalCount + ' respondents)';
      });

  svg.call(tip);
  

  /*
   * Updates the graph based on the values provided by the dropdowns.
   * The speciesData argument is the original data loaded from the JSON file.
   */
  function update(speciesData) {
    var baselineSexFilter = d3.select('#baseline-sex-options').property('value');
    var baselineGenderFilter = d3.select('#baseline-gender-options').property('value');
    var baselineOrientationFilter = d3.select('#baseline-orientation-options').property('value');
    var querySexFilter = d3.select('#query-sex-options').property('value');
    var queryGenderFilter = d3.select('#query-gender-options').property('value');
    var queryOrientationFilter = d3.select('#query-orientation-options').property('value');

    // We use regex to filter the original data based on the chosen dropdown options.
    // For example if the filters are: Female sex, Male gender, Homosexual orientation
    // then the regex would be: ba[56]
    // This would match against the data groups 'ba5' and 'ba6'
    // Where 'All' is chosen we use . which includes all characters, eg: b.[56]
    var baselineFilter = baselineSexFilter + baselineGenderFilter + baselineOrientationFilter;
    var queryFilter = querySexFilter + queryGenderFilter + queryOrientationFilter;

    var baselineData = _.filter(speciesData, function(val, key) {
      return key.match(baselineFilter);
    });

    var queryData = _.filter(speciesData, function(val, key) {
      return key.match(queryFilter);
    });

    // Add up total number of members in the groups
    var baselineCount = _.sum(baselineData, 'count');
    var queryCount = _.sum(queryData, 'count');

    // Convert the data into a structure that matches how D3 likes to draw the graph
    var structuredData = _.map(animalList, function(animal) {
      var baselineTotal = _.sum(baselineData, animal.key);
      var queryTotal = _.sum(queryData, animal.key);
      var d = {
        animalName: animal.name,
        totals: [
          {
            name: 'baseline',
            percent: baselineTotal / baselineCount,
            value: baselineTotal,
            totalCount: baselineCount
          },
          {
            name: 'query',
            percent: queryTotal / queryCount,
            value: queryTotal,
            totalCount: queryCount
          }
        ]
      };
      return d;
    });


    // Update the text fields next to the dropdowns
    d3.select('.baseline-total-respondents').text(baselineCount);
    d3.select('.query-total-respondents').text(queryCount);

    // Update scales
    x.domain([0, d3.max(structuredData, function(d) {
      return d3.max(d.totals, function(d) { return d.percent; });
    })]);

    y0.domain(structuredData.map(function(d) { return d.animalName; }));

    y1.domain(['baseline', 'query']).rangeRoundBands([0, y0.rangeBand()]);

    xAxisSVG.transition().duration(750).call(xAxis);

    yAxisSVG.call(yAxis);


    // DATA JOIN FOR EACH ANIMAL
    var animals = svg.selectAll('.animal')
        .data(structuredData, function(d) { return d.animalName; });

    // UPDATE
    animals
        .attr('transform', function(d) { return 'translate(0,' + y0(d.animalName) + ')'; });

    // ENTER
    animals.enter().append('g')
        .attr('class', 'animal')
        .attr('transform', function(d) { return 'translate(0,' + y0(d.animalName) + ')'; });

    // EXIT
    animals.exit().remove();

    // DATA JOIN FOR THE TWO BARS UNDER EACH ANIMAL
    var bars = animals.selectAll('rect')
        .data(function(d) { return d.totals; }, function(d) { return d.name; });

    // UPDATE
    bars
        .transition()
        .duration(750)
          .attr('width', function(d) { return x(d.percent); });

    // ENTER
    bars.enter().append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', function(d) { return y1(d.name); })
        .attr('width', function(d) { return x(d.percent); })
        .attr('height', y1.rangeBand())
        .style('fill', function(d) { return color(d.name); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // EXIT
    bars.exit().remove();
  }


  /*
   * Load the species data from the JSON file. This is just a raw database dump.
   */
  d3.json('data/speciesdata.json', function(err, data) {
    // 000 contains the data for ALL categories, so it will unnecessarily double the totals
    delete data['000'];

    d3.select('#baseline-gender-options').on('change', function() { update(data); });
    d3.select('#baseline-sex-options').on('change', function() { update(data); });
    d3.select('#baseline-orientation-options').on('change', function() { update(data); });
    d3.select('#query-gender-options').on('change', function() { update(data); });
    d3.select('#query-sex-options').on('change', function() { update(data); });
    d3.select('#query-orientation-options').on('change', function() { update(data); });

    // Perform an initial update/draw of the graph
    update(data);
  });

})();
