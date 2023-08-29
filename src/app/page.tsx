import { getImages } from "~/lib/flickr"

export default async function Home() {
  const images = await getImages()

  console.log(images)

  return "Home"
}
