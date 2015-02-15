import pandas as pd
import numpy as np

class RepresentationType(object):

    """ 

    Class representing a representation, such as morgan2 space

    The class should either implement a method that transforms a Mol object
    into a feature vector, or a dataframe that should provide a feature matrix

    Additionally, there should be a metadata attribute describing the method

    """

    def __init__(self, name=None, representation_func=None, data=None, metadata=None):

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

class ReductionMethod(object):
    
    """

    Class representing a reduction method, such as t-SNE

    The class should implement a fit_transform method that takes in an 
    N x M feature matrix and outputs a N x 2 maxtrix in 2D space

    Additionally, there should be a metadata attribute describing the method.

    """

    def __init__(self, name=None, model=None, fit_transform_func=None, metadata=None):

        self.name = name
        self.model = model

        if self.model:
            self.fit_transform = self.model.fit_transform
        else:
            self.fit_transform = fit_transform_func
        self.metadata = metadata

    def __call__(self, representation_df):

        return pd.DataFrame(self.fit_transform(representation_df.values), 
            index=representation_df.index, columns=['x','y'])

class ActivityType(object):

    """

    A class representing an Activity Type such as IC50. 

    args:
     - name: a name, that maps it to a column in a supplied compound 
    data frame.  
     - ascending: a true value of ascending means that the higher the value, 
     the higher the activity, to be used in the visualization.
     - metadata: string describing the activity
    
    """

    def __init__(self, name=None, ascending=True, metadata=None):

        self.name = name
        self.ascending = ascending
        self.metadata = metadata


class SynergyType(object):

    """

    A class representing a Synergy Type such as ExcessOverBliss.  

    args:
     - name: a string, unique to the synergy type, that maps it to a column 
    in a supplied combination data frame
     - ascending: a true value of ascending meas that the higher the value, 
     the more synergistic an interaction is.
     - additive_value: the value of the metric that is describes additivity.
     - metadata: a string describing the Synergy measurement.
   
    """

    def __init__(self, name=None, metadata=None):

        self.name = name
        self.metadata = metadata

