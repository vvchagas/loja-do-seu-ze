// ========== ESTADO DA APLICAÇÃO ==========
const appState = {
  currentPage: "perfil",
  previousPage: null,
  userData: {
    name: "José Silva",
    email: "lojadoze@gmail.com",
    username: "@seuze",
    phone: "(11) 99999-9999",
    address: "Rua das Flores, 123 - Centro, São Paulo/SP",
    registrationDate: "15/12/2024",
    ordersCount: 15,
    paymentsCount: 8,
    rating: 4.8,
    debtCount: 2,
  },
    addresses: [
    // ...existing code...
  ],
  debts: [
    // ...existing code...
  ],
  // === Ajuste: orders com a estrutura esperada (items, status, value, date) ===
  orders: [
    {
      id: 1,
      date: "10/12/2024",
      items: ["Pastel de queijo"],
      value: "25,00",
      status: "delivered",
      dueDate: "17/12/2024"
    },
    {
      id: 2,
      date: "05/01/2025",
      items: ["Coxinha", "Refrigerante"],
      value: "18,50",
      status: "shipping",
      dueDate: ""
    }
  ],
};

// ====================== Sincronização fiados_db + Juros ======================
// Chave unificada no localStorage
const FIADOS_KEY = 'fiados_db';

// Ler DB
function readFiadosDB(){
  try {
    return JSON.parse(localStorage.getItem(FIADOS_KEY) || '[]');
  } catch(e){
    console.error('Erro lendo fiados_db:', e);
    return [];
  }
}

// Escrever DB
function writeFiadosDB(data){
  try {
    localStorage.setItem(FIADOS_KEY, JSON.stringify(data || []));
  } catch(e){
    console.error('Erro gravando fiados_db:', e);
  }
}

// Parse data BR (DD/MM/YYYY) -> Date
function parseBrDate(ddmmyyyy){
  if(!ddmmyyyy) return null;
  const parts = String(ddmmyyyy).split('/');
  if(parts.length < 3) return null;
  const d = parseInt(parts[0],10), m = parseInt(parts[1],10)-1, y = parseInt(parts[2],10);
  return new Date(y, m, d);
}

// Formatar número -> string com vírgula
function fmtMoneyBr(num){
  if (num === null || num === undefined || Number.isNaN(Number(num))) return "0,00";
  return Number(num).toFixed(2).replace('.', ',');
}

// Aplica multa 2% + juros diário 0.5% (modelo A)
// Mantém campo `value` como string com vírgula para compatibilidade com UI
function aplicarJurosAtraso(item){
  if(!item) return;
  // Determinar data de vencimento: checar dueDate, vencimento, dataVenc (variações)
  const vencStr = item.dueDate || item.vencimento || item.dataVenc || item.due || item.date;
  const vencDate = parseBrDate(vencStr);
  if(!vencDate) {
    // Se sem data, garantimos que value é coerente
    if(typeof item.value === 'number') item.value = fmtMoneyBr(item.value);
    return;
  }

  // Valor original (número)
  let valorNum;
  if(item.valorOriginal !== undefined && item.valorOriginal !== null){
    valorNum = Number(item.valorOriginal);
  } else {
    // item.value pode estar no formato "12,34"
    const raw = (typeof item.value === 'string') ? item.value.replace('.', '').replace(',', '.') : item.value;
    valorNum = parseFloat(raw) || 0;
    // salvar original numérico para referência futura
    item.valorOriginal = Number(valorNum);
  }

  const hoje = new Date();
  // calcular diferença em dias inteiros (sem horário)
  const diffMs = hoje.setHours(0,0,0,0) - vencDate.setHours(0,0,0,0);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if(diffDays > 0 && String(item.status).toLowerCase() !== 'pago'){
    const multa = valorNum * 0.02; // 2%
    const juros = valorNum * (0.005 * diffDays); // 0.5% por dia
    const novo = valorNum + multa + juros;
    item.value = fmtMoneyBr(novo); // guardamos string compatível com UI
    item.atrasoDias = diffDays;
    item.status = 'atrasado';
  } else {
    // sem atraso: manter valor original formatado
    item.value = fmtMoneyBr(valorNum);
    item.atrasoDias = 0;
    // se estava marcado como atrasado mas agora não, reverter status (se necessário)
    if(String(item.status).toLowerCase() === 'atrasado' && diffDays <= 0){
      item.status = item.statusOriginal || item.status || 'pendente';
    }
  }
}

