# E-mail marketing · WOW+ para Empresas (NR-1)

Peça de e-mail marketing B2B para disparo pelo **Brevo**, apontando para
`https://wowmais.com.br/para-empresas`.

| Arquivo | O que é |
| --- | --- |
| `empresas-nr1.html` | Template HTML pronto para colar no Brevo (600px, tabelas, CSS inline). |
| `empresas-nr1.txt` | Versão texto puro (aba *Plain text* do Brevo). |
| `README.md` | Assuntos, preheaders, sequência de follow-up e checklist de disparo. |

Pré-visualização no navegador: `https://<dominio-do-playbook>/emailmkt/` (a peça é
publicada junto com o playbook, para aprovação interna antes do disparo).

---

## 1. Antes de disparar — checklist

- [ ] **Endereço físico** no rodapé (`[Endereço completo, cidade/UF, CEP]`) —
      exigência anti-spam e fator de entregabilidade. Razão social e CNPJ já
      estão preenchidos.
- [ ] **Wendy pronta para o volume**: o CTA principal joga todo mundo no
      WhatsApp `(11) 93624-2622`. Garanta que a agente esteja ativa e com o
      roteiro do diagnóstico antes do disparo — o e-mail chega de uma vez.
- [ ] **Preços e módulos** conferidos contra a página `/para-empresas` no ar.
      Os valores aqui (SMART R$ 19,90 · CARE+ R$ 24,90 · dependente R$ 9,90 ·
      NR-1 e Medicina Ocupacional sob consulta) vieram do playbook comercial e
      da proposta institucional deste repositório.
- [ ] **Domínio autenticado no Brevo** (SPF, DKIM e DMARC verdes em
      *Senders, Domains & Dedicated IPs*). Sem isso, disparo B2B frio cai em spam.
- [ ] **Base**: só empresas com base legal de contato (LGPD — interesse
      legítimo B2B ou opt-in). Nada de lista comprada.
- [ ] **Teste de renderização**: envie para Gmail, Outlook desktop, Outlook web
      e iPhone antes de escalar.

## 2. Para onde vai cada clique

| Elemento | Destino |
| --- | --- |
| Botão principal — *Quero meu diagnóstico no WhatsApp* | `wa.me/5511936242622`, com mensagem pré-preenchida. Atende a **Wendy, agente de IA da WOW+**. |
| *Conheça o WOW+ para Empresas* (link secundário) | `wowmais.com.br/para-empresas` com UTM `utm_content=link-pagina`. |
| WhatsApp no fim do corpo | mesmo número da Wendy, para quem prefere salvar o contato. |

O e-mail declara que a Wendy é uma agente de IA. Manter isso explícito evita a
sensação de ter sido enganado quando o lead percebe — e, em B2B, "responde na
hora, a qualquer horário" é argumento a favor, não desculpa.

## 3. Assuntos e preheaders (para teste A/B)

O Brevo permite testar 2 assuntos por campanha. Rode **A vs. B** primeiro; o
vencedor vira controle e enfrenta o próximo.

| # | Assunto | Preheader |
| --- | --- | --- |
| A | A NR-1 já está valendo — e a fiscalização não avisa antes | Médico 24h para o time e as evidências que o RH precisa ter. |
| B | Sua empresa tem evidências documentadas dos riscos psicossociais? | 90% das empresas ainda respondem que não. Diagnóstico gratuito em 15 min. |
| C | Saúde 24h para o seu time por R$ 19,90 por vida | Sem carência, com painel de gestão para o RH e adequação à NR-1. |
| D | {{ contact.EMPRESA }}: o benefício de saúde que também resolve a NR-1 | Clínico Geral e Pediatria 24h + gestão de riscos psicossociais. |
| E | Ninguém compra extintor porque pegou fogo ontem | A hora de se preparar para a NR-1 é antes da fiscalização. |
| F | Quanto da sua equipe hoje está sem nenhuma assistência médica? | Cobrir a população descoberta a partir de R$ 19,90 por vida/mês. |

> O assunto D só funciona se o atributo `EMPRESA` estiver preenchido para
> **todos** os contatos do segmento — senão use `{{ contact.EMPRESA | default : "Sua empresa" }}`.

**Remetente sugerido:** `Equipe Comercial WOW+ <comercial@wowmais.com.br>`
com *reply-to* em uma caixa monitorada. Evite `no-reply`: resposta de e-mail é
um dos melhores sinais de conversão em B2B.

## 4. Personalização usada no template

