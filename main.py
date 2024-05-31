from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TimeLogEntry(BaseModel):
    category: str
    elapsedTime: float

time_log = []

@app.post("/log-time")
async def log_time(entry: TimeLogEntry):
    time_log.append(entry)
    return time_log

@app.get("/time-log")
async def get_time_log():
    return time_log

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
