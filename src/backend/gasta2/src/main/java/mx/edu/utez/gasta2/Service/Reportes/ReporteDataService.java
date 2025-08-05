package mx.edu.utez.gasta2.Service.Reportes;

import mx.edu.utez.gasta2.Model.Reporte.DTO.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReporteDataService {

    /**
     * Procesa y enriquece los datos del reporte calculando estadísticas adicionales
     */
    public ReporteDTO procesarDatosReporte(ReporteDTO reporteOriginal) {
        // Calcular estadísticas generales si no vienen
        if (reporteOriginal.getEstadisticas() == null) {
            EstadisticasGeneralesDTO estadisticas = calcularEstadisticas(reporteOriginal);
            reporteOriginal.setEstadisticas(estadisticas);
        }

        // Calcular porcentajes para categorías
        calcularPorcentajesCategorias(reporteOriginal.getCategorias());

        // Calcular totales para usuarios
        calcularTotalesUsuarios(reporteOriginal.getAportesPorUsuario());

        return reporteOriginal;
    }

    private EstadisticasGeneralesDTO calcularEstadisticas(ReporteDTO reporte) {
        double totalGastos = reporte.getCategorias().stream()
                .mapToDouble(CategoriasDTO::getMonto)
                .sum();

        double promedioGasto = totalGastos / reporte.getCategorias().size();

        int totalRegistros = reporte.getAportesPorUsuario().stream()
                .mapToInt(user -> user.getAportes().size())
                .sum();

        int categoriasActivas = reporte.getCategorias().size();

        return new EstadisticasGeneralesDTO(totalGastos, promedioGasto, totalRegistros, categoriasActivas);
    }

    private void calcularPorcentajesCategorias(List<CategoriasDTO> categorias) {
        double total = categorias.stream()
                .mapToDouble(CategoriasDTO::getMonto)
                .sum();

        categorias.forEach(categoria -> {
            double porcentaje = (categoria.getMonto() / total) * 100;
            categoria.setPorcentaje(porcentaje);
        });
    }

    private void calcularTotalesUsuarios(List<UsuarioAporteDTO> usuarios) {
        usuarios.forEach(usuario -> {
            double total = usuario.getAportes().stream()
                    .mapToDouble(AporteDTO::getMonto)
                    .sum();
            usuario.setTotalAportado(total);
        });
    }

    /**
     * Valida que los datos del reporte sean consistentes
     */
    public boolean validarDatosReporte(ReporteDTO reporte) {
        if (reporte == null) return false;
        if (reporte.getCategorias() == null || reporte.getCategorias().isEmpty()) return false;
        if (reporte.getAportesPorUsuario() == null || reporte.getAportesPorUsuario().isEmpty()) return false;
        if (reporte.getNombreEspacio() == null || reporte.getNombreEspacio().trim().isEmpty()) return false;

        // Validar que todos los montos sean positivos
        boolean montosValidos = reporte.getCategorias().stream()
                .allMatch(cat -> cat.getMonto() != null && cat.getMonto() >= 0);

        if (!montosValidos) return false;

        // Validar aportes de usuarios
        return reporte.getAportesPorUsuario().stream()
                .allMatch(usuario -> usuario.getAportes() != null
                        && !usuario.getAportes().isEmpty()
                        && usuario.getAportes().stream()
                        .allMatch(aporte -> aporte.getMonto() != null && aporte.getMonto() >= 0));
    }

    /**
     * Genera datos de ejemplo para testing
     */
    public ReporteDTO generarDatosEjemplo() {
        // Crear categorías de ejemplo
        List<CategoriasDTO> categorias = List.of(
                new CategoriasDTO("Alimentos", 1500.0, 60.0, "#ec4899"),
                new CategoriasDTO("Transporte", 700.0, 28.0, "#3b82f6"),
                new CategoriasDTO("Entretenimiento", 300.0, 12.0, "#22c55e")
        );

        // Crear aportes de usuarios de ejemplo
        List<UsuarioAporteDTO> usuarios = List.of(
                new UsuarioAporteDTO("Miguel", List.of(
                        new AporteDTO(LocalDate.of(2025, 7, 1), 100.0),
                        new AporteDTO(LocalDate.of(2025, 7, 2), 150.0),
                        new AporteDTO(LocalDate.of(2025, 7, 3), 200.0)
                ), 450.0),
                new UsuarioAporteDTO("Laura", List.of(
                        new AporteDTO(LocalDate.of(2025, 7, 1), 80.0),
                        new AporteDTO(LocalDate.of(2025, 7, 2), 160.0),
                        new AporteDTO(LocalDate.of(2025, 7, 3), 210.0)
                ), 450.0)
        );

        // Estadísticas
        EstadisticasGeneralesDTO estadisticas = new EstadisticasGeneralesDTO(
                2500.0, 833.33, 6, 3
        );

        return new ReporteDTO(categorias, usuarios, estadisticas, "Espacio de Ejemplo", "Julio 2025");
    }
}