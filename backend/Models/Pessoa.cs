namespace FinancasAPI.Models;

public class Pessoa
{

    public Guid Id { get; set; } = Guid.NewGuid();

    public string Nome { get; set; } = string.Empty;

    public int Idade { get; set; }

    public string? FotoBase64 { get; set; }

    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}
