var x = d3.scale.linear().range([0, 750]).domain([1997, 2012]),
    y = d3.scale.linear().range([750, 0]).domain([0, d3.sum(rawData[rawData.length - 1].conventions.map(function(d) {return d.amount; } ))]),
    colors = d3.scale.category20();

var svg = d3.select('#vis')
    .append('svg')
    .attr('width', 900)
    .attr('height', 900);
svg.append('text')
    .attr('x', 450)
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .attr('class', 'title')
    .text('All Convention Charity Donations')
var vis = svg.append('g')
    .attr('class', 'vis')
    .attr('transform', 'translate(75, 25)')
    .attr('width', 750)
    .attr('height', 750);

var stack = d3.layout.stack()
    .values(function(d) { return d.value; })
    .x(function(d) { return d.year; })
    .y(function(d) { return d.amount; });
var area = d3.svg.area()
    .x(function(d) { 
        return x(d.year); })
    .y0(function(d) { 
            return y(d.y0); })
    .y1(function(d) { 
            return y(d.y + d.y0) + 1; });
vis.selectAll('.con')
    .data(stack(d3.entries(data)))
    .enter().append('path')
    .attr('class', 'con')
    .attr('d', function(d) { return area(d.value); })
    .attr('style', function(d) { return 'fill:' + colors(d.key); })
    .on('mouseover', function() {
        d3.select(this).attr('class', 'con hover');
    })
    .on('mouseout', function() {
        d3.select(this).attr('class', 'con');
    })
    .append('title')
    .text(function(d) {
        return d.key;
    });

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(16)
    .tickFormat(d3.format('d'))
    .orient('bottom');
var yAxis1 = d3.svg.axis()
    .scale(y)
    .tickFormat(function(d) {
        return '$' + d3.format(',.0f')(d);
    })
    .orient('left');
var yAxis2 = d3.svg.axis()
    .scale(y)
    .tickFormat(function(d) {
        return '$' + d3.format(',.0f')(d);
    })
    .orient('right');
vis.append('g')
    .attr('class', 'xAxis')
    .attr('transform', 'translate(0, 750)')
    .call(xAxis);
vis.append('g')
    .attr('class', 'yAxis')
    .call(yAxis1);
vis.append('g')
    .attr('class', 'yAxis')
    .attr('transform', 'translate(750, 0)')
    .call(yAxis2);

var years = vis.selectAll('.year')
    .data(rawData)
    .enter().append('g')
    .attr('class', 'year');
/*years.append('rect')
    .attr('x', function(d) { return x(d.year) - (750 / rawData.length / 2); })
    .attr('y', function(d) {
        return y(d3.sum(d.conventions.map(function(d) { return d.amount; })));
    })
    .attr('height', function(d) {
        var y = parseInt(d3.select(this).attr('y'))
        return 750 - y;
    })
    .attr('width', 750 / rawData.length);*/
years.append('rect')
    .attr('x', function(d) { return x(d.year) - 35; })
    .attr('y', function(d) {
        return y(d3.sum(d.conventions.map(function(d) { return d.amount; }))) - 12;
    })
    .attr('rx', 7)
    .attr('ry', 7)
    .attr('width', 70)
    .attr('height', 15);
years.append('text')
    .attr('x', function(d) { return x(d.year) - (750 / rawData.length / 2); })
    .attr('y', function(d) {
        return y(d3.sum(d.conventions.map(function(d) { return d.amount; })));
    })
    .text(function(d) {
        return '$' + d3.format(',.0f')
            (d3.sum(d.conventions.map(function(d) { return d.amount; })));
    })

