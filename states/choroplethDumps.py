import csv
import json
from BeautifulSoup import BeautifulSoup

data = csv.reader(open('furrypoll2011_location.csv', 'rb'), delimiter = ';', quotechar = '"')
data.next() # headers

parsed_data = {
        "us": {
            'population_corrected': {},
            'raw': {}
            },
        "world": {
            'population_corrected': {},
            'raw': {}
            }
        }
max_values = {
        "us": {
            'population_corrected': 0,
            'raw': 0
            },
        "world": {
            'population_corrected': 0,
            'raw': 0
            }
        }

population_factors = {
        'z': 0,
        'a': 5000,
        'b': 1000,
        'c': 200,
        'd': 100,
        'e': 50,
        'f': 20,
        'g': 10,
        'h': 2,
        'i': 1
        }

color_data = [
        '#004529',
        '#006837',
        '#238443',
        '#41AB5D',
        '#78C679',
        '#ADDD8E',
        '#D9F0A3',
        '#F7FCB9',
        '#FFFFE5'
        ]


for row in data:
    if len(row[2]) == 0:
        continue
    if row[0] == "us":
        if row[1] not in parsed_data['us']['raw']:
            parsed_data['us']['population_corrected'][row[1]] = 0
            parsed_data['us']['raw'][row[1]] = 0
        parsed_data['us']['population_corrected'][row[1]] += population_factors[row[2]]
        parsed_data['us']['raw'][row[1]] += 1
    else:
        if row[0] not in parsed_data['world']['raw']:
            parsed_data['world']['population_corrected'][row[0]] = 0
            parsed_data['world']['raw'][row[0]] = 0
        parsed_data['world']['population_corrected'][row[0]] += population_factors[row[2]]
        parsed_data['world']['raw'][row[0]] += 1

max_values['us']['population_corrected'] = max(parsed_data['us']['population_corrected'].values())
max_values['world']['population_corrected'] = max(parsed_data['world']['population_corrected'].values())
max_values['us']['raw'] = max(parsed_data['us']['raw'].values())
max_values['world']['raw'] = max(parsed_data['world']['raw'].values())

print json.dumps(parsed_data)
print json.dumps(max_values)

#svg = open('Blank_US_Map.svg', 'r').read()

#soup = BeautifulSoup(svg, selfClosingTags = ['defs', 'sodipodi:namedview'])
