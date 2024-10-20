from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
import json
import os
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from uuid import uuid4

load_dotenv()

app = FastAPI()

print("AWS secret key", os.getenv('AWS_ACCESS_KEY_ID'))
print("AWS secret access", os.getenv('AWS_SECRET_ACCESS_KEY'))


s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key= os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

S3_BUCKET_UI_DATA = os.getenv('S3_BUCKET_UI_DATA')

S3_BUCKET_LLM_MATCHES = os.getenv('S3_BUCKET_LLM_MATCHES')


@app.get("/")
async def root():
    return {"message" : "Those who know"}


@app.post("/upload-large-json")
async def upload_large_json(file: UploadFile = File(...)):
    try:
        file_name = f"{uuid4()}.json"
        
        # Initiate multipart upload
        mpu = s3.create_multipart_upload(Bucket=S3_BUCKET_UI_DATA, Key=file_name)
        
        parts = []
        part_number = 1
        while True:
            chunk = await file.read(20 * 1024 * 1024)  # Read 20MB chunks
            if not chunk:
                break
            
            # Upload part
            part = s3.upload_part(Body=chunk, Bucket=S3_BUCKET_UI_DATA, Key=file_name, UploadId=mpu['UploadId'], PartNumber=part_number)
            parts.append({"PartNumber": part_number, "ETag": part['ETag']})
            part_number += 1
        
        # Complete multipart upload
        s3.complete_multipart_upload(
            Bucket=S3_BUCKET_UI_DATA,
            Key=file_name,
            UploadId=mpu['UploadId'],
            MultipartUpload={"Parts": parts}
        )
        
        return JSONResponse(content={"message": "Large file uploaded successfully", "file_id": file_name}, status_code=201)
    except ClientError as e:
        # Abort multipart upload if something goes wrong
        s3.abort_multipart_upload(Bucket=S3_BUCKET_UI_DATA, Key=file_name, UploadId=mpu['UploadId'])
        raise HTTPException(status_code=500, detail="Error uploading file to S3")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# given `file_id`, return the JSON content of the file stored in S3
@app.get("/s3-file/ui/{file_id}")
async def get_s3_file(file_id: str):
    try:
        # attempt to download the file from S3
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


# will receive 10 issues as a JSON object
# {
#   'nvals': {'dataset1': 1, 'dataset2': 0, 'dataset3': 0},
#   'ucols': {'maiden_name'},
#   'merges' {...}
# }

@app.get("/issues")
async def get_issues():
    pass