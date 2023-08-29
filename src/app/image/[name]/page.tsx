import { eq } from "drizzle-orm"
import Image from "next/image"
import { Box, Button, Modal, Separator } from "~/components"
import db from "~/db"
import { image as imageSchema } from "~/db/schema"
import { getImages } from "~/lib/flickr"

export default async function ImagePage({ params }: Params) {
  const image = (
    await db
      .select()
      .from(imageSchema)
      .where(eq(imageSchema.name, params.name.replace("-", " ")))
  )[0]

  if (!image) return "No image found."

  const flickrImage = ((await getImages()) || []).find(
    img => img.url === image.imageUrl,
  )
  const flickrAnnotation = ((await getImages()) || []).find(
    img => img.url === image.annotationUrl,
  )

  return (
    <div className="flex flex-col gap-4">
      <Box>
        <h2 className="text-center text-4xl font-semibold">{image.name}</h2>
      </Box>
      <Image
        className="rounded shadow-lg shadow-black"
        src={image.imageUrl}
        alt={image.name}
        width={flickrImage.width}
        height={flickrImage.height}
        priority
      />
      <Box className="flex gap-4">
        <div>
          {Object.entries(image)
            .splice(3, 9)
            .map(([name, value]) => (
              <div className="grid grid-cols-[15ch_auto] gap-2" key={name}>
                <span className="font-semibold capitalize">
                  {name.replace(/([A-Z])/g, " $1")}:{" "}
                </span>
                <span>
                  {value instanceof Date
                    ? new Date(value).toLocaleDateString()
                    : value}
                </span>
              </div>
            ))}
        </div>
        <Separator orientation="vertical" />
        <div className="space-y-4">
          <p className="text-justify">{image.info}</p>
          {/* @ts-expect-error */}
          <Modal
            full
            trigger={
              <Button plain>
                <Image
                  src={image.annotationUrl}
                  alt={image.name}
                  width={flickrAnnotation.width}
                  height={flickrAnnotation.height}
                />
              </Button>
            }
          >
            <Image
              src={image.annotationUrl}
              alt={image.name}
              width={flickrAnnotation.width}
              height={flickrAnnotation.height}
            />
          </Modal>
        </div>
      </Box>
    </div>
  )
}
