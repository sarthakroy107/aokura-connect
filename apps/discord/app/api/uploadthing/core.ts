import { createUploadthing, FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
  return { userId: 'sarthak' };
}

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: '16MB', maxFileCount: 1 } }).middleware(() => handleAuth()).onUploadComplete(() => { }),
  messageFile: f(['image', 'audio', 'pdf']).middleware(() => handleAuth()).onUploadComplete(() => { }),
  profileImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } }).middleware(() => handleAuth()).onUploadComplete(() => { }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;