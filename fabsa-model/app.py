from datetime import datetime, timedelta
import os
import dotenv

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from FABSA import FABSA

dotenv.load_dotenv()
api_key = os.getenv("NEWS_API")

# Default parameters
default_entity = ""
default_current_date = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')
default_from_date = (datetime.today() - timedelta(days=7)).strftime('%Y-%m-%d')
default_num_news = 50

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/analyze")
async def analyze_sentiment(
    entity: str = Query(..., description="Entity to analyze sentiment for"),
    from_date: str = Query(default=default_from_date, description="Start date for the news search (YYYY-MM-DD)"),
    to_date: str = Query(default=default_current_date, description="End date for the news search (YYYY-MM-DD)"),
    num_news: int = Query(default=default_num_news, description="Number of news articles to fetch")
):
    fabsa = FABSA(
        entity=entity,
        api_key=api_key,
        from_date=from_date,
        to_date=to_date,
        num_news=num_news
    )
    sentiment_data = fabsa.predict_sentiment()
    return sentiment_data
