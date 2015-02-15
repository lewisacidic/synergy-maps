from setuptools import setup

setup(name='synergy_maps', 
    version='0.1.0', 
    description='Python library for generating (and eventually serving) synergy-map JSON files compatable with the companion HTML/CSS/JS Web App',
    url='http://github.com/richlewis42/synergy_maps',
    author='Richard Lewis',
    author_email='rl403@cam.ac.uk',
    license='BSD',
    packages=['synergy_maps'],
    install_requires=[
        #'rdkit',  ## currently rdkit does not have a valid pip installable package, so this dependency must be met by the installer
        'skchem',
        'scikit-learn',
        'pandas',
        'tsne'
        ],
    test_suite='nose.collector',
    tests_require=['nose'],
    zip_safe=False
    )
