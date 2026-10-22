FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY services/api/pyproject.toml ./pyproject.toml
COPY services/api/app ./app
RUN pip install --no-cache-dir . && useradd --create-home --uid 10001 opspilot
USER 10001
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

