import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
    {
        fk_id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        active: {
            type: Boolean,
            default: true
        }
    }
)

const Channels = mongoose.model('Channels', ChannelSchema)

export default Channels