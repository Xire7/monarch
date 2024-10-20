from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
import os
from typing import List, Dict, Any, Optional
import boto3
import csv
import io
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from uuid import uuid4
from urllib.parse import urlparse

load_dotenv()

app = FastAPI()

s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION'),
)

S3_BUCKET_UI_DATA = os.getenv('S3_BUCKET_UI_DATA')
S3_BUCKET_LLM_MATCHES = os.getenv('S3_BUCKET_LLM_MATCHES')

@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Those who know"}

@app.post("/upload-large-json")
async def upload_large_json(file: UploadFile = File(...)) -> JSONResponse:
    try:
        file_name = f"{uuid4()}.json"
        
        mpu = s3.create_multipart_upload(Bucket=S3_BUCKET_UI_DATA, Key=file_name)
        
        parts: List[Dict[str, Any]] = []
        part_number = 1
        while True:
            chunk = await file.read(20 * 1024 * 1024)  # Read 20MB chunks
            if not chunk:
                break
            
            part = s3.upload_part(Body=chunk, Bucket=S3_BUCKET_UI_DATA, Key=file_name, UploadId=mpu['UploadId'], PartNumber=part_number)
            parts.append({"PartNumber": part_number, "ETag": part['ETag']})
            part_number += 1
        
        s3.complete_multipart_upload(
            Bucket=S3_BUCKET_UI_DATA,
            Key=file_name,
            UploadId=mpu['UploadId'],
            MultipartUpload={"Parts": parts}
        )
        
        return JSONResponse(content={"message": "Large file uploaded successfully", "file_id": file_name}, status_code=201)
    except ClientError as e:
        s3.abort_multipart_upload(Bucket=S3_BUCKET_UI_DATA, Key=file_name, UploadId=mpu['UploadId'])
        raise HTTPException(status_code=500, detail="Error uploading file to S3")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/s3-file/ui/{file_id}")
async def get_s3_file(file_id: str) -> Dict[str, Any]:
    try:
        response = s3.get_object(Bucket=S3_BUCKET_UI_DATA, Key=file_id)
        file_content = response['Body'].read().decode('utf-8')
        json_content = json.loads(file_content)
        return json_content
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            raise HTTPException(status_code=404, detail="File not found in S3")
        else:
            raise HTTPException(status_code=500, detail="Error retrieving file from S3")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")   

@app.get("/issues")
async def get_issues() -> Dict[str, Any]:
    # Implement your logic here
    pass

def datasetS3CsvToJson(bucket_name: str, s3_key: str) -> Optional[Dict[str, Any]]:
    dataset: Dict[str, Any] = {}
    try:
        response = s3.get_object(Bucket=bucket_name, Key=s3_key)
        content = response['Body'].read().decode('utf-8')
        csv_file = io.StringIO(content)
        
        csvReader = csv.reader(csv_file)
        header = next(csvReader)  # columns
        dataset['name'] = s3_key.split('/')[-1].split('.')[0]  # filename is csv name
        dataset['cols'] = header
        dataset['rows'] = [row for row in csvReader]
    except Exception as e:
        print(f"Error processing {s3_key}: {str(e)}")
        return None
    return dataset

def csvsToJson(s3_ids: List[str], bucket_name: str) -> str:
    datasets: List[Dict[str, Any]] = []
    for s3_id in s3_ids:
        try:
            print(f"Attempting to process: {s3_id}")
            dataset = datasetS3CsvToJson(bucket_name, s3_id)
            if dataset:
                datasets.append(dataset)
                print(f"Successfully processed: {s3_id}")
        except Exception as e:
            print(f"Error processing {s3_id}: {str(e)}")
    return json.dumps(datasets, indent=2)

class S3IDList(BaseModel):
    s3_id_arr: List[str]

@app.post("/csv-to-json")
async def csv_to_json(s3_id_list: S3IDList) -> str:
    try:
        bucket_name = S3_BUCKET_UI_DATA
        print(s3_id_list.s3_id_arr)
        s3_keys = [urlparse(uri).path.lstrip('/') for uri in s3_id_list.s3_id_arr]
        json_content = csvsToJson(s3_keys, bucket_name)
        return json_content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))