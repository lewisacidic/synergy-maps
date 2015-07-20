#! /usr/bin/env python
#
# Copyright (C) 2007-2014 Rich Lewis <rl403@cam.ac.uk>
# License: MIT

# -*- coding: utf-8 -*-

# pylint: disable=too-many-instance-attributes,too-many-arguments

""" Module implementing the creation of synergy map objects. """

from collections import defaultdict
from rdkit.Chem.Draw import MolToFile
import pandas as pd
import networkx as nx
import json
import os


class SynergyMap(object):

    """A synergy map class created from combination and chemical data.

    Generates a JSON file required for the web app to display the map.
    """

    def __init__(self, compound_df, combination_df,
                 activity_types, synergy_types,
                 representation_types, reduction_types,
                 metadata):

        """Create a synergy map object.

        Args:
            compound_df (pandas.DataFrame): compound scikit-chem dataframe
            combination_df (pandas.DataFrame): combination dataframe
            activity_types (list): List of activity types
                The list of activity types that are present in the
                compound dataframe
            synergy_types (list): list of synergy types
                A list of synergy types that are present in the
                combination dataframe
            representations (list): a list of representation types to use
                A list of representation types to use to generate the maps
            reductions_types (list): a list of reduction methods to use
                A list of reduction methods to use to generate the maps
            metadata (string): description of the dataset
                A string description of the dataset.

        """

        self.compounds = compound_df
        self.combinations = combination_df

        self.representation_types = representation_types
        self.reduction_types = reduction_types
        self.activity_types = activity_types
        self.synergy_types = synergy_types

        self.metadata = metadata

        self.generate_coordinates()
        self.generate_graph()
        self.generate_metadata()
        #self.generate_comp_svgs()

    def generate_metadata(self):

        """Draw the metadata out of all objects, to make single metadata object

        Returns:
            dict: dictionary for the different types of metadata.

        """

        self.dataset_metadata = {
            'representationTypes': [rep.to_dict() for rep in self.representation_types],
            'dimensionalityReductionTypes': [red.to_dict() for red in self.reduction_types],
            'activityTypes': [act.to_dict() for act in self.activity_types],
            'synergyTypes': [syn.to_dict() for syn in self.synergy_types],
            'dataset': self.metadata
        }

        return self.dataset_metadata

    def generate_coordinates(self):

        """ calculate coordinates to use in the synergy map

        Iterate through every combination of representation type and
        reduction method, applying them and saving the resultant dataframes
        in the coordinates dictionary.

        Returns:
            dict: multi level dict of coordinates
                dict -> rep -> red -> (x, y)
        """
        self.coordinates = defaultdict(dict)

        for rep in self.representation_types:
            for red in self.reduction_types:
                self.coordinates[rep.name][red.name] = red(rep(self.compounds))

    def generate_graph(self):

        """create networkX graph for the dataset

        Returns:
            graph (networkx.Graph) the graph object for the dataset."""

        graph = nx.Graph()
        graph.add_nodes_from(
            (idx, row) for (idx, row) in self.compounds.iterrows())
        graph.add_edges_from(
            (rows['ColId'], rows['RowId'], rows.drop(['ColId', 'RowId']))
            for (idx, rows) in self.combinations.iterrows())
        return graph

    def generate_comp_svgs(self):

        """Create SVG images of the compounds.

        The images are inserted directly into the images directory
        of the frontend.

        Notes:
            It is expected that the user has installed an svg capable
            renderer for rdkit.  See http://www.rdkit.org for details.

        Returns:
            None

        """

        structure_path = os.path.join(
            os.path.dirname(__file__),
            '../../frontend/app/data/images'
            )

        self.compounds.apply(
            lambda r: MolToFile(
                r.structure,
                os.path.join(
                    structure_path,
                    '{}-{}.svg'.format(r.name, r['name'])
                    )
                ),
            axis=1
            )

    def to_json(self):

        """Generate a JSON representation from the constructed Synergy Map.

        Returns:
            str: a string containing the json.
        """

        coords = json.loads(pd.json.dumps(self.coordinates, orient='index'))

        combs = self.combinations.reset_index().to_dict(orient='records')

        syn_types = [s.name for s in self.synergy_types]
        new_combs = []

        for comb in combs:
            new_comb = {}
            new_comb['id'] = comb['id']
            new_comb['RowId'] = comb['RowId']
            new_comb['ColId'] = comb['ColId']
            new_comb['synergies'] = {
                k: v for k, v in comb.iteritems() if k in syn_types}
            new_comb['properties'] = {
                k: v for k, v in comb.iteritems() if k not in syn_types +
                ['id', 'RowId', 'ColId']}
            new_combs.append(new_comb)

        comps = self.compounds.drop('structure', axis=1)\
                              .reset_index()\
                              .to_dict(orient='records')

        act_types = [a.name for a in self.activity_types]
        new_comps = []

        for comp in comps:
            new_comp = {}
            new_comp['id'] = comp['id']
            new_comp['name'] = comp['name']
            new_comp['activities'] = {
                k: v for k, v in comp.iteritems() if k in act_types}
            new_comp['properties'] = {
                k: v for k, v in comp.iteritems() if k not in act_types +
                ['id', 'name']}
            new_comps.append(new_comp)

        dataset = {
            'compounds': new_comps,
            'combinations': new_combs,
            'coordinates': coords,
            'metadata': self.dataset_metadata
        }

        return json.dumps(dataset)
