# 📞 Guía de Soporte

## 🤝 ¿Necesitas Ayuda?

¡Estamos aquí para ayudarte! Si tienes problemas con Localix, aquí tienes varias formas de obtener soporte.

## 📋 Antes de Pedir Ayuda

Antes de crear un issue o contactarnos, por favor:

1. **Revisa la documentación**: Muchas preguntas ya están respondidas en el [README](README.md) y la [Wiki](https://github.com/miguelnexs/localix/wiki).

2. **Busca en issues existentes**: Es posible que tu problema ya haya sido reportado y resuelto. Usa la función de búsqueda en la pestaña [Issues](https://github.com/miguelnexs/localix/issues).

3. **Verifica los prerequisitos**: Asegúrate de tener instaladas las versiones correctas de:
   - Python 3.8+
   - Node.js 18+
   - Git

4. **Revisa los logs**: Los logs de error pueden contener información útil para diagnosticar el problema.

## 🐛 Reportar un Bug

Si encuentras un bug, por favor:

1. **Usa la plantilla de bug report**: Ve a [Issues](https://github.com/miguelnexs/localix/issues) y selecciona "Bug report".

2. **Proporciona información detallada**:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Capturas de pantalla si es aplicable
   - Información del sistema (OS, versiones, etc.)

3. **Incluye logs de error**: Copia y pega cualquier mensaje de error que veas.

## 💡 Solicitar una Nueva Característica

Si tienes una idea para una nueva característica:

1. **Usa la plantilla de feature request**: Ve a [Issues](https://github.com/miguelnexs/localix/issues) y selecciona "Feature request".

2. **Describe la característica**: Explica qué quieres que haga y por qué sería útil.

3. **Considera alternativas**: ¿Hay alguna forma de lograr lo que necesitas con las características existentes?

## 📚 Recursos de Ayuda

### Documentación
- [README](README.md) - Información general del proyecto
- [Wiki](https://github.com/miguelnexs/localix/wiki) - Documentación detallada
- [Guías de instalación](README.md#instalación) - Cómo configurar el proyecto

### Comunidad
- [Discusiones](https://github.com/miguelnexs/localix/discussions) - Preguntas generales y discusiones
- [Issues](https://github.com/miguelnexs/localix/issues) - Bugs y solicitudes de características

### Herramientas de Desarrollo
- [GitHub Actions](https://github.com/miguelnexs/localix/actions) - Estado de los tests
- [Security Advisories](https://github.com/miguelnexs/localix/security/advisories) - Vulnerabilidades de seguridad

## 🔧 Problemas Comunes

### Error de instalación de dependencias
```bash
# Backend
cd Localix-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd Localix-dashboard
npm install
```

### Error de conexión al backend
- Verifica que el servidor Django esté ejecutándose en el puerto 8000
- Revisa la configuración de CORS en el backend
- Verifica que no haya firewall bloqueando la conexión

### Error de Electron
- Asegúrate de tener Node.js 18+ instalado
- Limpia la caché: `npm run clean`
- Reinstala las dependencias: `rm -rf node_modules && npm install`

### Error de base de datos
- Verifica que las migraciones estén aplicadas: `python manage.py migrate`
- Revisa la configuración de la base de datos en `settings.py`
- Verifica que tengas permisos de escritura en el directorio

## 📞 Contacto Directo

Si necesitas ayuda urgente o tienes preguntas específicas:

- **Email**: miguel@example.com
- **LinkedIn**: [Miguel Núñez](https://linkedin.com/in/miguelnexs)
- **GitHub**: [@miguelnexs](https://github.com/miguelnexs)

## ⏰ Tiempos de Respuesta

- **Issues críticos**: 24-48 horas
- **Bugs normales**: 3-5 días
- **Feature requests**: 1-2 semanas
- **Preguntas generales**: 1-3 días

## 🤝 Contribuir

¿Quieres ayudar a mejorar Localix?

1. **Fork el repositorio**
2. **Crea una rama** para tu feature
3. **Haz tus cambios**
4. **Ejecuta los tests**
5. **Crea un Pull Request**

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

## 🙏 Agradecimientos

Gracias por usar Localix y por tu paciencia mientras resolvemos cualquier problema que encuentres. Tu feedback nos ayuda a mejorar el proyecto para todos.

---

**¡Juntos hacemos Localix mejor!** 🚀