// Sincroniza DB -> appState.debts aplicando juros
function syncFiadosToState(){
  const db = readFiadosDB();
  // aplicar juros em cada item (não sobrescrever valorOriginal)
  db.forEach(item => aplicarJurosAtraso(item));
  // gravar alterações (juros/status) no DB
  writeFiadosDB(db);
  // atualizar appState.debts sem alterar UI (mantemos mesmo formato)
  appState.debts = db;
}

// Cria/atualiza DB quando appState.debts for alterado
function saveStateDebtsToDB(){
  // garantir que appState.debts tem formato compatível
  const arr = Array.isArray(appState.debts) ? appState.debts : [];
  writeFiadosDB(arr);
}

// ====================== Inicialização ======================
document.addEventListener("DOMContentLoaded", () => {
  // Sincronizar dados iniciais de fiados antes de atualizar UI
  syncFiadosToState();
  carregarPagamentosDoDB();
  atualizarDadosUsuario();
  setupEventListeners();
});

// ========== SETUP DE EVENT LISTENERS ==========
function setupEventListeners() {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".back-btn") && !e.target.closest(".back-btn").onclick) {
      voltarParaPerfil();
    }
  });
}

// ========== NAVEGAÇÃO ==========
function carregarConteudo(pagina) {
  const profileContent = document.getElementById("profile-content");
  const contentArea = document.getElementById("dynamic-content");
  const backBtn = document.querySelector(".back-btn");
  const pageTitle = document.getElementById("page-title");

  if (!contentArea || !profileContent || !backBtn) return;

  contentArea.innerHTML = "";
  contentArea.classList.add("active-content");
  backBtn.style.display = "flex";
  profileContent.style.display = "none";

  switch (pagina) {
    case "meus-pagamentos":
      pageTitle.textContent = "Meus Pagamentos";
      carregarMeusPagamentos();
      break;
    case "enderecos":
      pageTitle.textContent = "Meus Endereços";
      carregarEnderecos();
      break;
    case "dividas":
      pageTitle.textContent = "Minhas Dívidas";
      carregarDividas();
      break;
    default:
      voltarParaPerfil();
      return;
  }

  appState.previousPage = appState.currentPage;
  appState.currentPage = pagina;
}

function voltarParaPerfil() {
  const profileContent = document.getElementById("profile-content");
  const contentArea = document.getElementById("dynamic-content");
  const backBtn = document.querySelector(".back-btn");

  if (!profileContent || !contentArea || !backBtn) return;

  profileContent.style.display = "block";
  contentArea.classList.remove("active-content");
  contentArea.innerHTML = "";
  const pageTitleEl = document.getElementById("page-title");
  if (pageTitleEl) pageTitleEl.textContent = "Meu Perfil";
  backBtn.style.display = "none";
  appState.currentPage = "perfil";
}

// ========== ATUALIZAÇÃO DE DADOS ==========
function atualizarDadosUsuario() {
  try {
    document.getElementById("user-name").textContent = appState.userData.name;
    document.getElementById("user-email").textContent = appState.userData.email;
    document.getElementById("user-username").textContent = `@${appState.userData.username.replace("@", "")}`;
    document.getElementById("user-phone").textContent = `Telefone: ${appState.userData.phone}`;
    document.getElementById("user-address").textContent = appState.userData.address;
    document.getElementById("user-email-info").textContent = appState.userData.email;
    document.getElementById("user-registration").textContent = `Data de Cadastro: ${appState.userData.registrationDate}`;
    document.getElementById("orders-count").textContent = appState.userData.ordersCount;
    document.getElementById("payments-count").textContent = appState.userData.paymentsCount;
    document.getElementById("rating-value").textContent = `⭐ ${appState.userData.rating.toFixed(1)}`;
  } catch (error) {
    console.error("Erro ao atualizar dados do usuário:", error);
  }
}

// ========== NOTIFICAÇÕES ==========
function mostrarNotificacao(mensagem, tipo = "success") {
  const notification = document.getElementById("notification");
  if (!notification) return;

  notification.textContent = mensagem;
  notification.className = `notification show ${tipo}`;

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3500);
}

