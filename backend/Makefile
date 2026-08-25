.PHONY: run dev db-up db-down install

install:
	python -m venv .venv
	. .venv/bin/activate && pip install -r requirements.txt

db-up:
	docker compose up -d

db-down:
	docker compose down

run:
	uvicorn app.main:app --host 0.0.0.0 --port 8000

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
