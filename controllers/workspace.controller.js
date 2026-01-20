import serverError from "../helpers/error.helper"
import workspaceRepository from "../repositoty/workspace.repository"

class WorkspaceController {
    async getWorkspaces (request, response) {
        //Quiero obtener los epacios asociados a ese usuario
        console.log('El usuario es', request.user)
        const user_id = request.user.user_id
        const workspaces = await workspaceRepository.getWorkspacesByUser(user_id)
        response.json({
            ok:true,
            data: {
                workspaces
            }
        })
    }

    async delete(request, response) {
        try{
            const user_id = request.user_id
            const {workspace_id} = request.params

            const workspace_selected = await workspaceRepository.getById(workspace_id)
            if(!workspace_selected){
                throw new serverError ('No existe ese espacio de trabajo', 404)
            }
            const member_info = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace_id, user_id)
            if (member_info.role !== 'Owner'){
                throw new serverError ('No tienes permitido eliminar este espacio de trabajo', 403)
            }
            await workspaceRepository.delete(workspace_id)
            response.json({
                ok: true,
                message: 'Espacio de trabajo eliminado correctamente',
                data: null,
                status: 200     
            })
        }
        catch (error){
            /* Si tiene status decimos que es un error controlado (osea es esperable) */
            if (error.status) {
                return response.json({
                    status: error.status,
                    ok: false,
                    message: error.message,
                    data: null
                })
            }
                return response.json({
                ok: false,
                status: 500,
                message: "Error interno del servidor",
                data: null
            })  
        }
    }

}

const workspaceController = new WorkspaceController()

export default workspaceController