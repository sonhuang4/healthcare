FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application
COPY app/ ./app/
COPY main.py .

EXPOSE 8000

# Use the correct entry point for the refactored structure
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

