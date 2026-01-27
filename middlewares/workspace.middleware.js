/* 
Verifica que el usuario sea miembro del workspace
Verificar que el workspace exista
Verificar que el usuario tenga el rol correcto
*/

import { response } from "express"
import serverError from "../helpers/error.helper.js"
import workspaceRepository from "../repositoty/workspace.repository.js"

function workspaceMiddleware(authorized_roles = []){


return async function   (request, response, next){
    
    try{

                const user_id = request.user.user_id
                const workspace_id = request.params.workspace_id
            
                const workspace_selected = await workspaceRepository.getById(workspace_id)
            
                if(!workspace_selected){
                    throw new serverError ('No existe ese espacio de trabajo', 404)
                }
            
                // Para saber si es miembro
                const member_selected = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace_id, user_id)
            
                if(!member_selected){
                    throw new serverError('No eres miembro de este espacio de trabajo', 403)
                }
            
                //Gestionamos acceso por rol
            if(authorized_roles.length > 0 && !authorized_roles.includes(member_selected.role)){
                throw new serverError('No estas autorizado para realizar esta operacion', 403)
            }
        
            request.workspace = workspace_selected
            request.member = member_selected
            next()
            
        }

    catch(error){
        if(error.status){ // en caso de que el error tenga status
            return response.json({
                status: error.status,
                ok: false,
                message: error.message,
                data: null
            })
        }
        
        // Si no tiene status
        return response.jsonp({
            ok: false,
            status: 500,
            message: 'Error interno del servidor',
            data: null
        })
    }
}
}

export default workspaceMiddleware