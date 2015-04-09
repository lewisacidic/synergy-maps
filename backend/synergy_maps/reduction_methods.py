#! /usr/bin/env python
#
# Copyright (C) 2015 Rich Lewis <rl403@cam.ac.uk>
# License: MIT

# -*- coding: utf-8 -*-

# pylint: disable=too-few-public-methods

"""
synergy_maps.reduction_methods
------------------------------

a module for providing wrappers or implementations of reduction methods
to be used in the synergy maps.
"""

import tsne as _tsne
from skchem.utils import Suppressor


class TSNE(object):

    """
    A wrapper for Barnes Hut Stochastic Neighbour Embedding (bh_sne)
    implementation for the PyPI tsne package, providing a scikit-learn
    like interface.
    """

    def __init__(self, perplexity=40, theta=0):
        """

        """
        self.perplexity = perplexity
        self.theta = theta

    def fit_transform(self, x_in, suppress=False):
        """ fit to data, and return the transform

        Args:
            x (numpy.array): Input numpy array
                Shape of m x n, where m is the number of compounds
                and n is the size of features.
            suppress (bool, optional): Whether to output debug info.
                Defaults to false

        Returns:
            numpy.array:

        """
        if suppress:
            with Suppressor():
                self._fit_transform(x_in)
        else:
            self._fit_transform(x_in)

    def _fit_transform(self, x_in):
        """ fit to data, and return the transform
        Args:
            x (numpy.array): Input numpy array

        Returns:
            x (numpy.array): Transformed array
        """

        x_in = x_in.astype(float)
        res = _tsne.bh_sne(
            x_in,
            perplexity=self.perplexity,
            theta=self.theta
            )
        return res
