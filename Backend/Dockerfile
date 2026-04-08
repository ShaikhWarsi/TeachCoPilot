FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p uploads flask_sessions && \
    chmod -R 777 uploads flask_sessions

# Expose the port
EXPOSE 7860

# Run the application
# Using gunicorn for production stability
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--timeout", "120", "--workers", "2", "app:app"]
