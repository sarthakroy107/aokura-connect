const images = [
  "https://i.postimg.cc/y8VQz4mD/chisato-nishikigi-by-garlesyfenix-dfl52qi-fullview.jpg",
  "https://i.postimg.cc/mg9TH9zx/714797.png",
  "https://i.postimg.cc/yWqb4DV9/371690.png",
  "https://i.postimg.cc/X7V2F6rn/thumb-440-1304509.webp",
  "https://static.wikia.nocookie.net/virtualyoutuber/images/1/1e/Pipkin_Pippa_-_Portrait.png/revision/latest?cb=20210729042840",
  "https://i.postimg.cc/gkkCpZqy/x-CTq8q-KTbs-O4.jpg",
  "https://i.postimg.cc/zv1RWNp5/image.jpg",
  "https://i.postimg.cc/8cVtCq6f/300px-Shigure-Ui-You-Tube-Profile-Picture.jpg",
  "https://hololist.net/wp-content/uploads/2022/08/himemiya-rie-portrait-66.jpg",
  "https://c4.wallpaperflare.com/wallpaper/327/160/884/anime-rascal-does-not-dream-of-bunny-girl-senpai-mai-sakurajima-hd-wallpaper-preview.jpg",
  "https://i.postimg.cc/Bbk72Mt2/image.jpg",
  "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/954d8711-ff58-4b7f-bb2f-d0af48f8a426/original=true/00067-2933994996.jpeg",
  "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4d9ced8f-e281-4ebb-c6d6-6368ab9f1200/original=true/00017-2796488911-(7th_anime_v3_C)-(Euler%20a)-cfg5-30stp-480x768.jpeg",
  "https://i.postimg.cc/VNPhvGbt/image.png",
  "https://i.postimg.cc/63XTHX4Q/image.png",
];

export const getAnimeGirlImage = () =>
  images[Math.floor(Math.random() * images.length)];
