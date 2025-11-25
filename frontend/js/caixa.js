document.getElementById('pagamentoForm').addEventListener('change', exibirDetalhes);

function carregarValorTotal() {
  const carrinho = JSON.parse(localStorage.getItem(DB_KEYS.CARRINHO) || '[]');
  
  const total = carrinho.reduce((acc, item) => {
    const preco = parseFloat(item.preco.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + (preco * item.quantidade);
  }, 0);

  document.getElementById('valorTotal').textContent = total.toFixed(2).replace('.', ',');
}


function exibirDetalhes() {
  const metodo = document.getElementById('pagamentoForm').value;
  const detalhesDiv = document.getElementById('detalhesMetodo');
  
  
  detalhesDiv.innerHTML = '';
  detalhesDiv.classList.remove('ativo');

  if (!metodo) return;

  detalhesDiv.classList.add('ativo');

  switch(metodo) {
    case 'pix':
      detalhesDiv.innerHTML = `
        <p><strong>Chave PIX:</strong></p>
        <input type="text" id="chavePix" placeholder="Sua chave PIX será gerada automaticamente" disabled>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">Escaneie o QR Code no seu dispositivo</p>
      `;
      break;
    case 'credito':
      detalhesDiv.innerHTML = `
        <input type="text" id="nomeCartao" placeholder="Nome no cartão" required>
        <input type="text" id="numeroCartao" placeholder="Número do cartão" maxlength="16" required>
        <div style="display: flex; gap: 10px;">
          <input type="text" id="validade" placeholder="MM/AA" maxlength="5" style="flex: 1;" required>
          <input type="text" id="cvv" placeholder="CVV" maxlength="3" style="flex: 1;" required>
        </div>
      `;
      break;
    case 'debito':
      detalhesDiv.innerHTML = `
        <input type="text" id="nomeCartao" placeholder="Nome no cartão" required>
        <input type="text" id="numeroCartao" placeholder="Número do cartão" maxlength="16" required>
        <div style="display: flex; gap: 10px;">
          <input type="text" id="validade" placeholder="MM/AA" maxlength="5" style="flex: 1;" required>
          <input type="text" id="cvv" placeholder="CVV" maxlength="3" style="flex: 1;" required>
        </div>
      `;
      break;
    case 'boleto':
      detalhesDiv.innerHTML = `
        <p><strong>Boleto gerado:</strong></p>
        <input type="text" value="12345.67890 12345.123456 12345.123456 1 12345678901234" disabled>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">Vencimento em 3 dias úteis</p>
      `;
      break;
    case 'fiado':
      detalhesDiv.innerHTML = `
        <input type="email" id="emailCliente" placeholder="E-mail" required>
        <input type="tel" id="telefoneCliente" placeholder="Telefone" required>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">Você receberá uma cobrança posterior</p>
      `;
      break;
    case 'dinheiro':
      detalhesDiv.innerHTML = `
        <p style="color: #666;"><strong>Pagamento em dinheiro</strong></p>
        <p style="font-size: 14px;">Confirme para concluir a transação</p>
      `;
      break;
  }
}

function confirmarPagamento() {
  const metodo = document.getElementById('pagamentoForm').value;
  if (!metodo) {
    alert('Selecione uma forma de pagamento!');
    return;
  }
  alert(`Pagamento confirmado via ${metodo}!`);
}

function cancelarPagamento() {
  document.getElementById('pagamentoForm').value = '';
  document.getElementById('detalhesMetodo').innerHTML = '';
  document.getElementById('detalhesMetodo').classList.remove('ativo');
}
// ==============================================================
// CONFIGURAÇÃO DAS CHAVES DO LOCALSTORAGE
// ==============================================================
const DB_KEYS = {
  CARRINHO: 'carrinho_loja',
  FIADOS: 'fiados_db',
  PAGAMENTOS: 'meus_pagamentos_db' // Nova chave para vincular com "Meus Pagamentos"
};
// ==============================================================
// 1. INICIALIZAÇÃO E RESUMO DA COMPRA
// ==============================================================

document.addEventListener("DOMContentLoaded", () => {
  carregarResumoCompra();
});

function carregarResumoCompra() {
  const carrinho = JSON.parse(localStorage.getItem(DB_KEYS.CARRINHO) || '[]');
  
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    window.location.href = "inicial.html";
    return;
  }

  // Calcula total
  const total = carrinho.reduce((acc, item) => {
    // Garante que o cálculo use ponto como separador decimal
    const preco = parseFloat(item.preco.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + (preco * item.quantidade);
  }, 0);

  // Exibe total na tela (se existir o elemento #total-valor no seu HTML)
  const totalDisplay = document.getElementById('total-valor');
  if(totalDisplay) {
    totalDisplay.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }
}

// ==============================================================
// 2. INTERFACE DO FORMULÁRIO (VISUAL) - UNIFICADO
// ==============================================================

document.getElementById('pagamentoForm').addEventListener('change', exibirDetalhes);

function exibirDetalhes() {
  const metodo = document.getElementById('pagamentoForm').value;
  const detalhesDiv = document.getElementById('detalhesMetodo');
  
  detalhesDiv.innerHTML = '';
  detalhesDiv.classList.remove('ativo');

  if (!metodo) return;

  detalhesDiv.classList.add('ativo');

  switch(metodo) {
    case 'pix':
      detalhesDiv.innerHTML = `
        <p><strong>Chave PIX:</strong></p>
        <input type="text" value="12.345.678/0001-90" disabled style="text-align:center; font-weight:bold;">
        <p style="margin-top: 10px; font-size: 12px; color: #666;">Pagamento processado automaticamente após o envio.</p>
      `;
      break;
    case 'credito':
    case 'debito':
      detalhesDiv.innerHTML = `
        <input type="text" id="nomeCartao" placeholder="Nome impresso no cartão" required>
        <input type="text" id="numeroCartao" placeholder="0000 0000 0000 0000" maxlength="19" required>
        <div style="display: flex; gap: 10px;">
          <input type="text" id="validade" placeholder="MM/AA" maxlength="5" style="flex: 1;" required>
          <input type="text" id="cvv" placeholder="CVV" maxlength="3" style="flex: 1;" required>
        </div>
      `;
      break;
    case 'boleto':
      detalhesDiv.innerHTML = `
        <p><strong>Linha Digitável:</strong></p>
        <input type="text" value="34191.79001 01043.510047 91020.150008 5" disabled>
        <small style="color:#666">Aprovação em até 3 dias úteis.</small>
      `;
      break;
    case 'fiado':
      detalhesDiv.innerHTML = `
        <div style="background: #fff3cd; padding: 10px; border-left: 4px solid #f39c12; margin-bottom: 10px;">
          <small>Esta compra irá para "Minhas Dívidas" no seu perfil.</small>
        </div>
        <label style="font-size: 12px; margin-top: 5px;">Data combinada para pagamento:</label>
        <input type="date" id="dataVencimentoFiado" required>
      `;
      break;
    case 'dinheiro':
      detalhesDiv.innerHTML = `<p style="padding:10px; text-align:center;">Pagamento será realizado na entrega/retirada.</p>`;
      break;
  }
}

// ==============================================================
// 3. PROCESSAMENTO E VINCULAÇÃO (LÓGICA PRINCIPAL) - COMPLETO
// ==============================================================

function confirmarPagamento() {
  const metodo = document.getElementById('pagamentoForm').value;
  if (!metodo) {
    alert('Por favor, selecione uma forma de pagamento.');
    return;
  }

  // --- Coleta dados do Carrinho ---
  const carrinho = JSON.parse(localStorage.getItem(DB_KEYS.CARRINHO) || '[]');
  if (carrinho.length === 0) return;

  // Calcula total
  const totalNum = carrinho.reduce((acc, item) => {
    const preco = parseFloat(item.preco.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + (preco * item.quantidade);
  }, 0);
  
  const totalFormatado = totalNum.toFixed(2).replace('.', ',');
  
  const resumoItens = carrinho.map(i => `${i.quantidade}x ${i.nome}`).join(', ');
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  // --- LÓGICA DE SEPARAÇÃO (FIADO vs PAGAMENTO) ---

  if (metodo === 'fiado') {
    // LÓGICA JÁ COMPLETA: SALVA EM fiados_db
    const vencimentoInput = document.getElementById('dataVencimentoFiado').value;
    
    if (!vencimentoInput) {
      alert("Defina a data de vencimento para o fiado.");
      return;
    }

    const [ano, mes, dia] = vencimentoInput.split('-');
    const vencimentoFormatado = `${dia}/${mes}/${ano}`;

    const novaDivida = {
      id: Date.now(),
      product: resumoItens,
      value: totalFormatado,
      date: dataHoje,
      dueDate: vencimentoFormatado,
      status: "pendente",
      valorOriginal: totalNum,
      atrasoDias: 0
    };

    const fiadosDB = JSON.parse(localStorage.getItem(DB_KEYS.FIADOS) || '[]');
    fiadosDB.push(novaDivida);
    localStorage.setItem(DB_KEYS.FIADOS, JSON.stringify(fiadosDB));
    
    alert(`Fiado registrado com sucesso!\nVencimento: ${vencimentoFormatado}`);

  } else {
    // LÓGICA QUE FALTAVA (E FOI ADICIONADA): SALVA EM meus_pagamentos_db
    
    const novoPagamento = {
      id: Date.now(),
      product: resumoItens,
      value: totalFormatado,
      date: dataHoje,
      type: metodo, // pix, credito, debito, boleto, dinheiro
      dueDate: dataHoje 
    };

    const pagamentosDB = JSON.parse(localStorage.getItem(DB_KEYS.PAGAMENTOS) || '[]');
    pagamentosDB.push(novoPagamento);
    localStorage.setItem(DB_KEYS.PAGAMENTOS, JSON.stringify(pagamentosDB));

    alert(`Pagamento de R$ ${totalFormatado} confirmado via ${metodo.toUpperCase()}!`);
  }

  // --- FINALIZAÇÃO ---
  
  // Limpa o carrinho (Vinculação com inicial.js)
  localStorage.removeItem(DB_KEYS.CARRINHO);

  // Redireciona para o Perfil
  window.location.href = "perfil.html";
}

function cancelarPagamento() {
  if(confirm("Deseja cancelar e voltar para a loja?")) {
    window.location.href = "inicial.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarValorTotal();
  carregarResumoCompra();
});