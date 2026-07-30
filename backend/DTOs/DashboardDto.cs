namespace FinancasAPI.DTOs;

public class ResumoPessoaDto
{
    public Guid PessoaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
    public string? FotoBase64 { get; set; }

    public decimal TotalReceitas { get; set; }

    public decimal TotalDespesas { get; set; }

    public decimal Saldo { get; set; }
}

public class DashboardDto
{

    public List<ResumoPessoaDto> ResumoPorPessoa { get; set; } = new();

    public decimal TotalGeralReceitas { get; set; }

    public decimal TotalGeralDespesas { get; set; }

    public decimal SaldoLiquido { get; set; }
}
