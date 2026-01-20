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

}

const workspaceController = new WorkspaceController()

export default workspaceController