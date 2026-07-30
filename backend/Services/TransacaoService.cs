using FinancasAPI.Data;
using FinancasAPI.DTOs;
using FinancasAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FinancasAPI.Services;

public record TransacaoResult(bool Sucesso, string? Erro, TransacaoResponseDto? Dados);

public class TransacaoService
{
    private readonly AppDbContext _context;

    public TransacaoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TransacaoResponseDto>> ListarTodasAsync()
    {
        return await _context.Transacoes
            .AsNoTracking()
            .Include(t => t.Pessoa) // carrega a pessoa para pegar o nome
            .Select(t => new TransacaoResponseDto
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo.ToString(),
                PessoaId = t.PessoaId,
                PessoaNome = t.Pessoa!.Nome
            })
            .ToListAsync();
    }



    public async Task<TransacaoResult> CriarAsync(CriarTransacaoDto dto)
    {
        
        var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
        if (pessoa is null)
        {
            return new TransacaoResult(false, $"Pessoa com ID '{dto.PessoaId}' não encontrada.", null);
        }

        // menores de 18 anos só podem registrar despesas — nunca receitas
        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
        {
            return new TransacaoResult(
                false,
                $"Menor de idade: '{pessoa.Nome}' tem {pessoa.Idade} anos e não pode registrar Receitas. Apenas Despesas são permitidas para menores de 18 anos.",
                null
            );
        }

        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            PessoaId = dto.PessoaId
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        return new TransacaoResult(true, null, new TransacaoResponseDto
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo.ToString(),
            PessoaId = transacao.PessoaId,
            PessoaNome = pessoa.Nome
        });
    }
}
