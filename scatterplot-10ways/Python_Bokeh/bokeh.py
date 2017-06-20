from bokeh.plotting import figure
from bokeh.plotting import show
from bokeh.plotting import output_file
import csv

f = open('../cars-sample.csv')
cars = list(csv.reader(f))
cars = cars[1:]

def getColumn(data,column):
    Attribution = []
    for row in data:
        if row[column] == 'NA':
            row[column] = 0
        Attribution.append(float(row[column]))
    return Attribution

def getColor(data,column):
    Attribution = []
    Mapping = {'bmw': 'red','toyota': 'blue','honda': 'yellow','mercedes' : 'purple','ford': 'cyan'}
    for row in data:
        if row[column] == 'NA':
            row[column] = 0
        Attribution.append(Mapping.get(row[column])) 
    return Attribution

Weight = getColumn(cars,7)
MPG = getColumn(cars,3)
area = [e/200 for e in Weight]
colorMap = getColor(cars,2)
print(colorMap)
fig = figure(title = "bokeh")
fig.circle(Weight, MPG, size = area , color = colorMap, fill_alpha = 0.5)
fig.xaxis.axis_label = 'Weight'
fig.yaxis.axis_label = 'MPG'
show(fig)
