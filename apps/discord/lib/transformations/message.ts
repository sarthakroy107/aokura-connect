import { formatDate } from "./date-formater"


export const transformMessageData = (data: TChatMessageData) => {

  return {

    text_content: data.content,
    file_url: data.file_url,
    is_deleted: data.is_deleted,

    sender: {
      member_id:     data.sender.id,
      role:          data.sender.role,
      name:          data.sender.nickname ?? data.sender.profile.name,
      avatar:        data.sender.server_avatar ?? data.sender.profile.avatar,
      is_banned:     data.sender.is_banned,
      is_muted:      data.sender.is_muted,
      is_kicked:     data.sender.is_kicked,
      is_deleted:    data.sender.is_left,
    },

    created_at: formatDate(data.created_at),
    updated_at: formatDate(data.updated_at),
  }

}