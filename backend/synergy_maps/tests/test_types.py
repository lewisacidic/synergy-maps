from unittest import TestCase
import synergy_maps

class TestRepresentationType(TestCase):

    def test_representation_no_data_or_func_error(self):

        """ Test that a representation cannot be made with neither data
        supplied, or a generating function"""

        with self.assertRaises(AssertionError):
            synergy_maps.RepresentationType()

    def test_representation_data_and_func(self):

        """ Test that a representation cannot be made with both data
        and a generating function"""

        with self.assertRaises(AssertionError):
            synergy_maps.RepresentationType(representation_func=True,
                                            data=True)

class TestReductionMethod(TestCase):

    # TODO
    pass
