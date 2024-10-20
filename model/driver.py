import pandas as pd
import numpy as np
from scipy.stats import spearmanr
from groq import Groq
from fuzzywuzzy import fuzz
from lsa import Evaluater
from scipy.spatial.distance import euclidean
import json
from dotenv import load_dotenv
import os

load_dotenv()

GROQ_API_KEY = os.getenv('groq_api_key')

# utilizing Groq and Llama for fast inferences
# utilizing LSA, SVD, NLP, nltk, cosine similarity
# utilizing Spearman coefficients and distributions similarity
# utilzing pandas, numpy, fuzzywuzzy

groqcl = Groq(
    api_key = GROQ_API_KEY
)

def get_cats(jdts):
    completion = groqcl.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {
                "role": "system",
                "content": "You are a JSON dataset column name similarity checker. Your job is to understand that given two or more datasets, you want to find whether there is semantic/contextual similarity between different datasets through their individual columns. These relationships between datasets can be matched n to m, and I want you to assume that all the necessary row data will be provided, so please focus on whether the words of those columns are matching by relevance/semantics/context.\nExpect input to be provided in the following format provided below:\n[\n  {  \n    \"name\": \"dataset2\",\n    \"cols\": [\"city\", \"population\", \"country\", \"continent\"],\n    \"rows\": [\n      [\"New York\", 8419000, \"USA\", \"North America\"],\n      [\"Tokyo\", 13929286, \"Japan\", \"Asia\"],\n      [\"London\", 8982000, \"UK\", \"Europe\"]\n    ]\n  },\n  {  \n    \"name\": \"dataset3\",\n    \"cols\": [\"location\", \"long\", \"lat\", \"inhabitants\"],\n    \"rows\": [\n      [\"New York City\", -74.0060, 40.7128, 8400000],\n      [\"Tokyo Metropolis\", 139.6917, 35.6895, 13960000],\n      [\"Greater London\", -0.1276, 51.5074, 9000000]\n    ]\n  }\n]\nIdentify which columns from which dataset match, and provide your insight solely as a JSON format. \nCreate a format, with guidance from this sample format below:\n{\n    \"matches\": [\n        [\"city\", \"location\"],\n        [[\"long\", \"lat\"]],\n        [\"population\", \"inhabitants\"],\n        [\"city\", [\"long\", \"lat\"]]\n    ],\n    \"from\": [\n        [\"dataset2\", \"dataset3\"],\n        [\"dataset3\"],\n        [\"dataset2\", \"dataset3\"],\n        [\"dataset2\", \"dataset3\"]\n    ],\n    \"categories\": [\n        [\"location\"],\n        [\"coordinates\"],\n        [\"population\"],\n        [\"geographic_position\"]\n    ]\n}\n\nIf there isn't strong enough similarity between any of the dataset column names, return a JSON as such:\n{\n    \"matches\": [\n        \n    ],\n    \"from\": [\n        \n    ],\n    \"categories\": [\n        \n    ]\n}\n\nDo not explain the reasoning, only provide the JSON output as requested."
            },
            {
                "role": "user",
                "content": jdts
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )
    
    full_response = ""
    for chunk in completion:
        content = chunk.choices[0].delta.content or ""
        full_response += content

    return full_response

def unjsonify(jdfs):
    data = json.loads(jdfs)
    dfs = {}
    for dts in data:
        df = pd.DataFrame(dts['rows'], columns = dts['cols'])
        dfs[dts['name']] = df

    for col in df.columns:
        try:
            df[col] = pd.to_numeric(df[col])
            continue
        except ValueError:
            pass
    
    return dfs

def flatten(n_list):
    f_set = set()
    for item in n_list:
        if isinstance(item, list):
            f_set.update(flatten(item))
        else:
            f_set.add(item)

    return f_set

def id_unmatch(dfs, jres):
    jres = json.loads(jres)
    mts = flatten(jres['matches'])
    ots = set()

    for df in dfs:
        ots.update(dfs[df].columns)

    return ots.difference(mts)

def cull_unmatch(dfs, ucols):
    dts = {}
    for name, data in dfs.items():
        dts[name] = data.drop(columns = ucols, errors = 'ignore')

    return dts

def combine_s(s_list):
    weights = [1 / len(s_list)] * len(s_list)

    if isinstance(s_list[0], pd.Series):
        cs_list = s_list[0] * int(weights[0])

        for i in range(1, len(s_list)):
            cs_list += s_list[i] * int(weights[i])
    else:
        cs_list = np.array(s_list[0]) * int(weights[0])

        for i in range(1, len(s_list)):
            cs_list += np.array(s_list[i]) * int(weights[i])

    return cs_list

