import { GetStepTools, Inngest } from "inngest";

export type WorkflowContext = Record<string, unknown>;

export type StepTools = GetStepTools<Inngest.Any>;

export interface NodeExcutorParams<TData = Record<string, unknown>>{
    data: TData;
    nodeId: string;
    context: WorkflowContext;
    step: StepTools;
};


export type NodeExecutor<TData = Record<string, unknown>> = (
    params: NodeExcutorParams<TData>
)=> Promise<WorkflowContext>;