import plotly.plotly as py
import csv

py.sign_in('jiaoyan', 'bRtz75a3bfojstG4XNSe')
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
            row[column] = 5
        Attribution.append(Mapping.get(row[column])) 
    return Attribution

Weight = getColumn(cars,7)
MPG = getColumn(cars,3)
area = [e*0.005 for e in Weight]
color = getColor(cars,2)

trace = {
    'x' : Weight,
    'y' : MPG,
    'mode' : 'markers',
    'marker' : {
        'color' : color,
        'size': area
    }   
}

data = [trace]

layout = dict(title = 'Plotly Scatter',
              xaxis = dict(title = 'Weight'),
              yaxis = dict(title = 'MPG')
             )
fig = dict(data = data, layout = layout)
py.iplot(fig, filename = 'Scatter')