def pairwise_sprmn(s_list1, s_list2):
    cs_list1 = combine_s(s_list1)
    cs_list2 = combine_s(s_list2)

    return abs(spearmanr(cs_list1, cs_list2)[0])

# all numerical
# can supersetf
def calc_sprmn(df):
    cols = df.columns
    n = len(cols)
    mtrx = np.zeros((n, n))

    for i in range(n):
        for j in range(i, n):
            if i == j:
                mtrx[i, j] = 1.0
            else:
                corr = pairwise_sprmn([df[cols[i]]], [df[cols[j]]])
                mtrx[i, j], mtrx[j, i] = corr, corr

    return pd.DataFrame(mtrx, index=cols, columns=cols)

def process_nested_structure(df, structure):
    result = {}
    
    def process_item(item):
        if isinstance(item, str):
            return df[item]
        elif isinstance(item, tuple):
            return combine_s([process_item(subitem) for subitem in item])
    
    for item in structure:
        if isinstance(item, str):
            result[item] = df[item]
        elif isinstance(item, tuple):
            combined_name = ''.join([subitem if isinstance(subitem, str) else ''.join(subitem) for subitem in item])
            result[combined_name] = process_item(item)
    
    return pd.DataFrame(result)

# df = the cols and values together (as Pandas)
# df_combined = process_nested_structure(df, structure)
# mtrx = calc_sprmn(df_combined)
# chekc if (mtrx > thresh).all().all()

def flatten_str_strct(df, strct):
    max_len = max(df.apply(len))
    flat = []
    columns = []
    for element in strct:
        if isinstance(element, tuple):
            combined = df[list(element)].reindex(range(max_len)).fillna('').astype(str).agg(' '.join, axis=1)
            flat.append(combined)
            columns.append(' '.join(element))
        else:
            flat.append(df[element].reindex(range(max_len)).fillna('').astype(str))
            columns.append(element)
    return pd.DataFrame(flat, columns).T.set_axis(columns, axis=1)

# if series are non-numeric > 7 words
# canNOT do super series
def calc_lsa(col1, col2):
    e = Evaluater()
    n = min(len(col1), len(col2))

    total_lsa_loss = 0
    for i in range(n):
        e.set_ref_sum(col1[i], col2[i])

        main_loss = e.execute_main_topic(mode = 'synonyms')
        sig_loss = e.execute_term_sig(mode = 'synonyms')

        total_lsa_loss += main_loss * 0.7 + sig_loss  * 0.3

    return total_lsa_loss / n

# if series are non-numeric <= 7 words
# CAN do super series
def calc_fuzzy_sims(df, cols):
    sims = {}
    for i, col1 in enumerate(cols):
        for j, col2 in enumerate(cols):
            if i < j:
                similarities = [(fuzz.ratio(str(a), str(b)) / 100) for a, b in zip(df[col1], df[col2])]
                sims[(col1, col2)] = (sum(similarities) / len(similarities)) * 2
    
    return sims

# data
# df = pd.DataFrame(dict([(k, pd.Series(v)) for k, v in data.items()]))
# flat_df = flatten_str_strct(df, structure)
# sims = calc_fuzzy_sims(flat_df, flat_df.columns)

def get_cols_fts(df):
    fts = []
    for col in df.columns:
        s = df[col]
        ft = {
            'name': col,
            'nunique': s.nunique(),
            'missing_ratio': s.isnull().mean(),
        }
        
        try:
            s = pd.to_numeric(s)
            ft.update({
                'skew': s.skew(),
                'dtype': "num",
            })
        except:
            ft.update({
                'avg_length': s.str.len().mean(),
                'max_length': s.str.len().max(),
                'dtype': "str"
            })
        
        fts.append(ft)

    return fts

def calc_euclid_sim(df, fts):
    sim_scores = {}
    for i, ft1 in enumerate(fts):
        for j, ft2 in enumerate(fts):
            if i < j:
                if ft1['dtype'] == ft2['dtype']:
                    if ft1['dtype'] == 'num':
                        feature1 = [v for k, v in ft1.items() if isinstance(v, (int, float))]
                        feature2 = [v for k, v in ft2.items() if isinstance(v, (int, float))]
                        sim = euclidean(feature1, feature2)
                    elif ft1['dtype'] == 'str':
                        avg_length_diff = 1 - abs(ft1['avg_length'] - ft2['avg_length']) / 10
                        max_length_diff = 1 - abs(ft1['max_length'] - ft2['max_length']) / 10
                        sim = (avg_length_diff + max_length_diff) / 2 
                    sim_scores[(ft1['name'], ft2['name'])] = sim
        
    return sim_scores

