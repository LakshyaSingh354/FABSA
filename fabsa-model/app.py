from datetime import datetime, timedelta
import os
import dotenv

from fastapi import FastAPI
from pydantic import BaseModel
from FABSA import FABSA


dotenv.load_dotenv()
api_key = os.getenv("NEWS_API")
entity = "Tesla"

# yesterday's date
current_date = datetime.today() - timedelta(days=1)
current_date = current_date.strftime('%Y-%m-%d')

# past 7 days
from_date = datetime.today() - timedelta(days=7)
from_date = from_date.strftime('%Y-%m-%d')

app = FastAPI()

class SentimentRequest(BaseModel):
    entity: str
    from_date: str = from_date
    to_date: str = current_date
    num_news: int = 50

@app.post("/analyze_sentiment")
async def analyze_sentiment(request: SentimentRequest):
    fabsa = FABSA(
        entity=request.entity,
        api_key=api_key,
        from_date=request.from_date,
        to_date=request.to_date,
        num_news=request.num_news
    )
    sentiment_data = fabsa.predict_sentiment()
    return sentiment_data