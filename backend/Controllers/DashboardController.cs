using FinancasAPI.DTOs;
using FinancasAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinancasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;

    public DashboardController(DashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(DashboardDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterDashboard()
    {
        var dashboard = await _dashboardService.GerarDashboardAsync();
        return Ok(dashboard);
    }
}
