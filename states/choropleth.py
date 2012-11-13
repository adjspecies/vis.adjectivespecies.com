import csv
import json
import math
from BeautifulSoup import BeautifulSoup

data = csv.reader(open('furrypoll2011_location.csv', 'rb'), delimiter = ';', quotechar = '"')
data.next() # headers

# a dict to hold our data
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

# a dict to hold our maximums
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

# factors for each population level
population_factors = {
        'z': 0,
        'a': 1,
        'b': 2,
        'c': 10,
        'd': 20,
        'e': 50,
        'f': 100,
        'g': 200,
        'h': 300,
        'i': 500
        }

# the colors to use
color_data = [
        '#CDC',
        '#BCB',
        '#ABA',
        '#9A9',
        '#898',
        '#787',
        '#676',
        '#565',
        '#454',
        '#343',
        '#232'
        ]

# first, parse the raw data
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

# Grap the maximums
max_values['us']['population_corrected'] = max(parsed_data['us']['population_corrected'].values())
max_values['world']['population_corrected'] = max(parsed_data['world']['population_corrected'].values())
max_values['us']['raw'] = max(parsed_data['us']['raw'].values())
max_values['world']['raw'] = max(parsed_data['world']['raw'].values())


# open our SVG and get all the state paths
svg = open('Blank_US_Map.svg', 'r').read()
soup = BeautifulSoup(svg, selfClosingTags = ['defs', 'sodipodi:namedview'])
paths = soup.findAll('path')

# this is the default style for a state, minus the value for the fill, which we'll set in the loop
style = "stroke:#ffffff;stroke-opacity:1;stroke-width:0.75;stroke-miterlimit:4;stroke-dasharray:none;fill:"

# for each state, set the color based on the decile into which it's population falls
for p in paths:
    if p['id'] not in ['State_Lines', 'separator']:
        try:
            rate = parsed_data['us']['raw'][p['id']]
        except:
            continue

        color_index = math.floor(float(rate) / float(max_values['us']['raw']) * 10)
        color_class = color_data[int(color_index)]
        p['style'] = style + color_class
        p['title'] = parsed_data['us']['raw'][p['id']]

print soup.prettify()
