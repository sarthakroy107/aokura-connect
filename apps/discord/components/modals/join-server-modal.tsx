"use client";

import { ModalEnum, useModal } from "@/lib/store/modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@ui/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import NormalInput from "../form/normal-input";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { memo, useState } from "react";
import Image from "next/image";
import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";

const constants: {
  id: number;
  image: string;
  name: string;
  description: string;
}[] = [
  {
    id: 1,
    image:
      "https://www.nautiljon.com/images/perso/00/79/nishikigi_chisato_21497.webp",
    name: "Mushoku Tensei",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cumque explicabo, nulla ratione unde eaque incidunt, soluta tempore odit ducimus dolore, numquam molestias fugiat laborum?",
  },
  {
    id: 2,
    image:
      "https://www.nautiljon.com/images/perso/00/79/nishikigi_chisato_21497.webp",
    name: "Re:Zero",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cumque explicabo, nulla ratione unde eaque incidunt, soluta tempore odit ducimus dolore, numquam molestias fugiat laborum?",
  },
  {
    id: 3,
    image:
      "https://www.nautiljon.com/images/perso/00/79/nishikigi_chisato_21497.webp",
    name: "Attack on Titan",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cumque explicabo, nulla ratione unde eaque incidunt, soluta tempore odit ducimus dolore, numquam molestias fugiat laborum?",
  },
  {
    id: 4,
    image:
      "https://www.nautiljon.com/images/perso/00/79/nishikigi_chisato_21497.webp",
    name: "Lycorus Recoil",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cumque explicabo, nulla ratione unde eaque incidunt, soluta tempore odit ducimus dolore, numquam molestias fugiat laborum?",
  },
  {
    id: 5,
    image:
      "https://www.nautiljon.com/images/perso/00/79/nishikigi_chisato_21497.webp",
    name: "Zombieland: Saga",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cumque explicabo, nulla ratione unde eaque incidunt, soluta tempore odit ducimus dolore, numquam molestias fugiat laborum?",
  },
  {
    id: 6,
    image:
      "https://www.nautiljon.com/images/perso/00/79/nishikigi_chisato_21497.webp",
    name: "A Silent Voice",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cumque explicabo, nulla ratione unde eaque incidunt, soluta tempore odit ducimus dolore, numquam molestias fugiat laborum?",
  },
  {
    id: 7,
    image:
      "https://www.nautiljon.com/images/perso/00/79/nishikigi_chisato_21497.webp",
    name: "Your Name",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cumque explicabo, nulla ratione unde eaque incidunt, soluta tempore odit ducimus dolore, numquam molestias fugiat laborum?",
  },
  {
    id: 8,
    image:
      "https://www.nautiljon.com/images/perso/00/79/nishikigi_chisato_21497.webp",
    name: "Kaguya-sama: Love is War",
    description: "One of the best romance anime",
  },
  {
    id: 9,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHN34jfLYsEyP8dYyDkUcZRHZ2BZIHzZ5bRA",
    name: "Onimai: I am your sister now!",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cumque explicabo, nulla ratione unde eaque incidunt, soluta tempore odit ducimus dolore, numquam molestias fugiat laborum?",
  },
  {
    id: 10,
    image:
      "https://cdn.oneesports.gg/cdn-data/2022/06/Anime_KonoSuba_Aqua-1024x576.jpg",
    name: "Konosuba: An Explosuion on this Wonderful World",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cumque explicabo, nulla ratione unde eaque incidunt, soluta tempore odit ducimus dolore, numquam molestias fugiat laborum?",
  },
  {
    id: 11,
    image:
      "https://cdn.myanimelist.net/images/about_me/ranking_items/16381528-fbccba11-3f08-4f7f-ba61-2f6b6c1faefc.jpg?t=1692912693",
    name: "Call of the Night",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cumque explicabo, nulla ratione unde eaque incidunt, soluta tempore odit ducimus dolore, numquam molestias fugiat laborum?",
  },
  {
    id: 12,
    image:
      "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p22812509_b_v13_ab.jpg",
    name: "Cyberpunk: Edgerunners",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cumque explicabo, nulla ratione unde eaque incidunt, soluta tempore odit ducimus dolore, numquam molestias fugiat laborum?",
  },
];

const JoinServerModal = () => {
  const { isOpen, type, onClose } = useModal();
  const isModalOpen = isOpen && type === ModalEnum.JOIN_SERVER;
  const { register, watch } = useForm<{ search: string }>();
  const search = watch("search");
  const [value] = useDebounce(search, 1000);

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-discord p-0 rounded-[3px]">
        <DialogHeader className="mt-5 text-2xl font-medium">
          Search server
        </DialogHeader>
        <DialogDescription className="text-center text-lg">
          Search public servers to join
        </DialogDescription>
        <form className="px-6">
          <NormalInput
            {...register("search", { required: true })}
            label="SERVER NAME"
            placeholder="Ex: Mushoku Tensei discussion"
            required={false}
          />
        </form>
        <ViewSearchResults data={constants} />
      </DialogContent>
    </Dialog>
  );
};

export default JoinServerModal;

const ViewSearchResults = memo(
  ({
    data,
  }: {
    data: { id: number; name: string; image: string; description: string }[];
  }) => {
    const [selectedServers, setSelectedServers] = useState<number[]>([]);
    return (
      <>
        <ScrollArea className="h-64 bg-discord_darkest mx-6 rounded-sm">
          {data.map((server, index) => (
            <div
              className="flex h-20 hover:bg-primary/75 border-b border-white/10 cursor-pointer"
              key={index}
              onClick={() =>
                selectedServers.includes(server.id)
                  ? setSelectedServers(
                      selectedServers.filter((id) => id !== server.id)
                    )
                  : setSelectedServers([...selectedServers, server.id])
              }
            >
              <div className="w-1/5 h-full flex items-center justify-center">
                <Image
                  src={server.image}
                  alt="server-image"
                  width={100}
                  height={100}
                  className="rounded-full object-cover w-16 h-16"
                />
              </div>
              <div className="w-[70%] h-full pt-2.5 font-medium">
                <h3>
                  {server.name.slice(0, 35)} {server.name.length > 35 && "..."}
                </h3>
                <p className="text-white/50 text-xs">
                  {server.description.slice(0, 101)}{" "}
                  {server.description.length >= 101 && "..."}
                </p>
              </div>
              <div className="w-[10%] h-full flex justify-center items-center">
                <div className="h-5 w-5 bg-discord_darkest border border-white/30 rounded-full flex justify-center items-center">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      selectedServers.includes(server.id) &&
                        "bg-primary"
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="bg-discord_darker w-full px-5 p-3.5 flex justify-between items-center">
          <p className="text-white/75">
            SERVER SELECTED: {selectedServers.length}
          </p>
          <Button
            disabled={selectedServers.length === 0}
            className=" rounded-[2px]"
          >
            {" "}
            Join
          </Button>
        </div>
      </>
    );
  }
);
