#! /usr/bin/env python
#
# Copyright (C) 2015 Rich Lewis <rl403@cam.ac.uk>
# License: MIT

# -*- coding: utf-8 -*-

"""synergy_maps setup.py file"""

from setuptools import setup

DESCRIPTION = """Python library for generating (and eventually serving) synergy-map JSON
files compatable with the companion HTML/CSS/JS Web App"""

setup(
    name='synergy_maps',
    version='0.1.0',
    description=DESCRIPTION,
    url='http://github.com/richlewis42/synergy_maps',
    author='Richard Lewis',
    author_email='rl403@cam.ac.uk',
    license='BSD',
    packages=['synergy_maps'],
    install_requires=[
        # 'rdkit',      ## currently rdkit is not pip installable
        #               ## so this dependency must be met by the installer
        # 'scikit-chem',## currently scikit-chem is not pip installable
        'scikit-learn',
        'pandas',
        'tsne',
        'json',
        'networkx'
        ],
    test_suite='nose.collector',
    tests_require=['nose'],
    zip_safe=False
)