// ========== FUNÇÕES UTILITÁRIAS ==========
function getStatusInfo(status) {
  const statusMap = {
    delivered: { text: "Entregue", class: "status-delivered" },
    shipping: { text: "Em Transporte", class: "status-shipping" },
    pending: { text: "Pendente", class: "status-pending" },
    cancelled: { text: "Cancelado", class: "status-cancelled" }
  };
  return statusMap[status] || { text: "Desconhecido", class: "" };
}

function criarEmptyState(icone, titulo, descricao, botao = null) {
  let html = `
    <div class="empty-state">
      <i class="${icone}"></i>
      <h3>${titulo}</h3>
      <p>${descricao}</p>
  `;

  if (botao) {
    html += `<button class="btn btn-primary" onclick="${botao.acao}"><i class="${botao.icone}"></i> ${botao.texto}</button>`;
  }

  html += `</div>`;
  return html;
}



// ========== MEUS PAGAMENTOS ==========
function calcularJurosPagamento(dueDate, valorOriginal, taxaJurosDia = 0.01) {
  if (!dueDate || typeof dueDate !== "string" || dueDate.trim() === "" || !dueDate.includes("/")) {
    return parseFloat(String(valorOriginal).replace(",", ".") || "0");
  }
  const hoje = new Date();
  const partesData = dueDate.split("/");
  const dataVencimento = new Date(partesData[2], partesData[1] - 1, partesData[0]);
  if (hoje <= dataVencimento) {
    return parseFloat(String(valorOriginal).replace(",", ".") || "0");
  }
  const diffTime = hoje - dataVencimento;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const valorNum = parseFloat(String(valorOriginal).replace(",", ".") || "0");
  const juros = valorNum * taxaJurosDia * diffDays;
  return valorNum + juros;
}

