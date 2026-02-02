
## Descripcion del proyecto

El proyecto conciste en una aplicacion tipo Slack, usada para comunicacion interna de empresas, la misma esta formada por espacios de trabajo, organizados de la siguiente manera:
- Un espacio de tabajo puede tener muchos canales.
- Un canal pertenece a un espacio de trabajo.
- Un canal contiene muchos mensajes.
- Un mensaje pertenece a un canal.
Por otro lado:
- Solo los miembros del espacio de trabajo pueden acceder al canal.
- Un miembro puede enviar muchos mensajes.
- Un mensaje puede ser enviado solo por un miembro.

El usuario debe estar registrado, al hacer el registro se le envia un mail con un link para validar este registro, luego debe logearse para acceder a la lista de espacios de trabajo.

Un miembro puede invitar a otro usuario al canal siempre que cuente con autorizacion (segun el rol).



## Ejemplos de request

# Registro:
authRouter.post('/register', authController.register) 
Metodo: POST
URL: /auth/register
Body : {
    "email": "user@email.com",
    "password": "123456",
    "username": "username"
}

# Obtener canales de un workspace:
workspaceRouter.get('/:workspace_id/channels', authMiddleware, workspaceMiddleware(), channelController.getAllByWorkspaceId )
Metodo: GET
URL: /:workspace_id/channels - (request.params.workspace_id)
Headers: Authorization: Bearer-Token (auth_token) - (request.headers.authorization)

# Eliminar un espacio de trabajo:
workspaceRouter.delete('/:workspace_id', authMiddleware, workspaceController.delete)
Metodo: DELETE
URL: /workspaces/:workspace_id - (request.params (:workspace_id))
Headers: Authorization: Bearer-Token - (request.headers.authorization)
authMiddleware Validacion - request.user



## Coleccion de pruebas (Postman)

Crear una colección nueva.
Copiar request uasando método, URL, headers y body segun sea necesario:
     
     Obtener espacios de trabajo:
            Metodo: GET
            URL: http://localhost:8080/workspaces
            Headers: Authorization: Bearer Token (copiar y pegar auth_token obtenido con el login)
    
    Registro:
            Metodo: POST
            URL: http://localhost:8080/auth/register
            Body: {
                    "email": "user@email.com",
                    "password": "123456",
                    "username": "username"
                }

    Borrar espacio de trabajo:
                            Metodo: DELETE
                            URL: http://localhost:8080/workspaces/:workspace_id
                            Headers: Authorization: Bearer Token 

- Usar Login primero para obtener el JWT y pegarlo en los headers (Authorization - Bearer Token)
