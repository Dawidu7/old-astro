import Image from "next/image"
import { Link } from "~/components"
import db from "~/db"
import { getImages } from "~/lib/flickr"

export default async function Home() {
  const images = await db.query.image.findMany()
  const flickrImages = await getImages()

  return (
    <div className="grid gap-4 grid-auto-fit-md">
      {images.map(image => (
        <Link
          className="relative overflow-hidden rounded-lg shadow-lg shadow-black data-[hovered]:scale-105"
          key={image.name}
          href={`/image/${image.name.replace(" ", "-")}`}
        >
          <Image
            className="aspect-square"
            src={image.imageUrl}
            alt={image.name}
            width={flickrImages.find(img => img.url === image.imageUrl).width}
            height={flickrImages.find(img => img.url === image.imageUrl).height}
            priority
            sizes="(max-width: 575px) 100vw, (max-width: 847px) 50vw, (max-width: 1119px) 33vw, (max-width: 1391px) 25vw, 17vw"
          />
        </Link>
      ))}
    </div>
  )
}
