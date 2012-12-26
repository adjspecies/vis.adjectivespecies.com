var vis = d3.select('#fig')
    .append('svg')
    .attr('width', 1600)
    .attr('height', 1100)
    .append('g')
    .attr('transform', 'translate(96,20)');

var offsets = [],
    scaleOffsets = [],
    filter = [], filteredCount = 0;
for (var i = 0; i < 32; i++) {
    offsets.push([0, 0, 0, 0, 0, 0]);
    scaleOffsets.push([0, 0, 0, 0, 0, 0]);
}
var data = responses.filter(function(d) {
    return !isNaN(parseInt(d[3]));
});
data.forEach(function(response) {
    response.slice(3).forEach(function(answer, i) {
        offsets[i][answer - 1]++;
    });
});

var x = d3.scale.linear().range([0, 1500]).domain([0, 31]),
    y = d3.scale.linear().range([0, 900]).domain([0, data.length - 1]);

var line = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) {
        scaleOffsets[i][d - 1]++;
        var toReturn = scaleOffsets[i][d -1]
        for (var j = 0; j < d - 1; j++) {
            toReturn += offsets[i][j];
        }
        return y(toReturn);
    });

var paths = vis.append('g');

var path = paths.selectAll('.response')
    .data(data)
    .enter().append('path')
    .attr('class', function(d) {
        return 'response ' + d[2];
    })
    .attr('d', function(d) {
        return line(d.slice(3));
    });

var invertedOffsets = [];
for (var i = 0; i < 6; i++) {
    var newArray = offsets.map(function(d) { 
        return d[i]; 
    }).map(function(d, j) {
        return { x: j, y: d, value: i + 1 }
    });
    invertedOffsets.push(newArray);
}

var barsStack = d3.layout.stack();

var bars = vis.selectAll('.question')
    .data(barsStack(invertedOffsets))
    .enter().append('g')
    .attr('class', 'question');

bars.selectAll('.answer')
    .data(function(d) { return d; })
    .enter().append('rect')
    .attr('class', function(d) {
        return 'answer value' + d.value;
    })
    .attr('x', function(d) {
        return x(d.x) - 4;
    })
    .attr('y', function(d) {
        return y(d.y0 + 0.25);
    })
    .attr('height', function(d) {
        return y(d.y + 0.25);
    })
    .attr('width', 8)
    .on('click', function(d) {
        var bar = d3.select(this);
        if (bar.classed('filtered')) {
            bar.classed('filtered', false);
            filter = filter.filter(function(i) {
                return !(i[0] === d.x && i[1] === d.value);
            });
        } else {
            bar.classed('filtered', true);
            filter.push([d.x, d.value]);
        }
        updateFilteredPaths();
    })
    .append('title')
    .text(function(d) { return schema[d.x]; });

var labels = vis.append('g');
labels.selectAll('.qlabel')
    .data(shortnames)
    .enter().append('g')
    .classed('qlabel', true)
    .attr('transform', function(d, i) {
        return 'translate(' + x(i) + ',910)rotate(305)';
    })
    .append('text')
    .attr('text-anchor', 'end')
    .text(function(d, i) {
        return shortnames[i];
    });

labels.append('text')
    .attr('x', -8)
    .attr('y', 10)
    .attr('text-anchor', 'end')
    .text('Strongly');
labels.append('text')
    .attr('x', -8)
    .attr('y', 21)
    .attr('text-anchor', 'end')
    .text('Disagree');
labels.append('text')
    .attr('x', -8)
    .attr('y', 900)
    .attr('text-anchor', 'end')
    .text('Strongly Agree');

var corr = labels.append('text')
    .attr('x', 1500)
    .attr('y', -10)
    .attr('text-anchor', 'end')
    .text('Distance from avg.: ')
    .append('tspan');

function updateFilteredPaths() {
    filteredCount = 0;
    path.classed('filtered', false);

    path.filter(filterResponse)
        .classed('filtered', true);

    if (filteredCount > 0) {
        var avg = responses.length / 6;
        corr.text(d3.format('+.4g')((filteredCount - avg) / avg))
    } else {
        corr.text('');
    }
}

function filterResponse(d) {
    var passes = filter.length > 0,
        testVal = d.slice(3);
    for (var i = 0; i < filter.length; i++ ) {
        if (testVal[filter[i][0]] !== filter[i][1]) {
            passes = false;
            break;
        }
    }
    if (passes) {
        filteredCount++;
    }
    return passes;
}
