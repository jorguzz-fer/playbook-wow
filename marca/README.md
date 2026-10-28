# Guia de Marca WOW+

Página aberta em `/marca/` (publicada junto com o playbook) com a aplicação da
marca e o download dos logos. Não exige login: foi criada porque nem todo mundo
que precisa dos arquivos tem acesso ao manual no Canva.

| Arquivo | O que é |
| --- | --- |
| `index.html` | A página do guia: versões do logo, área de proteção, cores, tipografia, fundos, usos incorretos, nome e tagline, tabela de arquivos. |
| `logos/*.png` | Logos em PNG com fundo transparente, em 1× e 2× (`@2x`). |
| `logos/wow-mais-logos.zip` | Pacote com todos os PNGs. |

## Versões disponíveis

| Arquivo | Versão |
| --- | --- |
| `wow-mais-logo-tagline-preto.png` | Principal (símbolo + logotipo + tagline), texto preto |
| `wow-mais-logo-tagline-branco.png` | Principal, texto branco |
| `wow-mais-logo-preto.png` | Reduzida (sem tagline), texto preto |
| `wow-mais-logo-branco.png` | Reduzida, texto branco |
| `wow-mais-logotipo-preto.png` | Só o logotipo `wow+`, preto |
| `wow-mais-logotipo-branco.png` | Só o logotipo `wow+`, branco (uso sobre laranja e fotos) |
| `wow-mais-simbolo.png` | Só o coração |

## Origem dos arquivos

Os PNGs foram extraídos das versões do logo já usadas no playbook, nas
propostas e nas peças de e-mail (as mesmas imagens embutidas em base64 nesses
arquivos). As variações de logotipo isolado e símbolo são recortes dessas
versões; a versão branca com tagline foi recuperada da imagem sobre fundo preto.

Não há vetor (SVG/AI) neste repositório. Para impressão em grande formato,
gravação ou bordado, peça o vetor ao time de marca e, quando ele existir,
adicione-o em `logos/` e na tabela da página.

## Cores de referência

| Nome | HEX | Uso |
| --- | --- | --- |
| Laranja WOW | `#F5821F` | Cor principal; mesma do `--orange` do playbook |
| Laranja profundo | `#F15500` | Início do degradê do símbolo (amostrado da imagem) |
| Laranja claro | `#FFAD4E` | Fim do degradê do símbolo (amostrado da imagem) |
| Laranja escuro | `#D4680A` | Hover e CTAs; `--orange-dark` do playbook |
| Vinho WOW | `#2A0D1C` | Fundo base das interfaces; `--wine-bg` |
| Vinho profundo | `#1E0A14` | Sidebar e tiles escuros; `--wine-deep` |

## Para atualizar

1. Substitua ou acrescente arquivos em `logos/`.
2. Regere o ZIP (qualquer ferramenta; mantenha a pasta `wow-mais-logos/` dentro dele).
3. Atualize os cards e a tabela em `index.html` e o atalho na página
   "Manual de Marca" do `playbook.html`.
