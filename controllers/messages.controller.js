import memberRepository from "../repository/member.repository.js"
import messageRepository from "../repository/message.repository.js"

class MessagesController {
    async create(request, response, next) {

        const { content } = request.body
        const user_id = request.user.id
        const channel = request.channel

        if(!content || !content.trim()){
            return response.json({
                ok: false,
                status: 400,
                message: 'Debe escribir un mensaje'                
            })
        }

        const member = await memberRepository.getByUserAndWorkspace(
            user_id,
            channel.fk_id_workspace
        )

        if(!member){
            return response.json(
                {
                ok: false,
                status: 403,
                message: 'No perteneces a este workspace'                
            }
        )
        }

        const newMessage = await messageRepository.create(channel._id, member._id, content)

        return response.json(
            {
                ok: true,
                status: 201,
                message: 'Mensaje creado',
                data: newMessage
            }
        )
    }

    async getByChannelId(request, response, next) {

        const { channel_id } = request.params
        const messages = await messageRepository.getAllByChannelId(channel_id)

        return response.json(
            {
                ok: true,
                status: 200,
                message: 'Mensajes obtenidos exitosamente',
                data: {
                    messages
                }
            }
        )
    }

}

const messagesController = new MessagesController()
export default messagesController 