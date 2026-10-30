// =====================================================================
// Clic Redes - marca.js
// Versao 1.1 - 30/10/2026 (jeito de aplicativo no celular)
// Escolha da empresa (E-Club, Remixinho...) no topo de todas as telas.
// A escolha fica guardada neste navegador e vale para todas as telas.
// No celular: topo fixo e compacto + barra de botoes embaixo, como app.
// =====================================================================
window.ClicMarca = {
  lista: [],
  atual: null,

  async carregar(sb) {
    const { data } = await sb.from("marcas").select("id, nome").order("criado_em");
    this.lista = data || [];
    let salvo = null;
    try { salvo = localStorage.getItem("clicredes_marca"); } catch (_) { /* sem armazenamento */ }
    this.atual = this.lista.find((m) => m.id === salvo) || this.lista[0] || null;
    this.desenhar();
    return this.atual;
  },

  escolher(id) {
    try { localStorage.setItem("clicredes_marca", id); } catch (_) { /* sem armazenamento */ }
  },

  desenhar() {
    if (!this.lista.length) return;
    const sair = document.getElementById("sair");
    if (!sair || document.getElementById("seletorMarca")) return;
    const sel = document.createElement("select");
    sel.id = "seletorMarca";
    sel.setAttribute("aria-label", "Empresa");
    sel.style.cssText = "margin-left:auto;margin-right:10px;font:inherit;font-size:14px;font-weight:600;" +
      "padding:7px 10px;border:1px solid #dde3e8;border-radius:8px;background:#fff;color:#14212b;max-width:200px";
    for (const m of this.lista) {
      const o = document.createElement("option");
      o.value = m.id;
      o.textContent = m.nome;
      if (this.atual && m.id === this.atual.id) o.selected = true;
      sel.appendChild(o);
    }
    const nova = document.createElement("option");
    nova.value = "__nova";
    nova.textContent = "+ Nova empresa";
    sel.appendChild(nova);
    sel.addEventListener("change", () => {
      if (sel.value === "__nova") { location.href = "contas.html?nova=1"; return; }
      this.escolher(sel.value);
      location.reload();
    });
    sair.parentNode.insertBefore(sel, sair);
    sair.style.marginLeft = "0";
  },
};

