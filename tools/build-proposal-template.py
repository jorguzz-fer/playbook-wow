#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera propostas/admin/template.js a partir da proposta-modelo.

O modelo é a proposta publicada em /julio/ampro/. Este script troca os trechos
que variam de cliente para cliente por marcadores {{TOKEN}} e grava o resultado
como uma string JS (window.WOW_TEMPLATE), consumida pelo gerador em /admin/.

Uso:
    python3 tools/build-proposal-template.py

Quando a proposta-modelo mudar de layout, rode de novo e confira o diff de
template.js. Se algum trecho esperado sumir, o script falha com erro em vez de
gerar um template silenciosamente incompleto.
"""

import json
import os
import re
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.join(BASE, "..")
MODELO = os.path.join(RAIZ, "propostas", "julio", "ampro", "index.html")
SAIDA = os.path.join(RAIZ, "propostas", "admin", "template.js")


class Editor:
    """Aplica substituições no HTML, falhando alto quando o alvo não existe."""

    def __init__(self, texto):
        self.texto = texto
        self.aplicadas = 0

    def troca(self, alvo, novo, vezes=1):
        achadas = self.texto.count(alvo)
        if achadas != vezes:
            raise SystemExit(
                "trecho esperado %d vez(es), encontrado %d:\n%s"
                % (vezes, achadas, alvo[:220])
            )
        self.texto = self.texto.replace(alvo, novo)
        self.aplicadas += 1

    def troca_re(self, padrao, novo, vezes=1, flags=0):
        achadas = len(re.findall(padrao, self.texto, flags))
        if achadas != vezes:
            raise SystemExit(
                "padrão esperado %d vez(es), encontrado %d: %s"
                % (vezes, achadas, padrao)
            )
        self.texto = re.sub(padrao, novo, self.texto, flags=flags)
        self.aplicadas += 1


def main():
    with open(MODELO, encoding="utf-8") as fh:
        html = fh.read()

    # As logos vêm embutidas em base64. O alfabeto base64 inclui letras
    # maiúsculas, dígitos e "/", então "AMPRO" ou "19/08/2026" podem aparecer
    # dentro delas por acaso. Guarda as data URIs antes de qualquer troca
    # global e devolve no fim.
    guardadas = []

    def guarda(m):
        guardadas.append(m.group(0))
        return "\x00DATAURI%d\x00" % (len(guardadas) - 1)

    html = re.sub(r'data:image/[^"]+', guarda, html)
    if not guardadas:
        raise SystemExit("nenhuma logo base64 encontrada — modelo mudou?")

    ed = Editor(html)

    # ---------- <head> ----------
    ed.troca_re(
        r'<meta name="description" content="[^"]*">',
        '<meta name="description" content="{{META_DESC}}">',
    )
    ed.troca_re(
        r'<meta property="og:description" content="[^"]*">',
        '<meta property="og:description" content="{{META_DESC}}">',
    )
    ed.troca_re(
        r'<meta property="og:url" content="[^"]*">',
        '<meta property="og:url" content="{{PROPOSAL_URL}}">',
    )

    # ---------- toolbar ----------
    ed.troca_re(
        r'<a class="btn btn-pdf".*?</a>',
        "{{PDF_BUTTON}}",
        flags=re.DOTALL,
    )

    # ---------- capa ----------
    ed.troca_re(r"<h1>.*?</h1>", "<h1>{{COVER_TITLE}}</h1>", flags=re.DOTALL)
    ed.troca_re(
        r'<p class="sub">.*?</p>',
        '<p class="sub">{{COVER_SUB}}</p>',
        flags=re.DOTALL,
    )
    ed.troca_re(
        r'<div class="care">Aos cuidados de<br>.*?</div>',
        '<div class="care">Aos cuidados de<br><b>{{RECIPIENT}}</b> — {{RECIPIENT_ROLE}}<br>\n'
        '        <span style="color:#B99AA6;">{{ENTITY_FULL}}</span></div>',
        flags=re.DOTALL,
    )
    ed.troca("19 de agosto de 2026", "{{DATE_LONG}}")

    # ---------- página 2 ----------
    ed.troca_re(
        r'<p class="lead">.*?</p>',
        '<p class="lead">{{LEAD}}</p>',
        flags=re.DOTALL,
    )
    ed.troca_re(
        r'<div class="vlist">.*?</div>\n      </div>',
        '<div class="vlist">\n{{WHY_ITEMS}}      </div>',
        flags=re.DOTALL,
    )
    ed.troca_re(
        r'<ul class="inc">.*?</ul>',
        '<ul class="inc">\n{{INCLUDED}}      </ul>',
        flags=re.DOTALL,
    )
    ed.troca("12 frentes de atendimento já aprovadas e disponíveis:", "{{CHIPS_INTRO}}")
    ed.troca_re(
        r'<div class="chips">.*?</div>',
        '<div class="chips">\n{{CHIPS}}      </div>',
        flags=re.DOTALL,
    )

    # ---------- página 3 · oferta ----------
    ed.troca_re(
        r'<p class="body muted" style="margin-bottom:11px;">.*?</p>',
        '<p class="body muted" style="margin-bottom:11px;">{{OFFER_INTRO}}</p>',
        flags=re.DOTALL,
    )
    ed.troca_re(
        r'<span class="hero-pill">.*?</span>',
        '<span class="hero-pill">{{PLAN_PILL}}</span>',
        flags=re.DOTALL,
    )
    ed.troca_re(r"<h3>.*?</h3>", "<h3>{{PLAN_NAME}}</h3>", flags=re.DOTALL)
    ed.troca_re(
        r'<div class="hero-price">.*?</div>',
        '<div class="hero-price">{{PRICE_FROM}}<span class="to">{{PRICE_TO}}</span>'
        '<span class="unit">{{PRICE_UNIT}}</span></div>',
        flags=re.DOTALL,
    )
    ed.troca_re(
        r'<div class="hero-grid">.*?</div>',
        '<div class="hero-grid">\n{{PLAN_FEATS}}        </div>',
        flags=re.DOTALL,
    )
    # O quadro de economia é opcional: entra logo depois das features.
    ed.troca(
        "{{PLAN_FEATS}}        </div>\n      </div>",
        "{{PLAN_FEATS}}        </div>\n{{SAVINGS_BLOCK}}      </div>",
    )
    ed.troca_re(
        r'<p class="body muted" style="margin:11px 0 0;">.*?</p>',
        '<p class="body muted" style="margin:11px 0 0;">{{TERMS}}</p>',
        flags=re.DOTALL,
    )
    ed.troca_re(
        r"\n *<!-- BLOCO OPCIONAL.*?<div class=\"courtesy\">.*?</div>",
        "{{COURTESY_BLOCK}}",
        flags=re.DOTALL,
    )

    # ---------- página 4 · adicionais e adesão ----------
    ed.troca_re(
        r'<p class="body muted" style="margin:-2px 0 9px;">Além.*?</p>',
        '<p class="body muted" style="margin:-2px 0 9px;">{{ADDONS_INTRO}}</p>',
        flags=re.DOTALL,
    )
    ed.troca_re(
        r'<table class="add">.*?</table>',
        '<table class="add">\n'
        '        <tr><th>Serviço</th><th class="r">{{ADDONS_COL}}</th></tr>\n'
        "{{ADDONS_ROWS}}      </table>",
        flags=re.DOTALL,
    )
    ed.troca_re(
        r'<div class="steps">.*?</div>\n      </div>',
        '<div class="steps">\n{{STEPS}}      </div>',
        flags=re.DOTALL,
    )
    ed.troca_re(
        r'<div class="t">.*?</div>', '<div class="t">{{CTA_TEXT}}</div>', flags=re.DOTALL
    )
    ed.troca_re(
        r'<div class="contact">.*?</div>',
        '<div class="contact"><b>Equipe Comercial WOW+</b>\n'
        '        <span style="color:var(--orange);">wowmais.com.br</span><br>\n'
        "        <span>{{CONTACT}}</span>\n      </div>",
        flags=re.DOTALL,
    )
    ed.troca_re(
        r'<p class="fineprint">.*?</p>',
        '<p class="fineprint">{{FINEPRINT}}</p>',
        flags=re.DOTALL,
    )

    # ---------- trocas globais ----------
    # Data curta dos rodapés e sigla da entidade (toolbar, cabeçalhos, rodapés).
    ed.troca("19/08/2026", "{{DATE_SHORT}}", vezes=3)
    if "AMPRO" not in ed.texto:
        raise SystemExit("nenhuma ocorrência de AMPRO sobrou — modelo mudou?")
    ed.texto = ed.texto.replace("AMPRO", "{{ENTITY_SHORT}}")

    # Devolve as data URIs guardadas.
    texto = re.sub(
        r"\x00DATAURI(\d+)\x00", lambda m: guardadas[int(m.group(1))], ed.texto
    )

    faltando = [t for t in ("{{ENTITY_SHORT}}", "{{DATE_LONG}}", "{{PLAN_FEATS}}") if t not in texto]
    if faltando:
        raise SystemExit("marcadores ausentes no resultado: %s" % ", ".join(faltando))

    with open(SAIDA, "w", encoding="utf-8") as fh:
        fh.write("// Gerado por build-template.py a partir de /julio/ampro/index.html.\n")
        fh.write("// Não edite à mão: altere a proposta-modelo e rode o script de novo.\n")
        fh.write("window.WOW_TEMPLATE = %s;\n" % json.dumps(texto, ensure_ascii=False))

    print(
        "template.js gerado — %d substituições, %d marcadores, %d KB"
        % (ed.aplicadas, len(set(re.findall(r"\{\{[A-Z_]+\}\}", texto))), len(texto) // 1024)
    )


if __name__ == "__main__":
    sys.exit(main())
