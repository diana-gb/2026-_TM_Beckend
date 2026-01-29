import messageRepository from "../repositoty/message.repository.js"

class MessagesController{
    async create (request, response){
        try{
            const {content} = request.body
            const member_id = request.member.member_id
            const {channel_id} = request.params
            await messageRepository.create(member_id, content, channel_id)

            return response.json(
                {
                    ok: true,
                    status: 201,
                    message: 'Mensaje creado'
                }
            )
        }
        catch(error){
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

    async getByChannelId (request, response){
        try{
            const {channel_id} = request.params
            
        }

        catch(error){
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

const messagesController = new MessagesController()
export default messagesController 