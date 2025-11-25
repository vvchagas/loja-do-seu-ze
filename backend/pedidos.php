<?php
require_once 'cliente.php';
require_once 'produto.php';
class Pedidos extends Cliente
{
    public int $id;
    private int $clienteId;
    private int $dataPedido;
    private int $produtoId;
    private array $quantidade = [];
    private float $precoTotal;
    private string $status;
    private array $nomeCliente = [];
    private array $nomeProduto = [];
    private array $subtotal = [];
    public function __construct(int $id, int $clienteId, int $dataPedido, int $produtoId, array $quantidade, float $precoTotal, string $status, array $nomeCliente, array $nomeProduto, array $subtotal)
    {
        $this->id = $id;
        $this->clienteId = $clienteId;
        $this->dataPedido = $dataPedido;
        $this->produtoId = $produtoId;
        $this->quantidade = $quantidade;
        $this->precoTotal = $precoTotal;
        $this->status = $status;
        $this->nomeCliente = $nomeCliente;
        $this->nomeProduto = $nomeProduto;
        $this->subtotal = $subtotal;
    }
    public function getId(): int
    {
        return $this->id;
    }
    public function getClienteId(): int
    {
        return $this->clienteId;
    }
    public function getDataPedido(): int
    {
        return $this->dataPedido;
    }
    public function getProdutoId(): int
    {
        return $this->produtoId;
    }
    public function getQuantidade(): array
    {
        return $this->quantidade;
    }
    public function getPrecoTotal(): float
    {
        
        return $this->precoTotal;
    }
    public function getStatus(): string
    {
        return $this->status;
    }
    public function getNomeCliente(): array
    {
        return $this->nomeCliente;
    }
    public function getNomeProduto(): array
    {
        return $this->nomeProduto;
    }
    public function getSubtotal(): array
    {
        return $this->subtotal;
    }
    public function calculartotal(): float
    {
        $this->precoTotal = 0;
        foreach ($this->subtotal as $subtotal) {
            $this->precoTotal += $subtotal;
        }
        return $this->precoTotal;
    }
    public function mostrarNota(): string
    {
        $nota = "Nota Fiscal do Pedido: <br>";
        $nota .= "Cliente: " . $this->nomeCliente . "<br>";
        $nota .= "Data do Pedido: " . date('d/m/Y', $this->dataPedido) . "<br>";
        $nota .= "Produtos: <br>";
        foreach ($this->nomeProduto as $index => $produto) {
            $nota .= "- " . $produto . ": " . $this->quantidade[$index] . " unidades, Subtotal: R$ " . number_format($this->subtotal[$index], 2) . "<br>";
        }
        $nota .= "Total: R$ " . number_format($this->precoTotal, 2) . "<br>";
        $nota .= "Status do Pedido: " . $this->status . "<br>";
        return $nota;
    }
}
?>