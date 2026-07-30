namespace FinancasAPI.DTOs;

public class CriarPessoaDto
{

    public string Nome { get; set; } = string.Empty;

    public int Idade { get; set; }

    public string? FotoBase64 { get; set; }
}

public class PessoaResponseDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
    public string? FotoBase64 { get; set; }
}
