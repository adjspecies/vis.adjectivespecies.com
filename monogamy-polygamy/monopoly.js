/*
    http://vis.adjectivespecies.com - visualizations of the furry fandom.
    Copyright (C) 2012  Matthew Scott

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

var translatedAnswers = {
        '': '(no answer)',
        'single': 'Single',
        'monogamous': 'Monogamous',
        'polygamous': 'Polygamous',
        'monamorous': 'Monamorous (mono-romantic)',
        'polyamorous_active': 'Polyamorous (poly-romantic) - Active',
        'polyamorous_inactive': 'Polyamorous (poly-romantic) - Inactive',
        'monosexual': 'Monosexual',
        'polysexual_active': 'Polysexual - Active',
        'polysexual_inactive': 'Polysexual - Inactive',
    },
    arc = d3.svg.arc()
        .innerRadius(75)
        .outerRadius(150),
    layout = d3.layout.pie()
        .value(function(d) { return d.value; }),
    colors = d3.scale.category20();

function buildChart(selector, key1, key2) {
    var n = d3.sum(d3.values(data[key1][key2])),
        vis = d3.select(selector)
            .append('svg')
            .attr('width', 300)
            .attr('height', 300)
            .append('g')
            .attr('transform', 'translate(150,150)'),
        path = vis.selectAll('g.path')
            .data(layout(d3.entries(data[key1][key2])))
            .enter().append('g')
            .attr('class', 'path');

    path.append('path')
        .attr('d', arc)
        .attr('fill-rule', 'evenodd')
        .attr('style', function(d) {
            return 'fill:' + colors(d.data.key);
        });

    path.append('text')
        .attr('class', 'arc-label')
        .attr('transform', function(d) { 
            var angle = (d.startAngle + d.endAngle) / 2;
            angle = angle > Math.PI ? 
                angle * 180 / Math.PI + 90 :
                angle * 180 / Math.PI - 90;
            return 'translate(' + arc.centroid(d) + ') rotate(' + angle + ')'; 
        })
        .text(function(d) { return d.data.key.replace('_', ' ').replace(/(sexual|amorous|gamous)/, ''); });

    path.append('title')
        .text(function(d) {
            return (translatedAnswers[d.data.key] ? translatedAnswers[d.data.key] : d.data.key) +
                ' (' + Math.round(d.data.value / n * 100) + '%)'; 
        });
    vis.append('text')
        .text('n = ' + d3.sum(d3.values(data[key1][key2])))
}

for (var k1 in data) {
    for (var k2 in data[k1]) {
        if (k2 == '') {
            delete data[k1][k2];
            continue;
        }
        for (var k3 in data[k1][k2]) {
            if (k3 == '') {
                delete data[k1][k2][k3];
            }
        }
    }
}

data['Kinsey Data'] = {
    'Q. 1a. Would you say you have ever been in a polyamorous relationship?': {
        Yes: 852,
        No: 119
    }
};

buildChart('#relationship', 'About You', 'Relationship Status');
buildChart('#romantic', 'About You', 'Romantic Status');
buildChart('#sexual', 'About You', 'Sexual Status');
/*d3.select('#ki')
    .append('p')
    .append('strong')
    .text('Q. 1a. Would you say you have ever been in a polyamorous relationship?');
buildChart('#ki', 'Kinsey Data', 
        'Q. 1a. Would you say you have ever been in a polyamorous relationship?');*/

var addlComments = d3.select('#addlComments')
    .append('ul');
addlComments.selectAll('li')
    .data(d3.keys(data['Additional Comments']))
    .enter().append('li')
    .text(String);
