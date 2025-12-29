import { requireAuth } from "@/lib/auth-utils";

const Page = async ()=>{
    await requireAuth();
    return (
        <p>Credential Page</p>
    )
}
export default Page;