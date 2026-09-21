FROM ruby:3.3-slim

# Instala dependências essenciais de compilação e cliente PostgreSQL
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Otimização de cache para Gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Script de entrypoint para limpar PID do Puma/Rails
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

CMD ["bin/rails", "server", "-b", "0.0.0.0"]