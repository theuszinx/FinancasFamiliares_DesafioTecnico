using FinancasAPI.DTOs;
using FinancasAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinancasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TransacoesController : ControllerBase
{
    private readonly TransacaoService _transacaoService;

    public TransacoesController(TransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<TransacaoResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar()
    {
        var transacoes = await _transacaoService.ListarTodasAsync();
        return Ok(transacoes);
    }

    [HttpPost]
    [ProducesResponseType(typeof(TransacaoResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Criar([FromBody] CriarTransacaoDto dto)
    {
        
        if (string.IsNullOrWhiteSpace(dto.Descricao))
            return BadRequest("A descrição da transação é obrigatória.");

        if (dto.Valor <= 0)
            return BadRequest("O valor da transação deve ser maior que zero.");

        var resultado = await _transacaoService.CriarAsync(dto);

        if (!resultado.Sucesso)
        {
            // se a pessoa não foi encontrada, retorna 404
            if (resultado.Erro!.Contains("não encontrada"))
                return NotFound(resultado.Erro);

            // caso contrário (ex.: menor de idade tentando cadastrar receita), retorna 400
            return BadRequest(resultado.Erro);
        }

        return CreatedAtAction(nameof(Listar), new { id = resultado.Dados!.Id }, resultado.Dados);
    }
}
