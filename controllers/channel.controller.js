import serverError from "../helpers/error.helper.js"
import { channelRepository } from "../repositoty/channel.repository.js"

class ChannelController {
    async getAllByWorkspaceId(request, response, next) {
        try {
            const { workspace_id } = request.params
            const channels = await channelRepository.getAllByWorkspaceId(workspace_id)
            response.json(
                {
                    status: 200,
                    ok: true,
                    message: 'Canales obtenidos: ',
                    data: {
                        channels
                    }
                }
            )
        }
        catch (error) {
            next(error)
        }
    }

    async create(request, response, next) {
        try {
            const { name } = request.body
            const { workspace_id } = request.params

            if (!name || name.trim() === '') {
                throw new serverError('El nombre ingresado no es valido', 400)
            }

            const channel_created = await channelRepository.create(workspace_id, name)
            response.json(
                {
                    status: 201,
                    ok: true,
                    message: 'Canal creado exitosamente',
                    data: {
                        channel_created
                    }
                }
            )
        }
        catch (error) {
            next(error)
        }
    }
}

const channelController = new ChannelController()
export { channelController }