// ========== MEUS PAGAMENTOS ==========
function carregarMeusPagamentos() {
  const contentArea = document.getElementById("dynamic-content");
  if (!contentArea) return;

  let paymentsHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2><i class="fas fa-credit-card"></i> Meus Pagamentos</h2>
      <button class="add-btn" onclick="novoPagamento()"><i class="fas fa-plus"></i> Adicionar</button>
    </div>
  `;

  if (!Array.isArray(appState.payments) || appState.payments.length === 0) {
    paymentsHTML += criarEmptyState(
      "fas fa-credit-card",
      "Nenhum pagamento registrado",
      "Você ainda não tem pagamentos registrados."
    );
  } else {
    // soma total dos pagamentos já com juros calculados
    const totalPagamentos = appState.payments.reduce((total, payment) => {
      return total + calcularJurosPagamento(payment.dueDate, payment.value);
    }, 0);

    paymentsHTML += `
      <div class="info-section" style="background: #e0f7fa; border-left: 4px solid #00796b; margin-bottom: 16px;">
        <strong style="color: #004d40;">Total de Pagamentos Realizados: R$ ${totalPagamentos.toFixed(2).replace(".", ",")}</strong>
      </div>
    `;

    appState.payments.forEach((payment) => {
      const valorComJuros = calcularJurosPagamento(payment.dueDate, payment.value);
      paymentsHTML += `
        <div class="payment-item">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style=" padding: 10px">
              <strong><i class="fas fa-box"></i> ${payment.product}</strong>
              <p>Data: ${payment.date}</p>
              <p>Vencimento: <span style="color: #00796b; font-weight: bold;">${payment.dueDate || "—"}</span></p>
              <p>Valor Original: R$ ${payment.value}</p>
          </div>
        </div>
      `;
    });
  }

  contentArea.innerHTML = paymentsHTML;
}
function carregarPagamentosDoDB() {
  const db = JSON.parse(localStorage.getItem('meus_pagamentos_db') || '[]');
  // Se houver dados no banco, substitui ou mescla com o appState
  if (db.length > 0) {
    appState.payments = db;
  }
}

function novoPagamento() {
  const contentArea = document.getElementById("dynamic-content");
  let modalHTML = `
    <button class="btn btn-secondary" onclick="carregarMeusPagamentos()" style="margin-bottom:20px;">
      <i class="fas fa-arrow-left"></i> Voltar
    </button>
    <h2><i class="fas fa-plus"></i> Adicionar um novo pagamento</h2>
    <form onsubmit="salvarNovaFatura(event)" class="form-style">
      <div class="form-group">
        <label for="produto-fatura"><i class="fas fa-box"></i> Produto/Serviço</label>
        <input type="text" id="produto-fatura" required placeholder="Ex: Pastel de queijo">
      </div>
      <div class="form-group">
        <label for="valor-fatura"><i class="fas fa-money-bill"></i> Valor</label>
        <input type="number" id="valor-fatura" required placeholder="0.00" step="0.01" min="0">
      </div>
      <div class="form-group">
        <label for="forma-pagamento"><i class="fas fa-credit-card"></i> Forma de Pagamento</label>
        <select id="forma-pagamento" required>
          <option value="">Selecione...</option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
          <option value="pix">PIX</option>
          <option value="dinheiro">Dinheiro</option>
        </select>
      </div>
      <div class="form-group">
        <label for="data-fatura"><i class="fas fa-calendar"></i> Data</label>
        <input type="date" id="data-fatura" required>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="carregarMeusPagamentos()">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-save"></i> Salvar Pagamento
        </button>
      </div>
    </form>
  `;
  contentArea.innerHTML = modalHTML;
}

function salvarNovaFatura(event) {
  event.preventDefault();

  const produto = document.getElementById("produto-fatura").value;
  const valor = document.getElementById("valor-fatura").value;
  const data = document.getElementById("data-fatura").value;
  const tipo = document.getElementById("forma-pagamento").value;

  const dataFormatada = new Date(data).toLocaleDateString("pt-BR");

  if (!appState.payments) appState.payments = [];

  const novaFatura = {
    id: appState.payments.length + 1,
    product: produto,
    value: parseFloat(valor).toFixed(2).replace(".", ","),
    date: dataFormatada,
    type: tipo
  };

  appState.payments.push(novaFatura);
  mostrarNotificacao("Pagamento adicionado com sucesso!", "success");
  setTimeout(() => carregarMeusPagamentos(), 1500);
}

// ========== ENDEREÇOS ==========
function carregarEnderecos() {
  const contentArea = document.getElementById("dynamic-content");
  let addressesHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2><i class="fas fa-map-marker-alt"></i> Meus Endereços</h2>
    </div>
    <div id="addresses-list">
  `;

  if (appState.addresses.length === 0) {
    addressesHTML += criarEmptyState(
      "fas fa-map-marked-alt",
      "Nenhum endereço cadastrado",
      "Adicione um endereço para facilitar suas compras.",
      { texto: "Adicionar Endereço", acao: "novoEndereco()", icone: "fas fa-plus" }
    );
  } else {
    appState.addresses.forEach((address) => {
      addressesHTML += `
        <div class="address-item">
          <strong><i class="fas fa-map-pin"></i> ${address.type}</strong>
          <p>${address.address}</p>
          <p>CEP: ${address.cep}</p>
          <div class="address-actions">
            <button class="btn btn-primary" onclick="editarEndereco(${address.id})"><i class="fas fa-edit"></i> Editar</button>
            <button class="btn btn-danger" onclick="excluirEndereco(${address.id})"><i class="fas fa-trash"></i> Excluir</button>
          </div>
        </div>
      `;
    });
  }

  addressesHTML += `</div>`;
  contentArea.innerHTML = addressesHTML;
}

function novoEndereco() {
  const contentArea = document.getElementById("dynamic-content");
  document.getElementById("page-title").textContent = "Novo Endereço";

  contentArea.innerHTML = `
    <button class="btn btn-secondary" onclick="carregarEnderecos()" style="margin-bottom:20px;"><i class="fas fa-arrow-left"></i> Voltar</button>
    <h2><i class="fas fa-plus"></i> Adicionar Novo Endereço</h2>
    <form onsubmit="salvarEndereco(event)" class="form-style">
      <div class="form-group">
        <label for="tipo-endereco"><i class="fas fa-tag"></i> Tipo de Endereço</label>
        <select id="tipo-endereco" required>
          <option value="">Selecione...</option>
          <option value="Casa">Casa</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Outro">Outro</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cep"><i class="fas fa-map-pin"></i> CEP</label>
        <input type="text" id="cep" required placeholder="00000-000" maxlength="9">
      </div>
      <div class="form-group">
        <label for="logradouro"><i class="fas fa-road"></i> Logradouro</label>
        <input type="text" id="logradouro" required>
      </div>
      <div class="form-group">
        <label for="numero"><i class="fas fa-hashtag"></i> Número</label>
        <input type="text" id="numero" required>
      </div>
      <div class="form-group">
        <label for="complemento"><i class="fas fa-building"></i> Complemento</label>
        <input type="text" id="complemento">
      </div>
      <div class="form-group">
        <label for="bairro"><i class="fas fa-map"></i> Bairro</label>
        <input type="text" id="bairro" required>
      </div>
      <div class="form-group">
        <label for="cidade"><i class="fas fa-city"></i> Cidade</label>
        <input type="text" id="cidade" required>
      </div>
      <div class="form-group">
        <label for="estado"><i class="fas fa-flag"></i> Estado</label>
        <select id="estado" required>
          <option value="">Selecione...</option>
          <option value="SP">São Paulo</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="MG">Minas Gerais</option>
          <option value="BA">Bahia</option>
          <option value="RS">Rio Grande do Sul</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="carregarEnderecos()"><i class="fas fa-times"></i> Cancelar</button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Salvar Endereço</button>
      </div>
    </form>
  `;
}

