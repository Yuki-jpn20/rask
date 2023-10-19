up:
	docker compose up -d

setup:
	docker compose exec myapp bash -c 'bundle config set path vendor/bundle'
	docker compose exec myapp bash -c 'bundle install'
	docker compose exec myapp bash -c 'yarn'
	docker compose exec myapp bash -c 'bin/rails db:migrate'
	docker compose exec myapp bash -c 'bin/rails tailwindcss:install'

start:
	docker compose exec myapp bash -c 'bin/rails server -b 0.0.0.0'

myapp:
	docker compose exec myapp bash

down:
	docker compose down --rmi all --volumes

rails-test:
	docker compose exec myapp bundle exec rails test
