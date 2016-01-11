/*
    http://vis.adjectivespecies.com - visualizations of the furry fandom.
    Copyright (C) 2012  Madison Scott-Clary

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Initialize variables.
var offsets = [], scaleOffsets = [],
    filter = [], agg = [], filteredCount = 0;
for (var i = 0; i < schema.length - 1; i++) {
    offsets.push([0, 0, 0, 0, 0, 0]);
    scaleOffsets.push([0, 0, 0, 0, 0, 0]);
}

// Filter out empty responses.
var data = responses.filter(function(d) {
    var valid = true;
    for (var i = 3; i < d.length; i++) {
        if (!d[i]) {
            valid = false;
            break;
        }
    }
    return valid;
});

// Build a list of offsets - each answer's offset is the sum of the answers
// above it.
data.forEach(function(response) {
    response.slice(3).forEach(function(answer, i) {
        offsets[i][answer - 1]++;
    });
});

// Build the SVG.
var vis = d3.select('#fig')
    .append('svg')
    .attr('width', 1600)
    .attr('height', 1100)
    .append('g')
    .attr('transform', 'translate(96,25)');

// Scales for placing data proportionally across the SVG.
var x = d3.scale.linear().range([0, 1500]).domain([0, schema.length - 2]),
    y = d3.scale.linear().range([0, 900]).domain([0, data.length - 1]);

// Build the response lines.
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

// Stack layouts use a data format inverted from what we have (arrays of 
// answers rather than arrays of questions).
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

// Add the question groups.
var bars = vis.selectAll('.question')
    .data(barsStack(invertedOffsets))
    .enter().append('g')
    .attr('class', 'question');

// Add the answer bars.
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
        aggregateFilter();
        updateFilteredPaths();
    })
    .append('title')
    .text(function(d) { 
        return schema[d.x + 1]; 
    });

// Add X-axis labels.
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

// Add Y-axis labels.
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

// Add a correlation label
var corr = labels.append('text')
    .attr('x', 1500)
    .attr('y', -10)
    .attr('text-anchor', 'end')
    .text('Percentage of respondents (as compared to average): ')
    .append('tspan');

labels.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .text('n = ' + data.length);
/*
 * Update the opacity of the response lines according to the current filter.
 * Additionally, update the percentage of respondents text at the top.
 */
function updateFilteredPaths() {
    filteredCount = 0;
    path.classed('filtered', false);

    path.filter(filterResponse)
        .classed('filtered', true);

    if (filteredCount > 0) {
        var avg = responses.length / 6 * d3.max(agg.map(function(d) { return d ? d.length : 0; }));
        corr.text(
            d3.format('.4%')(filteredCount / responses.length) + ' (' +
            d3.format('+.4%')((filteredCount - avg) / responses.length)  + ')'
        );
    } else {
        corr.text('');
    }
}

/* 
 * Test to see if a response fits within the filter by making sure it matches
 * the answer or answers selected for each question filtered.
 */
function filterResponse(d) {
    var passes = filter.length > 0,
        testVal = d.slice(3);

    for (var i = 0; i < agg.length; i++ ) {
        if (agg[i]) {
            var innerPasses = false;
            for (var j = 0; j < agg[i].length; j++) {
                if (testVal[i] === agg[i][j]) {
                    innerPasses = true;
                    break;
                }
            }
            passes = passes && innerPasses;
        }
    }

    if (passes) {
        filteredCount++;
    }

    return passes;
}

/*
 * Aggregate the filter array into an array of arrays, where the index is the
 * question, and the value is an array of answers.
 */
function aggregateFilter() {
    agg = [];
    for (var i = 0; i < filter.length; i++) {
        if (!agg[filter[i][0]]) {
            agg[filter[i][0]] = [];
        }
        agg[filter[i][0]].push(filter[i][1]);
    }
}
