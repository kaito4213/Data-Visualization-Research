import matplotlib.pyplot as plt
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
area = [3.14*(e*0.001)**2 for e in Weight]
color = getColor(cars,2)

plt.scatter(Weight, MPG, s=area, c=color, alpha = 0.5)
plt.axis([1300, 5000, 4, 50])
plt.xlabel('Weight')
plt.ylabel('MPG')
plt.show()