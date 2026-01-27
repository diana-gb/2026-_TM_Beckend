import Channels from "../models/channels.model";

class ChannelRepository{

    async create (workspace_id, name){
        return await Channels.create({name: name, fk_id_workspace: workspace_id})
    }

    async getAllByWorkspaceId(workspace_id) {
        return await Channels.find({fk_id_workspace: workspace_id})
    }
}

const  channelRepository = new ChannelRepository ()

export {channelRepository}