// ---------------------------------------------------------------------
// Celular: aparencia de aplicativo
// ---------------------------------------------------------------------
(function () {
  // Icone e cor para "Adicionar a tela inicial"
  const head = document.head;
  const meta = (nome, valor) => {
    if (head.querySelector(`meta[name="${nome}"]`)) return;
    const m = document.createElement("meta");
    m.name = nome; m.content = valor; head.appendChild(m);
  };
  meta("theme-color", "#0f766e");
  meta("apple-mobile-web-app-capable", "yes");
  meta("mobile-web-app-capable", "yes");
  meta("apple-mobile-web-app-status-bar-style", "default");
  meta("apple-mobile-web-app-title", "Clic Redes");
  if (!head.querySelector('link[rel="apple-touch-icon"]')) {
    const l = document.createElement("link");
    l.rel = "apple-touch-icon"; l.href = "icone-app.png"; head.appendChild(l);
    const f = document.createElement("link");
    f.rel = "icon"; f.type = "image/png"; f.href = "icone-app.png"; head.appendChild(f);
  }
  const vp = head.querySelector('meta[name="viewport"]');
  if (vp && !vp.content.includes("viewport-fit")) vp.content += ", viewport-fit=cover";

  const css = `
  .barra-app{display:none}
  @media (max-width:760px){
    header{position:sticky;top:0;z-index:15;padding-top:env(safe-area-inset-top)}
    header .topo{flex-wrap:nowrap!important;gap:8px!important;padding:10px 14px!important}
    header .logo{font-size:16px!important;gap:7px!important;flex:none}
    header .logo span{width:28px!important;height:28px!important}
    header nav{display:none!important}
    #seletorMarca{flex:1;min-width:0;max-width:none!important;margin:0 0 0 6px!important;padding:7px 8px!important}
    header .sair{margin-left:0!important;padding:7px 9px!important;font-size:0!important;flex:none}
    header .sair::before{content:"\\f2f5";font:900 15px "Font Awesome 6 Free"}
    main{padding:16px 14px calc(84px + env(safe-area-inset-bottom))!important}
    footer{padding-bottom:calc(84px + env(safe-area-inset-bottom))!important}
    .barra-app{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:16;background:#fff;
      border-top:1px solid #dde3e8;padding:6px 4px calc(6px + env(safe-area-inset-bottom));
      box-shadow:0 -4px 16px rgba(16,24,40,.06)}
    .barra-app a{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px;
      color:#5b6b78;text-decoration:none;font-size:11px;font-weight:600;border-radius:10px;
      -webkit-tap-highlight-color:transparent}
    .barra-app a i{font-size:19px;line-height:1}
    .barra-app a.ativo{color:#0f766e}
    .barra-app a.ativo i{background:#e6f4f2;border-radius:999px;padding:5px 16px;margin:-5px 0 -2px}
    body{-webkit-text-size-adjust:100%}
    h1{font-size:20px!important}

    /* Contas */
    .conectar .btn{flex:1 1 calc(50% - 10px);justify-content:center;font-size:13px;padding:11px 8px}
    .conta{flex-wrap:wrap;gap:10px 12px!important}
    .conta .info{flex:1 1 calc(100% - 64px)}
    .conta .selo{margin-left:58px}
    .conta .mover{flex:1;max-width:none}

    /* Planejamento */
    .barra .grupo{flex:none}
    .barra .periodo{min-width:0;flex:1 1 100%;order:5}
    #novo{position:fixed;right:16px;bottom:calc(78px + env(safe-area-inset-bottom));z-index:14;
      border-radius:999px;padding:14px 18px;box-shadow:0 6px 18px rgba(15,118,110,.35)}
    .lista{overflow-x:auto}
    .fundo-modal{padding:0!important;align-items:stretch!important}
    .modal{max-width:none!important;min-height:100%;border-radius:0!important;padding:18px 16px calc(24px + env(safe-area-inset-bottom))!important}

    /* Metricas */
    .kpi{padding:12px 14px}
    .kpi .valor{font-size:22px}
    .bloco{padding:14px}
    .barra select{flex:1 1 100%}

    /* Caixa de entrada */
    .caixa{grid-template-columns:minmax(0,1fr)!important;height:calc(100dvh - 225px - env(safe-area-inset-bottom))!important;min-height:360px!important}
    .lado{border-right:0!important}
    .filtros .linha>*{min-width:0}
    .filtros .linha select{flex:0 0 40%}
    .responder textarea{font-size:16px}
    textarea,input,select{font-size:16px}
  }`;
  const st = document.createElement("style");
  st.textContent = css;
  head.appendChild(st);

  // Barra de baixo com os mesmos links do menu de cima
  function montarBarra() {
    if (document.querySelector(".barra-app")) return;
    const nav = document.querySelector("header nav");
    if (!nav) return;
    const icones = {
      "planejamento.html": "fa-calendar-days",
      "metricas.html": "fa-chart-simple",
      "caixa.html": "fa-inbox",
      "contas.html": "fa-user-gear",
    };
    const curto = { "Caixa de entrada": "Caixa", "Planejamento": "Agenda" };
    const barra = document.createElement("nav");
    barra.className = "barra-app";
    barra.setAttribute("aria-label", "Menu");
    for (const a of nav.querySelectorAll("a")) {
      const href = a.getAttribute("href") || "";
      const nome = a.textContent.trim();
      const novo = document.createElement("a");
      novo.href = href;
      if (a.classList.contains("ativo")) novo.className = "ativo";
      novo.innerHTML = `<i class="fa-solid ${icones[href] || "fa-circle"}"></i><span>${curto[nome] || nome}</span>`;
      barra.appendChild(novo);
    }
    document.body.appendChild(barra);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarBarra);
  else montarBarra();
})();

