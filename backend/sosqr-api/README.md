# SOSqr API — Backend Rails 8

API RESTful para gestão e consulta pública de emergência de dados vitais via QR Code para qualquer indivíduo.

Para especificações técnicas detalhadas, consulte o arquivo [`BACKEND_SPEC.md`](./BACKEND_SPEC.md).

## Requisitos
- Ruby 3.3+
- PostgreSQL 16+ (com extensão `pgcrypto`)
- Bundler

## Execução Local
```bash
bundle install
bin/rails db:prepare
bin/rails server
```

## Suíte de Testes
```bash
bundle exec rspec
```
