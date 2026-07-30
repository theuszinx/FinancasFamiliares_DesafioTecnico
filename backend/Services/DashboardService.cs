using FinancasAPI.Data;
using FinancasAPI.DTOs;
using FinancasAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FinancasAPI.Services;

public class DashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardDto> GerarDashboardAsync()
    {
        
        var pessoas = await _context.Pessoas
            .AsNoTracking()
            .Include(p => p.Transacoes)
            .ToListAsync();

        var resumoPorPessoa = pessoas.Select(p =>
        {
            
            var totalReceitas = p.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor);

            var totalDespesas = p.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor);

            return new ResumoPessoaDto
            {
                PessoaId = p.Id,
                Nome = p.Nome,
                Idade = p.Idade,
                FotoBase64 = p.FotoBase64,
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                // saldo  receitas - despesas (pode ser negativo)
                Saldo = totalReceitas - totalDespesas
            };
        }).ToList();

        var totalGeralReceitas = resumoPorPessoa.Sum(r => r.TotalReceitas);
        var totalGeralDespesas = resumoPorPessoa.Sum(r => r.TotalDespesas);

        return new DashboardDto
        {
            ResumoPorPessoa = resumoPorPessoa,
            TotalGeralReceitas = totalGeralReceitas,
            TotalGeralDespesas = totalGeralDespesas,
            // saldo líquido final da residência
            SaldoLiquido = totalGeralReceitas - totalGeralDespesas
        };
    }
}
