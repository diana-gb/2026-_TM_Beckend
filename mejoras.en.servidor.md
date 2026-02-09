## Recomendaciones de mejora para el servidor

Api key propia: Tu servidor deberia tener su propia API KEY y los clientes deberian usarla al comunicarse con el servidor. Esta apikey suele cambiar cada cierto tiempo para que no sea vulnerable.

Esto puede escalar a API KEY por cliente Por ejemplo si desarrollas una API que trae datos del dolar blue los usuarios que quieran suscribirse a esta API podran obtener su propia API KEY

Middleware de errores 
Basicmente no manejar el error en cada consulta sino tener un middleware que maneje todos los errores

### Implementar un sistema de logs 
Que tu servidor informe en logs todos los eventos de consumo de la API 

 IMPORTANTES

    - Error
    - Info
    - Debug
    - Warn 

Esto puede escalar a logs en la DB, osea tener una tabla de logs encriptados

### Rate limit 
Limitar la cantidad de veces que un usuario puede hacer una peticion en un periodo de tiempo

### Whitelist / Blacklist por IP 
Whitelist: solo permitir peticiones de ciertas IPs 
Blacklist: denegar peticiones de ciertas IPs 
Esto se suele manejar en una tabla de whitelist o blacklist

Modificar la clave secreta con la que se firma los tokens depiendo de la tematica

- Auth: JWT
- Workspace: JWT


## Recomendaciones de temas para backend:

- Test Unitario
- Websocket
- Documentacion