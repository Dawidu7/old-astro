"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "~/app/api/auth/[...nextauth]/config"

export async function isAuthenticated() {
  return !!(await getServerSession(authOptions))
}