function salvarEndereco(event) {
  event.preventDefault();

  const tipo = document.getElementById("tipo-endereco").value;
  const cep = document.getElementById("cep").value;
  const logradouro = document.getElementById("logradouro").value;
  const numero = document.getElementById("numero").value;
  const complemento = document.getElementById("complemento").value;
  const bairro = document.getElementById("bairro").value;
  const cidade = document.getElementById("cidade").value;
  const estado = document.getElementById("estado").value;

  if (!tipo || !cep || !logradouro || !numero || !bairro || !cidade || !estado) {
    mostrarNotificacao("Por favor, preencha todos os campos obrigatórios", "warning");
    return;
  }

  const novoEndereco = {
    id: appState.addresses.length + 1,
    type: tipo,
    address: `${logradouro}, ${numero}${complemento ? " - " + complemento : ""} - ${bairro}, ${cidade}/${estado}`,
    cep: cep,
  };

  appState.addresses.push(novoEndereco);
  mostrarNotificacao("Endereço adicionado com sucesso!");

  setTimeout(() => carregarEnderecos(), 900);
}

function editarEndereco(id) {
  mostrarNotificacao(`Editando endereço ${id}`, "info");
}

function excluirEndereco(id) {
  if (!confirm("Tem certeza que deseja excluir este endereço?")) return;

  appState.addresses = appState.addresses.filter((a) => a.id !== id);
  carregarEnderecos();
  mostrarNotificacao("Endereço excluído com sucesso!");
}


