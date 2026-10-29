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

# Copia todo o código-fonte da aplicação
COPY . .

# Script de entrypoint para limpar PID do Puma/Rails e executar db:prepare
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh && sed -i 's/\r$//' /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]