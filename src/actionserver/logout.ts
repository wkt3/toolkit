"use server"
import { signOut } from "@/auth"


const logOut = async () => {
  //some server stuff  before logging out
 await signOut()
}

export default logOut