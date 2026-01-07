import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";

interface PageProps {
    params: Promise<{
        workflowid: string;
    }>
};


const Page = async ({ params }: PageProps) => {
    await requireAuth();
    const { workflowid } = await params;
    await prefetchWorkflow(workflowid);

    return (
        <HydrateClient>
            <ErrorBoundary fallback={<EditorError />}>
                <Suspense fallback={<EditorLoading />}>
                    <EditorHeader workflowId={workflowid} />
                    <main className="flex-1">
                        <Editor workflowId={workflowid} />
                    </main>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    )
}
export default Page;