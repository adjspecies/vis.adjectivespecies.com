var translatedAnswers = {
        '': '(no answer)',
        'complete_homo': 'Completely homosexual',
        'complete_hetero': 'Completely heterosexual',
        'mostly_homo': 'Mostly homosexual',
        'mostly_hetero': 'Mostly heterosexual',
        'bisexual': 'Bisexual',
        'bi_homo': 'Bisexual, leaning homosexual',
        'bi_hetero': 'Bisexual, leaning heterosexual',
        '_other_': 'Other',
        'mtf_trans': 'Trans - MtF',
        'ftm_trans': 'Trans - FtM'
    },
    synonyms = {
        'female': 'Female',
        'female ': 'Female',
        'male': 'Male',
        'Male)': 'Male',
        'Male ': 'Male',
        'Pansexual ': 'Pansexual',
        'Gay': 'complete_homo'
    },
    arc = d3.svg.arc()
        .innerRadius(125)
        .outerRadius(250),
    layout = d3.layout.pie()
        .value(function(d) { return d.value; }),
    colors = d3.scale.category20();

function buildChart(selector, key1, key2) {
    var n = d3.sum(d3.values(data[key1][key2])),
        vis = d3.select(selector)
            .append('svg')
            .attr('width', 500)
            .attr('height', 500)
            .append('g')
            .attr('transform', 'translate(250,250)');

    vis.selectAll('path')
        .data(layout(d3.entries(data[key1][key2])))
        .enter().append('path')
        .attr('d', arc)
        .attr('fill-rule', 'evenodd')
        .attr('style', function(d) {
            return 'fill:' + colors(d.data.key);
        })
        .append('title')
        .text(function(d) {
            return (translatedAnswers[d.data.key] ? translatedAnswers[d.data.key] : d.data.key) +
                ' (' + Math.round(d.data.value / n * 100) + '%)'; 
        });
    vis.append('text')
        .text('n = ' + d3.sum(d3.values(data[key1][key2])))
}

for (var k1 in data) {
    for (var k2 in data[k1]) {
        for (var k3 in data[k1][k2]) {
            if (synonyms[k3] && data[k1][k2][synonyms[k3]]) {
                data[k1][k2][synonyms[k3]] += data[k1][k2][k3];
                delete data[k1][k2][k3];
            }
            if (k3 == '') {
                delete data[k1][k2][k3];
            }
        }
    }
}

buildChart('#sexuality', 'Sexual Orientation', 'What is your overall sexual orientation?');
buildChart('#gender', 'Gender Identity', 'What is your gender identity?');
buildChart('#biosex', 'Gender Identity', 'What is your biological sex?');
