import { Modal } from "~/components"

async function action(formData: FormData) {
  "use server"

  console.log(formData)
}

export default function TableModal() {
  return (
    <Modal title="Table">
      <form action={action}>
        <input type="text" name="Name" placeholder="Name" />
        <input type="submit" value="Submit" />
      </form>
    </Modal>
  )
}
