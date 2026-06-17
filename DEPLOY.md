# Deploy no Coolify (VPS)

Este projeto serve o arquivo `playbook.html` como um site estático usando **nginx**
dentro de um container Docker. O Coolify constrói a imagem a partir do `Dockerfile`
e publica automaticamente a cada `git push`.

## Pré-requisitos

- Coolify já instalado e rodando na sua VPS.
- O Coolify conectado ao GitHub (via GitHub App) **ou** com acesso ao repositório
  `https://github.com/jorguzz-fer/playbook-wow.git`.

## Passo a passo no Coolify

1. **Projeto**: no painel do Coolify, clique em **+ New** → **Project** (ou use um existente).
2. **Recurso**: dentro do projeto, clique em **+ New Resource**.
3. **Origem**: escolha **Public Repository** (ou **Private Repository (with GitHub App)**
   se o repo for privado) e cole a URL:
   `https://github.com/jorguzz-fer/playbook-wow`
4. **Branch**: selecione a branch que você quer publicar (ex.: `main`).
5. **Build Pack**: selecione **Dockerfile**.
   - O Coolify detecta o `Dockerfile` na raiz automaticamente.
   - **Porta exposta / Ports Exposes**: `80`.
6. **Domínio**: em **Domains**, informe o domínio/subdomínio desejado
   (ex.: `playbook.seudominio.com`). O Coolify provisiona HTTPS via Let's Encrypt
   automaticamente. Aponte o DNS desse domínio (registro A) para o IP da VPS antes.
7. Clique em **Deploy**.

## Verificação

- Acompanhe os logs do build na aba **Deployments**.
- Quando concluir, acesse o domínio configurado — deve abrir o playbook.
- O healthcheck do container confirma que o nginx respondeu na porta 80.

## Atualizações automáticas

- Habilite **Automatic Deployment** (webhook) no recurso para que cada `git push`
  na branch publicada gere um novo deploy.

## Testar localmente (opcional)

```bash
docker build -t playbook-wow .
docker run --rm -p 8080:80 playbook-wow
# Acesse http://localhost:8080
```
