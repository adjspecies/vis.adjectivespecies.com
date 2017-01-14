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
  for (var question in aggregate) {
    var v = ['strongly_agree', 'agree', 'slightly_agree', 'neutral', 'slightly_disagree', 'disagree', 'strongly_disagree'];
    var r = 0;
    for (var i = 0; i < v.length; i++) {
      r += aggregate[question][v[i]] * (i + 1);
    }
    aggregate[question]['mean'] = r / data.length;
  }
  window.AGGREGATE = aggregate;
  d3.select('.n')
    .text('n = ' + (data.length - 1));
  graph(prepData(aggregate));
});

var demographicQuestions = {
  'How old are you?': 'age',
  'What gender do you identify as?': 'gender_identity',
  'Does your gender identity align with your sex assigned at birth?': 'gender_alignment',
  'What species is your primary character?': 'species',
  'Where in the world are you located?': 'location',
  'What religion do you identify with?': 'religion',
}
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
];
var demographicStart = 0;

function graph(data) {
  window.PHIL_DATA = data;
  data.forEach(function (question) {
    nv.addGraph(function() {
      var chart = nv.models.discreteBarChart()
          .x(function(d) { return d.label })    //Specify the data accessors.
          .y(function(d) { return d.value })
          .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
          .showValues(true)
          .duration(350);

      var div = d3.select('.phil:nth-of-type(' + question.index + ')');
      var mean = question.values.shift();
      div.select('svg')
          .datum([question])
          .call(chart);
      div.select('h2')
          .text(question.key);

      nv.utils.windowResize(chart.update);

      div.select('.mean').html("<strong>Average: " + values[Math.round(mean.value) - 1] + "</strong>");

      if (philosophyQuestions.indexOf(question.key) > -1) {
        d3.select('.means tbody').html(
          d3.select('.means tbody').html() +
          '<tr><td>' + question.key + '</td><td>' +
          values[Math.round(mean.value) - 1] + '</td></tr>');
      }

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
  demographicStart = i - 1;
  for (var question in demographicQuestions) {
    prepped.push({
      key: demographicQuestions[question],
      index: i++,
      values: prepQuestion(data[question])
    });
  }
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

// correlations
// * Morality is a social construct vs certain things such as racism etc
// * We possess no knowledge at birth vs The only things we can be said to know are things we have experienced
// * The only things we can be said to know are things we have experienced vs It is better to hold false but comforting beliefs, than to know something disturbing
// * It is better to hold false but comforting beliefs, than to know something disturbing vs The most important goal of life is to become happy
// * Our perceptions accurately represent reality vs The only things we can be said to know are things we have experienced
