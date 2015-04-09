#! /usr/bin/env python
#
# Copyright (C) 2015 Rich Lewis <rl403@cam.ac.uk>
# License: MIT

# -*- coding: utf-8 -*-

"""Package implementing constructing synergy map datasets."""

from .synergy_map import SynergyMap
from .types import (
    RepresentationType,
    ReductionMethod,
    ActivityType,
    SynergyType,
    DEFAULT_REPRESENTATION_TYPES,
    DEFAULT_REDUCTION_METHODS
)
from .reduction_methods import TSNE
