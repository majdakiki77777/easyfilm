from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
# Removed SentenceTransformer from global scope

print(">>> Flask app started execution")

app = Flask(__name__)
CORS(app)

# Load dataset
movies_df = pd.read_csv('movies.csv')
movies_df['overview'] = movies_df['overview'].fillna('')
movies_df['genres'] = movies_df['genres'].fillna('')
movies_df['vote_average'] = pd.to_numeric(movies_df['vote_average'], errors='coerce').fillna(0)
movies_df['vote_count'] = pd.to_numeric(movies_df['vote_count'], errors='coerce').fillna(0)

# Keep model variable globally uninitialized
model = None

def build_text_embedding(row, model):
    text = f"{row['overview']} Genres: {row['genres']}"
    return model.encode(text)

@app.route("/recommend", methods=["POST"])
def recommend():
    global model
    if model is None:
        from sentence_transformers import SentenceTransformer
        print(">>> Loading SentenceTransformer model...")
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        print(">>> Model loaded")

        # Build embeddings (delayed until model is loaded)
        movies_df['embedding'] = movies_df.apply(lambda row: build_text_embedding(row, model), axis=1)

    try:
        data = request.get_json()
        favorite_ids = data.get("favorite_ids", [])
        watchlist_ids = data.get("watchlist_ids", [])
        movie_ids = favorite_ids + watchlist_ids

        if not movie_ids:
            return jsonify({"recommendations": []})

        recommendations = []

        for movie_id in movie_ids:
            movie_row = movies_df[movies_df['id'] == movie_id]
            if movie_row.empty:
                continue

            overview = str(movie_row.iloc[0]['overview']).strip()
            if not overview or len(overview.split()) < 8:
                continue

            movie_embedding = np.array(movie_row.iloc[0]['embedding']).reshape(1, -1)
            input_genres = set(str(movie_row.iloc[0]['genres']).split(','))

            excluded_genres = {'16', '10751'}  # Animation, Family

            def is_strong_genre_match(row):
                candidate_genres = set(str(row['genres']).split(','))
                overlap = input_genres.intersection(candidate_genres)
                return len(overlap) >= 2 and excluded_genres.isdisjoint(candidate_genres)

            candidate_movies = movies_df[
                (~movies_df['id'].isin(movie_ids)) &
                (movies_df.apply(is_strong_genre_match, axis=1)) &
                (movies_df['vote_average'] >= 6.5) &
                (movies_df['vote_count'] >= 100)
            ].copy()

            if candidate_movies.empty:
                continue

            candidate_embeddings = np.stack(candidate_movies['embedding'].values)
            similarities = cosine_similarity(movie_embedding, candidate_embeddings)[0]

            candidate_movies['score'] = similarities * (candidate_movies['vote_average'] / 10)

            top_movies = candidate_movies.sort_values(by='score', ascending=False).head(10)

            recommendations.append({
                "based_on": movie_row.iloc[0]['title'],
                "recommended": [
                    {
                        "id": int(row['id']),
                        "title": row['title'],
                        "overview": row['overview'],
                        "poster_path": row.get('poster_path', '')
                    }
                    for _, row in top_movies.iterrows()
                ]
            })

        return jsonify({"recommendations": recommendations})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    print(f">>> Flask app running on port {port}")
    app.run(host="0.0.0.0", port=port)









