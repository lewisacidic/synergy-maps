Git Structure
=============

All code in the project is in one repository.  In order to use GitHub Pages,
``git subtree`` was used to put the master ``frontend/dist`` directory as the
root of the gh-pages branch, as suggested in `this post <subtree example>`_.

Thus in order to update the gh-pages example, one must perform this subtree
merge each time, to get the current master.

.. subtree example: https://gist.github.com/cobyism/4730490
