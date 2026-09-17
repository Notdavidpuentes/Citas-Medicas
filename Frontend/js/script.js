const formulario = document.getElementById("formCita");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;

    const nombre_paciente = nombre + " " + apellido;

    const especialidad = document.getElementById("especialidad").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    const datos = {
        nombre_paciente,
        especialidad,
        fecha,
        hora
    };

    try {

        const respuesta = await fetch("http://localhost:3000/citas", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datos)

        });

        const resultado = await respuesta.json();

        alert(resultado.mensaje);

        formulario.reset();

    } catch (error) {

        alert("Error al conectar con el servidor.");

        console.error(error);

    }

});