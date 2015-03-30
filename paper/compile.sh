pandoc writeup.md -o outputs/writeup.docx --bibliography=references.bib --csl=templates/journal-of-cheminformatics.csl
pandoc writeup.md -o outputs/writeup.pdf --bibliography=references.bib --csl=templates/journal-of-cheminformatics.csl
pandoc writeup.md -o outputs/writeup.html --bibliography=references.bib --csl=templates/journal-of-cheminformatics.csl --css=templates/buttondown.css