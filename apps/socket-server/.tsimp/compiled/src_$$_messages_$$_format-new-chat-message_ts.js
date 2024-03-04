import { formatDate } from "@repo/db/src/dto/messages/date-formater";
export const formateNewChatMessage = (data) => {
    formatDate(new Date().toISOString());
    return {
        id: crypto.randomUUID(),
        text_content: data.textMessage ?? "",
        file_url: data.fileUrl ?? "",
        is_deleted: false,
        channel_id: data.channelId,
        in_reply_to: null,
        sender: {
            nickname: data.senderMemberDetails.nickname,
            avatar: data.senderMemberDetails.avatar ?? "",
            id: data.senderMemberDetails.id,
            role: data.senderMemberDetails.role,
            is_banned: data.senderMemberDetails.is_banned,
            is_muted: data.senderMemberDetails.is_muted,
            is_kicked: data.senderMemberDetails.is_kicked,
            is_left: data.senderMemberDetails.is_left,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LW5ldy1jaGF0LW1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvc2FydGhhay9Db2RpbmcvcGVyc29uYWwtcHJvamVjdHMvZGlzY29yZC10dXJiby1vZy9hcHBzL3NvY2tldC1zZXJ2ZXIvIiwic291cmNlcyI6WyJzcmMvbWVzc2FnZXMvZm9ybWF0LW5ldy1jaGF0LW1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBRXJFLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLENBQ25DLElBQW9CLEVBQ0gsRUFBRTtJQUNuQixVQUFVLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFFO0lBQ3RDLE9BQU87UUFDTCxFQUFFLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRTtRQUN2QixZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFO1FBQ3BDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUU7UUFDNUIsVUFBVSxFQUFFLEtBQUs7UUFDakIsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTO1FBQzFCLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLE1BQU0sRUFBRTtZQUNOLFFBQVEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUTtZQUMzQyxNQUFNLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sSUFBSSxFQUFFO1lBQzdDLEVBQUUsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRTtZQUMvQixJQUFJLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUk7WUFDbkMsU0FBUyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTO1lBQzdDLFFBQVEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUTtZQUMzQyxTQUFTLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVM7WUFDN0MsT0FBTyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPO1NBQzFDO1FBQ0QsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO1FBQ3BDLFVBQVUsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtLQUNyQyxDQUFDO0FBQ0osQ0FBQyxDQUFDIn0=