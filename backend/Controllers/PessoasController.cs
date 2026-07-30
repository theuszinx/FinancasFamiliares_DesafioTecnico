using FinancasAPI.DTOs;
using FinancasAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinancasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PessoasController : ControllerBase
{
    private readonly PessoaService _pessoaService;

    public PessoasController(PessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<PessoaResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar()
    {
        var pessoas = await _pessoaService.ListarTodosAsync();
        return Ok(pessoas);
    }

    [HttpPost]
    [ProducesResponseType(typeof(PessoaResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Criar([FromBody] CriarPessoaDto dto)
    {
        
        if (string.IsNullOrWhiteSpace(dto.Nome))
            return BadRequest("O nome da pessoa é obrigatório.");

        if (dto.Idade <= 0)
            return BadRequest("A idade deve ser maior que zero.");

        var resultado = await _pessoaService.CriarAsync(dto);
        return CreatedAtAction(nameof(Listar), new { id = resultado.Id }, resultado);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deletar(Guid id)
    {
        var deletado = await _pessoaService.DeletarAsync(id);

        if (!deletado)
            return NotFound($"Pessoa com ID '{id}' não encontrada.");

        return NoContent();
    }
}
