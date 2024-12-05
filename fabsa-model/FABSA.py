import os
from transformers import AutoTokenizer
from optimum.onnxruntime import ORTModelForSequenceClassification
from rapidfuzz import fuzz, process
import requests
import dotenv
import time
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

class FABSA:
    def __init__(self, entity, api_key, from_date="", to_date="", num_news=50, batch_size=4):
        self.entity = entity
        self.api_key = api_key
        self.from_date = from_date
        self.to_date = to_date
        self.num_news = num_news
        self.batch_size = batch_size
        self.onnx_model = ORTModelForSequenceClassification.from_pretrained("onnx", file_name="model.onnx")
        self.tokenizer = AutoTokenizer.from_pretrained("onnx")

    def fetch_news(self):
        """
        Fetches news articles related to the entity using the NewsAPI.
        """
        url = f"https://newsapi.org/v2/everything?q={self.entity}&language=en&from={self.from_date}&to={self.to_date}&pageSize={self.num_news}&sortBy=relevancy&apiKey={self.api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json().get("articles", [])  # Return the list of articles with all fields
        return []

    def fuzzy_replace(self, headline, threshold=150):
        """
        Replaces the closest match of the entity in the headline with [TGT].
        """
        headline = headline.lower().replace(self.entity.lower(), "[TGT]")
        if "[TGT]" in headline:
            return headline
        self.entity = self.entity.lower()
        words = headline.split()
        best_match = process.extractOne(self.entity, words, scorer=fuzz.partial_ratio)
        if best_match and best_match[1] >= threshold:
            matched_word = best_match[0]
            return headline.replace(matched_word, "[TGT]")
        return headline

    def batch_infer(self, texts):
        """
        Runs inference on a batch of texts and returns their predicted sentiment classes.
        """
        inputs = self.tokenizer(texts, return_tensors="pt", padding=True, truncation=True, max_length=512)
        outputs = self.onnx_model(**inputs)
        predicted_classes = outputs.logits.argmax(dim=-1).tolist()
        logits = outputs.logits.softmax(dim=-1)  # Convert logits to probabilities
        return predicted_classes, logits

    def predict_sentiment(self):
        """
        Fetches news, preprocesses it, performs batched inference, and aggregates sentiment scores.
        """
        articles = self.fetch_news()  # Fetch the raw articles
        if not articles:
            print("No news articles found. Try relaxing the date range or check your query again.")
            exit()

        # Extract descriptions or titles from articles
        headlines = [
            article.get("description") or article.get("title", "")
            for article in articles if "description" in article or "title" in article
        ]

        # Preprocess headlines
        processed_headlines = [self.fuzzy_replace(headline) for headline in headlines]
        
        # Perform inference in batches
        predictions = []
        probabilities = []
        for i in range(0, len(processed_headlines), self.batch_size):
            batch = processed_headlines[i:i + self.batch_size]
            batch_preds, batch_probs = self.batch_infer(batch)
            predictions.extend(batch_preds)
            probabilities.extend(batch_probs.tolist())

        # Map predictions to sentiment labels
        sentiment_map = {0: "Negative", 1: "Neutral", 2: "Positive"}
        sentiments = [sentiment_map[pred] for pred in predictions]

        # Aggregate scores
        sentiment_counts = {"Negative": 0, "Neutral": 0, "Positive": 0}
        for sentiment in sentiments:
            sentiment_counts[sentiment] += 1

        # Calculate sentiment score
        sentiment_weights = {"Negative": -1, "Neutral": 0, "Positive": 1}
        sentiment_score = sum(sentiment_weights[sentiment_map[pred]] for pred in predictions) / (len(predictions) or 1)

        # Normalize counts to percentages
        total = len(predictions)
        sentiment_percentages = {k: round(v / total * 100, 2) for k, v in sentiment_counts.items()}

        return {
            "individual_sentiments": sentiments,
            "aggregated_sentiments": sentiment_percentages,
            "sentiment_score": round(sentiment_score, 2),
            "probabilities": probabilities
        }

    def historical_sentiment_analysis(self, days=30):
        """
        Performs sentiment analysis over the past `days` days by fetching articles for the entire range 
        in a single request and grouping them by date using the `publishedAt` field.
        """
        yesterday = datetime.today() - timedelta(days=1)
        start_date = yesterday - timedelta(days=days-1)
        
        # Set the API query range for one call
        self.from_date = start_date.strftime('%Y-%m-%d')
        self.to_date = yesterday.strftime('%Y-%m-%d')
        self.num_news = 100
        print("Fetching news articles from", self.from_date, "to", self.to_date)

        # Fetch articles for the entire range
        articles = self.fetch_news()  # This will fetch all articles within the range
        print("Total articles fetched:", len(articles))
        
        # Group articles by their publishedAt date
        grouped_articles = {}
        for article in articles:
            published_date = article.get("publishedAt", "").split("T")[0]  # Extract the date part of publishedAt
            if not published_date:
                continue
            if published_date not in grouped_articles:
                grouped_articles[published_date] = []
            grouped_articles[published_date].append(article.get("description") or article.get("title"))

        # Perform sentiment analysis for each date
        time_series_sentiment = []
        for date, headlines in grouped_articles.items():
            # Process the headlines for the specific date
            processed_headlines = [self.fuzzy_replace(headline) for headline in headlines]

            # Batch inference
            predictions = []
            for i in range(0, len(processed_headlines), self.batch_size):
                batch = processed_headlines[i:i + self.batch_size]
                batch_preds, _ = self.batch_infer(batch)
                predictions.extend(batch_preds)

            # Aggregate results
            sentiment_map = {0: "Negative", 1: "Neutral", 2: "Positive"}
            sentiment_counts = {"Negative": 0, "Neutral": 0, "Positive": 0}
            for pred in predictions:
                sentiment_counts[sentiment_map[pred]] += 1

            sentiment_score = sum({"Negative": -1, "Neutral": 0, "Positive": 1}[sentiment_map[pred]] for pred in predictions) / len(predictions)

            time_series_sentiment.append({
                "date": date,
                "aggregated_sentiments": {
                    k: round(v / len(predictions) * 100, 2) for k, v in sentiment_counts.items()
                },
                "sentiment_score": round(sentiment_score, 2)
            })

        return sorted(time_series_sentiment, key=lambda x: x["date"])

