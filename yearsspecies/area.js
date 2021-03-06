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

d3.csv("data.csv", function(rows) {

    var results = [], species = [], width = 800, height = 500, margin = 40,
    y = d3.scale.linear().domain([1, 0]).range([1, height - margin]),
    x = d3.scale.linear().domain([0, 10]).range([0, width]),
    years = ['<1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '>10']
    maxCount = -1,
    colors = d3.scale.category20();


    rows.forEach(function(o) {
        results.push({ key: o.Species, values: [] });
        species.push(o.Species);
        years.forEach(function(i) {
            var resp = parseFloat(o[i]);
            if (resp > maxCount) {
                maxCount = resp;
            }
            results[results.length - 1].values.push({ y: resp });
        });
    });

    var vis = d3.select('#fig')
        .append('svg:svg')
        .attr('width', width)
        .attr('height', height);

    // Build stacked area chart
    var stack = d3.layout.stack()
        .values(function(d) { return d.values; })
        .offset('expand');
    var area = d3.svg.area()
        .x(function(d, i) { 
            return x(i); 
        })
        .y0(function(d) { 
            return y(d.y0) - 0.5; 
        })
        .y1(function(d) { 
            return y(d.y + d.y0) + 0.5; 
        });

    vis.selectAll('.speciesArea')
        .data(stack(results))
        .enter()
        .append('g')
        .attr('class', 'speciesArea')
        .attr('data-species', function(d) { 
            return d.key; 
        })
        .on('mouseover', lineMouseOver)
        .on('mouseout', lineMouseOut)
        .append('path')
        .attr('d', function(d) { 
            return area(d.values); 
        })
        .attr('fill', function(d) {
            return colors(d.key);
        });

    d3.select('#speciesList')
        .selectAll('div')
        .data(species)
        .enter().append('div')
        .attr('class', 'speciesDiv')
        .attr('data-species', function(d) { return d; })
        .text(function(d) { return d.split('_')[1]; })
        .on('mouseover', divMouseOver)
        .on('mouseout', divMouseOut);

    vis.append('svg:line')
        .attr('x1', x(0))
        .attr('x2', x(10))
        .attr('y1', y(0))
        .attr('y2', y(0))
        .attr('class', 'axis');
    vis.selectAll('.xLabel')
        .data(years)
        .enter().append('svg:text')
        .attr('class', 'xLabel')
        .text(function(d) { return d === '>10' ? '10+' : d; })
        .attr('x', function(d, i) { return x(i * 0.97) + 10; })
        .attr('y', height - 25)
        .attr('text-anchor', 'middle');
    vis.append('svg:text')
        .attr('class', 'xAxisLabel')
        .text('Number of years in the fandom')
        .attr('x', 400)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle');
});

function lineMouseOver(d, i) {
    d3.select(this)
        .attr('class', 'highlightLine');
    var currSpecies = d3.select(this).attr('data-species');
    d3.select('.speciesDiv[data-species=' + currSpecies + ']')
        .attr('class', 'highlightDiv');
}
function lineMouseOut(d, i) {
    d3.select(this)
        .attr('class', 'speciesLine');
    var currSpecies = d3.select(this).attr('data-species');
    d3.select('.highlightDiv[data-species=' + currSpecies + ']')
        .attr('class', 'speciesDiv');
}

function divMouseOver(d, i) {
    var currSpecies = d3.select(this).attr('data-species');
    d3.select(this)
        .attr('class', 'highlightDiv');
    d3.select('g[data-species=' + currSpecies + '] path')
        .attr('class', 'highlightLine');
}
function divMouseOut(d, i) {
    var currSpecies = d3.select(this).attr('data-species');
    d3.select(this)
        .attr('class', 'speciesDiv');
    d3.select('g[data-species=' + currSpecies + '] path')
        .attr('class', 'speciesarea');
}

