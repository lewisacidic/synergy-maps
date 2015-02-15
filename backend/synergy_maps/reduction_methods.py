import tsne as _tsne

class TSNE(object):

    """

    A wrapper for Barnes Hut Stochastic Neighbour Embedding (bh_sne) implementation for the PyPI tsne package,
    providing a scikit-learn like interface.

    """

    def __init__(self, perplexity=40, theta=0):
        self.perplexity = perplexity
        self.theta = theta

    def fit_transform(self, X):
        X = X.astype(float)
        print _tsne
        return _tsne.bh_sne(X, perplexity=self.perplexity, theta=self.theta)