dotenv.load_dotenv()
api_key = os.getenv("NEWS_API")
entity = "Tesla"

# yesterday's date
current_date = datetime.today() - timedelta(days=1)
current_date = current_date.strftime('%Y-%m-%d')

# past 7 days
from_date = datetime.today() - timedelta(days=7)
from_date = from_date.strftime('%Y-%m-%d')

# fabsa = FABSA(entity, api_key, batch_size=1, num_news=25, from_date=from_date, to_date=current_date)
# # start timer
# start = time.time()
# results = fabsa.predict_sentiment()

# print("Individual Sentiments:", results["individual_sentiments"])
# print("Aggregated Sentiments:", results["aggregated_sentiments"])
# print("Current Sentiment Score:", results["sentiment_score"], "\n\n")

# # plot the sentiment scores over time

# time_series_sentiment = fabsa.historical_sentiment_analysis(30)
# dates = [data["date"] for data in time_series_sentiment]
# sentiment_scores = [data["sentiment_score"] for data in time_series_sentiment]

# plt.figure(figsize=(12, 6))
# plt.plot(dates, sentiment_scores, marker='o')
# plt.xlabel("Date")
# plt.ylabel("Sentiment Score")
# plt.title(f"Sentiment Analysis for {entity} over the past 30 days")
# plt.xticks(rotation=45)
# plt.show()

# end = time.time()
# print("\n\nTime taken:", end - start, "seconds")




