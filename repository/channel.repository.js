import Channels from "../models/channels.model.js";

class ChannelRepository {

    async create(workspace_id, name) {
        const newChannel = await Channels.create({ title: name, fk_id_workspace: workspace_id })
        return [newChannel].map(({ _id, title, fk_id_workspace, created_at, active }) => ({
            id: _id,
            name: title,
            workspaceId: fk_id_workspace,
            createdAt: created_at,
            active: active
        }))[0]
    }

    async getAllByWorkspaceId(workspace_id) {
        const channels = await Channels.find({ fk_id_workspace: workspace_id })
        return channels.map(({ _id, title, fk_id_workspace, created_at, active }) => ({
            id: _id,
            name: title,
            workspaceId: fk_id_workspace,
            createdAt: created_at,
            active: active
        }))
    }

    async getByIdAndWorkspaceId(channel_id, workspace_id) {
        const channel = await Channels.findOne({ _id: channel_id, fk_id_workspace: workspace_id })

        if (!channel) return null


        return {
            id: channel._id,
            name: channel.title,
            workspaceId: channel.fk_id_workspace,
            createdAt: channel.created_at,
            active: channel.active

        }

    }


}

const channelRepository = new ChannelRepository()

export { channelRepository }