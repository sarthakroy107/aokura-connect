import { formatDate } from "./date-formater"


export const transformMessageData = (data: TChatMessageData) => {

  return {
    text_content: data.content,
    file_url: data.file_url,
    sender: {
      member_id: data.sender.id,
      role: data.sender.role,
      name: data.sender.nickname ? data.sender.nickname : data.sender.profile.name,
      avatar: data.sender.server_avatar ? data.sender.server_avatar : data.sender.profile.avatar,
    },
    created_at: formatDate(data.created_at),
    updated_at: formatDate(data.updated_at),
    deleted: data.deleted,
  }

}