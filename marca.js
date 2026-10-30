// =====================================================================
// Clic Redes - marca.js
// Versao 1.0 - 29/10/2026
// Escolha da empresa (E-Club, Remixinho...) no topo de todas as telas.
// A escolha fica guardada neste navegador e vale para todas as telas.
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
