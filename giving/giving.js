var w = 500,
    h = 300,
    x = d3.scale.linear().domain([1999, 2012]).range([0, 400]),
    y = d3.scale.linear().range([h, 0]);

var attendance = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.attendance) / 2; });
var donations = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.charityAmount) / 2; });
var avgDonationPerAttendee = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y((d.charityAmount / d.attendance) * 0.8); });

var vis = d3.select('#vis')
    .selectAll('div.fig')
    .data(data)
    .enter().append('div')
    .attr('class', 'fig')
    .append('svg')
    .attr('width', 900)
    .attr('height', h + 10)

vis.append('text')
    .attr('x', 450)
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .attr('style', 'font-weight: bold; font-size: 15pt;')
    .text(function(d) { return d.name; });

gAttendance = vis.append('g')
    .attr('class', 'attendance')
    .attr('transform', 'translate(450, 20)');
gAttendance.append('line')
    .attr('x1', 0)
    .attr('y1', 10)
    .attr('x2', 20)
    .attr('y2', 10);
gAttendance.append('text')
    .attr('x', 25)
    .attr('y', 10)
    .text('Attendance');
gAttendance.append('path')
    .attr('d', function(d) {
        y.domain([0, d3.max(d.years, function(i) { return i.attendance; })]);
        return attendance(d.years);
    });
gAttendance.selectAll('circle')
    .data(function(d) { 
        y.domain([0, d3.max(d.years, function(i) { return i.attendance; })]);
        return d.years.map(function(i) {
            return {x: x(i.year), y: y(i.attendance) / 2, amount: i.attendance};
        }); 
    })
    .enter().append('circle')
    .attr('cx', function (d) {
        return d.x;
    })
    .attr('cy', function(d) {
        return d.y;
    })
    .attr('r', 3)
    .append('title')
    .text(function(d) { return d.amount + ' attendees'; });

gDonations = vis.append('g')
    .attr('class', 'donations')
    .attr('transform', 'translate(450,170)');
gDonations.append('line')
    .attr('x1', 0)
    .attr('y1', 10)
    .attr('x2', 20)
    .attr('y2', 10)
gDonations.append('text')
    .attr('x', 25)
    .attr('y', 10)
    .text('Donations');
gDonations.append('path')
    .attr('d', function(d) {
        y.domain([0, d3.max(d.years, function(i) { return i.charityAmount; })]);
        return donations(d.years);
    });
gDonations.selectAll('circle')
    .data(function(d) { 
        y.domain([0, d3.max(d.years, function(i) { return i.charityAmount; })]);
        return d.years.map(function(i) {
            return {x: x(i.year), y: y(i.charityAmount) / 2, amount: i.charityAmount};
        }); 
    })
    .enter().append('circle')
    .attr('cx', function (d) {
        return d.x;
    })
    .attr('cy', function(d) {
        return d.y;
    })
    .attr('r', 3)
    .append('title')
    .text(function(d) { return '$' + d.amount.toFixed(2); });

gAvg = vis.append('g')
    .attr('class', 'avgDonationPerAttendee')
    .attr('transform', 'translate(10,20)');
gAvg.append('line')
    .attr('x1', 0)
    .attr('y1', 10)
    .attr('x2', 20)
    .attr('y2', 10);
gAvg.append('text')
    .attr('x', 25)
    .attr('y', 10)
    .text('Average donation per attendee');
gAvg.append('text')
    .attr('x', 200)
    .attr('y', 260)
    .attr('text-anchor', 'middle')
    .text('Time');
gAvg.append('text')
    .attr('x', 0)
    .attr('y', 260)
    .attr('text-anchor', 'start')
    .text('1999');
gAvg.append('text')
    .attr('x', 400)
    .attr('y', 260)
    .attr('text-anchor', 'end')
    .text('2012');
gAvg.append('line')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 10)
    .attr('y2', 250)
    .attr('class', 'axisLine');
gAvg.append('line')
    .attr('x1', 0)
    .attr('x2', 400)
    .attr('y1', 250)
    .attr('y2', 250)
    .attr('class', 'axisLine');

gAvg.append('path')
    .attr('d', function(d) {
        y.domain([0, d3.max(d.years, function(i) { return i.charityAmount / i.attendance; })]);
        return avgDonationPerAttendee(d.years);
    });
gAvg.selectAll('circle')
    .data(function(d) { 
        y.domain([0, d3.max(d.years, function(i) { return i.charityAmount / i.attendance; })]);
        return d.years.map(function(i) {
            return {
                x: x(i.year), 
                y: y((i.charityAmount / i.attendance) * 0.8),
                amount: i.charityAmount / i.attendance
            };
        }); 
    })
    .enter().append('circle')
    .attr('cx', function (d) {
        return d.x;
    })
    .attr('cy', function(d) {
        return d.y;
    })
    .attr('r', 3)
    .append('title')
    .text(function(d) { return '$' + d.amount.toFixed(2) + ' per attendee'; });
