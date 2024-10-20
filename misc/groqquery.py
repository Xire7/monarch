from groq import Groq

JSON_CONTENT = "[\n  {\n    \"name\": \"dataset1\",\n    \"cols\": [\"full_name\", \"birth_year\", \"profession\", \"annual_income\", \"city\"],\n    \"rows\": [\n      [\"John Smith\", 1985, \"Software Engineer\", 95000, \"San Francisco\"],\n      [\"Emma Johnson\", 1990, \"Data Analyst\", 75000, \"New York\"],\n      [\"Michael Brown\", 1988, \"Product Manager\", 110000, \"Seattle\"]\n    ]\n  },\n  {\n    \"name\": \"dataset2\",\n    \"cols\": [\"employee\", \"age\", \"job_title\", \"salary\", \"location\"],\n    \"rows\": [\n      [\"Sarah Davis\", 32, \"UX Designer\", 85000, \"Los Angeles\"],\n      [\"Robert Wilson\", 28, \"Software Developer\", 90000, \"Austin\"],\n      [\"Lisa Thompson\", 35, \"Marketing Manager\", 95000, \"Chicago\"]\n    ]\n  },\n  {\n    \"name\": \"dataset3\",\n    \"cols\": [\"name\", \"birth_date\", \"occupation\", \"longitude\", \"latitude\"],\n    \"rows\": [\n      [\"Alex Turner\", \"1992-05-15\", \"Graphic Designer\", -122.4194, 37.7749],\n      [\"Olivia Martinez\", \"1987-11-22\", \"Financial Analyst\", -74.0060, 40.7128],\n      [\"Daniel Lee\", \"1995-03-08\", \"Software Engineer\", -122.3321, 47.6062]\n    ]\n  }"

def column_matches(json_datasets: str) -> str: # returns a json object
    client = Groq(api_key='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')
    completion = client.chat.completions.create(
        model="gemma2-9b-it",
        messages=[
            {
                "role": "system",
                "content": "You are a JSON dataset column name similarity checker. Your job is to understand that given two or more datasets, you want to find whether there is semantic/contextual similarity between different datasets through their individual columns. These relationships between datasets can be matched n to m, and I want you to assume that all the necessary row data will be provided, so please focus on whether the words of those columns are matching by relevance/semantics/context.\nExpect input to be provided in the following format provided below:\n[\n  {  \n    \"name\": \"dataset2\",\n    \"cols\": [\"city\", \"population\", \"country\", \"continent\"],\n    \"rows\": [\n      [\"New York\", 8419000, \"USA\", \"North America\"],\n      [\"Tokyo\", 13929286, \"Japan\", \"Asia\"],\n      [\"London\", 8982000, \"UK\", \"Europe\"]\n    ]\n  },\n  {  \n    \"name\": \"dataset3\",\n    \"cols\": [\"location\", \"long\", \"lat\", \"inhabitants\"],\n    \"rows\": [\n      [\"New York City\", -74.0060, 40.7128, 8400000],\n      [\"Tokyo Metropolis\", 139.6917, 35.6895, 13960000],\n      [\"Greater London\", -0.1276, 51.5074, 9000000]\n    ]\n  }\n]\nIdentify which columns from which dataset match, and provide your insight solely as a JSON format. \nCreate a format, with guidance from this sample format below:\n{\n    \"matches\": [\n        [\"city\", \"location\"],\n        [[\"long\", \"lat\"]],\n        [\"population\", \"inhabitants\"],\n        [\"city\", [\"long\", \"lat\"]]\n    ],\n    \"from\": [\n        [\"dataset2\", \"dataset3\"],\n        [\"dataset3\"],\n        [\"dataset2\", \"dataset3\"],\n        [\"dataset2\", \"dataset3\"]\n    ],\n    \"categories\": [\n        [\"location\"],\n        [\"coordinates\"],\n        [\"population\"],\n        [\"geographic_position\"]\n    ]\n}\n\nIf there isn't strong enough similarity between any of the dataset column names, return a JSON as such:\n{\n    \"matches\": [\n        \n    ],\n    \"from\": [\n        \n    ],\n    \"categories\": [\n        \n    ]\n}\n\nDo not explain the reasoning, only provide the JSON output as requested."
            },
            {
                "role": "user",
                "content": json_datasets
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
        print(content, end="")  # This will print the response as it streams

    print()  # Add a newline after the streaming is complete
    return full_response


if __name__ == '__main__':
    matches = column_matches(JSON_CONTENT) # returns a json object, receives JSON Datasets