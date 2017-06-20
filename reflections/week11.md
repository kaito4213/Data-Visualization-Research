## Perception-Based Evaluation of Projection Methods for Multidimensional Data Visualization
[paper](https://link.springer.com/article/10.1007/s12650-014-0230-5)

### OVERVIEW
This paper presents a technique to display meaningful sets of scatterplots generated from high-dimensional datasets. It first evaluates
all possible scatterplots generated from high-dimensional datasets, and selects meaningful sets. It then calculates the similarity
between arbitrary pairs of the selected scatterplots, and places relevant scatterplots closer together in the display space while they
never overlap each other. It also presented examples of applying our proposed technique to visualize image segmentation and vehicle specification datasets.

### Three Things I liked about this paper:
* It carefully explained the data stucture of high-dimension input and the processing flow, along with the selection of scatterpoints. So reader can better understand what data was shown in the scatter plots.
* It gave two detailed examples to show how to use a rectangle packing algorithm to visualize hierarchical data. The algorithm is boring but the figure is not.
* The idea of dimension reduction based on the similarity distances between scatterplots is perfect. It reduce the complexicity of the final result.


### Three Things need to be changed:
* In Dimension reduction for computing ideal positions section, there is better to have several figures to show how the dimension reduction approach works in a visible example.
* Two eaxmples shown how to use a rectangle packing algorithm is some kind of confusion, is there any similarity or difference between these two? Why the author choose thses two dataset not any others?
* The algorithm needs to applied on larger datasets containing hundreds of dimensions and tens of thousands of vectors to demonstrate its scalability. 