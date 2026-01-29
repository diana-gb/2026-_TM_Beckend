import Channels from "../models/channels.model.js";

class ChannelRepository{

    async create (workspace_id, name){
        return await Channels.create({title: name, fk_id_workspace: workspace_id})
    }

    async getAllByWorkspaceId(workspace_id) {
        return await Channels.find({fk_id_workspace: workspace_id})
    }

    async getByIdAndWorkspaceId(channel_id, workspace_id){
        return await Channels.findOne({_id: channel_id, fk_id_workspace: workspace_id})
    }
}

const  channelRepository = new ChannelRepository ()

export {channelRepository}