# data
# make into pd df
# features = get_cols_fts(df)
# sims = calc_euclid_sim(df, features)

def id_nulls(dfs):
    res = {}
    for name, data in dfs.items():
        if data.isnull().values.any():
            res[name] = True
        else:
            res[name] = False

    return res

def cull_nulls(dfs):
    res = {}
    for name, data in dfs.items():
        clean = data.dropna()
        res[name] = clean

    return res

x = '''
[
  {
    "name": "dataset1",
    "cols": ["full_name", "birth_year", "profession", "annual_income", "city", "maiden_name"],
    "rows": [
      ["John Smith", 1985, "Software Engineer", 95000, "San Francisco", "woman name"],
      ["Emma Johnson", 1990, "Data Analyst", 75000, "New York"],
      ["Michael Brown", 1988, "Product Manager", 110000, "Seattle"]
    ]
  },
  {
    "name": "dataset2",
    "cols": ["employee", "age", "job_title", "salary", "location"],
    "rows": [
      ["Sarah Davis", 32, "UX Designer", 85000, "Los Angeles"],
      ["Robert Wilson", 28, "Software Developer", 90000, "Austin"],
      ["Lisa Thompson", 35, "Marketing Manager", 95000, "Chicago"]
    ]
  },
  {
    "name": "dataset3",
    "cols": ["name", "birth_date", "occupation", "longitude", "latitude"],
    "rows": [
      ["Alex Turner", "1992-05-15", "Graphic Designer", -122.4194, 37.7749],
      ["Olivia Martinez", "1987-11-22", "Financial Analyst", -74.0060, 40.7128],
      ["Daniel Lee", "1995-03-08", "Software Engineer", -122.3321, 47.6062]
    ]
  }
]
'''

def matchmaker(match, dfs):
    for df in dfs:
        if match in dfs[df].columns:
            return dfs[df][match]
        
def enchain(match):
    res = ''
    for m in match:
        res += '/' + m

    return res

def gen_issues(jdfs):
    dfs = unjsonify(jdfs) 

    issues = {
        'nvals': {},
        'ucols': {},
        'merges': {}
    }

    # null values
    issues['nvals'] = {k: bool(v) for k, v in id_nulls(dfs).items()}

    # unmatched columns
    jres = get_cats(jdfs)

    issues['ucols'] = list(id_unmatch(dfs, jres))

    jres = json.loads(jres)

    # merges
    mts = jres['matches']
    dsts = jres['from']

    for j in range(len(mts)):
        c_mt = list(flatten(mts[j]))
        cols = []
        for i in range(len(c_mt)):
            cols.append(matchmaker(c_mt[i], dfs))
        
        df = pd.DataFrame(cols).T

        issues['merges'][enchain(c_mt)] = {'name_similarity': True}

        # weighted euclid for all
        eu_fts = get_cols_fts(df)
        eu_sim = calc_euclid_sim(df, eu_fts)
        issues['merges'][enchain(c_mt)]['distribution_similarity'] = bool(all(value > 0.70 for value in eu_sim.values()))

        # spearman for numerics
        if all(pd.api.types.is_numeric_dtype(df[column]) for column in df.columns):
            sprmn_df = process_nested_structure(df, tuple(c_mt))
            sprmn_mtrx = calc_sprmn(sprmn_df)
            issues['merges'][enchain(c_mt)]['spearman_similarity'] = bool((sprmn_mtrx >= .50).all().all())
        else:
            issues['merges'][enchain(c_mt)]['spearman_similarity'] = False
        
        # lsa for really large large texts
        if all(pd.api.types.is_string_dtype(df[column]) for column in df.columns) and len(c_mt) == 2:
            try:
                issues['merges'][enchain(c_mt)]['lsa_similarity'] = bool(calc_lsa(df[df.columns[0]], df[df.columns[1]]) > 0.45)
            except:
                issues['merges'][enchain(c_mt)]['lsa_similarity'] = False
        else:
            issues['merges'][enchain(c_mt)]['lsa_similarity'] = False

        # fuzzy for general texts
        if all(pd.api.types.is_string_dtype(df[column]) for column in df.columns):
            fuzz_df = flatten_str_strct(df, tuple(c_mt))
            fuzzy_sims = calc_fuzzy_sims(fuzz_df, fuzz_df.columns)
            issues['merges'][enchain(c_mt)]['fuzzy_similarity'] = bool(any(value > 0.60 for value in fuzzy_sims.values()))
        else:
            issues['merges'][enchain(c_mt)]['fuzzy_similarity'] = False

    # return json.dumps(issues)
    return issues

def buff_issues(issues):
    pass

def send_initial_report():
    pass

def send_modified_data():
    pass