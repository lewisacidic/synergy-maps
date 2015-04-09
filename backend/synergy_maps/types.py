#! /usr/bin/env python
#
# Copyright (C) 2015 Rich Lewis <rl403@cam.ac.uk>
# License: MIT

# -*- coding: utf-8 -*-

# pylint: disable=too-few-public-methods

"""synergy_maps.types

Module defining the types of representations, reductions, activities and
synergies to be used in a synergy map.

Finally, default types are implemented.
"""

import pandas as pd
import skchem
from synergy_maps.reduction_methods import TSNE
from skchem.fingerprints import skchemize
from skchem.target_prediction import PIDGIN
from rdkit.Chem.rdMolDescriptors import GetMorganFingerprintAsBitVect as morg
from sklearn.decomposition import PCA
from sklearn.manifold import MDS
import numpy as np

class RepresentationType(object):

    """Class representing a representation, such as morgan2 space

    The class should either implement a method that transforms a Mol object
    into a feature vector, or a dataframe that should provide a feature matrix

    Additionally, there should be a metadata attribute describing the method
    """

    def __init__(self, name=None,
                 representation_func=None,
                 data=None, metadata=None):

        """
        Args:
            name (str): the name of the representation
            representation_func (function): a function for
                A function that takes a Mol object and returns
                a feature vector
            data (pandas.DataFrame):
                A precalculated/raw data feature matrix to be used
                as a representation.
            metadata (str): a description of the representation type.
                HTML description of the representaiton to be displayed
                in the alert asking for information.
        """

        # check for validity
        assert (representation_func is None) or (data is None), \
        'Both a representation function or data should not be set'
        assert not (representation_func is None) and (data is None), \
        'Either a representation function and data should be set'

        self.name = name

        self.representation_func = representation_func
        self.data = data
        self.metadata = metadata

    def __call__(self, compound_df):

        if self.data:
            return self.data
        else:
            return compound_df.structure.apply(self.representation_func)

    def to_dict(self):

        """transform the type to a dict

        Args:
            None

        Returns:
            dict: A dictionary of the representation's name and metadata.
        """

        return {"name": self.name, "metadata": self.metadata}

class ReductionMethod(object):
    """

    Class representing a reduction method, such as t-SNE

    The class should implement a fit_transform method that takes in an
    N x M feature matrix and outputs a N x 2 maxtrix in 2D space

    Additionally, there should be a metadata attribute describing the method.
    """

    def __init__(self, name=None, model=None, fit_transform_func=None, metadata=None):

        """
        Args:
            name (str): the name of the reduction method as a string
            model (object): an object implementing a fit transform method
                An object implementing a fit transform method, such as various
                scikit-learn models.
            fit_transform_func (function): a feature transformation vector
                A function that takes a feature vector and returns a two
                dimensional vector.
            metadata (str): a description of the reduction method type.
                HTML description of the representation to be displayed in the
                alert asking for information.
        """
        self.name = name
        self.model = model

        if self.model:
            self.fit_transform = self.model.fit_transform
        else:
            self.fit_transform = fit_transform_func
        self.metadata = metadata

    def __call__(self, representation_df):

        return pd.DataFrame(self.fit_transform(representation_df.values),
                            index=representation_df.index,
                            columns=['x', 'y'])

    def to_dict(self):
        """produce a dict representation of the type

        Args:
            None

        Returns:
            dict: A dictionary of the reduction method's name and metadata.
        """

        return {"name": self.name, "metadata": self.metadata}


class ActivityType(object):

    """
    A class representing an Activity Type such as IC50.
    """

    def __init__(self, name=None, ascending=True, metadata=None):

        """
        Args:
            name (str): the name of the activity type as a string
                a name, that maps it to a column in supplied compound data.
            ascending (bool): activity vector direction.
                a true value of ascending means that the higher the value,
                the higher the activity, to be used in the visualization.
            metadata (str): string describing the activity.
                HTML description of the activity type to be displayed in the
                alert asking for information.
        """

        self.name = name
        self.ascending = ascending
        self.metadata = metadata

    def to_dict(self):
        """produce a dict representation of the type

        Args:
            None

        Returns:
            dict: A dictionary of the activity type's name and metadata.
        """
        return {"name": self.name, "metadata": self.metadata}

class SynergyType(object):

    """A class representing a Synergy Type such as ExcessOverBliss."""

    def __init__(self, name=None, metadata=None):
        """
        Args:
            name (str): the name of the synergy type as a string
                a string, unique to the synergy type, that maps it to a column
                in supplied combination data.
            ascending (bool): synergy vector direction.
                a true value of ascending means that the higher the value,
                the more synergistic an interaction is.
            additive_value (float): the value defining additivity.
            metadata (str): a string describing the Synergy measurement.
            a description of the reduction method type.
                HTML description of the synergy type to be displayed in the
                alert asking for information.
        """
        self.name = name
        self.metadata = metadata

    def to_dict(self):
        """produce a dict representation of the type

        Args:
            None

        Returns:
            dict: A dictionary of the synergy type's name and metadata.
        """
        return {"name": self.name, "metadata": self.metadata}


morg2 = RepresentationType(name='morg2',
    representation_func=skchemize(morg, radius=2, nBits=2048),
    metadata="""Hashed Circular fingerprint generated by the Morgan algorithm, """
        """implemented in <a href="http://www.rdkit.org">RDKit</a>. <br/>"""
        """Parameters used: Radius = 2, Bit length = 2048""")

targets = RepresentationType(name='targets',
    representation_func=PIDGIN(),
    metadata="""Bayes affinity fingerprint for 1080 human targets, produced """ 
    """using the <a href="https://github.com/lhm30/PIDGIN">PIDGIN (Prediction of targets IncluDinG INactives)</a>"""
    """Target Prediction algorithm, implemented in <a href="https://github.com/richlewis42/scikit-chem">scikit-chem</a>.""")

random = RepresentationType(name='random',
    representation_func=lambda m: pd.Series(np.random.random(100)),
    metadata="""Uniformly distributed random feature vector of length 100""" 
    """implemented using <a href="http://www.numpy.org">numpy</a> <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.random.random.html#numpy.random.random">random</a> module""")

DEFAULT_REPRESENTATION_TYPES = [morg2, targets, random]


pca = ReductionMethod(name='PCA',  
    model=PCA(n_components=2), 
    metadata="""<a href="http://en.wikipedia.org/wiki/Principal_component_analysis">Principal component analysis</a> implemented in <a href="http://scikit-learn.org/stable/" target="_blank">scikit-learn</a>\n"""
    """<br/>Default parameters used.""")

mds = ReductionMethod(name='MDS',
    model=MDS(),
    metadata=
        """<a href="http://en.wikipedia.org/wiki/Multidimensional_scaling" target="_blank">Multidimensional Scaling</a> implemented in <a href="http://scikit-learn.org/stable/" target="_blank">scikit-learn</a>"""
    """<br/>Default parameters used.""")

tsne = ReductionMethod(name='t-SNE',
    model=TSNE(perplexity=10),
    metadata=
        """<a href="http://lvdmaaten.github.io/tsne/">Student's t-distributed stochastic neighbour embedding</a>, """
        """implemented according to <a href="http://lvdmaaten.github.io/publications/papers/JMLR_2008.pdf">van der Maartin et al. 2008</a>\n"""
        """<br/>Parameters used: Perplexity = 10, theta=0""")

DEFAULT_REDUCTION_METHODS = [pca, mds, tsne]

