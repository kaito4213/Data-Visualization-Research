library(ggvis)
cars = read.csv("..\cars-sample.csv")
p = ggvis(cars, x = ~Weight, y = ~MPG, fill=~Manufacturer, size=~Weight, opacity := 0.5)
layer_points(p)