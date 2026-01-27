import ENVIRONMENT from "../config/environment.config.js"
import mail_transporter from "../config/mail.config.js"
import serverError from "../helpers/error.helper.js"
import userRepository from "../repositoty/user.repository.js"
import workspaceRepository from "../repositoty/workspace.repository.js"
import jwt from "jsonwebtoken"
class WorkspaceController {
    async getWorkspaces (request, response) {
        
        //Para obtener los epacios asociados a ese usuario
        console.log('El usuario ingresado es:', request.user)
        const user_id = request.user.id
        const workspaces = await workspaceRepository.getWorkspacesByUserId(user_id)
        response.json({
            ok:true,
            data: {
                workspaces
            }
        })
    }

    async create(request, response){
        const {title, image, description } = request.body
        const user_id = request.user.id
        const workspace = await workspaceRepository.create(user_id, title, image, description)
        await workspaceRepository.addMember(workspace._id, user_id, 'Owner')
        response.json({
            ok: true,
            data: {
                workspace
            }
        })
    }

    async delete(request, response) {
        try{
            const user_id = request.user.id
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
        async addMemberRequest(request, response){
            try{
                const {email, role} = request.body
                const  workspace = request.workspace

                const user_to_invite = await userRepository.buscarUnoPorEmail(email)
                if(!user_to_invite){
                    throw new serverError('El mail del invitado no existe', 404)
                }

                //de quien debe ser valido el rol? del que quiere enviar la invitacion?
/*                     if(!authorized_roles.includes(role)){
                        throw new serverError('No estas autorizado para realizar esta accion', 403)
                    } */

                const already_member = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace._id, user_to_invite._id)

                if(already_member){
                    throw new serverError('El usuario ya es miembro de este espacio de trabajo', 400)
                }

            const token = jwt.sign(
                    {
                        id: user_to_invite._id,
                        email,
                        workspace: workspace._id,
                        role
                    },
                    ENVIRONMENT.JWT_SECRET_KEY
                )

                await mail_transporter.sendMail(
                    {
                        to: email,
                        from: ENVIRONMENT.GMAIL,
                        subject: `Te han invitado al espacio de trabajo:  ${workspace.title}`,
                        html: `
                            <h1> Has sido invitado a participar en el espacio de trabajo: ${workspace.title}</h1>
                            <p> Si no conoces esta invitacion desestima este mail</p>
                            <br>
                            <a 
                            href='${ENVIRONMENT.URL_BACKEND}/api/workspace/${workspace._id}/members/accept-invitation?invitation_token=${token}'
                            >Aceptar Invitacion </a>
                        `
                    }
                )

                return response.json(
                    {
                    status: 201,
                    ok: true,
                    message: 'Tu invitacion fue enviada',
                    data: null
                }
            )

            }
            catch(error){

                if(error.status){
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
                    message: 'Error interno del servidor',
                    data: null
                })
        }
    }

    async acceptInvitation (request, response){
        try{
            const {invitation_token} = request.query
            const payload = jwt.verify(invitation_token, ENVIRONMENT.JWT_SECRET_KEY)
            const {id, workspace: workspace_id, role} = payload
            await workspaceRepository.addMember(workspace_id, id, role)

            response.redirect(`${ENVIRONMENT.URL_FRONTEND}/`)
        }
        
        catch(error){
            if (error.status){
                return response.json(
                    {
                        status: error.status,
                        ok: false,
                        message: error.message,
                        data: null
                    }
                )
            }

            return response.json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor',
                    data: null
                }
            )
        }
    }

    async getById (request, response){
        try{

            const {workspace, member} = request
            response.json(
                {
                ok: true,
                status: 200,
                data: {
                    workspace,
                    member
                }
            }
        )
        }
    
        catch (error){
            
            if(error.status){
                return response.json (
                    {
                        status: error.status,
                        ok: false,
                        message: error.message,
                        data: null
                    }
                )
            }
            return response.json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor',
                    data: null
                }
            )
        }
    }
}

const workspaceController = new WorkspaceController()

export default workspaceController