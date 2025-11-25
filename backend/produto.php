<?php
class Produto
{
    protected string $nome;
    protected int $idProduto;
    private float $valor;
    protected int $qntd;

    public function __construct(string $nome, int $idProduto, float $valor, int $qntd)
    {
        $this->nome = $nome;
        $this->idProduto = $idProduto;
        $this->valor = $valor;
        $this->qntd = $qntd;
    }

    public function subtotal(): bool
    {
        if($this->valor > 0){
            $this->valor * $this->qntd;
            return true;
        }else{
            return false;
        }
    }
}
?>
