from collections import defaultdict
from rdkit.Chem.Draw import MolToFile
import pandas as pd
import networkx as nx
import json
import os

class SynergyMap(object):
    
    """

    A synergy map class created from combination and chemical data. 
    Generates a JSON file required for the web app to display the map.
   
    """

    def __init__(self, 
        compound_df=None, 
        combination_df=None, 
        activity_types=[], 
        synergy_types=[], 
        representation_types=[], 
        reduction_types=[],
        metadata=None):
       
        """
       
            Create a synergy map object.

            arguments:

            compound_df:
             -  compound scikit-chem dataframe

            combination_df:
             -  combination dataframe

            activity_types:
             -  a list of activities that are present in the compound dataframe

            synergy_types:
             -  a list of synergies present in the combination dataframe
            
            representations:
             -  a list of representations to use

            reductions_types:
             -  a list of reduction methods to use 

            metadata:
             -  a string description of the dataset

        """

        self.compounds = compound_df
        self.combinations = combination_df

        self.representation_types = representation_types
        self.reduction_types = reduction_types
        self.activity_types = activity_types
        self.synergy_types = synergy_types

        self.metadata = metadata

        self._generate_coordinates()
        self._generate_graph()
        self._generate_metadata()
        self._generate_comp_svgs()

    def _generate_metadata(self):

        """draw the metadata out of all objects, to make single metadata file"""

        self.dataset_metadata = {
            'representationTypes': [rep.to_dict() for rep in self.representation_types],
            'dimensionalityReductionTypes': [red.to_dict() for red in self.reduction_types],
            'activityTypes': [act.to_dict() for act in self.activity_types],
            'synergyTypes': [syn.to_dict() for syn in self.synergy_types],
            'dataset': self.metadata
        }

    def _generate_coordinates(self):

        """
            iterate through every combination of representation type and 
            reduction method, applying them and saving the resultant dataframes 
            in the coordinates dictionary
        """
        self.coordinates = defaultdict(dict)

        for rep in self.representation_types:
            for red in self.reduction_types:
                self.coordinates[rep.name][red.name] = red(rep(self.compounds))

    def _generate_graph(self):

        '''create networkX graph'''

        g = nx.Graph()
        g.add_nodes_from((idx, row) for (idx, row) in self.compounds.iterrows())
        g.add_edges_from((rows['ColId'], rows['RowId'], rows.drop(['ColId', 'RowId'])) \
            for (idx, rows) in self.combinations.iterrows())
        self.graph = g

    def _generate_comp_svgs(self):

        """

            Create SVG images of the compounds

        """

        structure_path = os.path.join(os.path.split(os.path.split(os.path.dirname(__file__))[0])[0], 'frontend/app/data/images')

        self.compounds.apply(lambda r: MolToFile(r.structure, os.path.join(structure_path, '{}-{}.svg'.format(r.name, r['Name']))), axis=1)


    def to_json(self):

        """

            Generate a JSON representation from the constructed Synergy Map.
        
        """
        
        coords = json.loads(pd.json.dumps(self.coordinates, orient='index'))
        
        combs = self.combinations.reset_index().to_dict(orient='records')

        comps = self.compounds.drop('structure', axis=1).reset_index().to_dict(orient='records')

        ds = {
                'compounds': comps,
                'combinations': combs,
                'coordinates': coords,
                'metadata': self.dataset_metadata}

        return json.dumps(ds)
        

if __name__ == '__main__':

    pass