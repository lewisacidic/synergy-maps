
import skchem
from skchem import PIDGIN
from rdkit.Chem.rdMolDescriptors import GetMorganFingerprintAsBitVect as morg
from synergy_maps import *
from sklearn.decomposition import PCA
from sklearn.manifold import MDS
import sys
import numpy as np


def make_map():

    morg2 = RepresentationType(name='morg2', 
        representation_func=skchem.skchemize(morg, radius=2, nBits=2048),
        metadata="""Hashed Circular fingerprint generated by the Morgan algorithm, """
            """implemented in <a href="http://www.rdkit.org">RDKit</a>. <br/>"""
            """Parameters used: Radius = 2, Bit length = 2048""")

    targets = RepresentationType(name='targets',
        representation_func=PIDGIN(),
        metadata="""Bayes affinity fingerprint for 1080 human targets, produced """ 
        """using the <a href="https://github.com/lhm30/PIDGIN">PIDGIN (Prediction of targets IncluDinG INactives)</a>"""
        """Target Prediction algorithm, implemented in <a href="https://github.com/richlewis42/scikit-chem">scikit-chem</a>.""")

    random = RepresentationType(name='random',
        representation_func=lambda m: pd.Series(np.random.random(100)),
        metadata="""Uniformly distributed random feature vector of length 100""" 
        """implemented using <a href="http://www.numpy.org">numpy</a> <a href="http://docs.scipy.org/doc/numpy/reference/generated/numpy.random.random.html#numpy.random.random">random</a> module""")
    

    representation_types = [ morg2, targets, random ]

    # reduction types    

    pca = ReductionMethod(name='PCA',  
        model=PCA(n_components=2), 
        metadata="""<a href="http://en.wikipedia.org/wiki/Principal_component_analysis">Principal component analysis</a> implemented in <a href="http://scikit-learn.org/stable/" target="_blank">scikit-learn</a>\n"""
        """<br/>Default parameters used.""")


    mds = ReductionMethod(name='MDS',
        model=MDS(),
        metadata=
            """<a href="http://en.wikipedia.org/wiki/Multidimensional_scaling" target="_blank">Multidimensional Scaling</a> implemented in <a href="http://scikit-learn.org/stable/" target="_blank">scikit-learn</a>"""
        """<br/>Default parameters used.""")


    tsne = ReductionMethod(name='t-SNE',
        model=TSNE(perplexity=10),
        metadata=
            """<a href="http://lvdmaaten.github.io/tsne/">Student's t-distributed stochastic neighbour embedding</a>, """
            """implemented according to <a href="http://lvdmaaten.github.io/publications/papers/JMLR_2008.pdf">van der Maartin et al. 2008</a>\n"""
            """<br/>Parameters used: Perplexity = 10, theta=0""")

    reduction_types = [ pca, mds, tsne ]

 
    # activity types

    pIC50 = ActivityType(name='pIC50', metadata=
        """<a href="http://en.wikipedia.org/wiki/IC50">IC50</a>, the concentation of"""
        """compound required for 50% inhibition of growth of Malarial cells""")

    activity_types = [ pIC50 ]
    # synergy types

    MedianExcess = SynergyType(name='MedianExcess', metadata="")
    NumExcess = SynergyType(name='NumExcess', metadata="")
    LS3x3 = SynergyType(name='LS3x3', metadata="")
    DBSumPos = SynergyType(name='DBSumPos', metadata="")
    DBSumNeg = SynergyType(name='DBSumNeg', metadata="")
    pGamma = SynergyType(name='pGamma', metadata="")
    ExcessHSA = SynergyType(name='-ExcessHSA', metadata="")
    ExcessCRX = SynergyType(name='-ExcessCRX', metadata="")
    pGamma_scrambled = SynergyType(name='pGamma_scrambled', metadata="")

    synergy_types = [ pGamma, MedianExcess, NumExcess, LS3x3, DBSumPos, DBSumNeg, ExcessHSA, ExcessCRX, pGamma_scrambled ]

    # data
    compound_df = skchem.read_sdf('compounds.sdf')
    compound_df['name'] = compound_df.Name
    compound_df.drop('Name', axis=1, inplace=True)
    compound_df['id'] = compound_df.index
    compound_df.drop('NCGC_ID', axis=1, inplace=True)
    compound_df.set_index('id', inplace=True)
    compound_df['pIC50'] = compound_df['pIC50'].apply(float)
    compound_df['IC50'] = compound_df.IC50.apply(float)
    
    combination_df = pd.read_csv('combinations.csv')
    combination_df.set_index('id', inplace=True)

    sm = SynergyMap(compound_df=compound_df,
        combination_df=combination_df,
        representation_types=representation_types,
        reduction_types=reduction_types,
        activity_types=activity_types,
        synergy_types=synergy_types)

    return sm

if __name__ == "__main__":
    sm = make_map()
    with open('/Users/RichLewis/Git/Synergy-Maps/frontend/app/data/NCATS-Malaria/data.json', 'w') as f:
        f.writelines(sm.to_json())



