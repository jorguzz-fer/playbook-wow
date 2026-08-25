# Gerador de Propostas WOW+

Página interna em `propostas.wowmais.com.br/admin/`. A diretoria preenche os campos
que mudam de cliente para cliente e a página monta a proposta completa, no mesmo
layout da proposta-modelo (`/julio/ampro/`).

## Como usar

1. Abra `/admin/` e preencha as seis seções do formulário. A prévia ao lado
   atualiza sozinha e o rascunho fica salvo no navegador.
2. **Baixar index.html** gera o arquivo final da proposta.
3. Salve o arquivo em `propostas/<caminho>/index.html` no repositório (o caminho
   aparece na seção *Publicação*) e publique. A proposta passa a responder em
   `propostas.wowmais.com.br/<caminho>/`.
4. **Exportar JSON** guarda os dados preenchidos. Para revisar a proposta depois,
   use **Importar JSON** em vez de refazer tudo.

Sem publicar também funciona: o `index.html` baixado abre e imprime direto do
computador (o botão *Imprimir* do documento gera o PDF).

Convenções de digitação nos campos de texto:

| Escrita | Resultado |
| --- | --- |
| `*texto*` | **negrito** |
| `_texto_` | *itálico* (destaque em laranja no título da capa) |
| `Título \| Texto` | listas de dois campos (itens, passos, tabela de avulsos) |
| `Clínica Geral \| 24h` | especialidade com selo 24h |
| `Saúde Pet[cortesia]` | item do plano com o selo laranja "cortesia" |

O quadro de economia é calculado a partir do número de vidas e dos valores
"de"/"por" — não precisa somar nada à mão.

## Arquivos

- `index.html` — o gerador (formulário, prévia e exportação).
- `template.js` — a proposta-modelo com marcadores `{{TOKEN}}`. **Gerado por
  script, não edite à mão.**

## Quando a proposta-modelo mudar

O template sai da proposta publicada em `/julio/ampro/`. Depois de alterar o
layout dela, regenere:

```
python3 tools/build-proposal-template.py
```

O script falha se algum trecho esperado tiver sumido — nesse caso, ajuste as
regras dele antes de commitar. Campos novos que precisem virar formulário
também exigem um marcador novo no script e o campo correspondente em
`index.html`.
