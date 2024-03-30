import { currentUser } from "@clerk/nextjs";
import { toast } from "sonner";

export const handleUser = async () => {
    try {
        const user = await currentUser()
        console.log(user)
        return user;
    } catch (error) {
        toast.error(error.message)
    }
}