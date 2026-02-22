import MemberWorkspace from "../models/MemberWorkspace.model.js"

class MemberRepository {

    async getByUserAndWorkspace(user_id, workspace_id){
        return await MemberWorkspace.findOne({
    fk_id_user: user_id,
    fk_id_workspace: workspace_id
        })
    }
}

const memberRepository = new MemberRepository ()

export default memberRepository

