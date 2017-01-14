console.log('Loading gender identities');
d3.csv('gid2016.csv', function(gid) {
  console.log('Loading gender expressions');
  d3.csv('gex2016.csv', function(gex) {
    console.log('Loading gender in furry');
    d3.csv('gif2016.csv', function(gif) {
      main(gid, gex, gif);
    });
  });
});

function main(gid, gex, gif) {
  console.log('Data loaded');
  unquantized(gid, '.gid .unquantized');
  unquantized(gex, '.gex .unquantized');
  unquantized(gif, '.gif .unquantized');

  quantized(gid, '.gid .quantized');
  quantized(gex, '.gex .quantized');
  quantized(gif, '.gif .quantized');
}

function unquantized(data, selector) {
  console.log('Rendering', selector);
  var vis = d3.select(selector).append('svg')
    .attr({
      width: 600,
      height: 400
    });
  vis.append('image')
    .attr({
      'xlink:href': 'gendermap.png',
      x: 0,
      y: 0,
      width: 600,
      height: 400
    });
  var diamond = vis.append('g')
    .attr('transform', 'translate(291, 44.5) rotate(45)');
  diamond.selectAll('.point').data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return d.female * 226;
    })
    .attr('cy', function(d) {
      return d.male * 226;
    })
    .attr('r', '2.5')
    .style({
      fill: 'rgba(0, 0, 0, 0.2)'
    });
}

function quantized(data, selector) {
  console.log('Rendering', selector);
  var matrix = [[0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0]];
  data.forEach(function(d) {
    matrix[d.male_quantized - 1][d.female_quantized - 1]++;
  });

  var max = -data.length,
    min = data.length;
  matrix.forEach(function(row) {
    row.forEach(function(cell) {
      cell = cell - (data.length / 25);
      if (cell < min) {
        min = cell;
      }
      if (cell > max) {
        max = cell;
      }
    });
  });
  var scale = d3.scale.linear()
    .domain([min, max])
    .range(['#ffeda0', '#f03b20']);

  vis = d3.select(selector).append('svg')
  .attr({
    width: 400,
    height: 400
  });
  var diamond = vis.append('g')
    .attr('transform', 'rotate(45) translate(175,-125)');
  diamond.selectAll('.row').data(matrix)
    .enter()
    .append('g')
    .classed('row', true)
    .attr('transform', function(d, i) {
      return 'translate(' + [0, i * 50] + ')'
    })
    .selectAll('.cell').data(function(d) { return d; })
    .enter()
    .append('rect')
    .classed('cell', true)
    .attr({
      width: 50,
      height: 50
    })
    .attr('x', function(d, i) {
      return i * 50;
    })
    .attr('y', 0)
    .attr('fill', function(d) {
      return scale(d);
    });
}
