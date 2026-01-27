import { CredentialView } from "@/features/credentials/components/credential";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { CredentialsLoading } from "@/features/credentials/components/credentials";
import { CredentialsError } from "@/features/credentials/components/credentials";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
    params: Promise<{
        credentialId: string;
    }>
};


const Page = async ({ params }: PageProps) => {
    await requireAuth();
    const { credentialId } = await params;
    prefetchCredential(credentialId);

    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-screen-md-full flex flex-col h-full gap-y-8">
                <HydrateClient>
                    <ErrorBoundary fallback={<CredentialsError />}>
                        <Suspense fallback={<CredentialsLoading />}>
                            <CredentialView credentialId={credentialId} />
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>
            </div>
        </div>
    )
}
export default Page;