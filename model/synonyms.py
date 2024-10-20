import nltk

def synonym_extractor(word):
    synonyms = set()

    for syn in nltk.corpus.wordnet.synsets(word):
        for l in syn.lemmas():
            synonyms.add(l.name())

        for hyper in syn.hypernyms():
            for l in hyper.lemmas():
                synonyms.add(l.name())

        for hypo in syn.hyponyms():
            for l in hypo.lemmas():
                synonyms.add(l.name())

    return synonyms