| Tag | Onde aparece | Observação |
| --- | --- | --- |
| `{{ contact.FIRSTNAME \| default : "tudo bem" }}` | saudação | vira "Olá, tudo bem!" quando o nome não existe |
| `{{ mirror }}` | topo | link "Abra no navegador" |
| `{{ unsubscribe }}` | rodapé | obrigatório |
| `{{ update_profile }}` | rodapé | opcional, remova se não usar |

## 5. Segmentação sugerida

A efetividade dos argumentos muda com o porte (ver `estudo-b2b.html`). Se a base
tiver o atributo de número de colaboradores, crie três segmentos:

| Segmento | Argumento que puxa | Assunto sugerido |
| --- | --- | --- |
| 10–49 colaboradores | Conformidade NR-1 (alta efetividade) | A ou E |
| 50–500 colaboradores | Economia e custo por vida | C ou F |
| 500+ colaboradores | Cuidado com o time e tecnologia integrada | B ou D |

Se ainda não houver esse dado, dispare o assunto A para toda a base e use a
resposta para enriquecer os atributos.

## 6. Sequência de follow-up (automação no Brevo)

Fluxo *"Empresas · NR-1"* com entrada pela lista do disparo e saída ao clicar no
CTA ou responder.

**E-mail 2 — D+3, para quem abriu e não clicou**
> Assunto: O mapa do que a fiscalização vai pedir
>
> {{ contact.FIRSTNAME | default : "Olá" }}, no diagnóstico a gente monta o mapa
> do que a empresa precisa apresentar sobre riscos psicossociais — e onde estão
> as lacunas hoje. São 15 minutos, sem compromisso e o relatório fica com você.
> [Quero o diagnóstico gratuito]

**E-mail 3 — D+7, para quem não abriu (reenvio com outro assunto)**
> Assunto: Quantos do seu time ficam sem assistência médica?
>
> A conta que quase toda empresa faz errado: colaborador sem plano não é
> colaborador sem custo. Ele falta, atrasa e chega ao pronto-socorro tarde.
> A partir de R$ 19,90 por vida/mês, todo mundo passa a ter Clínico Geral e
> Pediatria 24h, sem carência. [Ver como funciona]

**E-mail 4 — D+12, quebra de objeção**
> Assunto: "Já temos convênio" / "já temos clínica"
>
> Os dois casos continuam funcionando. A WOW+ complementa o convênio (cobre quem
> fica de fora e reduz uso desnecessário do pronto-atendimento) e a clínica
> continua executando o presencial — a WOW+ entra na gestão: ASO, NR-1 e o painel
> do RH em um parceiro só. Faz sentido avaliarmos um piloto?
> [Falar no WhatsApp]

**E-mail 5 — D+20, última chamada**
> Assunto: Fecho o diagnóstico de {{ contact.EMPRESA | default : "vocês" }}?
>
> Curto, direto, com o WhatsApp da Wendy em destaque. Quem não interagir em
> nenhum dos cinco sai do fluxo e volta só na próxima campanha.

## 7. Como subir no Brevo

1. **Campaigns → Email → Create an email campaign** → escolha *Rich text /
   Paste your code* (editor **Custom HTML**).
2. Cole o conteúdo de `empresas-nr1.html` inteiro (o `<head>` com o `<style>`
   precisa ir junto — é ele que faz o mobile empilhar os cards de plano).
3. Na aba de conteúdo, cole `empresas-nr1.txt` em *Plain text version*.
4. Preencha assunto e preheader com um dos pares da seção 2.
5. Ative o rastreamento de cliques do Brevo. O link da página carrega UTMs
   (`utm_campaign=empresas-nr1`), mas o **`wa.me` não aceita UTM** — o clique no
   botão principal é medido só pelo rastreamento do Brevo. Para saber quantas
   conversas viraram oportunidade, cruze com o relatório da Wendy.
6. **Send a test email** para os clientes da checklist. Confira especialmente o
   botão laranja no Outlook desktop (ele usa VML) e o rodapé no modo escuro.
7. Agende: terça a quinta, entre 9h e 11h, costuma render mais em B2B.

## 8. Onde cada informação foi buscada

Todo o conteúdo veio deste repositório — `playbook.html` (Canal 2 · Corporativo
B2B, tabela de produtos e objeções), `propostas/ciro-gomes/index.html` (proposta
institucional, o que está incluído e disclaimers) e `estudo-b2b.html` (a
descoberta de que **diagnóstico gratuito converte mais que venda direta**, que é
a razão do CTA ser diagnóstico e não proposta).

O acesso a `wowmais.com.br` está bloqueado pelo proxy de rede do ambiente em que
esta peça foi montada, então a página `/para-empresas` **não foi lida**. Antes do
disparo, confira headline, preços e nomes dos planos contra a página no ar — se
divergirem, o e-mail é que deve ser ajustado.
