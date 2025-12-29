import { requireAuth } from "@/lib/auth-utils";

const Page = async ()=>{
    await requireAuth();
    return (
        <p>Execution Page</p>
    )
}
export default Page;