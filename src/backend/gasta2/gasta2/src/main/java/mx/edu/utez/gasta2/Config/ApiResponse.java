package mx.edu.utez.gasta2.Config;

import org.springframework.http.HttpStatus;

public class ApiResponse {
    private Object data;
    private HttpStatus status;
    private boolean error;
    private String mensaje;


    public ApiResponse(Object data, HttpStatus status, String mensaje) {
        this.data = data;
        this.status = status;
        this.mensaje = mensaje;
    }

    public ApiResponse(HttpStatus status, boolean error, String mensaje) {
        this.status = status;
        this.error = error;
        this.mensaje = mensaje;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
