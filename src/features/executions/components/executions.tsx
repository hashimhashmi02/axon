"use client"

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { ExecutionStatus } from "@/generated/prisma/enums";
import { Execution } from "@/generated/prisma/client";
import { CheckCheckIcon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";





export const ExecutionsList = () => {
    const executions = useSuspenseExecutions();

    return (
        <EntityList
            items={executions.data.items}
            getKey={(execution) => execution.id}
            renderItem={(execution) => <ExecutionItem data={execution} />}
            emptyView={<ExecutionsEmpty />}
        />
    )


};
export const ExecutionsHeader = () => {


    return (
        <EntityHeader
            title="Executions"
            description="View and manage your executions"


        />
    );
};


export const ExecutionsPagination = () => {
    const [params, setParams] = useExecutionsParams();
    const executions = useSuspenseExecutions();

    return (
        <EntityPagination
            disabled={executions.isFetching}
            page={executions.data.page}
            totalPages={executions.data.totalPages}
            onPageChange={(page) => setParams({ ...params, page })}

        />
    )
}

export const ExecutionsContainer = ({
    children,

}: {
    children: React.ReactNode
}) => {
    return (
        <EntityContainer
            header={<ExecutionsHeader />}
            pagination={<ExecutionsPagination />}
        >

            {children}
        </EntityContainer>
    )
};

export const ExecutionsLoading = () => {
    return <LoadingView message="Loading executions..." />
};

export const ExecutionsError = () => {
    return <ErrorView message="Error Loading executions..." />
};


export const ExecutionsEmpty = () => {
    const router = useRouter()

    const handleCreate = () => {
        router.push("/executions/new")
    }


    return (
        <EmptyView
            onNew={handleCreate}
            message="You haven't created any executions yet.Get started by creating a
                 execution"

        />


    )
};


const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCheckIcon className="size-5 text-green-600" />;
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600" />;
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
        default:
            return <ClockIcon className="size-5 text-muted-foreground" />
    }
}

const formatStatus = (status: ExecutionStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();

}



export const ExecutionItem = ({
    data,
}: {
    data: Execution & {
        workflow: {
            id: string;
            name: string;
        } | null
    }
}) => {
    const duration = data.completedAt
        ? Math.round(
            (new Date(data.completedAt).getTime() - new Date(data.statedAt).getTime()) / 1000
        )
        : null;

    const subtitle = (
        <>
            {data.workflow?.name ?? "Unknown Workflow"} &bull; Started{" "}
            <span suppressHydrationWarning>
                {formatDistanceToNow(data.statedAt, { addSuffix: true })}
            </span>
            {duration !== null && <> &bull; {duration}s</>}
        </>
    )

    return (
        <EntityItem
            href={`/executions/${data.id}`}
            title={formatStatus(data.status)}
            subtitle={subtitle}
            image={
                <div className="size-8 flex items-center justify-center">
                    {getStatusIcon(data.status)}
                </div>
            }

        />
    )
}


