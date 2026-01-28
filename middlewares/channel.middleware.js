async function channelMiddleware (request, response, next) {
    try{
        const {workspace_id, channel_id} = request.params

        const channel_serch = await channelRepository.getAll
    }
    catch{
        
    }
}