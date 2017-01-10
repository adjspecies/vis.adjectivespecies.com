// Grab the file containing all of the responses to the survey
d3.csv('furry-philosophy-edited.csv', function(data) {
  var aggregate = {};

  // Loop through every response to the survey, getting the index
  for (var index in data) {
    if (index === 'columns') {
      continue;
    }
    // Get the response from the data for the given index
    var response = data[index];
    // Loop through every question in the response
    for (var question in response) {
      // Get the answer for the question we're on
      var answer = response[question];
      // Make sure that the aggregate already has an entry for the question we
      // are looking at
      if (!aggregate[question]) {
        aggregate[question] = {};
      }
      // Try to increment the count for each answer in the aggregate
      if (aggregate[question][answer]) {
        aggregate[question][answer]++;
      } else {
        aggregate[question][answer] = 1;
      }
    }
  }
  d3.select('.n')
    .text('n = ' + (data.length - 1));
  graph(prepData(aggregate));
});

var philosophyQuestions = [
  'If we cannot observe something, it may as well not exist.',
  'There is/are no God, gods, or deities.',
  'There is no such thing as truth, only opinions.',
  'Morality is a social construct.',
  'Sometimes, it is better for individuals to have rights taken away, in order to protect others within a society.',
  'When in Rome, do as the Romans do.',
  'People require a national identity to understand themselves.',
  'The only things we can be said to know are things we have experienced.',
  'Science is the surest path to knowledge.',
  'Some races require different treatment than others.',
  'It is impossible for us to know if other beings are self-aware.',
  'Without a belief in God, any action becomes permissible.',
  'It is better to hold false but comforting beliefs, than to know something disturbing.',
  'The ends can justify the means.',
  'Everything has a scientific, naturalistic explanation.',
  'There is an objective reality, which exists independently from us.',
  'The most important goal of life is to become happy.',
  'People posses free will, and are able to make choices as individual agents.',
  'Certain things, such as racism, sexism, and homophobia, are always wrong, regardless of context.',
  'The media positively contributes to liberal democracy.',
  'We posses no knowledge at birth.',
  'Our perceptions accurately represent reality.',
  'Free market economics is the best way to distribute wealth.',
  'Different societies ought to keep to themselves.'
];
var values = [
  'strongly agree',
  'agree',
  'slightly agree',
  'neutral',
  'slightly disagree',
  'disagree',
  'strongly disagree',
  'don\'t know'
]

function graph(data) {
  data.forEach(function (question) {
    nv.addGraph(function() {
      var chart = nv.models.discreteBarChart()
          .x(function(d) { return d.label })    //Specify the data accessors.
          .y(function(d) { return d.value })
          .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
          .showValues(true)
          .duration(350);

      var div = d3.select('.phil:nth-of-type(' + question.index + ')');
      div.select('svg')
          .datum([question])
          .call(chart);
      div.select('h2')
          .text(question.key);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  });
}

function prepData(data) {
  var prepped = [];
  var i = 1;
  philosophyQuestions.forEach(function(question) {
    prepped.push({
      key: question,
      index: i++,
      values: prepQuestion(data[question])
    });
  });
  return prepped;
}

function prepQuestion(question) {
  var prepped = [];
  for (var response in question) {
    prepped.push({
      'label': response.replace('_', ' ').replace('dont', 'don\'t'),
      'value': question[response],
    });
  }
  prepped.sort(function(a, b) {
    return values.indexOf(a.label) - values.indexOf(b.label);
  });
  return prepped;
}
