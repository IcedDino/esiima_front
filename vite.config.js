// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'pages/situacion-actual.html'),
        index: resolve(__dirname, 'index.html'),
        "materias-y-faltas": resolve(__dirname, "pages/materias-y-faltas.html"),
        horario: resolve(__dirname, "pages/horario.html"),
        "requisitos-de-titulacion": resolve(__dirname, "pages/requisitos-de-titulacion.html"),
        "calificaciones-parciales": resolve(__dirname, "pages/calificaciones-parciales.html"),
        extracurriculares: resolve(__dirname, "pages/extracurriculares.html"),
        "kardex-y-seriacion": resolve(__dirname, "pages/kardex-y-seriacion.html"),
        "solicitud-de-ext-y-o-ts": resolve(__dirname, "pages/solicitud-de-ext-y-o-ts.html"),
        "expediente-servicio-social": resolve(__dirname, "pages/expediente-servicio-social.html"),
        "evaluacion-a-profesores": resolve(__dirname, "pages/evaluacion-a-profesores.html"),
        "hor-y-res-de-ex-ext-y-o-ts": resolve(__dirname, "pages/hor-y-res-de-ex-ext-y-o-ts.html"),
        "exp-de-documentos-imss": resolve(__dirname, "pages/exp-de-documentos-imss.html"),
        "expediente-de-practicas-prof": resolve(__dirname, "pages/expediente-de-practicas-prof.html"),
        "datos-personales": resolve(__dirname, "pages/datos-personales.html"),
        "cambiar-contrasena": resolve(__dirname, "pages/cambiar-contrasena.html"),
        "cambiar-clave-de-verificacion": resolve(__dirname, "pages/cambiar-clave-de-verificacion.html"),
        cajas: resolve(__dirname, "pages/cajas.html"),
      },
    },
  },
});