import { InferSelectModel, relations } from "drizzle-orm";
import { text, timestamp, pgTable, pgEnum, uuid, varchar, primaryKey, bigint, boolean } from "drizzle-orm/pg-core";


export const memberRole  = pgEnum('role', ['admin', 'moderator', 'guest'])
export const channelTypes = pgEnum('type', ['text', 'voice', 'video'])

export enum channelTypesEnum {
  TEXT = 'text',
  VOICE = 'voice',
  VIDEO = 'video'
}


//******************************Scheams********************************//

export const Profile = pgTable('profile', {

  id:                 uuid('id').defaultRandom().unique().primaryKey().notNull(),
  clerk_user_id:      varchar('clerk_user_id', { length: 128 }).unique().notNull(),
  username:           varchar('username', { length: 32 }).unique().notNull(),
  name:               varchar('name', { length: 128 }).notNull(),
  email:              varchar('email', { length: 128 }).notNull(),
  phone:              varchar('phone', { length: 13 }).unique(),
  avatar:             text('avatar').default('https://i.ibb.co/GQ8CTsZ/1aa7e647b894e219e42cc079d8e54e18.jpg'),


  created_at: timestamp('created_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),

  updated_at: timestamp('updated_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),

})


export const Server = pgTable('server', {

  id:                  uuid('id').defaultRandom().unique().primaryKey().notNull(),
  name:                text('name').notNull(),
  avatar:              text('avatar'),
  invitation_code:     text('inviteCode').unique().notNull(),
  creator_profile_id:  uuid('creator_profile_id').notNull().references(() => Profile.id, { onDelete: 'cascade' }),

  created_at: timestamp('created_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),
  
  updated_at: timestamp('updated_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),

})

export const Member = pgTable('member', {
  
  id:                     uuid('id').defaultRandom().unique().notNull(),
  role:                   memberRole('role').notNull(),
  nickname:               varchar('nickname', { length: 64 }),
  server_avatar:          text('server_avatar'),
  server_id:              uuid('server_id').notNull().references(() => Server.id),
  profile_id:             uuid('profile_id').notNull().references(() => Profile.id),  

  created_at: timestamp('created_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),
  
  updated_at: timestamp('updated_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),
  
}, 
(t) =>({
  pk: primaryKey({ columns: [ t.id, t.server_id, t.profile_id] })
}))


export const Category = pgTable('category', {
  
  id:                 uuid('id').defaultRandom().unique().notNull(),
  creator_member_id:  uuid('creator_member_id').notNull().references(() => Member.id, { onDelete: 'cascade' }),
  server_id:          uuid('server_id').notNull().references(() => Server.id, { onDelete: 'cascade' }),
  name:               varchar('name', { length: 64 }).notNull(),
  description:        text('description'),

}, (t) => ({
  pk: primaryKey({ columns: [ t.id, t.server_id, t.creator_member_id] })
}));




export const Channel = pgTable('channel', {

  id:                  uuid('id').defaultRandom().unique().primaryKey().notNull(),
  name:                varchar('name', { length: 64 }).notNull(),
  server_id:           uuid('server_id').notNull().references(() => Server.id, { onDelete: 'cascade' }),
  category_id:         uuid('category_id').notNull().references(() => Category.id, { onDelete: 'cascade' }),
  creator_member_id:   uuid('creator_member_id').notNull().references(() => Member.id, { onDelete: 'cascade' }),
  channel_type:        channelTypes('channel_type').notNull(),
  is_private:          boolean('is_private').default(false).notNull(),
  
  created_at: timestamp('created_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),
  
  updated_at: timestamp('updated_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),
  
})



export const memberToChannel = pgTable('member_to_channel', {
  
  id:               uuid('id').defaultRandom().notNull(),
  channel_id:       uuid('channel_id').notNull().references(() => Channel.id, { onDelete: 'cascade' }),
  member_id:        uuid('member_id').notNull().references(() => Member.id, { onDelete: 'cascade' }),
  
}, (t) => ({
  pk: primaryKey({ columns: [ t.id, t.channel_id, t.member_id] })
  
}))

export const Message = pgTable('message', {

  id:                  uuid('id').defaultRandom().unique().primaryKey().notNull(),
  sender_member_id:    uuid('sender_member_id').notNull().references(() => Member.id, { onDelete: 'cascade' }),
  channel_id:          uuid('channel_id').notNull().references(() => Channel.id, { onDelete: 'cascade' }),
  content:             text('content'),
  file_url:            text('file_url'),
  deleted:             boolean('deleted').default(false).notNull(),

  created_at:  timestamp('created_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),

  updated_at:  timestamp('updated_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),

})



//*******************************Relations**********************************//

export const profileRelations = relations(Profile, ({ many }) => ({
  members: many(Member),
}))


export const serverRelations = relations(Server, ({ many }) => ({
  members: many(Member),
  channels: many(Channel),
  categories: many(Category)
}))


export const membersRelation = relations(Member, ({ one, many }) => ({
  
  profile: one(Profile, {
    fields: [Member.profile_id],
    references: [Profile.id],
  }),
  
  server: one(Server, {
    fields: [Member.server_id],
    references: [Server.id],
  }),
  
  channels: many(memberToChannel),
  messages: many(Message),
}))

export const categoryRelations = relations(Category, ({ one, many }) => ({
  
  server: one(Server, {
    fields: [Category.server_id],
    references: [Server.id],
  }),
  
  creator: one(Member, {
    fields: [Category.creator_member_id],
    references: [Member.id],
  }),
  
  channels: many(Channel)
  
}))


export const channelRelations = relations(Channel, ({ one, many }) => ({
  server: one(Server, {
    fields: [Channel.server_id],
    references: [Server.id],
  }),
  
  category: one(Category, {
    fields: [Channel.category_id],
    references: [Category.id],
  }),
  
  members: many(memberToChannel),
  messages: many(Message),

}))


export const membersToChannelsRelation = relations(memberToChannel, ({ one }) => ({
  
  member: one(Member, {
    fields: [memberToChannel.member_id],
    references: [Member.id],
  }),
  
  channel: one(Channel, {
    fields: [memberToChannel.channel_id],
    references: [Channel.id],
  }),
  
}))


export const messageRelations = relations(Message, ({ one }) => ({

  sender: one(Member, {
    fields: [Message.sender_member_id],
    references: [Member.id],
  }),

  channel: one(Channel, {
    fields: [Message.channel_id],
    references: [Channel.id]
  })

}))


//********************************Types***************************************//

export type ProfileType         = InferSelectModel<typeof Profile>
export type ServerType          = InferSelectModel<typeof Server>
export type MemberType          = InferSelectModel<typeof Member>
export type CategoryType        = InferSelectModel<typeof Category>  
export type ChannelType         = InferSelectModel<typeof Channel>
export type MemberToChannelType = InferSelectModel<typeof memberToChannel>
export type MessageType         = InferSelectModel<typeof Message>