using FinancasAPI.Data;
using FinancasAPI.DTOs;
using FinancasAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FinancasAPI.Services;

public class PessoaService
{
    private readonly AppDbContext _context;

    public PessoaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<PessoaResponseDto>> ListarTodosAsync()
    {
        return await _context.Pessoas
            .AsNoTracking() // melhora de performance: não rastreia entidades somente para leitura
            .Select(p => new PessoaResponseDto
            {
                Id = p.Id,
                Nome = p.Nome,
                Idade = p.Idade,
                FotoBase64 = p.FotoBase64
            })
            .ToListAsync();
    }



    public async Task<PessoaResponseDto> CriarAsync(CriarPessoaDto dto)
    {
        var pessoa = new Pessoa
        {
            Nome = dto.Nome,
            Idade = dto.Idade,
            FotoBase64 = dto.FotoBase64
        };

        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        return new PessoaResponseDto
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade,
            FotoBase64 = pessoa.FotoBase64
        };
    }



    public async Task<bool> DeletarAsync(Guid id)
    {
        // busca a pessoa no banco pelo id fornecido
        var pessoa = await _context.Pessoas.FindAsync(id);

        // retorna false sinalizando ao controller que deve responder com 404
        if (pessoa is null) return false;

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return true;
    }
}
