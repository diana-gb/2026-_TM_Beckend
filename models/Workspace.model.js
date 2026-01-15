import mongoose from "mongoose";


/*
continuar con estos modelos:
    MemberWorkspace
    Channels
    ChannelMessages
 */
/* Terminar de crear el modelo */
const workspaceSchema = new mongoose.Schema(
    {
        fk_id_owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', //Aca marcamos la "relacion"
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        image: {
            type: Image,
            required: false
        },
        cretaed_at: {
            type: Date,
            default: Date.now
        },
        active: {
            type: Boolean,
            default: true
        }
    }
)

const Workspace = mongoose.model('Workspace', workspaceSchema)

export default Workspace