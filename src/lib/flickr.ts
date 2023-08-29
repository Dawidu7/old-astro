"use server"

import axios from "axios"

function getURL(method: string, params?: Record<string, string>) {
  return `https://www.flickr.com/services/rest?${new URLSearchParams({
    api_key: process.env.FLICKR_API_KEY!,
    format: "json",
    method: `flickr.photos.${method}`,
    nojsoncallback: "1",
    ...params,
  })}`
}

export async function getImages() {
  const { data } = await axios.get(
    getURL("search", { user_id: process.env.FLICKR_USER_ID! }),
  )

  const images = await Promise.all(
    data.photos.photo.map(async (image: any) => {
      const { data } = await axios.get(
        getURL("getSizes", { photo_id: image.id }),
      )

      const { source, width, height } = data.sizes.size.filter(
        ({ label }: { label: string }) => label === "Original",
      )[0]

      return {
        url: source,
        name: image.title,
        width,
        height,
      }
    }),
  )

  return images
}
