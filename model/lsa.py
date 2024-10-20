import nltk
import string
import numpy as np
import math
from synonyms import synonym_extractor

class Evaluater:
    def __init__(self, reference = None, summary = None):
        nltk.download('punkt', quiet=True)
        nltk.download('stopwords', quiet=True)
        nltk.download('wordnet', quiet=True)
        self.stop_words = set(nltk.corpus.stopwords.words('english'))

        if reference and summary:
            self._reference = reference
            self._summary = summary

            self._rw = self.count_words(self._reference)
            self._sw = self.count_words(self._summary)

            self._dimensions = self.count_sentences(self._reference)

    def set_ref_sum(self, reference, summary):
        self._reference = reference
        self._summary = summary

        self._rw = self.count_words(self._reference)
        self._sw = self.count_words(self._summary)

        self._dimensions = self.count_sentences(self._reference)

    def count_sentences(self, corpus):
        return len(nltk.tokenize.sent_tokenize(corpus))

    def count_words(self, corpus):
        return len(nltk.tokenize.word_tokenize(corpus))

    def extract_meaningful_words(self, corpus):
        words = nltk.tokenize.word_tokenize(corpus.lower())
        return [word for word in words if word not in self.stop_words and word not in string.punctuation]

    def create_matrix(self, corpus, word_list, mode="binary"):
        word_list = list(dict.fromkeys(word_list))
        sentences = nltk.tokenize.sent_tokenize(corpus)
        words_from_sentences = [nltk.tokenize.word_tokenize(sentence.lower()) for sentence in sentences]

        matrix = np.zeros((len(word_list), len(sentences)), dtype=int)
        
        for i, word in enumerate(word_list):
            if mode == "binary":
                matrix[i] = [1 if word in sentence else 0 for sentence in words_from_sentences]
            elif mode == "synonyms":
                syns = set(synonym_extractor(word))
                matrix[i] = [1 if (word in sentence or syns.intersection(sentence)) else 0 for sentence in words_from_sentences]
            elif mode == "frequency":
                matrix[i] = [sentence.count(word) for sentence in words_from_sentences]
            else:
                raise ValueError("mode not recognized")
        
        return matrix

    def main_topic_similarity(self, reference_u_matrix, summary_u_matrix):
        c = np.dot(reference_u_matrix[:, 0], summary_u_matrix[:, 0])

        return math.acos(c)

    def reduce_normalize_matrices(self, reference_u_matrix, summary_u_matrix, reference_s_matrix, summary_s_matrix):
        p = min((self._sw / self._rw) * 100, 100)
        r = math.floor((p / 100) * self._dimensions)

        r = min(r, min(reference_s_matrix.shape[0], summary_s_matrix.shape[0]))

        reduced_u_reference = reference_u_matrix[:, :r]
        reduced_u_summary = summary_u_matrix[:, :r]
        reduced_s_reference = reference_s_matrix[:r]
        reduced_s_summary = summary_s_matrix[:r]

        S_reference = np.diag(reduced_s_reference ** 2)
        S_summary = np.diag(reduced_s_summary ** 2)

        b_reference = np.dot(reduced_u_reference, S_reference)
        b_summary = np.dot(reduced_u_summary, S_summary)

        l_reference = np.linalg.norm(b_reference, axis=1)
        l_summary = np.linalg.norm(b_summary, axis=1)

        if np.all(l_summary == 0):
            return np.zeros(r), np.zeros(r)

        l_reference = l_reference / np.linalg.norm(l_reference)
        l_summary = l_summary / np.linalg.norm(l_summary)

        return l_reference, l_summary
    
    def term_significance_similarity(self, l_reference, l_summary):
        c = np.dot(l_reference, l_summary)
        
        return math.acos(c)
    
    def execute_main_topic(self, mode="binary"):
        r_meaningful_words = self.extract_meaningful_words(self._reference)
        r_matrix = self.create_matrix(self._reference, r_meaningful_words, mode)
        s_matrix = self.create_matrix(self._summary, r_meaningful_words, mode)

        r_u, _, _ = np.linalg.svd(r_matrix)
        s_u, _, _ = np.linalg.svd(s_matrix)

        angle = self.main_topic_similarity(r_u, s_u)
        return 1 - (angle / math.pi)

    def execute_term_sig(self, mode="binary"):
        r_meaningful_words = self.extract_meaningful_words(self._reference)

        r_matrix = self.create_matrix(self._reference, r_meaningful_words, mode)
        s_matrix = self.create_matrix(self._summary, r_meaningful_words, mode)

        r_u, r_s, _ = np.linalg.svd(r_matrix)
        s_u, s_s, _ = np.linalg.svd(s_matrix)

        l_reference, l_summary = self.reduce_normalize_matrices(r_u, s_u, r_s, s_s)

        angle = self.term_significance_similarity(l_reference, l_summary)
        return 1 - (angle / (math.pi / 2))