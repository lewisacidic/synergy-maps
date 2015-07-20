Frontend
========

The frontend is written in JavaScript, and runs in modern (HTML5 enabled) web browsers.
It is an `angularjs`_ app, and was scaffolded using `yeoman`_, using the `angular`_ generator.

Dependencies
------------

The project requires the `node`_ runtime to build the app, `Grunt`_ to run tasks,
and `npm`_ and `bower`_ to install dependencies.

Building
--------

To build and serve the project, change into the frontend directory and run:

.. code-block:: bash

  $ npm install -g grunt bower  // install grunt
  $ npm install                 // install node modules
  $ bower install               // install bower modules
  $ grunt serve                 // build and run the server

Your default browser should open to ``localhost:9000``, where the app is being
served.

.. _angularjs: http://angularjs.org
.. _yeoman: http://yeoman.io
.. _angular: https://github.com/yeoman/generator-angular
.. _node: https://nodejs.org
.. _bower: https://bower.io
.. _npm: http://npmjs.com
.. _grunt: http://gruntjs.com
