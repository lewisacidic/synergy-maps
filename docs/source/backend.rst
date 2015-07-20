Backend
=======

The backend is written in `Python`, and is where data is processed into the JSON
representation. The API is detailed in :doc:`API`.

Quickstart
----------

A prebuilt script for analysing pairwise combination data in a standard format are
provided in the ``scripts`` folder.  These provide minimum functionality, but the
software is designed for extensibility, so consider writing your own script using
the example datasets inluded in ``backend/synergy_maps/examples/``.

The script can be run using:

.. code-block:: bash

    $ python synergy_map.py example_compounds.smiles example_combinations.csv > map.json

Data structure
^^^^^^^^^^^^^^

Compounds
~~~~~~~~

The example script takes compounds as a smiles file. The smiles should be
provided as a first column, and the identifier as the second column.  The
individual activities are supplied as extra columns.

A sample of a (made up) compound dataset would be:

.. code-block:: bash

    $ head example_compounds.smiles
    SMILES  name    pIC50
    CC  ethane  1.2
    CCC propane 2.1
    CN  methylamine 4.3
    ... ... ...

Showing 3 compounds, with pIC50 as activity.

Combinations
~~~~~~~~~~~~

The example script takes combinations as a csv file.  The combination identifier
should be given as the first column, and the component compounds ids should be
provided as the second and third column. The example combinations should provide
their synergy metrics as extra columns.

.. code-block:: bash

    $ head example_combinations.csv
    id RowId    ColId   pGamma ExcessOverBliss
    0   ethane  propane 0.001   1.0
    1   ethane  methylamine 0.2 4.0
    2   propane methylamine -0.1    1.2
    ... ... ... ...

Running the Script
^^^^^^^^^^^^^^^^^^

The script will use the default representations (Structural and Targets) and
reduction methods (TSNE, PCA and MDS) to generate the synergy map data, and
print out the JSON to the console.  This can be redirected to a file:

.. code-block:: bash

    $ python synergy_map.py example_compounds.smiles example_combinations.csv > synergy_map.json

Viewing the Map
^^^^^^^^^^^^^^^

The generated map can then be viewed by putting the json file into the data
directory of the :doc:`frontend` and building the application.

.. code-block:: bash

    $ mkdir $SYNERGY_BASE/frontend/app/data/new_dataset/
    $ mv synergy_map.json > $SYNERGY_BASE/frontend/app/data/new_dataset/data.json

You will also need to add it to the ``metadata.json`` file:

.. code-block:: bash

    $ less $SYNERGY_BASE/frontend/app/data/metadata.json
    {"datasets": ["DREAM-Lymphoma", "NCATS-Malaria", "new_dataset"]}

This will now be selectable from the table.

Please consider looking at ``synergy_maps/examples`` where there are two example
scripts using the :doc:`declarative API <API>` for generating the datasets.
