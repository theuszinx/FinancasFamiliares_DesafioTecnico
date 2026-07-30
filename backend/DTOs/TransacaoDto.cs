using FinancasAPI.Models;

namespace FinancasAPI.DTOs;

public class CriarTransacaoDto
{

    public string Descricao { get; set; } = string.Empty;

    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    public Guid PessoaId { get; set; }
}

public class TransacaoResponseDto
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public Guid PessoaId { get; set; }
    public string PessoaNome { get; set; } = string.Empty;
}
