import csv
import json
import sys
import os

def datasetCsvToJson(fileName):
    dataset = {}
    with open(fileName, 'r') as file:
        csvReader = csv.reader(file)
        header = next(csvReader) #columns
        dataset['name'] = fileName.split('.')[0]  #filename is csv name
        dataset['cols'] = header
        dataset['rows'] = [row for row in csvReader]
    return dataset

def csvsToJson(files):
    datasets = []
    for fileName in files:
        dataset = datasetCsvToJson(fileName)
        datasets.append(dataset)
    return json.dumps(datasets, indent=2)

if __name__ == '__main__':
    print("Current working directory:", os.getcwd())
    files = ['dataset2', 'dataset3']  # Remove .csv here if files don't actually have the extension

    # Ensure all files end with .csv
    files = [f if f.endswith('.csv') else f + '.csv' for f in files]
    
    # Add backslashes if needed (though this might not be necessary)
    # files = [os.path.join('', f) for f in files]

    print(files)
    csvsToJson(files)