library(ggplot2)
data = read.csv(file = "C:\\Users\\jchen11\\Desktop\\projects\\cs582\\02-DataVis-10ways\\cars-sample.csv", header = TRUE, sep = ",")
fig = ggplot(data, aes(x = Weight, y = MPG, size = Weight, color = Manufacturer))+geom_point(alpha = 0.5)
fig
