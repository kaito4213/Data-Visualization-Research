## Information Retrieval Perspective to Nonlinear Dimensionality Reduction for Data Visualization
[Read this paper](http://www.jmlr.org/papers/volume11/venna10a/venna10a.pdf)

### OVERVIEW
This paper defines a specific visualization task, which is projecting a highdimensional data set onto a two-dimensional plane for visualizing similarity relationships. The author introduces a new method NeRV (neighbor retrieval visualizer) which produces an optimal visualization by minimizing the cost of missing similar points vs. retrieving dissimilar points. NeRV can be extended to supervised and unsupervised visualization, and that both the unsupervised and supervised methods empirically outperform their alternatives. 

### Three Things I liked about this paper:
* Use NeRV seperately for Supervised Visualization and unsupervised Visualization to evaluate the performance in differente situation.
* Compare NeRV with previous method to show it minizes the cost of missing similar points and retrieving dissimilar points.
* Good explanation of methodology for both Supervised and unsupervised Experiments using NeRV.

### Three Things need to be changed:
* For unsupervised visualization, this paper simply uses fixed input distances. However, in practical, the problem is more complex.
* In unsupervised visualization, this paper reduces the dimensionality of the data to two or three, even if its intrinsic dimensionality is higher.
* The method should be applied on more dataset with nominal and ordinal features.