import { InferSelectModel, relations } from "drizzle-orm";
import { text, timestamp, pgTable, pgEnum, uuid, varchar, primaryKey, boolean, AnyPgColumn, integer } from "drizzle-orm/pg-core";
import type { AdapterAccount } from '@auth/core/adapters'


export const memberRole  = pgEnum('role', ['admin', 'moderator', 'guest'])
export const channelTypes = pgEnum('type', ['text', 'voice', 'video'])

export enum channelTypesEnum {
  TEXT  = 'text',
  VOICE = 'voice',
  VIDEO = 'video'
}


//***************************Auth.js********************************//


export const users = pgTable("user", {
 id: text("id").notNull().primaryKey(),
 name: text("name"),
 email: text("email").notNull(),
 emailVerified: timestamp("emailVerified", { mode: "date" }),
 image: text("image"),
})

export const accounts = pgTable(
"account",
{
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccount["type"]>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
   id_token: text("id_token"),
  session_state: text("session_state"),
},
(account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}))

export const sessions = pgTable("session", {
 sessionToken: text("sessionToken").notNull().primaryKey(),
 userId: text("userId")
   .notNull()
   .references(() => users.id, { onDelete: "cascade" }),
 expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
 "verificationToken",
 {
   identifier: text("identifier").notNull(),
   token: text("token").notNull(),
   expires: timestamp("expires", { mode: "date" }).notNull(),
 },
 (vt) => ({
   compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 })
)

/*---------------------------------------------------------------------------------------------------------------*/


//******************************Scheams********************************//

export const Profile = pgTable('profile', {

  id:                       uuid('id').defaultRandom().primaryKey().notNull(),
  username:                 varchar('username', { length: 32 }).notNull(),
  name:                     varchar('name', { length: 128 }).notNull(),
  date_of_birth:            timestamp('date_of_birth', { withTimezone: true, mode: 'string' }).notNull(),
  email:                    varchar('email', { length: 128 }).notNull(),
  password:                 text('password').notNull(),
  is_email_verified:        boolean('email_verified').default(false).notNull(),
  phone:                    varchar('phone', { length: 13 }).unique(),
  avatar:                   text('avatar').default('https://i.ibb.co/GQ8CTsZ/1aa7e647b894e219e42cc079d8e54e18.jpg'),
  is_deleted:               boolean('deleted').default(false).notNull(),

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

  id:                    uuid('id').defaultRandom().primaryKey().notNull(),
  name:                  text('name').notNull(),
  avatar:                text('avatar').default('https://i.ibb.co/GQ8CTsZ/1aa7e647b894e219e42cc079d8e54e18.jpg'),
  description:           text('description').default(''),
  invitation_code:       text('inviteCode').unique(),
  creator_profile_id:    uuid('creator_profile_id').notNull().references(() => Profile.id, { onDelete: 'cascade' }),
  is_deleted:            boolean('deleted').default(false).notNull(),
  is_private:            boolean('is_private').default(false).notNull(),
  is_joining_allowed:    boolean('is_new_member_allowed').default(true).notNull(),

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
  is_banned:              boolean('is_banned').default(false).notNull(),
  is_muted:               boolean('is_muted').default(false).notNull(),
  is_kicked:              boolean('is_kicked').default(false).notNull(),
  is_left:                boolean('is_left').default(false).notNull(),

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

  created_at: timestamp('created_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),

  updated_at: timestamp('updated_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),

}, (t) => ({
  pk: primaryKey({ columns: [ t.id, t.server_id, t.creator_member_id] })
}));


export const Channel = pgTable('channel', {

  id:                  uuid('id').defaultRandom().primaryKey().notNull(),
  name:                varchar('name', { length: 64 }).notNull(),
  server_id:           uuid('server_id').notNull().references(() => Server.id, { onDelete: 'cascade' }),
  category_id:         uuid('category_id').notNull().references(() => Category.id, { onDelete: 'cascade' }),
  creator_member_id:   uuid('creator_member_id').notNull().references(() => Member.id, { onDelete: 'no action' }),
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

  created_at: timestamp('created_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),
  
}, (t) => ({
  pk: primaryKey({ columns: [ t.id, t.channel_id, t.member_id] })
  
}))


export const Message = pgTable('message', {

  id:                  uuid('id').defaultRandom().primaryKey().notNull(),
  sender_member_id:    uuid('sender_member_id').notNull().references(() => Member.id, { onDelete: 'no action' }),
  channel_id:          uuid('channel_id').notNull().references(() => Channel.id, { onDelete: 'cascade' }),
  content:             text('content'),
  file_url:            text('file_url'),
  is_deleted:          boolean('deleted').default(false).notNull(),
  in_reply_to:         uuid('in_reply_to').references((): AnyPgColumn => Message.id, { onDelete: 'no action' }),

  created_at:  timestamp('created_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),

  updated_at:  timestamp('updated_at', {
    withTimezone: true,
    mode: 'string'
  }).defaultNow().notNull(),

})

export const EmailActivationTokenTable = pgTable('email_activation_token', {
  token:           varchar('token', { length: 140 }).notNull().primaryKey(),
  profile_id:      uuid('profile_id').notNull().references(() => Profile.id, { onDelete: 'cascade' }),
  used:            boolean('used').default(false).notNull(),
  exipration_time: timestamp('expiration_time', { withTimezone: true, mode: 'string' }).notNull(),

  created_at: timestamp('created_at', {
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
  }),

  in_reply_to: one(Message, {
    fields: [Message.in_reply_to],
    references: [Message.id]
  })

}))

export const emailActivationTokenTableRelations = relations(EmailActivationTokenTable, ({ one }) => ({
  profile: one(Profile, {
    fields: [EmailActivationTokenTable.profile_id],
    references: [Profile.id]
  })
}))


//********************************Types***************************************//

export type TProfile                   = InferSelectModel<typeof Profile>
export type TServer                    = InferSelectModel<typeof Server>
export type TMember                    = InferSelectModel<typeof Member>
export type TCategory                  = InferSelectModel<typeof Category>  
export type TChannel                   = InferSelectModel<typeof Channel>
export type TMemberToChannel           = InferSelectModel<typeof memberToChannel>
export type TMessage                   = InferSelectModel<typeof Message>
export type TEmailActivationTokenTable = InferSelectModel<typeof EmailActivationTokenTable>