import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { Button, Form, Group, Input, Modal, SearchSelect } from ".."
import db from "~/db"
import { image } from "~/db/schema"
import { getImages } from "~/lib/flickr"

export default async function Image({ searchParams }: SearchParams) {
  const images = await getImages()

  const defaultImage = searchParams.id
    ? (
        await db
          .select()
          .from(image)
          .where(eq(image.id, parseInt(searchParams.id)))
      )[0]
    : null

  const defaultImages = defaultImage
    ? {
        image: images.find(img => img.url === defaultImage?.imageUrl),
        annotation: images.find(img => img.url === defaultImage?.annotationUrl),
        thumbnail: images.find(img => img.url === defaultImage?.thumbnailUrl),
      }
    : null

  async function create({
    imageUrl,
    annotationUrl,
    thumbnailUrl,
    ...formData
  }: Record<string, unknown>) {
    "use server"

    // @ts-expect-error
    await db.insert(image).values({
      ...formData,
      // @ts-expect-error
      imageUrl: imageUrl.url,
      // @ts-expect-error
      annotationUrl: annotationUrl.url,
      // @ts-expect-error
      thumbnailUrl: thumbnailUrl.url,
    })

    revalidatePath("/dashboard")
  }

  async function update(formData: Record<string, unknown>) {
    "use server"

    await db
      .update(image)
      .set(formData)
      .where(eq(image.id, defaultImage?.id || 0))

    revalidatePath("/dashboard")
  }

  async function remove() {
    "use server"

    await db.delete(image).where(eq(image.id, defaultImage?.id || 0))

    revalidatePath("/dashboard")
  }

  return (
    <Form action={defaultImage ? update : create}>
      <Input label="Name" name="name" defaultValue={defaultImage?.name} />
      <SearchSelect
        label="Image"
        options={images}
        name="imageUrl"
        defaultValue={defaultImages?.image}
      />
      <Input label="Optic" name="optic" defaultValue={defaultImage?.optic} />
      <Input label="Camera" name="camera" defaultValue={defaultImage?.camera} />
      <Input label="Mount" name="mount" defaultValue={defaultImage?.mount} />
      <Input
        label="Filters"
        name="filters"
        defaultValue={defaultImage?.filters}
      />
      <Input
        label="Date"
        name="date"
        type="date"
        defaultValue={defaultImage?.date.toString()}
      />
      <Input label="SQML" name="sqml" defaultValue={defaultImage?.sqml} />
      <Input
        label="Exposure Details"
        name="exposureDetails"
        defaultValue={defaultImage?.exposureDetails}
      />
      <Input
        label="Acquisition"
        name="acquisition"
        defaultValue={defaultImage?.acquisition}
      />
      <Input
        label="Processing"
        name="processing"
        defaultValue={defaultImage?.processing}
      />
      <Input
        label="Info"
        name="info"
        type="textarea"
        defaultValue={defaultImage?.info}
      />
      <SearchSelect
        label="Annotation"
        options={images}
        name="annotationUrl"
        defaultValue={defaultImages?.annotation}
      />
      <SearchSelect
        label="Thumbnail"
        options={images}
        name="thumbnailUrl"
        defaultValue={defaultImages?.thumbnail}
      />
      <Group>
        {defaultImage && (
          <Modal
            title="Confirm Delete"
            trigger={
              <Button className="flex-1" variant="destructive">
                Delete
              </Button>
            }
          >
            <form className="flex flex-col gap-4">
              <span className="text-lg">
                Are you sure you want to delete <b>{defaultImage.name}</b>?
              </span>
              <Button formAction={remove} type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </Modal>
        )}
        <Button type="submit">{defaultImage ? "Update" : "Create"}</Button>
      </Group>
    </Form>
  )
}
