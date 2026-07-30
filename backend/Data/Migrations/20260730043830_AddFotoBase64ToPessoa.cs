using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinancasAPI.Data.Migrations
{

    public partial class AddFotoBase64ToPessoa : Migration
    {

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FotoBase64",
                table: "Pessoas",
                type: "text",
                nullable: true);
        }


        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FotoBase64",
                table: "Pessoas");
        }
    }
}
