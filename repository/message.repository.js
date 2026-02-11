import ChannelMessages from "../models/ChannelMessages.model.js";

class MessageRepository {
    async create(channel_id, member_id, content) {

        return await ChannelMessages.create(
            {
                fk_id_member: member_id,
                message: content,
                fk_id_channel: channel_id
            }
        )
    }

    async getAllByChannelId(channel_id) {
        const messages = await ChannelMessages.find({ fk_id_channel: channel_id })
            .populate(
                {
                    path: 'fk_id_member',
                    select: 'role fk_id_user',
                    populate: {
                        path: 'fk_id_user',
                        select: 'username email'
                    }
                }
            )
        return messages
    }

    //Populate es un metodo de expancion y solo funciona HACIA las REFERENCIAS
}

const messageRepository = new MessageRepository()

export default messageRepository