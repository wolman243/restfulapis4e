from celery import Celery
from db import session_local
from models import JobResult
import traceback
import json

celery_app = Celery(

    "worker",
    broker="amqp://guest:guest@rabbitmq//",
    backend="redis://redis:6379/0",

)

celery_app.conf.update(

    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,

)

@celery_app.task(bind=True)

def run_job(self, job_name, data):
    print(f"Job started: {job_name} with data: {data}")

    job_result = None

    try:
        with session_local() as session:

            job_result = JobResult(

                job_name=job_name,
                status="pending",
                result=json.dumps({"status": "pending", "message": "Job started"})

            )

            session.add(job_result)
            session.commit()
            session.refresh(job_result)
            job_id = job_result.id

            print(f"Job saved to database with ID: {job_id}")

    except Exception as e:

        print(f"Failed to save initial job to database: {e}")
        traceback.print_exc()

        return {"error": "Failed to save job to database"}

    result = None

    try:

        if job_name == "os_command":

            from jobs.os_command import run_os_command
            result = run_os_command(data)
            print(f"OS Command result: {result}")
            
        elif job_name == "katana_crawl":

            from jobs.katana_crawler_job import run_katana_crawl
            url = data.get("url", "")

            if not url:
                result = {"status": "error", "message": "URL is required for crawl job"}

            else:
                result = run_katana_crawl(url)
            print(f"Katana crawl result: {result}")
            
        else:
            result = {"status": "error", "message": f"Unknown job type: {job_name}"}
            print(f"Unknown job result: {result}")
            
    except Exception as e:
        result = {"status": "error", "message": f"Job execution failed: {str(e)}"}
        print(f"Job execution error: {e}")
        traceback.print_exc()
    
    
    try:
        with session_local() as session:
            
            job_record = session.query(JobResult).filter(JobResult.id == job_id).first()

            if job_record:

                job_record.status = result.get("status", "error")
                job_record.result = json.dumps(result)
                session.commit()
                print(f"Job {job_id} updated in database with status: {result.get('status')}")
            else:
                print(f"Could not find job {job_id} to update")
                
    except Exception as e:
        print(f"Failed to update job in database: {e}")
        traceback.print_exc()
    
    return {"job_result_id": job_id, "result": result}


if __name__ == '__main__':
    celery_app.start()
