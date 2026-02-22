import messageRepository from "../repository/message.repository.js"

class MessagesController {
    async create(request, response, next) {

        const { content } = request.body
        const member_id = request.member._id
        const {channel_id} = request.params



        await messageRepository.create(channel_id, member_id, content)
        return response.json(
            {
                ok: true,
                status: 201,
                message: 'Mensaje creado',
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