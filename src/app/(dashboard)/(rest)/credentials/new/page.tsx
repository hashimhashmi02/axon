import { CredentialForm } from "@/features/credentials/components/credential";
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
    await requireAuth();
    return (
        <div className="p-4 md:px-10 mdpy-6 h-full">
            <div className="mx-auto max-w-screen-md-full flex flex-col h-full gap-y-8">
                <CredentialForm />

            </div>
        </div>
    )
};
export default Page;