// ========== MINHAS DÍVIDAS ==========
// ========== MINHAS DÍVIDAS ==========
function carregarDividas() {
  // sincronizar do DB e aplicar juros APENAS aqui
  syncFiadosToState();

  const contentArea = document.getElementById("dynamic-content");
  let debtsHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2><i class="fas fa-money-bill"></i> Minhas Dívidas</h2>
      <button class="add-btn" onclick="novaFatura()"><i class="fas fa-plus"></i> Nova Dívida</button>
    </div>
    <div id="debts-list">
  `;

  const debts = Array.isArray(appState.debts) ? appState.debts : [];

  if (debts.length === 0) {
    debtsHTML += criarEmptyState(
      "fas fa-check-circle",
      "Nenhuma dívida pendente",
      "Parabéns! Você não tem dívidas pendentes."
    );
  } else {
    // calcular total somando valores com juros
    const totalDivida = debts.reduce((total, debt) => {
      const raw = (typeof debt.value === 'string') ? debt.value.replace('.', '').replace(',', '.') : debt.value;
      return total + (parseFloat(raw) || 0);
    }, 0);

    debtsHTML += `
      <div class="info-section" style="background: #ffe0e0; border-left: 4px solid #e74c3c; margin-bottom: 12px;">
        <strong style="color: #c0392b;">Total de Dívida (com juros): R$ ${fmtMoneyBr(totalDivida)}</strong>
      </div>
    `;

    debts.forEach((debt) => {
      const statusClass = debt.status === 'atrasado' ? 'style="color:#c0392b"' : 'style="color:#333"';
      const jurosInfo = debt.atrasoDias && debt.atrasoDias > 0 
        ? `<p style="color:#c0392b; font-weight:bold;"><i class="fas fa-exclamation-circle"></i> Juros aplicados (${debt.atrasoDias} dias)</p>`
        : '';
      
      debtsHTML += `
        <div class="debt-item">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 20px">
            <div>
              <strong><i class="fas fa-box"></i> ${debt.product}</strong>
              <p>Data: ${debt.date}</p>
              <p>Vencimento: <span ${statusClass}>${debt.dueDate}</span></p>
              ${debt.atrasoDias ? `<p style="color:#c0392b"><strong>Atraso:</strong> ${debt.atrasoDias} dias</p>` : ''}
              <p><strong>Valor Original:</strong> R$ ${debt.valorOriginal ? fmtMoneyBr(debt.valorOriginal) : debt.value}</p>
              ${jurosInfo}
            </div>
            <div style="text-align: right;">
              <p class="debt-value" style="font-size:18px; font-weight:bold;">R$ ${debt.value}</p>
            </div>
          </div>
          <div class="address-actions" style="margin-top: 15px;">
            <button class="btn btn-primary" onclick="pagarDivida(${debt.id})"><i class="fas fa-credit-card"></i> Pagar</button>
            <button class="btn btn-secondary" onclick="parcelarDivida(${debt.id})"><i class="fas fa-calculator"></i> Parcelar</button>
          </div>
        </div>
      `;
    });
  }

  debtsHTML += `</div>`;
  contentArea.innerHTML = debtsHTML;
}

function novaFatura() {
  const contentArea = document.getElementById("dynamic-content");
  let modalHTML = `
    <button class="btn btn-secondary" onclick="carregarDividas()" style="margin-bottom:20px;">
      <i class="fas fa-arrow-left"></i> Voltar
    </button>
    <h2><i class="fas fa-plus"></i> Adicionar Nova Dívida</h2>
    <form onsubmit="salvarPagamentoOuDivida(event)" class="form-style">
      <div class="form-group">
        <label for="produto-fatura"><i class="fas fa-box"></i> Produto/Serviço</label>
        <input type="text" id="produto-fatura" required placeholder="Ex: Pastel de queijo">
      </div>
      <div class="form-group">
        <label for="valor-fatura"><i class="fas fa-money-bill"></i> Valor</label>
        <input type="number" id="valor-fatura" required placeholder="0.00" step="0.01" min="0">
      </div>
      <div class="form-group">
        <label for="data-fatura"><i class="fas fa-calendar"></i> Data</label>
        <input type="date" id="data-fatura" required>
      </div>
      <div class="form-group">
        <label for="vencimento-fatura"><i class="fas fa-calendar-times"></i> Data de Vencimento</label>
        <input type="date" id="vencimento-fatura" required>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" onclick="carregarDividas()">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-save"></i> Salvar Dívida
        </button>
      </div>
    </form>
  `;
  contentArea.innerHTML = modalHTML;
}

function salvarPagamentoOuDivida(event) {
  event.preventDefault();

  const produto = document.getElementById("produto-fatura").value;
  const valor = document.getElementById("valor-fatura").value;
  const data = document.getElementById("data-fatura").value;
  const vencimento = document.getElementById("vencimento-fatura").value;

  const dataFormatada = new Date(data).toLocaleDateString("pt-BR");
  const vencimentoFormatado = new Date(vencimento).toLocaleDateString("pt-BR");

  const novaFatura = {
    id: (appState.debts.length || 0) + 1,
    product: produto,
    value: parseFloat(valor).toFixed(2).replace(".", ","),
    date: dataFormatada,
    dueDate: vencimentoFormatado,
    status: "pendente",
    valorOriginal: parseFloat(valor),
    atrasoDias: 0
  };

  appState.debts.push(novaFatura);
  saveStateDebtsToDB();
  mostrarNotificacao("Dívida adicionada com sucesso!", "success");

  setTimeout(() => carregarDividas(), 1500);
}

function voltarPagamentos() {
  carregarMeusPagamentos();
}

//=============== PAGA DÍVIDA ===================
function pagarDivida(id) {
  const debt = appState.debts.find(d => d.id === id);
  if (!debt) {
    mostrarNotificacao("Dívida não encontrada", "error");
    return;
  }

  const contentArea = document.getElementById("dynamic-content");
  const modalHTML = `
    <button class="btn btn-secondary" onclick="carregarDividas()" style="margin-bottom:20px;">
      <i class="fas fa-arrow-left"></i> Voltar
    </button>
    <div style="background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2><i class="fas fa-credit-card"></i> Confirmar Pagamento</h2>
      
      <div class="info-section" style="background: #e8f5e9; border-left: 4px solid #27ae60; margin: 20px 0;">
        <p><strong>Produto:</strong> ${debt.product}</p>
        <p><strong>Data da Dívida:</strong> ${debt.date}</p>
        <p><strong>Data de Vencimento:</strong> <span style="color: #e74c3c;">${debt.dueDate}</span></p>
        ${debt.atrasoDias && debt.atrasoDias > 0 ? `<p style="color: #c0392b;"><strong>⚠️ Dias em Atraso:</strong> ${debt.atrasoDias} dias</strong></p>` : ''}
        <p style="font-size: 14px; color: #666; margin-top: 10px;">
          <strong>Valor Original:</strong> R$ ${debt.valorOriginal ? fmtMoneyBr(debt.valorOriginal) : debt.value}
        </p>
      </div>

      <div style="background: #fff3cd; border-left: 4px solid #f39c12; padding: 16px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0;"><strong style="font-size: 18px; color: #c0392b;">Valor a Pagar: R$ ${debt.value}</strong></p>
      </div>

      <div style="margin: 24px 0;">
        <label style="font-weight: bold; margin-bottom: 12px; display: block;"><i class="fas fa-credit-card"></i> Forma de Pagamento</label>
        <select id="forma-pagamento-divida" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
          <option value="">Selecione...</option>
          <option value="credito">Cartão de Crédito</option>
          <option value="debito">Cartão de Débito</option>
          <option value="pix">PIX</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="boleto">Boleto Bancário</option>
        </select>
      </div>

      <div class="form-actions" style="display: flex; gap: 10px; margin-top: 24px;">
        <button type="button" class="btn btn-secondary" onclick="carregarDividas()">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="button" class="btn btn-primary" onclick="confirmarPagamentoDivida(${id})">
          <i class="fas fa-check"></i> Confirmar Pagamento
        </button>
      </div>
    </div>
  `;

  contentArea.innerHTML = modalHTML;
}

function confirmarPagamentoDivida(id) {
  const formaPagamento = document.getElementById("forma-pagamento-divida").value;
  
  if (!formaPagamento) {
    mostrarNotificacao("Por favor, selecione uma forma de pagamento", "warning");
    return;
  }

  const debt = appState.debts.find(d => d.id === id);
  if (!debt) {
    mostrarNotificacao("Dívida não encontrada", "error");
    return;
  }

  mostrarNotificacao(`Processando pagamento de R$ ${debt.value} via ${formaPagamento}...`, "info");

  setTimeout(() => {
    // atualizar no DB
    const db = readFiadosDB();
    const idx = db.findIndex(d => d.id === id);
    if (idx !== -1) {
      db[idx].status = 'pago';
      db[idx].value = fmtMoneyBr(db[idx].valorOriginal || parseFloat(db[idx].value));
      writeFiadosDB(db);
      appState.debts = db;
    }

    mostrarNotificacao(`✅ Pagamento de R$ ${debt.value} realizado com sucesso!`, "success");
    setTimeout(() => carregarDividas(), 1000);
  }, 2000);
}

function parcelarDivida(id) {
  const debt = appState.debts.find(d => d.id === id);
  if (!debt) {
    mostrarNotificacao("Dívida não encontrada", "error");
    return;
  }

  const contentArea = document.getElementById("dynamic-content");
  const valorDivida = parseFloat(debt.value.replace(',', '.'));
  
  // gerar opções de parcelamento (2x até 12x)
  let opcoesHTML = '';
  for (let i = 2; i <= 12; i++) {
    const valorParcela = valorDivida / i;
    const jurosParcelamento = valorDivida * (0.02 * i); // 2% de juros por parcela
    const totalComJuros = valorDivida + jurosParcelamento;
    const valorParcelaComJuros = totalComJuros / i;
    
    opcoesHTML += `
      <div style="background: #f9f9f9; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='#e8f5e9'; this.style.borderColor='#27ae60'" onmouseout="this.style.background='#f9f9f9'; this.style.borderColor='#ddd'" onclick="selecionarParcelamento(${id}, ${i})">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>${i}x de R$ ${valorParcelaComJuros.toFixed(2).replace('.', ',')}</strong>
            <p style="margin: 5px 0; font-size: 12px; color: #666;">
              Total: R$ ${totalComJuros.toFixed(2).replace('.', ',')} (+ R$ ${jurosParcelamento.toFixed(2).replace('.', ',')} juros)
            </p>
          </div>
          <input type="radio" name="parcelas" value="${i}" style="width: 20px; height: 20px;">
        </div>
      </div>
    `;
  }

  const modalHTML = `
    <button class="btn btn-secondary" onclick="carregarDividas()" style="margin-bottom:20px;">
      <i class="fas fa-arrow-left"></i> Voltar
    </button>
    <div style="background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2><i class="fas fa-calculator"></i> Parcelar Dívida</h2>
      
      <div class="info-section" style="background: #ffe0e0; border-left: 4px solid #e74c3c; margin: 20px 0;">
        <p><strong>Produto:</strong> ${debt.product}</p>
        <p><strong>Valor Total da Dívida:</strong> R$ ${debt.value}</p>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">
          <i class="fas fa-info-circle"></i> Selecione abaixo a quantidade de parcelas desejada
        </p>
      </div>

      <div style="margin: 24px 0;">
        <h3 style="margin-bottom: 16px;"><i class="fas fa-list"></i> Opções de Parcelamento</h3>
        <div id="opcoes-parcelamento">
          ${opcoesHTML}
        </div>
      </div>

      <div class="form-actions" style="display: flex; gap: 10px; margin-top: 24px;">
        <button type="button" class="btn btn-secondary" onclick="carregarDividas()">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="button" class="btn btn-primary" onclick="confirmarParcelamento(${id})">
          <i class="fas fa-check"></i> Confirmar Parcelamento
        </button>
      </div>
    </div>
  `;

  contentArea.innerHTML = modalHTML;
}

function selecionarParcelamento(id, parcelas) {
  const radios = document.querySelectorAll('input[name="parcelas"]');
  radios.forEach(radio => radio.checked = false);
  event.target.closest('div').querySelector('input[name="parcelas"]').checked = true;
}

function confirmarParcelamento(id) {
  const parcelasRadio = document.querySelector('input[name="parcelas"]:checked');
  
  if (!parcelasRadio) {
    mostrarNotificacao("Por favor, selecione uma opção de parcelamento", "warning");
    return;
  }

  const parcelas = parseInt(parcelasRadio.value);
  const debt = appState.debts.find(d => d.id === id);
  
  if (!debt) {
    mostrarNotificacao("Dívida não encontrada", "error");
    return;
  }

  const valorDivida = parseFloat(debt.value.replace(',', '.'));
  const jurosParcelamento = valorDivida * (0.02 * parcelas);
  const totalComJuros = valorDivida + jurosParcelamento;
  const valorParcela = totalComJuros / parcelas;

  mostrarNotificacao(
    `Parcelamento confirmado! ${parcelas}x de R$ ${valorParcela.toFixed(2).replace('.', ',')}`,
    "success"
  );

  setTimeout(() => {
    const db = readFiadosDB();
    const idx = db.findIndex(d => d.id === id);
    if (idx !== -1) {
      db[idx].status = 'parcelado';
      db[idx].parcelas = parcelas;
      db[idx].valorParcela = valorParcela;
      db[idx].totalComJuros = totalComJuros;
      writeFiadosDB(db);
      appState.debts = db;
    }
    carregarDividas();
  }, 1500);
}

// ========== GERENCIAMENTO DE PERFIL ==========
function handleProfilePicUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    mostrarNotificacao("Por favor, selecione uma imagem válida", "error");
    return;
  }

  if (file.size > 5000000) {
    mostrarNotificacao("Imagem muito grande (máximo 5MB)", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = document.getElementById("profile-img");
    if (img) img.src = e.target.result;
    mostrarNotificacao("Foto de perfil atualizada!", "success");
  };
  reader.onerror = function () {
    mostrarNotificacao("Erro ao carregar imagem", "error");
  };
  reader.readAsDataURL(file);
}

// ========== LOGOUT ==========
function handleLogout() {
  if (confirm("Você tem certeza que deseja sair?")) {
    localStorage.clear();
    sessionStorage.clear();
    mostrarNotificacao("Saindo...", "info");

    setTimeout(() => {
      window.location.href = "/frontend/pages/login.html";
    }, 1500);
  }
}
