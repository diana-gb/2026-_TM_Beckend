import serverError from "../helpers/error.helper.js"
import { channelRepository } from "../repository/channel.repository.js"

async function channelMiddleware(request, response, next) {

    try {

        const { workspace_id, channel_id } = request.params

        const channel_selected = await channelRepository.getByIdAndWorkspaceId(channel_id, workspace_id)

        if (!channel_selected) {
            throw new serverError('El canal ingresado no existe', 404)
        }

        request.channel = channel_selected

        next()
    }
    catch (error) {
        if (error.status) {
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

export default channelMiddleware